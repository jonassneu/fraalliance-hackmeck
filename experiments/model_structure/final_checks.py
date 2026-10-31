"""Block bootstrap (by issue day) of the Brier difference prod vs temperature variants; temperature on RWY18."""
import numpy as np, pandas as pd
from sklearn.linear_model import LogisticRegression
from experiments.harness import load, walk_forward, evaluate, logit_model, design, PROD_OD, PROD_18
from experiments.model_structure.proposal import harness_fp
from experiments.model_structure.variants5 import mk_fixed_temp
from experiments.model_structure.variants import mk_bucket
d = load()
z, y, p0, ok = walk_forward(d, "od25", logit_model(PROD_OD))
_, _, p1, _ = walk_forward(d, "od25", harness_fp)
_, _, p2, _ = walk_forward(d, "od25", mk_fixed_temp(mk_bucket(), 1.5))
day = z["issue"].dt.floor("D").values
m4 = ok & z["lead"].isin([1, 6, 24, 48]).values
rng = np.random.default_rng(0)
for name, p in [("temp_clip1.5", p1), ("fixed1.5", p2)]:
    diff = (p0 - y) ** 2 - (p - y) ** 2  # >0 = variant better
    for lab, m in [("1/6/24/48", m4), ("all leads", ok)]:
        dd = pd.Series(diff[m]).groupby(day[m]).mean()
        bs = [rng.choice(dd.values, len(dd)).mean() for _ in range(4000)]
        print(f"{name:14s} {lab:10s} mean gain {dd.mean():.5f}  95% CI [{np.percentile(bs, 2.5):.5f}, {np.percentile(bs, 97.5):.5f}]  days better {(dd > 0).mean():.2f} of {len(dd)}")
# RWY18: production vs fixed temperature vs nested temperature (logit C=1, no window)
LG = lambda p: np.log(np.clip(p, 1e-6, 1 - 1e-6) / (1 - np.clip(p, 1e-6, 1 - 1e-6)))
base18 = logit_model(PROD_18, C=1.0, window=None)
def fixed18(a):
    return lambda tr, y, te: 1 / (1 + np.exp(-a * LG(base18(tr, y, te))))
def nested18(cal_days=28):
    def fp(tr, y, te):
        p = base18(tr, y, te)
        cut = tr["valid"].max() - pd.Timedelta(days=cal_days)
        inner = (tr["valid"] < cut).values
        if len(np.unique(y[inner])) < 2 or len(np.unique(y[~inner])) < 2:
            return p
        pc = base18(tr[inner], y[inner], tr[~inner])
        a = np.clip(LogisticRegression(C=100, fit_intercept=False).fit(LG(pc)[:, None], y[~inner]).coef_[0][0], 0.5, 1.5)
        return 1 / (1 + np.exp(-a * LG(p)))
    return fp
evaluate(d, rwy18_features=PROD_18, label="rwy18 production")
for a in [0.8, 1.2, 1.5]:
    evaluate(d, rwy18_model=fixed18(a), label=f"rwy18 fixed{a}")
evaluate(d, rwy18_model=nested18(28), label="rwy18 nested28")
