"""Prognosis evaluated at the issue hour itself (filled from older versions) -> 'overdue switch' features."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import numpy as np, pandas as pd
from experiments.ops_features import feats as F
from fra.dataset import DATA
d = pd.read_parquet(DATA / "ops_feats.parquet")
q = F.prog_hourly(pd.read_parquet(DATA / "prognosis.parquet"))
iss = pd.DatetimeIndex(d["issue"])
v = np.full(len(d), np.nan)
for lag in range(0, 13):
    old = F.lookup(q, "main", iss - pd.Timedelta(hours=lag), iss)
    v = np.where(np.isnan(v), ((2 * old["west"] - 1) * old["prob"]).values, v)
now = (2 * d["od_now25"] - 1).values
d["prog_at_issue"] = np.nan_to_num(v)
d["overdue"] = ((np.sign(d["prog_at_issue"]) != now) & (d["prog_at_issue"].abs() > 0.3)).astype(float) * np.sign(d["prog_at_issue"])
d["overdue_s"] = d["overdue"] * (d["lead"] <= 3)
d.to_parquet(DATA / "ops_feats.parquet")
z = d[(d.issue >= "2026-09-15") & (d.lead == 1) & d.od.notna()]
sw = (z.od == 25) != (z.od_now25 == 1)
print("overdue nonzero: switch", (z.overdue != 0)[sw].mean(), "no-switch", (z.overdue != 0)[~sw].mean())
