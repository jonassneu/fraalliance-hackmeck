"""Operational-state features for RWY18 usability."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import numpy as np, pandas as pd
from experiments.harness import evaluate, PROD_18
from fra.dataset import DATA, load_labels
from fra.labels import load_counts

d = pd.read_parquet(DATA / "ops_feats.parquet")
lab, _ = load_labels()
H = pd.Timedelta(hours=1)
r = lab["rwy18_open"].asfreq("h")
known = d["issue"] - H
d["r18_share24"] = r.rolling(24, min_periods=1).mean().reindex(known).fillna(1).values - 1
d["r18_share72"] = r.rolling(72, min_periods=1).mean().reindex(known).fillna(1).values - 1
last_closed = r.index.to_series().where(r == 0).ffill()
hs = np.asarray((pd.DatetimeIndex(known) - pd.DatetimeIndex(last_closed.reindex(known))) / H)
d["r18_log_h_since_closed"] = np.log1p(np.nan_to_num(hs, nan=2000).clip(0, 2000))
d["r18_recent_closed"] = (np.nan_to_num(hs, nan=2000) <= 6).astype(float)
c = load_counts().asfreq("h")
n = c["west"] + c["east"]
d["r18_dep_share"] = (c["rwy18_deps"] / n).where(n >= 15).reindex(known).values
d["r18_dep_share"] = d["r18_dep_share"].fillna(d["r18_dep_share"].median())
d["r18_now_s"] = d["rwy18_now_f"] * (d["lead"] <= 3)
cands = {"PRODUCTION": PROD_18, "+r18_share24": PROD_18 + ["r18_share24"], "+r18_share72": PROD_18 + ["r18_share72"],
         "+h_since_closed": PROD_18 + ["r18_log_h_since_closed"], "+recent_closed": PROD_18 + ["r18_recent_closed"],
         "+dep_share": PROD_18 + ["r18_dep_share"], "+od_now25": PROD_18 + ["od_now25"], "+prog_signed": PROD_18 + ["prog_signed"]}


def one(kv):
    return kv[0], evaluate(d, rwy18_features=kv[1], label=kv[0])["rwy18"]


if __name__ == "__main__":
    from multiprocessing import Pool
    with Pool(8) as pool:
        out = pd.DataFrame(dict(pool.map(one, list(cands.items())))).T
    delta = out - out.loc["PRODUCTION"]
    delta[[c for c in out if c.startswith("acc")]] *= 100
    print(delta.sort_values("brier_all").round(4).to_string())
