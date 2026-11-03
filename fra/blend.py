"""Blended operating-direction forecast: the production logit + the hourly decision model on simulated wind paths.

    P(OD 25) = W_LOGIT * P_logit + (1 - W_LOGIT) * P_decision          (W_LOGIT = 0.5, fixed)

    P_logit     production logistic regression (fra.train / fra.predict.forecast), unchanged
    P_decision  hourly decision model (fra.decision.DEFAULT) rolled out hour by hour along N_PATHS simulated
                actual-wind paths (fra.fcerror.DEFAULT: the as-issued ECMWF+ICON-D2 forecast plus analogue residual
                paths), look-ahead features from the ensemble-mean path (anticipate="mean")

What is known at issue time t (fra.dataset.KNOWN_LAG_H = 2): the flown OD of the last completely published radar hour
[t-2h, t-1h) and the METAR wind up to t. The rollout starts at label hour t-1 from that OD, simulates the two
unpublished hours (t-1 and t) with the OBSERVED wind, and continues on the simulated paths; lead L (label hour t+L)
is rollout step L+1 (`rollout_many`). The same function serves the walk-forward evaluation and the live forecast.

Runway 18 and next change (experiments/integration/REPORT.md, pre-registered in experiments/integration/plan.json):
    RWY18_MODE      how P(RWY 18 open) is made (see `rwy18_open`)
    CHANGE_MODE     how the next change / P(change within 48 h) / window are made (see `next_change`)

Entries
    forecast(issue=None, variant=None, models=None)   live / as-of forecast, same return value and columns as
        fra.predict.forecast() (+ diagnostic columns); any failure of the decision part falls back to the logit
        forecast, flagged in the columns blend_ok / blend_status and in out.attrs["blend"]. Ops registry entry
        'fra.blend:forecast' with models {"model": <logit model.pkl>, "decision": <decision bundle .pkl>}.
    walk_forward_preds(...)   weekly walk-forward predictions of logit, decision rollout and blend per (issue, lead)
        on the production test rows (fra.evalkit folds; final=True scores only the locked holdout).
    fit_decision(out)         fit + pickle the decision bundle on all labels known now (python -m fra.blend --fit).
"""

import os
import time
import warnings
from pathlib import Path

import numpy as np
import pandas as pd

from fra import decision as D
from fra import evalkit
from fra.dataset import KNOWN_LAG_H

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
OUT = ROOT / "experiments" / "integration"
DECISION_MODEL = OUT / "decision_model.pkl"     # default decision bundle (python -m fra.blend --fit)
HOUR = pd.Timedelta(hours=1)
H = 48

W_LOGIT = 0.5             # weight of the logit; fixed (walk-forward fitted per-bucket weights: no clear gain)
N_PATHS = 200             # simulated wind paths per issue
SEED = 0                  # Part B sampling seed (deterministic per issue)
SPEC = D.DEFAULT          # decision model specification
PARTB = None              # fra.fcerror parameter set; None = fra.fcerror.DEFAULT (resolved at call time)

# RWY 18 (experiments/integration/rwy18.py, weekly walk-forward from 2025-09-01, 247,863 rows, 34 closure hours):
# "logit" = the production logit (fra.predict) | "paths" = closure model on the wind paths with the logit P(OD 25) |
# "blend" = mean of both. Pooled Brier logit 0.0049 vs paths 0.0059 / blend 0.0052 (AUC 0.66 vs 0.84 / 0.81, hit
# rate at P(open) < 0.8: 40 % vs 19 % / 39 %, false alarms 2.3 vs 1.0 / 1.5 per 1,000 h) -> the logit stays.
RWY18_MODE = "logit"
# Next change (experiments/integration/nextchange.py, long test, nested walk-forward, 3,420 issue times):
# "hysteresis" = the fra.changetime rule on the BLENDED P(OD 25) with BLEND_CHANGE_PARAMS / BLEND_P48_COEF (event
# accuracy 80.0 % with the rule re-chosen by strictly nested walk-forward, 81.3 % with the deployed all-weeks
# parameters, which is in-sample) | "paths" = first lead where the rollout's P(switched) >= PATH_CHANGE_THR (72.4 %).
# Parameters and the P(change within 48 h) map were tuned on all weeks of the long test (issues 2026-06-01 ..
# 2026-10-28, new data layer); the nested weekly choice was stable from week 10 on.
CHANGE_MODE = "hysteresis"
BLEND_CHANGE_PARAMS = dict(smooth=1, enter=0.45, leave=0.45, k=1)
BLEND_P48_COEF = (0.692, 1.302)   # sigmoid(a + b * logit(max smoothed P(other OD)))
PATH_CHANGE_THR = 0.55            # "paths" alternative (all weeks)
PATH_P48_COEF = (-0.324, 1.041)   # sigmoid(a + b * logit(P(switch within 48 h))), walk-forward Brier 0.080


# ---------------------------------------------------------------------------------------------- rollout

def _utc(t):
    t = pd.Timestamp(t)
    return t.tz_localize("UTC") if t.tzinfo is None else t.tz_convert("UTC")


def metar_gust(u, v, gust):
    """METAR gust convention: a gust is reported only when it exceeds the mean speed by >= 10 kt."""
    s = np.hypot(u, v)
    return np.where(gust >= s + 10.0, gust, s)


def rollout_many(model, r18, issues, od_now, obs, futures, valids, lag_h=None, chunk=None):
    """Decision-model rollouts for M issue times on simulated wind paths (identical code for evaluation and live).

    issues: M issue times t; od_now: M current ODs (25/7) = label of the last complete hour t - lag_h;
    obs: hourly observed wind (fra.decision convention, columns u, v, gust); futures: M arrays [N, L, 3] of simulated
    u, v, gust valid at `valids[i]` (Part B Paths.valid = t+1 .. t+48); lag_h: default fra.dataset.KNOWN_LAG_H.
    The rollout starts at label hour t - lag_h + 1 from od_now; wind hours <= t come from `obs`, later ones from the
    paths (the last simulated hour is held for the look-ahead beyond lead 48); look-ahead features from the
    per-issue ensemble mean (= fra.decision.rollout(anticipate="mean")).
    Returns dict of [M, 48] arrays for leads 1..48 (path means):
        p25   P(OD 25)
        pnc   P(no switch away from od_now from the start hour through lead L) (switches in the unpublished hours
              count for lead 1)
        p18   P(RWY 18 open) with the rollout's own OD per path; c25 / c07  P(RWY 18 closed | OD 25 / OD 07, wind)
              (only if r18 is given)"""
    lag = KNOWN_LAG_H if lag_h is None else int(lag_h)
    Hs = H + lag                       # steps: label hours t-lag+1 .. t+48
    issues = [_utc(t) for t in issues]
    od_now = np.asarray(od_now, dtype=float)
    M = len(issues)
    chunk = chunk or max(1, 5600 // max(1, futures[0].shape[0]))
    keys = ["p25", "pnc"] + (["p18", "c25", "c07"] if r18 is not None else [])
    res = {k: np.full((M, H), np.nan) for k in keys}
    for c0 in range(0, M, chunk):
        idx = range(c0, min(M, c0 + chunk))
        Ws, starts, ods, ns = [], [], [], []
        for i in idx:
            start = issues[i] - (lag - 1) * HOUR
            W = D.assemble_paths(obs, start, np.asarray(futures[i], float), Hs, D.CHANNELS, valid=valids[i],
                                 obs_until=issues[i])
            Ws.append(W)
            ns.append(W.shape[0])
            starts += [start] * W.shape[0]
            ods.append(np.full(W.shape[0], od_now[i]))
        W = np.concatenate(Ws)
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", RuntimeWarning)
            Wa = np.concatenate([np.repeat(np.nanmean(w, axis=0, keepdims=True), len(w), axis=0) for w in Ws])
        r = D.rollout_batch(model, np.concatenate(ods), starts, W, Hs, D.CHANNELS, rwy18=r18, W_ant=Wa)
        off = np.cumsum([0] + ns)
        for j, i in enumerate(idx):
            sl = slice(off[j], off[j + 1])
            mean = lambda a: a[sl, lag:lag + H].mean(axis=0)
            res["p25"][i] = mean(r["p25"])
            res["pnc"][i] = mean(r["p_nochange"])
            if r18 is not None:
                res["p18"][i] = mean(r["p18_open"])
                res["c25"][i] = mean(r["c25"])
                res["c07"][i] = mean(r["c07"])
    return res


def rwy18_open(p_logit18, p25_logit, c25, c07, mode=None):
    """P(RWY 18 open) per RWY18_MODE: 'logit' | 'paths' (closure model on the paths with the logit P(OD 25)) |
    'blend' (mean of both)."""
    mode = mode or RWY18_MODE
    paths = 1 - (p25_logit * c25 + (1 - p25_logit) * c07)
    if mode == "logit":
        return np.asarray(p_logit18, float)
    if mode == "paths":
        return paths
    if mode == "blend":
        return 0.5 * np.asarray(p_logit18, float) + 0.5 * paths
    raise ValueError(mode)


def path_change(pnc, thr=None, coef=None):
    """Next change from the rollout's switch probabilities, pnc [M, 48] = P(no switch through lead L).
    Returns (first lead index with P(changed) >= thr or -1, P(change within 48 h) recalibrated with coef,
    window start / end lead index = quartiles of the conditional first-change distribution (-1 if none))."""
    thr = PATH_CHANGE_THR if thr is None else thr
    a, b = PATH_P48_COEF if coef is None else coef
    pc = 1 - np.atleast_2d(np.asarray(pnc, float))
    first = np.where((pc >= thr).any(1), (pc >= thr).argmax(1), -1)
    raw = np.clip(pc[:, -1], 1e-4, 1 - 1e-4)
    p48 = 1 / (1 + np.exp(-(a + b * np.log(raw / (1 - raw)))))
    cond = pc / np.maximum(pc[:, -1:], 1e-9)
    lo = np.where(pc[:, -1] > 0, (cond >= 0.25).argmax(1), -1)
    hi = np.where(pc[:, -1] > 0, (cond >= 0.75).argmax(1), -1)
    return first, p48, lo, hi


def next_change(times, p_blend, od_now, pnc=None, mode=None):
    """(next change valid time or None, info) per CHANGE_MODE; same info keys as fra.changetime.next_change."""
    from fra import changetime as CT
    mode = mode or CHANGE_MODE
    times = pd.DatetimeIndex(times)
    if mode == "hysteresis" or pnc is None:
        p = BLEND_CHANGE_PARAMS or CT.PARAMS
        coef = BLEND_P48_COEF or CT.P48_COEF
        return CT.next_change(times, p_blend, od_now, params=p, p48_coef=coef)
    first, p48, lo, hi = path_change(pnc)
    i, lo, hi = int(first[0]), int(lo[0]), int(hi[0])
    info = {"od_now": int(od_now), "to_od": 7 if od_now == 25 else 25, "lead_h": i + 1 if i >= 0 else None,
            "p_change_48h": round(float(p48[0]), 3),
            "window_start": times[lo] if (i >= 0 and lo >= 0) else None,
            "window_end": times[hi] if (i >= 0 and hi >= 0) else None,
            "rule": f"first hour where the simulated P(switched) >= {PATH_CHANGE_THR}; window = quartiles of the "
                    "simulated first-switch time"}
    return (times[i] if i >= 0 else None), info


# ---------------------------------------------------------------------------------------------- models

def fit_decision(out=DECISION_MODEL, before=None, spec=None):
    """Fit the decision model + RWY 18 closure model on all rows known at `before` (default: now) and pickle the
    bundle (fra.decision.load_bundle format) atomically."""
    import pickle
    import fra.decision as _D   # pickled as fra.decision.* classes
    before = _utc(before) if before is not None else pd.Timestamp.now("UTC").floor("h")
    m, r, obs, F = _D.fit_default(spec or SPEC, before=before)
    out = Path(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp = out.with_name(f".{out.name}.{os.getpid()}.tmp")
    with open(tmp, "wb") as f:
        pickle.dump({"od": m, "rwy18": r, "spec": "DEFAULT", "history": False, "fitted_before": str(before),
                     "trained_until": str(F.index[F["observed"] & (F.index < before)].max()),
                     "n_train": m.n_train, "n_switch": m.n_switch}, f)
    os.replace(tmp, out)
    return out


def _partb_params():
    from fra import fcerror as B
    return PARTB or B.DEFAULT


# ---------------------------------------------------------------------------------------------- live entry

def decision_forecast(issue, od_now, bundle=None, metar=None, frame=None, n_paths=None, params=None, live=None):
    """Decision rollout for one issue time: dict of 48-lead arrays (rollout_many) + timing / input info.
    metar: IEM METAR frame covering the last hours (live: the fetch fra.predict made; None -> fetched / archive);
    frame: forecast frame (None -> live single runs for a current issue, else the archive as of the issue)."""
    from fra import fcerror as B
    t0 = time.time()
    issue = _utc(issue)
    live = (abs(pd.Timestamp.now("UTC") - issue) <= 2 * HOUR) if live is None else live
    b = D.load_bundle(bundle or DECISION_MODEL) if not isinstance(bundle, dict) else bundle
    model, r18 = b["od"], b.get("rwy18")
    if metar is None:
        if live:
            from fra import weather
            metar = weather.metar(start=(issue - pd.Timedelta(days=2)).strftime("%Y-%m-%d"))
        else:
            metar = pd.read_parquet(B._metar_file())
    metar = metar[pd.to_datetime(metar.index, utc=True) <= issue]            # nothing after the issue time
    obs = D._metar_hourly(metar)
    if obs.index.max() < issue - HOUR:
        raise RuntimeError(f"METAR too old: last wind hour {obs.index.max()} for issue {issue}")
    o = B.obs_now([issue], reports=B.reports_from_frame(metar)).iloc[0]
    lib = B.load_library()
    t1 = time.time()
    if frame is None:
        frame = B.live_forecast_frame(issue) if live else B.forecast_frame(issue, lib)
    t2 = time.time()
    P = B.sample_paths(issue, frame, n=n_paths or N_PATHS, params=params or _partb_params(),
                       obs_now_uvg=np.array([o.u, o.v, o.gust], float), seed=SEED, lib=lib)
    if P is None:
        raise RuntimeError("Part B: too little eligible library history")
    fut = np.stack([P.u, P.v, P.gust], -1)
    if not np.isfinite(fut[..., :2]).all():
        raise RuntimeError("Part B paths contain NaN (forecast frame incomplete)")
    r = rollout_many(model, r18, [issue], [od_now], obs, [fut], [P.valid])
    r = {k: v[0] for k, v in r.items()}
    has_icon = "icon_wind_speed" in frame and bool(frame["icon_wind_speed"].iloc[1:43].notna().all())
    r["info"] = dict(n_paths=int(fut.shape[0]), ess=round(float(P.info.get("ess", np.nan)), 1),
                     n_eligible=int(P.info.get("n_eligible", 0)), icon_d2=has_icon,
                     library_first_tau=lib.meta.get("first_tau"), library_last_tau=lib.meta.get("last_tau"),
                     library_entries=int(len(lib.tau)),
                     ifs_run=str(frame["run_init"].iloc[0]) if "run_init" in frame else None,
                     icon_run=str(frame["icon_run_init"].iloc[0]) if "icon_run_init" in frame else None,
                     metar_last=str(obs.index.max()), metar_now_age_min=float(o.age_min),
                     trained_until=b.get("trained_until"), seconds_inputs=round(t1 - t0, 2),
                     seconds_forecast_frame=round(t2 - t1, 2), seconds_paths_rollout=round(time.time() - t2, 2))
    return r


def forecast(issue=None, variant=None, models=None, n_paths=None):
    """Blended 48 h forecast. Returns what fra.predict.forecast() returns, (out, issue, od_now, next_change), with the
    same columns; p_od25 (and od_pred, od_certainty, next change fields; p_rwy18_open per RWY18_MODE) come from the
    blend. Diagnostic columns: p_od25_logit, p_od25_decision, p_rwy18_open_logit, blend_ok, blend_status.
    If anything in the decision part fails, the logit forecast is returned unchanged with blend_ok = False and the
    reason in blend_status (also out.attrs["blend"]). models (ops registry): {"model": logit model.pkl (loaded by
    fra.predict from its folder), "decision": decision bundle (default experiments/integration/decision_model.pkl),
    "library": optional MANIFEST.json of a frozen copy of the Part B library inputs (fra.fcerror.use_library_files;
    default: the live data/ files)}."""
    from fra import predict as FP
    from fra import weather
    t0 = time.time()
    seen = {}
    orig_flown, orig_metar = FP.flown_state, weather.metar

    def flown_spy(*a, **k):                       # what fra.predict saw (no second radar request)
        r = orig_flown(*a, **k)
        if isinstance(r, dict):
            seen["flown"] = r
        return r

    def metar_spy(*a, **k):                       # reuse fra.predict's METAR fetch (no second IEM request)
        r = orig_metar(*a, **k)
        seen["metar"] = r
        return r

    if issue is not None:                         # fra.predict.forecast takes a naive UTC time (string)
        issue = _utc(issue).tz_localize(None).isoformat()
    FP.flown_state, weather.metar = flown_spy, metar_spy
    try:
        out, iss, od_now, change = FP.forecast(issue)
    finally:
        FP.flown_state, weather.metar = orig_flown, orig_metar
    t_logit = time.time() - t0
    out = out.copy()
    out["p_od25_logit"] = out["p_od25"]
    out["p_rwy18_open_logit"] = out["p_rwy18_open"]
    out["p_od25_decision"] = np.nan
    status, info = "ok", {}
    try:
        lib_ref = (models or {}).get("library")
        if lib_ref:                               # frozen library inputs (checked against their manifest)
            from fra import fcerror as B
            info["library_files"] = B.use_library_files(lib_ref)
        bundle = (models or {}).get("decision") or DECISION_MODEL
        flown = seen.get("flown") or {}
        notes = []
        if flown.get("od_now") is None:
            notes.append("od_now from the METAR rule (no complete radar hour with traffic)")
        if int(od_now) not in (25, 7):
            raise ValueError(f"od_now {od_now}")
        r = decision_forecast(iss, int(od_now), bundle=bundle, metar=seen.get("metar"), n_paths=n_paths)
        info.update(r.pop("info"))
        try:   # did the logit and Part B use the same ECMWF run? (separate requests; fra.dataset.LIVE_FETCHES)
            from fra import dataset as DS
            used = {f.get("user"): f.get("used_init") for f in getattr(DS, "LIVE_FETCHES", [])
                    if f.get("model") == "ecmwf_ifs"}
            if "logit" in used and info.get("ifs_run"):
                info["ifs_run_logit"] = used["logit"]
                info["ifs_same_run"] = bool(used["logit"] and pd.Timestamp(used["logit"]) == pd.Timestamp(info["ifs_run"]))
        except Exception:
            pass
        if not (np.isfinite(r["p25"]).all() and np.isfinite(r["pnc"]).all()):
            raise RuntimeError("decision rollout returned NaN")
        b = out.copy()                            # assembled completely before it replaces the logit output
        p_log = b["p_od25_logit"].to_numpy(float)
        p_bl = W_LOGIT * p_log + (1 - W_LOGIT) * r["p25"]
        b["p_od25_decision"] = np.round(r["p25"], 3)
        b["p_od25"] = np.round(p_bl, 3)
        b["od_pred"] = np.where(b["p_od25"] >= 0.5, 25, 7)
        b["od_certainty"] = (np.abs(b["p_od25"] - 0.5) * 2).round(3)
        if RWY18_MODE != "logit":
            p18 = rwy18_open(b["p_rwy18_open_logit"].to_numpy(float), p_log, r["c25"], r["c07"])
            if not np.isfinite(p18).all():
                raise RuntimeError("RWY 18 path probability NaN")
            b["p_rwy18_open"] = np.round(np.clip(p18, 0, 1), 3)
            b["rwy18_pred_open"] = b["p_rwy18_open"] >= 0.5
        ch, cinfo = next_change(b["valid_utc"], p_bl, int(od_now), pnc=r["pnc"])
        b["next_change_utc"] = ch
        b["p_change_48h"] = round(float(cinfo.get("p_change_48h", np.nan)), 3)
        b["change_window_start"], b["change_window_end"] = cinfo.get("window_start"), cinfo.get("window_end")
        out, change = b, ch
        if notes:
            status = "ok; " + "; ".join(notes)
    except Exception as ex:   # never lose the hour: the logit forecast exactly as fra.predict issued it
        status = f"fallback to logit: {type(ex).__name__}: {str(ex)[:200]}"
    out["blend_ok"] = status.startswith("ok")
    out["blend_status"] = status
    out.attrs["blend"] = dict(status=status, w_logit=W_LOGIT, rwy18_mode=RWY18_MODE, change_mode=CHANGE_MODE,
                              seconds_logit=round(t_logit, 2), seconds_total=round(time.time() - t0, 2), **info)
    return out, iss, od_now, change


# ---------------------------------------------------------------------------------------------- walk-forward

_G = {}


def _wf_init():
    from fra import fcerror as B
    labels = pd.read_parquet(DATA / "labels.parquet")
    obs = D.load_obs()                         # training features: as fra.decision.fit_default
    F = D.features(obs, labels)
    _G.update(B=B, labels=labels, rows=D.transitions(F), r18rows=D.rwy18_rows(F),
              obs0=D.load_obs(fill_gap_h=0),   # rollout paths: no gap interpolation (no look-ahead)
              lib=B.load_library())


def _wf_week(job):
    """One walk-forward week: fit on rows known at the week start, sample paths, roll out every config."""
    if not _G:
        _wf_init()
    ws, issues, cfgs, n_paths = job["week_start"], job["issues"], job["configs"], job["n_paths"]
    B, labels = _G["B"], _G["labels"]
    rows = _G["rows"][_G["rows"].index + D.FUT * HOUR <= ws]
    model = D.DecisionModel(**SPEC).fit(rows)
    r18t = _G["r18rows"][_G["r18rows"].index + KNOWN_LAG_H * HOUR <= ws]
    r18 = D.Rwy18Model().fit(r18t) if r18t["closed"].nunique() == 2 else None
    out = []
    by_params = {}
    for c in cfgs:
        by_params.setdefault(c["params"], []).append(c)
    for pname, cs in by_params.items():
        params = getattr(B, pname) if isinstance(pname, str) else pname
        keep, futs, valids = [], [], []
        for t in issues:
            try:
                P = B.sample_paths(t, n=n_paths, params=params, lib=_G["lib"], seed=SEED)
            except KeyError:
                P = None
            if P is None or not np.isfinite(P.u).all():
                continue
            keep.append(t)
            futs.append(np.stack([P.u, P.v, P.gust], -1))
            valids.append(P.valid)
        if not keep:
            continue
        for c in cs:
            lag = c.get("lag_h", KNOWN_LAG_H)
            od = labels["od"].reindex(pd.DatetimeIndex(keep) - lag * HOUR).to_numpy()
            ok = np.isin(od, (25.0, 7.0))
            ki = [t for t, k in zip(keep, ok) if k]
            if not ki:
                continue
            fu = [f for f, k in zip(futs, ok) if k]
            if c.get("gust_metar"):
                fu = [np.concatenate([f[..., :2], metar_gust(f[..., 0], f[..., 1], f[..., 2])[..., None]], -1)
                      for f in fu]
            r = rollout_many(model, r18, ki, od[ok], _G["obs0"], fu, [v for v, k in zip(valids, ok) if k], lag)
            df = pd.DataFrame({"issue": np.repeat(pd.DatetimeIndex(ki), H), "lead": np.tile(np.arange(1, H + 1), len(ki)),
                               "config": c["name"], "od_now_dec": np.repeat(od[ok], H)})
            for k, v in r.items():
                df[k] = v.ravel()
            out.append(df)
    print(f"  week {ws.date()}: {len(issues)} issues, model rows {len(rows)}, r18 rows {len(r18t)}", flush=True)
    return pd.concat(out, ignore_index=True) if out else None


def decision_walk_forward(issues, start=None, final=False, configs=None, n_paths=None, workers=4):
    """Weekly walk-forward decision rollouts for the given issue times (fra.evalkit weeks from `start`; final=True:
    only the holdout). configs: [{name, params ('DEFAULT' | 'DEFAULT_NATIVE' | a Params), lag_h, gust_metar}].
    Returns a long frame issue, lead, config, od_now_dec, p25, pnc, p18, c25, c07."""
    from concurrent.futures import ProcessPoolExecutor
    configs = configs or [dict(name="main", params="DEFAULT", lag_h=KNOWN_LAG_H)]
    issues = pd.DatetimeIndex(sorted(set(pd.DatetimeIndex(issues))))
    wk = evalkit.test_weeks(issues, None, start, final)
    jobs = [dict(week_start=evalkit.week_start(w, start, final), issues=list(issues[wk == w]), configs=configs,
                 n_paths=n_paths or N_PATHS) for w in np.unique(wk[wk >= 0])]
    if workers <= 1:
        parts = [_wf_week(j) for j in jobs]
    else:
        with ProcessPoolExecutor(min(workers, 4), initializer=_wf_init) as ex:
            parts = list(ex.map(_wf_week, jobs))
    parts = [p for p in parts if p is not None]
    return pd.concat(parts, ignore_index=True) if parts else pd.DataFrame()


def walk_forward_preds(d=None, start=None, final=False, n_paths=None, workers=4, w=None, dec=None):
    """Per (issue, lead) walk-forward predictions on the production test rows: p_logit (experiments.harness
    production_preds = fra.train exactly), p_dec (decision rollout, config 'main'), p_blend = w * p_logit +
    (1 - w) * p_dec, plus od, od_now, valid and the baselines of the harness table. dec: precomputed
    decision_walk_forward() frame (else computed)."""
    import sys
    sys.path.insert(0, str(ROOT))
    from experiments import harness as Hn
    d = Hn.load() if d is None else d
    z, y, p, ok = Hn.production_preds(d, "od25", start, final)
    t = z.loc[ok, ["issue", "lead", "valid", "od", "od_now", "rule_od25", "base_prognosis_od25", "od_now25",
                   "prog_main_west"]].copy()
    t["p_logit"] = p[ok]
    if dec is None:
        dec = decision_walk_forward(t["issue"].unique(), start, final, n_paths=n_paths, workers=workers)
    dm = dec[dec["config"] == "main"] if "config" in dec else dec
    t = t.merge(dm[["issue", "lead", "p25", "pnc"]].rename(columns={"p25": "p_dec"}), on=["issue", "lead"],
                how="left")
    w = W_LOGIT if w is None else w
    t["p_blend"] = w * t["p_logit"] + (1 - w) * t["p_dec"]
    return t.reset_index(drop=True)


def score(t):
    """Accuracy at 1/6/24/48 h and Brier (1,6,24,48 / all leads) with day-block CIs, blend vs logit (paired)."""
    y = (t["od"] == 25).astype(float).to_numpy()
    preds = {"logit": t["p_logit"], "decision": t["p_dec"], "blend": t["p_blend"]}
    pairs = [("blend", "logit"), ("decision", "logit")]
    a = evalkit.bootstrap(y, preds, t["valid"], t["lead"], evalkit.REPORT_LEADS, pairs)
    b = evalkit.bootstrap(y, preds, t["valid"], t["lead"], evalkit.ALL_LEADS, pairs, per_lead=False,
                          pooled_id=evalkit.POOLED_ALL)
    return pd.concat([a, b], ignore_index=True)


if __name__ == "__main__":
    # python -m fra.blend [ISSUE_UTC]          blended forecast for the current (or a past) hour, writes nothing
    # python -m fra.blend --fit [PATH]         fit + pickle the decision bundle (default DECISION_MODEL)
    # python -m fra.blend --wf [--final]       walk-forward predictions (long test; --final: ONLY the locked holdout,
    #                                          never for tuning) -> experiments/integration/wf_<period>.parquet + CIs
    import sys
    a = sys.argv[1:]
    if "--fit" in a:
        dst = a[a.index("--fit") + 1] if len(a) > a.index("--fit") + 1 else DECISION_MODEL
        print("decision bundle ->", fit_decision(dst))
    elif "--wf" in a:
        final = "--final" in a
        t = walk_forward_preds(final=final)
        tag = "holdout" if final else "long"
        dst = OUT / f"wf_{tag}.parquet"
        tmp = dst.with_name(f".{dst.name}.tmp")
        t.to_parquet(tmp)
        os.replace(tmp, dst)
        tab = score(t.dropna(subset=["p_blend"]))
        tab.to_csv(OUT / f"wf_{tag}_ci.csv", index=False)
        print(tab[tab["metric"] == "brier"].round(4).to_string(index=False))
        print("->", dst)
    else:
        out, iss, od_now, change = forecast(a[0] if a else None)
        print(out.attrs.get("blend"))
        print(out.iloc[[0, 5, 11, 23, 35, 47]].to_string(index=False))
