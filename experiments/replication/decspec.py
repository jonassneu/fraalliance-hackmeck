"""PLAN_decspec.json: decision-model variants on 12 years of labels, rolled out on shared Part B paths.

    uv run python experiments/replication/decspec.py run      # rollouts P1 .. long test -> decspec.parquet
    uv run python experiments/replication/decspec.py score    # selection on P1, confirmation on P2 + long test
"""
import json
import os
import sys
import time
import warnings
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

for k in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(k, "1")

import numpy as np
import pandas as pd

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT))
from experiments.replication import run as R  # noqa: E402
from fra import blend as BL  # noqa: E402
from fra import decision as D  # noqa: E402
from fra import evalkit as E  # noqa: E402
from fra import fcerror as B  # noqa: E402
from fra.labels import history_labels  # noqa: E402

HOUR = pd.Timedelta(hours=1)
SEED = 20261106
LONG = (pd.Timestamp("2026-06-01", tz="UTC"), E.HOLDOUT_START)
SPECS = {
    "D0": dict(D.DEFAULT),
    "D1_dur": dict(D.DEFAULT, features=D.DEFAULT["features"] + ["log_dur"]),
    "D2_hinge": dict(D.DEFAULT, features=D.DEFAULT["features"] + D.HINGE),
    "D3_C1": dict(D.DEFAULT, C=1.0),
    "D4_lgbm": dict(kind="lgbm", features=[f for f in D.BASE if not f.startswith("morn_")] + D.F6,
                    lgb_params=D.LGB_SMALL),
}
_G = {}


def rollout(model, issues, od_now, dur0, futures, valids, lag=2):
    """fra.blend.rollout_many with the starting duration passed through (only p25)."""
    obs = _G["obs0"]
    Hs = BL.H + lag
    chunk = max(1, 5600 // futures[0].shape[0])
    out = np.full((len(issues), BL.H), np.nan)
    for c0 in range(0, len(issues), chunk):
        idx = range(c0, min(len(issues), c0 + chunk))
        Ws, starts, ods, durs, ns = [], [], [], [], []
        for i in idx:
            start = issues[i] - (lag - 1) * HOUR
            W = D.assemble_paths(obs, start, np.asarray(futures[i], float), Hs, D.CHANNELS, valid=valids[i],
                                 obs_until=issues[i])
            Ws.append(W)
            ns.append(W.shape[0])
            starts += [start] * W.shape[0]
            ods.append(np.full(W.shape[0], od_now[i]))
            durs.append(np.full(W.shape[0], dur0[i]))
        W = np.concatenate(Ws)
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", RuntimeWarning)
            Wa = np.concatenate([np.repeat(np.nanmean(w, axis=0, keepdims=True), len(w), axis=0) for w in Ws])
        r = D.rollout_batch(model, np.concatenate(ods), starts, W, Hs, D.CHANNELS, dur0=np.concatenate(durs), W_ant=Wa)
        off = np.cumsum([0] + ns)
        for j, i in enumerate(idx):
            out[i] = r["p25"][off[j]:off[j + 1], lag:lag + BL.H].mean(axis=0)
    return out


def _init():
    obs = D.load_obs()
    lab = history_labels(gap_rule="confirmed")
    _G.update(lab=lab, rows=D.transitions(D.features(obs, lab)), obs0=D.load_obs(fill_gap_h=0),
              lib=B.load_library(), dur=D.hours_in_od(lab["od"]))


def _week(job):
    ws, issues = job
    known = _G["rows"][_G["rows"].index + D.FUT * HOUR <= ws]
    models = {k: D.DecisionModel(**s).fit(known) for k, s in SPECS.items()}
    keep, futs, valids = [], [], []
    for t in issues:
        try:
            P = B.sample_paths(t, n=BL.N_PATHS, lib=_G["lib"], seed=BL.SEED)
        except KeyError:
            P = None
        if P is None or not np.isfinite(P.u).all():
            continue
        keep.append(t)
        futs.append(np.stack([P.u, P.v, P.gust], -1))
        valids.append(P.valid)
    if not keep:
        return None
    src = pd.DatetimeIndex(keep) - 2 * HOUR
    od = _G["lab"]["od"].reindex(src).to_numpy()
    dur = np.clip(np.nan_to_num(_G["dur"].reindex(src).to_numpy(float), nan=D.DUR_CAP), 1, D.DUR_CAP)
    ok = np.isin(od, (25.0, 7.0))
    ki = [t for t, k in zip(keep, ok) if k]
    fu = [f for f, k in zip(futs, ok) if k]
    va = [v for v, k in zip(valids, ok) if k]
    df = pd.DataFrame({"issue": np.repeat(pd.DatetimeIndex(ki), BL.H), "lead": np.tile(np.arange(1, BL.H + 1), len(ki))})
    for k, m in models.items():
        t0 = time.time()
        df[f"p_{k}"] = rollout(m, ki, od[ok], dur[ok], fu, va).ravel()
    print(f"  week {ws.date()}: {len(ki)} issues", flush=True)
    return df


def run():
    z = R.table()
    wk = E.test_weeks(z["issue"], z["valid"], start=R.P1[0])   # P1 .. holdout start (incl. P2 and the long test)
    jobs = [(E.week_start(w, R.P1[0]), list(pd.DatetimeIndex(sorted(z.loc[wk == w, "issue"].unique()))))
            for w in sorted(np.unique(wk[wk >= 0]))]
    t0 = time.time()
    _init()
    with ProcessPoolExecutor(4) as ex:
        parts = [p for p in ex.map(_week, jobs) if p is not None]
    out = pd.concat(parts, ignore_index=True)
    out.to_parquet(HERE / "decspec.parquet", index=False)
    print(f"decspec: {len(out)} rows in {time.time() - t0:.0f}s")


def score():
    dec = pd.read_parquet(HERE / "decspec.parquet")
    names = [c[2:] for c in dec.columns if c.startswith("p_")]
    rep = pd.read_parquet(HERE / "preds.parquet")[["issue", "lead", "valid", "od", "p_logit"]]
    lt = pd.read_parquet(ROOT / "experiments" / "integration" / "final_wf_long.parquet")[
        ["issue", "lead", "valid", "od", "p_logit"]]
    base = pd.concat([rep, lt], ignore_index=True).merge(dec, on=["issue", "lead"])
    base = base[base.od.isin([25, 7])]
    y = (base.od == 25).astype(float)
    preds = {k: 0.5 * base.p_logit + 0.5 * base[f"p_{k}"] for k in names}
    iss, v = pd.DatetimeIndex(base.issue), pd.DatetimeIndex(base.valid)
    masks = {"P1": (iss >= R.P1[0]) & (iss < R.P1[1]) & (v < R.P1[1]),
             "P2": (iss >= R.P2[0]) & (iss < R.P2[1]) & (v < R.P2[1]),
             "long": (iss >= LONG[0]) & (iss < LONG[1]) & (v < LONG[1])}
    pairs = [(k, "D0") for k in names if k != "D0"]
    out, tabs = {}, []
    for per, mk in masks.items():
        bt = E.bootstrap(y, preds, base.valid, base.lead, pairs=pairs, mask=np.asarray(mk), seed=SEED)
        tabs.append(bt.assign(period=per))
        r = bt[(bt.metric == "brier") & (bt.lead == E.POOLED)].set_index("method")
        out[per] = {k: [round(float(r.loc[k, c]), 5) for c in ("est", "lo", "hi")] for k in r.index}
        acc = bt[(bt.metric == "acc") & bt.lead.isin(E.REPORT_LEADS) & bt.method.str.contains(" - ")]
        out[per]["acc_worse"] = {m: bool((g.hi < 0).any()) for m, g in acc.groupby("method")}
        print(f"\n{per} (days {int(r['n_days'].max()) if 'n_days' in r else ''}):")
        for k, val in out[per].items():
            if k != "acc_worse":
                print(f"   {k:20s} {val}")
    pd.concat(tabs).to_csv(HERE / "decspec_bootstrap.csv", index=False)
    cands = [k for k in names if k != "D0" and out["P1"][f"{k} - D0"][2] < 0]
    sel = min(cands, key=lambda k: out["P1"][k][0]) if cands else None
    conf = None
    if sel:
        conf = all(out[p][f"{sel} - D0"][0] < 0 and not out[p]["acc_worse"][f"{sel} - D0"] for p in ("P2", "long"))
    out["selected"], out["confirmed"] = sel, conf
    json.dump(out, open(HERE / "decspec_verdict.json", "w"), indent=1)
    print("\nSELECTED", sel, "CONFIRMED", conf)


if __name__ == "__main__":
    {"run": run, "score": score}[sys.argv[1]]()
