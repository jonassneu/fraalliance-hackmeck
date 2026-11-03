# Live operation: forward archive, variants, live record, alerts, weekly retrain

Since 31 Oct 2026 the forecast runs on its own, every hour, on this machine (systemd **user** timers). Each run
archives every input as it was available at that moment, issues the official 48 h forecast (the **champion** of the
variant registry) and a shadow forecast for every **challenger**, scores all earlier forecasts against what was
actually flown, raises alerts, rebuilds the site and copies the record to a backup. These hourly forecasts are the
**true out-of-sample record**: they are issued before the outcome exists, with live inputs only. Forecasts issued
from **2026-11-01 00:00 UTC** form the locked holdout, compared as pre-registered in
`experiments/integration/preregistration.json`.

## What runs when

| Timer (local time, Europe/Berlin) | Service runs | Typical duration |
| --- | --- | --- |
| `fra-archive.timer`: every hour at **:30** (`Persistent=true`: a missed run is made up at the next start). Until 31 Oct 2026 ~19 UTC it ran at :12 | `python -m fra.archive`, then `python -m fra.scoring`, `python -m fra.alerts` and `python -m ops.backup`, all from the frozen runtime `data/archive/runtime/current` | 1-3 min (champion + 3 shadows; longer when it has to catch up on radar hours) |
| `fra-retrain.timer`: **Sunday 04:30** (`Persistent=true`). **Installed but DISABLED, and `data/archive/RETRAIN_PAUSED` exists; stays off during the holdout** | `python -m ops.retrain --require-clean` | ~5-15 min |

Why :30: the current direction comes from the last completely published radar hour [t-2h, t-1h) (see "Current
direction" below). FANOMOS publishes in batches about every 16 min, and an hour is complete about 71-80 min after it
ended (`experiments/eval_long/fanomos_lag.csv`); at :30 that hour ended 90 min ago. It also leaves more margin for the
ECMWF run with init <= t-6h.

Unit files: `ops/systemd/` (the copies installed in `~/.config/systemd/user/`). The archive service runs with
`WorkingDirectory=data/archive/runtime/current` and the repository's virtual environment directly
(`.venv/bin/python -m ...`, no `uv run`: no re-lock or re-sync at each start; package versions are recorded in
`RUNTIME.json` and `runs.jsonl` and checked by the smoke test), `OMP_NUM_THREADS=OPENBLAS_NUM_THREADS=MKL_NUM_THREADS=1`,
low CPU and IO priority. Every step is prefixed with `-` in the unit, so a failed step never stops the next one.

**Decision for the user: lingering is NOT enabled.** User timers run only while user `jonas` has a session (logged
in, desktop open). Every hour without a session is a forecast that is never issued (`Persistent=true` makes up only
one run, and forecasts are never backfilled), i.e. a permanent hole in the holdout. To keep the job running after
logout and before login: `loginctl enable-linger jonas` (deliberately left to the user). The live record counts the
holes per window (`coverage.missing`, shown on the dashboard as "N h not issued"), and `fra.alerts` notifies each new
gap once. Radar hours missed meanwhile are caught up (36 h lookback, 6 per run;
`uv run python -m fra.archive --hours 72 --radar-max 72` closes bigger gaps by hand).

**Decision for the user: the weekly retrain is off.** It is installed, but the timer is disabled and
`data/archive/RETRAIN_PAUSED` exists. During the holdout no model may change (pre-registration: models and forecast
code of every variant are fixed). After the holdout, to arm it: commit the training code it should use (the timer
runs with `--require-clean` and refuses while `fra/train.py`, `fra/dataset.py` & co. have uncommitted changes), then
`rm data/archive/RETRAIN_PAUSED && systemctl --user enable --now fra-retrain.timer`.

## Frozen runtimes and the variant registry (`ops/runtime.py`, `data/archive/variants.json`)

The hourly job never imports code from the working tree. A **runtime** is a snapshot
`data/archive/runtime/<tag>/` with read-only copies of `fra/*.py` and `ops/*.py`, symlinks to the repository's
`data/`, `site/`, `web/`, `experiments/`, ... and a manifest `RUNTIME.json` (sha256 per file, git HEAD, dirty flag,
package versions). `data/archive/runtime/current` points to the runtime that issues the official forecast;
`history.jsonl` logs every snapshot and promotion. Snapshots are never deleted by the tool, so a rollback is a
promote of an older tag.

```bash
uv run python -m ops.runtime list                      # snapshots, the current one, the variant registry
uv run python -m ops.runtime status                    # current runtime + the last runs of the hourly job
uv run python -m ops.runtime snapshot --tag NAME --note "..."            # copy fra/*.py + ops/*.py
uv run python -m ops.runtime snapshot --tag NAME --base TAG --files fra/scoring.py,fra/dashboard.py
                                                       # copy snapshot TAG, replace ONLY these files (scoring / site
                                                       # fixes during the holdout: the forecast code stays as registered)
uv run python -m ops.runtime smoke NAME                # forecast the current hour for every variant with that code,
                                                       # nothing official written
uv run python -m ops.runtime promote NAME [--with V1,V2]   # smoke must pass; current -> NAME (+ challengers V1, V2)
```

From the holdout start, `promote` refuses a runtime whose forecast modules differ from the pre-registration (unless
`--allow-forecast-change "reason"` for a NEW variant name); every run records the check in `runs.jsonl` (`prereg`).

**Variants.** Exactly one enabled champion is THE official forecast (`data/archive/issued/`, site, alerts); every
enabled challenger issues the same hour as a shadow forecast in its own runtime and process
(`data/archive/issued_shadow/<name>/`), with the prognosis snapshot and the radar hours the champion saw. Model files
are read-only copies under `data/archive/models/<variant>/`, pinned by sha256 prefix.

| Variant | Role | Entry | Model | What it is |
| --- | --- | --- | --- | --- |
| `blend-v2` | champion | `fra.blend:forecast` | logit `e67b55b9c6a7` + decision bundle `a9e3f00f4209` + frozen forecast-error library | 0.5 x logistic model + 0.5 x hourly decision model rolled out on 200 simulated wind paths; RWY 18 from the logistic model; falls back to the logistic model (flagged `blend_ok = false`) if the decision part fails |
| `logit-v2` | challenger | `fra.predict:forecast` | `e67b55b9c6a7` | the same logistic model alone, same code and data layer: the primary comparison of the holdout |
| `logit-v1` | challenger | `fra.predict:forecast` | `d152a9b32edb` | the previous official system unchanged (runtime 2026-10-31-wave1-r2: current direction from the newest, partly published radar hour) |
| `hackathon` | challenger | `fra.predict:forecast` | `863661b237f8` | the frozen hackathon model of 30 Oct 2026 (runtime 2026-10-31-wave1) |

The official `.json` of a blend forecast also holds `p_od25_logit` (the logistic part on exactly the champion's
inputs), as a consistency check of the `logit-v2` stream.

**Holdout rules** (`experiments/integration/preregistration.json`): primary metric = Brier of P(OD 25) pooled over
leads 1/6/24/48, `blend-v2` minus `logit-v2` on the issue hours both issued, 95 % CI from a 3-day block bootstrap.
First verdict on the issue times 1-28 Nov 2026, evaluated after 2026-12-01 08:00 UTC: confirm the champion if the
upper CI bound < 0, swap champion and challenger if the lower bound > 0, else extend to 8 weeks (evaluated after
2026-12-29). Fixed during the holdout: model files, forecast code (module sha256), blend weights and parameters, the
data layer and the analysis plan. Allowed: scoring, report and site code that does not change any issued forecast
(snapshot with `--base <current tag> --files ...`), and operations fixes needed to keep the job running (a fix that
changes a variant's forecast gives it a new name, e.g. `blend-v2.1`, and restarts its record).

**Backup** (`ops/backup.py`, last step of every run): `rsync` (no delete) of `data/archive` (without `run_cache/`),
`data/inaa_counts.csv` and the pre-registration to `~/fra-archive-backup` (`--dest` / `FRA_BACKUP_DIR` override),
plus once per UTC day a sha256 manifest of every issued and shadow forecast file. `data/` is not in git, so this copy
is the only protection against an accidental cleanup of the record; it is on the same disk.

## The hourly job, step by step (`fra/archive.py`)

Every step is idempotent (a second run in the same hour re-uses what exists) and isolated (one failing source never
blocks the others). Status per step: journal and `data/archive/runs.jsonl` (one JSON line per run: runtime tag,
variants, package versions, pre-registration check). The forecast is issued **first** (right after the prognosis
snapshot it uses), because it is the only output that can never be made up later; METAR / Open-Meteo snapshots, the
shadow forecasts and the radar catch-up run after it, under time budgets, and the optional steps are skipped once the
run has taken 25 min (the unit's `TimeoutStartSec` is 45 min for the chain).

| Step | Source | Output |
| --- | --- | --- |
| 1. prognosis | INAA `Direction/GetDirectionData?currentTime=<issue hour>` (one request, 45 s timeout, 2 tries, parsed like `fra.prognosis.fetch`) | raw response `data/archive/prognosis/YYYY/MM/<asof>.json.gz`, rows appended to `data/archive/prognosis_live.parquet` (columns of `data/prognosis.parquet` + `retrieved_utc`; `data/prognosis.parquet` itself is not touched) |
| 2. issue | the registry **champion** (`blend-v2`: `fra.blend.forecast` with its frozen model files; if only its decision part fails, it issues its logistic part, flagged `blend_ok = false`). Fallbacks if it cannot predict at all: its logistic model with `fra.predict.forecast`, then the pinned model `data/archive/models/production/model.pkl`, then `data/model.pkl` (all flagged in the `.json`). The prognosis request is served from the step-1 snapshot (if INAA fails it issues without the prognosis, `prog_signed = 0` as in training, instead of losing the hour). Weather runs: the exact runs the training archive rule picks (ECMWF init <= t-6h, ICON-D2 <= t-4h, ICON-EU <= t-5h; a served run is used only if complete for the hours needed, else the run one cycle earlier; every fallback is recorded in `live_inputs`) | `data/archive/issued/forecast_YYYYMMDDTHH.csv` (the 48 h forecast + `issue_utc`, `model_sha256`, retrieval window), `.features.parquet` (the exact feature frame) and `.json` (variant, runtime, model sha256, code version, prognosis source, `flown_state`, `live_inputs`, the blend's status, failed attempts). Models are kept content-addressed in `data/archive/models/sha256/<sha>.pkl`, the source of `fra/*.py` in `data/archive/code/` |
| 3. metar | IEM EDDF METAR, last 6 h | `data/archive/metar/YYYY/MM/<issue>.csv.gz` (incl. raw METAR text) |
| 4. forecasts | Open-Meteo live API: `ecmwf_ifs`, `icon_d2`, `icon_eu` (10 m wind + gusts, 80/100/120 m wind) and the ECMWF ensemble (`ensemble-api`, 50 members + control), 4 days | `data/archive/forecasts/<model>/YYYYMMDDTHH.json.gz` = raw response + retrieval time + the model run metadata (init, availability, modification time). The ensemble is saved only when its run changed |
| 4b. shadow | every enabled challenger, in its own frozen runtime and process, same issue hour (not issued if the official forecast of the hour is older than 20 min) | `data/archive/issued_shadow/<variant>/forecast_YYYYMMDDTHH.*` |
| 5. radar | INAA FANOMOS radar tracks (`fra.labels.classify`; one INAA slot per request, slot wait <= 120 s), hours from 2026-10-30 12 UTC within the last 36 h whose window ended >= 100 min ago and that are not yet in the counts; at most 6 requests and 8 min per run, stop after 2 consecutive failures. **Re-check**: every stored hour is fetched once more when its window ended >= 6 h ago (3 per run) | counts **appended** to `data/inaa_counts.csv` (forward hours only), raw KML `data/archive/radar/YYYY/MM/<hour start>.kml.gz`. A re-check that finds MORE movements appends a corrected row (`fra.labels.load_counts` keeps the last row of an hour) and replaces the KML; fewer movements are only logged (`data/archive/radar_recheck.json`, `runs.jsonl`) |
| 6. site | `python -m fra.dashboard <new forecast>` when a new forecast was issued | `site/index.html`, `site/model.html`, `site/airport3d.html` (the 3D view embeds the hackathon runs plus the newest 24 issued runs) |

Rules that keep the record honest:

- Only the **current hour** is ever issued. Nothing is backfilled into `data/archive/issued/` or `issued_shadow/`.
- The code and the models that issue are frozen: a runtime changes only through `ops.runtime promote`, a model file
  only through a new variant. Training runs that rewrite `data/model.pkl` do not change the live record.
- Reproducible: issued probabilities = archived model applied to the archived feature frame, with the archived code
  version. The raw inputs behind the features are archived only approximately: the forecast makes its own live
  Open-Meteo / IEM / radar requests, separate from the snapshots of steps 3-4 (same sources, seconds apart); the
  prognosis is exactly the step-1 snapshot.
- A radar hour is stored once its window ended >= 100 min ago and re-checked ~6 h later, so an hour that was still
  incomplete when stored gets corrected before it is used as truth.

**Current direction.** Training (`fra.dataset.add_state`, `KNOWN_LAG_H = 2`) and the live forecast
(`fra.predict.flown_state`) take the current flown OD from the same hour: the last completely published radar hour
[t-2h, t-1h) (looking back up to 8 h through the night ban). At :30 that hour is not yet in the radar archive (stored
>= 100 min after its end), so the forecast fetches it once from INAA. The issued `.json` records which hour was used and
its movement counts. Before 31 Oct 2026 ~18 UTC the live forecast read the newest, partly published hour [t-1h, t)
while training used that hour complete, so short-lead backtests of that code were optimistic; `logit-v1` keeps that
behaviour on purpose, as a reference.

Politeness: ~4-5 INAA requests per hour, all sequential through the cross-process INAA slots of `fra.labels` with a
bounded wait (prognosis 1, current direction 1-2, shared with the shadow forecasts through `run_cache/`, radar 1,
re-check 1); Open-Meteo: the step-4 snapshots plus a few single-run requests per variant, far below the free tier
limit of 10,000/day; IEM 1-2 requests.

Disk: ~7 MB/day, almost all raw radar KML (~280 kB per hour gzipped), i.e. ~2.5 GB per year; the issued and shadow
forecasts add ~60 kB per variant and hour.

## Live record (`fra/scoring.py`)

`data/archive/live_record.json` (copy in `site/live_record.json` for the dashboard) and
`data/archive/live_record_variants.json` (champion vs challengers), recomputed from all files on every run, so late
or corrected labels are picked up:

- truth = flown OD / RWY 18 from `data/inaa_counts.csv` via `fra.labels.to_labels(..., bridge="night")`, computed in
  memory: the OD is carried only through the night ban and fetched quiet hours, never across a daytime hour that was
  not fetched (those hours stay unlabelled and are not scored); valid hour v = the radar hour starting at v;
- per lead 1 / 6 / 24 / 48 h and over all 48 leads: accuracy, Brier, accuracy on hours where the direction changed,
  and the same-issue-time baselines: official rules (`rule_baseline_od` of the issued file), published prognosis
  (as of the issue hour) and persistence;
- RWY 18: accuracy, Brier, closure hours and how many were flagged at P(open) < 0.8, false alarms;
- next change: hit within +-3 h of an actual change lasting >= 2 h (the `fra.changetime` definitions);
- variants: each pair champion vs challenger on the issue hours both issued, per lead and pooled, paired differences
  with 3-day block bootstrap CIs (1- and 7-day blocks as a sensitivity check);
- windows: rolling 30 days, since start, the holdout (issue times >= 2026-11-01) and the pre-registered
  `holdout_4w` / `holdout_8w`; coverage per window (expected, issued, missing hours);
- input health per stream: weather-run fallbacks, blend fallbacks to the logistic model, and how complete the
  current-direction source hour was when the job read it (`source_hour`);
- `od_now_vs_source_hour` (should be ~1.0: the issued current OD equals the final label of [t-2h, t-1h)) and
  `od_now_vs_full_hour` (how often the one-hour-old current OD differs from the hour just before the issue).

A forecast hour is scored about 2-3 h after it was flown. The dashboard shows "Collecting since ..." until then.

## Alerts (`fra/alerts.py`)

From the newest issued (official) forecast, evaluated at the current time -> `site/alerts.json`, and a desktop
notification (`notify-send`, if installed) only when an alert key newly appears and was not notified in the last 3 h.
Alert hours that are already over are dropped and `lead_h` counts from now. If the newest forecast is older than 2 h
(the issue failed), no alerts are raised from it: `alerts.json` has `stale: true` and a message, the dashboard shows
"Alerts paused", nothing is notified. State: `data/archive/alerts_state.json`, written only by notifying runs with a
current forecast (the systemd job): a manual `--no-notify` run never marks an alert as seen. No e-mail, nothing posted.

| Alert | Fires when | Level |
| --- | --- | --- |
| `od_switch` | the next change issued with the official forecast (`next_change_utc`; for the blend the hysteresis rule of `fra.blend`, P(other OD) >= 0.45) starts within the next **12 h** | `warning` within 6 h, else `watch` |
| `rwy18` | min P(Runway 18 open) < **0.8** within the next **24 h** | `warning` if it drops below 0.5, else `watch` |
| coverage (operations, not shown on the site) | an official forecast hour of the last 48 h was never issued | notified once per gap |

Evidence for the thresholds (out-of-fold walk-forward predictions of the logistic model, 1 Jun - 30 Oct 2026,
`experiments/eval_long/preds_cv.parquet`, before the holdout): with entry threshold 0.5 within 12 h the switch alert
is up for 17.9 % of issue times; a sustained change follows within 15 h in 92.8 % of them and 77 % of all changes
within 12 h are alerted. For RWY 18 the 0.8 level comes from the separate RWY 18 study (~50 % of closure hours
flagged, ~1 false alarm per 1,000 h); Jun - Oct 2026 holds only 2 closure hours. The thresholds are fixed; they are
not tuned on the live record.

## Weekly retrain (`ops/retrain.py`) - shipped disabled

1. Code: version (sha256 over `fra/*.py`, archived in `data/archive/code/`) and `git status` of the recipe files go
   into the report; with `--require-clean` (the timer) it refuses to run (exit 2, report written) while any recipe
   file (`fra/train.py`, `dataset.py`, `evalkit.py`, `labels.py`, `rules.py`, `predict.py`, `prognosis.py`,
   `singleruns*.py`, `weather.py`, `changetime.py`) has uncommitted changes.
2. Back up the production model -> `data/archive/models/<date>.pkl` (+ `.sha256`).
3. Refresh the production training inputs, append-only and compare-and-swap (each file is replaced only if it is
   unchanged since it was read): `data/labels.parquet`, `ifs_runs(_upper).parquet`, `icon_runs.parquet`,
   `prognosis.parquet`, `metar.parquet`, `forecasts.parquet`. (`iconeu_runs.parquet` is not in this list yet.)
4. Candidate: the production refit of `fra.train.main` -> `data/archive/models/candidate/model.pkl`; `fra.train`
   itself is not run.
5. Smoke test: a live `fra.predict.forecast()` with the candidate; passed -> `data/archive/models/production/model.pkl`
   (since the variant registry this file is only the fallback of the issue step; a model reaches the official
   forecast only as a registered variant).
6. Calibration check on the last 4 weeks of flown labels (monitoring only; no model is selected on performance).
7. Report: `data/archive/retrain_report_<date>.md`.

Roll back / manual promotion: `uv run python -m ops.retrain --promote data/archive/models/<date>.pkl`. Dry run (no
shared writes): `uv run python -m ops.retrain --dry-run`.

## Run by hand

```bash
cd /home/jonas/.t3/projects/fraalliance-hackmeck
export OMP_NUM_THREADS=1 OPENBLAS_NUM_THREADS=1 MKL_NUM_THREADS=1
uv run python -m ops.runtime status          # which runtime issues, the last runs of the hourly job
systemctl --user start fra-archive.service   # the same chain as the timer (frozen runtime), logged to the journal
uv run python -m fra.archive --smoke blend-v2   # forecast the current hour with one variant, nothing official written
uv run python -m fra.scoring --dry-run       # live record without writing
uv run python -m fra.alerts --no-notify      # alerts without a desktop notification
uv run python -m ops.backup                  # copy of the record to ~/fra-archive-backup
uv run python -m ops.retrain --dry-run       # weekly retrain, dry
node ops/check_site.mjs site/index.html /tmp/shot.png   # headless check of the page (JS errors, alerts, live record)
uv run python -m http.server 8000 --directory site      # http://localhost:8000/ (polls alerts.json, live_record.json)
```

`uv run python -m fra.archive` from the repository root runs the WORKING-TREE code; only use it for tests (with
`--skip` / `--no-site`), never to issue the official hour.

## Check

```bash
systemctl --user list-timers 'fra-*'
systemctl --user status fra-archive.service fra-retrain.service
journalctl --user -u fra-archive.service -n 50 -o cat
tail -n 3 data/archive/runs.jsonl | python -m json.tool --no-ensure-ascii | head -60
ls data/archive/issued | tail; ls data/archive/issued_shadow/*/ | tail
```

## Stop

```bash
systemctl --user disable --now fra-archive.timer fra-retrain.timer
# remove completely:
rm ~/.config/systemd/user/fra-{archive,retrain}.{service,timer} && systemctl --user daemon-reload
```

## Notes

- `fra.live` (the 20 s OpenSky feed for the 3D view) is independent and not needed for the forecast; the dashboard
  ignores an older `site/live.json` than the forecast it shows.
- The site is rebuilt by the frozen runtime's `fra.dashboard` every hour, so text changes to `fra/dashboard.py` or
  `fra/modelpage.py` in the working tree reach the live site only after a snapshot with `--base <current tag>
  --files fra/dashboard.py,fra/modelpage.py` and a promote.
