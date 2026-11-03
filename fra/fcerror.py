"""Part B: "how wrong is the weather forecast?" -- an empirical forecast-error model for EDDF 10 m wind.

Turns ONE deterministic forecast (ECMWF IFS, optionally + DWD ICON-D2) into N plausible ACTUAL-wind futures for the
next 48 h by adding whole residual PATHS (observed minus forecast, leads 1..48, all hours of one past run together)
from past analogue situations. Whole paths keep the real time correlation of forecast errors (a front that arrives
3 h late is wrong for several hours in a row), which a per-lead error model cannot represent. No radar labels needed.

Data (all public, archived as issued):
  forecasts     data/ifs_runs.parquet (+ data/ifs_runs_backfill.parquet when present), ECMWF IFS single runs,
                6-hourly inits, leads 0..71; data/icon_runs.parquet DWD ICON-D2, 3-hourly inits, leads 0..48.
  observations  data/metar_full.parquet if present, else data/metar.parquet (IEM METAR EDDF).

Definitions
  * Wind components (kt): u = eastward, v = northward (wind TO), so the tailwind on runway heading h is
    u*sin(h) + v*cos(h), identical to fra.rules.tailwind(speed, direction_from, h).
  * Observation of hour t = mean u/v (mean speed, max gust) of the METARs within [t-30 min, t+30 min). EDDF routine
    METARs are issued at hh:50 (archive) -> obs(t) is the hh:50 report just before t. Calm -> u=v=0. VRB <= 3 kt ->
    u=v=0 (light, direction undefined). VRB > 3 kt (convective) or no report -> u/v interpolated across gaps of at
    most 2 h in total (longer gaps stay missing), flagged `obs_bad` (excluded from verification). Gust: METAR reports gusts only when they exceed the mean wind by
    ~10 kt, so the observed gust is max(mean speed, reported gust): the simulated gust follows that convention.
  * Run residual (init i, lead l = 0..60): obs(i+l) - forecast_i(i+l)   -> run_residuals()
  * Library entry = pseudo-issue time tau (hourly): the run actually available at tau (IFS init <= tau - 6 h, the
    fra.singleruns.asof_features rule; ICON init <= tau - 4 h, fra.singleruns_icon), its forecast path for leads
    0..48 after tau, the observed path and the residual path; plus r_now = last METAR at/before tau minus the
    forecast for tau (known at tau, used to condition short leads).
  * Walk-forward eligibility for issue T: tau + 51 h <= T (obs(tau+48) complete at tau+48.5 h, plus the 2 h reach of
    the gap interpolation) AND run init + 61 h <= T. Strict: nothing observed after T is ever used -- verified end to
    end by rebuilding the library from archives truncated at T (experiments/partb/check_api.py).

Sampling (sample_paths): analogue weights = season (day-of-year distance) x issue hour of day (= init hour + lead
alignment) x forecast regime (forecast u/v in four 12 h blocks) [x 0.25 for IFS-only entries when the centre is the
ECMWF+ICON consensus]; draw n whole paths with replacement; residual path + beta(L) * (r_now_target - r_now_analogue)
(conditional shift on the current METAR error, beta from the pooled library, tapered exp(-L/12 h)); residuals rescaled
by forecast wind speed and ECMWF-ICON spread; simulated u/v/gust = forecast + residual; hours where the analogue's
METAR was calm stay calm if the simulated wind is < 3 kt. Derived: tw25, tw18, gtw18 (gust tailwind on 18).
The simulated wind is "what the hourly METAR will show" (10-min mean, METAR gust convention), not a model grid value.

Public API
  load_library()                       -> Library (cached arrays, all archives)
  sample_paths(issue, forecast_frame)  -> Paths (n, 48) arrays: u, v, gust, speed, tw25, tw18, gtw18
  forecast_frame(issue)                -> as-of IFS(+ICON) forecast frame from the archives (historical issues)
  live_forecast_frame(issue=None)      -> the same as-of runs for a current issue from the single-runs API
                                          (IFS init <= t-6 h, ICON-D2 init <= t-4 h; used by fra.blend live)
  path_features(rows)                  -> per (issue, lead) row: P(tw25>0), P(tw25>5), mean/sd/q10/q90 of tw25, ...
  run_residuals()                      -> run-level residual table (init, lead 0..60)
  DEFAULT / DEFAULT_IFS / DEFAULT_NATIVE  parameter sets (DEFAULT_NATIVE: IFS-only analogues on the IFS centre,
                                       better-calibrated P(tw25 > 5 kt) but no end-to-end gain, see REPORT.md)
See experiments/partb/REPORT.md for validation and the chosen variant (DEFAULT). Known limitation: in the Jun-Oct
2026 test DEFAULT under-forecasts P(tw25 > 5 kt) for P in 0.4-0.85 (simulated mean ~0.9 kt low, spread too wide in
strong-tailwind regimes); recalibrate if such probabilities are used directly. In the production blend (fra.blend,
experiments/integration/REPORT.md) neither DEFAULT_NATIVE nor the METAR gust convention (Params.gust_metar) changed
the end-to-end OD Brier (differences +0.0001..+0.0002, CIs include 0), so DEFAULT stays.
"""

from __future__ import annotations

from dataclasses import dataclass, field, replace
from functools import lru_cache
from pathlib import Path

import numpy as np
import pandas as pd

DATA = Path(__file__).resolve().parent.parent / "data"
IFS_FILES = [DATA / "ifs_runs.parquet", DATA / "ifs_runs_backfill.parquet"]
ICON_FILE = DATA / "icon_runs.parquet"
METAR_FILES = [DATA / "metar_full.parquet", DATA / "metar.parquet"]

H25, H18 = np.radians(250.0), np.radians(180.0)
IFS_BUFFER_H, ICON_BUFFER_H = 6, 4          # publication buffers (same as fra.singleruns / fra.singleruns_icon)
MAX_RUN_LEAD = 60                           # residual paths kept for run leads 0..60
NL = 49                                     # library path length: leads 0..48 after the (pseudo-)issue
HORIZON = 48
CH = ("u", "v", "g")                        # residual channels: wind components and gust speed (kt)
OBS_INTERP_H = 2                            # VRB/missing hours are interpolated from neighbours up to 2 h away
OBS_DONE_H = 49 + OBS_INTERP_H              # path verified once obs(tau+48) (+ interpolation reach) is complete
RUN_DONE_H = MAX_RUN_LEAD + 1               # task rule: init + 60 h + 1 h <= issue


def tw_from_uv(u, v, heading_rad):
    """Tailwind (kt) on a runway heading from wind-TO components; = fra.rules.tailwind(speed, dir_from, heading).
    Rounded to 1e-6 kt so that exact crosswinds (METAR 160/340 deg for runway 25) are exactly 0, not +-1e-15."""
    return np.round(u * np.sin(heading_rad) + v * np.cos(heading_rad), 6)


def uv_from_sd(speed, direction_from):
    d = np.radians(np.asarray(direction_from, dtype=float))
    s = np.asarray(speed, dtype=float)
    return -s * np.sin(d), -s * np.cos(d)


# ----------------------------------------------------------------------------------------------- observations

def _metar_file():
    for p in METAR_FILES:
        if p.exists():
            return p
    raise FileNotFoundError("no METAR archive (data/metar_full.parquet or data/metar.parquet)")


@lru_cache(maxsize=2)
def metar_reports(path: str | None = None) -> pd.DataFrame:
    """Report-level METARs: index time (UTC), u, v (NaN = direction unknown), speed, gust (>= speed)."""
    return reports_from_frame(pd.read_parquet(path or _metar_file()))


def reports_from_frame(m: pd.DataFrame) -> pd.DataFrame:
    """metar_reports() for an IEM METAR frame (columns drct, sknt, gust), e.g. the live fra.weather.metar() fetch."""
    m = m.copy()
    if not isinstance(m.index, pd.DatetimeIndex):
        m = m.set_index(next(c for c in ["time", "valid"] if c in m.columns))
    m.index = pd.to_datetime(m.index, utc=True)
    m = m[~m.index.duplicated(keep="last")].sort_index()
    m = m[m["sknt"].notna()]
    s = m["sknt"].astype(float).to_numpy()
    d = m["drct"].astype(float).to_numpy()
    u, v = uv_from_sd(s, d)
    calm = (s == 0) | (np.isnan(d) & (s <= 3))          # calm or light-and-variable: vector wind ~ 0
    u[calm], v[calm] = 0.0, 0.0
    g = np.fmax(s, m["gust"].astype(float).to_numpy())  # gust only reported if notably above the mean
    out = pd.DataFrame({"u": u, "v": v, "speed": s, "gust": g}, index=m.index)
    out["vrb"] = np.isnan(u)
    return out


@lru_cache(maxsize=2)
def hourly_obs(path: str | None = None) -> pd.DataFrame:
    """Hourly observation centred on the hour: METARs in [t-30 min, t+30 min). NOT known at t (contains reports
    up to t+29 min when half-hourly METARs exist) -> only for verification / residual paths, never as 'now'."""
    r = metar_reports(path)
    hour = r.index.round("h")
    g = r.groupby(hour)
    h = pd.DataFrame({"u": g["u"].mean(), "v": g["v"].mean(), "speed": g["speed"].mean(),
                      "gust": g["gust"].max(), "vrb": g["vrb"].all()})
    h = h.reindex(pd.date_range(h.index.min(), h.index.max(), freq="h"))
    h["missing"] = h["u"].isna()                         # VRB>3 kt or no report at all
    h["vrb"] = h["vrb"].fillna(False).astype(bool)
    # Interpolate only gaps of at most OBS_INTERP_H hours IN TOTAL. (interpolate(limit=2) would fill the first 2 hours
    # of a longer gap from its far end, so obs(t) could depend on reports many hours after t; with whole-gap limits
    # the right end point is <= t + OBS_INTERP_H, which OBS_DONE_H accounts for.)
    for c in ["u", "v", "speed", "gust"]:
        isna = h[c].isna()
        gap_len = isna.groupby((~isna).cumsum()).transform("sum")
        h[c] = h[c].interpolate(limit_area="inside").where(~isna | (gap_len <= OBS_INTERP_H))
    return h


def obs_now(issues, path: str | None = None, tolerance="70min", reports: pd.DataFrame | None = None) -> pd.DataFrame:
    """Latest METAR at or before each issue time (known at the issue time), with VRB>3 kt filled by the report
    before it. Columns u, v, gust, age_min. reports: a reports_from_frame() table (live) instead of the archive."""
    r = (metar_reports(path) if reports is None else reports)[["u", "v", "gust"]].copy()
    r[["u", "v"]] = r[["u", "v"]].ffill(limit=1)
    r["t_obs"] = r.index
    q = pd.DataFrame({"issue": pd.DatetimeIndex(pd.to_datetime(issues, utc=True))})
    q["_o"] = np.arange(len(q))
    q = pd.merge_asof(q.sort_values("issue"), r.rename_axis("t").reset_index(), left_on="issue", right_on="t",
                      direction="backward", tolerance=pd.Timedelta(tolerance))
    q["age_min"] = (q["issue"] - q["t_obs"]).dt.total_seconds() / 60
    return q.sort_values("_o")[["issue", "u", "v", "gust", "age_min"]].reset_index(drop=True)


# ----------------------------------------------------------------------------------------------- forecasts

def load_ifs_runs() -> pd.DataFrame:
    """ECMWF IFS single runs; picks up data/ifs_runs_backfill.parquet automatically when it exists."""
    parts = [pd.read_parquet(p, columns=["init", "valid", "lead_h", "wind_speed", "wind_direction", "wind_gusts"])
             for p in IFS_FILES if p.exists()]
    d = pd.concat(parts, ignore_index=True)
    for c in ["init", "valid"]:
        d[c] = pd.to_datetime(d[c], utc=True)
    return d.drop_duplicates(["init", "valid"], keep="first").sort_values(["init", "valid"]).reset_index(drop=True)


def load_icon_runs() -> pd.DataFrame | None:
    if not ICON_FILE.exists():
        return None
    d = pd.read_parquet(ICON_FILE, columns=["init", "valid", "lead_h", "wind_speed", "wind_direction", "wind_gusts"])
    for c in ["init", "valid"]:
        d[c] = pd.to_datetime(d[c], utc=True)
    return d.drop_duplicates(["init", "valid"]).sort_values(["init", "valid"]).reset_index(drop=True)


def _run_cube(runs: pd.DataFrame, nlead: int):
    """-> inits (DatetimeIndex), cube [n_init, nlead, 3] of forecast u, v, gust (NaN where missing)."""
    runs = runs[(runs["lead_h"] >= 0) & (runs["lead_h"] < nlead)]
    inits = pd.DatetimeIndex(np.sort(runs["init"].unique()))
    ii = inits.get_indexer(runs["init"])
    ll = runs["lead_h"].to_numpy().astype(int)
    u, v = uv_from_sd(runs["wind_speed"], runs["wind_direction"])
    cube = np.full((len(inits), nlead, 3), np.nan)
    cube[ii, ll, 0], cube[ii, ll, 1] = u, v
    cube[ii, ll, 2] = runs["wind_gusts"].to_numpy(dtype=float)
    return inits, cube


def run_residuals(model: str = "ifs") -> pd.DataFrame:
    """Run-level residual table: one row per (init, lead 0..60): forecast, hourly observation, residual (obs - fc)
    for u, v, gust and the derived tailwinds tw25 / tw18 / gtw18. Eligible for an issue T iff init + 61 h <= T."""
    runs = load_ifs_runs() if model == "ifs" else load_icon_runs()
    runs = runs[runs["lead_h"].between(0, MAX_RUN_LEAD)].copy()
    obs = hourly_obs()
    o = obs.reindex(pd.DatetimeIndex(runs["valid"]))
    fu, fv = uv_from_sd(runs["wind_speed"], runs["wind_direction"])
    out = runs[["init", "valid", "lead_h"]].rename(columns={"lead_h": "lead"}).reset_index(drop=True)
    out["fc_u"], out["fc_v"], out["fc_g"] = fu, fv, runs["wind_gusts"].to_numpy(float)
    out["obs_u"], out["obs_v"], out["obs_g"] = o["u"].to_numpy(), o["v"].to_numpy(), o["gust"].to_numpy()
    out["obs_missing"] = o["missing"].astype("boolean").fillna(True).to_numpy(bool)
    for c in "uvg":
        out[f"d{c}"] = out[f"obs_{c}"] - out[f"fc_{c}"]
    for name, h in [("tw25", H25), ("tw18", H18)]:
        out[f"d{name}"] = tw_from_uv(out["du"], out["dv"], h)
    sp_f = np.hypot(out["fc_u"], out["fc_v"]).replace(0, np.nan)
    sp_o = np.hypot(out["obs_u"], out["obs_v"]).replace(0, np.nan)
    out["dgtw18"] = (out["obs_g"] * tw_from_uv(out["obs_u"], out["obs_v"], H18) / sp_o).fillna(0) - \
                    (out["fc_g"] * tw_from_uv(out["fc_u"], out["fc_v"], H18) / sp_f).fillna(0)
    out["eligible_from"] = out["init"] + pd.Timedelta(hours=RUN_DONE_H)
    return out


# ----------------------------------------------------------------------------------------------- library

@dataclass
class Library:
    """Hourly pseudo-issue library. Arrays are aligned on axis 0 (entry); leads 0..48 on axis 1."""
    tau: np.ndarray            # int64 hours since epoch (pseudo-issue time)
    ifs_init: np.ndarray       # int64 hours since epoch of the IFS run used
    fc: dict                   # source -> [N, 49, 3] forecast u, v, gust: 'ifs', 'icon' (NaN if missing), 'cons'
                               # (ECMWF+ICON mean, = IFS where ICON is missing, as tw25_cons in fra.dataset)
    obs: np.ndarray            # [N, 49, 3] hourly obs u, v, gust (interpolated small gaps)
    obs_bad: np.ndarray        # [N, 49] obs missing / VRB-interpolated (exclude from verification)
    obs_calm: np.ndarray       # [N, 49] obs calm or light-and-variable (u = v = 0 exactly)
    now: np.ndarray            # [N, 3] last METAR at/before tau (u, v, gust); NaN if none within 70 min
    has_icon: np.ndarray       # [N] ICON run available for leads 1..42 (D2 ends at run lead 48)
    complete: np.ndarray       # [N] obs and IFS forecast complete for leads 0..48
    meta: dict = field(default_factory=dict)

    @property
    def times(self):
        return pd.to_datetime(self.tau * 3600, unit="s", utc=True)

    def index_of(self, issues) -> np.ndarray:
        h = _hours(issues)
        pos = np.searchsorted(self.tau, h)
        pos = np.clip(pos, 0, len(self.tau) - 1)
        return np.where(self.tau[pos] == h, pos, -1)

    def eligible_count(self, issue_hour: int) -> int:
        """Entries whose verifying observations were complete before the issue (tau sorted)."""
        return int(np.searchsorted(self.tau, issue_hour - OBS_DONE_H, side="right"))


def _hours(t) -> np.ndarray:
    t = pd.DatetimeIndex(pd.to_datetime(t, utc=True)) if not isinstance(t, pd.Timestamp) else pd.DatetimeIndex([t])
    return (t.as_unit("s").asi8 // 3600).astype(np.int64)


_LIB_CACHE: dict = {}
LIBRARY_FILES = ("ifs_runs.parquet", "ifs_runs_backfill.parquet", "icon_runs.parquet", "metar_full.parquet")


def use_library_files(folder) -> dict:
    """Read the analogue library from a FROZEN copy of its input files (folder with LIBRARY_FILES and MANIFEST.json =
    {"files": {name: sha256}}) instead of the live data/ files, which data refreshes can change. Every file is checked
    against the manifest (a mismatch raises). Returns the signature {name: sha256[:12]} (+ manifest sha256)."""
    import hashlib
    import json
    global IFS_FILES, ICON_FILE, METAR_FILES
    folder = Path(folder)
    man_path = folder / "MANIFEST.json" if folder.is_dir() else folder
    folder = man_path.parent
    man_bytes = man_path.read_bytes()
    man = json.loads(man_bytes)
    sig = {}
    for name in LIBRARY_FILES:
        want = man["files"][name]
        got = hashlib.sha256((folder / name).read_bytes()).hexdigest()
        if got != want:
            raise RuntimeError(f"frozen library file {name}: sha256 {got[:12]} != manifest {want[:12]}")
        sig[name] = got[:12]
    IFS_FILES = [folder / "ifs_runs.parquet", folder / "ifs_runs_backfill.parquet"]
    ICON_FILE = folder / "icon_runs.parquet"
    METAR_FILES = [folder / "metar_full.parquet"]
    metar_reports.cache_clear()
    hourly_obs.cache_clear()
    _LIB_CACHE.clear()
    sig["manifest"] = hashlib.sha256(man_bytes).hexdigest()[:12]
    return sig


def _sig():
    files = [p for p in [*IFS_FILES, ICON_FILE, _metar_file()] if p.exists()]
    return tuple((str(p), p.stat().st_mtime_ns) for p in files)


def load_library(rebuild: bool = False) -> Library:
    """Build (or reuse, in-process) the pseudo-issue library from all archives present on disk."""
    sig = _sig()
    if not rebuild and sig in _LIB_CACHE:
        return _LIB_CACHE[sig]
    lib = build_library()
    _LIB_CACHE.clear()
    _LIB_CACHE[sig] = lib
    return lib


def build_library() -> Library:
    ifs = load_ifs_runs()
    inits, cube = _run_cube(ifs, 72)
    ih = _hours(inits)
    obs = hourly_obs()
    oh0 = int(_hours(obs.index[:1])[0])
    O = obs[["u", "v", "gust"]].to_numpy()
    Obad = (obs["missing"] | obs["vrb"]).to_numpy() | np.isnan(O[:, 0])

    tau = np.arange(ih[0] + IFS_BUFFER_H, max(ih[-1] + 24, oh0 + len(O)) + 1, dtype=np.int64)
    k_run = np.searchsorted(ih, tau - IFS_BUFFER_H, side="right") - 1          # latest init <= tau - 6 h
    ok = k_run >= 0
    tau, k_run = tau[ok], k_run[ok]
    off = tau - ih[k_run]                                                    # lead of tau in that run
    keep = off + HORIZON <= 71
    tau, k_run, off = tau[keep], k_run[keep], off[keep]
    L = np.arange(NL)
    fc_ifs = cube[k_run[:, None], off[:, None] + L[None, :], :]               # [N, 49, 3]

    oi = tau[:, None] + L[None, :] - oh0
    inside = (oi >= 0) & (oi < len(O))
    oi_c = np.clip(oi, 0, len(O) - 1)
    ob = np.where(inside[..., None], O[oi_c], np.nan)
    obad = np.where(inside, Obad[oi_c], True)

    fc_cons, fc_icon = fc_ifs.copy(), np.full_like(fc_ifs, np.nan)
    has_icon = np.zeros(len(tau), bool)
    icon = load_icon_runs()
    if icon is not None:
        cinit, ccube = _run_cube(icon, 49)
        chh = _hours(cinit)
        kc = np.searchsorted(chh, tau - ICON_BUFFER_H, side="right") - 1
        okc = kc >= 0
        offc = np.where(okc, tau - chh[np.clip(kc, 0, None)], 10**6)
        okc &= offc <= 12                                                     # stale ICON run -> treat as missing
        lc = offc[:, None] + L[None, :]
        inl = okc[:, None] & (lc < 49)
        ic = np.where(inl[..., None], ccube[np.clip(kc, 0, None)[:, None], np.clip(lc, 0, 48), :], np.nan)
        fc_icon = ic
        fc_cons = np.where(np.isnan(ic), fc_ifs, 0.5 * (fc_ifs + ic))         # consensus; IFS where ICON missing
        has_icon = okc & ~np.isnan(ic[:, 1:43, 0]).any(axis=1)              # ICON-D2 reaches lead 42..44

    now = obs_now(pd.to_datetime(tau * 3600, unit="s", utc=True))[["u", "v", "gust"]].to_numpy()
    complete = ~np.isnan(fc_ifs[:, :, :2]).any(axis=(1, 2)) & ~np.isnan(ob[:, :, :2]).any(axis=(1, 2)) & \
        ~np.isnan(fc_ifs[:, 1:, 2]).any(axis=1) & ~np.isnan(ob[:, :, 2]).any(axis=1)
    calm = (ob[..., 0] == 0) & (ob[..., 1] == 0) & ~obad
    return Library(tau=tau, ifs_init=ih[k_run], fc={"ifs": fc_ifs, "icon": fc_icon, "cons": fc_cons}, obs=ob, obs_bad=obad,
                   obs_calm=calm,
                   now=now, has_icon=has_icon, complete=complete,
                   meta={"ifs_files": [str(p) for p in IFS_FILES if p.exists()], "metar": str(_metar_file()),
                         "n_inits": len(inits), "first_tau": str(pd.Timestamp(tau[0] * 3600, unit="s", tz="UTC")),
                         "last_tau": str(pd.Timestamp(tau[-1] * 3600, unit="s", tz="UTC"))})


# ----------------------------------------------------------------------------------------------- sampler

@dataclass(frozen=True)
class Params:
    """Analogue-path sampler settings. Field defaults are the plain IFS analogue sampler; DEFAULT (below) is the
    walk-forward winner, see experiments/partb/REPORT.md."""
    source: str = "ifs"              # forecast centre and residual library: 'ifs' or 'cons' (ECMWF+ICON-D2 mean)
    lib_source: str | None = None    # residual library if different from source: 'ifs', 'cons', or 'cons_mix'
                                     # (consensus residuals where ICON existed, IFS residuals before 2026-05)
    sigma_doy: float | None = 45.0   # season kernel (days, circular); None = off
    sigma_hour: float | None = 1.0   # issue hour-of-day kernel (h, circular) = init hour + lead alignment
    regime: str | None = "uv2"       # forecast-regime summary: 'uv2', 'uv4', 'tw2', None
    sigma_regime: float = 4.0        # kt
    sigma_now: float | None = None   # kernel on the current error (r_now) similarity, kt; None = off
    shift_now: bool = True           # residual += beta(L) * (r_now_target - r_now_analogue)
    beta_mode: str = "global"        # 'global' (pooled library slope, refit weekly) or 'local' (analogue-weighted
                                     # slope shrunk to global with beta_prior effective samples)
    beta_prior: float = 50.0
    beta_taper_h: float | None = None  # multiply beta(L) by exp(-L / taper); None = no taper
    scale_speed: float | None = None # rescale residual by (a + S_target)/(a + S_analogue), a in kt; None = off
    scale_spread: float | None = None  # rescale residual by (b + |IFS-ICON|_target)/(b + |IFS-ICON|_analogue), kt
    halflife_days: float | None = None  # extra recency weight
    ifs_entry_weight: float = 1.0    # 'cons_mix': weight factor for entries without ICON (IFS residuals)
    mix_native: bool = False         # 'cons_mix': an IFS-only analogue's residual (obs - IFS) is added to the TARGET's
                                     # IFS forecast, and it is matched on the target's IFS regime / speed / current
                                     # error; consensus analogues use the consensus. False = every residual is added
                                     # to the consensus (biased: ICON-D2 is lower than IFS in easterly regimes, so IFS
                                     # residuals under-correct the consensus there; needs fc_ifs_t in sample()).
    obs_operator: str | None = None  # 'calm': hours where the analogue's METAR was calm/light-variable stay calm
                                     # (u=v=0); 'metar': + speed rounded to 1 kt, direction to 10 deg. The verifying
                                     # METAR has these point masses (13 % of observed tw25 are exactly 0).
    calm_max_kt: float | None = None # carry calm over only where the simulated wind is below this speed (kt)
    min_ess: float = 25.0            # widen regime/now kernels until the effective sample size reaches this
    min_lib: int = 24 * 28           # need >= 4 weeks of eligible library, else no paths (NaN)
    gust_metar: bool = False         # map the simulated gust to the METAR reporting convention at the end (gust kept
                                     # only if >= mean speed + 10 kt, else = mean speed); the raw simulated gust
                                     # (centre gust + residual) exceeds the mean speed ~2.6x more often than METAR
                                     # does. Integration test (experiments/integration): no end-to-end gain -> off


# Walk-forward winner (experiments/partb/REPORT.md): ECMWF+ICON-D2 consensus centre; consensus residual paths where
# ICON was archived, IFS residual paths (weight 0.25) before; season sigma 60 d, issue hour sigma 2 h, regime = forecast
# u/v in four 12 h blocks (sigma 3 kt); current-error shift with beta tapered exp(-L/12 h); residuals rescaled by
# forecast wind speed (a = 10 kt) and ECMWF-ICON spread (b = 4 kt); hours where the analogue's METAR was calm stay
# calm if the simulated wind is < 3 kt (METAR VRB/calm convention).
DEFAULT = Params(source="cons", lib_source="cons_mix", ifs_entry_weight=0.25, sigma_doy=60.0, sigma_hour=2.0,
                 regime="uv4", sigma_regime=3.0, shift_now=True, beta_taper_h=12.0, scale_speed=10.0,
                 scale_spread=4.0, obs_operator="calm", calm_max_kt=3.0)
# Used automatically when the forecast has no ICON-D2 (leads 1..42): same settings on IFS alone.
DEFAULT_IFS = replace(DEFAULT, source="ifs", lib_source=None, scale_spread=None)
# Alternative (review round, experiments/partb/REPORT.md): IFS-only analogues centred on the target's IFS forecast.
# Removes DEFAULT's low bias in strong-tailwind regimes (IFS residuals added to the consensus under-correct it by about
# half the ICON-IFS difference) and lowers tw25 CRPS by ~1 %, but scores worse on path questions and lead 1/48 and
# ties DEFAULT in Part A's end-to-end OD Brier (0.0407 vs 0.0408) -> not the default.
DEFAULT_NATIVE = replace(DEFAULT, mix_native=True, ifs_entry_weight=0.1)


def _fallback(params: Params, has_icon: bool) -> Params:
    """Consensus settings need an ICON forecast for the target; otherwise use the IFS-only equivalent."""
    if params.source == "cons" and not has_icon:
        return replace(params, source="ifs", lib_source=None, scale_spread=None)
    return params


@dataclass
class Paths:
    """Simulated actual-wind paths for leads 1..48 after the issue (axis 1)."""
    issue: pd.Timestamp
    valid: pd.DatetimeIndex
    u: np.ndarray
    v: np.ndarray
    gust: np.ndarray
    info: dict

    @property
    def speed(self):
        return np.hypot(self.u, self.v)

    @property
    def tw25(self):
        return tw_from_uv(self.u, self.v, H25)

    @property
    def tw18(self):
        return tw_from_uv(self.u, self.v, H18)

    @property
    def gtw18(self):
        s = self.speed
        with np.errstate(invalid="ignore", divide="ignore"):
            return np.where(s > 0, self.gust * self.tw18 / s, 0.0)

    CHANNELS = ("u", "v", "gust", "speed", "tw25", "tw18", "gtw18")

    @property
    def array(self) -> np.ndarray:
        """[n, 48, 7] in the order of Paths.CHANNELS."""
        return np.stack([getattr(self, c) for c in self.CHANNELS], axis=-1)


def _regime_feats(fc: np.ndarray, kind: str | None) -> np.ndarray | None:
    """Summary of a forecast path fc[..., 49, 3] over leads 1..48."""
    if kind is None:
        return None
    a, b = fc[..., 1:25, :2], fc[..., 25:49, :2]
    if kind == "uv2":
        return np.concatenate([np.nanmean(a, axis=-2), np.nanmean(b, axis=-2)], axis=-1)
    if kind in ("uv4", "uv8"):
        w = 12 if kind == "uv4" else 6
        q = [fc[..., s:s + w, :2] for s in range(1, 49, w)]
        return np.concatenate([np.nanmean(x, axis=-2) for x in q], axis=-1)
    if kind == "tw2":
        tw = tw_from_uv(fc[..., 1:, 0], fc[..., 1:, 1], H25)
        return np.stack([np.nanmean(tw[..., :24], -1), np.nanmean(tw[..., 24:], -1),
                         np.nanmean(np.hypot(fc[..., 1:, 0], fc[..., 1:, 1]), -1)], axis=-1)
    raise ValueError(kind)


def metar_operator(sim: np.ndarray, calm: np.ndarray | None = None, rounding: bool = True) -> np.ndarray:
    """Map simulated winds [..., 3] to what a METAR reports: calm where the analogue was calm; with rounding also speed
    and gust rounded to whole knots (0 -> calm) and direction rounded to 10 deg."""
    sim = sim.copy()
    if calm is not None:
        sim[..., 0] = np.where(calm, 0.0, sim[..., 0])
        sim[..., 1] = np.where(calm, 0.0, sim[..., 1])
    if not rounding:
        return sim
    sp = np.round(np.hypot(sim[..., 0], sim[..., 1]))
    d = np.round(np.degrees(np.arctan2(-sim[..., 0], -sim[..., 1])) / 10) * 10
    u, v = uv_from_sd(sp, d)
    sim[..., 0], sim[..., 1] = np.where(sp > 0, u, 0.0), np.where(sp > 0, v, 0.0)
    sim[..., 2] = np.round(sim[..., 2])
    return sim


class Sampler:
    """Holds the library views for one Params; fits beta(L) walk-forward (refit weekly, cached)."""

    def __init__(self, lib: Library, params: Params = DEFAULT):
        self.lib, self.p = lib, params
        src = params.lib_source or params.source
        self.mixed = src == "cons_mix"
        if src == "cons_mix":
            self.fc_lib = np.where(lib.has_icon[:, None, None], lib.fc["cons"], lib.fc["ifs"])
        else:
            self.fc_lib = lib.fc[src]
        self.res = lib.obs - self.fc_lib                                    # [N, 49, 3]
        self.r_now = lib.now - self.fc_lib[:, 0, :]                         # [N, 3]
        usable = lib.complete & ~np.isnan(self.res[:, 1:, :]).any(axis=(1, 2))
        if src == "cons":
            usable &= lib.has_icon
        dif = lib.fc["ifs"][..., :2] - lib.fc["icon"][..., :2]
        self.spread = np.hypot(dif[..., 0], dif[..., 1])                    # [N, 49], NaN without ICON
        self.usable = usable
        self.feats = _regime_feats(self.fc_lib, params.regime)
        self.doy = (pd.to_datetime(lib.tau * 3600, unit="s", utc=True).day_of_year.to_numpy() - 1).astype(float)
        self.hod = (lib.tau % 24).astype(float)
        self.speed_fc = np.hypot(self.fc_lib[..., 0], self.fc_lib[..., 1])
        self._beta = {}

    def eligible(self, issue_h: int) -> np.ndarray:
        n = self.lib.eligible_count(issue_h)
        e = np.flatnonzero(self.usable[:n])
        return e[self.lib.ifs_init[e] + RUN_DONE_H <= issue_h]

    def beta(self, issue_h: int) -> np.ndarray:
        """Regression slope of residual(L) on r_now per channel, from entries eligible at the start of the week."""
        wk = issue_h // (24 * 7)
        if wk not in self._beta:
            e = self.eligible(wk * 24 * 7)
            e = e[~np.isnan(self.r_now[e]).any(axis=1)]
            b = np.zeros((NL, 3))
            if len(e) > 200:
                x = self.r_now[e] - self.r_now[e].mean(0)                  # [m, 3]
                y = self.res[e] - self.res[e].mean(0)                       # [m, 49, 3]
                b = np.clip((x[:, None, :] * y).sum(0) / (x ** 2).sum(0)[None, :], 0, 1.2)
            self._beta[wk] = b
        return self._beta[wk]

    def _local_beta(self, e, w, ess, b_global):
        """Analogue-weighted slope of residual(L) on r_now, shrunk to the global slope."""
        x = self.r_now[e]
        ok = ~np.isnan(x).any(1)
        e, w, x = e[ok], w[ok] / w[ok].sum(), x[ok]
        xc = x - (w[:, None] * x).sum(0)
        y = self.res[e]
        yc = y - np.einsum("m,mlc->lc", w, y)[None]
        bl = np.einsum("m,mc,mlc->lc", w, xc, yc) / np.maximum((w[:, None] * xc ** 2).sum(0), 1e-9)[None, :]
        k = self.p.beta_prior
        return np.clip((ess * bl + k * b_global) / (ess + k), 0, 1.2)

    def _native(self, fc_ifs_t) -> bool:
        return self.mixed and self.p.mix_native and fc_ifs_t is not None

    def weights(self, e, issue_h, fc_t, r_now_t, scale=1.0, fc_ifs_t=None):
        p, w = self.p, np.zeros(len(e))
        logw = np.zeros(len(e))
        if p.sigma_doy:
            doy_t = float(pd.Timestamp(issue_h * 3600, unit="s", tz="UTC").day_of_year - 1)
            dd = np.abs(self.doy[e] - doy_t)
            dd = np.minimum(dd, 365.25 - dd)
            logw -= 0.5 * (dd / p.sigma_doy) ** 2
        if p.sigma_hour is not None:
            dh = np.abs(self.hod[e] - issue_h % 24)
            dh = np.minimum(dh, 24 - dh)
            logw -= 0.5 * (dh / max(p.sigma_hour, 1e-3)) ** 2
        if p.halflife_days:
            logw -= np.log(2) * (issue_h - self.lib.tau[e]) / (24 * p.halflife_days)
        if self.mixed and p.ifs_entry_weight != 1.0:
            logw += np.where(self.lib.has_icon[e], 0.0, np.log(max(p.ifs_entry_weight, 1e-12)))
        if self.feats is not None:
            ft = _regime_feats(fc_t[None], p.regime)[0]
            d2 = np.nansum((self.feats[e] - ft) ** 2, axis=1)
            if self._native(fc_ifs_t):                                     # IFS-only analogues: compare IFS with IFS
                fi = _regime_feats(fc_ifs_t[None], p.regime)[0]
                d2 = np.where(self.lib.has_icon[e], d2, np.nansum((self.feats[e] - fi) ** 2, axis=1))
            logw -= 0.5 * d2 / (p.sigma_regime * scale) ** 2
        if p.sigma_now and r_now_t is not None and not np.isnan(r_now_t[:2]).any():
            rn = self.r_now[e, :2]
            d2 = np.nansum((rn - r_now_t[:2]) ** 2, axis=1) + np.isnan(rn).any(1) * 1e6
            logw -= 0.5 * d2 / (p.sigma_now * scale) ** 2
        w = np.exp(logw - logw.max())
        return w / w.sum()

    def sample(self, issue_h: int, fc_t: np.ndarray, r_now_t: np.ndarray | None, n: int, rng,
               spread_t: np.ndarray | None = None, fc_ifs_t: np.ndarray | None = None) -> tuple:
        """fc_t: [49, 3] forecast (lead 0..48) for the target issue (the centre, params.source); spread_t [49]
        |IFS-ICON| (optional); fc_ifs_t [49, 3] the target's IFS forecast (needed for params.mix_native; r_now_t is
        relative to fc_t). Returns sim [n, 48, 3] (u, v, gust) + info."""
        e = self.eligible(issue_h)
        if len(e) < self.p.min_lib:
            return None, {"n_eligible": len(e), "ess": 0.0}
        native = self._native(fc_ifs_t)
        scale, w = 1.0, None
        for _ in range(6):
            w = self.weights(e, issue_h, fc_t, r_now_t, scale, fc_ifs_t=fc_ifs_t if native else None)
            ess = 1.0 / np.sum(w ** 2)
            if ess >= self.p.min_ess:
                break
            scale *= 1.6
        pick = e[rng.choice(len(e), size=n, p=w)]
        # per-member target centre: the consensus, or (mix_native) the IFS forecast for IFS-only analogues
        if native:
            ifs_m = ~self.lib.has_icon[pick]                                 # [n]
            centre = np.where(ifs_m[:, None, None], fc_ifs_t[None], fc_t[None])   # [n, 49, 3]
        else:
            centre = np.broadcast_to(fc_t[None], (n, NL, 3))
        r = self.res[pick, 1:, :].copy()                                    # [n, 48, 3]
        if self.p.shift_now and r_now_t is not None and not np.isnan(r_now_t).any():
            # target current error relative to each member's centre (obs_now - centre at lead 0)
            rn_t = r_now_t[None, :] + (fc_t[None, 0, :] - centre[:, 0, :])     # [n, 3]
            rn_t = np.where(np.isnan(rn_t), r_now_t[None, :], rn_t)
            rn_a = self.r_now[pick]
            rn_a = np.where(np.isnan(rn_a), rn_t, rn_a)                     # analogue without METAR -> no shift
            b = self.beta(issue_h)
            if self.p.beta_mode == "local":
                b = self._local_beta(e, w, ess, b)
            if self.p.beta_taper_h:
                b = b * np.exp(-np.arange(NL) / self.p.beta_taper_h)[:, None]
            r += b[None, 1:, :] * (rn_t[:, None, :] - rn_a[:, None, :])
        if self.p.scale_speed is not None:
            a = self.p.scale_speed
            s_t = np.hypot(centre[:, 1:, 0], centre[:, 1:, 1])               # [n, 48]
            r[..., :2] *= ((a + s_t) / (a + self.speed_fc[pick, 1:]))[..., None]
        if self.p.scale_spread is not None and spread_t is not None:
            b = self.p.scale_spread
            f = (b + spread_t[None, 1:]) / (b + self.spread[pick, 1:])
            r[..., :2] *= np.where(np.isnan(f), 1.0, f)[..., None]              # no ICON on either side -> 1
        sim = centre[:, 1:, :] + r
        if self.p.obs_operator:
            calm = self.lib.obs_calm[pick, 1:]
            if self.p.calm_max_kt is not None:
                calm = calm & (np.hypot(sim[..., 0], sim[..., 1]) < self.p.calm_max_kt)
            sim = metar_operator(sim, calm, rounding=self.p.obs_operator == "metar")
        sp = np.hypot(sim[..., 0], sim[..., 1])
        sim[..., 2] = np.fmax(np.where(np.isnan(sim[..., 2]), sp, sim[..., 2]), sp)  # gust >= mean wind
        if self.p.gust_metar:
            sim[..., 2] = np.where(sim[..., 2] >= sp + 10.0, sim[..., 2], sp)
        return sim, {"n_eligible": len(e), "ess": float(ess), "kernel_scale": scale,
                     "picked_tau": pick}


_SAMPLERS: dict = {}


def get_sampler(params: Params = DEFAULT, lib: Library | None = None) -> Sampler:
    lib = lib or load_library()
    key = (id(lib), params)
    if key not in _SAMPLERS:
        _SAMPLERS.clear() if len(_SAMPLERS) > 16 else None
        _SAMPLERS[key] = Sampler(lib, params)
    return _SAMPLERS[key]


# ----------------------------------------------------------------------------------------------- public API

def forecast_frame(issue, lib: Library | None = None) -> pd.DataFrame:
    """As-of forecast for a historical issue from the archives (IFS init <= issue-6 h, ICON init <= issue-4 h):
    leads 0..48 with wind_speed, wind_direction, wind_gusts (IFS) and icon_* columns (NaN where unavailable)."""
    lib = lib or load_library()
    issue = pd.Timestamp(issue).tz_convert("UTC") if pd.Timestamp(issue).tzinfo else pd.Timestamp(issue, tz="UTC")
    i = int(lib.index_of([issue])[0])
    if i < 0:
        raise KeyError(f"{issue} not in the forecast archive (issue must be on the hour)")
    f, ic = lib.fc["ifs"][i], lib.fc["icon"][i]
    df = pd.DataFrame({"lead": np.arange(NL), "valid": issue + pd.to_timedelta(np.arange(NL), unit="h")})
    for pre, x in [("", f), ("icon_", ic)]:
        df[pre + "wind_speed"] = np.hypot(x[:, 0], x[:, 1])
        df[pre + "wind_direction"] = np.degrees(np.arctan2(-x[:, 0], -x[:, 1])) % 360
        df[pre + "wind_gusts"] = x[:, 2]
    df["run_init"] = pd.Timestamp(lib.ifs_init[i] * 3600, unit="s", tz="UTC")
    return df


class _IfsRuns:
    """fra.singleruns seen through the module interface fra.dataset._live_single_runs expects (MODEL, NAMES, _frame)."""
    MODEL = "ecmwf_ifs"
    NAMES = {"wind_speed_10m": "wind_speed", "wind_direction_10m": "wind_direction", "wind_gusts_10m": "wind_gusts"}

    @staticmethod
    def _frame(payload, init):
        from fra import singleruns
        return singleruns._frame(payload, init, _IfsRuns.NAMES)


def live_forecast_frame(issue=None, timeout=(5, 20)) -> pd.DataFrame:
    """Forecast frame for a CURRENT issue with the SAME as-of rules as the library / forecast_frame(): the exact
    ECMWF IFS single run with init <= issue - 6 h (6-hourly cycle) and the exact ICON-D2 run with init <= issue - 4 h
    (3-hourly cycle, treated as missing if more than 12 h older than the issue), both from the Open-Meteo single-runs
    API (fra.dataset._live_single_runs: newest eligible run, else the one a cycle earlier; short timeouts).
    Leads 0..48 after `issue` (default: now floored to the hour); icon_* NaN where D2 has no value (sample_paths then
    falls back to DEFAULT_IFS if D2 misses any of leads 1..42, exactly as for an archived issue)."""
    from fra.dataset import _live_single_runs
    from fra import singleruns_icon
    issue = pd.Timestamp.now("UTC").floor("h") if issue is None else pd.Timestamp(issue)
    issue = (issue.tz_localize("UTC") if issue.tzinfo is None else issue.tz_convert("UTC")).floor("h")
    valid = issue + pd.to_timedelta(np.arange(NL), unit="h")
    ifs = _live_single_runs(_IfsRuns, issue, IFS_BUFFER_H, 6, timeout=timeout, need_h=(0, NL - 1), max_lead=90,
                            user="partb")
    init = pd.Timestamp(ifs["init"].iloc[0])
    ifs = ifs.drop_duplicates("valid").set_index("valid").reindex(valid)
    df = pd.DataFrame({"lead": np.arange(NL), "valid": valid})
    for c in ["wind_speed", "wind_direction", "wind_gusts"]:
        df[c] = ifs[c].to_numpy(float)
    df["run_init"] = init
    df["icon_run_init"] = pd.NaT
    try:
        icon = _live_single_runs(singleruns_icon, issue, ICON_BUFFER_H, 3, timeout=timeout, need_h=(0, NL - 1),
                                 max_lead=48, user="partb")
        cinit = pd.Timestamp(icon["init"].iloc[0])
        if issue - cinit > pd.Timedelta(hours=12):          # library rule: stale ICON run -> missing
            raise RuntimeError(f"ICON-D2 run {cinit} too old")
        icon = icon.drop_duplicates("valid").set_index("valid").reindex(valid)
        icon.loc[(icon.index - cinit) > pd.Timedelta(hours=48)] = np.nan   # library: run leads 0..48 only
        for c in ["wind_speed", "wind_direction", "wind_gusts"]:
            df["icon_" + c] = icon[c].to_numpy(float)
        df["icon_run_init"] = cinit
    except Exception as ex:  # ICON down -> IFS-only fallback in sample_paths
        print("ICON-D2 single run unavailable:", str(ex)[:160])
    return df


def _lib_spread(lib: Library, i: int) -> np.ndarray:
    d = lib.fc["ifs"][i, :, :2] - lib.fc["icon"][i, :, :2]
    return np.hypot(d[:, 0], d[:, 1])


def _frame_to_fc(frame: pd.DataFrame, issue: pd.Timestamp, source: str) -> tuple:
    """Forecast frame (leads 0..48 or valid times) -> ([49, 3] u, v, gust for the chosen source, [49] |IFS-ICON|)."""
    f = frame.copy()
    if "lead" not in f:
        f["lead"] = ((pd.to_datetime(f["valid"], utc=True) - issue).dt.total_seconds() // 3600).astype(int)
    f = f.set_index("lead").reindex(np.arange(NL))
    u, v = uv_from_sd(f["wind_speed"], f["wind_direction"])
    out = np.stack([u, v, f["wind_gusts"].to_numpy(float)], axis=-1)
    spread = np.full(NL, np.nan)
    if "icon_wind_speed" in f:
        iu, iv = uv_from_sd(f["icon_wind_speed"], f["icon_wind_direction"])
        ic = np.stack([iu, iv, f["icon_wind_gusts"].to_numpy(float)], axis=-1)
        spread = np.hypot(u - iu, v - iv)
        if source == "cons":
            out = np.where(np.isnan(ic), out, 0.5 * (out + ic))
    return out, spread


def sample_paths(issue_time, forecast_frame: pd.DataFrame | None = None, n: int = 200,
                 params: Params = DEFAULT, obs_now_uvg=None, seed: int | None = 0,
                 lib: Library | None = None) -> Paths | None:
    """N simulated ACTUAL-wind paths for leads 1..48 after `issue_time`.

    forecast_frame: the deterministic forecast available at the issue (columns lead 0..48 or valid, wind_speed,
      wind_direction, wind_gusts; optional icon_wind_speed/icon_wind_direction/icon_wind_gusts for the consensus).
      None -> rebuilt from the archives (historical issues only).
    obs_now_uvg: (u, v, gust) of the latest METAR at/before the issue (kt). None -> looked up in the METAR archive
      (only reports <= issue_time). Lead 0 of the forecast must be present for the short-lead conditioning.
    Only library paths whose observations were complete before issue_time are used (strict walk-forward).
    Returns None if fewer than params.min_lib eligible library entries exist.
    """
    lib = lib or load_library()
    issue = pd.Timestamp(issue_time)
    issue = issue.tz_convert("UTC") if issue.tzinfo else issue.tz_localize("UTC")
    issue = issue.floor("h")
    if forecast_frame is None:
        forecast_frame = globals()["forecast_frame"](issue, lib)
    has_icon = "icon_wind_speed" in forecast_frame and \
        bool(pd.Series(forecast_frame["icon_wind_speed"]).iloc[1:43].notna().all())
    params = _fallback(params, has_icon)
    fc_t, spread_t = _frame_to_fc(forecast_frame, issue, params.source)
    fc_ifs_t = _frame_to_fc(forecast_frame, issue, "ifs")[0]
    if obs_now_uvg is None:
        o = obs_now([issue]).iloc[0]
        obs_now_uvg = np.array([o.u, o.v, o.gust], float)
    r_now = np.asarray(obs_now_uvg, float) - fc_t[0]
    s = get_sampler(params, lib)
    rng = np.random.default_rng(seed)
    sim, info = s.sample(int(_hours([issue])[0]), fc_t, r_now, n, rng, spread_t=spread_t, fc_ifs_t=fc_ifs_t)
    if sim is None:
        return None
    valid = issue + pd.to_timedelta(np.arange(1, HORIZON + 1), unit="h")
    info["picked_tau"] = pd.to_datetime(lib.tau[info["picked_tau"]] * 3600, unit="s", utc=True)
    return Paths(issue=issue, valid=pd.DatetimeIndex(valid), u=sim[..., 0], v=sim[..., 1], gust=sim[..., 2],
                 info=info)


FEATURES = ["pw_tw25_gt0", "pw_tw25_gt5", "pw_tw25_mean", "pw_tw25_sd", "pw_tw25_q10", "pw_tw25_q90",
            "pw_tw25_max6_gt5", "pw_tw18_mean", "pw_gtw18_ge15", "pw_ess"]


def path_features(rows: pd.DataFrame, n: int = 200, params: Params = DEFAULT, seed: int = 0,
                  lib: Library | None = None) -> pd.DataFrame:
    """Summary features for a batch of (issue, lead) rows (lead 1..48), from the archived as-of forecasts.

    Leakage-free by construction: every issue only uses library paths verified before it (walk-forward).
      pw_tw25_gt0 / _gt5  P(actual tailwind on 25 > 0 / > 5 kt) at the valid time
      pw_tw25_mean / _sd / _q10 / _q90  simulated actual tailwind on 25
      pw_tw25_max6_gt5    P(tailwind on 25 > 5 kt in at least one hour of valid-5h..valid) (path functional)
      pw_tw18_mean        mean simulated tailwind on 18;  pw_gtw18_ge15  P(gust tailwind on 18 >= 15 kt)
      pw_ess              effective number of analogue paths behind the issue
    Rows whose issue is outside the archive or has too little eligible history get NaN.
    """
    lib = lib or load_library()
    samplers = {True: get_sampler(_fallback(params, True), lib), False: get_sampler(_fallback(params, False), lib)}
    rows = rows[["issue", "lead"]].copy()
    rows["issue"] = pd.to_datetime(rows["issue"], utc=True)
    out = np.full((len(rows), len(FEATURES)), np.nan)
    rng = np.random.default_rng(seed)
    for issue, idx in rows.groupby("issue").indices.items():
        i = int(lib.index_of([issue])[0])
        if i < 0:
            continue
        s = samplers[bool(lib.has_icon[i])]
        fc_t = lib.fc[s.p.source][i]
        if np.isnan(fc_t[1:, :2]).any():
            continue
        r_now = lib.now[i] - fc_t[0]
        sim, info = s.sample(int(lib.tau[i]), fc_t, r_now, n, rng, spread_t=_lib_spread(lib, i),
                             fc_ifs_t=lib.fc["ifs"][i])
        if sim is None:
            continue
        tw25 = tw_from_uv(sim[..., 0], sim[..., 1], H25)
        tw18 = tw_from_uv(sim[..., 0], sim[..., 1], H18)
        sp = np.hypot(sim[..., 0], sim[..., 1])
        with np.errstate(invalid="ignore", divide="ignore"):
            gtw18 = np.where(sp > 0, sim[..., 2] * tw18 / sp, 0.0)
        hit5 = (tw25 > 5).astype(float)
        cs = np.concatenate([np.zeros((n, 1)), np.cumsum(hit5, axis=1)], axis=1)   # any hit in [L-5, L]
        leads = rows["lead"].to_numpy()[idx].astype(int)
        ok = (leads >= 1) & (leads <= HORIZON)
        li = np.clip(leads, 1, HORIZON) - 1
        lo = np.clip(li - 5, 0, None)
        any6 = ((cs[:, li + 1] - cs[:, lo]) > 0).mean(0)
        t = tw25[:, li]
        f = np.column_stack([(t > 0).mean(0), (t > 5).mean(0), t.mean(0), t.std(0), np.quantile(t, 0.1, axis=0),
                             np.quantile(t, 0.9, axis=0), any6, tw18[:, li].mean(0),
                             (gtw18[:, li] >= 15).mean(0), np.full(len(li), info["ess"])])
        f[~ok] = np.nan
        out[idx] = f
    return pd.concat([rows.reset_index(drop=True), pd.DataFrame(out, columns=FEATURES)], axis=1)


if __name__ == "__main__":
    import time
    t0 = time.time()
    lib = load_library()
    print("library", len(lib.tau), lib.meta, f"usable={lib.complete.sum()} icon={lib.has_icon.sum()}",
          f"{time.time()-t0:.1f}s")
    issue = pd.Timestamp("2026-10-20 12:00", tz="UTC")
    p = sample_paths(issue)
    ff = forecast_frame(issue)
    print(p.info["n_eligible"], "eligible, ess", round(p.info["ess"], 1))
    q = np.quantile(p.tw25, [0.1, 0.5, 0.9], axis=0)
    from fra.rules import tailwind
    det = tailwind(ff.wind_speed, ff.wind_direction, 250)[1:]
    for L in [1, 6, 12, 24, 36, 48]:
        print(f"lead {L:2d}: fc tw25 {det[L-1]:6.1f}  sim q10/50/90 {q[0, L-1]:6.1f} {q[1, L-1]:6.1f} {q[2, L-1]:6.1f}"
              f"  P(>0)={np.mean(p.tw25[:, L-1] > 0):.2f}")
