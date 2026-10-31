# Weather features for the OD model (2026-10-30)

**Outcome:** set **C-live** was adopted in production (`fra/dataset.py`): the lowest forecast tailwind on 25 over the
previous 6 h (`tw25_pastmin6`), a NE "Bise" vs. SE easterly regime indicator (`xwf_east_tanh`) and the 100 m − 10 m
tailwind shear (`shear_tw25`). Raw crosswind and wind-direction features looked better on the test weeks but failed
the holdout, so they were rejected.

Production (harness): acc 1/6/24/48 = .9679/.9604/.9560/.9377, Brier(1/6/24/48) 0.0358, Brier(all) 0.0363.
Holdout = walk-forward from 2026-03-01 (`robust.py`, harness START monkeypatched; file untouched). The weeks before 2026-09-15 were NOT used to pick features. "wk +/-" = weeks better/worse out of 35.

| Set (added to PROD_OD) | acc 1/6/24/48 | Brier 1/6/24/48 | Brier all | holdout ΔBrier | wk +/- |
|---|---|---|---|---|---|
| **C-live** = pastmin6 + xwf_east_tanh + shear | .9688/.9641/.9588/.9396 | 0.0342 | 0.0348 (−0.0015) | −0.0005 | 24/11 |
| **C** = C-live + tw25_rev | .9688/.9659/.9597/.9396 | 0.0342 | 0.0346 (−0.0017) | −0.0004 | 24/11 |
| D = C + ec_icon_diff | .9688/.9650/.9606/.9396 | 0.0341 | 0.0345 (−0.0017) | −0.0004 | 24/11 |
| B = pastmin6 + xwf_east_tanh | .9688/.9641/.9578/.9396 | 0.0344 | 0.0350 (−0.0013) | −0.0005 | 25/10 |
| A = pastmin6 | .9697/.9622/.9569/.9396 | 0.0352 | 0.0359 (−0.0003) | −0.0005 | 22/13 |

Code: `impl.py` (`add_weather_extras(d, runs, with_rev=True)`), verified to reproduce the numbers above.
Single-feature/raw results: `results/res_round1.csv`, `results/res_round2.csv`, `results/res_round3.csv`, `results/res_final.csv`.
Run from the repository root: `uv run python -m experiments.weather_features.run round1` (rounds: see `SETS` in `run.py`).
