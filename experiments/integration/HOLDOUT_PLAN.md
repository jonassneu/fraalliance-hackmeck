# Holdout plan: the live comparison of the forecast variants (pre-registered)

Written on 31 Oct 2026. The plan is fixed in `experiments/integration/preregistration.json` (written 2026-10-31 18:13:14 UTC). The analysis settings are in `holdout_plan.json`. The locked holdout starts with issue time **2026-11-01 00:00 UTC**. No issue time from then on was used for any choice described here.

## What runs live

Every hour (`fra-archive.timer`, at :12 local time), the live job issues one **official forecast**. That is the champion of the variant registry (`data/archive/variants.json`).

Right after it, each **challenger** issues a **shadow forecast** for the same hour. Each one runs in its own frozen code snapshot and in its own process. All of them use:
- the same snapshot of the published prognosis;
- the same radar hours the official run fetched.

Forecasts are never backfilled. An hour that was missed stays missing.

| Variant | Role | Code (runtime) | What it is |
|---|---|---|---|
| **blend-v2** | champion (official) | `2026-10-31-wave2-r2` | 0.5 × production logit + 0.5 × hourly decision model, rolled out on 200 simulated wind paths. The next change comes from the hysteresis rule on the blend; RWY 18 comes from the logit. |
| logit-v2 | challenger | `2026-10-31-wave2-r2` | The same logit alone, with the same code and data layer. |
| logit-v1 | challenger | `2026-10-31-wave1-r2` | The previous official system, unchanged. Its model was pinned on 31 Oct 14:39 UTC. It takes od_now from the newest, partly published radar hour and uses the stitched live ECMWF forecast. |
| hackathon | challenger | `2026-10-31-wave1` | The frozen hackathon model of 30 Oct 2026. |

**Model files** (read-only copies under `data/archive/models/<variant>/`; sha256):
- **blend-v2 logit = logit-v2:** `e67b55b9c6a71b17b1cff5da473abb34e90ebba2a50fc03b141ad5358695198b`
  - lag-2 data layer, ICON-EU fill, 48 leads, clean labels;
  - fitted on labels up to 2026-10-30 11:00 UTC.
- **blend-v2 decision bundle:** `a9e3f00f42096caf62681a051cdb9e3d8d505b198dacef69e1cfdd0f97d331e7`
- **logit-v1:** `d152a9b32edb952bb708cf91dc1df1fdba256c4ce72be67af549a76a35c056f8`
- **hackathon:** `863661b237f8a8b3c78bb9ef1b4538f03f42758936b06a1e6a55afe2e503930a`

The registry pins these hashes; a file that does not match is not used.

`preregistration.json` also records:
- the sha256 of every forecast module in each runtime;
- the runtime manifests (git HEAD and which files differ from it).

**Why blend-v2 is the champion.** The rule fixed before this step was: the blend becomes champion only if it beats the production logit on the long walk-forward test. It does:
- Long test (152 days): Brier(1,6,24,48) −0.0041 [−0.0067, −0.0018].
- Selection-free part (valid before 15 Sep): −0.0043 [−0.0073, −0.0016].

These were recomputed from scratch on 31 Oct and match the integration run exactly.

## Truth

The truth is the operating direction actually flown in the radar hour that starts at the valid time. It comes from the INAA FANOMOS radar counts that the live job appends every hour (`fra.labels.to_labels(load_counts())`):
- The direction is the majority of movements, if an hour has at least 4.
- It is carried through the night ban for up to 8 h.
- RWY 18 is judged only in busy hours (at least 15 movements, from 06 local).

Hours that are added late or corrected are picked up automatically. Unlabelled hours are not scored.

## Primary analysis

- **Question:** does the blend beat the same logit on its own when both are issued live?
- **Metric:** Brier score of P(OD 25), pooled over leads 1, 6, 24 and 48 h.
- **Comparison:** blend-v2 minus logit-v2, on identical rows. These are the issue hours both variants issued, with a label at the valid hour. A negative value means the blend is better.
- **Uncertainty:** 95 % day-block bootstrap. The blocks are UTC days of the valid time, with 2000 draws and seed 20261031. Differences are paired: both variants are scored on the same resampled days.
- **Window:** issue times 2026-11-01 00:00 to 2026-11-28 23:00 UTC (4 weeks).
  - It is evaluated once every horizon is labelled, not before 2026-12-01 08:00 UTC.
  - `python -m fra.scoring` computes it every hour into `data/archive/live_record_variants.json`. The value is at `windows.holdout_4w.pairs["logit-v2"].od.pooled["blend-v2 - logit-v2"].brier`.

### Decision rule

1. **Confirm.** If the whole CI of the difference lies below 0 at 4 weeks, blend-v2 is confirmed as champion.
2. **Demote.** If the whole CI lies above 0, blend-v2 is demoted. logit-v2 becomes champion and blend-v2 continues as a challenger.
3. **Inconclusive.** If the CI includes 0, blend-v2 stays champion and the window is extended to 8 weeks (issues up to 2026-12-26 23:00 UTC, evaluated from 2026-12-29 08:00 UTC). At 8 weeks:
   - confirm if the CI lies below 0;
   - demote if the CI lies above 0 **or** the point estimate is above 0;
   - otherwise blend-v2 stays.

On the long test, the CI half-width of this difference was about 0.0025 over 152 days. Over 4 weeks expect about 0.006, over 8 weeks about 0.004. A true gain of the size seen in the backtest (−0.004) will therefore often be inconclusive at 4 weeks. Rule 3 then falls back to the choice from the long test, unless the live data turn against it.

## Secondary and descriptive results

Secondary metrics never override the primary rule. They are reported with the decision, and they can only motivate a new, pre-registered variant.

**Secondary metrics:**
- **Accuracy at 24 h:** paired, with the same bootstrap.
- **Event accuracy of the next change,** using the `fra.changetime` definitions:
  - an actual change lasts at least 2 flown hours;
  - a predicted change counts as a hit within ±3 h;
  - "no change" predicted and observed counts as correct.
  
  It is scored per variant on the common issue hours whose 48 h horizon is fully labelled. On the long test: blend 80.2 % (nested), logit 79.1 %.
- **RWY 18 warnings,** at P(RWY 18 open) < 0.8 at any lead:
  - closure hours flagged, and false alarms per 1,000 hours;
  - RWY 18 Brier.
  
  blend-v2 and logit-v2 share the RWY 18 logit, so this mainly compares the new logit with logit-v1 and hackathon. Closures are rare (34 closure hours in 14 months), so this stays descriptive unless at least 10 closure hours occur.
- **Other leads:** Brier over all 48 leads, and accuracy at 1, 6 and 48 h.
- **Hours where the direction changed,** at 1 h and 6 h. On the long test the blend was worse at 6 h: −5.8 pp [−10.4, −2.2]. This is watched, not decided on.

**Descriptive only:**
- The new variants against logit-v1 and hackathon. Their backtests are not comparable: logit-v1's backtest read a radar hour that is not complete at issue time.
- All variants against the published INAA prognosis, the official rules and persistence.
- Coverage.
- The blend's fallback rate: hours in which the decision part failed and the logit was issued.
- The two od_now checks:
  - agreement with the hour od_now is now taken from, [t-2h, t-1h);
  - agreement with the newest hour [t-1h, t), as a measure of how stale od_now is.

## What is fixed, what may change

**Fixed for the whole holdout:**
- every model file (no retraining; the weekly retrain timer stays disabled);
- the forecast code of each variant;
- the blend settings:
  - weight 0.5;
  - 200 paths;
  - the default parameters of the simulated wind paths;
  - the change-time rule;
  - the source of the RWY 18 forecast;
- the data layer: od_now from the last complete radar hour, ICON-EU fill, as-of rules for the model runs;
- this analysis plan.

**Allowed:**
- Changes to scoring, reports and the site that leave the issued forecasts unchanged.
- Operations fixes that keep the hourly job running. If such a fix changes the forecast code or a model of a variant, that variant gets a new name and its record restarts. The comparison is then made separately before and after the change.

**Handling:**
- Missing hours are not filled in.
- An hour in which the blend fell back to the logit still counts as blend-v2.
- A challenger hour that failed or timed out is missing for that pair.

## Evidence behind the plan (long walk-forward test, 2026-06-01 .. 2026-10-30)

| | Acc 1 h | Acc 6 h | Acc 24 h | Acc 48 h | Brier(1,6,24,48) |
|---|---|---|---|---|---|
| Blend (blend-v2) | 96.8 | 94.9 | 94.7 | 93.0 | 0.0389 [0.0296, 0.0481] |
| Logit (logit-v2) | 95.5 | 94.6 | 94.1 | 92.9 | 0.0429 [0.0328, 0.0531] |
| Published prognosis | 93.7 | 92.9 | 91.2 | 89.2 | 0.0823 |
| Official rules | 91.0 | 90.2 | 88.5 | 87.0 | 0.1082 |
| Persistence | 94.4 | 87.7 | 75.3 | 65.7 | 0.1916 |

Paired, blend − logit:
- **Accuracy:** +1.3 [+0.7, +1.9] / +0.3 [−0.3, +0.9] / +0.6 [+0.0, +1.1] / +0.1 [−0.7, +0.9] pp.
- **Brier:** −0.0041 [−0.0067, −0.0018].
- **Selection-free part:** −0.0043 [−0.0073, −0.0016].
- **Legacy part:** −0.0036 [−0.0096, +0.0005].

About 38 variants were compared on this test before, so gains of about 0.001–0.002 are selection noise. The holdout is the referee.

## State at registration

- **First official blend-v2 forecast:** issued by the timer at 18:12 UTC on 31 Oct (issue 18 UTC), no failed steps.
- **Shadows:** all three challengers issued shadows from the same radar hours.
- **Check of the logit-v2 shadow:** it equals the logit part inside the official file exactly (max difference 0.0).
- **Rollback:** the previous system can be restored at any time:
  1. `uv run python -m ops.retrain --promote data/archive/models/logit-v1/model.pkl`;
  2. copy `data/archive/variants_rollback_wave1.json` to `data/archive/variants.json`, written atomically;
  3. `uv run python -m ops.runtime promote 2026-10-31-wave1-r2`.
- **Risk:** the job runs as a user timer, and systemd lingering is off. If the owner's session ends, holdout hours are lost and cannot be made up.
