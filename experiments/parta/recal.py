"""Walk-forward recalibration of rollout probabilities (A+B end-to-end, IFS plug-in): per lead bucket
logit(p') = a * logit(p) + b fitted on earlier test weeks only (rows with valid < week start), first 3 weeks raw.
Covers every pred_e2e_*.parquet whose decision-model variant has a pred_rollout file (IFS plug-in where available).

    uv run python experiments/parta/recal.py   -> recal.json
"""
import json

import numpy as np
import pandas as pd
from scipy.special import logit
from sklearn.linear_model import LogisticRegression

import common as C

BUCKETS = [(0, 3), (4, 12), (13, 30), (31, 48)]
MIN_WEEKS = 3


def recalibrate(t, col):
    z = logit(np.clip(t[col].to_numpy(), 1e-4, 1 - 1e-4))
    y = (t["od"] == 25).astype(int).to_numpy()
    out = np.full(len(t), np.nan)
    params = []
    for i, ws in enumerate(C.week_starts()):
        te = ((t["issue"] >= ws) & (t["issue"] < ws + pd.Timedelta(days=7))).to_numpy()
        tr = (t["valid"] < ws).to_numpy()
        for lo, hi in BUCKETS:
            b = t["lead"].between(lo, hi).to_numpy()
            if i < MIN_WEEKS or len(np.unique(y[tr & b])) < 2:
                out[te & b] = t[col].to_numpy()[te & b]
                continue
            m = LogisticRegression(C=100).fit(z[tr & b, None], y[tr & b])
            out[te & b] = m.predict_proba(z[te & b, None])[:, 1]
            params.append((str(ws.date()), lo, float(m.coef_[0][0]), float(m.intercept_[0])))
    return out, params


def main():
    prod = C.prod_table()
    res = {}
    for p in sorted(C.OUT.glob("pred_e2e_*.parquet")):
        nm = p.stem.replace("pred_e2e_", "")
        base = nm.replace("_antmean", "").replace("_mg", "")          # decision-model variant of the e2e run
        if not (C.OUT / f"pred_rollout_{base}.parquet").exists():
            continue
        r = pd.read_parquet(p)
        roll = pd.read_parquet(C.OUT / f"pred_rollout_{base}.parquet")
        if "p_ifs" not in roll:
            roll["p_ifs"] = np.nan
        allr = prod.merge(r, on=["issue", "lead"]).merge(roll[["issue", "lead", "p_ifs"]], on=["issue", "lead"])
        # recalibrate on all leads present in the production rows (leads 1..48 subset), score at 1/6/24/48
        allr["p_e2e_cal"], pe = recalibrate(allr, "p_e2e")
        allr["p_ifs_cal"], pi = recalibrate(allr, "p_ifs") if allr["p_ifs"].notna().all() else (allr["p_ifs"], [])
        allr["p_blend_cal"] = (allr["p_e2e_cal"] + allr["p_prod"]) / 2
        late = allr["issue"] >= C.week_starts()[MIN_WEEKS]
        res[nm] = {}
        for tag, sub in (("all_weeks", allr), (f"weeks_{MIN_WEEKS}+", allr[late])):
            res[nm][tag] = {c: C.rollout_metrics(sub, c) for c in ("p_prod", "p_e2e", "p_e2e_cal", "p_ifs", "p_ifs_cal",
                                                                   "p_blend_cal") if sub[c].notna().all()}
            for c, m in res[nm][tag].items():
                print(f"{nm:20s} {tag:10s} {c:12s} acc " + "/".join(f"{100 * m[f'acc{L}']:.1f}" for L in C.LEADS)
                      + f" B={m['brier_1_6_24_48']:.4f}")
        res[nm]["slopes_e2e_last"] = pe[-4:]
        res[nm]["slopes_ifs_last"] = pi[-4:]
    (C.OUT / "recal.json").write_text(json.dumps(res, indent=1))


if __name__ == "__main__":
    main()
