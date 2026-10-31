# Conclusion: how we build it

Combined from the initial research brief ([background-research.md](background-research.md)) and what we verified while building.

## Decisions

| Topic | Decision | Why |
| --- | --- | --- |
| **Labels (flown OD)** | Umwelthaus INAA / FANOMOS radar tracks (`Fanomos/GetFlightTracks`). Low-level movement within 15 km and below 3,000 ft: track ~250° → OD 25, ~070° → OD 07. | Only public source of *actually flown* direction. Verified: 1 Oct 2025 shows clean OD 07 all day and the night ban. |
| **RWY 18 label** | "Open" = at least one southbound departure from west of the field in a busy hour (≥ 15 movements). Quiet hours are unlabeled. | As the research brief pointed out: "not used" ≠ "closed". In busy hours, no use is a reasonable closure proxy. |
| **Label sampling** | Hourly for the test period (from 15 Sep 2026), 3 then 6 sampled hours per day for training (from Jun 2025). | The server handles about 0.4 requests/s, so a full hourly history would take about 7 h. |
| **Weather features** | Open-Meteo Previous Runs (vintages issued at least 1 and 2 days earlier), upgraded to Single Runs ECMWF IFS (exact run init, 6 h publication buffer) once `fra/singleruns.py` was in place. | Training only on forecasts that were already published at issue time. The stitched "latest" (d0) series is never used for training. |
| **Observations** | IEM METAR EDDF for the current wind at issue time. | Gives short-lead skill. |
| **Model** | Regularised logistic regression (C = 0.03) with separate weights per lead bucket (1–3/4–12/13–30/31–48 h). Inputs: published INAA prognosis (main + alternative scenario), official rule on the ECMWF forecast, current flown OD, forecast tailwind on 25 (hourly, 6 h mean, 3 h before/after), time of day incl. night ban. | With only weeks of real labels, LightGBM overfit (88–95 %). The small model won under walk-forward testing; larger feature sets, a second NWP model and a LightGBM ensemble did not. |
| **Published prognosis** | Umwelthaus INAA `Direction/GetDirectionData?currentTime=t` returns the OD prognosis live at t (verified: blocks and probabilities change across as-of times). Used as a feature and as an extra baseline. | Fast (0.1 s), as-of, and carries forecaster knowledge. On its own it is weaker than our model. |
| **Baselines** | (1) the official section 3 rules applied to the same forecast, (2) persistence (keep current OD). | The case requires beating (1); (2) is the hardest to beat at 1 h. |
| **Evaluation** | Walk-forward by week from 15 Sep 2026: each week is predicted by a model trained only on outcomes known before it. Report accuracy and Brier at 1/6/24/48 h against the rules, persistence and the published prognosis, plus accuracy on *changed* hours. | Strict reading of "only data available at forecast time" (the review showed blocked CV that also trains on later weeks was ~1–2 pp optimistic at 6–24 h). |
| **Next change time** | First hour where the 3 h smoothed P(OD 25) crosses 0.5 and stays across for ≥ 2 h. | Simple, explainable; labelled as a heuristic. |
| **Deliverables** | `fra.predict` (48 h CSV + PNG), `fra.dashboard` (static HTML for the jury), model card. | Matches case section 4. |

## Where we differ from the research brief (and why)

- **Hysteresis on a 15-min grid for the rule baseline:** skipped. Hourly data with a one-step persistence approximation is disclosed instead; not worth the time.
- **Calibration and bootstrapped confidence intervals:** nice to have; only if time remains after the jury forecasts are produced.
- **Label volume:** the brief suggested 8–12 weeks as a minimum. We sample about 16 months coarsely instead of a short window densely, to cover all seasons and wind regimes.

## Known caveats (go in the model card)

- The case rules (10/15 kt) differ from Fraport's public description (5 kt tailwind policy, west preference). The model learns the real behaviour, which is part of why it can beat the rule.
- RWY 18 "closed" is a proxy (no southbound departures in a busy hour).
- The test period is about 6 weeks in autumn 2026, so switch events are few. The results carry no confidence intervals unless time allows.

## Final result (walk-forward, operating direction)

| Lead | Model | Official rules | Persistence | Published prognosis |
|---|---|---|---|---|
| 1 h | **96.9 %** | 92.9 % | 96.3 % | 95.1 % |
| 6 h | **96.1 %** | 89.7 % | 88.8 % | 93.7 % |
| 24 h | **95.4 %** | 90.4 % | 72.5 % | 92.0 % |
| 48 h | **93.1 %** | 89.0 % | 67.0 % | 89.8 % |

Last improvement round (walk-forward, Brier 0.0434 → 0.0387): time of day incl. the night ban (switches cluster around traffic hours), the forecast tailwind 3 h before and after the valid time, stronger regularisation (C = 0.03), and the ECMWF tailwind at 100 m (small, consistent gain; 850/925 hPa were not available in the archive). ECMWF + DWD ICON-D2 consensus tailwind (Brier ~−2 %). Per-lead-bucket temperature scaling fitted out of sample on the last 14 training days (the L2-shrunk logit was underconfident; Brier 0.0358 → 0.0344, day-block bootstrap 95 % CI of the gain [0.0001, 0.0024]). Training only on the most recent 120 days (Brier 0.0407 → 0.0369 once summer-2025 labels arrived). These did not help: CAPE, share of westbound traffic in the last hour, tailwind on the runway in use (interaction terms), time since the last OD change, the observed tailwind trend, a tailwind threshold shape, the raw prognosis probability.

An independent leakage review found and fixed three issues: `od_now` used the label of the hour starting at the issue time (1 h of future); hindcasts used today's stitched second-model series; the lead-48 ICON vintage could postdate the issue time.

## Final round: four parallel studies (13:23–13:50, all via `experiments/harness.py`)

- **Model structure** (`experiments/model_structure/`): per-lead temperature scaling adopted (Brier 0.0358 → 0.0344). ~40 structural variants (buckets, splines, recency weights, hazard model, Platt scaling, boosting, blends) did not beat production.
- **RWY 18** (`experiments/rwy18/`): the old label was broken. 9 of 10 test "closures" were the arrival wave right after the night ban. Fixed the label (departure hours only), switched to a single weight set (C = 3), fixed a NaN-gust bug in the rule. Closure skill: BSS 0.55 at +1 h, ~1 false alarm per 1,000 h vs 20 for the official rule.
- **Weather features** (`experiments/weather_features/`): adopted `tw25_pastmin6` (lowest forecast tailwind on 25 over the previous 6 h), `xwf_east_tanh` (NE Bise vs SE pre-frontal easterly regime) and `shear_tw25` (100 m − 10 m tailwind): walk-forward Brier 0.0363 → 0.0348, holdout Mar–Sep 2026 −0.0005 (24/35 weeks better). Raw crosswind/direction features looked better on the test weeks but failed the holdout, so they were rejected.
- **Operational features** (`experiments/ops_features/`): best set within noise (−0.0004 Brier); not adopted. Insight: ~30 % of +1 h "switches" are night-ban carry-over artefacts.
