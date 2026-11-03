"""Backfill of radar (INAA FANOMOS) hourly counts 2014-01-01 .. 2026-02-10 + compact raw-track cache.

Output (append-only, never touches data/inaa_counts.csv which another job appends forward hours to):
  data/inaa_counts_history.csv   same columns as data/inaa_counts.csv: time (= hour START, UTC), west, east, rwy18_deps
  data/inaa_raw/YYYY/MM/YYYYMMDDTHH.npz   raw tracks of the hour; file name = request startTime = window END
                                           (window [T-1h, T) UTC, same naming as fra.labels.fetch_hour's cache)

Adaptive passes (newest first within each pass; hours present in either counts file are skipped => resumable):
  1. 3 hours/day for every day (window ends 07, 13, 19 UTC)
  2. every daytime hour (window ends 04..22 UTC) on "possible switch" days (see switch_days)
  3. all remaining daytime hours

Server etiquette: INAA serialises track requests (~0.4 req/s total); never more than 3 requests in flight from this
machine. (a) Every INAA request through fra.labels.fetch_hour (this job, the forward archive, live forecasts, ad-hoc
scripts) and the prognosis backfill holds one of 3 cross-process flock slots (fra.labels.inaa_slot). (b) The history
jobs (this + fra.prognosis --history) together use at most 2 lanes, so one is always free for the sequential users that
bypass the slots (fra.prognosis.fetch in fra.archive/fra.predict/ops.retrain); one lane less for every further running
INAA user process (Gate, re-checked every 5 s): 2 radar requests normally, 1 while the prognosis backfill runs.

Incomplete responses: a daytime hour (local 06-21) with < 10 classified movements, or < 40 % of the median of the same
day's other daytime hours (>= 2 of them, median >= 30), is not written; it is re-fetched >= 30 min later (end of the
pass, or on restart) and only that second answer is written ("CONFIRMED EMPTY" / "RECOVERED" in the log; state in
data/logs/history_suspect.json). At every pass start, already written hours that meet the rule (relative to the day's
other hours fetched since) are removed from the history file and re-fetched once the same way.

Raw cache format (np.load(path)): fid int64 [segments] = placemark flight id per KML segment (document order),
n int32 [segments] = points kept per segment, d int32 [3, N] = delta-encoded points (cumsum along axis 1 restores
x, y in EPSG:3857 metres rounded to 1 m, altitude ft AMSL), window_end str, placemarks int (KML placemarks before
compaction; files written from 2026-10-31 ~15 UTC on). Kept: points within 40 km of FRA and below 10,000 ft.
load_raw() returns the {fid: [arrays]} dict fra.labels.classify_segments() takes.

Labels: load_counts(include_history=True) returns history rows only for complete days (all 19 daytime hours fetched,
complete_days()), minus label gaps (fra.labels.history_gaps()); sparse pass-1 days would be mislabelled by
to_labels()' ffill. to_labels(..., bridge="night") additionally refuses to bridge unfetched daytime hours. The
suspect rule here only decides what is re-fetched: INAA answers are reproducible, so a 'confirmed' hour is
reproducibly low, not necessarily incomplete. Which confirmed hours are label gaps is decided in fra.labels
(GAP_RULE "traffic": also low against the same local hour of the surrounding days; since 2026-11-03).

Run:  uv run python -m fra.history run [START] [END]     (detached: see data/logs/HISTORY_STATUS.md)
      uv run python -m fra.history status                (progress per pass)
      uv run python -m fra.history validate              (classify ~12 old hours, compare with METAR)
"""
import json
import os
import random
import signal
import sys
import threading
import time
from collections import deque
from concurrent.futures import FIRST_COMPLETED, ThreadPoolExecutor, wait
from pathlib import Path

import numpy as np
import pandas as pd
import requests

from fra.labels import (DATA, FRA_LAT, FRA_LON, GAP_RULE, HISTORY_COUNTS, HISTORY_SUSPECT, INAA_MAX, R,
                        _read_counts, classify_segments, fetch_hour, history_gaps, inaa_slots_busy, load_counts, parse)
from fra.labels import complete_days as _complete_days
from fra.rules import tailwind

RAW = DATA / "inaa_raw"
LOGS = DATA / "logs"
PROGRESS = LOGS / "history_progress.json"
PROG_PID = LOGS / "prognosis_history.pid"  # written by the prognosis backfill while it runs
SUSPECT = HISTORY_SUSPECT                    # incomplete-looking responses: pending / confirmed / recovered
START, END = "2014-01-01", "2026-02-10"     # END inclusive (hourly coverage in inaa_counts.csv starts 2026-02-11)
PASS1_ENDS = [7, 13, 19]                    # window END hours (UTC) sampled first
DAY_ENDS = list(range(4, 23))               # window ends 04..22 UTC = index (hour start) 03..21 UTC
RAW_KM, RAW_FT = 40.0, 10000.0
HEADER = "time,west,east,rwy18_deps\n"
HISTORY_LANES = 2                           # INAA requests the history jobs (radar + prognosis) may use together
GATE_RECHECK_S = 5
# processes (python -m <module>) that make sequential INAA requests: forward archive, live forecast, prognosis
# download/live, labels CLI, weekly retrain. The prognosis backfill (--history) is counted separately (PROG_PID).
INAA_USER_MODULES = {"fra.archive", "fra.predict", "fra.prognosis", "fra.labels", "ops.retrain"}
SUSPECT_ABS, SUSPECT_REL, SUSPECT_REF_MIN = 10, 0.4, 30
RECHECK = pd.Timedelta(minutes=30)
H = pd.Timedelta(hours=1)

_stop = threading.Event()
_write_lock = threading.Lock()
_sus_lock = threading.Lock()
_tls = threading.local()


# ---------------------------------------------------------------------------------------------------- raw cache
def raw_path(t_end: pd.Timestamp) -> Path:
    return RAW / f"{t_end:%Y}" / f"{t_end:%m}" / f"{t_end:%Y%m%dT%H}.npz"


def compact(segs: dict):
    """Keep points within RAW_KM of FRA and below RAW_FT; returns (fid, n, d) arrays (see module doc)."""
    fids, ns, pts = [], [], []
    for fid, parts in segs.items():
        for a in parts:
            lon = np.degrees(a[:, 0] / R)
            lat = np.degrees(2 * np.arctan(np.exp(a[:, 1] / R)) - np.pi / 2)
            dist = np.hypot((lat - FRA_LAT) * 111.2, (lon - FRA_LON) * 71.5)
            k = (dist < RAW_KM) & (a[:, 2] < RAW_FT)
            if k.any():
                fids.append(int(fid))
                ns.append(int(k.sum()))
                pts.append(np.round(a[k]).astype(np.int64))
    p = np.vstack(pts) if pts else np.zeros((0, 3), np.int64)
    d = np.diff(p, axis=0, prepend=np.zeros((1, 3), np.int64)).T.astype(np.int32)  # (3, N), column-major deltas
    return np.array(fids, np.int64), np.array(ns, np.int32), np.ascontiguousarray(d)


def save_raw(t_end, segs):
    fid, n, d = compact(segs)
    p = raw_path(t_end)
    p.parent.mkdir(parents=True, exist_ok=True)
    tmp = p.with_name(p.stem + ".tmp.npz")
    np.savez_compressed(tmp, fid=fid, n=n, d=d, window_end=np.array(str(t_end)), placemarks=np.int32(len(segs)))
    os.replace(tmp, p)
    return p.stat().st_size


def load_raw(path) -> dict:
    """{fid (str): [float arrays (n, 3)]} like fra.labels.parse(), for classify_segments()."""
    z = np.load(path)
    p = np.cumsum(z["d"].astype(np.int64), axis=1).T.astype(float)
    segs, i = {}, 0
    for fid, n in zip(z["fid"], z["n"]):
        segs.setdefault(str(fid), []).append(p[i:i + n])
        i += n
    return segs


# ---------------------------------------------------------------------------------------------------- fetching
def _session():
    if not hasattr(_tls, "s"):
        _tls.s = requests.Session()
    return _tls.s


def _prognosis_running():
    try:
        pid = int(PROG_PID.read_text().strip())
        os.kill(pid, 0)
        return "prognosis" in Path(f"/proc/{pid}/cmdline").read_bytes().decode(errors="replace")
    except (OSError, ValueError):
        return False


def other_inaa_users():
    """Running python processes (not this one, not the prognosis backfill) of modules that call INAA sequentially."""
    me, n = os.getpid(), 0
    for d in os.listdir("/proc"):
        if not d.isdigit() or int(d) == me:
            continue
        try:
            argv = [a.decode(errors="replace") for a in Path(f"/proc/{d}/cmdline").read_bytes().split(b"\0") if a]
        except OSError:
            continue
        if not argv or not os.path.basename(argv[0]).startswith("python"):
            continue  # skips the `uv run` parents (their python child is counted)
        mods = {argv[i + 1] for i in range(len(argv) - 1) if argv[i] == "-m"}
        if mods & INAA_USER_MODULES and not {"--history", "--history-status"} & set(argv):
            n += 1
    return n


def inaa_budget(hi=HISTORY_LANES):
    """(radar concurrency, other INAA users, prognosis backfill running). The history jobs get INAA_MAX minus one
    lane per other sequential INAA user (at least one lane always reserved for them), capped at `hi`; the prognosis
    backfill's request comes out of that budget."""
    others, prog = other_inaa_users(), _prognosis_running()
    return max(0, min(hi, INAA_MAX - max(1, others)) - int(prog)), others, prog


class Gate:
    """In-process INAA concurrency for the radar backfill = inaa_budget() (re-checked every GATE_RECHECK_S s).
    0 pauses the radar job until other INAA users finish. Each request also holds a fra.labels.inaa_slot."""

    def __init__(self, hi):
        self.hi, self.active, self.cv = hi, 0, threading.Condition()
        self._lim, self._checked = None, 0.0

    def limit(self):
        if self._lim is None or time.monotonic() - self._checked > GATE_RECHECK_S:
            lim, others, prog = inaa_budget(self.hi)
            if lim != self._lim:
                print(f"INAA gate: {lim} concurrent radar request(s) (other INAA user processes {others}, "
                      f"prognosis backfill {'running' if prog else 'off'})", flush=True)
            self._lim, self._checked = lim, time.monotonic()
        return self._lim

    def __enter__(self):
        with self.cv:
            while self.active >= self.limit():
                self.cv.wait(5)
            self.active += 1

    def __exit__(self, *exc):
        with self.cv:
            self.active -= 1
            self.cv.notify_all()


# ---------------------------------------------------------------------------------------------------- suspects
def _load_suspects():
    try:
        return json.loads(SUSPECT.read_text())
    except (OSError, ValueError):
        return {}


SUSPECTS = _load_suspects()  # window end iso -> {status, first_utc, n1, ref, ...}


def _save_suspects():
    LOGS.mkdir(parents=True, exist_ok=True)
    tmp = SUSPECT.with_suffix(".tmp")
    tmp.write_text(json.dumps(SUSPECTS, indent=0, sort_keys=True))
    os.replace(tmp, SUSPECT)


def _daytime(start):
    return 6 <= start.tz_convert("Europe/Berlin").hour <= 21


def is_suspect(start, n, ref):
    """Daytime hour (local 06-21, hour start) whose classified movements look like an incomplete response."""
    if not _daytime(start):
        return False
    return n < SUSPECT_ABS or (ref is not None and ref >= SUSPECT_REF_MIN and n < SUSPECT_REL * ref)


def _daytime_mask(idx):
    lh = idx.tz_convert("Europe/Berlin").hour
    return (lh >= 6) & (lh <= 21)


def _day_moves(counts):
    """{UTC day: {hour start: movements}} for daytime hours (reference for the relative rule)."""
    c = counts[_daytime_mask(counts.index)]
    n = (c["west"] + c["east"] + c["rwy18_deps"]).astype(int)
    out = {}
    for t, v in n.items():
        out.setdefault(t.floor("D"), {})[t] = v
    return out


def _ref(day_n, start):
    other = [v for k, v in day_n.get(start.floor("D"), {}).items() if k != start]
    return float(np.median(other)) if len(other) >= 2 else None


def _verdict(t_end, n, ref, placemarks):
    """'ok' (write the row) or 'defer' (incomplete-looking; re-fetch >= RECHECK after the first suspect fetch)."""
    key = t_end.isoformat()
    sus = is_suspect(t_end - H, n, ref)
    now = pd.Timestamp.now("UTC")
    with _sus_lock:
        e = SUSPECTS.get(key)
        if e is None or e["status"] != "pending":
            if not sus or e is not None:  # normal hour, or one already re-checked once: take it
                return "ok"
            SUSPECTS[key] = {"status": "pending", "first_utc": now.isoformat(timespec="seconds"), "n1": int(n),
                             "ref": ref, "placemarks1": int(placemarks), "source": "live"}
            _save_suspects()
            print(f"SUSPECT {t_end:%Y-%m-%dT%H}: {n} movements (same-day median {ref}), {placemarks} placemarks;"
                  f" not written, re-fetch in >= {RECHECK.seconds // 60} min", flush=True)
            return "defer"
        if now - pd.Timestamp(e["first_utc"]) < RECHECK:
            return "defer"
        e.update(status="confirmed" if sus else "recovered", n2=int(n), ref2=ref, placemarks2=int(placemarks),
                 final_utc=now.isoformat(timespec="seconds"))
        _save_suspects()
        print(f"{'CONFIRMED EMPTY' if sus else 'RECOVERED'} {t_end:%Y-%m-%dT%H}: {e['n1']} -> {n} movements"
              f" (same-day median {ref})", flush=True)
        return "ok"


def not_before(t_end):
    e = SUSPECTS.get(t_end.isoformat())
    return pd.Timestamp(e["first_utc"]) + RECHECK if e else pd.Timestamp.now("UTC")


def scan_suspects(start=START, end=END):
    """Written history hours in [start, end] that meet is_suspect (relative to the day's other hours known now) and
    were not re-checked yet: removed from the history file (atomic rewrite) and marked pending, so the next pass
    re-fetches them once. Call only while no fetch_all() is writing (run() calls it before every pass)."""
    if not HISTORY_COUNTS.exists():
        return []
    allc = load_counts(include_history=True, complete_only=False)
    hist = _read_counts(HISTORY_COUNTS).drop_duplicates("time", keep="last").set_index("time")
    lo, hi = pd.Timestamp(start, tz="UTC"), pd.Timestamp(end, tz="UTC") + pd.Timedelta(days=1)
    fwd = set(load_counts().index)
    day_n = _day_moves(allc)
    hist = hist[(hist.index >= lo) & (hist.index < hi) & _daytime_mask(hist.index) & ~hist.index.isin(list(fwd))]
    flagged = []
    for t, n in (hist["west"] + hist["east"] + hist["rwy18_deps"]).astype(int).items():
        e = SUSPECTS.get((t + H).isoformat())
        if e is not None and e["status"] != "pending":
            continue
        ref = _ref(day_n, t)
        if is_suspect(t, n, ref):
            flagged.append((t, n, ref))
    if not flagged:
        return []
    with _write_lock, _sus_lock:
        for t, n, ref in flagged:
            p = raw_path(t + H)
            first = pd.Timestamp(p.stat().st_mtime, unit="s", tz="UTC") if p.exists() else pd.Timestamp.now("UTC")
            SUSPECTS[(t + H).isoformat()] = {"status": "pending", "first_utc": first.isoformat(timespec="seconds"),
                                             "n1": n, "ref": ref, "source": "scan"}
            print(f"SUSPECT (scan) {t + H:%Y-%m-%dT%H}: {n} movements (same-day median {ref}); row removed,"
                  f" re-fetch in this or a later pass", flush=True)
        _save_suspects()
        drop = {t for t, _, _ in flagged}
        lines = HISTORY_COUNTS.read_text().splitlines(keepends=True)
        times = pd.to_datetime([ln.split(",", 1)[0] for ln in lines[1:]], utc=True, errors="coerce")
        keep = [lines[0]] + [ln for ln, t in zip(lines[1:], times) if t not in drop]
        tmp = HISTORY_COUNTS.with_name(HISTORY_COUNTS.name + ".tmp")
        tmp.write_text("".join(keep))
        os.replace(tmp, HISTORY_COUNTS)
    return flagged


_fail_streak = [0]


def fetch_count(t_end, gate, attempts=5, ref=None):
    """(row dict, raw bytes, seconds) for window end t_end; "defer" for an incomplete-looking response that is
    re-fetched later (see _verdict); None after `attempts` failures (logged)."""
    for attempt in range(attempts):
        if _stop.is_set():
            return None
        if _fail_streak[0] >= 20:  # server down / blocking us: back off hard, all workers
            print(f"{_fail_streak[0]} consecutive failures; sleeping 10 min", flush=True)
            time.sleep(600)
        try:
            t0 = time.monotonic()
            with gate:
                kml = fetch_hour(t_end, timeout=120, session=_session(), check=True)
            secs = time.monotonic() - t0
            segs = parse(kml)
            w, e, s = classify_segments(segs)
            _fail_streak[0] = 0
            if _verdict(t_end, w + e + s, ref, len(segs)) == "defer":
                return "defer"
            size = save_raw(t_end, segs)
            return {"time": t_end - pd.Timedelta(hours=1), "west": w, "east": e, "rwy18_deps": s}, size, secs
        except Exception as ex:
            _fail_streak[0] += 1
            wait_s = min(300, 15 * 2 ** attempt) * (0.5 + random.random())
            print(f"fail {t_end:%Y-%m-%dT%H} attempt {attempt + 1}/{attempts}: {type(ex).__name__}: {str(ex)[:120]}"
                  f"; retry in {wait_s:.0f}s", flush=True)
            if attempt + 1 < attempts:
                _stop.wait(wait_s)
    print(f"SKIP {t_end:%Y-%m-%dT%H} after {attempts} attempts (retried on the next pass/restart)", flush=True)
    return None


def _open_history():
    new = not HISTORY_COUNTS.exists() or HISTORY_COUNTS.stat().st_size == 0
    f = open(HISTORY_COUNTS, "a+b")
    if new:
        f.write(HEADER.encode())
    else:  # a kill mid-write could leave a partial last line: terminate it so the next row starts cleanly
        f.seek(-1, os.SEEK_END)
        if f.read(1) != b"\n":
            f.write(b"\n")
    f.flush()
    return f


def done_ends():
    """Window ends (UTC) already present in either counts file."""
    return set(load_counts(include_history=True, complete_only=False).index + pd.Timedelta(hours=1))


def complete_days():
    """UTC days with all 19 daytime hours (window ends 04..22) in either counts file (usable for labels)."""
    return _complete_days(load_counts(include_history=True, complete_only=False))


def fetch_all(todo, label, workers=HISTORY_LANES):
    """Fetch window ends in `todo` order (bounded in-flight queue), append rows to the history file as they finish.
    Incomplete-looking responses are deferred and re-fetched at the end of the pass, >= RECHECK after the first."""
    gate = Gate(workers)
    day_n = _day_moves(load_counts(include_history=True, complete_only=False))
    f = _open_history()
    n_ok = n_fail = 0
    t_start = time.monotonic()
    recent = deque(maxlen=200)
    sizes = deque(maxlen=2000)
    it = iter(todo)
    inflight, deferred = {}, {}  # deferred: window end -> not before (UTC)
    with ThreadPoolExecutor(workers) as ex:
        while True:
            while not _stop.is_set() and len(inflight) < workers * 2:
                t = next(it, None)
                if t is None:  # main list done: deferred suspects whose wait is over
                    now = pd.Timestamp.now("UTC")
                    t = next((k for k, nb in sorted(deferred.items(), key=lambda x: x[1]) if nb <= now), None)
                    if t is None:
                        break
                    deferred.pop(t)
                inflight[ex.submit(fetch_count, t, gate, 5, _ref(day_n, t - H))] = t
            if not inflight:
                if deferred and not _stop.is_set():
                    wait_s = (min(deferred.values()) - pd.Timestamp.now("UTC")).total_seconds()
                    print(f"{label}: waiting {wait_s / 60:.0f} min to re-fetch {len(deferred)} suspect hour(s)",
                          flush=True)
                    _stop.wait(max(1.0, wait_s))
                    continue
                break
            finished, _ = wait(inflight, timeout=30, return_when=FIRST_COMPLETED)
            for fut in finished:
                t = inflight.pop(fut)
                res = fut.result()
                if res is None:
                    n_fail += 1
                    continue
                if res == "defer":
                    deferred[t] = not_before(t)
                    continue
                row, size, secs = res
                with _write_lock:
                    f.write(f"{row['time'].isoformat()},{row['west']},{row['east']},{row['rwy18_deps']}\n".encode())
                    f.flush()
                if _daytime(row["time"]):
                    day_n.setdefault(row["time"].floor("D"), {})[row["time"]] = row["west"] + row["east"] + row["rwy18_deps"]
                n_ok += 1
                recent.append(time.monotonic())
                sizes.append(size)
                if n_ok % 25 == 0 or n_ok == 1:
                    rate = (len(recent) - 1) / (recent[-1] - recent[0]) if len(recent) > 1 and recent[-1] > recent[0] else 0.0
                    left = len(todo) - n_ok - n_fail
                    eta_h = left / rate / 3600 if rate else float("nan")
                    msg = {"pass": label, "done": n_ok, "failed": n_fail, "deferred": len(deferred),
                           "total": len(todo), "last": str(row["time"]),
                           "rate_per_s": round(rate, 3), "eta_pass_h": round(eta_h, 1),
                           "mean_raw_kb": round(float(np.mean(sizes)) / 1024, 1),
                           "elapsed_h": round((time.monotonic() - t_start) / 3600, 2),
                           "updated": pd.Timestamp.now("UTC").isoformat(timespec="seconds")}
                    print(json.dumps(msg), flush=True)
                    _write_progress(msg)
    f.close()
    print(f"{label}: {n_ok} fetched, {n_fail} skipped, {len(deferred)} suspect(s) still deferred,"
          f" {(time.monotonic() - t_start) / 3600:.2f} h", flush=True)
    return n_ok, n_fail


def _write_progress(msg):
    LOGS.mkdir(parents=True, exist_ok=True)
    tmp = PROGRESS.with_suffix(".tmp")
    tmp.write_text(json.dumps(msg, indent=1))
    os.replace(tmp, PROGRESS)


# ---------------------------------------------------------------------------------------------------- planning
def _ends(days, hours):
    return pd.DatetimeIndex([d + pd.Timedelta(hours=h) for d in days for h in hours])


def hourly_metar(path=DATA / "metar_full.parquet"):
    """Hourly METAR wind (last report in each hour), index = hour start (UTC)."""
    m = pd.read_parquet(path)
    m = m[m["sknt"].notna()]
    m = m.groupby(m.index.floor("h")).last()
    # VRB / missing direction: no usable direction -> treat as calm-ish (tailwind 0) but keep the speed
    m["tw25"] = np.where(m["drct"].notna(), tailwind(m["sknt"], m["drct"].fillna(0), 250), 0.0)
    return m[["sknt", "drct", "tw25"]]


def switch_days(counts, metar, days, sample_ends=PASS1_ENDS, tw_on25=0.0, tw_on07=5.0, mixed=0.1, min_moves=4,
                evening=True):
    """Boolean Series over `days`: True = possible OD switch day (fetch every hour). Generous on purpose.

    counts: hourly counts (index = hour start); only the pass-1 sample hours (window ends `sample_ends`) are used.
    Flags a day if any of:
      - its samples disagree, or one sample is mixed (minority share > `mixed`), or < 2 usable samples;
      - its first sample differs from the previous day's last sample;
      - METAR (hours 03..21 UTC), with the then-active OD = last pass-1 sample carried forward:
        OD 25 active and tailwind on 25 > `tw_on25` (any tailwind), or
        OD 07 active and tailwind on 25 < `tw_on07` (near/below the ~5 kt west-preference threshold: return likely);
      - any hour 03..21 UTC lacks a METAR report;
      - (evening=True) any of the above METAR hour flags in 18..21 UTC of the previous day (late switch undone overnight).
    Checked on the hourly Feb-Oct 2026 labels subsampled to 3/day: flags 76 % of days and catches 87/87 switch days
    (without the evening rule 85/87; the literal "|tw25| < 5 kt and speed > 3 kt" near-rule flagged 96 % of days).
    """
    days = pd.DatetimeIndex(days)
    idx_hours = [h - 1 for h in sample_ends]
    c = counts[counts.index.hour.isin(idx_hours)].copy()
    n = c["west"] + c["east"]
    c = c[n >= min_moves]
    n = n[n >= min_moves]
    c["od"] = np.where(c["west"] >= c["east"], 25, 7)
    c["mix"] = np.minimum(c["west"], c["east"]) / n > mixed
    c["day"] = c.index.floor("D")
    g = c.groupby("day")
    per = pd.DataFrame({"n": g.size(), "nod": g["od"].nunique(), "mix": g["mix"].any(),
                        "first": g["od"].first(), "last": g["od"].last()}).reindex(days)
    prev_last = per["last"].ffill().shift(1)
    flag = (per["n"].fillna(0) < 2) | (per["nod"] > 1) | per["mix"].fillna(False).astype(bool)
    flag |= per["first"].notna() & prev_last.notna() & (per["first"] != prev_last)
    # METAR, hourly grid of daytime hours
    grid = _ends(days, range(3, 22))
    m = metar.reindex(grid)
    od_now = c["od"].reindex(c.index.union(grid)).ffill().reindex(grid)  # then-active OD = last sample before
    hourflag = ((od_now != 7) & (m["tw25"] > tw_on25)) | ((od_now == 7) & (m["tw25"] < tw_on07)) | m["sknt"].isna()
    hourflag = pd.Series(np.asarray(hourflag, bool), index=grid)
    hf = hourflag.groupby(grid.floor("D")).any().reindex(days, fill_value=True)
    # a flagged evening (18..21 UTC) can mean a switch late on D-1 that is undone in the night ban: also fetch D
    late = hourflag[grid.hour >= 18].groupby(grid[grid.hour >= 18].floor("D")).any()
    late = late.reindex(days - pd.Timedelta(days=1), fill_value=True).to_numpy() if evening else False
    return flag | hf | late


def plan(pass_no, start=START, end=END, done=None):
    days = pd.date_range(pd.Timestamp(start, tz="UTC"), pd.Timestamp(end, tz="UTC"), freq="D")
    done = done_ends() if done is None else done
    if pass_no == 1:
        ends = _ends(days, PASS1_ENDS)
    elif pass_no == 2:
        flag = switch_days(load_counts(include_history=True, complete_only=False), hourly_metar(), days)
        print(f"pass 2: {int(flag.sum())} of {len(days)} days flagged as possible switch days", flush=True)
        ends = _ends(days[flag.to_numpy()], DAY_ENDS)
    else:
        ends = _ends(days, DAY_ENDS)
    return [t for t in ends.sort_values(ascending=False) if t not in done]


def run(start=START, end=END, workers=HISTORY_LANES):
    signal.signal(signal.SIGTERM, lambda *a: (_stop.set(), print("SIGTERM: finishing in-flight requests", flush=True)))
    signal.signal(signal.SIGINT, lambda *a: _stop.set())
    LOGS.mkdir(parents=True, exist_ok=True)
    print(f"history run {start} .. {end}, workers={workers}, pid={os.getpid()}", flush=True)
    # "retry" = pass 3 again: hours SKIPped after repeated failures and suspects not re-fetched yet
    for label, p in (("pass1", 1), ("pass2", 2), ("pass3", 3), ("retry", 3)):
        if _stop.is_set():
            break
        flagged = scan_suspects(start, end)
        todo = plan(p, start, end)
        print(f"{label}: {len(todo)} hours to fetch ({len(flagged)} written hours flagged as suspect by the scan)",
              flush=True)
        fetch_all(todo, label, workers)
    print("stopped" if _stop.is_set() else "all passes complete", flush=True)


# ---------------------------------------------------------------------------------------------------- status/validate
def status(start=START, end=END):
    days = pd.date_range(pd.Timestamp(start, tz="UTC"), pd.Timestamp(end, tz="UTC"), freq="D")
    done = done_ends()
    hist = load_counts(include_history=True, complete_only=False)
    full = _complete_days(hist)
    hist = hist[(hist.index >= days[0]) & (hist.index < days[-1] + pd.Timedelta(days=1))]
    p1 = _ends(days, PASS1_ENDS)
    alld = _ends(days, DAY_ENDS)
    print(f"range {start} .. {end}: {len(days)} days")
    print(f"pass 1 (3/day):   {sum(t in done for t in p1):>6} / {len(p1)}")
    print(f"all daytime hours: {sum(t in done for t in alld):>6} / {len(alld)}")
    print(f"complete days (all 19 daytime hours; only these enter load_counts(include_history=True)):"
          f" {int(full.isin(days).sum())} / {len(days)}")
    st = pd.Series([e["status"] for e in _load_suspects().values()], dtype=object).value_counts().to_dict()
    print(f"suspect responses ({SUSPECT.name}): {st or 'none'}; label gaps excluded from"
          f" load_counts(include_history=True): {len(history_gaps())} hours (fra.labels.GAP_RULE"
          f" '{GAP_RULE}'; all confirmed: {len(history_gaps('confirmed'))})")
    lim, others, prog = inaa_budget()
    print(f"INAA now: slots held {inaa_slots_busy()}/{INAA_MAX}, other INAA user processes {others}, prognosis"
          f" backfill {'running' if prog else 'off'} -> radar may use {lim}")
    if HISTORY_COUNTS.exists():
        h = pd.read_csv(HISTORY_COUNTS)
        print(f"{HISTORY_COUNTS.name}: {len(h)} rows")
    print("observed hours per year:", hist.groupby(hist.index.year).size().to_dict())
    if RAW.exists():
        files = list(RAW.rglob("*.npz"))
        tot = sum(p.stat().st_size for p in files)
        print(f"raw cache: {len(files)} files, {tot / 1e9:.2f} GB, mean {tot / max(1, len(files)) / 1024:.1f} KB"
              f" -> projected {tot / max(1, len(files)) * len(alld) / 1e9:.1f} GB for {len(alld)} hours")
    if PROGRESS.exists():
        print(PROGRESS.read_text())


VALIDATE = ["2014-03-10T13", "2014-11-20T10", "2015-07-01T07", "2016-02-15T19", "2016-07-04T02", "2017-08-20T13",
            "2018-12-05T16", "2019-06-12T13", "2020-04-15T13", "2020-07-01T02", "2021-01-10T13", "2021-09-01T19"]


def validate(hours=VALIDATE):
    """Fetch + classify a few old hours (window ends), compare with the METAR wind and the raw-cache round trip."""
    met = hourly_metar()
    rows = []
    for h in hours:
        t = pd.Timestamp(h, tz="UTC")
        t0 = time.monotonic()
        kml = fetch_hour(t, timeout=120, check=True)
        secs = time.monotonic() - t0
        segs = parse(kml)
        w, e, s = classify_segments(segs)
        fid, n, d = compact(segs)
        tmp = Path("/tmp") / f"fra_validate_{t:%Y%m%dT%H}.npz"
        np.savez_compressed(tmp, fid=fid, n=n, d=d, window_end=np.array(str(t)))
        w2, e2, s2 = classify_segments(load_raw(tmp))
        mo = met.reindex([t - pd.Timedelta(hours=1)]).iloc[0]
        rows.append({"window_end": h, "local": f"{t.tz_convert('Europe/Berlin'):%H:%M}", "flights": len(segs),
                     "west": w, "east": e, "rwy18": s, "raw_roundtrip_equal": (w, e, s) == (w2, e2, s2),
                     "raw_kb": round(tmp.stat().st_size / 1024, 1), "kml_kb": round(len(kml) / 1024),
                     "metar_dir": mo["drct"], "metar_kt": mo["sknt"], "tw25": round(mo["tw25"], 1), "sec": round(secs, 1)})
        tmp.unlink()
    df = pd.DataFrame(rows)
    print(df.to_string(index=False))
    return df


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "run":
        run(*sys.argv[2:4])
    elif cmd == "validate":
        validate()
    else:
        status(*sys.argv[2:4])
