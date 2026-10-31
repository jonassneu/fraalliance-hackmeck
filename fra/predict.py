"""Live 48 h forecast: P(OD 25) and P(RWY18 open) per hour + next probable change. Writes CSV + PNG."""

import pickle
import sys

import matplotlib
import numpy as np
import pandas as pd

from fra.dataset import (DATA, add_hour_features, add_icon, add_second_model, add_weather_extras,
                         forecast_features)
from fra.changetime import next_change
from fra.labels import label_hour
from fra.rules import add_components, rule_od, rule_rwy18_open
from fra.train import add_rule_features, predict
from fra import prognosis, singleruns, weather

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402


def current_state(issue):
    m = weather.metar(start=(issue - pd.Timedelta(days=3)).strftime("%Y-%m-%d"))
    m = m[["drct", "sknt", "gust"]].rename(columns={"drct": "wind_direction", "sknt": "wind_speed", "gust": "wind_gusts"})
    m["wind_gusts"] = m["wind_gusts"].fillna(m["wind_speed"])
    m = add_components(m.dropna(subset=["wind_speed", "wind_direction"]))
    m = m[m.index <= issue]
    od = rule_od(m["tw25"].values)[-1]
    r18 = bool(rule_rwy18_open(m["tw18_gust"].values[-1:], m["xw18_gust"].values[-1:])[0])
    return m.iloc[-1], od, r18


def flown_state(issue, lookback_h=9):  # covers the night ban (labels ffill up to 8 h)
    """Current OD / RWY18 use from the latest INAA radar hours (same source as the training labels)."""
    for k in range(lookback_h):
        r = label_hour(issue - pd.Timedelta(hours=k))
        if r["west"] + r["east"] >= 4:
            local_h = (issue - pd.Timedelta(hours=k + 1)).tz_convert("Europe/Berlin").hour
            busy = r["west"] + r["east"] >= 15 and local_h >= 6  # same RWY 18 rule as the labels
            return (25 if r["west"] >= r["east"] else 7), (r["rwy18_deps"] > 0 if busy else None)
    return None, None


def forecast(issue=None, od_now=None, rwy18_now=None, hours=48):
    issue = pd.Timestamp(issue, tz="UTC") if issue else pd.Timestamp.now("UTC").floor("h")
    obs, od_obs, r18_obs = current_state(issue)
    od_flown, r18_flown = flown_state(issue)
    od_now = od_now or od_flown or od_obs
    rwy18_now = rwy18_now if rwy18_now is not None else r18_flown if r18_flown is not None else r18_obs

    valid = pd.date_range(issue + pd.Timedelta(hours=1), periods=hours, freq="h")
    leads = list(range(1, hours + 1))
    past = issue < pd.Timestamp.now("UTC") - pd.Timedelta(hours=1)
    runs = None
    if singleruns.ARCHIVE.exists() and past:
        # past issue time (e.g. jury test day): use the archived run that was available then
        runs = pd.read_parquet(singleruns.ARCHIVE)
        d = singleruns.asof_features(pd.DatetimeIndex([issue]), leads).set_index("valid").reindex(valid)
    elif singleruns.ARCHIVE.exists():  # same model (ECMWF IFS) as training; one fetch for all ECMWF features
        runs = singleruns.live_run()
        d = singleruns._features(runs, pd.DatetimeIndex([issue]), leads).set_index("valid").reindex(valid)
    else:
        f = forecast_features(weather.live_forecast(), 0)
        f["tw25_prev3"] = f["tw25"].shift(3)
        f["tw25_next3"] = f["tw25"].shift(-3)
        f["tw25_roll6"] = f["tw25"].rolling(6, center=True, min_periods=1).mean()
        f["tw18_roll6"] = f["tw18"].rolling(6, center=True, min_periods=1).mean()
        d = f.reindex(valid)
        d["run_age_h"] = np.nan
    d["lead"] = np.arange(1, hours + 1)
    for k in ["tw25", "tw18", "wind_speed", "wind_gusts"]:
        d[f"obs_{k}"] = obs[k]
    d["od_now"], d["rwy18_now"], d["od_rule_now"] = od_now, float(rwy18_now), od_obs
    d["hour"] = valid.hour
    d["doy_sin"] = np.sin(2 * np.pi * valid.day_of_year / 365.25)
    d["doy_cos"] = np.cos(2 * np.pi * valid.day_of_year / 365.25)

    d["issue"], d["valid"] = issue, valid
    d = d.reset_index(drop=True)
    pr = prognosis.live(issue, leads)  # currentTime=issue -> as-of, also for past issues
    d = d.merge(pr[["lead", "prog_signed", "prog_alt_signed", "prog_main_west"]], on="lead", how="left")
    d = add_hour_features(d)
    d = add_icon(d, pd.DatetimeIndex([issue]), leads, live=not past)
    if runs is not None:
        d = add_weather_extras(d, runs)
    if past:  # second NWP opinion from the archived vintage that existed then (never today's stitched series)
        d = add_second_model(d, pd.read_parquet(DATA / "forecasts.parquet"))
    else:
        f2 = forecast_features(weather.live_forecast(), 0)  # second NWP opinion (Open-Meteo best_match)
        f2 = f2.assign(tw25_m2=f2["tw25"], tw25_m2_roll6=f2["tw25"].rolling(6, center=True, min_periods=1).mean())
        d = d.merge(f2[["tw25_m2", "tw25_m2_roll6"]].rename_axis("valid").reset_index(), on="valid", how="left")
    d = add_rule_features(d)
    with open(DATA / "model.pkl", "rb") as f:
        models = pickle.load(f)
    p25 = predict(models["od25"], d, "od25")
    p18 = predict(models["rwy18"], d, "rwy18")
    out = pd.DataFrame({"valid_utc": valid, "lead_h": d["lead"].values,
                        "p_od25": p25.round(3), "p_rwy18_open": p18.round(3)})
    out["od_pred"] = np.where(out["p_od25"] >= 0.5, 25, 7)
    out["od_certainty"] = (np.abs(out["p_od25"] - 0.5) * 2).round(3)
    out["rwy18_pred_open"] = out["p_rwy18_open"] >= 0.5
    out["rule_baseline_od"] = rule_od(d["tw25"].values, start_od=od_now)
    # next probable change: hysteresis rule tuned walk-forward in fra/changetime.py (+ P(change in 48 h), window)
    change, info = next_change(out["valid_utc"], out["p_od25"].values, od_now)
    out["od_now"] = od_now
    out["next_change_utc"] = change
    out["p_change_48h"] = round(float(info.get("p_change_48h", np.nan)), 3)
    out["change_window_start"], out["change_window_end"] = info.get("window_start"), info.get("window_end")
    return out, issue, od_now, change


def plot(out, issue, od_now, change, path):
    fig, ax = plt.subplots(figsize=(11, 4))
    ax.plot(out["valid_utc"], out["p_od25"], label="P(OD 25 west)", color="#3b5bdb", lw=2)
    ax.plot(out["valid_utc"], out["p_rwy18_open"], label="P(RWY 18 open)", color="#e8590c", lw=2)
    ax.axhline(0.5, color="grey", ls=":", lw=1)
    if change is not None:
        ax.axvline(change, color="black", ls="--", lw=1, label=f"next change ~{change:%a %H:%M}Z")
    ax.set_ylim(-0.02, 1.02)
    ax.set_title(f"FRA 48 h forecast issued {issue:%Y-%m-%d %H:%M}Z (current OD {od_now})")
    ax.legend(loc="lower left")
    fig.autofmt_xdate()
    fig.tight_layout()
    fig.savefig(path, dpi=120)


if __name__ == "__main__":
    out, issue, od_now, change = forecast(*sys.argv[1:2])
    tag = f"{issue:%Y%m%dT%H}"
    out.to_csv(DATA / f"forecast_{tag}.csv", index=False)
    plot(out, issue, od_now, change, DATA / f"forecast_{tag}.png")
    print(f"issued {issue}, current OD {od_now}, next probable change: {change}")
    print(out.iloc[[0, 5, 11, 23, 35, 47]].to_string(index=False))
