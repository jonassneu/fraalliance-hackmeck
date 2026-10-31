"""Warning-threshold sweep on walk-forward predictions (v2 label, extended period)."""
import glob
from pathlib import Path
import numpy as np, pandas as pd
pd.set_option("display.width", 250)
rows = []
PRED = Path(__file__).resolve().parents[2] / "data" / "rwy18_preds"  # written by run1.py
for f in sorted(glob.glob(str(PRED / "pred_*_v2_ext.parquet"))):
    name = Path(f).stem[5:-7]
    z = pd.read_parquet(f); z = z[z.p.notna()]
    for grp, m in [("lead<=6", z.lead <= 6), ("lead>6", z.lead > 6), ("all", z.lead > 0)]:
        s = z[m]; closed = s.y.values == 0
        for thr in [0.5, 0.7, 0.8, 0.9, 0.95]:
            w = s.p.values < thr
            rows.append(dict(model=name, grp=grp, thr=thr, n=len(s), n_closed=int(closed.sum()),
                             hit=(w & closed).sum() / max(closed.sum(), 1), fa_per1000=1000 * (w & ~closed).sum() / max((~closed).sum(), 1)))
        rows.append(dict(model=name, grp=grp, thr="rule", n=len(s), n_closed=int(closed.sum()),
                         hit=((s.rule.values == 0) & closed).sum() / max(closed.sum(), 1), fa_per1000=1000 * ((s.rule.values == 0) & ~closed).sum() / max((~closed).sum(), 1)))
t = pd.DataFrame(rows)
for grp in ["lead<=6", "lead>6", "all"]:
    print(f"\n=== {grp}")
    print(t[t.grp == grp].pivot_table(index="model", columns="thr", values=["hit", "fa_per1000"]).round(2).to_string())
