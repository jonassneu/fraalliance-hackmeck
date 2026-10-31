"""Like combo.py but supports scaling ('feat*3') and reports Brier at leads 1-3 and #switches caught at +1h."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import numpy as np
import pandas as pd
from experiments.harness import PROD_OD, walk_forward, logit_model
from fra.dataset import DATA

d = pd.read_parquet(DATA / "ops_feats.parquet")


def parse(spec):
    name, body = spec.split("=", 1)
    F = list(PROD_OD)
    C = 0.03
    for tok in filter(None, body.split(",")):
        if tok.startswith("C:"):
            C = float(tok[2:])
        elif tok.startswith("sub:"):
            a, b = tok[4:].split(">")
            F = [b if c == a else c for c in F]
        elif tok.startswith("-"):
            F.remove(tok[1:])
        elif "*" in tok:
            c, k = tok.split("*")
            col = f"{c}x{k}"
            d[col] = d[c].fillna(0) * float(k)
            F.append(col)
        else:
            F.append(tok)
    return name, F, C


def one(spec):
    name, F, C = parse(spec)
    z, y, p, ok = walk_forward(d, "od25", logit_model(F, C=C))
    r = {}
    lead = z["lead"].values
    for L in [1, 6, 24, 48]:
        m = ok & (lead == L)
        r[f"acc{L}"] = ((p[m] > 0.5) == y[m]).mean()
    m4 = ok & np.isin(lead, [1, 6, 24, 48])
    r["brier_1_6_24_48"] = np.mean((p[m4] - y[m4]) ** 2)
    r["brier_all"] = np.mean((p[ok] - y[ok]) ** 2)
    m = ok & (lead <= 3)
    r["brier_1to3"] = np.mean((p[m] - y[m]) ** 2)
    m = ok & (lead == 1) & (y != z["od_now25"].values)
    r["sw_caught1"] = int(((p[m] > 0.5) == y[m]).sum())
    r["n_sw1"] = int(m.sum())
    return name, r


if __name__ == "__main__":
    from multiprocessing import Pool
    todo = ["PRODUCTION="] + sys.argv[1:]
    with Pool(min(8, len(todo))) as pool:
        out = pd.DataFrame(dict(pool.map(one, todo, chunksize=1))).T
    print(out.round(4).to_string())
    delta = out - out.loc["PRODUCTION"]
    delta[[c for c in out if c.startswith("acc")]] *= 100
    print("\nDELTA vs production (acc in pp, brier abs):")
    print(delta.sort_values("brier_all").round(4).to_string())
