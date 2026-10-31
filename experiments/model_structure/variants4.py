"""Batch 4: temperature calibration sweeps (window, clipping, smooth-in-lead, weighted) and combos with structural tweaks."""
import sys, time
import numpy as np, pandas as pd
from sklearn.linear_model import LogisticRegression
from experiments.harness import load, evaluate, design, PROD_OD
from fra import train as T
from experiments.model_structure.variants import wts, mk_bucket, mk_hinge, mk_shared, F, B4
from experiments.model_structure.variants2 import mk_scaled

LG = lambda p: np.log(np.clip(p, 1e-6, 1 - 1e-6) / (1 - np.clip(p, 1e-6, 1 - 1e-6)))

def mk_temp(base_fp, cal_days=14, groups=B4, a_min=0.3, a_max=3.0, smooth=False, cal_half_life=None, min_inner=200):
    """Nested temperature scaling: refit base on train minus last cal_days, predict those days out-of-sample, fit
    y ~ sigmoid(a_g * logit(p)) per lead group g (or smooth: a = a0 + a1*log(lead)/log(48)); apply to full-model p."""
    def fp(tr, y, te):
        p_full = base_fp(tr, y, te)
        tmax = tr["valid"].max()
        inner = (tr["valid"] < tmax - pd.Timedelta(days=cal_days)).values
        if inner.sum() < min_inner or len(np.unique(y[inner])) < 2 or len(np.unique(y[~inner])) < 2:
            return p_full
        p_cal = base_fp(tr[inner], y[inner], tr[~inner])
        lead_cal, y_cal = tr["lead"].values[~inner], y[~inner]
        w_cal = np.ones(len(y_cal))
        if cal_half_life:
            age = ((tmax - tr["valid"][~inner]).dt.total_seconds() / 86400).values
            w_cal = 0.5 ** (age / cal_half_life)
        out = p_full.copy()
        z_cal, z_te = LG(p_cal), LG(p_full)
        if smooth:
            l_cal, l_te = np.log(lead_cal) / np.log(48), np.log(te["lead"].values) / np.log(48)
            X = np.column_stack([z_cal, z_cal * l_cal])
            lr = LogisticRegression(C=100, fit_intercept=False, max_iter=1000).fit(X, y_cal, sample_weight=w_cal)
            a = np.clip(lr.coef_[0][0] + lr.coef_[0][1] * l_te, a_min, a_max)
            return 1 / (1 + np.exp(-a * z_te))
        for lo, hi in groups:
            mc = (lead_cal >= lo) & (lead_cal <= hi)
            mt = ((te["lead"] >= lo) & (te["lead"] <= hi)).values
            if mc.sum() < 50 or len(np.unique(y_cal[mc])) < 2:
                continue
            lr = LogisticRegression(C=100, fit_intercept=False, max_iter=1000).fit(z_cal[mc][:, None], y_cal[mc], sample_weight=w_cal[mc])
            a = np.clip(lr.coef_[0][0], a_min, a_max)
            out[mt] = 1 / (1 + np.exp(-a * z_te[mt]))
        return out
    return fp

bf = lambda f1, f2, f3, f4: {(1, 3): f1, (4, 12): f2, (13, 30): f3, (31, 48): f4}
VARIANTS = {
    "t7": lambda: mk_temp(mk_bucket(), 7), "t10": lambda: mk_temp(mk_bucket(), 10), "t14": lambda: mk_temp(mk_bucket(), 14),
    "t14_amax1.5": lambda: mk_temp(mk_bucket(), 14, a_max=1.5), "t14_amax2": lambda: mk_temp(mk_bucket(), 14, a_max=2.0),
    "t14_amin0.8_amax2": lambda: mk_temp(mk_bucket(), 14, a_min=0.8, a_max=2.0),
    "t14_smooth": lambda: mk_temp(mk_bucket(), 14, smooth=True), "t21_smooth": lambda: mk_temp(mk_bucket(), 21, smooth=True),
    "t28_hl7": lambda: mk_temp(mk_bucket(), 28, cal_half_life=7), "t28_hl10": lambda: mk_temp(mk_bucket(), 28, cal_half_life=10),
    "t42_hl10": lambda: mk_temp(mk_bucket(), 42, cal_half_life=10),
    "t14_g1": lambda: mk_temp(mk_bucket(), 14, groups=[(1, 48)]), "t14_g2": lambda: mk_temp(mk_bucket(), 14, groups=[(1, 6), (7, 48)]),
    "t14_bf1122": lambda: mk_temp(mk_scaled(bucket_f=bf(1, 1, 2, 2)), 14),
    "t14_fftw2": lambda: mk_temp(mk_scaled(feat_f={c: 2 for c in F if c.startswith("tw25")}), 14),
    "t14_hinge": lambda: mk_temp(mk_hinge(), 14),
    "t14_intercept": lambda: mk_temp(mk_scaled(intercept=True), 14),
    "t14_sharedB4": lambda: mk_temp(mk_shared(buckets=B4), 14),
    "t14_C0.1": lambda: mk_temp(mk_bucket(C=0.1), 14), "t14_C0.01": lambda: mk_temp(mk_bucket(C=0.01), 14),
    "t14_win180": lambda: mk_temp(mk_bucket(window=180), 14), "t14_win90": lambda: mk_temp(mk_bucket(window=90), 14),
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
        pd.DataFrame(out).to_csv(f"experiments/model_structure/results/results4_{names[0]}.csv", index=False)

def mk_temp_multi(base_fp, windows=(14, 28, 60), groups=B4, a_min=0.3, a_max=3.0):
    """Average (geometric) of per-bucket temperatures fitted on several calibration windows -> robustness."""
    fps = [mk_temp(base_fp, w, groups, a_min, a_max) for w in windows]
    def fp(tr, y, te):
        p_full = base_fp(tr, y, te)
        z = LG(p_full)
        # recover each window's effective temperature from its output (a = logit(out)/logit(p)); average in log space
        las = []
        for f in fps:
            out = f(tr, y, te)
            with np.errstate(divide="ignore", invalid="ignore"):
                a = np.where(np.abs(z) > 1e-3, LG(out) / z, 1.0)
            las.append(np.log(np.clip(a, 1e-3, 1e3)))
        a = np.exp(np.mean(las, axis=0))
        return 1 / (1 + np.exp(-a * z))
    return fp

VARIANTS.update({
    "tmulti_14_28_60": lambda: mk_temp_multi(mk_bucket(), (14, 28, 60)),
    "tmulti_14_21_28": lambda: mk_temp_multi(mk_bucket(), (14, 21, 28)),
    "tmulti_10_14_21": lambda: mk_temp_multi(mk_bucket(), (10, 14, 21)),
    "t14_g1_amax2": lambda: mk_temp(mk_bucket(), 14, groups=[(1, 48)], a_max=2.0),
    "t21_g1": lambda: mk_temp(mk_bucket(), 21, groups=[(1, 48)]),
})
