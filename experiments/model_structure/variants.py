"""Model-structure / training-scheme / calibration experiments for the OD model (walk-forward via harness)."""
import sys, time, json
import numpy as np, pandas as pd
from sklearn.linear_model import LogisticRegression
from experiments.harness import load, evaluate, design, PROD_OD, logit_model
from fra import train as T

F = PROD_OD
B4 = T.BUCKETS
SIGNED = ["prog_signed", "prog_alt_signed", "tw25_roll6", "tw25", "tw25_prev3", "tw25_next3", "tw25_100m", "tw25_cons", "tw25_cons_roll6"]


def wts(tr, window=120, half_life=None, per_day=False, dense_cap=None):
    tmax = tr["valid"].max()
    age = ((tmax - tr["valid"]).dt.total_seconds() / 86400).values
    w = np.ones(len(tr))
    if window:
        w = w * (age <= window)
    if half_life:
        w = w * 0.5 ** (age / half_life)
    if per_day:  # equalise total weight per valid-day (dense hourly test weeks vs sparse history)
        n = tr.groupby(tr["valid"].dt.date)["valid"].transform("size").values
        w = w * (np.median(n[w > 0]) / n)
    return w


def fit_lr(X, y, w, C=0.03, penalty="l2"):
    keep = w > 0
    if penalty == "l1":
        m = LogisticRegression(C=C, penalty="l1", solver="liblinear", max_iter=4000, fit_intercept=False)
    else:
        m = LogisticRegression(C=C, max_iter=4000, fit_intercept=False)
    return m.fit(X[keep], y[keep], sample_weight=w[keep])


def mk_bucket(C=0.03, buckets=B4, Fs=F, penalty="l2", scale=False, **wk):
    def fp(tr, y, te):
        w = wts(tr, **wk)
        Xtr, Xte = design(tr, Fs, buckets), design(te, Fs, buckets)
        if scale:
            s = Xtr[w > 0].std().replace(0, 1)
            Xtr, Xte = Xtr / s, Xte / s
        return fit_lr(Xtr, y, w, C, penalty).predict_proba(Xte)[:, 1]
    return fp


# --- shared weights + bucket deviations (hierarchical shrinkage) ---
def design_shared(z, Fs, buckets, lead_poly=0):
    base = z[Fs].fillna(0).astype(float)
    cols = {"bias": np.ones(len(z))}
    L = (z["lead"].values - 1) / 47.0
    for c in Fs:
        cols[c] = base[c].values
        for k in range(1, lead_poly + 1):
            cols[f"{c}_L{k}"] = base[c].values * L ** k
    for k in range(1, lead_poly + 1):
        cols[f"bias_L{k}"] = L ** k
    if buckets:
        for lo, hi in buckets:
            m = ((z["lead"] >= lo) & (z["lead"] <= hi)).astype(float).values
            cols[f"b{lo}"] = m
            for c in Fs:
                cols[f"{c}_{lo}"] = base[c].values * m
    return pd.DataFrame(cols, index=z.index)


def mk_shared(C=0.03, buckets=B4, lead_poly=0, Fs=F, **wk):
    def fp(tr, y, te):
        w = wts(tr, **wk)
        return fit_lr(design_shared(tr, Fs, buckets, lead_poly), y, w, C).predict_proba(design_shared(te, Fs, buckets, lead_poly))[:, 1]
    return fp


# --- smooth lead: features x spline basis of lead ---
def spline_basis(lead, knots=(3, 12, 30)):
    L = np.asarray(lead, float)
    cols = [np.ones_like(L), L / 48.0] + [np.maximum(L - k, 0) / 48.0 for k in knots]
    return np.column_stack(cols)


def mk_spline(C=0.03, knots=(3, 12, 30), Fs=F, log_lead=False, **wk):
    def dz(z):
        base = z[Fs].fillna(0).astype(float).values
        S = spline_basis(np.log(z["lead"].values) * 48 / np.log(48) if log_lead else z["lead"].values, knots)
        X = [S] + [base[:, [j]] * S for j in range(base.shape[1])]
        return np.hstack(X)
    def fp(tr, y, te):
        w = wts(tr, **wk)
        return fit_lr(dz(tr), y, w, C).predict_proba(dz(te))[:, 1]
    return fp


# --- hazard / symmetric "switch" formulation ---
def design_sym(z, buckets, asym=True):
    s = (2 * z["od_now25"].values - 1).astype(float)  # +1 if currently OD 25
    base = z[F].fillna(0).astype(float)
    cols = {}
    feats = {}
    for c in F:
        if c in SIGNED:
            feats[c + "_cur"] = base[c].values * s  # tailwind etc. on the CURRENT runway (positive -> switch)
        elif c == "rule_od25":
            feats["rule_cur"] = (2 * base[c].values - 1) * s  # rule agrees with current OD
        elif c == "od_now25":
            if asym:
                feats["now25"] = base[c].values  # asymmetry (west preference)
        else:
            feats[c] = base[c].values
    for lo, hi in buckets:
        m = ((z["lead"] >= lo) & (z["lead"] <= hi)).astype(float).values
        cols[f"b{lo}"] = m
        for c, v in feats.items():
            cols[f"{c}_{lo}"] = v * m
    return pd.DataFrame(cols, index=z.index), s


def mk_sym(C=0.03, buckets=B4, asym=True, **wk):
    def fp(tr, y, te):
        w = wts(tr, **wk)
        Xtr, s_tr = design_sym(tr, buckets, asym)
        stay = (y == tr["od_now25"].values).astype(int)
        m = fit_lr(Xtr, stay, w, C)
        Xte, s_te = design_sym(te, buckets, asym)
        p_stay = m.predict_proba(Xte)[:, 1]
        return np.where(s_te > 0, p_stay, 1 - p_stay)
    return fp


# --- hinge (monotone GAM-ish) transforms of tailwind ---
def add_hinges(z, cols=("tw25",), knots=(-5, 0, 5)):
    z = z.copy()
    new = []
    for c in cols:
        for k in knots:
            n = f"{c}_h{k}"
            z[n] = np.maximum(z[c].fillna(0) - k, 0)
            new.append(n)
    return z, new


def mk_hinge(C=0.03, cols=("tw25",), knots=(-5, 0, 5), **wk):
    def fp(tr, y, te):
        tr2, new = add_hinges(tr, cols, knots)
        te2, _ = add_hinges(te, cols, knots)
        w = wts(tr, **wk)
        Fs = F + new
        return fit_lr(design(tr2, Fs, B4), y, w, C).predict_proba(design(te2, Fs, B4))[:, 1]
    return fp


# --- post-hoc calibration (nested: calibrate on the last `cal_days` of training predicted out-of-sample) ---
def mk_calib(C=0.03, cal_days=21, per_bucket=True, mode="platt", base_fp=None, **wk):
    base_fp = base_fp or mk_bucket(C, **wk)
    def fp(tr, y, te):
        tcut = tr["valid"].max() - pd.Timedelta(days=cal_days)
        inner = (tr["valid"] < tcut).values
        cal = ~inner
        p_full = base_fp(tr, y, te)
        if inner.sum() < 100 or len(np.unique(y[inner])) < 2:
            return p_full
        p_cal = base_fp(tr[inner], y[inner], tr[cal])
        logit = lambda p: np.log(np.clip(p, 1e-6, 1 - 1e-6) / (1 - np.clip(p, 1e-6, 1 - 1e-6)))
        out = p_full.copy()
        groups = B4 if per_bucket else [(1, 48)]
        for lo, hi in groups:
            mc = ((tr["lead"][cal] >= lo) & (tr["lead"][cal] <= hi)).values
            mt = ((te["lead"] >= lo) & (te["lead"] <= hi)).values
            if mc.sum() < 50 or len(np.unique(y[cal][mc])) < 2:
                continue
            if mode == "temp":
                # temperature only: fit a on logit(p)/a via 1-param logistic without intercept
                lr = LogisticRegression(C=100, fit_intercept=False, max_iter=1000).fit(logit(p_cal[mc])[:, None], y[cal][mc])
                out[mt] = 1 / (1 + np.exp(-lr.coef_[0][0] * logit(p_full[mt])))
            else:
                lr = LogisticRegression(C=100, max_iter=1000).fit(logit(p_cal[mc])[:, None], y[cal][mc])
                out[mt] = lr.predict_proba(logit(p_full[mt])[:, None])[:, 1]
        return out
    return fp


# --- blends ---
def mk_blend_prog(a=0.1, base_fp=None):
    base_fp = base_fp or mk_bucket()
    def fp(tr, y, te):
        p = base_fp(tr, y, te)
        pw = te["prog_main_west"].values
        return np.where(np.isnan(pw), p, (1 - a) * p + a * pw)
    return fp


def mk_lgbm_blend(a=0.5, leads_min=4, n=200, leaves=4, mcs=100, lam=10, mono=True, base_fp=None, **wk):
    import lightgbm as lgb
    base_fp = base_fp or mk_bucket()
    GF = F + ["lead"]
    def fp(tr, y, te):
        p = base_fp(tr, y, te)
        w = wts(tr, **wk)
        keep = w > 0
        mc = [1 if c in ("prog_signed", "prog_alt_signed", "rule_od25", "od_now25") else (-1 if c.startswith("tw25") else 0) for c in GF] if mono else None
        g = lgb.LGBMClassifier(n_estimators=n, learning_rate=0.03, num_leaves=leaves, min_child_samples=mcs, reg_lambda=lam,
                               subsample=0.8, subsample_freq=1, colsample_bytree=0.8, monotone_constraints=mc, verbose=-1)
        g.fit(tr[GF][keep].fillna(0), y[keep], sample_weight=w[keep])
        q = g.predict_proba(te[GF].fillna(0))[:, 1]
        return np.where(te["lead"].values < leads_min, p, (1 - a) * p + a * q)
    return fp


def mk_shrink_prob(eps=0.01, base_fp=None):
    base_fp = base_fp or mk_bucket()
    def fp(tr, y, te):
        p = base_fp(tr, y, te)
        return np.clip(p, eps, 1 - eps)
    return fp


VARIANTS = {
    # production check
    "prod": lambda: mk_bucket(),
    "prod_harness": lambda: logit_model(F),
    # windows / recency
    "win60": lambda: mk_bucket(window=60), "win90": lambda: mk_bucket(window=90), "win150": lambda: mk_bucket(window=150),
    "win180": lambda: mk_bucket(window=180), "win_all": lambda: mk_bucket(window=None),
    "hl30_nowin": lambda: mk_bucket(window=None, half_life=30), "hl45_nowin": lambda: mk_bucket(window=None, half_life=45),
    "hl60_nowin": lambda: mk_bucket(window=None, half_life=60), "hl90_nowin": lambda: mk_bucket(window=None, half_life=90),
    "hl120_nowin": lambda: mk_bucket(window=None, half_life=120), "hl60_win180": lambda: mk_bucket(window=180, half_life=60),
    "hl90_win180": lambda: mk_bucket(window=180, half_life=90), "hl60_win120": lambda: mk_bucket(window=120, half_life=60),
    "perday": lambda: mk_bucket(per_day=True), "perday_win180": lambda: mk_bucket(window=180, per_day=True),
    "perday_hl60": lambda: mk_bucket(window=None, half_life=60, per_day=True),
    # regularisation
    "C0.01": lambda: mk_bucket(C=0.01), "C0.02": lambda: mk_bucket(C=0.02), "C0.05": lambda: mk_bucket(C=0.05), "C0.1": lambda: mk_bucket(C=0.1),
    "scaled_C0.03": lambda: mk_bucket(scale=True, C=0.03), "scaled_C0.01": lambda: mk_bucket(scale=True, C=0.01),
    "scaled_C0.1": lambda: mk_bucket(scale=True, C=0.1), "scaled_C0.3": lambda: mk_bucket(scale=True, C=0.3), "scaled_C1": lambda: mk_bucket(scale=True, C=1.0),
    "l1_C0.03": lambda: mk_bucket(penalty="l1", C=0.03), "l1_C0.1": lambda: mk_bucket(penalty="l1", C=0.1), "l1_C0.3": lambda: mk_bucket(penalty="l1", C=0.3),
    # buckets
    "B2": lambda: mk_bucket(buckets=[(1, 6), (7, 48)]), "B3": lambda: mk_bucket(buckets=[(1, 6), (7, 24), (25, 48)]),
    "B3b": lambda: mk_bucket(buckets=[(1, 3), (4, 18), (19, 48)]),
    "B5": lambda: mk_bucket(buckets=[(1, 3), (4, 9), (10, 18), (19, 30), (31, 48)]),
    "B6": lambda: mk_bucket(buckets=[(1, 2), (3, 6), (7, 12), (13, 24), (25, 36), (37, 48)]),
    "B12": lambda: mk_bucket(buckets=[(l, l) for l in [1, 2, 3, 6, 9, 12, 18, 24, 30, 36, 42, 48]]),
    "B4alt": lambda: mk_bucket(buckets=[(1, 2), (3, 9), (10, 24), (25, 48)]),
    # hierarchical shared + deviations
    "shared_only": lambda: mk_shared(buckets=None), "shared_only_L1": lambda: mk_shared(buckets=None, lead_poly=1),
    "shared_only_L2": lambda: mk_shared(buckets=None, lead_poly=2),
    "shared_B4": lambda: mk_shared(buckets=B4), "shared_B4_C0.01": lambda: mk_shared(buckets=B4, C=0.01),
    "shared_B4_C0.1": lambda: mk_shared(buckets=B4, C=0.1),
    "shared_B6": lambda: mk_shared(buckets=[(1, 2), (3, 6), (7, 12), (13, 24), (25, 36), (37, 48)]),
    "shared_B12": lambda: mk_shared(buckets=[(l, l) for l in [1, 2, 3, 6, 9, 12, 18, 24, 30, 36, 42, 48]]),
    "shared_B12_C0.01": lambda: mk_shared(buckets=[(l, l) for l in [1, 2, 3, 6, 9, 12, 18, 24, 30, 36, 42, 48]], C=0.01),
    "shared_B4_L1": lambda: mk_shared(buckets=B4, lead_poly=1),
    # smooth lead splines
    "spline_3_12_30": lambda: mk_spline(), "spline_3_12_30_log": lambda: mk_spline(log_lead=True),
    "spline_6_24": lambda: mk_spline(knots=(6, 24)), "spline_2_6_12_24_36": lambda: mk_spline(knots=(2, 6, 12, 24, 36)),
    "spline_3_12_30_C0.1": lambda: mk_spline(C=0.1), "spline_3_12_30_C0.01": lambda: mk_spline(C=0.01),
    # hazard / symmetric
    "sym": lambda: mk_sym(), "sym_noasym": lambda: mk_sym(asym=False), "sym_C0.1": lambda: mk_sym(C=0.1), "sym_C0.01": lambda: mk_sym(C=0.01),
    "sym_B6": lambda: mk_sym(buckets=[(1, 2), (3, 6), (7, 12), (13, 24), (25, 36), (37, 48)]),
    # hinges
    "hinge_tw25": lambda: mk_hinge(), "hinge_tw25_roll6": lambda: mk_hinge(cols=("tw25", "tw25_roll6")),
    "hinge_tw25_k-8_-3_3_8": lambda: mk_hinge(knots=(-8, -3, 3, 8)),
    "hinge_all_tw": lambda: mk_hinge(cols=("tw25", "tw25_roll6", "tw25_cons", "tw25_100m"), knots=(-5, 0, 5)),
    # calibration
    "platt_b_21": lambda: mk_calib(cal_days=21), "platt_b_35": lambda: mk_calib(cal_days=35), "platt_all_21": lambda: mk_calib(cal_days=21, per_bucket=False),
    "temp_b_21": lambda: mk_calib(cal_days=21, mode="temp"), "temp_b_35": lambda: mk_calib(cal_days=35, mode="temp"),
    "temp_all_35": lambda: mk_calib(cal_days=35, mode="temp", per_bucket=False),
    # blends
    "blend_prog0.1": lambda: mk_blend_prog(0.1), "blend_prog0.2": lambda: mk_blend_prog(0.2), "blend_prog0.05": lambda: mk_blend_prog(0.05),
    "clip0.01": lambda: mk_shrink_prob(0.01), "clip0.02": lambda: mk_shrink_prob(0.02),
    "lgbm_blend0.5": lambda: mk_lgbm_blend(0.5), "lgbm_blend0.3": lambda: mk_lgbm_blend(0.3), "lgbm_blend0.5_nomono": lambda: mk_lgbm_blend(0.5, mono=False),
    "lgbm_blend0.3_l7": lambda: mk_lgbm_blend(0.3, leaves=7, n=300), "lgbm_blend0.5_all": lambda: mk_lgbm_blend(0.5, window=None),
}

if __name__ == "__main__":
    names = sys.argv[1:] or list(VARIANTS)
    if names == ["all"]:
        names = list(VARIANTS)
    d = load()
    out = []
    for n in names:
        t = time.time()
        try:
            r = evaluate(d, od_model=VARIANTS[n](), label=n)["od25"]
        except Exception as e:
            print(n, "FAILED", repr(e), flush=True)
            continue
        r["name"] = n
        r["secs"] = round(time.time() - t, 1)
        out.append(r)
        pd.DataFrame(out).to_csv(f"experiments/model_structure/results/results_{names[0]}.csv", index=False)
