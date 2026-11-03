"""Measure the FANOMOS publication lag: poll the newest radar hours every few minutes and log how many movements
each window [E-1h, E) holds as a function of the minutes since its end E.

    uv run python -m experiments.eval_long.fanomos_lag [UNTIL_UTC] [STEP_MIN]   # -> experiments/eval_long/fanomos_lag.csv
    uv run python -m experiments.eval_long.fanomos_lag --summary                # minutes until each hour is complete

One request per window and poll (2-3 per poll), each holding one cross-process INAA slot (fra.labels.inaa_slot) only
for the request itself; windows that ended more than MAX_AGE_MIN ago are not polled again.
"""

import os
import sys
import time
from pathlib import Path

import numpy as np
import pandas as pd
import requests

from fra import labels as L

OUT = Path(__file__).resolve().parent / "fanomos_lag.csv"
MAX_AGE_MIN = 150


def poll_once(now):
    rows = []
    top = now.floor("h")
    for k in range(4):
        end = top - pd.Timedelta(hours=k)
        age = (now - end).total_seconds() / 60
        if age < 0 or age > MAX_AGE_MIN:
            continue
        t0 = pd.Timestamp.now("UTC")
        try:
            with L.inaa_slot(max_wait=120):
                r = requests.get(L.URL, params={"startTime": f"{end:%Y%m%dT%H%M%S}", "timeIntervalInHours": 1},
                                 timeout=120)
                body = r.text
            r.raise_for_status()
            if "</kml>" not in body[-200:]:
                raise ValueError("incomplete KML")
            w, e, s = L.classify(body)
            flights = len(set(fid for fid, _ in L.PLACEMARK.findall(body)))
            err = ""
        except Exception as ex:  # keep polling
            w = e = s = flights = -1
            err = f"{type(ex).__name__}: {str(ex)[:80]}"
        t1 = pd.Timestamp.now("UTC")
        rows.append(dict(fetched_utc=t1.isoformat(), window_end_utc=end.isoformat(),
                         minutes_after_end=round((t1 - end).total_seconds() / 60, 1), west=w, east=e, rwy18_deps=s,
                         flights=flights, request_s=round((t1 - t0).total_seconds(), 1), error=err))
    return rows


def main(until=None, step_min=5):
    until = pd.Timestamp(until, tz="UTC") if until else pd.Timestamp.now("UTC") + pd.Timedelta(hours=3)
    while pd.Timestamp.now("UTC") < until:
        t = pd.Timestamp.now("UTC")
        rows = poll_once(t)
        if rows:
            df = pd.DataFrame(rows)
            new = not OUT.exists()
            with open(OUT, "a") as f:  # one append per poll
                f.write(df.to_csv(index=False, header=new))
            print(df.to_string(index=False, header=new), flush=True)
        time.sleep(max(5.0, step_min * 60 - (pd.Timestamp.now("UTC") - t).total_seconds()))


def summary(path=OUT):
    """Per window: final low-level movements (last poll >= 100 min after the end) and the first poll at which 100 %
    and >= 95 % of them (and the OD majority of the final count) were published."""
    d = pd.read_csv(path)
    d = d[d["error"].isna() & (d["west"] >= 0)].copy()
    d["moves"] = d["west"] + d["east"]
    rows = []
    for end, g in d.groupby("window_end_utc"):
        g = g.sort_values("minutes_after_end")
        fin = g[g["minutes_after_end"] >= 100]
        if fin.empty:
            continue
        n, od = int(fin["moves"].iloc[-1]), (25 if fin["west"].iloc[-1] >= fin["east"].iloc[-1] else 7)
        first = lambda m: (g.loc[m, "minutes_after_end"].min() if m.any() else float("nan"))
        g_od = (g["west"] + g["east"] >= 4) & (np.where(g["west"] >= g["east"], 25, 7) == od)
        rows.append(dict(window_end=end, final_moves=n, final_od=od, polls=len(g),
                         min_100pct=first(g["moves"] >= n), min_95pct=first(g["moves"] >= 0.95 * n),
                         min_od_right=first(g_od), at_12=int(g.loc[g["minutes_after_end"] <= 15, "moves"].max())
                         if (g["minutes_after_end"] <= 15).any() else None))
    return pd.DataFrame(rows)


if __name__ == "__main__":
    os.environ.setdefault("OMP_NUM_THREADS", "1")
    if sys.argv[1:2] == ["--summary"]:
        print(summary().to_string(index=False))
    else:
        main(sys.argv[1] if len(sys.argv) > 1 else None, float(sys.argv[2]) if len(sys.argv) > 2 else 5)
