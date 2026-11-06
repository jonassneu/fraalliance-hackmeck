"""PLAN.json primary comparison: blend with the multi-model centre vs the champion reproduction (long test).

    uv run python experiments/multimodel/run_e2e.py [--workers 4]

Arms (all weekly walk-forward on the long test, fra.evalkit weeks, lag 2, valid < 2026-11-01):
  ref     harness table unchanged + fra.blend.decision_walk_forward on the unchanged Part B library (= blend-v2)
  mm      tw25_cons / tw25_cons_roll6 recomputed from C + decision rollouts on the library whose 'icon' slot is the
          as-of non-IFS mean (cons = C, spread = |IFS - non-IFS mean|); everything else identical
Secondary (attribution): logit_mm + dec_ref, logit_ref + dec_mm. Outputs in experiments/multimodel/.
"""
import argparse
import dataclasses
import json
import os
import sys
import time
from pathlib import Path

for k in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(k, "1")

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from experiments import harness as Hn  # noqa: E402
from experiments.multimodel import consensus as M  # noqa: E402
from fra import blend as Bl  # noqa: E402
from fra import evalkit as E  # noqa: E402
from fra import fcerror as F  # noqa: E402

HERE = Path(__file__).resolve().parent
DATA_FROM = pd.Timestamp("2026-04-02", tz="UTC")
HOLDOUT = E.HOLDOUT_START
SEED = 20261105


def _h(ts):
    return int(M._hours([pd.Timestamp(ts)])[0])


def patched_library():
    lib = F.load_library()
    ifs = lib.fc["ifs"]
    sel = (lib.tau >= _h(DATA_FROM)) & (lib.tau < _h(HOLDOUT))
    nm = M.nonifs_mean(M.members(lib.tau[sel]))
    icon = np.full_like(ifs, np.nan)
    icon[sel] = M.lead_slice(nm, 0, 48)
    cons = np.where(np.isnan(icon), ifs, 0.5 * (ifs + icon))
    has_icon = ~np.isnan(icon[:, 1:43, 0]).any(axis=1)
    print(f"library: {sel.sum()} entries patched, has_icon {lib.has_icon.sum()} -> {has_icon.sum()}", flush=True)
    return dataclasses.replace(lib, fc={"ifs": ifs, "icon": icon, "cons": cons}, has_icon=has_icon)


def mm_table(d):
    d = d.copy()
    rng = (d["issue"] >= DATA_FROM) & (d["issue"] < HOLDOUT)
    iss = pd.DatetimeIndex(np.sort(d.loc[rng, "issue"].unique()))
    nm = M.nonifs_mean(M.members(M._hours(iss)))
    tw = F.tw_from_uv(nm[..., 0], nm[..., 1], F.H25)                    # [n_iss, NOFF], leads LMIN..LMAX
    win = np.stack([tw[:, (np.arange(1, 49) + h) - M.LMIN] for h in range(-3, 3)])
    roll6 = win.mean(axis=0)                                            # NaN if any hour is missing (as production)
    point = tw[:, np.arange(1, 49) - M.LMIN]
    ii = iss.get_indexer(d.loc[rng, "issue"])
    li = d.loc[rng, "lead"].to_numpy().astype(int) - 1
    nm_tw, nm_r6 = point[ii, li], roll6[ii, li]
    old = d.loc[rng, ["tw25_cons", "tw25_cons_roll6"]].copy()
    d.loc[rng, "tw25_cons"] = pd.concat([d.loc[rng, "tw25"], pd.Series(nm_tw, index=old.index)], axis=1).mean(1)
    d.loc[rng, "tw25_cons_roll6"] = pd.concat([d.loc[rng, "tw25_roll6"], pd.Series(nm_r6, index=old.index)],
                                              axis=1).mean(1)
    # derived feature (fra.dataset.add_weather_extras): xwf_east_tanh = tanh(xw_fut12 / 3) / (1 + exp(-tw / 2)) with
    # tw = tw25_cons.fillna(tw25); recomputed with the new consensus exactly as the live path computes it
    tw_old = old["tw25_cons"].fillna(d.loc[rng, "tw25"])
    tw_new = d.loc[rng, "tw25_cons"].fillna(d.loc[rng, "tw25"])
    tanh_part = d.loc[rng, "xwf_east_tanh"] * (1 + np.exp(-tw_old / 2))
    d.loc[rng, "xwf_east_tanh"] = tanh_part / (1 + np.exp(-tw_new / 2))
    ch = (d.loc[rng, "tw25_cons"] - old["tw25_cons"]).abs()
    print(f"logit table: {rng.sum()} rows in range, tw25_cons changed in {(ch > 1e-9).mean():.1%} "
          f"(mean |change| {ch.mean():.2f} kt)", flush=True)
    return d


def dec_run(tag, issues, workers, lib=None):
    out = HERE / f"dec_{tag}.parquet"
    if out.exists():
        return pd.read_parquet(out)
    t0 = time.time()
    orig = F.load_library
    if lib is not None:
        F.load_library = lambda *a, **k: lib          # inherited by the forked walk-forward workers
    try:
        dec = Bl.decision_walk_forward(issues, workers=workers)
    finally:
        F.load_library = orig
    dec.to_parquet(out, index=False)
    print(f"decision {tag}: {len(dec)} rows in {time.time() - t0:.0f}s", flush=True)
    return dec


def verdict(bt, bt_sel):
    pool = bt[(bt.metric == "brier") & (bt.lead == E.POOLED) & (bt.method == "mm - ref")].iloc[0]
    sel = bt_sel[(bt_sel.metric == "brier") & (bt_sel.lead == E.POOLED) & (bt_sel.method == "mm - ref")].iloc[0]
    acc = bt[(bt.metric == "acc") & (bt.lead.isin(E.REPORT_LEADS)) & (bt.method == "mm - ref")]
    c1, c2, c3 = bool(pool.hi < 0), bool(sel.est < 0), bool(not (acc.hi < 0).any())
    return dict(ci_below_0=c1, pre15sep_negative=c2, no_lead_worse=c3, clearly_wins=c1 and c2 and c3,
                primary=[float(pool.est), float(pool.lo), float(pool.hi), float(pool.p_boot)],
                pre15sep=[float(sel.est), float(sel.lo), float(sel.hi)])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--workers", type=int, default=4)
    a = ap.parse_args()
    d_ref = Hn.load()
    d_mm = mm_table(d_ref)
    z, y, p, ok = Hn.production_preds(d_ref, "od25")
    issues = z.loc[ok, "issue"].unique()
    dec_ref = dec_run("ref", issues, a.workers)
    dec_mm = dec_run("mm", issues, a.workers, lib=patched_library())
    t_ref = Bl.walk_forward_preds(d=d_ref, dec=dec_ref)
    t_mm = Bl.walk_forward_preds(d=d_mm, dec=dec_mm)
    k = ["issue", "lead"]
    t = t_ref.merge(t_mm[k + ["p_logit", "p_dec", "p_blend"]], on=k, suffixes=("_ref", "_mm"))
    t["p_lmm_dref"] = 0.5 * t.p_logit_mm + 0.5 * t.p_dec_ref
    t["p_lref_dmm"] = 0.5 * t.p_logit_ref + 0.5 * t.p_dec_mm
    t.to_parquet(HERE / "e2e_preds.parquet", index=False)
    y = (t.od == 25).astype(float).where(t.od.isin([25, 7]))
    preds = {"ref": t.p_blend_ref, "mm": t.p_blend_mm, "logit_mm+dec_ref": t.p_lmm_dref,
             "logit_ref+dec_mm": t.p_lref_dmm, "logit_ref": t.p_logit_ref, "logit_mm": t.p_logit_mm,
             "dec_ref": t.p_dec_ref, "dec_mm": t.p_dec_mm}
    pairs = [("mm", "ref"), ("logit_mm+dec_ref", "ref"), ("logit_ref+dec_mm", "ref"), ("logit_mm", "logit_ref"),
             ("dec_mm", "dec_ref")]
    bt = E.bootstrap(y, preds, t.valid, t.lead, pairs=pairs, seed=SEED)
    sel = pd.DatetimeIndex(t.valid) < E.SELECTION_START
    bt_sel = E.bootstrap(y, preds, t.valid, t.lead, pairs=pairs, mask=sel, seed=SEED)
    changed = (t.od != t.od_now).to_numpy()
    bt_ch = E.bootstrap(y, preds, t.valid, t.lead, pairs=pairs, mask=changed, seed=SEED)
    bt.to_csv(HERE / "e2e_bootstrap.csv", index=False)
    bt_sel.to_csv(HERE / "e2e_bootstrap_pre15sep.csv", index=False)
    bt_ch.to_csv(HERE / "e2e_bootstrap_changed.csv", index=False)
    v = verdict(bt, bt_sel)
    json.dump(v, open(HERE / "e2e_verdict.json", "w"), indent=1)
    show = bt[bt.method.isin(["ref", "mm", "mm - ref", "logit_mm+dec_ref - ref", "logit_ref+dec_mm - ref",
                              "logit_mm - logit_ref", "dec_mm - dec_ref"])]
    print(show.pivot_table(index=["metric", "method"], columns="lead", values="est", sort=False).round(4).to_string())
    print("\npaired differences (Brier, lead 0 = pooled 1/6/24/48):")
    for _, r in bt[(bt.metric == "brier") & bt.method.str.contains(" - ")].iterrows():
        print(f"  {r.method:28s} lead {r.lead:3d}: {r.est:+.5f} [{r.lo:+.5f}, {r.hi:+.5f}] p {r.p_boot:.3f}")
    print("\naccuracy differences (pp):")
    for _, r in bt[(bt.metric == "acc") & (bt.method == "mm - ref")].iterrows():
        print(f"  lead {r.lead:3d}: {100 * r.est:+.2f} [{100 * r.lo:+.2f}, {100 * r.hi:+.2f}]")
    print("\nchanged hours, accuracy ref / mm by lead:")
    for L in E.REPORT_LEADS:
        g = bt_ch[(bt_ch.metric == "acc") & (bt_ch.lead == L)].set_index("method")
        print(f"  {L:2d} h n={int(g.loc['ref', 'n'])}: {100 * g.loc['ref', 'est']:.1f} / {100 * g.loc['mm', 'est']:.1f}"
              f"  diff {100 * g.loc['mm - ref', 'est']:+.1f} [{100 * g.loc['mm - ref', 'lo']:+.1f}, "
              f"{100 * g.loc['mm - ref', 'hi']:+.1f}]")
    print("\nVERDICT", json.dumps(v))


if __name__ == "__main__":
    main()
