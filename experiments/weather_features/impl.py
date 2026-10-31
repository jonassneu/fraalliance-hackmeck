"""Drop-in implementation of the recommended weather features (for fra/dataset.py).

add_weather_extras(d, runs) needs:
  d    : feature table with run_init, valid, lead, tw25, tw25_100m, tw25_cons (as produced by fra.dataset.build)
  runs : ECMWF run table with columns init, valid, wind_speed, wind_direction (pd.read_parquet(singleruns.ARCHIVE),
         or the live_run() frame in live mode). Uses only the run d.run_init (<= issue-6h) and, for tw25_rev,
         the run 6 h older -> no future information.
"""
import numpy as np
import pandas as pd

from fra.rules import tailwind


def add_weather_extras(d, runs, with_rev=True):
    r = runs.assign(tw25=tailwind(runs.wind_speed, runs.wind_direction, 250),
                    xw25=runs.wind_speed * np.sin(np.radians(runs.wind_direction - 250)))  # + = wind from north side
    r = r.set_index(["init", "valid"]).sort_index()

    def at(col, init, hours):  # forecast of `col` by run `init` for valid + hours (NaN if not in the run)
        return r[col].reindex(pd.MultiIndex.from_arrays([init, d["valid"] + pd.Timedelta(hours=hours)])).to_numpy()

    ri = d["run_init"]
    # 1) lowest forecast tailwind on 25 over the 6 h before the valid time (same run): did an east spell just end?
    d["tw25_pastmin6"] = np.nanmin(np.vstack([at("tw25", ri, -h) for h in range(0, 7)]), axis=0)
    # 2) mean signed crosswind over the next 12 h (same run), squashed and only active when wind has an east component:
    #    NE ("Bise", persistent) -> OD 07; SE (pre-frontal, veers to SW) -> often stays OD 25
    xw_fut12 = np.nanmean(np.vstack([at("xw25", ri, h) for h in range(0, 13)]), axis=0)
    tw = d["tw25_cons"].fillna(d["tw25"])
    d["xwf_east_tanh"] = np.tanh(xw_fut12 / 3) / (1 + np.exp(-tw / 2))
    # 3) vertical shear of the tailwind component, 100 m minus 10 m
    d["shear_tw25"] = d["tw25_100m"] - d["tw25"]
    # 4) run-to-run revision: latest minus previous (6 h older) ECMWF run for the same valid time
    if with_rev:
        d["tw25_rev"] = d["tw25"] - at("tw25", ri - pd.Timedelta(hours=6), 0)
    return d
