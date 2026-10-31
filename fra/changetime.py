"""Next probable OD change time: walk-forward evaluation, rule tuning and the live `next_change` helper.

Per issue time t the model gives a 48 h path of P(OD 25). The "next change" is the first hour where the probability
of the *other* OD (smoothed) reaches an enter threshold and stays above a leave threshold for k hours.
Evaluation: walk-forward weekly folds exactly like `train.main("cv")` (train only on outcomes known before the test
week), but predicting all leads 1..48. Rule parameters are chosen by nested walk-forward (week w is scored with the
parameters that were best on weeks < w), so the reported model numbers are out of sample.
"""

import itertools

import numpy as np
import pandas as pd

from fra.dataset import DATA, LEADS, build, hourly_metar, load_labels
from fra.train import add_rule_features, fit, predict

H = 48
TOL_H = 3            # a predicted change counts as a hit if within +-3 h of the actual first change
ACTUAL_MIN_RUN = 2   # an actual change must last >= 2 flown hours (1 h blips in the radar labels are not a "change")
CV_START = pd.Timestamp("2026-09-15", tz="UTC")

# Tuned by nested walk-forward over the hourly test period 2026-09-15 .. 2026-10-28 (python -m fra.changetime):
# best on all weeks and the choice of every fold from week 4 on. Out of sample (weeks 1-6, 875 issue times, 457 with a
# sustained change): hit rate 73 % within +-3 h, timing MAE 1.2 h on hits, 69 false alarms, event accuracy 78 %
# vs official rules 61 % hit / 60 % event accuracy and the published prognosis 64 % / 73 %. Differences between
# reasonable settings (raw 0.5 crossing, 3 h smoothing) are within ~1 pp, i.e. noise.
PARAMS = dict(smooth=1, enter=0.5, leave=0.4, k=3)
# P(change within 48 h) = sigmoid(a + b * logit(max smoothed P(other OD))), fitted on walk-forward predictions;
# walk-forward Brier 0.077 vs climatology 0.250.
P48_COEF = (-1.075, 1.503)
# likely window: first crossing of enter - band .. first crossing of enter + band (heuristic);
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

def walk_forward_paths():
    fc = pd.read_parquet(DATA / "forecasts.parquet")
    labels, _ = load_labels()
    d = add_rule_features(build(fc, labels, hourly_metar(), leads=list(range(1, H + 1))))
    wk = ((d["issue"] - CV_START).dt.days // 7).values
    p = np.full(len(d), np.nan)
    train_rows = d["lead"].isin(LEADS).values  # same training rows as train.main("cv") (build() default leads)
    for w in np.unique(wk[wk >= 0]):
        te = wk == w
        tr = train_rows & (d["valid"] < d["issue"][te].min()).values
        p[te] = predict(fit(d[tr], "od25"), d[te], "od25")
    t = d[wk >= 0].assign(p=p[wk >= 0], week=wk[wk >= 0])
    # wide (issue x lead); keep issues with a complete 48 h label horizon
    last_label = labels["od"].dropna().index.max()
    t = t[t["issue"] + pd.Timedelta(hours=H) <= last_label]
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

def next_change(times, p_od25, od_now, params=None):
    """Next probable OD change from a 48 h P(OD 25) path.

    times: valid times aligned with p_od25 (lead 1..48); od_now: current flown OD (25 or 7).
    Returns (valid time of the first hour in the new OD, or None; info dict). Heuristic, see module docstring.
    """
    p = params or PARAMS
    times = pd.DatetimeIndex(times)
    p25 = np.asarray(p_od25, dtype=float)[None, :]
    q = other_prob(p25, [od_now])
    qs = smooth_paths(q, p["smooth"])
    i = int(first_change(qs, p["enter"], p["leave"], p["k"])[0])
    a, b = P48_COEF
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

def main():
    w = walk_forward_paths()
    act = actual_first_change(w["y"], w["od_now"])
    q = other_prob(w["p25"], w["od_now"])
    weeks = np.unique(w["week"])
    print(f"{len(act)} issue times ({w['issue'].min():%Y-%m-%d} .. {w['issue'].max():%Y-%m-%d}), "
          f"{len(weeks)} weekly folds, {int((act >= 0).sum())} with a sustained OD change within 48 h")

    # nested walk-forward: parameters for week w chosen on weeks < w (first week only seeds the tuning)
    nested = np.full(len(act), -1)
    chosen = {}
    for wk in weeks[1:]:
        p = tune(q, act, w["week"] < wk)
        chosen[int(wk)] = p
        m = w["week"] == wk
        nested[m] = rule_first_change(q[m], p)
    final = tune(q, act, np.ones(len(act), bool))
    for wk, p in chosen.items():
        print(f"  week {wk}: {p}")
    print(f"  final (all weeks): {final}")

    ev = w["week"] >= weeks[1]  # report on the weeks scored out of sample
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

    # P(change within 48 h): logistic on max smoothed P(other OD), walk-forward by week
    x, yb = p48_features(q, final), (act >= 0).astype(int)
    p48 = np.full(len(act), np.nan)
    for wk in weeks[1:]:
        tr, te = w["week"] < wk, w["week"] == wk
        if len(np.unique(yb[tr])) == 2:
            a, b = fit_p48(x[tr], yb[tr])
            p48[te] = sigmoid(a + b * x[te])
    m = ev & ~np.isnan(p48)
    brier = float(np.mean((p48[m] - yb[m]) ** 2))
    clim = float(np.mean((yb[m].mean() - yb[m]) ** 2))
    coef = fit_p48(x, yb)

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
    print(f"\nNext-change timing, out of sample (weeks {int(weeks[1])}..{int(weeks[-1])}), hit = within +-{TOL_H} h:")
    print(res[cols].round(3).to_string(index=False))
    print(f"\nP(change within 48 h): walk-forward Brier {brier:.4f} vs climatology {clim:.4f}; "
          f"final coef a={coef[0]:.3f} b={coef[1]:.3f}")
    print(f"likely window (enter +-{WINDOW_BAND}, +-1 h): covers {cover:.0%} of actual changes when a change is "
          f"predicted, mean width {width:.1f} h")
    print(f"\nPARAMS = {final}\nP48_COEF = ({coef[0]:.3f}, {coef[1]:.3f})")
    extra = pd.DataFrame([{"method": "p_change_48h (logistic)", "brier": brier, "brier_climatology": clim,
                           "window_coverage": cover, "window_width_h": width, "params": str(final),
                           "p48_coef": str(tuple(round(c, 3) for c in coef))}])
    pd.concat([res, extra], ignore_index=True).to_csv(DATA / "changetime_eval.csv", index=False)
    print(f"wrote {DATA / 'changetime_eval.csv'}")


if __name__ == "__main__":
    main()
