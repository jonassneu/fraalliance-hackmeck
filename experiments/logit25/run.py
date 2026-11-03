"""logit25: the logistic half of the blend trained on ~2.5 years instead of 120 days (pre-registered in plan.json).

    uv run python experiments/logit25/run.py inputs            # merged inputs + extended feature table -> inputs/
    uv run python experiments/logit25/run.py preds 120 365 ... # walk-forward, window in days or 'all' -> preds/w<W>.parquet
    uv run python experiments/logit25/run.py lgbm              # LightGBM (monotone, all history) -> preds/lgbm_all.parquet
    uv run python experiments/logit25/run.py score             # stage 1 + stage 2 -> results.csv, results.json
    uv run python experiments/logit25/run.py fit W T|noT OUT   # final OD model on outcomes published before the holdout

Shared data files are only read. The merged IFS / prognosis inputs and the table are written under inputs/; the
fra.singleruns / fra.prognosis archive paths are pointed at them in-process only.
"""

import os

for _v in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(_v, "1")

import json  # noqa: E402
import pickle  # noqa: E402
import sys  # noqa: E402
import time  # noqa: E402
from pathlib import Path  # noqa: E402

import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT))
from fra import evalkit  # noqa: E402
from fra import train as T  # noqa: E402
from fra import dataset as DS  # noqa: E402

INP = HERE / "inputs"
PREDS = HERE / "preds"
TABLE = INP / "table.parquet"
LABELS = INP / "labels.parquet"
START = pd.Timestamp("2024-03-14", tz="UTC")
H1_END = pd.Timestamp("2026-08-01", tz="UTC")
INTEG = ROOT / "experiments" / "integration" / "preds_long.parquet"
LAG = pd.Timedelta(hours=DS.KNOWN_LAG_H)


def _atomic_parquet(df, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    df.to_parquet(tmp, index=False if not isinstance(df.index, pd.DatetimeIndex) else None)
    os.replace(tmp, path)


def labels():
    from fra.labels import history_labels
    lab = history_labels(gap_rule="confirmed")
    return lab[lab.index < evalkit.HOLDOUT_START]


def point_inputs():
    """Point fra.singleruns / fra.prognosis at the merged files (this process only)."""
    from fra import prognosis, singleruns
    singleruns.ARCHIVE = INP / "ifs_runs.parquet"
    singleruns.UPPER_ARCHIVE = INP / "ifs_runs_upper.parquet"
    prognosis.ARCHIVE = INP / "prognosis.parquet"


def build_inputs():
    from fra import prognosis, singleruns
    INP.mkdir(parents=True, exist_ok=True)
    for a, b, out in [(singleruns.BACKFILL, singleruns.ARCHIVE, "ifs_runs.parquet"),
                      (singleruns.UPPER_BACKFILL, singleruns.UPPER_ARCHIVE, "ifs_runs_upper.parquet")]:
        x, y = pd.read_parquet(a), pd.read_parquet(b)
        assert x["init"].max() < y["init"].min(), (a, b)
        m = pd.concat([x, y], ignore_index=True).sort_values(["init", "valid"]).reset_index(drop=True)
        _atomic_parquet(m, INP / out)
        print(out, m.shape, m["init"].min(), m["init"].max(), flush=True)
    h, p = pd.read_parquet(prognosis.HISTORY), pd.read_parquet(prognosis.ARCHIVE)
    h = h[(h["asof"] >= START - pd.Timedelta(days=2)) & (h["asof"] < p["asof"].min())]
    m = pd.concat([prognosis._schema(h), prognosis._schema(p)], ignore_index=True)
    _atomic_parquet(m, INP / "prognosis.parquet")
    print("prognosis", m.shape, m["asof"].min(), m["asof"].max(), flush=True)
    lab = labels()
    lab.to_parquet(LABELS)
    print("labels", lab.shape, lab.index.min(), lab.index.max(), lab["od"].notna().sum(), flush=True)

    point_inputs()
    lab_b = lab[lab.index >= START]
    t0 = time.time()
    fc = pd.read_parquet(DS.DATA / "forecasts.parquet")
    d = T.add_rule_features(DS.build(fc, lab_b, DS.hourly_metar()))
    d = d[(d["issue"] >= START) & (d["valid"] < evalkit.HOLDOUT_START)].reset_index(drop=True)
    d["base_prognosis_od25"] = T.baselines(d)["od25"]["prognosis"]
    _atomic_parquet(d, TABLE)
    print(f"table {d.shape} in {time.time() - t0:.0f}s, issue {d['issue'].min()} .. {d['issue'].max()}", flush=True)
    check_table(d)


def check_table(d=None):
    """Production features on the long-test rows vs data/wf_cache.parquet (production table)."""
    d = pd.read_parquet(TABLE) if d is None else d
    w = pd.read_parquet(DS.DATA / "wf_cache.parquet")
    F = list(T.LOGIT["od25"])
    key = ["issue", "lead"]
    sel = lambda x: x[(x["issue"] >= evalkit.TEST_START) & (x["valid"] < evalkit.HOLDOUT_START)]
    a, b = sel(d)[key + F + ["od"]], sel(w)[key + F + ["od"]]
    m = a.merge(b, on=key, how="outer", suffixes=("", "_w"), indicator=True)
    out = {"rows_ext": int(len(a)), "rows_wf": int(len(b)), "both": int((m["_merge"] == "both").sum()),
           "only_ext": int((m["_merge"] == "left_only").sum()), "only_wf": int((m["_merge"] == "right_only").sum())}
    mb = m[m["_merge"] == "both"]
    out["max_abs_diff"] = {c: float(np.nanmax(np.abs(mb[c].astype(float).fillna(-999) - mb[c + "_w"].astype(float).fillna(-999))))
                           for c in F}
    out["od_label_diff_rows"] = int((mb["od"].fillna(0) != mb["od_w"].fillna(0)).sum())
    out["only_wf_issues"] = sorted({str(x) for x in m.loc[m["_merge"] == "right_only", "issue"]})[:20]
    # whole-table coverage by year
    out["rows_by_year"] = {int(k): int(v) for k, v in d.groupby(d["issue"].dt.year).size().items()}
    out["od_rows_by_year"] = {int(k): int(v) for k, v in d[d["od"].notna()].groupby(d["issue"].dt.year).size().items()}
    out["prog_missing_share_by_year"] = {int(k): round(float(v), 4) for k, v in
                                         d["prog_main_west"].isna().groupby(d["issue"].dt.year).mean().items()}
    out["tw25_100m_missing_share_by_year"] = {int(k): round(float(v), 4) for k, v in
                                              d["tw25_100m"].isna().groupby(d["issue"].dt.year).mean().items()}
    (HERE / "table_check.json").write_text(json.dumps(out, indent=1))
    print(json.dumps(out, indent=1), flush=True)


def _set_clean_labels():
    """fra.train's clean-label mask reads the forward-file counts only; the extended labels are night-bridged already,
    so the mask is pointed at them (every labelled table row counts as directly observed)."""
    T._DIRECT_OD["od"] = pd.read_parquet(LABELS)["od"]


def load_table(cols=None):
    d = pd.read_parquet(TABLE, columns=cols)
    return d[d["od"].notna()].reset_index(drop=True)


def walk_forward(window):
    """Weekly walk-forward of the production spec with `window` (days or None = all since 2024-03-14).
    One logit fit per fold; P with and without the per-bucket temperature refit (the logit itself is identical)."""
    _set_clean_labels()
    z = load_table()
    wk = evalkit.test_weeks(z["issue"], z["valid"])
    pT, pN = np.full(len(z), np.nan), np.full(len(z), np.nan)
    info = []
    for w, te, tr in evalkit.folds(z["issue"], z["valid"], wk=wk, lag_h=T.table_lag(z)):
        t0 = time.time()
        m = T.fit(z[tr], "od25", window=window, temperature=True)
        pT[te] = T.predict(m, z[te], "od25")
        pN[te] = T.predict({k: v for k, v in m.items() if k != "temp"}, z[te], "od25")
        trw = z[tr]
        n_tr = int((trw["valid"] >= trw["valid"].max() - pd.Timedelta(days=window)).sum()) if window else int(tr.sum())
        info.append({"week": w, "n_train": n_tr, "temp": m.get("temp"), "s": round(time.time() - t0, 1)})
        print(f"w{window} week {w}: train {n_tr} rows, temps {m.get('temp')}, {time.time() - t0:.0f}s", flush=True)
    ok = wk >= 0
    tag = "all" if window is None else str(window)
    out = z.loc[ok, ["issue", "lead", "valid"]].assign(p_T=pT[ok], p_noT=pN[ok]).reset_index(drop=True)
    _atomic_parquet(out, PREDS / f"w{tag}.parquet")
    (PREDS / f"w{tag}.json").write_text(json.dumps(info, indent=1, default=str))


MONO_DEC = ["tw25", "tw25_roll6", "tw25_prev3", "tw25_next3", "tw25_100m", "tw25_cons", "tw25_cons_roll6",
            "tw25_pastmin6"]
MONO_INC = ["prog_signed", "prog_alt_signed", "rule_od25", "od_now25"]
LGB_F = list(T.LOGIT["od25"]) + ["lead", "run_age_h"]
LGB_P = dict(n_estimators=300, learning_rate=0.03, num_leaves=7, min_child_samples=200, reg_lambda=10.0,
             subsample=0.8, subsample_freq=1, colsample_bytree=0.8, n_jobs=1, random_state=0, verbose=-1)


def lgbm():
    import lightgbm as lgb
    z = load_table()
    wk = evalkit.test_weeks(z["issue"], z["valid"])
    p = np.full(len(z), np.nan)
    mono = [-1 if f in MONO_DEC else (1 if f in MONO_INC else 0) for f in LGB_F]
    y = (z["od"] == 25).astype(int).values
    for w, te, tr in evalkit.folds(z["issue"], z["valid"], wk=wk, lag_h=T.table_lag(z)):
        t0 = time.time()
        m = lgb.LGBMClassifier(monotone_constraints=mono, **LGB_P).fit(z.loc[tr, LGB_F].astype(float), y[tr])
        p[te] = m.predict_proba(z.loc[te, LGB_F].astype(float))[:, 1]
        print(f"lgbm week {w}: {int(tr.sum())} rows, {time.time() - t0:.0f}s", flush=True)
    ok = wk >= 0
    _atomic_parquet(z.loc[ok, ["issue", "lead", "valid"]].assign(p=p[ok]).reset_index(drop=True),
                    PREDS / "lgbm_all.parquet")


# ---------------------------------------------------------------- scoring

def _get(t, metric, lead, meth):
    k = (metric, lead, meth)
    return t.loc[k, ["est", "lo", "hi"]].to_numpy(float) if k in t.index else np.full(3, np.nan)


def paired(y, pv, pc, valid, lead, mask, block_days=1):
    preds = {"variant": pv, "control": pc}
    pair = [("variant", "control")]
    t = evalkit.bootstrap(y, preds, valid, lead, evalkit.REPORT_LEADS, pair, mask=mask, block_days=block_days)
    ta = evalkit.bootstrap(y, preds, valid, lead, evalkit.ALL_LEADS, pair, mask=mask, per_lead=False,
                           pooled_id=evalkit.POOLED_ALL, block_days=block_days)
    t = pd.concat([t, ta], ignore_index=True).set_index(["metric", "lead", "method"])
    r = {"n": int(t.loc[("brier", 0, "variant"), "n"]), "n_days": int(t.loc[("brier", 0, "variant"), "n_days"])}
    r["brier"], r["brier_lo"], r["brier_hi"] = _get(t, "brier", 0, "variant")
    r["brier_control"] = _get(t, "brier", 0, "control")[0]
    r["d_brier"], r["d_brier_lo"], r["d_brier_hi"] = _get(t, "brier", 0, "variant - control")
    r["p_boot"] = float(t.loc[("brier", 0, "variant - control"), "p_boot"])
    r["brier_all"] = _get(t, "brier", evalkit.POOLED_ALL, "variant")[0]
    r["brier_all_control"] = _get(t, "brier", evalkit.POOLED_ALL, "control")[0]
    r["d_brier_all"], r["d_brier_all_lo"], r["d_brier_all_hi"] = _get(t, "brier", evalkit.POOLED_ALL,
                                                                      "variant - control")
    for L in evalkit.REPORT_LEADS:
        r[f"acc{L}"], r[f"acc{L}_lo"], r[f"acc{L}_hi"] = _get(t, "acc", L, "variant")
        r[f"acc{L}_control"] = _get(t, "acc", L, "control")[0]
        r[f"d_acc{L}"], r[f"d_acc{L}_lo"], r[f"d_acc{L}_hi"] = _get(t, "acc", L, "variant - control")
        r[f"brier{L}"] = _get(t, "brier", L, "variant")[0]
        r[f"d_brier{L}"], r[f"d_brier{L}_lo"], r[f"d_brier{L}_hi"] = _get(t, "brier", L, "variant - control")
    return r


def rule(w):
    """Adoption rule (plan.json) on a {period: paired result} dict."""
    c1 = bool(w["whole"]["d_brier_hi"] < 0)
    c2 = bool(w["H1"]["d_brier"] < 0 and w["H2"]["d_brier"] < 0)
    c3 = bool(all(not (w["whole"][f"d_acc{L}_hi"] < 0) for L in evalkit.REPORT_LEADS))
    return {"ci_below_0": c1, "both_halves_below_0": c2, "no_lead_less_accurate": c3, "passes": c1 and c2 and c3}


def compare(m, a, b):
    y = (m["od"] == 25).astype(float).to_numpy()
    periods = {"whole": np.ones(len(m), bool), "H1": (m["issue"] < H1_END).to_numpy(),
               "H2": (m["issue"] >= H1_END).to_numpy(), "pre_sep15": (m["valid"] < evalkit.SELECTION_START).to_numpy()}
    res = {per: paired(y, m[a].to_numpy(float), m[b].to_numpy(float), m["valid"], m["lead"].to_numpy(), mask)
           for per, mask in periods.items()}
    res["whole_3day"] = paired(y, m[a].to_numpy(float), m[b].to_numpy(float), m["valid"], m["lead"].to_numpy(),
                               periods["whole"], block_days=3)
    return res


def score():
    key = ["issue", "lead"]
    base = pd.read_parquet(INTEG)[["issue", "lead", "valid", "od", "p_logit", "p_dec_main", "p_blend_main"]]
    for tag in ["120", "365", "540", "all"]:
        p = pd.read_parquet(PREDS / f"w{tag}.parquet")
        base = base.merge(p[key + ["p_T", "p_noT"]].rename(columns={"p_T": f"w{tag}_T", "p_noT": f"w{tag}_noT"}),
                          on=key, how="left")
    have_lgbm = (PREDS / "lgbm_all.parquet").exists()
    if have_lgbm:
        g = pd.read_parquet(PREDS / "lgbm_all.parquet").rename(columns={"p": "lgbm_all"})
        base = base.merge(g[key + ["lgbm_all"]], on=key, how="left")
        base["lgbm_blend_all"] = 0.5 * base["wall_T"] + 0.5 * base["lgbm_all"]
    cands = [f"w{t}_{s}" for t in ["120", "365", "540", "all"] for s in ["T", "noT"]] + \
        (["lgbm_blend_all"] if have_lgbm else [])
    n0 = len(base)
    m = base.dropna(subset=["od", "p_logit", "p_dec_main", *cands]).reset_index(drop=True)
    print(f"rows: {n0} blend-v2 rows, {len(m)} with every candidate", flush=True)
    out = {"rows_blend_v2": n0, "rows_scored": len(m), "days": int(m["valid"].dt.floor("D").nunique()),
           "stage1": {}, "stage2": {}, "diagnostics": {}}
    rows = []
    # how far the extended table moves the 120-day control from the stored production logit
    out["diagnostics"]["control_vs_production_logit"] = {
        "max_abs_diff": float(np.abs(m["w120_T"] - m["p_logit"]).max()),
        "rows_abs_diff_gt_1e-6": int((np.abs(m["w120_T"] - m["p_logit"]) > 1e-6).sum()),
        "weeks_with_diff": sorted({int(x) for x in evalkit.test_weeks(m.loc[np.abs(m["w120_T"] - m["p_logit"]) > 1e-6, "issue"])}),
        **{k: v for k, v in compare(m, "w120_T", "p_logit")["whole"].items()
           if k in ("brier", "brier_control", "d_brier", "d_brier_lo", "d_brier_hi")}}
    for c in cands:
        if c == "w120_T":
            continue
        r = compare(m, c, "w120_T")
        out["stage1"][c] = {"rule": rule(r), **r}
        for per, x in r.items():
            rows.append({"stage": 1, "variant": c, "vs": "w120_T", "period": per, **x})
        print(f"stage1 {c}: d_brier {r['whole']['d_brier']:+.5f} [{r['whole']['d_brier_lo']:+.5f}, "
              f"{r['whole']['d_brier_hi']:+.5f}] H1 {r['H1']['d_brier']:+.5f} H2 {r['H2']['d_brier']:+.5f} "
              f"{rule(r)}", flush=True)
    # control row (absolute numbers)
    rc = compare(m, "w120_T", "p_logit")
    for per, x in rc.items():
        rows.append({"stage": 1, "variant": "w120_T", "vs": "production_logit", "period": per, **x})
    passers = [c for c, v in out["stage1"].items() if v["rule"]["passes"]]
    if passers:
        best = min(passers, key=lambda c: out["stage1"][c]["whole"]["d_brier"])
        eligible = True
    else:
        best = min(out["stage1"], key=lambda c: out["stage1"][c]["whole"]["d_brier"])
        eligible = False
    m["blend_cand"] = 0.5 * m[best] + 0.5 * m["p_dec_main"]
    m["blend_v2"] = m["p_blend_main"]
    r2 = compare(m, "blend_cand", "blend_v2")
    for per, x in r2.items():
        rows.append({"stage": 2, "variant": f"blend({best})", "vs": "blend-v2", "period": per, **x})
    out["stage2"] = {"candidate": best, "eligible_for_adoption": eligible, "stage1_passers": passers,
                     "rule": rule(r2), **r2}
    out["adopt"] = bool(eligible and rule(r2)["passes"])
    out["variants_scored"] = len(out["stage1"]) + 1 + 1   # stage-1 candidates + control + 1 blend
    print(f"stage2 blend({best}) - blend-v2: d_brier {r2['whole']['d_brier']:+.5f} [{r2['whole']['d_brier_lo']:+.5f}, "
          f"{r2['whole']['d_brier_hi']:+.5f}] H1 {r2['H1']['d_brier']:+.5f} H2 {r2['H2']['d_brier']:+.5f} "
          f"{rule(r2)}; eligible {eligible}; ADOPT {out['adopt']}", flush=True)
    pd.DataFrame(rows).to_csv(HERE / "results.csv", index=False)
    (HERE / "results.json").write_text(json.dumps(out, indent=1, default=float))
    return out


# ---------------------------------------------------------------- final model

def fit_final(window, temperature, out_path):
    """OD logit on every table row whose outcome is published before the holdout (valid + 2 h <= 2026-11-01);
    RWY 18 part copied unchanged from blend-v2's model.pkl."""
    _set_clean_labels()
    z = load_table()
    tr = z[z["valid"] + LAG <= evalkit.HOLDOUT_START]
    m = T.fit(tr, "od25", window=window, temperature=temperature)
    with open(ROOT / "data/archive/models/blend-v2/model.pkl", "rb") as f:
        v2 = pickle.load(f)
    models = {"od25": m, "rwy18": v2["rwy18"]}
    n = int((tr["valid"] >= tr["valid"].max() - pd.Timedelta(days=window)).sum()) if window else len(tr)
    meta = {"od_spec": {k: v for k, v in m["spec"].items() if k != "features"}, "features": m["spec"]["features"],
            "temp": m.get("temp"), "train_rows": n, "first_valid": str(tr["valid"].min() if not window else
                                                                         tr["valid"].max() - pd.Timedelta(days=window)),
            "last_valid": str(tr["valid"].max()), "cutoff": "valid + 2 h <= 2026-11-01 00:00 UTC",
            "rwy18": "copied from data/archive/models/blend-v2/model.pkl"}
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "wb") as f:
        pickle.dump(models, f)
    out_path.with_name("train_meta.json").write_text(json.dumps(meta, indent=1, default=str))
    print(json.dumps(meta, indent=1, default=str))


if __name__ == "__main__":
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == "inputs":
        build_inputs()
    elif cmd == "check":
        check_table()
    elif cmd == "preds":
        for a in args:
            walk_forward(None if a == "all" else int(a))
    elif cmd == "lgbm":
        lgbm()
    elif cmd == "score":
        score()
    elif cmd == "fit":
        fit_final(None if args[0] == "all" else int(args[0]), args[1] == "T", args[2])
    else:
        raise SystemExit(__doc__)
