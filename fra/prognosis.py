"""Official OD prognosis published on Umwelthaus INAA (8 h blocks, main + alternative scenario), as-of any time.

Source: https://inaa.umwelthaus.org/Direction/GetDirectionData?currentTime=YYYYMMDDTHHMMSS (UTC); the response is
the prognosis that was live at currentTime, so it is a legitimate "available at forecast time" feature.
States (from INAA direction.js): 1 = west (OD 25), 3 = east (OD 07), 2 = mixed; two digits = transition
from the first to the second state within the block.
"""

import re
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
import pandas as pd
import requests

DATA = Path(__file__).resolve().parent.parent / "data"
ARCHIVE = DATA / "prognosis.parquet"
URL = "https://inaa.umwelthaus.org/Direction/GetDirectionData"
PERIOD = re.compile(r'<(period|alternativperiod) from="([^"]+)" state="(\d+)" probability="([^"]+)"')
WEST = {"1": 1.0, "2": 0.5, "3": 0.0}
BLOCK = pd.Timedelta(hours=8)


def fetch(t: pd.Timestamp):
    r = requests.get(URL, params={"currentTime": f"{t:%Y%m%dT%H%M%S}"}, timeout=60)
    r.raise_for_status()
    rows = []
    for kind, frm, state, prob in PERIOD.findall(r.json()["xmlContent"]):
        start = pd.to_datetime(frm, format="%a %b %d %H:%M:%S %z %Y").tz_convert("UTC")
        rows.append({"asof": t, "kind": "main" if kind == "period" else "alt", "start": start,
                     "state": state, "prob": float(prob)})
    return rows


def download(start="2025-06-01", end=None, workers=4):
    end = end or pd.Timestamp.now("UTC").floor("h")
    hours = pd.date_range(pd.Timestamp(start, tz="UTC"), end, freq="h")
    old = pd.read_parquet(ARCHIVE) if ARCHIVE.exists() else pd.DataFrame(columns=["asof"])
    todo = hours.difference(pd.DatetimeIndex(old["asof"].unique())) if len(old) else hours
    print(f"{len(todo)} hours to fetch", flush=True)
    out = []
    with ThreadPoolExecutor(workers) as ex:
        for i, rows in enumerate(ex.map(_safe_fetch, todo)):
            out.extend(rows)
            if i % 1000 == 0:
                print(i, flush=True)
    df = pd.concat([old, pd.DataFrame(out)], ignore_index=True) if len(old) else pd.DataFrame(out)
    df.to_parquet(ARCHIVE)
    return df


def _safe_fetch(t):
    for _ in range(3):
        try:
            return fetch(t)
        except Exception:
            pass
    return []


def _p_west(state, frac):
    """P(west) for a state code at fraction `frac` through the 8 h block."""
    a = WEST.get(state[0], 0.5)
    b = WEST.get(state[-1], 0.5)
    return a + (b - a) * frac


def features(issues: pd.DatetimeIndex, leads, archive=None):
    """For each (issue t, lead L): prognosis live at t, evaluated at valid t+L."""
    p = archive if archive is not None else pd.read_parquet(ARCHIVE)
    p = p[p["asof"].isin(issues)]
    grid = pd.DataFrame([(t, l) for t in issues for l in leads], columns=["issue", "lead"])
    grid["valid"] = grid["issue"] + pd.to_timedelta(grid["lead"], unit="h")
    out = grid.copy()
    for kind in ["main", "alt"]:
        q = p[p["kind"] == kind].sort_values("start")
        m = pd.merge_asof(grid.sort_values("valid"), q.rename(columns={"asof": "issue"}),
                          left_on="valid", right_on="start", by="issue", direction="backward")
        m = m[m["valid"] < m["start"] + BLOCK] if len(m) else m
        frac = ((m["valid"] - m["start"]) / BLOCK).clip(0, 1)
        m[f"prog_{kind}_west"] = [_p_west(s, f) for s, f in zip(m["state"], frac)]
        m[f"prog_{kind}_prob"] = m["prob"]
        cols = [f"prog_{kind}_west", f"prog_{kind}_prob"]
        if kind == "main":
            first = p.groupby("asof")["start"].min()
            m["prog_age_h"] = (m["issue"] - m["issue"].map(first)) / pd.Timedelta(hours=1)
            cols.append("prog_age_h")
        out = out.merge(m[["issue", "lead"] + cols], on=["issue", "lead"], how="left")
    # signed confidence: +prob if west, -prob if east (main scenario)
    out["prog_signed"] = ((2 * out["prog_main_west"] - 1) * out["prog_main_prob"]).fillna(0)
    out["prog_alt_signed"] = ((2 * out["prog_alt_west"] - 1) * out["prog_alt_prob"]).fillna(0)
    return out


def live(issue, leads):
    rows = fetch(issue)
    return features(pd.DatetimeIndex([issue]), leads, pd.DataFrame(rows))


if __name__ == "__main__":
    df = download(*(sys.argv[1:2] or []))
    print(df.shape, df["asof"].min(), df["asof"].max())
    f = features(pd.date_range("2026-10-28", periods=3, freq="h", tz="UTC"), [1, 24])
    print(f.round(2).to_string())
