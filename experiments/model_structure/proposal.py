"""Drop-in proposal for fra/train.py: production logit + nested temperature scaling per lead bucket.

Only the functions below change/are added in fra/train.py (fit, predict, fit_temperature + 2 constants).
"""
import numpy as np, pandas as pd
from scipy.special import expit, logit
from sklearn.linear_model import LogisticRegression
from fra import train as T
from fra.train import BUCKETS, C, LABEL_COL, TARGETS, WINDOW_DAYS, design

CAL_DAYS = 14          # out-of-sample calibration window (last 14 days of the training data)
TEMP_CLIP = (0.5, 1.5)  # safeguard: temperature a in [0.5, 1.5]; a > 1 sharpens, a < 1 flattens (a > 1.5 hurt in walk-forward)
MIN_CAL = 50            # min calibration rows per bucket


def fit_logit(tr, tgt):
    return LogisticRegression(C=C[tgt], max_iter=3000, fit_intercept=False).fit(design(tr, tgt), TARGETS[tgt](tr))


def fit_temperature(tr, tgt):
    """Refit on all but the last CAL_DAYS, predict those days out of sample, fit y ~ sigmoid(a * logit p) per bucket."""
    cut = tr["valid"].max() - pd.Timedelta(days=CAL_DAYS)
    inner, cal = tr[tr["valid"] < cut], tr[tr["valid"] >= cut]
    if len(inner) < 200 or TARGETS[tgt](inner).nunique() < 2 or TARGETS[tgt](cal).nunique() < 2:
        return {}
    inner = inner[inner["valid"] >= inner["valid"].max() - pd.Timedelta(days=WINDOW_DAYS)]
    z = logit(np.clip(fit_logit(inner, tgt).predict_proba(design(cal, tgt))[:, 1], 1e-6, 1 - 1e-6))
    y = TARGETS[tgt](cal).values
    temps = {}
    for lo, hi in BUCKETS:
        mb = ((cal["lead"] >= lo) & (cal["lead"] <= hi)).values
        if mb.sum() < MIN_CAL or len(np.unique(y[mb])) < 2:
            continue
        a = LogisticRegression(C=100, fit_intercept=False, max_iter=1000).fit(z[mb, None], y[mb]).coef_[0][0]
        temps[lo] = float(np.clip(a, *TEMP_CLIP))
    return temps


def fit(train, tgt):
    tr = train[train[LABEL_COL[tgt]].notna()]
    if tgt == "od25":
        tr = tr[tr["valid"] >= tr["valid"].max() - pd.Timedelta(days=WINDOW_DAYS)]
    if TARGETS[tgt](tr).nunique() < 2:
        raise SystemExit(f"{tgt}: training labels contain one class only")
    m = {"logit": fit_logit(tr, tgt)}
    if tgt == "od25":
        m["temp"] = fit_temperature(tr, tgt)
    return m


def predict(m, d, tgt):
    p = m["logit"].predict_proba(design(d, tgt))[:, 1]
    for lo, hi in BUCKETS:
        a = m.get("temp", {}).get(lo)
        if a:
            mb = ((d["lead"] >= lo) & (d["lead"] <= hi)).values
            p[mb] = expit(a * logit(np.clip(p[mb], 1e-6, 1 - 1e-6)))
    return p


def harness_fp(tr, y, te):  # wrapper for experiments.harness.evaluate(d, od_model=harness_fp)
    return predict(fit(tr, "od25"), te, "od25")


if __name__ == "__main__":
    from experiments.harness import load, evaluate, PROD_OD
    d = load()
    evaluate(d, od_features=PROD_OD, label="production")
    evaluate(d, od_model=harness_fp, label="proposal (temp14)")
    # final production temps
    tr = d[d["od"].notna()]
    print("final model temperatures per bucket:", fit(tr, "od25")["temp"])
