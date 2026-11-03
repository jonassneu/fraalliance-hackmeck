"""Data-layer comparison on the long walk-forward test (paired, day-block bootstrap 95 % CIs).

    uv run python -m experiments.eval_long.datalayer [--n-boot 2000]
        -> experiments/eval_long/datalayer_abs.csv   (per variant: model + baselines, acc / Brier per lead, CIs)
           experiments/eval_long/datalayer_pairs.csv (paired differences between variants)
           experiments/eval_long/preds_datalayer.parquet (out-of-fold P(OD 25) / P(RWY 18 open) of every variant)
    uv run python -m experiments.eval_long.datalayer --changetime
        -> experiments/eval_long/changetime_{old,new}_layer.csv (fra.changetime tables, A vs D data layer) and
           experiments/eval_long/datalayer_changetime.csv (event accuracy with CIs per period, paired new - old)

Variants (production model fra.train.fit / predict, weekly walk-forward from evalkit.TEST_START, holdout excluded):
    A  hackathon data layer: od_now from the hour [t-1h, t) (KNOWN_LAG_H = 1, never available live), ECMWF+ICON-D2
       consensus, trained on the 12 hackathon leads (= the production numbers of the first round)
    B  od_now from the last COMPLETE radar hour [t-2h, t-1h) (KNOWN_LAG_H = 2; fold rule: labels known 2 h after
       the hour start), otherwise as A                                    -> the honest baseline
    C  B + ICON-D2 gaps filled with ICON-EU in the consensus
    D  C trained on all 48 leads (= the new production data layer)
All variants are scored on identical (issue, lead) rows. Periods: long test (issue 2026-06-01 .. holdout), the part
not used for model selection (valid < evalkit.SELECTION_START) and the selection / hackathon period
(issue >= SELECTION_START).
"""

import os

for _v in ["OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"]:
    os.environ[_v] = "1"
import sys  # noqa: E402
import time  # noqa: E402
import warnings  # noqa: E402
from pathlib import Path  # noqa: E402

import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

warnings.filterwarnings("ignore")
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from experiments import harness as H  # noqa: E402
from fra import dataset as DS  # noqa: E402
from fra import evalkit as E  # noqa: E402
from fra import train as T  # noqa: E402

OUT = Path(__file__).resolve().parent
L4 = list(E.REPORT_LEADS)
SEL = E.SELECTION_START
TABLES = {"lag1_d2": dict(lag_h=1, iconeu=False, leads=DS.LEADS),
          "lag2_d2": dict(lag_h=2, iconeu=False, leads=DS.LEADS),
          "lag2_eu": dict(lag_h=2, iconeu=True, leads=DS.LEADS)}
VARIANTS = {"A": ("lag1_d2", DS.LEGACY_LEADS), "B": ("lag2_d2", DS.LEGACY_LEADS),
            "C": ("lag2_eu", DS.LEGACY_LEADS), "D": ("lag2_eu", DS.LEADS)}
LABELS = {"A": "A hackathon layer (od_now [t-1h,t), D2 consensus, 12 leads)",
          "B": "B od_now from last complete hour [t-2h,t-1h)",
          "C": "C B + ICON-EU fill", "D": "D C + trained on all 48 leads"}
PAIRS = [("B", "A"), ("C", "B"), ("D", "C"), ("D", "B"), ("D", "A")]
GROUPS = {"1-48": (E.ALL_LEADS, -1), "1-6": (tuple(range(1, 7)), -16), "42-48": (tuple(range(42, 49)), -4248),
          "43-48": (tuple(range(43, 49)), -4348)}
TARGET_COL = {"od25": "od", "rwy18": "rwy18_open"}


def fit_on_leads(target, leads):
    """Production fit restricted to training rows with lead in `leads`; predicts every test row."""
    keep_leads = set(leads)

    def fp(tr, y, te):
        keep = tr["lead"].isin(keep_leads).to_numpy()
        return T.predict(T.fit(tr[keep], target), te, target)
    return fp


def oof(d, target, leads):
    z, y, p, ok = H.walk_forward(d, target, fit_on_leads(target, leads))
    base = H.BASELINES[target]
    out = z[["issue", "lead", "valid", "od_now", "rwy18_now"]].assign(y=y.astype(float), p=np.where(ok, p, np.nan))
    for k, c in base.items():
        out[k] = z[c].to_numpy(dtype=float)
    return out[ok].reset_index(drop=True)


def periods(f):
    v, i = pd.DatetimeIndex(f["valid"]), pd.DatetimeIndex(f["issue"])
    return {"long": np.ones(len(f), bool), "pre": np.asarray(v < SEL), "legacy": np.asarray(i >= SEL)}


def boot_abs(f, name, target, n_boot):
    """Model + baselines of one variant on its own rows: acc / Brier per lead, pooled 1/6/24/48 and all leads,
    changed hours (state at valid != od_now of the variant) and on the fixed set changed vs the hour [t-1h, t)."""
    rows = []
    base = list(H.BASELINES[target])
    preds = {"model": f["p"].to_numpy(), **{k: f[k].to_numpy() for k in base}}
    pairs = [("model", k) for k in base]
    for per, m in periods(f).items():
        y = np.where(m, f["y"], np.nan)
        tabs = [E.bootstrap(y, preds, f["valid"], f["lead"], L4, pairs, n_boot=n_boot),
                E.bootstrap(y, preds, f["valid"], f["lead"], E.ALL_LEADS, pairs, n_boot=n_boot, per_lead=False,
                            pooled_id=E.POOLED_ALL)]
        if target == "od25":
            now = f["persistence"].to_numpy()
            tabs.append(E.bootstrap(y, preds, f["valid"], f["lead"], L4, pairs, mask=(f["y"].to_numpy() != now),
                                    n_boot=n_boot).assign(rows="changed_own"))
            if "now_1h" in f:
                tabs.append(E.bootstrap(y, preds, f["valid"], f["lead"], L4, pairs,
                                        mask=(f["y"].to_numpy() != f["now_1h"].to_numpy()), n_boot=n_boot)
                            .assign(rows="changed_vs_t-1h"))
        t = pd.concat(tabs, ignore_index=True)
        t["rows"] = t["rows"].fillna("all") if "rows" in t else "all"
        rows.append(t.assign(variant=name, target=target, period=per))
    return pd.concat(rows, ignore_index=True)


def boot_pair(m, a, b, target, n_boot):
    """Paired a - b on the common rows m (columns p_a, p_b, y, valid, lead)."""
    rows = []
    preds = {a: m[f"p_{a}"].to_numpy(), b: m[f"p_{b}"].to_numpy()}
    for per, msk in periods(m).items():
        y = np.where(msk, m["y"], np.nan)
        tabs = [E.bootstrap(y, preds, m["valid"], m["lead"], L4, [(a, b)], n_boot=n_boot)]
        for g, (leads, gid) in GROUPS.items():
            tabs.append(E.bootstrap(y, preds, m["valid"], m["lead"], leads, [(a, b)], n_boot=n_boot,
                                    per_lead=False, pooled_id=gid))
        if target == "od25":
            tabs.append(E.bootstrap(y, preds, m["valid"], m["lead"], L4, [(a, b)],
                                    mask=(m["y"].to_numpy() != m["now_1h"].to_numpy()), n_boot=n_boot)
                        .assign(rows="changed_vs_t-1h"))
        t = pd.concat(tabs, ignore_index=True)
        t["rows"] = t["rows"].fillna("all") if "rows" in t else "all"
        rows.append(t.assign(pair=f"{a} - {b}", target=target, period=per))
    return pd.concat(rows, ignore_index=True)


def main(n_boot=E.N_BOOT):
    t0 = time.time()
    tables = {}
    for k, kw in TABLES.items():
        tables[k] = H.load(refresh=True, **kw)
        print(f"table {k}: {tables[k].shape} ({time.time() - t0:.0f} s)", flush=True)
    # state of the hour [t-1h, t) per issue time (the hackathon od_now) for the fixed "changed" set
    now_1h = tables["lag1_d2"].groupby("issue")["od_now"].first()
    preds, abs_tabs = {}, []
    for target in ["od25", "rwy18"]:
        for name, (tab, leads) in VARIANTS.items():
            f = oof(tables[tab], target, leads)
            f["now_1h"] = (now_1h.reindex(f["issue"]).to_numpy() == 25).astype(float)
            f.loc[now_1h.reindex(f["issue"]).isna().to_numpy(), "now_1h"] = np.nan
            preds[(target, name)] = f
            print(f"{target} {name}: {len(f)} scored rows ({time.time() - t0:.0f} s)", flush=True)
            abs_tabs.append(boot_abs(f, name, target, n_boot))
    abs_t = pd.concat(abs_tabs, ignore_index=True)
    pair_tabs, keep = [], []
    for target in ["od25", "rwy18"]:
        key = ["issue", "lead"]
        m = None
        for name in VARIANTS:
            f = preds[(target, name)][key + ["valid", "y", "p", "now_1h"]].rename(columns={"p": f"p_{name}"})
            m = f if m is None else m.merge(f[key + [f"p_{name}"]], on=key, how="inner")
        m = m[np.isfinite(m[[f"p_{n}" for n in VARIANTS]]).all(axis=1)].reset_index(drop=True)
        print(f"{target}: {len(m)} common rows", flush=True)
        keep.append(m.assign(target=target))
        for a, b in PAIRS:
            pair_tabs.append(boot_pair(m, a, b, target, n_boot))
    pair_t = pd.concat(pair_tabs, ignore_index=True)
    T._atomic(OUT / "datalayer_abs.csv", lambda p: abs_t.to_csv(p, index=False))
    T._atomic(OUT / "datalayer_pairs.csv", lambda p: pair_t.to_csv(p, index=False))
    T._atomic(OUT / "preds_datalayer.parquet", lambda p: pd.concat(keep, ignore_index=True).to_parquet(p))
    summary(abs_t, pair_t)
    print(f"done in {time.time() - t0:.0f} s", flush=True)
    return abs_t, pair_t


def summary(abs_t, pair_t):
    fmt = E.fmt
    for per in ["long", "pre", "legacy"]:
        print(f"\n=== period {per} ===")
        a = abs_t[(abs_t["target"] == "od25") & (abs_t["period"] == per)].set_index(["variant", "rows", "metric",
                                                                                       "lead", "method"])
        for v in VARIANTS:
            for meth in ["model", "prognosis", "rules", "persistence"]:
                acc = " ".join(fmt(*a.loc[(v, "all", "acc", L, meth), ["est", "lo", "hi"]]) for L in L4)
                b4 = fmt(*a.loc[(v, "all", "brier", E.POOLED, meth), ["est", "lo", "hi"]], scale=1, nd=4)
                ba = fmt(*a.loc[(v, "all", "brier", E.POOLED_ALL, meth), ["est", "lo", "hi"]], scale=1, nd=4)
                print(f"{v} {meth:12s} acc {acc} | B4 {b4} | Ball {ba}")
            ch = " ".join(fmt(*a.loc[(v, "changed_own", "acc", L, "model"), ["est", "lo", "hi"]]) for L in L4)
            ch1 = " ".join(fmt(*a.loc[(v, "changed_vs_t-1h", "acc", L, "model"), ["est", "lo", "hi"]]) for L in L4)
            n1 = int(a.loc[(v, "changed_own", "acc", 1, "model"), "n"])
            print(f"{v} changed (own od_now) acc {ch} (n@1h {n1}) | changed vs [t-1h,t) {ch1}")
        p = pair_t[(pair_t["target"] == "od25") & (pair_t["period"] == per)].set_index(["pair", "rows", "metric",
                                                                                         "lead", "method"])
        for a_, b_ in PAIRS:
            k = f"{a_} - {b_}"
            acc = " ".join(fmt(*p.loc[(k, "all", "acc", L, k), ["est", "lo", "hi"]], sign=True) for L in L4)
            br = " ".join(f"{g} " + fmt(*p.loc[(k, "all", "brier", gid, k), ["est", "lo", "hi"]], scale=1, nd=4,
                                        sign=True) for g, (_, gid) in GROUPS.items())
            b4 = fmt(*p.loc[(k, "all", "brier", E.POOLED, k), ["est", "lo", "hi"]], scale=1, nd=4, sign=True)
            print(f"{k}: dacc pp {acc} | dB4 {b4} | {br}")


def changetime(n_boot=E.N_BOOT):
    """fra.changetime (nested-tuned next-change rule, walk-forward) on the hackathon data layer (A) and the new one
    (D), switched via the module settings; event accuracy per issue time with day-block CIs, paired on common issues.
    Note: the 'actual change' is defined against each layer's own od_now ([t-1h, t) vs [t-2h, t-1h))."""
    from fra import changetime as CT
    layers = {"old": (DS.LEGACY_LAG_H, False, DS.LEGACY_LEADS), "new": (DS.KNOWN_LAG_H, DS.ICONEU_FILL, DS.LEADS)}
    keys = {"nested": "model (nested-tuned rule)", "fixed": "model (final PARAMS, chosen in-sample)",
            "prognosis": "published prognosis (main >= 0.5)", "rules": "official rules (rule_od25)"}
    per_issue = {}
    for name, (lag, eu, leads) in layers.items():
        saved = (DS.KNOWN_LAG_H, DS.ICONEU_FILL, CT.LEADS)
        DS.KNOWN_LAG_H, DS.ICONEU_FILL, CT.LEADS = lag, eu, list(leads)
        try:
            ct = CT.main(out=OUT / f"changetime_{name}_layer.csv")
        finally:
            DS.KNOWN_LAG_H, DS.ICONEU_FILL, CT.LEADS = saved
        act = ct["act"]
        x = {}
        for k, meth in keys.items():
            pr = ct["pred"][meth]
            hit = (act >= 0) & (pr >= 0) & (np.abs(pr - act) <= CT.TOL_H)
            x[f"{name}_{k}"] = (hit | ((act < 0) & (pr < 0))).astype(float)
        per_issue[name] = pd.DataFrame(x, index=pd.DatetimeIndex(ct["issue"], name="issue"))
    j = per_issue["old"].join(per_issue["new"], how="inner")
    issue = j.index
    masks = {"long": np.ones(len(j), bool), "pre": np.asarray(issue + pd.Timedelta(hours=CT.H) < SEL),
             "legacy": np.asarray(issue >= SEL)}
    pairs = [("new_nested", "old_nested"), ("new_fixed", "old_fixed"), ("new_nested", "new_prognosis"),
             ("new_nested", "new_rules"), ("old_nested", "old_prognosis")]
    out = pd.concat([E.bootstrap_means({c: j[c].to_numpy() for c in j}, issue, pairs, mask=m, n_boot=n_boot)
                     .assign(period=k) for k, m in masks.items()], ignore_index=True)
    T._atomic(OUT / "datalayer_changetime.csv", lambda p: out.to_csv(p, index=False))
    for k in masks:
        t = out[out["period"] == k].set_index("method")
        print(f"\n=== next change, {k} ({int(t['n'].iloc[0])} issue times)")
        for meth in t.index:
            r = t.loc[meth]
            print(f"  {meth:28s} {E.fmt(r['est'], r['lo'], r['hi'], sign=' - ' in meth)}")
    return out


if __name__ == "__main__":
    a = sys.argv[1:]
    nb = int(a[a.index("--n-boot") + 1]) if "--n-boot" in a else E.N_BOOT
    changetime(nb) if "--changetime" in a else main(nb)
