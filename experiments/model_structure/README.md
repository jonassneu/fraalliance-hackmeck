# Model structure and calibration (2026-10-30)

**Question:** can a different model structure, training scheme or calibration beat the production model? The
production model is a regularised logistic regression (C = 0.03) with separate weights per lead bucket (1–3, 4–12,
13–30, 31–48 h), trained on the last 120 days.

**Answer:** one change helped: temperature scaling per lead bucket, fitted out of sample on the last 14 training days
and clipped to [0.5, 1.5]. The L2-shrunk logit was underconfident, and sharpening fixed that. Walk-forward Brier
went from 0.0358 to 0.0344. A day-block bootstrap gives a 95 % CI for the gain of [0.0001, 0.0024]. **Adopted** in
`fra/train.py` (`fit_temperature`). Accuracy is unchanged, because temperature scaling never flips a prediction.

| Family (script) | Best variant | Brier 1/6/24/48 h | vs. production 0.0358 |
| --- | --- | --- | --- |
| Temperature scaling per lead bucket (`variants3–5.py`, `proposal.py`) | 14-day fit, clipped | 0.0344 | **better, adopted** |
| Training window / recency weighting (`variants.py`) | 120 days, no weighting (= production) | 0.0358 | all-history 0.0390, half-life weighting ≥ 0.0366 |
| Regularisation: C, L1, per-feature scaling (`variants.py`, `variants2.py`) | C = 0.1 | 0.0355 | within noise |
| Lead structure: bucket layouts, shared weights + deviations, splines in lead (`variants.py`, `variants2.py`) | shared weights + 4 buckets | 0.0355 | within noise |
| Monotone hinge transforms of the tailwind (`variants.py`) | hinge on tailwind 25 | 0.0356 | within noise |
| Blends and bagging: LightGBM, published prognosis (`variants.py`, `variants2.py`) | bagged C values | 0.0359 | no gain |
| Symmetric switch-hazard formulation (`variants.py`) | – | 0.0385 | worse: the asymmetry between 07 and 25 matters |
| Platt scaling (`variants.py`) | – | 0.0392 | worse |

## Files

| Script | Purpose |
| --- | --- |
| `variants.py` | Batch 1: training windows, recency weights, regularisation, lead structure, hazard model, hinges, Platt, blends |
| `variants2.py` | Batch 2: per-bucket / per-feature regularisation, bagging, combinations |
| `variants3.py` – `variants5.py` | Batches 3–5: temperature-scaling design and robustness (window, clipping, smoothing, fixed constants) |
| `proposal.py` | Drop-in for `fra/train.py`: production logit + nested temperature scaling (what was adopted) |
| `perlead.py`, `perweek.py` | Per-lead and per-week comparison of production vs. the proposal |
| `final_checks.py` | Day-block bootstrap of the Brier gain; temperature scaling on the RWY 18 model (no gain) |

Results: `results/results*.csv` (one table per batch) and `results/console_output.txt` (all runs, in order).
Run from the repository root: `uv run python -m experiments.model_structure.variants [variant ...]` (no argument = all variants).
