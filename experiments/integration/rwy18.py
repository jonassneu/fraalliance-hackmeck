"""Runway 18 comparison (pre-registered in plan.json, comparison 5): weekly walk-forward from 2025-09-01.

    uv run python experiments/integration/rwy18.py
R1 production logit (fra.train rwy18 spec, experiments.harness walk-forward)
R2 decision-study closure model on the Part B wind paths with the logit P(OD 25):
   P(open) = 1 - [P25 * mean_paths P(closed | OD 25, wind) + (1 - P25) * mean_paths P(closed | OD 07, wind)]
R3 0.5 * R1 + 0.5 * R2
Rows: every (issue, lead) with a RWY 18 label where all three have a prediction (valid < 2026-11-01).
Output: rwy18_results.json, rwy18_bootstrap.csv
"""

import os

for _k in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(_k, "1")

import json  # noqa: E402
import sys  # noqa: E402
from pathlib import Path  # noqa: E402

import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from fra import evalkit  # noqa: E402

OUT = Path(__file__).resolve().parent
START = pd.Timestamp("2025-09-01", tz="UTC")
LEADS = evalkit.REPORT_LEADS
WARN = 0.8


def auc(score, y):
    from sklearn.metrics import roc_auc_score
    return float(roc_auc_score(y, score)) if 0 < y.sum() < len(y) else np.nan


def metrics(t, col, clim):
    y_closed = (t["y"] == 0).astype(int).to_numpy()
    p = t[col].to_numpy()
    b = float(np.mean((p - t["y"].to_numpy()) ** 2))
    bc = float(np.mean((clim - t["y"].to_numpy()) ** 2))
    flag = p < WARN
    n_open = int((y_closed == 0).sum())
    return {"n": int(len(t)), "closed_rows": int(y_closed.sum()),
            "closed_hours": int(t.loc[y_closed == 1, "valid"].nunique()), "brier": b, "brier_clim": bc,
            "bss": 1 - b / bc if bc > 0 else np.nan, "auc": auc(1 - p, y_closed),
            "hit_rate_p_open_lt_0.8": float(flag[y_closed == 1].mean()) if y_closed.any() else np.nan,
            "false_alarms_per_1000h": 1000 * float(flag[y_closed == 0].sum()) / max(n_open, 1),
            "closed_hours_flagged_any_lead": int(t.loc[(y_closed == 1) & flag, "valid"].nunique())}


def main():
    from experiments import harness as Hn
    d = Hn.load()
    z, y, p, ok = Hn.walk_forward(d, "rwy18", Hn.prod_model("rwy18"), start=START)
    t = z.loc[ok, ["issue", "lead", "valid", "od_now", "rwy18_now", "rule_18"]].copy()
    t["y"], t["p_r1"] = y[ok].astype(float), p[ok]
    zo, yo, po, oko = Hn.walk_forward(d, "od25", Hn.prod_model("od25"), start=START)
    od = zo.loc[oko, ["issue", "lead"]].assign(p25_logit=po[oko])
    t = t.merge(od, on=["issue", "lead"], how="left")
    dec = pd.concat([pd.read_parquet(OUT / "dec_rwy18.parquet"),
                     pd.read_parquet(OUT / "dec_long.parquet").query("config == 'main'")], ignore_index=True)
    dec = dec[dec["config"] == "main"][["issue", "lead", "c25", "c07", "p18"]]
    t = t.merge(dec, on=["issue", "lead"], how="left")
    t["p_r2"] = 1 - (t["p25_logit"] * t["c25"] + (1 - t["p25_logit"]) * t["c07"])
    t["p_r3"] = 0.5 * t["p_r1"] + 0.5 * t["p_r2"]
    keep = t[["p_r1", "p_r2", "p_r3"]].notna().all(axis=1)
    print(f"rows {len(t)}, all candidates {int(keep.sum())}", flush=True)
    t = t[keep].reset_index(drop=True)
    # walk-forward climatology: closure rate of the labels known at each week start
    lab = pd.read_parquet(ROOT / "data/labels.parquet")["rwy18_open"].dropna()
    wk = evalkit.test_weeks(t["issue"], t["valid"], START)
    clim = np.full(len(t), np.nan)
    for w in np.unique(wk):
        ws = evalkit.week_start(w, START)
        known = lab[lab.index + pd.Timedelta(hours=2) <= ws]
        clim[wk == w] = float(known.mean())
    t["p_clim"] = clim
    res = {"period": f"issues {t['issue'].min()} .. {t['issue'].max()}", "warning_level": WARN, "all_leads": {},
           "per_lead": {}, "closure_days": sorted(str(x) for x in t.loc[t['y'] == 0, 'valid'].dt.date.unique())}
    for c in ["p_r1", "p_r2", "p_r3", "p_clim"]:
        res["all_leads"][c] = metrics(t, c, t["p_clim"].to_numpy())
        for L in LEADS:
            m = t["lead"] == L
            res["per_lead"].setdefault(str(L), {})[c] = metrics(t[m], c, t.loc[m, "p_clim"].to_numpy())
    preds = {"R1_logit": t["p_r1"], "R2_paths": t["p_r2"], "R3_blend": t["p_r3"], "climatology": t["p_clim"],
             "rule": t["rule_18"].astype(float)}
    pairs = [("R2_paths", "R1_logit"), ("R3_blend", "R1_logit"), ("R1_logit", "climatology")]
    a = evalkit.bootstrap(t["y"], preds, t["valid"], t["lead"], LEADS, pairs)
    b = evalkit.bootstrap(t["y"], preds, t["valid"], t["lead"], evalkit.ALL_LEADS, pairs, per_lead=False,
                          pooled_id=evalkit.POOLED_ALL)
    tab = pd.concat([a, b], ignore_index=True)
    tab.to_csv(OUT / "rwy18_bootstrap.csv", index=False)
    pb = tab[(tab.metric == "brier") & (tab.lead == evalkit.POOLED_ALL)].set_index("method")
    res["pooled_brier_ci"] = {k: pb.loc[k, ["est", "lo", "hi"]].tolist() for k in pb.index}
    # pre-registered choice
    fa1 = res["all_leads"]["p_r1"]["false_alarms_per_1000h"]
    cands = []
    for c, key in [("p_r2", "R2_paths - R1_logit"), ("p_r3", "R3_blend - R1_logit")]:
        hi = res["pooled_brier_ci"][key][2]
        if hi < 0 and res["all_leads"][c]["false_alarms_per_1000h"] <= 2 * max(fa1, 1e-9):
            cands.append((res["all_leads"][c]["brier"], c))
    res["decision"] = min(cands)[1] if cands else "p_r1"
    (OUT / "rwy18_results.json").write_text(json.dumps(res, indent=1, default=str))
    show = ["brier", "bss", "auc", "hit_rate_p_open_lt_0.8", "false_alarms_per_1000h", "closed_rows", "closed_hours",
            "closed_hours_flagged_any_lead", "n"]
    print(pd.DataFrame(res["all_leads"]).loc[show].round(4).to_string())
    for L in LEADS:
        print(f"lead {L}:", {c: (round(v["brier"], 4), round(v["bss"], 3), round(v["auc"], 3),
                                 round(v["hit_rate_p_open_lt_0.8"], 3), round(v["false_alarms_per_1000h"], 2))
                             for c, v in res["per_lead"][str(L)].items()})
    print(pb.round(5).to_string())
    print("decision:", res["decision"])


if __name__ == "__main__":
    main()
