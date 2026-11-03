"""Phase-0 yardstick: long walk-forward test (from evalkit.TEST_START) + legacy period, with 95 % day-block bootstrap CIs.

    uv run python -m fra.train            # long test  -> data/eval.csv, experiments/eval_long/preds_cv.parquet
    uv run python -m fra.train legacy     # 2026-09-15 -> data/eval_long_legacy*.csv, preds_legacy.parquet
    uv run python experiments/eval_long/run.py [--skip-changetime] [--no-md]
        -> experiments/eval_long/REPORT.md, data/eval_long_summary.csv, data/eval_long_monthly.csv,
           data/changetime_eval.csv (long test), data/eval_long_changetime_legacy.csv

Checks that experiments.harness (cached table) reproduces fra.train's out-of-fold predictions exactly, then scores the
production model and the baselines (official rules, published prognosis, persistence) on identical rows.

The long test is only PARTLY out of sample: the production spec was selected on the walk-forward from
evalkit.SELECTION_START (2026-09-15). The report therefore also splits it into the part not used for selection
(valid < SELECTION_START) and the selection period (issue >= SELECTION_START), each with its own bootstrap.
"""

import os

for _v in ["OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"]:
    os.environ[_v] = "1"
import sys  # noqa: E402
import warnings  # noqa: E402
from pathlib import Path  # noqa: E402

import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

warnings.filterwarnings("ignore")
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from experiments import harness as H  # noqa: E402
from fra import changetime as CT  # noqa: E402
from fra import evalkit as E  # noqa: E402
from fra import train as T  # noqa: E402
from fra.dataset import DATA  # noqa: E402

OUT = Path(__file__).resolve().parent
SEL = E.SELECTION_START
# long-test sub-periods (by outcome time, so no outcome of the selection period leaks into "pre"; boundary rows with
# issue < SEL <= valid belong to neither)
SUB = {"pre": f"not used for selection: valid < {SEL.date()}", "sel": f"selection period: issue >= {SEL.date()}"}
SUB_SHORT = {"pre": f"{E.TEST_START:%d %b} – {SEL - pd.Timedelta(days=1):%d %b} (not used for selection)",
             "sel": f"from {SEL:%d %b} (spec selected here)"}
L4 = list(E.REPORT_LEADS)
OD_METHODS = {"model": "p_od25", "prognosis": "prognosis_od25", "rules": "rule_od25", "persistence": "persistence_od25"}
NAMES = {"model": "**Model (production)**", "prognosis": "Published prognosis", "rules": "Official rules",
         "persistence": "Persistence"}


def md_table(df):
    cols = [str(c) for c in df.columns]
    rows = ["| " + " | ".join(cols) + " |", "|" + "---|" * len(cols)]
    for r in df.itertuples(index=False):
        rows.append("| " + " | ".join(f"{v:.3g}" if isinstance(v, float) else str(v) for v in r) + " |")
    return "\n".join(rows)


def pct(x, nd=1):
    return "–" if pd.isna(x) else f"{100 * x:.{nd}f}"


def cell(t, metric, lead, method, scale=100, nd=1, sign=False):
    k = (metric, lead, method)
    if k not in t.index:
        return "–"
    r = t.loc[k]
    return E.fmt(r["est"], r["lo"], r["hi"], scale, nd, sign)


def od_frame(p):
    z = p[p["od"].notna() & p["p_od25"].notna()].copy()
    z["y"] = (z["od"] == 25).astype(int)
    z["changed"] = z["y"] != z["persistence_od25"]
    return z


def boot_od(z, mask=None, block_days=1, methods=OD_METHODS):
    preds = {k: z[c].values.astype(float) for k, c in methods.items()}
    pairs = [("model", k) for k in methods if k != "model"]
    return E.bootstrap(z["y"].values, preds, z["valid"], z["lead"].values, L4, pairs, mask=mask,
                       block_days=block_days).set_index(["metric", "lead", "method"])


def verify(pred_file, start):
    """harness production walk-forward on the cached table == fra.train out-of-fold predictions?"""
    d = H.load()
    out = []
    for tgt, col in [("od25", "p_od25"), ("rwy18", "p_rwy18")]:
        z, y, p, ok = H.production_preds(d, tgt, start)
        h = pd.Series(p[ok], index=pd.MultiIndex.from_frame(z.loc[ok, ["issue", "lead"]]))
        t = pred_file.set_index(["issue", "lead"])[col].dropna()
        j = pd.concat([h.rename("h"), t.rename("t")], axis=1, join="inner")
        out.append(dict(target=tgt, harness_rows=len(h), train_rows=len(t), matched=len(j),
                        max_abs_diff=float((j["h"] - j["t"]).abs().max())))
    return pd.DataFrame(out)


def overall_table(t, n_rows):
    lines = ["| Method | " + " | ".join(f"{L} h" for L in L4) + " | Brier(1,6,24,48) |", "|---|" + "---|" * 5]
    for k in OD_METHODS:
        lines.append(f"| {NAMES[k]} | " + " | ".join(cell(t, "acc", L, k) for L in L4) + " | "
                     + cell(t, "brier", E.POOLED, k, scale=1, nd=4) + " |")
    lines.append("| n rows | " + " | ".join(str(n_rows[L]) for L in L4) + " | |")
    lines += ["", "Paired differences on identical rows (accuracy in pp; Brier: negative = model better):", "",
              "| Comparison | " + " | ".join(f"{L} h" for L in L4) + " | Brier(1,6,24,48) |", "|---|" + "---|" * 5]
    for k in OD_METHODS:
        if k == "model":
            continue
        m = f"model - {k}"
        lines.append(f"| model − {k} | " + " | ".join(cell(t, "acc", L, m, sign=True) for L in L4) + " | "
                     + cell(t, "brier", E.POOLED, m, scale=1, nd=4, sign=True) + " |")
    return "\n".join(lines)


def sub_masks(z):
    return {"pre": (z["valid"] < SEL).values, "sel": (z["issue"] >= SEL).values}


def n_sig(t, meth, side="lo"):
    """# of REPORT_LEADS where the CI of the paired accuracy difference excludes 0 (model better)."""
    return sum(1 for L in L4 if ("acc", L, meth) in t.index and t.loc[("acc", L, meth), "lo"] > 0)


def subperiod_table(TBS, z):
    m = sub_masks(z)
    lines = ["| Long-test sub-period | valid days | n rows (24 h) | Model acc 1 / 6 / 24 / 48 h % | Model Brier(1,6,24,48) | "
             "Model − prognosis acc (pp) 1 / 6 / 24 / 48 h | Model − prognosis Brier | CI excludes 0 (vs prognosis / rules) |",
             "|---|" + "---|" * 7]
    for k, t in TBS.items():
        g = z[m[k]]
        lines.append(f"| {SUB[k]} | {g['valid'].dt.date.nunique()} | {int((g['lead'] == 24).sum())} | "
                     + " / ".join(pct(t.loc[("acc", L, "model"), "est"]) for L in L4) + " | "
                     + cell(t, "brier", E.POOLED, "model", scale=1, nd=4) + " | "
                     + " / ".join(cell(t, "acc", L, "model - prognosis", sign=True) for L in L4) + " | "
                     + cell(t, "brier", E.POOLED, "model - prognosis", scale=1, nd=4, sign=True) + " | "
                     + f"{n_sig(t, 'model - prognosis')}/4 / {n_sig(t, 'model - rules')}/4 |")
    return "\n".join(lines)


def changetime_sub(ct):
    """Event accuracy of the next-change rule split at SELECTION_START (whole 48 h horizon before it vs issue >= it)."""
    issue = pd.DatetimeIndex(ct["issue"])
    masks = {"pre": np.asarray(issue + pd.Timedelta(hours=CT.H) < SEL), "sel": np.asarray(issue >= SEL)}
    act = ct["act"]
    keys = {"nested": "model (nested-tuned rule)", "fixed": "model (final PARAMS, chosen in-sample)",
            "prognosis": "published prognosis (main >= 0.5)", "rules": "official rules (rule_od25)"}
    x = {}
    for k, meth in keys.items():
        pr = ct["pred"][meth]
        hit = (act >= 0) & (pr >= 0) & (np.abs(pr - act) <= CT.TOL_H)
        x[k] = (hit | ((act < 0) & (pr < 0))).astype(float)
    out = {}
    for k, mk in masks.items():
        if mk.any():
            out[k] = E.bootstrap_means(x, issue, [("nested", "prognosis"), ("nested", "rules")], mask=mk
                                       ).set_index("method")
    return out


def changetime_sub_table(cts):
    f = lambda t, k, sign=False: E.fmt(*t.loc[k, ["est", "lo", "hi"]], sign=sign) if k in t.index else "–"
    lines = ["| Long-test sub-period | issue times | Model (nested-tuned rule) % | Model (current PARAMS) % | "
             "Prognosis % | Rules % | nested − prognosis (pp) | nested − rules (pp) |", "|---|" + "---|" * 7]
    lab = {"pre": f"whole 48 h horizon before {SEL.date()} (not used for selection)",
           "sel": f"issue ≥ {SEL.date()} (PARAMS / P48_COEF tuned here)"}
    for k, t in cts.items():
        lines.append(f"| {lab[k]} | {int(t.loc['nested', 'n'])} | {f(t, 'nested')} | {f(t, 'fixed')} | {f(t, 'prognosis')} | "
                     f"{f(t, 'rules')} | {f(t, 'nested - prognosis', True)} | {f(t, 'nested - rules', True)} |")
    return "\n".join(lines)


def changed_table(z):
    t = boot_od(z, mask=z["changed"].values, methods={k: v for k, v in OD_METHODS.items() if k != "persistence"})
    n = z[z["changed"]].groupby("lead").size()
    lines = ["| Method | " + " | ".join(f"{L} h (n={n.get(L, 0)})" for L in L4) + " |", "|---|" + "---|" * 4]
    for k in ["model", "prognosis", "rules"]:
        lines.append(f"| {NAMES[k]} | " + " | ".join(cell(t, "acc", L, k) for L in L4) + " |")
    lines.append("| Persistence | " + " | ".join("0.0" for _ in L4) + " |")
    for k in ["prognosis", "rules"]:
        lines.append(f"| model − {k} (pp) | " + " | ".join(cell(t, "acc", L, f"model - {k}", sign=True) for L in L4) + " |")
    return "\n".join(lines), t


def monthly_table(z):
    z = z.assign(month=z["valid"].dt.strftime("%Y-%m"))
    lines = ["| Valid month | n (24 h) | Model 1 h | 6 h | 24 h | 48 h | Brier(1,6,24,48) | Prognosis 24 h | Rules 24 h | "
             "Persistence 24 h | changed hours (24 h) |", "|---|" + "---|" * 10]
    rows = []
    for mo, g in z.groupby("month"):
        acc = {L: ((g.loc[g.lead == L, "p_od25"] > 0.5) == g.loc[g.lead == L, "y"]).mean() for L in L4}
        g24 = g[g.lead == 24]
        b = ((g["p_od25"] - g["y"]) ** 2).mean()
        base = {k: (g24[c] == g24["y"]).mean() for k, c in OD_METHODS.items() if k != "model"}
        rows.append(dict(month=mo, n24=len(g24), **{f"acc{L}": acc[L] for L in L4}, brier=b,
                         **{f"{k}24": v for k, v in base.items()}, changed24=int(g24["changed"].sum())))
        lines.append(f"| {mo} | {len(g24)} | " + " | ".join(pct(acc[L]) for L in L4) + f" | {b:.4f} | "
                     + " | ".join(pct(base[k]) for k in ["prognosis", "rules", "persistence"])
                     + f" | {int(g24['changed'].sum())} |")
    return "\n".join(lines), pd.DataFrame(rows)


def rwy18_lines(p):
    z = p[p["rwy18_open"].notna() & p["p_rwy18"].notna()].copy()
    z["y"] = z["rwy18_open"].astype(int)
    t = E.bootstrap(z["y"].values, {"model": z["p_rwy18"].values, "rules": z["rule_rwy18"].values.astype(float),
                                    "persistence": z["persistence_rwy18"].values.astype(float)},
                    z["valid"], z["lead"].values, L4, [("model", "rules"), ("model", "persistence")]
                    ).set_index(["metric", "lead", "method"])
    z = z[z["lead"].isin(L4)]
    closed = z[z.y == 0]
    warn = z[(z.p_rwy18 < 0.8)]
    lines = ["Closure hours (busy hours with no RWY 18 departure) among scored rows: "
             + ", ".join(f"{L} h: {int((closed.lead == L).sum())}" for L in L4)
             + f" (distinct valid hours: {closed['valid'].nunique()}; valid days: {closed['valid'].dt.date.nunique()}).",
             "",
             "| Method | " + " | ".join(f"{L} h" for L in L4) + " | Brier(1,6,24,48) |", "|---|" + "---|" * 5]
    for k in ["model", "rules", "persistence"]:
        lines.append(f"| {k} | " + " | ".join(cell(t, "acc", L, k) for L in L4) + " | "
                     + cell(t, "brier", E.POOLED, k, scale=1, nd=4) + " |")
    lines.append(f"\nAt leads 1/6/24/48 h: model warnings P(open) < 0.8 on {len(warn)} rows, of which "
                 f"{int((warn.y == 0).sum())} are closures ({len(closed)} closure rows). Too few closures in this period to "
                 "measure closure skill; see the RWY 18 study under experiments/ for the extended evaluation from Sep 2025.")
    return "\n".join(lines), t


def changetime_block(ct, label):
    res = ct["res"].set_index("method")
    pick = {"model (nested-tuned rule)": "**Model (nested-tuned rule)**",
            "model (final PARAMS, chosen in-sample)": "Model (current PARAMS)",
            "published prognosis (main >= 0.5)": "Published prognosis", "official rules (rule_od25)": "Official rules",
            "persistence (never change)": "Persistence"}
    act = ct["act"]
    x_hit, x_ev = {}, {}
    for k in pick:
        pr = ct["pred"][k]
        hit = (act >= 0) & (pr >= 0) & (np.abs(pr - act) <= CT.TOL_H)
        x_ev[k] = (hit | ((act < 0) & (pr < 0))).astype(float)
        x_hit[k] = np.where(act >= 0, hit, np.nan).astype(float)
    m0 = "model (nested-tuned rule)"
    pairs = [(m0, k) for k in pick if k != m0]
    t_ev = E.bootstrap_means(x_ev, ct["issue"], pairs).set_index("method")
    t_hit = E.bootstrap_means(x_hit, ct["issue"], pairs, mask=act >= 0).set_index("method")
    f = lambda t, k, sign=False: E.fmt(*t.loc[k, ["est", "lo", "hi"]], sign=sign) if k in t.index else "–"
    lines = [f"{label}: {len(act)} issue times ({ct['issue'].min():%Y-%m-%d} .. {ct['issue'].max():%Y-%m-%d}), "
             f"{int((act >= 0).sum())} with a sustained change within 48 h.", "",
             "| Method | Event accuracy % | Change caught ±3 h % | Timing MAE on hits (h) | False alarms | Missed |",
             "|---|---|---|---|---|---|"]
    for k, name in pick.items():
        r = res.loc[k]
        mae = "–" if pd.isna(r["timing_mae_h"]) else f"{r['timing_mae_h']:.2f}"
        lines.append(f"| {name} | {f(t_ev, k)} | {f(t_hit, k)} | {mae} | {int(r['false_alarm'])} | {int(r['missed'])} |")
    lines += ["", "| Paired difference (pp) | Event accuracy | Change caught ±3 h |", "|---|---|---|"]
    for a, b in pairs:
        k = f"{a} - {b}"
        lines.append(f"| nested model − {pick[b].strip('*').lower()} | {f(t_ev, k, True)} | {f(t_hit, k, True)} |")
    ex = ct["extra"].iloc[0]
    lines.append(f"\nP(change within 48 h): walk-forward Brier {ex['brier']:.4f} vs climatology {ex['brier_climatology']:.4f}; "
                 f"likely window covers {pct(ex['window_coverage'], 0)} % of changes (mean width {ex['window_width_h']:.1f} h); "
                 f"parameters tuned on all weeks: {ex['params']}, P48 coef {ex['p48_coef']}.")
    return "\n".join(lines), t_ev, t_hit


def hackathon_table(hk, legacy, long_):
    """Model + baselines: hackathon eval.csv (old labels) vs legacy period re-run (new labels) vs long test."""
    lines = ["| Lead | n hackathon / legacy / long | Model: hackathon | legacy re-run | long test | "
             "Prognosis: hackathon | legacy | long | Rules: hackathon | legacy | long | Persistence: hackathon | legacy | long |",
             "|---|" + "---|" * 13]
    for L in L4:
        a, b, c = (x[(x.target == "od25") & (x.lead_h == L)].iloc[0] for x in (hk, legacy, long_))
        lines.append(f"| {L} h | {int(a.n)} / {int(b.n)} / {int(c.n)} | "
                     + " | ".join(" | ".join(pct(x[f"{k}_acc"]) for x in (a, b, c))
                                  for k in ["model", "prognosis", "rule", "persistence"]) + " |")
    lines.append("| Brier(1,6,24,48) | | " + " | ".join(
        f"{np.average(x[x.target == 'od25'].model_brier, weights=x[x.target == 'od25'].n):.4f}" for x in (hk, legacy, long_))
        + " | | | | | | | | | |")
    return "\n".join(lines)


def summary(TB, TB7, CH, notemp, CTR, month_df, ev_leg, hk, n_closed, nb_share, TBS, CTS, sel_share):
    e = lambda t, m, L, k: t.loc[(m, L, k), "est"] if (m, L, k) in t.index else np.nan
    ci = lambda t, m, L, k: t.loc[(m, L, k), ["lo", "hi"]].values if (m, L, k) in t.index else (np.nan, np.nan)
    acc = lambda k, meth: " / ".join(pct(e(TB[k], "acc", L, meth)) for L in L4)
    sig = lambda k, meth: sum(ci(TB[k], "acc", L, f"model - {meth}")[0] > 0 for L in L4)
    br = lambda k, meth="model", t=None: E.fmt(*(t if t is not None else TB[k]).loc[("brier", E.POOLED, meth),
                                                                               ["est", "lo", "hi"]], scale=1, nd=4)
    worst, best = month_df.loc[month_df["brier"].idxmax()], month_df.loc[month_df["brier"].idxmin()]
    hk_b = np.average(hk[hk.target == "od25"].model_brier, weights=hk[hk.target == "od25"].n)
    tw = notemp["long"].loc[("brier", E.POOLED, "model - production")]
    gap = [100 * (e(TB["legacy"], "acc", L, "model") - e(TB["long"], "acc", L, "model")) for L in L4]
    dpp = lambda t, meth: [100 * e(t, "acc", L, meth) for L in L4]
    pre, sel = TBS["pre"], TBS["sel"]
    out = [
        f"- **Caveat: the long test is not a clean out-of-sample test.** The production spec (features, C = 0.03, "
        f"120-day window, temperature scaling, change-rule PARAMS / P48_COEF) was selected on the walk-forward from "
        f"{SEL.date()}, which is {sel_share:.0%} of the long test's scored rows (`evalkit.SELECTION_START`); three weather "
        "features were in addition vetted on a Mar–Sep 2026 check. The part not used for selection "
        f"({E.TEST_START.date()} .. {(SEL - pd.Timedelta(days=1)).date()}, valid < {SEL.date()}) is reported separately "
        "below and is the fairer estimate; only the locked holdout (issue ≥ "
        f"{E.HOLDOUT_START.date()}) is a clean test.",
        f"- **Long test ({E.TEST_START.date()} .. 2026-10-30, 152 days, ~3,600 rows per lead):** model accuracy "
        f"{acc('long', 'model')} % at 1/6/24/48 h, Brier(1,6,24,48) {br('long')}. Published prognosis "
        f"{acc('long', 'prognosis')} %, official rules {acc('long', 'rules')} %, persistence {acc('long', 'persistence')} %.",
        f"- **Model vs published prognosis and official rules.** Whole long test: the model is ahead of the prognosis "
        f"at every lead ({min(dpp(TB['long'], 'model - prognosis')):+.1f} to {max(dpp(TB['long'], 'model - prognosis')):+.1f} pp; "
        f"Brier diff {E.fmt(*TB['long'].loc[('brier', E.POOLED, 'model - prognosis'), ['est', 'lo', 'hi']], scale=1, nd=4, sign=True)}), "
        f"95 % CI of the paired accuracy difference excludes 0 at {sig('long', 'prognosis')}/4 leads vs the prognosis "
        f"and {sig('long', 'rules')}/4 vs the rules. **On the part not used for selection** (valid < {SEL.date()}): model "
        + " / ".join(pct(e(pre, "acc", L, "model")) for L in L4) + f" %, Brier {br(None, t=pre)}; model − prognosis "
        + " / ".join(cell(pre, "acc", L, "model - prognosis", sign=True) for L in L4)
        + f" pp at 1/6/24/48 h (CI excludes 0 at {n_sig(pre, 'model - prognosis')}/4 leads; Brier diff "
        f"{cell(pre, 'brier', E.POOLED, 'model - prognosis', scale=1, nd=4, sign=True)}), vs the rules "
        f"{n_sig(pre, 'model - rules')}/4. Selection period (issue ≥ {SEL.date()}): model − prognosis "
        + " / ".join(f"{x:+.1f}" for x in dpp(sel, "model - prognosis"))
        + f" pp, CI excludes 0 at {n_sig(sel, 'model - prognosis')}/4. Against persistence (whole long test) it is level "
        f"at 1 h ({E.fmt(*TB['long'].loc[('acc', 1, 'model - persistence'), ['est', 'lo', 'hi']], sign=True)} pp) and far "
        "ahead from 6 h on.",
        f"- **The hackathon period was the easy part of the year.** Legacy test (from {E.LEGACY_TEST_START.date()}, new labels): "
        f"{acc('legacy', 'model')} %, Brier {br('legacy')} (hackathon submission on the old labels: Brier {hk_b:.4f}). "
        f"Over the long test the Brier is {br('long')}; by month it ranges from {best['brier']:.4f} ({best['month']}) to "
        f"{worst['brier']:.4f} ({worst['month']}). Accuracy on the long test is "
        f"{min(gap):.1f}–{max(gap):.1f} pp lower than on the legacy period at 1/6/24/48 h.",
        f"- **Error bars are wide in absolute terms, narrow for paired comparisons.** Model Brier CI width is "
        f"±{(TB['long'].loc[('brier', E.POOLED, 'model'), 'hi'] - TB['long'].loc[('brier', E.POOLED, 'model'), 'lo']) / 2:.4f} "
        f"(long test) and ±{(TB['legacy'].loc[('brier', E.POOLED, 'model'), 'hi'] - TB['legacy'].loc[('brier', E.POOLED, 'model'), 'lo']) / 2:.4f} "
        "(legacy), because a few bad-weather days dominate. Variants must therefore be judged by the PAIRED difference "
        f"vs production on identical rows: e.g. temperature on/off differs by {tw['est']:+.4f} [{tw['lo']:+.4f}, {tw['hi']:+.4f}] "
        "Brier on the long test, i.e. the paired CI half-width for a near-identical variant is ~0.0007. 7-day blocks "
        "give only slightly wider CIs than 1-day blocks (table below), so day blocks are adequate.",
        f"- **Temperature scaling (the hackathon's last win) does not replicate:** paired Brier no-temp − production = "
        f"{tw['est']:+.4f} [{tw['lo']:+.4f}, {tw['hi']:+.4f}] on the long test and "
        f"{notemp['legacy'].loc[('brier', E.POOLED, 'model - production'), 'est']:+.4f} "
        f"[{notemp['legacy'].loc[('brier', E.POOLED, 'model - production'), 'lo']:+.4f}, "
        f"{notemp['legacy'].loc[('brier', E.POOLED, 'model - production'), 'hi']:+.4f}] on the legacy period (rebuilt labels). "
        "Neutral; kept in production for now.",
        "- **Changed hours** (state at valid ≠ state at issue; where planning matters), long test: model "
        + " / ".join(pct(e(CH['long'][1], 'acc', L, 'model')) for L in L4)
        + " % vs prognosis " + " / ".join(pct(e(CH['long'][1], 'acc', L, 'prognosis')) for L in L4)
        + " % vs rules " + " / ".join(pct(e(CH['long'][1], 'acc', L, 'rules')) for L in L4)
        + " %. Model clearly better at 24/48 h; at 1 h it is worse than both (CIs of the difference include 0). "
        f"Only {nb_share:.0%} of the 1 h changed hours are the first hour after the night ban, so the hackathon's "
        "night-ban explanation does not cover this: short-notice switches are a real weakness.",
    ]
    if CTR:
        r = CTR["long"]["res"].set_index("method")
        out.append(
            f"- **Next change time (long test, {len(CTR['long']['act'])} issue times):** event accuracy model "
            f"{pct(r.loc['model (nested-tuned rule)', 'event_acc'])} % (current PARAMS "
            f"{pct(r.loc['model (final PARAMS, chosen in-sample)', 'event_acc'])} %) vs prognosis "
            f"{pct(r.loc['published prognosis (main >= 0.5)', 'event_acc'])} % and rules "
            f"{pct(r.loc['official rules (rule_od25)', 'event_acc'])} %; change caught within ±3 h "
            f"{pct(r.loc['model (nested-tuned rule)', 'hit_rate'])} % (legacy period: "
            f"{pct(CTR['legacy']['res'].set_index('method').loc['model (nested-tuned rule)', 'hit_rate'])} %). "
            "Nested tuning of the change rule costs "
            f"{100 * (r.loc['model (final PARAMS, chosen in-sample)', 'event_acc'] - r.loc['model (nested-tuned rule)', 'event_acc']):.1f} pp "
            "event accuracy vs the fixed current PARAMS (tuning noise; see table below)."
            + (f" Part not used for selection (whole horizon before {SEL.date()}, "
               f"{int(CTS['pre'].loc['nested', 'n'])} issue times): nested model "
               f"{E.fmt(*CTS['pre'].loc['nested', ['est', 'lo', 'hi']])} % vs prognosis "
               f"{pct(CTS['pre'].loc['prognosis', 'est'])} % (difference "
               f"{E.fmt(*CTS['pre'].loc['nested - prognosis', ['est', 'lo', 'hi']], sign=True)} pp); selection period "
               f"{pct(CTS['sel'].loc['nested', 'est'])} % vs {pct(CTS['sel'].loc['prognosis', 'est'])} %."
               if CTS and "pre" in CTS and "sel" in CTS else ""))
    out.append(f"- **RWY 18:** only {n_closed} distinct closure hour(s) fall in the long test, so the ~99.9 % accuracy "
               "below is the base rate; closure skill cannot be measured on this period (the official gust rule raises "
               "~3 % false closures here).")
    return out


def main():
    args = sys.argv[1:]
    pc, pl = OUT / "preds_cv.parquet", OUT / "preds_legacy.parquet"
    if not pc.exists() or not pl.exists():
        raise SystemExit("run `uv run python -m fra.train` and `uv run python -m fra.train legacy` first")
    P = {"long": pd.read_parquet(pc), "legacy": pd.read_parquet(pl)}
    starts = {"long": E.TEST_START, "legacy": E.LEGACY_TEST_START}

    ver = pd.concat([verify(P[k], starts[k]).assign(period=k) for k in P])
    print(ver.to_string(index=False))

    d = H.load()
    notemp = {}
    for k in P:  # does temperature scaling (production) beat the plain logit on this period?
        r = H.evaluate(d, od_model=H.logit_model(H.PROD_OD), label=f"no temperature, {k}", ci=True, start=starts[k])
        notemp[k] = r["ci"]["od25"].set_index(["metric", "lead", "method"])

    Z = {k: od_frame(p) for k, p in P.items()}
    TB = {k: boot_od(z) for k, z in Z.items()}
    TB7 = {k: boot_od(z, block_days=7) for k, z in Z.items()}
    NR = {k: z.groupby("lead").size() for k, z in Z.items()}
    CH = {k: changed_table(z) for k, z in Z.items()}
    month_md, month_df = monthly_table(Z["long"])
    SM = sub_masks(Z["long"])
    TBS = {k: boot_od(Z["long"], mask=m) for k, m in SM.items()}
    in4 = Z["long"]["lead"].isin(L4).values
    sel_share = float((SM["sel"] & in4).sum() / in4.sum())
    R18 = {k: rwy18_lines(p) for k, p in P.items()}

    hk = pd.read_csv(DATA / "baseline_hackathon" / "eval.csv")
    ev_long = pd.read_csv(DATA / "eval.csv")
    ev_leg = pd.read_csv(DATA / "eval_long_legacy.csv")
    hk_ct = pd.read_csv(DATA / "baseline_hackathon" / "changetime_eval.csv").set_index("method")

    CTR = {}
    if "--skip-changetime" not in args:
        CTR["long"] = CT.main()  # also rewrites data/changetime_eval.csv (long test)
        CTR["legacy"] = CT.main(E.LEGACY_TEST_START)  # -> data/eval_long_changetime_legacy.csv (never the production file)
    CTS = changetime_sub(CTR["long"]) if CTR else {}

    # ------------------------------------------------------------------ machine-readable summary
    summ = []
    for k in P:
        summ.append(TB[k].reset_index().assign(period=k, rows="all", block_days=1))
        summ.append(TB7[k].reset_index().assign(period=k, rows="all", block_days=7))
        summ.append(CH[k][1].reset_index().assign(period=k, rows="changed", block_days=1))
        summ.append(R18[k][1].reset_index().assign(period=k, rows="rwy18", block_days=1))
    for k, t in TBS.items():  # long-test sub-periods split at evalkit.SELECTION_START
        summ.append(t.reset_index().assign(period=f"long_{'pre_selection' if k == 'pre' else 'selection_period'}",
                                           rows="all", block_days=1))
    summ = pd.concat(summ, ignore_index=True)
    T._atomic(DATA / "eval_long_summary.csv", lambda p: summ.to_csv(p, index=False))
    T._atomic(DATA / "eval_long_monthly.csv", lambda p: month_df.to_csv(p, index=False))

    # ------------------------------------------------------------------ report
    def rng(z):
        return f"issue {z['issue'].min():%Y-%m-%d} .. {z['issue'].max():%Y-%m-%d %H:%M}, valid until {z['valid'].max():%Y-%m-%d %H:%M} UTC"

    c1 = Z["long"][Z["long"]["changed"] & (Z["long"]["lead"] == 1)]
    nb_share = float((c1["valid"].dt.tz_convert("Europe/Berlin").dt.hour == 5).mean())  # first hour after the ban
    md = ["# Phase 0: a trustworthy yardstick (long walk-forward test + error bars)",
          "",
          f"Generated by `experiments/eval_long/run.py` on {pd.Timestamp.now(tz='UTC'):%Y-%m-%d %H:%M} UTC from "
          "`fra.train` walk-forward predictions (`experiments/eval_long/preds_*.parquet`). All numbers: production model "
          "(logit C = 0.03 per lead bucket, last 120 days, per-bucket temperature scaling; RWY18 logit C = 3), "
          "retrained every week on outcomes known before that week; labels = `data/labels.parquet` rebuilt 2026-10-31.",
          "",
          "## Summary",
          "",
          *summary(TB, TB7, CH, notemp, CTR, month_df, ev_leg, hk,
                   P["long"].loc[P["long"]["rwy18_open"] == 0, "valid"].nunique(), nb_share, TBS, CTS, sel_share),
          "",
          "## Setup",
          "",
          f"- **Periods** (`fra/evalkit.py`, single source of truth): long test from **{E.TEST_START.date()}** "
          f"(default for all walk-forward evaluations), legacy test from **{E.LEGACY_TEST_START.date()}** (hackathon "
          f"period), locked holdout from **{E.HOLDOUT_START.date()}**. The production spec was selected on the "
          f"walk-forward from **{SEL.date()}** (`evalkit.SELECTION_START`), so the long test is split into the part not used "
          f"for selection (valid < {SEL.date()}) and the selection period (issue ≥ {SEL.date()}).",
          f"  - Long test: {rng(Z['long'])}; {Z['long']['valid'].dt.date.nunique()} valid days, "
          f"{int(Z['long']['lead'].isin(L4).sum())} scored OD rows at 1/6/24/48 h.",
          f"  - Legacy test: {rng(Z['legacy'])}; {Z['legacy']['valid'].dt.date.nunique()} valid days.",
          f"- **Holdout lock:** rows with issue ≥ {E.HOLDOUT_START.date()} *or* valid ≥ {E.HOLDOUT_START.date()} are never "
          "scored by default (fra.train, harness, changetime). `python -m fra.train final`, `harness.evaluate(..., final=True)` "
          "and `python -m fra.changetime --final` score ONLY the holdout, each week trained strictly on earlier data "
          "(changetime uses the frozen PARAMS / P48_COEF). No holdout rows exist yet (labels end 2026-10-30 11:00 UTC).",
          "- **Folds:** week w = issue in [start + 7w d, start + 7(w+1) d), training rows = labels known at the week start "
          "(valid + KNOWN_LAG_H <= week start; with the hackathon lag of 1 h: valid < week start). "
          "Identical to the hackathon's \"valid < first issue of the week\" on both periods (checked: the first issue of "
          "every week equals the calendar week start).",
          f"- **Error bars:** day-block bootstrap ({E.N_BOOT} reps, seed {E.SEED}): whole UTC days of valid time are "
          "resampled; the same resampled days are used for every method and lead, so paired differences are on identical "
          "rows. Brackets = 95 % percentile interval. All methods are scored on exactly the same rows.",
          "- **Baselines:** official rules (case section 3 on the ECMWF forecast tailwind), published Umwelthaus prognosis "
          "(main scenario ≥ 0.5, persistence where missing), persistence (OD of the last complete radar hour, "
          "fra.dataset.last_complete_hour).",
          "",
          "### Harness reproduces fra.train exactly",
          "",
          "`experiments/harness.py` now runs the production code path (`fra.train.fit/predict`, incl. temperature "
          "scaling; RWY18 C = 3, full history) by default; `logit_model(F)` keeps the old plain logit (no temperature). "
          "Out-of-fold predictions, harness (cached table `data/wf_cache.parquet`) vs `fra.train` (own feature build):",
          "",
          md_table(ver[["period", "target", "harness_rows", "train_rows", "matched", "max_abs_diff"]]),
          "",
          "(`train_rows` > `harness_rows` for OD: fra.train also predicts rows whose valid hour has no label; they are "
          "never scored.)",
          ""]
    for k, title in [("long", f"## Long test ({E.TEST_START.date()} .. holdout): operating direction"),
                     ("legacy", f"## Legacy test ({E.LEGACY_TEST_START.date()} .. holdout, = the period the spec was "
                                "selected on): operating direction")]:
        md += [title, "", "Accuracy % [95 % CI]:", "", overall_table(TB[k], NR[k]), ""]
        if k == "long":
            md += ["### Long test split at the model-selection start", "",
                   f"The production spec was chosen on the walk-forward from {SEL.date()}, so rows from then on are "
                   "in-sample for model selection. Rows whose valid time is before it were not used to select the spec "
                   "(only a Mar–Sep 2026 veto check of three weather features touched them); rows with issue < "
                   f"{SEL.date()} ≤ valid are in neither part. Same day-block bootstrap, each sub-period on its own:", "",
                   subperiod_table(TBS, Z["long"]), ""]
            for sk in TBS:
                nr = Z["long"][sub_masks(Z["long"])[sk]].groupby("lead").size()
                md += [f"**{SUB_SHORT[sk]}**, accuracy % [95 % CI]:", "", overall_table(TBS[sk], nr), ""]
            md += ["### Accuracy by month (valid time, long test)", "", month_md, ""]
        md += [f"### Changed hours ({k}): state at valid time ≠ state at issue time", "", CH[k][0], ""]
    md += ["## CI sensitivity: 1-day vs 7-day blocks", "",
           "Weather regimes last several days, so 1-day blocks may understate the uncertainty. Same statistics with "
           "7-day blocks:", "",
           "| Period | Statistic | 1-day blocks | 7-day blocks |", "|---|---|---|---|"]
    for k in P:
        for lab, key, sc, nd, sg in [("Model Brier(1,6,24,48)", ("brier", E.POOLED, "model"), 1, 4, False),
                                     ("Model acc 24 h (%)", ("acc", 24, "model"), 100, 1, False),
                                     ("Model − prognosis acc 24 h (pp)", ("acc", 24, "model - prognosis"), 100, 1, True),
                                     ("Model − prognosis Brier(1,6,24,48)", ("brier", E.POOLED, "model - prognosis"), 1, 4, True)]:
            md.append(f"| {k} | {lab} | {cell(TB[k], *key, scale=sc, nd=nd, sign=sg)} | {cell(TB7[k], *key, scale=sc, nd=nd, sign=sg)} |")
    md += ["", "## Temperature scaling on the long test", "",
           "Paired difference plain logit (no temperature, old harness default) − production (with temperature), "
           "identical rows. Temperature scaling is monotone around p = 0.5, so it cannot change accuracy; only the Brier "
           "score can move:", "",
           "| Period | Brier(1,6,24,48) no-temp − production | acc 1/6/24/48 h difference (pp) |", "|---|---|---|"]
    for k in P:
        t = notemp[k]
        md.append(f"| {k} | {cell(t, 'brier', E.POOLED, 'model - production', scale=1, nd=4, sign=True)} | "
                  + " / ".join(cell(t, 'acc', L, 'model - production', sign=True) for L in L4) + " |")
    md += ["", "## RWY 18 open", ""]
    for k in P:
        md += [f"**{k} test.** " + R18[k][0], ""]
    if CTR:
        md += ["## Next change time", "",
               "Nested walk-forward (week w scored with the rule parameters that were best on weeks < w; the first week "
               "only seeds the tuning). Hit = predicted first change within ±3 h of the actual first sustained change "
               "(≥ 2 h); event accuracy = hits + correct \"no change\" over all issue times. CIs: day blocks of issue time.", ""]
        for k, lab in [("long", "Long test"), ("legacy", "Legacy test")]:
            md += [changetime_block(CTR[k], lab)[0], ""]
            if k == "long" and CTS:
                md += ["Long test split at the model-selection start (PARAMS, P48_COEF and the rule family were tuned "
                       f"on the walk-forward from {SEL.date()}; the nested rule is still tuned only on earlier weeks). "
                       "Event accuracy % [95 % CI]:", "", changetime_sub_table(CTS), ""]
        hm = hk_ct.loc["model (nested-tuned rule)"]
        md += [f"Hackathon (old labels, data/baseline_hackathon/changetime_eval.csv): model event accuracy "
               f"{pct(hm['event_acc'])} %, hit rate {pct(hm['hit_rate'])} %, {int(hm['n_issues'])} issue times; "
               f"prognosis {pct(hk_ct.loc['published prognosis (main >= 0.5)', 'event_acc'])} %, "
               f"rules {pct(hk_ct.loc['official rules (rule_od25)', 'event_acc'])} %.", ""]
    md += ["## Against the hackathon numbers", "",
           "Accuracy % (point estimates). *hackathon* = `data/baseline_hackathon/eval.csv` (git 1eb027b, old labels, "
           "2026-09-15 test); *legacy re-run* = same period and method, labels rebuilt 2026-10-31; *long test* = from "
           f"{E.TEST_START.date()}.", "",
           hackathon_table(hk, ev_leg, ev_long), ""]
    if "--no-md" in args:  # tables only (the Markdown report is written by the documentation step)
        print("--no-md: REPORT.md not written")
        return
    T._atomic(OUT / "REPORT.md", lambda p: p.write_text("\n".join(md) + "\n"))
    print(f"wrote {OUT / 'REPORT.md'}")


if __name__ == "__main__":
    main()
