"""Final end-to-end check of the system that goes live for the holdout (31 Oct 2026, before 2026-11-01 00:00 UTC).

    uv run python experiments/integration/final_eval.py [--workers 4]

1. Consistency: fra.train production spec, the harness cache, fra.blend and fra.changetime all run on the same data
   layer (od_now from the last complete radar hour, ICON-EU-filled consensus, leads 1..48).
2. Recomputes the whole long-test walk-forward from scratch (production logit via experiments.harness = fra.train
   exactly; decision rollouts on Part B paths refitted per week; blend 0.5 / 0.5) and checks it against the stored
   integration predictions (wf_long.parquet).
3. Scores the champion candidate (blend), the new logit alone and the baselines (prognosis, rules, persistence) on
   identical (issue, lead) rows: accuracy at 1/6/24/48 h, Brier(1,6,24,48) and Brier(all leads) with paired day-block
   bootstrap CIs; long test, the part before 15 Sep (valid < SELECTION_START; "pre_sep15_part": NOT selection-free
   for the blend, whose components and weights were chosen on the whole Jun-Oct test) and the legacy part separately;
   changed hours.
4. Next change on the long test: the deployed rules (blend: fra.blend.BLEND_CHANGE_PARAMS; logit: fra.changetime.PARAMS)
   plus the nested walk-forward rule, prognosis, rules, persistence; P(change within 48 h) Brier.
Output: final_eval.json, final_eval_od.csv, final_wf_long.parquet (all in experiments/integration/).
RWY 18 (walk-forward from 2025-09-01) is re-run separately by rwy18.py.
"""

import os

for _k in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(_k, "1")

import json  # noqa: E402
import sys  # noqa: E402
import time  # noqa: E402
from pathlib import Path  # noqa: E402

import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from fra import blend as BL  # noqa: E402
from fra import changetime as CT  # noqa: E402
from fra import dataset as DS  # noqa: E402
from fra import evalkit  # noqa: E402
from fra import train as T  # noqa: E402

OUT = Path(__file__).resolve().parent
LEADS = evalkit.REPORT_LEADS


def atomic_write(path, data: bytes):
    tmp = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    tmp.write_bytes(data)
    os.replace(tmp, path)


def consistency(d):
    meta = json.loads((ROOT / "data" / "train_meta.json").read_text())
    import pickle
    with open(BL.DECISION_MODEL, "rb") as f:
        bundle = pickle.load(f)
    c = {
        "dataset.KNOWN_LAG_H": DS.KNOWN_LAG_H, "dataset.ICONEU_FILL": DS.ICONEU_FILL,
        "dataset.LEADS": [min(DS.LEADS), max(DS.LEADS), len(DS.LEADS)],
        "harness_cache_known_lag_h": sorted(int(x) for x in pd.unique(d["known_lag_h"])) if "known_lag_h" in d else None,
        "harness_cache_leads": [int(d["lead"].min()), int(d["lead"].max()), int(d["lead"].nunique())],
        "train.spec_od25": {k: (v if isinstance(v, (int, float, str, bool, type(None))) else str(v))
                            for k, v in T.spec("od25").items()},
        "train.spec_rwy18": {k: (v if isinstance(v, (int, float, str, bool, type(None))) else str(v))
                             for k, v in T.spec("rwy18").items()},
        "train_meta.od_spec": meta.get("od_spec"),
        "blend.W_LOGIT": BL.W_LOGIT, "blend.N_PATHS": BL.N_PATHS, "blend.RWY18_MODE": BL.RWY18_MODE,
        "blend.CHANGE_MODE": BL.CHANGE_MODE, "blend.BLEND_CHANGE_PARAMS": BL.BLEND_CHANGE_PARAMS,
        "blend.BLEND_P48_COEF": BL.BLEND_P48_COEF, "blend.rollout_lag_h": DS.KNOWN_LAG_H,
        "changetime.PARAMS": CT.PARAMS, "changetime.P48_COEF": CT.P48_COEF,
        "decision_bundle": {k: bundle.get(k) for k in ("spec", "fitted_before", "trained_until", "n_train",
                                                       "n_switch")},
        "evalkit": {"TEST_START": str(evalkit.TEST_START), "SELECTION_START": str(evalkit.SELECTION_START),
                    "HOLDOUT_START": str(evalkit.HOLDOUT_START), "N_BOOT": evalkit.N_BOOT, "SEED": evalkit.SEED},
    }
    c["ok"] = bool(DS.KNOWN_LAG_H == 2 and DS.ICONEU_FILL and len(DS.LEADS) == 48
                   and c["harness_cache_known_lag_h"] in (None, [2]) and c["harness_cache_leads"][2] == 48)
    return c


def boot(t, preds, pairs, mask=None):
    y = (t["od"] == 25).astype(float).to_numpy()
    a = evalkit.bootstrap(y, preds, t["valid"], t["lead"], LEADS, pairs, mask=mask)
    b = evalkit.bootstrap(y, preds, t["valid"], t["lead"], evalkit.ALL_LEADS, pairs, mask=mask, per_lead=False,
                          pooled_id=evalkit.POOLED_ALL)
    return pd.concat([a, b], ignore_index=True)


def changed(t, preds, lead):
    m = ((t["lead"] == lead) & (t["od"] != t["od_now"])).to_numpy()
    y = (t["od"] == 25).to_numpy()
    x = {k: ((np.asarray(v, float) > 0.5) == y).astype(float) for k, v in preds.items()}
    tab = evalkit.bootstrap_means(x, t["valid"], pairs=[("blend", "logit"), ("blend", "prognosis"),
                                                         ("logit", "prognosis")], mask=m)
    return {"n": int(m.sum()), "table": tab.to_dict("records")}


def nextchange(t):
    w = CT.walk_forward_paths()            # production logit paths (all 48 leads), y, od_now, rule, prognosis
    issues = pd.DatetimeIndex(w["issue"])
    piv = lambda c: t.pivot(index="issue", columns="lead", values=c).reindex(index=issues, columns=range(1, CT.H + 1))
    p_dec = piv("p_dec").to_numpy()
    p_lw = piv("p_logit").to_numpy()
    have = np.isfinite(p_dec).all(1) & np.isfinite(w["p25"]).all(1)
    same_logit = float(np.nanmax(np.abs(p_lw[have] - w["p25"][have])))
    sel = have
    y, od_now, week = w["y"][sel], w["od_now"][sel], w["week"][sel]
    p_log, p_dec = w["p25"][sel], p_dec[sel]
    p_bl = BL.W_LOGIT * p_log + (1 - BL.W_LOGIT) * p_dec
    act = CT.actual_first_change(y, od_now)
    weeks = np.unique(week)
    ev = week >= weeks[1]
    q_log, q_bl = CT.other_prob(p_log, od_now), CT.other_prob(p_bl, od_now)

    def nested(q):   # strict: only issues whose whole 48 h outcome was known at the start of week wk
        out = np.full(len(act), -1)
        for wk in weeks[1:]:
            m = week == wk
            out[m] = CT.rule_first_change(q[m], CT.tune(q, act, (week < wk) & CT.known_before(issues[sel], wk)))
        return out

    raw = dict(smooth=1, enter=0.5, leave=0.5, k=1)
    methods = {
        "blend: deployed BLEND_CHANGE_PARAMS (tuned on all weeks)": CT.rule_first_change(q_bl, BL.BLEND_CHANGE_PARAMS),
        "blend: hysteresis rule, nested walk-forward": nested(q_bl),
        "logit: deployed PARAMS": CT.rule_first_change(q_log, CT.PARAMS),
        "logit: hysteresis rule, nested walk-forward": nested(q_log),
        "published prognosis": CT.rule_first_change(CT.other_prob(w["prog25"][sel], od_now), raw),
        "official rules": CT.rule_first_change(CT.other_prob(w["rule25"][sel], od_now), raw),
        "persistence": np.full(len(act), -1),
    }
    res = pd.DataFrame([{"method": k, **CT.score(v[ev], act[ev])} for k, v in methods.items()])
    correct = {k: (((v >= 0) & (act >= 0) & (np.abs(v - act) <= CT.TOL_H)) | ((v < 0) & (act < 0))).astype(float)
               for k, v in methods.items()}
    keys = list(methods)
    ci = evalkit.bootstrap_means({k: correct[k][ev] for k in keys}, issues[sel][ev],
                                 pairs=[(keys[0], keys[2]), (keys[1], keys[3]), (keys[1], keys[2]), (keys[1], keys[4]),
                                        (keys[1], keys[5]), (keys[2], keys[4])])
    yb = (act >= 0).astype(float)
    p48 = {"blend: deployed BLEND_P48_COEF": CT.sigmoid(BL.BLEND_P48_COEF[0] + BL.BLEND_P48_COEF[1]
                                                         * CT.p48_features(q_bl, BL.BLEND_CHANGE_PARAMS)),
           "logit: deployed P48_COEF": CT.sigmoid(CT.P48_COEF[0] + CT.P48_COEF[1] * CT.p48_features(q_log, CT.PARAMS))}
    b48 = evalkit.bootstrap_means({k: (v - yb) ** 2 for k, v in p48.items()}, issues[sel], mask=ev,
                                  pairs=[tuple(p48)])
    clim = float(np.mean((yb[ev].mean() - yb[ev]) ** 2))
    return {"n_issues_scored": int(ev.sum()), "n_with_change": int((act[ev] >= 0).sum()),
            "period": f"{issues[sel][ev].min()} .. {issues[sel][ev].max()}",
            "logit_paths_max_abs_diff_vs_blend_table": same_logit,
            "methods": res.to_dict("records"), "event_acc_ci": ci.to_dict("records"),
            "p48_brier_ci": b48.to_dict("records"), "p48_brier_climatology": clim}


def main(workers=4):
    t0 = time.time()
    from experiments import harness as Hn
    d = Hn.load()
    cons = consistency(d)
    print("consistency:", json.dumps(cons, default=str), flush=True)
    t = BL.walk_forward_preds(d=d, workers=workers)
    atomic_write(OUT / "final_wf_long.parquet", t.to_parquet())
    print(f"walk-forward recomputed in {time.time() - t0:.0f} s: {len(t)} rows", flush=True)
    repro = {}
    old_p = OUT / "wf_long.parquet"
    if old_p.exists():
        old = pd.read_parquet(old_p)
        m = t.merge(old, on=["issue", "lead"], suffixes=("", "_old"), how="outer", indicator=True)
        both = m["_merge"] == "both"
        repro = {"rows_new": int(len(t)), "rows_stored": int(len(old)), "rows_both": int(both.sum())}
        for c in ("p_logit", "p_dec", "p_blend"):
            repro[f"max_abs_diff_{c}"] = float(np.nanmax(np.abs(m.loc[both, c] - m.loc[both, f"{c}_old"])))
    print("reproduction vs stored integration run:", repro, flush=True)
    t = t.dropna(subset=["p_logit", "p_dec", "p_blend"]).reset_index(drop=True)
    preds = {"blend": t["p_blend"], "logit": t["p_logit"], "decision": t["p_dec"],
             "prognosis": t["base_prognosis_od25"].astype(float), "rules": t["rule_od25"].astype(float),
             "persistence": t["od_now25"].astype(float)}
    pairs = [("blend", "logit"), ("blend", "prognosis"), ("blend", "rules"), ("blend", "persistence"),
             ("logit", "prognosis"), ("logit", "rules"), ("logit", "persistence"), ("decision", "logit")]
    pre_sep15 = (t["valid"] < evalkit.SELECTION_START).to_numpy()
    legacy = (t["issue"] >= evalkit.LEGACY_TEST_START).to_numpy()
    tabs = []
    for name, m in [("long", None), ("pre_sep15_part", pre_sep15), ("legacy_part", legacy)]:
        b = boot(t, preds, pairs, m)
        b.insert(0, "period", name)
        tabs.append(b)
    tab = pd.concat(tabs, ignore_index=True)
    atomic_write(OUT / "final_eval_od.csv", tab.to_csv(index=False).encode())
    ch = {f"lead_{L}": changed(t, {k: preds[k] for k in ("blend", "logit", "decision", "prognosis", "rules")}, L)
          for L in (1, 6)}
    print("changed hours:", json.dumps({k: v["n"] for k, v in ch.items()}), flush=True)
    nc = nextchange(t)
    print(pd.DataFrame(nc["methods"])[["method", "n_issues", "hits", "false_alarm", "event_acc"]].round(3)
          .to_string(index=False), flush=True)
    res = {"written_utc": pd.Timestamp.now("UTC").isoformat(), "consistency": cons, "reproduction": repro,
           "rows": int(len(t)), "issues": int(t["issue"].nunique()), "days": int(t["valid"].dt.floor("D").nunique()),
           "issue_range": [str(t["issue"].min()), str(t["issue"].max())],
           "changed_hours": ch, "next_change": nc, "runtime_s": round(time.time() - t0)}
    atomic_write(OUT / "final_eval.json", json.dumps(res, indent=1, default=str).encode())
    show = tab[tab["metric"].eq("brier") & tab["lead"].isin([evalkit.POOLED, evalkit.POOLED_ALL])]
    pd.set_option("display.width", 220)
    print(show.round(4).to_string(index=False))
    acc = tab[tab["metric"].eq("acc") & tab["lead"].isin(LEADS) & tab["period"].eq("long")]
    print(acc.round(4).to_string(index=False))
    print(f"done in {time.time() - t0:.0f} s", flush=True)


if __name__ == "__main__":
    a = sys.argv[1:]
    main(int(a[a.index("--workers") + 1]) if "--workers" in a else 4)
