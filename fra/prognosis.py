"""Official OD prognosis published on Umwelthaus INAA (8 h blocks, main + alternative scenario), as-of any time.

Source: https://inaa.umwelthaus.org/Direction/GetDirectionData?currentTime=YYYYMMDDTHHMMSS (UTC); the response is
the prognosis that was live at currentTime, so it is a legitimate "available at forecast time" feature.
States (from INAA direction.js): 1 = west (OD 25), 3 = east (OD 07), 2 = mixed; two digits = transition
from the first to the second state within the block.
"""

import re
import signal
import sys
import threading
import time
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


# ------------------------------------------------------------------------------------------- history backfill
HISTORY = DATA / "prognosis_history.parquet"      # same schema as ARCHIVE: asof, kind, start, state, prob
HISTORY_PARTS = DATA / "prognosis_history"       # monthly parts YYYY-MM.parquet + YYYY-MM.json (done/rejected/failed)
HISTORY_PID = DATA / "logs" / "prognosis_history.pid"  # fra.history lowers its INAA concurrency while this exists
# Archive start (binary search 2026-10-31): every currentTime before ~2016-04-06 returns the archive's FIRST record
# (blocks from 2016-04-07 04:00 UTC). In data/prognosis.parquet the first main block never starts more than +5 h
# after asof (next-day prognosis visible from ~23 UTC), so responses whose first block starts > MAX_LEAD_H after
# currentTime are pre-archive / not-yet-published -> rejected (never stored: they would leak future information).
HISTORY_START = "2016-04-06 23:00"
MAX_LEAD_H = 5


def _schema(df):
    df = pd.DataFrame(df, columns=["asof", "kind", "start", "state", "prob"])
    for c in ["asof", "start"]:
        df[c] = pd.to_datetime(df[c], utc=True).astype("datetime64[us, UTC]")
    df["kind"], df["state"] = df["kind"].astype(str), df["state"].astype(str)
    df["prob"] = df["prob"].astype(float)
    return df


def _fetch_checked(t, attempts=6):
    """('ok', rows) | ('rejected', first-block offset h) | ('empty', None) | ('failed', error).
    Each request holds a cross-process INAA slot (fra.labels.inaa_slot: <= 3 INAA requests machine-wide)."""
    from fra.labels import inaa_slot
    for i in range(attempts):
        try:
            with inaa_slot():
                rows = fetch(t)
            if not rows:
                return "empty", None
            first = min(r["start"] for r in rows if r["kind"] == "main") if any(r["kind"] == "main" for r in rows) \
                else min(r["start"] for r in rows)
            off = (first - t) / pd.Timedelta(hours=1)
            return ("rejected", off) if off > MAX_LEAD_H else ("ok", rows)
        except Exception as ex:
            err = f"{type(ex).__name__}: {str(ex)[:100]}"
            time.sleep(min(120, 2 * 3 ** i))
    return "failed", err


def download_history(start=HISTORY_START, end="2025-04-30 23:00", pace=0.1, stop=None):
    """Hourly as-of snapshots, one request at a time (+`pace` s), newest month first. Resumable per hour:
    monthly part files are rewritten atomically after each month (and on SIGTERM); finished hours are skipped."""
    import json
    import os
    stop = stop or threading.Event()
    HISTORY_PARTS.mkdir(parents=True, exist_ok=True)
    HISTORY_PID.parent.mkdir(parents=True, exist_ok=True)
    HISTORY_PID.write_text(str(os.getpid()))
    hours = pd.date_range(pd.Timestamp(start, tz="UTC"), pd.Timestamp(end, tz="UTC"), freq="h")
    months = sorted(set(hours.strftime("%Y-%m")), reverse=True)
    t_start, n_req = time.monotonic(), 0
    try:
        for k, month in enumerate(months):
            if stop.is_set():
                break
            part, meta_p = HISTORY_PARTS / f"{month}.parquet", HISTORY_PARTS / f"{month}.json"
            meta = json.loads(meta_p.read_text()) if meta_p.exists() else {"rejected": {}, "empty": [], "failed": []}
            old = pd.read_parquet(part) if part.exists() else _schema([])
            mh = hours[hours.strftime("%Y-%m") == month]
            have = set(old["asof"]) | {pd.Timestamp(x) for x in list(meta["rejected"]) + meta["empty"]}
            todo = [t for t in mh if t not in have]
            if not todo:
                continue
            rows, meta["failed"] = [], []
            for t in todo:
                if stop.is_set():
                    break
                status, val = _fetch_checked(t)
                n_req += 1
                if status == "ok":
                    rows.extend(val)
                elif status == "rejected":
                    meta["rejected"][t.isoformat()] = val
                elif status == "empty":
                    meta["empty"].append(t.isoformat())
                else:
                    meta["failed"].append(t.isoformat())
                    print(f"failed {t}: {val}", flush=True)
                time.sleep(pace)
            new = pd.concat([old, _schema(rows)], ignore_index=True).sort_values(["asof", "kind", "start"])
            tmp = part.with_suffix(".tmp.parquet")
            new.to_parquet(tmp, index=False)
            os.replace(tmp, part)
            meta.update(hours=len(mh), ok=int(new["asof"].nunique()))
            tmp = meta_p.with_suffix(".tmp.json")
            tmp.write_text(json.dumps(meta))
            os.replace(tmp, meta_p)
            rate = n_req / (time.monotonic() - t_start)
            left = sum(1 for t in hours if t.strftime("%Y-%m") < month)
            print(f"{month}: {meta['ok']}/{len(mh)} hours ok, rejected {len(meta['rejected'])}, empty {len(meta['empty'])},"
                  f" failed {len(meta['failed'])}; {rate:.2f} req/s, ~{left / max(rate, 1e-9) / 3600:.1f} h left", flush=True)
            if k % 6 == 0:
                concat_history()
    finally:
        concat_history()
        HISTORY_PID.unlink(missing_ok=True)


def concat_history():
    """data/prognosis_history.parquet = all monthly parts (atomic)."""
    import os
    parts = sorted(HISTORY_PARTS.glob("????-??.parquet"))
    if not parts:
        return None
    df = pd.concat([pd.read_parquet(p) for p in parts], ignore_index=True).sort_values(["asof", "kind", "start"])
    df = df.drop_duplicates(["asof", "kind", "start"], keep="last").reset_index(drop=True)
    tmp = HISTORY.with_suffix(".tmp.parquet")
    df.to_parquet(tmp, index=False)
    os.replace(tmp, HISTORY)
    return df


def history_status():
    import json
    metas = {p.stem: json.loads(p.read_text()) for p in sorted(HISTORY_PARTS.glob("????-??.json"))}
    hours = sum(m.get("hours", 0) for m in metas.values())
    ok = sum(m.get("ok", 0) for m in metas.values())
    rej = sum(len(m["rejected"]) for m in metas.values())
    emp = sum(len(m["empty"]) for m in metas.values())
    fail = sum(len(m["failed"]) for m in metas.values())
    total = len(pd.date_range(pd.Timestamp(HISTORY_START, tz="UTC"), pd.Timestamp("2025-04-30 23:00", tz="UTC"), freq="h"))
    print(f"months touched {len(metas)}; hours ok {ok}, rejected {rej}, empty {emp}, failed {fail}; "
          f"{ok + rej + emp} of {total} hours done")
    if HISTORY.exists():
        h = pd.read_parquet(HISTORY, columns=["asof"])
        print(f"{HISTORY.name}: {len(h)} rows, {h['asof'].nunique()} as-of hours, {h['asof'].min()} .. {h['asof'].max()}")


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


if __name__ == "__main__" and sys.argv[1:2] == ["--history"]:  # backfill 2016-04 .. 2025-04 (detached job)
    _stop = threading.Event()
    signal.signal(signal.SIGTERM, lambda *a: _stop.set())
    download_history(*sys.argv[2:4], stop=_stop)
    history_status()
elif __name__ == "__main__" and sys.argv[1:2] == ["--history-status"]:
    history_status()
elif __name__ == "__main__":
    df = download(*(sys.argv[1:2] or []))
    print(df.shape, df["asof"].min(), df["asof"].max())
    f = features(pd.date_range("2026-10-28", periods=3, freq="h", tz="UTC"), [1, 24])
    print(f.round(2).to_string())
