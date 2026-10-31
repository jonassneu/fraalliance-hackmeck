# FRA hackathon research — 30 October 2026

## TL;DR recommendation

- **Use INAA/Umwelthaus FANOMOS historical tracks for flown OD labels.** Anonymous curl requests returned substantive historical KML for 2024-01-01, 2025-10-01 and 2026-10-01. This is the best discovered path; no OpenSky account needed.
- **Use Open-Meteo Single Runs, initially ECMWF IFS**, for honest forecasts at every lead. A 2025-10-01 run returned 168 hourly values. ICON single runs also work for October 2026. Prefer one consistent model over a rushed multi-model pipeline.
- Do not mistake INAA `Direction/GetDirectionData` for actual labels: it is an archived **prediction**, with eight-hour periods and probabilities.
- Derive OD from low-altitude runway-aligned arrivals; infer RWY18 *usage* from southbound departures originating at its runway. **No departures on 18 does not establish closure.** Model weather usability separately if closure labels cannot be established.
- Train a small gradient-boosted classifier with forecast runway wind components, lead time, observed current OD, persistence and latest available METAR. Calibrate on a later chronological validation block.
- Keep the case's 10/15/40 kt rule baseline exactly. Fraport publicly describes a 5 kt OD policy and west preference; the discrepancy is a plausible source of learnable improvement, not permission to rewrite the baseline.
- Freeze training/validation/test chronologically, purge overlapping 48-hour targets, and evaluate identical rows at 1/6/24 h. Report Brier score, accuracy and event detection/timing, not just headline accuracy.
- Spend the first 60–90 minutes proving labels. Build a 48-hour probability timeline and CSV export; defer ensembles, deep learning and bulk global ADS-B downloads.

## 1. Label source: decisive findings

### Best path: INAA public FANOMOS endpoints

Public application: https://inaa.umwelthaus.org/ ; background: https://www.umwelthaus.org/fluglaerm/anwendungen-service/inaa-air-traffic-noise/

Discovered from the application's own publicly served code, not guessed authenticated interfaces:

- https://inaa.umwelthaus.org/Scripts/Modules/$().Map.js
- https://inaa.umwelthaus.org/Scripts/Widgets/timecontrol.js
- https://inaa.umwelthaus.org/Scripts/Widgets/fanomos.js

The map code requests `Fanomos/GetFlightTracks` with `startTime` and `timeIntervalInHours`; timecontrol specifies `YYYYMMDDTHHMMSS` after conversion to UTC. Two complementary endpoints:

```bash
curl -LsS --max-time 30 'https://inaa.umwelthaus.org/Fanomos/GetFlightTracks?startTime=20251001T120000&timeIntervalInHours=1'
curl -LsS --max-time 30 'https://inaa.umwelthaus.org/Fanomos/GetContentData?customer=eddf&startTime=20251001T120000&inThreshold=false&playbackReverse=false'
```

Verified results:

| Query | Evidence from curl/body parsing |
|---|---|
| GetFlightTracks, 20251001T120000, 1 hour | HTTP 200; 1,221,773 text characters; 1,167 KML Placemarks |
| GetFlightTracks, 20261001T120000, 1 hour | HTTP 200, substantial coordinate-bearing KML |
| GetFlightTracks, 20240101T120000, 1 hour | Parsed KML; 361,386 characters; 562 Placemarks |
| GetContentData, 20251001T120000 | 1,467,618 characters; 49 flight Placemarks; timestamps 12:00:00 through 12:00:59.750 UTC |
| GetContentData, 20261029T120000 | HTTP 200; substantive KML with FlightType and timestamped coordinates |

**Implementation details that matter:** GetFlightTracks returns color-segmented LineStrings named like `14298068_TraceColor7`, without individual timestamps. These are not 1,167 independent flights: group by flight ID prefix. GetContentData contains `FlightType`, `Flight_pk`, `FlightID`, callsign, `gx:Track`, `when`, `gx:coord`, `gx:angles`. Some airport fields are empty; tracks include aircraft far outside FRA, so spatial filtering is mandatory. Coordinates around `(950000,6450000)` are projected, consistent with Web Mercator, despite being inside KML. Confirm transformation against runway geometry before assigning labels. XML declares utf-16 although curl's decoded text parses directly: parse Unicode or normalize the declaration deliberately.

**Suggested extraction:** hourly track windows first; merge color segments by flight identity, retain segments within the airport approach/departure corridors, below approximately 600 m above airport elevation, and aligned within 20 degrees of the runway axis. Require multiple agreeing arrivals to classify an hour. Use signed trajectory direction, not just axis. Identify RWY18 from its distinct western runway origin plus southward motion; southbound aircraft farther away can have turned after departure from another runway. Inspect 20 hand-picked examples before scaling. Use timed GetContentData samples around ambiguous switches to establish precise labels; fetching every minute for a year would be excessive. The exact forward/backward coverage convention of GetFlightTracks needs one comparison against timestamped samples before production extraction.

Start with 8–12 weeks, preferably multiple seasons if throughput permits. One year is much better for rare switches but not a six-hour prerequisite. Sampled old dates prove availability on those dates, **not continuous archive completeness**. Endpoint service guarantees, bulk rate limits and redistribution rights were not verified. Cache responses, use modest concurrency and preserve attribution. Estimate 45–90 min for extraction/QA implementation, then acquisition time depends on volume.

### Other label candidates and fallback

| Source | What exists / history / granularity | Decision |
|---|---|---|
| Umwelthaus current BR | DFS-attributed current direction with change timestamp; curl page showed BR07 and “since 29 Oct 09:54” | Good live state; no verified public switch-log export |
| INAA Direction endpoint | Archived eight-hour predictions, verified October 2025 | Competitor baseline only, never flown labels |
| Fraport current BR | Current public page | Live corroboration; historical hourly API not established |
| City / Fraport reports | Monthly/quarterly direction distributions | Sanity checks, not hourly supervised labels |
| DFS | Underlying authority/source for current state and FANOMOS application | No separate anonymous historical BR CSV found |
| ATIS | No verified public EDDF historical text/audio archive found | Do not spend hackathon hours acquiring/transcribing |
| METAR / TAF | Weather observations/forecasts | Runway mentions/RVR do not establish active OD; never infer truth by applying the same wind rule |
| OpenSky | Historical trajectories exist, full history requires approved access; airport flight list alone lacks runway | Not critical path: tested historical departures returned HTTP 403 |
| ADS-B Exchange | Historical product and sample data exist | Samples not proven to span sufficient FRA switch events; full product not a quick free archive |
| ADSB.lol | Open daily global trace archives on GitHub | **Fallback** if INAA proves unusable; substantial download/filtering effort, allow 1–3 h |

Sources:

- https://www.umwelthaus.org/fluglaerm/anwendungen-service/aktuelle-betriebsrichtung-und-prognose/
- https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/aktuelle-betriebsrichtung.html
- https://frankfurt.de/fluglaermschutz/-/media/frankfurtde/microsites/microsite-fluglaermschutz/pdf/laerm-monitoring-2025/fluglaermq4_2025.pdf
- https://opensky-network.org/about/faq and https://github.com/openskynetwork/opensky-api/blob/master/docs/free/rest.rst
- https://www.adsbexchange.com/data-products/sample-data/
- https://github.com/adsblol/globe_history_2026 — daily split tar archives with gzipped JSON traces; repository documents ODbL data licensing. Download both parts of one chosen daily release, not the entire repository archive. Actual daily payload download/EDDF coverage not verified here.

Verified failed OpenSky request: https://opensky-network.org/api/flights/departure?airport=EDDF&begin=1759276800&end=1759363200 → HTTP 403, `You cannot access historical flights`.

Verified INAA forecast archive: https://inaa.umwelthaus.org/Direction/GetDirectionData?currentTime=20251001T120000 → HTTP 200, JSON `xmlContent`, periods from October 1 through October 5, state/probability values. Source mapping in https://inaa.umwelthaus.org/Scripts/Widgets/direction.js shows state 1 west, 3 east, other codes transitional/mixed graphical states. Do not simplify all non-1 values to east.

## 2. Weather: working forecast archives and observations

### Primary: Single Runs API

Documentation: https://open-meteo.com/en/docs/single-runs-api

Exact verified EDDF request:

```bash
curl -LsS 'https://single-runs-api.open-meteo.com/v1/forecast?latitude=50.0333&longitude=8.5706&run=2025-10-01T00:00&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl&models=ecmwf_ifs&wind_speed_unit=kn'
```

Returned 168 hourly timestamps; speed/direction/pressure all populated, gusts 167/168 (first missing). Documentation lists IFS archive from 2024-03-14 and other models from 2026-04-02. This solves arbitrary leads without pretending a stitched analysis is a forecast. Preserve requested initialization time in storage; **initialization is not availability**. Use a conservative 6-hour publication buffer initially, record this assumption, and evaluate forecast issue time `t` using a run initialized no later than `t−6h`. Exact publication latency remains unverified.

Also verified:

https://single-runs-api.open-meteo.com/v1/forecast?latitude=50.0333&longitude=8.5706&run=2026-10-01T00:00&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,wind_speed_100m&models=icon_seamless&wind_speed_unit=kn

Returned 168 timestamps, populated 100 m speeds and 167 gusts. Do not expect this ICON archive in 2025. Pin model across train and live inference; do not train ICON and silently serve IFS. Higher-level wind direction availability was not tested.

### Previous Runs and Historical Forecast distinction

Docs: https://open-meteo.com/en/docs/previous-runs-api and https://open-meteo.com/en/docs/historical-forecast-api

Verified HTTP 200 with 48 non-null hourly values per field:

https://previous-runs-api.open-meteo.com/v1/forecast?latitude=50.0333&longitude=8.5706&start_date=2025-10-01&end_date=2025-10-02&hourly=wind_speed_10m_previous_day1,wind_direction_10m_previous_day1,wind_gusts_10m_previous_day1&models=icon_seamless&wind_speed_unit=kn

Previous Runs provides fixed day offsets 1–7 (24/48 h useful here), most model coverage from January 2024. It does not directly provide exact 1 h and 6 h vintages. Historical Forecast stitches first portions of successive runs into a continuous series: do not use future valid-time rows as if they were known at issue time. Single Runs is the stronger default.

### METAR observations

Verified HTTP 200 CSV containing 48 EDDF reports at :20/:50 on 2025-10-01:

```bash
curl -LsS 'https://mesonet.agron.iastate.edu/cgi-bin/request/asos.py?station=EDDF&data=all&year1=2025&month1=10&day1=1&year2=2025&month2=10&day2=2&tz=Etc%2FUTC&format=onlycomma&latlon=no&elev=no&missing=M&trace=T&direct=no&report_type=3&report_type=4'
```

Fields include `drct`, `sknt`, `gust`, raw `metar`; example `EDDF 010020Z AUTO 01005KT CAVOK 10/07 Q1027 NOSIG`. VRB direction is missing numerically, not north. Missing gust is not zero gust. Use latest report available before issue time with an ingestion buffer; no future observations or centered rolling means. Exact earliest EDDF archive coverage not measured. Data interface: https://mesonet.agron.iastate.edu/request/download.phtml

### DWD

Verified live directory: https://opendata.dwd.de/weather/local_forecasts/mos/MOSMIX_L/single_stations/10637/kml/

Contains `MOSMIX_L_LATEST_10637.kmz` and runs 2026-10-28 through 2026-10-30; latest listing 16,013 bytes. Endpoint is suitable for a live station forecast, **not evidence of a long historical archive**. Latest file payload/station metadata not parsed here. ICON raw model directory: https://opendata.dwd.de/weather/nwp/icon/ (not curl-verified in this pass). Avoid GRIB extraction and finding external forecast archives unless Open-Meteo fails.

### Live jury-day requests

Verified populated 72-hour JSON:

https://api.open-meteo.com/v1/forecast?latitude=50.0333&longitude=8.5706&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m&models=ecmwf_ifs&wind_speed_unit=kn&forecast_days=3

For deployment request four days to ensure 48 future hours even late in the day, add trained variables, persist retrieval/issue times and raw response. For **past jury days**, use Single Runs as-of their declared issue times; never call today's forecast endpoint to reconstruct history. Free API terms/limits: https://open-meteo.com/en/terms (not independently audited in this pass).

## 3. Opinionated modeling and honest evaluation

The official brief was read in full: `docs/FraAlliance_Case.pdf`. Its thresholds and airport-wide OD are the scoring contract. External descriptions differ: https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/betriebsrichtung.html describes a 5 kt tailwind criterion, preference for west and consideration of upper winds. Treat this as motivation for learning actual controller behavior; do not assume the brief's movement shares equal hourly class priors.

**Targets:** OD at the target hour (define point-in-time or majority-of-hour explicitly; recommend majority with mixed/low-coverage hours flagged). RWY18 weather usability is distinct from observed use. Positive use supports availability, but no-use can reflect demand/night restrictions/maintenance. Without genuine closure labels, report a weather-usability proxy trained against METAR-derived conditions, and explicitly do not claim operational-closure validation.

**Features:** for wind FROM direction θ and runway bearing r, headwind `H=v*cos(θ−r)`, tailwind `max(0,−H)`, crosswind `abs(v*sin(θ−r))`. Use degrees converted to radians; bearings 070/250/180 from the case. Include gust crosswind, signed components, threshold distances, speed, gust excess, pressure, forecast wind trend over coming 1–6 hours from the SAME available run, cyclic local hour/season, lead time, age of run, latest METAR residual versus forecast, current OD, state age, and recent observed wind trends. Avoid arithmetic averaging of circular directions. Learned west preference, wind error near thresholds and persistence are the main likely gains. Model disagreement is an optional uncertainty feature, not a calibrated ensemble probability.

**Model:** one shallow gradient-boosted binary classifier with horizon as a feature for OD, train rows for leads 1–48. Compare with logistic regression and current-state persistence. Calibrate via sigmoid on chronological validation; avoid isotonic with few switches. Missing current OD gets an explicit missing flag; do not inject hindsight current state if historical feed availability is unknown. Train a weather-error model on archived forecasts vs future METAR if operational RWY18 labels fail, sample residual wind vectors, then compute fraction satisfying usability thresholds. Preserve temporal residual correlation when sampling paths.

**Baseline:** same weather run and initial OD as ML; apply landing tailwind ≥10 kt immediate switch, positive subthreshold tailwind persistent >30 min switches, headwind preferred; runway18 tailwind ≥15 closes, gust-inclusive crosswind >40 closes. Hourly forecasts cannot resolve 30-minute persistence: interpolate wind vectors to a 15-minute grid and disclose approximation. Parallel-runway crosswind closure does not become evidence for the opposite OD; flag unavailable. Include an always-25 and persistence benchmark. Do not train/evaluate OD on wind-generated labels and call improvement actual flown accuracy.

**Splits:** contiguous train/validation/test, e.g. 60/20/20 by time; purge 48-hour overlapping target windows across boundaries. Fit preprocessing and calibration only on the proper earlier blocks. Freeze model selection before test. Report number of valid hours, positive/negative counts, missing-label coverage and independent switch events. With ~156 switches/year in the supplied briefing, a short test can be dominated by persistence; confidence intervals should bootstrap days or episodes, not individual horizon rows.

**Metrics:** 1/6/24-hour accuracy, balanced accuracy, Brier and clipped log loss on identical rows; reliability bins if sample size permits. For switches: one-to-one match predicted/actual events within a declared ±3-hour tolerance; timing MAE on matches plus missed-switch and false-alarm counts. Otherwise predicting no switches can look deceptively excellent. Report RWY18 metrics separately by observed-use versus weather-proxy target.

**Next change:** simplest demo rule: first future crossing of 0.5 sustained two hourly steps, with validation-tuned hysteresis (e.g. 0.6 entering west / 0.4 leaving). Label this a decision heuristic, not a statistically derived change-time distribution. Better if time remains: simulate state paths from transition probabilities and give median first-change time, interval and probability of no change in 48 hours. `max(p,1−p)` is the calibrated certainty of the selected class, not an independent confidence measure.

## 4. Prior work

NASA's 2024 *Applying Machine Learning Tools for Runway Configuration Decision Support* evaluates conservative Q-learning on Charlotte, Denver and Dallas/Fort Worth. It checks agreement with controllers and violations of obvious expert decisions; its motivating factors include weather, visibility, demand, equipment and operational constraints. Transfer the evaluation philosophy and state/context features; reinforcement learning is unnecessary for a six-hour prediction task. Source: https://ntrs.nasa.gov/citations/20240005767

NASA's 2023 supervised-learning paper is directly relevant follow-up reading: https://ntrs.nasa.gov/api/citations/20230003876/downloads/DASC_2023_RCM_SupervisedLearning.pdf . Search verified the paper's existence; detailed comparative results were not checked, so no accuracy or winning algorithm is asserted. No independently verified FRA-trained public model or MIT dataset was found in this pass.

## 5. Six-hour build plan

| Elapsed | Concrete result / stop rule |
|---|---|
| 0:00–0:45 | Fetch INAA sample days, transform coordinates, hand-check labels and runway18 origins. Implement baseline formulas and a fixed output schema. |
| 0:45–1:30 | Acquire representative history, label hourly bins with coverage flags; fetch IFS runs and IEM reports. If label extraction fails, switch immediately to ADSB.lol or disclose weather-proxy scope; never quietly substitute wind labels. |
| 1:30–2:30 | Build as-of joins, chronological splits and boosted/logistic models. Cache feature table and fit artifacts. |
| 2:30–3:30 | Calibration and identical-row baseline comparison; inspect switch cases and leakage; quantify label coverage. |
| 3:30–4:30 | Demo: 48 hourly P(OD25), P(RWY18 weather usable), current OD, certainty, next sustained change, data freshness and threshold drivers. |
| 4:30–5:15 | Live/as-of jury forecast runner, CSV export, tests for direction wrapping, units, threshold equality, missing gusts and DST. |
| 5:15–6:00 | Freeze results, produce one-page model card, repo instructions, source manifest and rehearsal. |

Suggested CSV: `issued_at_utc, valid_at_utc, lead_hours, p_od25, predicted_od, od_certainty, p_rwy18_usable, rwy18_certainty, next_change_utc, model_version, weather_run_utc, data_quality_flag`. Include a separate no-change-in-window indicator; do not fabricate a change time beyond 48 h.

What should impress judges: actual flown labels with provenance, an honest archived-run test, calibrated uncertainty near a threshold, visible advantage over persistence on switch events, and an explainable example where forecast error/persistence changes the answer. Do not claim the model beats baseline until the held-out results demonstrate it.

## Explicit uncertainties / unverified items

- INAA continuous archive coverage, request rate limits, redistribution permission, and interval direction semantics are not established. Spot checks are successful, not a complete dataset audit.
- Coordinate projection is strongly indicated by numeric values and map usage but must be checked against geometry; color segments need merging; full runway assignment was not implemented here.
- No genuine historical RWY18 closure/availability log was found. No-use ≠ closed remains the main target risk.
- No separate public DFS switch log or historical ATIS archive was verified. Reports cannot replace hourly truth.
- Single-run publication latency is not in the returned evidence. Six-hour buffer is a conservative engineering assumption, not a provider guarantee.
- Open-Meteo earliest coverage is documented, but only the stated runs were downloaded. Bulk performance and all optional variables remain untested.
- ADSB.lol release files were documented but not bulk-downloaded; ADS-B Exchange sample FRA coverage was not established.
- Operational rules in public guidance differ from the case. Preserve both facts explicitly in the model card.
- No model was trained and no achieved accuracy is claimed. Only this findings file was created; HTTP payloads were inspected in memory.
