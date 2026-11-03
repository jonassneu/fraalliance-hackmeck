"""Live 48 h forecast: P(OD 25) and P(RWY18 open) per hour + next probable change. Writes CSV + PNG."""

import pickle
import sys

import matplotlib
import numpy as np
import pandas as pd

from fra import dataset as DS
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
    m = weather.metar(start=(issue - pd.Timedelta(days=3)).strftime("%Y-%m-%d"), timeout=weather.LIVE_TIMEOUT)
    m = m[["drct", "sknt", "gust"]].rename(columns={"drct": "wind_direction", "sknt": "wind_speed", "gust": "wind_gusts"})
    m["wind_gusts"] = m["wind_gusts"].fillna(m["wind_speed"])
    m = add_components(m.dropna(subset=["wind_speed", "wind_direction"]))
    m = m[m.index <= issue]
    od = rule_od(m["tw25"].values)[-1]
    r18 = bool(rule_rwy18_open(m["tw18_gust"].values[-1:], m["xw18_gust"].values[-1:])[0])
    return m.iloc[-1], od, r18


def flown_state(issue, lookback_h=9, lag_h=None, detail=False):
    """Current flown state from the INAA radar hours (same source and rule as the training labels, fra.dataset):
    only hours that are (normally) completely published when the hourly job reads them are used, i.e. from the hour
    starting at fra.dataset.last_complete_hour(issue) = [t-2h, t-1h) backwards (complete in every measured hour at the
    job time :30, ~95-100 % at the old :12, see the fra.dataset.KNOWN_LAG_H note); the partly published hour
    [t-1h, t) never is.
      od_now:        OD of the newest of these hours with >= 4 movements, looking back `lookback_h` hours (the labels
                     carry the OD up to 8 h through the night ban / quiet hours); None if there is none.
      rwy18_now:     RWY 18 departures seen in exactly the last complete hour if it is busy (>= 15 movements, from
                     06 local), else NaN (training: rwy18_open label of that hour, NaN -> treated as open).
      west_frac_now: westbound share - 0.5 of exactly that hour (0 with < 4 movements), as in training.
    Returns (od_now, rwy18_now) or, with detail=True, a dict incl. the hour the OD was taken from."""
    lag = DS.KNOWN_LAG_H if lag_h is None else lag_h
    out = dict(lag_h=lag, last_complete_hour=None, od_now=None, rwy18_now=np.nan, west_frac_now=0.0,
               od_hour=None, hours_back=None)
    for k in range(lag - 1, lag - 1 + lookback_h):
        r = label_hour(issue - pd.Timedelta(hours=k))  # hour [issue-(k+1)h, issue-k h), index = hour start
        n = r["west"] + r["east"]  # NaN if the hour could not be fetched
        if k == lag - 1:
            out["last_complete_hour"] = r["time"]
            if n >= 4:
                out["west_frac_now"] = float(r["west"] / n - 0.5)
            if n >= 15 and r["time"].tz_convert("Europe/Berlin").hour >= 6:  # same RWY 18 rule as the labels
                out["rwy18_now"] = float(r["rwy18_deps"] > 0)
        if n >= 4:
            out.update(od_now=25 if r["west"] >= r["east"] else 7, od_hour=r["time"], hours_back=k + 1 - lag,
                       west=int(r["west"]), east=int(r["east"]), rwy18_deps=int(r["rwy18_deps"]))
            break
    return out if detail else (out["od_now"], out["rwy18_now"])


def live_ifs_runs(issue, timeout=(5, 30)):
    """The exact ECMWF IFS run the training archive rule picks for a CURRENT issue t (fra.singleruns.asof_features:
    newest init <= t - 6 h on the 6-hourly cycle; the run one cycle earlier if the newest is not served), surface
    and 100 m fields, from the Open-Meteo single-runs API. Training and live then use the same vintage (the stitched
    live forecast of singleruns.live_run() is newer than anything the model was trained on). Short timeouts."""
    import requests
    names = {**singleruns.NAMES, **singleruns.UPPER_NAMES}
    init = (issue - pd.Timedelta(hours=6)).floor("6h")
    params = dict(latitude=50.0333, longitude=8.5706, models="ecmwf_ifs", wind_speed_unit="kn", timezone="GMT",
                  hourly=",".join(names))
    errors = []
    for k in range(2):
        t = init - pd.Timedelta(hours=6 * k)
        try:
            r = requests.get(singleruns.SINGLE, params={**params, "run": t.strftime("%Y-%m-%dT%H:%M")}, timeout=timeout)
            r.raise_for_status()
            f = singleruns._frame(r.json(), t, names)
            f = f[f["lead_h"].between(0, 71)]
            # every hour the features need (valid t-6 h .. t+51 h: 6 h look-back, 48 leads, centred 6 h windows)
            ok, why = DS.run_complete(f, t, issue, (-6, 51), 71)
            if ok:
                DS.record_live_run("ecmwf_ifs", "logit", init, t, errors, issue)
                return f.reset_index(drop=True)
            errors.append(f"{t:%d %H}Z incomplete: {why}")
        except Exception as ex:
            errors.append(f"{t:%d %H}Z {type(ex).__name__}: {str(ex)[:80]}")
    DS.record_live_run("ecmwf_ifs", "logit", init, None, errors, issue)
    raise RuntimeError(f"ecmwf_ifs single runs unavailable: {errors}")


def forecast(issue=None, od_now=None, rwy18_now=None, hours=48):
    issue = pd.Timestamp(issue, tz="UTC") if issue else pd.Timestamp.now("UTC").floor("h")
    obs, od_obs, _ = current_state(issue)
    flown = flown_state(issue, detail=True)
    od_now = od_now or flown["od_now"] or od_obs  # METAR rule only if no complete radar hour has an OD
    # as in training: RWY 18 use of the last complete hour, NaN (-> open) if that hour is not busy
    rwy18_now = flown["rwy18_now"] if rwy18_now is None else float(rwy18_now)

    valid = pd.date_range(issue + pd.Timedelta(hours=1), periods=hours, freq="h")
    leads = list(range(1, hours + 1))
    past = issue < pd.Timestamp.now("UTC") - pd.Timedelta(hours=1)
    runs = None
    if singleruns.ARCHIVE.exists() and past:
        # past issue time (e.g. jury test day): use the archived run that was available then
        runs = pd.read_parquet(singleruns.ARCHIVE)
        d = singleruns.asof_features(pd.DatetimeIndex([issue]), leads).set_index("valid").reindex(valid)
    elif singleruns.ARCHIVE.exists():  # same model (ECMWF IFS) and run as training; one fetch for all ECMWF features
        try:
            runs = live_ifs_runs(issue)
        except Exception as ex:  # single-runs API down: the stitched live forecast rather than losing the hour
            print("exact IFS run unavailable, using the stitched live forecast:", str(ex)[:160])
            runs = singleruns.live_run()
            DS.LIVE_FETCHES.append(dict(model="ecmwf_ifs_stitched", user="logit", issue=str(issue), fallback=True,
                                        used_init=str(runs["init"].iloc[0]) if "init" in runs else None))
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
    d["od_now"], d["rwy18_now"], d["od_rule_now"] = od_now, rwy18_now, od_obs
    d["west_frac_now"] = flown["west_frac_now"]
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
        try:  # second NWP opinion (Open-Meteo best_match); if it is down the features are NaN, as for training rows
            f2 = forecast_features(weather.live_forecast(timeout=weather.LIVE_TIMEOUT), 0)  # without a second model
            f2 = f2.assign(tw25_m2=f2["tw25"], tw25_m2_roll6=f2["tw25"].rolling(6, center=True, min_periods=1).mean())
            d = d.merge(f2[["tw25_m2", "tw25_m2_roll6"]].rename_axis("valid").reset_index(), on="valid", how="left")
            DS.LIVE_FETCHES.append(dict(model="best_match", user="logit", issue=str(issue), fallback=False))
        except Exception as ex:
            print("second NWP (best_match) unavailable, features NaN:", str(ex)[:160])
            d["tw25_m2"], d["tw25_m2_roll6"] = np.nan, np.nan
            DS.LIVE_FETCHES.append(dict(model="best_match", user="logit", issue=str(issue), fallback=True,
                                        errors=[f"{type(ex).__name__}: {str(ex)[:80]}"]))
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
