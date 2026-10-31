"""Per-week and per-lead Brier deltas of candidate sets vs production (robustness)."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import numpy as np
import pandas as pd
from experiments.harness import PROD_OD, walk_forward, logit_model, START
from experiments.ops_features.combo2 import parse, d

specs = ["PRODUCTION="] + sys.argv[1:]
res = {}
for s in specs:
    name, F, C = parse(s)
    z, y, p, ok = walk_forward(d, "od25", logit_model(F, C=C))
    res[name] = (p - y) ** 2
wk = ((z["issue"] - START).dt.days // 7).values
lead = z["lead"].values
base = res["PRODUCTION"]
for name in list(res)[1:]:
    dl = res[name] - base
    print(name)
    print(" per week (x1e4):", pd.Series(dl[ok]).groupby(wk[ok]).mean().mul(1e4).round(1).to_dict())
    print(" per lead (x1e4):", pd.Series(dl[ok]).groupby(lead[ok]).mean().mul(1e4).round(1).to_dict())
    # paired bootstrap over days
    day = z["issue"].dt.floor("D").values[ok]
    g = pd.Series(dl[ok]).groupby(day).sum()
    n = pd.Series(dl[ok]).groupby(day).size()
    rng = np.random.default_rng(0)
    bs = [g.values[i].sum() / n.values[i].sum() for i in (rng.integers(0, len(g), len(g)) for _ in range(2000))]
    print(f" total {dl[ok].mean()*1e4:.2f}e-4, day-bootstrap 90% CI [{np.quantile(bs,0.05)*1e4:.2f}, {np.quantile(bs,0.95)*1e4:.2f}]e-4, P(<0)={np.mean(np.array(bs)<0):.2f}")
