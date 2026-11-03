"""Small COVID preview before the backfill reaches 2020: classify a few pass-1 hours (window ends 07/13/19 UTC) of
2020-21 and 2019 (reference) with the production classifier, without writing to any shared file.

    uv run python experiments/history12/covid_probe.py      # ~30 sequential INAA requests, each holding one INAA slot

Output: covid_probe.csv (hour start UTC, west, east, rwy18 departures, movements, local hour). The backfill fetches
these hours again later (it does not see this file); the probe is only a preview of movement counts against the
>= 4 (OD label), >= 10 (backfill suspect rule) and >= 15 (RWY 18 judged) thresholds.
"""

import time

import pandas as pd
import requests

import h12lib as L
from fra.labels import classify, fetch_hour

DAYS = ["2019-04-16", "2020-04-15", "2020-04-22", "2020-05-13", "2020-06-17", "2020-11-18", "2021-01-20",
        "2021-03-17", "2021-06-16", "2021-09-15"]
ENDS = (7, 13, 19)


def main():
    s = requests.Session()
    rows = []
    for d in DAYS:
        for h in ENDS:
            t = pd.Timestamp(f"{d}T{h:02d}:00", tz="UTC")
            t0 = time.monotonic()
            try:
                w, e, r18 = classify(fetch_hour(t, timeout=120, session=s, check=True))
                err = ""
            except Exception as ex:  # keep going: a preview only
                w = e = r18 = None
                err = str(ex)[:80]
            start = t - pd.Timedelta(hours=1)
            rows.append({"time": start, "local_hour": start.tz_convert(L.TZ).hour, "west": w, "east": e,
                         "rwy18_deps": r18, "n": None if w is None else w + e, "sec": round(time.monotonic() - t0, 1),
                         "error": err})
            print(rows[-1], flush=True)
    df = pd.DataFrame(rows)
    L.atomic_write(df, L.OUT / "covid_probe.csv", index=False)
    return df


if __name__ == "__main__":
    main()
