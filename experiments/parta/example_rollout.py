"""API example + smoke test: fit the decision model on data before an issue time and roll it out
(a) along the observed wind ('perfect forecast') and (b) along Part B's simulated paths (fra.fcerror), incl. RWY 18.
Publication-lag convention (fra.dataset.KNOWN_LAG_H = 2, as fra.blend): od_now = label of hour issue-2h, the rollout
starts at label hour issue-1h, wind hours <= issue are observed; lead L = step L+1.

    uv run python experiments/parta/example_rollout.py [ISSUE_UTC]
"""

import sys

import numpy as np
import pandas as pd

import common as C
from common import D

issue = pd.Timestamp(sys.argv[1] if len(sys.argv) > 1 else "2026-10-20 10:00", tz="UTC")
labels = pd.read_parquet(C.DATA / "labels.parquet")
model, r18, obs, F = D.fit_default(D.DEFAULT, labels=labels, before=issue)   # only rows known before the issue
od_now = D.od_now(labels, issue)   # label of hour issue-2h (<= 6 h stale fallback); ValueError if unknown
start, HS = issue - C.HOUR, C.H + 1  # first unpublished label hour; steps start .. issue+48
print(f"issue {issue}, od_now {od_now}, trained on {model.n_train} rows / {model.n_switch} switches")

perfect = D.rollout(model, od_now, D.obs_path(obs, start, HS), start, HS, rwy18=r18)
paths = None
try:
    from fra import fcerror as B
    P = B.sample_paths(issue, n=200)
    if P is not None:
        obs0 = D.load_obs(fill_gap_h=0)   # no gap interpolation across the issue time
        W = D.assemble_paths(obs0, start, np.stack([P.u, P.v, P.gust], -1), HS, valid=P.valid, obs_until=issue)
        paths = D.rollout(model, od_now, W, start, HS, rwy18=r18, anticipate="path")   # each path anticipates itself
        paths_mean = D.rollout(model, od_now, W, start, HS, rwy18=r18)                 # default: ensemble-mean look-ahead
except Exception as ex:  # Part B is optional here
    print("Part B paths unavailable:", str(ex)[:200])

out = pd.DataFrame({"hour": perfect["hours"], "lead": np.arange(HS) - 1, "flown": labels["od"].reindex(perfect["hours"]).values,
                    "p25_perfect": perfect["p25"], "p18open_perfect": perfect["p18_open"]})
if paths is not None:
    out["p25_partB"] = paths["p25"]
    out["p25_partB_antmean"] = paths_mean["p25"]
    out["p18open_partB"] = paths["p18_open"]
print(out.iloc[[0, 1, 2, 4, 7, 13, 19, 25, 31, 37, 43, 49]].round({c: 3 for c in out.columns if c != "hour"})
      .to_string(index=False))
print(f"P(change within 50 h): perfect {perfect['p_change']:.3f}"
      + (f", Part B {paths['p_change']:.3f}, Part B antmean {paths_mean['p_change']:.3f}" if paths else ""))
fc = perfect["first_change"]
print("most likely first-change lead (perfect):", int(np.argmax(fc)) - 1, f"(p={fc.max():.3f}; step - 1)")
assert np.isclose(fc.sum(), perfect["p_change"])

# duration-aware variant (state = OD x hours in OD) runs through the same API
md = D.DecisionModel(kind="logit", C=0.1, features=D.BASE + ["log_dur"]).fit(
    D.transitions(F)[lambda r: r.index + D.FUT * C.HOUR <= issue])
dur_now = D.hours_in_od(labels["od"]).get(issue - 2 * C.HOUR)
rd = D.rollout(md, od_now, D.obs_path(obs, start, HS), start, HS, dur_now=dur_now)
print("duration-aware perfect rollout p25 at leads 1/6/24/48:", np.round(rd["p25"][[2, 7, 25, 49]], 3))
