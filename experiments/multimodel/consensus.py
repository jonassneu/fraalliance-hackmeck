"""As-of multi-model wind for EDDF: every model's latest run available at the issue, and the PLAN.json consensus.

For an issue t (on the hour) and model m with publication buffer b_m: the run with the latest init <= t - b_m, used
only if t - init <= b_m + 12 h (a stale run after an archive gap counts as missing, as the ICON-D2 rule in
fra.fcerror). Values for valid t + L, L = -3 .. 48, from that run (NaN where the run has no such lead).

Members ('non-IFS'): ICON-D2 filled by ICON-EU (one member, as in production) + every model of fetch.MODELS.
Primary consensus C = 0.5 * IFS + 0.5 * mean(non-IFS members present), per (u, v); gust: same with the members
that have a gust (AIFS has none). IFS itself is taken from the existing layers (harness table / Part B library),
so only the non-IFS mean is built here.
"""
import sys
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from fra import fcerror as F  # noqa: E402
from experiments.multimodel.fetch import MODELS, path  # noqa: E402

LMIN, LMAX = -3, 50          # 49/50 only for the centred 6 h mean (valid-3 .. valid+2) at leads 47/48
NOFF = LMAX - LMIN + 1
STALE_EXTRA_H = 12


def _hours(t):
    """Hours since the epoch, independent of the datetime resolution (pandas 3 keeps s/us/ns as stored)."""
    t = pd.DatetimeIndex(t)
    t = t.tz_localize("UTC") if t.tz is None else t.tz_convert("UTC")
    return np.asarray((t - pd.Timestamp("1970-01-01", tz="UTC")) // pd.Timedelta(hours=1), dtype=np.int64)


def _cube(runs, max_lead):
    runs = runs[(runs["lead_h"] >= 0) & (runs["lead_h"] <= max_lead)]
    inits = pd.DatetimeIndex(np.sort(pd.to_datetime(runs["init"], utc=True).unique()))
    ii = inits.get_indexer(pd.to_datetime(runs["init"], utc=True))
    ll = runs["lead_h"].to_numpy().astype(int)
    u, v = F.uv_from_sd(runs["wind_speed"].to_numpy(float), runs["wind_direction"].to_numpy(float))
    cube = np.full((len(inits), max_lead + 1, 3), np.nan)
    cube[ii, ll, 0], cube[ii, ll, 1] = u, v
    cube[ii, ll, 2] = runs["wind_gusts"].to_numpy(float)
    return _hours(inits), cube


def asof(runs, issue_h, buffer_h, max_lead):
    """-> [n_issue, NOFF, 3] u, v, gust of the as-of run for leads LMIN..LMAX."""
    ih, cube = _cube(runs, max_lead)
    k = np.searchsorted(ih, issue_h - buffer_h, side="right") - 1
    ok = k >= 0
    off = issue_h - ih[np.clip(k, 0, None)]
    ok &= off <= buffer_h + STALE_EXTRA_H
    idx = off[:, None] + np.arange(LMIN, LMAX + 1)[None, :]
    inl = ok[:, None] & (idx >= 0) & (idx <= max_lead)
    out = cube[np.clip(k, 0, None)[:, None], np.clip(idx, 0, max_lead), :]
    return np.where(inl[..., None], out, np.nan)


def members(issue_h):
    """dict name -> [n_issue, NOFF, 3] for the non-IFS members (d2eu + added models)."""
    d2 = asof(F.load_icon_runs(), issue_h, 4, 48)
    eu = asof(pd.read_parquet(ROOT / "data" / "iconeu_runs.parquet"), issue_h, 5, 120)
    m = {"d2eu": np.where(np.isnan(d2[..., :1]), eu, d2)}
    for k, (_, _, buf, _) in MODELS.items():
        if path(k).exists():
            m[k] = asof(pd.read_parquet(path(k)), issue_h, buf, 54)
    return m


def nonifs_mean(mem, drop=()):
    keys = [k for k in mem if k not in drop]
    st = np.stack([mem[k] for k in keys])                      # [M, n, NOFF, 3]
    with np.errstate(invalid="ignore"), __import__("warnings").catch_warnings():
        __import__("warnings").simplefilter("ignore", RuntimeWarning)
        uv = np.nanmean(st[..., :2], axis=0)
        g = np.nanmean(st[..., 2:], axis=0)
    return np.concatenate([uv, g], -1)


def ifs_asof(issue_h):
    return asof(F.load_ifs_runs(), issue_h, F.IFS_BUFFER_H, 71)


def lead_slice(a, lo, hi):
    """Leads lo..hi (inclusive) of an [n, NOFF, ...] array."""
    return a[:, lo - LMIN:hi - LMIN + 1]
