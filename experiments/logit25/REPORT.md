# logit25: the blend's logistic half trained on ~2.5 years instead of 120 days

**Result:** no candidate passes the pre-registered rule in both stages. Nothing changes live: the champion stays
blend-v2, no shadow variant is registered, no amendment is written.
- Longer windows (365 d, 540 d, all since 2024-03-14), with or without temperature scaling, beat the 120-day control
  by point estimate only: the best is all history with temperature scaling, Brier(1,6,24,48) -0.0012 [-0.0032, +0.0009].
- 0.5 x all-history logit + 0.5 x monotone LightGBM on all history passes stage 1 vs the control: -0.00245
  [-0.00443, -0.00043]. Inside the blend it is -0.00042 [-0.00131, +0.00049] vs blend-v2, so it fails condition 1.

## 1. Method (pre-registered in plan.json, 2026-11-03 09:35:32 UTC, before any prediction or score)

**Question.** Hourly radar labels now exist for 2014-2026, and archived ECMWF IFS single runs from 2024-03-14.
Phase 2 found "all history" ~= 120 d, but its history began in Jun 2025 and was sparsely labelled before 2026-02-11.
Is a longer training window better now?

**Extended feature table** (`run.py inputs`, issues 2024-03-14 .. 2026-10-31, valid < 2026-11-01, 1,099,179 rows).
No shared data file was rewritten.
- Built by `fra.dataset.build` with fra.singleruns / fra.prognosis pointed in-process at merged copies under `inputs/`:
  - IFS: backfill + archive, surface and 100 m. Same as-of rule (init <= t - 6 h); only 00/12 UTC runs before 2024-08-09 18 UTC.
  - Prognosis: history (to 2025-04-30) + live archive (from 2025-05-01).
- Labels: `fra.labels.history_labels(gap_rule="confirmed")`, i.e. complete days and bridge="night".
  `fra.train`'s clean-label mask is pointed at these labels, which are night-bridged already.
- METAR and ICON: as production. Before ICON exists (2026-04/05), the consensus is ECMWF alone.
- Check (`table_check.json`): on the 174,471 long-test rows shared with `data/wf_cache.parquet`, all 17 logit features
  are identical (max |diff| 0.0).

**Walk-forward.**
- 22 weekly folds (`fra.evalkit`), issue 2026-06-01 .. 2026-10-30.
- Training rows: valid + 2 h <= week start.
- Every logit is `fra.train.fit` (C 0.03, 4 lead buckets, clean labels) with only the window changed. "noT" uses the same
  fitted logit without the per-bucket temperature refit.

**Scoring.**
- Rows: the 173,352 blend-v2 rows of `experiments/integration/preds_long.parquet` where every candidate has a prediction:
  173,256 rows, 14,457 at leads 1/6/24/48, 152 days. Truth: its `od` column.
- 96 rows are missing: issue 2026-08-06 18 UTC (its od_now hour, 16 UTC, was never fetched) and the 48 rows with valid
  2026-08-06 16 UTC (no label under the night bridge).
- CIs: paired day-block bootstrap, 1-day blocks (decisive), 2,000 reps, seed 20261031, 95 %. 3-day blocks are a
  sensitivity check.
- Halves: H1 = issue Jun-Jul, H2 = issue Aug-Oct.

**Adoption rule.** The candidate must pass in stage 1 (vs the 120-day control on the same table) AND in stage 2
(0.5 x candidate + 0.5 x the stored blend-v2 decision rollout `p_dec_main`, vs blend-v2 `p_blend_main`). In each stage:
1. The 95 % CI of the paired Brier(1,6,24,48) difference lies entirely below 0 on the whole test.
2. The point estimate is below 0 in both H1 and H2.
3. No lead 1/6/24/48 has a paired accuracy CI entirely below 0.

**Stage-2 candidate:** the stage-1 passer with the lowest whole-test difference.

## 2. Control vs production

The 120-day control on the extended table equals the stored production logit everywhere except test weeks 0-1.
Their 120-day window reaches before 2026-02-11, where the history labels are denser than the forward file.
- Max |diff| 0.051 on 14,535 rows.
- Brier(1,6,24,48) 0.04301 vs 0.04295: +0.00006 [-0.00001, +0.00016].

## 3. Stage 1: logit variants vs the control (Brier(1,6,24,48) control 0.04301)

| Variant | Brier | Δ whole [95 % CI] | Δ H1 | Δ H2 | Δ pre-15-Sep | Δ whole, 3-day blocks | Δ Brier all leads | Passes |
|---|---|---|---|---|---|---|---|---|
| w120_noT | 0.04283 | -0.00018 [-0.00088, +0.00055] | -0.00051 | +0.00005 | -0.00031 | [-0.00092, +0.00057] | -0.00029 [-0.00107, +0.00045] | no |
| w365_T | 0.04273 | -0.00027 [-0.00211, +0.00162] | -0.00036 | -0.00021 | -0.00098 | [-0.00238, +0.00174] | +0.00058 [-0.00128, +0.00260] | no |
| w365_noT | 0.04276 | -0.00025 [-0.00225, +0.00170] | -0.00078 | +0.00011 | -0.00119 | [-0.00256, +0.00190] | +0.00074 [-0.00132, +0.00280] | no |
| w540_T | 0.04243 | -0.00058 [-0.00258, +0.00136] | -0.00133 | -0.00007 | -0.00182 | [-0.00294, +0.00144] | +0.00038 [-0.00155, +0.00238] | no |
| w540_noT | 0.04263 | -0.00038 [-0.00249, +0.00166] | -0.00153 | +0.00041 | -0.00193 | [-0.00289, +0.00190] | +0.00072 [-0.00133, +0.00280] | no |
| wall_T | 0.04181 | -0.00120 [-0.00318, +0.00086] | -0.00075 | -0.00150 | -0.00213 | [-0.00375, +0.00108] | -0.00034 [-0.00228, +0.00161] | no |
| wall_noT | 0.04235 | -0.00065 [-0.00289, +0.00154] | -0.00091 | -0.00048 | -0.00210 | [-0.00342, +0.00190] | +0.00046 [-0.00166, +0.00261] | no |
| **lgbm_blend_all** | 0.04055 | **-0.00245 [-0.00443, -0.00043]** | -0.00153 | -0.00308 | -0.00312 | [-0.00492, -0.00016] | -0.00162 [-0.00353, +0.00026] | **yes** |

Accuracy at 1 / 6 / 24 / 48 h in %. The control has 95.5 / 94.6 / 94.1 / 92.9. Paired differences are in pp.

| Variant | Accuracy | Δ 1 h | Δ 6 h | Δ 24 h | Δ 48 h |
|---|---|---|---|---|---|
| w120_noT | 95.5 / 94.6 / 94.1 / 92.9 | 0.0 | 0.0 | 0.0 | 0.0 |
| w365_T, w365_noT | 96.1 / 94.6 / 93.6 / 92.8 | +0.7 [+0.2, +1.2] | +0.0 [-0.6, +0.6] | -0.5 [-1.1, +0.1] | -0.1 [-0.9, +0.6] |
| w540_T, w540_noT | 96.1 / 94.4 / 93.7 / 92.9 | +0.7 [+0.2, +1.2] | -0.2 [-0.8, +0.4] | -0.4 [-1.0, +0.1] | +0.1 [-0.7, +0.8] |
| wall_T, wall_noT | 96.0 / 94.5 / 93.9 / 92.9 | +0.5 [-0.0, +1.1] | -0.1 [-0.7, +0.4] | -0.2 [-0.6, +0.2] | -0.0 [-0.9, +0.7] |
| lgbm_blend_all | 96.1 / 94.9 / 94.1 / 92.9 | +0.6 [+0.1, +1.1] | +0.3 [-0.2, +0.8] | -0.0 [-0.5, +0.5] | +0.0 [-0.8, +0.7] |

Brier per lead, wall_T - control:
- 1 h: -0.0023 [-0.0050, +0.0001]
- 6 h: -0.0006
- 24 h: -0.0004
- 48 h: -0.0014

Brier per lead, lgbm_blend_all - control:
- 1 h: -0.0035 [-0.0059, -0.0012]
- 6 h: -0.0022 [-0.0045, -0.0000]
- 24 h: -0.0018 [-0.0042, +0.0006]
- 48 h: -0.0023 [-0.0059, +0.0014]

**Reading.**
- With dense labels, longer memory now helps a little on average. All 8 window variants have a negative point
  estimate; all history with temperature scaling is best, at -0.0012.
- None of them separates from noise. The window variants again trade +0.5 to +0.7 pp at 1 h for -0.2 to -0.5 pp at 24 h.
- Over all 48 leads, the 365-day and 540-day windows are worse than the control.
- Temperature scaling helps the longer windows (wall: -0.0012 with it, -0.0007 without).

## 4. Stage 2: in the blend

| Comparison | Brier(1,6,24,48) | Δ whole [95 % CI] | Δ H1 | Δ H2 | Δ pre-15-Sep | Δ whole, 3-day blocks | Δ Brier all leads |
|---|---|---|---|---|---|---|---|
| blend(lgbm_blend_all) - blend-v2 | 0.03848 vs 0.03890 | -0.00042 [-0.00131, +0.00049], p 0.40 | -0.00030 | -0.00050 | -0.00079 | [-0.00147, +0.00060] | -0.00030 [-0.00115, +0.00057] |

- Accuracy 96.5 / 94.7 / 94.8 / 93.2 % vs 96.8 / 94.9 / 94.7 / 93.0 %.
- Paired differences: -0.2 [-0.5, +0.0] / -0.2 [-0.7, +0.1] / +0.2 [-0.1, +0.5] / +0.2 [-0.4, +0.7] pp.
- Brier per lead: -0.0007 / -0.0002 / -0.0005 / -0.0002, all CIs include 0.

Rule:
1. CI entirely below 0: **no**.
2. Both halves below 0: yes.
3. No lead less accurate: yes.

**Not adopted.** Most of what the LightGBM mix adds to the logit (the short-lead gain) is already supplied by the
decision rollout in the blend.

## 5. Decision

- No change to the champion or the registry.
- No new runtime, no `data/archive/models/blend-logit25/`, no preregistration_logit25.json, no amendment A9.
- `fra/train.py` keeps the 120-day window.
- Shared data files (labels.parquet, ifs_runs*.parquet, prognosis.parquet, wf_cache.parquet, model.pkl) were only read.

## 6. Selection noise

- 10 variants were scored on this test: 8 stage-1 window variants incl. the control, 1 LightGBM mix, 1 stage-2 blend.
- With 8 non-control stage-1 comparisons, about 0.4 CIs excluding 0 are expected by chance.
- Before this round, the same Jun-Oct test had been used for Phase 2 (21 variants), the integration round (~42) and
  history12. Any long-test gain is therefore an in-sample upper bound.
- The single stage-1 pass (p 0.016) is consistent with that noise level. It is a candidate for a future pre-registered
  test, not evidence. The locked holdout from 2026-11-01 remains the referee.

## 7. Reproduce

    export OMP_NUM_THREADS=1 OPENBLAS_NUM_THREADS=1 MKL_NUM_THREADS=1
    uv run python experiments/logit25/run.py inputs                 # merged inputs + table (~1 min) + table_check.json
    uv run python experiments/logit25/run.py preds 120 365 540 all  # ~2-12 min each (4 processes in parallel)
    uv run python experiments/logit25/run.py lgbm                   # ~6 min
    uv run python experiments/logit25/run.py score                  # -> results.csv, results.json
