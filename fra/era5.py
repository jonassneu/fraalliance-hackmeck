"""ERA5 reanalysis for EDDF (hourly, 2014 -> ~5 days ago) via the Open-Meteo archive API.

Source: https://archive-api.open-meteo.com/v1/archive (models=era5, https://open-meteo.com/en/docs/historical-weather-api).
ERA5 is a reanalysis (it uses observations after the valid time), so it is NOT available at forecast time: use it only
as an "observed weather" proxy for past hours (e.g. label sanity checks, switch-day detection, climatology, or as a
truth-side covariate), never as a forecast feature for hours after the issue time.

Grid point returned: 50.0 N, 8.5 E (0.25 deg grid), elevation 105 m. Wind in knots, UTC.
Output: data/era5.parquet, index `time` (UTC, hourly), one column per variable (Open-Meteo names).
Resumable: per-year part files in data/era5/ are reused; the final file is written atomically.
"""
import os
import random
import sys
import time
from pathlib import Path

import pandas as pd
import requests

DATA = Path(__file__).resolve().parent.parent / "data"
OUT = DATA / "era5.parquet"
PARTS = DATA / "era5"
URL = "https://archive-api.open-meteo.com/v1/archive"
LAT, LON = 50.0333, 8.5706
VARS = ["wind_speed_10m", "wind_direction_10m", "wind_gusts_10m", "wind_speed_100m", "wind_direction_100m",
        "temperature_2m", "pressure_msl"]


def _get(start, end):
    params = {"latitude": LAT, "longitude": LON, "start_date": start, "end_date": end, "hourly": ",".join(VARS),
              "models": "era5", "wind_speed_unit": "kn", "timezone": "GMT"}
    for attempt in range(8):
        try:
            r = requests.get(URL, params=params, timeout=180)
            if r.status_code == 429 or r.status_code >= 500:
                raise requests.HTTPError(f"HTTP {r.status_code}: {r.text[:200]}")
            r.raise_for_status()
            h = pd.DataFrame(r.json()["hourly"])
            h["time"] = pd.to_datetime(h["time"], utc=True)
            return h.set_index("time")
        except (requests.RequestException, ValueError) as ex:
            if attempt == 7:
                raise
            wait = min(300, 15 * 2 ** attempt) + random.random()
            print(f"ERA5 {start}..{end} attempt {attempt}: {ex}; retry in {wait:.0f}s", flush=True)
            time.sleep(wait)


def download(start="2014-01-01", end=None):
    """One request per calendar year (counts as ~26 weighted Open-Meteo calls each). Past full years are cached."""
    end = pd.Timestamp(end) if end else pd.Timestamp.now("UTC").tz_localize(None).normalize()
    this_year = pd.Timestamp.now("UTC").year
    PARTS.mkdir(parents=True, exist_ok=True)
    parts = []
    for year in range(pd.Timestamp(start).year, end.year + 1):
        part = PARTS / f"{year}.parquet"
        s = max(pd.Timestamp(start), pd.Timestamp(f"{year}-01-01"))
        e = min(end, pd.Timestamp(f"{year}-12-31"))
        if part.exists() and year < this_year:
            parts.append(pd.read_parquet(part))
            continue
        d = _get(f"{s:%Y-%m-%d}", f"{e:%Y-%m-%d}")
        d = d.dropna(how="all")  # the most recent ~5 days are not yet in ERA5
        tmp = part.with_suffix(".tmp.parquet")
        d.to_parquet(tmp)
        os.replace(tmp, part)
        print(f"ERA5 {year}: {len(d)} hours, {d.index.min()} .. {d.index.max()}", flush=True)
        parts.append(d)
        time.sleep(3)
    out = pd.concat(parts).sort_index()
    out = out[~out.index.duplicated(keep="last")]
    tmp = OUT.with_suffix(".tmp.parquet")
    out.to_parquet(tmp)
    os.replace(tmp, OUT)
    return out


def load():
    return pd.read_parquet(OUT)


if __name__ == "__main__":
    df = download(*sys.argv[1:3])
    print("era5", df.shape, df.index.min(), df.index.max())
    full = pd.date_range(df.index.min(), df.index.max(), freq="h")
    print("missing hours", len(full.difference(df.index)), "NaN per column:\n", df.isna().sum().to_string())
