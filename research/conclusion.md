# Conclusion: how we build it

Combined from the initial research brief ([background-research.md](background-research.md)) and what we verified while building.

## Decisions

| Topic | Decision | Why |
| --- | --- | --- |
| **Labels (flown OD)** | Umwelthaus INAA / FANOMOS radar tracks (`Fanomos/GetFlightTracks`). Low-level movement within 15 km and below 3,000 ft: track ~250° → OD 25, ~070° → OD 07. | Only public source of *actually flown* direction. Verified: 1 Oct 2025 shows clean OD 07 all day and the night ban. |
| **RWY 18 label** | "Open" = at least one southbound departure from west of the field in a busy hour (≥ 15 movements). Quiet hours are unlabeled. | The study's point, agreed: "not used" ≠ "closed". In busy hours, no use is a reasonable closure proxy. |
| **Label sampling** | Hourly for the test period (from 15 Sep 2026), 3 then 6 sampled hours per day for training (from Jun 2025). | The server handles about 0.4 requests/s, so a full hourly history would take about 7 h. |
| **Weather features** | Open-Meteo Previous Runs (vintages issued at least 1 and 2 days earlier), upgraded to Single Runs ECMWF IFS (exact run init, 6 h publication buffer) once `fra/singleruns.py` landed. | Training only on forecasts that were already published at issue time. The stitched "latest" (d0) series is never used for training. |
| **Observations** | IEM METAR EDDF for the current wind at issue time. | Gives short-lead skill. |
| **Model** | Regularised logistic regression (C = 0.03) with separate weights per lead bucket (1–3/4–12/13–30/31–48 h). Inputs: published INAA prognosis (main + alternative scenario), official rule on the ECMWF forecast, current flown OD, forecast tailwind on 25 (hourly, 6 h mean, 3 h before/after), time of day incl. night ban. | With only weeks of real labels, LightGBM overfit (88–95 %). The small model won under walk-forward testing; larger feature sets, a second NWP model and a LightGBM ensemble did not. |
| **Published prognosis** | Umwelthaus INAA `Direction/GetDirectionData?currentTime=t` returns the OD prognosis live at t (verified: blocks and probabilities change across as-of times). Used as a feature and as an extra baseline. | Fast (0.1 s), as-of, and carries forecaster knowledge. On its own it is weaker than our model. |
| **Baselines** | (1) the official section 3 rules applied to the same forecast, (2) persistence (keep current OD). | The case requires beating (1); (2) is the hardest to beat at 1 h. |
| **Evaluation** | Walk-forward by week from 15 Sep 2026: each week is predicted by a model trained only on outcomes known before it. Report accuracy and Brier at 1/6/24/48 h against the rules, persistence and the published prognosis, plus accuracy on *changed* hours. | Strict reading of "only data available at forecast time" (the review showed blocked CV that also trains on later weeks was ~1–2 pp optimistic at 6–24 h). |
| **Next change time** | First hour where the 3 h smoothed P(OD 25) crosses 0.5 and stays across for ≥ 2 h. | Simple, explainable; labelled as a heuristic. |
| **Deliverables** | `fra.predict` (48 h CSV + PNG), `fra.dashboard` (static HTML for the jury), model card. | Matches case section 4. |

## Where we differ from the study (and why)

- **Hysteresis on a 15-min grid for the rule baseline:** skipped. Hourly data with a one-step persistence approximation is disclosed instead; not worth the time.
- **Calibration and bootstrapped confidence intervals:** nice to have; only if time remains after the jury forecasts are produced.
- **Label volume:** the study suggested 8–12 weeks as a minimum. We sample about 16 months coarsely instead of a short window densely, to cover all seasons and wind regimes.

## Known caveats (go in the model card)

- The case rules (10/15 kt) differ from Fraport's public description (5 kt tailwind policy, west preference). The model learns the real behaviour, which is part of why it can beat the rule.
- RWY 18 "closed" is a proxy (no southbound departures in a busy hour).
- The test period is about 6 weeks in autumn 2026, so switch events are few. The results carry no confidence intervals unless time allows.

## Final result at the hackathon (walk-forward 15 Sep – 30 Oct 2026, operating direction)

| Lead | Model | Official rules | Persistence | Published prognosis |
|---|---|---|---|---|
| 1 h | **96.9 %** | 92.9 % | 96.3 % | 95.1 % |
| 6 h | **96.1 %** | 89.7 % | 88.8 % | 93.7 % |
| 24 h | **95.4 %** | 90.4 % | 72.5 % | 92.0 % |
| 48 h | **93.1 %** | 89.0 % | 67.0 % | 89.8 % |

Last improvement round (walk-forward, Brier 0.0434 → 0.0387): time of day incl. the night ban (switches cluster around traffic hours), the forecast tailwind 3 h before and after the valid time, stronger regularisation (C = 0.03), and the ECMWF tailwind at 100 m (small, consistent gain; 850/925 hPa were not available in the archive). ECMWF + DWD ICON-D2 consensus tailwind (Brier ~−2 %). Per-lead-bucket temperature scaling fitted out of sample on the last 14 training days (the L2-shrunk logit was underconfident; Brier 0.0358 → 0.0344, day-block bootstrap 95 % CI of the gain [0.0001, 0.0024]). Training only on the most recent 120 days (Brier 0.0407 → 0.0369 once summer-2025 labels arrived). These did not help: CAPE, share of westbound traffic in the last hour, tailwind on the runway in use (interaction terms), time since the last OD change, the observed tailwind trend, a tailwind threshold shape, the raw prognosis probability.

An independent leakage review fixed: `od_now` used the label of the hour starting at the issue time (1 h of future); hindcasts used today's stitched second-model series; the lead-48 ICON vintage could postdate the issue time.

## Parallel study round (13:23–13:50, four parallel studies, all via `experiments/harness.py`)

- **Model structure:** per-lead temperature scaling adopted (Brier 0.0358 → 0.0344). ~40 structural variants (buckets, splines, recency weights, hazard model, Platt scaling, boosting, blends) did not beat production.
- **RWY 18:** the old label was broken. 9 of 10 test "closures" were the arrival wave right after the night ban. Fixed the label (departure hours only), switched to a single weight set (C = 3), fixed a NaN-gust bug in the rule. Closure skill: BSS 0.55 at +1 h, ~1 false alarm per 1,000 h vs 20 for the official rule.
- **Weather features:** adopted `tw25_pastmin6` (lowest forecast tailwind on 25 over the previous 6 h), `xwf_east_tanh` (NE Bise vs SE pre-frontal easterly regime) and `shear_tw25` (100 m − 10 m tailwind): walk-forward Brier 0.0363 → 0.0348, holdout Mar–Sep 2026 −0.0005 (24/35 weeks better). Raw crosswind/direction features looked better on the test weeks but failed the holdout, so they were rejected.
- **Operational features:** best set within noise (−0.0004 Brier); not adopted. Insight: ~30 % of +1 h "switches" are night-ban carry-over artefacts.

## After the hackathon (31 Oct 2026)

One more day of work, in four steps: a harder yardstick, an honest data layer, a second model, and a live test that cannot be tuned on.

### A harder yardstick

- **Long walk-forward test:** issue times 1 Jun – 30 Oct 2026 (152 days, ~3,600 forecasts per lead time) instead of 7 autumn weeks, with 95 % confidence intervals from a day-block bootstrap and paired differences on identical rows (`fra/evalkit.py`). The hackathon weeks turned out to be the easy part of the year.
- **Labels rebuilt** from the radar counts. The model now trains only on directly observed hours, and the live truth carries the direction only through the night ban and quiet hours, never across a daytime hour that was not fetched.

### An honest data layer (`fra/dataset.py`)

| Change | Why | Effect on the logistic model (long test, paired, 95 % CI) |
|---|---|---|
| Current direction from the last completely published radar hour [t−2 h, t−1 h), in training and live | FANOMOS publishes in batches about every 16 min: 12 min after an hour ends only 25–35 % of its movements are visible, all of them after about 71 min (`experiments/eval_long/fanomos_lag.csv`). The hackathon used [t−1 h, t), which is not available live | 1 h accuracy −0.7 pp [−1.0, −0.3], Brier(1,6,24,48) +0.0013 [+0.0009, +0.0017]: the honest cost, gone from 24 h on |
| ICON-D2 consensus filled with ICON-EU where D2 ends | D2 is missing in half the rows at 43–44 h and in all rows at 45–48 h | Brier at 42–48 h −0.0028 [−0.0050, −0.0006] |
| Train on all 48 lead times instead of 12 | more rows per lead bucket | neutral overall; 6 h accuracy +0.5 pp [+0.1, +0.9] |
| Train only on directly observed hours | before Feb 2026 the labels filled daytime sampling gaps | Brier −0.00006 [−0.00015, −0.000003]: label hygiene, no real gain |

The live job now runs at :30 local time, 90 min after the source hour ended, so that hour is complete.

### Re-testing the hackathon choices (21 pre-registered variants, `experiments/phase2/`)

Only the clean-label change passed the pre-registered rule. The old finding "the last 120 days beat all history" was partly caused by the filled labels; a longer memory still costs about 0.5 pp at 24 h while it helps at 1 h, so the 120-day window stays. Other C values, six lead groups and LightGBM (alone or blended) did not help. Temperature scaling is now neutral and stays on. Forecast-error path features as extra inputs had the best point estimate (−0.00064 [−0.00153, +0.00027]) but are not computed live, so they are not used.

### A second model: decisions on simulated wind

- **Hourly decision model** (`fra/decision.py`): given the actual wind and the direction in use, how likely does the airport keep it for the next hour? One logistic model per direction, with the tailwind on the runway in use (now, before and over the next 6 h), gusts, crosswind, time of day, the first hour after the night ban, weekend and season.
- **Forecast-error model** (`fra/fcerror.py`): turns one forecast into 200 plausible actual-wind futures by adding whole 48 h error paths from similar past situations (ECMWF runs from Mar 2024 against METAR). It beats a calibrated Gaussian baseline on questions about whole periods, e.g. "tailwind above 5 kt at any time 25–48 h ahead" (`experiments/partb/REPORT.md`).
- **Blend** (`fra/blend.py`): 50 % logistic model + 50 % decision model rolled out along the 200 futures, starting from the last known flown hour and bridging the two unpublished hours with the observed wind. The weight is fixed at 50/50; weights fitted week by week were slightly worse.

| Long test, 1 Jun – 30 Oct 2026 (`experiments/integration/final_eval_od.csv`) | 1 h | 6 h | 24 h | 48 h | Brier(1,6,24,48) |
|---|---|---|---|---|---|
| **Blend (official since 31 Oct 2026)** | **96.8 %** | **94.9 %** | **94.7 %** | **93.0 %** | **0.0389** [0.0296, 0.0481] |
| Logistic model alone | 95.5 % | 94.6 % | 94.1 % | 92.9 % | 0.0429 [0.0328, 0.0531] |
| Published prognosis | 93.7 % | 92.9 % | 91.2 % | 89.2 % | 0.0823 |
| Official rules | 91.0 % | 90.2 % | 88.5 % | 87.0 % | 0.1082 |
| Naive "no change" | 94.4 % | 87.7 % | 75.3 % | 65.7 % | 0.1916 |

- Blend − logistic model: Brier −0.0041 [−0.0067, −0.0018]; on the part before 15 Sep −0.0043 [−0.0073, −0.0016].
- Next direction change (`experiments/integration/nextchange_results.json`): 80.0 % event accuracy vs 77.8 % for the logistic model (thresholds re-chosen week by week from the past only), 69.7 % for the prognosis and 62.3 % for the rules.
- Weak spot: on hours whose direction changed within 6 h, the blend is worse than the logistic model alone (68.8 % vs 74.7 %, −5.8 pp [−10.4, −2.2]).
- Runway 18 keeps the logistic model: a closure model on the simulated wind ranks closures better (AUC 0.84 vs 0.66) but has a worse Brier score (`experiments/integration/rwy18_results.json`).

### Selection noise, and the referee

About 38 variants of the blend and its parts and 21 re-tests of the logistic model were compared on the same 152 days. Differences of 0.001–0.002 in Brier are therefore noise, and no part of the long test is untouched by the blend's design; choosing the blend as the official forecast was itself decided on the long test, after the fact. The referee is the live record. Every hour since 31 Oct 2026 the official forecast and three comparison variants (the logistic model alone, the previous official system, the hackathon model) are issued from frozen code and archived before the outcome exists. Forecasts from 1 Nov 2026 00:00 UTC form the locked holdout. Metric, rows, bootstrap and decision rule were written down in advance (`experiments/integration/preregistration.json`): after 4 weeks (evaluated on 1 Dec 2026) the blend is confirmed if its Brier advantage over the logistic model alone is significant, replaced if it is significantly worse, and otherwise kept while the comparison runs to 8 weeks.

### Twelve years of data, being collected

The radar-derived flown direction back to 2014 (3 sampled hours per day first, then denser), the published prognosis 2016 – 2025, METAR 2014 – 2026 and ERA5 reanalysis 2014 – 2026 (research only, never a forecast input). None of it is used by the current model; the decision model is the first candidate to learn from it, after the holdout.
