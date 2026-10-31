"""Batch 3: calibration variants (nested temperature per bucket; accumulated out-of-sample temperature)."""
import sys, time
import numpy as np, pandas as pd
from sklearn.linear_model import LogisticRegression
from experiments.harness import load, evaluate, design, PROD_OD
from fra import train as T
from experiments.model_structure.variants import wts, fit_lr, mk_bucket, mk_calib, F, B4

LG = lambda p: np.log(np.clip(p, 1e-6, 1 - 1e-6) / (1 - np.clip(p, 1e-6, 1 - 1e-6)))

def fit_temp(z, y, C=100):
    """one-parameter temperature: y ~ sigmoid(a * logit(p)); returns a (1 = unchanged)."""
    if len(z) < 50 or len(np.unique(y)) < 2:
        return 1.0
    return LogisticRegression(C=C, fit_intercept=False, max_iter=1000).fit(z[:, None], y).coef_[0][0]

def mk_temp_nested(cal_days=21, groups=B4, C=0.03, shrink=0.0, a_min=0.3, a_max=3.0, base_kwargs=None, verbose=False):
    """Fit base model on train minus the last cal_days, temperature per lead group on those days, apply to the full model."""
    base_kwargs = base_kwargs or {}
    base_fp = mk_bucket(C=C, **base_kwargs)
    def fp(tr, y, te):
        p_full = base_fp(tr, y, te)
        tcut = tr["valid"].max() - pd.Timedelta(days=cal_days)
        inner = (tr["valid"] < tcut).values
        if inner.sum() < 200 or len(np.unique(y[inner])) < 2:
            return p_full
        p_cal = base_fp(tr[inner], y[inner], tr[~inner])
        lead_cal, y_cal = tr["lead"].values[~inner], y[~inner]
        out = p_full.copy()
        temps = []
        for lo, hi in groups:
            mc = (lead_cal >= lo) & (lead_cal <= hi)
            mt = ((te["lead"] >= lo) & (te["lead"] <= hi)).values
            a = fit_temp(LG(p_cal[mc]), y_cal[mc])
            a = np.clip(a, a_min, a_max)
            a = (1 - shrink) * a + shrink * 1.0
            temps.append(round(float(a), 2))
            out[mt] = 1 / (1 + np.exp(-a * LG(p_full[mt])))
        if verbose:
            print("   temps", te["issue"].min().date(), temps, flush=True)
        return out
    return fp

def mk_temp_oos(groups=B4, C=0.03, min_rows=100, fallback_days=21, a_min=0.3, a_max=3.0, verbose=False):
    """Accumulate the model's own out-of-sample predictions from earlier walk-forward weeks (labels become known once the
    rows enter the training set) and fit a temperature per lead group on them. Falls back to nested calibration early."""
    base_fp = mk_bucket(C=C)
    nested = mk_temp_nested(cal_days=fallback_days, groups=groups, C=C)
    store = {}  # row index -> (p, lead)
    def fp(tr, y, te):
        p_full = base_fp(tr, y, te)
        # collect OOS rows whose labels are now in tr
        idx = [i for i in store if i in tr.index]
        if len(idx) < min_rows:
            out = nested(tr, y, te)
        else:
            ys = pd.Series(y, index=tr.index).loc[idx].values
            ps = np.array([store[i][0] for i in idx]); ls = np.array([store[i][1] for i in idx])
            out = p_full.copy(); temps = []
            for lo, hi in groups:
                mc = (ls >= lo) & (ls <= hi); mt = ((te["lead"] >= lo) & (te["lead"] <= hi)).values
                a = np.clip(fit_temp(LG(ps[mc]), ys[mc]), a_min, a_max); temps.append(round(float(a), 2))
                out[mt] = 1 / (1 + np.exp(-a * LG(p_full[mt])))
            if verbose:
                print("   oos temps", te["issue"].min().date(), len(idx), temps, flush=True)
        for i, p, l in zip(te.index, p_full, te["lead"].values):
            store[i] = (p, l)
        return out
    return fp

G1 = [(1, 48)]
G2 = [(1, 6), (7, 48)]
G12 = [(l, l) for l in [1, 2, 3, 6, 9, 12, 18, 24, 30, 36, 42, 48]]
VARIANTS = {
    "temp_b4_14": lambda: mk_temp_nested(14), "temp_b4_21": lambda: mk_temp_nested(21, verbose=True), "temp_b4_28": lambda: mk_temp_nested(28),
    "temp_b4_42": lambda: mk_temp_nested(42), "temp_b4_60": lambda: mk_temp_nested(60), "temp_b4_90": lambda: mk_temp_nested(90),
    "temp_g1_21": lambda: mk_temp_nested(21, groups=G1), "temp_g2_21": lambda: mk_temp_nested(21, groups=G2), "temp_g12_21": lambda: mk_temp_nested(21, groups=G12),
    "temp_b4_21_shrink0.5": lambda: mk_temp_nested(21, shrink=0.5), "temp_b4_21_C0.1": lambda: mk_temp_nested(21, C=0.1),
    "temp_b4_21_C0.01": lambda: mk_temp_nested(21, C=0.01), "temp_b4_21_win180": lambda: mk_temp_nested(21, base_kwargs=dict(window=180)),
    "temp_b4_28_C0.1": lambda: mk_temp_nested(28, C=0.1),
    "temp_oos_b4": lambda: mk_temp_oos(verbose=True), "temp_oos_g1": lambda: mk_temp_oos(groups=G1), "temp_oos_b4_C0.1": lambda: mk_temp_oos(C=0.1),
    "temp_oos_b4_min300": lambda: mk_temp_oos(min_rows=300),
}

if __name__ == "__main__":
    names = sys.argv[1:] or list(VARIANTS)
    d = load()
    out = []
    for n in names:
        t = time.time()
        try:
            r = evaluate(d, od_model=VARIANTS[n](), label=n)["od25"]
        except Exception as e:
            import traceback; traceback.print_exc()
            print(n, "FAILED", repr(e), flush=True)
            continue
        r["name"] = n; r["secs"] = round(time.time() - t, 1)
        out.append(r)
        pd.DataFrame(out).to_csv(f"experiments/model_structure/results/results3_{names[0]}.csv", index=False)
