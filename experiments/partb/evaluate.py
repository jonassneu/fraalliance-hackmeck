"""Walk-forward validation of the Part B forecast-error model (fra.fcerror).

For every hourly issue time T in the test window, simulated actual-wind paths are drawn ONLY from library paths that
were fully verified before T (tau + 51 h <= T and run init + 61 h <= T), then scored against the observed METAR wind.
Target: tailwind on runway 25 (tw25, kt) at leads 6/24/48 (+ all leads), plus path functionals and the residual
autocorrelation. Baselines: raw deterministic forecast (CRPS = MAE), Gaussian per-lead error model (mean/sd per lead
from the same eligible library, refit weekly), a Gaussian AR model (per-lead mean conditioned on the current error)
and the strong reference run_emos: EMOS/NGR (forecast-conditioned Gaussian fitted by minimum CRPS per lead, refit
weekly on the same eligible library) + a Gaussian copula with the empirical lag correlation for paths.

Usage:
  OMP_NUM_THREADS=1 uv run python -m experiments.partb.evaluate [--grid NAME] [--start 2026-06-01] [--end 2026-10-31]
Writes experiments/partb/results_<grid>.csv (one row per variant) and prints a table.
"""

import os

for _v in ["OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"]:
    os.environ.setdefault(_v, "1")

import argparse  # noqa: E402
import sys  # noqa: E402
import time  # noqa: E402
from dataclasses import replace  # noqa: E402
from multiprocessing import get_context  # noqa: E402
from pathlib import Path  # noqa: E402

import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402
from scipy.stats import norm  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from fra import fcerror as F  # noqa: E402

OUT = Path(__file__).resolve().parent
LEADS = [1, 3, 6, 12, 24, 48]
LAGS = [1, 3, 6]
WINDOWS = [(1, 12), (13, 24), (25, 48)]   # path functional: P(var > thrB in at least one hour of the window)
N = 200
VAR = "tw25"                                # verified variable (set via --var): tw25, tw18, gtw18
THR = {"tw25": (0, 5), "tw18": (0, 5), "gtw18": (5, 15)}   # Brier thresholds (P(var > thr))


def derive(a, var=None):
    """[..., 3] (u, v, gust) -> verified variable."""
    var = var or VAR
    if var == "tw25":
        return F.tw_from_uv(a[..., 0], a[..., 1], F.H25)
    tw18 = F.tw_from_uv(a[..., 0], a[..., 1], F.H18)
    if var == "tw18":
        return tw18
    sp = np.hypot(a[..., 0], a[..., 1])
    with np.errstate(invalid="ignore", divide="ignore"):
        return np.where(sp > 0, a[..., 2] * tw18 / sp, 0.0)

LIB = None


def lib():
    global LIB
    if LIB is None:
        LIB = F.load_library()
    return LIB


def test_issues(start, end, need_icon=True):
    L = lib()
    t = L.times
    m = (t >= pd.Timestamp(start, tz="UTC")) & (t < pd.Timestamp(end, tz="UTC") + pd.Timedelta(days=1))
    m &= L.complete & (L.ifs_init + F.IFS_BUFFER_H <= L.tau)
    if need_icon:
        m &= L.has_icon
    return np.flatnonzero(m)


def _crps_ens(x, y):
    """x [n, m] ensemble (members on axis 0), y [m] -> CRPS [m] (fair-free standard estimator)."""
    n = x.shape[0]
    xs = np.sort(x, axis=0)
    t1 = np.abs(xs - y[None, :]).mean(0)
    k = np.arange(1, n + 1)[:, None]
    t2 = (2 * ((2 * k - n - 1) * xs).sum(0)) / (n * n)
    return t1 - 0.5 * t2


def _crps_gauss(mu, sd, y):
    z = (y - mu) / sd
    return sd * (z * (2 * norm.cdf(z) - 1) + 2 * norm.pdf(z) - 1 / np.sqrt(np.pi))


def truth(idx):
    L = lib()
    y = derive(L.obs[idx, 1:, :])                  # leads 1..48
    bad = L.obs_bad[idx, 1:]
    return np.where(bad, np.nan, y)


def run_variant(args):
    """Simulate all test issues for one Params; returns dict of per-(issue, lead) arrays."""
    name, params, idx, n, seed = args
    L = lib()
    s = F.Sampler(L, params)
    rng = np.random.default_rng(seed)
    src = params.source
    I = len(idx)
    res = {k: np.full((I, 48), np.nan) for k in ["crps", "pit", "in80", "in95", "p0", "p5", "mean", "sd", "fc"]}
    res["fn"] = np.full((I, len(WINDOWS)), np.nan)
    res["member0"] = np.full((I, 48), np.nan)
    res["within_ac"] = np.full((I, len(LAGS)), np.nan)
    res["ess"] = np.full(I, np.nan)
    Y = truth(idx)
    t0 = time.time()
    for j, i in enumerate(idx):
        fc_t = L.fc[src][i]
        r_now = L.now[i] - fc_t[0]
        sim, info = s.sample(int(L.tau[i]), fc_t, r_now, n, rng, spread_t=F._lib_spread(L, i), fc_ifs_t=L.fc["ifs"][i])
        if sim is None:
            continue
        tw = derive(sim)                                            # [n, 48]
        fct = derive(fc_t[1:])
        y = Y[j]
        res["fc"][j] = fct
        res["crps"][j] = _crps_ens(tw, np.nan_to_num(y))
        below, eq = (tw < y).mean(0), (tw == y).mean(0)
        res["pit"][j] = below + rng.random(48) * eq
        q = np.quantile(tw, [0.025, 0.1, 0.9, 0.975], axis=0)
        res["in80"][j] = (y >= q[1]) & (y <= q[2])
        res["in95"][j] = (y >= q[0]) & (y <= q[3])
        ta, tb = THR[VAR]
        res["p0"][j], res["p5"][j] = (tw > ta).mean(0), (tw > tb).mean(0)
        res["mean"][j], res["sd"][j] = tw.mean(0), tw.std(0)
        res["fn"][j] = [(tw[:, a - 1:b] > tb).any(1).mean() for a, b in WINDOWS]
        r = tw - fct[None]
        res["member0"][j] = r[0]
        ac = []
        for lag in LAGS:
            a, b = r[:, :-lag], r[:, lag:]
            a, b = a - a.mean(0), b - b.mean(0)
            ac.append(np.nanmean((a * b).sum(0) / np.sqrt((a * a).sum(0) * (b * b).sum(0) + 1e-12)))
        res["within_ac"][j] = ac
        res["ess"][j] = info["ess"]
        for k in ["crps", "pit", "in80", "in95"]:
            res[k][j][np.isnan(y)] = np.nan
    res["seconds"] = time.time() - t0
    return name, res


def run_gauss(idx, source="ifs", ar=False):
    """Gaussian per-lead error model for tw25 (refit weekly on the eligible library). ar=True: mean conditioned on
    the current error (r_now projected on 25), slope per lead."""
    L = lib()
    s = F.Sampler(L, F.Params(source=source))
    rtw = (derive(L.obs) - derive(s.fc_lib))[:, 1:]                            # [N, 48]
    rnow = derive(L.now) - derive(s.fc_lib[:, 0, :])                          # [N]
    ta, tb = THR[VAR]
    I = len(idx)
    out = {k: np.full((I, 48), np.nan) for k in ["crps", "pit", "in80", "in95", "p0", "p5", "mean", "sd", "fc"]}
    out["fn"] = np.full((I, len(WINDOWS)), np.nan)
    Y = truth(idx)
    cache = {}
    rng = np.random.default_rng(1)
    for j, i in enumerate(idx):
        T = int(L.tau[i])
        wk = T // 168
        if wk not in cache:
            e = s.eligible(wk * 168)
            if len(e) < 24 * 28:
                cache[wk] = None
            else:
                x, Rm = rnow[e], rtw[e]
                ok = ~np.isnan(x)
                if ar:
                    xc = x[ok] - x[ok].mean()
                    yc = Rm[ok] - Rm[ok].mean(0)
                    b = (xc[:, None] * yc).sum(0) / (xc ** 2).sum()
                    a = Rm[ok].mean(0) - b * x[ok].mean()
                    sd = (yc - b[None] * xc[:, None]).std(0)
                    cache[wk] = (a, b, sd)
                else:
                    cache[wk] = (Rm.mean(0), np.zeros(48), Rm.std(0))
        if cache[wk] is None:
            continue
        a, b, sd = cache[wk]
        fc_t = L.fc[source][i]
        fct = derive(fc_t[1:])
        rn = rnow[i] if not np.isnan(rnow[i]) else 0.0
        mu = fct + a + b * rn
        y = Y[j]
        out["fc"][j] = fct
        out["crps"][j] = _crps_gauss(mu, sd, y)
        out["pit"][j] = norm.cdf((y - mu) / sd)
        z = np.abs((y - mu) / sd)
        out["in80"][j] = np.where(np.isnan(y), np.nan, z <= norm.ppf(0.9))
        out["in95"][j] = np.where(np.isnan(y), np.nan, z <= norm.ppf(0.975))
        out["p0"][j] = 1 - norm.cdf((ta - mu) / sd)
        out["p5"][j] = 1 - norm.cdf((tb - mu) / sd)
        out["mean"][j], out["sd"][j] = mu, sd
        sims = mu[None] + sd[None] * rng.standard_normal((N, 48))   # independent across leads
        out["fn"][j] = [(sims[:, a_ - 1:b_] > tb).any(1).mean() for a_, b_ in WINDOWS]
    return out


# ----------------------------------------------------------------------------------------------- EMOS / NGR baseline
# Forecast-conditioned Gaussian (non-homogeneous Gaussian regression, Gneiting et al. 2005), fitted per lead by
# minimum CRPS on the entries eligible at the start of each week (same walk-forward rule as the sampler), plus a
# Gaussian copula across leads with the empirical lag correlation of the standardised training residuals (paths).
_HEAD = {"tw25": 250.0, "tw18": 180.0, "gtw18": 180.0}


def _emos_X(fc, tau, lead, rnow_var, var):
    """fc [m, 3] forecast (u, v, gust) at this lead; tau [m] issue hours; rnow_var [m] current error of the variable.
    -> mean design X [m, 12], sd design Z [m, 5]."""
    v = derive(fc, var)
    cross = F.tw_from_uv(fc[:, 0], fc[:, 1], np.radians(_HEAD[var] - 90.0))
    sp = np.hypot(fc[:, 0], fc[:, 1])
    g = np.nan_to_num(fc[:, 2], nan=0.0) if fc.shape[1] > 2 else sp
    hv = ((tau + lead) % 24) * 2 * np.pi / 24
    doy = pd.to_datetime(tau * 3600, unit="s", utc=True).day_of_year.to_numpy() * 2 * np.pi / 365.25
    one = np.ones_like(v)
    X = np.column_stack([one, v, cross, sp, g, np.sin(hv), np.cos(hv), np.sin(doy), np.cos(doy),
                         v * np.sin(hv), v * np.cos(hv), rnow_var * np.exp(-lead / 6.0)])
    Z = np.column_stack([one, sp / 10, np.sin(hv), np.cos(hv), np.abs(v) / 10])
    return X, Z


def _fit_ngr(X, Z, y, w):
    """min weighted mean CRPS of N(X b, exp(Z g)^2); analytic gradient, OLS start."""
    from scipy.optimize import minimize
    sw = np.sqrt(w)
    b0 = np.linalg.lstsq(X * sw[:, None], y * sw, rcond=None)[0]
    r0 = y - X @ b0
    g0 = np.zeros(Z.shape[1])
    g0[0] = np.log(np.sqrt(np.average(r0 ** 2, weights=w)))
    nb, W = X.shape[1], w / w.sum()

    def f(th):
        b, g = th[:nb], th[nb:]
        mu, s = X @ b, np.exp(np.clip(Z @ g, -5, 5))
        z = (y - mu) / s
        Pz, pz = norm.cdf(z), norm.pdf(z)
        crps = s * (z * (2 * Pz - 1) + 2 * pz - 1 / np.sqrt(np.pi))
        dmu = -(2 * Pz - 1)
        ds = (2 * pz - 1 / np.sqrt(np.pi)) * s
        return float(W @ crps), np.concatenate([X.T @ (W * dmu), Z.T @ (W * ds)])

    th = minimize(f, np.concatenate([b0, g0]), jac=True, method="L-BFGS-B", options={"maxiter": 300}).x
    return th[:nb], th[nb:]


_EMOS = {}


def _emos_week(wk):
    """Fit all 48 leads on the library eligible at the start of week wk -> (b [48, 12], g [48, 5], rho [48])."""
    s, var, ifs_w = _EMOS["s"], _EMOS["var"], _EMOS["ifs_w"]
    L = s.lib
    e = s.eligible(int(wk * 168))
    if len(e) < 24 * 28:
        return wk, None
    obs_v = derive(L.obs[e], var)                                            # [m, 49]
    rnow = np.nan_to_num(derive(L.now[e], var) - derive(s.fc_lib[e, 0, :], var))
    w = np.where(L.has_icon[e], 1.0, ifs_w) if s.mixed else np.ones(len(e))
    B, G = np.zeros((48, 12)), np.zeros((48, 5))
    Rstd = np.full((len(e), 48), np.nan)
    for lead in range(1, 49):
        X, Z = _emos_X(s.fc_lib[e, lead], L.tau[e], lead, rnow, var)
        y = obs_v[:, lead]
        ok = ~L.obs_bad[e, lead] & np.isfinite(y) & np.isfinite(X).all(1)
        b, g = _fit_ngr(X[ok], Z[ok], y[ok], w[ok])
        B[lead - 1], G[lead - 1] = b, g
        Rstd[ok, lead - 1] = (y[ok] - X[ok] @ b) / np.exp(np.clip(Z[ok] @ g, -5, 5))
    rho = [1.0]
    for lag in range(1, 48):
        a, c = Rstd[:, :-lag].ravel(), Rstd[:, lag:].ravel()
        ok = np.isfinite(a) & np.isfinite(c)
        rho.append(np.corrcoef(a[ok], c[ok])[0, 1])
    return wk, (B, G, np.array(rho))


def run_emos(idx, centre="ifs", ifs_entry_weight=0.25, n=N, seed=0, workers=4):
    """Walk-forward EMOS/NGR + Gaussian-copula paths for the target variable VAR.
    centre 'ifs': IFS forecast, IFS residual library (consistent, full history); 'cons_mix': consensus target,
    library = consensus where ICON was archived and IFS before (IFS-only rows weighted ifs_entry_weight)."""
    from scipy.linalg import toeplitz
    L = lib()
    p = F.Params(source="cons", lib_source="cons_mix") if centre == "cons_mix" else F.Params(source="ifs")
    s = F.Sampler(L, p)
    _EMOS.update(s=s, var=VAR, ifs_w=ifs_entry_weight)
    weeks = L.tau[idx] // 168
    with get_context("fork").Pool(min(workers, 4)) as pool:
        fits = dict(pool.map(_emos_week, list(np.unique(weeks))))
    ta, tb = THR[VAR]
    I = len(idx)
    out = {k: np.full((I, 48), np.nan) for k in ["crps", "pit", "in80", "in95", "p0", "p5", "mean", "sd", "fc"]}
    out["fn"] = np.full((I, len(WINDOWS)), np.nan)
    out["member0"] = np.full((I, 48), np.nan)
    out["within_ac"] = np.full((I, len(LAGS)), np.nan)
    out["ess"] = np.full(I, np.nan)
    Y = truth(idx)
    src = "cons" if centre == "cons_mix" else "ifs"
    rng = np.random.default_rng(seed)
    have = np.array([fits[w_] is not None for w_ in weeks])
    Bi = np.stack([fits[w_][0] if fits[w_] is not None else np.full((48, 12), np.nan) for w_ in weeks])  # [I,48,12]
    Gi = np.stack([fits[w_][1] if fits[w_] is not None else np.full((48, 5), np.nan) for w_ in weeks])
    fc_all = L.fc[src][idx]                                                  # [I, 49, 3]
    rn_all = np.nan_to_num(derive(L.now[idx], VAR) - derive(fc_all[:, 0, :], VAR))
    MU, SD = np.full((I, 48), np.nan), np.full((I, 48), np.nan)
    for lead in range(1, 49):
        X, Z = _emos_X(fc_all[:, lead], L.tau[idx], lead, rn_all, VAR)
        MU[:, lead - 1] = (X * Bi[:, lead - 1]).sum(1)
        SD[:, lead - 1] = np.exp(np.clip((Z * Gi[:, lead - 1]).sum(1), -5, 5))
    chol = {}
    for wk, fit in fits.items():
        if fit is not None:
            C = toeplitz(fit[2])
            ev, V = np.linalg.eigh(C)
            C = (V * np.clip(ev, 1e-6, None)) @ V.T
            chol[wk] = np.linalg.cholesky(C + 1e-9 * np.eye(48))
    for j, i in enumerate(idx):
        if not have[j]:
            continue
        mu, sd = MU[j], SD[j]
        y = Y[j]
        fct = derive(fc_all[j, 1:])
        out["fc"][j], out["mean"][j], out["sd"][j] = fct, mu, sd
        out["crps"][j] = _crps_gauss(mu, sd, y)
        out["pit"][j] = norm.cdf((y - mu) / sd)
        z = np.abs((y - mu) / sd)
        out["in80"][j] = np.where(np.isnan(y), np.nan, z <= norm.ppf(0.9))
        out["in95"][j] = np.where(np.isnan(y), np.nan, z <= norm.ppf(0.975))
        out["p0"][j] = 1 - norm.cdf((ta - mu) / sd)
        out["p5"][j] = 1 - norm.cdf((tb - mu) / sd)
        sims = mu[None] + sd[None] * (rng.standard_normal((n, 48)) @ chol[weeks[j]].T)
        out["fn"][j] = [(sims[:, a - 1:b] > tb).any(1).mean() for a, b in WINDOWS]
        r = sims - fct[None]
        out["member0"][j] = r[0]
        ac = []
        for lag in LAGS:
            a_, b_ = r[:, :-lag] - r[:, :-lag].mean(0), r[:, lag:] - r[:, lag:].mean(0)
            ac.append(np.nanmean((a_ * b_).sum(0) / np.sqrt((a_ * a_).sum(0) * (b_ * b_).sum(0) + 1e-12)))
        out["within_ac"][j] = ac
    return out


def run_det(idx, source="ifs"):
    L = lib()
    Y = truth(idx)
    fct = derive(L.fc[source][idx, 1:, :])
    ta, tb = THR[VAR]
    out = {"crps": np.where(np.isnan(Y), np.nan, np.abs(fct - Y)), "p0": (fct > ta).astype(float),
           "p5": (fct > tb).astype(float), "mean": fct, "fc": fct}
    out["fn"] = np.column_stack([(fct[:, a - 1:b] > tb).any(1) for a, b in WINDOWS]).astype(float)
    return out


def summarize(name, r, idx, mask=None):
    """Scalar metrics on the issues in mask (bool over idx)."""
    Y = truth(idx)
    m = np.ones(len(idx), bool) if mask is None else mask
    row = {"variant": name}
    have = ~np.isnan(r["crps"]).all(1) & m
    row["n_issues"] = int(have.sum())
    for L_ in LEADS + ["all"]:
        sl = slice(None) if L_ == "all" else L_ - 1
        y = Y[have][:, sl]
        ok = ~np.isnan(y) & ~np.isnan(r["crps"][have][:, sl])
        sfx = f"_{L_}"
        row["crps" + sfx] = float(np.nanmean(np.where(ok, r["crps"][have][:, sl], np.nan)))
        if L_ == "all":
            continue
        for thr, key in zip(THR[VAR], ["p0", "p5"]):
            p = r[key][have][:, sl][ok]
            row[f"brier{thr}" + sfx] = float(np.mean((p - (y[ok] > thr)) ** 2))
        if "in80" in r:
            row["cov80" + sfx] = float(np.nanmean(r["in80"][have][:, sl][ok]))
            row["cov95" + sfx] = float(np.nanmean(r["in95"][have][:, sl][ok]))
            pit = r["pit"][have][:, sl][ok]
            h = np.histogram(pit, bins=10, range=(0, 1))[0] / max(len(pit), 1)
            row["pit_dev" + sfx] = float(np.abs(h - 0.1).sum())           # reliability index: 0 = flat
            row["sd" + sfx] = float(np.nanmean(r["sd"][have][:, sl][ok]))
    # path functional: P(any hour with tw25 > 5 kt in window)
    for w, (a, b) in enumerate(WINDOWS):
        yy = Y[have][:, a - 1:b]
        okw = ~np.isnan(yy).any(1)
        obs_ev = (yy[okw] > THR[VAR][1]).any(1)
        row[f"brier_any{THR[VAR][1]}_{a}_{b}"] = float(np.mean((r["fn"][have][okw, w] - obs_ev) ** 2))
    if "member0" in r:
        rr = r["member0"][have]
        real = Y[have] - r["fc"][have]                     # real residuals w.r.t. this variant's forecast centre
        for lag in LAGS:
            row[f"ac{lag}_sim"] = _pooled_ac(rr, lag)
            row[f"ac{lag}_real"] = _pooled_ac(real, lag)
        row["within_ac1"], row["within_ac3"], row["within_ac6"] = np.nanmean(r["within_ac"][have], axis=0)
        row["ess_median"] = float(np.nanmedian(r["ess"][have]))
    return row


def _pooled_ac(R, lag):
    """Mean over leads L of corr_issues(R[:, L], R[:, L+lag]) (pooled across issues, like reality)."""
    cs = []
    for L_ in range(0, 48 - lag):
        a, b = R[:, L_], R[:, L_ + lag]
        ok = ~np.isnan(a) & ~np.isnan(b)
        if ok.sum() > 30:
            cs.append(np.corrcoef(a[ok], b[ok])[0, 1])
    return float(np.mean(cs))


def real_ac(idx, source="ifs"):
    L = lib()
    Y = truth(idx)
    fct = F.tw_from_uv(L.fc[source][idx, 1:, 0], L.fc[source][idx, 1:, 1], F.H25)
    R = Y - fct
    return {f"ac{lag}_real": _pooled_ac(R, lag) for lag in LAGS}


P = F.Params
GRIDS = {
    "main": {
        "clim_all": P(sigma_doy=None, sigma_hour=None, regime=None, shift_now=False),
        "hour": P(sigma_doy=None, sigma_hour=1.0, regime=None, shift_now=False),
        "hour_doy45": P(sigma_doy=45, sigma_hour=1.0, regime=None, shift_now=False),
        "hour_doy45_reg4": P(sigma_doy=45, sigma_hour=1.0, regime="uv2", sigma_regime=4, shift_now=False),
        "hour_doy45_reg4_shift": P(sigma_doy=45, sigma_hour=1.0, regime="uv2", sigma_regime=4, shift_now=True),
        "hour_reg4_shift": P(sigma_doy=None, sigma_hour=1.0, regime="uv2", sigma_regime=4, shift_now=True),
        "hour_doy45_shift": P(sigma_doy=45, sigma_hour=1.0, regime=None, shift_now=True),
        "hour_doy45_reg2_shift": P(sigma_doy=45, sigma_hour=1.0, regime="uv2", sigma_regime=2, shift_now=True),
        "hour_doy45_reg8_shift": P(sigma_doy=45, sigma_hour=1.0, regime="uv2", sigma_regime=8, shift_now=True),
        "hour_doy45_uv4_shift": P(sigma_doy=45, sigma_hour=1.0, regime="uv4", sigma_regime=5, shift_now=True),
        "hour_doy45_tw2_shift": P(sigma_doy=45, sigma_hour=1.0, regime="tw2", sigma_regime=3, shift_now=True),
        "hour_doy45_reg4_now3": P(sigma_doy=45, sigma_hour=1.0, regime="uv2", sigma_regime=4, sigma_now=3,
                                  shift_now=True),
        "hour_doy45_reg4_shift_sc5": P(sigma_doy=45, sigma_hour=1.0, regime="uv2", sigma_regime=4, shift_now=True,
                                       scale_speed=5),
        "hour_doy45_reg4_shift_hl90": P(sigma_doy=45, sigma_hour=1.0, regime="uv2", sigma_regime=4, shift_now=True,
                                        halflife_days=90),
        "hour_doy25_reg4_shift": P(sigma_doy=25, sigma_hour=1.0, regime="uv2", sigma_regime=4, shift_now=True),
        "hour_doy90_reg4_shift": P(sigma_doy=90, sigma_hour=1.0, regime="uv2", sigma_regime=4, shift_now=True),
        "hour0.5_doy45_reg4_shift": P(sigma_doy=45, sigma_hour=0.5, regime="uv2", sigma_regime=4, shift_now=True),
        "hour2_doy45_reg4_shift": P(sigma_doy=45, sigma_hour=2.0, regime="uv2", sigma_regime=4, shift_now=True),
        "cons_hour_doy45_reg4_shift": P(source="cons", sigma_doy=45, sigma_hour=1.0, regime="uv2", sigma_regime=4,
                                        shift_now=True),
        "cons_ifslib_hour_doy45_reg4_shift": P(source="cons", lib_source="ifs", sigma_doy=45, sigma_hour=1.0,
                                               regime="uv2", sigma_regime=4, shift_now=True),
    },
}

_B = P(sigma_doy=45, sigma_hour=1.0, regime="uv4", sigma_regime=3.0, shift_now=True)
GRIDS["r2"] = {
    "uv2_s1.5": replace(_B, regime="uv2", sigma_regime=1.5),
    "uv2_s2": replace(_B, regime="uv2", sigma_regime=2.0),
    "uv2_s3": replace(_B, regime="uv2", sigma_regime=3.0),
    "uv4_s2": replace(_B, sigma_regime=2.0),
    "uv4_s3": _B,
    "uv4_s4": replace(_B, sigma_regime=4.0),
    "uv8_s4": replace(_B, regime="uv8", sigma_regime=4.0),
    "uv8_s6": replace(_B, regime="uv8", sigma_regime=6.0),
    "uv4_s3_noshift": replace(_B, shift_now=False),
    "uv4_s3_sc5": replace(_B, scale_speed=5.0),
    "uv4_s3_sc10": replace(_B, scale_speed=10.0),
    "uv4_s3_doy30": replace(_B, sigma_doy=30),
    "uv4_s3_doy60": replace(_B, sigma_doy=60),
    "uv4_s3_hl180": replace(_B, halflife_days=180),
    "uv4_s3_ess50": replace(_B, min_ess=50),
    "uv4_s3_ess10": replace(_B, min_ess=10),
    "cons_uv4_s3": replace(_B, source="cons"),
    "consmix_uv4_s3": replace(_B, source="cons", lib_source="cons_mix"),
    "consmix_uv4_s3_spread2": replace(_B, source="cons", lib_source="cons_mix", scale_spread=2.0),
    "consmix_uv4_s3_spread4": replace(_B, source="cons", lib_source="cons_mix", scale_spread=4.0),
    "cons_uv4_s3_spread2": replace(_B, source="cons", scale_spread=2.0),
    "ifs_uv4_s3_spread3": replace(_B, scale_spread=3.0),
    "consmix_uv2_s2": replace(_B, source="cons", lib_source="cons_mix", regime="uv2", sigma_regime=2.0),
    "consmix_uv4_s3_hl180": replace(_B, source="cons", lib_source="cons_mix", halflife_days=180),
}

_C = replace(_B, source="cons", lib_source="cons_mix")
GRIDS["r3"] = {
    "uv4_s3": _B,
    "uv4_s3_noshift": replace(_B, shift_now=False),
    "uv4_s3_taper3": replace(_B, beta_taper_h=3),
    "uv4_s3_taper6": replace(_B, beta_taper_h=6),
    "uv4_s3_taper12": replace(_B, beta_taper_h=12),
    "uv4_s3_local": replace(_B, beta_mode="local"),
    "uv4_s3_local_p200": replace(_B, beta_mode="local", beta_prior=200),
    "uv4_s3_local_p20": replace(_B, beta_mode="local", beta_prior=20),
    "uv4_s3_local_taper12": replace(_B, beta_mode="local", beta_taper_h=12),
    "uv8_s6_taper6": replace(_B, regime="uv8", sigma_regime=6.0, beta_taper_h=6),
    "uv4_s4_taper6": replace(_B, sigma_regime=4.0, beta_taper_h=6),
    "cmix": _C,
    "cmix_taper6": replace(_C, beta_taper_h=6),
    "cmix_local": replace(_C, beta_mode="local"),
    "cmix_hl180_taper6": replace(_C, halflife_days=180, beta_taper_h=6),
    "cmix_hl90_taper6": replace(_C, halflife_days=90, beta_taper_h=6),
    "cmix_hl365_taper6": replace(_C, halflife_days=365, beta_taper_h=6),
    "cmix_hl180_taper6_sp4": replace(_C, halflife_days=180, beta_taper_h=6, scale_spread=4.0),
    "cmix_hl180_taper6_s4": replace(_C, halflife_days=180, beta_taper_h=6, sigma_regime=4.0),
    "cmix_hl180_taper6_uv8s6": replace(_C, halflife_days=180, beta_taper_h=6, regime="uv8", sigma_regime=6.0),
    "cmix_hl180_local": replace(_C, halflife_days=180, beta_mode="local"),
    "cmix_hl180_taper6_doy60": replace(_C, halflife_days=180, beta_taper_h=6, sigma_doy=60),
    "cmix_hl180_taper6_nodoy": replace(_C, halflife_days=180, beta_taper_h=6, sigma_doy=None),
    "cmix_hl180_taper6_h2": replace(_C, halflife_days=180, beta_taper_h=6, sigma_hour=2.0),
}

_R = replace(_C, halflife_days=180, beta_taper_h=6)
GRIDS["r4"] = {
    "R": _R,
    "R_h2": replace(_R, sigma_hour=2.0),
    "R_sp4": replace(_R, scale_spread=4.0),
    "R_h2_sp4": replace(_R, sigma_hour=2.0, scale_spread=4.0),
    "R_h2_sp4_doy60": replace(_R, sigma_hour=2.0, scale_spread=4.0, sigma_doy=60),
    "R_h2_sp4_uv8s6": replace(_R, sigma_hour=2.0, scale_spread=4.0, regime="uv8", sigma_regime=6.0),
    "R_h2_sp4_s4": replace(_R, sigma_hour=2.0, scale_spread=4.0, sigma_regime=4.0),
    "R_h2_sp4_hl120": replace(_R, sigma_hour=2.0, scale_spread=4.0, halflife_days=120),
    "R_h2_sp4_hl270": replace(_R, sigma_hour=2.0, scale_spread=4.0, halflife_days=270),
    "R_h2_sp4_t4": replace(_R, sigma_hour=2.0, scale_spread=4.0, beta_taper_h=4),
    "R_h2_sp4_t9": replace(_R, sigma_hour=2.0, scale_spread=4.0, beta_taper_h=9),
    "IFS_R_h2": replace(_R, source="ifs", lib_source=None, sigma_hour=2.0),
    "IFS_R": replace(_R, source="ifs", lib_source=None),
    "IFS_uv4_s3_t6": replace(_B, beta_taper_h=6),
}
GRIDS["dev"] = {   # IFS-only robustness check (Nov 2025 - May 2026: no ICON archive yet)
    "clim_all": P(sigma_doy=None, sigma_hour=None, regime=None, shift_now=False),
    "hour_doy45": P(sigma_doy=45, sigma_hour=1.0, regime=None, shift_now=False),
    "uv2_s4": P(sigma_doy=45, sigma_hour=1.0, regime="uv2", sigma_regime=4, shift_now=False),
    "uv4_s3_noshift": replace(_B, shift_now=False),
    "uv4_s3_shift": _B,
    "uv4_s3_t6": replace(_B, beta_taper_h=6),
    "uv4_s4_t6": replace(_B, sigma_regime=4.0, beta_taper_h=6),
    "uv8_s6_t6": replace(_B, regime="uv8", sigma_regime=6.0, beta_taper_h=6),
    "uv4_s3_t6_hl180": replace(_B, beta_taper_h=6, halflife_days=180),
    "uv4_s3_t6_h2": replace(_B, beta_taper_h=6, sigma_hour=2.0),
    "uv4_s3_t6_hl180_h2": replace(_B, beta_taper_h=6, halflife_days=180, sigma_hour=2.0),
    "uv4_s3_t6_doy60": replace(_B, beta_taper_h=6, sigma_doy=60),
    "uv4_s3_t6_sc10": replace(_B, beta_taper_h=6, scale_speed=10.0),
}

_S = replace(_C, sigma_hour=2.0, sigma_doy=60, scale_spread=4.0, beta_taper_h=6)
GRIDS["r5"] = {
    "S_hl180": replace(_S, halflife_days=180),
    "S": _S,
    "S_w0.1": replace(_S, ifs_entry_weight=0.1),
    "S_w0.25": replace(_S, ifs_entry_weight=0.25),
    "S_w0.5": replace(_S, ifs_entry_weight=0.5),
    "S_w0.25_t12": replace(_S, ifs_entry_weight=0.25, beta_taper_h=12),
    "S_w0.25_global": replace(_S, ifs_entry_weight=0.25, beta_taper_h=None),
    "S_w0.25_local": replace(_S, ifs_entry_weight=0.25, beta_taper_h=None, beta_mode="local"),
    "S_w0.25_local_t12": replace(_S, ifs_entry_weight=0.25, beta_taper_h=12, beta_mode="local"),
    "S_w0.25_s4": replace(_S, ifs_entry_weight=0.25, sigma_regime=4.0),
    "S_w0.25_s3.5": replace(_S, ifs_entry_weight=0.25, sigma_regime=3.5),
    "S_w0.25_uv8s6": replace(_S, ifs_entry_weight=0.25, regime="uv8", sigma_regime=6.0),
    "S_w0.25_sc10": replace(_S, ifs_entry_weight=0.25, scale_speed=10.0),
    "S_w0.25_hl180": replace(_S, ifs_entry_weight=0.25, halflife_days=180),
    "IFS_S": replace(_S, source="ifs", lib_source=None),
    "IFS_S_t12": replace(_S, source="ifs", lib_source=None, beta_taper_h=12),
    "IFS_S_local": replace(_S, source="ifs", lib_source=None, beta_taper_h=None, beta_mode="local"),
    "IFS_S_s3.5_t12": replace(_S, source="ifs", lib_source=None, sigma_regime=3.5, beta_taper_h=12),
}
_D = replace(_B, sigma_hour=2.0, sigma_doy=60)
GRIDS["dev2"] = {
    "D_global": _D,
    "D_t6": replace(_D, beta_taper_h=6),
    "D_t12": replace(_D, beta_taper_h=12),
    "D_local": replace(_D, beta_mode="local"),
    "D_local_t12": replace(_D, beta_mode="local", beta_taper_h=12),
    "D_s3.5_t12": replace(_D, sigma_regime=3.5, beta_taper_h=12),
    "D_s4_t12": replace(_D, sigma_regime=4.0, beta_taper_h=12),
    "D_s4_local": replace(_D, sigma_regime=4.0, beta_mode="local"),
    "D_uv8s6_t12": replace(_D, regime="uv8", sigma_regime=6.0, beta_taper_h=12),
    "D_t12_sc10": replace(_D, beta_taper_h=12, scale_speed=10.0),
    "D_t12_hl180": replace(_D, beta_taper_h=12, halflife_days=180),
}

GRIDS["r6"] = {
    "DEFAULT": F.DEFAULT,
    "DEFAULT_op": replace(F.DEFAULT, obs_operator=True),
    "DEFAULT_IFS": F.DEFAULT_IFS,
    "DEFAULT_IFS_op": replace(F.DEFAULT_IFS, obs_operator=True),
}


_OLD = replace(F.DEFAULT, mix_native=False)   # the first DEFAULT (consensus centre for every residual)
GRIDS["r7"] = {   # review round: IFS-only analogues centred on the target's IFS forecast (mix_native)
    "old DEFAULT (cons centre for all)": _OLD,
    "native w0.25": replace(_OLD, mix_native=True),
    "native w0.5": replace(_OLD, mix_native=True, ifs_entry_weight=0.5),
    "native w1": replace(_OLD, mix_native=True, ifs_entry_weight=1.0),
    "native w0.1": replace(_OLD, mix_native=True, ifs_entry_weight=0.1),
    "native w0.25 no speed scale": replace(_OLD, mix_native=True, scale_speed=None),
    "native w0.25 no spread scale": replace(_OLD, mix_native=True, scale_spread=None),
    "DEFAULT_IFS": F.DEFAULT_IFS,
}


def conditional_reliability(r, Y, lead, thr=5.0, bins=((.05, .2), (.2, .4), (.4, .6), (.6, .8), (.8, 1.01))):
    """P(var > thr) bins -> n, mean P, observed frequency, mean bias obs - sim mean, simulated sd vs the sd of
    (obs - sim mean) (a calibrated ensemble has these about equal)."""
    y, p = Y[:, lead - 1], r["p5"][:, lead - 1]
    ok = ~np.isnan(y) & ~np.isnan(p)
    rows = []
    for lo, hi in bins:
        m = ok & (p >= lo) & (p < hi)
        if m.sum() < 5:
            continue
        d = y[m] - r["mean"][m, lead - 1]
        rows.append({"lead": lead, "bin": f"[{lo:.2f},{min(hi, 1):.2f})", "n": int(m.sum()), "mean_P": p[m].mean(),
                     "observed": float(np.mean(y[m] > thr)), "bias_obs_minus_sim": d.mean(),
                     "sim_sd": r["sd"][m, lead - 1].mean(), "sd_obs_minus_sim": d.std()})
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--grid", default="main")
    ap.add_argument("--start", default="2026-06-01")
    ap.add_argument("--end", default="2026-10-31")
    ap.add_argument("--workers", type=int, default=4)
    ap.add_argument("--n", type=int, default=N)
    ap.add_argument("--tag", default="")
    ap.add_argument("--no-icon", action="store_true", help="do not require ICON (dev period before May 2026)")
    ap.add_argument("--var", default="tw25", choices=list(THR))
    ap.add_argument("--seeds", type=int, default=1, help="repeat every variant with this many sampling seeds")
    a = ap.parse_args()
    global VAR
    VAR = a.var
    L = lib()
    print("library", len(L.tau), L.meta, flush=True)
    idx = test_issues(a.start, a.end, need_icon=not a.no_icon)
    print(f"test issues {len(idx)}: {L.times[idx[0]]} .. {L.times[idx[-1]]}", flush=True)
    variants = GRIDS[a.grid]
    jobs = [(k if sd == 0 else f"{k}#seed{sd}", v, idx, a.n, sd) for k, v in variants.items() for sd in range(a.seeds)]
    t0 = time.time()
    with get_context("fork").Pool(min(a.workers, 4)) as pool:
        results = dict(pool.map(run_variant, jobs))
    print(f"simulated {len(jobs)} variants in {time.time()-t0:.0f}s", flush=True)
    # common issue set: every variant produced paths
    common = np.ones(len(idx), bool)
    for r in results.values():
        common &= ~np.isnan(r["crps"]).all(1)
    rows = []
    for src in (["ifs"] if a.no_icon else ["ifs", "cons"]):
        rows.append(summarize(f"BASE_det_{src}", run_det(idx, src), idx, common))
        rows.append(summarize(f"BASE_gauss_{src}", run_gauss(idx, src), idx, common))
        rows.append(summarize(f"BASE_gaussAR_{src}", run_gauss(idx, src, ar=True), idx, common))
    for k, r in results.items():
        rows.append(summarize(k, r, idx, common) | {"sec": round(r["seconds"], 1)})
    df = pd.DataFrame(rows)
    tag = a.tag or f"{a.grid}_{a.start}_{a.end}" + ("" if VAR == "tw25" else f"_{VAR}")
    df.to_csv(OUT / f"results_{tag}.csv", index=False)
    pd.set_option("display.width", 250, "display.max_columns", 40)
    cols = ["variant", "n_issues", "crps_1", "crps_3", "crps_6", "crps_12", "crps_24", "crps_48", "crps_all",
            "brier0_6", "brier0_24", "brier0_48",
            "brier5_6", "brier5_24", "brier5_48", "cov80_24", "cov95_24", "pit_dev_24"]
    print(df[[c for c in cols if c in df]].round(4).to_string(index=False))
    cols2 = ["variant", "cov80_6", "cov80_48", "cov95_6", "cov95_48", "pit_dev_6", "pit_dev_48",
             "brier_any5_1_12", "brier_any5_13_24", "brier_any5_25_48", "ac1_sim", "ac1_real", "ac3_sim", "ac3_real",
             "ac6_sim", "ac6_real",
             "within_ac1", "within_ac6", "ess_median"]
    print(df[[c for c in cols2 if c in df]].round(4).to_string(index=False))


if __name__ == "__main__":
    main()
