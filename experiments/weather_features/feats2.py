"""Round 2: crosswind/direction variants, ICON crosswind, observed crosswind at issue."""
import numpy as np
import pandas as pd

from experiments.harness import ROOT
from experiments.weather_features.feats import _ifs, _lookup
from fra.dataset import hourly_metar

DATA = ROOT / "data"


def xw(speed, direction, heading=250):
    """Signed crosswind on RWY 25: + = wind from the north side (dir 250..70 via 340), - = from the south."""
    return np.asarray(speed) * np.sin(np.radians(np.asarray(direction) - heading))


def add_round2(d):
    d = d.copy()
    r = _ifs()
    r["xw25s"] = xw(r.wind_speed, r.wind_direction)
    r["xw25s_100"] = xw(r.wind_speed_100m, r.wind_direction_100m)
    ri, v = d["run_init"], d["valid"]
    d["xw25_100m_signed"] = xw(d["wind_speed_100m"], d["wind_direction_100m"])
    win = np.vstack([_lookup(r, "xw25s", ri, v + pd.Timedelta(hours=h)) for h in range(-3, 3)])
    d["xw25_roll6"] = np.nanmean(win, axis=0)
    fut = np.vstack([_lookup(r, "xw25s", ri, v + pd.Timedelta(hours=h)) for h in range(0, 13)])
    d["xw25_fut12"] = np.nanmean(fut, axis=0)
    # ICON single runs (init <= issue - 4h), exact valid
    ic = pd.read_parquet(DATA / "icon_runs.parquet")
    ic["icon_xw25"] = xw(ic.wind_speed, ic.wind_direction)
    q = d[["issue", "valid"]].copy()
    q["cutoff"] = q["issue"] - pd.Timedelta(hours=4)
    q["_o"] = np.arange(len(q))
    av = pd.DataFrame({"icon_init": ic["init"].drop_duplicates().sort_values()})
    q = pd.merge_asof(q.sort_values("cutoff"), av, left_on="cutoff", right_on="icon_init", direction="backward")
    q = q.merge(ic[["init", "valid", "icon_xw25"]].rename(columns={"init": "icon_init"}), on=["icon_init", "valid"], how="left")
    d["icon_xw25"] = q.sort_values("_o")["icon_xw25"].to_numpy()
    d["xw25_cons"] = d[["xw25_signed", "icon_xw25"]].mean(axis=1)
    # observed signed crosswind at issue (last METAR)
    m = hourly_metar()
    m["obs_xw25"] = xw(m.wind_speed, m.wind_direction)
    d["obs_xw25"] = m["obs_xw25"].reindex(d["issue"]).to_numpy()
    d["obs_xw25_x_short"] = d["obs_xw25"] * (d["lead"] <= 6)
    # northerly component (v toward south positive), consensus with u/v
    d["north"] = d["wind_speed"] * np.cos(np.radians(d["wind_direction"]))  # + = wind FROM north
    d["xw25_pos"] = d["xw25_signed"].clip(lower=0)
    d["xw25_neg"] = d["xw25_signed"].clip(upper=0)
    d["xw_x_tw"] = d["xw25_signed"] * np.tanh(d["tw25"] / 3)
    d["xw_abs"] = d["xw25_signed"].abs()
    return d
