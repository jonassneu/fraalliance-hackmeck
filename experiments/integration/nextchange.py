"""Next-change comparison on the long test (pre-registered in plan.json, comparison 4).

    uv run python experiments/integration/nextchange.py
(i)  fra.changetime hysteresis rule on the BLENDED P(OD 25), nested walk-forward over fra.changetime.GRID;
(ii) first change / P(change within 48 h) / window from the decision rollout's switch probabilities
     (P(changed by lead L) = 1 - P(no switch through lead L)), threshold nested walk-forward;
references: the logit with the current PARAMS (production today) and with the nested rule, prognosis, rules.
Issue times and actual changes exactly as fra.changetime (whole 48 h horizon labelled, before the holdout).
Nested choices for week w (rule parameters, path threshold, walk-forward P48 maps) use only issues whose whole 48 h
outcome was known at the start of week w (fra.changetime.known_before); the blend's walk-forward P48 map uses the
features of week w's nested rule parameters (strict since 31 Oct 2026 19:00 UTC; before, all issues of weeks < w and
the all-weeks parameters were used: a small look-ahead).
Output: nextchange_results.json, nextchange_methods.csv, nextchange_per_issue.parquet
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
from fra import changetime as CT  # noqa: E402
from fra import evalkit  # noqa: E402

OUT = Path(__file__).resolve().parent
THR = np.round(np.arange(0.30, 0.7001, 0.05), 2)
H = CT.H


def path_first(pc, thr):
    ok = pc >= thr
    return np.where(ok.any(1), ok.argmax(1), -1)


def tune_thr(pc, act, mask):
    best, key0 = None, None
    for th in THR:
        r = CT.score(path_first(pc[mask], th), act[mask])
        key = (round(r["event_acc"], 4), -np.nan_to_num(r["timing_mae_h"], nan=99))
        if key0 is None or key > key0:
            best, key0 = float(th), key
    return best


def wf_logistic(x, yb, week, weeks, known):
    """Walk-forward P48 map. x: feature array, or a function wk -> feature array (features that depend on the nested
    choice of week wk); known(wk): rows whose outcome was known at the start of week wk."""
    p = np.full(len(yb), np.nan)
    for wk in weeks[1:]:
        xw = x(wk) if callable(x) else x
        tr, te = (week < wk) & known(wk), week == wk
        if len(np.unique(yb[tr])) == 2:
            a, b = CT.fit_p48(xw[tr], yb[tr])
            p[te] = CT.sigmoid(a + b * xw[te])
    return p


def logit(p):
    p = np.clip(p, 1e-4, 1 - 1e-4)
    return np.log(p / (1 - p))


def window_cover(act, pred, lo, hi, ev):
    has = ev & (act >= 0) & (pred >= 0) & (lo >= 0)
    hi = np.where(hi >= 0, hi, H - 1)
    if not has.any():
        return np.nan, np.nan
    return (float(np.mean((act[has] >= lo[has] - 1) & (act[has] <= hi[has] + 1))), float(np.mean(hi[has] - lo[has])))


def main():
    w = CT.walk_forward_paths()            # production logit paths (all 48 leads), y, od_now, rule, prognosis
    issues = pd.DatetimeIndex(w["issue"])
    dec = pd.read_parquet(OUT / "dec_long.parquet")
    dec = dec[dec["config"] == "main"]
    piv = lambda c: dec.pivot(index="issue", columns="lead", values=c).reindex(index=issues, columns=range(1, H + 1))
    p_dec, pnc = piv("p25").to_numpy(), piv("pnc").to_numpy()
    od0 = dec.groupby("issue")["od_now_dec"].first().reindex(issues).to_numpy()
    have = np.isfinite(p_dec).all(1) & np.isfinite(pnc).all(1) & np.isfinite(w["p25"]).all(1)
    assert (od0[have] == w["od_now"][have]).all(), "od_now mismatch"
    print(f"{len(issues)} issue times, {int(have.sum())} with decision paths", flush=True)
    sel = have
    y, od_now, week = w["y"][sel], w["od_now"][sel], w["week"][sel]
    p_log, p_dec, pnc = w["p25"][sel], p_dec[sel], pnc[sel]
    p_bl = 0.5 * p_log + 0.5 * p_dec
    act = CT.actual_first_change(y, od_now)
    weeks = np.unique(week)
    ev = week >= weeks[1]
    q_log, q_bl = CT.other_prob(p_log, od_now), CT.other_prob(p_bl, od_now)
    pc = 1 - pnc                                      # P(switched by lead L)
    iss_sel = issues[sel]
    known = lambda wk: CT.known_before(iss_sel, wk)   # outcome known at the start of week wk (strict nesting)

    def nested_rule(q):
        out, chosen = np.full(len(act), -1), {}
        for wk in weeks[1:]:
            p = CT.tune(q, act, (week < wk) & known(wk))
            chosen[int(wk)] = p
            m = week == wk
            out[m] = CT.rule_first_change(q[m], p)
        return out, chosen, CT.tune(q, act, np.ones(len(act), bool))

    nest_log, ch_log, fin_log = nested_rule(q_log)
    nest_bl, ch_bl, fin_bl = nested_rule(q_bl)
    nest_path, ch_path = np.full(len(act), -1), {}
    for wk in weeks[1:]:
        th = tune_thr(pc, act, (week < wk) & known(wk))
        ch_path[int(wk)] = th
        m = week == wk
        nest_path[m] = path_first(pc[m], th)
    fin_path = tune_thr(pc, act, np.ones(len(act), bool))
    raw = dict(smooth=1, enter=0.5, leave=0.5, k=1)
    methods = {
        "blend: hysteresis rule, nested": nest_bl,
        "blend: current PARAMS": CT.rule_first_change(q_bl, CT.PARAMS),
        "blend: all-weeks params (in-sample; = fra.blend live)": CT.rule_first_change(q_bl, fin_bl),
        "decision paths: P(switched) >= thr, nested": nest_path,
        "decision paths: thr 0.5": path_first(pc, 0.5),
        "logit: current PARAMS (production today)": CT.rule_first_change(q_log, CT.PARAMS),
        "logit: hysteresis rule, nested": nest_log,
        "official rules": CT.rule_first_change(CT.other_prob(w["rule25"][sel], od_now), raw),
        "published prognosis": CT.rule_first_change(CT.other_prob(w["prog25"][sel], od_now), raw),
        "persistence": np.full(len(act), -1),
    }
    rows = [{"method": k, **CT.score(v[ev], act[ev])} for k, v in methods.items()]
    res = pd.DataFrame(rows)
    # paired event accuracy CIs (day blocks of the issue time)
    correct = {k: (((v >= 0) & (act >= 0) & (np.abs(v - act) <= CT.TOL_H)) | ((v < 0) & (act < 0))).astype(float)
               for k, v in methods.items()}
    iss_ev = issues[sel][ev]
    keys = list(methods)
    ci = evalkit.bootstrap_means({k: correct[k][ev] for k in keys}, iss_ev,
                                 pairs=[(keys[0], keys[3]), (keys[0], keys[5]), (keys[3], keys[5]),
                                        (keys[0], keys[6]), (keys[0], keys[8]), (keys[2], keys[5])])
    # P(change within 48 h)
    yb = (act >= 0).astype(int)
    x_bl = CT.p48_features(q_bl, fin_bl)
    x_log = CT.p48_features(q_log, CT.PARAMS)
    x_path = logit(pc[:, -1])
    x_bl_wk = lambda wk: CT.p48_features(q_bl, ch_bl[int(wk)])   # features of week wk's nested blend rule
    p48 = {"blend: logistic on max smoothed P(other), walk-forward": wf_logistic(x_bl_wk, yb, week, weeks, known),
           "decision paths: recalibrated, walk-forward": wf_logistic(x_path, yb, week, weeks, known),
           "decision paths: raw P(switch within 48 h)": pc[:, -1],
           "logit: P48_COEF as in production today": CT.sigmoid(CT.P48_COEF[0] + CT.P48_COEF[1] * x_log),
           "logit: logistic, walk-forward": wf_logistic(x_log, yb, week, weeks, known),
           "blend: all-weeks coefficients (in-sample; = fra.blend live)": CT.sigmoid(np.polyval(
               CT.fit_p48(x_bl, yb)[::-1], x_bl))}
    m = ev & np.all([np.isfinite(v) for v in p48.values()], axis=0)
    clim = float(np.mean((yb[m].mean() - yb[m]) ** 2))
    b48 = {k: float(np.mean((v[m] - yb[m]) ** 2)) for k, v in p48.items()}
    b48_ci = evalkit.bootstrap_means({k: (v - yb) ** 2 for k, v in p48.items()}, issues[sel], mask=m,
                                     pairs=[(list(p48)[0], list(p48)[1]), (list(p48)[1], list(p48)[3])])
    coef_bl, coef_path, coef_log = CT.fit_p48(x_bl, yb), CT.fit_p48(x_path, yb), CT.fit_p48(x_log, yb)
    # windows
    qs = CT.smooth_paths(q_bl, fin_bl["smooth"])
    lo = CT.first_change(qs, fin_bl["enter"] - CT.WINDOW_BAND, fin_bl["enter"] - CT.WINDOW_BAND, 1)
    hi = CT.first_change(qs, fin_bl["enter"] + CT.WINDOW_BAND, fin_bl["enter"] + CT.WINDOW_BAND, 1)
    cov_bl = window_cover(act, nest_bl, lo, hi, ev)
    cond = pc / np.maximum(pc[:, -1:], 1e-9)
    plo = np.where(pc[:, -1] > 0, (cond >= 0.25).argmax(1), -1)
    phi = np.where(pc[:, -1] > 0, (cond >= 0.75).argmax(1), -1)
    cov_path = window_cover(act, nest_path, plo, phi, ev)
    out = {"n_issues_scored": int(ev.sum()), "n_with_change": int((act[ev] >= 0).sum()),
           "period": f"{issues[sel][ev].min()} .. {issues[sel][ev].max()}",
           "methods": res.to_dict("records"), "event_acc_ci": ci.to_dict("records"),
           "p48_brier": b48, "p48_brier_climatology": clim, "p48_ci": b48_ci.to_dict("records"),
           "chosen_blend_rule_per_week": ch_bl, "chosen_path_thr_per_week": ch_path,
           "final_blend_params_all_weeks": fin_bl, "final_logit_params_all_weeks": fin_log,
           "final_path_thr_all_weeks": fin_path,
           "p48_coef_blend_all_weeks": coef_bl, "p48_coef_path_all_weeks": coef_path,
           "p48_coef_logit_all_weeks": coef_log, "logit_P48_COEF_in_code": CT.P48_COEF,
           "window_blend_cover_width": cov_bl, "window_path_cover_width": cov_path}
    (OUT / "nextchange_results.json").write_text(json.dumps(out, indent=1, default=str))
    res.to_csv(OUT / "nextchange_methods.csv", index=False)
    per = pd.DataFrame({"issue": issues[sel], "week": week, "od_now": od_now, "act": act, "ev": ev,
                        **{f"pred_{i}": v for i, v in enumerate(methods.values())},
                        **{f"p48_{i}": v for i, v in enumerate(p48.values())}})
    per.to_parquet(OUT / "nextchange_per_issue.parquet")
    pd.set_option("display.width", 250)
    cols = ["method", "n_issues", "n_actual_change", "n_pred_change", "hits", "hit_rate", "timing_mae_h",
            "false_alarm", "correct_no_change", "event_acc"]
    print(res[cols].round(3).to_string(index=False))
    print(ci.round(4).to_string(index=False))
    print("P48 Brier", {k: round(v, 4) for k, v in b48.items()}, "clim", round(clim, 4))
    print(b48_ci.round(4).to_string(index=False))
    print("final blend params", fin_bl, "path thr", fin_path, "coef blend", coef_bl, "path", coef_path, "logit", coef_log)
    print("window blend", cov_bl, "path", cov_path)


if __name__ == "__main__":
    main()
