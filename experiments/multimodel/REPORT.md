# Multi-model wind centre (2026-11-05): better wind forecast, no better OD forecast

**Verdict: not a clear win. No shadow variant was registered.** Champion, registry, runtimes and the locked holdout are untouched.

The plan was fixed before any score was computed: `PLAN.json`, with one clarification written before results and the outcome appended afterwards.

## Question

Does a better wind centre, built from ECMWF IFS plus the mean of eight other models, improve the blend? The centre would replace the IFS + ICON consensus in two places:
- the logit consensus features;
- the centre of the Part B wind paths.

The idea came from `experiments/partb/REPORT.md`: going from DEFAULT_IFS to DEFAULT (adding ICON-D2) was the largest end-to-end gain of the wind layer. As-issued ensemble runs, the alternative, are not available from Open-Meteo for any past date. The previous-runs and single-runs APIs return empty member series, probed 2026-11-05.

## Data

`fetch.py` archives Open-Meteo single runs, 2026-04-02 .. 2026-10-31 18 UTC, into `data/multimodel/`. Coverage is 98.8–99.6 % of runs per model.

| Model | Cycles | Buffer (h) | Measured lag (h), 2026-11-05 |
|---|---|---|---|
| AIFS (`ecmwf_aifs025_single`) | 6-hourly | 7 | 5.6 |
| UKMO 10 km | 6-hourly | 10 | 8.5 |
| KNMI HARMONIE-AROME Europe | 3-hourly | 4 | 2.6 |
| DMI HARMONIE-AROME Europe | 3-hourly | 4 | 2.8 |
| Météo-France AROME HD | 3-hourly | 5 | 3.9 |
| Météo-France ARPEGE Europe | 6-hourly | 5 | 3.7 |
| GFS | 6-hourly | 10 | 8.6 |

Rate limits: Open-Meteo answers bursts of about 10 parallel requests with HTTP 429. Keep the backfill at about 1 request/s, and pause it while the live job runs at :25–:39.

## Results

**Centre skill passes the gate (`gate.py`).** As-of MAE of the tailwind on 25, every model's newest run available at the issue, hourly issues:

| | dev Apr–May, 1–48 h | test Jun–Oct, 1–48 h |
|---|---|---|
| ECMWF IFS alone | 2.448 | 2.372 |
| production consensus (IFS + ICON-D2/EU) | 2.523 | 2.385 |
| **C = 0.5 IFS + 0.5 mean(8 others)** | **2.348** | **2.240** |
| equal weights, all 9 | 2.343 | 2.215 |
| AROME HD alone | 2.249 | 2.204 |

- C − production: −0.175 kt [−0.233, −0.122] on dev, −0.145 kt [−0.174, −0.118] on test, about 6–7 %.
- AROME is the most valuable member: leaving it out costs the most, and alone it is best at 1–12 h. KNMI adds nothing.
- As of the issue time, the production consensus is slightly worse than IFS alone.

**End to end, nothing (`run_e2e.py`).** Long test, 152 days. The reference arm reproduces blend-v2 exactly: p_logit and p_dec max |diff| 0.0.

| Brier(1,6,24,48), paired difference vs blend-v2 | estimate [95 % CI] |
|---|---|
| **blend with C in both parts (primary)** | **−0.0001 [−0.0013, +0.0011]**, p 0.84 |
| pre-15-Sep part | −0.0006 [−0.0020, +0.0008] |
| C only in the logit | −0.0001 [−0.0008, +0.0005] |
| C only in Part B | −0.0004 [−0.0010, +0.0003] |
| logit alone, C vs production | −0.0002 (1 h −0.0017 [−0.0034, −0.0002]; 48 h +0.0028 [−0.0006, +0.0064]) |
| decision rollout alone, C vs production | −0.0009 [−0.0023, +0.0006] |

- Accuracy differences are all within ±0.3 pp.
- Changed hours: no difference.

## Why it did not carry over

- **Wind is a small share of the error.** Perfect wind removes only about 13 % of the blend's Brier (`experiments/history12`). A 6 % better centre is therefore worth roughly 1 % of Brier, about 0.0004. That is below what 152 test days can resolve (the CI half-width is about 0.0012).
- **The ICON-D2 gain was not mainly about the centre.** DEFAULT vs DEFAULT_IFS changed the centre, the library mix, the IFS-entry weight and the spread rescaling together. The centre alone moved CRPS by 2.7 %. As of the issue, the IFS + ICON centre is not even more accurate than IFS alone.
- **Design flaw at 48 h.** Run leads were stored only to 54 h. Late global members (UKMO and GFS with 10 h buffers, AIFS with 7 h) therefore drop out of the mean at long leads, and the consensus changes its make-up within the 31–48 h logit bucket. This is the likely cause of the logit's 48 h loss. A follow-up would need run leads to about 66 h and a new pre-registration.

## Files

- `PLAN.json`: pre-registration, clarification, outcome.
- `fetch.py`: archive.
- `consensus.py`: as-of members.
- `score_centre.py`: same-init pilot, `centre_pilot.csv`.
- `gate.py`: `gate_mae.csv`, `gate.json`.
- `run_e2e.py`: `dec_ref.parquet`, `dec_mm.parquet`, `e2e_preds.parquet`, `e2e_bootstrap*.csv`, `e2e_verdict.json`.
- `live_entry.py`: the candidate live entry. It matches the backtest features exactly, but was never registered or run live.
