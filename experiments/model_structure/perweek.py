"""Per-week and per-lead Brier: production vs nested temperature (clipped 1.5) vs fixed temperature 1.5."""
import numpy as np, pandas as pd
from experiments.harness import load, walk_forward, logit_model, PROD_OD
from experiments.model_structure.proposal import harness_fp, fit, predict
from experiments.model_structure.variants5 import mk_fixed_temp
from experiments.model_structure.variants import mk_bucket
d = load()
z, y, p0, ok = walk_forward(d, "od25", logit_model(PROD_OD))
_, _, p1, _ = walk_forward(d, "od25", harness_fp)
_, _, p2, _ = walk_forward(d, "od25", mk_fixed_temp(mk_bucket(), 1.5))
wk = ((z["issue"] - pd.Timestamp("2026-09-15", tz="UTC")).dt.days // 7).values
B = lambda p, m: np.mean((p[m] - y[m]) ** 2)
rows = []
for w in np.unique(wk[wk >= 0]):
    m = ok & (wk == w)
    rows.append({"week": int(w), "n": int(m.sum()), "prod": B(p0, m), "temp_clip1.5": B(p1, m), "fixed1.5": B(p2, m)})
print(pd.DataFrame(rows).round(4).to_string(index=False))
rows = []
for L in [1, 2, 3, 6, 9, 12, 18, 24, 30, 36, 42, 48]:
    m = ok & (z["lead"] == L).values
    rows.append({"lead": L, "prod": B(p0, m), "temp_clip1.5": B(p1, m), "fixed1.5": B(p2, m)})
print(pd.DataFrame(rows).round(4).to_string(index=False))
m4 = ok & z["lead"].isin([1, 6, 24, 48]).values
print("brier_1_6_24_48: prod", round(B(p0, m4), 4), "temp_clip1.5", round(B(p1, m4), 4), "fixed1.5", round(B(p2, m4), 4))
print("brier_all:       prod", round(B(p0, ok), 4), "temp_clip1.5", round(B(p1, ok), 4), "fixed1.5", round(B(p2, ok), 4))
print("final production temps:", fit(d[d["od"].notna()], "od25")["temp"])
