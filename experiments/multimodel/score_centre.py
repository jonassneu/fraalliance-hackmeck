"""Centre-forecast skill: each NWP model and multi-model means vs the hourly METAR, same init times (no as-of rule).

    uv run python experiments/multimodel/score_centre.py [--init-hours 0] [--out pilot]

Truth: fra.fcerror.hourly_obs() (METARs in [t-30, t+30) min, the Part B verification convention), hours flagged
missing excluded. Scores: MAE of the tailwind on RWY 25 (kt) and RMS vector error of (u, v) (kt), by lead bucket.
Rows: inits where EVERY compared model has the lead (common sample). Periods: dev = valid 2026-04-02 .. 05-31,
test = 2026-06-01 .. 10-31 (valid < 2026-11-01, holdout never read). Paired day-block bootstrap for the main pairs.
"""
import argparse
import sys
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from fra import fcerror as F  # noqa: E402
from experiments.multimodel.fetch import MODELS, path  # noqa: E402

HERE = Path(__file__).resolve().parent
HOLDOUT = pd.Timestamp("2026-11-01", tz="UTC")
BUCKETS = [(1, 6), (7, 12), (13, 24), (25, 36), (37, 48)]


def uv(runs):
    u, v = F.uv_from_sd(runs.wind_speed.to_numpy(), runs.wind_direction.to_numpy())
    return pd.DataFrame({"u": u, "v": v}, index=pd.MultiIndex.from_arrays([runs.init, runs.valid]))


def load_all():
    m = {"ifs": uv(F.load_ifs_runs()), "icond2": uv(F.load_icon_runs()),
         "iconeu": uv(pd.read_parquet(ROOT / "data" / "iconeu_runs.parquet"))}
    for k in MODELS:
        if path(k).exists():
            m[k] = uv(pd.read_parquet(path(k)))
    return m


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--init-hours", default="0")
    ap.add_argument("--out", default="pilot")
    a = ap.parse_args()
    hours = [int(h) for h in a.init_hours.split(",")]
    runs = load_all()
    inits = None
    for k, d in runs.items():
        i = d.index.get_level_values(0)
        s = set(i[i.hour.isin(hours)].unique())
        inits = s if inits is None else inits & s
    inits = sorted(inits)
    grid = pd.MultiIndex.from_tuples([(i, i + pd.Timedelta(hours=L)) for i in inits for L in range(1, 49)],
                                     names=["init", "valid"])
    U = pd.DataFrame({k: d["u"].reindex(grid).to_numpy() for k, d in runs.items()}, index=grid)
    V = pd.DataFrame({k: d["v"].reindex(grid).to_numpy() for k, d in runs.items()}, index=grid)
    # current production centre: ECMWF + ICON-D2, ICON-EU where D2 has no value (fra.singleruns_iconeu purpose)
    for X in (U, V):
        X["d2eu"] = X["icond2"].fillna(X["iconeu"])
    obs = F.hourly_obs()
    obs = obs[~obs["missing"]]
    o = obs.reindex(grid.get_level_values(1))
    ou, ov = o["u"].to_numpy(), o["v"].to_numpy()
    lead = ((grid.get_level_values(1) - grid.get_level_values(0)).total_seconds() / 3600).astype(int)
    valid = grid.get_level_values(1)
    new = [k for k in MODELS if k in U]
    combos = {"ifs": ["ifs"], "d2eu": ["d2eu"], "cons2 (prod)": ["ifs", "d2eu"],
              **{k: [k] for k in new},
              **{f"cons2+{k}": ["ifs", "d2eu", k] for k in new},
              "all": ["ifs", "d2eu", *new]}
    combos.update({f"all-{k}": [c for c in ["ifs", "d2eu", *new] if c != k] for k in ["ifs", "d2eu", *new]})
    need = ["ifs", "d2eu", *new]
    ok = np.isfinite(ou) & np.isfinite(ov) & U[need].notna().all(1).to_numpy() & V[need].notna().all(1).to_numpy()
    ok &= (valid < HOLDOUT)
    period = np.where(valid < pd.Timestamp("2026-06-01", tz="UTC"), "dev", "test")
    rows, err = [], {}
    for name, cols in combos.items():
        fu, fv = U[cols].mean(1).to_numpy(), V[cols].mean(1).to_numpy()
        e_tw = np.abs(F.tw_from_uv(fu - ou, fv - ov, F.H25))
        e_vec = (fu - ou) ** 2 + (fv - ov) ** 2
        err[name] = e_tw
        for per in ["dev", "test"]:
            for lo, hi in BUCKETS:
                s = ok & (period == per) & (lead >= lo) & (lead <= hi)
                rows.append(dict(combo=name, period=per, leads=f"{lo}-{hi}", n=int(s.sum()),
                                 mae_tw25=e_tw[s].mean(), rmse_uv=np.sqrt(e_vec[s].mean())))
    t = pd.DataFrame(rows)
    t.to_csv(HERE / f"centre_{a.out}.csv", index=False)
    piv = t.pivot_table(index="combo", columns=["period", "leads"], values="mae_tw25").reindex(list(combos))
    print(f"inits {len(inits)} ({inits[0]:%Y-%m-%d} .. {inits[-1]:%Y-%m-%d}), init hours {hours}, "
          f"common rows dev {int((ok & (period == 'dev')).sum())}, test {int((ok & (period == 'test')).sum())}")
    print("\nMAE tailwind on 25 (kt), lower is better\n", piv.round(3).to_string())
    base = err["cons2 (prod)"]
    day = pd.DatetimeIndex(grid.get_level_values(0)).normalize()
    rng = np.random.default_rng(20261105)
    print("\nTest period, paired day-block bootstrap of the MAE difference vs cons2 (kt), leads 1-48 / 25-48")
    for name in ["all", *[f"cons2+{k}" for k in new], *[f"all-{k}" for k in ["ifs", "d2eu", *new]]]:
        out = []
        for lo in (1, 25):
            s = ok & (period == "test") & (lead >= lo)
            dd = pd.Series(err[name][s] - base[s]).groupby(day[s]).agg(["sum", "size"])
            idx = rng.integers(0, len(dd), (2000, len(dd)))
            bs = dd["sum"].to_numpy()[idx].sum(1) / dd["size"].to_numpy()[idx].sum(1)
            out.append(f"{bs.mean():+.3f} [{np.quantile(bs, .025):+.3f}, {np.quantile(bs, .975):+.3f}]")
        print(f"  {name:14s} " + "   ".join(out))


if __name__ == "__main__":
    main()
