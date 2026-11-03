"""Archive live aircraft around FRA every 5 minutes (OpenSky Network REST API, anonymous) -> data/archive/opensky/.

    uv run python -m ops.opensky_archive            # one snapshot (the systemd timer fra-opensky.timer runs it)
    uv run python -m ops.opensky_archive --summary  # direction seen per hour so far

Why: the radar labels arrive about an hour late, so the forecast only knows the direction flown 1-2 h ago. Live ADS-B
positions show it in real time. These snapshots build the history needed to train and test that input (as a new,
pre-registered shadow variant); nothing in the live forecast reads them.

Budget: one bounding box of ~0.5 sq deg costs 1 credit; 288 calls/day stay under the anonymous limit of 400/day.
Output per call: raw response (gzip JSON) under data/archive/opensky/YYYY/MM/DD/HHMM.json.gz and one line in
data/archive/opensky/snapshots.csv (time, aircraft, low-level movers westbound / eastbound / RWY 18, direction).
"""

import csv
import gzip
import json
import sys
from pathlib import Path

import pandas as pd
import requests

from fra.live import BOX, OPENSKY, UA, live_od, poll_opensky

OUT = Path(__file__).resolve().parent.parent / "data" / "archive" / "opensky"
LOG = OUT / "snapshots.csv"
FIELDS = ["time_utc", "retrieved_utc", "aircraft", "west", "east", "rwy18", "od", "error"]


def snapshot():
    now = pd.Timestamp.now("UTC")
    row = dict(time_utc="", retrieved_utc=now.isoformat(timespec="seconds"), aircraft=0, west=0, east=0, rwy18=0,
               od="", error="")
    try:
        t, flights = poll_opensky()
        ts = pd.Timestamp(t, unit="s", tz="UTC") if t else now
        d = OUT / f"{ts:%Y/%m/%d}"
        d.mkdir(parents=True, exist_ok=True)
        with gzip.open(d / f"{ts:%H%M%S}.json.gz", "wt") as f:
            json.dump({"time": t, "retrieved_utc": row["retrieved_utc"], "box": BOX, "flights": flights}, f,
                      separators=(",", ":"))
        od, w, e = live_od(flights)
        r18 = sum(1 for f in flights if f["phase"] in ("dep", "low") and f["rw"] == 18)
        row.update(time_utc=ts.isoformat(), aircraft=len(flights), west=w, east=e, rwy18=r18, od=od or "")
    except (requests.RequestException, ValueError, KeyError) as ex:
        row["error"] = f"{type(ex).__name__}: {ex}"[:200]
    OUT.mkdir(parents=True, exist_ok=True)
    new = not LOG.exists()
    with open(LOG, "a", newline="") as f:
        w = csv.DictWriter(f, FIELDS)
        if new:
            w.writeheader()
        w.writerow(row)
    return row


def summary():
    s = pd.read_csv(LOG, parse_dates=["time_utc", "retrieved_utc"])
    ok = s[s["error"].isna()]
    h = ok.groupby(ok["time_utc"].dt.floor("h")).agg(snapshots=("aircraft", "size"), west=("west", "sum"),
                                                     east=("east", "sum"), rwy18=("rwy18", "sum"))
    print(f"{len(s)} snapshots, {len(s) - len(ok)} failed, {len(h)} hours")
    print(h.tail(24).to_string())


if __name__ == "__main__":
    summary() if "--summary" in sys.argv else print(snapshot())
