"""Public weather data for EDDF: Open-Meteo archived forecasts (honest leads), live forecast, METAR (IEM)."""

import io
from pathlib import Path

import pandas as pd
import requests

LAT, LON = 50.0333, 8.5706
DATA = Path(__file__).resolve().parent.parent / "data"
VARS = ["wind_speed_10m", "wind_direction_10m", "wind_gusts_10m", "temperature_2m",
        "precipitation", "pressure_msl", "cloud_cover", "visibility"]
PREV_DAYS = [0, 1, 2]  # forecast issued ~0/24/48 h before the valid time

PREVIOUS_RUNS = "https://previous-runs-api.open-meteo.com/v1/forecast"   # https://open-meteo.com/en/docs/previous-runs-api
FORECAST = "https://api.open-meteo.com/v1/forecast"                      # https://open-meteo.com/en/docs
IEM_ASOS = "https://mesonet.agron.iastate.edu/cgi-bin/request/asos.py"   # https://mesonet.agron.iastate.edu/request/download.phtml
LIVE_TIMEOUT = (5, 30)  # (connect, read) seconds for the live forecast path: the hourly job must not stall on one request


def _hourly(url, params, timeout=120):
    r = requests.get(url, params=params, timeout=timeout)
    r.raise_for_status()
    h = r.json()["hourly"]
    df = pd.DataFrame(h)
    df["time"] = pd.to_datetime(df["time"], utc=True)
    return df.set_index("time")


def archived_forecasts(start="2024-01-01", end=None, model="best_match"):
    """Hourly forecasts for each valid time as issued 0/1/2 days earlier. Columns: <var>_d<k>."""
    end = end or pd.Timestamp.now("UTC").strftime("%Y-%m-%d")
    names = [v if k == 0 else f"{v}_previous_day{k}" for k in PREV_DAYS for v in VARS]
    parts = []
    for s, e in _chunks(start, end, months=6):
        parts.append(_hourly(PREVIOUS_RUNS, {
            "latitude": LAT, "longitude": LON, "hourly": ",".join(names), "models": model,
            "wind_speed_unit": "kn", "start_date": s, "end_date": e, "timezone": "GMT"}))
    df = pd.concat(parts)
    df = df[~df.index.duplicated()]
    df.columns = [_rename(c) for c in df.columns]
    return df


def live_forecast(model="best_match", past_days=2, timeout=120):
    df = _hourly(FORECAST, {
        "latitude": LAT, "longitude": LON, "hourly": ",".join(VARS), "models": model,
        "wind_speed_unit": "kn", "past_days": past_days, "forecast_days": 3, "timezone": "GMT"}, timeout=timeout)
    df.columns = [f"{c}_d0" for c in df.columns]
    return df


def metar(start="2024-01-01", end=None, timeout=300):
    """EDDF METAR obs (wind in kt), resampled to hourly means of components later. timeout: requests timeout (the
    long default is for multi-year downloads; the live forecast passes LIVE_TIMEOUT)."""
    end = pd.Timestamp(end) if end else pd.Timestamp.now("UTC") + pd.Timedelta(days=1)
    s = pd.Timestamp(start)
    params = [("station", "EDDF"), ("data", "drct"), ("data", "sknt"), ("data", "gust"),
              ("data", "vsby"), ("data", "metar"), ("tz", "Etc/UTC"), ("format", "onlycomma"),
              ("latlon", "no"), ("missing", "empty"), ("trace", "empty"), ("report_type", "3"),
              ("year1", s.year), ("month1", s.month), ("day1", s.day),
              ("year2", end.year), ("month2", end.month), ("day2", end.day)]
    r = requests.get(IEM_ASOS, params=params, timeout=timeout)
    r.raise_for_status()
    df = pd.read_csv(io.StringIO(r.text))
    df["time"] = pd.to_datetime(df["valid"], utc=True)
    return df.drop(columns=["valid"]).set_index("time").sort_index()


def metar_full(start="2014-01-01", end=None, out=DATA / "metar_full.parquet"):
    """METAR EDDF from `start` to now, one IEM request per calendar year (same columns as data/metar.parquet).

    Writes a NEW file (atomic tmp + os.replace); data/metar.parquet is left alone. Retries each year with backoff.
    """
    import os
    import time
    end = pd.Timestamp(end) if end else pd.Timestamp.now("UTC").tz_localize(None) + pd.Timedelta(days=1)
    parts = []
    for year in range(pd.Timestamp(start).year, end.year + 1):
        s = max(pd.Timestamp(start), pd.Timestamp(f"{year}-01-01"))
        e = min(end, pd.Timestamp(f"{year + 1}-01-01"))  # IEM end day is exclusive
        for attempt in range(6):
            try:
                df = metar(s, e)
                break
            except Exception as ex:  # IEM throttles bursts; back off and retry
                print(f"metar {year} attempt {attempt}: {ex}", flush=True)
                time.sleep(10 * 2 ** attempt)
        else:
            raise RuntimeError(f"METAR {year} failed")
        print(f"metar {year}: {len(df)} rows", flush=True)
        parts.append(df)
        time.sleep(2)
    m = pd.concat(parts).sort_index()  # yearly chunks are disjoint (IEM end day exclusive)
    tmp = out.with_suffix(".tmp.parquet")
    m.to_parquet(tmp)
    os.replace(tmp, out)
    return m


def _rename(c):
    for k in PREV_DAYS[1:]:
        if c.endswith(f"_previous_day{k}"):
            return c.replace(f"_previous_day{k}", f"_d{k}")
    return f"{c}_d0"


def _chunks(start, end, months):
    s, e = pd.Timestamp(start), pd.Timestamp(end)
    while s <= e:
        n = min(s + pd.DateOffset(months=months) - pd.Timedelta(days=1), e)
        yield s.strftime("%Y-%m-%d"), n.strftime("%Y-%m-%d")
        s = n + pd.Timedelta(days=1)


def _main():
    import sys
    if sys.argv[1:2] == ["--metar-full"]:  # 2014 -> now, per-year chunks -> data/metar_full.parquet (new file)
        m = metar_full(*(sys.argv[2:3] or []))
        print("metar_full", m.shape, m.index.min(), m.index.max(), "dup index", m.index.duplicated().sum())
        return True
    return False


if __name__ == "__main__" and not _main():
    DATA.mkdir(exist_ok=True)
    fc = archived_forecasts()
    fc.to_parquet(DATA / "forecasts.parquet")
    print("forecasts", fc.shape, fc.index.min(), fc.index.max())
    m = metar()
    m.to_parquet(DATA / "metar.parquet")
    print("metar", m.shape, m.index.min(), m.index.max())

