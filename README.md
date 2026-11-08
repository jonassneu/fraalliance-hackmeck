<img src="assets/icon.svg" width="56" height="56" alt="">

# Eastbound or Westbound?

Frankfurt Airport's operating direction, forecast 48 hours ahead and issued every hour. Built in about 6 hours at the FraAlliance challenge (AI Week Frankfurt, 30 Oct 2026) and improved since.

> [!NOTE]
> This is the improved version. The hackathon submission is the [v1.0-hackathon release](https://github.com/jonassneu/fraalliance-hackmeck/releases/tag/v1.0-hackathon) and stays unchanged in [`submission/`](submission/).

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/screenshots/accuracy-dark.png">
    <img src="assets/screenshots/accuracy.png" alt="Now vs the hackathon version on the hackathon's test weeks, 15 Sep to 30 Oct 2026. Now: 97.2 % at 1 h, 96.3 % at 6 h, 95.7 % at 24 h, 95.2 % at 48 h ahead. Hackathon: 96.9, 96.1, 95.4, 93.1 %. Published prognosis: 95.1, 93.7, 92.0, 89.8 %" width="720">
  </picture>
</p>

Same hours for both. The current version sees the last flown hour only once it is fully published, 1 h later than the hackathon version did. Both were designed on these weeks, so the [live record](#live-record) is the real test.

## Why it matters

Frankfurt flies all runways in one direction, westbound (OD 25) or eastbound (OD 07), and switches them all at once when the wind turns. Strong north wind also closes Runway 18 West, which handles 6 out of 10 departures. Today the switch is decided at short notice. Known 48 h ahead, Lufthansa and Fraport can plan connections, staff and ground handling around it.

For each of the next 48 hours the forecast gives the chance of each direction, the chance Runway 18 is open, and the next likely change.

## The product

<p align="center">
  <img src="assets/screenshots/live-3d.png" alt="3D view of Frankfurt Airport: the runways in use, landing paths over the numbered towns, a panel with the switch, wind and Runway 18 status, and the 48-hour timeline" width="100%">
</p>

<p align="center">
  <img src="assets/screenshots/dashboard.png" alt="Forecast dashboard: the direction flown now, the expected switch with its certainty, Runway 18 status, the next 48 hours with the chance of a switch, Runway 18 and headwind, and the flight paths" width="100%">
</p>

The dashboard answers what an operations team asks first: which way Frankfurt flies now, when it is expected to switch and how sure that is, and whether Runway 18 is open, with how many departures move if it closes. The 48-hour chart shows the direction, the hourly chance of West, Runway 18 and the headwind against the limit; accuracy against the official forecast sits one click away. The 3D view shows the same forecast on the airport.

Both pages are rebuilt every hour from the newest forecast, with alerts and the live record. `node web/check.mjs` loads them at six window sizes, light and dark, and checks layout, contrast and wording. The hackathon version runs offline: open [`submission/dashboard.html`](submission/dashboard.html).

## Set it up

Windows, Linux or macOS with internet access, about a minute. The release ships the frozen model files, so no training and no historical data are needed.

```bash
git clone --branch v2.1 https://github.com/jonassneu/fraalliance-hackmeck.git
cd fraalliance-hackmeck
./install.sh                         # on Windows: .\install.cmd    Python environment, model files, a test forecast
uv run python -m ops.serve           # forecast every hour, pages on http://localhost:8080/
```

`./install.sh --service` (Windows: `.\install.cmd --service`) runs it in the background on Linux and Windows. Requirements, network access, outputs and updates: [SETUP.md](SETUP.md).

## Results

Walk-forward test over 152 days, 1 Jun – 30 Oct 2026, scored against the direction actually flown.

| Lead time | This forecast | Published prognosis | Official rules | No change |
| --- | ---: | ---: | ---: | ---: |
| 1 h | **96.8 %** | 93.7 % | 91.0 % | 94.4 % |
| 6 h | **94.9 %** | 92.9 % | 90.2 % | 87.7 % |
| 24 h | **94.7 %** | 91.2 % | 88.5 % | 75.3 % |
| 48 h | **93.0 %** | 89.2 % | 87.0 % | 65.7 % |

- Ahead of the published prognosis at every lead time, with 95 % confidence intervals that exclude zero. Brier score 0.039 vs 0.082.
- The next direction change is right 80 % of the time (prognosis 70 %, rules 62 %).
- Weak spot: when the direction changes within the next hour, every method is right only 54–59 % of the time.
- **Checked on data never used for design:** 446 days, Aug 2024 – Oct 2025, scored against the 12-year radar history. The forecast was right 96.4 / 93.8 / 92.8 / 91.5 % of the time at 1 / 6 / 24 / 48 h; the published prognosis 92.7 / 92.0 / 91.3 / 89.8 %. Brier score 0.046 vs 0.086. Scores vary with the season: monthly Brier from 0.015 (December) to 0.073 (July). Details: [experiments/replication](experiments/replication/REPORT.md).

Details in the [model card](MODEL_CARD.md).

## What changed since the hackathon

| | Hackathon (v1.0) | Now |
| --- | --- | --- |
| Forecast | Logistic regression | Logistic regression averaged with an hour-by-hour decision model run on 200 simulated wind futures |
| Test | 7 autumn weeks | 152 days with confidence intervals, plus a locked live holdout |
| Last flown hour | Used before it is fully published | Used once fully published, as in live use |
| Training labels | Sampled hours before the test weeks | Every hour since Feb 2026; 12 years collected for research |
| Operation | Run by hand | Every hour from a frozen code snapshot, older versions alongside, alerts, a retry at :50 |
| Setup | Full data download and training | `./install.sh`: frozen model files from the release, a test forecast, an optional background service |

## Live record

Since 31 Oct 2026 every forecast is archived before the outcome exists and scored about 3 h after the hour is flown. Forecasts from 1 Nov 2026 form a locked holdout, set out in advance in the [pre-registration](experiments/integration/preregistration.json). Four other versions, the hackathon model among them, run alongside. First verdict on 1 Dec 2026.

## How it works

- **Labels.** The flown direction comes from radar tracks: aircraft below 3,000 ft near the field heading about 250° (OD 25) or 070° (OD 07).
- **Inputs.** Tailwind forecasts from ECMWF and DWD ICON, the official rule, the published Umwelthaus prognosis, the last flown direction and the time of day.
- **Models.** A logistic regression on the last 120 days, averaged with an hour-by-hour decision model run along 200 simulated wind futures.
- **Testing.** Only data available at forecast time, walk-forward week by week, confidence intervals from resampling whole days.

About 120 variants were tried; see [experiments/](experiments/) and the [decision log](research/conclusion.md).

## Data

| Data | Source |
| --- | --- |
| Flown direction (labels) | Umwelthaus INAA / FANOMOS radar tracks, [inaa.umwelthaus.org](https://inaa.umwelthaus.org/), 2014 – today |
| Weather forecasts as issued | [Open-Meteo](https://open-meteo.com/) Single Runs: ECMWF IFS, DWD ICON-D2 and ICON-EU |
| Published prognosis | Umwelthaus INAA, as published each hour |
| Observed weather | [Iowa Environmental Mesonet](https://mesonet.agron.iastate.edu/request/download.phtml), METAR EDDF |
| Airport geometry | © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, ODbL |
| Live aircraft | [The OpenSky Network](https://opensky-network.org/) |

All public. Weather data by Open-Meteo.com (CC BY 4.0).

## Run it

To run the forecast, use [Set it up](#set-it-up). Rebuilding everything from the raw data needs Python 3.12 and [uv](https://docs.astral.sh/uv/). `uv sync && uv run pytest` runs the unit tests. The data must be downloaded first; the radar labels are the slow part, about two days for the 12-year history.

<details>
<summary>Full pipeline and live operation</summary>

```bash
uv sync
uv run pytest                                  # unit tests

# 1. Data -> data/
uv run python -m fra.weather                   # METAR + Open-Meteo previous runs
uv run python -m fra.singleruns                # ECMWF IFS runs as issued
uv run python -c "from fra.singleruns import download_upper_runs; download_upper_runs()"   # ECMWF 100 m wind
uv run python -m fra.singleruns_icon           # DWD ICON-D2 runs as issued
uv run python -m fra.singleruns_iconeu         # DWD ICON-EU runs as issued
uv run python -m fra.prognosis                 # published Umwelthaus prognosis, as of each hour
uv run python -m fra.labels 2025-06-01T04:00 2026-10-30T11:00 8 2026-09-15   # radar labels: start, end, workers, hourly from
uv run python -m fra.labels --write            # -> data/labels.parquet
uv run python -m fra.history run               # optional: 12-year radar history (resumable; status: fra.history status)

# 2. Models
uv run python -m fra.train                     # logistic model: walk-forward evaluation -> data/eval.csv; final model -> data/model.pkl
uv run python -m fra.blend --fit               # decision model on all labels known now
uv run python experiments/integration/final_eval.py   # official forecast vs logistic model vs baselines, long test
uv run python -m fra.changetime                # next-change evaluation -> data/changetime_eval.csv

# 3. Forecast and web pages
uv run python -m fra.blend [ISSUE_UTC]         # official 48 h forecast (blend), printed, nothing written
uv run python -m fra.predict [ISSUE_UTC]       # logistic model alone: 48 h forecast CSV + PNG
uv run python -m fra.dashboard                 # site/index.html, site/airport3d.html
node web/check.mjs                             # layout and contrast checks for both pages (after npm install in web/)
uv run python -m fra.live &                    # optional: live aircraft + hourly forecast for the 3D view -> site/live.json
uv run python -m http.server 8000 --directory site    # open http://localhost:8000/
uv run python -m fra.submit [ISSUE_UTC]        # submission/: forecast, dashboard, model card, evaluation tables
```

Live operation (the hourly job, the variants, the live record, alerts, backups): see [ops/README.md](ops/README.md).

```bash
uv run python -m ops.runtime status            # which code issues the forecast + the last hourly runs
systemctl --user start fra-archive.service     # one hourly run by hand (frozen code, as the timer)
uv run python -m fra.scoring                   # live record -> data/archive/live_record.json
systemctl --user list-timers 'fra-*'           # the hourly timer
```

</details>

<details>
<summary>Repository layout</summary>

| Path | Contents |
| --- | --- |
| [`fra/`](fra) | The pipeline, one module per step (see below) |
| [`install.sh`](install.sh), [`install.cmd`](install.cmd), [`SETUP.md`](SETUP.md) | Installation from a release and the setup guide |
| [`ops/`](ops) | Live operation: installer (`install.py`), service (`serve.py`), release bundle (`release_bundle.py`), frozen runtimes, hourly job, variants, backups ([ops/README.md](ops/README.md), [ops/RUNTIME.md](ops/RUNTIME.md)) |
| [`tests/`](tests) | Unit tests for the official decision rules, checked against the worked examples in the case |
| [`experiments/`](experiments) | Walk-forward research harness, the four hackathon studies, and the studies since: long test (`eval_long`), decision model (`parta`), wind futures (`partb`), retests (`phase2`), the blend and holdout plan (`integration`), 12-year history (`history12`), more weather models (`multimodel`), the check on data never used for design (`replication`) |
| [`research/`](research) | Background research from the start of the day and the decision log |
| [`submission/`](submission) | The package handed to the jury on 30 Oct 2026: 48 h forecast, dashboard, model card, evaluation tables |
| [`site/`](site) | Generated web pages: dashboard (`index.html`), 3D view (`airport3d.html`) |
| [`web/`](web) | Source of the 3D airport view (three.js) |
| [`docs/`](docs) | The challenge brief ([FraAlliance_Case.pdf](docs/FraAlliance_Case.pdf)) |
| [`assets/`](assets) | Icon and README images |

| Step | Module (`fra/`) | Output |
| --- | --- | --- |
| Labels | `labels.py`, `history.py` | Radar tracks → flown direction and Runway 18 use per hour (`data/labels.parquet`); 12-year backfill |
| Weather | `weather.py`, `singleruns.py`, `singleruns_icon.py`, `singleruns_iconeu.py`, `era5.py` | METAR observations; ECMWF IFS, ICON-D2 and ICON-EU runs as issued; ERA5 for research |
| Published prognosis | `prognosis.py` | The Umwelthaus prognosis as it was published at each hour |
| Rules baseline | `rules.py` | Wind components and the official decision rules (case section 3) |
| Features | `dataset.py` | One row per (issue time, lead time), using only data available at the issue time |
| Models and evaluation | `train.py`, `decision.py`, `fcerror.py`, `blend.py`, `changetime.py`, `evalkit.py` | Logistic model, hour-by-hour decision model, simulated wind futures, the blend, next-change timing, walk-forward evaluation with confidence intervals |
| Forecast | `predict.py`, `blend.py` | 48 h forecast, for now or any past issue time |
| Live operation | `archive.py`, `scoring.py`, `alerts.py` | Hourly archive and forecast, live record, alerts |
| Outputs | `dashboard.py`, `modelpage.py`, `scene3d.py`, `live.py`, `trackrecord.py`, `report.py`, `submit.py` | Dashboard, model page, 3D view, live feed, 14-day track record, model card, submission package |

</details>

## Limitations

- The long test was also used for design; the live holdout is the clean test.
- One summer and autumn so far, no winter test yet.
- Runway 18 “closed” is a proxy: no southbound departures in a busy hour.

## Next steps

- Holdout verdicts on 1 Dec 2026.
- Live aircraft positions as a real-time input for short-notice switches.

[Setup](SETUP.md) · [Model card](MODEL_CARD.md) · [Decision log](research/conclusion.md) · [Experiments](experiments/) · [Live operation](ops/README.md) · [Submission](submission/)
