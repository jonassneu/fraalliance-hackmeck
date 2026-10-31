"""Operational / state / prognosis-structure candidate features (issue-time-safe). Used by run.py."""

import numpy as np
import pandas as pd

from fra.dataset import DATA

H = pd.Timedelta(hours=1)
WEST = {"1": 1.0, "2": 0.5, "3": 0.0}


def prog_hourly(p):
    """Expand the prognosis archive to one row per (asof, kind, hour): west value, prob, transition flag."""
    p = p[p["kind"].isin(["main", "alt"]) & p["state"].ne("0")].copy()
    k = np.repeat(np.arange(len(p)), 8)
    off = np.tile(np.arange(8), len(p))
    q = p.iloc[k].reset_index(drop=True)
    q["hour"] = q["start"] + pd.to_timedelta(off, unit="h")
    a = q["state"].str[0].map(WEST).astype(float)
    b = q["state"].str[-1].map(WEST).astype(float)
    q["west"] = a + (b - a) * (off / 8.0)
    q["trans"] = (q["state"].str.len() == 2).astype(float)
    q["tdir"] = np.sign(b - a) * q["trans"]  # +1 transition towards west, -1 towards east
    q = q.drop_duplicates(["asof", "kind", "hour"], keep="last")
    return q[["asof", "kind", "hour", "west", "prob", "trans", "tdir"]]


def lookup(q, kind, asof, when):
    """Prognosis value at hour `when` from the version issued at `asof` (NaN if not covered)."""
    m = q[q["kind"] == kind].set_index(["asof", "hour"])
    idx = pd.MultiIndex.from_arrays([asof, when])
    return m.reindex(idx).reset_index(drop=True)


def add_prog_structure(d, p=None):
    p = pd.read_parquet(DATA / "prognosis.parquet") if p is None else p
    q = prog_hourly(p)
    iss, val = pd.DatetimeIndex(d["issue"]), pd.DatetimeIndex(d["valid"])
    cur = lookup(q, "main", iss, val)
    d["prog_trans"] = cur["trans"].fillna(0).values
    d["prog_tdir"] = cur["tdir"].fillna(0).values
    s = (2 * d["prog_main_west"] - 1)
    d["prog_signed_trans"] = (d["prog_signed"] * d["prog_trans"]).values
    d["prog_signed_stable"] = (d["prog_signed"] * (1 - d["prog_trans"])).values
    # revision vs the version 6 h earlier (same valid hour)
    for lag in [3, 6]:
        old = lookup(q, "main", iss - pd.Timedelta(hours=lag), val)
        olds = ((2 * old["west"] - 1) * old["prob"]).values
        d[f"prog_rev{lag}"] = np.nan_to_num(d["prog_signed"].values - olds)
    # fill gap (valid before the first block of the current version) with the latest older version covering it
    fill = np.full(len(d), np.nan)
    for lag in range(1, 13):
        need = np.isnan(fill)
        if not need.any():
            break
        old = lookup(q, "main", iss - pd.Timedelta(hours=lag), val)
        v = ((2 * old["west"] - 1) * old["prob"]).values
        fill = np.where(need, v, fill)
    d["prog_signed_filled"] = np.where(d["prog_main_west"].isna(), np.nan_to_num(fill), d["prog_signed"])
    d["prog_gap"] = d["prog_main_west"].isna().astype(float).values
    # prognosis predicts a change vs the current flown state
    now = 2 * d["od_now25"] - 1
    pf = d["prog_signed_filled"]
    d["prog_disagree"] = ((np.sign(pf) != now) & (pf != 0)).astype(float) * np.sign(pf)
    d["prog_x_now"] = pf * now
    # hours from issue until the main prognosis' first predicted state different from the current OD
    hours_to_change = _hours_to_change(q, d)
    d["prog_h2chg"] = hours_to_change
    d["prog_chg_before_valid"] = (d["lead"] >= d["prog_h2chg"]).astype(float) * (-now)  # signed towards new state
    return d


def _hours_to_change(q, d):
    m = q[q["kind"] == "main"][["asof", "hour", "west"]]
    iss = d[["issue", "od_now25"]].drop_duplicates("issue")
    x = m.merge(iss, left_on="asof", right_on="issue")
    x = x[x["hour"] >= x["issue"]]
    flip = np.where(x["od_now25"] == 1, x["west"] < 0.5, x["west"] > 0.5)
    first = x[flip].groupby("issue")["hour"].min()
    h = ((first - first.index) / H).reindex(d["issue"]).values
    return np.nan_to_num(h, nan=99.0).clip(0, 99)


def add_history(d, lab):
    od = lab["od"].asfreq("h")
    iss = d["issue"].drop_duplicates()
    s = (od == 25).astype(float).where(od.notna())
    chg = s.diff().abs()
    out = pd.DataFrame(index=iss)
    known = iss - H  # last flown hour
    for w in [24, 72]:
        out[f"nsw{w}"] = chg.rolling(w, min_periods=1).sum().reindex(known).values
    last = s.index.to_series().where(chg > 0).ffill()
    out["h_since_sw"] = np.asarray((known - pd.DatetimeIndex(last.reindex(known))) / H)
    out["h_since_sw"] = np.log1p(out["h_since_sw"].fillna(500).clip(0, 500))
    out["od_3h_ago"] = (2 * s.shift(2).reindex(known).values - 1)
    out["od_24h_ago"] = (2 * s.shift(23).reindex(known).values - 1)  # same hour yesterday (valid-agnostic)
    out["west_share24"] = s.rolling(24, min_periods=1).mean().reindex(known).values - 0.5
    return d.join(out, on="issue")


def add_metar(d, metar_hourly):
    m = metar_hourly["tw25"].ffill(limit=3)
    iss = d["issue"].drop_duplicates()
    out = pd.DataFrame(index=iss)
    out["obs_tw25_f"] = m.reindex(iss).values
    out["obs_tw25_max3"] = m.rolling(3, min_periods=1).max().reindex(iss).values
    out["obs_tw25_min3"] = m.rolling(3, min_periods=1).min().reindex(iss).values
    out["obs_tw25_trend3"] = (m - m.shift(3)).reindex(iss).values
    d = d.join(out, on="issue")
    # bias: observed tailwind at issue minus forecast for the next hour (lead-1 row of same issue)
    f1 = d.loc[d["lead"] == 1].set_index("issue")["tw25"]
    d["tw25_bias"] = (d["obs_tw25_f"] - d["issue"].map(f1)).fillna(0)
    d["tw25_bias_dec"] = d["tw25_bias"] * np.exp(-d["lead"] / 6)
    d["tw25_corr"] = d["tw25"] + d["tw25_bias_dec"]
    now = 2 * d["od_now25"] - 1
    # official rule on the latest METAR disagrees with current OD (signed: towards the rule's direction)
    rn = np.where(d["obs_tw25_f"] > 1, -1, np.where(d["obs_tw25_f"] < -1, 1, now))
    d["rule_now_disagree"] = (rn != now).astype(float) * rn
    d["obs_tw25_x_now"] = d["obs_tw25_f"].fillna(0) * now  # tailwind on the runway in use (+ = pressure to switch)
    return d


def add_calendar(d):
    v = pd.DatetimeIndex(d["valid"]).tz_convert("Europe/Berlin")
    d["weekend"] = (v.dayofweek >= 5).astype(float)
    d["dow_sin"] = np.sin(2 * np.pi * v.dayofweek / 7)
    d["dow_cos"] = np.cos(2 * np.pi * v.dayofweek / 7)
    return d


def add_lead_state(d):
    now = 2 * d["od_now25"] - 1
    for tau in [3, 12]:
        d[f"now_dec{tau}"] = now * np.exp(-d["lead"] / tau)
    d["lead_frac"] = d["lead"] / 48.0
    return d


def add_night_reset(d):
    """Labels carry the evening OD through the night ban (ffill). If the last known hour is a night hour and the
    valid hour is not, the OD is re-decided in the morning -> persistence is weak, prognosis/wind decide."""
    known = pd.DatetimeIndex(d["issue"] - H).tz_convert("Europe/Berlin").hour
    carry = np.isin(known, [23, 0, 1, 2, 3, 4]).astype(float)
    reset = carry * (1 - d["night"].values)
    now = 2 * d["od_now25"] - 1
    d["night_carry"] = carry
    d["reset"] = reset
    d["now_reset"] = now * reset
    d["prog_reset"] = d["prog_signed_filled"] * reset
    d["tw25_reset"] = d["tw25"].fillna(0) * reset
    d["now_noreset"] = now * (1 - reset)
    return d


def add_mix(d, lab):
    """Radar mix of the last flown hour: minority-direction share (0..1), signed towards the minority direction."""
    wf = lab["west_frac"].asfreq("h")
    known = d["issue"] - H
    w = wf.reindex(known).values
    now = (2 * d["od_now25"] - 1).values
    minority = 2 * np.minimum(w, 1 - w)
    d["mix_last"] = np.nan_to_num(minority * -now)
    w2 = wf.reindex(known - H).values
    d["mix_last2"] = np.nan_to_num(2 * np.minimum(w2, 1 - w2) * -now)
    d["mix_short"] = d["mix_last"] * (d["lead"] <= 3)
    d["wf_dir"] = np.nan_to_num(2 * w - 1)  # -1 all east .. +1 all west, 0 if unknown
    return d


def short(d, cols, max_lead=3):
    for c in cols:
        d[f"{c}_s"] = d[c].fillna(0) * (d["lead"] <= max_lead)
    return d


def add_mix_pending(d, lab):
    """Mixed last hour while the hour before had the same OD as now -> switch under way (towards the minority)."""
    wf = lab["west_frac"].asfreq("h")
    od = lab["od"].asfreq("h")
    known = d["issue"] - H
    w = wf.reindex(known).values
    same = (od.reindex(known - H).values == d["od_now"].values)
    now = (2 * d["od_now25"] - 1).values
    d["mix_pend"] = np.nan_to_num(2 * np.minimum(w, 1 - w) * -now * same)
    d["mix_done"] = np.nan_to_num((~same & ~np.isnan(od.reindex(known - H).values)) * now).astype(float)
    d["mix_pend_s"] = d["mix_pend"] * (d["lead"] <= 3)
    return d
