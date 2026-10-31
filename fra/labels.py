"""Flown OD + RWY18 usage labels from Umwelthaus INAA / FANOMOS radar tracks.

Source: https://inaa.umwelthaus.org/ (Fanomos/GetFlightTracks, one request per hour, KML in Web Mercator).
Low-altitude movement near FRA: track ~250° -> OD 25, ~070° -> OD 07, ~180° west of the field -> RWY 18 departure.
"""

import re
import sys
import threading
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
import pandas as pd
import requests

DATA = Path(__file__).resolve().parent.parent / "data"
CACHE = DATA / "inaa"
URL = "https://inaa.umwelthaus.org/Fanomos/GetFlightTracks"
R = 6378137.0
FRA_LAT, FRA_LON = 50.0333, 8.5706
MAX_ALT_FT = 3000   # altitudes are feet AMSL (field 364 ft): final approach / initial climb
MAX_DIST_KM = 15
PLACEMARK = re.compile(r"<name>(\d+)_TraceColor\d+</name>.*?<coordinates>([^<]+)</coordinates>", re.S)


def fetch_hour(t: pd.Timestamp, cache=False) -> str:
    """KML for the hour ENDING at t (verified: window is [t-1h, t), UTC)."""
    p = CACHE / f"{t:%Y%m%dT%H}.kml"
    if p.exists() and p.stat().st_size > 0:
        return p.read_text()
    r = requests.get(URL, params={"startTime": f"{t:%Y%m%dT%H%M%S}", "timeIntervalInHours": 1}, timeout=180)
    r.raise_for_status()
    if cache:
        CACHE.mkdir(parents=True, exist_ok=True)
        p.write_text(r.text)
    return r.text


def _bearing(lat1, lon1, lat2, lon2):
    p1, p2, dl = np.radians(lat1), np.radians(lat2), np.radians(lon2 - lon1)
    y = np.sin(dl) * np.cos(p2)
    x = np.cos(p1) * np.sin(p2) - np.sin(p1) * np.cos(p2) * np.cos(dl)
    return (np.degrees(np.arctan2(y, x)) + 360) % 360


def classify(kml: str):
    """Counts of low-level flights moving west / east / south(RWY18)."""
    segs = {}
    for fid, coords in PLACEMARK.findall(kml):
        a = np.array([c.split(",") for c in coords.split()], dtype=float)
        segs.setdefault(fid, []).append(a)
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
_lock = threading.Lock()


def load_counts():
    if not COUNTS.exists():
        return pd.DataFrame(columns=["west", "east", "rwy18_deps"], index=pd.DatetimeIndex([], tz="UTC", name="time"))
    c = pd.read_csv(COUNTS, parse_dates=["time"]).dropna(subset=["west"])
    return c.drop_duplicates("time", keep="last").set_index("time").sort_index()


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


def to_labels(raw, min_moves=4):
    """Hourly labels. OD where movements agree; RWY18 'open' = used, only judged in busy hours."""
    raw = raw.asfreq("h")
    n = raw["west"] + raw["east"]
    od = pd.Series(np.where(raw["west"] >= raw["east"], 25, 7), index=raw.index, dtype=float)
    od[(n < min_moves) | raw["west"].isna()] = np.nan
    lab = pd.DataFrame({"od": od.ffill(limit=8)})  # night ban hours: OD persists
    # share of westbound movements: a mixed hour means a switch is under way (NaN if too few movements)
    lab["west_frac"] = (raw["west"] / n).where(n >= min_moves)
    # RWY 18 is only judged when departures actually happen: the first hour after the night ban (05-06 local) is the
    # long-haul arrival wave with hardly any departures -> "no RWY 18 departure" says nothing there.
    dep_hour = raw.index.tz_convert("Europe/Berlin").hour >= 6
    busy = (n >= 15) & dep_hour
    lab["rwy18_open"] = np.where(busy, raw["rwy18_deps"] > 0, np.nan).astype(float)
    return lab


if __name__ == "__main__":
    if sys.argv[1] == "--write":
        lab = to_labels(load_counts())
        lab.to_parquet(DATA / "labels.parquet")
        print(lab.describe().to_string(), "\n", lab["od"].value_counts(), "\n", lab["rwy18_open"].value_counts())
    else:
        build_labels(sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4] if len(sys.argv) > 4 else None)
