"""Print the Markdown tables of experiments/phase2/results.csv + decisions.json (for the phase 2 report).

    uv run python -m experiments.phase2.table
"""

import json
from pathlib import Path

import numpy as np
import pandas as pd

HERE = Path(__file__).resolve().parent


def f(e, lo=None, hi=None, scale=1.0, nd=4, sign=True):
    if not np.isfinite(e):
        return "–"
    s = f"{{:{'+' if sign else ''}.{nd}f}}"
    out = s.format(e * scale)
    if lo is not None:
        out += f" [{s.format(lo * scale)}, {s.format(hi * scale)}]"
    return out


def main():
    res = pd.read_csv(HERE / "results.csv")
    dec = json.loads((HERE / "decisions.json").read_text())
    w = res.set_index(["variant", "period"])
    names = list(dict.fromkeys(res["variant"]))
    print("| # | Variant | Group | Brier(1,6,24,48) | Δ Brier vs production, whole test | Δ H1 (Jun-Jul) | Δ H2 (Aug-Oct) "
          "| Δ selection-free | Δ Brier all leads | Δ acc 24 h (pp) | Passes |")
    print("|---|---|---|---|---|---|---|---|---|---|---|")
    for i, n in enumerate(names, 1):
        a, h1, h2, sf = (w.loc[(n, p)] for p in ("whole", "H1", "H2", "selection_free"))
        dd = dec.get(n, {})
        flag = "yes" if dd.get("passes") else "no"
        if dd.get("passes") and dd.get("needs_live_inputs"):
            flag = "yes (not deployable as a constant)"
        print(f"| {i} | {n} | {dd.get('group', '')} | {a['brier']:.5f} | "
              f"{f(a['d_brier'], a['d_brier_lo'], a['d_brier_hi'], nd=5)} | "
              f"{f(h1['d_brier'], h1['d_brier_lo'], h1['d_brier_hi'], nd=5)} | "
              f"{f(h2['d_brier'], h2['d_brier_lo'], h2['d_brier_hi'], nd=5)} | "
              f"{f(sf['d_brier'], sf['d_brier_lo'], sf['d_brier_hi'], nd=5)} | "
              f"{f(a['d_brier_all'], a['d_brier_all_lo'], a['d_brier_all_hi'], nd=5)} | "
              f"{f(a['d_acc24'], a['d_acc24_lo'], a['d_acc24_hi'], scale=100, nd=1)} | {flag} |")
    print()
    print("| Variant | acc 1 h | acc 6 h | acc 24 h | acc 48 h | Δ acc 1 h | Δ acc 6 h | Δ acc 48 h |")
    print("|---|---|---|---|---|---|---|---|")
    p = w.loc[(names[0], "whole")]
    print(f"| production | {100 * p['acc1_prod']:.1f} | {100 * p['acc6_prod']:.1f} | {100 * p['acc24_prod']:.1f} | "
          f"{100 * p['acc48_prod']:.1f} | | | |")
    for n in names:
        a = w.loc[(n, "whole")]
        print(f"| {n} | {100 * a['acc1']:.1f} | {100 * a['acc6']:.1f} | {100 * a['acc24']:.1f} | {100 * a['acc48']:.1f} | "
              + " | ".join(f(a[f'd_acc{L}'], a[f'd_acc{L}_lo'], a[f'd_acc{L}_hi'], scale=100, nd=1) for L in (1, 6, 48))
              + " |")


if __name__ == "__main__":
    main()
