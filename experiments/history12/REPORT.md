# 12-year radar history: published shares, coverage, era stability, wave-3 runner

## Wave 3 results (final, 2026-11-03)

**Status.** Finalized 2026-11-03, about 03:20 UTC (data snapshot 03:00 UTC).
- The radar backfill (`fra.history`) is complete: 84,056 of 84,056 daytime hours of 2014-01-01 .. 2026-02-10, and 4,424 of 4,424 complete days (`uv run python -m fra.history status`).
- Locked holdout: nothing here uses radar hours or issue times from 2026-11-01 00:00 UTC on for training, tuning, selection or scoring. `h12lib.hour_table` and `run.label_stats` cut at the holdout start. (Run 1's `label_stats` still counted 36 label hours from 1 Nov on; that was a count only, see Provenance.)
- The live system was not touched:
  - champion blend-v2, with shadows logit-v2, logit-v1 and hackathon (`data/archive/variants.json`, last modified 31 Oct);
  - runtime `current` -> `2026-10-31-wave2-r5`; the frozen runtime has its own copy of `fra/` and contains none of this wave's library changes;
  - `fra-archive.timer` is active, and its last run (02:30 UTC) succeeded.

**Verdict: the 12-year decision model (`hist_era`) does NOT clearly win.**
- The pre-registered criterion fails on its first condition. The 95 % CI on the whole long test includes 0: -0.0006 [-0.0016, +0.0004].
- The result of record is the pre-registered run: the documented command with the label-gap rule of that time (every confirmed suspect hour is a gap). Its outputs are `wave3_confirmedgaps_*`.
- The verdict is the same under every sensitivity: 3-day and 7-day blocks, the champion's lag-2 information set, and the post-hoc "traffic" gap rule.
- **Consequence:** no shadow challenger (`blend-hist12`) was added. There is no registry entry, no amendment, and no runtime smoke test. The champion stays blend-v2, and the holdout from 2026-11-01 stays the referee.

### Primary comparison (pre-registered)

**Metric:** Brier(1,6,24,48) of blend(`hist_era` decision model on Part B paths) minus blend(`recent` on Part B paths).

**Setup:**
- Weekly walk-forward on the long test: issues 2026-06-01 .. 2026-10-30 10 UTC (the last production test row), 22 weekly folds, valid < 2026-11-01.
- Paired day-block bootstrap: 1-day blocks of the valid time, 2,000 draws, seed 20261031.

| Run | Gap rule, information set | Long test (14,465 rows / 152 days) | Pre-15-Sep part (10,097 / 106) | Clearly wins |
|---|---|---|---|---|
| **Pre-registered** (`wave3_confirmedgaps_*` = run 1) | confirmed, lag 1 | **-0.0006 [-0.0016, +0.0004]**, p 0.25 | **-0.0005 [-0.0020, +0.0010]**, p 0.51 | **no** |
| 3-day / 7-day blocks (amendment A3 uses 3) | confirmed, lag 1 | -0.0006 [-0.0019, +0.0006] / [-0.0014, +0.0004] | -0.0005 [-0.0023, +0.0013] / [-0.0017, +0.0008] | no |
| Champion information set (`wave3_confirmedgaps_lag2_*`) | confirmed, lag 2 | -0.0008 [-0.0018, +0.0003], p 0.17 | -0.0006 [-0.0022, +0.0009], p 0.41 | no |
| Lag 2, 3-day / 7-day blocks | confirmed, lag 2 | [-0.0021, +0.0005] / [-0.0017, +0.0003] | [-0.0025, +0.0011] / [-0.0019, +0.0006] | no |
| Post-hoc gap rule (`wave3_*`) | traffic, lag 1 | -0.0006 [-0.0016, +0.0005], p 0.27 | -0.0005 [-0.0019, +0.0011], p 0.54 | no |
| Post-hoc gap rule, lag 2 (`wave3_lag2_*`) | traffic, lag 2 | -0.0007 [-0.0018, +0.0003], p 0.17 | -0.0006 [-0.0021, +0.0009], p 0.43 | no |

Unrounded values for the pre-registered run (`verdict` in `wave3_confirmedgaps_results.json`): -0.000633 [-0.001640, +0.000434] and -0.000479 [-0.001964, +0.001037]. An independent re-run of the bootstrap from the stored predictions gives [-0.00172, +0.00043].

**"Clearly wins", fixed before the results and checked on the pre-registered run:**
1. 95 % CI entirely below 0 on the whole long test: **no** (upper bound +0.0004).
2. Negative point estimate on the pre-15-Sep part: yes (-0.0005).
3. No lead (1/6/24/48 h) where accuracy gets worse with a CI entirely below 0: yes.
   - Accuracy differences: +0.3 [+0.0, +0.5] / +0.2 [-0.2, +0.7] / -0.1 [-0.4, +0.3] / -0.2 [-0.6, +0.3] pp.
   - Pre-15-Sep part: +0.3 [+0.0, +0.6] / +0.2 [-0.3, +0.9] / +0.0 [-0.5, +0.5] / -0.3 [-0.9, +0.2] pp.
   - Lag 2: +0.3 [-0.1, +0.7] / +0.1 [-0.4, +0.6] / +0.2 [-0.1, +0.6] / +0.3 [-0.2, +0.7] pp.

Condition 1 fails in every variant, so the criterion is not met. The other two conditions hold in every variant.

Brier per lead of the primary pair (pre-registered run / lag 2):
- 1 h: -0.0008 [-0.0014, -0.0002] / -0.0012 [-0.0021, -0.0003]
- 6 h: -0.0011 [-0.0025, +0.0002] / -0.0011 [-0.0024, +0.0003]
- 24 h: -0.0005 [-0.0017, +0.0008] / -0.0003 [-0.0016, +0.0010]
- 48 h: -0.0001 [-0.0020, +0.0017] / -0.0005 [-0.0022, +0.0011]

**What this means.** Adding 12 years of history with the pre-registered era terms moves the blend in the right direction: about -0.0006 Brier, roughly 1.6 % of the blend's 0.0386. That is too small to separate from noise in one five-month test. The only gain with a CI below 0 is in a secondary set (`hist`, history without era terms, see below). Those sets were not pre-registered as decisive, so nothing changes because of them.

### What changed in wave 3

**Library** (`fra/`; the frozen live runtime is not affected):
- `fra/labels.py`:
  - `GAP_RULE` and `history_gaps(rule)` decide which confirmed suspect hours become OD label gaps.
    - "confirmed": every confirmed hour is a gap. This is the pre-registered rule.
    - "traffic": a post-hoc rule and the library default; only hours that are also low against the same local hour on the surrounding days are gaps.
  - New `history_labels()`: complete history days, the gap rule, and the night-only bridge. It never makes a RWY 18 judgement in a confirmed hour.
- `fra/history.py`: the status line reports both gap counts. The re-fetch rule itself is unchanged.
- `fra/decision.py`:
  - `KNOWN_RWY18_OUTAGES`, `rwy18_outage_days` (now also the ≥ 90 % rule, see RWY 18) and `history_rwy18_filter`.
  - `load_labels(history=True)` now uses `fra.labels.history_labels()`.
  - `fit_default(history=True)` drops the COVID window and outage days from its RWY 18 rows.

**Experiments** (`experiments/history12/`):
- `run.py`:
  - options `--gap-rule` and the new step `lag2`;
  - the `verdict` function;
  - the fields `role`, `preregistered_output`, `subsets` and `information_set`;
  - `run_manifest.jsonl` (sha256 of the outputs before and after each run);
  - merging of partial runs into the existing results JSON.
- `suspects.py` (new); `h12lib.py`, `era.py` and `shares.py` updated.
- Provenance files:
  - `wave3_provenance.json`;
  - `wave3_run1_results.json`;
  - `wave3_run1_rwy18_walkforward.parquet` and `wave3_run1_rwy18_bootstrap.csv`: run 1's RWY 18 outputs, put back into the repository during finalization, with sha256 equal to run 1's;
  - `run_manifest.jsonl` and `wave3_fixes_run.log`.

**Not changed:**
- champion, registry (`variants.json`) and runtime;
- `fra-archive.timer` and its service;
- the pre-registration and its amendments;
- `experiments/parta/` (including `common.py`, see Open issues).

### Provenance: which run is the result of record

| Time (UTC, 3 Nov) | What |
|---|---|
| 02:06:18 | **Run 1** starts: `uv run python experiments/history12/run.py`, exactly as documented in section 6 (31 Oct). Label gaps = every confirmed suspect hour (`history_gaps()`, the only rule that existed). |
| ~02:07:20 | Run 1 is done (60 s). It prints PRIMARY to stdout (`wave3_confirmedgaps_run.log`): -0.0006 [-0.0016, +0.0004] / -0.0005 [-0.0020, +0.0010]. |
| 02:10-02:13 | The "traffic" gap rule is coded (`fra/history.py` at 02:10; `fra/labels.py` at 02:13:11). Its parameters (0.4 × median of the same local hour, ±7 days, ≥ 5 reference hours) were therefore set **after** the pre-registered PRIMARY was available. An earlier statement said run 1's Part A output was first read only after the rule was coded. The files cannot confirm that, so the statement is withdrawn. |
| 02:14:22 | The run-1 outputs are renamed `wave3_confirmedgaps_*`, with a `label_gaps` note added to the results JSON, and copied outside the repository. |
| 02:25:12 | **Run 2**: `run.py` with GAP_RULE "traffic" (outputs `wave3_*`), a post-hoc sensitivity. |
| 02:26:10 | **Run 3**: `run.py --gap-rule confirmed`. It overwrote the renamed run-1 files, which have the same prefix. |
| 02:56:45, 02:58:20 | Fix runs after review: `--steps qa,rwy18,lag2` for both rules, merged into the results JSONs (`step_runs`). The Part A outputs were untouched (hashes unchanged in `run_manifest.jsonl`). The RWY 18 outputs were rewritten with the extended outage filter. |
| ~03:19 | Finalization: run 1's RWY 18 outputs are copied back into the repository as `wave3_run1_rwy18_*` (`run1_rwy18_preserved` in `wave3_provenance.json`). |

**Run 1 is fully verifiable from the repository:**
- `wave3_run1_results.json` is run 1's results JSON (`started` 02:06:18).
- All six run-1 data files are **byte-identical** to the run-3 reproduction (sha256 in `wave3_provenance.json`): Part A predictions, bootstrap, coefficients and transition era; RWY 18 walk-forward and bootstrap.
  - The four Part A files are still the current `wave3_confirmedgaps_parta_*`.
  - The two RWY 18 files are kept as `wave3_run1_rwy18_*`. The current `wave3_confirmedgaps_rwy18_*` come from the post-review outage filter: 834 instead of 850 test closures, skill score 0.39 instead of 0.38.
- The results JSONs of run 1 and run 3 agree on PRIMARY and on every Part A and RWY 18 metric. They differ only in:
  - timing;
  - the added `primary_block_sensitivity`;
  - the hand-added note;
  - one count: 2026 observed label hours, 5,532 vs 5,496 (run 1 counted 36 hours from 1 Nov on, which were never trained on or scored).
- Every results JSON carries `role` ("preregistered" / "post-hoc sensitivity") and `preregistered_output: wave3_confirmedgaps_results.json`.
- From now on every run appends to `run_manifest.jsonl` the sha256 of the outputs it found and of those it wrote. A run of only some steps merges into the existing results JSON instead of replacing it.

### Information set: the pre-registered pipeline uses a 1-hour look-ahead

- The `parta` step (pre-registered) takes `od_now` from `experiments/parta/prod_preds.parquet`, the hackathon snapshot. There `od_now` is the label of radar hour [t-1h, t).
- FANOMOS publishes that hour about 60-75 min after it ends, so it is **not known at issue time t**. The champion blend-v2 uses lag 2: the label of t-2 (`fra.blend.rollout_many`, `rollout_lag_h = 2`).
- Both arms of the primary pair use the same information set, so the paired comparison stays fair. But **the absolute lag-1 accuracies and Brier scores are optimistic**. They must not be compared with the champion or the holdout.
- The two pipelines differ in more than the lag:

| | Production logit | `od_now` | Part B paths |
|---|---|---|---|
| Lag 1 | the hackathon logit (`p_prod`) | label of t-1 | 100 |
| Lag 2 | the walk-forward production logit of `experiments/integration/final_wf_long.parquet` (`p_logit`; mean \|p_prod - p_logit\| 0.015) | label of t-2 | 200 |

So the 1-h accuracy gaps between the two tables below are not pure look-ahead:
- Blend `recent`: 97.1 % at lag 1 vs 96.8 % at lag 2. Production logit: 96.3 % vs 95.5 %.
- The closest same-model illustration is Part A `recent` on Part B: 96.9 % vs 96.2 %. The decision model and the folds are the same; the lag and the path count differ.
- Either way, lag 1 is optimistic.

The lag-2 runs:
- At lag 2 the `recent` arm is blend-v2: its `p_dec` and the blended `p_blend` reproduce the stored blend-v2 values exactly (max |diff| 0.0).
- **Step `lag2`:**
  - the same four training sets, rolled out with `fra.blend.rollout_many(lag_h=2)`;
  - Part B with 200 paths, seed 0, on the issues of `final_wf_long.parquet`;
  - blended 50/50 with its `p_logit`;
  - the same scored rows (3,635 / 3,630 / 3,612 / 3,588 at leads 1/6/24/48), weekly folds, training cut, bootstrap, subsets and verdict function.

### Subsets: "selection-free" is the pre-15-Sep part

- The pre-registration calls valid < 2026-09-15 the "selection-free part". After waves 1-2 it is not: the decision-model spec (`fra.decision.DEFAULT`), the Part B parameters and the 50/50 blend weight were all chosen on the whole Jun-Oct test (`fra/evalkit.py`). No part of Jun-Oct 2026 is selection-free; only the holdout is clean.
- The criterion refers to this subset, so it is still computed. Below it is called the **pre-15-Sep part**.
- The identifier `selection_free` stays in the data files so they remain byte-identical to run 1. The `subsets` field in each results JSON explains it.

### Accuracy per lead

**Lag 1, pre-registered run.** Absolute values are optimistic (see Information set); only differences within the table are meaningful.

| Method | Acc 1 h | Acc 6 h | Acc 24 h | Acc 48 h | Brier(1,6,24,48) [95 % CI] | Pre-15-Sep part |
|---|---|---|---|---|---|---|
| Production logit (hackathon snapshot) | 96.3 | 94.3 | 94.1 | 92.2 | 0.0428 [0.0327, 0.0529] | 0.0469 |
| Blend `recent` on Part B | 97.1 | 94.8 | 94.9 | 92.6 | 0.0386 [0.0294, 0.0477] | 0.0422 |
| Blend `hist` on Part B | 97.4 | 95.0 | 94.9 | 92.8 | 0.0376 [0.0286, 0.0466] | 0.0411 |
| **Blend `hist_era` on Part B (primary)** | 97.4 | 95.0 | 94.8 | 92.5 | 0.0380 [0.0290, 0.0470] | 0.0417 |
| Blend `hist_era_nocovid` on Part B | 97.3 | 95.1 | 94.8 | 92.6 | 0.0379 [0.0290, 0.0469] | 0.0416 |
| Part A on Part B: `recent` | 96.9 | 94.6 | 94.7 | 91.6 | 0.0408 | 0.0440 |
| Part A on Part B: `hist` | 97.2 | 95.3 | 95.0 | 92.2 | 0.0388 | 0.0415 |
| Part A on Part B: `hist_era` | 97.0 | 94.9 | 94.8 | 91.6 | 0.0400 | 0.0436 |
| Part A, perfect wind: `recent` | 96.9 | 94.8 | 93.9 | 94.0 | 0.0356 | 0.0389 |
| Part A, perfect wind: `hist` | 97.2 | 95.7 | 95.1 | 95.1 | 0.0313 | 0.0336 |
| Part A, perfect wind: `hist_era` | 97.2 | 95.5 | 95.0 | 95.0 | 0.0319 | 0.0346 |
| Blend on perfect wind: `recent` / `hist` / `hist_era` | 97.2 / 97.6 / 97.5 | 95.7 / 96.1 / 96.2 | 95.3 / 95.7 / 95.7 | 94.9 / 95.3 / 95.2 | 0.0337 / 0.0311 / 0.0314 | 0.0367 / 0.0335 / 0.0339 |

The `recent` and production rows reproduce the dry run and wave 1 exactly (0.0428 / 0.0386 / 0.0408 / 0.0356). Part B: `fra/fcerror.py` blob af39b397, DEFAULT parameters at run time, 100 paths, seed 0.

**Lag 2, champion information set.** A sensitivity on the same rows, comparable with blend-v2.

| Method | Acc 1 h | Acc 6 h | Acc 24 h | Acc 48 h | Brier(1,6,24,48) | Pre-15-Sep part |
|---|---|---|---|---|---|---|
| Production logit (walk-forward, lag 2) | 95.5 | 94.6 | 94.1 | 92.9 | 0.0429 | 0.0467 |
| Blend `recent` (= blend-v2) | 96.8 | 94.9 | 94.7 | 93.0 | 0.0389 | 0.0424 |
| Blend `hist` | 97.1 | 95.1 | 94.8 | 93.1 | 0.0377 | 0.0411 |
| **Blend `hist_era` (primary pair)** | 97.0 | 95.0 | 94.9 | 93.3 | 0.0381 | 0.0418 |
| Blend `hist_era_nocovid` | 97.0 | 95.1 | 94.9 | 93.3 | 0.0380 | 0.0417 |
| Part A: `recent` / `hist` / `hist_era` | 96.2 / 96.8 / 96.6 | 94.5 / 95.1 / 94.8 | 94.5 / 95.0 / 94.8 | 91.9 / 92.3 / 91.6 | 0.0420 / 0.0397 / 0.0410 | 0.0452 / 0.0424 / 0.0445 |

### Secondary sets (diagnostics, pre-registered rule, paired against `recent`)

| Brier(1,6,24,48) difference | Lag 1, all rows | Lag 1, pre-15-Sep | Lag 2, all rows | Lag 2, pre-15-Sep |
|---|---|---|---|---|
| Blend `hist` - blend `recent` | -0.0011 [-0.0018, -0.0003] | -0.0012 [-0.0021, -0.0003] | -0.0011 [-0.0019, -0.0004] | -0.0013 [-0.0024, -0.0003] |
| Blend `hist_era_nocovid` - blend `recent` | -0.0007 [-0.0017, +0.0002] | -0.0006 [-0.0020, +0.0007] | -0.0008 [-0.0018, +0.0001] | -0.0007 [-0.0022, +0.0006] |
| Part A on Part B: `hist` - `recent` | -0.0020 [-0.0034, -0.0005] | -0.0025 [-0.0045, -0.0007] | -0.0023 [-0.0038, -0.0007] | -0.0029 [-0.0051, -0.0009] |
| Part A on Part B: `hist_era` - `recent` | -0.0007 [-0.0027, +0.0013] | -0.0004 [-0.0032, +0.0024] | -0.0010 [-0.0030, +0.0012] | -0.0007 [-0.0036, +0.0023] |
| Part A on Part B: `hist_era_nocovid` - `recent` | -0.0010 [-0.0028, +0.0009] | -0.0008 [-0.0034, +0.0018] | -0.0012 [-0.0031, +0.0007] | -0.0010 [-0.0038, +0.0016] |
| Perfect wind: `hist` - `recent` | -0.0043 [-0.0065, -0.0021] | -0.0054 [-0.0086, -0.0025] | – | – |
| Perfect wind: `hist_era` - `recent` | -0.0037 [-0.0065, -0.0008] | -0.0043 [-0.0084, -0.0006] | – | – |
| Blend on perfect wind: `hist_era` - `recent` | -0.0022 [-0.0038, -0.0007] | -0.0027 [-0.0051, -0.0006] | – | – |
| Blend `hist_era` - production | -0.0048 [-0.0077, -0.0023] | -0.0051 [-0.0084, -0.0022] | -0.0048 [-0.0077, -0.0023] | -0.0049 [-0.0084, -0.0018] |
| Blend `recent` - production (reference) | -0.0042 [-0.0068, -0.0021] | -0.0047 [-0.0075, -0.0021] | -0.0041 [-0.0067, -0.0018] | -0.0043 [-0.0073, -0.0016] |

Blend `hist` minus blend `recent`, per lead (lag 1):
- Brier: -0.0010 [-0.0015, -0.0005], -0.0013 [-0.0025, -0.0003], -0.0009 [-0.0017, +0.0000], -0.0011 [-0.0023, +0.0001].
- Accuracy: +0.2 / +0.3 / +0.0 / +0.2 pp, all CIs include 0. At lag 2, +0.3 [+0.1, +0.5] pp at 1 h; the other leads include 0.

**Reading.**
- **History helps the decision model itself.** With the observed wind, 12 years of transitions cut the Part A Brier by 12 % (0.0356 to 0.0313). That is 81,937 training rows (pre-registered rule) instead of 4,693, with 2,089 switches.
  - Through the simulated forecast-wind paths most of the gain is lost, because wind error dominates.
  - In the blend, about -0.0011 remains without era terms and -0.0006 to -0.0008 with them.
- **The era terms cost accuracy.**
  - `year` is a linear trend, stable over all 22 weeks. Standardised coefficients: -0.14 in the "keep OD 25" sub-model and +0.20 in "keep OD 07". `covid`: +0.03 / +0.05.
  - The trend pushes the 2026 prediction to the end of a 12-year line. On Part B paths, `hist_era` loses 0.6-0.7 pp of 48 h accuracy against `hist` (91.6 vs 92.2 % at lag 1, 91.6 vs 92.3 % at lag 2).
  - The per-year offsets (Era stability below) show a step around 2014-2016, not a linear drift.
- **`hist` (no era terms) beats `recent` with a CI below 0 on the long test, at both lags.** This does not change anything:
  - The pre-15-Sep part is not an independent confirmation: it is a subset of the same test, and it is not selection-free.
  - `hist` is one of three secondary sets × four modes and was not pre-registered as decisive.
  - If wanted, it needs its own pre-registered variant, judged on holdout data after its registration.
- **`hist_era_nocovid` ≈ `hist_era`.** The 2020-21 rows neither help nor hurt.

### RWY 18 extended walk-forward from 2015 (`wave3_confirmedgaps_rwy18_*`, rerun after the outage-filter fix)

**Fix: the outage filter missed the first day of the May 2017 works.**
- `rwy18_outage_days` flagged a day only if every judged hour was closed. On 2017-05-25, 16 of 17 judged hours were closed (12 of them below 8 kt tailwind on 18, OD 07 all day). A single RWY 18 departure in one hour defeated the rule, although it caught 2017-05-26 (17 of 17).
- The rule now lives in `fra.decision.rwy18_outage_days` and is also used by `fit_default(history=True)`. It now also flags a day with ≥ 8 judged hours, ≥ 90 % of them closed, and at least half of the closures below 8 kt.
- Outside the COVID window it adds only 2017-05-25 in 2014-2026. It still catches only (nearly) all-day outages, not partial ones.

**Setup:**
- 41 quarterly folds, 2015-01 .. 2026-10.
- Model `Rwy18Model`: C 0.3, max(tw18, 0) + OD 07, with the observed wind and the flown OD of the hour.
- Data: 67,008 judged hours, 901 closures (868 outside outage days).
- Excluded:
  - every confirmed suspect hour, whatever the OD gap rule;
  - the COVID window (9,232 h);
  - outage days from training: 2017-05-25, 2017-05-26 and 182 days of 2020 (inside the COVID window).
- Warning level P(open) < 0.8.
- The headline excludes outage days from the test. Both gap rules give the same RWY 18 results.

| Era (test hours, closures) | Method | Brier | Skill score (BSS) | AUC | Hits at P(open) < 0.8 | False alarms / 1,000 h |
|---|---|---|---|---|---|---|
| **2015-2026** (60,868 h, 834) | Rwy18Model, expanding | 0.0083 | 0.39 | 0.94 | 557 (67 %) | 9.3 |
| | Rwy18Model, last 365 d (59,432 h, 806) | 0.0086 | 0.36 | 0.94 | 502 (62 %) | 9.7 |
| | Climatology | 0.0135 | 0 | 0.40 | 0 | 0 |
| | Steady ≥ 15 kt under OD 07 | – | – | – | 142 (17 %) | 0.5 |
| | Gust ≥ 15 kt | – | – | – | 171 (20 %) | 3.5 |
| **2015-2019** (30,442 h, 484) | Expanding | 0.0091 | 0.42 | 0.94 | 337 (70 %) | 9.2 |
| | Last 365 d | 0.0096 | 0.39 | 0.94 | 314 (65 %) | 10.4 |
| | Steady ≥ 15 kt / gust ≥ 15 kt | – | – | – | 94 (19 %) / 110 (23 %) | 0.6 / 3.6 |
| 2020 Jan-Feb (985 h, 2; rest of COVID excluded) | – | not scoreable | | | | |
| **2022-2026** (29,441 h, 348) | Expanding | 0.0077 | 0.34 | 0.94 | 218 (63 %) | 9.6 |
| | Last 365 d (28,005 h, 320) | 0.0078 | 0.31 | 0.94 | 186 (58 %) | 9.2 |
| | Steady ≥ 15 kt / gust ≥ 15 kt | – | – | – | 48 (14 %) / 61 (18 %) | 0.4 / 3.4 |
| Jun-Oct 2026 test window (2,591 h, 2) | Expanding / last 365 d | 0.0014 / 0.0010 | -0.48 / -0.12 | – | 1 of 2 / 0 of 2 | 5.0 / 1.2 |

Paired Brier bootstrap (1-day blocks, rows where both models predict):

| Comparison | 2015-2026 | 2015-2019 | 2022-2026 |
|---|---|---|---|
| Expanding - climatology | -0.0052 [-0.0068, -0.0037] | -0.0066 [-0.0093, -0.0043] | -0.0038 [-0.0060, -0.0019] |
| Expanding - last 365 d | -0.00035 [-0.00057, -0.00015] | -0.00047 [-0.00088, -0.00015] | -0.00022 [-0.00047, -0.00001] |

- Unrounded headline: skill score 0.386, AUC 0.942, 66.8 % of closures warned, 9.27 false alarms per 1,000 h.
- Before the fix (run 1, kept as `wave3_run1_rwy18_*`; 2017-05-25 in training and test): 60,885 h, 850 closures, skill score 0.38, AUC 0.94, 66 % warned. The conclusions are unchanged.
- With the outage days left in the test: 60,902 h, 867 closures, skill score 0.37.
- **Candidate partial outage, not excluded: 2026-04-13..15.**
  - It has 15 closures in 48 judged hours, 14 of them below 8 kt (4-6 a day).
  - It holds 14 of 2026's 15 low-wind OD 07 closures.
  - No documented works were found, so it stays in. Without it: skill score 0.393, AUC 0.945, 68 % warned.
- 94 of the 834 headline closures are below 8 kt.
- Model on all non-outage hours: intercept -8.93, +0.60 per kt of steady tailwind on 18 (positive part), +0.59 for OD 07.
- **Expanding training beats the last 365 days.** The difference is small, but the CI is below 0 in every era, so RWY 18 should use all history.
- The model beats climatology in both eras. The 15 kt rules catch only 14-23 % of closures.
- The 2026 test window cannot be scored (2 closures).

### Published shares 2014-2025 (details in section 2)

- **All 16 verified daytime comparisons are within the 3 pp flag** (all-hours estimator, every year):
  - full-year time shares 2014-2018 within 0.17 pp;
  - the 48 monthly BR 07 values of 2015-2018: MAE 0.17 pp, maximum 0.68 pp, r = 0.9999 (pass-1 hours only: MAE 0.84 pp).
- **2020 settles the metric of the 6vM figures: they are movement-weighted.**
  - Published 79.6 % = radar movement share 79.5 % (79.6 % with the pre-registered gap rule), while the time share is 72.9 %. The busy months Jan-Mar were 25-heavy; Aug-Oct were quiet.
  - The radar movement share runs 0.1-1.7 pp below the 6vM figures (mean -0.7 pp). The time share agrees within 0.9 pp in normal years.
- The only flag remains the unverified Q1 2024 snippet: 70 % against 76.9 %. METAR supports the radar.

### Era stability 2014-2026 (details in section 4)

- **P(OD 07 | tailwind on 25):**
  - The heterogeneity of the per-year offsets is significant: Q = 41.6, df 12, p = 4e-5.
  - The CI excludes the pooled behaviour for 2014 (+0.91 kt [+0.47, +1.33]), 2018 (-0.65 [-1.07, -0.17]) and 2026 (-0.47 [-0.92, -0.03]).
  - No year shifts by more than 1 kt.
- **Hysteresis-resolved thresholds:**
  - Leave OD 25: pooled 3.3 kt. 2014 (4.3 [3.5, 5.2]) and 2020 (4.4 [3.5, 5.2]) stand out.
  - Return to OD 25: pooled -0.8 kt; 2014 +0.35 [-0.27, +1.02].
  - So the outliers are 2014 (the METAR coding year) and 2020 (COVID: little traffic, more tailwind tolerated on 25). 2015-2019 and 2021-2026 are stable within about 1 kt.
- **RWY 18 by year:** no year outside COVID differs significantly from the pooled closure model (2014: -0.49 [-1.96, +0.06]). 2020 (+6.0) and 2021 (+0.79 [+0.27, +1.30]) reflect COVID non-use.

**Per-year transition behaviour of the decision model** (`wave3_confirmedgaps_parta_transition_era.csv`).

Method:
- Pooled `hist` model (pre-registered labels), trained on all rows before 2026-06-01.
- Per year: the observed and predicted switch rate, and the logit shift of P(keep OD) needed for that year.
- Week-block bootstrap CI (bold: the CI excludes 0).
- A positive offset means the airport keeps the OD more than the pooled model predicts.

| Year | Keep 25: rows, switches, rate (predicted) | Offset [95 % CI] | Keep 07: rows, switches, rate (predicted) | Offset [95 % CI] |
|---|---|---|---|---|
| 2014 | 4,471, 97, 2.2 % (3.1 %) | **+0.52 [+0.25, +0.81]** | 2,041, 100, 4.9 % (3.7 %) | **-0.55 [-0.80, -0.27]** |
| 2015 | 4,689, 83, 1.8 % (2.0 %) | +0.20 [-0.08, +0.46] | 1,746, 85, 4.9 % (4.0 %) | **-0.35 [-0.67, -0.04]** |
| 2016 | 4,418, 78, 1.8 % (1.8 %) | +0.03 [-0.24, +0.33] | 1,981, 83, 4.2 % (3.3 %) | **-0.40 [-0.70, -0.17]** |
| 2017 | 4,818, 66, 1.4 % (1.5 %) | +0.12 [-0.14, +0.39] | 1,535, 70, 4.6 % (4.2 %) | -0.13 [-0.40, +0.14] |
| 2018 | 3,475, 97, 2.8 % (2.4 %) | -0.26 [-0.56, +0.05] | 2,954, 96, 3.2 % (3.6 %) | +0.19 [-0.04, +0.44] |
| 2019 | 4,433, 84, 1.9 % (1.6 %) | -0.24 [-0.50, +0.04] | 2,016, 86, 4.3 % (4.5 %) | +0.11 [-0.26, +0.52] |
| 2020 | 4,108, 67, 1.6 % (1.9 %) | +0.22 [-0.15, +0.59] | 1,816, 71, 3.9 % (4.0 %) | +0.05 [-0.37, +0.42] |
| 2021 | 4,190, 78, 1.9 % (1.6 %) | -0.19 [-0.47, +0.06] | 2,105, 74, 3.5 % (4.1 %) | +0.25 [-0.07, +0.48] |
| 2022 | 3,893, 86, 2.2 % (1.8 %) | **-0.29 [-0.50, -0.10]** | 2,466, 92, 3.7 % (4.0 %) | +0.10 [-0.23, +0.45] |
| 2023 | 4,379, 72, 1.6 % (1.6 %) | -0.02 [-0.26, +0.31] | 2,074, 75, 3.6 % (3.6 %) | -0.02 [-0.42, +0.34] |
| 2024 | 4,582, 80, 1.7 % (1.6 %) | -0.14 [-0.46, +0.16] | 1,865, 81, 4.3 % (4.5 %) | +0.08 [-0.22, +0.39] |
| 2025 | 3,934, 72, 1.8 % (1.6 %) | -0.16 [-0.47, +0.11] | 2,519, 77, 3.1 % (3.8 %) | +0.36 [-0.07, +0.74] |
| 2026 (Jan-May) | 1,542, 31, 2.0 % (1.9 %) | -0.08 [-0.39, +0.27] | 1,145, 32, 2.8 % (3.3 %) | +0.26 [-0.12, +0.76] |

With the post-hoc traffic rule (`wave3_parta_transition_era.csv`) every offset moves by at most 0.08, and the same cells are significant.

**In 2014-2016 the airport was more 25-biased.**
- It returned to OD 25 faster, and in 2014 it also left OD 25 later.
- From 2017 on, every year is within noise except 2022, when it left OD 25 more readily.
- The state-dependent METAR thresholds show the same pattern.
- The 2014 METAR light-wind coding can explain part of 2014, but not 2015-2016.
- This is a step, not a trend. That fits the finding that the linear `year` term of `fra.decision.ERA` costs 48 h accuracy.

### COVID and suspect-hour handling: the 1,216 confirmed suspect hours (`suspects.py` -> `suspects_*`)

**What "confirmed" means.**
- `fra.history` re-fetches a daytime hour (local 06-21) after at least 30 min if it has fewer than 10 classified movements, or less than 40 % of the same-day median. It marks the hour "confirmed" when the second answer is still low.
- The INAA answers are reproducible:
  - All 1,216 confirmed hours returned the identical movement count twice.
  - In the 1,030 hours where both KML placemark counts are recorded, those are identical too.
  - The 30 COVID probe hours of 31 Oct match the backfill exactly.
- So "confirmed" means "reproducibly low", not "incomplete". 26 more hours were "recovered".

**Where they are.**
- **782 are the first hour after the night ban (06-07 local).** That hour is normally quiet: in the forward file its median is 40 movements, against 63-102 in the other daytime hours, so the same-day rule flags it.
  - Applied to the forward file (which has no suspect rule and feeds the live labels), the old rule would flag 33 of 5,477 daytime hours, 29 of them at 06 local. Only 2 of the 33 are also low against the same hour on the surrounding days.
- **COVID window (Mar 2020 - Dec 2021): 447 confirmed hours.**
  - 401 are valid low-traffic hours; 316 of these were caught only by the 10-movement floor.
  - 23 remain gaps under the traffic rule; 23 have fewer than 4 movements.
  - April-June 2020: 271 confirmed, of which 259 are valid. Their median is 7-8 movements, at 0.7-0.8 times the same hour on the surrounding days.
- **The pre-registered exclusion is direction-selective.**
  - Dropped 06-local hours: 61.9 % OD 25 (771 hours). Kept 06-local hours: 67.3 % OD 25 (3,642 hours).
  - All hours re-admitted by the traffic rule together: 58.3 % OD 25.
  - The effect on the primary comparison is below 0.0001 (both rules in the table above).

| Year | Confirmed | Still gaps (traffic rule) | Re-admitted with OD label | of which < 10 movements | of which 06 local | Median movements | Median ratio to same hour, ±7 days | Part A rows confirmed -> traffic rule (switches) |
|---|---|---|---|---|---|---|---|---|
| 2014 | 30 | 9 | 21 | 0 | 19 | 26 | 0.76 | 6,512 -> 6,553 (197 -> 200) |
| 2015 | 65 | 7 | 58 | 0 | 58 | 27 | 0.88 | 6,435 -> 6,550 (168 -> 170) |
| 2016 | 95 | 6 | 89 | 0 | 89 | 26 | 0.90 | 6,399 -> 6,576 (161 -> 166) |
| 2017 | 110 | 13 | 97 | 0 | 97 | 26 | 0.89 | 6,353 -> 6,545 (136 -> 141) |
| 2018 | 70 | 2 | 68 | 0 | 68 | 28.5 | 0.88 | 6,429 -> 6,565 (193 -> 195) |
| 2019 | 61 | 7 | 54 | 0 | 54 | 29 | 0.84 | 6,449 -> 6,557 (170 -> 174) |
| 2020 | 339 | 19 | 309 | 293 | 89 | 8 | 0.74 | **5,924 -> 6,474 (138 -> 156)** |
| 2021 | 115 | 18 | 97 | 23 | 80 | 12 | 0.76 | 6,295 -> 6,486 (152 -> 158) |
| 2022 | 104 | 3 | 101 | 0 | 100 | 24 | 0.86 | 6,359 -> 6,560 (178 -> 184) |
| 2023 | 74 | 42 | 32 | 0 | 30 | 5 | 0.09 | 6,453 -> 6,517 (147 -> 149) |
| 2024 | 75 | 33 | 42 | 0 | 42 | 22 | 0.65 | 6,447 -> 6,531 (161 -> 163) |
| 2025 | 67 | 30 | 37 | 0 | 32 | 22 | 0.48 | 6,453 -> 6,525 (149 -> 153) |
| 2026 | 11 | 2 | 9 | 0 | 9 | 24 | 0.81 | 5,429 -> 5,447 (139 -> 139) |
| **All** | **1,216** | **191** | **1,014** | 316 | 767 | | | **81,937 -> 83,886 (2,089 -> 2,148)** |

**Post-hoc gap rule `fra.labels.GAP_RULE = "traffic"`.** It is documented in `fra/labels.py`. It was coded after run 1, so it is a sensitivity, not the result of record.
- A confirmed hour stays a label gap only if its movements are also below 40 % of the median of the same local hour on the 7 days before and after. The same day is excluded, and at least 5 reference hours are needed; with fewer, the hour stays a gap.
- Result: 191 gaps on 107 days. They include:
  - the strike days 2023-02-17, 2023-03-27 and 2025-03-10;
  - 0-movement archive outages, e.g. 2021-10-05 (8 h), 2024-10-07 (7 h), 2025-04-11 and 2025-05-24;
  - 2014-03-27 (5 h at 12 movements);
  - quiet holiday hours in 2020-21 (about 15 hours; conservative).
- 1,025 hours are re-admitted: 1,014 with an OD label, and 11 with fewer than 4 movements, which the night-only bridge may carry like a night hour.
  - Their ratio to the same hour on the surrounding days: median 0.85, IQR 0.73-0.93.
- `history_gaps("confirmed")` and `run.py --gap-rule confirmed` reproduce the pre-registered rule.
- The re-fetch rule in `fra.history` is unchanged; only the label exclusion changed. The `fra.history status` line reports both counts.
- Effects of the traffic rule:
  - yearly shares change by ≤ 0.2 pp, except 2020 (all-hours time share 68.5 -> 67.6 %, movement share 75.1 -> 74.8 %);
  - Part A rows +1,949 (+2.4 %) and +59 switches (2020: +550 rows, +9.3 %);
  - the primary comparison changes by less than 0.0001.

**RWY 18 stays strict, now in every `fra` library path.** Every confirmed hour is excluded from RWY 18 judgements, whatever the OD gap rule.
- Reason: in re-admitted 06-local hours under OD 25, "no RWY 18 departure" occurs in 4.0 % of hours (14 of 353), against 0.6 % (13 of 2,277) in kept 06-local hours. Those hours simply have too few departures; they are not closures.
- `run.rwy18_labels` and `h12lib` (`gap18`) already did this.
- New `fra.labels.history_labels()` builds the history labels the way the runner does (complete days, gap rule, night-only bridge) and removes the RWY 18 judgement of every confirmed hour.
- `fra.decision.load_labels(history=True)` uses it, and with it `fit_default(history=True)` and `python -m fra.decision --history`.
  - Until now it used the ffill bridge, which carried the OD straight across removed gap hours.
  - Since GAP_RULE "traffic", it also judged RWY 18 in 622 re-admitted hours.
- `fit_default(history=True)` also drops the COVID window and outage days from its RWY 18 rows (`fra.decision.history_rwy18_filter`), as the walk-forward does.
- Check (fitted with `before=2026-11-01`):
  - OD and `west_frac` are identical to `run.history_labels("traffic")`;
  - 0 RWY 18 judgements in confirmed hours;
  - 83,886 transition rows, 2,148 switches;
  - RWY 18 rows 76,240 (3,271 without a departure) -> 66,974 (868 closures) after the filter;
  - coefficients -8.93, +0.60 per kt, +0.59 for OD 07.
- The live runtime is unaffected (frozen copy, no `GAP_RULE`).

**COVID handling, all implemented.**
- **OD labels:** the pre-registered rule drops 447 confirmed COVID-window hours, 401 of them valid. The traffic rule keeps them.
- **RWY 18:** leaves out the COVID window (`fra.decision.COVID`, Mar 2020 - Dec 2021). In that window, 15-30 movement hours often had no RWY 18 departure without any closure.
- **Outage days:** filtered, including the documented RWY 18 West outage of May 1 to Oct 14, 2020.
- **Decision model:** `hist_era_nocovid` (no COVID rows) ≈ `hist_era`, so the 2020-21 rows neither help nor hurt the decision model.

### Open issues

1. **`experiments/parta/common.load_labels(history=True)` is unchanged.** It is outside this wave's files and is reached only with `PARTA_HISTORY=1` in `experiments/parta/evaluate.py`.
   - It still uses the ffill bridge and the library default gap rule.
   - It makes 622 RWY 18 judgements in confirmed hours.
   - Its OD differs from `history_labels()` in 191 hours.
   - Fix before any such run: `return fra.labels.history_labels()`.
2. **Defaults point at post-hoc choices.**
   - `fra.labels.GAP_RULE = "traffic"` is the default of `run.py`: the plain documented command now writes the post-hoc `wave3_*`.
   - It is also the default of `fra.decision.load_labels(history=True)`.
   - `fit_default(history=True)` adds the `year` + `covid` era terms automatically (`era=None`), and this wave found that they cost accuracy.
   - Owner decision: keep "traffic" as the default, or make `run.py` require `--gap-rule`. Either way, any pre-registered history variant must fix the gap rule, the lag, the logit source and `era` explicitly.
3. **The era-free `hist` blend looks better than `recent`**: -0.0011 [-0.0018, -0.0003] at lag 1 and -0.0011 [-0.0019, -0.0004] at lag 2. It is a secondary set and cannot be promoted. If wanted, pre-register it as a new exploratory shadow and judge it only on holdout issues after its registration:
   - lag 2 via `fra.blend.rollout_many`, `p_logit` as in blend-v2;
   - labels from `fra.labels.history_labels()` with the gap rule fixed in advance;
   - `fit_default(history=True, era=False)`.
4. **Candidate partial RWY 18 outage 2026-04-13..15** (15 closures, 14 below 8 kt). It is kept in, because no works are documented. Without it the skill score is 0.393 instead of 0.386.
5. **The forward file has no suspect rule.** 2026-02-03 15 UTC (5 movements) is a direction label in the live labels, and 2026-10-30 10 UTC has 1 movement. The impact is small; not changed.
6. **Identifier `selection_free`.** The data files keep it, the pre-registration name, so they stay byte-identical to run 1. Prose, stdout and the `subsets` legend call the subset the pre-15-Sep part, which is not selection-free.
7. **Lag-1 vs lag-2 absolute numbers differ in more than the look-ahead** (production logit, path count; see Information set). Only paired differences within one information set are comparable.
8. **Night shares (22-06) cannot be checked**: the backfill has no night hours. The unverified Q1 2024 snippet (70 % vs 76.9 %) remains the only flag against published figures.
9. **METAR coding breaks are not modelled.** These are the 2014 light-wind coding and AUTO METAR from Aug 2022. The 2014-2016 behaviour step is not modelled either. A categorical era term or a 2017+ training window would cover them, but only through pre-registration.

### What follows

1. **No change** to the champion, the runtime or the timer. The holdout stays the referee for blend-v2 against its pre-registered shadows.
2. If a history variant is wanted, pre-register it before it issues any forecast (open issue 3).
3. RWY 18 should train on all history (expanding beats the last 365 days in every era), with the COVID window and outage days excluded, as `fit_default(history=True)` now does. Using that in the live system would change a forecast module, so it needs its own pre-registered runtime.

---

## TL;DR
- **The radar labels match the official figures over 12 years.** All 16 verified daytime comparisons 2014-2025 are within 3 pp: full-year time shares 2014-2018 within 0.17 pp, the 48 monthly values of 2015-2018 within 0.7 pp (MAE 0.17 pp), and Fraport's six-busiest-month (6vM) figures within 0.1-1.7 pp on the movement share. The 2020 6vM figure (79.6 % vs a 72.9 % time share) shows the 6vM figures are movement-weighted.
- **The raw west/(west+east) count ratio is biased low by 2-3.4 pp.** Under OD 25, more departures use Runway 18, and those are classified "south". Shares count every movement of an hour, including RWY 18 departures, for that hour's direction.
- **METAR is reliable.** It reproduces the published METAR wind statistics for 2015-2018 within 0.6 pp in every column. Two coding breaks: AUTO METAR from August 2022, and 2014 light-wind coding (VRB 7.9 % vs 10.6-13.8 %, calm 1.5 %).
- **Suspect hours are reproducibly low, not incomplete.** All 1,216 confirmed hours returned the identical count twice; most are the quiet first hour after the night ban and COVID traffic. The pre-registered labels drop all of them; the post-hoc "traffic" rule keeps 191 (strikes, archive outages). RWY 18 never uses any of them.
- **COVID and runway works are data problems.** Runway 18 West was out of service from about May to 15 Oct 2020, and low-traffic COVID hours often have no RWY 18 departure without any closure; the runner leaves the COVID window out of RWY 18 and filters outage days (now also 2017-05-25/26).
- **Era stability: behaviour is stable within about 1 kt, except a 2014-2016 step** (the airport kept OD 25 longer and returned to it faster) and the 2020 COVID year. Heterogeneity is significant (Q = 41.6, df 12), but no year shifts the tailwind threshold by more than 1 kt.
- **Wave 3: history in the decision model does not clearly win.**
  - The pre-registered primary is -0.0006 [-0.0016, +0.0004], with the same verdict at lag 2 and under the post-hoc gap rule.
  - No shadow challenger was added and the live system is unchanged.
  - An era-free history set (`hist`) is better than `recent` (-0.0011 [-0.0018, -0.0003]), but it was not pre-registered as decisive.
- **RWY 18 walk-forward 2015-2026:** 834 test closures, BSS 0.39, AUC 0.94, 67 % of closures warned at 9.3 false alarms per 1,000 h; expanding training beats the last 365 days.

## 1. Published reference (`published_shares.csv`, `published_monthly_2015_2018.csv`, `published_metar_2015_2018.csv`)

No single source publishes full-year shares for 2014-2025. What exists, with the exact source:

| Years | What | Metric | Source |
|---|---|---|---|
| 2015, 2016, 2017, 2018 | BR 07 share, full year, 05-23 local: 27.0 / 30.9 / 24.5 / 45.9 % (BR 25: 73.0 / 69.1 / 75.5 / 54.1 %), plus all 48 monthly values | **time share** ("sekundengenau", Fraport data) | Umwelthaus (T. Hasselbeck, 12 Mar 2019): https://www.umwelthaus.org/media/betriebsrichtung_und_windverhaeltnisse_in_den_jahren_2015-2018_v2.pdf ; same figures in the FLK presentation below |
| 2014 (and 2002-2013) | BR 07, full year, day 06-22: 31.3 %, night 22-06: 29.9 % (read off a bar chart, ±0.3 pp) | time share ("Häufigkeit", same author and method) | FLK 254th session, 19 Feb 2020, slide 4 (Fraport data): https://www.flk-frankfurt.de/eigene_dateien/sitzungen/254._sitzung_am_19.2.2020/top_3c_-_praes._hr._hasselbeck__betriebsrichtungsverteilung_und_windverhaeltnisse_am_flughafen_frankfurt.pdf |
| 2014-2018 | BR 07 in the 6vM (May-Oct), day and night, read off a scanned chart (±0.5 pp); 2018 "rund 50 %" in the text | 6vM noise-review distribution (DES, "reale Betriebsrichtungsverteilung"), labelled `movement_share_inferred` | Fraport letter of 15 May 2019 to the Hessian ministry: https://wirtschaft.hessen.de/sites/wirtschaft.hessen.de/files/2021-07/begleitschreiben_fraport_5.1.7_2018.pdf |
| 2020 (6vM = Jan-Mar + Aug-Oct), 2021 (6vM = Jul-Dec) | BR 25 day/night 79.6/78.6 %, 69.6/72.5 % | as above | https://wirtschaft.hessen.de/sites/wirtschaft.hessen.de/files/2022-08/2021_anschreiben.pdf |
| 2022 | BR 25 day/night 62.1/62.5 % (May-Oct) | as above | https://wirtschaft.hessen.de/sites/wirtschaft.hessen.de/files/2023-10/2022_anschreiben.pdf |
| 2023 | 60.7/60.4 % | as above | https://wirtschaft.hessen.de/sites/wirtschaft.hessen.de/files/2024-04/informationsschreiben_der_fraport_zur_regelmaessigen_untersuchung_des_fluglaerms_2023.pdf (the FLK resolution of 12 Feb 2025 quotes "lediglich 60%") |
| 2024 | 65.9/66.9 % | as above | https://wirtschaft.hessen.de/sites/wirtschaft.hessen.de/files/2025-07/anschreiben_an_hmwvw_zu_2024.pdf |
| 2025 | 65.8/66.5 % | as above | https://wirtschaft.hessen.de/sites/wirtschaft.hessen.de/files/2026-06/anschreiben_an_hmwvw_zu_2025_final.pdf |
| 2015-2018 | METAR wind statistics 04:50-22:50 local (component from 070° ≥ 0 / ≥ 5 kt, VRB, calm) | wind check | Umwelthaus report, Table 6 (URL above) |
| 2021 full year (67 %), Q1 2024 (70 %), Q1 2025 (51 %), Q3 2025 (67.6 %) | BR 25 | time share | City of Frankfurt Fluglärm-Monitoring quarterly reports (frankfurt.de/fluglaermschutz/...). **Unverified**: only web-search index snippets; the PDFs return HTTP 403 (bot check) |
| Long-term means | "etwa 70 Prozent aller Starts und Landungen" (Fraport); 75/25 (Umwelthaus); "rd. 30 % BR 07" (FLK 2020); 6vM "rund 70 %" (letters on 2021-2023), "rund 67 %" (letters on 2024-2025) | mixed | https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/betriebsrichtung.html , https://www.umwelthaus.org/fluglaerm/basiswissen/betriebsrichtung-und-rueckenwind/ |

Not found: a published 2019 figure. The 2019 6vM letter is not online at the ministry. A web-search snippet of the city's Q4 2019 report says only "in the range of the long-term mean 70/30" (PDF behind the same bot check). Also not found: an official full-year series for 2019-2025. DFS publishes no yearly direction statistics.

**Metric of the 6vM figures.** The letters do not define it; the DES basis suggests movements. 2020 settles it: the radar movement share matches (79.5 vs 79.6 %), the time share does not (72.9 %). In normal years both metrics agree within about 1.5 pp, because traffic per hour is nearly the same under both directions.

## 2. Radar shares vs published (`shares.py` -> `yearly_shares.csv`, `published_compare.csv`, `monthly_compare_2015_2018.csv`, `sampling_error_2026.csv`)

**Method.**
- Two estimators: all fetched daytime hours of the period (headline, available in every year since the backfill is complete), and the pass-1 sample hours only (hour starts 06/12/18 UTC), which every year has the same way.
- Hour label as `fra.labels.to_labels`: west ≥ east among ≥ 4 low-level movements. Label gaps (`fra.labels.history_gaps()`, the default post-hoc "traffic" rule) are excluded; with the pre-registered rule every year changes by ≤ 0.2 pp except 2020 (time share +0.9 pp, movement share +0.3 pp; `suspects_shares.csv`).
- Time share = share of labelled hours in OD 25.
- Movement share = all classified movements of an hour (west + east + RWY 18 departures) assigned to that hour's OD.
- A comparison counts only if ≥ 95 % of the period's days have data. It is flagged when the difference is > 3 pp. The 6vM figures are compared on the movement share.
- Night figures (22-06) cannot be checked: the backfill has no night hours.
- **Sampling error** of the 3/day estimator against all daytime hours, measured on the hourly Feb-Oct 2026 data: monthly RMS 0.63 pp (time share), 0.87 pp (movement share).

| Year | Period, local hours | Published OD 25 | Source metric | Radar time share | Radar movement share | Diff time / movement (pp) | Flag |
|---|---|---|---|---|---|---|---|
| 2014 | full year, 06-22 | 68.7 % | time | 68.5 % | 67.4 % | -0.2 / -1.3 | ok |
| 2015 | full year, 05-23 | 73.0 % | time | 73.0 % | 71.5 % | +0.0 / -1.5 | ok |
| 2016 | full year, 05-23 | 69.1 % | time | 69.0 % | 67.9 % | -0.0 / -1.2 | ok |
| 2017 | full year, 05-23 | 75.5 % | time | 75.6 % | 75.4 % | +0.1 / -0.1 | ok |
| 2018 | full year, 05-23 | 54.1 % | time | 54.0 % | 52.8 % | -0.1 / -1.3 | ok |
| 2014 | 6vM, 06-22 | 66.2 % | 6vM (movements) | 65.9 % | 64.5 % | -0.3 / -1.7 | ok |
| 2015 | 6vM, 06-22 | 67.5 % | 6vM (movements) | 67.4 % | 66.6 % | -0.1 / -0.9 | ok |
| 2016 | 6vM, 06-22 | 67.2 % | 6vM (movements) | 66.9 % | 66.0 % | -0.3 / -1.2 | ok |
| 2017 | 6vM, 06-22 | 78.9 % | 6vM (movements) | 78.8 % | 78.6 % | -0.1 / -0.3 | ok |
| 2018 | 6vM, 06-22 | 50.5 % | 6vM (movements) | 49.6 % | 49.1 % | -0.9 / -1.4 | ok |
| 2020 | 6vM, 06-22 | 79.6 % | 6vM (movements) | 72.9 % | 79.5 % | -6.7 / -0.1 | ok |
| 2021 | 6vM, 06-22 | 69.6 % | 6vM (movements) | 69.7 % | 69.2 % | +0.1 / -0.4 | ok |
| 2022 | 6vM, 06-22 | 62.1 % | 6vM (movements) | 62.3 % | 61.8 % | +0.2 / -0.3 | ok |
| 2023 | 6vM, 06-22 | 60.7 % | 6vM (movements) | 60.5 % | 60.6 % | -0.2 / -0.1 | ok |
| 2024 | 6vM, 06-22 | 65.9 % | 6vM (movements) | 66.0 % | 65.6 % | +0.1 / -0.3 | ok |
| 2025 | 6vM, 06-22 | 65.8 % | 6vM (movements) | 66.0 % | 65.1 % | +0.2 / -0.7 | ok |
| 2021 | full year, all | 67.0 % | time, unverified | 66.6 % | 66.5 % | -0.4 / -0.5 | ok |
| 2024 | Q1, all | 70.0 % | time, unverified | 76.9 % | 77.4 % | +6.9 / +7.4 | **DIFF > 3 pp** |
| 2025 | Q1, all | 51.0 % | time, unverified | 51.8 % | 50.4 % | +0.8 / -0.6 | ok |
| 2025 | Q3, all | 67.6 % | time, unverified | 68.9 % | 68.0 % | +1.3 / +0.4 | ok |

- The 48 monthly BR 07 values of 2015-2018 (`monthly_compare_2015_2018.csv`): MAE 0.17 pp, maximum 0.68 pp (April 2017), r = 0.9999; with the pass-1 hours only, MAE 0.84 pp, maximum 4.2 pp.
- The only flag is the **unverified** Q1 2024 snippet. METAR supports the radar: in Jan-Mar 2024 only 15 / 9 / 22 % of sampled hours had more than 5 kt tailwind on 25, and the radar shows 74 / 87 / 71 % OD 25.

**Yearly radar shares and coverage (all daytime hours; 2026 to 31 Oct):**

| Year | Daytime hours fetched | Mean moves/h (pass 1) | < 4 / < 10 / < 15 moves (pass 1) | RWY 18 judged | Judged hours without RWY 18 departure | Confirmed suspect hours | OD gap hours (traffic rule) | Time share OD 25 | Movement share OD 25 |
|---|---|---|---|---|---|---|---|---|---|
| 2014 | 6,935 | 58.7 | 0.0 / 0.0 / 0.0 % | 6,107 | 34 | 30 | 9 | 68.7 % | 67.5 % |
| 2015 | 6,935 | 58.3 | 0.0 / 0.0 / 0.2 % | 6,067 | 117 | 65 | 7 | 73.0 % | 71.5 % |
| 2016 | 6,954 | 56.7 | 0.0 / 0.0 / 0.2 % | 6,085 | 85 | 95 | 6 | 69.0 % | 67.9 % |
| 2017 | 6,935 | 57.8 | 0.0 / 0.0 / 0.0 % | 6,073 | 56 | 110 | 13 | 75.6 % | 75.4 % |
| 2018 | 6,935 | 63.1 | 0.0 / 0.0 / 0.0 % | 6,134 | 193 | 70 | 2 | 54.0 % | 52.8 % |
| 2019 | 6,935 | 62.2 | 0.0 / 0.0 / 0.0 % | 6,118 | 66 | 61 | 7 | 68.5 % | 67.6 % |
| 2020 | 6,954 | 29.7 | 0.1 / 5.3 / 15.9 % | 4,795 | 2,281 | 339 | 19 | 67.6 % | 74.8 % |
| 2021 | 6,935 | 35.0 | 0.0 / 0.9 / 6.5 % | 5,422 | 91 | 115 | 18 | 66.6 % | 66.5 % |
| 2022 | 6,935 | 46.7 | 0.0 / 0.0 / 0.1 % | 6,023 | 72 | 104 | 3 | 60.9 % | 60.0 % |
| 2023 | 6,935 | 52.6 | 0.0 / 0.0 / 0.0 % | 6,103 | 113 | 74 | 42 | 68.0 % | 67.5 % |
| 2024 | 6,954 | 55.0 | 0.0 / 0.0 / 0.1 % | 6,099 | 55 | 75 | 33 | 70.9 % | 70.4 % |
| 2025 | 6,935 | 57.2 | 0.0 / 0.0 / 0.1 % | 6,101 | 79 | 67 | 30 | 60.9 % | 60.4 % |
| 2026 | 5,775 | 58.9 | 0.0 / 0.0 / 0.0 % | 5,124 | 29 | 11 | 2 | 62.6 % | 62.9 % |

- 2018 (record east year), 2022, 2025 and 2026 were east-heavy against the ~67-70 % long-term mean; 2017 was the most west-heavy year (October 2017: 0.0 % BR 07 published).
- 2020: the time share (67.6 %) and movement share (74.8 %) differ by 7 pp because the busy Jan-Mar was 25-heavy and the rest of the year quiet.
- "Judged hours without RWY 18 departure" in 2020 (2,281) is mostly the runway's COVID outage, not wind.

## 3. Coverage, source gaps, COVID

- **Coverage:** every daytime hour (hour starts 03-21 UTC, 19 per day) of 2014-01-01 .. 2026-02-10 is fetched, every day complete. Outside 2020-21, practically every hour is OD-labelled and about 88 % are RWY 18-judged (the first hours after the night ban never are).
- **Source gaps:** 1,216 confirmed suspect hours, all reproducibly low (see Wave 3, suspect hours). They include the strike days 2023-02-17, 2023-03-27 and 2025-03-10, the 2024-01-17 afternoon hours (8 movements, probably the freezing-rain shutdown), 0-movement archive outages, the quiet first hour after the night ban and COVID traffic. Strike days are real traffic collapses: dropping them from OD labels is right; they never become RWY 18 "closures" (< 15 movements, and every confirmed hour is excluded from RWY 18).
- **COVID** (`covid_probe.py` -> `covid_probe.csv`, 30 pass-1 hours fetched on 31 Oct; the full backfill matches them exactly):

| Sample | Movements per sampled hour | OD labelled (≥ 4) | RWY 18 judged (≥ 15) | Note |
|---|---|---|---|---|
| 2019-04-16 (reference) | 58-71 | 3/3 | 3/3 | RWY 18 used (21-26 deps) |
| 2020-04-15, 04-22 | 9-14 | 6/6 | 0/6 | 4 of 6 have < 10 movements: "confirmed" suspects, dropped by the pre-registered gap rule, re-admitted by the traffic rule |
| 2020-05-13, 06-17 | 13-31 | 6/6 | 5/6 | **0 RWY 18 departures in all 6** (runway out of service about May to 15 Oct 2020) |
| 2020-11-18 .. 2021-06-16 | 12-39 | 12/12 | 10/12 | RWY 18 used again; one 16-movement 07-local hour without RWY 18 at -6 kt is non-use, not a closure |
| 2021-09-15 | 23-50 | 3/3 | 3/3 | recovering |

  Consequences, all implemented:
  1. COVID OD labels: the pre-registered rule drops 447 confirmed COVID-window hours, 401 of them valid (the post-hoc traffic rule keeps them).
  2. RWY 18 outage filter (`fra.decision.rwy18_outage_days`): a day where all ≥ 2 judged hours were closed and at least one had < 8 kt tailwind on 18, or ≥ 90 % of ≥ 8 judged hours closed with at least half of the closures below 8 kt, plus the documented May 1 to Oct 14, 2020 window. Outside COVID it finds 2017-05-25 and 2017-05-26 (runway works).
  3. RWY 18 leaves out the COVID window (`fra.decision.COVID`).

  Training never uses outage days. Test metrics are reported with and without them, because dropping them from a test set selects on the outcome.

## 4. Era stability (`era.py` -> `era_*.csv`, `era_summary.json`; 2014-2026, pass-1 hours)

**P(OD 07 | METAR tailwind on 25)** (wind = mean of the two METARs bracketing the hour; CIs from a week-block bootstrap with 400 resamples; bold: CI excludes the pooled behaviour):

| Year | Hours | OD 07 share | Share tw25 > 5 kt | Slope (1/kt) [95 % CI] | x50 kt [95 % CI] | Shift vs pooled, kt [CI] |
|---|---|---|---|---|---|---|
| 2014 | 1,092 | 30.9 % | 17.0 % | 0.92 [0.82, 1.09] | 2.46 [2.04, 2.88] | **+0.91 [+0.47, +1.33]** |
| 2015 | 1,095 | 26.9 % | 16.6 % | 0.88 [0.78, 1.05] | 1.96 [1.47, 2.53] | +0.41 [-0.08, +0.98] |
| 2016 | 1,098 | 31.0 % | 17.2 % | 0.99 [0.86, 1.16] | 1.61 [1.28, 1.97] | +0.12 [-0.22, +0.47] |
| 2017 | 1,090 | 24.6 % | 13.9 % | 0.83 [0.72, 0.98] | 1.89 [1.45, 2.31] | +0.29 [-0.13, +0.71] |
| 2018 | 1,095 | 46.2 % | 26.4 % | 0.83 [0.74, 0.96] | 0.93 [0.49, 1.42] | **-0.65 [-1.07, -0.17]** |
| 2019 | 1,095 | 31.2 % | 17.0 % | 0.94 [0.79, 1.17] | 1.31 [0.94, 1.69] | -0.20 [-0.57, +0.19] |
| 2020 | 1,094 | 31.9 % | 17.7 % | 0.80 [0.71, 0.92] | 1.97 [1.44, 2.44] | +0.36 [-0.15, +0.81] |
| 2021 | 1,090 | 33.5 % | 14.8 % | 0.87 [0.79, 0.99] | 1.29 [0.91, 1.76] | -0.28 [-0.64, +0.15] |
| 2022 | 1,094 | 39.1 % | 19.2 % | 0.90 [0.81, 1.04] | 1.03 [0.52, 1.56] | -0.52 [-1.02, +0.02] |
| 2023 | 1,086 | 31.7 % | 18.6 % | 0.88 [0.77, 1.02] | 1.67 [1.28, 2.07] | +0.11 [-0.29, +0.51] |
| 2024 | 1,092 | 28.8 % | 16.4 % | 0.75 [0.67, 0.88] | 1.81 [1.40, 2.23] | +0.15 [-0.25, +0.59] |
| 2025 | 1,089 | 39.5 % | 20.7 % | 0.91 [0.80, 1.08] | 1.35 [0.88, 1.88] | -0.20 [-0.66, +0.30] |
| 2026 | 911 | 37.9 % | 19.8 % | 0.83 [0.75, 0.95] | 1.12 [0.67, 1.56] | **-0.47 [-0.92, -0.03]** |

- Pooled: x50 = 1.58 kt, slope 0.85/kt. Heterogeneity of the per-year offsets: Q = 41.6, df 12, p = 4e-5. No shift exceeds 1 kt.
- The unconditional curve also depends on how persistent the weather was in a year (hysteresis; 2018 was a record east year). The cleaner measure is state-dependent: same-day sample pairs 6 h apart.

| Year | Leave 25 (prev. OD 25): x50 kt [CI] (pairs, switches) | Return to 25 (prev. OD 07): x50 kt [CI] (pairs, switches) |
|---|---|---|
| 2014 | 4.33 [3.54, 5.16] (498, 30) | 0.35 [-0.27, 1.02] (229, 48) |
| 2015 | 3.45 [2.29, 4.73] (526, 25) | -0.21 [-0.80, 0.37] (204, 43) |
| 2016 | 2.65 [2.06, 3.23] (505, 31) | -0.67 [-1.43, 0.11] (227, 32) |
| 2017 | 3.32 [2.37, 4.51] (552, 35) | -0.64 [-1.26, -0.13] (172, 28) |
| 2018 | 2.43 [1.46, 3.36] (392, 40) | -1.00 [-1.93, -0.23] (338, 48) |
| 2019 | 2.74 [1.93, 3.56] (493, 16) | -1.29 [-2.38, -0.26] (237, 37) |
| 2020 | 4.42 [3.54, 5.15] (496, 27) | -0.97 [-1.88, -0.26] (232, 33) |
| 2021 | 3.12 [2.33, 4.04] (482, 32) | -1.14 [-1.81, -0.63] (244, 33) |
| 2022 | 2.90 [2.21, 3.81] (437, 25) | -1.01 [-1.68, -0.20] (292, 47) |
| 2023 | 2.99 [2.46, 3.65] (489, 27) | -0.50 [-1.14, 0.07] (233, 38) |
| 2024 | 3.43 [2.75, 3.98] (509, 29) | -0.44 [-1.77, 0.67] (215, 44) |
| 2025 | 3.08 [2.31, 4.01] (438, 29) | -0.74 [-1.27, -0.22] (286, 38) |
| 2026 | 2.27 [1.30, 3.14] (376, 31) | -1.17 [-2.29, -0.36] (231, 40) |
| pooled | 3.31 (6,193, 377) | -0.76 (3,140, 509) |

The hysteresis band (about -0.8 to +3.3 kt in hour-mean METAR) sits below the published 5 kt rule, consistent with the tower anticipating the wind (FLK 2020: the switch happens when the 070° component "reaches 5 kt"; DFS: "Wind ≠ Wind", the decision uses its own runway anemometers and forecasts). 2014 and 2020 have the widest band.

**METAR stability (`metar_check.csv`).** Our METAR reproduces the published 2015-2018 table to within 0.6 pp: component from 070° ≥ 0 kt 30.8/34.5/27.6/45.1 % vs 30.7/34.3/27.1/44.8 %; ≥ 5 kt 17.0/18.5/13.5/27.8 vs 16.9/18.6/13.5/27.4; VRB 11.4/11.5/11.9/11.7 vs 11.3/11.2/12.3/12.1; calm likewise. Two breaks:
1. **AUTO METAR from Aug 2022** (38 % of 2022 reports, 100 % from 2023). No visible jump in VRB/calm/gust shares, but it is a measurement-chain change inside the training span.
2. **2014 light winds:** VRB 7.9 % (10.6-13.8 % in other years) and calm 1.5 % in 2014, 1.0 % in 2015 (≤ 0.3 % later). ERA5 does not show a 2014 excess of light tailwind, so part of it is coding.

**RWY 18 by year** (all fetched judged hours with a flown OD; outage days excluded; offsets against the pooled logistic fitted outside the COVID window):

| Year | Judged | Closed | Judged OD 07 | Closed OD 07 | of which tw18 < 8 kt | OD 07 hours tw18 ≥ 12 kt | closed there | Offset vs pooled [CI] | Outage days (hours) excluded |
|---|---|---|---|---|---|---|---|---|---|
| 2014 | 6,103 | 34 | 1,937 | 33 | 1 | 35 | 19 (54 %) | -0.49 [-1.96, +0.06] | 0 |
| 2015 | 6,062 | 117 | 1,658 | 104 | 2 | 99 | 72 (73 %) | +0.37 [-0.26, +0.89] | 0 |
| 2016 | 6,082 | 85 | 1,911 | 76 | 1 | 84 | 56 (67 %) | -0.09 [-0.61, +0.33] | 0 |
| 2017 | 6,028 | 23 | 1,441 | 16 | 3 | 13 | 5 (38 %) | -0.26 [-2.27, +0.63] | 2 (34) |
| 2018 | 6,117 | 193 | 2,829 | 189 | 2 | 207 | 133 (64 %) | +0.21 [-0.12, +0.52] | 0 |
| 2019 | 6,115 | 66 | 1,922 | 61 | 2 | 54 | 38 (70 %) | -0.04 [-1.09, +0.42] | 0 |
| 2020 | 2,418 | 333 | 485 | 126 | 88 | 25 | 15 (60 %) | +5.97 [+4.87, +6.74] | 182 (2,377) |
| 2021 | 5,417 | 91 | 1,867 | 59 | 18 | 23 | 9 (39 %) | +0.79 [+0.27, +1.30] | 0 |
| 2022 | 6,013 | 72 | 2,355 | 65 | 7 | 47 | 35 (74 %) | +0.15 [-1.38, +0.65] | 0 |
| 2023 | 6,103 | 113 | 1,968 | 107 | 6 | 99 | 65 (66 %) | +0.16 [-0.27, +0.58] | 0 |
| 2024 | 6,099 | 55 | 1,773 | 53 | 8 | 77 | 26 (34 %) | -0.29 [-1.04, +0.40] | 0 |
| 2025 | 6,101 | 79 | 2,396 | 77 | 2 | 93 | 57 (61 %) | -0.23 [-0.96, +0.20] | 0 |
| 2026 | 5,115 | 29 | 1,908 | 26 | 13 | 27 | 6 (22 %) | -0.45 [-3.05, +0.52] | 0 |

- Pooled logistic (outside COVID, outage days excluded; 66,923 hours, 868 closed): P(closed | OD 07) = 10 / 28 / 73 / 95 % at 10 / 12 / 15 / 18 kt steady tailwind on 18.
- No year outside COVID differs significantly. 2026 has a lower closure rate in strong tailwind (6 of 27 hours) and more non-wind closures (13 of 26 under OD 07 at < 8 kt, most of them in the 2026-04-13..15 cluster): worth watching, not evidence.

**Does a pooled model need era terms?**
- **For behaviour: only a step, not a trend.** 2014-2016 were more 25-biased (transition offsets above), 2014 and 2020 had higher leave-25 thresholds; from 2017 on, years are within noise. A linear `year` term has the wrong shape and costs 48 h accuracy (Wave 3).
- **For the data:** COVID (traffic, the RWY 18 outage, Northwest runway closures 23 Mar to 8 Jul 2020 and 14 Dec 2020 to about Jun 2021) and METAR coding (2014 light winds, AUTO from Aug 2022).
- The available hook (`fra.decision.ERA` = linear year trend + COVID flag) covers COVID but neither the 2014-2016 step nor the METAR breaks. A categorical era feature (or a 2017+ window) would, but only through pre-registration.

## 5. Wave-3 runner (`run.py`)

**What it does:** steps `qa`, `labels`, `parta`, `rwy18`, `lag2` (all by default). Outputs carry the prefix `wave3_` (complete backfill), `forced_` (`--force` on an incomplete one) or `dryrun_`; a gap rule other than `fra.labels.GAP_RULE` adds `<rule>gaps_` (so `--gap-rule confirmed` writes `wave3_confirmedgaps_*`, the pre-registered analysis). Without `--dry-run`/`--force` it refuses while the backfill is incomplete. Each results JSON carries `role`, `preregistered_output`, `subsets`, `information_set`, `step_runs` and, if Part A outputs exist, `verdict` (the "clearly wins" check). Each run appends to `run_manifest.jsonl` (sha256 of outputs before and after, code hashes).

**(a) Labels:** `load_counts(include_history=True, complete_only=True, gap_rule)`: complete history days only, label gaps removed; then `to_labels(bridge="night")`, which never bridges an unfetched or removed daytime hour. `fra.labels.history_labels()` builds the same OD labels for library callers (with RWY 18 judgements removed in confirmed hours).

**(b)+(c) Part A (pre-registered):**
- Model: `fra.decision.DEFAULT` (logit C 0.1, 10 m wind, BASE + F6), weekly folds from 2026-06-01. Training rows have h + 6 h ≤ week start. Scoring uses the production test rows of `experiments/parta/prod_preds.parquet` (hackathon lag-1 information set), valid < holdout.
- Four training sets: `recent` (data/labels.parquet), `hist` (2014+), `hist_era` (2014+ plus `fra.decision.ERA`), `hist_era_nocovid` (without `fra.decision.COVID` rows).
- Each is rolled out on the observed wind ("perfect") and on Part B paths (`fra.fcerror.sample_paths`, DEFAULT params at run time, 100 paths, seed 0, ensemble-mean look-ahead), and blended 50/50 with production.
- Paired day-block bootstrap (`fra.evalkit.bootstrap`) on all rows and on the pre-15-Sep part (identifier `selection_free`).
- **Primary comparison, fixed before any history result:** Brier(1,6,24,48) of blend(`hist_era` on Part B) minus blend(`recent` on Part B).
- Also written: per-year transition behaviour of the pooled `hist` model and the weekly coefficients, including the `year`/`covid` era coefficients.

**(d) RWY 18 extended walk-forward:** quarterly folds from 2015-01-01 to the holdout, all fetched judged hours (a judged hour needs no complete day) with the hour's own flown OD and observed wind; every confirmed suspect hour, the COVID window and outage days excluded from training. `Rwy18Model` expanding vs last 365 days vs climatology vs the steady/gust 15 kt rules; Brier, BSS, AUC, hits and false alarms per 1,000 h at P(open) < 0.8, per era and for the Jun-Oct 2026 window, plus a paired bootstrap.

**(e) Lag-2 sensitivity:** see Wave 3, information set.

**Dry run of 31 Oct** (partial backfill, 49 s): reproduced wave 1 exactly (production 0.0428, Part A perfect wind 0.0356, blend on Part B 0.0386, blend minus production -0.0042 [-0.0068, -0.0021]); `hist` = `recent` row for row because no history day was complete yet (the intended plumbing check). Files `dryrun_*`.

## 6. Exact wave-3 commands

```bash
cd /home/jonas/.t3/projects/fraalliance-hackmeck
export OMP_NUM_THREADS=1 OPENBLAS_NUM_THREADS=1 MKL_NUM_THREADS=1

uv run python -m fra.history status                         # complete since 2 Nov

# the pre-registered analysis (as documented on 31 Oct; every confirmed suspect hour is a label gap)
uv run python experiments/history12/run.py --gap-rule confirmed    # -> wave3_confirmedgaps_* (~3 min, 4 workers)

# post-hoc sensitivity with the "traffic" gap rule (fra.labels.GAP_RULE); also refreshes the shared qa files
uv run python experiments/history12/run.py                         # -> wave3_*, yearly_shares.csv, era_*.csv, ...

# only some steps (merged into the existing results JSON, recorded in step_runs and run_manifest.jsonl)
uv run python experiments/history12/run.py --gap-rule confirmed --steps rwy18,lag2

# suspect-hour analysis
uv run python experiments/history12/suspects.py              # -> suspects_*
```
- The plain command of 31 Oct (`run.py` without `--gap-rule`) now runs the post-hoc rule; use `--gap-rule confirmed` for the pre-registered analysis.
- Do not tune on the result. The PRIMARY comparison is the only pre-registered one. The other training sets, the perfect-wind rows, the lag-2 step and the traffic rule are diagnostics; the 2026-11-01 holdout is the referee.
- Re-running with `--gap-rule confirmed` rewrites `wave3_confirmedgaps_*`; run 1's outputs stay verifiable through `wave3_run1_*` and the sha256 in `wave3_provenance.json`.

## 7. Conclusions
1. The radar history can be trusted for direction shares over 12 years: all 16 verified official daytime figures within 3 pp (full-year time shares within 0.17 pp, monthly values MAE 0.17 pp), METAR within 0.6 pp of the published wind statistics.
2. Use the time share, or the movement share including RWY 18 departures. Never use the west/east count ratio (2-3 pp low). Fraport's 6vM figures are movement-weighted.
3. Confirmed suspect hours are reproducibly low; most are valid quiet hours. Any future use of history labels must fix the gap rule in advance. RWY 18 must exclude all of them, the COVID window and outage days (done in every library path except `experiments/parta/common.py`).
4. The decision behaviour is stable within about 1 kt; there is a 2014-2016 step, not a trend.
   - 12 years of history improve the decision model with observed wind.
   - The pre-registered history variant (with linear era terms) does not clearly improve the blend. So nothing changes in the live system, and no shadow was added.
   - An era-free variant looks better. It would need its own pre-registration, judged at lag 2 on holdout issues after its registration.
5. RWY 18 should train on all history (expanding beats 365 days in every era).

## Files (experiments/history12/)
- Code:
  - `h12lib.py` (hour table, wind, logistic/bootstrap helpers; outage days from `fra.decision`)
  - `shares.py` (published shares), `era.py` (era stability), `suspects.py` (confirmed suspect hours)
  - `run.py` (wave-3 runner)
  - `covid_probe.py`
- Reference: `published_shares.csv`, `published_monthly_2015_2018.csv`, `published_metar_2015_2018.csv`.
- Results:
  - `yearly_shares.csv`, `published_compare.csv`, `monthly_compare_2015_2018.csv`, `sampling_error_2026.csv`, `metar_check.csv`, `shares_summary.json`
  - `era_bins.csv`, `era_thresholds.csv`, `era_state_thresholds.csv`, `era_rwy18_bins.csv`, `era_rwy18_years.csv`, `era_summary.json`
  - `suspects_hours.csv`, `suspects_by_year.csv`, `suspects_by_month_covid.csv`, `suspects_by_local_hour.csv`, `suspects_shares.csv`, `suspects_rows.csv`, `suspects_summary.json`
  - `covid_probe.csv`
  - **Result of record:** `wave3_confirmedgaps_*` (results JSON with `verdict`, Part A bootstrap/preds/coefficients/transition era, RWY 18 walk-forward and bootstrap after the outage-filter fix, lag-2 preds and bootstrap; `wave3_confirmedgaps_run.log` = run 1's stdout)
  - Post-hoc sensitivity: `wave3_*` (same files, traffic gap rule; `wave3_run.log`)
  - Provenance: `wave3_run1_results.json` (run 1's results JSON), `wave3_run1_rwy18_walkforward.parquet` and `wave3_run1_rwy18_bootstrap.csv` (run 1's RWY 18 outputs, before the outage-filter fix), `wave3_provenance.json` (timeline, sha256 of run 1 vs run 3, preserved run-1 RWY 18 files), `run_manifest.jsonl`, `wave3_fixes_run.log` (stdout of the post-review fix runs)
  - `dryrun_*` (31 Oct dry run)
