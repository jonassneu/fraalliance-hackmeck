"""API smoke test + leakage tests for fra.fcerror.

  OMP_NUM_THREADS=1 uv run python -m experiments.partb.check_api [--live] [--no-e2e]
1. sample_paths / forecast_frame / path_features shapes and timing.
2. Leakage (in-library): corrupt every observation valid at or after the issue time (and every 'now' METAR after it),
   resample with the same seed -> paths must be bit-identical. Also checks picked analogues satisfy tau + 51 h <= issue
   and run init + 61 h <= issue.
3. Leakage (end-to-end): rebuild the WHOLE library from archives truncated at the issue time T (METAR reports <= T,
   IFS init <= T - 6 h, ICON init <= T - 4 h), so hourly_obs, its gap interpolation, `complete`/`usable`, beta and
   the eligibility are all recomputed from what was known at T, and compare sample_paths with the full-archive
   library (same seed): must be bit-identical. Issue times: 3 h after the start of every METAR gap >= 4 h since
   2024-06 (where a far-end interpolation would leak) plus random issues.
"""
import os
for _v in ["OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"]:
    os.environ.setdefault(_v, "1")
import copy  # noqa: E402
import sys  # noqa: E402
import tempfile  # noqa: E402
import time  # noqa: E402
from pathlib import Path  # noqa: E402

import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from fra import fcerror as F  # noqa: E402


def _long_gap_starts(min_h=4, since="2024-06-01"):
    """Start hours of METAR gaps (no usable u/v: no report or VRB > 3 kt) of >= min_h hours."""
    r = F.metar_reports()
    g = r.groupby(r.index.round("h"))["u"].mean()
    miss = g.reindex(pd.date_range(g.index.min(), g.index.max(), freq="h")).isna()
    grp = (~miss).cumsum()
    run = miss.groupby(grp).transform("sum")
    first = miss & ~miss.shift(1, fill_value=False)
    starts = miss.index[first & (run >= min_h)]
    return starts[starts >= pd.Timestamp(since, tz="UTC")]


def _truncated_library(T, tmp: Path):
    """Library built only from archive content known at T (writes truncated copies into tmp)."""
    full = (list(F.IFS_FILES), F.ICON_FILE, list(F.METAR_FILES))
    ifs = F.load_ifs_runs()
    ifs[ifs["init"] <= T - pd.Timedelta(hours=F.IFS_BUFFER_H)].to_parquet(tmp / "ifs.parquet")
    icon = F.load_icon_runs()
    if (tmp / "icon.parquet").exists():
        (tmp / "icon.parquet").unlink()
    if icon is not None:
        ic = icon[icon["init"] <= T - pd.Timedelta(hours=F.ICON_BUFFER_H)]
        if len(ic):
            ic.to_parquet(tmp / "icon.parquet")
    met = pd.read_parquet(F._metar_file())
    met[met.index <= T].to_parquet(tmp / "metar.parquet")
    try:
        F.IFS_FILES, F.ICON_FILE, F.METAR_FILES = [tmp / "ifs.parquet"], tmp / "icon.parquet", [tmp / "metar.parquet"]
        F.metar_reports.cache_clear(), F.hourly_obs.cache_clear()
        return F.build_library()
    finally:
        F.IFS_FILES, F.ICON_FILE, F.METAR_FILES = full
        F.metar_reports.cache_clear(), F.hourly_obs.cache_clear()
        F._SAMPLERS.clear()


def e2e_leak_test(lib, issues):
    """Paths from the full-archive library == paths from a library rebuilt from archives truncated at T."""
    n_bad = 0
    with tempfile.TemporaryDirectory(prefix="partb_leak_") as d:
        for T in issues:
            lt = _truncated_library(T, Path(d))
            i_full, i_tr = int(lib.index_of([T])[0]), int(lt.index_of([T])[0])
            if i_full < 0 or i_tr < 0:
                print("e2e", T, "not in library, skipped")
                continue
            F._SAMPLERS.clear()
            a = F.sample_paths(T, F.forecast_frame(T, lib), lib=lib, seed=3, obs_now_uvg=lib.now[i_full])
            F._SAMPLERS.clear()
            b = F.sample_paths(T, F.forecast_frame(T, lt), lib=lt, seed=3, obs_now_uvg=lt.now[i_tr])
            F._SAMPLERS.clear()
            if a is None or b is None:
                same = a is None and b is None
                msg = "no paths (too little history)" if same else "one side has no paths"
            else:
                same = np.array_equal(a.array, b.array, equal_nan=True)
                msg = f"n_eligible {a.info['n_eligible']} / {b.info['n_eligible']}"
                if not same:
                    msg += f", max |d tw25| {np.abs(a.tw25 - b.tw25).max():.2f} kt"
            n_bad += not same
            print(f"e2e leak test {T}: identical {same} ({msg})", flush=True)
    assert n_bad == 0, f"{n_bad} issue(s) differ between full and truncated archives: look-ahead leak"
    print(f"e2e leak test: all {len(issues)} issues bit-identical")


def main():
    lib = F.load_library()
    T = pd.Timestamp("2026-08-14 15:00", tz="UTC")
    fr = F.forecast_frame(T, lib)
    p = F.sample_paths(T, fr, n=200, lib=lib)
    print("paths", p.array.shape, p.CHANNELS, "eligible", p.info["n_eligible"],
          "ess", round(p.info["ess"], 1))
    th = int(F._hours([T])[0])
    tau_picked = F._hours(p.info["picked_tau"])
    assert (tau_picked + F.OBS_DONE_H <= th).all(), "analogue verified after the issue!"
    k = lib.index_of(p.info["picked_tau"])
    assert (lib.ifs_init[k] + F.RUN_DONE_H <= th).all(), "analogue run too recent!"
    print("eligibility OK: newest analogue", p.info["picked_tau"].max(), "for issue", T)

    # leakage: corrupt the future and resample
    bad = copy.copy(lib)
    rng = np.random.default_rng(5)
    absolute = lib.tau[:, None] + np.arange(F.NL)[None, :]
    fut = absolute >= th
    bad.obs = lib.obs.copy()
    bad.obs[fut] = rng.normal(0, 20, size=(fut.sum(), 3))
    bad.obs_calm = lib.obs_calm.copy()
    bad.obs_calm[fut] = rng.random(fut.sum()) < 0.5
    bad.now = lib.now.copy()
    bad.now[lib.tau > th] = rng.normal(0, 20, size=((lib.tau > th).sum(), 3))
    F._SAMPLERS.clear()
    for issue in pd.date_range("2026-07-01", periods=6, freq="17D", tz="UTC") + pd.Timedelta(hours=7):
        ih = int(F._hours([issue])[0])
        futi = absolute >= ih
        b2 = copy.copy(bad)
        b2.obs, b2.obs_calm, b2.now = lib.obs.copy(), lib.obs_calm.copy(), lib.now.copy()
        b2.obs[futi] = rng.normal(0, 20, size=(futi.sum(), 3))
        b2.obs_calm[futi] = rng.random(futi.sum()) < 0.5
        b2.now[lib.tau > ih] = rng.normal(0, 20, size=((lib.tau > ih).sum(), 3))
        a = F.sample_paths(issue, F.forecast_frame(issue, lib), lib=lib, seed=3)
        F._SAMPLERS.clear()
        b = F.sample_paths(issue, F.forecast_frame(issue, lib), lib=b2, seed=3, obs_now_uvg=lib.now[lib.index_of([issue])[0]])
        F._SAMPLERS.clear()
        same = np.array_equal(a.array, b.array, equal_nan=True)
        print("leak test", issue, "identical:", same)
        assert same

    if "--no-e2e" not in sys.argv:
        gaps = _long_gap_starts()
        issues = [g + pd.Timedelta(hours=3) for g in gaps]
        rng2 = np.random.default_rng(11)
        pool = lib.times[(lib.times >= pd.Timestamp("2024-06-01", tz="UTC"))]
        issues += list(pool[rng2.choice(len(pool), 8, replace=False)])
        print(f"e2e: {len(gaps)} METAR gaps >= 4 h since 2024-06 (+ 8 random issues)")
        e2e_leak_test(lib, issues)

    # batch features
    issues = pd.date_range("2026-09-01", periods=500, freq="h", tz="UTC")
    rows = pd.DataFrame({"issue": np.repeat(issues, 4), "lead": np.tile([1, 6, 24, 48], len(issues))})
    t = time.time()
    f = F.path_features(rows, lib=lib)
    print(f"path_features: {len(rows)} rows / {len(issues)} issues in {time.time()-t:.1f}s")
    print(f.groupby("lead")[F.FEATURES].mean().round(3).to_string())
    if "--live" in sys.argv:
        lf = F.live_forecast_frame()
        lp = F.sample_paths(lf["valid"].iloc[0], lf, lib=lib)
        print("live:", lf.head(3).to_string(), "\nlive paths", lp.array.shape, "P(tw25>0) next 6 h",
              (lp.tw25[:, :6] > 0).mean(0).round(2))


if __name__ == "__main__":
    main()
