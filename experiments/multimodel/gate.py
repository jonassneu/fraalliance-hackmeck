"""PLAN.json gate: as-of centre skill on hourly issues (each model's latest run available at the issue).

    uv run python experiments/multimodel/gate.py

MAE of the tailwind on RWY 25 (kt) vs fra.fcerror.hourly_obs (missing hours excluded), by lead bucket, on
dev (valid 2026-04-02 .. 05-31) and test (06-01 .. 10-31). Common rows: IFS and the production ICON member present.
prod = 0.5 IFS + 0.5 ICON-D2/EU (tw25_cons of the logit); C = 0.5 IFS + 0.5 mean(non-IFS members) (primary);
diagnostics: equal weights, leave-one-member-out, single members. Gate: C below prod on dev at leads 13-48.
"""
import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from fra import fcerror as F  # noqa: E402
from experiments.multimodel import consensus as M  # noqa: E402

HERE = Path(__file__).resolve().parent
HOLDOUT = pd.Timestamp("2026-11-01", tz="UTC")
DEV_END = pd.Timestamp("2026-06-01", tz="UTC")
BUCKETS = [(1, 6), (7, 12), (13, 24), (25, 36), (37, 48), (13, 48), (1, 48)]


def boot(diff, day, n=2000, seed=20261105):
    dd = pd.Series(diff).groupby(day).agg(["sum", "size"])
    idx = np.random.default_rng(seed).integers(0, len(dd), (n, len(dd)))
    bs = dd["sum"].to_numpy()[idx].sum(1) / dd["size"].to_numpy()[idx].sum(1)
    return float(diff.mean()), float(np.quantile(bs, .025)), float(np.quantile(bs, .975))


def main():
    issues = pd.date_range("2026-04-02", "2026-10-31 23:00", freq="h", tz="UTC")
    ih = M._hours(issues)
    ifs = M.lead_slice(M.ifs_asof(ih), 1, 48)
    mem = {k: M.lead_slice(v, 1, 48) for k, v in M.members(ih).items()}
    keys = list(mem)
    combos = {"ifs": ifs, "prod (IFS+ICON)": np.where(np.isnan(mem["d2eu"]), ifs, 0.5 * (ifs + mem["d2eu"]))}
    nm = M.nonifs_mean(mem)
    combos["C (primary)"] = np.where(np.isnan(nm), ifs, 0.5 * (ifs + nm))
    allst = np.stack([ifs, *mem.values()])
    combos["equal weights"] = np.nanmean(allst, axis=0)
    for k in keys:
        nm_k = M.nonifs_mean(mem, drop=(k,))
        combos[f"C without {k}"] = np.where(np.isnan(nm_k), ifs, 0.5 * (ifs + nm_k))
    for k in keys:
        combos[f"{k} alone"] = mem[k]

    obs = F.hourly_obs()
    obs = obs[~obs["missing"]]
    inp = issues.tz_convert("UTC").tz_localize(None).to_numpy()
    valid = inp[:, None] + np.arange(1, 49)[None, :] * np.timedelta64(1, "h")
    vflat = pd.DatetimeIndex(valid.ravel()).tz_localize("UTC")
    o = obs.reindex(vflat)
    ou, ov = o["u"].to_numpy().reshape(valid.shape), o["v"].to_numpy().reshape(valid.shape)
    tw_obs = F.tw_from_uv(ou, ov, F.H25)
    lead = np.broadcast_to(np.arange(1, 49)[None, :], valid.shape)
    vv = valid
    common = np.isfinite(tw_obs) & np.isfinite(ifs[..., 0]) & np.isfinite(mem["d2eu"][..., 0]) & \
        (vv < np.datetime64(HOLDOUT.tz_localize(None)))
    period = np.where(vv < np.datetime64(DEV_END.tz_localize(None)), "dev", "test")
    day = np.broadcast_to(inp.astype("datetime64[D]")[:, None], valid.shape)
    cover = {k: float(np.isfinite(mem[k][..., 0])[common].mean()) for k in keys}
    err = {n: np.abs(F.tw_from_uv(c[..., 0], c[..., 1], F.H25) - tw_obs) for n, c in combos.items()}
    rows = []
    for n, e in err.items():
        for per in ("dev", "test"):
            for lo, hi in BUCKETS:
                s = common & (period == per) & (lead >= lo) & (lead <= hi) & np.isfinite(e)
                rows.append(dict(combo=n, period=per, leads=f"{lo}-{hi}", n=int(s.sum()), mae=float(e[s].mean())))
    t = pd.DataFrame(rows)
    t.to_csv(HERE / "gate_mae.csv", index=False)
    piv = t.pivot_table(index="combo", columns=["period", "leads"], values="mae", sort=False)
    print("member coverage on common rows:", {k: round(v, 3) for k, v in cover.items()})
    print(f"common rows: dev {int((common & (period == 'dev')).sum())}, test {int((common & (period == 'test')).sum())}")
    print("\nAs-of MAE of the tailwind on 25 (kt)\n", piv.round(3).to_string())
    res = {}
    for name in ["C (primary)", "equal weights"]:
        for per in ("dev", "test"):
            for lo, hi in [(1, 12), (13, 48), (1, 48)]:
                s = common & (period == per) & (lead >= lo) & (lead <= hi)
                d = err[name][s] - err["prod (IFS+ICON)"][s]
                res[f"{name} | {per} | {lo}-{hi}"] = boot(d, day[s])
    print("\nMAE difference vs prod (kt), mean [95 % day-block CI]")
    for k, (m, lo, hi) in res.items():
        print(f"  {k:32s} {m:+.3f} [{lo:+.3f}, {hi:+.3f}]")
    m, lo, hi = res["C (primary) | dev | 13-48"]
    gate = m < 0
    print(f"\nGATE (C below prod on dev at 13-48 h): {'PASS' if gate else 'FAIL'} ({m:+.3f})")
    json.dump({"gate_pass": bool(gate), "diffs": res, "coverage": cover}, open(HERE / "gate.json", "w"), indent=1)


if __name__ == "__main__":
    main()
