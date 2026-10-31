"""Batch 2: per-bucket / per-feature regularisation via column scaling, bagging over windows/structures, combos."""
import sys, time
import numpy as np, pandas as pd
from sklearn.linear_model import LogisticRegression
from experiments.harness import load, evaluate, design, PROD_OD
from fra import train as T
from experiments.model_structure.variants import wts, fit_lr, mk_bucket, mk_sym, mk_spline, mk_shared, F, B4

def mk_scaled(C=0.03, bucket_f=None, feat_f=None, buckets=B4, Fs=F, intercept=False, **wk):
    """Column scaling == per-column regularisation strength (L2: penalty on column j scales with 1/f_j^2)."""
    bucket_f = bucket_f or {}
    feat_f = feat_f or {}
    def scale(X):
        X = X.copy()
        for col in X.columns:
            f = 1.0
            for (lo, hi), v in bucket_f.items():
                if col.endswith(f"_{lo}") or col == f"b{lo}":
                    f *= v
            for c, v in feat_f.items():
                if col.startswith(c + "_") and col[len(c) + 1:].isdigit():
                    f *= v
            X[col] = X[col] * f
        return X
    def fp(tr, y, te):
        w = wts(tr, **wk)
        Xtr, Xte = scale(design(tr, Fs, buckets)), scale(design(te, Fs, buckets))
        keep = w > 0
        m = LogisticRegression(C=C, max_iter=4000, fit_intercept=intercept).fit(Xtr[keep], y[keep], sample_weight=w[keep])
        return m.predict_proba(Xte)[:, 1]
    return fp

def mk_avg(fps, ws=None):
    def fp(tr, y, te):
        ps = [f(tr, y, te) for f in fps]
        w = np.ones(len(ps)) / len(ps) if ws is None else np.asarray(ws) / np.sum(ws)
        return np.sum([wi * p for wi, p in zip(w, ps)], axis=0)
    return fp

def mk_avg_logit(fps):
    def fp(tr, y, te):
        lg = lambda p: np.log(np.clip(p, 1e-6, 1 - 1e-6) / (1 - np.clip(p, 1e-6, 1 - 1e-6)))
        z = np.mean([lg(f(tr, y, te)) for f in fps], axis=0)
        return 1 / (1 + np.exp(-z))
    return fp

b = lambda f1, f2, f3, f4: {(1, 3): f1, (4, 12): f2, (13, 30): f3, (31, 48): f4}
VARIANTS = {
    "intercept_true": lambda: mk_scaled(intercept=True),
    "bf_2_1_1_1": lambda: mk_scaled(bucket_f=b(2, 1, 1, 1)), "bf_0.5_1_1_1": lambda: mk_scaled(bucket_f=b(0.5, 1, 1, 1)),
    "bf_1_1_2_2": lambda: mk_scaled(bucket_f=b(1, 1, 2, 2)), "bf_1_1_0.5_0.5": lambda: mk_scaled(bucket_f=b(1, 1, 0.5, 0.5)),
    "bf_2_1.5_1_0.7": lambda: mk_scaled(bucket_f=b(2, 1.5, 1, 0.7)), "bf_0.7_1_1.5_2": lambda: mk_scaled(bucket_f=b(0.7, 1, 1.5, 2)),
    "bf_1_2_1_1": lambda: mk_scaled(bucket_f=b(1, 2, 1, 1)), "bf_1_0.5_1_1": lambda: mk_scaled(bucket_f=b(1, 0.5, 1, 1)),
    "ff_prog2": lambda: mk_scaled(feat_f={"prog_signed": 2, "prog_alt_signed": 2}), "ff_prog0.5": lambda: mk_scaled(feat_f={"prog_signed": 0.5, "prog_alt_signed": 0.5}),
    "ff_now2": lambda: mk_scaled(feat_f={"od_now25": 2}), "ff_now0.5": lambda: mk_scaled(feat_f={"od_now25": 0.5}),
    "ff_rule2": lambda: mk_scaled(feat_f={"rule_od25": 2}), "ff_rule0.5": lambda: mk_scaled(feat_f={"rule_od25": 0.5}),
    "ff_tw0.5": lambda: mk_scaled(feat_f={c: 0.5 for c in F if c.startswith("tw25")}), "ff_tw2": lambda: mk_scaled(feat_f={c: 2 for c in F if c.startswith("tw25")}),
    "ff_time2": lambda: mk_scaled(feat_f={"hour_sin": 2, "hour_cos": 2, "night": 2}), "ff_time0.5": lambda: mk_scaled(feat_f={"hour_sin": 0.5, "hour_cos": 0.5, "night": 0.5}),
    "ff_bias3": lambda: mk_scaled(feat_f={"b": 1}, bucket_f={}),  # placeholder (bias handled below)
    "bag_win90_120_180": lambda: mk_avg([mk_bucket(window=90), mk_bucket(window=120), mk_bucket(window=180)]),
    "bag_win120_all": lambda: mk_avg([mk_bucket(window=120), mk_bucket(window=None)]),
    "bag_win120_hl60": lambda: mk_avg([mk_bucket(window=120), mk_bucket(window=None, half_life=60)]),
    "bag_prod_sym": lambda: mk_avg([mk_bucket(), mk_sym()]),
    "bag_prod_spline": lambda: mk_avg([mk_bucket(), mk_spline(log_lead=True)]),
    "bag_prod_shared": lambda: mk_avg([mk_bucket(), mk_shared(buckets=None, lead_poly=2)]),
    "bag_prod_sym_spline": lambda: mk_avg([mk_bucket(), mk_sym(), mk_spline(log_lead=True)]),
    "bag_prod_sym_spline_logit": lambda: mk_avg_logit([mk_bucket(), mk_sym(), mk_spline(log_lead=True)]),
    "bag_C0.01_0.03_0.1": lambda: mk_avg([mk_bucket(C=0.01), mk_bucket(C=0.03), mk_bucket(C=0.1)]),
}
del VARIANTS["ff_bias3"]

if __name__ == "__main__":
    names = sys.argv[1:] or list(VARIANTS)
    d = load()
    out = []
    for n in names:
        t = time.time()
        try:
            r = evaluate(d, od_model=VARIANTS[n](), label=n)["od25"]
        except Exception as e:
            print(n, "FAILED", repr(e), flush=True)
            continue
        r["name"] = n; r["secs"] = round(time.time() - t, 1)
        out.append(r)
        pd.DataFrame(out).to_csv(f"experiments/model_structure/results/results2_{names[0]}.csv", index=False)
