"""Wind geometry and the official FraAlliance decision rules (the baseline to beat)."""

import numpy as np
import pandas as pd

RWY_25, RWY_07, RWY_18 = 250.0, 70.0, 180.0
LANDING_TW_LIMIT = 10.0   # kt, tailwind >= this on landing runways forces OD change
DEPARTURE_TW_LIMIT = 15.0  # kt, tailwind >= this closes RWY 18
CROSSWIND_LIMIT = 40.0     # kt incl. gusts closes a runway


def tailwind(speed, direction, heading):
    """Tailwind component (kt) for a runway heading; negative = headwind. `direction` = wind FROM."""
    return -np.asarray(speed) * np.cos(np.radians(np.asarray(direction) - heading))


def crosswind(speed, direction, heading):
    return np.abs(np.asarray(speed) * np.sin(np.radians(np.asarray(direction) - heading)))


def add_components(df, speed="wind_speed", direction="wind_direction", gust="wind_gusts", prefix=""):
    """Adds tailwind/crosswind columns for 25 and 18 (07 tailwind = -tw25)."""
    s, d = df[speed], df[direction]
    g = df[gust].fillna(s) if gust in df else s  # missing gust != closure
    df[f"{prefix}tw25"] = tailwind(s, d, RWY_25)
    df[f"{prefix}tw18"] = tailwind(s, d, RWY_18)
    df[f"{prefix}tw18_gust"] = tailwind(g, d, RWY_18)
    df[f"{prefix}xw25_gust"] = crosswind(g, d, RWY_25)
    df[f"{prefix}xw18_gust"] = crosswind(g, d, RWY_18)
    return df


def rule_od(tw25, start_od=25, small_tw=1.0, persist_steps=1):
    """Operating direction from a tailwind-on-25 series, with the official hysteresis.

    - tailwind >= 10 kt on the active direction -> switch immediately
    - small tailwind (> `small_tw`) tolerated; switch after it persists > `persist_steps` steps
      (hourly data: 1 step ~ the 30 min tolerance has been exceeded)
    """
    od, run, out = start_od, 0, []
    for t in np.asarray(tw25, dtype=float):
        if np.isnan(t):
            out.append(od)
            continue
        tw_active = t if od == 25 else -t
        if tw_active >= LANDING_TW_LIMIT:
            od, run = (7 if od == 25 else 25), 0
        elif tw_active > small_tw:
            run += 1
            if run >= persist_steps:
                od, run = (7 if od == 25 else 25), 0
        else:
            run = 0
        out.append(od)
    return np.array(out)


def rule_rwy18_open(tw18, xw18_gust=None):
    ok = np.asarray(tw18) < DEPARTURE_TW_LIMIT
    if xw18_gust is not None:
        ok &= np.asarray(xw18_gust) <= CROSSWIND_LIMIT
    return ok


def next_change(times: pd.Series, od: np.ndarray):
    """First time the predicted OD differs from the first value, or None."""
    idx = np.flatnonzero(od != od[0])
    return times.iloc[idx[0]] if len(idx) else None
