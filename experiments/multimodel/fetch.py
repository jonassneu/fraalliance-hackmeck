"""Archive as-issued single runs of further NWP models for EDDF (Open-Meteo Single Runs API), UTC and knots.

    uv run python experiments/multimodel/fetch.py                       # all models, their default cycles
    uv run python experiments/multimodel/fetch.py --models ukmo,aifs --cycles 0 --step-days 1   # pilot: 00 UTC daily

Why: adding DWD ICON-D2 to the ECMWF centre of the Part B wind paths was the largest end-to-end gain of the wind layer
(OD Brier(1,6,24,48) 0.0450 -> 0.0408, experiments/partb/REPORT.md); spread re-tuning never moved it. This study
tests whether more independent models make a better centre (experiments/multimodel/REPORT.md).

Archives start 2026-04-02 for all of these (probed 2026-11-05: 2026-04-01 'not available', 2026-04-15 present).
HOLDOUT: inits are capped at 2026-10-31 18 UTC, so nothing here is fetched for the locked holdout period.
Publication buffers = Open-Meteo meta.json availability lag on 2026-11-05 (init -> last_run_availability_time)
rounded up plus >= 1 h margin. They are assumptions for the as-of rule, not per-run metadata.
"""
import argparse
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import numpy as np
import pandas as pd
import requests

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from fra.singleruns import SINGLE  # noqa: E402

OUT = ROOT / "data" / "multimodel"
LAT, LON = 50.0333, 8.5706
NAMES = {"wind_speed_10m": "wind_speed", "wind_direction_10m": "wind_direction", "wind_gusts_10m": "wind_gusts"}
START, END = "2026-04-02", pd.Timestamp("2026-10-31 18:00", tz="UTC")   # END: last init (holdout lock)
MAX_LEAD = 54

# key -> (Open-Meteo model id, cycles (UTC hours), buffer h, measured lag h on 2026-11-05)
MODELS = {
    "aifs": ("ecmwf_aifs025_single", (0, 6, 12, 18), 7, 5.6),
    "ukmo": ("ukmo_global_deterministic_10km", (0, 6, 12, 18), 10, 8.5),
    "knmi": ("knmi_harmonie_arome_europe", (0, 3, 6, 9, 12, 15, 18, 21), 4, 2.6),
    "dmi": ("dmi_harmonie_arome_europe", (0, 3, 6, 9, 12, 15, 18, 21), 4, 2.8),
    "arome": ("meteofrance_arome_france_hd", (0, 3, 6, 9, 12, 15, 18, 21), 5, 3.9),
    "arpege": ("meteofrance_arpege_europe", (0, 6, 12, 18), 5, 3.7),
    "gfs": ("gfs_global", (0, 6, 12, 18), 10, 8.6),
}

_tls = threading.local()


def _session():
    if not hasattr(_tls, "s"):
        _tls.s = requests.Session()
    return _tls.s


def path(key):
    return OUT / f"{key}_runs.parquet"


MIN_INTERVAL_S = 0.9          # all threads together: <= ~66 requests/min, ~4,000/h (free tier: 600/min, 5,000/h)
_rate_lock = threading.Lock()
_last = [0.0]


def quiet():
    """Keep the live forecast job (fra-archive.timer, :30 local; same Open-Meteo quota) safe: no requests in minutes
    25..39 of each hour, and a global request rate well below the free-tier hourly limit."""
    m = pd.Timestamp.now().minute
    if 25 <= m < 40:
        time.sleep((40 - m) * 60)
    with _rate_lock:
        wait = _last[0] + MIN_INTERVAL_S - time.monotonic()
        if wait > 0:
            time.sleep(wait)
        _last[0] = time.monotonic()


def fetch_run(model, init, timeout=(10, 60), tries=4):
    params = dict(latitude=LAT, longitude=LON, models=model, hourly=",".join(NAMES), wind_speed_unit="kn",
                  timezone="GMT", run=init.strftime("%Y-%m-%dT%H:%M"))
    for k in range(tries):
        try:
            r = _session().get(SINGLE, params=params, timeout=timeout)
            if r.status_code == 429 or r.status_code >= 500:
                raise requests.HTTPError(f"HTTP {r.status_code}")
            j = r.json()
            break
        except (requests.RequestException, ValueError) as ex:
            if k == tries - 1:
                raise
            time.sleep(5 * 2 ** k)
    if j.get("error"):
        raise LookupError(j.get("reason"))
    d = pd.DataFrame(j["hourly"]).rename(columns={"time": "valid", **NAMES})
    d["valid"] = pd.to_datetime(d.valid, utc=True)
    d = d.set_index("valid").reindex(pd.date_range(init, periods=MAX_LEAD + 1, freq="h"))
    d.index.name = "valid"
    if d.wind_speed.isna().all():
        raise LookupError("run has no wind data")
    d["init"], d["lead_h"] = init, np.arange(MAX_LEAD + 1)
    return d.reset_index()[["init", "valid", "lead_h", *NAMES.values()]]


def download(key, cycles=None, step_days=None, workers=2, start=START):
    model, default_cycles, _, _ = MODELS[key]
    inits = pd.date_range(pd.Timestamp(start, tz="UTC"), END, freq="h")
    inits = inits[inits.hour.isin(cycles or default_cycles)]
    if step_days:
        inits = inits[((inits - inits[0]).days % step_days) == 0]
    OUT.mkdir(parents=True, exist_ok=True)
    old = pd.read_parquet(path(key)) if path(key).exists() else pd.DataFrame()
    done = set(old.init.unique()) if not old.empty else set()
    pending = [i for i in inits if i not in done]
    parts, missing = ([old] if not old.empty else []), []

    def save():
        if parts:
            d = pd.concat(parts, ignore_index=True).drop_duplicates(["init", "valid"], keep="last")
            d = d.sort_values(["init", "valid"])
            tmp = path(key).with_suffix(".tmp.parquet")
            d.to_parquet(tmp, index=False)
            tmp.replace(path(key))
            parts[:] = [d]

    print(f"{key} ({model}): {len(pending)} pending, {len(done)} cached", flush=True)

    def job(i):
        time.sleep(0.5)
        quiet()
        return fetch_run(model, i)

    with ThreadPoolExecutor(max_workers=workers) as pool:
        futs = {pool.submit(job, i): i for i in pending}
        for n, f in enumerate(as_completed(futs), 1):
            try:
                parts.append(f.result())
            except LookupError:
                missing.append(futs[f])
            except Exception as ex:  # network: retry on the next call
                print(f"  failed {futs[f]}: {type(ex).__name__} {ex}", flush=True)
            if n % 100 == 0:
                save()
                print(f"  {key} {n}/{len(pending)}", flush=True)
    save()
    print(f"{key}: done, {len(missing)} runs not available", flush=True)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", default=",".join(MODELS))
    ap.add_argument("--cycles", default=None, help="comma-separated UTC hours (default: the model's cycles)")
    ap.add_argument("--step-days", type=int, default=None)
    ap.add_argument("--workers", type=int, default=2)
    a = ap.parse_args()
    cyc = tuple(int(c) for c in a.cycles.split(",")) if a.cycles else None
    for k in a.models.split(","):
        download(k, cyc, a.step_days, a.workers)
