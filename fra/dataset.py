"""Builds (issue time, lead) training rows using only data available at issue time."""

from pathlib import Path

import numpy as np
import pandas as pd

from fra.rules import add_components, rule_od, rule_rwy18_open, tailwind

DATA = Path(__file__).resolve().parent.parent / "data"
LEADS = [1, 2, 3, 6, 9, 12, 18, 24, 30, 36, 42, 48]


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


def add_state(d, labels, metar):
    """Observed state at issue time + labels at valid time + calendar features."""
    obs = metar[["tw25", "tw18", "wind_speed", "wind_gusts"]].add_prefix("obs_")
    obs["od_rule_now"] = rule_od(metar["tw25"].ffill(limit=3).values)  # rules on observed wind, always available
    d = d.join(obs, on="issue")
    # label index = hour START; at issue time t only the hour [t-1h, t) has been flown
    known = d["issue"] - pd.Timedelta(hours=1)
    d["od_now"] = labels["od"].reindex(known).values
    d["rwy18_now"] = labels["rwy18_open"].reindex(known).astype(float).values
    if "west_frac" in labels:  # last flown hour: fraction westbound minus 0.5 (0 if unknown)
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


def add_icon(d, issues, leads, live=False):
    """DWD ICON-D2 single runs (fra.singleruns_icon) -> ECMWF+ICON consensus tailwind; falls back to ECMWF alone."""
    from fra import singleruns_icon as icon
    try:
        ic = icon.live_features_icon(issues[0], list(leads)) if live else icon.asof_features_icon(issues, list(leads))
        d = d.merge(ic[["issue", "lead", "icon_tw25", "icon_tw25_roll6"]], on=["issue", "lead"], how="left")
    except Exception as ex:  # archive missing / API down: consensus = ECMWF only
        print("ICON features unavailable:", str(ex)[:120])
        d["icon_tw25"] = d["icon_tw25_roll6"] = np.nan
    d["tw25_cons"] = d[["tw25", "icon_tw25"]].mean(axis=1)
    d["tw25_cons_roll6"] = d[["tw25_roll6", "icon_tw25_roll6"]].mean(axis=1)
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
    with np.errstate(all="ignore"):
        # lowest forecast tailwind on 25 over the 6 h before the valid time: did an east spell just end?
        d["tw25_pastmin6"] = np.nanmin(np.vstack([at("tw25", ri, -h) for h in range(0, 7)]), axis=0)
        # mean signed crosswind over the next 12 h, squashed, only active with an east component:
        # NE "Bise" (persistent) -> OD 07; SE (pre-frontal, veers to SW) -> often stays OD 25
        xw_fut12 = np.nanmean(np.vstack([at("xw25", ri, h) for h in range(0, 13)]), axis=0)
    tw = d["tw25_cons"].fillna(d["tw25"])
    d["xwf_east_tanh"] = np.tanh(xw_fut12 / 3) / (1 + np.exp(-tw / 2))
    d["shear_tw25"] = d["tw25_100m"] - d["tw25"]  # vertical shear of the tailwind component, 100 m minus 10 m
    return d


def build(fc, labels, metar, leads=LEADS):
    """One row per (issue time t, lead L): weather forecast valid at t+L + state observed at t.
    Uses exact ECMWF IFS runs (fra.singleruns, init <= t - 6 h) when the archive exists, else Previous Runs."""
    from fra import singleruns
    if singleruns.ARCHIVE.exists():
        issues = labels.index[labels["od"].notna()] + pd.Timedelta(hours=1)  # issue right after a flown hour
        d = singleruns.asof_features(pd.DatetimeIndex(issues), leads)
        d = add_prognosis(d, pd.DatetimeIndex(issues), leads)
        d = add_second_model(d, fc)
        d = add_icon(d, pd.DatetimeIndex(issues), leads)
        d = add_weather_extras(d, pd.read_parquet(singleruns.ARCHIVE))
        return add_state(d, labels, metar).dropna(subset=["od_now", "wind_speed"])
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
    out = add_state(pd.concat(rows, ignore_index=True), labels, metar)
    return out.dropna(subset=["od_now", "wind_speed"])  # per-target label NaNs handled in training
