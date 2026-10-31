"""The official decision rules (case section 3), checked against the worked examples printed in the case."""

import numpy as np
import pandas as pd
import pytest

from fra.rules import (
    RWY_07,
    RWY_18,
    RWY_25,
    add_components,
    crosswind,
    next_change,
    rule_od,
    rule_rwy18_open,
    tailwind,
)


# --- wind geometry --------------------------------------------------------------------------------------------

def test_case_example_runway18_closed_by_north_wind():
    # Case 3C: "330°/20 kt -> 17.3 kt tailwind -> Runway 18 closed"
    tw = tailwind(20, 330, RWY_18)
    assert tw == pytest.approx(17.3, abs=0.05)
    assert not rule_rwy18_open(tw)


def test_case_example_30_and_45_degrees_off_the_tail():
    # Case 3A, 20 kt wind: 30° off straight behind -> 17.3 kt (not permitted), 45° off -> 14.1 kt (permitted)
    tail_of_18 = 0.0  # wind FROM the north blows straight along a southbound departure
    assert tailwind(20, tail_of_18 + 30, RWY_18) == pytest.approx(17.3, abs=0.05)
    assert tailwind(20, tail_of_18 + 45, RWY_18) == pytest.approx(14.1, abs=0.05)
    assert not rule_rwy18_open(tailwind(20, 30, RWY_18))
    assert rule_rwy18_open(tailwind(20, 45, RWY_18))


def test_case_example_east_wind_forces_od07():
    # Case 3B: "090°/20 kt -> ~19 kt tailwind on 25 -> OD 07"
    tw25 = tailwind(20, 90, RWY_25)
    assert tw25 == pytest.approx(19, abs=0.5)
    assert rule_od([tw25], start_od=25)[0] == 7


def test_headwind_is_negative_tailwind():
    assert tailwind(20, 250, RWY_25) == pytest.approx(-20)
    assert tailwind(20, 70, RWY_07) == pytest.approx(-20)
    # the tailwind on 07 is the headwind on 25
    assert tailwind(12, 130, RWY_07) == pytest.approx(-tailwind(12, 130, RWY_25))


def test_crosswind_component():
    assert crosswind(30, 340, RWY_25) == pytest.approx(30 * np.sin(np.radians(90)))
    assert crosswind(30, 250, RWY_25) == pytest.approx(0, abs=1e-9)
    assert crosswind(30, 160, RWY_25) == pytest.approx(30)  # symmetric: always >= 0


def test_runway18_closes_on_crosswind_above_40kt():
    assert rule_rwy18_open(0.0, xw18_gust=40.0)
    assert not rule_rwy18_open(0.0, xw18_gust=41.0)


def test_add_components_treats_missing_gust_as_mean_wind():
    df = pd.DataFrame({"wind_speed": [20.0], "wind_direction": [330.0], "wind_gusts": [np.nan]})
    out = add_components(df)
    # a missing gust must not look like a closure: it falls back to the mean wind
    assert out.loc[0, "tw18_gust"] == pytest.approx(out.loc[0, "tw18"])
    assert out.loc[0, "tw18"] == pytest.approx(17.3, abs=0.05)


# --- operating direction with hysteresis ----------------------------------------------------------------------

def test_strong_tailwind_switches_immediately():
    assert list(rule_od([0, 10, 10], start_od=25, persist_steps=3)) == [25, 7, 7]


def test_small_tailwind_is_tolerated_until_it_persists():
    small = [3.0, 3.0, 3.0]
    assert list(rule_od(small, start_od=25, persist_steps=2)) == [25, 7, 7]
    assert list(rule_od(small, start_od=25, persist_steps=4)) == [25, 25, 25]


def test_headwind_resets_the_persistence_counter():
    assert list(rule_od([3, -2, 3, -2], start_od=25, persist_steps=2)) == [25, 25, 25, 25]


def test_od07_switches_back_on_westerly_tailwind():
    # in OD 07 a wind from the west is a tailwind for the landings -> back to OD 25
    assert list(rule_od([-12.0], start_od=7)) == [25]


def test_missing_forecast_keeps_the_current_direction():
    assert list(rule_od([np.nan, np.nan], start_od=7)) == [7, 7]


def test_next_change():
    times = pd.Series(pd.date_range("2026-10-30", periods=4, freq="h", tz="UTC"))
    assert next_change(times, np.array([25, 25, 7, 7])) == times.iloc[2]
    assert next_change(times, np.array([25, 25, 25, 25])) is None
