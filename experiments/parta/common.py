"""Shared data + helpers for the Part A experiments (decision model, fra/decision.py).

These first-round experiments use the hackathon data layer (od_now = label of hour t-1, rollout from label hour t;
prod_preds.parquet is a snapshot of that era). The publication-lag-consistent integration (od_now = label of hour
t-2, rollout from t-1 with the observed wind up to t) is fra.blend + experiments/integration; do not mix a refreshed
prod_table() (now lag 2) with these rollouts."""

import os

for _k in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(_k, "1")

import sys  # noqa: E402
from pathlib import Path  # noqa: E402

import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from fra import decision as D  # noqa: E402
from fra import evalkit  # noqa: E402

OUT = Path(__file__).resolve().parent
DATA = ROOT / "data"
H = 49                      # rollout steps: label hours t .. t+48 (step k == lead k)
START, END = evalkit.TEST_START, evalkit.HOLDOUT_START
LEADS = list(evalkit.REPORT_LEADS)
HOUR = pd.Timedelta(hours=1)


def atomic_parquet(df, path):
    tmp = Path(str(path) + ".tmp")
    df.to_parquet(tmp)
    os.replace(tmp, path)


HISTORY = os.environ.get("PARTA_HISTORY", "") not in ("", "0")


def load_labels(history=False):
    """data/labels.parquet, or (history=True) labels rebuilt from the forward counts + the 2014+ backfill
    (data/inaa_counts_history.csv) with the same fra.labels.to_labels rules."""
    if not history:
        return pd.read_parquet(DATA / "labels.parquet")
    from fra.labels import load_counts, to_labels
    return to_labels(load_counts(include_history=True))


def load(history=False):
    """labels, obs (actual wind), F (per-hour features + labels), rows (transition training rows)."""
    labels = load_labels(history)
    obs = D.load_obs()
    F = D.features(obs, labels)
    rows = D.transitions(F)
    return labels, obs, F, rows


def week_starts():
    return pd.date_range(START, END, freq="7D", inclusive="left")


def prod_table(refresh=False):
    """Production walk-forward predictions (fra.train via experiments.harness, evalkit folds from 2026-06-01) for
    every scored (issue, lead) row incl. labels and baselines. Cached in experiments/parta/prod_preds.parquet."""
    p = OUT / "prod_preds.parquet"
    if p.exists() and not refresh:
        return pd.read_parquet(p)
    from experiments import harness as Hn
    d = Hn.load()
    z, y, pr, ok = Hn.production_preds(d, "od25")
    t = z.loc[ok, ["issue", "lead", "valid", "od", "od_now", "rule_od25", "base_prognosis_od25", "od_now25"]].copy()
    t["p_prod"] = pr[ok]
    t = t.reset_index(drop=True)
    atomic_parquet(t, p)
    return t


def issue_table(prod, labels):
    """One row per issue time of the production test rows: od_now (flown OD of hour t-1) and hours in that OD."""
    iss = prod.groupby("issue", as_index=False)["od_now"].first()
    dur = D.hours_in_od(labels["od"]).clip(upper=D.DUR_CAP)
    iss["dur_now"] = dur.reindex(pd.DatetimeIndex(iss["issue"]) - HOUR).to_numpy()
    return iss


def obs_windows(obs, issues, channels=D.CHANNELS, Hs=H):
    """[M, PAST+H+FUT, C] observed wind paths for many issue times (perfect-forecast paths)."""
    A = obs[list(channels)].to_numpy()
    T = D.PAST + Hs + D.FUT
    i0 = obs.index.get_indexer(pd.DatetimeIndex(issues) - D.PAST * HOUR)
    assert (i0 >= 0).all(), "issue outside the observation index"
    pos = i0[:, None] + np.arange(T)[None, :]
    W = np.full((len(i0), T, len(channels)), np.nan)
    ok = pos < len(A)
    W[ok] = A[pos[ok]]
    return W


def ifs_windows(obs, issues, buffer_h=6, Hs=H):
    """Plug-in deterministic forecast paths: wind hours <= issue observed, later hours from the latest ECMWF IFS run
    with init <= issue - 6 h (fra.singleruns rule). gust = IFS gust if it exceeds the mean by >= 10 kt (METAR gust
    convention), else the mean speed."""
    r = pd.read_parquet(DATA / "ifs_runs.parquet")
    r = r.dropna(subset=["wind_speed", "wind_direction"]).drop_duplicates(["init", "valid"])
    u, v = D.uv(r["wind_speed"], r["wind_direction"])
    g = np.where(r["wind_gusts"].to_numpy() >= r["wind_speed"].to_numpy() + 10, r["wind_gusts"], r["wind_speed"])
    S = pd.DataFrame({"u": u, "v": v, "gust": g}, index=pd.MultiIndex.from_frame(r[["init", "valid"]]))
    inits = np.sort(r["init"].unique())
    issues = pd.DatetimeIndex(issues)
    k = np.searchsorted(inits, (issues - buffer_h * HOUR).to_numpy(), side="right") - 1
    init = pd.DatetimeIndex(inits[np.clip(k, 0, None)])
    W = obs_windows(obs, issues, D.CHANNELS, Hs)
    T = W.shape[1]
    off = np.arange(T) - D.PAST
    valid = (issues.as_unit("ns").asi8[:, None] + off[None, :] * 3_600_000_000_000).ravel()
    valid = pd.DatetimeIndex(valid.astype("datetime64[ns]")).tz_localize("UTC")
    ini = np.repeat(init.as_unit("ns"), T)
    F = S.reindex(pd.MultiIndex.from_arrays([pd.DatetimeIndex(ini).as_unit(S.index.levels[0].unit),
                                             valid.as_unit(S.index.levels[1].unit)])).to_numpy().reshape(len(issues), T, 3)
    fut = off > 0
    W[:, fut] = F[:, fut]
    return W, init


def onestep_metrics(df, thr=0.5, tol=1):
    """df: test transition rows with stay (0/1), p_stay; index = target hour. Log-loss, Brier, switch detection
    (predicted switch: P(switch) >= thr; matched to actual switches within +-tol hours)."""
    p = np.clip(df["p_stay"].to_numpy(), 1e-6, 1 - 1e-6)
    y = df["stay"].to_numpy()
    r = {"n": len(df), "n_switch": int((y == 0).sum()),
         "logloss": float(-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))),
         "brier": float(np.mean((p - y) ** 2))}
    t = df.index.as_unit("ns").asi8 // 3_600_000_000_000
    act = t[y == 0]
    pred = t[(1 - p) >= thr]
    near = lambda a, b: np.array([np.any(np.abs(b - x) <= tol) for x in a], bool) if len(a) else np.zeros(0, bool)
    r["n_pred"] = len(pred)
    r["precision"] = float(near(pred, act).mean()) if len(pred) else np.nan
    r["recall"] = float(near(act, pred).mean()) if len(act) else np.nan
    r["recall_exact"] = float(np.isin(act, pred).mean()) if len(act) else np.nan
    return r


def rollout_metrics(t, col):
    """Accuracy / Brier of P(OD 25) column `col` on prod-table rows t (lead in LEADS)."""
    y = (t["od"] == 25).astype(int).to_numpy()
    p = t[col].to_numpy()
    r = {}
    for L in LEADS:
        m = (t["lead"] == L).to_numpy()
        r[f"acc{L}"] = float(((p[m] > 0.5) == y[m]).mean())
        r[f"brier{L}"] = float(np.mean((p[m] - y[m]) ** 2))
        ch = m & (y != (t["od_now"] == 25).to_numpy())
        r[f"acc{L}_changed"] = float(((p[ch] > 0.5) == y[ch]).mean()) if ch.any() else np.nan
        r[f"n{L}"], r[f"n{L}_changed"] = int(m.sum()), int(ch.sum())
    m4 = t["lead"].isin(LEADS).to_numpy()
    r["brier_1_6_24_48"] = float(np.mean((p[m4] - y[m4]) ** 2))
    r["brier_all"] = float(np.mean((p - y) ** 2))
    return r
