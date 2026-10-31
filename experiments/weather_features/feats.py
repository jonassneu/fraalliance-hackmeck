"""Candidate weather features for the OD model. All computed from runs available at issue time:
ECMWF rows already use run_init <= issue-6h; previous runs are older -> also available."""
import numpy as np
import pandas as pd

from experiments.harness import ROOT
from fra.rules import tailwind, crosswind

DATA = ROOT / "data"


def _ifs():
    r = pd.read_parquet(DATA / "ifs_runs.parquet")
    u = pd.read_parquet(DATA / "ifs_runs_upper.parquet")[["init", "valid", "wind_speed_100m", "wind_direction_100m"]]
    r = r.merge(u, on=["init", "valid"], how="left")
    r["tw25"] = tailwind(r.wind_speed, r.wind_direction, 250)
    r["tw25g"] = tailwind(r.wind_gusts, r.wind_direction, 250)
    r["tw25_100"] = tailwind(r.wind_speed_100m, r.wind_direction_100m, 250)
    return r.set_index(["init", "valid"]).sort_index()


def _lookup(tab, col, init, valid):
    idx = pd.MultiIndex.from_arrays([init, valid])
    return tab[col].reindex(idx).to_numpy()


def add_weather_feats(d):
    d = d.copy()
    r = _ifs()
    ri, v = d["run_init"], d["valid"]
    # --- run-to-run revisions (lagged ensemble of ECMWF runs: latest, -6h, -12h, -18h)
    lag = {k: _lookup(r, "tw25", ri - pd.Timedelta(hours=6 * k), v) for k in range(0, 4)}
    d["tw25_prevrun"] = lag[1]
    d["tw25_rev"] = d["tw25"] - lag[1]
    d["tw25_absrev"] = np.abs(d["tw25_rev"])
    L = np.vstack([lag[k] for k in range(4)])
    d["tw25_lagmean"] = np.nanmean(L, axis=0)
    d["tw25_lagstd"] = np.nanstd(L, axis=0)
    # --- ECMWF vs ICON disagreement
    d["ec_icon_diff"] = (d["tw25"] - d["icon_tw25"])
    d["ec_icon_absdiff"] = d["ec_icon_diff"].abs()
    # --- shear 10 m vs 100 m, gusts
    d["shear_tw25"] = d["tw25_100m"] - d["tw25"]
    d["tw25_gust"] = tailwind(d["wind_gusts"], d["wind_direction"], 250)
    d["xw25_signed"] = d["wind_speed"] * np.sin(np.radians(d["wind_direction"] - 250))
    # --- soft threshold transforms
    for s in [1.5, 3.0]:
        d[f"tw25_sig{s}"] = np.tanh(d["tw25_cons"].fillna(d["tw25"]) / s)
    d["tw25_sig_ec"] = np.tanh(d["tw25"] / 2.0)
    d["tw25_pos"] = d["tw25"].clip(lower=0)
    d["tw25_neg"] = d["tw25"].clip(upper=0)
    d["tw25_ge10"] = (d["tw25"] >= 10).astype(float)
    d["tw07_ge10"] = (d["tw25"] <= -10).astype(float)
    # --- integrated tailwind over the next/previous N hours (same run, exact valid times)
    for N in [6, 12]:
        fut = np.vstack([_lookup(r, "tw25", ri, v + pd.Timedelta(hours=h)) for h in range(0, N + 1)])
        past = np.vstack([_lookup(r, "tw25", ri, v - pd.Timedelta(hours=h)) for h in range(0, N + 1)])
        d[f"tw25_fut{N}"] = np.nanmean(fut, axis=0)
        d[f"tw25_past{N}"] = np.nanmean(past, axis=0)
        d[f"tw25_pastmax{N}"] = np.nanmax(past, axis=0)
        d[f"tw25_pastmin{N}"] = np.nanmin(past, axis=0)
        d[f"frac_tw_pos_past{N}"] = np.nanmean(past > 0, axis=0)
    # tailwind from issue to valid along the forecast path (what the OD has to "go through")
    # --- pressure tendency (same run)
    p6 = _lookup(r, "pressure_msl", ri, v - pd.Timedelta(hours=6))
    d["dp6"] = d["pressure_msl"] - p6
    d["p_anom"] = d["pressure_msl"] - 1015
    # --- wind direction regimes
    wd = d["wind_direction"]
    d["east_regime"] = (((wd >= 0) & (wd <= 120)) & (d["wind_speed"] >= 3)).astype(float)
    d["ne_regime"] = (((wd >= 20) & (wd <= 90)) & (d["wind_speed"] >= 3)).astype(float)
    d["calm"] = (d["wind_speed"] < 4).astype(float)
    d["u"] = -d["wind_speed"] * np.sin(np.radians(wd))
    d["vv"] = -d["wind_speed"] * np.cos(np.radians(wd))
    # --- convection / precip / inversion proxy
    d["cape_log"] = np.log1p(d["cape"].clip(lower=0))
    d["precip_log"] = np.log1p(d["precipitation"].clip(lower=0))
    d["ws_ratio100"] = (d["wind_speed_100m"] / (d["wind_speed"] + 2)).clip(0, 6)
    d["inv_night"] = d["ws_ratio100"] * d["night"]
    # --- tailwind interacted with uncertainty and lead
    d["tw25_over_unc"] = d["tw25_cons"].fillna(d["tw25"]) / (2 + d["tw25_lagstd"].fillna(0) + d["ec_icon_absdiff"].fillna(0))
    d["tw25_x_lead"] = d["tw25"] * d["lead"] / 48
    d["calm_x_tw"] = d["calm"] * d["tw25"]
    return d
