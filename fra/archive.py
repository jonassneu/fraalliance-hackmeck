"""Forward archive + live operation: one hourly job (python -m fra.archive from the frozen runtime, systemd fra-archive.timer at :30 local time; :12 until 31 Oct 2026 19:xx UTC, see fra.dataset.KNOWN_LAG_H).

Every step is idempotent and isolated (a failing source never blocks the others); the status of each step goes to
the journal and to data/archive/runs.jsonl. Nothing here rewrites the training archives (labels.parquet,
prognosis.parquet, ifs_runs.parquet, ...); data/inaa_counts.csv only gets forward hours appended.

Order: the forecast is issued FIRST (it is the only output that can never be made up later); everything that can
be caught up later (METAR / Open-Meteo snapshots, radar hours) runs after it, under a time budget.

 1. prognosis  INAA OD prognosis as published at the issue hour (currentTime = issue, like fra.predict) ->
               data/archive/prognosis/YYYY/MM/<asof>.json.gz (raw response) + rows appended to
               data/archive/prognosis_live.parquet (same columns as data/prognosis.parquet + retrieved_utc).
 2. issue      the registry CHAMPION (data/archive/variants.json: its entry, e.g. fra.blend:forecast or
               fra.predict:forecast, with its frozen model files under data/archive/models/<variant>/); fallbacks if it
               cannot predict: the pinned production model data/archive/models/production/model.pkl with
               fra.predict.forecast (promoted only by ops.retrain), then data/model.pkl (flagged) -> data/archive/issued/
               forecast_YYYYMMDDTHH.csv (+ issue_utc, model_sha256, retrieval window), .json (metadata) and
               .features.parquet (the exact feature frame the model was applied to). The model is kept
               content-addressed in data/archive/models/sha256/<sha>.pkl and the source of fra/*.py in
               data/archive/code/ (manifest per code version + content-addressed files), so every issued probability
               can be recomputed exactly (model + features + code). The raw inputs behind the features are archived
               only approximately: fra.predict makes its own live requests (Open-Meteo, IEM, the newest radar hour),
               which are separate from the snapshots of steps 3-4; the prognosis is the step-1 snapshot.
               Only the CURRENT hour is ever issued (never backfilled), so these files are a true forward record.
 3. metar      IEM EDDF METAR, last 6 h -> data/archive/metar/YYYY/MM/<issue>.csv.gz
 4. forecasts  live Open-Meteo forecasts, 10 m + 80/100/120 m wind, with retrieval time and the model run metadata
               (Open-Meteo meta.json: init / availability time) -> data/archive/forecasts/<model>/YYYYMMDDTHH.json.gz
               for ecmwf_ifs, icon_d2, icon_eu and the ECMWF ensemble (ecmwf_ens, 51 members, saved only when the
               ensemble run changed: ~40 kB per run).
 5. radar      hours of the last --hours (36) whose FANOMOS window [s, s+1h) ended >= LAG_MIN ago and that are not
               yet in data/inaa_counts.csv -> counts appended (fra.labels.classify, same format as
               fra.labels.build_labels), raw KML -> data/archive/radar/YYYY/MM/<hour start YYYYMMDDTHH>.kml.gz.
               At most RADAR_MAX_NEW requests and RADAR_BUDGET_S per run, stop after 2 consecutive failures, INAA
               slot wait <= SLOT_WAIT_S (bigger catch-ups by hand: --hours 72 --radar-max 72).
               Re-check: every stored hour is fetched once more when its window ended >= RECHECK_AFTER_H ago; if the
               radar now holds MORE movements, a corrected row is appended (fra.labels.load_counts keeps the last
               row of an hour) and the raw KML replaced. Results: data/archive/radar_recheck.json + runs.jsonl.
               FANOMOS publishes with a delay of ~60-75 min in batches (measured 31 Oct 2026).
 4b. shadow    every enabled challenger of the variant registry data/archive/variants.json (load_variants) issues
               the same hour as a SHADOW forecast, each in its own frozen runtime and process (shadow_forecasts) ->
               data/archive/issued_shadow/<variant>/forecast_YYYYMMDDTHH.csv (+ .json, .features.parquet), with the
               prognosis snapshot of step 1 and the radar hours exactly as the champion saw them (run_cache/<issue>/).
               After the snapshots of steps 3-4, before the radar step, under SHADOW_BUDGET_S; a failing challenger
               never touches the official forecast, which the champion (the registry's champion variant, normally the
               pinned production model) has issued in step 2.
 6. site       python -m fra.dashboard <new forecast> when a new forecast was issued (or the site is older than it).

Runtime: the systemd unit runs this module from a frozen copy of the code (ops/runtime.py: data/archive/runtime/current
-> data/archive/runtime/<tag>/ with symlinks data/, site/, web/, ... to the repository), so edits in the working tree
reach the live job only through `python -m ops.runtime snapshot / smoke / promote`. runs.jsonl records the runtime tag
and the variants of every run.

    uv run python -m fra.archive [--hours 36] [--radar-max 6] [--force] [--skip radar,forecasts,shadow,...] [--no-site]
    uv run python -m fra.archive --shadow NAME --issue ISO     (one challenger; called by the hourly job)
    uv run python -m fra.archive --smoke NAME[,NAME...]        (forecast the current hour, write nothing official)
"""

import argparse
import contextlib
import fcntl
import gzip
import hashlib
import importlib
import inspect
import json
import os
import re
import shutil
import subprocess
import sys
import time
import traceback
from pathlib import Path

import numpy as np
import pandas as pd
import requests

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
ARCHIVE = DATA / "archive"
RADAR, PROG, METAR, FCST, ISSUED, MODELS, CODE = (ARCHIVE / k for k in ("radar", "prognosis", "metar", "forecasts",
                                                                         "issued", "models", "code"))
PROG_LIVE = ARCHIVE / "prognosis_live.parquet"
RUNLOG = ARCHIVE / "runs.jsonl"
RECHECK = ARCHIVE / "radar_recheck.json"
COUNTS = DATA / "inaa_counts.csv"
MODEL = DATA / "model.pkl"                       # shared development model (any `python -m fra.train` rewrites it)
PROD_DIR = MODELS / "production"
PROD_MODEL = PROD_DIR / "model.pkl"              # pinned production model: promoted only by ops.retrain
PROD_INFO = PROD_DIR / "promoted.json"
SITE = ROOT / "site"
ISSUED_SHADOW = ARCHIVE / "issued_shadow"        # shadow forecasts of the challengers: issued_shadow/<variant>/
# variant registry (champion + challengers), see load_variants; FRA_VARIANTS_FILE points a smoke test at a candidate
# registry before it goes live (ops.runtime smoke --registry); the hourly unit never sets it
REGISTRY = Path(os.environ["FRA_VARIANTS_FILE"]) if os.environ.get("FRA_VARIANTS_FILE") else ARCHIVE / "variants.json"
RUNTIME_DIR = ARCHIVE / "runtime"                # frozen code snapshots (ops/runtime.py); current -> the live one
RUN_CACHE = ARCHIVE / "run_cache"                # radar hours the champion fetched live, re-used by the shadows
RUNTIME_MANIFEST = ROOT / "RUNTIME.json"         # exists when this code runs from a frozen snapshot
DEFAULT_ENTRY = "fra.predict:forecast"
H = 48

FORWARD_FROM = pd.Timestamp("2026-10-30T12:00", tz="UTC")  # first radar hour appended by this job: older gaps in
                                                           # inaa_counts.csv (night-ban hours of the labels build) are not ours
LAG_MIN = 100            # take a radar hour only when its window ended >= 100 min ago (FANOMOS delay ~60-75 min)
INAA_PAUSE_S = 0.5       # sequential INAA requests with a short pause (server serializes at ~0.4 req/s for everyone)
SLOT_WAIT_S = 120        # max wait for a free cross-process INAA slot (fra.labels.inaa_slot; its default is 30 min)
KML_TIMEOUT_S = 90
RADAR_MAX_NEW = 6        # new radar hours (requests) per hourly run
RADAR_BUDGET_S = 8 * 60  # no new radar request after this many seconds
RADAR_MAX_FAIL = 2       # consecutive radar failures -> stop for this run
RECHECK_AFTER_H = 6      # re-fetch a stored hour once its window ended >= 6 h ago
RECHECK_MAX = 3          # re-checks per run
RECHECK_HORIZON_H = 48   # only hours of the last 48 h are re-checked
RUN_BUDGET_S = 25 * 60   # optional steps are skipped after this (systemd TimeoutStartSec=45min for the whole chain)
SHADOW_BUDGET_S = 6 * 60   # all shadow forecasts of a run together
SHADOW_TIMEOUT_S = 4 * 60  # one shadow forecast (registry: timeout_s); the child process is killed after it
SHADOW_MAX_LAG_MIN = 20    # no shadow once the official forecast of the hour is older (it would see newer inputs)
UA = {"User-Agent": "fra-od-forward-archive/1.1 (FraAlliance hackathon follow-up; hourly)"}

LAT, LON = 50.0333, 8.5706
OM_FORECAST = "https://api.open-meteo.com/v1/forecast"
OM_ENSEMBLE = "https://ensemble-api.open-meteo.com/v1/ensemble"
OM_META = "https://api.open-meteo.com/data/{}/static/meta.json"
WIND = ["wind_speed_10m", "wind_direction_10m", "wind_gusts_10m", "wind_speed_80m", "wind_direction_80m",
        "wind_speed_100m", "wind_direction_100m", "wind_speed_120m", "wind_direction_120m"]
# name -> (endpoint, models=, meta.json dataset, hourly variables, save only when the run changed)
OM_MODELS = {
    "ecmwf_ifs": (OM_FORECAST, "ecmwf_ifs", "ecmwf_ifs", WIND, False),
    "icon_d2": (OM_FORECAST, "icon_d2", "dwd_icon_d2", WIND, False),
    "icon_eu": (OM_FORECAST, "icon_eu", "dwd_icon_eu", WIND, False),
    "ecmwf_ens": (OM_ENSEMBLE, "ecmwf_ifs025", "ecmwf_ifs025_ensemble",
                  ["wind_speed_10m", "wind_direction_10m", "wind_speed_100m", "wind_direction_100m"], True),
}


# ---------------------------------------------------------------- helpers

def utc_now():
    return pd.Timestamp.now("UTC")


def iso(t):
    return None if t is None or pd.isna(t) else pd.Timestamp(t).tz_convert("UTC").isoformat()


def rel(p):
    p = Path(p)
    return str(p.relative_to(ROOT)) if p.is_relative_to(ROOT) else str(p)


def month_dir(base, t):
    return base / f"{t:%Y}" / f"{t:%m}"


def atomic_bytes(path, data: bytes):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    tmp.write_bytes(data)
    os.replace(tmp, path)


def save_json_gz(path, obj):
    atomic_bytes(path, gzip.compress(json.dumps(obj, separators=(",", ":"), default=str).encode(), 6))


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(1 << 16), b""):
            h.update(b)
    return h.hexdigest()


def runtime_info():
    """The frozen runtime this process runs from (ops/runtime.py manifest RUNTIME.json), else the working tree."""
    try:
        m = json.loads(RUNTIME_MANIFEST.read_text())
        return dict(tag=m.get("tag"), git_head=(m.get("git_head") or "")[:12], dirty=bool(m.get("dirty")),
                    created_utc=m.get("created_utc"))
    except (OSError, ValueError):
        return dict(tag="working-tree")


def code_version():
    rt = runtime_info()
    if rt["tag"] != "working-tree":  # git status inside the snapshot folder says nothing: use its manifest
        return f"{rt['git_head'][:7]}{'+dirty' if rt['dirty'] else ''} runtime {rt['tag']}"
    try:
        head = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=ROOT, capture_output=True, text=True,
                              timeout=10).stdout.strip()
        dirty = subprocess.run(["git", "status", "--porcelain", "--", "fra"], cwd=ROOT, capture_output=True, text=True,
                               timeout=10).stdout.strip()
        return f"{head}{'+dirty' if dirty else ''}" or None
    except Exception:
        return None


def code_snapshot():
    """Archive the source of fra/*.py as it is now (called at process start, before fra.predict & co. are imported):
    content-addressed files data/archive/code/files/<sha256>.py.gz + manifest data/archive/code/<version>.json.
    Returns (version = sha256 over all files, manifest path)."""
    files = sorted((ROOT / "fra").glob("*.py"))
    blobs, h = {}, hashlib.sha256()
    for p in files:
        b = p.read_bytes()
        s = hashlib.sha256(b).hexdigest()
        blobs[p.name] = (s, b)
        h.update(p.name.encode() + b"\0" + s.encode() + b"\0")
    ver = h.hexdigest()
    man = CODE / f"{ver[:16]}.json"
    if not man.exists():
        for name, (s, b) in blobs.items():
            dst = CODE / "files" / f"{s}.py.gz"
            if not dst.exists():
                atomic_bytes(dst, gzip.compress(b, 9))
        atomic_bytes(man, json.dumps(dict(version=ver, created_utc=iso(utc_now()), git=code_version(),
                                          files={n: s for n, (s, _) in blobs.items()}), indent=1).encode())
    return ver, man


def get(url, params=None, timeout=60, tries=3):
    for k in range(tries):
        try:
            r = requests.get(url, params=params, timeout=timeout, headers=UA)
            if r.status_code == 429 or r.status_code >= 500:
                raise requests.HTTPError(f"HTTP {r.status_code}")
            r.raise_for_status()
            return r
        except (requests.ConnectionError, requests.Timeout, requests.HTTPError):
            if k == tries - 1:
                raise
            time.sleep(5 * (k + 1))


# ---------------------------------------------------------------- INAA radar (FANOMOS) access

def radar_path(start):
    """Raw KML of the radar hour STARTING at `start` (window [start, start+1h), same index as inaa_counts.csv)."""
    return month_dir(RADAR, start) / f"{start:%Y%m%dT%H}.kml.gz"


_kml_mem = {}      # window END -> KML text fetched in this process
_kml_failed = {}   # window END -> error of a failed fetch in this process (not retried within the run)
_run_cache_dir = None  # shadow forecasts: run_cache/<issue>/ = the radar hours as the champion of this hour saw them


def fetch_kml(end, fresh=False, timeout=KML_TIMEOUT_S, max_wait=SLOT_WAIT_S):
    """KML of the radar window [end-1h, end) (the request of fra.labels.fetch_hour, with its check=True test), holding
    a cross-process INAA slot (fra.labels.inaa_slot) but waiting at most `max_wait` s for one, and never touching the
    development cache. fresh=True bypasses this run's memory (re-checks)."""
    import fra.labels as L
    end = pd.Timestamp(end)
    if not fresh:
        if end in _kml_mem:
            return _kml_mem[end]
        if end in _kml_failed:
            raise RuntimeError(f"failed earlier in this run: {_kml_failed[end]}")
    slot = getattr(L, "inaa_slot", None)
    try:
        with (slot(max_wait=max_wait) if slot else contextlib.nullcontext()):
            r = requests.get(L.URL, params={"startTime": f"{end:%Y%m%dT%H%M%S}", "timeIntervalInHours": 1},
                             timeout=timeout, headers=UA)
            body = r.text  # body fully received while the slot is held
        r.raise_for_status()
        if "</kml>" not in body[-200:]:
            raise ValueError(f"incomplete KML ({len(body)} chars)")
    except Exception as ex:
        _kml_failed[end] = f"{type(ex).__name__}: {str(ex)[:100]}"
        raise
    _kml_mem[end] = body
    return body


def install_kml_cache():
    """Serve fra.labels.fetch_hour (used by fra.predict.flown_state, up to 9 hours back) from this run's fetches and
    the radar archive (complete hours); the newest, still incomplete hour is fetched live with fetch_kml (bounded slot
    wait, so a busy INAA lane costs at most ~SLOT_WAIT_S and flown_state falls back to the archived hours)."""
    import fra.labels as L
    if getattr(L.fetch_hour, "_archive_cache", False):
        return

    def fetch_hour(t, *a, **k):
        t = pd.Timestamp(t)
        if t in _kml_mem:
            return _kml_mem[t]
        if _run_cache_dir is not None:
            c = _run_cache_dir / f"{t:%Y%m%dT%H%M}.kml.gz"
            if c.exists():
                return gzip.decompress(c.read_bytes()).decode()
            if c.with_name(f"{t:%Y%m%dT%H%M}.failed").exists():
                raise RuntimeError("radar hour failed for the champion of this hour (not fetched again)")
        p = radar_path(t - pd.Timedelta(hours=1))
        if p.exists():
            return gzip.decompress(p.read_bytes()).decode()
        return fetch_kml(t)

    fetch_hour._archive_cache = True
    L.fetch_hour = fetch_hour


def append_counts(rows):
    """Append rows (hour start, west, east, rwy18_deps) to inaa_counts.csv with one O_APPEND write."""
    if not rows:
        return
    lines = "".join(f"{s.isoformat()},{w},{e},{d}\n" for s, w, e, d in rows)
    new = not COUNTS.exists() or COUNTS.stat().st_size == 0
    fd = os.open(COUNTS, os.O_WRONLY | os.O_APPEND | os.O_CREAT, 0o644)
    try:
        if new:
            lines = "time,west,east,rwy18_deps\n" + lines
        else:
            with open(COUNTS, "rb") as f:
                f.seek(-1, os.SEEK_END)
                if f.read(1) != b"\n":
                    lines = "\n" + lines
        os.write(fd, lines.encode())
    finally:
        os.close(fd)


# ---------------------------------------------------------------- 5. radar -> inaa_counts.csv + raw KML

def radar(now, hours=36, max_new=RADAR_MAX_NEW, budget_s=RADAR_BUDGET_S, recheck_max=RECHECK_MAX):
    from fra.labels import classify, load_counts
    t_end = time.monotonic() + max(0, budget_s)
    newest = (now - pd.Timedelta(minutes=LAG_MIN)).floor("h") - pd.Timedelta(hours=1)  # window ended >= lag ago
    starts = pd.date_range(max(newest - pd.Timedelta(hours=hours - 1), FORWARD_FROM), newest, freq="h")
    counts = load_counts()
    have = set(counts.index)
    todo = [s for s in starts if s not in have]  # oldest first: hours never drop out of the window unfetched
    added, skipped, errors, n_req, fails, stop = [], [], [], 0, 0, None
    for s in todo:
        if n_req >= max_new:
            stop = f"max {max_new} requests per run"
        elif time.monotonic() > t_end:
            stop = "time budget"
        elif fails >= RADAR_MAX_FAIL:
            stop = f"{fails} consecutive failures"
        if stop:
            break
        n_req += 1
        try:
            kml = fetch_kml(s + pd.Timedelta(hours=1))
            w, e, d = classify(kml)
            fails = 0
            local_h = s.tz_convert("Europe/Berlin").hour
            if w + e + d == 0 and 5 <= local_h <= 22:  # empty outside the night ban: not published yet -> retry
                skipped.append(iso(s))
                continue
            atomic_bytes(radar_path(s), gzip.compress(kml.encode(), 6))
            append_counts([(s, w, e, d)])
            added.append(dict(hour=iso(s), west=w, east=e, rwy18_deps=d))
        except Exception as ex:
            fails += 1
            errors.append(f"{iso(s)}: {str(ex)[:120]}")
        finally:
            time.sleep(INAA_PAUSE_S)
    pending = len(todo) - len(added) - len(skipped)
    rc = (recheck(now, counts, t_end, recheck_max) if fails < RADAR_MAX_FAIL and recheck_max > 0
          else dict(note="skipped (INAA failing or disabled)"))
    return dict(window=[iso(starts[0]), iso(starts[-1])], missing=len(todo), requests=n_req, appended=len(added),
                rows=added, skipped_empty=skipped, pending=pending, stopped=stop, errors=errors, recheck=rc,
                ok=not errors and not rc.get("errors"))


def _load_json(path, default):
    try:
        return json.loads(path.read_text())
    except (OSError, ValueError):
        return default


def recheck(now, counts, t_end, max_n=RECHECK_MAX):
    """Fetch every stored forward hour once more when its window ended >= RECHECK_AFTER_H ago. If the radar now holds
    MORE movements than stored, append a corrected row (load_counts keeps the last row of an hour) and replace the raw
    KML; fewer movements are only logged (publication only adds tracks; a smaller answer is a bad response)."""
    from fra.labels import classify
    state = _load_json(RECHECK, {})
    lo, hi = now - pd.Timedelta(hours=RECHECK_HORIZON_H), now - pd.Timedelta(hours=RECHECK_AFTER_H + 1)
    cand = [s for s in counts.index[(counts.index >= lo) & (counts.index <= hi)]
            if iso(s) not in state and radar_path(s).exists()]
    done, changed, errors, fails = 0, [], [], 0
    for s in cand[:max_n]:
        if time.monotonic() > t_end or fails >= RADAR_MAX_FAIL:
            break
        old = tuple(int(counts.at[s, c]) for c in ("west", "east", "rwy18_deps"))
        try:
            kml = fetch_kml(s + pd.Timedelta(hours=1), fresh=True)
            new = tuple(int(x) for x in classify(kml))
            fails = 0
        except Exception as ex:
            fails += 1
            errors.append(f"{iso(s)}: {str(ex)[:120]}")
            time.sleep(INAA_PAUSE_S)
            continue
        applied = new != old and sum(new[:2]) >= sum(old[:2])
        if applied:
            atomic_bytes(radar_path(s), gzip.compress(kml.encode(), 6))
            append_counts([(s, *new)])
        if new != old:
            changed.append(dict(hour=iso(s), stored=old, now=new, applied=applied))
        state[iso(s)] = dict(checked=iso(utc_now()), stored=old, now=new, applied=applied)
        done += 1
        time.sleep(INAA_PAUSE_S)
    if done:
        keep = (now - pd.Timedelta(days=30)).isoformat()
        state = {k: v for k, v in sorted(state.items()) if k >= keep}
        atomic_bytes(RECHECK, json.dumps(state, indent=0).encode())
    return dict(checked=done, pending=len(cand) - done, changed=changed, errors=errors)


# ---------------------------------------------------------------- 1. INAA prognosis as published

def parse_prognosis(js, asof):
    """Same parsing as fra.prognosis.fetch (kept here so the raw response is saved from a single request)."""
    from fra.prognosis import PERIOD
    rows = []
    for kind, frm, state, prob in PERIOD.findall(js["xmlContent"]):
        start = pd.to_datetime(frm, format="%a %b %d %H:%M:%S %z %Y").tz_convert("UTC")
        rows.append({"asof": asof, "kind": "main" if kind == "period" else "alt", "start": start,
                     "state": state, "prob": float(prob)})
    return rows


def prognosis_file(issue):
    return month_dir(PROG, issue) / f"{issue:%Y%m%dT%H%M}.json.gz"


def snapshot_rows(issue):
    """Prognosis rows as archived for `issue` by prognosis_snapshot (None if there is no snapshot)."""
    p = prognosis_file(issue)
    if not p.exists():
        return None
    try:
        rows = parse_prognosis(json.loads(gzip.decompress(p.read_bytes()))["response"], issue)
    except Exception:
        return None
    return rows or None


def prognosis_snapshot(issue, force=False):
    from fra.prognosis import URL
    path = prognosis_file(issue)
    if path.exists() and not force:
        return dict(ok=True, path=rel(path), note="exists")
    params = {"currentTime": f"{issue:%Y%m%dT%H%M%S}"}
    r = get(URL, params=params, timeout=45, tries=2)
    retrieved = utc_now()
    js = r.json()
    rows = parse_prognosis(js, issue)
    if not rows:
        raise ValueError("prognosis response without periods")
    save_json_gz(path, dict(asof=iso(issue), retrieved_utc=iso(retrieved), url=URL, params=params, response=js))
    new = pd.DataFrame(rows).assign(retrieved_utc=retrieved)
    old = pd.read_parquet(PROG_LIVE) if PROG_LIVE.exists() else None
    df = new if old is None else pd.concat([old, new], ignore_index=True)
    df = df.drop_duplicates(["asof", "kind", "start"], keep="last").sort_values(["asof", "kind", "start"])
    tmp = PROG_LIVE.with_name(f".{PROG_LIVE.name}.tmp")
    df.to_parquet(tmp, index=False)
    os.replace(tmp, PROG_LIVE)
    main_ = [x for x in rows if x["kind"] == "main"]
    return dict(ok=True, path=rel(path), retrieved=iso(retrieved), periods=len(rows),
                first_block=f"{iso(main_[0]['start'])} state {main_[0]['state']} p={main_[0]['prob']}" if main_ else None)


def no_prognosis(issue, leads):
    """fra.prognosis.features() output when no prognosis is available: no block -> prog_signed = 0 (as in training,
    where design() fills missing prognosis features with 0)."""
    leads = list(leads)
    return pd.DataFrame({"issue": issue, "lead": leads, "valid": [issue + pd.Timedelta(hours=L) for L in leads],
                         "prog_main_west": np.nan, "prog_main_prob": np.nan, "prog_age_h": np.nan,
                         "prog_alt_west": np.nan, "prog_alt_prob": np.nan, "prog_signed": 0.0, "prog_alt_signed": 0.0})


def patch_prognosis_live(info):
    """fra.predict.forecast() calls fra.prognosis.live(issue), an unguarded INAA request. Serve it from the snapshot
    step 1 just archived (the identical request); without one, fetch once, and if INAA fails issue without the
    prognosis (prog_* = no block) rather than lose the hour. The source used goes to info['prognosis_source']."""
    import fra.prognosis as P
    if getattr(P.live, "_archive_patch", False):
        P.live._info = info
        return

    def live(issue, leads):
        rows, src = snapshot_rows(issue), "archived snapshot (step 1)"
        if rows is None:
            try:
                rows, src = P.fetch(issue), "live fetch"
            except Exception as ex:
                rows, src = [], f"unavailable ({type(ex).__name__}: {str(ex)[:80]}): issued without prognosis"
        live._info["prognosis_source"] = src
        if rows:
            return P.features(pd.DatetimeIndex([issue]), leads, pd.DataFrame(rows))
        return no_prognosis(issue, leads)

    live._archive_patch, live._info = True, info
    P.live = live


# ---------------------------------------------------------------- 3. METAR

def metar_snapshot(issue, now, force=False):
    from fra.weather import metar
    path = month_dir(METAR, issue) / f"{issue:%Y%m%dT%H}.csv.gz"
    if path.exists() and not force:
        return dict(ok=True, path=rel(path), note="exists")
    m = metar(start=(now - pd.Timedelta(hours=6)).strftime("%Y-%m-%d"))
    retrieved = utc_now()
    m = m[(m.index > now - pd.Timedelta(hours=6)) & (m.index <= now)]
    if m.empty:
        raise ValueError("no METAR in the last 6 h")
    out = m.reset_index().assign(retrieved_utc=retrieved.isoformat())
    atomic_bytes(path, gzip.compress(out.to_csv(index=False).encode(), 6))
    last = m.iloc[-1]
    return dict(ok=True, path=rel(path), retrieved=iso(retrieved), n=len(m), latest=iso(m.index[-1]),
                latest_metar=str(last.get("metar", ""))[:120])


# ---------------------------------------------------------------- 4. Open-Meteo live forecasts

def om_meta(dataset):
    js = get(OM_META.format(dataset), timeout=30, tries=2).json()
    ts = lambda k: iso(pd.Timestamp(js[k], unit="s", tz="UTC")) if js.get(k) else None
    return dict(dataset=dataset, init=ts("last_run_initialisation_time"), available=ts("last_run_availability_time"),
                modified=ts("last_run_modification_time"), update_interval_s=js.get("update_interval_seconds"),
                temporal_resolution_s=js.get("temporal_resolution_seconds"))


def forecast_snapshot(name, issue, force=False):
    url, model, dataset, hourly, dedupe = OM_MODELS[name]
    d = FCST / name
    path = d / f"{issue:%Y%m%dT%H}.json.gz"
    if path.exists() and not force:
        return dict(ok=True, path=rel(path), note="exists")
    meta = None
    try:
        meta = om_meta(dataset)
    except Exception as ex:
        meta = dict(dataset=dataset, error=str(ex)[:120])
    state = d / "last_run.json"
    if dedupe and not force and meta.get("modified") and state.exists():
        last = json.loads(state.read_text())
        if last.get("modified") == meta["modified"]:
            return dict(ok=True, note=f"run {meta['init']} unchanged (saved in {last.get('file')})", init=meta["init"])
    params = dict(latitude=LAT, longitude=LON, models=model, hourly=",".join(hourly), wind_speed_unit="kn",
                  timezone="GMT", forecast_days=4)
    t0 = utc_now()
    js = get(url, params=params, timeout=60, tries=2).json()
    t1 = utc_now()
    if "hourly" not in js:
        raise ValueError(f"no hourly data: {str(js)[:120]}")
    save_json_gz(path, dict(model=name, retrieved_utc=iso(t1), request_start_utc=iso(t0), url=url, params=params,
                            run_meta=meta, response=js))
    if dedupe and meta.get("modified"):
        state.write_text(json.dumps(dict(modified=meta["modified"], init=meta["init"], file=path.name)))
    return dict(ok=True, path=rel(path), retrieved=iso(t1), init=meta.get("init"),
                hours=len(js["hourly"]["time"]), kb=round(path.stat().st_size / 1024, 1))


def latest_live_wind(issue, model="ecmwf_ifs"):
    """Hourly 10 m wind (wind_speed/wind_direction/wind_gusts, kt, valid-time index) from the newest archived live
    forecast of `model` filed under an hour <= `issue` (the job fetches it a few minutes after the issue hour)."""
    d = FCST / model
    if not d.exists():
        return None
    files = sorted(d.glob("*.json.gz"))
    files = [p for p in files if pd.to_datetime(p.name[:11], format="%Y%m%dT%H", utc=True) <= issue]
    if not files:
        return None
    rec = json.loads(gzip.decompress(files[-1].read_bytes()))
    df = pd.DataFrame(rec["response"]["hourly"])
    df["time"] = pd.to_datetime(df["time"], utc=True)
    df = df.set_index("time").rename(columns={"wind_speed_10m": "wind_speed", "wind_direction_10m": "wind_direction",
                                              "wind_gusts_10m": "wind_gusts"})
    df.attrs["init"] = (rec.get("run_meta") or {}).get("init")
    df.attrs["retrieved"] = rec.get("retrieved_utc")
    return df


# ---------------------------------------------------------------- 2. issue the operational forecast

def issued_path(issue):
    return ISSUED / f"forecast_{issue:%Y%m%dT%H}.csv"


def keep_model(path):
    """Content-addressed copy of a model file -> (sha256, archived path)."""
    sha = sha256(path)
    keep = MODELS / "sha256" / f"{sha}.pkl"
    if not keep.exists():
        keep.parent.mkdir(parents=True, exist_ok=True)
        tmp = keep.with_name(f".{keep.name}.{os.getpid()}.tmp")
        shutil.copy2(path, tmp)
        os.replace(tmp, keep)
    return sha, keep


# ---------------------------------------------------------------- variants (champion + challengers)

def artifact(p):
    """Path of a registry artifact (relative paths are relative to the repository root)."""
    p = Path(p)
    return p if p.is_absolute() else ROOT / p


def model_path(v):
    return artifact((v.get("models") or {}).get("model") or rel(PROD_MODEL))


def default_champion():
    return dict(name="production", role="champion", runtime=None, entry=DEFAULT_ENTRY, models={"model": rel(PROD_MODEL)})


def load_variants(path=REGISTRY):
    """Variant registry data/archive/variants.json -> (champion, [enabled challengers]):

        {"variants": [{"name": "logit-v1", "role": "champion", "runtime": "<tag>", "entry": "fra.predict:forecast",
                       "models": {"model": "data/archive/models/production/model.pkl"}},
                      {"name": "...", "role": "challenger", ...}]}

    name     letters, digits, '.', '_', '-'; also the folder of the shadow forecasts (issued_shadow/<name>/)
    role     champion (exactly one enabled): THE official forecast, issued in this process by the hourly job (the
             runtime in data/archive/runtime/current; ops.runtime promote sets its `runtime` tag) | challenger: a
             shadow forecast of the same hour, issued in its own runtime data/archive/runtime/<runtime>
    entry    'module:function', default fra.predict:forecast
    models   model artifacts (paths relative to the repository); models["model"] is the logit model fra.predict
             loads: a file named model.pkl, fra.predict.DATA is pointed at its folder during the call
    optional sha256 (prefix the model file must match, for frozen challengers), models_sha256 ({key: prefix} for the
             other artifacts, e.g. the decision bundle of a blend), enabled (default true), timeout_s (shadow time
             limit, default SHADOW_TIMEOUT_S), note

    Hook for other entries (e.g. a blend of the logit with a second model): the function is called with the keyword
    arguments it declares among `variant` (this dict) and `models` ({key: absolute Path}) and returns what
    fra.predict.forecast() returns, (out, issue, od_now, next_change), or only the `out` frame (48 rows, the same
    columns). It runs inside this process's patches (prognosis snapshot of the hour, archived / shared radar hours,
    feature capture), so a fra.predict.forecast() call inside it uses models["model"] and the same live inputs.
    Without a registry file the champion is the pinned production model."""
    try:
        reg = json.loads(Path(path).read_text())
    except FileNotFoundError:
        return default_champion(), []
    vs = [v for v in reg.get("variants", []) if v.get("enabled", True)]
    names = [str(v.get("name", "")) for v in vs]
    for n in names:
        if not re.match(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,47}$", n):
            raise ValueError(f"bad variant name {n!r} in {rel(path)}")
    if len(set(names)) != len(names):
        raise ValueError(f"duplicate variant names in {rel(path)}")
    champs = [v for v in vs if v.get("role") == "champion"]
    if len(champs) != 1:
        raise ValueError(f"{len(champs)} enabled champions in {rel(path)} (need exactly 1)")
    return champs[0], [v for v in vs if v.get("role") == "challenger"]


def load_variants_safe():
    """(champion, challengers, error): a broken registry never stops the official forecast (pinned production model)."""
    try:
        return (*load_variants(), None)
    except Exception as ex:
        return default_champion(), [], f"{type(ex).__name__}: {str(ex)[:200]}"


def runtime_dir(tag):
    """Code folder of a runtime tag: None = this process's runtime, 'current' = the promoted one."""
    if not tag:
        return ROOT
    return RUNTIME_DIR / tag


def shadow_path(name, issue):
    return ISSUED_SHADOW / name / f"forecast_{issue:%Y%m%dT%H}.csv"


def model_candidates(champ=None):
    """[(variant, role)] for the official forecast: the registry champion (normally the pinned production model
    data/archive/models/production/model.pkl with fra.predict), then the pinned production model if the champion is
    something else, then data/model.pkl as a flagged fallback (only used when the models before it cannot predict,
    e.g. after a feature change in the code)."""
    champ = champ or default_champion()
    name = champ.get("name", "production")
    plain = (champ.get("entry") or DEFAULT_ENTRY) == DEFAULT_ENTRY and model_path(champ) == PROD_MODEL
    out = []
    if model_path(champ).exists():
        out.append((champ, "production" if plain else f"champion {name}"))
        if (champ.get("entry") or DEFAULT_ENTRY) != DEFAULT_ENTRY:   # e.g. a blend whose entry cannot run: its own
            out.append((dict(name=name, entry=DEFAULT_ENTRY, models={"model": rel(model_path(champ))},  # logit part
                             **({"sha256": champ["sha256"]} if champ.get("sha256") else {})),
                        "fallback: champion logit (default entry)"))
    if not plain and PROD_MODEL.exists():
        out.append((dict(name=name, entry=DEFAULT_ENTRY, models={"model": rel(PROD_MODEL)}),
                    "fallback: pinned production model"))
    if MODEL.exists() and (not PROD_MODEL.exists() or sha256(MODEL) != sha256(PROD_MODEL)):
        out.append((dict(name=name, entry=DEFAULT_ENTRY, models={"model": rel(MODEL)}),
                    "fallback: data/model.pkl" if out else "data/model.pkl (no pinned production model)"))
    return out


def capture_predict(FP, cap):
    """Wrap fra.predict.predict (= fra.train.predict) to keep the exact feature frame the model was applied to."""
    orig = getattr(FP.predict, "_orig", FP.predict)

    def predict(m, d, tgt):
        cap["X"] = d
        p = orig(m, d, tgt)
        cap[tgt] = p
        return p

    predict._orig = orig
    FP.predict = predict


def cached_kml(end):
    """KML of the radar window [end-1h, end) if this process, this hour's run cache or the radar archive has it, else
    None (never fetches)."""
    end = pd.Timestamp(end)
    if end in _kml_mem:
        return _kml_mem[end]
    if _run_cache_dir is not None:
        c = _run_cache_dir / f"{end:%Y%m%dT%H%M}.kml.gz"
        if c.exists():
            return gzip.decompress(c.read_bytes()).decode()
    p = radar_path(end - pd.Timedelta(hours=1))
    return gzip.decompress(p.read_bytes()).decode() if p.exists() else None


def newest_hour(issue):
    """Counts of the newest radar hour [issue-1h, issue) as far as it was published when this run fetched it (from
    this run's fetches / the run cache only; None if it was not fetched)."""
    import fra.labels as L
    try:
        kml = cached_kml(issue)
        if kml is None:
            err = _kml_failed.get(pd.Timestamp(issue))
            return dict(hour_start=iso(issue - pd.Timedelta(hours=1)), west=None, east=None, rwy18_deps=None,
                        error=err or "not fetched")
        w, e, s = L.classify(kml)
        return dict(hour_start=iso(issue - pd.Timedelta(hours=1)), west=int(w), east=int(e), rwy18_deps=int(s),
                    error=None)
    except Exception as ex:
        return dict(hour_start=iso(issue - pd.Timedelta(hours=1)), error=f"{type(ex).__name__}: {str(ex)[:100]}")


def prefetch_newest_hour(issue):
    """Fetch the newest, partly published radar hour [issue-1h, issue) once in the official run (after the forecast).
    The current code does not use it (od_now comes from the last COMPLETE hour, fra.dataset.KNOWN_LAG_H), but (a) the
    issued .json records how much of it was published (newest_hour) and (b) challengers on an older runtime, whose
    od_now reads it, get it from run_cache/ exactly as this run saw it (fair pairs, no second request)."""
    install_kml_cache()
    try:
        fetch_kml(issue, timeout=45, max_wait=30)  # short: the official file is written after this
        return True
    except Exception as ex:
        print(f"newest radar hour not fetched: {type(ex).__name__}: {str(ex)[:120]}", flush=True)
        return False


def flown_detail(issue):
    """The flown state the forecast used, from fra.predict.flown_state(detail=True) (served from this run's radar
    fetches / the run cache / the archive, no new request for hours the forecast already read): the last complete hour
    [issue-2h, issue-1h), the hour the current OD was taken from, and the newest, partly published hour [issue-1h,
    issue) (not used by the forecast; recorded as published when this run fetched it)."""
    import fra.predict as FP
    out = {}
    if hasattr(FP, "flown_state"):
        try:
            f = FP.flown_state(issue, detail=True)
        except TypeError:  # older fra.predict without detail=
            f = None
        if isinstance(f, dict):
            out["rule"] = (f"od_now from the newest radar hour with >= 4 movements, starting at the last complete hour "
                           f"(issue - {f.get('lag_h')} h)")
            out["last_complete_hour"] = iso(f.get("last_complete_hour"))
            if f.get("od_hour") is not None:
                out["od_hour"] = dict(hour_start=iso(f["od_hour"]), hours_back=f.get("hours_back"), od=f.get("od_now"),
                                      west=f.get("west"), east=f.get("east"), rwy18_deps=f.get("rwy18_deps"))
            out["rwy18_now"] = None if pd.isna(f.get("rwy18_now")) else float(f["rwy18_now"])
            out["west_frac_now"] = f.get("west_frac_now")
    out["newest_hour"] = newest_hour(issue)
    return out


class BadForecast(ValueError):
    """The entry returned a frame that cannot be issued (treated like a model failure)."""


NEED_COLS = ["valid_utc", "lead_h", "p_od25", "p_rwy18_open", "od_pred", "rule_baseline_od", "od_now",
             "next_change_utc", "p_change_48h"]


def check_output(out):
    """48 hourly leads 1..48, P(OD 25) and P(RWY 18 open) finite in [0, 1], the columns of fra.predict.forecast()."""
    if not isinstance(out, pd.DataFrame):
        raise BadForecast(f"not a DataFrame: {type(out).__name__}")
    miss = [c for c in NEED_COLS if c not in out.columns]
    if miss:
        raise BadForecast(f"columns missing: {miss}")
    if [int(x) for x in out["lead_h"]] != list(range(1, H + 1)):
        raise BadForecast(f"leads {list(out['lead_h'])[:4]}... (need 1..{H})")
    for c in ("p_od25", "p_rwy18_open"):
        p = pd.to_numeric(out[c], errors="coerce").to_numpy(dtype=float)
        if not (np.isfinite(p).all() and (p >= 0).all() and (p <= 1).all()):
            raise BadForecast(f"{c} not finite in [0, 1]: {p[:4]}...")


def call_entry(v, FP):
    """Run the variant's entry -> (out, issue, od_now, next_change), checked with check_output."""
    entry = v.get("entry") or DEFAULT_ENTRY
    if entry == DEFAULT_ENTRY:
        res = FP.forecast()
    else:
        try:  # a broken entry (typo, module missing in the runtime, bad signature) is a model error, not transient:
            mod, _, fn = entry.partition(":")    # the next candidate is used at once instead of 4 retries of it
            f = getattr(importlib.import_module(mod), fn)
            params = inspect.signature(f).parameters
            kw = {}
            if "variant" in params:
                kw["variant"] = v
            if "models" in params:
                kw["models"] = {k: artifact(p) for k, p in (v.get("models") or {}).items()}
        except (ImportError, AttributeError, TypeError, ValueError) as ex:
            raise BadForecast(f"entry {entry}: {type(ex).__name__}: {str(ex)[:150]}") from ex
        res = f(**kw)
    if isinstance(res, pd.DataFrame):
        check_output(res)
        iss = pd.Timestamp(res["valid_utc"].iloc[0]) - pd.Timedelta(hours=int(res["lead_h"].iloc[0]))
        iss = iss.tz_localize("UTC") if iss.tzinfo is None else iss.tz_convert("UTC")
        nc = res["next_change_utc"].iloc[0]
        res = (res, iss, int(res["od_now"].iloc[0]), None if pd.isna(nc) else pd.Timestamp(nc))
    out, iss, od_now, change = res
    check_output(out)
    return out, pd.Timestamp(iss), od_now, change


def _clear_live_fetches():
    try:
        import fra.dataset as DS
        if hasattr(DS, "LIVE_FETCHES"):
            DS.LIVE_FETCHES.clear()
    except Exception:
        pass


def live_inputs():
    """NWP runs this forecast used (fra.dataset.LIVE_FETCHES: per model and user = logit / partb the run the as-of rule
    wanted, the run used, fallback), plus a summary: any fallback, and whether the logit and Part B used the same
    ECMWF run."""
    try:
        import fra.dataset as DS
        recs = [dict(r) for r in getattr(DS, "LIVE_FETCHES", [])]
    except Exception as ex:
        return dict(error=str(ex)[:120])
    ifs = {r.get("user"): r.get("used_init") for r in recs if r.get("model") == "ecmwf_ifs"}
    return dict(runs=recs, any_fallback=any(bool(r.get("fallback")) for r in recs),
                fallback_models=sorted({f"{r.get('model')}/{r.get('user')}" for r in recs if r.get("fallback")}),
                ifs_init_logit=ifs.get("logit"), ifs_init_partb=ifs.get("partb"),
                ifs_same_run=(ifs["logit"] == ifs["partb"]) if ("logit" in ifs and "partb" in ifs) else None)


def run_forecast(issue, cands, attempts=4, wait_s=60, keep=True):
    """Forecast `issue` with the first working candidate [(variant, role)] on this hour's live inputs (nothing is
    written here). An hour that fails is never issued later, so: retry after a transient error (wait_s); if the inputs
    were built but the model / entry failed (or returned an invalid frame), switch to the next candidate at once; redo
    if the model file changed during the run. keep: archive the model content-addressed (models/sha256/)."""
    install_kml_cache()
    info = {}
    patch_prognosis_live(info)
    import fra.predict as FP
    cap = {}
    capture_predict(FP, cap)
    data0 = FP.DATA  # in live mode fra.predict uses DATA only for model.pkl -> point it at the chosen model's folder
    k, fails, out = 0, [], None
    try:
        for attempt in range(attempts):
            v, role = cands[k]
            mpath = model_path(v)
            cap.clear()
            _clear_live_fetches()
            t0 = utc_now()
            try:
                sha0, kept = keep_model(mpath) if keep else (sha256(mpath), mpath)
                if v.get("sha256") and not sha0.startswith(str(v["sha256"])):
                    raise BadForecast(f"{rel(mpath)} has sha256 {sha0[:12]}, the registry pins {str(v['sha256'])[:12]}")
                for key, pin in (v.get("models_sha256") or {}).items():  # pins of the other artifacts (e.g. decision)
                    ap = artifact((v.get("models") or {}).get(key, ""))
                    got = sha256(ap) if ap.is_file() else "missing"
                    if not got.startswith(str(pin)):
                        raise BadForecast(f"{rel(ap)} has sha256 {got[:12]}, the registry pins {str(pin)[:12]}")
                FP.DATA = mpath.parent
                out, iss, od_now, change = call_entry(v, FP)
            except Exception as ex:
                out = None
                model_err = "X" in cap or isinstance(ex, BadForecast)  # features were built: model / entry failed
                fails.append(f"{role}: {type(ex).__name__}: {str(ex)[:150]}")
                print(f"forecast failed with {role} ({fails[-1]}), retrying", flush=True)
                if utc_now().floor("h") != issue or attempt == attempts - 1:
                    raise
                if model_err and k + 1 < len(cands):
                    k += 1
                else:
                    time.sleep(wait_s)
                continue
            t1 = utc_now()
            if sha256(mpath) == sha0:
                break
            out = None
        if out is None:
            raise RuntimeError(f"model file kept changing during the forecast: {fails}")
    finally:
        FP.DATA = data0
    return dict(out=out, issue=pd.Timestamp(iss), od_now=od_now, change=change, X=cap.get("X"), sha=sha0, kept=kept,
                mpath=mpath, role=role, variant=v, t0=t0, t1=t1, fails=fails, info=info)


def write_forecast(res, path, code, sources, extra=None):
    """Write a forecast of run_forecast: <path>.csv (48 h forecast + issue_utc, model_sha256, retrieval window),
    .features.parquet (the exact feature frame) and .json (metadata)."""
    issue, role, mpath, change, od_now = res["issue"], res["role"], res["mpath"], res["change"], res["od_now"]
    t0, t1, sha0 = res["t0"], res["t1"], res["sha"]
    out = res["out"].copy()
    out.insert(0, "issue_utc", iso(issue))
    out["model_sha256"] = sha0
    out["retrieved_start_utc"], out["retrieved_end_utc"] = iso(t0), iso(t1)
    path.parent.mkdir(parents=True, exist_ok=True)
    feats = path.with_name(path.stem + ".features.parquet")
    try:
        X = res["X"].copy()
        for c in X.columns[X.dtypes == object]:
            X[c] = X[c].astype(str)
        tmp = feats.with_name(f".{feats.name}.{os.getpid()}.tmp")
        X.to_parquet(tmp)
        os.replace(tmp, feats)
    except Exception as ex:
        print(f"feature frame not saved: {ex}", flush=True)
        feats = None
    try:
        flown = flown_detail(issue)
    except Exception as ex:
        flown = dict(error=str(ex)[:120])
    inputs = live_inputs()
    atomic_bytes(path, out.to_csv(index=False).encode())
    first = out.iloc[0]
    pinfo = _load_json(PROD_INFO, {}) if role == "production" else {}
    meta = dict(issue_utc=iso(issue), file=path.name, model_role=role, model_sha256=sha0,
                model_file=rel(res["kept"]), model_promoted_utc=pinfo.get("promoted_utc"),
                model_mtime_utc=iso(pd.Timestamp(mpath.stat().st_mtime, unit="s", tz="UTC")),
                features_file=feats.name if feats else None,
                code_sha256=code[0] if code else None, code_manifest=rel(code[1]) if code else None,
                code_version=code_version(), retrieved_start_utc=iso(t0), retrieved_end_utc=iso(t1), od_now=int(od_now),
                flown_state=flown, live_inputs=inputs, prognosis_source=res["info"].get("prognosis_source"),
                failed_attempts=res["fails"],
                next_change_utc=iso(change), p_change_48h=float(first["p_change_48h"]),
                note=("probabilities = the archived model applied to the archived feature frame (exactly reproducible "
                      "with the archived code; for a blend entry the logit part, see blend). The entry fetched its own "
                      "live inputs inside the retrieval window: METAR (IEM), ECMWF IFS / ICON-D2 / ICON-EU (Open-Meteo; "
                      "the code of the runtime decides between exact single runs and the live forecast), flown OD "
                      "from the INAA radar hours (flown_state); the INAA prognosis is the archived snapshot of this "
                      "issue hour (see prognosis_source)"),
                **(extra or {}), archived_sources=sources)
    if "blend_ok" in out.columns:
        meta["blend"] = res["out"].attrs.get("blend") or dict(status=str(out["blend_status"].iloc[0]))
    atomic_bytes(path.with_suffix(".json"), json.dumps(meta, indent=1, default=str).encode())
    return dict(ok=True, path=rel(path), new=True, model_role=role, od_now=int(od_now),
                next_change=iso(change), p_change_48h=float(first["p_change_48h"]), p25_lead1=float(first["p_od25"]),
                p25_lead24=float(out["p_od25"].iloc[23]), min_p18_24h=float(out["p_rwy18_open"].iloc[:24].min()),
                model_sha256=sha0[:12], prognosis=res["info"].get("prognosis_source"),
                newest_radar_hour=flown.get("newest_hour"), od_hour=flown.get("od_hour"),
                nwp=dict(fallback=inputs.get("fallback_models"), ifs_logit=inputs.get("ifs_init_logit"),
                         ifs_partb=inputs.get("ifs_init_partb")),
                seconds=round((t1 - t0).total_seconds(), 1),
                **({"blend_ok": bool(out["blend_ok"].iloc[0]), "blend_status": str(out["blend_status"].iloc[0])[:200],
                    "p25_lead24_logit": float(out["p_od25_logit"].iloc[23])} if "blend_ok" in out.columns else {}))


def dump_run_cache(issue):
    """Radar hours this process fetched live (not in the radar archive) -> data/archive/run_cache/<issue>/, plus a
    marker for hours whose fetch failed: the shadow forecasts of this hour see the newest, partly published radar hour
    exactly as the champion saw it (FANOMOS keeps publishing during the hour). Folders older than 2 days are pruned."""
    d = RUN_CACHE / f"{issue:%Y%m%dT%H}"
    for end, kml in list(_kml_mem.items()):
        if not radar_path(end - pd.Timedelta(hours=1)).exists():
            atomic_bytes(d / f"{end:%Y%m%dT%H%M}.kml.gz", gzip.compress(kml.encode(), 6))
    for end, err in list(_kml_failed.items()):
        atomic_bytes(d / f"{end:%Y%m%dT%H%M}.failed", str(err).encode())
    keep = f"{issue - pd.Timedelta(days=2):%Y%m%dT%H}"
    for old in RUN_CACHE.glob("*"):
        if old.is_dir() and old.name < keep:
            shutil.rmtree(old, ignore_errors=True)


def issue_forecast(now, sources, code=None, force=False, champ=None):
    """The OFFICIAL forecast of this hour: the registry champion (pinned production model), in this process."""
    issue = now.floor("h")
    path = issued_path(issue)
    if path.exists() and not force:
        return dict(ok=True, path=rel(path), note="exists", new=False)
    champ = champ or load_variants_safe()[0]
    cands = model_candidates(champ)
    if not cands:
        raise FileNotFoundError(f"{PROD_MODEL} / {MODEL}")
    res = run_forecast(issue, cands)
    if res["issue"] != issue:  # the hour rolled over during the run: file it under the issue the model actually used
        issue, path = res["issue"], issued_path(res["issue"])
    prefetch_newest_hour(issue)  # for the record and for challengers on an older runtime (run cache)
    try:
        dump_run_cache(issue)
    except Exception as ex:
        print(f"run cache not written: {ex}", flush=True)
    rt = runtime_info()
    extra = dict(variant=champ.get("name"), variant_role="champion",
                 entry=res["variant"].get("entry") or DEFAULT_ENTRY, runtime=rt)
    r = write_forecast(res, path, code, sources, extra)
    if res["role"] not in ("production", f"champion {champ.get('name')}"):
        r["warning"] = f"not issued with the registered champion: {res['role']}"
    r.update(variant=champ.get("name"), runtime=rt.get("tag"))
    return r


def shadow_forecasts(issue, challengers, budget_s=SHADOW_BUDGET_S):
    """Every enabled challenger issues `issue` as a shadow forecast, each in its own runtime and process
    (`python -m fra.archive --shadow NAME --issue ISO`, cwd = data/archive/runtime/<tag>), with a time limit: a failing
    or hanging challenger never touches the official forecast. Already issued shadows are skipped, and so is every
    shadow once the official forecast of the hour was issued more than SHADOW_MAX_LAG_MIN ago (a manual re-run late
    in the hour would see newer radar / weather inputs than the champion: not a fair pair)."""
    t_end = time.monotonic() + max(0, budget_s)
    off = _load_json(issued_path(issue).with_suffix(".json"), {}).get("retrieved_end_utc")
    lag = (utc_now() - pd.Timestamp(off)).total_seconds() / 60 if off else None
    res = {}
    for v in challengers:
        name = v["name"]
        path = shadow_path(name, issue)
        if path.exists():
            res[name] = dict(ok=True, path=rel(path), note="exists", new=False)
            continue
        if lag is not None and lag > SHADOW_MAX_LAG_MIN:
            res[name] = dict(ok=True, new=False, note=f"skipped: the official forecast of this hour was issued "
                                                      f"{lag:.0f} min ago (> {SHADOW_MAX_LAG_MIN} min)")
            continue
        left = t_end - time.monotonic()
        if left < 30:
            res[name] = dict(ok=False, error="skipped: shadow time budget used up")
            continue
        rdir = runtime_dir(v.get("runtime"))
        t = time.monotonic()
        try:
            if not (rdir / "fra" / "archive.py").exists():
                raise FileNotFoundError(f"runtime {v.get('runtime')} not found ({rdir})")
            r = subprocess.run([sys.executable, "-m", "fra.archive", "--shadow", name, "--issue", iso(issue)], cwd=rdir,
                               capture_output=True, text=True, timeout=min(float(v.get("timeout_s", SHADOW_TIMEOUT_S)), left))
            got = [ln for ln in r.stdout.splitlines() if ln.startswith("SHADOW_RESULT ")]
            x = (json.loads(got[-1][len("SHADOW_RESULT "):]) if got else
                 dict(ok=False, error=f"exit {r.returncode}: {(r.stderr or r.stdout)[-300:]}"))
        except subprocess.TimeoutExpired:
            x = dict(ok=False, error="timeout: killed")
        except Exception as ex:
            x = dict(ok=False, error=f"{type(ex).__name__}: {str(ex)[:200]}")
        x.update(runtime=v.get("runtime"), s=round(time.monotonic() - t, 1))
        res[name] = x
    return dict(ok=all(x.get("ok") for x in res.values()), variants=res)


def shadow_main(name, issue_s):
    """Child process of shadow_forecasts: issue challenger `name` for the CURRENT hour `issue_s` (never backfilled)
    -> data/archive/issued_shadow/<name>/forecast_YYYYMMDDTHH.csv/.json/.features.parquet. Prints SHADOW_RESULT."""
    global _run_cache_dir
    try:
        issue = pd.Timestamp(issue_s)
        issue = issue.tz_localize("UTC") if issue.tzinfo is None else issue.tz_convert("UTC")
        if utc_now().floor("h") != issue:
            raise RuntimeError(f"issue hour {iso(issue)} is not the current hour: shadows are never backfilled")
        champ, chall = load_variants()
        v = next((x for x in chall if x["name"] == name), None)
        if v is None:
            raise KeyError(f"no enabled challenger {name!r} in {rel(REGISTRY)}")
        path = shadow_path(name, issue)
        if path.exists():
            result = dict(ok=True, path=rel(path), note="exists", new=False)
        else:
            _run_cache_dir = RUN_CACHE / f"{issue:%Y%m%dT%H}"
            try:
                code = code_snapshot()
            except Exception:
                code = None
            res = run_forecast(issue, [(v, f"shadow {name}")], attempts=2, wait_s=15)
            if res["issue"] != issue:
                raise RuntimeError("the hour rolled over during the shadow forecast: not filed")
            off = _load_json(issued_path(issue).with_suffix(".json"), {})
            extra = dict(variant=name, variant_role="challenger", entry=v.get("entry") or DEFAULT_ENTRY,
                         runtime=runtime_info(), champion_variant=champ.get("name"), official_file=off.get("file"),
                         radar_shared_with_champion=_run_cache_dir.exists())
            result = write_forecast(res, path, code, off.get("archived_sources") or {}, extra)
    except Exception as ex:
        traceback.print_exc()
        result = dict(ok=False, error=f"{type(ex).__name__}: {str(ex)[:300]}")
    print("SHADOW_RESULT " + json.dumps(result, default=str), flush=True)
    return 0 if result.get("ok") else 1


def smoke_main(names):
    """Forecast the current hour for the named variants with this runtime's code and print SMOKE_RESULT; writes no
    official output (no issued / shadow files, no model archive copy)."""
    issue = utc_now().floor("h")
    champ, chall = load_variants()
    allv = {v["name"]: v for v in [champ, *chall]}
    res = {}
    for n in names:
        t = time.monotonic()
        try:
            v = allv[n]
            r = run_forecast(issue, [(v, f"smoke {n}")], attempts=1, keep=False)
            o = r["out"]
            res[n] = dict(ok=True, issue=iso(r["issue"]), leads=int(len(o)), od_now=int(r["od_now"]),
                          p_od25=[float(o["p_od25"].min()), float(o["p_od25"].max())],
                          p_rwy18_open=[float(o["p_rwy18_open"].min()), float(o["p_rwy18_open"].max())],
                          p25_lead1=float(o["p_od25"].iloc[0]), p25_lead24=float(o["p_od25"].iloc[23]),
                          model_sha256=r["sha"][:12], model=rel(r["mpath"]), entry=v.get("entry") or DEFAULT_ENTRY,
                          prognosis=r["info"].get("prognosis_source"), next_change=iso(r["change"]))
        except Exception as ex:
            traceback.print_exc()
            res[n] = dict(ok=False, error=f"{type(ex).__name__}: {str(ex)[:300]}")
        res[n]["s"] = round(time.monotonic() - t, 1)
    print("SMOKE_RESULT " + json.dumps(res, default=str), flush=True)
    return 0 if res and all(x["ok"] for x in res.values()) else 1


def add_sources(log):
    """Record the snapshots of this run (metar, forecasts, after the issue) in the issued forecast's .json."""
    res = log.get("issue") or {}
    if not res.get("new"):
        return
    p = (ROOT / res["path"]).with_suffix(".json")
    try:
        meta = json.loads(p.read_text())
        meta["archived_sources"] = {k: {kk: v.get(kk) for kk in ("path", "retrieved", "init", "note", "error")
                                        if v.get(kk)} for k, v in log.items() if k not in ("radar", "issue", "site", "shadow")}
        atomic_bytes(p, json.dumps(meta, indent=1, default=str).encode())
    except Exception as ex:
        print(f"could not add sources to {p.name}: {ex}", flush=True)


def newest_issued():
    files = sorted(ISSUED.glob("forecast_*.csv"))
    return files[-1] if files else None


# ---------------------------------------------------------------- 6. site

def rebuild_site(path, force=False):
    idx = SITE / "index.html"
    if not force and idx.exists() and idx.stat().st_mtime >= path.stat().st_mtime:
        return dict(ok=True, note="site up to date")
    r = subprocess.run([sys.executable, "-m", "fra.dashboard", str(path)], cwd=ROOT, capture_output=True, text=True,
                       timeout=900)
    if r.returncode != 0:
        raise RuntimeError(f"fra.dashboard exit {r.returncode}: {(r.stderr or r.stdout)[-400:]}")
    return dict(ok=True, out=r.stdout.strip().splitlines()[-3:])


# ---------------------------------------------------------------- run record: environment, registry, pre-registration

PACKAGES = ("numpy", "pandas", "scikit-learn", "lightgbm", "pyarrow", "requests", "scipy")
PREREG = ROOT / "experiments" / "integration" / "preregistration.json"


def env_info():
    """Python + versions of the packages the models depend on (the virtual environment is shared with the working
    tree: a change shows up here and in the smoke test, ops/runtime.py)."""
    import platform
    from importlib import metadata
    out = dict(python=platform.python_version(), executable=sys.executable)
    for n in PACKAGES:
        try:
            out[n] = metadata.version(n)
        except Exception:
            out[n] = None
    return out


def registry_sha():
    try:
        return sha256(REGISTRY)[:12]
    except OSError:
        return None


def prereg_check(champ, challengers):
    """Per variant: does the runtime it runs from hold exactly the forecast-module sha256 registered in
    experiments/integration/preregistration.json? (A scoring-only snapshot must keep them; ops/runtime.py promote
    refuses otherwise during the holdout.) {variant: dict(ok, runtime, registered_runtime, differ=[files])}."""
    try:
        pre = json.loads(PREREG.read_text())
    except (OSError, ValueError):
        return dict(error="no preregistration.json")
    reg = {v["name"]: v for v in pre.get("variants", [])}
    out = {}
    for v in [champ, *challengers]:
        n = v.get("name")
        if n not in reg:
            out[n] = dict(ok=None, note="not pre-registered")
            continue
        want = (reg[n].get("runtime") or {}).get("forecast_modules_sha256") or {}
        try:
            man = json.loads(((ROOT if v is champ else runtime_dir(v.get("runtime"))) / "RUNTIME.json").read_text())
            have = man.get("files") or {}
            tag = man.get("tag")
        except (OSError, ValueError):
            have, tag = {}, None
        differ = sorted(k for k, s in want.items() if have.get(k) != s)
        out[n] = dict(ok=not differ, runtime=tag, registered_runtime=(reg[n].get("runtime") or {}).get("tag"),
                      **({"differ": differ} if differ else {}))
    return out


# ---------------------------------------------------------------- main

def step(log, name, fn, *a, **k):
    t = time.monotonic()
    try:
        res = fn(*a, **k)
    except Exception as ex:
        res = dict(ok=False, error=f"{type(ex).__name__}: {str(ex)[:300]}")
        traceback.print_exc()
    res["s"] = round(time.monotonic() - t, 1)
    log[name] = res
    flag = "ok " if res.get("ok") else "ERR"
    brief = {k: v for k, v in res.items() if k not in ("rows", "ok", "s")}
    print(f"[{flag}] {name:10s} {res['s']:6.1f}s {json.dumps(brief, default=str)[:400]}", flush=True)
    return res


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--hours", type=int, default=36, help="radar lookback (hours)")
    ap.add_argument("--radar-max", type=int, default=RADAR_MAX_NEW, help="max new radar requests in this run")
    ap.add_argument("--recheck-max", type=int, default=RECHECK_MAX, help="max radar re-checks in this run")
    ap.add_argument("--force", action="store_true", help="re-issue / re-save this hour even if files exist")
    ap.add_argument("--skip", default="",
                    help="comma list of steps to skip: radar,prognosis,metar,forecasts,issue,shadow,site")
    ap.add_argument("--no-site", action="store_true")
    ap.add_argument("--shadow", metavar="NAME", help="issue challenger NAME for --issue (child of the hourly job)")
    ap.add_argument("--issue", help="issue hour (ISO, UTC) for --shadow: must be the current hour")
    ap.add_argument("--smoke", metavar="NAMES", help="comma list of variants: forecast the current hour, write nothing")
    a = ap.parse_args(argv)
    if a.smoke:
        return smoke_main([n for n in a.smoke.split(",") if n])
    if a.shadow:
        return shadow_main(a.shadow, a.issue or iso(utc_now().floor("h")))
    skip = set(filter(None, a.skip.split(",")))
    ARCHIVE.mkdir(parents=True, exist_ok=True)
    lock = open(ARCHIVE / ".archive.lock", "w")
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        print("another fra.archive run holds the lock; exiting", flush=True)
        return 0
    t_start = time.monotonic()
    left = lambda: RUN_BUDGET_S - (time.monotonic() - t_start)
    now = utc_now()
    issue = now.floor("h")
    print(f"fra.archive run {iso(now)} (issue hour {iso(issue)})", flush=True)
    try:
        code = code_snapshot()  # before fra.predict & co. are imported: the source this run executes
    except Exception as ex:
        print(f"code snapshot failed: {ex}", flush=True)
        code = None
    champ, challengers, reg_err = load_variants_safe()
    rt = runtime_info()
    if reg_err:
        print(f"variant registry unusable ({reg_err}): issuing the pinned production model, no shadows", flush=True)
    if champ.get("runtime") and champ["runtime"] != rt["tag"]:
        rt["warning"] = f"champion {champ['name']} is registered for runtime {champ['runtime']}, this run is {rt['tag']}"
        print(rt["warning"], flush=True)
    log = {}
    if "prognosis" not in skip:
        step(log, "prognosis", prognosis_snapshot, issue, a.force)
    if "issue" not in skip:
        sources = {k: {kk: v.get(kk) for kk in ("path", "retrieved", "note", "error") if v.get(kk)} for k, v in log.items()}
        step(log, "issue", issue_forecast, now, sources, code, a.force, champ)
    for name, fn, args in ([("metar", metar_snapshot, (issue, now, a.force))] if "metar" not in skip else []) + (
            [(f"om_{m}", forecast_snapshot, (m, issue, a.force)) for m in OM_MODELS] if "forecasts" not in skip else []):
        if left() < 0:
            log[name] = dict(ok=False, error="skipped: run time budget used up")
            continue
        step(log, name, fn, *args)
    add_sources(log)
    if "shadow" not in skip and challengers:
        if left() < 0:
            log["shadow"] = dict(ok=False, error="skipped: run time budget used up")
        else:
            step(log, "shadow", shadow_forecasts, issue, challengers, min(SHADOW_BUDGET_S, left()))
    if "radar" not in skip:
        step(log, "radar", radar, now, a.hours, a.radar_max, min(RADAR_BUDGET_S, left()), a.recheck_max)
    if "site" not in skip and not a.no_site:
        p = newest_issued()
        if p is not None:
            step(log, "site", rebuild_site, p, bool(log.get("issue", {}).get("new")))
    failed = [k for k, v in log.items() if not v.get("ok")]
    try:
        pc = prereg_check(champ, challengers)
    except Exception as ex:
        pc = dict(error=f"{type(ex).__name__}: {str(ex)[:120]}")
    bad = sorted(n for n, x in pc.items() if isinstance(x, dict) and x.get("ok") is False)
    if bad:
        print(f"WARNING: forecast code differs from the pre-registration for {bad}", flush=True)
    try:
        env = env_info()
    except Exception as ex:
        env = dict(error=str(ex)[:120])
    rec = dict(run_utc=iso(now), issue_utc=iso(issue), failed=failed, code=code[0][:16] if code else None,
               runtime=rt, env=env, prereg=dict(variants=pc, mismatch=bad),
               variants=dict(champion=champ.get("name"), challengers=[v["name"] for v in challengers],
                             registry_error=reg_err, registry_sha256=registry_sha()),
               duration_s=round((utc_now() - now).total_seconds(), 1), steps=log)
    with open(RUNLOG, "a") as f:
        f.write(json.dumps(rec, default=str) + "\n")
    print(f"done in {rec['duration_s']} s; failed steps: {failed or 'none'}", flush=True)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
