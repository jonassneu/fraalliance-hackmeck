"""PLAN_weights.json: blend weight per lead bucket chosen on P1, confirmed on the long test and P2.

    uv run python experiments/replication/weights.py
"""
import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT))
from fra import evalkit as E  # noqa: E402

BUCKETS = [(1, 3), (4, 12), (13, 30), (31, 48)]
GRID = np.round(np.arange(0, 1.0001, 0.05), 2)
SEED = 20261106
P1 = (pd.Timestamp("2024-08-12", tz="UTC"), pd.Timestamp("2025-11-01", tz="UTC"))
P2 = (pd.Timestamp("2025-11-01", tz="UTC"), pd.Timestamp("2026-06-01", tz="UTC"))


def wvec(lead, w4):
    w = np.full(len(lead), np.nan)
    for (lo, hi), wb in zip(BUCKETS, w4):
        w[(lead >= lo) & (lead <= hi)] = wb
    return w


def main():
    t = pd.read_parquet(HERE / "preds.parquet")
    t = t[t.od.isin([25, 7]) & t.p_logit.notna() & t.p_dec_365.notna()]
    y = (t.od == 25).astype(float).to_numpy()
    iss, v, lead = pd.DatetimeIndex(t.issue), pd.DatetimeIndex(t.valid), t.lead.to_numpy()
    p1 = np.asarray((iss >= P1[0]) & (iss < P1[1]) & (v < P1[1]))
    pl, pd_ = t.p_logit.to_numpy(), t.p_dec_365.to_numpy()

    def brier(w, m):
        p = w * pl[m] + (1 - w) * pd_[m]
        return np.mean((p - y[m]) ** 2)

    w4 = []
    for lo, hi in BUCKETS:
        m = p1 & (lead >= lo) & (lead <= hi)
        sc = [brier(w, m) for w in GRID]
        w4.append(float(GRID[int(np.argmin(sc))]))
        print(f"bucket {lo}-{hi}: P1 Brier by logit weight " +
              " ".join(f"{w:.2f}:{s:.5f}" for w, s in zip(GRID[::4], sc[::4])) + f" -> best {w4[-1]}")
    sc1 = [brier(w, p1) for w in GRID]
    w1 = float(GRID[int(np.argmin(sc1))])
    print("W4 =", w4, " W1 =", w1)

    out = {"W4": w4, "W1": w1}
    # long test: blend-v2's own components
    L = pd.read_parquet(ROOT / "experiments" / "integration" / "final_wf_long.parquet")
    L = L[L.od.isin([25, 7])]
    sets = {"long_test": (L, "p_logit", "p_dec", None),
            "P2": (t, "p_logit", "p_dec_365", np.asarray((iss >= P2[0]) & (iss < P2[1]) & (v < P2[1])))}
    for name, (d, cl, cd, mask) in sets.items():
        ld = d.lead.to_numpy()
        yy = (d.od == 25).astype(float)
        preds = {"w0.5": 0.5 * d[cl] + 0.5 * d[cd],
                 "W4": wvec(ld, w4) * d[cl] + (1 - wvec(ld, w4)) * d[cd],
                 "W1": w1 * d[cl] + (1 - w1) * d[cd]}
        bt = E.bootstrap(yy, preds, d.valid, ld, pairs=[("W4", "w0.5"), ("W1", "w0.5")], mask=mask, seed=SEED)
        bt.to_csv(HERE / f"weights_bootstrap_{name}.csv", index=False)
        r = bt[(bt.metric == "brier") & (bt.lead == E.POOLED)].set_index("method")
        acc = bt[(bt.metric == "acc") & bt.lead.isin(E.REPORT_LEADS) & (bt.method == "W4 - w0.5")]
        out[name] = {k: [round(float(r.loc[k, c]), 5) for c in ("est", "lo", "hi")] for k in r.index}
        out[name]["W4_acc_pp"] = {int(a.lead): [round(100 * a.est, 2), round(100 * a.lo, 2), round(100 * a.hi, 2)]
                                  for a in acc.itertuples()}
        out[name]["W4_any_lead_acc_worse"] = bool((acc.hi < 0).any())
        print(f"\n{name}: Brier(1,6,24,48)", {k: v for k, v in out[name].items() if k in r.index})
        print("  W4 - 0.5 accuracy pp by lead:", out[name]["W4_acc_pp"])
    lt, p2 = out["long_test"]["W4 - w0.5"], out["P2"]["W4 - w0.5"]
    out["passes"] = bool(lt[2] < 0 or (lt[0] < 0 and p2[0] < 0 and not out["long_test"]["W4_any_lead_acc_worse"]
                                         and not out["P2"]["W4_any_lead_acc_worse"]))
    json.dump(out, open(HERE / "weights_verdict.json", "w"), indent=1)
    print("\nPASSES", out["passes"])


if __name__ == "__main__":
    main()
