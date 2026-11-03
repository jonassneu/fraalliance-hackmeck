"""Builds (issue time, lead) training rows using only data available at issue time."""

import warnings
from pathlib import Path

import numpy as np
import pandas as pd

from fra.rules import add_components, rule_od, rule_rwy18_open, tailwind

DATA = Path(__file__).resolve().parent.parent / "data"
LEADS = list(range(1, 49))  # every lead 1..48 h (the hackathon trained on 1,2,3,6,9,12,18,24,30,36,42,48 only)
LEGACY_LEADS = [1, 2, 3, 6, 9, 12, 18, 24, 30, 36, 42, 48]

# What is known at issue time t. FANOMOS publishes the radar tracks in batches (~every 16 min) ~50-80 min late:
# measured 31 Oct 2026 (forward archive + experiments/eval_long/fanomos_lag.py), an hour holds ~25-35 % of its
# movements 12-17 min after its end, ~95 % after ~55-60 min, and the last movements arrived 67-71, 71-75 and 75-79 min
# after the end in the three hours polled to completion (the late ones are the last flights of the hour, i.e. the new
# direction in a switch hour). So at t the hour [t-1h, t) is only partly published. The hour [t-2h, t-1h) is ~95-100 %
# published 72 min after its end (the old job time :12; 2 of 3 measured hours still lacked 1-2 movements) and was
# complete in every measured hour 85 min after its end: the hourly job therefore runs at :30 local time since
# 31 Oct 2026 (ops/systemd/fra-archive.timer; 90 min after the end of [t-2h, t-1h)); do not move it earlier than ~:25.
# The current flown state (od_now, rwy18_now, west_frac_now) is taken from the label of the hour STARTING at
# t - KNOWN_LAG_H, in training (add_state) and live (fra.predict.flown_state) alike. LEGACY_LAG_H = 1 reproduces the
# hackathon behaviour (the complete hour [t-1h, t), which live operation never has).
KNOWN_LAG_H = 2
LEGACY_LAG_H = 1
# ECMWF + ICON consensus: where ICON-D2 has no value (leads beyond its 48 h horizon minus the 4 h publication
# buffer, archive gaps / outages, rows before its archive starts) it is filled with ICON-EU (fra.singleruns_iconeu,
# 00/06/12/18 UTC runs to +120 h, init <= t - ICONEU_BUFFER_H). False reproduces the D2-only consensus.
ICONEU_FILL = True
ICON_D2_BUFFER_H = 4      # D2 runs appear on Open-Meteo ~1.5 h after init (31 Oct 2026: 12 UTC run at 13:30)
ICONEU_BUFFER_H = 5       # ICON-EU 120 h runs appear ~3.7 h after init (31 Oct 2026: 12 UTC run at 15:42)


def last_complete_hour(issue, lag_h=None):
    """Start of the newest radar hour that is (normally) completely published when the hourly job reads it:
    t - KNOWN_LAG_H, i.e. the hour [t-2h, t-1h) (label index = hour start; see the KNOWN_LAG_H note). Works on a
    Timestamp, DatetimeIndex or Series of issue times."""
    lag = pd.Timedelta(hours=KNOWN_LAG_H if lag_h is None else lag_h)
    return issue - lag


def forecast_age(lead):
    """Which archived Previous-Runs vintage (days old) is surely published before issue time.
    d0 is a stitched latest run (can postdate the issue) -> never used for training."""
    return 1 if lead <= 18 else 2


def hourly_metar():
    m = pd.read_parquet(DATA / "metar.parquet")
    m = m[["drct", "sknt", "gust"]].rename(columns={"drct": "wind_direction", "sknt": "wind_speed", "gust": "wind_gusts"})
    m["wind_gusts"] = m["wind_gusts"].fillna(m["wind_speed"])
    m = add_components(m)
    m.index = m.index.ceil("h")
    return m[~m.index.duplicated(keep="last")].asfreq("h")


def load_labels():
    """Real labels if present (columns: od in {25,7}, rwy18_open bool, hourly UTC index), else METAR-rule pseudo-labels."""
    p = DATA / "labels.parquet"
    if p.exists():
        return pd.read_parquet(p), "real"
    m = hourly_metar().ffill(limit=3)
    lab = pd.DataFrame(index=m.index)
    lab["od"] = rule_od(m["tw25"].values)
    lab["rwy18_open"] = rule_rwy18_open(m["tw18_gust"].values, m["xw18_gust"].values)
    return lab, "pseudo (rules on observed METAR)"


def forecast_features(fc, age):
    s = fc[[c for c in fc.columns if c.endswith(f"_d{age}")]].copy()
    s.columns = [c.rsplit("_d", 1)[0].replace("_10m", "").replace("_2m", "") for c in s.columns]
    s = add_components(s)
    return s.drop(columns=["visibility"], errors="ignore")


def add_state(d, labels, metar, lag_h=None):
    """Observed state at issue time + labels at valid time + calendar features.
    The flown state comes from the last COMPLETE radar hour (last_complete_hour; lag_h=LEGACY_LAG_H: the old rule)."""
    obs = metar[["tw25", "tw18", "wind_speed", "wind_gusts"]].add_prefix("obs_")
    obs["od_rule_now"] = rule_od(metar["tw25"].ffill(limit=3).values)  # rules on observed wind, always available
    d = d.join(obs, on="issue")
    # label index = hour START; od is already carried through the night ban / quiet hours by fra.labels.to_labels
    # (up to 8 h), exactly like the live lookback in fra.predict.flown_state; rwy18_open / west_frac are not carried
    known = last_complete_hour(d["issue"], lag_h)
    d["known_lag_h"] = KNOWN_LAG_H if lag_h is None else lag_h  # the walk-forward fold rule follows it (fra.evalkit)
    d["od_now"] = labels["od"].reindex(known).values
    d["rwy18_now"] = labels["rwy18_open"].reindex(known).astype(float).values
    if "west_frac" in labels:  # last complete hour: fraction westbound minus 0.5 (0 if unknown)
        d["west_frac_now"] = (labels["west_frac"].reindex(known).values - 0.5)
        d["west_frac_now"] = d["west_frac_now"].fillna(0)
    d["od"] = labels["od"].reindex(d["valid"]).values
    d["rwy18_open"] = labels["rwy18_open"].reindex(d["valid"]).values
    d["hour"] = d["valid"].dt.hour
    d["doy_sin"] = np.sin(2 * np.pi * d["valid"].dt.day_of_year / 365.25)
    d["doy_cos"] = np.cos(2 * np.pi * d["valid"].dt.day_of_year / 365.25)
    return add_hour_features(d)


def add_hour_features(d):
    """Time of day at the valid time, incl. the night ban (23-05 Frankfurt local)."""
    v = pd.DatetimeIndex(d["valid"])
    d["hour_sin"] = np.sin(2 * np.pi * v.hour / 24)
    d["hour_cos"] = np.cos(2 * np.pi * v.hour / 24)
    d["night"] = v.tz_convert("Europe/Berlin").hour.isin([23, 0, 1, 2, 3, 4]).astype(float)
    return d


def add_prognosis(d, issues, leads):
    """Official INAA OD prognosis live at issue time (fra.prognosis), if the archive exists."""
    from fra import prognosis
    if not prognosis.ARCHIVE.exists():
        d["prog_signed"] = d["prog_alt_signed"] = 0.0
        d["prog_main_west"] = np.nan
        return d
    p = prognosis.features(issues, leads)[["issue", "lead", "prog_signed", "prog_alt_signed", "prog_main_west"]]
    return d.merge(p, on=["issue", "lead"], how="left")


def add_second_model(d, fc):
    """Second NWP opinion: Open-Meteo Previous Runs (best_match ~ DWD ICON for Germany), conservative vintage."""
    parts = []
    for lead in d["lead"].unique():
        f = forecast_features(fc, forecast_age(lead))[["tw25", "tw18"]]
        f = f.assign(tw25_m2_roll6=f["tw25"].rolling(6, center=True, min_periods=1).mean()).rename(
            columns={"tw25": "tw25_m2", "tw18": "tw18_m2"})
        if lead > 40:  # d2 vintage may be published after the issue time -> unusable
            f[:] = np.nan
        parts.append(f.assign(lead=lead).rename_axis("valid").reset_index())
    return d.merge(pd.concat(parts), on=["valid", "lead"], how="left")


# Live NWP runs used by this process (one record per request series, see record_live_run): which run the as-of rule
# wanted, which one was used and whether the fallback to the run one cycle earlier fired. fra.archive writes them into
# the issued .json (live_inputs) and clears the list before each forecast attempt.
LIVE_FETCHES = []


def record_live_run(model, user, wanted, used, errors, issue=None):
    LIVE_FETCHES.append(dict(model=model, user=user, issue=None if issue is None else str(issue),
                             wanted_init=None if wanted is None else pd.Timestamp(wanted).isoformat(),
                             used_init=None if used is None else pd.Timestamp(used).isoformat(),
                             fallback=used is None or (wanted is not None and pd.Timestamp(used) != pd.Timestamp(wanted)),
                             errors=list(errors)[:4]))


def run_complete(f, init, issue, need_h, max_lead, cols=("wind_speed", "wind_direction")):
    """A served single run covers every hour a forecast at `issue` needs: `cols` non-null for the valid times
    issue + need_h[0] .. issue + need_h[1] h that lie inside run leads 0..max_lead. Returns (ok, reason)."""
    init, issue = pd.Timestamp(init), pd.Timestamp(issue)
    lead = ((pd.to_datetime(f["valid"], utc=True) - init).dt.total_seconds() // 3600).astype(int)
    lo = max(0, int((issue - init).total_seconds() // 3600) + need_h[0])
    hi = min(int(max_lead), int((issue - init).total_seconds() // 3600) + need_h[1])
    need = (lead >= lo) & (lead <= hi)
    have = need & f[list(cols)].notna().all(axis=1)
    missing = sorted(set(range(lo, hi + 1)) - set(lead[have].tolist()))
    return (not missing), (f"run leads {missing[:3]}{'...' if len(missing) > 3 else ''} missing" if missing else "")


def _live_single_runs(mod, issue, buffer_h, cycle_h, timeout=(5, 20), need_h=(0, 51), max_lead=48, user=None):
    """Live issue: the exact single run the as-of archive rule picks (newest init on the archived cycles with
    init <= issue - buffer_h), from the Open-Meteo single-runs API, plus the run one cycle earlier if the newest one is
    not served or not complete (run_complete: wind for every needed hour issue + need_h inside run leads 0..max_lead).
    Short timeouts, no long retry loop: the hourly job must not stall on it. Every call is recorded in LIVE_FETCHES
    (wanted / used run, fallback)."""
    import requests
    from fra.singleruns import SINGLE
    init = (issue - pd.Timedelta(hours=buffer_h)).floor(f"{cycle_h}h")
    params = dict(latitude=50.0333, longitude=8.5706, models=mod.MODEL, wind_speed_unit="kn", timezone="GMT",
                  hourly=",".join(mod.NAMES))
    errors = []
    for k in range(2):
        t = init - pd.Timedelta(hours=k * cycle_h)
        try:
            r = requests.get(SINGLE, params={**params, "run": t.strftime("%Y-%m-%dT%H:%M")}, timeout=timeout)
            r.raise_for_status()
            f = mod._frame(r.json(), t)
            ok, why = run_complete(f, t, issue, need_h, max_lead)
            if ok:
                record_live_run(mod.MODEL, user, init, t, errors, issue)
                return f
            errors.append(f"{t:%d %H}Z incomplete: {why}")
        except Exception as ex:
            errors.append(f"{t:%d %H}Z {type(ex).__name__}: {str(ex)[:80]}")
    record_live_run(mod.MODEL, user, init, None, errors, issue)
    raise RuntimeError(f"{mod.MODEL} single runs unavailable: {errors}")


def _icon_d2(issues, leads, live):
    from fra import singleruns_icon as icon
    if live:
        issue = pd.Timestamp(issues[0])
        return icon._features(_live_single_runs(icon, issue, ICON_D2_BUFFER_H, 3, max_lead=48, user="logit"),
                              [issue], list(leads),
                              ICON_D2_BUFFER_H)[icon.COLUMNS]
    return icon.asof_features_icon(issues, list(leads), buffer_h=ICON_D2_BUFFER_H)


def _icon_eu(issues, leads, live):
    from fra import singleruns_iconeu as eu
    if live:  # only the 00/06/12/18 UTC runs reach 48 h (and only those are archived): 6 h cycle
        issue = pd.Timestamp(issues[0])
        return eu._features(_live_single_runs(eu, issue, ICONEU_BUFFER_H, 6, max_lead=120, user="logit"),
                            [issue], list(leads),
                            ICONEU_BUFFER_H)[eu.COLUMNS]
    return eu.asof_features_iconeu(issues, list(leads), buffer_h=ICONEU_BUFFER_H)


def add_icon(d, issues, leads, live=False, iconeu=None):
    """ECMWF + ICON consensus tailwind on RWY 25 (tw25_cons, tw25_cons_roll6).
    ICON = DWD ICON-D2 single runs (fra.singleruns_icon, init <= t - 4 h); where D2 has no value it is filled with
    ICON-EU single runs (fra.singleruns_iconeu, init <= t - 5 h; iconeu=False / ICONEU_FILL=False: D2 only). Without
    any ICON value the consensus is ECMWF alone. Training reads the archives; live (one current issue time) requests
    exactly the runs the archive rule would pick (single-runs API), so live and training use the same vintages."""
    use_eu = ICONEU_FILL if iconeu is None else iconeu
    sources = [("icon", _icon_d2, ["icon_tw25", "icon_tw25_roll6"])]
    if use_eu:
        sources.append(("iconeu", _icon_eu, ["iconeu_tw25", "iconeu_tw25_roll6"]))
    for name, fn, cols in sources:
        try:
            ic = fn(issues, leads, live)
            d = d.merge(ic[["issue", "lead", *cols]], on=["issue", "lead"], how="left")
        except Exception as ex:  # archive missing / API down: this source is NaN
            print(f"{name} features unavailable:", str(ex)[:160])
            for c in cols:
                d[c] = np.nan
    icon_tw25, icon_roll6 = d["icon_tw25"], d["icon_tw25_roll6"]
    if use_eu:
        icon_tw25, icon_roll6 = icon_tw25.fillna(d["iconeu_tw25"]), icon_roll6.fillna(d["iconeu_tw25_roll6"])
    d["tw25_cons"] = pd.concat([d["tw25"], icon_tw25], axis=1).mean(axis=1)
    d["tw25_cons_roll6"] = pd.concat([d["tw25_roll6"], icon_roll6], axis=1).mean(axis=1)
    return d


def add_weather_extras(d, runs):
    """Extra ECMWF features from the SAME run as d.run_init (experiments/weather_features/;
    walk-forward Brier 0.0363 -> 0.0348, holdout Mar-Sep 2026 -0.0005, 24/35 weeks better).
    runs: init, valid, wind_speed, wind_direction (archive, or the live_run() frame used for the base features)."""
    r = runs.assign(tw25=tailwind(runs.wind_speed, runs.wind_direction, 250),
                    xw25=runs.wind_speed * np.sin(np.radians(runs.wind_direction - 250)))  # + = wind from north side
    r = r.drop_duplicates(["init", "valid"]).set_index(["init", "valid"]).sort_index()

    def at(col, init, hours):  # forecast of `col` by run `init` for valid + hours (NaN if not in the run)
        return r[col].reindex(pd.MultiIndex.from_arrays([init, d["valid"] + pd.Timedelta(hours=hours)])).to_numpy()

    ri = d["run_init"]
    with np.errstate(all="ignore"), warnings.catch_warnings():  # all-NaN windows (missing runs) stay NaN
        warnings.simplefilter("ignore", RuntimeWarning)
        # lowest forecast tailwind on 25 over the 6 h before the valid time: did an east spell just end?
        d["tw25_pastmin6"] = np.nanmin(np.vstack([at("tw25", ri, -h) for h in range(0, 7)]), axis=0)
        # mean signed crosswind over the next 12 h, squashed, only active with an east component:
        # NE "Bise" (persistent) -> OD 07; SE (pre-frontal, veers to SW) -> often stays OD 25
        xw_fut12 = np.nanmean(np.vstack([at("xw25", ri, h) for h in range(0, 13)]), axis=0)
    tw = d["tw25_cons"].fillna(d["tw25"])
    d["xwf_east_tanh"] = np.tanh(xw_fut12 / 3) / (1 + np.exp(-tw / 2))
    d["shear_tw25"] = d["tw25_100m"] - d["tw25"]  # vertical shear of the tailwind component, 100 m minus 10 m
    return d


def build(fc, labels, metar, leads=LEADS, lag_h=None, iconeu=None):
    """One row per (issue time t, lead L): weather forecast valid at t+L + state known at t.
    Uses exact ECMWF IFS runs (fra.singleruns, init <= t - 6 h) when the archive exists, else Previous Runs.
    Issue times: every hour t whose last complete radar hour (t - KNOWN_LAG_H) carries an OD label.
    lag_h / iconeu override KNOWN_LAG_H / ICONEU_FILL (LEGACY_LAG_H, False and LEGACY_LEADS = the hackathon table)."""
    from fra import singleruns
    lag = pd.Timedelta(hours=KNOWN_LAG_H if lag_h is None else lag_h)
    if singleruns.ARCHIVE.exists():
        issues = pd.DatetimeIndex(labels.index[labels["od"].notna()] + lag)
        d = singleruns.asof_features(issues, leads)
        d = add_prognosis(d, issues, leads)
        d = add_second_model(d, fc)
        d = add_icon(d, issues, leads, iconeu=iconeu)
        d = add_weather_extras(d, pd.read_parquet(singleruns.ARCHIVE))
        return add_state(d, labels, metar, lag_h).dropna(subset=["od_now", "wind_speed"])
    rows = []
    for lead in leads:
        f = forecast_features(fc, forecast_age(lead))
        # valid time v = t + L; trend features from the same run around v
        f["tw25_prev3"] = f["tw25"].shift(3)
        f["tw25_next3"] = f["tw25"].shift(-3)
        f["tw25_roll6"] = f["tw25"].rolling(6, center=True, min_periods=1).mean()
        f["tw18_roll6"] = f["tw18"].rolling(6, center=True, min_periods=1).mean()
        d = f.copy()
        d["valid"] = d.index
        d["issue"] = d.index - pd.Timedelta(hours=lead)
        d["lead"] = lead
        d["run_age_h"] = np.nan
        rows.append(d)
    out = add_state(pd.concat(rows, ignore_index=True), labels, metar, lag_h)
    return out.dropna(subset=["od_now", "wind_speed"])  # per-target label NaNs handled in training
