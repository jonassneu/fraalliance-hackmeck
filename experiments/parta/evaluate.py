"""Part A walk-forward evaluation of the hourly decision model (fra/decision.py).

Weekly folds from evalkit.TEST_START (2026-06-01) to the holdout (2026-11-01). For each test week the model is trained
only on transition rows whose target hour h satisfies h + 6 h <= week start (the next-6 h actual wind of a training
row is also observed before the week starts).

(a) one-step: P(OD_h | OD_{h-1}, actual wind) on observed transition rows of the week -> log-loss, Brier, switch
    detection (precision / recall within +-1 h).
(b) 'perfect forecast' upper bound: from every production test issue time t roll the model out over label hours
    t..t+48 using the ACTUAL observed wind path, score P(OD 25) at the production (issue, lead) rows side by side
    with the production model (identical rows). Plus a plug-in variant with the deterministic as-of ECMWF IFS path.

    uv run python experiments/parta/evaluate.py [--ifs] [variant ...]   -> experiments/parta/res_<variant>.json + preds
    PARTA_HISTORY=1 uv run python experiments/parta/evaluate.py ...    -> train on labels incl. the 2014+ backfill
                                                                          (fra.labels.load_counts(include_history=True))
"""

import json
import sys
import time
from concurrent.futures import ProcessPoolExecutor

import numpy as np
import pandas as pd

import common as C
from common import D

F6 = ["twA_f6mean", "twA_f6max", "twA_f6min"]
HINGE = ["twA_0_pos", "twA_n3mean_pos"]
H100 = ["twAh_0", "twAh_n3mean", "twAh_n3max", "twAh_p6mean"]
LGB_BASE = [f for f in D.BASE if not f.startswith("morn_")]
SMALL = dict(n_estimators=150, num_leaves=4, min_child_samples=50)

VARIANTS = {
    "logit_C0.03": dict(kind="logit", C=0.03, features=D.BASE),
    "logit_C0.1": dict(kind="logit", C=0.1, features=D.BASE),
    "logit_C0.3": dict(kind="logit", C=0.3, features=D.BASE),
    "logit_C1": dict(kind="logit", C=1.0, features=D.BASE),
    "logit_C0.1_dur": dict(kind="logit", C=0.1, features=D.BASE + ["log_dur"]),
    "logit_C0.1_100m": dict(kind="logit", C=0.1, features=D.BASE + ["twAh_0", "twAh_n3mean"]),
    "logit_C0.1_nofuture": dict(kind="logit", C=0.1, features=[f for f in D.BASE if "n3" not in f]),
    "logit_C0.1_compact": dict(kind="logit", C=0.1, features=["twA_0", "twA_n3mean", "twA_n3max", "twAg_n3max",
                                                              "twA_p6min", "morning", "morn_twA_0", "hour_sin",
                                                              "hour_cos"]),
    "logit_C0.1_f6": dict(kind="logit", C=0.1, features=D.BASE + F6),
    "logit_C0.1_hinge": dict(kind="logit", C=0.1, features=D.BASE + HINGE),
    "logit_C0.1_100m4": dict(kind="logit", C=0.1, features=D.BASE + H100),
    "logit_C0.1_100m4_f6": dict(kind="logit", C=0.1, features=D.BASE + H100 + F6),
    "logit_C0.1_all": dict(kind="logit", C=0.1, features=D.BASE + H100 + F6 + HINGE),
    "logit_C0.03_all": dict(kind="logit", C=0.03, features=D.BASE + H100 + F6 + HINGE),
    "lgbm_mono_small_100m4": dict(kind="lgbm", features=LGB_BASE + H100, lgb_params=SMALL),
    "lgbm_mono_small_100m4_f6": dict(kind="lgbm", features=LGB_BASE + H100 + F6, lgb_params=SMALL),
    "lgbm_mono_small_f6": dict(kind="lgbm", features=LGB_BASE + F6, lgb_params=SMALL),
    "logit_C0.03_f6": dict(kind="logit", C=0.03, features=D.BASE + F6),
    "logit_C0.03_100m4_f6": dict(kind="logit", C=0.03, features=D.BASE + H100 + F6),
    "lgbm_ms_100m4_f6_n100": dict(kind="lgbm", features=LGB_BASE + H100 + F6, lgb_params={**SMALL, "n_estimators": 100}),
    "lgbm_ms_100m4_f6_n250": dict(kind="lgbm", features=LGB_BASE + H100 + F6, lgb_params={**SMALL, "n_estimators": 250}),
    "lgbm_ms_100m4_f6_l3": dict(kind="lgbm", features=LGB_BASE + H100 + F6, lgb_params={**SMALL, "num_leaves": 3}),
    "lgbm_ms_100m4_f6_mc100": dict(kind="lgbm", features=LGB_BASE + H100 + F6, lgb_params={**SMALL, "min_child_samples": 100}),
    "lgbm_ms_f6_mc100": dict(kind="lgbm", features=LGB_BASE + F6, lgb_params={**SMALL, "min_child_samples": 100}),
    "lgbm_ms_free_100m4_f6": dict(kind="lgbm", features=LGB_BASE + H100 + F6, lgb_params=SMALL, monotone=False),
    "lgbm_mono": dict(kind="lgbm", features=[f for f in D.BASE if not f.startswith("morn_")]),
    "lgbm_free": dict(kind="lgbm", features=[f for f in D.BASE if not f.startswith("morn_")], monotone=False),
    "lgbm_mono_small": dict(kind="lgbm", features=[f for f in D.BASE if not f.startswith("morn_")],
                            lgb_params=dict(n_estimators=150, num_leaves=4, min_child_samples=50)),
}

_G = {}


def _init():
    labels, obs, F, rows = C.load(history=C.HISTORY)
    prod = C.prod_table()
    _G.update(labels=labels, obs=obs, F=F, rows=rows, prod=prod, iss=C.issue_table(prod, labels))


def run_variant(name, ifs=False):
    if not _G:
        _init()
    spec = dict(VARIANTS[name])
    rows, obs, iss = _G["rows"], _G["obs"], _G["iss"]
    t0 = time.time()
    one, roll, roll_ifs = [], [], []
    for ws in C.week_starts():
        we = min(ws + pd.Timedelta(days=7), C.END)
        tr = rows[rows.index + D.FUT * C.HOUR <= ws]   # the training rows' future-wind windows end before ws
        te = rows[(rows.index >= ws) & (rows.index < we)]
        m = D.DecisionModel(**spec).fit(tr)
        ps = np.where(te["od_prev"] == 25, m.p_stay(te, 25), m.p_stay(te, 7))
        # p_stay per actual previous OD (computed for both, picked per row)
        one.append(te[["od_prev", "od", "stay", "kind"]].assign(p_stay=ps, fold=ws))
        it = iss[(iss["issue"] >= ws) & (iss["issue"] < we)]
        if not len(it):
            continue
        ch = m.channels
        W = C.obs_windows(obs, it["issue"], ch)
        dur = it["dur_now"].to_numpy() if m.uses_duration else None
        r = D.rollout_batch(m, it["od_now"].to_numpy(), it["issue"], W, C.H, ch, dur0=dur)
        roll.append(pd.DataFrame({"issue": np.repeat(it["issue"].to_numpy(), C.H), "lead": np.tile(np.arange(C.H), len(it)),
                                  "p_perfect": r["p25"].ravel(), "pnc_perfect": r["p_nochange"].ravel()}))
        if ifs and not m.uses_duration and ch == D.CHANNELS:
            Wf, _ = C.ifs_windows(obs, it["issue"])
            rf = D.rollout_batch(m, it["od_now"].to_numpy(), it["issue"], Wf, C.H, ch)
            roll_ifs.append(pd.DataFrame({"issue": np.repeat(it["issue"].to_numpy(), C.H),
                                          "lead": np.tile(np.arange(C.H), len(it)),
                                          "p_ifs": rf["p25"].ravel(), "pnc_ifs": rf["p_nochange"].ravel()}))
    one = pd.concat(one)
    roll = pd.concat(roll, ignore_index=True)
    if roll_ifs:
        roll = roll.merge(pd.concat(roll_ifs, ignore_index=True), on=["issue", "lead"], how="left")
    tag = name + ("_hist" if C.HISTORY else "")
    C.atomic_parquet(one, C.OUT / f"pred_onestep_{tag}.parquet")
    C.atomic_parquet(roll, C.OUT / f"pred_rollout_{tag}.parquet")
    res = summarize(tag, one, roll)
    res["train_rows_last_fold"] = int((rows.index + D.FUT * C.HOUR <= C.week_starts()[-1]).sum())
    res["seconds"] = round(time.time() - t0, 1)
    (C.OUT / f"res_{tag}.json").write_text(json.dumps(res, indent=1))
    return res


def summarize(name, one, roll):
    res = {"variant": name, "onestep": {"all": C.onestep_metrics(one)}}
    for k in ("day", "morning"):
        res["onestep"][k] = C.onestep_metrics(one[one["kind"] == k])
    t = _G["prod"].merge(roll, on=["issue", "lead"], how="left")
    res["rollout_rows_missing"] = int(t["p_perfect"].isna().sum())
    t = t.dropna(subset=["p_perfect"])
    res["perfect"] = C.rollout_metrics(t, "p_perfect")
    res["production"] = C.rollout_metrics(t, "p_prod")
    if "p_ifs" in t and t["p_ifs"].notna().any():
        tf = t.dropna(subset=["p_ifs"])
        res["ifs_plugin"] = C.rollout_metrics(tf, "p_ifs")
        res["production_on_ifs_rows"] = C.rollout_metrics(tf, "p_prod")
    return res


def line(r):
    a = r["onestep"]["all"]
    p = r["perfect"]
    return (f"{r['variant']:22s} 1step ll={a['logloss']:.4f} br={a['brier']:.4f} P/R={a['precision']:.2f}/{a['recall']:.2f}"
            f" (mor ll={r['onestep']['morning']['logloss']:.3f}) | perfect acc " +
            "/".join(f"{100 * p[f'acc{L}']:.1f}" for L in C.LEADS) + f" B={p['brier_1_6_24_48']:.4f}")


if __name__ == "__main__":
    names = [a for a in sys.argv[1:] if not a.startswith("-")] or list(VARIANTS)
    ifs = "--ifs" in sys.argv
    with ProcessPoolExecutor(min(4, len(names)), initializer=_init) as ex:
        futs = {n: ex.submit(run_variant, n, ifs) for n in names}
        for n, f in futs.items():
            r = f.result()
            print(line(r), f"[{r['seconds']}s]", flush=True)
    r = json.loads((C.OUT / f"res_{names[0]}{'_hist' if C.HISTORY else ''}.json").read_text())
    pr = r["production"]
    print(f"{'PRODUCTION (same rows)':22s} acc " + "/".join(f"{100 * pr[f'acc{L}']:.1f}" for L in C.LEADS)
          + f" B={pr['brier_1_6_24_48']:.4f}")
