# Part B: how wrong is the weather forecast? (`fra/fcerror.py`)

This is a forecast-error model learned only from archived forecasts and observed METAR wind (no radar labels). It turns one deterministic forecast into N = 200 plausible actual-wind futures for the next 48 h. The forecast is ECMWF IFS, plus DWD ICON-D2 when available.

It works by adding whole 48 h residual paths (observed minus forecast) from past analogue situations, so the time correlation of real forecast errors is kept. Part A (`fra/decision.py`) runs the operating-direction decision along these paths.

## Summary

**Test setup:** walk-forward, hourly issue times 2026-06-01 .. 2026-10-31, n = 3,142 issues (every model scored on the same issues), 48 leads each. Truth = hourly METAR at EDDF. The library holds 23,004 hourly entries and 3,524 IFS runs from 2024-03-14; each issue only uses entries whose observations were complete before it.

| tailwind on RWY 25 (kt) | CRPS 6 h | CRPS 24 h | CRPS 48 h | Brier P(>5 kt) 24 h | path Brier 1-12 h | 13-24 h | 25-48 h |
|---|---|---|---|---|---|---|---|
| raw consensus forecast (CRPS = MAE) | 2.276 | 2.369 | 2.459 | 0.113 | 0.172 | 0.163 | 0.179 |
| Gaussian per lead, ECMWF (reference only) | 1.644 | 1.711 | 1.791 | 0.062 | 0.100 | 0.114 | 0.139 |
| EMOS/NGR + copula, ECMWF | 1.477 | 1.573 | 1.649 | 0.059 | 0.050 | 0.057 | 0.071 |
| EMOS/NGR + copula, consensus (mixed library) | 1.407 | 1.508 | 1.650 | 0.056 | 0.043 | 0.046 | 0.056 |
| **analogue paths, DEFAULT** | **1.389** | **1.471** | **1.631** | **0.049** | **0.040** | **0.041** | **0.042** |
| analogue paths, DEFAULT_NATIVE | 1.382 | 1.453 | 1.644 | 0.049 | 0.043 | 0.044 | 0.043 |

"Path Brier" is the Brier score of P(tailwind 25 > 5 kt in at least one hour of the window).

- **Against the strong baseline (EMOS/NGR, forecast-conditioned Gaussian refitted weekly):** DEFAULT's CRPS is 1.3 % / 2.5 % / 1.1 % lower at 6 / 24 / 48 h. Day-block bootstrap differences are -0.018 [-0.039, +0.003], -0.038 [-0.062, -0.013] and -0.018 [-0.048, +0.011], so **only the 24 h gain is significant**.
- **The clear wins are exceedances and path questions:**
  - Brier of P(>5 kt) at 24 h is 13.5 % lower.
  - Path questions are 7 % / 10 % / 25 % lower than EMOS + Gaussian copula: -0.0030 [-0.0081, +0.0018], -0.0046 [-0.0089, -0.0006] and -0.0143 [-0.0255, -0.0039].
- **Robustness period** (Nov 2025 - Apr 2026, ECMWF only, n = 4,293): DEFAULT_IFS against EMOS on ECMWF:
  - CRPS 1.278 / 1.359 / 1.563 vs 1.325 / 1.393 / 1.557 (-3.5 % / -2.4 % / +0.4 %).
  - Path Brier 0.052 / 0.071 vs 0.059 / 0.080.
- **Weak baselines (reference only):** -15.5 % / -14.0 % / -8.9 % CRPS against a per-lead Gaussian, and -39 % / -38 % / -34 % against the raw forecast's MAE. Much of this gain comes from conditioning on the forecast, which EMOS also does.
- **Time correlation is preserved:** simulated residual autocorrelation 0.571 / 0.325 / 0.185 at lags 1 / 3 / 6 h, against 0.571 / 0.353 / 0.217 in reality.
- **Other variables:**
  - Tailwind on 18: CRPS 1.463 / 1.565 / 1.725 vs EMOS consensus 1.487 / 1.613 / 1.740.
  - Gust tailwind on 18: 1.552 / 1.669 / 1.875 vs 1.582 / 1.704 / 1.833. EMOS is better at 48 h and better calibrated (PIT deviation 0.05 vs 0.20); DEFAULT is over-dispersed (80 % interval covers 0.884).
- **Part A end-to-end** (OD Brier(1,6,24,48) with paths): DEFAULT 0.0408, DEFAULT_NATIVE 0.0407, native with weight 0.25: 0.0418, DEFAULT_IFS 0.0450.
- **As extra linear features in the production logit: no gain.** Harness Brier 0.0428; adding path features gives 0.0426-0.0431.

## Calibration: what is and is not calibrated

**Pooled measures:** PIT bins stay within 0.079-0.118, and the 80 % / 95 % intervals cover 0.83 / 0.96 (slightly over-dispersed).

**Conditional on the decision threshold, P(tailwind 25 > 5 kt) is under-forecast in the test period** for P between 0.4 and 0.85:

| lead | forecast P → observed | simulated mean too low by | simulated sd vs actual sd of (obs - sim mean) |
|---|---|---|---|
| 6 h | 0.50 → 0.67, 0.70 → 0.88, 0.85 → 0.97 | 0.9 kt | 2.7 vs 1.8-2.1 |
| 24 h | 0.48 → 0.60, 0.71 → 0.84, 0.86 → 0.93 | 0.7-0.9 kt | 2.6-2.8 vs 2.2-2.3 |

**Cause:** DEFAULT adds residual paths to the ECMWF+ICON consensus. Until May 2026 those residuals are relative to ECMWF alone. In easterly regimes ICON-D2 is lower than ECMWF, so the consensus is under-corrected by about half the ICON-ECMWF difference. On the same test cases:

| centre / residual library | bias for P(>5) in [0.4, 0.85) |
|---|---|
| ECMWF centre, ECMWF residuals (DEFAULT_IFS) | -0.2 .. +0.4 kt |
| consensus-only residual library | 0 .. +0.8 kt |
| EMOS on the same mixed library | same pattern (0.50 → 0.70) |

A July 2026 regime effect comes on top. The robustness period is calibrated (DEFAULT_IFS at 6 h: 0.50 → 0.45, 0.70 → 0.77, 0.92 → 0.96).

**Over-dispersion in strong-tailwind regimes is present in all periods**, and somewhat too narrow ensembles in weak regimes. It is not fixed.

**DEFAULT_NATIVE** (`mix_native=True`, ECMWF-only entries weighted 0.1) adds an ECMWF-only analogue's residual to the target's ECMWF forecast. It also matches that analogue on the ECMWF regime, speed and current error.
- Removes most of the bias: at 24 h 0.49 → 0.44, 0.71 → 0.75, 0.88 → 0.93.
- Lowers CRPS: 1.456 vs 1.474 over all leads.
- But scores worse on path questions: 0.0430 vs 0.0404 for 1-12 h, CI [-0.0050, -0.0001].
- Worse at lead 1 (1.273 vs 1.253) and 48 h.
- Only ties DEFAULT in Part A's end-to-end score.

**DEFAULT therefore stays.** If a probability like P(>5) is used directly (`path_features` `pw_tw25_gt5`), recalibrate it walk-forward first, for example with an isotonic or logistic map. Re-check DEFAULT vs DEFAULT_NATIVE on the locked holdout (from 2026-11-01).

P(tailwind 25 > 0) is over-forecast in the mid bins (24 h: 0.48 → 0.37), from METAR calm and exact-crosswind zeros.

## Data and definitions

**Sources:**
- Forecasts: `data/ifs_runs.parquet` + `data/ifs_runs_backfill.parquet` (6-hourly ECMWF IFS, leads 0-71); `data/icon_runs.parquet` (ICON-D2 from 2026-05, 3-hourly, leads 0-48).
- Observations: `data/metar_full.parquet`, IEM METAR EDDF.

**Observation of hour t:** the mean u/v of the METARs in [t-30 min, t+30 min), which is the hh:50 report just before t.
- Calm, or variable wind (VRB) at 3 kt or less: u = v = 0.
- VRB above 3 kt, or no report: interpolated only across gaps of at most 2 h in total. Longer gaps stay missing. Interpolated hours are excluded from verification.
- Gust: max(mean speed, reported gust).

## Method (unchanged except the gap rule and the new option)

1. Run residuals: obs(i+l) - fc_i(i+l) for leads l = 0..60. A run is eligible for issue T iff init + 61 h <= T.
2. Hourly pseudo-issue library: ECMWF init <= tau - 6 h, ICON init <= tau - 4 h. Each entry stores the forecast, observed and residual paths for leads 0..48, and r_now = last METAR at or before tau minus the forecast for tau.
3. Eligibility for issue T: tau + 51 h <= T and init + 61 h <= T. Verified end to end by rebuilding the library from archives truncated at T (`check_api.py`): bit-identical paths for 16 issues, including the hours right after every METAR gap of 4 h or more since 2024-06.
4. Analogue weights:
   - season: sigma 60 d;
   - issue hour of day: sigma 2 h;
   - forecast u/v in four 12 h blocks: sigma 3 kt;
   - with a consensus centre, ECMWF-only entries get weight 0.25.

   If the effective sample size (ESS) drops below 25, the kernel is widened.
5. Draw 200 whole residual paths, then adjust each:
   - current-error shift beta(L), tapered exp(-L/12 h);
   - rescaling by forecast speed (a = 10 kt) and ECMWF-ICON spread (b = 4 kt);
   - calm carry-over below 3 kt.
6. Centre: the ECMWF+ICON consensus. DEFAULT_IFS is used automatically when ICON is missing for leads 1-42.

## What won and what lost (test CRPS over all leads)

| change | effect |
|---|---|
| forecast-regime weighting | 1.678 -> 1.529 (A1 -> A2); robustness period 1.502 -> 1.392 |
| current-error shift | lead 1: 1.464 -> 1.301 |
| consensus centre, mixed library | 1.515 -> 1.474 |
| ECMWF-only entries weighted 0.25 | -0.035 |
| speed rescaling, calm carry-over, spread rescaling | -0.002 / -0.007 / -0.005 |
| native centring (DEFAULT_NATIVE) | -0.018 CRPS, but worse path questions; ties end to end |
| lost | local beta, kernel on current error, recency half-life, issue-hour sigma 0.5/1, ESS 10/50, consensus-only library |

Sampling noise (3 seeds): CRPS 1.4742 / 1.4733 / 1.4737.

## API (`fra/fcerror.py`)

```python
lib = F.load_library()
fr  = F.forecast_frame(issue)      # or F.live_forecast_frame()
p   = F.sample_paths(issue, fr, n=200, obs_now_uvg=None, params=F.DEFAULT)
p.u, p.v, p.gust, p.speed, p.tw25, p.tw18, p.gtw18   # each [n, 48]
F.path_features(rows[['issue', 'lead']])
F.DEFAULT, F.DEFAULT_IFS, F.DEFAULT_NATIVE, F.Params
```

## Caveats

- The paths describe what the hourly METAR will show, not the tower's 2-min runway winds.
- ICON history covers only 2026-05 .. 2026-10.
- DEFAULT's P(>5) is under-forecast in the test period (see above), and spread is too wide in strong-tailwind regimes.
- Gust tailwind on 18 is over-dispersed.
- The 48 h gain is small because ICON-D2 ends around lead 44-48.

## Reproduce

- `uv run python -m experiments.partb.final` (about 7 min, 4 workers)
- `uv run python -m experiments.partb.check_api`
- `uv run python -m experiments.partb.e2e_parta_replay default native native_w0.25 ifs`
- `uv run python -m experiments.partb.harness_check --refresh`