"""Train LightGBM for OD and RWY18, evaluate vs rule + persistence baselines at leads 1/6/24 h."""

import json
import pickle
import sys

import lightgbm as lgb
import numpy as np
import pandas as pd
from scipy.special import expit, logit as sp_logit
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, brier_score_loss

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


def baselines(d):
    rule_od25 = np.where(d["tw25"] > 1, 0, np.where(d["tw25"] < -1, 1, (d["od_now"] == 25).astype(int)))
    rule_18 = ((d["tw18_gust"] < DEPARTURE_TW_LIMIT) & (d["xw18_gust"] <= CROSSWIND_LIMIT)).astype(int)
    pw = d["prog_main_west"] if "prog_main_west" in d else pd.Series(np.nan, index=d.index)
    prog_od25 = np.where(pw.isna(), (d["od_now"] == 25).astype(int), (pw >= 0.5).astype(int))
    return {"od25": {"rule": rule_od25, "persistence": (d["od_now"] == 25).astype(int).values, "prognosis": prog_od25},
            "rwy18": {"rule": rule_18.values, "persistence": d["rwy18_now"].fillna(1).astype(int).values}}


def evaluate(test, probs, leads=(1, 6, 24, 48)):
    base = baselines(test)
    rows = []
    for tgt, fn in TARGETS.items():
        has = test[LABEL_COL[tgt]].notna().values
        y = fn(test.fillna({LABEL_COL[tgt]: 0})).values
        now = base[tgt]["persistence"]
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


def design(d, tgt):
    base = d[LOGIT[tgt]].fillna(0).astype(float)
    cols = {}
    for lo, hi in BUCKETS_T[tgt]:
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


CAL_DAYS = 14           # out-of-sample calibration window at the end of the training data
TEMP_CLIP = (0.5, 1.5)  # a > 1 sharpens; > 1.5 hurt in walk-forward (experiments/model_structure/)
MIN_CAL = 50


def fit_logit(tr, tgt):
    return LogisticRegression(C=C[tgt], max_iter=3000, fit_intercept=False).fit(design(tr, tgt), TARGETS[tgt](tr))


def fit_temperature(tr, tgt):
    """The L2-shrunk logit is underconfident. Refit without the last CAL_DAYS, predict those days out of
    sample, fit y ~ sigmoid(a * logit p) per lead bucket (walk-forward Brier 0.0358 -> 0.0344)."""
    cut = tr["valid"].max() - pd.Timedelta(days=CAL_DAYS)
    inner, cal = tr[tr["valid"] < cut], tr[tr["valid"] >= cut]
    if len(inner) < 200 or TARGETS[tgt](inner).nunique() < 2 or TARGETS[tgt](cal).nunique() < 2:
        return {}
    inner = inner[inner["valid"] >= inner["valid"].max() - pd.Timedelta(days=WINDOW_DAYS)]
    z = sp_logit(np.clip(fit_logit(inner, tgt).predict_proba(design(cal, tgt))[:, 1], 1e-6, 1 - 1e-6))
    y = TARGETS[tgt](cal).values
    temps = {}
    for lo, hi in BUCKETS:
        mb = ((cal["lead"] >= lo) & (cal["lead"] <= hi)).values
        if mb.sum() < MIN_CAL or len(np.unique(y[mb])) < 2:
            continue
        a = LogisticRegression(C=100, fit_intercept=False, max_iter=1000).fit(z[mb, None], y[mb]).coef_[0][0]
        temps[lo] = float(np.clip(a, *TEMP_CLIP))
    return temps


def fit(train, tgt):
    tr = train[train[LABEL_COL[tgt]].notna()]
    if tgt == "od25":  # RWY18 closures are rare -> keep the full history there
        tr = tr[tr["valid"] >= tr["valid"].max() - pd.Timedelta(days=WINDOW_DAYS)]
    if TARGETS[tgt](tr).nunique() < 2:
        raise SystemExit(f"{tgt}: training labels contain one class only; need more label history")
    m = {"logit": fit_logit(tr, tgt)}
    if tgt == "od25":
        m["temp"] = fit_temperature(tr, tgt)  # RWY 18: temperature gave nothing
    return m


def predict(m, d, tgt):
    p = m["logit"].predict_proba(design(d, tgt))[:, 1]
    for lo, hi in BUCKETS:
        a = m.get("temp", {}).get(lo)
        if a:
            mb = ((d["lead"] >= lo) & (d["lead"] <= hi)).values
            p[mb] = expit(a * sp_logit(np.clip(p[mb], 1e-6, 1 - 1e-6)))
    return p


def drivers(model, train, tgt):
    """|coef| x feature std, summed over lead buckets, per base feature."""
    X = design(train, tgt)
    w = pd.Series(np.abs(model.coef_[0]) * X.std().values, index=X.columns)
    agg = {c: float(w[[k for k in w.index if k.startswith(c + "_")]].sum()) for c in LOGIT[tgt]}
    return dict(sorted(((k, round(v, 3)) for k, v in agg.items()), key=lambda kv: -kv[1]))


def main(test_start="cv"):
    fc = pd.read_parquet(DATA / "forecasts.parquet")
    labels, label_kind = load_labels()
    d = add_rule_features(build(fc, labels, hourly_metar()))
    probs, imp = {}, {}
    if test_start == "cv":
        # walk-forward weekly evaluation over the hourly-labelled period (train strictly on the past)
        cv_start = pd.Timestamp("2026-09-15", tz="UTC")
        wk = ((d["issue"] - cv_start).dt.days // 7).values
        test = d[wk >= 0]
        for tgt in TARGETS:
            p = np.full(len(d), np.nan)
            for w in np.unique(wk[wk >= 0]):
                te = wk == w
                t0, t1 = d["issue"][te].min(), d["valid"][te].max()
                tr = d["valid"] < t0  # walk-forward: only outcomes known before the test week starts
                if d.loc[tr, LABEL_COL[tgt]].nunique() < 2:
                    continue  # e.g. RWY18: no closure in the history yet -> fold skipped
                p[te] = predict(fit(d[tr], tgt), d[te], tgt)
            probs[tgt] = p[wk >= 0]  # NaN = skipped fold, excluded in evaluate()
            imp[tgt] = drivers(fit(d, tgt)["logit"], d[d[LABEL_COL[tgt]].notna()], tgt)
        test_start = cv_start
        label_kind += f", walk-forward weekly evaluation from {cv_start.date()} ({int(wk.max()) + 1} weeks)"
        print(f"labels: {label_kind} | {len(test)} test rows")
    else:
        test_start = pd.Timestamp(test_start, tz="UTC")
        train = d[d["valid"] < test_start - pd.Timedelta(days=2)]
        test = d[d["issue"] >= test_start]
        print(f"labels: {label_kind} | train {len(train)} rows, test {len(test)} rows (from {test_start.date()})")
        for tgt in TARGETS:
            m = fit(train, tgt)
            probs[tgt] = predict(m, test, tgt)
            imp[tgt] = drivers(m["logit"], train[train[LABEL_COL[tgt]].notna()], tgt)
    res = evaluate(test, probs)
    print(res.round(3).to_string(index=False))
    res.to_csv(DATA / "eval.csv", index=False)
    (DATA / "train_meta.json").write_text(json.dumps({"test_start": str(test_start.date()), "label_kind": label_kind,
                                                      "test_rows": len(test)}))
    (DATA / "importance.json").write_text(json.dumps(imp, indent=2))
    print(json.dumps(imp, indent=2))
    # production model: refit on all labelled data
    final = {tgt: fit(d, tgt) for tgt in TARGETS}
    with open(DATA / "model.pkl", "wb") as f:
        pickle.dump(final, f)


if __name__ == "__main__":
    main(*sys.argv[1:])
