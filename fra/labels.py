"""Flown OD + RWY18 usage labels from Umwelthaus INAA / FANOMOS radar tracks.

Source: https://inaa.umwelthaus.org/ (Fanomos/GetFlightTracks, one request per hour, KML in Web Mercator).
Low-altitude movement near FRA: track ~250° -> OD 25, ~070° -> OD 07, ~180° west of the field -> RWY 18 departure.
"""

import contextlib
import os
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
import pandas as pd
import requests

from fra.portable import lock_nowait, unlock

DATA = Path(__file__).resolve().parent.parent / "data"
CACHE = DATA / "inaa"
URL = "https://inaa.umwelthaus.org/Fanomos/GetFlightTracks"
R = 6378137.0
FRA_LAT, FRA_LON = 50.0333, 8.5706
MAX_ALT_FT = 3000   # altitudes are feet AMSL (field 364 ft): final approach / initial climb
MAX_DIST_KM = 15
PLACEMARK = re.compile(r"<name>(\d+)_TraceColor\d+</name>.*?<coordinates>([^<]+)</coordinates>", re.S)

# INAA etiquette: never more than INAA_MAX requests in flight from this machine. Every network request made through
# fetch_hour() (forward archive, live forecast, history backfill, ad-hoc scripts) and the prognosis backfill holds one
# of INAA_MAX flock()ed slot files while it runs, so all processes together stay within the limit. flock locks die
# with their process (no stale locks). Requests that bypass this (fra.prognosis.fetch/live, fra.archive's prognosis
# snapshot, ops.retrain) are sequential; fra.history keeps a lane free for them (see fra.history.Gate).
INAA_MAX = 3
INAA_SLOTS = DATA / "logs" / "inaa_slots"


def _acquire_slot(max_wait, poll):
    """fd holding an exclusive flock on a free slot file, or None if the lock directory is unusable."""
    t0 = time.monotonic()
    while True:
        for i in range(INAA_MAX):
            try:
                INAA_SLOTS.mkdir(parents=True, exist_ok=True)
                fd = os.open(INAA_SLOTS / f"slot{i}.lock", os.O_RDWR | os.O_CREAT, 0o644)
            except OSError:  # infrastructure problem: never block data collection on it
                return None
            try:
                lock_nowait(fd)
                return fd
            except OSError:  # slot taken
                os.close(fd)
        if time.monotonic() - t0 > max_wait:
            raise TimeoutError(f"no free INAA slot for {max_wait} s")
        time.sleep(poll)


@contextlib.contextmanager
def inaa_slot(max_wait=1800, poll=0.2):
    """Hold one of INAA_MAX cross-process slots for the duration of one INAA request (waits for a free one;
    TimeoutError after `max_wait` s). If the lock directory is unusable the request proceeds unthrottled."""
    fd = _acquire_slot(max_wait, poll)
    try:
        yield
    finally:
        if fd is not None:
            unlock(fd)
            os.close(fd)


def inaa_slots_busy():
    """Number of INAA slots currently held (by any process)."""
    busy = 0
    for i in range(INAA_MAX):
        try:
            fd = os.open(INAA_SLOTS / f"slot{i}.lock", os.O_RDWR | os.O_CREAT, 0o644)
        except OSError:
            continue
        try:
            lock_nowait(fd)
            unlock(fd)
        except OSError:
            busy += 1
        finally:
            os.close(fd)
    return busy


def fetch_hour(t: pd.Timestamp, cache=False, timeout=180, session=None, check=False) -> str:
    """KML for the hour ENDING at t (verified: window is [t-1h, t), UTC).

    Optional (defaults keep the original behaviour): `session` = requests.Session to reuse connections,
    `check=True` raises ValueError on a body that is not a complete KML document (truncated/error page).
    Network requests hold an INAA slot (inaa_slot) so that all processes together make <= INAA_MAX at once.
    """
    p = CACHE / f"{t:%Y%m%dT%H}.kml"
    if p.exists() and p.stat().st_size > 0:
        return p.read_text()
    with inaa_slot():
        r = (session or requests).get(URL, params={"startTime": f"{t:%Y%m%dT%H%M%S}", "timeIntervalInHours": 1},
                                      timeout=timeout)
        r.text  # body fully received while the slot is held
    r.raise_for_status()
    if check and "</kml>" not in r.text[-200:]:
        raise ValueError(f"incomplete KML ({len(r.text)} chars)")
    if cache:
        CACHE.mkdir(parents=True, exist_ok=True)
        p.write_text(r.text)
    return r.text


def _bearing(lat1, lon1, lat2, lon2):
    p1, p2, dl = np.radians(lat1), np.radians(lat2), np.radians(lon2 - lon1)
    y = np.sin(dl) * np.cos(p2)
    x = np.cos(p1) * np.sin(p2) - np.sin(p1) * np.cos(p2) * np.cos(dl)
    return (np.degrees(np.arctan2(y, x)) + 360) % 360


def parse(kml: str) -> dict:
    """{flight id: [segment arrays (n, 3): x, y in EPSG:3857 metres, altitude ft AMSL]} in document order."""
    segs = {}
    for fid, coords in PLACEMARK.findall(kml):
        a = np.array([c.split(",") for c in coords.split()], dtype=float)
        segs.setdefault(fid, []).append(a)
    return segs


def classify(kml: str):
    """Counts of low-level flights moving west / east / south(RWY18)."""
    return classify_segments(parse(kml))


def classify_segments(segs: dict):
    """classify() on already parsed segments (e.g. the compact raw cache of fra.history)."""
    west = east = south18 = 0
    for parts in segs.values():
        a = np.vstack(parts)
        lon = np.degrees(a[:, 0] / R)
        lat = np.degrees(2 * np.arctan(np.exp(a[:, 1] / R)) - np.pi / 2)
        dist = np.hypot((lat - FRA_LAT) * 111.2, (lon - FRA_LON) * 71.5)
        low = (a[:, 2] < MAX_ALT_FT) & (dist < MAX_DIST_KM)
        if low.sum() < 3:
            continue
        la, lo = lat[low], lon[low]
        # segments can arrive out of order: orient by the steepest movement within the low part
        brg = _bearing(la[:-1], lo[:-1], la[1:], lo[1:])
        step = np.hypot(np.diff(la) * 111.2, np.diff(lo) * 71.5)
        brg = brg[step > 0.05]
        if len(brg) < 2:
            continue
        b = np.degrees(np.angle(np.exp(1j * np.radians(brg)).mean())) % 360
        if abs(((b - 250) + 180) % 360 - 180) < 25:
            west += 1
        elif abs(((b - 70) + 180) % 360 - 180) < 25:
            east += 1
        elif abs(b - 180) < 25 and lo.mean() < 8.545 and la.max() > 49.98:
            south18 += 1
    return west, east, south18


def label_hour(t):
    """Counts for the hour STARTING at t - 1h (index = hour start)."""
    try:
        w, e, s = classify(fetch_hour(t))
        return {"time": t - pd.Timedelta(hours=1), "west": w, "east": e, "rwy18_deps": s}
    except Exception as ex:  # keep going; gaps are fine
        return {"time": t - pd.Timedelta(hours=1), "west": np.nan, "east": np.nan, "rwy18_deps": np.nan,
                "error": str(ex)[:100]}


COUNTS = DATA / "inaa_counts.csv"
HISTORY_COUNTS = DATA / "inaa_counts_history.csv"  # written by fra.history (2014 .. 2026-02-10 backfill)
_lock = threading.Lock()


def _read_counts(path):
    c = pd.read_csv(path, parse_dates=["time"]).dropna(subset=["west"])
    c["time"] = pd.to_datetime(c["time"], utc=True)
    return c


DAY_HOURS = range(3, 22)  # hour starts 03..21 UTC (window ends 04..22): every hour with traffic, both seasons
HISTORY_SUSPECT = DATA / "logs" / "history_suspect.json"  # fra.history: incomplete-looking responses + re-check

# Which 'confirmed' history hours are label gaps (2026-11-03, experiments/history12/suspects.py). fra.history re-fetches
# a daytime hour with < 10 movements or < 40 % of the same-day median and marks it 'confirmed' when the second answer
# is still low. INAA answers are reproducible (all 1,216 confirmed hours of the 2014-2026 backfill returned the
# identical count twice), so 'confirmed' means 'reproducibly low', not 'incomplete'. The same-day reference flags the
# normally quiet first hour after the night ban (06-07 local: median 40 movements vs. 63-102 in the other daytime
# hours of the forward file; 782 of the 1,216 hours, OD-selective: 62 % OD 25 vs. 67 % among the kept 06-local
# hours) and the 10-movement floor flags ordinary COVID traffic (April-June 2020: confirmed hours with a median of
# 7-8 movements, 0.7-0.8 times the same hour on the surrounding days).
#   "traffic"   (default) a confirmed hour stays a gap only if it is ALSO low against the same local hour of the
#               surrounding days: movements < GAP_REL x median(movements in the same local hour on the GAP_WIN_D days
#               before and after, same day excluded, >= GAP_MIN_REF of them; fewer -> stays a gap). Keeps strike days,
#               archive outages and other collapses out (191 hours), re-admits ordinary low-traffic hours (1,025).
#   "confirmed" every confirmed hour (the rule before 2026-11-03, and the rule of the PRE-REGISTERED wave-3 run:
#               "traffic" was coded after that run had printed its primary result, so wave-3 results under "traffic"
#               are a post-hoc sensitivity, experiments/history12/REPORT.md). Use it for RWY 18 judgements on the
#               history: in the re-admitted 06-local hours 'no RWY 18 departure' under OD 25 is 7x as frequent as in
#               the kept ones (4.0 % vs. 0.6 %; too few departures), so they are not used as RWY 18 labels
#               (history_labels() does this for every caller).
GAP_RULE = "traffic"
GAP_REL, GAP_WIN_D, GAP_MIN_REF = 0.4, 7, 5


def same_hour_reference(counts, times, win_d=GAP_WIN_D, min_ref=GAP_MIN_REF):
    """Median classified movements (west + east + RWY 18) in the same local hour on the `win_d` days before and after
    each hour start in `times` (same day excluded); NaN with fewer than `min_ref` such hours. Label cleaning only."""
    n = (counts["west"] + counts["east"] + counts["rwy18_deps"]).astype(float)
    loc = n.index.tz_convert("Europe/Berlin")
    day = loc.normalize().tz_localize(None)
    P = pd.Series(n.to_numpy(), index=pd.MultiIndex.from_arrays([day, loc.hour])).groupby(level=[0, 1]).first()
    P = P.unstack().reindex(pd.date_range(day.min(), day.max(), freq="D"), columns=range(24))
    A, row = P.to_numpy(float), {d: i for i, d in enumerate(P.index)}
    tl = pd.DatetimeIndex(times).tz_convert("Europe/Berlin")
    out = np.full(len(tl), np.nan)
    for k, (d, h) in enumerate(zip(tl.normalize().tz_localize(None), tl.hour)):
        i = row.get(d)
        if i is None:
            continue
        nb = np.r_[A[max(0, i - win_d):i, h], A[i + 1:i + 1 + win_d, h]]
        nb = nb[np.isfinite(nb)]
        if len(nb) >= min_ref:
            out[k] = np.median(nb)
    return out


def _confirmed_suspects():
    import json
    try:
        s = json.loads(HISTORY_SUSPECT.read_text())
    except (OSError, ValueError):
        s = {}
    return pd.DatetimeIndex(sorted(pd.Timestamp(k) - pd.Timedelta(hours=1) for k, v in s.items()
                                   if v.get("status") == "confirmed"), name="time")


def history_gaps(rule=None):
    """Hour starts (UTC) of history hours that are label gaps (excluded by load_counts(include_history=True)).
    rule "confirmed": every hour whose radar response looked incomplete on two fetches >= 30 min apart (fra.history
    status 'confirmed'); "traffic" (default, GAP_RULE): only those of them that are also low against the same local
    hour of the surrounding days (source data gap or real traffic collapse such as the 2025-03-10 strike), see
    GAP_RULE above."""
    rule = rule or GAP_RULE
    conf = _confirmed_suspects()
    if rule == "confirmed" or not len(conf):
        return conf
    if rule != "traffic":
        raise ValueError(f"rule={rule!r}")
    files = [p for p in (HISTORY_COUNTS, COUNTS) if p.exists()]
    if not files:
        return conf
    c = pd.concat([_read_counts(p) for p in files], ignore_index=True)
    c = c.drop_duplicates("time", keep="last").set_index("time").sort_index()
    n = (c["west"] + c["east"] + c["rwy18_deps"]).reindex(conf).to_numpy(float)
    ref = same_hour_reference(c, conf)
    ok = np.isfinite(n) & np.isfinite(ref) & (n >= GAP_REL * np.nan_to_num(ref, nan=np.inf))
    return conf[~ok]


def complete_days(counts):
    """UTC days (midnight timestamps) on which all 19 daytime hours (hour starts 03..21 UTC) are in `counts`."""
    idx = counts.index[counts.index.hour.isin(DAY_HOURS)].unique()
    per = pd.Series(1, index=idx).groupby(idx.floor("D")).size()
    return per.index[per == len(DAY_HOURS)]


def load_counts(include_history=False, complete_only=True, gap_rule=None):
    """Hourly counts, index = hour START (UTC). include_history=True also reads data/inaa_counts_history.csv
    (fra.history backfill); on duplicate hours the forward file data/inaa_counts.csv wins.

    complete_only (only matters with include_history=True): keep history rows only on days whose 19 daytime hours
    are all present (complete_days). The backfill samples days sparsely first (3/day), and to_labels() bridges gaps
    with ffill(limit=8), which mislabels switch hours on sparse days (~4 % of hours at 3/day). Also drops history
    rows that are label gaps (history_gaps(gap_rule); the day still counts as complete), so a partial hour
    (e.g. 23 movements, 0 RWY 18 departures) cannot become an OD/RWY18 label. gap_rule None = GAP_RULE ("traffic");
    pass "confirmed" for RWY 18 judgements on the history (see GAP_RULE). Rows of the forward file are always
    kept (unchanged behaviour). fra.history itself uses complete_only=False (planning/progress).
    Selection caveat: until the backfill's pass 3 is done (`uv run python -m fra.history status`), the complete
    history days are mostly pass-2 "possible switch" days (~76 % of days, incl. all switch days): switch-rich, so do
    not fit switch base rates / hazards on them before pass 3 has finished."""
    files = [p for p in ([HISTORY_COUNTS] if include_history else []) + [COUNTS] if p.exists()]
    if not files:
        return pd.DataFrame(columns=["west", "east", "rwy18_deps"], index=pd.DatetimeIndex([], tz="UTC", name="time"))
    c = pd.concat([_read_counts(p).assign(_hist=p == HISTORY_COUNTS) for p in files], ignore_index=True)
    c = c.drop_duplicates("time", keep="last").set_index("time").sort_index()
    if include_history and complete_only:
        c = c[~c["_hist"] | (c.index.floor("D").isin(complete_days(c)) & ~c.index.isin(history_gaps(gap_rule)))]
    return c.drop(columns="_hist")


def build_labels(start, end, workers=10, dense_from=None):
    """Fetch hours newest-first, skipping the night ban (no traffic) and hours already done. Resumable."""
    ends = pd.date_range(start, end, freq="h", tz="UTC")
    ends = ends[(ends.hour >= 4) & (ends.hour <= 22)][::-1]  # windows covering ~03-22 UTC
    # coarse-to-fine (server is slow, ~0.4 req/s): 3 hours/day everywhere first, then 6/day, then all
    level = np.where(np.isin(ends.hour, [7, 13, 19]), 0, np.where(np.isin(ends.hour, [10, 16, 22]), 1, 2))
    if dense_from is not None:  # test period: every hour, fetched first
        level = np.where(ends >= pd.Timestamp(dense_from, tz="UTC"), -1, level)
    ends = ends[np.argsort(level, kind="stable")]
    done = set(load_counts().index + pd.Timedelta(hours=1))
    todo = [t for t in ends if t not in done]
    print(f"{len(todo)} hours to fetch", flush=True)
    DATA.mkdir(exist_ok=True)
    new = not COUNTS.exists()
    with open(COUNTS, "a") as f, ThreadPoolExecutor(workers) as ex:
        if new:
            f.write("time,west,east,rwy18_deps\n")
        for i, row in enumerate(ex.map(label_hour, todo)):
            if "error" in row:
                continue
            with _lock:
                f.write(f"{row['time'].isoformat()},{row['west']},{row['east']},{row['rwy18_deps']}\n")
                f.flush()
            if i % 200 == 0:
                print(i, row["time"], flush=True)


def to_labels(raw, min_moves=4, bridge="ffill"):
    """Hourly labels. OD where movements agree; RWY18 'open' = used, only judged in busy hours.

    bridge: how hours without an OD (night ban, < min_moves movements, not fetched) get one.
      "ffill" (default, unchanged): last OD carried forward up to 8 h, across ANY gap (also sampling gaps).
      "night": carried forward up to 8 h only through local night-ban hours (23-05 Europe/Berlin) and fetched hours
               with < min_moves movements; an unfetched daytime hour stops the bridge (od stays NaN after it)."""
    raw = raw.asfreq("h")
    n = raw["west"] + raw["east"]
    od = pd.Series(np.where(raw["west"] >= raw["east"], 25, 7), index=raw.index, dtype=float)
    od[(n < min_moves) | raw["west"].isna()] = np.nan
    filled = od.ffill(limit=8)
    if bridge == "night":
        lh = raw.index.tz_convert("Europe/Berlin").hour
        ok = (lh >= 23) | (lh < 5) | (raw["west"].notna() & (n < min_moves)).to_numpy()
        blocked = pd.Series(~ok & od.isna().to_numpy(), index=od.index).astype(int).groupby(od.notna().cumsum()).cumsum()
        filled = filled.where(od.notna() | (blocked == 0))
    elif bridge != "ffill":
        raise ValueError(f"bridge={bridge!r}")
    lab = pd.DataFrame({"od": filled})  # night ban hours: OD persists
    # share of westbound movements: a mixed hour means a switch is under way (NaN if too few movements)
    lab["west_frac"] = (raw["west"] / n).where(n >= min_moves)
    # RWY 18 is only judged when departures actually happen: the first hour after the night ban (05-06 local) is the
    # long-haul arrival wave with hardly any departures -> "no RWY 18 departure" says nothing there.
    dep_hour = raw.index.tz_convert("Europe/Berlin").hour >= 6
    busy = (n >= 15) & dep_hour
    lab["rwy18_open"] = np.where(busy, raw["rwy18_deps"] > 0, np.nan).astype(float)
    return lab


def history_labels(complete_only=True, gap_rule=None):
    """Hourly labels (to_labels frame) from the forward file + the 2014+ backfill, built the way the wave-3 runner
    (experiments/history12/run.py) builds them (2026-11-03): load_counts(include_history=True, complete_only,
    gap_rule) -> to_labels(bridge="night"), so a removed label-gap hour or an unfetched daytime hour stops the OD
    bridge instead of being ffilled across. RWY 18 stays strict whatever gap_rule: no RWY 18 judgement in any
    confirmed suspect hour (history_gaps("confirmed"); in the low-traffic hours that GAP_RULE "traffic" re-admits as OD
    labels, 'no RWY 18 departure' means too few departures, not a closure). Used by fra.decision.load_labels(history=
    True) / fit_default(history=True); data/labels.parquet (forward file only) is unaffected."""
    lab = to_labels(load_counts(include_history=True, complete_only=complete_only, gap_rule=gap_rule), bridge="night")
    lab.loc[lab.index.isin(history_gaps("confirmed")), "rwy18_open"] = np.nan
    return lab


if __name__ == "__main__":
    if sys.argv[1] == "--write":
        lab = to_labels(load_counts())
        lab.to_parquet(DATA / "labels.parquet")
        print(lab.describe().to_string(), "\n", lab["od"].value_counts(), "\n", lab["rwy18_open"].value_counts())
    else:
        build_labels(sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4] if len(sys.argv) > 4 else None)
