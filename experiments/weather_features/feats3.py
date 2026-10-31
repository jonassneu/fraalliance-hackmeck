"""Round 3: window variants of the forward-looking crosswind/tailwind means (same ECMWF run, exact valid times)."""
import numpy as np
import pandas as pd

from experiments.weather_features.feats import _ifs, _lookup
from experiments.weather_features.feats2 import xw


def window_mean(r, col, ri, v, h0, h1):
    """Mean of run `ri`'s forecast of `col` over valid+h0 .. valid+h1 (inclusive), NaN-tolerant."""
    return np.nanmean(np.vstack([_lookup(r, col, ri, v + pd.Timedelta(hours=h)) for h in range(h0, h1 + 1)]), axis=0)


def add_round3(d):
    d = d.copy()
    r = _ifs()
    r["xw25s"] = xw(r.wind_speed, r.wind_direction)
    r["xw25s_100"] = xw(r.wind_speed_100m, r.wind_direction_100m)
    ri, v = d["run_init"], d["valid"]
    for a, b in [(0, 6), (0, 18), (0, 24), (-6, 6), (-12, 0), (6, 18), (-12, 12)]:
        d[f"xw25_w{a}_{b}"] = window_mean(r, "xw25s", ri, v, a, b)
    d["xw100_fut12"] = window_mean(r, "xw25s_100", ri, v, 0, 12)
    for a, b in [(0, 18), (0, 24), (6, 18)]:
        d[f"tw25_w{a}_{b}"] = window_mean(r, "tw25", ri, v, a, b)
    d["tw25_100_fut12"] = window_mean(r, "tw25_100", ri, v, 0, 12)
    # previous run's forward crosswind (stability of the regime signal)
    d["xw25_fut12_prevrun"] = window_mean(r, "xw25s", ri - pd.Timedelta(hours=6), v, 0, 12)
    d["xw25_fut12_lag"] = (d["xw25_fut12"] + d["xw25_fut12_prevrun"].fillna(d["xw25_fut12"])) / 2
    return d
