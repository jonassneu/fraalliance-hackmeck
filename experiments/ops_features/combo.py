"""Combinations of the best single features (OD 25). Usage: combo.py 'name=feat1,feat2;sub:old>new' ..."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import pandas as pd
from experiments.harness import evaluate, PROD_OD
from fra.dataset import DATA

d = pd.read_parquet(DATA / "ops_feats.parquet")


def parse(spec):
    name, body = spec.split("=", 1)
    F = list(PROD_OD)
    for tok in filter(None, body.split(",")):
        if tok.startswith("sub:"):
            a, b = tok[4:].split(">")
            F = [b if c == a else c for c in F]
        elif tok.startswith("-"):
            F.remove(tok[1:])
        else:
            F.append(tok)
    return name, F


def one(nF):
    return nF[0], evaluate(d, od_features=nF[1], label=nF[0])["od25"]


if __name__ == "__main__":
    from multiprocessing import Pool
    todo = [("PRODUCTION", list(PROD_OD))] + [parse(s) for s in sys.argv[1:]]
    with Pool(min(8, len(todo))) as pool:
        out = pd.DataFrame(dict(pool.map(one, todo, chunksize=1))).T
    delta = out - out.loc["PRODUCTION"]
    delta[[c for c in out if c.startswith("acc")]] *= 100
    print("\nDELTA vs production (acc in pp, brier abs):")
    print(delta.sort_values("brier_all").round(4).to_string())
