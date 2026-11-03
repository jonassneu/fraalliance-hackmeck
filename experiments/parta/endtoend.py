"""End-to-end check A+B: decision model (fra.decision) rolled out along Part B's simulated wind paths
(fra.fcerror.sample_paths, its DEFAULT params as found on disk at run time) -- on the same production test rows as
evaluate.py.

Walk-forward: the decision model of week w is trained on transition rows with h + 6 h <= week start; Part B only uses
library paths completed before each issue time (its own strict rule). Observed wind <= issue from METAR without gap
interpolation (no look-ahead). 10 m channels only (Part B does not simulate 100 m wind yet).

Every issue's 100 paths are sampled ONCE and scored with every variant and both anticipation modes:
    path  each path's own (noisy) future feeds the look-ahead features h+1..h+6
    mean  look-ahead features from the ensemble-mean path (the airport acting on a smooth forecast)

The Part B state (DEFAULT params, library file signature, library tau range, git blob hash of fra/fcerror.py before
and after the run) is stored in every res_e2e_*.json, together with path diagnostics vs. the observed wind (D.load_obs
convention, i.e. what the decision model was trained on): tailwind-on-25 crossings of +3 kt per 48 h, lead-24 spread vs
ensemble-mean RMSE, hour-to-hour variability, gust excess. Part B is still changing: compare `partb.fcerror_git_blob`
before quoting numbers from different runs side by side.

    uv run python experiments/parta/endtoend.py [variant ...]
        -> pred_e2e_<variant>.parquet / pred_e2e_<variant>_antmean.parquet, res_e2e_<variant>[_antmean].json,
           e2e_diagnostics.json
    uv run python experiments/parta/endtoend.py --metargust logit_C0.1_f6
        interface diagnostic (suffix _mg): Part B's simulated gust mapped to the METAR gust convention the decision
        model was trained on (gust kept only if >= mean speed + 10 kt, else = mean speed; the same rule common.ifs_windows
        applies to the IFS plug-in). Part B's gust excess over the mean speed is ~3x the observed one.
"""

import hashlib
import json
import sys
import time
from concurrent.futures import ProcessPoolExecutor
from dataclasses import asdict
from pathlib import Path

import numpy as np
import pandas as pd

import common as C
from common import D
from evaluate import VARIANTS

N_PATHS = 100
DEFAULT_NAMES = ["logit_C0.1_f6", "lgbm_mono_small", "lgbm_mono_small_f6"]
MODES = {"path": "", "mean": "_antmean"}   # anticipation mode -> file suffix
CHUNK = 56                                  # issues per rollout_batch call (memory)
TW_X = 3.0                                  # crossing level for the path diagnostic (kt tailwind on 25)
_G = {}


def metar_gust(P):
    """METAR gust convention: a gust is reported only when it exceeds the mean speed by >= 10 kt."""
    s = np.hypot(P.u, P.v)
    return np.where(P.gust >= s + 10, P.gust, s)


def partb_state(B, lib):
    src = Path(B.__file__).read_bytes()
    return {"params_DEFAULT": asdict(B.DEFAULT),
            "lib_sig": [[p, int(m)] for p, m in B._sig()],
            "lib_entries": int(len(lib.tau)), "lib_first_tau": lib.meta.get("first_tau"),
            "lib_last_tau": lib.meta.get("last_tau"), "lib_files": lib.meta.get("ifs_files"),
            "fcerror_git_blob": hashlib.sha1(b"blob %d\0" % len(src) + src).hexdigest(),
            "fcerror_mtime": pd.Timestamp(Path(B.__file__).stat().st_mtime, unit="s", tz="UTC").isoformat()}


def _init():
    from fra import fcerror as B
    labels, obs, F, rows = C.load()
    prod = C.prod_table()
    lib = B.load_library()
    _G.update(B=B, lib=lib, obs0=D.load_obs(fill_gap_h=0), rows=rows, prod=prod,
              iss=C.issue_table(prod, labels), state=partb_state(B, lib))


def _cross(x):
    """(# crossings of TW_X, # finite consecutive pairs) along the last axis."""
    a, b = x[..., :-1], x[..., 1:]
    ok = np.isfinite(a) & np.isfinite(b)
    return int(((a > TW_X) != (b > TW_X))[ok].sum()), int(ok.sum())


def diagnostics(P_list, obs0, keep):
    """Path vs observed-wind statistics (sums, aggregated over weeks in main)."""
    d = {k: 0.0 for k in ("sim_cross", "sim_pairs", "obs_cross", "obs_pairs", "n24", "se24", "var24", "bias24",
                          "sim_dd", "sim_dn", "obs_dd", "obs_dn", "sim_gx", "sim_gx5", "sim_gn", "obs_gx", "obs_gx5",
                          "obs_gn")}
    for P, t in zip(P_list, keep):
        tw = D.tailwind_uv(P.u, P.v, 250.0)                         # [N, 48]
        o = obs0.reindex(P.valid)
        otw = D.tailwind_uv(o["u"].to_numpy(), o["v"].to_numpy(), 250.0)
        c, n = _cross(tw)
        d["sim_cross"] += c
        d["sim_pairs"] += n
        c, n = _cross(otw)
        d["obs_cross"] += c
        d["obs_pairs"] += n
        if np.isfinite(otw[23]):
            m = tw[:, 23].mean()
            d["n24"] += 1
            d["se24"] += (m - otw[23]) ** 2
            d["var24"] += tw[:, 23].var(ddof=1)
            d["bias24"] += m - otw[23]
        dd = np.diff(tw, axis=1)
        d["sim_dd"] += float(np.nansum(dd ** 2))
        d["sim_dn"] += int(np.isfinite(dd).sum())
        od = np.diff(otw)
        d["obs_dd"] += float(np.nansum(od ** 2))
        d["obs_dn"] += int(np.isfinite(od).sum())
        gx = P.gust - np.hypot(P.u, P.v)
        d["sim_gx"] += float(np.nansum(gx))
        d["sim_gx5"] += int((gx > 5).sum())
        d["sim_gn"] += int(np.isfinite(gx).sum())
        ogx = o["gust"].to_numpy() - np.hypot(o["u"].to_numpy(), o["v"].to_numpy())
        d["obs_gx"] += float(np.nansum(ogx))
        d["obs_gx5"] += int((ogx > 5).sum())
        d["obs_gn"] += int(np.isfinite(ogx).sum())
    return d


def run_week(ws, names, metargust=False):
    if not _G:
        _init()
    B, lib, obs0, rows, iss = _G["B"], _G["lib"], _G["obs0"], _G["rows"], _G["iss"]
    we = min(ws + pd.Timedelta(days=7), C.END)
    it = iss[(iss["issue"] >= ws) & (iss["issue"] < we)]
    keep, od_keep, P_list = [], [], []
    for t, o in zip(it["issue"], it["od_now"]):
        P = B.sample_paths(t, n=N_PATHS, lib=lib, seed=0)
        if P is None:
            continue
        if metargust:
            P.gust = metar_gust(P)
        keep.append(t)
        od_keep.append(o)
        P_list.append(P)
    if not keep:
        return None, None
    models = {}
    for name in names:
        m = D.DecisionModel(**VARIANTS[name]).fit(rows[rows.index + D.FUT * C.HOUR <= ws])
        assert m.channels == D.CHANNELS, "Part B simulates 10 m channels only"
        models[name] = m
    out = {"issue": np.repeat(keep, C.H), "lead": np.tile(np.arange(C.H), len(keep))}
    res = {f"{k}_{n}_{mode}": [] for n in names for mode in MODES for k in ("p", "pnc")}
    for c0 in range(0, len(keep), CHUNK):
        sl = slice(c0, c0 + CHUNK)
        Ws = np.concatenate([D.assemble_paths(obs0, t, np.stack([P.u, P.v, P.gust], -1), C.H, D.CHANNELS,
                                              valid=P.valid) for t, P in zip(keep[sl], P_list[sl])])
        nI = len(keep[sl])
        Wa = np.repeat(np.nanmean(Ws.reshape(nI, N_PATHS, *Ws.shape[1:]), axis=1), N_PATHS, axis=0)
        od0 = np.repeat(od_keep[sl], N_PATHS)
        starts = np.repeat(np.asarray(keep[sl], dtype=object), N_PATHS)
        for name, m in models.items():
            for mode in MODES:
                r = D.rollout_batch(m, od0, list(starts), Ws, C.H, D.CHANNELS, W_ant=Wa if mode == "mean" else None)
                res[f"p_{name}_{mode}"].append(r["p25"].reshape(nI, N_PATHS, C.H).mean(1).ravel())
                res[f"pnc_{name}_{mode}"].append(r["p_nochange"].reshape(nI, N_PATHS, C.H).mean(1).ravel())
    out.update({k: np.concatenate(v) for k, v in res.items()})
    print(ws.date(), len(keep), "issues", flush=True)
    return pd.DataFrame(out), diagnostics(P_list, obs0, keep)


def summarize_diag(dg):
    s = {k: sum(d[k] for d in dg) for k in dg[0]}
    per48 = lambda c, n: 47 * c / n if n else np.nan
    return {"tw25_cross_3kt_per48h_sim": per48(s["sim_cross"], s["sim_pairs"]),
            "tw25_cross_3kt_per48h_obs": per48(s["obs_cross"], s["obs_pairs"]),
            "lead24_tw25_spread_kt": float(np.sqrt(s["var24"] / s["n24"])),
            "lead24_tw25_ensmean_rmse_kt": float(np.sqrt(s["se24"] / s["n24"])),
            "lead24_tw25_bias_kt": float(s["bias24"] / s["n24"]),
            "tw25_hourly_change_rms_sim": float(np.sqrt(s["sim_dd"] / s["sim_dn"])),
            "tw25_hourly_change_rms_obs": float(np.sqrt(s["obs_dd"] / s["obs_dn"])),
            "gust_minus_speed_mean_sim": s["sim_gx"] / s["sim_gn"], "gust_minus_speed_mean_obs": s["obs_gx"] / s["obs_gn"],
            "share_gust_gt_speed_plus5_sim": s["sim_gx5"] / s["sim_gn"],
            "share_gust_gt_speed_plus5_obs": s["obs_gx5"] / s["obs_gn"],
            "n_issues_lead24": int(s["n24"])}


def main(names, metargust=False):
    from fra import fcerror as B
    state0 = partb_state(B, B.load_library())
    t0 = time.time()
    parts, diags = [], []
    with ProcessPoolExecutor(4, initializer=_init) as ex:
        n = len(C.week_starts())
        for df, dg in ex.map(run_week, C.week_starts(), [names] * n, [metargust] * n):
            if df is not None:
                parts.append(df)
                diags.append(dg)
    out = pd.concat(parts, ignore_index=True)
    state1 = partb_state(B, B.load_library())
    stable = state0["fcerror_git_blob"] == state1["fcerror_git_blob"] and state0["lib_sig"] == state1["lib_sig"]
    if not stable:
        print("WARNING: Part B (fra/fcerror.py or its archives) changed during the run", flush=True)
    diag = summarize_diag(diags)
    (C.OUT / f"e2e_diagnostics{'_mg' if metargust else ''}.json").write_text(json.dumps({"partb": state0, "partb_stable_during_run": stable,
                                                           "diagnostics": diag}, indent=1, default=str))
    print(json.dumps(diag, indent=1))
    prod = C.prod_table()
    for name in names:
        for mode, suf in MODES.items():
            tag = name + suf + ("_mg" if metargust else "")
            pr = out[["issue", "lead", f"p_{name}_{mode}", f"pnc_{name}_{mode}"]].rename(
                columns={f"p_{name}_{mode}": "p_e2e", f"pnc_{name}_{mode}": "pnc_e2e"})
            C.atomic_parquet(pr, C.OUT / f"pred_e2e_{tag}.parquet")
            t = prod.merge(pr, on=["issue", "lead"], how="inner")
            t["p_blend"] = (t["p_e2e"] + t["p_prod"]) / 2
            res = {"variant": tag, "anticipate": mode, "metar_gust": metargust, "n_paths": N_PATHS, "rows": len(t),
                   "e2e": C.rollout_metrics(t, "p_e2e"), "production": C.rollout_metrics(t, "p_prod"),
                   "blend_50_50": C.rollout_metrics(t, "p_blend"), "seconds": round(time.time() - t0),
                   "run_at": pd.Timestamp.now(tz="UTC").isoformat(), "partb": state0,
                   "partb_stable_during_run": stable, "path_diagnostics": diag}
            (C.OUT / f"res_e2e_{tag}.json").write_text(json.dumps(res, indent=1, default=str))
            for k in ("e2e", "production", "blend_50_50"):
                x = res[k]
                print(f"{tag:28s} {k:12s} acc " + "/".join(f"{100 * x[f'acc{L}']:.1f}" for L in C.LEADS)
                      + f" B={x['brier_1_6_24_48']:.4f} (rows {res['rows']})", flush=True)
    print(f"done in {time.time() - t0:.0f}s; Part B blob {state0['fcerror_git_blob'][:10]}, stable={stable}")


if __name__ == "__main__":
    main([a for a in sys.argv[1:] if not a.startswith("-")] or DEFAULT_NAMES, metargust="--metargust" in sys.argv)
