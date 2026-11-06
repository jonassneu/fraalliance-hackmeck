"""Out-of-period replication of blend-v2 vs the logit alone (PLAN.json, registered before any score).

    uv run python experiments/replication/run.py logit      # weekly walk-forward of the production logit
    uv run python experiments/replication/run.py dec        # decision rollouts on Part B paths (dec_365, dec_all)
    uv run python experiments/replication/run.py score      # bootstrap tables + verdict
"""
import json
import os
import sys
import time
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

for k in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(k, "1")

import numpy as np
import pandas as pd

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT))
from experiments.logit25 import run as L25  # noqa: E402
from fra import blend as BL  # noqa: E402
from fra import decision as D  # noqa: E402
from fra import evalkit as E  # noqa: E402
from fra import fcerror as B  # noqa: E402
from fra import train as T  # noqa: E402
from fra.labels import history_labels  # noqa: E402

P1 = (pd.Timestamp("2024-08-12", tz="UTC"), pd.Timestamp("2025-11-01", tz="UTC"))
P2 = (pd.Timestamp("2025-11-01", tz="UTC"), pd.Timestamp("2026-06-01", tz="UTC"))
P1_SPLIT = pd.Timestamp("2025-04-01", tz="UTC")
END = P2[1]
HOUR = pd.Timedelta(hours=1)
SEED = 20261106
_G = {}


def table():
    cols = ["issue", "valid", "lead", "od", "od_now", "rule_od25", "base_prognosis_od25"]
    z = L25.load_table(list(dict.fromkeys(cols + sorted(set(T.LOGIT["od25"]) | {"od_now25", "night", "hour"}))))
    return z


def weeks(z):
    wk = E.test_weeks(z["issue"], z["valid"], start=P1[0])
    wk[((z["issue"] >= END) | (z["valid"] >= END)).to_numpy()] = -1
    return wk


# ------------------------------------------------------------------------------------------------ logit arm

def _logit_week(w):
    z, wk = _G["z"], _G["wk"]
    lag = T.table_lag(z)
    ws = E.week_start(w, P1[0])
    te = wk == w
    tr = (z["valid"] + pd.Timedelta(hours=lag) <= ws).to_numpy()
    m = T.fit(z[tr], "od25", window=120, temperature=True)
    return w, np.flatnonzero(te), T.predict(m, z[te], "od25")


def run_logit():
    L25._set_clean_labels()
    z = L25.load_table()
    wk = weeks(z)
    _G.update(z=z, wk=wk)
    p = np.full(len(z), np.nan)
    t0 = time.time()
    with ProcessPoolExecutor(4) as ex:
        for w, idx, pr in ex.map(_logit_week, sorted(np.unique(wk[wk >= 0]))):
            p[idx] = pr
            print(f"  logit week {w} ({E.week_start(w, P1[0]).date()}): {len(idx)} rows", flush=True)
    ok = wk >= 0
    out = z.loc[ok, ["issue", "lead", "valid"]].assign(p_logit=p[ok]).reset_index(drop=True)
    out.to_parquet(HERE / "logit.parquet", index=False)
    print(f"logit: {len(out)} rows in {time.time() - t0:.0f}s")


# --------------------------------------------------------------------------------------------- decision arm

def _dec_init():
    obs = D.load_obs()
    lab = history_labels(gap_rule="confirmed")
    _G.update(lab=lab, rows=D.transitions(D.features(obs, lab)), obs0=D.load_obs(fill_gap_h=0),
              lib=B.load_library())


def _dec_week(job):
    ws, issues = job
    lab, rows, lib = _G["lab"], _G["rows"], _G["lib"]
    known = rows[rows.index + D.FUT * HOUR <= ws]
    models = {"dec_365": D.DecisionModel(**D.DEFAULT).fit(known[known.index >= ws - pd.Timedelta(days=365)]),
              "dec_all": D.DecisionModel(**D.DEFAULT).fit(known)}
    keep, futs, valids = [], [], []
    for t in issues:
        try:
            P = B.sample_paths(t, n=BL.N_PATHS, lib=lib, seed=BL.SEED)
        except KeyError:
            P = None
        if P is None or not np.isfinite(P.u).all():
            continue
        keep.append(t)
        futs.append(np.stack([P.u, P.v, P.gust], -1))
        valids.append(P.valid)
    if not keep:
        return None
    od = lab["od"].reindex(pd.DatetimeIndex(keep) - 2 * HOUR).to_numpy()
    ok = np.isin(od, (25.0, 7.0))
    ki = [t for t, k in zip(keep, ok) if k]
    fu = [f for f, k in zip(futs, ok) if k]
    va = [v for v, k in zip(valids, ok) if k]
    df = pd.DataFrame({"issue": np.repeat(pd.DatetimeIndex(ki), BL.H), "lead": np.tile(np.arange(1, BL.H + 1), len(ki))})
    for name, m in models.items():
        df[f"p_{name}"] = BL.rollout_many(m, None, ki, od[ok], _G["obs0"], fu, va, 2)["p25"].ravel()
    print(f"  dec week {ws.date()}: {len(ki)} of {len(issues)} issues", flush=True)
    return df


def run_dec():
    z = table()
    wk = weeks(z)
    jobs = []
    for w in sorted(np.unique(wk[wk >= 0])):
        iss = pd.DatetimeIndex(sorted(z.loc[wk == w, "issue"].unique()))
        jobs.append((E.week_start(w, P1[0]), list(iss)))
    t0 = time.time()
    _dec_init()                                  # forked into the workers
    with ProcessPoolExecutor(4) as ex:
        parts = [p for p in ex.map(_dec_week, jobs) if p is not None]
    out = pd.concat(parts, ignore_index=True)
    out.to_parquet(HERE / "dec.parquet", index=False)
    print(f"decision: {len(out)} rows in {time.time() - t0:.0f}s")


# -------------------------------------------------------------------------------------------------- scoring

def score():
    z = table()
    z = z[weeks(z) >= 0]
    t = z[["issue", "lead", "valid", "od", "od_now", "rule_od25", "base_prognosis_od25"]].merge(
        pd.read_parquet(HERE / "logit.parquet")[["issue", "lead", "p_logit"]], on=["issue", "lead"]).merge(
        pd.read_parquet(HERE / "dec.parquet"), on=["issue", "lead"], how="left")
    t["p_blend"] = 0.5 * t.p_logit + 0.5 * t.p_dec_365
    t["p_blend_all"] = 0.5 * t.p_logit + 0.5 * t.p_dec_all
    t.to_parquet(HERE / "preds.parquet", index=False)
    y = (t.od == 25).astype(float).where(t.od.isin([25, 7]))
    preds = {"blend": t.p_blend, "logit": t.p_logit, "blend_all": t.p_blend_all, "dec_365": t.p_dec_365,
             "dec_all": t.p_dec_all, "prognosis": t.base_prognosis_od25.astype(float),
             "rule": t.rule_od25.astype(float)}
    pairs = [("blend", "logit"), ("blend_all", "logit"), ("blend_all", "blend"), ("logit", "prognosis"),
             ("blend", "prognosis")]
    v = pd.DatetimeIndex(t.valid)
    iss = pd.DatetimeIndex(t.issue)
    masks = {"P1": (iss >= P1[0]) & (iss < P1[1]) & (v < P1[1]),
             "P1a": (iss >= P1[0]) & (iss < P1_SPLIT), "P1b": (iss >= P1_SPLIT) & (iss < P1[1]) & (v < P1[1]),
             "P2": (iss >= P2[0]) & (iss < P2[1]) & (v < P2[1])}
    masks["P1+P2"] = masks["P1"] | masks["P2"]
    changed = (t.od != t.od_now).to_numpy()
    tabs = []
    for name, mk in masks.items():
        bt = E.bootstrap(y, preds, t.valid, t.lead, pairs=pairs, mask=np.asarray(mk), seed=SEED)
        tabs.append(bt.assign(period=name))
        btc = E.bootstrap(y, preds, t.valid, t.lead, pairs=pairs, mask=np.asarray(mk) & changed, seed=SEED)
        tabs.append(btc.assign(period=name + "_changed"))
    bt = pd.concat(tabs, ignore_index=True)
    bt.to_csv(HERE / "bootstrap.csv", index=False)

    def get(per, metric, lead, meth):
        r = bt[(bt.period == per) & (bt.metric == metric) & (bt.lead == lead) & (bt.method == meth)]
        return r.iloc[0] if len(r) else None

    prim = get("P1", "brier", E.POOLED, "blend - logit")
    a, b = get("P1a", "brier", E.POOLED, "blend - logit"), get("P1b", "brier", E.POOLED, "blend - logit")
    acc = bt[(bt.period == "P1") & (bt.metric == "acc") & bt.lead.isin(E.REPORT_LEADS) & (bt.method == "blend - logit")]
    verdict = dict(ci_below_0=bool(prim.hi < 0), halves_negative=bool(a.est < 0 and b.est < 0),
                   no_lead_worse=bool(not (acc.hi < 0).any()),
                   primary=[float(prim.est), float(prim.lo), float(prim.hi), float(prim.p_boot)],
                   halves=[float(a.est), float(b.est)], n_days=int(prim.n_days), n_rows=int(prim.n))
    verdict["replicates"] = verdict["ci_below_0"] and verdict["halves_negative"] and verdict["no_lead_worse"]
    json.dump(verdict, open(HERE / "verdict.json", "w"), indent=1)
    for per in ["P1", "P1a", "P1b", "P2", "P1+P2"]:
        s = bt[(bt.period == per) & (bt.lead == E.POOLED)]
        line = {r.method: f"{r.est:.4f}" + (f" [{r.lo:+.4f}, {r.hi:+.4f}]" if " - " in r.method else "")
                for r in s[s.metric == "brier"].itertuples()}
        print(f"\n{per} (n_days {int(s.n_days.max())}) Brier(1,6,24,48):")
        for k2, v2 in line.items():
            print(f"   {k2:22s} {v2}")
        accs = bt[(bt.period == per) & (bt.metric == "acc") & bt.lead.isin(E.REPORT_LEADS)]
        tab = accs[accs.method.isin(["blend", "logit", "prognosis", "rule"])].pivot_table(index="method", columns="lead",
                                                                                         values="est")
        print("   accuracy %:\n" + (100 * tab).round(1).to_string())
    print("\nVERDICT", json.dumps(verdict))


if __name__ == "__main__":
    {"logit": run_logit, "dec": run_dec, "score": score}[sys.argv[1]]()
