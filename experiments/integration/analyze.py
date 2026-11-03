"""OD blend evaluation on the long test (pre-registered in plan.json): production logit vs decision rollout vs blend,
blend weights (fixed 0.5 vs walk-forward per lead bucket), Part B variants (METAR gust, DEFAULT_NATIVE).

    uv run python experiments/integration/analyze.py
Inputs: dec_long.parquet (run_wf.py long) + the production walk-forward predictions (experiments.harness).
Output: od_results.json, od_bootstrap.csv, preds_long.parquet (per-row logit / decision / blend predictions).
"""

import os

for _k in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(_k, "1")

import json  # noqa: E402
import sys  # noqa: E402
from pathlib import Path  # noqa: E402

import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from fra import evalkit  # noqa: E402

OUT = Path(__file__).resolve().parent
LEADS = evalkit.REPORT_LEADS
BUCKETS = [(1, 3), (4, 12), (13, 30), (31, 48)]
GRID = np.round(np.arange(0, 1.0001, 0.05), 2)
LAG = pd.Timedelta(hours=2)


def table():
    from experiments import harness as Hn
    d = Hn.load()
    z, y, p, ok = Hn.production_preds(d, "od25")
    t = z.loc[ok, ["issue", "lead", "valid", "od", "od_now", "rule_od25", "base_prognosis_od25", "od_now25"]].copy()
    t["p_logit"] = p[ok]
    dec = pd.read_parquet(OUT / "dec_long.parquet")
    for c in dec["config"].unique():
        x = dec[dec["config"] == c][["issue", "lead", "p25", "od_now_dec"]].rename(
            columns={"p25": f"p_dec_{c}", "od_now_dec": f"od0_{c}"})
        t = t.merge(x, on=["issue", "lead"], how="left")
    t["y"] = (t["od"] == 25).astype(float)
    t["week"] = evalkit.test_weeks(t["issue"], t["valid"])
    return t.reset_index(drop=True)


def wf_weights(t, pcol, start_weeks=2):
    """Per-bucket logit weight for each test week, fitted on earlier test weeks' rows known at the week start."""
    wts = {}
    p_out = np.full(len(t), np.nan)
    for w in sorted(t["week"].unique()):
        ws = evalkit.week_start(w)
        te = (t["week"] == w).to_numpy()
        tr = (t["valid"] + LAG <= ws).to_numpy() & (t["week"] < w).to_numpy()
        wk = {}
        for lo, hi in BUCKETS:
            bt = te & t["lead"].between(lo, hi).to_numpy()
            bb = tr & t["lead"].between(lo, hi).to_numpy()
            if t.loc[tr, "week"].nunique() < start_weeks or not bb.any():
                a = 0.5
            else:
                y, pl, pd_ = t["y"].to_numpy()[bb], t["p_logit"].to_numpy()[bb], t[pcol].to_numpy()[bb]
                a = float(GRID[np.argmin([np.mean((g * pl + (1 - g) * pd_ - y) ** 2) for g in GRID])])
            wk[f"{lo}-{hi}"] = a
            p_out[bt] = a * t["p_logit"].to_numpy()[bt] + (1 - a) * t[pcol].to_numpy()[bt]
        wts[int(w)] = wk
    # weights on all pre-holdout weeks (what live would use if adopted)
    final = {}
    for lo, hi in BUCKETS:
        bb = t["lead"].between(lo, hi).to_numpy()
        y, pl, pd_ = t["y"].to_numpy()[bb], t["p_logit"].to_numpy()[bb], t[pcol].to_numpy()[bb]
        final[f"{lo}-{hi}"] = float(GRID[np.argmin([np.mean((g * pl + (1 - g) * pd_ - y) ** 2) for g in GRID])])
    return p_out, wts, final


def boot(t, preds, pairs, mask=None):
    y = t["y"].to_numpy()
    a = evalkit.bootstrap(y, preds, t["valid"], t["lead"], LEADS, pairs, mask=mask)
    b = evalkit.bootstrap(y, preds, t["valid"], t["lead"], evalkit.ALL_LEADS, pairs, mask=mask, per_lead=False,
                          pooled_id=evalkit.POOLED_ALL)
    return pd.concat([a, b], ignore_index=True)


def changed_hours(t, cols, lead=1):
    m = (t["lead"] == lead) & (t["od"] != t["od_now"])
    out = {"n": int(m.sum())}
    for c in cols:
        out[c] = float(((t.loc[m, c] > 0.5) == (t.loc[m, "y"] > 0.5)).mean())
    yy = t.loc[m]
    out["prognosis"] = float((yy["base_prognosis_od25"] == yy["y"]).mean())
    out["rules"] = float((yy["rule_od25"] == yy["y"]).mean())
    ex = evalkit.bootstrap_means({c: ((t[c] > 0.5) == (t["y"] > 0.5)).astype(float) for c in cols}, t["valid"],
                                 pairs=[(cols[-1], cols[0])], mask=m.to_numpy())
    out["ci"] = ex.to_dict("records")
    return out


def main():
    t = table()
    ok = t[[c for c in t if c.startswith("p_dec_")]].notna().all(axis=1) & t["p_logit"].notna()
    print(f"rows {len(t)}, with every decision config {int(ok.sum())}; issues {t['issue'].nunique()}", flush=True)
    t = t[ok].reset_index(drop=True)
    assert (t["od0_main"] == t["od_now"]).all(), "decision od_now != production od_now"
    for c in ["main", "gust_metar", "native"]:
        t[f"p_blend_{c}"] = 0.5 * t["p_logit"] + 0.5 * t[f"p_dec_{c}"]
    t["p_blend_wf"], wts, final_w = wf_weights(t, "p_dec_main")
    # valid < 15 Sep: selection-free for the logit spec only, NOT for the blend (all of Jun-Oct was used to choose it)
    pre_sep15 = (t["valid"] < evalkit.SELECTION_START).to_numpy()
    legacy = (t["issue"] >= evalkit.LEGACY_TEST_START).to_numpy()
    preds = {"logit": t["p_logit"], "decision": t["p_dec_main"], "blend": t["p_blend_main"],
             "blend_wf_weights": t["p_blend_wf"], "blend_gust_metar": t["p_blend_gust_metar"],
             "blend_native": t["p_blend_native"], "decision_lag1_reference": t["p_dec_lag1"],
             "prognosis": t["base_prognosis_od25"].astype(float), "rules": t["rule_od25"].astype(float),
             "persistence": t["od_now25"].astype(float)}
    pairs = [("blend", "logit"), ("decision", "logit"), ("blend_wf_weights", "blend"), ("blend_gust_metar", "blend"),
             ("blend_native", "blend"), ("decision_lag1_reference", "decision"), ("blend", "prognosis"),
             ("blend", "rules"), ("blend", "persistence")]
    tabs = []
    for name, m in [("long", None), ("pre_sep15_part", pre_sep15), ("legacy_part", legacy)]:
        b = boot(t, preds, pairs, m)
        b.insert(0, "period", name)
        tabs.append(b)
    tab = pd.concat(tabs, ignore_index=True)
    tab.to_csv(OUT / "od_bootstrap.csv", index=False)
    keep = ["issue", "lead", "valid", "od", "od_now", "p_logit", "p_dec_main", "p_blend_main", "p_blend_wf",
            "p_dec_gust_metar", "p_dec_native", "p_dec_lag1"]
    tmp = OUT / ".preds_long.parquet.tmp"
    t[keep].to_parquet(tmp)
    os.replace(tmp, OUT / "preds_long.parquet")

    def g(period, metric, lead, method):
        r = tab[(tab.period == period) & (tab.metric == metric) & (tab.lead == lead) & (tab.method == method)]
        return None if r.empty else [float(r["est"].iloc[0]), float(r["lo"].iloc[0]), float(r["hi"].iloc[0])]

    res = {"rows": int(len(t)), "issues": int(t["issue"].nunique()), "days": int(t["valid"].dt.floor("D").nunique()),
           "rows_per_lead": int(t.groupby("lead").size().median()),
           "wf_weights_per_week": wts, "weights_fit_all_weeks": final_w, "periods": {}}
    for period in ["long", "pre_sep15_part", "legacy_part"]:
        P = {}
        for meth in list(preds) + [f"{a} - {b}" for a, b in pairs]:
            P[meth] = {"acc": {L: g(period, "acc", L, meth) for L in LEADS},
                       "brier": {L: g(period, "brier", L, meth) for L in LEADS},
                       "brier_1_6_24_48": g(period, "brier", evalkit.POOLED, meth),
                       "brier_all": g(period, "brier", evalkit.POOLED_ALL, meth)}
        res["periods"][period] = P
    res["changed_hours_lead1"] = changed_hours(t, ["p_logit", "p_dec_main", "p_blend_main"])
    res["changed_hours_lead6"] = changed_hours(t, ["p_logit", "p_dec_main", "p_blend_main"], lead=6)
    # pre-registered decisions
    L = res["periods"]
    d_wf, d_wf_sf = L["long"]["blend_wf_weights - blend"]["brier_all"], L["pre_sep15_part"]["blend_wf_weights - blend"]["brier_all"]
    res["decision_weights"] = "per-bucket" if (d_wf[2] < 0 and d_wf_sf[0] < 0) else "fixed 0.5"
    dec_b = {}
    for v in ["gust_metar", "native"]:
        a, s = L["long"][f"blend_{v} - blend"]["brier_all"], L["pre_sep15_part"][f"blend_{v} - blend"]["brier_all"]
        dec_b[v] = "adopt" if (a[2] < 0 and s[0] < 0) else "keep DEFAULT"
    res["decision_partb"] = dec_b
    (OUT / "od_results.json").write_text(json.dumps(res, indent=1, default=str))

    def line(period, meth):
        x = L[period][meth]
        acc = " / ".join(f"{100 * x['acc'][k][0]:.1f}" for k in LEADS)
        return f"{meth:28s} acc {acc}  B(1,6,24,48) {x['brier_1_6_24_48'][0]:.4f}  B(all) {x['brier_all'][0]:.4f}"

    for period in ["long", "pre_sep15_part", "legacy_part"]:
        print(f"\n== {period}")
        for meth in preds:
            print(line(period, meth))
        for a, b in pairs:
            x = L[period][f"{a} - {b}"]
            print(f"{a} - {b}: dB(1,6,24,48) {evalkit.fmt(*x['brier_1_6_24_48'], scale=1, nd=4, sign=True)}  "
                  f"dB(all) {evalkit.fmt(*x['brier_all'], scale=1, nd=4, sign=True)}  dacc "
                  + " / ".join(evalkit.fmt(*x['acc'][k], sign=True) for k in LEADS))
    print("\nweights:", res["decision_weights"], final_w, "\nPart B:", dec_b)
    print("changed hours lead 1:", {k: v for k, v in res["changed_hours_lead1"].items() if k != "ci"})


if __name__ == "__main__":
    main()
