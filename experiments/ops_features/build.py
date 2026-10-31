"""Build the candidate feature table once -> data/ops_feats.parquet (experiment cache)."""
import sys, time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import pandas as pd
from experiments.harness import load
from experiments.ops_features import feats as F
from fra.dataset import DATA, hourly_metar, load_labels

t = time.time()
d = load()
lab, _ = load_labels()
d = F.add_prog_structure(d); print("prog", time.time() - t, flush=True)
d = F.add_history(d, lab); print("hist", time.time() - t, flush=True)
d = F.add_metar(d, hourly_metar()); print("metar", time.time() - t, flush=True)
d = F.add_calendar(d)
d = F.add_lead_state(d)
d.to_parquet(DATA / "ops_feats.parquet")
new = [c for c in d.columns if c not in load().columns]
print(d[new].describe().T.round(3).to_string())
