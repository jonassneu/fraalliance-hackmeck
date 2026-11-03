# Integration: the decision model on simulated wind paths, blended with the production logit

Status: 31 Oct 2026, 17:20 UTC. Code: `fra/blend.py` (new), `fra/decision.py`, `fra/fcerror.py`, `fra/changetime.py`, `fra/predict.py`. Scripts and results: `experiments/integration/`. The plan was pre-registered in `plan.json` (written 16:44 UTC, before any number of this round).

## Result in brief

**What the blend is.**
- P(OD 25) = 0.5 × production logit + 0.5 × the hourly decision model (`fra.decision.DEFAULT`).
- The decision model is rolled out hour by hour along 200 simulated actual-wind paths (`fra.fcerror.DEFAULT`), with the look-ahead taken from the ensemble mean.
- The rollout starts from the last completely published radar hour and simulates the unpublished hours with the observed wind.

**Main numbers (long test).**
- Brier(1,6,24,48): 0.0389 vs 0.0429 for the logit, paired −0.0041 [−0.0067, −0.0018].
- Brier over all 48 leads: 0.0404 vs 0.0446, −0.0042 [−0.0069, −0.0019].
- Selection-free part: −0.0043 [−0.0073, −0.0016] and −0.0045 [−0.0073, −0.0020].
- Accuracy at 1/6/24/48 h: 96.8/94.9/94.7/93.0 % vs 95.5/94.6/94.1/92.9 %.

**Pre-registered choices.**
- Weights: fixed 0.5. Walk-forward fitted weights were worse.
- Part B variants: DEFAULT stays; the variants made no difference.
- Next change: the hysteresis rule on the blend, 80.2 % event accuracy out of sample. Using the decision paths directly gave 72.4 %.
- Runway 18: the production logit stays.

**Live.** One forecast takes 6.6 s; the decision part 0.5 s. If the decision part fails, the forecast falls back to the logit and is flagged.

All CIs are paired day-block bootstraps (2,000 reps, 95 %, `fra.evalkit`) on identical rows.

**Test definitions.**
- Long test: issue times 2026-06-01 .. 2026-10-30 (152 days, 3,635 issue times). The rows are exactly those of the production walk-forward: 173,352 (issue, lead) rows over 48 leads.
- Selection-free part: valid < 2026-09-15.
- Legacy part: issues from 2026-09-15.
- Production logit: the current `fra.train`, including CLEAN_LABELS, which another thread adopted at 17:08 UTC. Every analysis was re-run after that change; no decision changed.

## 1. Rollout from the last complete hour (od_now consistency)

The data layer now takes the current OD from the radar hour [t−2h, t−1h): at issue time t the hour [t−1h, t) is only partly published. The decision rollout follows the same rule.

**How it works.**
- It starts at label hour t−1 from od_now = the label of hour t−2.
- Wind hours ≤ t come from the observed METAR (no gap interpolation); later hours come from the Part B paths.
- The label hours t−1 and t (complete or in progress, but not yet published) are simulated with that observed wind. Switches in them count towards lead 1.
- Lead L is rollout step L+1.
- `fra.blend.rollout_many` does this for the walk-forward and for the live path alike.

**Supporting changes in `fra.decision`.**
- `assemble_paths(obs_until=)`.
- `od_now()` uses lag 2.
- RWY 18 training rows need h + 2 h ≤ week start.
- `rollout_batch` also returns the per-path RWY 18 closure probabilities.

**What the honest start costs.** This is a reference only: the label of hour t−1 is not available at issue time. A rollout given that label (starting at t) would be better by:
- Brier(1,6,24,48) −0.0013 [−0.0018, −0.0008];
- accuracy +0.7 pp [+0.4, +1.1] at 1 h;
- nothing from 24 h on.

## 2. OD: blend vs production logit

### Long test (152 days; accuracy %, 95 % CI)

| Method | 1 h | 6 h | 24 h | 48 h | Brier(1,6,24,48) | Brier(all leads) |
|---|---|---|---|---|---|---|
| Production logit | 95.5 [94.2, 96.7] | 94.6 [93.0, 96.1] | 94.1 [92.5, 95.7] | 92.9 [91.0, 94.8] | 0.0429 [0.0328, 0.0531] | 0.0446 [0.0337, 0.0553] |
| Decision rollout alone | 96.2 [95.1, 97.3] | 94.5 [92.8, 96.1] | 94.5 [92.8, 96.1] | 91.9 [89.8, 94.0] | 0.0420 [0.0322, 0.0520] | 0.0419 [0.0313, 0.0523] |
| **Blend 0.5/0.5** | **96.8** [95.8, 97.7] | **94.9** [93.3, 96.4] | **94.7** [93.1, 96.2] | **93.0** [91.1, 94.9] | **0.0389** [0.0296, 0.0481] | **0.0404** [0.0304, 0.0506] |
| Published prognosis | 93.7 | 92.9 | 91.2 | 89.2 | 0.0823 | 0.0876 |
| Official rules | 91.0 | 90.2 | 88.5 | 87.0 | 0.1082 | 0.1142 |
| Persistence | 94.4 | 87.7 | 75.3 | 65.7 | 0.1916 | 0.2336 |

Brier per lead:

| Method | 1 h | 6 h | 24 h | 48 h |
|---|---|---|---|---|
| Logit | 0.0339 | 0.0406 | 0.0442 | 0.0532 |
| Decision rollout | 0.0273 | 0.0402 | 0.0395 | 0.0612 |
| Blend | 0.0269 | 0.0377 | 0.0393 | 0.0518 |

Paired differences (accuracy in pp; for Brier, negative means the first method is better):

| Pair | 1 h | 6 h | 24 h | 48 h | Brier(1,6,24,48) | Brier(all) |
|---|---|---|---|---|---|---|
| Blend − logit, accuracy | +1.3 [+0.7, +1.9] | +0.3 [−0.3, +0.9] | +0.6 [+0.0, +1.1] | +0.1 [−0.7, +0.9] | −0.0041 [−0.0067, −0.0018] | −0.0042 [−0.0069, −0.0019] |
| Blend − logit, Brier per lead | −0.0070 [−0.0101, −0.0043] | −0.0029 [−0.0059, −0.0004] | −0.0049 [−0.0080, −0.0022] | −0.0013 [−0.0056, +0.0028] | | |
| Decision − logit | +0.7 [−0.0, +1.5] | −0.1 [−0.8, +0.8] | +0.4 [−0.6, +1.4] | −1.0 [−2.5, +0.5] | −0.0010 [−0.0057, +0.0031] | −0.0027 [−0.0074, +0.0014] |
| Blend − prognosis | +3.0 | +2.0 | +3.5 | +3.8 | −0.0435 [−0.0571, −0.0311] | |
| Blend − rules | +5.8 | +4.7 | +6.1 | +6.0 | −0.0693 [−0.0850, −0.0544] | |
| Blend − persistence | +2.4 | +7.2 | +19.4 | +27.3 | −0.1528 | |

Over all 48 leads, the Brier gain has a CI excluding 0 at 40 leads. The exceptions are 7–11 h and 46–48 h (`od_per_lead.csv`). The decision rollout alone is strong at 1–30 h and weak at 48 h; the blend keeps the strengths of both.

### Selection-free part (valid < 2026-09-15)

| Method | 1 h | 6 h | 24 h | 48 h | Brier(1,6,24,48) | Brier(all) |
|---|---|---|---|---|---|---|
| Logit | 94.9 | 94.0 | 93.5 | 92.5 | 0.0467 | 0.0486 |
| Decision rollout | 96.1 | 93.9 | 94.3 | 91.0 | 0.0452 | 0.0448 |
| **Blend** | **96.6** | **94.3** | **94.2** | **91.9** | **0.0424** | **0.0440** |
| Blend − logit | +1.7 [+0.9, +2.5] | +0.3 [−0.4, +0.9] | +0.7 [+0.0, +1.4] | −0.5 [−1.6, +0.6] | −0.0043 [−0.0073, −0.0016] | −0.0045 [−0.0073, −0.0020] |

Legacy part (46 days):
- Blend 97.2/96.3/95.7/95.2 % vs logit 96.7/95.9/95.5/93.6 %.
- Brier(1,6,24,48) −0.0036 [−0.0096, +0.0005]. Same direction, not significant.

### Changed hours (valid state ≠ od_now)

| Lead | n | Logit | Decision | Blend | Blend − logit |
|---|---|---|---|---|---|
| 1 h | 205 | 55.1 % | 45.4 % | 54.1 % | −1.0 [−4.8, +3.0] pp |
| 6 h | 446 | 74.7 % | 65.2 % | 68.8 % | −5.8 [−10.4, −2.2] pp |

The decision model is more persistent. The blend gains overall by raising fewer false switches, and pays for it on hours where the direction really changes at about 6 h ahead.

### Pre-registered choices (plan.json)

| Question | Result | Decision |
|---|---|---|
| Walk-forward per-bucket weights vs fixed 0.5 | Brier(all) +0.0005 [−0.0003, +0.0013]; Brier(1,6,24,48) +0.0013 [+0.0003, +0.0023] | **fixed 0.5** |
| Part B: simulated gust mapped to the METAR convention | +0.0001 [−0.0002, +0.0004] (selection-free −0.0000) | keep DEFAULT; option `Params.gust_metar`, off |
| Part B: DEFAULT_NATIVE (fixes the P(tw25 > 5 kt) bias) | +0.0002 [−0.0002, +0.0006] | keep DEFAULT |

- Weights fitted on all weeks would put this much weight on the logit: 0.30 at 1–3 h, 0.50 at 4–12 h, 0.35 at 13–30 h and 0.40 at 31–48 h. They are not used.
- The gust over-dispersion and the P(tw25 > 5 kt) bias are real at the wind level (experiments/partb), but neither matters for the operating-direction forecast.

## 3. Next change

**Setup.**
- Issue times whose whole 48 h horizon is labelled (`fra.changetime` rules): 3,420 scored out of sample (issues 2026-06-08 .. 2026-10-28), 1,797 with a sustained change.
- Hit = within ±3 h. Nested walk-forward: week w is scored with the choice made on weeks before w.

| Method | Event accuracy | Hit rate | Timing MAE on hits | False alarms | Correct "no change" |
|---|---|---|---|---|---|
| **(i) Hysteresis rule on the blend, nested** | **80.2 %** [75.1, 84.9] | 65.1 % | 1.22 h | 49 | 1,574 |
| (ii) Decision paths: P(switched) ≥ threshold, nested | 72.4 % [66.9, 77.9] | 62.3 % | 1.14 h | 267 | 1,356 |
| Decision paths, threshold 0.5 | 74.3 % | 62.7 % | 1.21 h | 209 | 1,414 |
| Logit, current PARAMS (production today) | 79.1 % [73.8, 83.9] | 63.6 % | 1.22 h | 62 | 1,561 |
| Logit, nested re-tuned rule | 77.9 % | 60.2 % | 1.23 h | 40 | 1,583 |
| Published prognosis | 69.7 % | 49.7 % | 1.51 h | 132 | 1,491 |
| Official rules | 62.3 % | 56.9 % | 1.45 h | 516 | 1,107 |
| Persistence | 47.5 % | 0 % | – | 0 | 1,623 |

Paired differences in event accuracy:
- (i) − (ii): +7.8 pp [+4.1, +11.9].
- (i) − logit today: +1.2 pp [−0.8, +3.2].
- (i) − prognosis: +10.5 pp [+5.6, +15.5].

The decision paths raise far too many false alarms: the rollout's switch probability accumulates over 48 h.

**Chosen (pre-registered rule): (i).**
- Live parameters, tuned on all weeks; the nested choice was stable from week 10 on: `fra.blend.BLEND_CHANGE_PARAMS = smooth 1, enter 0.45, leave 0.45, k 1`. In-sample event accuracy with them is 81.3 %.
- P(change within 48 h) = sigmoid(0.692 + 1.302 · logit(max P(other OD))) (`BLEND_P48_COEF`).
- Both are passed through `fra.changetime.next_change(params=, p48_coef=)`.
- The likely window covers 72 % of actual changes (±1 h) and is 5.0 h wide on average.

P(change within 48 h), walk-forward Brier:

| Map | Brier |
|---|---|
| Blend | 0.0629 |
| Decision paths, recalibrated | 0.0804 |
| Decision paths, raw | 0.0734 |
| Logit, its own walk-forward map | 0.0586 |
| Logit, today's `P48_COEF` | 0.0606 |
| Climatology | 0.249 |

The blend's map is no better than the logit's: +0.0042 [−0.0009, +0.0092].

`fra.changetime.PARAMS` and `P48_COEF` (production logit) are unchanged. Their comments now state the tuning period (hackathon, 15 Sep – 28 Oct, old data layer) and the re-check on the new layer.

## 4. Runway 18

**Setup.**
- Weekly walk-forward from 2025-09-01: 247,863 rows with a RWY 18 label, 34 closure hours.
- Closure days: 24 Dec 2025, 14 Feb, 13–15 Apr, 10 May, 29 May, 30 Jul, 28 Oct 2026. The Sep 2025 closures fall before any training closure exists.
- Climatology = the closure rate known at each week start.

| Pooled over all leads | Brier | Brier skill | AUC | Closure hours flagged at P(open) < 0.8 | False alarms per 1,000 h | Closure hours flagged at any lead |
|---|---|---|---|---|---|---|
| **Production logit** | **0.0049** [0.0017, 0.0089] | 0.25 | 0.66 | 40 % | 2.3 | 15 of 34 |
| Closure model on the paths (logit P(OD 25)) | 0.0059 | 0.10 | 0.84 | 19 % | 1.0 | 11 of 34 |
| 50/50 mix | 0.0052 | 0.21 | 0.81 | 39 % | 1.5 | 15 of 34 |
| Climatology | 0.0066 | 0 | – | 0 | 0 | 0 |
| Official rule | 0.0306 | – | – | – | – | – |

**Per lead** (Brier / AUC / hit rate / false alarms per 1,000 h):

| Lead | Logit | Paths |
|---|---|---|
| 1 h | 0.0046 / 0.65 / 44 % / 1.6 | 0.0059 / 0.84 / 32 % / 4.9 |
| 48 h | 0.0053 / 0.67 / 32 % / 2.9 | 0.0060 / 0.85 / 9 % / 0.2 |

Paired Brier differences:
- Paths − logit: +0.00095 [−0.00011, +0.00290].
- Mix − logit: +0.00023 [−0.00012, +0.00081].

**Decision: the logit stays** (`fra.blend.RWY18_MODE = "logit"`). The path model ranks closures much better but is poorly calibrated. With 34 closure hours this is indicative only.

## 5. Live forecast and runtime

`fra.blend.forecast(issue=None, variant=None, models=None)` returns what `fra.predict.forecast()` returns: (out, issue, od_now, next_change).

**Columns.**
- `out` has the same columns as `fra.predict.forecast()`. p_od25, od_pred, od_certainty and the next-change fields come from the blend; p_rwy18_open comes from the logit.
- Extra columns: p_od25_logit, p_od25_decision, p_rwy18_open_logit, blend_ok, blend_status.
- Timings and inputs are in `out.attrs["blend"]`.

**Inputs, with the same as-of rules as training.**
- The exact ECMWF IFS single run with init ≤ t−6 h.
- The exact ICON-D2 run with init ≤ t−4 h, treated as missing if more than 12 h old (`fra.fcerror.live_forecast_frame`).
- The live METAR and radar state that `fra.predict` fetched anyway. They are captured from its calls, so the blend makes no extra INAA or IEM request.

**Fallback.** Any exception in the decision part returns the logit forecast unchanged, with blend_ok False and the reason in blend_status.

**Checks** (`check_live.py`, `live_check.json`):

| Check | Result |
|---|---|
| Live, 31 Oct 17:00 UTC issue, after the hourly job | 6.6 s in total: logit incl. inputs 6.06 s, decision part 0.54 s (inputs 0.26, forecast frame 0.16, 200 paths + rollout 0.12). ESS 407, IFS run 06 UTC, ICON-D2 run 12 UTC. Status ok; `fra.archive.check_output` passed |
| Fallback with a missing decision bundle | blend_ok False, logit output identical, `check_output` passed |
| Code path | `decision_forecast()` with archive inputs and the walk-forward week's model equals the walk-forward rows exactly (max abs diff 0.0 on 6 issues; p25, P(no switch), c07) |
| Walk-forward CLI | `python -m fra.blend --wf`, recomputed from scratch, reproduces the analysis exactly (max abs diff 0.0, 173,352 rows) |
| Live forecast frame vs archive | diff 0.0 where the archive holds the chosen run |
| `fra.predict` exact ECMWF single run vs `singleruns.asof_features` | max abs diff 0.0 on 3 issues, including the 100 m wind and the derived weather features |

**Also changed in `fra.predict`:** it now uses the exact IFS run instead of the stitched live forecast. It falls back to the stitched forecast if the single-runs API fails. This closes the ECMWF train/serve gap flagged in the data-layer step.

### Variant entry to register (challenger)

```json
{
  "name": "blend-v1",
  "role": "challenger",
  "runtime": "<new snapshot of this round's fra/*.py, e.g. 2026-10-31-wave2>",
  "entry": "fra.blend:forecast",
  "models": {
    "model": "data/archive/models/blend-v1/model.pkl",
    "decision": "data/archive/models/blend-v1/decision_model.pkl"
  },
  "sha256": "<prefix of the pinned logit copy>",
  "timeout_s": 240,
  "note": "0.5 x production logit + 0.5 x hourly decision model on 200 simulated wind paths; next change: hysteresis rule on the blend; RWY 18: logit; falls back to the logit forecast if the decision part fails"
}
```

What goes into `models`:
- `model.pkl`: a copy of the new-data-layer `data/model.pkl`. It is sha256 e67b55b9c6a7 at 17:20 UTC (refit with CLEAN_LABELS). The pinned production model d152a9b32edb was trained on the old [t−1h, t) state and must not be combined with this code.
- `decision_model.pkl`: a copy of `experiments/integration/decision_model.pkl`, sha256 a9e3f00f4209. It was trained on labels up to 2026-10-30 11:00 and refits in about 2 s with `python -m fra.blend --fit PATH`.

## 6. Reproduce

```bash
export OMP_NUM_THREADS=1 OPENBLAS_NUM_THREADS=1 MKL_NUM_THREADS=1
uv run python experiments/integration/run_wf.py long     # decision rollouts, 4 configs, ~2.5 min -> dec_long.parquet
uv run python experiments/integration/run_wf.py rwy18    # 2025-09 .. 2026-05 issues, ~1 min -> dec_rwy18.parquet
uv run python experiments/integration/analyze.py         # OD tables, weights, Part B variants -> od_results.json
uv run python experiments/integration/nextchange.py      # next change, ~3 min -> nextchange_results.json
uv run python experiments/integration/rwy18.py           # RWY 18, ~2 min -> rwy18_results.json
uv run python experiments/integration/check_live.py      # live / fallback / code-path checks (one live forecast)
uv run python -m fra.blend --wf [--final]                # walk-forward entry (--final: locked holdout only)
uv run python -m fra.blend --fit [PATH]                  # refit the decision bundle
uv run python -m fra.blend                               # blended forecast for the current hour (writes nothing)
```

## Caveats
- About 38 variants were compared on the same June–October test in the previous round, plus 4 here. Gains of about 0.001–0.002 Brier are within selection noise.
  - The blend's gain (−0.004) is about twice that and holds on the selection-free part.
  - The ensemble-mean look-ahead and the 50/50 blend were found on this test in the previous round.
  - The locked holdout from 2026-11-01 is the referee: `python -m fra.blend --wf --final`, and the shadow forecasts once registered.
- The blend is more persistent than the logit. It is worse on hours where the direction changes about 6 h ahead (−5.8 pp).
- No gain at 46–48 h. The Part B paths end at lead 48 and have no ICON-EU in their centre.
- Runway 18 rests on 34 closure hours on 9 days.
