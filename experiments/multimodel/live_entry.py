"""NOT REGISTERED (study did not clearly win, see REPORT.md). Candidate shadow variant blend-mm: blend-v2 with a multi-model wind centre (experiments/multimodel/, PLAN.json).

What changes against fra.blend.forecast (everything else is the champion's code path, unchanged):
  * logit: tw25_cons / tw25_cons_roll6 = mean(ECMWF IFS, non-IFS mean) instead of mean(IFS, ICON-D2/EU);
  * Part B: the 'icon' slot of the forecast frame and of the analogue library = the non-IFS mean, so the path centre is
    C = 0.5 IFS + 0.5 non-IFS mean and the spread term is |IFS - non-IFS mean|.
Non-IFS members: ICON-D2 filled by ICON-EU (one member, as in production) and AIFS, UKMO 10 km, KNMI and DMI
HARMONIE-AROME, Meteo-France AROME HD and ARPEGE, GFS. Each as of its own publication buffer: the newest init on the
archived cycles with init <= issue - buffer, used only if issue - init <= buffer + 12 h, values for valid issue + L,
L = -3 .. 50 (NaN where the run has no such lead); a member missing at a lead drops out of the mean there.

Historical issues read frozen copies of the run archives (registry models.multimodel = MANIFEST.json, sha256-checked);
a current issue requests exactly that run from the Open-Meteo single-runs API (one cycle earlier if it is not served),
as the archive rule would have picked it. Entry for the variant registry: fra.multimodel:forecast.
"""
from __future__ import annotations

import hashlib
import json
import time
import warnings
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
LMIN, LMAX = -3, 50
NOFF = LMAX - LMIN + 1
STALE_EXTRA_H = 12
LIVE_BUDGET_S = 60           # all live member requests together (parallel); the shadow time limit is 240 s
LIVE_PARALLEL = 3            # Open-Meteo answers bursts of ~10 parallel requests with HTTP 429 (seen 2026-11-05)
HOUR = pd.Timedelta(hours=1)
NAMES = {"wind_speed_10m": "wind_speed", "wind_direction_10m": "wind_direction", "wind_gusts_10m": "wind_gusts"}
# key -> (Open-Meteo model, archived cycle step h, buffer h, max run lead kept, archive file name)
MEMBERS = {
    "d2": ("icon_d2", 3, 4, 48, "icon_runs.parquet"),
    "eu": ("icon_eu", 6, 5, 120, "iconeu_runs.parquet"),
    "aifs": ("ecmwf_aifs025_single", 6, 7, 54, "aifs_runs.parquet"),
    "ukmo": ("ukmo_global_deterministic_10km", 6, 10, 54, "ukmo_runs.parquet"),
    "knmi": ("knmi_harmonie_arome_europe", 3, 4, 54, "knmi_runs.parquet"),
    "dmi": ("dmi_harmonie_arome_europe", 3, 4, 54, "dmi_runs.parquet"),
    "arome": ("meteofrance_arome_france_hd", 3, 5, 54, "arome_runs.parquet"),
    "arpege": ("meteofrance_arpege_europe", 6, 5, 54, "arpege_runs.parquet"),
    "gfs": ("gfs_global", 6, 10, 54, "gfs_runs.parquet"),
}
FILES = [m[4] for m in MEMBERS.values()]
_FOLDER = {"path": None}
_LIVE = {}


def _hours(t):
    t = pd.DatetimeIndex(t)
    t = t.tz_localize("UTC") if t.tz is None else t.tz_convert("UTC")
    return np.asarray((t - pd.Timestamp("1970-01-01", tz="UTC")) // HOUR, dtype=np.int64)


def _uv(speed, direction):
    from fra.fcerror import uv_from_sd
    return uv_from_sd(np.asarray(speed, float), np.asarray(direction, float))


def use_files(manifest) -> dict:
    """Frozen run archives (folder with FILES + MANIFEST.json {"files": {name: sha256}}); a mismatch raises."""
    man_path = Path(manifest)
    man_path = man_path / "MANIFEST.json" if man_path.is_dir() else man_path
    man_bytes = man_path.read_bytes()
    man = json.loads(man_bytes)
    sig = {}
    for name in FILES:
        got = hashlib.sha256((man_path.parent / name).read_bytes()).hexdigest()
        if got != man["files"][name]:
            raise RuntimeError(f"frozen multimodel file {name}: sha256 {got[:12]} != manifest {man['files'][name][:12]}")
        sig[name] = got[:12]
    _FOLDER["path"] = man_path.parent
    _cubes.cache.clear()
    sig["manifest"] = hashlib.sha256(man_bytes).hexdigest()[:12]
    return sig


def _file(name):
    if _FOLDER["path"] is not None:
        return _FOLDER["path"] / name
    return ROOT / "data" / (name if name in ("icon_runs.parquet", "iconeu_runs.parquet") else f"multimodel/{name}")


def _cube_from_runs(runs, max_lead):
    runs = runs[(runs["lead_h"] >= 0) & (runs["lead_h"] <= max_lead)]
    inits = pd.DatetimeIndex(np.sort(pd.to_datetime(runs["init"], utc=True).unique()))
    ii = inits.get_indexer(pd.to_datetime(runs["init"], utc=True))
    ll = runs["lead_h"].to_numpy().astype(int)
    u, v = _uv(runs["wind_speed"], runs["wind_direction"])
    cube = np.full((len(inits), max_lead + 1, 3), np.nan)
    cube[ii, ll, 0], cube[ii, ll, 1] = u, v
    cube[ii, ll, 2] = runs["wind_gusts"].to_numpy(float)
    return _hours(inits), cube


def _cubes():
    if not _cubes.cache:
        for k, (_, _, _, max_lead, fname) in MEMBERS.items():
            r = pd.read_parquet(_file(fname), columns=["init", "valid", "lead_h", *NAMES.values()])
            _cubes.cache[k] = _cube_from_runs(r, max_lead)
    return _cubes.cache


_cubes.cache = {}


def _asof(ih, cube, issue_h, buffer_h, max_lead):
    k = np.searchsorted(ih, issue_h - buffer_h, side="right") - 1
    ok = k >= 0
    off = issue_h - ih[np.clip(k, 0, None)]
    ok &= off <= buffer_h + STALE_EXTRA_H
    idx = off[:, None] + np.arange(LMIN, LMAX + 1)[None, :]
    inl = ok[:, None] & (idx >= 0) & (idx <= max_lead)
    out = cube[np.clip(k, 0, None)[:, None], np.clip(idx, 0, max_lead), :]
    return np.where(inl[..., None], out, np.nan)


def hist_members(issue_h) -> dict:
    """{member: [n, NOFF, 3]} from the run archives; 'd2eu' = ICON-D2 filled by ICON-EU."""
    issue_h = np.asarray(issue_h, np.int64)
    c = _cubes()
    raw = {k: _asof(*c[k], issue_h, MEMBERS[k][2], MEMBERS[k][3]) for k in MEMBERS}
    out = {"d2eu": np.where(np.isnan(raw["d2"][..., :1]), raw["eu"], raw["d2"])}
    out.update({k: v for k, v in raw.items() if k not in ("d2", "eu")})
    return out


def _live_run(key, issue, timeout=(5, 20)):
    """The run the archive rule picks for a current issue (one cycle earlier if not served) -> ([NOFF, 3], info)."""
    import requests
    from fra.singleruns import SINGLE
    model, cyc, buf, max_lead, _ = MEMBERS[key]
    want = (issue - pd.Timedelta(hours=buf)).floor(f"{cyc}h")
    errors = []
    for k in range(2):
        init = want - pd.Timedelta(hours=k * cyc)
        if issue - init > pd.Timedelta(hours=buf + STALE_EXTRA_H):
            break
        try:
            params = dict(latitude=50.0333, longitude=8.5706, models=model, timezone="GMT", wind_speed_unit="kn",
                          hourly=",".join(NAMES), run=init.strftime("%Y-%m-%dT%H:%M"))
            r = requests.get(SINGLE, params=params, timeout=timeout)
            if r.status_code == 429:                  # burst limit: one retry after a short pause
                time.sleep(3)
                r = requests.get(SINGLE, params=params, timeout=timeout)
            r.raise_for_status()
            j = r.json()
            if j.get("error"):
                raise LookupError(j.get("reason"))
            d = pd.DataFrame(j["hourly"]).rename(columns={"time": "valid", **NAMES})
            d["valid"] = pd.to_datetime(d["valid"], utc=True)
            d = d.set_index("valid").reindex(pd.date_range(init, periods=max_lead + 1, freq="h"))
            if d["wind_speed"].isna().all():
                raise LookupError("no wind data")
            d["init"], d["lead_h"] = init, np.arange(max_lead + 1)
            ih, cube = _cube_from_runs(d.reset_index(), max_lead)
            a = _asof(ih, cube, _hours([issue]), buf, max_lead)[0]
            return a, dict(model=model, wanted=str(want), used=str(init), errors=errors)
        except Exception as ex:
            errors.append(f"{init:%d %H}Z {type(ex).__name__}: {str(ex)[:80]}")
    return np.full((NOFF, 3), np.nan), dict(model=model, wanted=str(want), used=None, errors=errors)


def live_members(issue) -> dict:
    issue = pd.Timestamp(issue).tz_convert("UTC") if pd.Timestamp(issue).tzinfo else pd.Timestamp(issue, tz="UTC")
    key = str(issue)
    if key not in _LIVE:
        from concurrent.futures import ThreadPoolExecutor, wait
        raw, info = {}, {}
        ex = ThreadPoolExecutor(max_workers=LIVE_PARALLEL)
        futs = {k: ex.submit(_live_run, k, issue) for k in MEMBERS}
        wait(list(futs.values()), timeout=LIVE_BUDGET_S)
        for k, f in futs.items():
            if f.done() and f.exception() is None:
                raw[k], info[k] = f.result()
            else:   # too slow or failed: this member drops out of the mean for the hour
                raw[k] = np.full((NOFF, 3), np.nan)
                info[k] = dict(model=MEMBERS[k][0], used=None, errors=["time budget" if not f.done() else
                                                                        repr(f.exception())[:120]])
        ex.shutdown(wait=False, cancel_futures=True)
        mem = {"d2eu": np.where(np.isnan(raw["d2"][..., :1]), raw["eu"], raw["d2"])}
        mem.update({k: v for k, v in raw.items() if k not in ("d2", "eu")})
        _LIVE.clear()
        _LIVE[key] = ({k: v[None] for k, v in mem.items()}, info)
    return _LIVE[key][0]


def nonifs_mean(mem) -> np.ndarray:
    st = np.stack(list(mem.values()))
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", RuntimeWarning)
        return np.concatenate([np.nanmean(st[..., :2], axis=0), np.nanmean(st[..., 2:], axis=0)], -1)


def tw25_point_roll6(nm):
    """Non-IFS tailwind on 25 at leads 1..48 and its centred 6 h mean (valid-3 .. valid+2; NaN if any hour missing)."""
    from fra.fcerror import tw_from_uv, H25
    tw = tw_from_uv(nm[..., 0], nm[..., 1], H25)
    L = np.arange(1, 49)
    point = tw[:, L - LMIN]
    roll6 = np.stack([tw[:, L + h - LMIN] for h in range(-3, 3)]).mean(axis=0)
    return point, roll6


def _members_for(issues, live):
    if live:
        assert len(issues) == 1
        return live_members(issues[0])
    return hist_members(_hours(issues))


def make_add_icon(orig):
    def add_icon_mm(d, issues, leads, live=False, iconeu=None):
        d = orig(d, issues, leads, live=live, iconeu=iconeu)
        issues = pd.DatetimeIndex(issues)
        point, roll6 = tw25_point_roll6(nonifs_mean(_members_for(issues, live)))
        ii = issues.get_indexer(pd.DatetimeIndex(pd.to_datetime(d["issue"], utc=True)))
        li = d["lead"].to_numpy().astype(int) - 1
        okr = (ii >= 0) & (li >= 0) & (li < 48)
        p = np.full(len(d), np.nan)
        r6 = np.full(len(d), np.nan)
        p[okr], r6[okr] = point[ii[okr], li[okr]], roll6[ii[okr], li[okr]]
        d["tw25_nonifs"] = p
        d["tw25_cons"] = pd.concat([d["tw25"], pd.Series(p, index=d.index)], axis=1).mean(axis=1)
        d["tw25_cons_roll6"] = pd.concat([d["tw25_roll6"], pd.Series(r6, index=d.index)], axis=1).mean(axis=1)
        return d
    return add_icon_mm


def patch_library(lib):
    """Library whose 'icon' slot is the as-of non-IFS mean wherever any member exists (cons and has_icon follow)."""
    import dataclasses
    ifs = lib.fc["ifs"]
    first = min(int(c[0][0]) for c in _cubes().values() if len(c[0]))
    sel = lib.tau >= first
    icon = np.full_like(ifs, np.nan)
    icon[sel] = nonifs_mean(hist_members(lib.tau[sel]))[:, -LMIN:48 - LMIN + 1]
    cons = np.where(np.isnan(icon), ifs, 0.5 * (ifs + icon))
    has_icon = ~np.isnan(icon[:, 1:43, 0]).any(axis=1)
    meta = dict(lib.meta, multimodel=True)
    return dataclasses.replace(lib, fc={"ifs": ifs, "icon": icon, "cons": cons}, has_icon=has_icon, meta=meta)


def make_live_frame(orig):
    def live_forecast_frame_mm(issue=None, timeout=(5, 20)):
        df = orig(issue, timeout=timeout)
        iss = pd.Timestamp(df["valid"].iloc[0])
        nm = nonifs_mean(live_members(iss))[0, -LMIN:48 - LMIN + 1]          # leads 0..48
        df["icon_wind_speed"] = np.hypot(nm[:, 0], nm[:, 1])
        df["icon_wind_direction"] = np.degrees(np.arctan2(-nm[:, 0], -nm[:, 1])) % 360
        df["icon_wind_gusts"] = nm[:, 2]
        df["icon_run_init"] = "multimodel"
        return df
    return live_forecast_frame_mm


def forecast(issue=None, variant=None, models=None, n_paths=None):
    """fra.blend.forecast with the multi-model centre (module docstring). models: the fra.blend keys plus
    'multimodel' (MANIFEST.json of the frozen run archives; required, so a live run never reads data/ files)."""
    from fra import blend as Bl
    from fra import fcerror as B
    from fra import predict as FP
    t0 = time.time()
    models = dict(models or {})
    sig = use_files(models["multimodel"])
    orig = (FP.add_icon, B.load_library, B.live_forecast_frame)
    cache = {}

    def load_library_mm(*a, **k):
        base = orig[1](*a, **k)
        if id(base) not in cache:
            cache.clear()
            cache[id(base)] = patch_library(base)
        return cache[id(base)]

    FP.add_icon, B.load_library, B.live_forecast_frame = make_add_icon(orig[0]), load_library_mm, make_live_frame(orig[2])
    try:
        out, iss, od_now, change = Bl.forecast(issue, variant=variant, models=models, n_paths=n_paths)
    finally:
        FP.add_icon, B.load_library, B.live_forecast_frame = orig
    info = _LIVE.get(str(pd.Timestamp(iss).tz_localize("UTC") if pd.Timestamp(iss).tzinfo is None
                         else pd.Timestamp(iss).tz_convert("UTC")), (None, None))[1]
    out.attrs["multimodel"] = dict(files=sig, live_runs=info, seconds=round(time.time() - t0, 2))
    return out, iss, od_now, change
