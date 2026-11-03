# Model card: FRA operating direction and RWY 18 forecast

**Task:** for every hour up to t+48 h, predict P(OD 25 west) vs OD 07 east and P(RWY 18 West usable for departures), with a certainty score and the next probable change time (FraAlliance case, AI Week 2026). Built at the hackathon on 30 Oct 2026, improved since; issued live every hour since 31 Oct 2026.

## Data (all public, cited)
| Data | Source | Use |
|---|---|---|
| Flown operating direction + RWY 18 use | Umwelthaus INAA / FANOMOS radar tracks, https://inaa.umwelthaus.org/ (`Fanomos/GetFlightTracks`) | Labels and the current direction. Low-level tracks (< 3,000 ft, < 15 km): ~250° → OD 25, ~070° → OD 07, southbound west of the field → RWY 18 departure |
| Weather forecasts as issued | Open-Meteo Single Runs API, ECMWF IFS (10 m and 100 m wind), https://open-meteo.com/en/docs/single-runs-api | Features: only runs initialised ≥ 6 h before the issue time |
| Second weather model, exact runs | Open-Meteo Single Runs, DWD ICON-D2 (init ≥ 4 h before issue), filled with ICON-EU (init ≥ 5 h before issue) where D2 has no value | ECMWF+ICON consensus tailwind |
| Published OD prognosis (8 h blocks, main + alternative scenario) | Umwelthaus INAA `Direction/GetDirectionData?currentTime=…`, as live at the issue time | Feature and extra baseline |
| Observed weather | Iowa Environmental Mesonet METAR EDDF, https://mesonet.agron.iastate.edu/request/download.phtml | Current wind; observed wind up to the issue time for the decision model; truth for the forecast-error model |
| Forecast errors | Archived ECMWF IFS runs (from Mar 2024) against METAR | Simulated wind futures |
| Rules | FraAlliance case, section 3 | Baseline and engineered features (tailwind/crosswind components for 070/250/180) |

Labels: 12,066 labelled hours (2025-06-01 to 2026-10-30), OD 25 share 65%. Hourly since 11 Feb 2026, 3–6 sampled hours per day before (the source serves ~0.4 requests/s); the direction model trains only on directly observed hours. A radar history back to 2014 is being collected and is not used yet.

## Model
**Official forecast: a 50/50 blend of two models.** (1) A regularised logistic regression (C = 0.03) with separate weights per lead bucket (1–3, 4–12, 13–30, 31–48 h), trained on all 48 leads of the most recent 120 days and sharpened per bucket by temperature scaling (fitted out of sample on the last 14 training days). Inputs: the published INAA prognosis (main and alternative scenario, signed by its stated probability), the official rule applied to the ECMWF forecast, the current flown OD, the forecast tailwind on RWY 25 (10 m: hourly, 6 h mean, 3 h before/after, lowest over the previous 6 h; at 100 m; 100 m–10 m shear; the ECMWF+ICON consensus and its 6 h mean), a NE-Bise vs SE regime indicator, and the time of day incl. the night ban. (2) An hourly decision model: one logistic model per direction in use gives P(keep the direction next hour) from the actual tailwind on the runway in use (now, the hours before and the next 6 h, gusts, crosswind), time of day, the first hour after the night ban, weekend and season. It is rolled out hour by hour along 200 simulated actual-wind futures: the as-issued ECMWF+ICON-D2 forecast plus whole 48 h forecast-error paths from similar past situations (`fra/fcerror.py`), with the look-ahead taken from the mean of the paths. Its P(OD 25) is the share of paths in OD 25.

**Current direction:** the flown OD of the last completely published radar hour [t−2 h, t−1 h), because FANOMOS publishes 55–75 min late; the decision model bridges the two unpublished hours with the observed METAR wind. **RWY 18:** one logistic model across all leads (C = 3; rule, current use, gust tailwind, 6 h mean tailwind, observed tailwind). **Next change:** the first hour where the blended P(other OD) reaches 0.45, with P(change within 48 h) and a likely window. **Certainty** = |P − 0.5| × 2. If the decision part fails, the hour is issued from the logistic model alone and flagged.

## Quality (walk-forward test 1 Jun 2026 – 30 Oct 2026, 152 days, 3,635 forecasts per lead time; only data available at forecast time)
Each test week is predicted by models trained only on outcomes known before that week. The design of the official forecast was chosen on these same weeks, so the numbers are optimistic (see Limitations); the independent test is the locked live holdout from 1 Nov 2026. Accuracy = share of hours where the forecast direction matched the direction flown; [95 % CI], day-block bootstrap.

| Lead | n | **Official forecast (blend)** | Logistic model alone | Published INAA prognosis | Official rules | Naive "no change" | Brier blend / logistic |
|---|---|---|---|---|---|---|---|
| +1 h | 3,635 | **96.8%** [95.8, 97.7] | 95.5% | 93.7% | 91.0% | 94.4% | 0.027 / 0.034 |
| +6 h | 3,630 | **94.9%** [93.3, 96.4] | 94.6% | 92.9% | 90.2% | 87.7% | 0.038 / 0.041 |
| +24 h | 3,612 | **94.7%** [93.1, 96.2] | 94.1% | 91.2% | 88.5% | 75.3% | 0.039 / 0.044 |
| +48 h | 3,588 | **93.0%** [91.1, 94.9] | 92.9% | 89.2% | 87.0% | 65.7% | 0.052 / 0.053 |

Brier score over leads 1/6/24/48 (lower is better): blend 0.0389 [0.0296, 0.0481], logistic model alone 0.0429 [0.0328, 0.0531], published prognosis 0.0823, official rules 0.1082. Paired difference blend − logistic -0.0041 [-0.0067, -0.0018]; over all 48 leads 0.0404 vs 0.0446. Paired accuracy difference blend − prognosis +3.0, +2.0, +3.5, +3.8 pp at 1/6/24/48 h (4 of 4 CIs exclude 0; vs the official rules 4 of 4).

Part before 15 Sep 2026 (106 days; the original hackathon settings were chosen from 15 Sep on, the blend on the whole test): blend 96.6 / 94.3 / 94.2 / 91.9 %, logistic model alone 94.9 / 94.0 / 93.5 / 92.5 %, published prognosis 93.1 / 92.6 / 90.8 / 88.7 % at 1/6/24/48 h; Brier blend 0.0424 vs logistic 0.0467.

Changed hours (the flown OD at the valid hour differs from the current OD the forecast started from; where planning matters and persistence scores 0 %): at 1 h (n = 205) blend 54.1%, logistic 55.1%, prognosis 53.7%, rules 58.5% (blend − logistic -1.0 pp [-4.8, +3.0]); at 6 h (n = 446) blend 68.8%, logistic 74.7%, prognosis 68.4%, rules 64.8% (blend − logistic -5.8 pp [-10.4, -2.2]).

**RWY 18 open** (logistic model; the blend uses it unchanged):

| Lead | n | **Logistic model** | Official rule | Naive "no change" | Brier |
|---|---|---|---|---|---|
| +1 h | 2572 | **99.9%** | 96.9% | 99.8% | 0.0010 |
| +6 h | 2570 | **99.9%** | 96.5% | 99.9% | 0.0010 |
| +24 h | 2555 | **99.9%** | 97.0% | 99.8% | 0.0011 |
| +48 h | 2538 | **99.9%** | 96.2% | 99.9% | 0.0013 |

Only a few closure hours fall in the test period, so the accuracy above is the "always open" base rate. Closure skill from an extended walk-forward (issues 29 Sep 2025 .. 30 Oct 2026, 34 closure hours on 9 days): Brier 0.0049 vs 0.0066 for climatology (difference -0.0016 [-0.0050, +0.0004], not significant) and 0.0306 for the official rule. At the warning level P(open) < 0.8, the model flags 44.1% of the closure hours at +1 h with 1.6 false alarms per 1,000 h (2.3 over all leads). A closure model on the simulated wind paths ranks closures better (AUC 0.84 vs 0.66) but has a worse Brier score, so the logistic model stays.

## Next change time (walk-forward, same test)
| Method | Change caught within ±3 h | Timing error on hits | False alarms | Correct 'no change' | Event accuracy |
|---|---|---|---|---|---|
| **Official forecast (blend)** | 64.7% | 1.2 h | 49 | 1574 | **80.0%** [75.0, 84.7] |
| Logistic model alone | 60.1% | 1.2 h | 43 | 1580 | **77.8%** |
| Baseline: published INAA prognosis | 49.7% | 1.5 h | 132 | 1491 | **69.7%** |
| Baseline: official rules | 56.9% | 1.5 h | 516 | 1107 | **62.3%** |
| Baseline: naive "no change" | 0.0% | – | 0 | 1623 | **47.5%** |

3,420 issue times (8 Jun 2026 .. 28 Oct 2026), 1,797 with an actual change within 48 h. The change rule's thresholds are re-chosen every week only from outcomes known before it (nested). The deployed thresholds, chosen on all weeks, score 81.3% in-sample. P(change within 48 h): Brier 0.069 (walk-forward) vs 0.249 for the base rate.

## Key drivers (logistic model: |coefficient| × feature spread)
- **Operating direction:** tailwind on RWY 25 (forecast), ECMWF+ICON consensus tailwind on 25, consensus tailwind, 6 h mean, published INAA prognosis, current flown OD, tailwind on RWY 25, 6 h mean
- **RWY 18:** tailwind on RWY 18, 6 h mean, gust tailwind on RWY 18, RWY 18 in use now, official RWY 18 rule, observed tailwind on 18 (METAR)

## Limitations
- **Selection noise.** The long test was also used to choose the design (the data layer, about 38 variants of the blend and its parts, 21 re-tests of the logistic model's settings), so it is optimistic: treat differences of 0.001–0.002 in Brier as noise and the blend's gain over the logistic model as an upper bound. The referee is the locked holdout: hourly forecasts issued live from 1 Nov 2026, compared as pre-registered (`experiments/integration/preregistration.json`); first verdict after 4 weeks (1 Dec 2026).
- **Current direction.** FANOMOS radar data arrive 55–75 min late, so the forecast starts from the hour [t−2 h, t−1 h); for the logistic model this costs about 0.7 pp accuracy at +1 h compared with a backtest that (unrealistically) knew the hour before the issue time. Short-notice switches stay hard: on changed hours at +1 h every method is right only 54–59 % of the time.
- RWY 18 "closed" is a proxy: no southbound departures in a busy hour (≥ 15 movements, from 06 local; the first hour after the night ban is excluded). Not-used ≠ closed, and closures are rare, so closure skill is uncertain.
- About 30 % of the OD "changes" at +1 h are the first morning hour after the night ban (the evening OD is carried through the night), so switch detection at +1 h is harder in this metric than in reality.
- The case rules (10/15 kt) differ from Fraport's public policy (≈5 kt tailwind, west preference). The model learns the flown behaviour, which is a large part of its edge over the rule baseline.
- The simulated wind futures are too wide for gusts and too cautious about tailwinds above 5 kt when that is likely (P 0.4–0.85).
- The test covers one summer and autumn (Jun–Oct 2026); winter regimes are only in the training data.
