"""Next probable OD change time: walk-forward evaluation, rule tuning and the live `next_change` helper.

Per issue time t the model gives a 48 h path of P(OD 25). The "next change" is the first hour where the probability
of the *other* OD (smoothed) reaches an enter threshold and stays above a leave threshold for k hours.
Evaluation: walk-forward weekly folds exactly like `train.main("cv")` (train only on outcomes known before the test
week), but predicting all leads 1..48. Rule parameters are chosen by nested walk-forward (week w is scored with the
parameters that were best on earlier issue times whose WHOLE 48 h outcome was known at the start of week w, see
`known_before`), and the walk-forward P(change within 48 h) map of week w is fitted on the same issue times with the
features of week w's nested parameters, so the reported model numbers are out of sample. (Until 31 Oct 2026 19:00 UTC
the nested loops used every issue of the earlier weeks, whose 48 h outcome windows reach up to 50 h into week w, and the
P48 features used the all-weeks parameters: a small look-ahead, nested event accuracy +0.1 pp, P48 Brier ~+0.0005.)
"""

import itertools
import sys

import numpy as np
import pandas as pd

from fra import evalkit
from fra.dataset import DATA, LEADS, build, hourly_metar, load_labels
from fra.train import _atomic, add_rule_features, fit, predict, table_lag

H = 48
TOL_H = 3            # a predicted change counts as a hit if within +-3 h of the actual first change
ACTUAL_MIN_RUN = 2   # an actual change must last >= 2 flown hours (1 h blips in the radar labels are not a "change")
CV_START = evalkit.TEST_START  # walk-forward test periods live in fra.evalkit (holdout >= HOLDOUT_START excluded)

# PARAMS / P48_COEF / WINDOW_BAND belong to the production LOGIT (fra.predict). They were tuned during the hackathon
# by nested walk-forward over issue times 2026-09-15 .. 2026-10-28 only (hackathon data layer: od_now from the hour
# [t-1h, t), D2-only consensus, 12 training leads); best on all weeks and the choice of every fold from week 4 on.
# Out of sample then (weeks 1-6, 875 issue times, 457 with a sustained change): hit rate 73 % within +-3 h, timing
# MAE 1.2 h on hits, 69 false alarms, event accuracy 78 % vs official rules 61 % hit / 60 % event accuracy and the
# published prognosis 64 % / 73 %. Differences between reasonable settings (raw 0.5 crossing, 3 h smoothing) are
# within ~1 pp, i.e. noise.
# Re-checked 31 Oct 2026 on the long test with the current data layer (od_now from [t-2h, t-1h), ICON-EU fill,
# 48 leads; issues 2026-06-08 .. 2026-10-28, 3,420 issue times, experiments/integration/nextchange.py): PARAMS on the
# logit 79.1 % event accuracy (62 false alarms) vs 77.8 % for the nested re-tuned rule (strict nesting, see
# known_before; 77.9 % with the earlier, slightly leaky nesting); P48_COEF Brier 0.0606 vs 0.0646 for a strictly
# nested walk-forward refit (climatology 0.249). Kept unchanged: the differences are within noise, and PARAMS were
# partly chosen on the legacy part of that test (2026-09-15 on), so 79.1 % is not fully out of sample.
# The blended forecast (fra.blend) has its own rule and map (fra.blend.BLEND_CHANGE_PARAMS / BLEND_P48_COEF), passed
# to next_change(params=..., p48_coef=...).
PARAMS = dict(smooth=1, enter=0.5, leave=0.4, k=3)
# P(change within 48 h) = sigmoid(a + b * logit(max smoothed P(other OD))), fitted on walk-forward predictions of the
# hackathon period (2026-09-22 .. 2026-10-28, old data layer); walk-forward Brier 0.077 vs climatology 0.250 then.
P48_COEF = (-1.075, 1.503)
# likely window: first crossing of enter - band .. first crossing of enter + band (heuristic); hackathon period:
# covers 68 % of actual changes (+-1 h) when a change is predicted, mean width 4.3 h
WINDOW_BAND = 0.15

GRID = dict(smooth=[1, 3, 5], enter=[0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7], leave_gap=[0.0, 0.1, 0.2], k=[1, 2, 3, 4])


# ---------------------------------------------------------------- change detection on probability paths (vectorised)

def smooth_paths(q, w):
    """Centred rolling mean along the lead axis (min_periods=1), q: (n, H)."""
    if w <= 1:
        return q
    return pd.DataFrame(q.T).rolling(w, center=True, min_periods=1).mean().values.T


def first_change(q, enter, leave, k):
    """First lead index where q >= enter and q stays >= leave for k hours (run may be cut by the horizon).
    Returns int array (-1 = no change)."""
    n, h = q.shape
    ok = q >= enter
    for j in range(1, k):
        nxt = np.ones_like(ok)
        nxt[:, :h - j] = q[:, j:] >= leave
        ok &= nxt
    return np.where(ok.any(1), ok.argmax(1), -1)


def other_prob(p25, od_now):
    """P(the OD that is NOT in use now) per lead."""
    return np.where(np.asarray(od_now)[:, None] == 25, 1 - p25, p25)


def rule_first_change(q, p):
    return first_change(smooth_paths(q, p["smooth"]), p["enter"], p["leave"], p["k"])


# ---------------------------------------------------------------- metrics

def actual_first_change(y, od_now, min_run=ACTUAL_MIN_RUN):
    """y: flown OD per lead (n, H); first lead index with a sustained change (-1 = none in 48 h)."""
    diff = (y != np.asarray(od_now)[:, None]).astype(float)
    return first_change(diff, 0.5, 0.5, min_run)


def score(pred, act, tol=TOL_H):
    n = len(act)
    has_a, has_p = act >= 0, pred >= 0
    both = has_a & has_p
    err = np.abs(pred - act)
    hit = both & (err <= tol)
    r = {"n_issues": n, "n_actual_change": int(has_a.sum()), "n_pred_change": int(has_p.sum()),
         "hits": int(hit.sum()), "hit_rate": hit.sum() / max(has_a.sum(), 1),
         "timing_mae_h": float(err[hit].mean()) if hit.any() else np.nan,
         "wrong_time": int((both & ~hit).sum()), "missed": int((has_a & ~has_p).sum()),
         "false_alarm": int((~has_a & has_p).sum()), "correct_no_change": int((~has_a & ~has_p).sum())}
    r["precision"] = r["hits"] / max(r["n_pred_change"], 1)
    r["event_acc"] = (r["hits"] + r["correct_no_change"]) / n  # share of issue times with the right answer
    return r


# ---------------------------------------------------------------- walk-forward 48 h paths

def walk_forward_paths(start=None, final=False):
    """Walk-forward 48 h P(OD 25) paths, folds from fra.evalkit (default: CV_START .. holdout; final=True: only the
    locked holdout). An issue time is scored only if its whole 48 h horizon is labelled (and, by default, ends
    before evalkit.HOLDOUT_START)."""
    start = CV_START if start is None else start
    fc = pd.read_parquet(DATA / "forecasts.parquet")
    labels, _ = load_labels()
    d = add_rule_features(build(fc, labels, hourly_metar(), leads=list(range(1, H + 1))))
    last_label = labels["od"].dropna().index.max()
    horizon_end = d["issue"] + pd.Timedelta(hours=H)
    keep = horizon_end <= (last_label if final else min(last_label, evalkit.HOLDOUT_START - pd.Timedelta(hours=1)))
    wk = np.where(keep, evalkit.test_weeks(d["issue"], None, start, final), -1)  # whole paths in/out of the test
    p = np.full(len(d), np.nan)
    # same training rows and fold rule as train.main("cv"): build() default leads (fra.dataset.LEADS, now all 1..48),
    # labels known at the week start (valid + KNOWN_LAG_H <= week start, fra.evalkit.folds)
    train_rows = d["lead"].isin(LEADS).values
    for w, te, tr in evalkit.folds(d["issue"], d["valid"], start, final, wk=wk, lag_h=table_lag(d)):
        p[te] = predict(fit(d[train_rows & tr], "od25"), d[te], "od25")
    t = d[wk >= 0].assign(p=p[wk >= 0], week=wk[wk >= 0])
    if t.empty:
        raise SystemExit(f"no complete 48 h test paths ({'holdout' if final else f'from {start.date()}'})")
    # wide (issue x lead)
    piv = lambda c: t.pivot(index="issue", columns="lead", values=c).reindex(columns=range(1, H + 1))
    y = piv("od").ffill(axis=1).bfill(axis=1)  # a few unlabelled hours inside the horizon
    meta = t.groupby("issue")[["od_now", "week"]].first().loc[y.index]
    pw = piv("prog_main_west").values
    od_now = meta["od_now"].values
    prog25 = np.where(np.isnan(pw), (od_now == 25)[:, None], pw >= 0.5).astype(float)
    return dict(issue=y.index, week=meta["week"].values, od_now=od_now, y=y.values, p25=piv("p").values,
                rule25=piv("rule_od25").values.astype(float), prog25=prog25)


def grid():
    for s, e, g, k in itertools.product(*GRID.values()):
        if k == 1 and g > 0:
            continue  # leave threshold irrelevant without persistence
        yield dict(smooth=s, enter=e, leave=round(e - g, 2), k=k)


def known_before(issue, wk, start=None, final=False):
    """Issue times whose whole 48 h outcome (labels of the radar hours up to issue + 48 h, complete KNOWN_LAG_H after
    their start) was known at the start of test week `wk`: the only rows a nested choice for week `wk` may use."""
    lag = pd.Timedelta(hours=H + evalkit.label_lag_h())
    return np.asarray(pd.DatetimeIndex(issue) + lag <= evalkit.week_start(wk, start, final))


def tune(q, act, mask):
    best, best_key = None, None
    for p in grid():
        r = score(rule_first_change(q[mask], p), act[mask])
        key = (round(r["event_acc"], 4), -np.nan_to_num(r["timing_mae_h"], nan=99))
        if best_key is None or key > best_key:
            best, best_key = p, key
    return best


def p48_features(q, p):
    m = np.clip(smooth_paths(q, p["smooth"]).max(1), 1e-3, 1 - 1e-3)
    return np.log(m / (1 - m))


def fit_p48(x, y):
    from sklearn.linear_model import LogisticRegression
    lr = LogisticRegression(C=1.0).fit(x[:, None], y)
    return float(lr.intercept_[0]), float(lr.coef_[0, 0])


def sigmoid(z):
    return 1 / (1 + np.exp(-z))


# ---------------------------------------------------------------- live API

def next_change(times, p_od25, od_now, params=None, p48_coef=None):
    """Next probable OD change from a 48 h P(OD 25) path.

    times: valid times aligned with p_od25 (lead 1..48); od_now: current flown OD (25 or 7).
    params / p48_coef: rule and P(change within 48 h) map (default PARAMS / P48_COEF, tuned for the production logit;
    fra.blend passes its own for the blended probabilities).
    Returns (valid time of the first hour in the new OD, or None; info dict). Heuristic, see module docstring.
    """
    p = params or PARAMS
    times = pd.DatetimeIndex(times)
    p25 = np.asarray(p_od25, dtype=float)[None, :]
    q = other_prob(p25, [od_now])
    qs = smooth_paths(q, p["smooth"])
    i = int(first_change(qs, p["enter"], p["leave"], p["k"])[0])
    a, b = P48_COEF if p48_coef is None else p48_coef
    lo = first_change(qs, p["enter"] - WINDOW_BAND, p["enter"] - WINDOW_BAND, 1)[0]
    hi = first_change(qs, p["enter"] + WINDOW_BAND, p["enter"] + WINDOW_BAND, 1)[0]
    info = {"od_now": int(od_now), "to_od": 7 if od_now == 25 else 25,
            "lead_h": i + 1 if i >= 0 else None,
            "p_change_48h": round(float(sigmoid(a + b * p48_features(q, p)[0])), 3),
            "window_start": times[lo] if lo >= 0 else None,
            "window_end": times[hi] if hi >= 0 else (times[-1] if lo >= 0 else None),
            "rule": f"first hour where {p['smooth']}h-smoothed P(other OD) >= {p['enter']} "
                    f"and stays >= {p['leave']} for {p['k']} h (heuristic)"}
    return (times[i] if i >= 0 else None), info


# ---------------------------------------------------------------- evaluation

def default_out(start=None, final_holdout=False):
    """Output file per period. Only the default long test (CV_START) writes the production artefact
    data/changetime_eval.csv (read by fra.dashboard / fra.report / fra.submit); comparison and holdout runs never do."""
    if final_holdout:
        return DATA / "eval_long_changetime_holdout.csv"
    s = CV_START if start is None else evalkit.period_start(start)
    if s == CV_START:
        return DATA / "changetime_eval.csv"
    if s == evalkit.LEGACY_TEST_START:
        return DATA / "eval_long_changetime_legacy.csv"
    return DATA / f"eval_long_changetime_{s:%Y%m%d}.csv"


def main(start=None, final_holdout=False, out=None):
    """Walk-forward next-change evaluation (default period: CV_START .. holdout). Output: `out` or default_out():
    data/changetime_eval.csv only for the default period; --legacy / --start / --final write data/eval_long_changetime_*.csv.
    final_holdout=True scores ONLY the locked holdout with the frozen PARAMS / P48_COEF (no tuning on it)."""
    w = walk_forward_paths(start, final_holdout)
    act = actual_first_change(w["y"], w["od_now"])
    q = other_prob(w["p25"], w["od_now"])
    weeks = np.unique(w["week"])
    print(f"{len(act)} issue times ({w['issue'].min():%Y-%m-%d} .. {w['issue'].max():%Y-%m-%d}), "
          f"{len(weeks)} weekly folds, {int((act >= 0).sum())} with a sustained OD change within 48 h")

    if final_holdout:  # holdout: frozen parameters, every holdout week is out of sample
        nested, final, chosen = rule_first_change(q, PARAMS), PARAMS, {}
        ev = np.ones(len(act), bool)
    else:
        # nested walk-forward: parameters for week w chosen on the issues of weeks < w whose whole 48 h outcome was
        # known at the start of week w (first week only seeds the tuning)
        nested = np.full(len(act), -1)
        chosen = {}
        for wk in weeks[1:]:
            p = tune(q, act, (w["week"] < wk) & known_before(w["issue"], wk, start, final_holdout))
            chosen[int(wk)] = p
            m = w["week"] == wk
            nested[m] = rule_first_change(q[m], p)
        final = tune(q, act, np.ones(len(act), bool))
        ev = w["week"] >= weeks[1]  # report on the weeks scored out of sample
    for wk, p in chosen.items():
        print(f"  week {wk}: {p}")
    print(f"  final (all weeks): {final}")
    sc = weeks[0] if final_holdout else weeks[1]
    rule_q = other_prob(w["rule25"], w["od_now"])
    prog_q = other_prob(w["prog25"], w["od_now"])
    raw = dict(smooth=1, enter=0.5, leave=0.5, k=1)
    methods = {
        "model (nested-tuned rule)": nested,
        "model (current predict.py: 3h smooth, 0.5, 2h)": rule_first_change(q, dict(smooth=3, enter=0.5, leave=0.5, k=2)),
        "model (final PARAMS, chosen in-sample)": rule_first_change(q, PARAMS),
        "model (raw: first p crosses 0.5)": rule_first_change(q, raw),
        "official rules (rule_od25)": rule_first_change(rule_q, raw),
        "official rules, 2h persistence": rule_first_change(rule_q, raw | dict(k=2)),
        "published prognosis (main >= 0.5)": rule_first_change(prog_q, raw),
        "persistence (never change)": np.full(len(act), -1),
    }
    rows = [{"method": k, **score(v[ev], act[ev])} for k, v in methods.items()]
    res = pd.DataFrame(rows)

    # P(change within 48 h): logistic on max smoothed P(other OD), walk-forward by week: fitted on the issues whose
    # outcome was known at the week start, features from that week's nested parameters (never the all-weeks choice)
    x, yb = p48_features(q, final), (act >= 0).astype(int)   # x (all-weeks params): only for the in-sample coef below
    p48 = np.full(len(act), np.nan)
    if final_holdout:
        p48 = sigmoid(P48_COEF[0] + P48_COEF[1] * p48_features(q, PARAMS))
    for wk in ([] if final_holdout else weeks[1:]):
        tr = (w["week"] < wk) & known_before(w["issue"], wk, start, final_holdout)
        te = w["week"] == wk
        if len(np.unique(yb[tr])) == 2:
            pw = chosen[int(wk)]
            a, b = fit_p48(p48_features(q[tr], pw), yb[tr])
            p48[te] = sigmoid(a + b * p48_features(q[te], pw))
    m = ev & ~np.isnan(p48)
    brier = float(np.mean((p48[m] - yb[m]) ** 2))
    clim = float(np.mean((yb[m].mean() - yb[m]) ** 2))
    coef = P48_COEF if final_holdout else fit_p48(x, yb)  # never fit anything on the holdout

    # likely window coverage (heuristic band around the enter threshold) on hits of the final rule
    qs = smooth_paths(q, final["smooth"])
    pf = rule_first_change(q, final)
    lo = first_change(qs, final["enter"] - WINDOW_BAND, final["enter"] - WINDOW_BAND, 1)
    hi = first_change(qs, final["enter"] + WINDOW_BAND, final["enter"] + WINDOW_BAND, 1)
    hi = np.where(hi >= 0, hi, H - 1)
    has = ev & (act >= 0) & (pf >= 0)
    cover = float(np.mean((act[has] >= lo[has] - 1) & (act[has] <= hi[has] + 1))) if has.any() else np.nan
    width = float(np.mean(hi[has] - lo[has])) if has.any() else np.nan

    pd.set_option("display.width", 250)
    cols = ["method", "n_issues", "n_actual_change", "n_pred_change", "hits", "hit_rate", "timing_mae_h",
            "wrong_time", "missed", "false_alarm", "correct_no_change", "precision", "event_acc"]
    print(f"\nNext-change timing, out of sample (weeks {int(sc)}..{int(weeks[-1])}, issue times "
          f"{w['issue'][ev].min():%Y-%m-%d} .. {w['issue'][ev].max():%Y-%m-%d}), hit = within +-{TOL_H} h:")
    print(res[cols].round(3).to_string(index=False))
    print(f"\nP(change within 48 h): walk-forward Brier {brier:.4f} vs climatology {clim:.4f}; "
          f"final coef a={coef[0]:.3f} b={coef[1]:.3f}")
    print(f"likely window (enter +-{WINDOW_BAND}, +-1 h): covers {cover:.0%} of actual changes when a change is "
          f"predicted, mean width {width:.1f} h")
    print(f"\nPARAMS = {final}\nP48_COEF = ({coef[0]:.3f}, {coef[1]:.3f})")
    extra = pd.DataFrame([{"method": "p_change_48h (logistic)", "brier": brier, "brier_climatology": clim,
                           "window_coverage": cover, "window_width_h": width, "params": str(final),
                           "p48_coef": str(tuple(round(c, 3) for c in coef))}])
    out = out or default_out(start, final_holdout)
    _atomic(out, lambda p: pd.concat([res, extra], ignore_index=True).to_csv(p, index=False))
    print(f"wrote {out}")
    # per-issue results of the scored weeks (for bootstrap CIs, experiments/eval_long/run.py)
    return dict(res=res, extra=extra, issue=w["issue"][ev], week=w["week"][ev], act=act[ev],
                pred={k: v[ev] for k, v in methods.items()}, p48=p48[ev], y48=yb[ev])


if __name__ == "__main__":
    # python -m fra.changetime [--legacy | --start YYYY-MM-DD | --final] [--out PATH]
    # default output: data/changetime_eval.csv (long test only); --legacy -> data/eval_long_changetime_legacy.csv,
    # --start D -> data/eval_long_changetime_<D>.csv, --final -> data/eval_long_changetime_holdout.csv
    a = sys.argv[1:]
    st = evalkit.LEGACY_TEST_START if "--legacy" in a else (evalkit.period_start(a[a.index("--start") + 1])
                                                            if "--start" in a else None)
    main(st, "--final" in a, a[a.index("--out") + 1] if "--out" in a else None)
