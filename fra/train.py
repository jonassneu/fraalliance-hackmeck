"""Train the OD and RWY18 models and evaluate them walk-forward against the rule, persistence and prognosis baselines.

    uv run python -m fra.train              # walk-forward from evalkit.TEST_START (2026-06-01) up to the holdout
                                            # -> data/eval.csv (+ 95 % CIs), data/eval_long_ci.csv, train_meta.json,
                                            #    importance.json, data/model.pkl (refit on all labelled data)
    uv run python -m fra.train legacy       # same from 2026-09-15 (hackathon period) -> data/eval_long_legacy*.csv only
    uv run python -m fra.train final        # LOCKED HOLDOUT only (issue >= 2026-11-01) -> data/eval_long_holdout*.csv
    uv run python -m fra.train 2026-07-01   # single split: train on valid < start - 2 d, test issue >= start
                                            # -> data/eval_long_split_20260701*.csv only
Only the default walk-forward ("cv") writes the production artefacts (eval.csv, train_meta.json, importance.json,
model.pkl); comparison / holdout runs never touch them.
"""

import json
import os
import pickle
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.special import expit, logit as sp_logit
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, brier_score_loss

from fra import evalkit
from fra import dataset as DS
from fra.dataset import DATA, build, hourly_metar, load_labels
from fra.rules import CROSSWIND_LIMIT, DEPARTURE_TW_LIMIT

FEATURES = ["lead", "run_age_h", "hour", "doy_sin", "doy_cos",
            "wind_speed", "wind_direction", "wind_gusts", "temperature", "precipitation", "pressure_msl", "cloud_cover",
            "tw25", "tw18", "tw18_gust", "xw25_gust", "xw18_gust", "tw25_prev3", "tw25_next3", "tw25_roll6", "tw18_roll6",
            "obs_tw25", "obs_tw18", "obs_wind_speed", "obs_wind_gusts", "od_rule_now", "od_now", "rwy18_now"]
TARGETS = {"od25": lambda d: (d["od"] == 25).astype(int), "rwy18": lambda d: d["rwy18_open"].astype(int)}
LABEL_COL = {"od25": "od", "rwy18": "rwy18_open"}
PARAMS = dict(n_estimators=400, learning_rate=0.05, num_leaves=31, min_child_samples=50,
              subsample=0.8, subsample_freq=1, colsample_bytree=0.8, verbose=-1)
PREDS_DIR = Path(__file__).resolve().parent.parent / "experiments" / "eval_long"


def baselines(d):
    rule_od25 = np.where(d["tw25"] > 1, 0, np.where(d["tw25"] < -1, 1, (d["od_now"] == 25).astype(int)))
    rule_18 = ((d["tw18_gust"] < DEPARTURE_TW_LIMIT) & (d["xw18_gust"] <= CROSSWIND_LIMIT)).astype(int)
    pw = d["prog_main_west"] if "prog_main_west" in d else pd.Series(np.nan, index=d.index)
    prog_od25 = np.where(pw.isna(), (d["od_now"] == 25).astype(int), (pw >= 0.5).astype(int))
    return {"od25": {"rule": rule_od25, "persistence": (d["od_now"] == 25).astype(int).values, "prognosis": prog_od25},
            "rwy18": {"rule": rule_18.values, "persistence": d["rwy18_now"].fillna(1).astype(int).values}}


def evaluate(test, probs, leads=(1, 6, 24, 48), ci=False, n_boot=evalkit.N_BOOT, ci_table=None):
    """Accuracy / Brier per target and lead vs the baselines, on identical rows.
    ci=True adds day-block bootstrap 95 % CIs (fra.evalkit): <method>_acc_lo/_hi, model_brier_lo/_hi,
    model_minus_<baseline>_acc(_lo/_hi) (paired) and model_acc_changed_lo/_hi. If `ci_table` is a list, the long
    bootstrap tables (incl. the pooled 1/6/24/48 group, lead = 0) are appended to it."""
    base = baselines(test)
    rows = []
    for tgt, fn in TARGETS.items():
        has = test[LABEL_COL[tgt]].notna().values
        y = fn(test.fillna({LABEL_COL[tgt]: 0})).values
        now = base[tgt]["persistence"]
        boot = {}
        if ci:
            yb = np.where(has, y, np.nan)
            preds = {"model": probs[tgt], **{k: np.asarray(v, float) for k, v in base[tgt].items()}}
            pairs = [("model", k) for k in base[tgt]]
            t_all = evalkit.bootstrap(yb, preds, test["valid"], test["lead"], leads, pairs, n_boot=n_boot)
            t_ch = evalkit.bootstrap(yb, {"model": probs[tgt], "rule": base[tgt]["rule"]}, test["valid"], test["lead"],
                                     leads, [("model", "rule")], mask=(y != now), n_boot=n_boot)
            # headline pooled Brier over ALL leads 1..48 present in the test rows (lead = evalkit.POOLED_ALL)
            t_pool = evalkit.bootstrap(yb, preds, test["valid"], test["lead"], evalkit.ALL_LEADS, pairs, n_boot=n_boot,
                                       per_lead=False, pooled_id=evalkit.POOLED_ALL)
            t_all = pd.concat([t_all, t_pool], ignore_index=True)
            for t, sub in ((t_all, "all"), (t_ch, "changed")):
                t = t.assign(target=tgt, rows=sub)
                if isinstance(ci_table, list):
                    ci_table.append(t)
                boot[sub] = t.set_index(["metric", "lead", "method"])
        for lead in leads:
            m = (test["lead"] == lead).values & has & ~np.isnan(probs[tgt])
            if not m.any():
                continue
            ch = m & (y != now)  # hours where the state at valid time differs from the state at issue
            r = {"target": tgt, "lead_h": lead, "n": int(m.sum()),
                 "model_acc": accuracy_score(y[m], probs[tgt][m] > 0.5),
                 "model_brier": brier_score_loss(y[m], probs[tgt][m])}
            for name, pred in base[tgt].items():
                r[f"{name}_acc"] = accuracy_score(y[m], pred[m])
            r["n_changed"] = int(ch.sum())
            r["model_acc_changed"] = accuracy_score(y[ch], probs[tgt][ch] > 0.5) if ch.any() else np.nan
            r["rule_acc_changed"] = accuracy_score(y[ch], base[tgt]["rule"][ch]) if ch.any() else np.nan
            if ci:
                b = boot["all"]
                g = lambda t, metric, meth: t.loc[(metric, lead, meth)] if (metric, lead, meth) in t.index else None
                for meth in ["model", *base[tgt]]:
                    x = g(b, "acc", meth)
                    r[f"{meth}_acc_lo"], r[f"{meth}_acc_hi"] = (x["lo"], x["hi"]) if x is not None else (np.nan,) * 2
                x = g(b, "brier", "model")
                r["model_brier_lo"], r["model_brier_hi"] = (x["lo"], x["hi"]) if x is not None else (np.nan,) * 2
                for meth in base[tgt]:
                    x = g(b, "acc", f"model - {meth}")
                    r[f"model_minus_{meth}_acc"], r[f"model_minus_{meth}_acc_lo"], r[f"model_minus_{meth}_acc_hi"] = \
                        (x["est"], x["lo"], x["hi"]) if x is not None else (np.nan,) * 3
                x = g(boot["changed"], "acc", "model")
                r["model_acc_changed_lo"], r["model_acc_changed_hi"] = (x["lo"], x["hi"]) if x is not None else (np.nan,) * 2
            rows.append(r)
    return pd.DataFrame(rows)


# Small-data model (few weeks of flown labels): regularised logistic regression on the published prognosis, the
# official rule, the current flown state and the forecast tailwind, with separate weights per lead bucket.
# Won the walk-forward comparison against larger feature sets and a LightGBM ensemble (see research/conclusion.md).
BUCKETS = [(1, 3), (4, 12), (13, 30), (31, 48)]
LOGIT = {"od25": ["prog_signed", "prog_alt_signed", "rule_od25", "od_now25", "tw25_roll6", "tw25",
                  "tw25_prev3", "tw25_next3", "hour_sin", "hour_cos", "night", "tw25_100m", "tw25_cons", "tw25_cons_roll6",
                  "tw25_pastmin6", "xwf_east_tanh", "shear_tw25"],
         "rwy18": ["rule_18", "rwy18_now_f", "tw18_gust", "tw18_roll6", "obs_tw18"]}


def add_rule_features(d):
    b = baselines(d)
    d["rule_od25"], d["rule_18"] = b["od25"]["rule"], b["rwy18"]["rule"]
    d["od_now25"] = (d["od_now"] == 25).astype(int)
    d["rwy18_now_f"] = d["rwy18_now"].fillna(1)
    return d


BUCKETS_T = {"od25": BUCKETS, "rwy18": [(1, 48)]}  # ~11 real closure hours cannot support 4 x weights


def design(d, tgt, features=None, buckets=None):
    """Lead-bucket design matrix: bias + features per bucket (production features/buckets unless overridden)."""
    F = LOGIT[tgt] if features is None else list(features)
    base = d[F].fillna(0).astype(float)
    cols = {}
    for lo, hi in (BUCKETS_T[tgt] if buckets is None else buckets):
        m = ((d["lead"] >= lo) & (d["lead"] <= hi)).astype(float).values
        cols[f"bias_{lo}"] = m
        for c in base:
            cols[f"{c}_{lo}"] = base[c].values * m
    return pd.DataFrame(cols, index=d.index)


C = {"od25": 0.03, "rwy18": 3.0}
USE_LGBM = False  # ensemble partner lost under walk-forward evaluation (too little history in early weeks)
# OD ensemble partner: small, heavily regularised LightGBM incl. a second NWP model and trends (used for leads > 3 h)
LGBM_F = LOGIT["od25"] + ["tw25_prev3", "tw25_next3", "od_rule_now", "tw25_m2", "tw25_m2_roll6",
                          "tw18", "xw25_gust", "wind_speed", "hour", "doy_sin", "lead", "run_age_h", "pressure_msl"]
LGBM_P = dict(n_estimators=300, learning_rate=0.03, num_leaves=7, min_child_samples=100, reg_lambda=5,
              subsample=0.8, subsample_freq=1, verbose=-1)


WINDOW_DAYS = 120  # train on the most recent 120 days only (walk-forward Brier 0.0407 -> 0.0369 vs all history)
# Fit options re-tested in experiments/phase2 (pre-registered plan.json, 21 variants on the long walk-forward test).
# Of window 180/240/all, recency weighting, C, temperature off, 6 lead buckets, LightGBM and Part B path features,
# only CLEAN_LABELS formally passed the pre-registered adoption rule, with 1-day bootstrap blocks (Brier(1,6,24,48)
# -0.00006 [-0.00015, -0.000003]); it is not robust to 3- or 7-day blocks (CIs include 0), ~90 % of the gain comes
# from the first test week, and the second half was "better" by -0.00001 only. Adopted as label hygiene, with no
# measurable effect. The 120-day window, C 0.03, 4 buckets and temperature scaling stay.
HALF_LIFE_DAYS = None  # recency weighting: sample weight 0.5 ** (age_days / half-life), mean 1; None = unweighted
CLEAN_LABELS = True    # OD training rows only where the target label and the od_now source hour are directly
                       # observed (fra.labels.to_labels(bridge="night")), i.e. not carried across daytime sampling gaps


CAL_DAYS = 14           # out-of-sample calibration window at the end of the training data
TEMP_CLIP = (0.5, 1.5)  # a > 1 sharpens; > 1.5 hurt in walk-forward (experiments/model_structure/)
MIN_CAL = 50

_PROD = object()  # sentinel: "production setting" (None is a legal value for window = all history)


def spec(tgt, features=None, C_=None, window=_PROD, temperature=None, buckets=None, half_life=_PROD, clean=_PROD):
    """Model specification; every argument defaults to the production setting of target `tgt`.
    Production: od25 = C 0.03, last WINDOW_DAYS days, 4 lead buckets, temperature scaling, HALF_LIFE_DAYS,
                CLEAN_LABELS; rwy18 = C 3, full history, one bucket, no temperature, unweighted, all rows."""
    return {"features": list(LOGIT[tgt] if features is None else features),
            "C": C[tgt] if C_ is None else C_,
            "window": (WINDOW_DAYS if tgt == "od25" else None) if window is _PROD else window,
            "temperature": (tgt == "od25") if temperature is None else bool(temperature),
            "buckets": list(BUCKETS_T[tgt] if buckets is None else buckets),
            "half_life": (HALF_LIFE_DAYS if tgt == "od25" else None) if half_life is _PROD else half_life,
            "clean": (CLEAN_LABELS if tgt == "od25" else False) if clean is _PROD else bool(clean)}


def recency_weights(tr, half_life):
    """0.5 ** (age / half_life) with age = days before the newest training row, normalised to mean 1 (None: off)."""
    if not half_life:
        return None
    age = (tr["valid"].max() - tr["valid"]).dt.total_seconds().values / 86400.0
    w = 0.5 ** (age / float(half_life))
    return w / w.mean()


_DIRECT_OD = {}


def direct_label_mask(d):
    """True where the OD label at the valid time AND the od_now source hour (issue - known_lag_h) are directly
    observed or carried only through the night ban / quiet hours (fra.labels.to_labels(bridge="night")). False for
    the hours data/labels.parquet fills by carrying the last sampled OD across daytime sampling gaps (sparse radar
    sampling before hourly labelling started on 2026-02-11). Uses the same counts as data/labels.parquet
    (`fra.labels --write`: forward file only); if the labels are ever built with include_history=True, change both."""
    if "od" not in _DIRECT_OD:
        from fra import labels as L
        _DIRECT_OD["od"] = L.to_labels(L.load_counts(), bridge="night")["od"]
    od = _DIRECT_OD["od"]
    lag = pd.to_timedelta(d["known_lag_h"] if "known_lag_h" in d else DS.KNOWN_LAG_H, unit="h")
    return od.reindex(d["valid"]).notna().values & od.reindex(d["issue"] - lag).notna().values


def fit_logit(tr, tgt, s=None):
    s = s or spec(tgt)
    return LogisticRegression(C=s["C"], max_iter=3000, fit_intercept=False).fit(
        design(tr, tgt, s["features"], s["buckets"]), TARGETS[tgt](tr),
        sample_weight=recency_weights(tr, s.get("half_life")))


def fit_temperature(tr, tgt, s=None):
    """The L2-shrunk logit is underconfident. Refit without the last CAL_DAYS, predict those days out of
    sample, fit y ~ sigmoid(a * logit p) per lead bucket (walk-forward Brier 0.0358 -> 0.0344)."""
    s = s or spec(tgt)
    cut = tr["valid"].max() - pd.Timedelta(days=CAL_DAYS)
    inner, cal = tr[tr["valid"] < cut], tr[tr["valid"] >= cut]
    if len(inner) < 200 or TARGETS[tgt](inner).nunique() < 2 or TARGETS[tgt](cal).nunique() < 2:
        return {}
    if s["window"]:
        inner = inner[inner["valid"] >= inner["valid"].max() - pd.Timedelta(days=s["window"])]
    z = sp_logit(np.clip(fit_logit(inner, tgt, s).predict_proba(design(cal, tgt, s["features"], s["buckets"]))[:, 1],
                         1e-6, 1 - 1e-6))
    y = TARGETS[tgt](cal).values
    temps = {}
    for lo, hi in s["buckets"]:
        mb = ((cal["lead"] >= lo) & (cal["lead"] <= hi)).values
        if mb.sum() < MIN_CAL or len(np.unique(y[mb])) < 2:
            continue
        a = LogisticRegression(C=100, fit_intercept=False, max_iter=1000).fit(z[mb, None], y[mb]).coef_[0][0]
        temps[lo] = float(np.clip(a, *TEMP_CLIP))
    return temps


def fit(train, tgt, **overrides):
    """Production model for `tgt` (keyword overrides -> spec(), used by experiments.harness for variants)."""
    s = spec(tgt, **overrides)
    tr = train[train[LABEL_COL[tgt]].notna()]
    if s.get("clean"):  # only directly observed labels (no daytime sampling-gap fill)
        tr = tr[direct_label_mask(tr)]
    if s["window"]:  # od25: recent regimes only; RWY18 closures are rare -> keep the full history there
        tr = tr[tr["valid"] >= tr["valid"].max() - pd.Timedelta(days=s["window"])]
    if TARGETS[tgt](tr).nunique() < 2:
        raise SystemExit(f"{tgt}: training labels contain one class only; need more label history")
    m = {"logit": fit_logit(tr, tgt, s), "spec": s}
    if s["temperature"]:
        m["temp"] = fit_temperature(tr, tgt, s)
    return m


def predict(m, d, tgt):
    s = m.get("spec") or spec(tgt)  # models pickled before the spec existed: production features/buckets
    p = m["logit"].predict_proba(design(d, tgt, s["features"], s["buckets"]))[:, 1]
    for lo, hi in (s["buckets"] if m.get("temp") else []):
        a = m["temp"].get(lo)
        if a:
            mb = ((d["lead"] >= lo) & (d["lead"] <= hi)).values
            p[mb] = expit(a * sp_logit(np.clip(p[mb], 1e-6, 1 - 1e-6)))
    return p


def drivers(model, train, tgt, features=None):
    """|coef| x feature std, summed over lead buckets, per base feature."""
    F = LOGIT[tgt] if features is None else features
    X = design(train, tgt, F)
    w = pd.Series(np.abs(model.coef_[0]) * X.std().values, index=X.columns)
    agg = {c: float(w[[k for k in w.index if k.startswith(c + "_")]].sum()) for c in F}
    return dict(sorted(((k, round(v, 3)) for k, v in agg.items()), key=lambda kv: -kv[1]))


# ---------------------------------------------------------------- walk-forward evaluation

def table_lag(d):
    """KNOWN_LAG_H the feature table was built with (column known_lag_h, fra.dataset.add_state); None = current."""
    return int(d["known_lag_h"].iloc[0]) if "known_lag_h" in d and len(d) else None


def walk_forward(d, start=None, final=False, targets=tuple(TARGETS)):
    """Out-of-fold production predictions (fra.evalkit weekly folds; default: TEST_START .. holdout, final=True:
    holdout only). Returns (week index per row, -1 = not tested; {target: P per row, NaN = not tested/skipped})."""
    wk = evalkit.test_weeks(d["issue"], d["valid"], start, final)
    probs = {}
    for tgt in targets:
        p = np.full(len(d), np.nan)
        for w, te, tr in evalkit.folds(d["issue"], d["valid"], start, final, wk=wk, lag_h=table_lag(d)):
            if d.loc[tr, LABEL_COL[tgt]].nunique() < 2:
                continue  # e.g. RWY18: no closure in the history yet -> fold skipped
            p[te] = predict(fit(d[tr], tgt), d[te], tgt)
        probs[tgt] = p
    return wk, probs


def load_table():
    fc = pd.read_parquet(DATA / "forecasts.parquet")
    labels, label_kind = load_labels()
    return add_rule_features(build(fc, labels, hourly_metar())), label_kind


def _atomic(path, write):
    """write(tmp_path) then os.replace -> readers never see a half-written shared file."""
    path = Path(path)
    tmp = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    try:
        write(tmp)
        os.replace(tmp, path)
    finally:
        if tmp.exists():
            tmp.unlink()


def save_preds(test, probs, name):
    """Out-of-fold predictions + baselines on the test rows -> experiments/eval_long/preds_<name>.parquet."""
    b = baselines(test)
    out = test[["issue", "lead", "valid", "od", "rwy18_open", "od_now"]].assign(
        p_od25=probs["od25"], p_rwy18=probs["rwy18"], rule_od25=b["od25"]["rule"], prognosis_od25=b["od25"]["prognosis"],
        persistence_od25=b["od25"]["persistence"], rule_rwy18=b["rwy18"]["rule"],
        persistence_rwy18=b["rwy18"]["persistence"]).reset_index(drop=True)
    PREDS_DIR.mkdir(parents=True, exist_ok=True)
    _atomic(PREDS_DIR / f"preds_{name}.parquet", lambda p: out.to_parquet(p))
    return out


def ci_summary(cit):
    """Short text summary of a bootstrap table (pooled Brier and acc per lead, model vs baselines)."""
    lines = []
    for tgt, t in cit[cit["rows"] == "all"].groupby("target", sort=False):
        t = t.set_index(["metric", "lead", "method"])
        for meth in ["model"] + [m.split(" - ")[1] for m in t.index.get_level_values(2).unique() if " - " in m]:
            s = " ".join(f"{L}h {evalkit.fmt(*t.loc[('acc', L, meth), ['est', 'lo', 'hi']])}"
                         for L in evalkit.REPORT_LEADS if ("acc", L, meth) in t.index)
            lines.append(f"  {tgt} {meth:12s} acc % {s}")
        for meth in [m for m in t.index.get_level_values(2).unique() if " - " in m]:
            s = " ".join(f"{L}h {evalkit.fmt(*t.loc[('acc', L, meth), ['est', 'lo', 'hi']], sign=True)}"
                         for L in evalkit.REPORT_LEADS if ("acc", L, meth) in t.index)
            lines.append(f"  {tgt} {meth:20s} acc pp {s}")
        k = ("brier", evalkit.POOLED, "model")
        if k in t.index:
            lines.append(f"  {tgt} model Brier(1,6,24,48) {evalkit.fmt(*t.loc[k, ['est', 'lo', 'hi']], scale=1, nd=4)}")
        k = ("brier", evalkit.POOLED_ALL, "model")
        if k in t.index:
            lines.append(f"  {tgt} model Brier(all leads) {evalkit.fmt(*t.loc[k, ['est', 'lo', 'hi']], scale=1, nd=4)}")
    return "\n".join(lines)


def main(test_start="cv", write=True):
    """test_start: 'cv' (walk-forward from evalkit.TEST_START, production outputs), 'legacy' (from 2026-09-15),
    'final' (locked holdout only) or a date (single split). Returns (test rows, {target: probs}, result table)."""
    d, label_kind = load_table()
    probs, imp = {}, {}
    cit = []
    mode = test_start if test_start in ("cv", "legacy", "final") else "split"
    if mode != "split":
        final = mode == "final"
        start = evalkit.period_start(mode)
        wk, p_all = walk_forward(d, None if final else start, final)
        test = d[wk >= 0]
        if test.empty:
            print(f"no test rows for {mode} (issue >= {start.date()}); nothing to score yet")
            return test, {}, pd.DataFrame()
        probs = {tgt: p[wk >= 0] for tgt, p in p_all.items()}  # NaN = skipped fold, excluded in evaluate()
        test_start = start
        label_kind += ", " + evalkit.describe(None if final else start, final, wk)
        print(f"labels: {label_kind} | {len(test)} test rows")
    else:
        test_start = evalkit.period_start(test_start)
        train = d[d["valid"] < test_start - pd.Timedelta(days=2)]
        wk = evalkit.test_weeks(d["issue"], d["valid"], test_start)  # excludes the locked holdout
        test = d[wk >= 0]
        print(f"labels: {label_kind} | train {len(train)} rows, test {len(test)} rows (from {test_start.date()})")
        for tgt in TARGETS:
            probs[tgt] = predict(fit(train, tgt), test, tgt)
    res = evaluate(test, probs, ci=True, ci_table=cit)
    cit = pd.concat(cit, ignore_index=True)
    base_cols = ["target", "lead_h", "n", "model_acc", "model_brier", "rule_acc", "persistence_acc", "prognosis_acc",
                 "n_changed", "model_acc_changed", "rule_acc_changed"]
    print(res[base_cols].round(3).to_string(index=False))
    print(f"95 % CIs (day-block bootstrap, {evalkit.N_BOOT} reps):")
    print(ci_summary(cit))
    if not write:
        return test, probs, res
    if mode != "cv":  # comparison / holdout / single-split runs never touch the production artefacts
        tag = {"legacy": "_legacy", "final": "_holdout", "split": f"_split_{test_start:%Y%m%d}"}[mode]
        _atomic(DATA / f"eval_long{tag}.csv", lambda p: res.to_csv(p, index=False))
        _atomic(DATA / f"eval_long{tag}_ci.csv", lambda p: cit.to_csv(p, index=False))
        if mode != "split":
            save_preds(test, probs, mode)
        print(f"wrote {DATA / f'eval_long{tag}.csv'}, {DATA / f'eval_long{tag}_ci.csv'}")
        return test, probs, res
    _atomic(DATA / "eval.csv", lambda p: res.to_csv(p, index=False))
    _atomic(DATA / "eval_long_ci.csv", lambda p: cit.to_csv(p, index=False))
    save_preds(test, probs, "cv")
    sel = (cit["metric"] == "brier") & (cit["method"] == "model") & (cit["rows"] == "all")
    pooled = cit[sel & (cit["lead"] == evalkit.POOLED)].set_index("target")
    pooled_all = cit[sel & (cit["lead"] == evalkit.POOLED_ALL)].set_index("target")
    meta = {"test_start": str(test_start.date()), "label_kind": label_kind, "test_rows": len(test),
            "holdout_start": str(evalkit.HOLDOUT_START.date()),
            # spec (features, C, window, temperature) was selected on the walk-forward from here: rows from it on are
            # in-sample for model selection (experiments/eval_long/REPORT.md reports both sub-periods)
            "selection_start": str(evalkit.SELECTION_START.date()),
            "ci": f"day-block bootstrap, {evalkit.N_BOOT} reps, 95 %",
            "brier_1_6_24_48": {t: [round(float(r[k]), 5) for k in ("est", "lo", "hi")] for t, r in pooled.iterrows()},
            "brier_all_leads": {t: [round(float(r[k]), 5) for k in ("est", "lo", "hi")] for t, r in pooled_all.iterrows()},
            # data layer: what is known at issue time and which rows are trained on (fra.dataset)
            "known_lag_h": DS.KNOWN_LAG_H, "iconeu_fill": bool(DS.ICONEU_FILL), "train_leads": len(DS.LEADS),
            # OD fit options (experiments/phase2): C, window, temperature, buckets, half-life, clean labels only
            "od_spec": {k: v for k, v in spec("od25").items() if k != "features"}}
    # production model: refit on all labelled data
    final_models = {tgt: fit(d, tgt) for tgt in TARGETS}
    imp = {tgt: drivers(final_models[tgt]["logit"], d[d[LABEL_COL[tgt]].notna()], tgt) for tgt in TARGETS}
    _atomic(DATA / "train_meta.json", lambda p: p.write_text(json.dumps(meta)))
    _atomic(DATA / "importance.json", lambda p: p.write_text(json.dumps(imp, indent=2)))
    print(json.dumps(imp, indent=2))

    def dump(p):
        with open(p, "wb") as f:
            pickle.dump(final_models, f)
    _atomic(DATA / "model.pkl", dump)
    return test, probs, res


if __name__ == "__main__":
    main(*sys.argv[1:])
