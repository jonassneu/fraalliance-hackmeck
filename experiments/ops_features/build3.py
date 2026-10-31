"""Feature cache, step 3: "switch pending / done" variants of the direction mix (mix_pend, mix_done)."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import numpy as np
import pandas as pd
from experiments.ops_features import feats as F
from fra.dataset import DATA, load_labels
d = pd.read_parquet(DATA / "ops_feats.parquet")
lab, _ = load_labels()
d = F.add_mix_pending(d, lab)
d.to_parquet(DATA / "ops_feats.parquet")
z = d[(d.issue >= "2026-09-15") & (d.lead == 1) & d.od.notna()]
sw = (z.od == 25) != (z.od_now25 == 1)
for c in ["mix_pend", "mix_done"]:
    print(c, "nonzero share: switch", (z[c] != 0)[sw].mean(), "no-switch", (z[c] != 0)[~sw].mean(), "sign-agree among switch", (np.sign(z[c][sw]) == (2*(z.od[sw]==25)-1)).mean() if True else 0)
