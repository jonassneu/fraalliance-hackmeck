# Out-of-period replication: blend-v2 vs the logit alone (2026-11-06)

**Result: the blend's gain replicates, and it is larger out of period.** The study was pre-registered before any score (`PLAN.json`).

P1 is the primary period: issues 2024-08-12 .. 2025-10-31, 446 days, which no design choice ever used. There the blend beats the logit alone by **Brier(1,6,24,48) −0.0062 [−0.0079, −0.0046]**, about 12 %:
- −0.0064 in the first half and −0.0060 in the second half of P1;
- no lead loses accuracy significantly.

All three replication conditions hold (`verdict.json`). The long test (Jun–Oct 2026), on which the blend was designed, showed −0.0041.

## Setup

**Data.** `experiments/logit25/inputs/table.parquet`:
- complete hourly radar labels (`fra.labels.history_labels`);
- ECMWF IFS single runs from 2024-03-14;
- the INAA prognosis history;
- identical to the production table on the 2026 long test.

Before ICON existed (2026-04/05), the consensus features equal ECMWF, and Part B uses its IFS-only fallback, as it would have live.

**Arms.**
- **logit:** the production spec, fit weekly walk-forward (120 days, temperature).
- **dec_365:** `fra.decision.DEFAULT`, trained each week on the last 365 days of history transitions and rolled out exactly as fra.blend does: lag 2, Part B DEFAULT, 200 paths, seed 0.
- **blend:** 0.5 / 0.5.
- **Secondary:** dec_all, trained on all transitions since 2014 (the blend-hist12 design).

Paired 1-day-block bootstrap, 2,000 draws.

## Results (Brier(1,6,24,48); accuracy % at 1 / 6 / 24 / 48 h)

| Period | blend | logit | prognosis | rule | blend − logit | blend_all − blend |
|---|---|---|---|---|---|---|
| **P1** Aug 2024 – Oct 2025, 446 d | **0.0458** | 0.0520 | 0.0855 | 0.0931 | **−0.0062 [−0.0079, −0.0046]** | −0.0006 [−0.0011, −0.0001] |
| P2 Nov 2025 – May 2026, 212 d | 0.0414 | 0.0510 | 0.0943 | 0.0950 | −0.0097 [−0.0126, −0.0068] | −0.0002 [−0.0012, +0.0007] |
| P1+P2, 658 d | 0.0444 | 0.0517 | 0.0884 | 0.0937 | −0.0073 [−0.0089, −0.0058] | −0.0005 [−0.0009, −0.0000] |

**Accuracy in P1:**

| | 1 h | 6 h | 24 h | 48 h |
|---|---|---|---|---|
| blend | 96.4 | 93.8 | 92.8 | 91.5 |
| logit | 94.6 | 93.2 | 92.3 | 91.7 |
| prognosis | 92.7 | 92.0 | 91.3 | 89.8 |
| rule | 93.1 | 91.6 | 89.5 | 88.5 |
| blend − logit, pp | +1.8 [+1.3, +2.4] | +0.6 [+0.2, +1.0] | +0.5 [+0.1, +1.1] | −0.2 [−0.8, +0.3] |

**Brier by lead in P1, blend − logit:**

| 1 h | 6 h | 24 h | 48 h |
|---|---|---|---|
| −0.0110 | −0.0068 | −0.0051 | −0.0018 (n.s.) |

The gain sits at short and medium leads.

**Changed hours** (flown OD differs from the current OD), the long test's weak spot (−5.8 pp at 6 h there):
- P1: −1.9 pp [−3.9, +0.2];
- P2: +3.7 pp [+1.1, +6.5].

The weakness does not replicate as a robust effect.

## What this means

- **The champion choice is supported independently of the data it was selected on.** The holdout (first verdict 2026-12-01) remains the formal referee.
- **12-year decision training helps a little but consistently** (−0.0005 [−0.0009, −0.0000] over 658 days). This backs the running blend-hist12 shadow.
- **P1 is now a much stronger test bench for close variants.** The CI half-width for close pairs is about 0.0005, against about 0.0012 on the 152-day long test. Future candidates should be chosen on P1 and confirmed on P2, the long test and the holdout.

## Follow-up 1: blend weight per lead bucket (`PLAN_weights.json`, `weights.py`): fails

The weights on the logit chosen on P1 are 0.20 / 0.30 / 0.40 / 0.45 for the buckets 1–3 / 4–12 / 13–30 / 31–48 h, so more weight goes to the decision rollout at short leads.

| Period | W4 − 0.5, Brier(1,6,24,48) | Note |
|---|---|---|
| P2 (partly seen) | −0.0016 [−0.0023, −0.0009] | |
| Long test, blend-v2's own components | −0.0001 [−0.0007, +0.0005] | 1 h accuracy −0.47 pp [−0.83, −0.14] |

The pre-registered rule is not met, so the fixed 0.5 stays.

## Follow-up 2: decision-model specification on 12 years (`PLAN_decspec.json`, `decspec.py`): nothing beats DEFAULT

All candidates were trained on every transition since 2014. Each is blended 0.5 / 0.5 with the logit and compared with D0 = DEFAULT on the same shared Part B paths.

| Candidate − D0, Brier(1,6,24,48) | P1 (selection) | P2 | Long test |
|---|---|---|---|
| D1_dur: + log hours in OD, true start duration | +0.00008 [+0.00002, +0.00014] | −0.00001 | −0.00003 |
| D2_hinge: + positive-part tailwind terms | −0.00001 [−0.00006, +0.00004] | +0.00006 | −0.00006 |
| D3_C1: C 1.0 instead of 0.1 | −0.00002 [−0.00006, +0.00002] | −0.00002 | −0.00002 |
| D4_lgbm: monotone LightGBM | −0.00009 [−0.00050, +0.00036] | +0.00022 | −0.00054 [−0.00126, +0.00015] |

- No candidate has a P1 CI below 0, so nothing is selected and the study stops, as pre-registered. The decision model is at a plateau for these inputs.
- Corroboration on a third period: on the long test, D0 (12-year training, the blend-hist12 design) blended with blend-v2's logit scores 0.0378, against 0.0389 for blend-v2. The sign matches P1 (−0.0006) and P2 (−0.0002).

## Files

- `run.py` (`logit`, `dec`, `score`).
- `logit.parquet`, `dec.parquet`, `preds.parquet`: per (issue, lead).
- `bootstrap.csv`: all periods, incl. changed hours.
- `verdict.json`.
