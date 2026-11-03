"""Oracle production: the production OD model (fra.train via experiments.harness, same weekly folds, same rows) with
every WEATHER-FORECAST input replaced by the OBSERVED value at the valid time -- the 'perfect wind forecast' version of
the production model class (review of Part A: the decision-model rollout is only one model given perfect wind, so it
cannot by itself split production's error into 'wind forecast' and 'behaviour').

Replaced (observed = fra.decision.load_obs: METAR u/v averaged over (h-1 h, h]; 100 m = ERA5):
    tw25, tw25_cons            observed tailwind on 25 at the valid hour
    tw25_prev3 / tw25_next3    observed at valid -3 h / +3 h
    tw25_roll6, tw25_cons_roll6 mean of observed valid-3 .. valid+2 (the fra.singleruns window)
    tw25_pastmin6              min observed valid-6 .. valid
    xwf_east_tanh              observed crosswind mean valid .. valid+12 h, same squashing as fra.dataset
    tw25_100m                  ERA5 100 m tailwind (ERA5 ends 2026-10-25 23 UTC: later rows keep the forecast value)
    shear_tw25                 tw25_100m - tw25
    rule_od25                  official rule on the observed tailwind (as fra.train.baselines)
Kept: INAA published prognosis (prog_signed, prog_alt_signed: the airport's own forecast, known at issue time),
od_now25, hour/night. Hours with no observation keep the forecast value (rare: load_obs fills gaps <= 3 h).

    uv run python experiments/parta/oracle.py   -> pred_oracle_production.parquet, res_oracle.json
"""

import json
import warnings

import numpy as np
import pandas as pd

import common as C
from common import D


def oracle_table(d, obs):
    v = pd.DatetimeIndex(d["valid"])
    s = pd.Series(D.tailwind_uv(obs["u"].to_numpy(), obs["v"].to_numpy(), 250.0), index=obs.index)
    xs = pd.Series(D.crosswind_uv(obs["u"].to_numpy(), obs["v"].to_numpy(), 250.0), index=obs.index)
    at = lambda ser, h: ser.reindex(v + h * C.HOUR).to_numpy()
    keep = lambda new, col: np.where(np.isfinite(new), new, d[col].to_numpy(dtype=float))
    o = d.copy()
    tw = at(s, 0)
    o["tw25"] = keep(tw, "tw25")
    o["tw25_cons"] = keep(tw, "tw25_cons")
    o["tw25_prev3"] = keep(at(s, -3), "tw25_prev3")
    o["tw25_next3"] = keep(at(s, 3), "tw25_next3")
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", RuntimeWarning)   # all-NaN windows -> NaN -> forecast value kept
        roll = np.nanmean(np.vstack([at(s, h) for h in range(-3, 3)]), axis=0)
        pmin = np.nanmin(np.vstack([at(s, -h) for h in range(0, 7)]), axis=0)
        xw12 = np.nanmean(np.vstack([at(xs, h) for h in range(0, 13)]), axis=0)
    o["tw25_roll6"] = keep(roll, "tw25_roll6")
    o["tw25_cons_roll6"] = keep(roll, "tw25_cons_roll6")
    o["tw25_pastmin6"] = keep(pmin, "tw25_pastmin6")
    o["xwf_east_tanh"] = keep(np.tanh(xw12 / 3) / (1 + np.exp(-o["tw25"].to_numpy() / 2)), "xwf_east_tanh")
    era5_ok = np.zeros(len(d), bool)
    if {"u100", "v100"} <= set(obs.columns):
        s100 = pd.Series(D.tailwind_uv(obs["u100"].to_numpy(), obs["v100"].to_numpy(), 250.0), index=obs.index)
        t100 = at(s100, 0)
        era5_ok = np.isfinite(t100)
        o["tw25_100m"] = keep(t100, "tw25_100m")
    o["shear_tw25"] = o["tw25_100m"] - o["tw25"]
    t = o["tw25"].to_numpy()
    o["rule_od25"] = np.where(t > 1, 0, np.where(t < -1, 1, (o["od_now"] == 25).astype(int)))
    return o, era5_ok


def main():
    from experiments import harness as Hn
    d = Hn.load()
    obs = D.load_obs()
    o, era5_ok = oracle_table(d, obs)
    o["era5_100m"] = era5_ok
    z, y, p, ok = Hn.walk_forward(o, "od25", Hn.prod_model("od25"))
    t = z.loc[ok, ["issue", "lead", "era5_100m"]].copy()
    t["p_oracle"] = p[ok]
    C.atomic_parquet(t.reset_index(drop=True), C.OUT / "pred_oracle_production.parquet")
    prod = C.prod_table()
    m = prod.merge(t, on=["issue", "lead"], how="inner")
    res = {"rows": len(m), "rows_prod": len(prod), "oracle_production": C.rollout_metrics(m, "p_oracle"),
           "production": C.rollout_metrics(m, "p_prod")}
    (C.OUT / "res_oracle.json").write_text(json.dumps(res, indent=1))
    for k in ("production", "oracle_production"):
        x = res[k]
        print(f"{k:18s} acc " + "/".join(f"{100 * x[f'acc{L}']:.1f}" for L in C.LEADS)
              + f" B={x['brier_1_6_24_48']:.4f} (rows {res['rows']} of {res['rows_prod']})")


if __name__ == "__main__":
    main()
