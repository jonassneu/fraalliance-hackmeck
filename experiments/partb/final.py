"""Final walk-forward report numbers for Part B (fra.fcerror): chosen variant vs baselines and ablations.

  OMP_NUM_THREADS=1 uv run python -m experiments.partb.final
Writes experiments/partb/final_<period>_<var>.csv and experiments/partb/final_tables.md (pasted into REPORT.md).
"""

import os

for _v in ["OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"]:
    os.environ.setdefault(_v, "1")

import sys  # noqa: E402
import time  # noqa: E402
from dataclasses import replace  # noqa: E402
from multiprocessing import get_context  # noqa: E402
from pathlib import Path  # noqa: E402

import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from experiments.partb import evaluate as E  # noqa: E402
from fra import fcerror as F  # noqa: E402

OUT = Path(__file__).resolve().parent
D, DI = F.DEFAULT, F.DEFAULT_IFS
P = F.Params

TEST = ("2026-06-01", "2026-10-31")
DEV = ("2025-11-01", "2026-04-30")

_CONT = dict(scale_speed=None, obs_operator=None)
VARIANTS_TEST = {
    "A0 climatological paths (no weighting)": P(sigma_doy=None, sigma_hour=None, regime=None, shift_now=False),
    "A1 IFS: season + issue hour": replace(DI, regime=None, shift_now=False, **_CONT),
    "A2 IFS: + forecast regime": replace(DI, shift_now=False, **_CONT),
    "A3 IFS: + current-error shift": replace(DI, **_CONT),
    "A4 IFS: + speed rescaling": replace(DI, obs_operator=None),
    "A4c IFS: + calm carry-over (= DEFAULT_IFS)": DI,
    "A5 consensus, mixed library (= DEFAULT)": D,
    "A5a DEFAULT w/o spread rescaling": replace(D, scale_spread=None),
    "A5b DEFAULT w/o IFS-entry down-weight": replace(D, ifs_entry_weight=1.0),
    "A5c DEFAULT, consensus residuals only": replace(D, lib_source="cons"),
    "A5d DEFAULT, untapered shift": replace(D, beta_taper_h=None),
    "A5e DEFAULT, no shift": replace(D, shift_now=False),
    "A5f DEFAULT w/o calm carry-over (continuous)": replace(D, obs_operator=None),
    "A5g DEFAULT + METAR rounding (1 kt, 10 deg)": replace(D, obs_operator="metar"),
    "A5n DEFAULT, IFS-only analogues on the IFS centre (w 0.1) (= DEFAULT_NATIVE)": F.DEFAULT_NATIVE,
    "A5n' same, IFS-entry weight 0.25": replace(F.DEFAULT_NATIVE, ifs_entry_weight=0.25),
}
EMOS_IFS, EMOS_CONS = "B EMOS/NGR + copula, IFS", "B EMOS/NGR + copula, CONS (mixed library)"
NATIVE = "A5n DEFAULT, IFS-only analogues on the IFS centre (w 0.1) (= DEFAULT_NATIVE)"
DEF = "A5 consensus, mixed library (= DEFAULT)"
VARIANTS_DEV = {k: v for k, v in VARIANTS_TEST.items() if k.startswith(("A0", "A1", "A2", "A3", "A4"))}


def simulate(variants, idx, seeds=(0,)):
    jobs = [(k if s == 0 else f"{k} #seed{s}", v, idx, E.N, s) for k, v in variants.items() for s in seeds]
    with get_context("fork").Pool(4) as pool:
        return dict(pool.map(E.run_variant, jobs))


def day_block_bootstrap(a, b, days, n_boot=2000, seed=0):
    """Mean difference a-b (per-issue values) with a 95 % CI resampling whole days."""
    ok = ~np.isnan(a) & ~np.isnan(b)
    a, b, days = a[ok], b[ok], days[ok]
    ud, inv = np.unique(days, return_inverse=True)
    sa, sb, cnt = (np.bincount(inv, weights=x, minlength=len(ud)) for x in (a, b, np.ones_like(a)))
    rng = np.random.default_rng(seed)
    diffs = []
    for _ in range(n_boot):
        k = rng.integers(0, len(ud), len(ud))
        diffs.append(sa[k].sum() / cnt[k].sum() - sb[k].sum() / cnt[k].sum())
    return float(a.mean() - b.mean()), np.percentile(diffs, [2.5, 97.5])


def reliability(p, y, bins=(0, .05, .2, .4, .6, .8, .95, 1.0001)):
    rows = []
    for lo, hi in zip(bins[:-1], bins[1:]):
        m = (p >= lo) & (p < hi)
        if m.sum():
            rows.append((f"[{lo:.2f},{min(hi, 1):.2f})", int(m.sum()), float(p[m].mean()), float(y[m].mean())))
    return rows


def run_period(name, start, end, variants, need_icon, var="tw25", seeds=(0,), extra_rows=True):
    E.VAR = var
    E.lib()                                 # build the library before forking workers
    idx = E.test_issues(start, end, need_icon=need_icon)
    t0 = time.time()
    res = simulate(variants, idx, seeds)
    print(f"[{name}/{var}] {len(idx)} issues, {len(res)} runs in {time.time()-t0:.0f}s", flush=True)
    common = np.ones(len(idx), bool)
    for r in res.values():
        common &= ~np.isnan(r["crps"]).all(1)
    base = {}
    for src in (["ifs", "cons"] if need_icon else ["ifs"]):
        base[f"B deterministic {src.upper()} (CRPS = MAE)"] = E.run_det(idx, src)
        base[f"B Gaussian per lead, {src.upper()}"] = E.run_gauss(idx, src)
        base[f"B Gaussian per lead + current error, {src.upper()}"] = E.run_gauss(idx, src, ar=True)
    t0 = time.time()
    base[EMOS_IFS] = E.run_emos(idx, centre="ifs")
    if need_icon:
        base[EMOS_CONS] = E.run_emos(idx, centre="cons_mix", ifs_entry_weight=0.25)
    print(f"[{name}/{var}] EMOS baselines in {time.time()-t0:.0f}s", flush=True)
    for r in base.values():
        common &= ~np.isnan(r["crps"]).all(1)
    rows = [E.summarize(k, r, idx, common) for k, r in {**base, **res}.items()]
    df = pd.DataFrame(rows)
    df.to_csv(OUT / f"final_{name}_{var}.csv", index=False)
    return idx, common, base, res, df


def md_table(df, cols, fmt="{:.3f}"):
    out = ["| " + " | ".join(cols) + " |", "|" + "---|" * len(cols)]
    for _, r in df.iterrows():
        cells = []
        for c in cols:
            v = r[c]
            cells.append(str(v) if isinstance(v, str) else ("" if pd.isna(v) else fmt.format(v)))
        out.append("| " + " | ".join(cells) + " |")
    return "\n".join(out)


def main():
    L = E.lib()
    md = [f"Library: {len(L.tau)} hourly pseudo-issues, {L.meta['n_inits']} IFS runs ({L.meta['first_tau']} .. "
          f"{L.meta['last_tau']}), IFS files: {', '.join(Path(p).name for p in L.meta['ifs_files'])}, "
          f"METAR: {Path(L.meta['metar']).name}. Generated {pd.Timestamp.now('UTC'):%Y-%m-%d %H:%M} UTC.\n"]

    # ---- test period, tw25
    idx, common, base, res, df = run_period("test", *TEST, VARIANTS_TEST, True, "tw25", seeds=(0, 1, 2))
    Y = E.truth(idx)
    days = np.repeat(L.times[idx].floor("D").asi8[:, None], 48, axis=1)
    md.append(f"### Headline: test issues {TEST[0]} .. {TEST[1]} (hourly, n = {int(common.sum())}), tailwind on 25\n")
    head = [k for k in ["B deterministic CONS (CRPS = MAE)", "B Gaussian per lead, IFS",
                        "B Gaussian per lead + current error, CONS", EMOS_IFS, EMOS_CONS, DEF, NATIVE]]
    hd = df.set_index("variant").loc[head].reset_index()
    md.append(md_table(hd, ["variant", "crps_6", "crps_24", "crps_48", "crps_all", "brier5_6", "brier5_24",
                            "brier_any5_1_12", "brier_any5_13_24", "brier_any5_25_48"]))
    ref = df.set_index("variant").loc[[EMOS_IFS, EMOS_CONS]].min()          # strongest EMOS per column
    dv = df.set_index("variant").loc[DEF]
    md.append("\nDEFAULT relative to the stronger EMOS/NGR baseline per column (negative = DEFAULT better): " + ", ".join(
        f"{c} {100 * (dv[c] / ref[c] - 1):+.1f} %" for c in ["crps_6", "crps_24", "crps_48", "crps_all", "brier5_24",
                                                            "brier_any5_1_12", "brier_any5_13_24",
                                                            "brier_any5_25_48"]) + "\n")
    md.append(f"### Test: issues {TEST[0]} .. {TEST[1]} (hourly, n = {int(common.sum())}), tailwind on 25 (kt)\n")
    cols = ["variant", "crps_1", "crps_6", "crps_24", "crps_48", "crps_all", "brier0_6", "brier0_24", "brier0_48",
            "brier5_6", "brier5_24", "brier5_48"]
    md.append(md_table(df[~df.variant.str.contains("#seed")], cols))
    cols = ["variant", "cov80_6", "cov80_24", "cov80_48", "cov95_6", "cov95_24", "cov95_48", "pit_dev_6",
            "pit_dev_24", "pit_dev_48"]
    md.append("\nInterval coverage and PIT flatness (pit_dev = sum over 10 bins of |freq - 0.1|; 0 = flat):\n")
    md.append(md_table(df[df.variant.str.startswith(("B Gauss", "A")) & ~df.variant.str.contains("#seed")], cols))
    cols = ["variant", "brier_any5_1_12", "brier_any5_13_24", "brier_any5_25_48", "ac1_sim", "ac1_real", "ac3_sim",
            "ac3_real", "ac6_sim", "ac6_real", "within_ac1", "within_ac6", "ess_median"]
    md.append("\nPath functionals (Brier of P(tailwind 25 > 5 kt in at least one hour of the window)) and the time "
              "correlation of residuals (pooled over issues, sim = member 0 of each issue; within = across members "
              "of one issue):\n")
    md.append(md_table(df[~df.variant.str.contains("#seed")], cols))
    md.append("\nSampling noise (seeds 0/1/2, CRPS all leads): " + "; ".join(
        f"{k}: " + "/".join(f"{df.loc[df.variant == n, 'crps_all'].iloc[0]:.4f}"
                            for n in [k, f"{k} #seed1", f"{k} #seed2"])
        for k in ["A4c IFS: + calm carry-over (= DEFAULT_IFS)", "A5 consensus, mixed library (= DEFAULT)"]))
    # bootstrap
    dflt = res["A5 consensus, mixed library (= DEFAULT)"]
    md.append("\nDay-block bootstrap (2,000 resamples) of the CRPS difference, DEFAULT minus reference "
              "(negative = DEFAULT better):\n")
    md.append("| reference | lead | diff | 95 % CI |\n|---|---|---|---|")
    for ref in [EMOS_CONS, EMOS_IFS, "B Gaussian per lead, IFS", "B Gaussian per lead + current error, CONS",
                "A4c IFS: + calm carry-over (= DEFAULT_IFS)", "A5b DEFAULT w/o IFS-entry down-weight", NATIVE]:
        rr = base.get(ref, res.get(ref))
        for lead in [6, 24, 48]:
            a = dflt["crps"][common, lead - 1]
            b = rr["crps"][common, lead - 1]
            d, ci = day_block_bootstrap(a, b, days[common, lead - 1])
            md.append(f"| {ref} | {lead} | {d:+.3f} | [{ci[0]:+.3f}, {ci[1]:+.3f}] |")
    # bootstrap of the path-question Brier (per issue squared error), DEFAULT minus reference
    md.append("\nDay-block bootstrap of the path-question Brier, P(tailwind 25 > 5 kt in at least one hour of the "
              "window), DEFAULT minus reference (negative = DEFAULT better):\n")
    md.append("| reference | window | DEFAULT | reference | diff | 95 % CI |\n|---|---|---|---|---|---|")
    for ref in [EMOS_CONS, EMOS_IFS, NATIVE]:
        rr = base.get(ref, res.get(ref))
        for w, (a_, b_) in enumerate(E.WINDOWS):
            yy = Y[:, a_ - 1:b_]
            okw = common & ~np.isnan(yy).any(1)
            ev = (yy[okw] > 5).any(1).astype(float)
            sa, sb = (dflt["fn"][okw, w] - ev) ** 2, (rr["fn"][okw, w] - ev) ** 2
            d, ci = day_block_bootstrap(sa, sb, days[okw, 0])
            md.append(f"| {ref} | {a_}-{b_} | {sa.mean():.4f} | {sb.mean():.4f} | {d:+.4f} | "
                      f"[{ci[0]:+.4f}, {ci[1]:+.4f}] |")
    # conditional reliability of the threshold that matters (tw25 > 5 kt)
    md.append("\nConditional reliability of P(tailwind 25 > 5 kt): cases binned by the forecast probability; bias = "
              "mean(obs - simulated mean); a calibrated ensemble has sim_sd ~ sd(obs - sim mean):\n")
    md.append("| model | lead | bin | n | mean P | observed | bias (kt) | sim sd | sd(obs - sim mean) |\n"
              "|---|---|---|---|---|---|---|---|---|")
    for nm, key in [("DEFAULT", DEF), ("DEFAULT_NATIVE", NATIVE), ("EMOS CONS", EMOS_CONS)]:
        rr = base.get(key, res.get(key))
        rc = {k: v[common] for k, v in rr.items() if isinstance(v, np.ndarray) and v.shape[:1] == (len(idx),)}
        for lead in [6, 24, 48]:
            for c in E.conditional_reliability(rc, Y[common], lead):
                md.append(f"| {nm} | {lead} | {c['bin']} | {c['n']} | {c['mean_P']:.3f} | {c['observed']:.3f} | "
                          f"{c['bias_obs_minus_sim']:+.2f} | {c['sim_sd']:.2f} | {c['sd_obs_minus_sim']:.2f} |")
    # reliability
    md.append("\nReliability of DEFAULT (test): forecast probability bins -> mean forecast vs observed frequency\n")
    md.append("| event | lead | bin | n | mean P | observed |\n|---|---|---|---|---|---|")
    for key, thr in [("p0", 0), ("p5", 5)]:
        for lead in [6, 24, 48]:
            p = dflt[key][common, lead - 1]
            y = Y[common, lead - 1]
            ok = ~np.isnan(y) & ~np.isnan(p)
            for b, n, mp, ob in reliability(p[ok], (y[ok] > thr).astype(float)):
                md.append(f"| tw25 > {thr} kt | {lead} | {b} | {n} | {mp:.3f} | {ob:.3f} |")
    # PIT histograms
    md.append("\nPIT histograms (10 bins, share of cases; flat = 0.10 each):\n")
    md.append("| model | lead | " + " | ".join(f"b{i}" for i in range(10)) + " |\n|---|---|" + "---|" * 10)
    for nm, r in [("DEFAULT", dflt), ("Gaussian IFS", base["B Gaussian per lead, IFS"])]:
        for lead in [6, 24, 48]:
            pit = r["pit"][common, lead - 1]
            pit = pit[~np.isnan(pit)]
            h = np.histogram(pit, bins=10, range=(0, 1))[0] / len(pit)
            md.append(f"| {nm} | {lead} | " + " | ".join(f"{x:.3f}" for x in h) + " |")

    # ---- test period, tw18 and gust tailwind 18
    for var in ["tw18", "gtw18"]:
        _, _, _, _, dv = run_period("test", *TEST, {"A5 DEFAULT": D, "A4 DEFAULT_IFS": DI}, True, var)
        a, b = E.THR[var]
        md.append(f"\n### Test, {var} (kt): Brier thresholds {a} / {b} kt\n")
        cols = ["variant", "crps_6", "crps_24", "crps_48", f"brier{a}_24", f"brier{b}_24", "cov80_24", "cov95_24",
                "pit_dev_24"]
        md.append(md_table(dv[~dv.variant.str.contains("current error")], cols, "{:.4f}"))

    # ---- dev period (IFS only)
    idd, cd, based, resd, dd = run_period("dev", *DEV, VARIANTS_DEV, False, "tw25")
    md.append(f"\n### Dev (robustness, IFS only, no ICON archive yet): issues {DEV[0]} .. {DEV[1]}\n")
    cols = ["variant", "crps_1", "crps_6", "crps_24", "crps_48", "crps_all", "brier0_24", "brier5_24", "cov80_24",
            "cov95_24", "brier_any5_1_12", "brier_any5_25_48", "ac1_sim", "ac1_real", "ac6_sim", "ac6_real"]
    md.append(md_table(dd, cols))
    Yd = E.truth(idd)
    md.append("\nDev: conditional reliability of P(tailwind 25 > 5 kt), DEFAULT_IFS and EMOS IFS:\n")
    md.append("| model | lead | bin | n | mean P | observed | bias (kt) | sim sd | sd(obs - sim mean) |\n"
              "|---|---|---|---|---|---|---|---|---|")
    for nm, rr in [("DEFAULT_IFS", resd["A4c IFS: + calm carry-over (= DEFAULT_IFS)"]), ("EMOS IFS", based[EMOS_IFS])]:
        rc = {k: v[cd] for k, v in rr.items() if isinstance(v, np.ndarray) and v.shape[:1] == (len(idd),)}
        for lead in [6, 24]:
            for c in E.conditional_reliability(rc, Yd[cd], lead):
                md.append(f"| {nm} | {lead} | {c['bin']} | {c['n']} | {c['mean_P']:.3f} | {c['observed']:.3f} | "
                          f"{c['bias_obs_minus_sim']:+.2f} | {c['sim_sd']:.2f} | {c['sd_obs_minus_sim']:.2f} |")
    (OUT / "final_tables.md").write_text("\n".join(md) + "\n")
    print("\n".join(md))


if __name__ == "__main__":
    main()
