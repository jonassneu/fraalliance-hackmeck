"""Run one candidate walk-forward: python run1.py <name> <lab> <start>"""
import sys, json
from pathlib import Path
import pandas as pd
ROOT = Path(__file__).resolve().parents[2]; sys.path.insert(0, str(ROOT))
from experiments.rwy18.evalwf import wf, report, candidates
from experiments import harness as H
name, lab, sname = sys.argv[1:4]
C = {}
for g in ["base", "feat", "small", "nb2"]:
    C.update(candidates(g))
d = pd.read_parquet(ROOT / "data/rwy18_cache.parquet")
st = pd.Timestamp("2025-09-01", tz="UTC") if sname == "ext" else H.START
labcol, nowcol = f"lab_{lab}", ("rwy18_now_f" if lab == "v1" else f"now_{lab}")
z = wf(d, labcol, nowcol, C[name], st)
out = report(z, f"{name}|{lab}|{sname}", pcols=("p", "rule", "pers") if name == "PROD" else ("p",))
PRED = ROOT / "data" / "rwy18_preds"  # walk-forward predictions, read by summary.py / sweep.py
PRED.mkdir(parents=True, exist_ok=True)
z[["issue", "valid", "lead", "y", "p", "clim", "rule", "pers"]].to_parquet(PRED / f"pred_{name}_{lab}_{sname}.parquet")
