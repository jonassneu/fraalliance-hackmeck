"""Phase 3 / Part A: what the airport does, given the ACTUAL wind (hourly decision / transition model).

    P(OD_h = 25 | OD_{h-1}, actual wind around hour h, calendar)

Used two ways:
  * fitted on flown labels (fra.labels) + observed wind (METAR, optional ERA5 100 m) -- now on 2026 data, later on
    the 12-year FANOMOS history;
  * rolled out hour by hour along simulated wind paths (Part B, fra/fcerror.py) to give P(OD 25) per future hour,
    P(any change within 48 h) and the distribution of the first-change hour (`rollout`).

Conventions
-----------
* Label hour h = the hour STARTING at h (UTC), as in fra.labels / fra.dataset.
* Wind hour h = the observed wind AT time h: METAR/SPECI reports in (h-1h, h] are averaged (u, v) and assigned to h
  (ceil, as fra.dataset.hourly_metar). An NWP value valid at h maps to wind hour h. At issue time t the wind hours
  <= t are observed (the METAR of t-0:10 is out), wind hours > t are the future.
* What is known at issue time t (fra.dataset.KNOWN_LAG_H = 2): the flown OD of the last COMPLETELY published radar
  hour [t-2h, t-1h) (label hour t-2; FANOMOS publishes ~60-75 min late) and the observed wind up to wind hour t.
  A rollout therefore starts from od_now = label of hour t-2 at label hour t-1, simulates the in-progress hours t-1
  and t with the OBSERVED wind (look-ahead from the paths) and continues on the simulated paths: step s == label
  hour t-1+s, lead L (label hour t+L, as in fra.dataset) == step L+1 (fra.blend.rollout_issue does the bookkeeping).
  With the legacy rule (lag 1) the rollout started at label hour t from the label of hour t-1 (step k == lead k).
* Night ban (23-05 local): the labels carry the last evening OD through the night (ffill), so the state is frozen at
  local hours 23..04. The first morning hour (05 local) gets its own transition ("morning"): the OD flown at 05 vs.
  the OD carried from the evening. About 30 % of the +1 h "switches" of the lead-based model are this carry-over.
* Asymmetric: one sub-model per previous OD (25 / 07), each predicting P(keep the OD) from features expressed
  relative to the ACTIVE runway: twA = tailwind on the runway in use (tw25 under OD 25, tw07 = -tw25 under OD 07).

Wind path contract (Part B)
---------------------------
wind_paths: float array [N, PAST + H + FUT, C] with channels `CHANNELS` (+ "u100", "v100" if the model uses 100 m
wind), all in kt:
    u, v   mean 10 m wind vector, direction the air moves TO (u east, v north; u = -spd*sin(dir_from))
    gust   gust speed (>= mean speed; METAR gust group, else the mean speed)
axis 1 = `path_hours(start_hour, H)` = wind hours start_hour-PAST .. start_hour+H-1+FUT (FUT = 6). Entries at hours
<= start_hour are observed at issue time (use `obs_path`), later hours are simulated.

Training rows (`transitions`): only directly observed consecutive hour pairs (west_frac notna for h-1 and h, i.e.
>= 4 movements each), plus "morning" rows (first hour 05 local observed, previous OD = OD carried through the
night from an evening hour observed <= 8 h earlier). Forward-filled hours are never targets.

Quick use
---------
    from fra import decision as D
    model, r18, obs, F = D.fit_default(D.DEFAULT, before=issue)       # only rows whose wind/labels precede the issue
    # or a fitted bundle (python -m fra.decision): b = D.load_bundle(path); model, r18 = b["od"], b["rwy18"]
    od = D.od_now(labels, issue)                                      # label of hour issue-2h, staleness-checked
    start = issue - pd.Timedelta(hours=1)                             # first label hour not yet published
    W = D.assemble_paths(D.load_obs(fill_gap_h=0), start, future_uvg, H=50, valid=paths.valid, obs_until=issue)
    out = D.rollout(model, od, W, start, H=50, rwy18=r18)             # p25 per step (lead L = step L+1), p_change,
                                                                      # first_change, p18_open; anticipate="mean"
    # fra.blend.rollout_issue wraps exactly this (and maps steps to leads)
Model choice (DEFAULT / DEFAULT_100M / UPPER_100M) and walk-forward results: experiments/parta/REPORT.md; the
integration into the production forecast (fra/blend.py): experiments/integration/REPORT.md.
"""

import pickle
import warnings
from pathlib import Path

import numpy as np
import pandas as pd

DATA = Path(__file__).resolve().parent.parent / "data"
TZ = "Europe/Berlin"
CHANNELS = ("u", "v", "gust")
PAST, FUT = 6, 6
NIGHT_LOCAL = (23, 0, 1, 2, 3, 4)   # state frozen (labels carry the evening OD)
MORNING_LOCAL = 5                   # first hour after the night ban
COVID = (pd.Timestamp("2020-03-01", tz="UTC"), pd.Timestamp("2022-01-01", tz="UTC"))
DUR_CAP = 48


# ------------------------------------------------------------------------------------------------ wind geometry

def uv(speed, direction_from):
    """Wind vector (towards) from speed and meteorological direction (from)."""
    d = np.radians(np.asarray(direction_from, dtype=float))
    s = np.asarray(speed, dtype=float)
    return -s * np.sin(d), -s * np.cos(d)


def tailwind_uv(u, v, heading):
    """Tailwind component for a runway heading (same sign convention as fra.rules.tailwind)."""
    h = np.radians(heading)
    return u * np.sin(h) + v * np.cos(h)


def crosswind_uv(u, v, heading):
    """Signed crosswind: + = wind from the right of the heading (for 250: from the north side)."""
    h = np.radians(heading)
    return -(u * np.cos(h) - v * np.sin(h))


# ------------------------------------------------------------------------------------------------ observations

def _metar_hourly(path):
    """Hourly wind (wind hour h = METAR/SPECI reports in (h-1h, h]) from a METAR parquet path or an IEM METAR frame
    (fra.weather.metar(): columns drct, sknt, gust; UTC index), e.g. the live fetch at issue time."""
    m = path if isinstance(path, pd.DataFrame) else pd.read_parquet(path)
    if not isinstance(m.index, pd.DatetimeIndex):
        m = m.set_index(next(c for c in ["time", "valid"] if c in m.columns))
    m.index = pd.to_datetime(m.index, utc=True)
    m = m[~m.index.duplicated(keep="last")].sort_index()
    spd = m["sknt"].astype(float)
    drct = m["drct"].astype(float)
    u, v = uv(spd, drct.fillna(0))
    vrb = drct.isna()                       # VRB: no usable direction (almost always <= 3 kt) -> no tailwind
    u, v = np.where(vrb, 0.0, u), np.where(vrb, 0.0, v)
    gust = np.fmax(m["gust"].astype(float).to_numpy(), spd.to_numpy())
    df = pd.DataFrame({"u": u, "v": v, "gust": gust}, index=m.index)
    df = df[spd.notna().to_numpy()]
    idx = df.index.ceil("h")
    h = df.groupby(idx).agg({"u": "mean", "v": "mean", "gust": "max"})
    h.index.name = "time"
    return h.asfreq("h")


def _era5_hourly(path):
    """Optional ERA5 100 m wind: columns u100/v100 (kt) or wind_speed_100m (kt) + wind_direction_100m."""
    e = pd.read_parquet(path)
    if "time" in e.columns:
        e = e.set_index("time")
    e.index = pd.DatetimeIndex(e.index).tz_localize("UTC") if e.index.tz is None else e.index.tz_convert("UTC")
    if {"u100", "v100"} <= set(e.columns):
        return e[["u100", "v100"]].astype(float)
    if {"wind_speed_100m", "wind_direction_100m"} <= set(e.columns):
        u, v = uv(e["wind_speed_100m"], e["wind_direction_100m"])
        return pd.DataFrame({"u100": u, "v100": v}, index=e.index)
    raise ValueError(f"{path}: need u100/v100 or wind_speed_100m/wind_direction_100m")


def load_obs(metar=None, era5=None, fill_gap_h=3):
    """Hourly ACTUAL wind (index = wind hour, UTC): u, v, gust [kt] (+ u100, v100 if ERA5 is available).
    Uses data/metar_full.parquet if it exists (long history), else data/metar.parquet."""
    if metar is None:
        metar = DATA / "metar_full.parquet" if (DATA / "metar_full.parquet").exists() else DATA / "metar.parquet"
    obs = _metar_hourly(metar)
    if era5 is None and (DATA / "era5.parquet").exists():
        era5 = DATA / "era5.parquet"
    if era5 is not None:
        try:
            obs = obs.join(_era5_hourly(era5), how="left")
        except Exception as ex:  # optional input
            warnings.warn(f"ERA5 ignored: {ex}")
    return obs.interpolate(limit=fill_gap_h, limit_area="inside") if fill_gap_h else obs


# ------------------------------------------------------------------------------------------------ features

def _shift(x, k):
    """y[:, t] = x[:, t + k] (NaN outside)."""
    y = np.full_like(x, np.nan)
    if k > 0:
        y[:, :-k] = x[:, k:]
    elif k < 0:
        y[:, -k:] = x[:, :k]
    else:
        y[:] = x
    return y


def _win(x, offsets, how):
    s = np.stack([_shift(x, k) for k in offsets])
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", RuntimeWarning)
        return getattr(np, "nan" + how)(s, axis=0)


NEXT = range(1, 4)              # h+1 .. h+3: the airport anticipates (its own forecast); actual wind as the proxy
LATER = range(4, FUT + 1)       # h+4 .. h+6
PREV = range(-PAST, 0)          # h-6 .. h-1


def wind_features(W, channels=CHANNELS):
    """Windowed actual-wind features from W [N, T, C] -> dict of [N, T] arrays (value for wind hour index t).
    The SAME function builds training features (N = 1, the observed series) and rollout features (N paths)."""
    W = np.asarray(W, dtype=float)
    ch = {c: W[:, :, i] for i, c in enumerate(channels)}
    u, v = ch["u"], ch["v"]
    spd = np.hypot(u, v)
    gust = np.fmax(ch.get("gust", spd), spd)
    gfac = np.where(spd > 0.5, gust / np.maximum(spd, 0.5), 1.0)
    tw25, tw18 = tailwind_uv(u, v, 250.0), tailwind_uv(u, v, 180.0)
    tw25g, tw18g = tw25 * gfac, tw18 * gfac
    f = {"spd_0": spd, "gust_0": gust, "tw25_0": tw25, "xw25_0": crosswind_uv(u, v, 250.0),
         "tw25_m1": _shift(tw25, -1),
         "tw25_n3mean": _win(tw25, NEXT, "mean"), "tw25_n3max": _win(tw25, NEXT, "max"),
         "tw25_n3min": _win(tw25, NEXT, "min"),
         "tw25_f6mean": _win(tw25, LATER, "mean"), "tw25_f6max": _win(tw25, LATER, "max"),
         "tw25_f6min": _win(tw25, LATER, "min"),
         "tw25_p6mean": _win(tw25, PREV, "mean"), "tw25_p6max": _win(tw25, PREV, "max"),
         "tw25_p6min": _win(tw25, PREV, "min"),
         "tw25g_0": tw25g, "tw25g_n3max": _win(tw25g, NEXT, "max"), "tw25g_n3min": _win(tw25g, NEXT, "min"),
         "tw18_0": tw18, "tw18g_0": tw18g, "tw18_n3max": _win(tw18, NEXT, "max"),
         "tw18g_n3max": _win(tw18g, NEXT, "max"), "xw18g_0": np.abs(crosswind_uv(u, v, 180.0)) * gfac}
    if "u100" in ch and "v100" in ch:
        t100 = tailwind_uv(ch["u100"], ch["v100"], 250.0)
        f.update({"tw25h_0": t100, "tw25h_n3mean": _win(t100, NEXT, "mean"),
                  "tw25h_n3max": _win(t100, NEXT, "max"), "tw25h_n3min": _win(t100, NEXT, "min"),
                  "tw25h_p6mean": _win(t100, PREV, "mean"),
                  "tw18h_0": tailwind_uv(ch["u100"], ch["v100"], 180.0)})
    return f


def calendar(times):
    """Calendar / era features for label hours (UTC DatetimeIndex)."""
    t = pd.DatetimeIndex(times)
    loc = t.tz_convert(TZ)
    lh = loc.hour.to_numpy()
    yr = (t.year + (t.day_of_year - 1) / 365.25).to_numpy()
    return pd.DataFrame({
        "local_hour": lh,
        "hour_sin": np.sin(2 * np.pi * lh / 24), "hour_cos": np.cos(2 * np.pi * lh / 24),
        "night": np.isin(lh, NIGHT_LOCAL).astype(float),
        "morning": (lh == MORNING_LOCAL).astype(float),
        "weekend": (loc.day_of_week >= 5).astype(float),
        "doy_sin": np.sin(2 * np.pi * t.day_of_year / 365.25), "doy_cos": np.cos(2 * np.pi * t.day_of_year / 365.25),
        "year": yr - 2026.0,
        "covid": ((t >= COVID[0]) & (t < COVID[1])).astype(float),
    }, index=t)


def features(obs, labels=None, channels=None):
    """Per-label-hour feature frame from the hourly ACTUAL wind `obs` (load_obs()). If `labels` is given
    (fra.labels.to_labels frame) adds od, od_prev (label of h-1), observation flags and hours in the current OD."""
    channels = channels or [c for c in (*CHANNELS, "u100", "v100") if c in obs.columns]
    obs = obs.asfreq("h")
    wf = wind_features(obs[list(channels)].to_numpy()[None], channels)
    F = pd.DataFrame({k: v[0] for k, v in wf.items()}, index=obs.index)
    F = F.join(calendar(obs.index))
    if labels is not None:
        F = attach_labels(F, labels)
    return F


def hours_in_od(od):
    """Consecutive hours the (ffilled) OD has been unchanged, up to and including each hour (NaN-safe)."""
    od = pd.Series(od).astype(float)
    grp = (od != od.shift()).cumsum()
    return od.groupby(grp).cumcount().add(1).where(od.notna())


def attach_labels(F, labels):
    lab = labels.reindex(F.index)
    F = F.copy()
    F["od"] = lab["od"].to_numpy()
    F["observed"] = lab["west_frac"].notna().to_numpy()
    F["od_prev"] = lab["od"].shift(1).to_numpy()
    F["observed_prev"] = lab["west_frac"].notna().shift(1, fill_value=False).to_numpy()
    F["dur_prev"] = hours_in_od(lab["od"]).shift(1).clip(upper=DUR_CAP).to_numpy()
    ns = F.index.as_unit("ns").asi8.astype(float)
    obs_t = pd.Series(np.where(F["observed"], ns, np.nan), index=F.index).ffill().shift(1)
    F["gap_prev_h"] = (ns - obs_t.to_numpy()) / 3.6e12  # hours since the last observed hour
    if "rwy18_open" in lab:
        F["rwy18_open"] = lab["rwy18_open"].to_numpy()
    return F


def transitions(F):
    """Training rows: directly observed consecutive pairs (day) + morning rows (05 local vs. evening OD)."""
    lh = F["local_hour"]
    day = F["observed"] & F["observed_prev"] & ~lh.isin(NIGHT_LOCAL) & (lh != MORNING_LOCAL)
    morning = F["observed"] & (lh == MORNING_LOCAL) & F["od_prev"].notna() & (F["gap_prev_h"] <= 8)
    r = F[(day | morning) & F["od"].notna() & F["od_prev"].notna()].copy()
    r["kind"] = np.where(r["morning"] > 0, "morning", "day")
    r["stay"] = (r["od"] == r["od_prev"]).astype(int)
    return r


# ------------------------------------------------------------------------------------------------ design

def _active(F, prev):
    """Features relative to the active runway under previous OD `prev` (25 or 7)."""
    s = 1.0 if prev == 25 else -1.0
    g = lambda c: F[c].to_numpy(dtype=float)
    mx = lambda a, b: g(a) if s > 0 else -g(b)   # max of s*x = -min(x) when s = -1
    X = {"twA_0": s * g("tw25_0"), "twA_m1": s * g("tw25_m1"),
         "twA_n3mean": s * g("tw25_n3mean"), "twA_n3max": mx("tw25_n3max", "tw25_n3min"),
         "twA_n3min": mx("tw25_n3min", "tw25_n3max"),
         "twA_f6mean": s * g("tw25_f6mean"), "twA_f6max": mx("tw25_f6max", "tw25_f6min"),
         "twA_f6min": mx("tw25_f6min", "tw25_f6max"),
         "twA_p6mean": s * g("tw25_p6mean"), "twA_p6max": mx("tw25_p6max", "tw25_p6min"),
         "twA_p6min": mx("tw25_p6min", "tw25_p6max"),
         "twAg_0": s * g("tw25g_0"), "twAg_n3max": mx("tw25g_n3max", "tw25g_n3min"),
         "xwA_0": s * g("xw25_0"), "spd_0": g("spd_0")}
    for c in ("hour_sin", "hour_cos", "morning", "weekend", "doy_sin", "doy_cos", "year", "covid"):
        X[c] = g(c)
    X["twA_0_pos"] = np.maximum(X["twA_0"], 0)
    X["twA_n3mean_pos"] = np.maximum(X["twA_n3mean"], 0)
    X["morn_twA_0"] = X["morning"] * X["twA_0"]
    X["morn_twA_n3mean"] = X["morning"] * X["twA_n3mean"]
    if "tw25h_0" in F:
        X["twAh_0"] = s * g("tw25h_0")
        X["twAh_n3mean"] = s * g("tw25h_n3mean")
        X["twAh_n3max"] = mx("tw25h_n3max", "tw25h_n3min")
        X["twAh_p6mean"] = s * g("tw25h_p6mean")
    if "dur_prev" in F:
        X["log_dur"] = np.log1p(np.minimum(g("dur_prev"), DUR_CAP))
    return pd.DataFrame(X, index=F.index)


BASE = ["twA_0", "twA_m1", "twA_n3mean", "twA_n3max", "twA_n3min", "twA_p6mean", "twA_p6max", "twA_p6min",
        "twAg_0", "twAg_n3max", "xwA_0", "spd_0", "hour_sin", "hour_cos", "morning", "morn_twA_0", "morn_twA_n3mean",
        "weekend", "doy_sin", "doy_cos"]
ERA = ["year", "covid"]          # constant on 2025-26 data; matter once trained on 2014+
# more tailwind on the active runway (now / next 6 h / gusts / 100 m) never makes keeping that OD more likely
DECREASING = {"twA_0", "twA_n3mean", "twA_n3max", "twA_n3min", "twAg_0", "twAg_n3max", "twAh_0", "twAh_n3mean",
              "twAh_n3max", "twA_f6mean", "twA_f6max", "twA_f6min", "twA_0_pos", "twA_n3mean_pos"}

F6 = ["twA_f6mean", "twA_f6max", "twA_f6min"]                      # actual wind h+4 .. h+6
H100 = ["twAh_0", "twAh_n3mean", "twAh_n3max", "twAh_p6mean"]        # 100 m wind (ERA5 in training)
HINGE = ["twA_0_pos", "twA_n3mean_pos"]

LGB_PARAMS = dict(n_estimators=300, learning_rate=0.03, num_leaves=7, min_child_samples=30, reg_lambda=5.0,
                  subsample=0.8, subsample_freq=1, colsample_bytree=0.8, n_jobs=1, verbose=-1)
LGB_SMALL = dict(n_estimators=150, num_leaves=4, min_child_samples=50)

# Chosen by weekly walk-forward 2026-06-01 .. 2026-10-31 (experiments/parta/REPORT.md):
#   DEFAULT      10 m wind only (the channels Part B simulates); best with forecast-error inputs (IFS plug-in and
#                Part B paths) and best one-step log-loss among the 10 m sets
#   DEFAULT_100M + 100 m wind channels u100/v100 (ERA5 in training; Part B would have to simulate them)
#   UPPER_100M   LightGBM with monotone constraints: best 'perfect forecast' rollout (actual wind), less robust to
#                noisy wind inputs
DEFAULT = dict(kind="logit", C=0.1, features=BASE + F6)
DEFAULT_100M = dict(kind="logit", C=0.03, features=BASE + H100 + F6)
UPPER_100M = dict(kind="lgbm", features=[f for f in BASE if not f.startswith("morn_")] + H100 + F6,
                  lgb_params=LGB_SMALL)


class DecisionModel:
    """Asymmetric hourly transition model: one sub-model per previous OD predicting P(keep the OD).

    kind="logit": standardised L2 logistic regression (C); kind="lgbm": LightGBM with monotone constraints
    (P(keep) non-increasing in the active-runway tailwind now / next 6 h / gusts / 100 m, see DECREASING).
    Defaults = DEFAULT (logit, C 0.1, BASE + F6)."""

    def __init__(self, kind="logit", C=0.1, features=None, lgb_params=None, monotone=True):
        self.kind, self.C, self.monotone = kind, C, monotone
        self.features = list(features or BASE + F6)
        self.lgb_params = {**LGB_PARAMS, **(lgb_params or {})}
        self.sub = {}

    @property
    def uses_duration(self):
        return "log_dur" in self.features

    @property
    def channels(self):
        """Wind path channels this model needs (100 m wind only if a 100 m feature is used)."""
        return CHANNELS + (("u100", "v100") if any(c.startswith("twAh") for c in self.features) else ())

    def fit(self, rows):
        for prev in (25, 7):
            r = rows[rows["od_prev"] == prev]
            X, y = _active(r, prev)[self.features], r["stay"].to_numpy()
            if len(np.unique(y)) < 2:
                self.sub[prev] = ("const", float(y.mean()) if len(y) else 1.0)
                continue
            if self.kind == "logit":
                from sklearn.linear_model import LogisticRegression
                mu, sd = X.mean(), X.std().replace(0, 1).fillna(1)
                Z = ((X - mu) / sd).fillna(0).to_numpy()
                m = LogisticRegression(C=self.C, max_iter=5000).fit(Z, y)
                self.sub[prev] = ("logit", (mu, sd, m))
            else:
                import lightgbm as lgb
                mono = [-1 if (c in DECREASING and self.monotone) else 0 for c in self.features]
                m = lgb.LGBMClassifier(monotone_constraints=mono, **self.lgb_params).fit(X, y)
                self.sub[prev] = ("lgbm", m)
        self.n_train = {p: int((rows["od_prev"] == p).sum()) for p in (25, 7)}
        self.n_switch = {p: int(((rows["od_prev"] == p) & (rows["stay"] == 0)).sum()) for p in (25, 7)}
        return self

    def p_stay(self, F, prev):
        """P(OD_h == prev | OD_{h-1} == prev, features of hour h). Night-ban hours: 1 (state frozen)."""
        kind, m = self.sub[prev]
        if kind == "const":
            p = np.full(len(F), m)
        else:
            X = _active(F, prev)[self.features]
            if kind == "logit":
                mu, sd, lr = m
                p = lr.predict_proba(((X - mu) / sd).fillna(0).to_numpy())[:, 1]
            else:
                p = m.predict_proba(X)[:, 1]
        return np.where(F["night"].to_numpy() > 0, 1.0, p)

    def predict_transition(self, F, od_prev):
        """P(OD_h = 25 | OD_{h-1} = od_prev, actual wind around h)."""
        od_prev = np.broadcast_to(np.asarray(od_prev, dtype=float), (len(F),))
        out = np.full(len(F), np.nan)
        for prev in (25, 7):
            m = od_prev == prev
            if m.any():
                ps = self.p_stay(F[m], prev)
                out[m] = ps if prev == 25 else 1 - ps
        return out

    def coefficients(self):
        """Standardised logistic coefficients per sub-model (logit kind only)."""
        out = {}
        for prev, (kind, m) in self.sub.items():
            if kind == "logit":
                out[prev] = pd.Series(m[2].coef_[0], index=self.features)
        return pd.DataFrame(out)

    def save(self, path):
        tmp = Path(str(path) + ".tmp")
        with open(tmp, "wb") as f:
            pickle.dump(self, f)
        tmp.replace(path)

    @staticmethod
    def load(path):
        """A pickled DecisionModel, or the decision model of a bundle written by `python -m fra.decision`."""
        obj = load_bundle(path)
        return obj["od"] if isinstance(obj, dict) else obj


def load_bundle(path):
    """Unpickle a file written by `python -m fra.decision` -> dict {od: DecisionModel, rwy18: Rwy18Model, spec,
    history, trained_until} (or whatever object the file holds)."""
    with open(path, "rb") as f:
        return pickle.load(f)


# ------------------------------------------------------------------------------------------------ rollout

def path_hours(start_hour, H=49):
    """Wind hours covered by a wind path for a rollout of H steps starting at label hour `start_hour`."""
    return pd.date_range(pd.Timestamp(start_hour) - pd.Timedelta(hours=PAST), periods=PAST + H + FUT, freq="h")


def obs_path(obs, start_hour, H=49, channels=CHANNELS):
    """Observed wind for path_hours() as [1, T, C] (the 'perfect forecast' path; NaN where unobserved)."""
    return obs[list(channels)].reindex(path_hours(start_hour, H)).to_numpy()[None]


def assemble_paths(obs, start_hour, future, H=49, channels=CHANNELS, valid=None, hold_last=True, obs_until=None):
    """Wind paths for `rollout` from simulated futures [N, L, C] (channels in `channels` order).
    Wind hours <= obs_until (default start_hour) come from the observations (known at issue time: with a rollout
    started before the issue, obs_until = the issue time); later hours from `future`:
    future[:, j] is wind hour `valid[j]` if given (e.g. Part B Paths.valid), else obs_until + 1 + j.
    hold_last: hours after the last simulated one (Part B stops at lead 48, the look-ahead windows of the last steps
    reach lead 54) repeat the last simulated hour; otherwise they stay NaN."""
    future = np.asarray(future, dtype=float)
    if future.ndim == 2:
        future = future[None]
    N, L = future.shape[:2]
    n_obs = 0 if obs_until is None else int((pd.Timestamp(obs_until) - pd.Timestamp(start_hour))
                                            // pd.Timedelta(hours=1))
    if n_obs < 0:
        raise ValueError("obs_until before start_hour")
    last_obs = PAST + n_obs                     # path index of the last observed wind hour
    W = np.repeat(obs_path(obs, start_hour, H, channels), N, axis=0)
    W[:, last_obs + 1:] = np.nan
    if valid is None:
        pos = last_obs + 1 + np.arange(L)
    else:
        pos = PAST + ((pd.DatetimeIndex(valid) - pd.Timestamp(start_hour)) // pd.Timedelta(hours=1)).to_numpy()
    ok = (pos > last_obs) & (pos < W.shape[1])
    W[:, pos[ok]] = future[:, ok]
    if hold_last and ok.any() and pos[ok].max() + 1 < W.shape[1]:
        W[:, pos[ok].max() + 1:] = W[:, [pos[ok].max()]]
    return W


ANTICIPATION = ("_n3", "_f6")   # feature-name parts of the look-ahead windows (h+1 .. h+6)


def _step_frame(W, starts, H, channels, W_ant=None):
    """Flat feature frame for M rollout rows x H steps (row-major) from W [M, T, C] and per-row start hours.
    W_ant (same shape): if given, the look-ahead window features come from W_ant instead of W."""
    wf = wind_features(W, channels)
    if W_ant is not None:
        wa = wind_features(np.asarray(W_ant, dtype=float), channels)
        wf.update({k: v for k, v in wa.items() if any(a in k for a in ANTICIPATION)})
    sl = slice(PAST, PAST + H)
    starts = pd.DatetimeIndex(starts).as_unit("ns")
    times = (starts.asi8[:, None] + np.arange(H)[None, :] * 3_600_000_000_000).ravel()
    t = pd.DatetimeIndex(times.astype("datetime64[ns]")).tz_localize("UTC")
    F = pd.DataFrame({k: v[:, sl].ravel() for k, v in wf.items()})
    return pd.concat([F, calendar(t).reset_index(drop=True)], axis=1)   # positional: hours repeat across rows


def _check_od(od):
    """OD state(s) as a float array; refuses anything but 25 / 7 (a NaN/None current OD must not silently become 07)."""
    a = np.asarray(od, dtype=float)
    if not np.isin(a, (25.0, 7.0)).all():
        bad = np.unique(a[~np.isin(a, (25.0, 7.0))])
        raise ValueError(f"od_now must be 25 or 7, got {bad[:5]} -- use decision.od_now(labels, issue) for a "
                         "staleness-checked current OD")
    return a


def od_now(labels, issue, max_stale_h=6, lag_h=None):
    """Current OD for a rollout from `issue`: the label of the last completely published radar hour, issue - lag_h
    (default fra.dataset.KNOWN_LAG_H = 2: the hour [t-2h, t-1h); lag_h=1: the legacy hour [t-1h, t)), or, if that hour
    is missing (not fetched yet / not observed), the most recent label before it that is at most `max_stale_h` hours
    older. Labels already carry the night-ban forward fill (fra.labels, up to 8 h, so the underlying observation can
    be older). Raises ValueError if nothing recent enough exists, so callers fall back explicitly instead of getting a
    confident wrong forecast."""
    from fra.dataset import KNOWN_LAG_H
    t = pd.Timestamp(issue)
    t = t.tz_localize("UTC") if t.tzinfo is None else t.tz_convert("UTC")
    last = t - pd.Timedelta(hours=KNOWN_LAG_H if lag_h is None else lag_h)
    s = labels["od"].loc[:last].dropna()
    if not len(s) or s.index[-1] < last - pd.Timedelta(hours=max_stale_h):
        seen = s.index[-1] if len(s) else None
        raise ValueError(f"no OD label within {max_stale_h} h before {last} (latest: {seen})")
    return int(_check_od(s.iloc[-1]))


def rollout_batch(model, od0, starts, W, H=49, channels=None, dur0=None, rwy18=None, W_ant=None):
    """Exact forward recursion for M independent rows (row i: start hour starts[i], previous OD od0[i], wind path
    W[i] of shape [T, C]). W_ant: optional paths for the look-ahead features only (e.g. the ensemble mean = what the
    airport's own forecast expects, instead of each path's noisy future). Returns dict of [M, H] arrays:
        p25        P(OD 25) at step k (label hour start + k)
        p_nochange P(no switch away from od0 in steps 0..k)
        p18_open   P(RWY 18 open) (if `rwy18` model given)
        c25, c07   P(RWY 18 closed | OD 25 / OD 07, the path's wind) (if `rwy18` given), e.g. to combine the
                   closure model with another OD probability
    With a duration-aware model the state is (OD, hours in OD capped at DUR_CAP)."""
    W = np.asarray(W, dtype=float)
    M = W.shape[0]
    od0 = _check_od(od0)
    F = _step_frame(W, starts, H, channels or model.channels, W_ant)
    out = {}
    if not model.uses_duration:
        ps25 = model.p_stay(F, 25).reshape(M, H)
        ps07 = model.p_stay(F, 7).reshape(M, H)
        p = (od0 == 25).astype(float)
        q = np.ones(M)
        P, Q = np.empty((M, H)), np.empty((M, H))
        for k in range(H):
            p = p * ps25[:, k] + (1 - p) * (1 - ps07[:, k])
            q = q * np.where(od0 == 25, ps25[:, k], ps07[:, k])
            P[:, k], Q[:, k] = p, q
    else:
        D = DUR_CAP
        durs = np.arange(1, D + 1, dtype=float)   # state: hours in current OD (1..D, D = "D or more")
        ps = {}
        for prev in (25, 7):
            arr = np.empty((M, H, D))
            for j, d in enumerate(durs):
                arr[:, :, j] = model.p_stay(F.assign(dur_prev=d), prev).reshape(M, H)
            ps[prev] = arr
        d0 = np.clip(np.nan_to_num(np.asarray(dur0 if dur0 is not None else np.full(M, D), float), nan=D), 1, D)
        s25 = np.zeros((M, D))
        s07 = np.zeros((M, D))
        rows = np.arange(M)
        s25[rows[od0 == 25], d0[od0 == 25].astype(int) - 1] = 1
        s07[rows[od0 != 25], d0[od0 != 25].astype(int) - 1] = 1
        q = np.ones(M)
        dq = d0.astype(int) - 1
        P, Q = np.empty((M, H)), np.empty((M, H))
        for k in range(H):
            a25, a07 = ps[25][:, k, :], ps[7][:, k, :]
            stay25, stay07 = s25 * a25, s07 * a07
            sw_to07, sw_to25 = (s25 * (1 - a25)).sum(1), (s07 * (1 - a07)).sum(1)
            n25, n07 = np.zeros_like(s25), np.zeros_like(s07)
            n25[:, 1:] = stay25[:, :-1]
            n25[:, -1] += stay25[:, -1]
            n07[:, 1:] = stay07[:, :-1]
            n07[:, -1] += stay07[:, -1]
            n25[:, 0] += sw_to25
            n07[:, 0] += sw_to07
            s25, s07 = n25, n07
            a0 = np.where(od0 == 25, a25[rows, dq], a07[rows, dq])
            q = q * a0                 # night: p_stay == 1 -> frozen, duration still ages
            dq = np.minimum(dq + 1, D - 1)
            P[:, k], Q[:, k] = s25.sum(1), q
    out["p25"], out["p_nochange"] = P, Q
    if rwy18 is not None:
        c25 = rwy18.p_closed(F, 25).reshape(M, H)
        c07 = rwy18.p_closed(F, 7).reshape(M, H)
        out["p18_open"] = 1 - (P * c25 + (1 - P) * c07)
        out["c25"], out["c07"] = c25, c07
    return out


def rollout(model, od_now, wind_paths, start_hour, H=49, channels=None, weights=None, dur_now=None, rwy18=None,
            anticipate="mean"):
    """Simulate the OD hour by hour along N wind paths (exact forward recursion of the state probabilities).

    od_now: flown OD of label hour start_hour - 1, 25 or 7 (ValueError otherwise; `od_now(labels, issue)` gives a
    staleness-checked value; with the publication lag start_hour = issue - 1 h, see the module doc);
    wind_paths [N, PAST+H+FUT, C] (see module doc);
    weights: optional path weights. Returns a dict:
        hours        label hours start_hour .. start_hour+H-1 (step k == lead k)
        p25          P(OD 25) per step (weighted mean over paths); p25_paths [N, H]
        p_change     P(at least one switch away from od_now within the H steps)
        first_change P(the first switch happens at step k), k = 0..H-1 (sums to p_change)
        p18_open     P(RWY 18 open) per step, if `rwy18` is given
    anticipate="mean" (default): the look-ahead features (h+1..h+6) use the (weighted) ensemble-mean path instead of
    each path's own future -- the airport anticipates with a smooth forecast, not with the noisy realised wind; with
    Part B paths (fra/fcerror.py blob 5031bba, 31 Oct) this cut the walk-forward Brier(1,6,24,48) from 0.0432 to
    0.0407, -0.0024 [-0.0037, -0.0011] (experiments/parta/res_e2e_*.json; found after seeing the June-Oct test, so
    to be confirmed on the holdout).
    anticipate="path": each path's own future (use for a single actual-wind path; identical there)."""
    od_now = float(_check_od(od_now))
    W = np.asarray(wind_paths, dtype=float)
    if W.ndim == 2:
        W = W[None]
    N = W.shape[0]
    channels = channels or model.channels
    w = np.full(N, 1.0 / N) if weights is None else np.asarray(weights, float) / np.sum(weights)
    W_ant = None
    if anticipate == "mean":
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", RuntimeWarning)
            W_ant = np.repeat(np.nansum(W * w[:, None, None], axis=0, keepdims=True)
                              / np.sum(np.isfinite(W) * w[:, None, None], axis=0, keepdims=True), N, axis=0)
    r = rollout_batch(model, np.full(N, od_now), [pd.Timestamp(start_hour)] * N, W, H, channels,
                      dur0=None if dur_now is None else np.full(N, dur_now), rwy18=rwy18, W_ant=W_ant)
    q = w @ r["p_nochange"]
    out = {"hours": pd.date_range(pd.Timestamp(start_hour), periods=H, freq="h"),
           "p25": w @ r["p25"], "p25_paths": r["p25"],
           "p_change": float(1 - q[-1]), "first_change": -np.diff(np.concatenate([[1.0], q]))}
    if "p18_open" in r:
        out["p18_open"] = w @ r["p18_open"]
    return out


# ------------------------------------------------------------------------------------------------ RWY 18

# steady (mean) tailwind on 18, positive part, + flown OD. Grouped-by-day CV (experiments/parta/rwy18.py):
# AUC ~0.87, BSS ~0.10 (richer sets with gust / next-3 h / crosswind: no better). METAR gusts are reported in only 2 of
# the closure hours, so steady vs. gust tailwind cannot be told apart with these data.
R18_FEATURES = ["tw18_pos", "od07"]


def rwy18_rows(F, exclude_night=False):
    """Busy departure hours with a RWY 18 judgement (fra.labels: >= 15 moves, local hour >= 6).
    exclude_night: drop the few judged hours inside the night ban (local 23-24 h, delayed departures only: 8 hours,
    1 closed). Off by default: RWY 18 was used in 7 of those 8 hours and in 334 of 336 judged hours at local 22, so
    non-use at the night-ban edge is not the procedural norm (experiments/parta/rwy18.py, counts)."""
    r = F[F["rwy18_open"].notna() & F["od"].notna() & F["tw18_0"].notna()].copy()
    if exclude_night:
        r = r[~np.isin(r["local_hour"].to_numpy(), NIGHT_LOCAL)]
    r["closed"] = (r["rwy18_open"] == 0).astype(int)
    return r


# Documented RWY 18 West outage: taken out of service in May 2020 (COVID), back in operation from 15 Oct 2020
# (press reports, e.g. https://meilenoptimieren.com/newsticker/startbahn-west-am-flughafen-frankfurt-ab-15-oktober-wieder-in-betrieb/).
# The exact first day is not documented; the data-driven rule of rwy18_outage_days finds it.
KNOWN_RWY18_OUTAGES = [(pd.Timestamp("2020-05-01", tz="UTC"), pd.Timestamp("2020-10-15", tz="UTC"))]


def rwy18_outage_days(times, closed, tw18, min_judged=2, calm_kt=8.0, known=True, min_judged_most=8, most=0.9):
    """UTC days that look like a planned RWY 18 West outage (works, the COVID shutdown), not wind closures. Label
    cleaning for the 2014+ history (experiments/history12), same-day information only:
      (a) all-day: >= `min_judged` judged hours, ALL without a RWY 18 departure, at least one of them with steady
          tailwind on 18 < `calm_kt`;
      (b) most of the day (2026-11-03): >= `min_judged_most` judged hours, >= `most` of them closed, and at least half
          of the closed hours with steady tailwind on 18 < `calm_kt`. Rule (a) alone missed 2017-05-25 (16 of 17
          judged hours closed, 12 of them below 8 kt; one RWY 18 departure in one hour), the first day of the works
          that (a) finds on 2017-05-26. Outside the COVID window (b) adds only that day in 2014-2026; partial clusters
          (e.g. 2026-04-13..15: 4-6 low-wind closures a day out of 15-17 judged hours) are not flagged;
      plus, if `known`, every day of KNOWN_RWY18_OUTAGES. Isolated non-wind closure hours stay in (they are the
    model's noise floor)."""
    d = pd.DataFrame({"closed": np.asarray(closed, float), "tw18": np.asarray(tw18, float)},
                     index=pd.DatetimeIndex(times))
    d = d[d["closed"].notna()]
    d["low"] = ((d["closed"] == 1) & (d["tw18"] < calm_kt)).astype(int)
    g = d.groupby(d.index.floor("D"))
    s = pd.DataFrame({"k": g.size(), "c": g["closed"].sum(), "low": g["low"].sum()})
    all_day = (s["k"] >= min_judged) & (s["c"] == s["k"]) & (s["low"] >= 1)
    most_day = (s["k"] >= min_judged_most) & (s["c"] >= most * s["k"]) & (s["low"] >= 0.5 * s["c"])
    days = s.index[all_day | most_day]
    if known:
        for a, b in KNOWN_RWY18_OUTAGES:
            days = days.union(s.index[(s.index >= a) & (s.index < b)])
    return days


def history_rwy18_filter(r18):
    """RWY 18 rows (rwy18_rows) of the 2014+ history without the COVID window (COVID: hours with 15-30 movements and
    no RWY 18 departure are routine non-use, not closures) and without outage days (rwy18_outage_days), as in the
    wave-3 walk-forward (experiments/history12/run.py, step rwy18)."""
    cov = (r18.index >= COVID[0]) & (r18.index < COVID[1])
    out = r18.index.floor("D").isin(rwy18_outage_days(r18.index, r18["closed"], r18["tw18_0"]))
    return r18[~cov & ~out]


class Rwy18Model:
    """P(RWY 18 West closed for departures | actual wind on 18, flown OD). Strongly regularised logistic regression on
    a handful of physical features (39 closure hours, several of them not wind-driven)."""

    def __init__(self, C=0.3, features=None):
        self.C, self.features = C, list(features or R18_FEATURES)

    def _X(self, F, od):
        X = F.copy()
        X["od07"] = (np.broadcast_to(np.asarray(od, dtype=float), (len(F),)) == 7).astype(float)
        X["tw18_pos"] = np.maximum(X["tw18_0"], 0)
        return X[self.features].astype(float)

    def fit(self, rows):
        from sklearn.linear_model import LogisticRegression
        X = self._X(rows, rows["od"])
        self.mu, self.sd = X.mean(), X.std().replace(0, 1)
        self.m = LogisticRegression(C=self.C, max_iter=5000).fit(((X - self.mu) / self.sd).fillna(0).to_numpy(),
                                                                 rows["closed"].to_numpy())
        return self

    def p_closed(self, F, od):
        X = self._X(F, od)
        return self.m.predict_proba(((X - self.mu) / self.sd).fillna(0).to_numpy())[:, 1]

    def coefficients(self):
        """Coefficients in raw units (per kt / per unit), intercept included."""
        b = self.m.coef_[0] / self.sd.to_numpy()
        a = self.m.intercept_[0] - (b * self.mu.to_numpy()).sum()
        return pd.Series(np.r_[a, b], index=["intercept", *self.features])


# ------------------------------------------------------------------------------------------------ convenience

def load_labels(history=False):
    """data/labels.parquet, or (history=True) labels rebuilt from data/inaa_counts.csv + the 2014+ backfill
    data/inaa_counts_history.csv: fra.labels.history_labels() (complete days, label gaps of fra.labels.GAP_RULE
    removed, night-only OD bridge, no RWY 18 judgement in any confirmed suspect hour; the labels the wave-3 runner
    experiments/history12/run.py scores. Before 2026-11-03 this was to_labels(load_counts(include_history=True)) with
    the ffill bridge, which carried the OD across removed gap hours)."""
    if not history:
        return pd.read_parquet(DATA / "labels.parquet")
    from fra.labels import history_labels
    return history_labels()


def load_training(labels=None, obs=None, history=False):
    """(obs, F): actual wind from load_obs() and the per-hour feature frame with labels attached."""
    labels = load_labels(history) if labels is None else labels
    obs = load_obs() if obs is None else obs
    return obs, features(obs, labels)


def fit_default(spec=None, labels=None, obs=None, before=None, history=False, era=None):
    """Fit the decision model (`spec`, default DEFAULT) and the RWY 18 closure model on the rows known at `before`
    (default: everything): transition rows need their look-ahead wind observed (h + FUT h <= before), RWY 18 rows
    their label published (h + fra.dataset.KNOWN_LAG_H h <= before). history=True trains on the 2014+ labels
    (load_labels(history=True)); its RWY 18 rows leave out the COVID window and outage days (history_rwy18_filter);
    era features (year, COVID) are added when the training data spans several years (era=None -> automatic)."""
    spec = dict(spec or DEFAULT)
    obs, F = load_training(labels, obs, history)
    rows = transitions(F)
    r18 = rwy18_rows(F)
    if history:
        r18 = history_rwy18_filter(r18)
    if before is not None:
        from fra.dataset import KNOWN_LAG_H
        rows = rows[rows.index + FUT * pd.Timedelta(hours=1) <= pd.Timestamp(before)]
        r18 = r18[r18.index + KNOWN_LAG_H * pd.Timedelta(hours=1) <= pd.Timestamp(before)]
    if era is None:
        era = rows.index.year.nunique() > 2
    if era:
        spec["features"] = list(spec.get("features") or BASE + F6) + ERA
    model = DecisionModel(**spec).fit(rows)
    return model, Rwy18Model().fit(r18), obs, F


if __name__ == "__main__":
    import argparse
    import fra.decision as _D   # pickle the classes as fra.decision.* (not __main__.*), loadable from any code
    ap = argparse.ArgumentParser(description="Fit the hourly decision model + RWY 18 closure model and pickle them "
                                             "(load with fra.decision.load_bundle / DecisionModel.load).")
    ap.add_argument("out", nargs="?", default=str(Path(__file__).resolve().parent.parent / "experiments/parta/decision_model.pkl"))
    ap.add_argument("--history", action="store_true", help="train on the 2014+ labels (data/inaa_counts_history.csv)")
    ap.add_argument("--spec", default="DEFAULT", choices=["DEFAULT", "DEFAULT_100M", "UPPER_100M"])
    a = ap.parse_args()
    m, r, obs, F = _D.fit_default(getattr(_D, a.spec), history=a.history)
    assert type(m).__module__ == "fra.decision" and type(r).__module__ == "fra.decision"
    tmp = Path(a.out + ".tmp")
    with open(tmp, "wb") as f:
        pickle.dump({"od": m, "rwy18": r, "spec": a.spec, "history": a.history,
                     "trained_until": str(F.index[F["observed"]].max())}, f)
    tmp.replace(a.out)
    print("transition rows", m.n_train, "switches", m.n_switch, "->", a.out)
    if m.kind == "logit":
        print(m.coefficients().round(3).to_string())
    print("RWY18 coefficients (per kt):", r.coefficients().round(3).to_dict())
