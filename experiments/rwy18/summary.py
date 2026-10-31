"""Compare candidates: per-lead BSS/AUC/warn-hit/false alarms + event-level table."""
import sys, glob
from pathlib import Path
import numpy as np, pandas as pd
ROOT = Path(__file__).resolve().parents[2]; sys.path.insert(0, str(ROOT))
from experiments.rwy18.evalwf import metrics
pd.set_option("display.width", 300)
rows = []
preds = {}
for f in sorted(glob.glob(str(ROOT / "data" / "rwy18_preds" / "pred_*.parquet"))):
    name = Path(f).stem[5:]
    z = pd.read_parquet(f); preds[name] = z
    for pc in (["p", "rule", "pers"] if name.startswith("PROD_v2_ext") else ["p"]):
        m = metrics(z, pc).set_index("lead")
        r = {"model": name if pc == "p" else f"{pc}"}
        for L in [1, 6, 24, 48, "all"]:
            if L in m.index:
                r[f"bss{L}"] = m.loc[L, "bss"]; r[f"auc{L}"] = m.loc[L, "auc"]
                r[f"hitW{L}"] = m.loc[L, "hitW"]; r[f"faW{L}"] = m.loc[L, "faW"]
        r["brier_all"] = m.loc["all", "brier"]; r["n_closed"] = m.loc["all", "n_closed"]; r["hit50_all"] = m.loc["all", "hit50"]; r["fa50_all"] = m.loc["all", "fa50"]
        rows.append(r)
t = pd.DataFrame(rows).set_index("model")
print(t[[c for c in t.columns if c.startswith("bss") or c in ("brier_all", "n_closed")]].round(3).to_string())
print(t[[c for c in t.columns if c.startswith("auc")]].round(3).to_string())
print(t[[c for c in t.columns if c.startswith("hitW") or c.startswith("faW") or c in ("hit50_all", "fa50_all")]].round(2).to_string())
# event-level: P(open) for each closure hour at leads 1/6/24/48
want = [n for n in preds if n.endswith("v2_ext")]
ev = []
for n in want:
    z = preds[n]; c = z[(z.y == 0) & z.lead.isin([1, 6, 24, 48])]
    piv = c.pivot_table(index="valid", columns="lead", values="p")
    piv.columns = [f"{n}@{L}" for L in piv.columns]; ev.append(piv)
E = pd.concat(ev, axis=1)
for n in want:
    print(f"\n{n}: P(open) at closure hours"); print(E[[c for c in E.columns if c.startswith(n + "@")]].round(2).to_string())
