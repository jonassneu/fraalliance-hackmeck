# Phase 2: re-testing the model choices on the corrected data layer

**Result:** 21 variants were pre-registered and scored on the long walk-forward test. Only one passed the adoption rule: training only on directly observed labels (`fra.train.CLEAN_LABELS = True`). Its effect is tiny: Brier(1,6,24,48) −0.00006 [−0.00015, −0.000003]. It is adopted. Everything else stays as it is: the 120-day window, C 0.03, 4 lead buckets, temperature scaling and the logistic model.

## 1. Plan (pre-registered)

`experiments/phase2/plan.json` was written at 16:39 UTC, before any variant was run. It holds the candidate list, the rule and the test setup.

**Test:** the long walk-forward test, issue 2026-06-01 .. 2026-10-31 (valid < 2026-11-01). It has 22 weekly folds; each trains only on labels known at the week start (valid + 2 h ≤ week start). The data layer is `data/wf_cache.parquet` (od_now from the last complete radar hour, ICON-EU-filled consensus, leads 1–48).

**Reference:** the production OD spec at registration. That is `fra.train.fit` with C 0.03, 4 lead buckets (1–3, 4–12, 13–30, 31–48), the last 120 days and per-bucket temperature scaling. Its predictions match `fra.train` exactly (max |diff| 0.0 on 173,352 rows).

**Scoring:** variant and reference are scored on identical (issue, lead) rows, 14,465 rows at leads 1/6/24/48. CIs are day-block bootstraps (2000 reps, seed `fra.evalkit.SEED`, 95 %), with paired differences computed on the same resampled days.

**Adoption rule:** a change is adopted only if all three hold:
1. The 95 % CI of the paired Brier(1,6,24,48) difference vs production excludes 0 on the whole long test.
2. The point estimate is better on both halves: H1 = issue Jun–Jul, H2 = issue Aug–Oct.
3. Accuracy at 24 h does not get worse beyond noise: the CI of the paired 24 h accuracy difference does not lie entirely below 0.

**Stage 2:** if passing changes come from two or more groups, one combination is tested.

**One addition to the brief.** The brief assumed the labels are now clean. They are not, before 2026-02-11. `data/labels.parquet` (`fra.labels --write`, `to_labels(bridge="ffill")`) still carries the last sampled OD for up to 8 h across daytime sampling gaps. In Jun 2025 – Jan 2026 the radar was sampled about 6 hours a day, so only 8–25 % of those OD training rows have a directly observed label and od_now hour. From March 2026 on it is 100 %. So every window and recency variant was registered twice:
- with the labels as they are;
- with "clean" rows only: the target label at the valid time and the od_now source hour must also exist under `to_labels(bridge="night")`, which carries the OD only through the night ban and quiet hours.

## 2. All variants

Δ = variant − production, paired, on identical rows. For Brier, negative is better. H1 = issue 2026-06-01 .. 07-31 (5,856 rows, 63 days); H2 = issue 2026-08-01 .. 10-31 (8,609 rows, 91 days). "Selection-free" means valid < 2026-09-15. The production reference has Brier(1,6,24,48) 0.04300.

| # | Variant | Group | Brier(1,6,24,48) | Δ Brier, whole test | Δ H1 (Jun–Jul) | Δ H2 (Aug–Oct) | Δ selection-free | Δ Brier all leads | Δ acc 24 h (pp) | Passes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | w180 | window | 0.04298 | −0.00002 [−0.00099, +0.00102] | −0.00086 [−0.00265, +0.00114] | +0.00055 [−0.00066, +0.00169] | −0.00064 [−0.00188, +0.00065] | +0.00025 [−0.00077, +0.00137] | +0.0 [−0.4, +0.4] | no |
| 2 | w240 | window | 0.04319 | +0.00020 [−0.00133, +0.00178] | −0.00045 [−0.00289, +0.00219] | +0.00064 [−0.00153, +0.00270] | −0.00057 [−0.00242, +0.00124] | +0.00081 [−0.00080, +0.00254] | −0.4 [−0.9, +0.1] | no |
| 3 | wall | window | 0.04374 | +0.00075 [−0.00145, +0.00317] | +0.00075 [−0.00290, +0.00483] | +0.00075 [−0.00260, +0.00385] | −0.00019 [−0.00318, +0.00278] | +0.00169 [−0.00058, +0.00428] | −0.4 [−1.1, +0.2] | no |
| 4 | **w120_clean** | window | 0.04293 | **−0.00006 [−0.00015, −0.00000]** | −0.00014 [−0.00033, −0.00001] | −0.00001 [−0.00006, +0.00003] | −0.00008 [−0.00020, −0.00000] | −0.00006 [−0.00013, −0.00000] | +0.0 [−0.1, +0.1] | **yes** |
| 5 | w180_clean | window | 0.04308 | +0.00008 [−0.00079, +0.00104] | −0.00062 [−0.00194, +0.00085] | +0.00056 [−0.00065, +0.00171] | −0.00050 [−0.00150, +0.00057] | +0.00039 [−0.00054, +0.00141] | −0.1 [−0.5, +0.2] | no |
| 6 | w240_clean | window | 0.04290 | −0.00009 [−0.00130, +0.00121] | −0.00078 [−0.00255, +0.00122] | +0.00038 [−0.00140, +0.00214] | −0.00087 [−0.00213, +0.00050] | +0.00054 [−0.00078, +0.00198] | −0.5 [−1.0, −0.0] | no |
| 7 | wall_clean | window | 0.04274 | −0.00026 [−0.00159, +0.00113] | −0.00074 [−0.00277, +0.00146] | +0.00007 [−0.00199, +0.00198] | −0.00105 [−0.00262, +0.00052] | +0.00050 [−0.00091, +0.00209] | −0.6 [−1.1, −0.1] | no |
| 8 | hl60 | recency | 0.04284 | −0.00015 [−0.00114, +0.00087] | −0.00122 [−0.00265, +0.00028] | +0.00057 [−0.00078, +0.00192] | −0.00077 [−0.00179, +0.00030] | +0.00011 [−0.00087, +0.00117] | −0.2 [−0.4, +0.1] | no |
| 9 | hl120 | recency | 0.04269 | −0.00030 [−0.00169, +0.00112] | −0.00091 [−0.00320, +0.00157] | +0.00011 [−0.00191, +0.00194] | −0.00096 [−0.00271, +0.00074] | +0.00025 [−0.00118, +0.00177] | −0.3 [−0.8, +0.2] | no |
| 10 | hl240 | recency | 0.04301 | +0.00001 [−0.00179, +0.00188] | −0.00027 [−0.00324, +0.00290] | +0.00021 [−0.00243, +0.00259] | −0.00072 [−0.00312, +0.00156] | +0.00077 [−0.00105, +0.00278] | −0.5 [−1.2, +0.1] | no |
| 11 | hl60_clean | recency | 0.04316 | +0.00017 [−0.00059, +0.00098] | −0.00066 [−0.00154, +0.00032] | +0.00073 [−0.00040, +0.00191] | −0.00037 [−0.00106, +0.00037] | +0.00030 [−0.00051, +0.00119] | −0.2 [−0.4, +0.1] | no |
| 12 | hl120_clean | recency | 0.04274 | −0.00026 [−0.00116, +0.00070] | −0.00103 [−0.00222, +0.00030] | +0.00026 [−0.00114, +0.00160] | −0.00087 [−0.00176, +0.00009] | +0.00015 [−0.00081, +0.00121] | −0.3 [−0.7, +0.1] | no |
| 13 | hl240_clean | recency | 0.04271 | −0.00028 [−0.00136, +0.00086] | −0.00092 [−0.00245, +0.00082] | +0.00015 [−0.00155, +0.00172] | −0.00096 [−0.00214, +0.00023] | +0.00029 [−0.00088, +0.00158] | −0.6 [−1.1, −0.1] | no |
| 14 | C0.01 | C | 0.04385 | +0.00085 [+0.00019, +0.00154] | +0.00186 [+0.00074, +0.00306] | +0.00016 [−0.00054, +0.00095] | +0.00103 [+0.00023, +0.00189] | +0.00026 [−0.00024, +0.00077] | −0.0 [−0.2, +0.1] | no |
| 15 | C0.1 | C | 0.04277 | −0.00022 [−0.00062, +0.00017] | −0.00078 [−0.00153, −0.00012] | +0.00016 [−0.00032, +0.00059] | −0.00030 [−0.00084, +0.00018] | +0.00003 [−0.00026, +0.00032] | +0.1 [−0.1, +0.2] | no |
| 16 | C0.3 | C | 0.04276 | −0.00024 [−0.00078, +0.00029] | −0.00089 [−0.00197, +0.00003] | +0.00021 [−0.00046, +0.00080] | −0.00032 [−0.00106, +0.00035] | +0.00007 [−0.00030, +0.00046] | +0.1 [−0.1, +0.3] | no |
| 17 | notemp | temperature | 0.04281 | −0.00018 [−0.00088, +0.00054] | −0.00052 [−0.00134, +0.00022] | +0.00004 [−0.00102, +0.00116] | −0.00031 [−0.00107, +0.00060] | −0.00029 [−0.00107, +0.00045] | +0.0 [+0.0, +0.0] | no |
| 18 | buckets6 | buckets | 0.04310 | +0.00010 [−0.00026, +0.00048] | +0.00037 [−0.00020, +0.00097] | −0.00008 [−0.00055, +0.00040] | −0.00005 [−0.00048, +0.00039] | +0.00014 [−0.00007, +0.00032] | −0.0 [−0.2, +0.2] | no |
| 19 | lgbm_mono | lgbm | 0.04436 | +0.00136 [−0.00084, +0.00358] | −0.00043 [−0.00353, +0.00313] | +0.00257 [−0.00016, +0.00551] | +0.00114 [−0.00153, +0.00397] | +0.00079 [−0.00122, +0.00276] | −0.3 [−0.9, +0.3] | no |
| 20 | blend_lgbm | lgbm | 0.04251 | −0.00048 [−0.00155, +0.00055] | −0.00127 [−0.00287, +0.00040] | +0.00006 [−0.00126, +0.00140] | −0.00061 [−0.00190, +0.00071] | −0.00071 [−0.00171, +0.00024] | −0.0 [−0.4, +0.3] | no |
| 21 | pw4 | Part B | 0.04236 | −0.00064 [−0.00153, +0.00027] | −0.00037 [−0.00218, +0.00131] | −0.00082 [−0.00183, +0.00019] | −0.00048 [−0.00181, +0.00083] | −0.00042 [−0.00130, +0.00048] | −0.1 [−0.5, +0.2] | no |

**Variant definitions:**
- `w180` / `w240` / `wall`: training window 180 / 240 days / all history (labels from 2025-06-01).
- `_clean`: clean label rows only (see section 1).
- `hl…`: all history with sample weights 0.5^(age/half-life), normalised to mean 1, also inside the temperature fit.
- `buckets6`: lead buckets 1–2, 3–6, 7–12, 13–24, 25–36, 37–48.
- `lgbm_mono`: LightGBM on the 120-day window with the logit features plus lead and run age.
  - Monotone constraints: P(OD 25) never rises with any tailwind-on-25 feature, and never falls with prognosis, rule or od_now.
  - Settings: 300 trees, learning rate 0.03, 7 leaves, min_child_samples 200, L2 10.
- `blend_lgbm`: 0.5 × production + 0.5 × `lgbm_mono`.
- `pw4`: the production logit plus the Part B path features P(tw25 > 0), P(tw25 > 5 kt) and mean / sd, for all 48 leads. They were computed walk-forward by `fra.fcerror.path_features`; 0.3 % of rows had no paths and got a row-local fill.

Accuracy in %. Δ is in pp, paired:

| Variant | acc 1 h | acc 6 h | acc 24 h | acc 48 h | Δ acc 1 h | Δ acc 6 h | Δ acc 48 h |
|---|---|---|---|---|---|---|---|
| production (reference) | 95.5 | 94.6 | 94.1 | 92.9 | | | |
| w180 | 95.8 | 94.4 | 94.1 | 93.0 | +0.3 [−0.0, +0.7] | −0.2 [−0.6, +0.2] | +0.1 [−0.4, +0.6] |
| w240 | 95.9 | 94.4 | 93.7 | 92.9 | +0.4 [+0.1, +0.9] | −0.2 [−0.9, +0.4] | +0.0 [−0.5, +0.6] |
| wall | 95.9 | 94.3 | 93.7 | 92.9 | +0.5 [−0.2, +1.2] | −0.4 [−1.0, +0.3] | +0.0 [−0.8, +0.8] |
| w120_clean | 95.5 | 94.6 | 94.1 | 92.9 | +0.0 [+0.0, +0.0] | −0.0 [−0.1, +0.0] | +0.0 [+0.0, +0.0] |
| w180_clean | 95.7 | 94.4 | 94.0 | 92.9 | +0.2 [−0.1, +0.6] | −0.2 [−0.6, +0.2] | +0.1 [−0.3, +0.4] |
| w240_clean | 96.0 | 94.5 | 93.6 | 93.1 | +0.5 [+0.1, +0.9] | −0.2 [−0.7, +0.3] | +0.2 [−0.4, +0.7] |
| wall_clean | 96.0 | 94.5 | 93.5 | 93.0 | +0.5 [−0.0, +1.0] | −0.1 [−0.6, +0.3] | +0.1 [−0.4, +0.7] |
| hl60 | 95.9 | 94.6 | 93.9 | 93.0 | +0.5 [+0.1, +0.8] | +0.0 [−0.5, +0.5] | +0.1 [−0.3, +0.6] |
| hl120 | 96.0 | 94.7 | 93.8 | 92.8 | +0.6 [+0.0, +1.0] | +0.1 [−0.4, +0.6] | −0.1 [−0.6, +0.5] |
| hl240 | 96.0 | 94.6 | 93.6 | 92.9 | +0.6 [−0.0, +1.1] | −0.0 [−0.6, +0.5] | +0.0 [−0.7, +0.7] |
| hl60_clean | 95.8 | 94.5 | 93.9 | 92.9 | +0.3 [+0.0, +0.6] | −0.2 [−0.6, +0.2] | +0.1 [−0.4, +0.4] |
| hl120_clean | 96.0 | 94.6 | 93.8 | 92.9 | +0.5 [+0.1, +0.9] | +0.0 [−0.4, +0.4] | +0.1 [−0.4, +0.5] |
| hl240_clean | 96.1 | 94.5 | 93.5 | 93.0 | +0.6 [+0.2, +1.0] | −0.1 [−0.7, +0.4] | +0.1 [−0.3, +0.6] |
| C0.01 | 94.9 | 94.2 | 94.1 | 93.1 | −0.6 [−0.9, −0.2] | −0.4 [−0.8, −0.1] | +0.2 [−0.1, +0.4] |
| C0.1 | 95.8 | 94.4 | 94.2 | 92.8 | +0.4 [+0.1, +0.7] | −0.2 [−0.6, +0.1] | −0.1 [−0.2, +0.0] |
| C0.3 | 95.8 | 94.4 | 94.2 | 92.8 | +0.4 [−0.0, +0.8] | −0.2 [−0.5, +0.1] | −0.1 [−0.2, +0.1] |
| notemp | 95.5 | 94.6 | 94.1 | 92.9 | +0.0 [+0.0, +0.0] | +0.0 [+0.0, +0.0] | +0.0 [+0.0, +0.0] |
| buckets6 | 95.3 | 94.2 | 94.1 | 92.9 | −0.2 [−0.4, +0.0] | −0.4 [−0.8, +0.0] | +0.0 [−0.2, +0.2] |
| lgbm_mono | 95.1 | 94.6 | 93.8 | 92.4 | −0.3 [−1.0, +0.3] | −0.0 [−0.6, +0.6] | −0.4 [−1.1, +0.2] |
| blend_lgbm | 95.5 | 94.8 | 94.1 | 93.0 | +0.0 [−0.4, +0.4] | +0.1 [−0.3, +0.6] | +0.1 [−0.3, +0.5] |
| pw4 | 95.7 | 94.5 | 94.0 | 93.1 | +0.2 [−0.2, +0.6] | −0.1 [−0.4, +0.2] | +0.2 [−0.1, +0.6] |

## 3. What the results say

### Training window and recency

The old finding "the last 120 days beat all history" was partly an artefact of the filled labels:
- With the labels as they are, all history is worse: +0.00075.
- With clean rows only, all history is slightly better: −0.00026 [−0.00159, +0.00113].

Recency still matters for the longer leads. More memory (240 days, all history, or half-life 120–240 days) raises 1 h accuracy by +0.4 to +0.6 pp; several of these CIs exclude 0. But it lowers 24 h accuracy:
- `wall_clean` and `hl240_clean`: −0.6 pp [−1.1, −0.1];
- `w240_clean`: −0.5 [−1.0, −0.0].

These three fail rule (3). No longer window or weighting improves Brier on the August–October half.

### C

- 0.1 and 0.3 are better in June–July (C 0.1: −0.00078 [−0.00153, −0.00012]) but worse in August–October.
- 0.01 is clearly worse: +0.00085 [+0.00019, +0.00154], with 1 h accuracy −0.6 pp.

C 0.03 stays.

### Temperature scaling

Neutral: −0.00018 [−0.00088, +0.00054], and accuracy is identical by construction. It no longer helps, but switching it off does not pass the rule either, so it stays on.

### Six lead buckets

+0.00010 [−0.00026, +0.00048]. 1 h and 6 h accuracy are −0.2 / −0.4 pp, at the edge of noise. Four buckets stay.

### LightGBM with monotone constraints

- Alone it is worse: +0.00136 [−0.00084, +0.00358], and +0.00257 in August–October.
- In a 50/50 blend with the logit it is −0.00048 [−0.00155, +0.00055], but not better on the August–October half (+0.00006).

Not adopted. The logit stays.

### Part B path features

`pw4` has the best point estimate of all: −0.00064 [−0.00153, +0.00027]. It is better on both halves (−0.00037 / −0.00082) and 48 h accuracy is +0.2 pp, but the CI includes 0. Not adopted. It also cannot be adopted as a constant, because the live forecast (`fra/predict.py`) does not compute path features. It is the strongest candidate for a shadow run on the holdout.

### The adopted change: clean labels with the 120-day window

`w120_clean` passed every condition:
- Whole test: −0.000064 [−0.000149, −0.000003].
- H1: −0.000144 [−0.000334, −0.000009]. H2: −0.000010 [−0.000055, +0.000033].
- 24 h accuracy: +0.0 [−0.1, +0.1] pp.

It changes the predictions in only two places:
- **The first two test weeks.** Their 120-day window reaches back into the sparsely sampled time before 2026-02-11.
- **One unfetched daytime hour** (2026-08-06 16 UTC), which the old fill had carried forward. Every later fold is refit on a training set that is a few rows smaller.

Going forward, the 120-day window lies entirely in hourly-labelled time. So the production model barely changes; the switch mainly guards against carried-over labels after outages. The upper CI bound is only just below 0, so this is a pass by the letter of the rule, with no practical gain.

### Stage 2

Not triggered: only one group passed.

## 4. Decisions

| Setting | Before | After | Why |
|---|---|---|---|
| `fra.train.CLEAN_LABELS` (new) | (all labelled rows) | **True** | passed the rule (row 4) |
| `fra.train.HALF_LIFE_DAYS` (new) | – | None | recency weighting failed (rows 8–13) |
| `WINDOW_DAYS` | 120 | 120 | longer windows failed (rows 1–3, 5–7) |
| `C["od25"]` | 0.03 | 0.03 | rows 14–16 |
| temperature scaling | on | on | switching it off is neutral (row 17) |
| `BUCKETS` | 4 | 4 | row 18 |
| LightGBM | off | off | rows 19–20 |
| Part B path features | not used | not used | row 21 (and not available live) |

RWY 18 was not part of the study and is unchanged.

## 5. New production run (`fra.train`, regenerated data/eval.csv and data/model.pkl)

| Period | acc 1 / 6 / 24 / 48 h (%) | Brier(1,6,24,48) | Brier(all leads) |
|---|---|---|---|
| Long test (Jun 1 – Oct 30) | 95.5 [94.2, 96.7] / 94.6 [93.0, 96.1] / 94.1 [92.5, 95.7] / 92.9 [91.0, 94.8] | 0.0429 [0.0328, 0.0531] (0.04293, was 0.04300) | 0.0446 [0.0337, 0.0553] |
| H1 (issue Jun–Jul) | 95.0 / 93.9 / 92.4 / 91.9 | 0.04862 | 0.05269 |
| H2 (issue Aug–Oct) | 95.8 / 95.1 / 95.3 / 93.6 | 0.03906 | 0.03909 |
| Selection-free (valid < Sep 15) | 94.9 / 94.0 / 93.5 / 92.5 | 0.04672 | 0.04857 |
| Legacy part (`fra.train legacy`, from Sep 15) | 96.7 / 95.9 / 95.7 / 93.7 | 0.0344 [0.0194, 0.0505] | 0.0359 |

The paired accuracy differences vs the baselines are practically unchanged. The only visible change is model − rules at 6 h: +4.4 pp, was +4.5.

| Long test, acc pp at 1 / 6 / 24 / 48 h | Difference |
|---|---|
| Model − prognosis | +1.7 [+0.5, +3.1] / +1.7 [+0.3, +3.2] / +2.9 [+1.2, +5.0] / +3.7 [+2.1, +5.5] |
| Model − rules | +4.5 / +4.4 / +5.6 / +5.9 (all CIs exclude 0) |
| Model − persistence | +1.1 [+0.3, +1.9] / +6.9 / +18.8 / +27.1 |

- Changed hours at 1 h: 55.1 % (n = 205).
- RWY 18: Brier 0.0011 [0.0002, 0.0023].
- `data/model.pkl` (sha256 e67b55b9c6a7) was refit on all labels with the new spec. `data/train_meta.json` now records the OD spec, including `clean: true`.

## 6. Verification

- **Reference matches `fra.train`:** the phase 2 production reference equals `fra.train` before the change, with max |diff| 0.0 on 173,352 rows. The fit-option code added to `fra/train.py` does not change production when off.
- **After the change:** `fra.train` (CLEAN_LABELS = True) equals the harness variant `w120_clean`, with max |diff| 0.0 on 173,352 rows. `experiments.harness.prod_model()` therefore reproduces the new production.
- **Stage-1 predictions reproduce after the adoption:** every variant pins `clean` / `half_life` to the registration setting. `prod`, `pw4` and `prod_now` = `w120_clean` were re-run and matched the stored predictions with max |diff| 0.0.
- **The new model works:** `data/model.pkl` loads and gives 48 finite OD and RWY 18 probabilities for the newest issue in the table.
- **The hourly job is not affected:** it runs from the frozen runtime and the pinned model. Old and new pickles share the same predict path (features, buckets, temperatures).

## 7. Selection noise

- **Count:** 21 variants were compared on the same test (20 walk-forward fits plus 1 blend). No diagnostics were run beyond these; the reproducibility re-runs are identical copies.
- **How strong the evidence is:** the only pass is also the smallest effect. Its CI bound sits at −0.000003, and a different bootstrap seed could flip it. Treat it as a hygiene fix, not a gain.
- **What this means for the long test:** it has now been used for selection over its whole length. The "selection-free" part (valid < Sep 15) is selection-free only up to this change.
- **The referee:** the locked holdout from 2026-11-01.

## Reproduce

```bash
uv run python -m experiments.phase2.run pw                        # Part B path features, 48 leads (~35 s)
uv run python -m experiments.phase2.run preds prod w180 ... pw4   # walk-forward per variant (20 s - 5 min each)
uv run python -m experiments.phase2.run score                     # -> experiments/phase2/results.csv, decisions.json
uv run python -m experiments.phase2.table                         # the tables above
uv run python -m fra.train && uv run python -m fra.train legacy   # production artefacts
```

The predictions are in `experiments/phase2/preds/` (49 MB, gitignored by `experiments/phase2/.gitignore`).
