"""Phase 2: re-test the hackathon model choices on the corrected data layer (pre-registered in plan.json).

    uv run python -m experiments.phase2.run pw                       # Part B path features, all 48 leads -> preds/pw48.parquet
    uv run python -m experiments.phase2.run preds prod w180 ...      # walk-forward OD predictions -> preds/<variant>.parquet
    uv run python -m experiments.phase2.run score                    # paired bootstrap vs production -> results.csv, decisions.json

Table: experiments.harness.load() (= data/wf_cache.parquet, the production data layer: od_now from the last complete
radar hour, ICON-EU-filled consensus, leads 1..48). Folds: fra.evalkit weekly walk-forward from 2026-06-01 up to the
locked holdout (training labels known at the week start). Every logit variant runs fra.train.fit with one or more
production settings overridden (experiments.harness.prod_model), so an adopted change is a constant in fra/train.py.
Scoring: identical (issue, lead) rows for variant and production, Brier(1,6,24,48) pooled, day-block bootstrap
(fra.evalkit, 2000 reps) for the paired difference on the whole test, both halves (issue before / from 2026-08-01)
and the selection-free part (valid < 2026-09-15).
"""

import os

for _v in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(_v, "1")

import json  # noqa: E402
import sys  # noqa: E402
import time  # noqa: E402
from pathlib import Path  # noqa: E402

import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from experiments import harness as H  # noqa: E402
from fra import evalkit  # noqa: E402
from fra import train as T  # noqa: E402

HERE = Path(__file__).resolve().parent
PREDS = HERE / "preds"            # walk-forward predictions per variant (gitignored, see .gitignore here)
PW_CACHE = PREDS / "pw48.parquet"
H1_END = pd.Timestamp("2026-08-01", tz="UTC")   # H1 = issue 2026-06-01 .. 07-31, H2 = issue 2026-08-01 .. 10-31
BUCKETS6 = [(1, 2), (3, 6), (7, 12), (13, 24), (25, 36), (37, 48)]
PW4 = ["pw_tw25_gt0", "pw_tw25_gt5", "pw_tw25_mean", "pw_tw25_sd"]
# LightGBM with monotone constraints: P(OD 25) never rises with tailwind on 25; never falls with the westbound signals
MONO_DEC = ["tw25", "tw25_roll6", "tw25_prev3", "tw25_next3", "tw25_100m", "tw25_cons", "tw25_cons_roll6",
            "tw25_pastmin6"]
MONO_INC = ["prog_signed", "prog_alt_signed", "rule_od25", "od_now25"]
LGB_F = list(T.LOGIT["od25"]) + ["lead", "run_age_h"]
LGB_P = dict(n_estimators=300, learning_rate=0.03, num_leaves=7, min_child_samples=200, reg_lambda=10.0,
             subsample=0.8, subsample_freq=1, colsample_bytree=0.8, n_jobs=1, random_state=0, verbose=-1)


def lgbm_fp(tr, y, te):
    import lightgbm as lgb
    keep = (tr["valid"] >= tr["valid"].max() - pd.Timedelta(days=T.WINDOW_DAYS)).values
    mono = [-1 if f in MONO_DEC else (1 if f in MONO_INC else 0) for f in LGB_F]
    m = lgb.LGBMClassifier(monotone_constraints=mono, **LGB_P).fit(tr.loc[keep, LGB_F].astype(float), y[keep])
    return m.predict_proba(te[LGB_F].astype(float))[:, 1]


def pw_fp(tr, y, te):
    return T.predict(T.fit(tr, "od25", features=list(T.LOGIT["od25"]) + PW4, **REF), te, "od25")


# The reference ("prod") is the production spec AT REGISTRATION: fra.train defaults with CLEAN_LABELS = False and
# HALF_LIFE_DAYS = None. Every variant pins these two settings explicitly, so the stage-1 predictions reproduce after
# the adoption of CLEAN_LABELS = True ("prod_now" = the current fra.train production = w120_clean).
REF = dict(clean=False, half_life=None)


def variants():
    def P(**kw):
        return H.prod_model(**{**REF, **kw})
    v = {"prod": P(), "prod_now": H.prod_model()}
    for w in (180, 240, None):
        v[f"w{w or 'all'}"] = P(window=w)
    for w in (120, 180, 240, None):
        v[f"w{w or 'all'}_clean"] = P(window=w, clean=True)
    for hl in (60, 120, 240):
        v[f"hl{hl}"] = P(window=None, half_life=hl)
        v[f"hl{hl}_clean"] = P(window=None, half_life=hl, clean=True)
    for c in (0.01, 0.1, 0.3):
        v[f"C{c}"] = P(C_=c)
    v["notemp"] = P(temperature=False)
    v["buckets6"] = P(buckets=BUCKETS6)
    v["lgbm_mono"] = lgbm_fp
    v["pw4"] = pw_fp
    return v


DERIVED = {"blend_lgbm": ("prod", "lgbm_mono")}  # 0.5 / 0.5 probability average, computed at scoring time
STAGE1 = ["w180", "w240", "wall", "w120_clean", "w180_clean", "w240_clean", "wall_clean", "hl60", "hl120", "hl240",
          "hl60_clean", "hl120_clean", "hl240_clean", "C0.01", "C0.1", "C0.3", "notemp", "buckets6", "lgbm_mono",
          "blend_lgbm", "pw4"]
GROUP = {**{k: "window" for k in ("w180", "w240", "wall", "w120_clean", "w180_clean", "w240_clean", "wall_clean")},
         **{k: "recency" for k in ("hl60", "hl120", "hl240", "hl60_clean", "hl120_clean", "hl240_clean")},
         "C0.01": "C", "C0.1": "C", "C0.3": "C", "notemp": "temperature", "buckets6": "buckets",
         "lgbm_mono": "lgbm", "blend_lgbm": "lgbm", "pw4": "partB"}
NEEDS_LIVE_INPUTS = {"pw4": "Part B path features are not computed by the live forecast (fra/predict.py)",
                     "lgbm_mono": "fra.train has no LightGBM production path (would need code, not a constant)",
                     "blend_lgbm": "fra.train has no LightGBM production path (would need code, not a constant)"}


def _atomic_parquet(df, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    df.to_parquet(tmp)
    os.replace(tmp, path)


def compute_pw():
    """fra.fcerror.path_features for every issue of the table, all 48 leads (walk-forward by construction)."""
    from fra import fcerror as F
    d = H.load()
    rows = d[["issue", "lead"]].drop_duplicates()
    t = time.time()
    f = F.path_features(rows, lib=F.load_library())
    _atomic_parquet(f, PW_CACHE)
    print(f"path features: {len(f)} rows, {f['issue'].nunique()} issues, NaN share "
          f"{f['pw_tw25_gt0'].isna().mean():.4f}, {time.time() - t:.0f} s", flush=True)


def load_table(need_pw=False):
    d = H.load()
    if need_pw:
        pw = pd.read_parquet(PW_CACHE)[["issue", "lead", *PW4]]
        d = d.merge(pw, on=["issue", "lead"], how="left")
        c = d["tw25_cons"]
        # row-local fills (no training statistic) for the ~0.3 % rows without paths; sd: median of the rows issued
        # before the first test week (known before every fold)
        d["pw_tw25_gt0"] = d["pw_tw25_gt0"].fillna((c > 0).astype(float))
        d["pw_tw25_gt5"] = d["pw_tw25_gt5"].fillna((c > 5).astype(float))
        d["pw_tw25_mean"] = d["pw_tw25_mean"].fillna(c)
        d["pw_tw25_sd"] = d["pw_tw25_sd"].fillna(float(d.loc[d["issue"] < evalkit.TEST_START, "pw_tw25_sd"].median()))
    return d


def run_preds(names, refresh=False):
    V = variants()
    todo = [n for n in names if refresh or not (PREDS / f"{n}.parquet").exists()]
    if not todo:
        return
    d = load_table(need_pw=any(n == "pw4" for n in todo))
    for n in todo:
        t = time.time()
        z, y, p, ok = H.walk_forward(d, "od25", V[n])
        out = z.loc[ok, ["issue", "lead"]].reset_index(drop=True).assign(p=p[ok])
        _atomic_parquet(out, PREDS / f"{n}.parquet")
        m4 = z.loc[ok, "lead"].isin(evalkit.REPORT_LEADS).values
        print(f"{n:12s} {ok.sum()} rows  Brier(1,6,24,48) {np.mean((p[ok][m4] - y[ok][m4]) ** 2):.5f}  "
              f"{time.time() - t:.0f} s", flush=True)


# ---------------------------------------------------------------- scoring

def _get(t, metric, lead, meth):
    k = (metric, lead, meth)
    return t.loc[k, ["est", "lo", "hi"]].to_numpy(float) if k in t.index else np.full(3, np.nan)


def paired(y, pv, pp, valid, lead, mask):
    """Variant vs production on identical rows: Brier(1,6,24,48), Brier(all), acc per lead, paired diffs + CIs."""
    preds = {"variant": pv, "production": pp}
    pair = [("variant", "production")]
    t = evalkit.bootstrap(y, preds, valid, lead, evalkit.REPORT_LEADS, pair, mask=mask)
    ta = evalkit.bootstrap(y, preds, valid, lead, evalkit.ALL_LEADS, pair, mask=mask, per_lead=False,
                           pooled_id=evalkit.POOLED_ALL)
    t = pd.concat([t, ta], ignore_index=True).set_index(["metric", "lead", "method"])
    r = {"n": int(t.loc[("brier", evalkit.POOLED, "variant"), "n"]),
         "n_days": int(t.loc[("brier", evalkit.POOLED, "variant"), "n_days"])}
    r["brier"], r["brier_prod"] = _get(t, "brier", 0, "variant")[0], _get(t, "brier", 0, "production")[0]
    r["d_brier"], r["d_brier_lo"], r["d_brier_hi"] = _get(t, "brier", 0, "variant - production")
    r["brier_all"] = _get(t, "brier", evalkit.POOLED_ALL, "variant")[0]
    r["d_brier_all"], r["d_brier_all_lo"], r["d_brier_all_hi"] = _get(t, "brier", evalkit.POOLED_ALL,
                                                                      "variant - production")
    for L in evalkit.REPORT_LEADS:
        r[f"acc{L}"] = _get(t, "acc", L, "variant")[0]
        r[f"acc{L}_prod"] = _get(t, "acc", L, "production")[0]
        r[f"d_acc{L}"], r[f"d_acc{L}_lo"], r[f"d_acc{L}_hi"] = _get(t, "acc", L, "variant - production")
    return r


def score(names=None):
    d = H.load()[["issue", "lead", "valid", "od"]]
    d = d[d["od"].notna()].reset_index(drop=True)
    d["y"] = (d["od"] == 25).astype(float)
    key = ["issue", "lead"]
    P = {f.stem: pd.read_parquet(f).rename(columns={"p": f.stem}) for f in sorted(PREDS.glob("*.parquet"))
         if f.stem != "pw48"}
    for name, (a, b) in DERIVED.items():
        if a in P and b in P:
            m = P[a].merge(P[b], on=key)
            P[name] = m[key].assign(**{name: 0.5 * m[a] + 0.5 * m[b]})
    base = d.merge(P["prod"], on=key)
    names = [n for n in (names or [*STAGE1, *sorted(set(P) - set(STAGE1) - {"prod"})]) if n in P]
    rows = []
    for n in names:
        m = base.merge(P[n], on=key)
        y, pv, pp = m["y"].to_numpy(), m[n].to_numpy(float), m["prod"].to_numpy(float)
        periods = {"whole": np.ones(len(m), bool), "H1": (m["issue"] < H1_END).to_numpy(),
                   "H2": (m["issue"] >= H1_END).to_numpy(),
                   "selection_free": (m["valid"] < evalkit.SELECTION_START).to_numpy()}
        for per, mask in periods.items():
            rows.append({"variant": n, "group": GROUP.get(n, "stage2"), "period": per,
                         **paired(y, pv, pp, m["valid"], m["lead"].to_numpy(), mask)})
        print(f"scored {n}", flush=True)
    res = pd.DataFrame(rows)
    w = res.set_index(["variant", "period"])
    dec = {}
    for n in names:
        whole, h1, h2 = w.loc[(n, "whole")], w.loc[(n, "H1")], w.loc[(n, "H2")]
        c1 = bool(whole["d_brier_hi"] < 0)
        c2 = bool(h1["d_brier"] < 0 and h2["d_brier"] < 0)
        c3 = bool(not (whole["d_acc24_hi"] < 0))
        dec[n] = {"group": GROUP.get(n, "stage2"), "ci_excludes_0": c1, "both_halves_better": c2, "acc24_ok": c3,
                  "passes": c1 and c2 and c3, "d_brier": round(float(whole["d_brier"]), 5),
                  "needs_live_inputs": NEEDS_LIVE_INPUTS.get(n)}
    res.to_csv(HERE / ".results.csv.tmp", index=False)
    os.replace(HERE / ".results.csv.tmp", HERE / "results.csv")
    (HERE / ".decisions.json.tmp").write_text(json.dumps(dec, indent=1))
    os.replace(HERE / ".decisions.json.tmp", HERE / "decisions.json")
    show = w.xs("whole", level="period")
    print(show[["n", "brier", "d_brier", "d_brier_lo", "d_brier_hi", "d_brier_all", "acc1", "acc6", "acc24", "acc48",
                "d_acc24", "d_acc24_lo", "d_acc24_hi"]].round(5).to_string())
    print(pd.DataFrame(dec).T.to_string())
    return res, dec


if __name__ == "__main__":
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == "pw":
        compute_pw()
    elif cmd == "preds":
        run_preds([a for a in args if not a.startswith("--")], refresh="--refresh" in args)
    elif cmd == "score":
        score(args or None)
    else:
        raise SystemExit(__doc__)
