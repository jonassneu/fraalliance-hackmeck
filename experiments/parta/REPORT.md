# Part A: what the airport does, given the actual wind (`fra/decision.py`)

Hourly decision model for the operating direction, run along simulated wind paths from Part B (`fra/fcerror.py`). Weekly walk-forward test 2026-06-01 .. 2026-10-30.

## TL;DR
- **Perfect wind, best decision model (UPPER_100M):** 96.9/95.5/95.2/95.4 %, Brier 0.0318, vs production 96.3/94.3/94.1/92.2 %, 0.0428. Brier difference -0.0111 [-0.0175, -0.0049].
  - This is what one model class gains from perfect wind. It is neither an upper bound on what perfect wind can buy nor a measure of the airport's behaviour.
- **Oracle production** (production model, all weather-forecast inputs replaced by observations; the published prognosis kept): 96.2/95.0/94.3/94.4 %, Brier 0.0385.
  - vs production: -0.0043 [-0.0096, +0.0012]; +0.2 pp [-1.0, 1.3] at 24 h; +2.2 pp [0.8, 3.7] at 48 h; Brier at 48 h -0.0145 [-0.0233, -0.0061].
  - So with production's model, the wind-forecast error matters little up to 24 h and accounts for about 2.2 of the 7.8 pp error at 48 h.
- **Perfect-wind decision model vs oracle production:** -0.0068 [-0.0117, -0.0023]. The hour-by-hour rollout uses the actual wind better. The errors that remain sit in marginal tailwind on 25 (0–5 kt). They mix airport behaviour with what the models are missing.
- **Part B paths (current Part B):**
  - each path looks ahead at its own future: 0.0432 (level with production)
  - ensemble-mean look-ahead: 0.0407, 96.9/94.5/94.7/91.8 %
  - mean minus own-path: -0.0024 [-0.0037, -0.0011]
  - Recalibrating the own-path variant gives 0.0417, so much of the effect is calibration. The earlier 0.0480 and "22 % more crossings" figures came from an older Part B and are withdrawn.
- **Blend attribution:** about 70 % of the blend gain does not need Part B. 50/50 blends with production:
  - with the decision model on the single as-issued ECMWF forecast: 0.0400, -0.0029 [-0.0055, -0.0008]
  - with it on Part B's paths: 0.0386, -0.0042 [-0.0068, -0.0021], accuracy 97.0/94.8/94.9/92.6 %
  - what Part B's paths add: -0.0013 [-0.0025, -0.0002]
  - Walk-forward fitted weights per lead bucket: 0.0395 (Part B) and 0.0408 (ECMWF). Slightly worse than a fixed 50/50 (+0.0009 [-0.0000, +0.0018]) because the early weeks are unstable. Later weights settle at about 0.6–0.85 on the Part B rollout and about 0.2–0.35 on the ECMWF rollout.
- **100 m wind** helps (perfect, logistic): -0.0023 [-0.0045, -0.0002]; +1.2 pp [0.5, 1.9] at 24 h.

## Main table (accuracy % at 1/6/24/48 h, Brier(1,6,24,48))
| Method | 1 | 6 | 24 | 48 | Brier |
|---|---|---|---|---|---|
| Production | 96.3 | 94.3 | 94.1 | 92.2 | 0.0428 |
| Oracle production (observed weather inputs) | 96.2 | 95.0 | 94.3 | 94.4 | 0.0385 |
| Perfect wind, UPPER_100M | 96.9 | 95.5 | 95.2 | 95.4 | 0.0318 |
| Perfect wind, DEFAULT_100M | 96.9 | 94.9 | 95.1 | 95.1 | 0.0333 |
| Perfect wind, DEFAULT (10 m) | 96.9 | 94.8 | 93.9 | 94.0 | 0.0356 |
| DEFAULT on the as-issued ECMWF forecast | 96.6 | 93.6 | 92.9 | 91.9 | 0.0438 |
| Part B paths, own-future look-ahead | 96.9 | 94.7 | 94.8 | 91.6 | 0.0432 |
| Part B paths, ensemble-mean look-ahead | 96.9 | 94.5 | 94.7 | 91.8 | 0.0407 |
| 50/50 production + ECMWF rollout | 96.9 | 94.1 | 94.3 | 92.7 | 0.0400 |
| 50/50 production + Part B (mean) | 97.0 | 94.8 | 94.9 | 92.6 | 0.0386 |
| Walk-forward weighted production + Part B (mean) | 96.9 | 94.7 | 94.8 | 92.3 | 0.0395 |
| Prognosis / rules / persistence | 93.7/91.2/96.0 | 92.9/90.3/88.8 | 91.2/88.5/76.1 | 89.2/87.0/66.1 | 0.0823/0.1074/0.1820 |

**Part B paths (mean look-ahead) vs production, by lead:** Brier -0.0059 [-0.0102, -0.0020] at 1 h, -0.0045 [-0.0094, -0.0001] at 24 h, +0.0040 [-0.0039, +0.0119] at 48 h. vs the ECMWF rollout: -0.0031 [-0.0055, -0.0006].

**Rows with ERA5 100 m available** (ERA5 ends 2026-10-25): production 0.0424, oracle 0.0380, UPPER 0.0324. Same picture.

**Error rate at lead 24 by actual tailwind on 25** (production / oracle / UPPER / DEFAULT perfect):
- < -5 kt: 1.1/0.8/0.5/0.6 %
- -5 to -2: 2.5/2.5/2.4/2.4
- -2 to 0: 7.4/8.8/7.5/8.9
- 0 to 2: 12.9/12.9/10.2/8.1
- 2 to 5: 15.5/12.7/11.2/16.6
- > 5: 3.7/2.9/1.7/3.8

**Brier by month** (production / oracle / UPPER):
- Jun 0.058/0.049/0.041
- Jul 0.041/0.034/0.034
- Aug 0.043/0.040/0.023
- Sep 0.044/0.038/0.048
- Oct 0.028/0.031/0.013

**Next direction change** (±3 h; event accuracy / hit rate / false alarms / Brier of P(change within 48 h), base rate 0.249):
- UPPER perfect: 82.4 % / 72.0 % / 108 / 0.062
- DEFAULT perfect: 73.5 / 63.4 / 268 / 0.077
- ECMWF single forecast: 70.5 / 52.8 / 178 / 0.082
- Part B own-future: 70.7 / 62.0 / 341 / 0.098
- Part B mean: 73.5 / 61.5 / 230 / 0.087

**Recalibration** (`recal.py`, all weeks): own-future 0.0432 → 0.0417; mean look-ahead 0.0407 → 0.0420 (worse); ECMWF rollout 0.0438 → 0.0472 (worse).

## Part B path diagnostics vs observed wind (in the decision model's own convention)
- tailwind-on-25 crossings of +3 kt: 4.89 vs 4.47 per 48 h (+9 %)
- spread at 24 h 3.02 kt vs ensemble-mean RMSE 2.84 kt (+6 %); bias +0.17 kt
- hour-to-hour change RMS 3.18 vs 3.05 kt
- gust minus mean speed 1.83 vs 0.70 kt; share above 5 kt 11.9 vs 3.8 %
- Mapping Part B gusts to the METAR convention (same rule as the ECMWF rollout): 0.0432/0.0408 instead of 0.0432/0.0407, so no effect on Part A.

## Runway 18 (`rwy18_results.json`)
- 5,787 judged busy hours, 39 closed on 11 local days (36 under OD 07, 3 under OD 25). 18 closure hours had under 10 kt steady tailwind on 18 (17 under 8 kt).
- Only 2 closure hours (1.1 % of all judged hours) had a METAR gust raising the tailwind, so gust vs steady tailwind cannot be told apart. That needs the airport's own anemometer gusts.
- Within OD 07 only (2,011 hours, 36 closed):
  - gust tailwind ≥ 15 kt: 19 firings, 5 closures (26 %), 7.0 false alarms per 1,000 h
  - steady ≥ 15: 8 firings, 4 closures (50 %), 2.0 per 1,000 h
  - steady ≥ 13: 34 firings, 14 closures (41 %)
  - Over all hours the gust rule fires 16 of its 35 times under OD 25, with 0 closures.
- Closure rate under OD 07 by steady tailwind on 18: ≤ 0 kt 0.4 %, 0–5 kt 0.8 %, 5–8 kt 1.4 %, 8–10 kt 1.1 %, 10–12 kt 4.6 %, 12–15 kt 29 % (12 of 41), > 15 kt 50 % (4 of 8). Closures rise steeply between 12 and 16 kt.
- Model (positive steady tailwind + OD 07, C 0.3): day-grouped CV AUC 0.87, Brier skill 0.10. Coefficients +0.353 per kt and +1.41 for OD 07. P(closed | OD 07) = 20/50/80 % at 14.1/18.1/22.0 kt.
- The wind-driven-only fit (13.5/15.6/17.7 kt, AUC 0.99) is descriptive only: it was selected on the outcome.
- Night edge: 3 closures at local 22–23 are flagged (2025-12-24 22 h wind-driven; 2026-05-10 22 h under OD 25 with a headwind on 18; 2026-05-29 23 h at 4.9 kt). They are kept because the runway was used in 334 of 336 judged hours at 22 h and 7 of 8 at 23 h.

## API changes
- `D.load_bundle(path)` returns {od, rwy18, spec, history, trained_until}; `D.DecisionModel.load(path)` accepts either form.
- `D.od_now(labels, issue, max_stale_h=6)` returns a checked current OD.
- `rollout` / `rollout_batch` raise ValueError unless the current OD is 25 or 7.