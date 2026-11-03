"""Shared walk-forward harness for feature/model experiments (reproduces fra.train production exactly).

Usage:
    from experiments.harness import load, evaluate, PROD_OD, PROD_18
    d = load()                                   # cached feature table (all production columns + labels)
    d["my_feat"] = ...                           # add candidate columns (must use only info known at issue time!)
    evaluate(d, od_features=PROD_OD + ["my_feat"])           # production model (incl. temperature) + extra feature
    evaluate(d, od_model=my_fit_predict)         # custom model: fn(train_df, y_train, test_df) -> p(OD 25)
    evaluate(d, od_features=F, ci=True)          # + day-block bootstrap 95 % CIs, paired diff vs production/baselines

Periods come from fra.evalkit: walk-forward by week from START (= evalkit.TEST_START, 2026-06-01; pass
start=evalkit.LEGACY_TEST_START for the hackathon period). Each week is predicted by a model trained only on labels
known at the start of that week (valid + KNOWN_LAG_H <= week start). Rows with issue or valid >= evalkit.HOLDOUT_START
(2026-11-01) are never scored unless final=True (scores ONLY the locked holdout; do not use it for tuning).
Report = accuracy at leads 1/6/24/48 + Brier (1/6/24/48 and pooled over all leads 1..48).

Data layer (fra.dataset): od_now / rwy18_now / west_frac_now from the last COMPLETE radar hour [t-2h, t-1h)
(KNOWN_LAG_H = 2), ECMWF+ICON consensus with ICON-D2 filled by ICON-EU, rows for every lead 1..48. The cache
data/wf_cache.parquet holds that production table; load(lag_h=1, iconeu=False, leads=dataset.LEGACY_LEADS) builds
(and caches as data/wf_cache_<tag>.parquet) the hackathon-era table for comparisons. data/wf_cache_v1.parquet is
the frozen pre-2026-10-31-evening cache (lag 1, D2-only consensus, 12 leads) used by the first experiment round.
Production OD model = fra.train.fit: logistic regression C=0.03, separate weights per lead bucket, last 120 days,
per-bucket temperature scaling, training rows with directly observed labels only (fra.train.CLEAN_LABELS, adopted by
experiments/phase2); RWY18 = one bucket, C=3, full history (evaluate() default for *_features). prod_model(**overrides)
accepts every fra.train.spec setting (C_, window, temperature, buckets, half_life, clean). logit_model() is the plain
pre-2026-10-31 logit (no temperature scaling, no clean-label filter).
"""

import os
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from fra import evalkit  # noqa: E402
from fra import train as T  # noqa: E402
from fra import dataset as DS  # noqa: E402
from fra.dataset import DATA, build, hourly_metar, load_labels  # noqa: E402

CACHE = DATA / "wf_cache.parquet"
PROD_OD = list(T.LOGIT["od25"])
PROD_18 = list(T.LOGIT["rwy18"])
START = evalkit.TEST_START  # module-level so experiments can still monkeypatch it
LEADS = list(evalkit.REPORT_LEADS)
BASELINES = {"od25": {"rules": "rule_od25", "prognosis": "base_prognosis_od25", "persistence": "od_now25"},
             "rwy18": {"rules": "rule_18", "persistence": "rwy18_now_f"}}


def cache_path(lag_h=None, iconeu=None, leads=None):
    """data/wf_cache.parquet for the production data layer, data/wf_cache_lag<h>_eu<0|1>_L<n>.parquet otherwise."""
    lag = DS.KNOWN_LAG_H if lag_h is None else int(lag_h)
    eu = DS.ICONEU_FILL if iconeu is None else bool(iconeu)
    L = list(DS.LEADS if leads is None else leads)
    if (lag, eu, L) == (DS.KNOWN_LAG_H, DS.ICONEU_FILL, list(DS.LEADS)):
        return CACHE
    return DATA / f"wf_cache_lag{lag}_eu{int(eu)}_L{len(L)}.parquet"


def load(refresh=False, lag_h=None, iconeu=None, leads=None):
    """Production feature table incl. labels (od, rwy18_open) and baselines; cached (atomic write).
    lag_h / iconeu / leads: build a variant of the data layer (fra.dataset.build arguments; own cache file)."""
    path = cache_path(lag_h, iconeu, leads)
    lab_path = DATA / "labels.parquet"
    if path.exists() and not refresh:
        if lab_path.exists() and lab_path.stat().st_mtime > path.stat().st_mtime:
            print(f"WARNING: data/labels.parquet is newer than {path.name}; run load(refresh=True)", flush=True)
        d = pd.read_parquet(path)
        want_lag = DS.KNOWN_LAG_H if lag_h is None else int(lag_h)
        want_leads = set(DS.LEADS if leads is None else leads)
        if "known_lag_h" in d and int(d["known_lag_h"].iloc[0]) == want_lag and set(d["lead"].unique()) == want_leads:
            return d
        print(f"{path.name} was built with another data layer (lag / leads); rebuilding", flush=True)
    fc = pd.read_parquet(DATA / "forecasts.parquet")
    lab, _ = load_labels()
    kw = dict(lag_h=lag_h, iconeu=iconeu) | ({} if leads is None else dict(leads=list(leads)))
    d = T.add_rule_features(build(fc, lab, hourly_metar(), **kw))
    b = T.baselines(d)
    d["base_prognosis_od25"] = b["od25"]["prognosis"]
    T._atomic(path, lambda p: d.to_parquet(p))
    return d


def design(z, F, buckets=T.BUCKETS):
    base = z[F].fillna(0).astype(float)
    cols = {}
    for lo, hi in buckets:
        m = ((z["lead"] >= lo) & (z["lead"] <= hi)).astype(float).values
        cols[f"b{lo}"] = m
        for c in F:
            cols[f"{c}_{lo}"] = base[c].values * m
    return pd.DataFrame(cols, index=z.index)


def prod_model(target="od25", features=None, **overrides):
    """fit_predict running exactly fra.train.fit / fra.train.predict (production incl. temperature scaling).
    features / overrides (C_, window, temperature, buckets) change single settings of the production spec."""
    def fp(tr, y, te):
        return T.predict(T.fit(tr, target, features=features, **overrides), te, target)
    fp.production = features is None and not overrides
    return fp


def logit_model(F, C=0.03, window=120, buckets=T.BUCKETS, temperature=False, target="od25"):
    """Plain lead-bucket logit (no temperature scaling; the pre-2026-10-31 harness default).
    temperature=True -> the exact production code path (fra.train.fit with these settings)."""
    if temperature:
        return prod_model(target, features=F, C_=C, window=window or None, temperature=True, buckets=buckets)

    def fp(tr, y, te):
        keep = (tr["valid"] >= tr["valid"].max() - pd.Timedelta(days=window)).values if window else np.ones(len(tr), bool)
        m = LogisticRegression(C=C, max_iter=4000, fit_intercept=False).fit(design(tr[keep], F, buckets), y[keep])
        return m.predict_proba(design(te, F, buckets))[:, 1]
    return fp


def walk_forward(d, target, fit_predict, start=None, final=False):
    """Weekly walk-forward (fra.evalkit folds). Returns (z = labelled rows, y, p, ok = scored rows)."""
    col = "od" if target == "od25" else "rwy18_open"
    z = d[d[col].notna()].reset_index(drop=True)
    y = ((z["od"] == 25) if target == "od25" else z["rwy18_open"]).astype(int).values
    start = START if start is None else start
    wk = evalkit.test_weeks(z["issue"], z["valid"], start, final)
    p = np.full(len(z), np.nan)
    for w, te, tr in evalkit.folds(z["issue"], z["valid"], start, final, wk=wk, lag_h=T.table_lag(z)):
        if len(np.unique(y[tr])) < 2:
            continue
        p[te] = fit_predict(z[tr], y[tr], z[te])
    ok = (wk >= 0) & ~np.isnan(p)
    return z, y, p, ok


_PROD_CACHE = {}


def production_preds(d, target, start=None, final=False):
    """Walk-forward production predictions for d (memoised per table object / period; if you overwrite production
    columns of d in place, call _PROD_CACHE.clear())."""
    start = START if start is None else start
    key = (id(d), len(d), target, str(start), final)
    if key not in _PROD_CACHE:
        _PROD_CACHE[key] = walk_forward(d, target, prod_model(target), start, final)
    return _PROD_CACHE[key]


def evaluate(d, od_features=None, od_model=None, rwy18_features=None, rwy18_model=None, label="", show_baselines=False,
             ci=False, start=None, final=False, n_boot=evalkit.N_BOOT, vs_production=True):
    """Prints and returns metrics. Pass features (production model on these features) or a custom fit_predict.

    ci=True: day-block bootstrap 95 % CIs (fra.evalkit) for acc per lead and Brier(1,6,24,48), paired differences
    vs the baselines and (vs_production) vs the production model on identical rows; adds scalar keys
    acc{L}_lo/_hi, brier_1_6_24_48_lo/_hi, d_brier_vs_prod(_lo/_hi), d_acc{L}_vs_prod(_lo/_hi) and the long table
    under out["ci"][target]."""
    out = {}
    for target, F, M in [("od25", od_features, od_model), ("rwy18", rwy18_features, rwy18_model)]:
        if F is None and M is None:
            continue
        if M is None:
            M = prod_model(target, features=None if list(F) == list(T.LOGIT[target]) else F)
        if getattr(M, "production", False):
            z, y, p, ok = production_preds(d, target, start, final)
        else:
            z, y, p, ok = walk_forward(d, target, M, start, final)
        r = {}
        for L in LEADS:
            m = ok & (z["lead"] == L).values
            r[f"acc{L}"] = float(((p[m] > 0.5) == y[m]).mean())
        m4 = ok & z["lead"].isin(LEADS).values
        r["brier_1_6_24_48"] = float(np.mean((p[m4] - y[m4]) ** 2))
        r["brier_all"] = float(np.mean((p[ok] - y[ok]) ** 2))
        if show_baselines:
            for name, col in BASELINES[target].items():
                print(f"  baseline {name}: " + " ".join(
                    f"{L}h {((z[col].values[ok & (z['lead'] == L).values]) == y[ok & (z['lead'] == L).values]).mean():.3f}"
                    for L in LEADS))
        out[target] = r
        print(f"{label:30s} {target:6s} " + " ".join(f"{k}={v:.4f}" for k, v in r.items()), flush=True)
        if ci:
            preds = {"model": np.where(ok, p, np.nan), **{k: z[c].values.astype(float) for k, c in BASELINES[target].items()}}
            pairs = [("model", k) for k in BASELINES[target]]
            if vs_production and not getattr(M, "production", False):
                zp, _, pp, okp = production_preds(d, target, start, final)
                prod = pd.Series(np.where(okp, pp, np.nan), index=pd.MultiIndex.from_frame(zp[["issue", "lead"]]))
                preds["production"] = prod.reindex(pd.MultiIndex.from_frame(z[["issue", "lead"]])).values
                pairs.insert(0, ("model", "production"))
            tab = evalkit.bootstrap(np.where(ok, y, np.nan), preds, z["valid"], z["lead"], LEADS, pairs, n_boot=n_boot)
            tab = pd.concat([tab, evalkit.bootstrap(np.where(ok, y, np.nan), preds, z["valid"], z["lead"],
                                                    evalkit.ALL_LEADS, pairs, n_boot=n_boot, per_lead=False,
                                                    pooled_id=evalkit.POOLED_ALL)], ignore_index=True)
            t = tab.set_index(["metric", "lead", "method"])
            for L in LEADS:
                if ("acc", L, "model") in t.index:
                    r[f"acc{L}_lo"], r[f"acc{L}_hi"] = t.loc[("acc", L, "model"), ["lo", "hi"]]
            k = ("brier", evalkit.POOLED, "model")
            r["brier_1_6_24_48_lo"], r["brier_1_6_24_48_hi"] = t.loc[k, ["lo", "hi"]] if k in t.index else (np.nan,) * 2
            k = ("brier", evalkit.POOLED_ALL, "model")
            r["brier_all_lo"], r["brier_all_hi"] = t.loc[k, ["lo", "hi"]] if k in t.index else (np.nan,) * 2
            if "production" in preds:
                k = ("brier", evalkit.POOLED, "model - production")
                r["d_brier_vs_prod"], r["d_brier_vs_prod_lo"], r["d_brier_vs_prod_hi"] = t.loc[k, ["est", "lo", "hi"]]
                k = ("brier", evalkit.POOLED_ALL, "model - production")
                r["d_brier_all_vs_prod"], r["d_brier_all_vs_prod_lo"], r["d_brier_all_vs_prod_hi"] = \
                    t.loc[k, ["est", "lo", "hi"]]
                for L in LEADS:
                    r[f"d_acc{L}_vs_prod"], r[f"d_acc{L}_vs_prod_lo"], r[f"d_acc{L}_vs_prod_hi"] = \
                        t.loc[("acc", L, "model - production"), ["est", "lo", "hi"]]
            out.setdefault("ci", {})[target] = tab
            per_lead = tab[tab["lead"] > 0]
            print(f"{'':30s} {target:6s} 95% CI ({per_lead['n'].max() if len(per_lead) else 0} rows/lead max, "
                  f"{tab['n_days'].max() if len(tab) else 0} days): "
                  + " ".join(f"acc{L} [{r.get(f'acc{L}_lo', np.nan):.3f},{r.get(f'acc{L}_hi', np.nan):.3f}]" for L in LEADS)
                  + f" brier [{r['brier_1_6_24_48_lo']:.4f},{r['brier_1_6_24_48_hi']:.4f}]"
                  + f" brier_all [{r['brier_all_lo']:.4f},{r['brier_all_hi']:.4f}]", flush=True)
            for a, b in pairs:
                kb = ("brier", evalkit.POOLED, f"{a} - {b}")
                print(f"{'':30s} {target:6s} {a} - {b:12s}: "
                      + " ".join(f"dacc{L} {evalkit.fmt(*t.loc[('acc', L, f'{a} - {b}'), ['est', 'lo', 'hi']], sign=True)}pp"
                                 for L in LEADS if ("acc", L, f"{a} - {b}") in t.index)
                      + (f" dbrier {evalkit.fmt(*t.loc[kb, ['est', 'lo', 'hi']], scale=1, nd=4, sign=True)}"
                         if kb in t.index else ""), flush=True)
    return out


if __name__ == "__main__":
    args = sys.argv[1:]
    d = load(refresh="--refresh" in args, **(dict(lag_h=DS.LEGACY_LAG_H, iconeu=False, leads=DS.LEGACY_LEADS)
                                              if "--hackathon-data" in args else {}))
    start = evalkit.LEGACY_TEST_START if "--legacy" in args else None
    print(d.shape, "columns:", sorted(d.columns))
    evaluate(d, od_features=PROD_OD, rwy18_features=PROD_18, label="PRODUCTION", show_baselines=True,
             ci="--ci" in args or "--final" in args, start=start, final="--final" in args)
