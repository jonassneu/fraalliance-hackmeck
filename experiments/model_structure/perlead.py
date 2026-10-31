"""Per-lead Brier / accuracy / reliability for production vs proposal."""
import numpy as np, pandas as pd
from experiments.harness import load, walk_forward, logit_model, PROD_OD
from experiments.model_structure.proposal import harness_fp
d = load()
z, y, p0, ok = walk_forward(d, "od25", logit_model(PROD_OD))
_, _, p1, _ = walk_forward(d, "od25", harness_fp)
rows = []
for L in sorted(z["lead"].unique()):
    m = ok & (z["lead"] == L).values
    rows.append(dict(lead=L, n=int(m.sum()), brier_prod=np.mean((p0[m] - y[m]) ** 2), brier_prop=np.mean((p1[m] - y[m]) ** 2),
                     acc_prod=((p0[m] > .5) == y[m]).mean(), acc_prop=((p1[m] > .5) == y[m]).mean(),
                     mean_p_prod=p0[m].mean(), mean_p_prop=p1[m].mean(), obs=y[m].mean(),
                     sharp_prod=np.mean(np.abs(p0[m] - .5)), sharp_prop=np.mean(np.abs(p1[m] - .5))))
print(pd.DataFrame(rows).round(4).to_string(index=False))
# per week
wk = ((z["issue"] - pd.Timestamp("2026-09-15", tz="UTC")).dt.days // 7).values
print(pd.DataFrame([dict(week=w, n=int((ok & (wk == w)).sum()), brier_prod=np.mean((p0[ok & (wk == w)] - y[ok & (wk == w)]) ** 2),
                          brier_prop=np.mean((p1[ok & (wk == w)] - y[ok & (wk == w)]) ** 2)) for w in np.unique(wk[wk >= 0])]).round(4).to_string(index=False))
# reliability bins (all leads)
bins = np.linspace(0, 1, 11)
for name, p in [("prod", p0), ("prop", p1)]:
    b = np.digitize(p[ok], bins) - 1
    print(name, "reliability:", [(round(p[ok][b == i].mean(), 2), round(y[ok][b == i].mean(), 2), int((b == i).sum())) for i in range(10) if (b == i).sum() > 0])
