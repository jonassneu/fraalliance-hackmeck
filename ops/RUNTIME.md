# Frozen runtimes, variants and shadow forecasts of the hourly live job

The hourly job (`fra-archive.service`, timer at **:30** local time since 31 Oct 2026 18:57 UTC; :12 before) never
imports code from the working tree. It runs a frozen, smoke-tested copy of the code (a *runtime*) with the
repository's virtual environment. Besides the official forecast (the registry *champion*) it issues *shadow forecasts*
of the other variants, so that the locked holdout (issue times from 2026-11-01 00:00 UTC) compares them head to head
on forecasts that were all issued live. Pre-registration: `experiments/integration/preregistration.json` (with its
time-stamped amendments, `experiments/integration/prereg_amendments.json`).

## The unit

`~/.config/systemd/user/fra-archive.service` (copy: `ops/systemd/fra-archive.service`):

- `WorkingDirectory=<repo>/data/archive/runtime/current`
- `ExecStart=-<repo>/.venv/bin/python -m fra.archive`, then `fra.scoring`, `fra.alerts`, `ops.backup`

The interpreter is used directly, not via `uv run`, which would re-lock / re-sync the shared environment at every
start. `python -m` puts the working directory (the snapshot) first on `sys.path`. Every step has the `-` prefix, so a
failed step never blocks the next one. Unchanged: `TimeoutStartSec=45min`, thread pins, `Nice`, idle IO.

`fra-archive.timer`: `OnCalendar=*-*-* *:30:00`, `Persistent=true`. Why :30:
- The od_now source hour [t-2h, t-1h) is completely published only 75-79 min after its end (FANOMOS batches,
  `experiments/eval_long/fanomos_lag.csv`). At :12 (72 min) 2 of 3 measured hours still lacked 1-2 movements; at :30
  (90 min) all were complete.
- The ECMWF run with init <= t-6h is read 6.5 h after init instead of 6.2 h.

Do not move the job earlier than ~:25. A catch-up run after downtime may start earlier; `fra.scoring` reports how
complete the source hour was (`health.*.source_hour`).

## Layout (all under `data/archive/`, not in git; copied every hour to `~/fra-archive-backup/repo/`)

| Path | What |
| --- | --- |
| `runtime/<tag>/` | One snapshot: read-only copies of `fra/*.py` and `ops/*.py`, plus symlinks `data`, `site`, `web`, `experiments`, ... to the repository. `RUNTIME.json` holds tag, created, git HEAD, dirty files, sha256 per file, `packages`, `base` / `replaced`, `python_cmd`. |
| `runtime/current` | Relative symlink to the live tag (flipped atomically by `promote`). |
| `runtime/history.jsonl` | Every snapshot, promote and refused promote. |
| `runtime/smoke/<tag>_<time>.json` | Every smoke report. |
| `variants.json` | Variant registry (champion + challengers). |
| `issued/` | Official forecasts (champion), see "What every issued forecast records". |
| `issued_shadow/<variant>/` | Shadow forecasts, same format. |
| `run_cache/<issue>/` | Radar hours the champion fetched live in that run, re-used by the shadows (pruned after 2 days). |
| `models/<variant>/` | Frozen, read-only model files, incl. `blend-v2/library/` (Part B library inputs + `MANIFEST.json`). |
| `live_record.json`, `live_record_variants.json` | Live record of the champion / champion vs challengers (`fra.scoring`). |

What every issued forecast records (`.csv` / `.json` / `.features.parquet`):
- `variant`, `runtime`, `flown_state` (od_hour as read).
- `live_inputs`: every NWP run used, the run the as-of rule wanted, and whether the fallback fired.
- For the blend: `blend.library_files`, `ifs_same_run`.

## Runtimes now

| Tag | Content | Used by |
| --- | --- | --- |
| `2026-10-31-wave1` | first snapshot | hackathon |
| `2026-10-31-wave1-r2` | wave1 + late-shadow guard | logit-v1 |
| `2026-10-31-wave2`, `-wave2-r2` | lag-2 data layer, ICON-EU fill, 48 leads, clean labels, fra.blend champion | (previous) |
| `2026-10-31-wave2-r3` | holdout fixes (entry fallback, NWP completeness + records, timeouts, frozen Part B library, run records, scoring, site, ops) | (previous) |
| `2026-10-31-wave2-r4` (current) | r3 with only `fra/alerts.py` replaced (missing-hour notification) | blend-v2, logit-v2 |

## Commands

```
uv run python -m ops.runtime snapshot --tag T --note "why"                         # freeze fra/*.py + ops/*.py of the working tree
uv run python -m ops.runtime snapshot --tag T --base B --files fra/scoring.py,...  # copy snapshot B, replace only these files
uv run python -m ops.runtime smoke T [--registry candidate.json]                   # forecast the current hour, write nothing official
uv run python -m ops.runtime promote T [--with logit-v2] [--allow-forecast-change "reason"]
uv run python -m ops.runtime list | status
```

- **smoke**:
  - Checks the files against the manifest and the package versions against the manifest; a changed venv fails.
  - Imports fra.archive / scoring / alerts / predict / dashboard and ops.retrain.
  - Forecasts the current hour for every enabled variant: champion and variants pinned to T are blocking, the others
    run in their own runtime.
  - Runs `fra.scoring --dry-run` and reports the forecast-module diff vs the pre-registration.
- **promote**:
  - Smoke must pass, then `current` is flipped atomically and the champion (plus the `--with` challengers) is moved
    to T in `variants.json`.
  - From 2026-11-01 00:00 UTC it refuses when the forecast modules of a moving variant differ from the
    pre-registration, unless `--allow-forecast-change "reason"` is given (logged). A forecast change during the
    holdout needs a NEW variant name.
- **Rollback**: `promote <older tag>`.
- **During the holdout**, scoring / site / alerts fixes go through `snapshot --base <current tag> --files ...`, so the
  forecast code stays byte-identical. Every run records the check in `runs.jsonl` (`prereg.mismatch`, should be `[]`).

## The hourly run

1. **prognosis**: INAA prognosis snapshot of the hour.
2. **issue**: the official forecast, by the registry champion in this process. Candidates in order:
   - the champion;
   - its own logit with `fra.predict` (fallback for a broken entry: an import / attribute / signature error is a
     model error and switches at once; still counted as the champion, intention to treat);
   - the pinned production model;
   - `data/model.pkl` (flagged).
3. **metar**, then the Open-Meteo snapshots.
4. **shadow** (4b): every challenger in its own runtime and process. Same issue hour, same prognosis snapshot, same
   radar hours (`run_cache/`). Time limit per challenger; no shadow once the official forecast is older than 20 min.
5. **radar**.
6. **site**: rebuilt by the frozen `fra.dashboard`.

Then `fra.scoring`, `fra.alerts` and `ops.backup`.

Live NWP inputs: a served ECMWF / ICON-D2 / ICON-EU single run is used only if wind is present for every hour the
forecast needs (`fra.dataset.run_complete`), else the run one cycle earlier. If the exact IFS run is unavailable, the
logit uses the stitched live forecast. Every case is recorded in the issued `.json` (`live_inputs`) and in
`runs.jsonl` (`steps.issue.nwp`). Live METAR and second-NWP requests use `(5, 30)` s timeouts; the second NWP may fail
(NaN, not a feature of the production logit).

`runs.jsonl` per run: `runtime`, `env` (python + numpy / pandas / scikit-learn / lightgbm / pyarrow / requests /
scipy versions), `prereg` (per variant: forecast-module sha256 equal to the registration?), `variants`
(champion, challengers, registry_error, registry_sha256) and the steps.

## Variant registry (`data/archive/variants.json`, now)

| Variant | Role | Runtime | Entry | Models / pins |
| --- | --- | --- | --- | --- |
| blend-v2 | champion | 2026-10-31-wave2-r4 | fra.blend:forecast | model e67b55b9c6a7, decision a9e3f00f4209, library (`models/blend-v2/library/MANIFEST.json`) d38e3f72b613 |
| logit-v2 | challenger | 2026-10-31-wave2-r4 | fra.predict:forecast | model e67b55b9c6a7 |
| logit-v1 | challenger | 2026-10-31-wave1-r2 | fra.predict:forecast | model d152a9b32edb |
| hackathon | challenger | 2026-10-31-wave1 | fra.predict:forecast | model 863661b237f8 |

`models.library` is a frozen, read-only copy of the Part B analogue-library inputs:
`ifs_runs.parquet`, `ifs_runs_backfill.parquet`, `icon_runs.parquet`, `metar_full.parquet`. `fra.blend` loads it via
`fra.fcerror.use_library_files`, which checks every file's sha256 against the manifest (a mismatch makes the blend
fall back to the logit, flagged). Refreshes of the `data/` files therefore cannot change the champion. Verified
identical to the live files at freeze time (rollouts max |diff| 0.0).

Edit the registry atomically (temp file + rename). Test a candidate with
`ops.runtime smoke <tag> --registry candidate.json` before the swap.

## Live record per variant (`fra.scoring` -> `live_record_variants.json`)

- **Truth**: `fra.labels.to_labels(load_counts(), bridge="night")`. The OD is carried only through the night ban and
  fetched quiet hours, never across an unfetched daytime hour. Per window, `truth` counts the valid hours observed /
  bridged / unlabelled.
- **Rows**: identical issue hours only, per pair champion vs challenger (and `all` for 3+ variants); leads 1/6/24/48
  and pooled.
- **Metrics**: accuracy and Brier, RWY 18 Brier, next-change events, RWY 18 warnings.
- **CIs**: 3-day blocks (`BLOCK_DAYS = 3`, pre-registered amendment A3). `brier_pooled_by_block_days` repeats the
  pooled Brier difference with 1-, 3- and 7-day blocks (sensitivity).
- **Windows**: since_start, holdout, holdout_4w (primary), holdout_8w.
- **`health` per stream**:
  - `inputs`: NWP fallbacks by model, logit and Part B on different ECMWF runs, blend fallbacks.
  - `source_hour`: the od_now source hour as read at issue time vs its final counts (complete share, published
    share, OD / RWY 18 status agreement).

## Alerts and backup

- `fra.alerts` notifies once per gap of official hours never issued in the last 48 h (`alerts.json -> ops.coverage`).
  Systemd lingering is off (owner decision): without a session the job does not run, and such hours stay missing.
- `ops.backup`: every hour, rsync (no delete) of `data/archive` (without `run_cache/`), `data/inaa_counts.csv` and the
  pre-registration to `~/fra-archive-backup/repo/`. Once per day it writes `manifests/<date>.sha256` of all
  issued / shadow files; the log is `backup_log.jsonl`. It is on the same disk; set `FRA_BACKUP_DIR` (or `--dest`)
  for an off-disk copy.

## How to stop things

- **Stop a challenger**: `"enabled": false` in `variants.json` (next run).
- **Skip the shadows of one manual run**: `cd data/archive/runtime/current && <repo>/.venv/bin/python -m fra.archive --skip shadow`.
- **Stop the hourly job**: `systemctl --user disable --now fra-archive.timer`. Every hour without it is a permanent
  hole in the holdout.
- **Rollback of code**: `uv run python -m ops.runtime promote <older tag>`. During the holdout this is refused if the
  forecast modules differ from the registration, unless `--allow-forecast-change "reason"`.
- Never delete a snapshot that `current` or a variant points to (`ops.runtime list` shows both).
