# Model card: FRA operating direction and RWY 18 forecast

**Task:** for every hour up to t+48 h, predict P(OD 25 west) vs OD 07 east and P(RWY 18 West usable for departures), with a certainty score and the next probable change time (FraAlliance case, AI Week 2026).

## Data (all public, cited)
| Data | Source | Use |
|---|---|---|
| Flown operating direction + RWY 18 use | Umwelthaus INAA / FANOMOS radar tracks, https://inaa.umwelthaus.org/ (`Fanomos/GetFlightTracks`) | Labels. Low-level tracks (< 3,000 ft, < 15 km): ~250° → OD 25, ~070° → OD 07, southbound west of the field → RWY 18 departure |
| Weather forecasts as issued | Open-Meteo Single Runs API, ECMWF IFS, https://open-meteo.com/en/docs/single-runs-api | Features: only runs initialised ≥ 6 h before the issue time |
| Published OD prognosis (8 h blocks, main + alternative scenario) | Umwelthaus INAA `Direction/GetDirectionData?currentTime=…`, as live at the issue time | Feature and extra baseline |
| Second weather model | Open-Meteo Previous Runs (best_match ≈ DWD ICON), vintage ≥ 1 day old | Feature (ensemble partner) |
| Second weather model, exact runs | Open-Meteo Single Runs, DWD ICON-D2 (3-hourly runs, init ≥ 4 h before issue) | ECMWF+ICON consensus tailwind |
| Wind at 100 m (ECMWF IFS) | Open-Meteo Single Runs, same run as above | Feature (winds aloft) |
| Observed weather | Iowa Environmental Mesonet METAR EDDF, https://mesonet.agron.iastate.edu/request/download.phtml | Current wind at issue time |
| Rules | FraAlliance case, section 3 | Baseline and engineered features (tailwind/crosswind components for 070/250/180) |

Labels: 11,564 labelled hours (2025-06-01 to 2026-10-30), OD 25 share 66%. Hourly in the test period, 3–6 sampled hours per day in training (the source serves ~0.4 requests/s).

## Model
For the operating direction: a regularised logistic regression (C = 0.03) with separate weights per lead bucket (1–3, 4–12, 13–30, 31–48 h). Inputs: the published INAA prognosis (main and alternative scenario, signed by its stated probability), the official rule applied to the ECMWF forecast, the current flown OD, the forecast tailwind on RWY 25 (10 m: hourly, 6 h mean, 3 h before/after; at 100 m; the ECMWF+ICON-D2 consensus, the lowest tailwind over the previous 6 h, 100 m–10 m shear, and a NE-Bise vs SE regime indicator), and the time of day incl. the night ban. Trained on the most recent 120 days only (recent regimes beat older history in walk-forward tests). Probabilities are sharpened per lead bucket by temperature scaling, fitted out of sample on the last 14 training days. Under walk-forward testing it beat larger feature sets and a LightGBM ensemble, because there are only a few weeks of history. RWY 18: one logistic model across all leads (C = 3; rule, current use, gust tailwind, 6 h mean tailwind, observed tailwind). "Next change" uses a hysteresis rule tuned walk-forward (`fra/changetime.py`): P(other OD) ≥ 0.5, then it stays ≥ 0.4 for 3 h. It comes with P(change within 48 h) and a likely window. "Certainty" is |P − 0.5| × 2.

## Quality (walk-forward weekly evaluation from 2026-09-15 (7 weeks); only data available at forecast time)
| Target | Lead | n | **Our model** | Baseline: official rules | Baseline: naive "no change" | Baseline: published INAA prognosis | ML Brier | ML on changed hours | Rules on changed hours (n) |
|---|---|---|---|---|---|---|---|---|---|
| Operating direction | +1 h | 1090 | **96.9%** | 92.9% | 96.3% | 95.1% | 0.022 | 35.0% | 62.5% (40) |
| Operating direction | +6 h | 1085 | **96.1%** | 89.7% | 88.8% | 93.7% | 0.030 | 79.3% | 54.5% (121) |
| Operating direction | +24 h | 1067 | **95.4%** | 90.4% | 72.5% | 92.0% | 0.035 | 88.4% | 78.8% (293) |
| Operating direction | +48 h | 1043 | **93.1%** | 89.0% | 67.0% | 89.8% | 0.046 | 91.0% | 85.5% (344) |
| RWY 18 open | +1 h | 769 | **99.9%** | 99.5% | 99.7% | – | 0.001 | 50.0% | 50.0% (2) |
| RWY 18 open | +6 h | 767 | **99.9%** | 99.6% | 99.9% | – | 0.001 | 0.0% | 0.0% (1) |
| RWY 18 open | +24 h | 752 | **99.9%** | 99.2% | 99.7% | – | 0.001 | 50.0% | 50.0% (2) |
| RWY 18 open | +48 h | 735 | **99.9%** | 98.2% | 99.9% | – | 0.002 | 0.0% | 0.0% (1) |

**RWY 18:** genuine closures are rare (wind closures on 3–4 days in 16 months, all OD 07 with wind 010–050° at 11–23 kt), so accuracy above is close to the 99 % "always open" base rate. Closure skill from an extended walk-forward (weekly folds from Sep 2025, trained strictly on the past, `experiments/rwy18/`): Brier skill vs climatology 0.55 at +1 h, 0.35 at +24 h; AUC 0.71. The model flags ~50 % of closure hours at a P(open) < 0.8 warning level (every wind-driven closure it could be scored on was flagged; the rest are non-wind closures), with 1.1 false alarms per 1,000 h. The official rule on the forecast catches about the same share but gives 20 false alarms per 1,000 h, because the airport applies the 15 kt limit to the steady wind, not gusts. Only ~4 scoreable wind-closure hours exist, so treat these numbers as indicative.

"Changed hours" are hours where the state at the valid time differs from the state at issue time. That is where planning matters, and where persistence scores 0 %.

## Next change time (walk-forward, issue times from 22 Sep 2026)
| Method | Change caught within ±3 h | Timing error on hits | False alarms | Correct 'no change' | Event accuracy |
|---|---|---|---|---|---|
| **Our model** | 72.6% | 1.1 h | 47 | 371 | **80.3%** |
| Baseline: official rules | 60.6% | 1.2 h | 170 | 248 | **60.0%** |
| Baseline: published INAA prognosis | 63.5% | 1.8 h | 72 | 346 | **72.7%** |
| Baseline: naive "no change" | 0.0% | – | 0 | 418 | **47.8%** |

875 issue times, 457 with an actual change within 48 h. P(change within 48 h): Brier 0.066 vs 0.250 for the base rate. The likely window covers 63.3% of actual changes (mean width 2.0 h).

## Key drivers (logistic contribution: |coefficient| × feature spread)
- **Operating direction:** tailwind on RWY 25 (forecast), ECMWF+ICON consensus tailwind on 25, consensus tailwind, 6 h mean, tailwind on 25, 3 h earlier, current flown OD, lowest tailwind on 25 in the 6 h before
- **RWY 18:** tailwind on RWY 18, 6 h mean, gust tailwind on RWY 18, official RWY 18 rule, observed tailwind on 18 (METAR), RWY 18 in use now

## Limitations
- RWY 18 "closed" is a proxy: no southbound departures in a busy hour (≥ 15 movements, from 06 local). The first hour after the night ban is excluded, because it is an arrival wave without departures (9 of the 10 test-period "closures" under the first label definition were this artefact). Not-used ≠ closed.
- About 30 % of the OD "changes" at +1 h are the first morning hour after the night ban (the evening OD is carried through the night), so switch detection at +1 h is harder in this metric than in reality.
- The case rules (10/15 kt) differ from Fraport's public policy (≈5 kt tailwind, west preference). The model learns the flown behaviour, which is a large part of its edge over the rule baseline.
- Evaluation is walk-forward: each test week (from 15 Sep 2026) is predicted by a model trained only on outcomes known before that week. The test period is short (autumn 2026), with few switch events and no confidence intervals (±~0.8 pp sampling noise per lead).
- About 24 % of OD test hours (night ban, < 4 movements) carry the last flown OD forward instead of being directly observed.
- Live forecasts use the latest Open-Meteo ECMWF run (the init time is approximated); training uses exact archived runs.
