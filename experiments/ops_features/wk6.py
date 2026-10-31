"""Diagnose test week 7 (index 6), the weakest week for candidate set A: Brier change per day and worst rows."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import numpy as np, pandas as pd
from experiments.harness import PROD_OD, walk_forward, logit_model, START
from experiments.ops_features.combo2 import parse, d
_, F, C = parse("A=now_reset*3,rule_now_disagree_s*3,prog_trans*3")
z, y, p, ok = walk_forward(d, "od25", logit_model(F, C=C))
_, _, p0, _ = walk_forward(d, "od25", logit_model(PROD_OD))
z = z.assign(y=y, pA=p, p0=p0, dl=(p - y) ** 2 - (p0 - y) ** 2)
w = z[ok & (((z.issue - START).dt.days // 7) == 6).values]
print(w.groupby(w.issue.dt.floor("D"))["dl"].sum().round(2))
cols = ["issue", "lead", "od_now", "od", "p0", "pA", "dl", "now_reset", "rule_now_disagree_s", "prog_trans", "obs_tw25_f", "prog_signed"]
print(w.sort_values("dl", ascending=False)[cols].head(15).round(2).to_string())
