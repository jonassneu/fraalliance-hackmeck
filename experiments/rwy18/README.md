# RWY 18: label audit, features, metrics (2026-10-30)

**Outcome:** the label fix (v2) and the single-bucket RWY 18 model with C = 3 were adopted in production
(`fra/labels.py`, `fra/train.py`), and the closure metrics below are the ones quoted in the model card. Result tables
are in `results/`; walk-forward predictions are written to `data/rwy18_preds/`. The notes below are the study
report as written on the day.

Scripts: `inspect_labels.py` (label audit), `features.py` (label variants + candidate features -> `data/rwy18_cache.parquet`),
`evalwf.py` / `run1.py` (walk-forward with closure metrics), `summary.py` (comparison + event table). Nothing under `fra/` was touched.

## 1. Label audit (the big one)

`data/inaa_counts.csv`: 2,369 busy hours (>= 15 movements on 07/25), 20 with zero RWY 18 departures = "closed".

| closed hour (UTC) | OD | METAR wind | gust tailwind on 18 | verdict |
|---|---|---|---|---|
| 2025-09-23 12, 18; 09-24 06 | 07 | 030-040°/16-19 kt | 14-16 kt | real north-wind closure |
| 2025-12-24 12, 18 | 07 | 030-040°/19-23 G36 | 16-28 kt | real |
| 2026-02-14 12, 18 | 07 | 010-020°/11-15 kt | 11-15 kt | real (steady N wind) |
| 2026-04-13 06, 04-15 06 | 07 | 3-8 kt | < 8 kt | not wind (maintenance / data?) |
| 2026-07-30 15 | 25 | 290-310°/20 kt | 7-13 kt | borderline, gusty NW |
| **2026-09-20 03, 09-21 03, 09-28 03, 10-11 03, 10-12 03, 10-13 03, 10-17 03, 10-25 04, 10-26 04** | 25 | 200° (headwind!) 2-17 kt | < 0 | **artefact: first hour after the night ban (05 local) = arrival wave, no departures at all** |
| 2026-10-28 17 | 25 | 3-4 kt | ~0 | not wind |

* 9 of the 10 "closures" in the walk-forward test period (from 15 Sep 2026) are the 05-local arrival-wave hour.
  That hour is never sampled in the coarse training history (3-6 hours/day), so the model cannot learn it and the
  "closure" skill reported on the model card is measuring an artefact. Production model on the production label in the
  test period: closure AUC 0.39, 0 of 10 closures caught at any threshold (`results/candidates.txt`, section `o_PROD_v1_std.txt`).
* Real 15-kt-rule closures occurred on 3-4 days in 16 months (Sep 2025, Dec 2025, Feb 2026, maybe Jul 2026).
  Under the official rule they should be more frequent: of 15 busy hours with OBSERVED gust tailwind >= 15 kt, only 3
  had RWY 18 unused (median 20 departures!). With the MEAN tailwind >= 15 kt: 3 of 4 closed. The airport evidently
  applies the limit to the steady wind, not the gusts. Forecast-side (ECMWF, lead 1): the gust rule fires 56 rows,
  6 closed, 50 open. Among those rows the closures have mean tailwind 7-9 kt and 100 m tailwind 12-15 kt vs 6 / 10 kt
  for the false alarms -> `tw18` (mean) and `tw18_100m` are the discriminators, `tw18_gust` alone is not.

### Label v2 (recommended): drop into `fra/labels.py::to_labels`
```python
def to_labels(raw, min_moves=4):
    """Hourly labels. OD where movements agree; RWY18 'open' = used, only judged in busy departure hours."""
    raw = raw.asfreq("h")
    n = raw["west"] + raw["east"]
    od = pd.Series(np.where(raw["west"] >= raw["east"], 25, 7), index=raw.index, dtype=float)
    od[(n < min_moves) | raw["west"].isna()] = np.nan
    lab = pd.DataFrame({"od": od.ffill(limit=8)})  # night ban hours: OD persists
    lab["west_frac"] = (raw["west"] / n).where(n >= min_moves)
    # RWY 18 is only judged when departures actually happen: the first hour after the night ban (05-06 local)
    # is the long-haul arrival wave with hardly any departures -> "no RWY 18 departure" says nothing there.
    dep_hour = raw.index.tz_convert("Europe/Berlin").hour >= 6
    busy = (n >= 15) & dep_hour
    lab["rwy18_open"] = np.where(busy, raw["rwy18_deps"] > 0, np.nan).astype(float)
    return lab
```
Then `python -m fra.labels --write` and retrain. Same guard in `fra/predict.py::flown_state`:
```python
            local_h = (issue - pd.Timedelta(hours=k + 1)).tz_convert("Europe/Berlin").hour
            busy = r["west"] + r["east"] >= 15 and local_h >= 6
```
Effect on counts: closures 20 -> 11 valid hours (215 -> 107 (issue, lead) rows); test period from 15 Sep 2026: 10 -> 1.
Optional v3 (ratio < 5 % of movements counts as closed) adds 2025-12-24 06 and 2026-03-30 12 (partial closures, 2-3 deps)
but also one artefact; not worth it.

### Consequence for evaluation
With the honest label the standard test period has ONE closure hour. Closure skill must be reported on the extended
walk-forward (weekly from 1 Sep 2025, train strictly on the past) which contains the Sep 2025 / Dec 2025 / Feb 2026 events.
The ML model only gets predictions once >= 1 closure is in its training history, i.e. from the Dec 2025 event on;
the rule baseline is evaluated on all of it.

## 2. Features / model: code

`fra/singleruns.py::_features` (works for archive AND live path), after the `tw25/tw18 _roll6` loop:
```python
    # worst gust tailwind on 18 within +-1 h of the valid time, same run (closures are hour-scale events)
    s = pd.Series(d.tw18_gust.to_numpy(), index=idx)
    win = [s.reindex(pd.MultiIndex.from_arrays([d.init, d.valid + pd.Timedelta(hours=h)])).to_numpy() for h in (-1, 0, 1)]
    d['tw18g_max3'] = np.nanmax(np.column_stack(win), axis=1)
```
and add `'tw18g_max3'` to the `cols` list. `fra/dataset.py::build` (singleruns branch), before `return add_state(...)`:
```python
        d["tw18_100m_f"] = d["tw18_100m"].fillna(d["tw18"]) if "tw18_100m" in d else d["tw18"]
```
`fra/train.py`:
```python
LOGIT = {"od25": [...unchanged...],
         "rwy18": ["rule_18", "rwy18_now_f", "tw18_gust", "tw18_roll6", "obs_tw18", "tw18_100m_f", "tw18g_max3"]}
BUCKETS_T = {"od25": BUCKETS, "rwy18": [(1, 48)]}   # 11 closure hours cannot support 4 x weights

def design(d, tgt):
    base = d[LOGIT[tgt]].fillna(0).astype(float)
    cols = {}
    for lo, hi in BUCKETS_T[tgt]:
        ...
```
`fra/rules.py::add_components` (NaN gust currently makes the rule say "closed"):
```python
    g = df[gust].fillna(s) if gust in df else s
```

## 3. Metrics for the jury (replace raw accuracy for RWY 18)

Accuracy is 99 % for everything incl. "always open". Report instead, per lead, closure = positive class:
* **Brier skill score vs climatology** (reference = training-period open rate, as a climatology forecaster would issue).
* **AUC** (does the model rank closure hours above open hours?).
* **Closure hit rate and false alarms at a warning threshold** P(open) < 0.8 (closures are rare, so 0.5 never fires;
  a planner wants a warning, and 0.8 keeps false alarms to a handful of hours per year).
* The same three for the official rule (its "probability" is 0/1).

Drop-in for `fra/train.py::evaluate` (add inside the `for lead in leads` loop, RWY 18 only):
```python
            if tgt == "rwy18":
                closed = y[m] == 0
                clim = np.full(m.sum(), y[has].mean())            # climatology reference (all labelled rows)
                r["model_bss"] = 1 - r["model_brier"] / np.mean((clim - y[m]) ** 2)
                r["model_auc"] = roc_auc_score(closed, 1 - probs[tgt][m]) if closed.any() else np.nan
                warn = probs[tgt][m] < 0.8
                r["closure_hit_warn"] = (warn & closed).sum() / max(closed.sum(), 1)
                r["false_alarms_warn"] = int((warn & ~closed).sum())
                r["rule_closure_hit"] = ((base[tgt]["rule"][m] == 0) & closed).sum() / max(closed.sum(), 1)
                r["rule_false_alarms"] = int(((base[tgt]["rule"][m] == 0) & ~closed).sum())
```
(`from sklearn.metrics import roc_auc_score`). And in `main()` use an earlier `cv_start` for the RWY 18 target
(e.g. `pd.Timestamp("2025-09-01", tz="UTC")`), otherwise the test window contains a single closure hour.

## 4. Measured results (walk-forward, weekly folds, train strictly on the past)

Period "ext" = from 1 Sep 2025 (contains the real events); ML rows are scored only where the training history already
held >= 1 closure (from the Dec 2025 event on: 79 closure rows = 8 valid hours, of which 4 are wind closures:
24 Dec 2025 12/18 UTC, 14 Feb 2026 12/18 UTC; the other 4 are the non-wind oddities). Rule/persistence scored on all 107.
Closure = positive class. BSS = Brier skill vs climatology. hitW/faW = closures caught / false-alarm rows at P(open) < 0.8.

| model (label) | BSS 1h | BSS 6h | BSS 24h | BSS 48h | BSS all | AUC all | hitW all | faW all (of ~21k rows) |
|---|---|---|---|---|---|---|---|---|
| PROD, old label v1, std period (model card) | -0.01 | -0.01 | -0.01 | -0.03 | -0.01 | 0.36 | 0.00 | 1 |
| PROD, old label v1, ext | 0.15 | 0.06 | 0.07 | 0.10 | 0.09 | 0.61 | 0.20 | 39 |
| PROD, label v2, ext | 0.39 | 0.17 | 0.18 | 0.23 | 0.23 | 0.75 | 0.47 | 42 |
| **PROD features, no lead buckets, v2** | **0.50** | **0.19** | **0.27** | 0.22 | **0.28** | 0.73 | 0.47 | **27** |
| + tw18_100m (bucketed) | 0.39 | 0.17 | 0.17 | 0.10 | 0.22 | **0.79** | 0.47 | 44 |
| + ECMWF/ICON consensus gust tailwind | 0.39 | 0.18 | 0.18 | 0.22 | 0.23 | 0.77 | 0.47 | 40 |
| + same-run max gust tailwind +-1 h | 0.38 | 0.17 | 0.18 | 0.22 | 0.23 | 0.75 | 0.46 | 46 |
| + crosswind 18 | 0.32 | 0.11 | 0.22 | 0.29 | 0.21 | 0.71 | 0.33 | 36 |
| + NE-sector x tailwind | 0.40 | 0.17 | 0.19 | 0.20 | 0.23 | 0.72 | 0.49 | 52 |
| + OD interactions | 0.41 | 0.15 | 0.10 | 0.11 | 0.21 | 0.71 | 0.39 | 50 |
| official rule (gust tailwind >= 15 kt, forecast) | -4.0 | -3.3 | -4.0 | -5.2 | -3.6 | 0.79 | 0.60 | 446 |
| persistence | -0.12 | 0.00 | -0.12 | 0.00 | -0.07 | 0.50 | 0.00 | 8 |

Warning-threshold sweep (label v2, ext, all leads; FA = false-alarm rows per 1000 open rows):

| threshold P(open) < | 0.5 | 0.7 | 0.8 | 0.9 | rule |
|---|---|---|---|---|---|
| no-bucket model: closure hit rate | 0.28 | 0.37 | 0.47 | 0.51 | 0.51 |
| no-bucket model: FA / 1000 | 0.0 | 0.3 | 1.3 | 5.2 | 20.1 |
| PROD (bucketed): hit | 0.15 | 0.34 | 0.47 | 0.51 | 0.51 |
| PROD: FA / 1000 | 0.05 | 0.7 | 2.0 | 7.5 | 20.1 |

Reading: every wind closure that the model could be scored on is flagged at P(open) < 0.8 within 6 h (hit 0.54 of
scored rows = all 4 wind hours; the 4 non-wind hours are unpredictable from weather), with ~1.5 false alarms per 1000
hours vs 20 per 1000 for the official rule at the same hit rate. The ML's job here is calibration of the rule, not
detection; the rule already ranks (AUC 0.79) but fires 10x too often because the airport applies the limit to the
steady wind, not to gusts.

### Final round: unbucketed variants (label v2, ext)

| model | BSS 1h | BSS 6h | BSS 24h | BSS 48h | BSS all | AUC all | hit@0.8 | FA/1000 @0.8 | hit@0.5 |
|---|---|---|---|---|---|---|---|---|---|
| PROD features, bucketed, C=1 (= production structure) | 0.39 | 0.17 | 0.18 | 0.23 | 0.23 | 0.75 | 0.47 | 2.0 | 0.15 |
| PROD features, no buckets, C=1 | 0.50 | 0.19 | 0.27 | 0.22 | 0.28 | 0.73 | 0.47 | 1.3 | 0.28 |
| no buckets, C=3 | **0.55** | **0.21** | **0.35** | **0.30** | **0.33** | 0.71 | 0.49 | **1.1** | **0.33** |
| no buckets, C=0.3 | 0.42 | 0.17 | 0.19 | 0.14 | 0.22 | 0.75 | 0.42 | 1.5 | 0.10 |
| no buckets + tw18_100m | 0.50 | 0.20 | 0.26 | 0.13 | 0.28 | 0.75 | 0.47 | 1.4 | 0.28 |
| no buckets + ICON consensus gust tailwind | 0.50 | 0.20 | 0.27 | 0.21 | 0.28 | 0.75 | 0.47 | 1.4 | 0.28 |
| no buckets + tw18_100m + consensus | 0.50 | 0.21 | 0.27 | 0.10 | 0.28 | **0.78** | 0.46 | 1.4 | 0.28 |
| no buckets + tw18_100m + same-run max | 0.51 | 0.20 | 0.27 | 0.13 | 0.28 | 0.75 | 0.47 | 1.5 | 0.29 |
| no buckets + mean tw18 | 0.50 | 0.20 | 0.27 | 0.20 | 0.28 | 0.74 | 0.47 | 1.4 | 0.28 |
| official rule | -4.0 | -3.3 | -4.0 | -5.2 | -3.6 | 0.79 | 0.51 (0.60 incl. Sep 2025) | 20.1 | 0.51 |

Ranking by impact: (1) label v2, (2) drop the lead buckets (and loosen C to ~3), (3) tw18_100m (+ ICON consensus) for
ranking (AUC), neutral on Brier; crosswind / NE-sector / OD interactions / same-run max do not help.
