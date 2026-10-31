"""Feature cache, step 2: night-ban reset, direction mix of the last flown hour, short-lead variants."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import pandas as pd
from experiments.ops_features import feats as F
from fra.dataset import DATA, load_labels
d = pd.read_parquet(DATA / "ops_feats.parquet")
lab, _ = load_labels()
d = F.add_night_reset(d)
d = F.add_mix(d, lab)
d = F.short(d, ["obs_tw25_f", "rule_now_disagree", "prog_trans", "prog_disagree", "obs_tw25_trend3", "tw25_bias"])
d.to_parquet(DATA / "ops_feats.parquet")
z = d[(d.issue >= "2026-09-15") & (d.lead == 1) & d.od.notna()]
sw = (z.od == 25) != (z.od_now25 == 1)
print("reset share: switch", z.reset[sw].mean(), "no-switch", z.reset[~sw].mean())
print("mix>0.2 share: switch", (z.mix_last.abs() > 0.2)[sw].mean(), "no-switch", (z.mix_last.abs() > 0.2)[~sw].mean())
