"""Shared helpers for the 12-year history checks (experiments/history12).

Hour table: one row per FETCHED radar hour (both counts files, forward file wins; history label gaps from
fra.labels.history_gaps() flagged: OD gaps by fra.labels.GAP_RULE, RWY 18 gaps = every confirmed suspect hour), with
the flown OD of that hour (n >= 4 movements, as fra.labels.to_labels), the RWY 18 judgement (n >= 15, local hour
>= 6), and the observed METAR wind during the hour.

Wind during label hour h (= hour starting at h, UTC): mean (u, v) of the decision-model wind hours h and h+1
(fra.decision.load_obs: wind hour k = METAR/SPECI reports in (k-1h, k]), i.e. the reports at about h-0:10 and h+0:50.
Gust = max of the two. No gap interpolation.

The sampling design matters: the backfill (fra.history) fetches 3 hours per day first (hour starts 06, 12, 18 UTC =
window ends 07/13/19 UTC), the forward file has 6/day from 2025-06 and every hour from 2026-02-11. Year-to-year
comparisons therefore use the pass-1 hours only (`pass1`), which every year has.
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
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
OUT = Path(__file__).resolve().parent
DATA = ROOT / "data"
TZ = "Europe/Berlin"
HOLDOUT = pd.Timestamp("2026-11-01", tz="UTC")   # locked holdout: radar hours from here on are never read here
PASS1_START_HOURS = (6, 12, 18)        # hour starts (UTC) of the pass-1 samples (window ends 07/13/19 UTC)
MIN_MOVES, BUSY = 4, 15                # fra.labels.to_labels thresholds (OD label / RWY 18 judged)


def atomic_write(df_or_text, path, **kw):
    """Write a DataFrame (csv/parquet by suffix) or text atomically (tmp + os.replace)."""
    path = Path(path)
    tmp = path.with_name(path.name + ".tmp")
    if isinstance(df_or_text, pd.DataFrame):
        if path.suffix == ".parquet":
            df_or_text.to_parquet(tmp, **kw)
        else:
            df_or_text.to_csv(tmp, **kw)
    else:
        tmp.write_text(df_or_text)
    os.replace(tmp, path)


def write_json(obj, path):
    atomic_write(json.dumps(obj, indent=1, default=_json_default), path)


def _json_default(x):
    if isinstance(x, (np.integer,)):
        return int(x)
    if isinstance(x, (np.floating,)):
        return None if not np.isfinite(x) else float(x)
    if isinstance(x, (pd.Timestamp,)):
        return x.isoformat()
    if isinstance(x, np.ndarray):
        return x.tolist()
    return str(x)


# ---------------------------------------------------------------------------------------------- data

def suspects():
    """fra.history incomplete-response bookkeeping: DataFrame (hour start UTC, status, n1, source)."""
    p = DATA / "logs" / "history_suspect.json"
    try:
        s = json.loads(p.read_text())
    except (OSError, ValueError):
        s = {}
    rows = [{"time": pd.Timestamp(k) - pd.Timedelta(hours=1), "status": v.get("status"), "n1": v.get("n1"),
             "source": v.get("source")} for k, v in s.items()]
    return pd.DataFrame(rows, columns=["time", "status", "n1", "source"])


def hourly_wind():
    """Observed wind per LABEL hour (see module doc): u, v, gust, spd, tw25, tw18, xw25 [kt]."""
    from fra import decision as D
    obs = D.load_obs(fill_gap_h=0)[["u", "v", "gust"]].asfreq("h")
    nxt = obs.shift(-1)                         # wind hour h+1
    u = pd.concat([obs["u"], nxt["u"]], axis=1).mean(axis=1, skipna=False)
    v = pd.concat([obs["v"], nxt["v"]], axis=1).mean(axis=1, skipna=False)
    g = pd.concat([obs["gust"], nxt["gust"]], axis=1).max(axis=1, skipna=False)
    w = pd.DataFrame({"u": u, "v": v, "gust": g}, index=obs.index)
    w["spd"] = np.hypot(w["u"], w["v"])
    w["tw25"] = D.tailwind_uv(w["u"], w["v"], 250.0)
    w["tw18"] = D.tailwind_uv(w["u"], w["v"], 180.0)
    w["xw25"] = D.crosswind_uv(w["u"], w["v"], 250.0)
    return w


def hour_table(with_wind=True, gap_rule=None):
    """One row per fetched radar hour (index = hour start UTC). Columns: west, east, rwy18_deps, n, source
    ('history' | 'forward'), gap (OD label gap: fra.labels.history_gaps(gap_rule), default rule 'traffic'),
    gap18 (every confirmed suspect hour: never a RWY 18 judgement), confirmed (fra.history status), pass1,
    local_hour, year, month, od (25/7, NaN if n < 4 or gap), west_frac, judged18, closed18 (+ wind columns).
    Hours from the locked holdout start (HOLDOUT, 2026-11-01) on are left out."""
    from fra.labels import history_gaps, load_counts
    allc = load_counts(include_history=True, complete_only=False)
    allc = allc[allc.index < HOLDOUT]
    fwd = load_counts(include_history=False)
    t = allc.copy()
    t["n"] = t["west"] + t["east"]
    t["source"] = np.where(t.index.isin(fwd.index), "forward", "history")
    conf = history_gaps("confirmed")
    t["confirmed"] = t.index.isin(conf) & (t["source"] == "history")
    t["gap"] = t.index.isin(history_gaps(gap_rule)) & (t["source"] == "history")
    t["gap18"] = t["confirmed"]
    t["pass1"] = t.index.hour.isin(PASS1_START_HOURS)
    loc = t.index.tz_convert(TZ)
    t["local_hour"] = loc.hour
    t["year"], t["month"] = t.index.year, t.index.month
    ok = (t["n"] >= MIN_MOVES) & ~t["gap"]
    t["od"] = np.where(ok, np.where(t["west"] >= t["east"], 25.0, 7.0), np.nan)
    t["west_frac"] = np.where(ok, t["west"] / t["n"].where(t["n"] > 0), np.nan)
    t["judged18"] = (t["n"] >= BUSY) & (t["local_hour"] >= 6) & ~t["gap18"]
    t["closed18"] = np.where(t["judged18"], (t["rwy18_deps"] == 0).astype(float), np.nan)
    if with_wind:
        t = t.join(hourly_wind(), how="left")
    return t


# RWY 18 outage days (planned works, the COVID shutdown May - 15 Oct 2020): the rule lives in fra.decision since
# 2026-11-03 (also used by fra.decision.fit_default(history=True)); it now also flags days with >= 90 % of >= 8 judged
# hours closed, mostly in low tailwind (2017-05-25, the first day of the works it found on 2017-05-26).
from fra.decision import KNOWN_RWY18_OUTAGES, rwy18_outage_days  # noqa: E402,F401


def complete_day_index():
    """UTC days whose 19 daytime hours are all fetched (fra.labels.complete_days on both files)."""
    from fra.labels import complete_days, load_counts
    return complete_days(load_counts(include_history=True, complete_only=False))


# ---------------------------------------------------------------------------------------------- statistics

def logit_fit(X, y, w=None, ridge=1e-4, iters=50):
    """Weighted logistic regression by Newton/IRLS (tiny ridge on the slopes against separation).
    X: [n, k] WITHOUT intercept column. Returns beta [k+1] (intercept first)."""
    X = np.column_stack([np.ones(len(y)), np.asarray(X, float).reshape(len(y), -1)])
    y = np.asarray(y, float)
    w = np.ones(len(y)) if w is None else np.asarray(w, float)
    b = np.zeros(X.shape[1])
    R = np.eye(X.shape[1]) * ridge
    R[0, 0] = 0.0
    for _ in range(iters):
        eta = np.clip(X @ b, -30, 30)
        p = 1 / (1 + np.exp(-eta))
        g = X.T @ (w * (y - p)) - R @ b * w.sum()
        Hm = (X * (w * p * (1 - p))[:, None]).T @ X + R * w.sum()
        step = np.linalg.solve(Hm, g)
        b = b + step
        if np.max(np.abs(step)) < 1e-8:
            break
    return b


def logit_offset_fit(eta0, y, w=None, iters=100, max_step=2.0):
    """Intercept shift d of a logistic model with fixed linear predictor eta0: P = sigmoid(eta0 + d).
    Newton steps are clipped to +-max_step (an unclipped first step diverged for the 2020 RWY 18 year, where most
    closures are COVID non-use far from the pooled model)."""
    y = np.asarray(y, float)
    w = np.ones(len(y)) if w is None else np.asarray(w, float)
    d = 0.0
    for _ in range(iters):
        p = 1 / (1 + np.exp(-np.clip(eta0 + d, -30, 30)))
        g, h = np.sum(w * (y - p)), np.sum(w * p * (1 - p))
        if h <= 0:
            break
        step = float(np.clip(g / h, -max_step, max_step))
        d += step
        if abs(step) < 1e-9:
            break
    return d


def week_blocks(times):
    """Block id per row: 7-day blocks of the (UTC) time (weather regimes persist for days)."""
    t = pd.DatetimeIndex(times)
    k = np.asarray((t.normalize() - pd.Timestamp("2000-01-03", tz="UTC")) // pd.Timedelta(days=7), dtype=np.int64)
    _, codes = np.unique(k, return_inverse=True)
    return codes


def boot_row_weights(blocks, n_boot=400, seed=20261031):
    """(n_boot, n_rows) bootstrap multiplicities from resampling whole blocks with replacement."""
    from fra.evalkit import boot_weights
    nb = int(blocks.max()) + 1
    return boot_weights(nb, n_boot, seed)[:, blocks]


def ci(a, alpha=0.05):
    a = np.asarray(a, float)
    a = a[np.isfinite(a)]
    if not len(a):
        return (np.nan, np.nan)
    return tuple(np.percentile(a, [100 * alpha / 2, 100 * (1 - alpha / 2)]))


def fmt_pp(x, nd=1):
    return "–" if x is None or not np.isfinite(x) else f"{x:.{nd}f}"
