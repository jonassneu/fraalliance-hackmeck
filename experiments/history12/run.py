"""Wave-3 runner: the 12-year radar history in the Part A decision model and the RWY 18 closure model.

    uv run python experiments/history12/run.py --dry-run     # plumbing + timing check on a partial backfill
    uv run python experiments/history12/run.py               # after the backfill (refuses while it is incomplete)
    options: --force (run on an incomplete backfill, results marked as such), --steps qa,labels,parta,rwy18,lag2
             --weeks N (first N test weeks), --paths N (Part B paths per issue, default 100), --workers N (<= 4)
             --gap-rule traffic|confirmed (which confirmed suspect hours are OD label gaps, fra.labels.GAP_RULE;
             default 'traffic'; 'confirmed' = the rule of the pre-registered first wave-3 run, outputs
             'wave3_confirmedgaps_*')

PROVENANCE (2026-11-03). The pre-registered analysis is the documented command (REPORT.md section 6 as of 31 Oct) with
the label-gap rule of that time, every confirmed suspect hour a gap: run 1 (02:06 UTC) printed PRIMARY before
fra.labels.GAP_RULE 'traffic' was coded (02:10-02:13 UTC). Its outputs are 'wave3_confirmedgaps_*' (= run.py
--gap-rule confirmed, byte-identical data files, wave3_provenance.json); 'wave3_*' (rule 'traffic') is a post-hoc
sensitivity. Every results JSON says which it is ('role', 'preregistered_output'). Each run appends a record with the
sha256 of the outputs it found and of those it wrote to run_manifest.jsonl, and a run of only some steps merges into
the existing results JSON instead of replacing it ('step_runs').

INFORMATION SET. Steps parta (pre-registered) and qa/labels use the hackathon data layer of experiments/parta:
od_now = flown OD of radar hour [t-1h, t) (experiments/parta/prod_preds.parquet), which FANOMOS publishes only about
60-75 min after the hour, so absolute accuracies there are look-ahead-inflated and not comparable with the champion
(blend-v2) or the holdout. Step lag2 repeats the comparison with the champion's information set (od_now = label of
t-2, fra.blend.rollout_many lag 2, Part B 200 paths seed 0, production logit p_logit of
experiments/integration/final_wf_long.parquet); its 'recent' arm reproduces blend-v2's p_dec.

SUBSETS. 'all' = the long test; 'selection_free' (identifier kept from the pre-registration) = the pre-15-Sep part,
valid < evalkit.SELECTION_START. It is NOT selection-free for the blend: the decision-model spec, the Part B parameters
and the 50/50 weight were chosen on the whole Jun-Oct test (fra.evalkit); only the holdout is clean.

Steps (outputs in experiments/history12/, prefixed 'dryrun_' in a dry run or 'forced_' with --force; a non-default
--gap-rule adds '<rule>gaps_' to the prefix and leaves the shared qa files untouched):
  qa      shares.py + era.py (published shares, coverage, COVID, era stability) on the current data
  labels  (a) labels from BOTH counts files: fra.labels.load_counts(include_history=True, complete_only=True) (complete
          history days only, fra.labels.history_gaps(--gap-rule) removed) -> to_labels(bridge="night") (never bridges
          an unfetched daytime hour). Per-year transition-row counts.
  parta   (b)+(c) weekly walk-forward on the long test (fra.evalkit: issues 2026-06-01 .. holdout, valid < holdout,
          production test rows of experiments/parta/prod_preds.parquet), decision model fra.decision.DEFAULT
          (logit C 0.1, 10 m wind, BASE + F6) trained on rows with h + 6 h <= week start, three training sets:
            recent    data/labels.parquet only (what Part A uses today; reproduces experiments/parta)
            hist      2014+ labels from (a), no era terms
            hist_era  2014+ labels from (a) + fra.decision.ERA (year trend, COVID flag)
            hist_era_nocovid  as hist_era without the fra.decision.COVID rows (Mar 2020 .. Dec 2021; secondary check)
          rolled out (i) along the observed wind ('perfect') and (ii) on Part B paths (fra.fcerror.sample_paths,
          its DEFAULT params at run time, seed 0, ensemble-mean look-ahead), each blended 50/50 with the production
          logit. Day-block bootstrap (fra.evalkit) with paired differences vs. 'recent', on all test rows and on the
          pre-15-Sep part (valid < evalkit.SELECTION_START). PRIMARY comparison, fixed before seeing results:
          blend(hist_era on Part B) - blend(recent on Part B), Brier(1,6,24,48). "Clearly wins" (fixed before the
          results): 95 % CI entirely below 0 on all rows AND negative point estimate on the pre-15-Sep part AND no
          lead (1/6/24/48) with an accuracy difference whose CI is entirely below 0 ('verdict' in the results JSON).
          Plus per-year transition behaviour of the pooled 'hist' model (switch rates, calibration offsets).
  rwy18   (d) RWY 18 extended walk-forward from 2015: quarterly folds, fra.decision.Rwy18Model (C 0.3, max(tw18, 0)
          + OD 07, observed wind and flown OD of the hour) trained on all earlier judged hours of all fetched radar
          hours (complete days not needed: each judged hour stands alone; every confirmed suspect hour removed,
          fra.labels.history_gaps("confirmed"), whatever --gap-rule; days that look like a planned runway
          outage are dropped, fra.decision.rwy18_outage_days, e.g. May - Oct 2020 and 2017-05-25/26, and so is the
          fra.decision.COVID window Mar 2020 .. Dec 2021, when 15-30 movement hours often had no RWY 18 departure
          without any closure; test metrics with and without the outage days) vs. trained on the last 365 days only
          vs. climatology and the steady / gust 15 kt rules. Brier, skill, AUC, hits and false alarms per 1,000 h at
          the P(open) < 0.8 warning level, per era and for the 2026-06-01 .. holdout test window.
  lag2    sensitivity of PRIMARY to the information set (see above): the four training sets rolled out with
          fra.blend.rollout_many at lag 2 on the issues of experiments/integration/final_wf_long.parquet (weekly folds
          of fra.evalkit, same training cut h + 6 h <= week start), blended 50/50 with its p_logit; same bootstrap,
          subsets and verdict. Outputs '<prefix>lag2_preds.parquet', '<prefix>lag2_bootstrap.csv'.
Nothing here edits fra/*.py or experiments/parta; Part A, Part B and fra.blend are imported read-only. Never uses the
locked holdout (issue or valid >= 2026-11-01).
"""

import argparse
import os
import sys
import time

for _k in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(_k, "1")

from concurrent.futures import ProcessPoolExecutor  # noqa: E402
from pathlib import Path  # noqa: E402

import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import h12lib as L  # noqa: E402

sys.path.insert(0, str(L.ROOT / "experiments" / "parta"))
import common as C  # noqa: E402  (experiments/parta/common.py, read-only use)
from fra import decision as D  # noqa: E402
from fra import evalkit as EK  # noqa: E402

HOUR = pd.Timedelta(hours=1)
VARIANTS = ("recent", "hist", "hist_era", "hist_era_nocovid")
COVID = D.COVID          # 2020-03-01 .. 2022-01-01, the window of fra.decision's 'covid' era flag
PRIMARY = ("blend_partb_hist_era", "blend_partb_recent")
RWY18_FIRST_FOLD = pd.Timestamp("2015-01-01", tz="UTC")
RWY18_WARN = 0.2                     # P(closed) >= 0.2  <=>  P(open) < 0.8 (the dashboard warning level)
ERAS = {"2014-2019": (2014, 2019), "2020-2021 (COVID)": (2020, 2021), "2022-2026": (2022, 2026)}
ALL_STEPS = ("qa", "labels", "parta", "rwy18", "lag2")
OUTPUTS = ("results.json", "parta_preds.parquet", "parta_bootstrap.csv", "parta_coefficients.csv",
           "parta_transition_era.csv", "rwy18_walkforward.parquet", "rwy18_bootstrap.csv", "lag2_preds.parquet",
           "lag2_bootstrap.csv")
MANIFEST = L.OUT / "run_manifest.jsonl"
PREREGISTERED_OUTPUT = "wave3_confirmedgaps_results.json"
ROLE = {"confirmed": "preregistered: the label-gap rule (every confirmed suspect hour) in force when the documented "
                     "wave-3 command (REPORT.md section 6 of 31 Oct 2026) was first run, 2026-11-03 02:06 UTC",
        "traffic": "post-hoc sensitivity: fra.labels.GAP_RULE 'traffic' was coded at 02:10-02:13 UTC, after the first "
                   "run had printed PRIMARY (about 02:07 UTC); same verdict"}
SUBSETS = {"all": "long test: issues 2026-06-01 .. holdout, valid < 2026-11-01",
           "selection_free": "pre-15-Sep part (valid < 2026-09-15); pre-registered under the name 'selection-free', "
                             "but the decision-model spec, Part B parameters and blend weight were selected on the "
                             "whole long test, so no part of Jun-Oct 2026 is selection-free; only the holdout is clean"}
LAG2_SOURCE = L.ROOT / "experiments" / "integration" / "final_wf_long.parquet"
PRIMARY_LAG2 = ("blend_hist_era", "blend_recent")
_G = {}


# ------------------------------------------------------------------------------------------------ status

def backfill_status():
    """Progress of the radar backfill (fra.history), read-only: share of 2014-01-01 .. 2026-02-10 daytime hours
    fetched, complete days, pass-1 share, suspects."""
    import json
    from fra import history as Hm
    days = pd.date_range(pd.Timestamp(Hm.START, tz="UTC"), pd.Timestamp(Hm.END, tz="UTC"), freq="D")
    done = Hm.done_ends()
    alld = Hm._ends(days, Hm.DAY_ENDS)
    p1 = Hm._ends(days, Hm.PASS1_ENDS)
    n_all = sum(t in done for t in alld)
    n_p1 = sum(t in done for t in p1)
    comp = L.complete_day_index()
    comp = comp[(comp >= days[0]) & (comp <= days[-1])]
    try:
        prog = json.loads(Hm.PROGRESS.read_text())
    except (OSError, ValueError):
        prog = {}
    sus = L.suspects()
    frac = n_all / len(alld)
    return {"checked_at": pd.Timestamp.now(tz="UTC").isoformat(), "days": len(days),
            "daytime_hours_fetched": n_all, "daytime_hours_total": len(alld), "fetched_share": frac,
            "pass1_fetched": n_p1, "pass1_total": len(p1), "complete_days": int(len(comp)),
            "complete_share": len(comp) / len(days), "progress": prog,
            "suspects": sus["status"].value_counts().to_dict() if len(sus) else {},
            "complete": bool(frac >= 0.99 and len(comp) >= 0.95 * len(days))}


# ------------------------------------------------------------------------------------------------ (a) labels

def history_labels(gap_rule=None):
    """(a): labels from both counts files, complete history days only, label gaps (fra.labels.history_gaps(gap_rule))
    removed, night-only bridge."""
    from fra.labels import load_counts, to_labels
    raw = load_counts(include_history=True, complete_only=True, gap_rule=gap_rule)
    return to_labels(raw, bridge="night")


def rwy18_labels():
    """Labels for the RWY 18 walk-forward: every fetched hour (no complete-day requirement; a judged hour needs no
    bridging), every confirmed suspect hour removed (rule 'confirmed' whatever the OD gap rule: in the re-admitted
    low-traffic hours 'no RWY 18 departure' is far more frequent under OD 25, experiments/history12/suspects.py)."""
    from fra.labels import history_gaps, load_counts, to_labels
    raw = load_counts(include_history=True, complete_only=False)
    raw = raw[~raw.index.isin(history_gaps("confirmed"))]
    return to_labels(raw, bridge="night")


def label_stats(lab_hist, rows_hist, rows_recent):
    cut = EK.HOLDOUT_START          # counts only; nothing from the locked holdout
    lab_hist, rows_hist, rows_recent = (x[x.index < cut] for x in (lab_hist, rows_hist, rows_recent))
    hist_days = lab_hist.index[lab_hist["west_frac"].notna() & (lab_hist.index < pd.Timestamp("2025-06-01", tz="UTC"))]
    by_year = pd.DataFrame({
        "observed_hours": lab_hist["west_frac"].notna().groupby(lab_hist.index.year).sum(),
        "transition_rows": rows_hist.groupby(rows_hist.index.year).size(),
        "switches": (rows_hist["stay"] == 0).groupby(rows_hist.index.year).sum(),
        "morning_rows": (rows_hist["kind"] == "morning").groupby(rows_hist.index.year).sum(),
    }).fillna(0).astype(int)
    return {"hist_observed_days_before_2025_06": int(hist_days.floor("D").nunique()),
            "transition_rows_hist": len(rows_hist), "transition_rows_recent": len(rows_recent),
            "recent_rows_identical_in_hist": int(rows_recent.index.isin(rows_hist.index).sum()),
            "by_year": by_year.reset_index(names="year").to_dict("records")}


# ------------------------------------------------------------------------------------------------ (b)+(c) Part A

def _init(cfg):
    from fra import fcerror as B
    obs = D.load_obs()
    lab_r = C.load_labels(False)
    lab_h = history_labels(cfg["gap_rule"])
    rows_r = D.transitions(D.features(obs, lab_r))
    rows_h = D.transitions(D.features(obs, lab_h))
    prod = pd.read_parquet(C.OUT / "prod_preds.parquet")
    nocov = rows_h[(rows_h.index < COVID[0]) | (rows_h.index >= COVID[1])]
    _G.update(cfg=cfg, obs=obs, obs0=D.load_obs(fill_gap_h=0), rows={"recent": rows_r, "hist": rows_h,
              "hist_era": rows_h, "hist_era_nocovid": nocov}, prod=prod, iss=C.issue_table(prod, lab_r), B=B,
              lib=B.load_library() if cfg["partb"] else None)


def _spec(variant):
    s = dict(D.DEFAULT)
    if variant.startswith("hist_era"):
        s["features"] = list(s["features"]) + list(D.ERA)
    return s


def run_week(ws):
    cfg = _G["cfg"]
    obs, obs0, iss, B, lib = _G["obs"], _G["obs0"], _G["iss"], _G["B"], _G["lib"]
    we = min(ws + pd.Timedelta(days=7), EK.HOLDOUT_START)
    it = iss[(iss["issue"] >= ws) & (iss["issue"] < we)]
    if not len(it):
        return None, None
    models, coefs = {}, []
    for v in VARIANTS:
        rows = _G["rows"][v]
        m = D.DecisionModel(**_spec(v)).fit(rows[rows.index + D.FUT * HOUR <= ws])
        models[v] = m
        c = m.coefficients()
        c.columns = [f"prev{p}" for p in c.columns]
        coefs.append(c.assign(variant=v, week=ws, n25=m.n_train[25], n07=m.n_train[7]).reset_index(names="feature"))
    issues = it["issue"].to_numpy()
    od0 = it["od_now"].to_numpy()
    out = {"issue": np.repeat(issues, C.H), "lead": np.tile(np.arange(C.H), len(it))}
    W = C.obs_windows(obs, it["issue"], D.CHANNELS)
    for v, m in models.items():
        out[f"p_perfect_{v}"] = D.rollout_batch(m, od0, it["issue"], W, C.H, D.CHANNELS)["p25"].ravel()
    if cfg["partb"]:
        npth = cfg["paths"]
        keep, P_list = [], []
        for t in it["issue"]:
            P = B.sample_paths(t, n=npth, lib=lib, seed=0)
            keep.append(P is not None)
            if P is not None:
                P_list.append((t, P))
        res = {v: np.full((len(it), C.H), np.nan) for v in models}
        idx = np.flatnonzero(keep)
        od_k = od0[idx]
        for c0 in range(0, len(P_list), 56):
            chunk = P_list[c0:c0 + 56]
            Ws = np.concatenate([D.assemble_paths(obs0, t, np.stack([P.u, P.v, P.gust], -1), C.H, D.CHANNELS,
                                                  valid=P.valid) for t, P in chunk])
            nI = len(chunk)
            Wa = np.repeat(np.nanmean(Ws.reshape(nI, npth, *Ws.shape[1:]), axis=1), npth, axis=0)
            o = np.repeat(od_k[c0:c0 + nI], npth)
            starts = list(np.repeat(np.asarray([t for t, _ in chunk], dtype=object), npth))
            for v, m in models.items():
                r = D.rollout_batch(m, o, starts, Ws, C.H, D.CHANNELS, W_ant=Wa)
                res[v][idx[c0:c0 + nI]] = r["p25"].reshape(nI, npth, C.H).mean(1)
        for v in models:
            out[f"p_partb_{v}"] = res[v].ravel()
    print(f"  week {ws.date()}: {len(it)} issues", flush=True)
    return pd.DataFrame(out), pd.concat(coefs, ignore_index=True)


def score_parta(pred, prefix):
    prod = _G["prod"]
    t = prod.merge(pred, on=["issue", "lead"], how="inner")
    cols = [c for c in t.columns if c.startswith("p_perfect_") or c.startswith("p_partb_")]
    for c in [c for c in cols if c.startswith("p_partb_")] + [c for c in cols if c.startswith("p_perfect_")]:
        t["blend_" + c[2:]] = (t[c] + t["p_prod"]) / 2
    methods = {"production": "p_prod", **{c[2:]: c for c in cols},
               **{c: c for c in t.columns if c.startswith("blend_")}}
    y = (t["od"] == 25).astype(float).to_numpy()
    preds = {k: t[v].to_numpy() for k, v in methods.items()}
    pairs = []
    for kind in ("partb", "perfect", "blend_partb", "blend_perfect"):
        for v in VARIANTS[1:]:
            a, b = (f"{kind}_{v}", f"{kind}_recent")
            if a in preds and b in preds:
                pairs.append((a, b))
    for k in [k for k in preds if k.startswith("blend_partb_")]:
        pairs.append((k, "production"))
    tabs = []
    for name, mask in (("all", None), ("selection_free", (t["valid"] < EK.SELECTION_START).to_numpy())):
        b = EK.bootstrap(y, preds, t["valid"], t["lead"], pairs=pairs, mask=mask)
        tabs.append(b.assign(subset=name))
    boot = pd.concat(tabs, ignore_index=True)
    # sensitivity of the PRIMARY pair to the block length (the holdout analysis uses 3-day blocks, amendment A3)
    sens = []
    for bd in (3, 7):
        for name, mask in (("all", None), ("selection_free", (t["valid"] < EK.SELECTION_START).to_numpy())):
            b = EK.bootstrap(y, {k: preds[k] for k in PRIMARY}, t["valid"], t["lead"], pairs=[PRIMARY], mask=mask,
                             block_days=bd)
            sens.append(b[b["method"] == f"{PRIMARY[0]} - {PRIMARY[1]}"].assign(subset=name, block_days=bd))
    _G["primary_block_sensitivity"] = pd.concat(sens, ignore_index=True)
    metrics = {k: C.rollout_metrics(t.dropna(subset=[v]), v) for k, v in methods.items()}
    keep = t if prefix != "dryrun_" else t[t["lead"].isin(EK.REPORT_LEADS)]   # dry run: report leads only (size)
    L.atomic_write(keep[["issue", "lead", "valid", "od", "od_now", "p_prod"] + cols],
                   L.OUT / f"{prefix}parta_preds.parquet")
    L.atomic_write(boot, L.OUT / f"{prefix}parta_bootstrap.csv", index=False, float_format="%.6g")
    return boot, metrics, int(len(t))


def transition_era(rows_hist, model):
    """Per-year transition behaviour under the pooled 'hist' model: observed switch rate, mean predicted switch rate
    and the calibration offset (logit shift of P(stay)) with a week-block bootstrap CI, per previous OD."""
    out = []
    for prev in (25, 7):
        r = rows_hist[rows_hist["od_prev"] == prev]
        if not len(r):
            continue
        p = np.clip(model.p_stay(r, prev), 1e-6, 1 - 1e-6)
        eta = np.log(p / (1 - p))
        for y in sorted(r.index.year.unique()):
            m = (r.index.year == y)
            yy = r["stay"].to_numpy()[m].astype(float)
            d = L.logit_offset_fit(eta[m], yy)
            W = L.boot_row_weights(L.week_blocks(r.index[m]), 200, seed=int(y) * 10 + prev)
            lo, hi = L.ci([L.logit_offset_fit(eta[m], yy, w) for w in W])
            out.append({"prev_od": prev, "year": int(y), "rows": int(m.sum()), "switches": int((yy == 0).sum()),
                        "switch_rate": float(1 - yy.mean()), "pred_switch_rate": float(1 - p[m].mean()),
                        "offset_logit_stay": d, "offset_lo": lo, "offset_hi": hi})
    return pd.DataFrame(out)


def step_parta(cfg, prefix):
    weeks = C.week_starts()
    if cfg["weeks"]:
        weeks = weeks[:cfg["weeks"]]
    t0 = time.time()
    parts, coefs = [], []
    with ProcessPoolExecutor(cfg["workers"], initializer=_init, initargs=(cfg,)) as ex:
        for df, co in ex.map(run_week, weeks):
            if df is not None:
                parts.append(df)
                coefs.append(co)
    pred = pd.concat(parts, ignore_index=True)
    _init(cfg)   # main process: labels/rows/prod for scoring and diagnostics
    boot, metrics, n = score_parta(pred, prefix)
    co = pd.concat(coefs, ignore_index=True)
    L.atomic_write(co, L.OUT / f"{prefix}parta_coefficients.csv", index=False, float_format="%.5g")
    rows_h = _G["rows"]["hist"]
    m_all = D.DecisionModel(**_spec("hist")).fit(rows_h[rows_h.index + D.FUT * HOUR <= EK.TEST_START])
    te = transition_era(rows_h[rows_h.index < EK.TEST_START], m_all)
    L.atomic_write(te, L.OUT / f"{prefix}parta_transition_era.csv", index=False, float_format="%.5g")
    era_coef = co[(co["variant"] == "hist_era") & co["feature"].isin(D.ERA)]
    pri = boot[(boot["metric"] == "brier") & (boot["lead"] == EK.POOLED)
               & (boot["method"] == f"{PRIMARY[0]} - {PRIMARY[1]}")]
    sens = _G["primary_block_sensitivity"]
    sens = sens[(sens["metric"] == "brier") & (sens["lead"] == EK.POOLED)]
    res = {"rows_scored": n, "weeks": len(weeks), "seconds": round(time.time() - t0),
           "primary": pri[["subset", "est", "lo", "hi", "p_boot"]].to_dict("records"),
           "primary_block_sensitivity": sens[["subset", "block_days", "est", "lo", "hi", "p_boot"]].to_dict("records"),
           "metrics": metrics, "labels": label_stats(history_labels(cfg["gap_rule"]), rows_h, _G["rows"]["recent"]),
           "era_coefficients_last_week": era_coef.tail(4).to_dict("records")}
    if cfg["partb"]:
        import endtoend as EE   # experiments/parta/endtoend.py (Part B state record only)
        res["partb"] = EE.partb_state(_G["B"], _G["lib"])
    return res


def verdict(boot, pair):
    """The pre-registered "clearly wins" check (fixed before any history result) for `pair` = (a, b) on a bootstrap
    table of fra.evalkit.bootstrap with subsets 'all' / 'selection_free' (= pre-15-Sep part):
      c1 Brier(1,6,24,48) difference a - b: 95 % CI entirely below 0 on all rows;
      c2 its point estimate < 0 on the pre-15-Sep part;
      c3 no lead in 1/6/24/48 where the accuracy difference a - b has a CI entirely below 0 (all rows)."""
    name = f"{pair[0]} - {pair[1]}"
    b = boot[boot["method"] == name]
    br = b[(b["metric"] == "brier") & (b["lead"] == EK.POOLED)].set_index("subset")
    acc = b[(b["metric"] == "acc") & (b["subset"] == "all") & b["lead"].isin(EK.REPORT_LEADS)]
    if "all" not in br.index or "selection_free" not in br.index or not len(acc):
        return {"pair": name, "complete": False}
    c1 = bool(br.loc["all", "hi"] < 0)
    c2 = bool(br.loc["selection_free", "est"] < 0)
    worse = [int(x) for x in acc.loc[acc["hi"] < 0, "lead"]]
    c3 = not worse
    return {"pair": name, "complete": True, "clearly_wins": c1 and c2 and c3,
            "c1_ci_below_0_all": c1, "c2_negative_estimate_pre_sep15": c2, "c3_no_lead_significantly_worse": c3,
            "leads_significantly_worse": worse,
            "brier_all": br.loc["all", ["est", "lo", "hi", "p_boot"]].to_dict(),
            "brier_pre_sep15": br.loc["selection_free", ["est", "lo", "hi", "p_boot"]].to_dict(),
            "acc_diff_all": acc[["lead", "est", "lo", "hi"]].to_dict("records")}


# ------------------------------------------------------------------------------------------------ (d) RWY 18

def step_rwy18(prefix):
    from sklearn.metrics import roc_auc_score
    obs = D.load_obs()
    F = D.features(obs, rwy18_labels())
    r = D.rwy18_rows(F)
    r = r[r.index < EK.HOLDOUT_START]
    r = r[r["observed"]]                       # flown OD of the hour itself (not bridged)
    out_days = L.rwy18_outage_days(r.index, r["closed"], r["tw18_0"])
    r["outage"] = r.index.floor("D").isin(out_days)
    n_out = int(r["outage"].sum())
    # COVID traffic: hours with 15-30 movements and no RWY 18 departure are routine non-use, not closures (radar
    # probe covid_probe.csv); the >= 15 movement 'busy' rule was set for normal traffic -> leave the window out
    cov = (r.index >= COVID[0]) & (r.index < COVID[1])
    n_cov = int(cov.sum())
    r = r[~cov]
    starts = pd.date_range(RWY18_FIRST_FOLD, EK.HOLDOUT_START, freq="QS", inclusive="left")
    preds, skipped = [], []
    for fs in starts:
        fe = min(fs + pd.offsets.QuarterBegin(startingMonth=1), EK.HOLDOUT_START)
        te = r[(r.index >= fs) & (r.index < fe)]          # test: outage days kept (flagged), scored both ways
        tr = r[(r.index < fs) & ~r["outage"]]             # training: outage days never used
        rec = tr[tr.index >= fs - pd.Timedelta(days=365)]
        if not len(te):
            continue
        if tr["closed"].sum() < 3:
            skipped.append({"fold": fs, "reason": f"{int(tr['closed'].sum())} training closures"})
            continue
        p_exp = D.Rwy18Model().fit(tr).p_closed(te, te["od"])
        p_rec = D.Rwy18Model().fit(rec).p_closed(te, te["od"]) if rec["closed"].sum() >= 3 and \
            rec["closed"].nunique() == 2 else np.full(len(te), np.nan)
        preds.append(pd.DataFrame({
            "time": te.index, "closed": te["closed"].to_numpy(), "od": te["od"].to_numpy(),
            "outage_day": te["outage"].to_numpy(),
            "tw18": te["tw18_0"].to_numpy(), "tw18g": te["tw18g_0"].to_numpy(), "fold": fs,
            "p_expanding": p_exp, "p_recent365": p_rec, "p_clim": float(tr["closed"].mean()),
            "rule_steady15": ((te["od"] == 7) & (te["tw18_0"] >= 15)).astype(float).to_numpy(),
            "rule_gust15": (te["tw18g_0"] >= 15).astype(float).to_numpy()}))
    if not preds:
        return {"folds": 0, "skipped": skipped}
    p = pd.concat(preds, ignore_index=True)
    L.atomic_write(p, L.OUT / f"{prefix}rwy18_walkforward.parquet")

    def metr(d, col):
        y = d["closed"].to_numpy()
        q = d[col].to_numpy()
        ok = np.isfinite(q)
        y, q = y[ok], q[ok]
        o = {"n": int(len(y)), "closures": int(y.sum())}
        if not len(y):
            return o
        if col.startswith("p_"):
            bs = float(np.mean((q - y) ** 2))
            bc = float(np.mean((d["p_clim"].to_numpy()[ok] - y) ** 2))
            o.update(brier=bs, brier_clim=bc, bss=1 - bs / bc if bc > 0 else np.nan,
                     auc=float(roc_auc_score(y, q)) if 0 < y.sum() < len(y) else np.nan)
            warn = q >= RWY18_WARN
        else:
            warn = q > 0.5
        o.update(hits=int((warn & (y == 1)).sum()), hit_rate=float((warn & (y == 1)).sum() / max(1, y.sum())),
                 false_alarms=int((warn & (y == 0)).sum()), fa_per_1000h=float(1000 * (warn & (y == 0)).sum() / len(y)))
        return o

    p_all = p
    p = p[~p["outage_day"]]   # headline: wind-driven availability (planned outage days scored separately below)
    subsets = {"all": p, "all_incl_outage_days": p_all, "test_2026-06_to_holdout": p[p["time"] >= EK.TEST_START]}
    for name, (a, b) in ERAS.items():
        yy = pd.DatetimeIndex(p["time"]).year
        subsets[name] = p[(yy >= a) & (yy <= b)]
    out = {}
    for name, d in subsets.items():
        out[name] = {c: metr(d, c) for c in ("p_expanding", "p_recent365", "p_clim", "rule_steady15", "rule_gust15")}
    se = {k: (p[c] - p["closed"]) ** 2 for k, c in (("expanding", "p_expanding"), ("recent365", "p_recent365"),
                                                     ("clim", "p_clim"))}
    boot = EK.bootstrap_means(se, p["time"], pairs=[("expanding", "clim"), ("expanding", "recent365")])
    L.atomic_write(boot, L.OUT / f"{prefix}rwy18_bootstrap.csv", index=False, float_format="%.6g")
    m_last = D.Rwy18Model().fit(r[~r["outage"]])
    return {"rows": int(len(r)), "closures": int(r["closed"].sum()), "first_row": r.index.min(),
            "closures_outside_outage_days": int(r.loc[~r["outage"], "closed"].sum()),
            "outage_days_excluded": [str(d.date()) for d in out_days], "outage_hours_excluded": n_out,
            "covid_hours_excluded": n_cov,
            "folds": int(p["fold"].nunique()), "skipped": skipped, "metrics": out,
            "brier_bootstrap": boot.to_dict("records"),
            "coefficients_all_data": m_last.coefficients().to_dict(),
            "closures_by_year": r[~r["outage"]].groupby(r[~r["outage"]].index.year)["closed"].agg(["size", "sum"])
            .reset_index(names="year")
            .to_dict("records")}


# ------------------------------------------------------------------------------------------------ lag-2 sensitivity

def _init_lag2(cfg):
    from fra import blend as BL
    from fra import fcerror as B
    obs = D.load_obs()
    lab_r = C.load_labels(False)
    rows_h = D.transitions(D.features(obs, history_labels(cfg["gap_rule"])))
    nocov = rows_h[(rows_h.index < COVID[0]) | (rows_h.index >= COVID[1])]
    _G.update(cfg=cfg, BL=BL, B=B, lab_r=lab_r, obs0=D.load_obs(fill_gap_h=0), lib=B.load_library(),
              rows={"recent": D.transitions(D.features(obs, lab_r)), "hist": rows_h, "hist_era": rows_h,
                    "hist_era_nocovid": nocov})


def run_week_lag2(job):
    """One week of the lag-2 sensitivity: as fra.blend._wf_week (config 'main': od_now = label of t - 2, Part B DEFAULT,
    fra.blend.N_PATHS paths, seed fra.blend.SEED), for every training set."""
    ws, issues = job
    BL, B, lab = _G["BL"], _G["B"], _G["lab_r"]
    lag = 2
    models = {v: D.DecisionModel(**_spec(v)).fit(r[r.index + D.FUT * HOUR <= ws]) for v, r in _G["rows"].items()}
    keep, futs, valids = [], [], []
    for t in issues:
        try:
            P = B.sample_paths(t, n=BL.N_PATHS, lib=_G["lib"], seed=BL.SEED)
        except KeyError:
            P = None
        if P is None or not np.isfinite(P.u).all():
            continue
        keep.append(t)
        futs.append(np.stack([P.u, P.v, P.gust], -1))
        valids.append(P.valid)
    if not keep:
        return None
    od = lab["od"].reindex(pd.DatetimeIndex(keep) - lag * HOUR).to_numpy()
    ok = np.isin(od, (25.0, 7.0))
    ki = [t for t, k in zip(keep, ok) if k]
    fu = [f for f, k in zip(futs, ok) if k]
    va = [v for v, k in zip(valids, ok) if k]
    df = pd.DataFrame({"issue": np.repeat(pd.DatetimeIndex(ki), BL.H), "lead": np.tile(np.arange(1, BL.H + 1), len(ki)),
                       "od_now_lag2": np.repeat(od[ok], BL.H)})
    for v, m in models.items():
        df[f"p_dec_{v}"] = BL.rollout_many(m, None, ki, od[ok], _G["obs0"], fu, va, lag)["p25"].ravel()
    print(f"  lag2 week {ws.date()}: {len(ki)} issues", flush=True)
    return df


def step_lag2(cfg, prefix):
    t0 = time.time()
    src = pd.read_parquet(LAG2_SOURCE)
    src = src[(src["issue"] < EK.HOLDOUT_START) & (src["valid"] < EK.HOLDOUT_START)]
    iss = pd.DatetimeIndex(sorted(src["issue"].unique()))
    wk = EK.test_weeks(iss)
    jobs = [(EK.week_start(w), list(iss[wk == w])) for w in np.unique(wk[wk >= 0])]
    if cfg["weeks"]:
        jobs = jobs[:cfg["weeks"]]
    with ProcessPoolExecutor(cfg["workers"], initializer=_init_lag2, initargs=(cfg,)) as ex:
        parts = [p for p in ex.map(run_week_lag2, jobs) if p is not None]
    d = pd.concat(parts, ignore_index=True)
    t = src.merge(d, on=["issue", "lead"], how="inner")
    y = (t["od"] == 25).astype(float).to_numpy()
    preds = {"logit": t["p_logit"].to_numpy(), "blend_v2": t["p_blend"].to_numpy()}
    for v in VARIANTS:
        preds[f"dec_{v}"] = t[f"p_dec_{v}"].to_numpy()
        preds[f"blend_{v}"] = 0.5 * (t["p_logit"].to_numpy() + preds[f"dec_{v}"])
    pairs = [(f"{k}_{v}", f"{k}_recent") for k in ("blend", "dec") for v in VARIANTS[1:]]
    pairs += [("blend_recent", "logit"), ("blend_hist_era", "logit"), ("blend_hist", "logit")]
    tabs = []
    for name, mask in (("all", None), ("selection_free", (t["valid"] < EK.SELECTION_START).to_numpy())):
        tabs.append(EK.bootstrap(y, preds, t["valid"], t["lead"], pairs=pairs, mask=mask).assign(subset=name))
    boot = pd.concat(tabs, ignore_index=True)
    sens = []
    for bd in (3, 7):
        for name, mask in (("all", None), ("selection_free", (t["valid"] < EK.SELECTION_START).to_numpy())):
            b = EK.bootstrap(y, {k: preds[k] for k in PRIMARY_LAG2}, t["valid"], t["lead"], pairs=[PRIMARY_LAG2],
                             mask=mask, block_days=bd)
            sens.append(b[(b["method"] == f"{PRIMARY_LAG2[0]} - {PRIMARY_LAG2[1]}") & (b["metric"] == "brier")
                          & (b["lead"] == EK.POOLED)].assign(subset=name, block_days=bd))
    sens = pd.concat(sens, ignore_index=True)
    L.atomic_write(t[["issue", "lead", "valid", "od", "od_now", "od_now_lag2", "p_logit", "p_dec", "p_blend"]
                     + [f"p_dec_{v}" for v in VARIANTS]], L.OUT / f"{prefix}lag2_preds.parquet")
    L.atomic_write(boot, L.OUT / f"{prefix}lag2_bootstrap.csv", index=False, float_format="%.6g")
    fin = np.all([np.isfinite(q) for q in preds.values()], axis=0) & np.isin(t["lead"], EK.REPORT_LEADS)
    lead = t["lead"].to_numpy()
    metrics = {}
    for k, p in preds.items():
        m = {}
        for name, mask in (("all", fin), ("selection_free", fin & (t["valid"] < EK.SELECTION_START).to_numpy())):
            m[name] = {"brier_1_6_24_48": float(np.mean((p[mask] - y[mask]) ** 2)),
                       **{f"acc{x}": float(np.mean((p[mask & (lead == x)] > 0.5) == (y[mask & (lead == x)] > 0.5)))
                          for x in EK.REPORT_LEADS}}
        metrics[k] = m
    dmax = float(np.nanmax(np.abs(t["p_dec_recent"] - t["p_dec"])))
    pri = boot[(boot["metric"] == "brier") & (boot["lead"] == EK.POOLED)
               & (boot["method"] == f"{PRIMARY_LAG2[0]} - {PRIMARY_LAG2[1]}")]
    n_rep = int(np.isin(t["lead"], EK.REPORT_LEADS).sum())
    return {"source": str(LAG2_SOURCE.relative_to(L.ROOT)), "lag_h": 2, "rows_all_leads": int(len(t)),
            "rows_report_leads": n_rep, "issues": int(t["issue"].nunique()), "weeks": len(jobs),
            "seconds": round(time.time() - t0),
            "recent_reproduces_blend_v2_p_dec_max_abs_diff": dmax,
            "primary": pri[["subset", "n", "n_days", "est", "lo", "hi", "p_boot"]].to_dict("records"),
            "primary_block_sensitivity": sens[["subset", "block_days", "est", "lo", "hi", "p_boot"]].to_dict("records"),
            "verdict": verdict(boot, PRIMARY_LAG2), "metrics": metrics}


# ------------------------------------------------------------------------------------------------ provenance

def _sha256(path):
    import hashlib
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def output_hashes(prefix):
    """sha256 of the outputs of one prefix (exact names, so 'wave3_' never picks up 'wave3_confirmedgaps_*')."""
    return {prefix + n: _sha256(L.OUT / (prefix + n)) for n in OUTPUTS if (L.OUT / (prefix + n)).exists()}


def code_hashes():
    files = [HERE / "run.py", HERE / "h12lib.py", L.ROOT / "fra" / "labels.py", L.ROOT / "fra" / "decision.py",
             L.ROOT / "fra" / "fcerror.py", L.ROOT / "fra" / "blend.py", L.ROOT / "fra" / "evalkit.py"]
    return {str(p.relative_to(L.ROOT)): _sha256(p) for p in files if p.exists()}


# ------------------------------------------------------------------------------------------------ main

def main():
    import json
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--steps", default=",".join(ALL_STEPS))
    ap.add_argument("--weeks", type=int, default=0)
    ap.add_argument("--paths", type=int, default=100)
    ap.add_argument("--workers", type=int, default=4)
    ap.add_argument("--no-partb", action="store_true")
    ap.add_argument("--gap-rule", default=None, choices=["traffic", "confirmed"])
    a = ap.parse_args()
    from fra.labels import GAP_RULE, history_gaps
    gap_rule = a.gap_rule or GAP_RULE
    steps = set(a.steps.split(","))
    if steps - set(ALL_STEPS):
        ap.error(f"unknown steps {sorted(steps - set(ALL_STEPS))}")
    st = backfill_status()
    print(f"backfill: {st['fetched_share']:.1%} of daytime hours, {st['complete_days']} complete days "
          f"({st['complete_share']:.1%}), pass 1 {st['pass1_fetched']}/{st['pass1_total']}, complete={st['complete']}",
          flush=True)
    if not st["complete"] and not (a.dry_run or a.force):
        print("The backfill is not complete (uv run python -m fra.history status). Use --dry-run for a plumbing check "
              "or --force to run anyway (results are then switch-day biased: pass-2 days first).")
        sys.exit(2)
    prefix = "dryrun_" if a.dry_run else ("forced_" if not st["complete"] else "wave3_")
    default_rule = gap_rule == GAP_RULE
    if not default_rule:
        prefix += f"{gap_rule}gaps_"
    cfg = {"partb": not a.no_partb, "paths": a.paths, "weeks": a.weeks, "workers": max(1, min(4, a.workers)),
           "gap_rule": gap_rule}
    started = pd.Timestamp.now(tz="UTC").isoformat()
    before = output_hashes(prefix)
    path = L.OUT / f"{prefix}results.json"
    this_run = {"started": started, "steps": sorted(steps), "config": cfg, "argv": sys.argv[1:],
                "backfill_checked_at": st["checked_at"]}
    if steps != set(ALL_STEPS) and path.exists():
        # only some steps: keep the other steps' results of the existing file, record this run in 'step_runs'
        res = json.loads(path.read_text())
        res.setdefault("step_runs", [{"started": res.get("started"), "steps": res.get("steps"),
                                      "config": res.get("config")}])
        res["step_runs"].append(this_run)
        res["steps"] = sorted(set(res.get("steps") or []) | steps)
    else:
        res = {"mode": prefix.rstrip("_"), "started": started, "backfill": st, "config": cfg, "steps": sorted(steps),
               "step_runs": [this_run]}
    res.update(role=ROLE.get(gap_rule), preregistered_output=PREREGISTERED_OUTPUT, subsets=SUBSETS,
               information_set=("parta/qa/labels: hackathon lag 1, od_now = label of radar hour [t-1h, t), published "
                                "only ~60-75 min after t (look-ahead-inflated absolute accuracies); lag2: the "
                                "champion's lag 2 (od_now = label of t-2)"),
               label_gaps={"rule": gap_rule, "od_gap_hours": len(history_gaps(gap_rule)),
                           "confirmed_suspect_hours": len(history_gaps("confirmed"))})
    t0 = time.time()
    if "qa" in steps:
        import era
        import shares
        s = shares.main(write=default_rule, gap_rule=gap_rule)
        e = era.main(write=default_rule, gap_rule=gap_rule)
        res["qa"] = {"shares": s["summary"], "era_od_pooled": e["pooled"], "era_rwy18_pooled": e["rwy18_pooled"]}
        print("qa done", flush=True)
    if "labels" in steps:
        lab = history_labels(gap_rule)
        obs = D.load_obs()
        rows_h = D.transitions(D.features(obs, lab))
        rows_r = D.transitions(D.features(obs, C.load_labels(False)))
        res["labels"] = label_stats(lab, rows_h, rows_r)
        print("labels:", {k: v for k, v in res["labels"].items() if k != "by_year"}, flush=True)
    if "parta" in steps:
        res["parta"] = step_parta(cfg, prefix)
        for r in res["parta"]["primary"]:
            sub = "pre-15-Sep part" if r["subset"] == "selection_free" else r["subset"]
            print(f"PRIMARY {PRIMARY[0]} - {PRIMARY[1]} [{sub}]: "
                  f"Brier {r['est']:+.4f} [{r['lo']:+.4f}, {r['hi']:+.4f}]", flush=True)
        for k, m in res["parta"]["metrics"].items():
            print(f"  {k:24s} acc " + "/".join(f"{100 * m[f'acc{x}']:.1f}" for x in C.LEADS)
                  + f"  Brier(1,6,24,48) {m['brier_1_6_24_48']:.4f}  (lag 1: look-ahead-inflated)", flush=True)
    if "rwy18" in steps:
        res["rwy18"] = step_rwy18(prefix)
        mm = res["rwy18"].get("metrics", {}).get("all", {})
        print("rwy18:", res["rwy18"].get("rows"), "rows,", res["rwy18"].get("closures"), "closures,",
              res["rwy18"].get("folds"), "folds;", {k: {kk: round(vv, 4) if isinstance(vv, float) else vv
                                                        for kk, vv in v.items()} for k, v in mm.items()}, flush=True)
    if "lag2" in steps:
        res["lag2"] = step_lag2(cfg, prefix)
        for r in res["lag2"]["primary"]:
            print(f"LAG-2 SENSITIVITY {PRIMARY_LAG2[0]} - {PRIMARY_LAG2[1]} "
                  f"[{'pre-15-Sep part' if r['subset'] == 'selection_free' else r['subset']}]: "
                  f"Brier {r['est']:+.4f} [{r['lo']:+.4f}, {r['hi']:+.4f}]", flush=True)
        print("  lag 2 'recent' vs blend-v2 p_dec: max |diff|",
              res["lag2"]["recent_reproduces_blend_v2_p_dec_max_abs_diff"],
              "; clearly wins:", res["lag2"]["verdict"].get("clearly_wins"), flush=True)
    boot_p = L.OUT / f"{prefix}parta_bootstrap.csv"
    if boot_p.exists():
        res["verdict"] = verdict(pd.read_csv(boot_p), PRIMARY)
        print("PRIMARY clearly wins:", res["verdict"].get("clearly_wins"), flush=True)
    res["seconds"] = round(time.time() - t0)
    L.write_json(res, path)
    with open(MANIFEST, "a") as f:
        f.write(json.dumps({"started": started, "finished": pd.Timestamp.now(tz="UTC").isoformat(), "prefix": prefix,
                            "gap_rule": gap_rule, "role": ROLE.get(gap_rule), "steps": sorted(steps),
                            "argv": sys.argv[1:], "outputs_before": before, "outputs_after": output_hashes(prefix),
                            "code": code_hashes()}) + "\n")
    print(f"done in {res['seconds']} s -> {path}")


if __name__ == "__main__":
    main()
