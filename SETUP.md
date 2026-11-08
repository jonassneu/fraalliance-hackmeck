# Setting up the forecast

This guide installs the forecast on your own machine. The machine then issues a new 48 h forecast for Frankfurt's operating direction and Runway 18 every hour, and serves the dashboard and the 3D view.

Installing takes about a minute. No training and no historical data are needed: the release ships the frozen model files, about 7 MB, which produce exactly the forecasts of the live system.

## Requirements

| | |
| --- | --- |
| System | Windows, Linux or macOS. The background service (`--service`) needs Windows or Linux with systemd; on macOS use `ops.serve` with your own process manager. |
| Software | [Git](https://git-scm.com/) and [uv](https://docs.astral.sh/uv/), which installs Python 3.12 and the packages by itself. Node.js is not needed: the 3D view is prebuilt. |
| Resources | 1 CPU core, 1 GB RAM (a run peaks at about 600 MB), about 600 MB of disk for the installation (mostly Python packages). The archive grows by about 7 MB a day, mostly raw radar tracks kept for the live record. |
| Network | Outbound HTTPS to the hosts below. Nothing listens on the network unless you choose `--host 0.0.0.0`. |

| Host | What for | Requests |
| --- | --- | --- |
| `inaa.umwelthaus.org` | Flown direction from radar tracks; the published prognosis | about 5 an hour; up to 10 in the first hours, while it collects the last 36 h |
| `single-runs-api.open-meteo.com`, `api.open-meteo.com`, `ensemble-api.open-meteo.com` | ECMWF IFS and DWD ICON forecasts as issued | 10–20 an hour |
| `mesonet.agron.iastate.edu` | METAR EDDF, the observed wind | 1–2 an hour |
| `github.com` | Downloading the model files, once | install only |
| `fonts.googleapis.com` | The web font, loaded by the viewer's browser. If it is blocked, the pages fall back to a system font. | per page view |

Behind a company proxy, set `HTTPS_PROXY` for the account that runs the forecast. If the proxy inspects TLS, also set `UV_NATIVE_TLS=1` for the install and `REQUESTS_CA_BUNDLE` to your company's CA file for the forecast.

## Install

**Windows**, in cmd or PowerShell. Install uv once, then open a new terminal:

```bat
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

```bat
git clone --branch v2.1 https://github.com/jonassneu/fraalliance-hackmeck.git
cd fraalliance-hackmeck
.\install.cmd
```

**Linux and macOS:**

```bash
git clone --branch v2.1 https://github.com/jonassneu/fraalliance-hackmeck.git
cd fraalliance-hackmeck
./install.sh
```

The installer does three things:
- creates the Python environment (`uv sync`);
- downloads the model files of the release, checks their SHA-256 and unpacks them into `data/`;
- makes a test forecast for the current hour with the live inputs.

It ends with a summary like this:

```
Test forecast with blend-v2 (live inputs; nothing is issued) ...
  issue hour             2026-11-06T16:00:00+00:00
  current direction      OD 07 (east)
  P(OD 25 west) in 1 h   3.3 %
  P(OD 25 west) in 24 h  38.7 %
  next likely change     2026-11-07T21:00:00+00:00
  Runway 18 open         at least 99 % within 48 h
```

If the test fails, the network access above is the usual cause.

Without internet access to GitHub, download `fra-forecast-models-v2.0.tar.gz` from the [release page](https://github.com/jonassneu/fraalliance-hackmeck/releases/tag/v2.0) by other means, then run `./install.sh --bundle path/to/fra-forecast-models-v2.0.tar.gz` (Windows: `.\install.cmd --bundle ...`). The checksum is checked the same way. The model files of v2.1 are those of v2.0.

## Run

Choose one of these.

**In a terminal**, to try it out, on any system:

```bash
uv run python -m ops.serve                       # http://localhost:8080/
```

**As a background service on Linux** (systemd user service; it restarts after failures):

```bash
./install.sh --service                           # http://localhost:8080/ for this machine only
./install.sh --service --host 0.0.0.0            # reachable from the network
sudo loginctl enable-linger $USER                # keep it running without a login session
```

**As a background service on Windows** (a scheduled task). Open the terminal with "Run as administrator":

```bat
.\install.cmd --service
```

The pages are then on http://localhost:8080/ for this machine only. Add `--host 0.0.0.0` to make them reachable from the network.

This registers the task `FRA Forecast`. It starts with the machine and runs under your account, with no login and no stored password, and restarts after failures. With `--host 0.0.0.0`, Windows Firewall must also allow incoming connections on port 8080.

**With cron, or any other scheduler.** Run the hourly steps at minute 30, and serve `site/` with any web server:

```cron
30 * * * *  cd /path/to/fraalliance-hackmeck && .venv/bin/python -m ops.serve --once
```

On Windows the command is `.venv\Scripts\python.exe -m ops.serve --once`, with the installation folder as the working directory.

Every hour at minute 30 the service does the following:
1. issues the 48 h forecast;
2. archives the inputs it used;
3. collects the flown direction of recent hours from the radar;
4. scores all earlier forecasts against it;
5. updates the alerts and rebuilds the pages.

At minute 50 it tries again if the forecast of the hour is missing, for example because a weather service was down. Minute 30 is deliberate: the radar hour the forecast starts from is only completely published about 75–80 minutes after it ends.

## What you get

| | Where |
| --- | --- |
| Dashboard | `http://<host>:8080/`: direction now, next change, Runway 18, the next 48 hours, alerts, live record |
| 3D view | `http://<host>:8080/airport3d.html` |
| Forecast of each hour, machine-readable | `data/archive/issued/forecast_YYYYMMDDTHH.csv`: per hour ahead, P(OD 25), P(Runway 18 open), the predicted direction, certainty and next change. Next to it: `.json` (inputs and model used) and `.features.parquet` (the exact model input) |
| Alerts | `site/alerts.json`: a switch expected within 12 h; Runway 18 at risk within 24 h |
| Live record | `site/live_record.json`: accuracy of this installation's own forecasts, from about 3 h after the first forecast |
| Run log | `data/archive/runs.jsonl`, one line per run; the service output goes to the terminal, to `journalctl --user -u fra-forecast` (Linux) or to `data\service.log` (Windows) |

Columns of the forecast CSV (one row per hour ahead, 1–48; all times UTC, the pages show local time or UTC):

| Column | Meaning |
| --- | --- |
| `issue_utc`, `valid_utc`, `lead_h` | When the forecast was issued, the hour it is for, hours ahead |
| `p_od25` | Probability of operating direction 25 (west); 1 − `p_od25` is OD 07 (east) |
| `od_pred`, `od_certainty` | Most likely direction (25 or 07) and its certainty, \|P − 0.5\| × 2 |
| `p_rwy18_open`, `rwy18_pred_open` | Probability that Runway 18 West is usable for departures, and the yes/no call at 0.5 |
| `od_now` | Direction flown in the last completely published radar hour |
| `next_change_utc`, `p_change_48h`, `change_window_start`, `change_window_end` | Next likely direction change, the chance of any change within 48 h, and its likely window |
| `rule_baseline_od` | The official decision rule applied to the ECMWF wind forecast, for comparison |
| `p_od25_logit`, `p_od25_decision`, `p_rwy18_open_logit` | The two parts of the forecast before averaging |
| `blend_ok`, `blend_status` | `False` if the decision part failed and the hour was issued from the logistic model alone |
| `model_sha256`, `retrieved_start_utc`, `retrieved_end_utc` | Model file used and when the inputs were fetched |

## Check, update, remove

On Linux:

```bash
systemctl --user status fra-forecast                # service state
journalctl --user -u fra-forecast -n 50             # recent output
tail -n 1 data/archive/runs.jsonl                   # last run: failed steps, inputs, model

# update to a newer release
git checkout -- site && git fetch --tags && git checkout <new tag> && ./install.sh
systemctl --user restart fra-forecast

# remove the service (the installation folder can then be deleted)
systemctl --user disable --now fra-forecast && rm ~/.config/systemd/user/fra-forecast.service
```

On Windows, the task commands need a terminal opened with "Run as administrator". To check the service:

```bat
schtasks /Query /TN "FRA Forecast" /V /FO LIST
type data\service.log
```

To update to a newer release:

```bat
git checkout -- site
git fetch --tags
git checkout <new tag>
.\install.cmd
schtasks /End /TN "FRA Forecast"
schtasks /Run /TN "FRA Forecast"
```

To remove the service (the installation folder can then be deleted):

```bat
schtasks /End /TN "FRA Forecast"
schtasks /Delete /TN "FRA Forecast" /F
```

`site/` is rebuilt every hour, so discarding its local changes before an update loses nothing. `data/` holds this installation's record and is never touched by git. Copy `data/archive` elsewhere to keep it (`ops.serve --backup DIR` does this every hour).

## Before operational use

- **Weather data licence.** The free Open-Meteo API is for non-commercial use. Operational use by a company needs an [Open-Meteo API subscription](https://open-meteo.com/en/pricing). The data is CC BY 4.0, credited on the pages.
- **Direction source.** The flown direction is derived from the public Umwelthaus INAA radar tracks, which are published with a delay of about an hour. The airport's own operating-direction records would be more direct and faster: the biggest weakness of the forecast is a switch within the next hour.
- **Accuracy.** Expect about 96 % correct at +1 h and 91–93 % at +48 h over a year. Calm winter months are easier and summer thunderstorm months harder. The [README](README.md#results) and the [model card](MODEL_CARD.md) give the tested numbers.
- **The model stays fixed.** It does not retrain itself. The original system keeps a live record and a locked holdout (first verdict 1 Dec 2026); a later release will ship an updated model.

On Windows, this guide covers the installed forecast. The full pipeline and the original deployment below need Linux.

For the full pipeline (data download, training, evaluation), see [README.md](README.md#run-it). For the original deployment with frozen code snapshots and several model variants side by side, see [ops/README.md](ops/README.md).
