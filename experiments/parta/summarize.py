"""Tables for experiments/parta/REPORT.md from the saved walk-forward predictions (evaluate.py, endtoend.py, oracle.py).

    uv run python experiments/parta/summarize.py   -> summary.json, bootstrap_main.csv, bootstrap_blend.csv + tables

bootstrap_blend.csv: production blended with the decision model on (a) the deterministic as-issued ECMWF IFS path
(no Part B) and (b) Part B's paths (ensemble-mean / own-path anticipation), fixed 50/50 and with walk-forward weights
(per lead bucket, fitted on earlier test weeks' rows whose outcome was known before the week, 0.5 in week 1), plus the
pairwise differences that attribute the blend gain (decision model alone vs. what Part B's paths add).
"""

import json

import numpy as np
import pandas as pd

import common as C
from common import D, evalkit

# tag -> evaluate.py variant (fra.decision UPPER_100M / DEFAULT_100M / DEFAULT)
MAIN = {"perfect_upper": "lgbm_mono_small_100m4_f6", "perfect_100m": "logit_C0.03_100m4_f6",
        "perfect_10m": "logit_C0.1_f6"}
PLUGIN = "logit_C0.1_f6"
# end-to-end A+B prediction files (endtoend.py) used in the tables; '_mg' = METAR-gust interface diagnostic
E2E = ["logit_C0.1_f6_antmean", "logit_C0.1_f6", "lgbm_mono_small_antmean", "lgbm_mono_small",
       "lgbm_mono_small_f6_antmean", "lgbm_mono_small_f6", "logit_C0.1_f6_antmean_mg", "logit_C0.1_f6_mg"]
BUCKETS = [(1, 3), (4, 12), (13, 30), (31, 48)]          # fra.train lead buckets
WGRID = np.round(np.arange(0, 1.0001, 0.05), 2)


def wf_blend(t, a, b):
    """Walk-forward blend w*a + (1-w)*b: w per lead bucket minimising Brier on rows with valid < week start (earlier
    test weeks only; 0.5 when there is none yet). Returns (p, weights table)."""
    p = np.full(len(t), np.nan)
    y = (t["od"] == 25).to_numpy(float)
    A, Bv = t[a].to_numpy(), t[b].to_numpy()
    iss, val, lead = pd.DatetimeIndex(t["issue"]), pd.DatetimeIndex(t["valid"]), t["lead"].to_numpy()
    rows = []
    for ws in C.week_starts():
        te = (iss >= ws) & (iss < ws + pd.Timedelta(days=7))
        tr = val < ws
        for lo, hi in BUCKETS:
            inb = (lead >= lo) & (lead <= hi)
            m = tr & inb
            if m.sum() < 50:
                w = 0.5
            else:
                br = [np.mean((w_ * A[m] + (1 - w_) * Bv[m] - y[m]) ** 2) for w_ in WGRID]
                w = float(WGRID[int(np.argmin(br))])
            k = te & inb
            p[k] = w * A[k] + (1 - w) * Bv[k]
            rows.append({"week": str(ws.date()), "bucket": f"{lo}-{hi}", "w_first": w, "n_train": int(m.sum())})
    return p, pd.DataFrame(rows)


def variants_table():
    out = []
    for p in sorted(C.OUT.glob("res_*.json")):
        if p.name.startswith("res_e2e_"):
            continue
        r = json.loads(p.read_text())
        if "onestep" not in r:          # res_oracle.json etc.: not a decision-model variant
            continue
        a, pf = r["onestep"]["all"], r["perfect"]
        row = {"variant": r["variant"], "1step_logloss": a["logloss"], "1step_brier": a["brier"],
               "morning_logloss": r["onestep"]["morning"]["logloss"], "sw_prec": a["precision"], "sw_rec": a["recall"]}
        row.update({f"perfect_acc{L}": pf[f"acc{L}"] for L in C.LEADS})
        row["perfect_brier"] = pf["brier_1_6_24_48"]
        if "ifs_plugin" in r:
            row["ifs_plugin_brier"] = r["ifs_plugin"]["brier_1_6_24_48"]
            row.update({f"ifs_acc{L}": r["ifs_plugin"][f"acc{L}"] for L in C.LEADS})
        out.append(row)
    return pd.DataFrame(out).sort_values("perfect_brier")


def onestep_baselines(rows):
    """Climatological hazard per (previous OD, day/morning) fitted walk-forward; official rule on the actual wind."""
    parts = []
    for ws in C.week_starts():
        we = min(ws + pd.Timedelta(days=7), C.END)
        tr = rows[rows.index + D.FUT * C.HOUR <= ws]
        te = rows[(rows.index >= ws) & (rows.index < we)].copy()
        rate = tr.groupby(["od_prev", "kind"])["stay"].mean()
        te["p_stay"] = [rate.get((a, b), tr["stay"].mean()) for a, b in zip(te["od_prev"], te["kind"])]
        parts.append(te)
    te = pd.concat(parts)
    s = np.where(te["od_prev"] == 25, 1.0, -1.0)
    twA = s * te["tw25_0"].to_numpy()
    out = {"climatology": C.onestep_metrics(te)}
    for name, fire in [("rule_official_tw>1kt", twA > 1), ("rule_tw>=5kt", twA >= 5), ("rule_tw>=10kt", twA >= 10)]:
        out[name] = C.onestep_metrics(te.assign(p_stay=np.where(fire, 0.0, 1.0)))
    return out


def detection(name):
    one = pd.read_parquet(C.OUT / f"pred_onestep_{name}.parquet")
    return {f"thr{thr}": {k: C.onestep_metrics(one[one["kind"].isin(k.split("+"))], thr=thr)
                          for k in ("day+morning", "day", "morning")} for thr in (0.5, 0.3, 0.2)}


def boot(t, cols, pairs):
    y = (t["od"] == 25).astype(float).to_numpy()
    tab = evalkit.bootstrap(y, {k: t[c].to_numpy() for k, c in cols.items()}, t["valid"], t["lead"], C.LEADS, pairs)
    return tab


def change_metrics(t_roll, labels, col_pnc):
    """P(change within 48 h) Brier and first-change event accuracy (fra.changetime.score, +-3 h, sustained >= 2 h)."""
    from fra import changetime as CT
    w = t_roll.pivot(index="issue", columns="lead", values=col_pnc)
    iss = w.index
    od_now = labels["od"].reindex(pd.DatetimeIndex(iss) - C.HOUR).to_numpy()
    leads = np.arange(1, 49)
    yy = np.stack([labels["od"].reindex(pd.DatetimeIndex(iss) + L * C.HOUR).to_numpy() for L in leads], 1)
    ok = ~np.isnan(yy).any(1) & ~np.isnan(od_now) & (pd.DatetimeIndex(iss) + 48 * C.HOUR < C.END)
    pnc = w[leads].to_numpy()[ok]
    yy, od_now, iss = yy[ok], od_now[ok], iss[ok]
    act = CT.actual_first_change(yy, od_now)
    p_change = 1 - pnc[:, -1]
    any_change = (yy != od_now[:, None]).any(1).astype(float)
    pc = (1 - pnc) >= 0.5
    pred = np.where(pc.any(1), pc.argmax(1), -1)
    r = CT.score(pred, act)
    r["brier_p_change48"] = float(np.mean((p_change - any_change) ** 2))
    r["brier_base_rate"] = float(np.mean((any_change.mean() - any_change) ** 2))
    legacy = pd.DatetimeIndex(iss) >= pd.Timestamp("2026-09-22", tz="UTC")
    r["legacy_from_0922"] = CT.score(pred[legacy], act[legacy])
    return r


def blends(t):
    """Blend attribution table -> bootstrap_blend.csv (+ walk-forward weights in summary.json)."""
    t = t.copy()
    E = "p_e2e_logit_C0.1_f6_antmean"
    t["b_ifs"] = (t["p_ifs"] + t["p_prod"]) / 2
    t["b_e2e"] = (t[E] + t["p_prod"]) / 2
    t["b_e2e_path"] = (t["p_e2e_logit_C0.1_f6"] + t["p_prod"]) / 2
    t["wb_ifs"], w_ifs = wf_blend(t, "p_ifs", "p_prod")
    t["wb_e2e"], w_e2e = wf_blend(t, E, "p_prod")
    cols = {"production": "p_prod", "ifs_plugin_10m": "p_ifs", "e2e_mean": E, "blend50_prod_ifs": "b_ifs",
            "blend50_prod_e2e_mean": "b_e2e", "blend50_prod_e2e_path": "b_e2e_path", "wfblend_prod_ifs": "wb_ifs",
            "wfblend_prod_e2e_mean": "wb_e2e"}
    pairs = [(k, "production") for k in cols if k != "production"] + [
        ("blend50_prod_e2e_mean", "blend50_prod_ifs"), ("wfblend_prod_e2e_mean", "wfblend_prod_ifs"),
        ("wfblend_prod_e2e_mean", "blend50_prod_e2e_mean"), ("wfblend_prod_ifs", "blend50_prod_ifs")]
    tab = boot(t, cols, pairs)
    tab.to_csv(C.OUT / "bootstrap_blend.csv", index=False)
    print("BLENDS (same rows)")
    print(evalkit.ci_wide(tab, "acc").to_string())
    print(evalkit.ci_wide(tab, "brier", scale=1, nd=4).to_string())
    wt = {"prod_ifs": w_ifs, "prod_e2e_mean": w_e2e}
    for k, w in wt.items():
        print(f"walk-forward weight on the decision model ({k}) by bucket, weeks 1..22:\n",
              w.pivot(index="week", columns="bucket", values="w_first").T.to_string())
    pooled = tab[(tab["metric"] == "brier") & (tab["lead"] == evalkit.POOLED)].set_index("method")
    return {"pooled_brier": pooled[["est", "lo", "hi"]].round(5).to_dict("index"),
            "wf_weights": {k: w.to_dict("records") for k, w in wt.items()}}


def main():
    labels, obs, F, rows = C.load()
    prod = C.prod_table()
    vt = variants_table()
    pd.set_option("display.width", 250)
    print(vt.round(4).to_string(index=False))
    res = {"variants": vt.round(5).to_dict("records"), "onestep_baselines": onestep_baselines(rows)}
    print(json.dumps(res["onestep_baselines"], indent=1))
    for name in MAIN.values():
        res[f"detection_{name}"] = detection(name)
        print(name, json.dumps(res[f"detection_{name}"]["thr0.3"]["day+morning"]))

    # paired bootstrap: perfect-forecast rollout vs production (+ IFS plug-in, + A+B end-to-end where available)
    t = prod.copy()
    cols = {"production": "p_prod"}
    for tag, name in MAIN.items():
        r = pd.read_parquet(C.OUT / f"pred_rollout_{name}.parquet")
        t = t.merge(r[["issue", "lead", "p_perfect"]].rename(columns={"p_perfect": f"p_{tag}"}), on=["issue", "lead"])
        cols[tag] = f"p_{tag}"
        if name == PLUGIN:
            t = t.merge(r[["issue", "lead", "p_ifs"]], on=["issue", "lead"])
            cols["ifs_plugin_10m"] = "p_ifs"
    for n in ("rules", "prognosis", "persistence"):
        c = {"rules": "rule_od25", "prognosis": "base_prognosis_od25", "persistence": "od_now25"}[n]
        t[f"p_{n}"] = t[c].astype(float)
        cols[n] = f"p_{n}"
    e2e = [C.OUT / f"pred_e2e_{n}.parquet" for n in E2E if (C.OUT / f"pred_e2e_{n}.parquet").exists()]
    oracle = C.OUT / "pred_oracle_production.parquet"
    if oracle.exists():
        t = t.merge(pd.read_parquet(oracle)[["issue", "lead", "p_oracle", "era5_100m"]], on=["issue", "lead"], how="left")
        cols["oracle_production"] = "p_oracle"
    for p in e2e:
        nm = p.stem.replace("pred_e2e_", "")
        t = t.merge(pd.read_parquet(p)[["issue", "lead", "p_e2e"]].rename(columns={"p_e2e": f"p_e2e_{nm}"}),
                    on=["issue", "lead"], how="left")
        cols[f"e2e_{nm}"] = f"p_e2e_{nm}"
    t = t.dropna(subset=list(cols.values()))
    pairs = [(k, "production") for k in cols if k != "production"] + [("perfect_upper", "perfect_100m"),
                                                                       ("perfect_100m", "perfect_10m")]
    if "oracle_production" in cols:
        pairs += [("perfect_upper", "oracle_production"), ("perfect_10m", "oracle_production")]
    if {"e2e_logit_C0.1_f6_antmean", "e2e_logit_C0.1_f6"} <= set(cols):     # anticipation: ensemble mean vs own path
        pairs += [("e2e_logit_C0.1_f6_antmean", "e2e_logit_C0.1_f6"), ("e2e_logit_C0.1_f6_antmean", "ifs_plugin_10m")]
    tab = boot(t, cols, pairs)
    tab.to_csv(C.OUT / "bootstrap_main.csv", index=False)
    print("rows per lead:", t.groupby("lead").size().reindex(C.LEADS).to_dict())
    print(evalkit.ci_wide(tab, "acc").to_string())
    print(evalkit.ci_wide(tab, "brier", scale=1, nd=4).to_string())
    res["bootstrap_rows"] = int(len(t))
    res["blend"] = blends(t)
    if "era5_100m" in t:   # ERA5 ends 2026-10-25: 100 m inputs of oracle / perfect_100m / perfect_upper missing after
        x = t[t["lead"].isin(C.LEADS) & t["era5_100m"].astype(bool)]
        yy = (x["od"] == 25).astype(float)
        res["brier_rows_with_era5"] = {"rows": int(len(x)), **{k: float(((x[c] - yy) ** 2).mean()) for k, c in cols.items()
                                       if k in ("production", "oracle_production") or k in MAIN}}
        print("Brier(1,6,24,48) on rows with ERA5 100 m at the valid time:", json.dumps(res["brier_rows_with_era5"]))

    # where do the errors sit? lead-24 error rate by actual tailwind on 25 at the valid hour
    v = pd.DatetimeIndex(t["valid"])
    t["tw"] = F["tw25_0"].reindex(v).to_numpy()
    x = t[t["lead"] == 24].copy()
    x["twbin"] = pd.cut(x["tw"], [-40, -5, -2, 0, 2, 5, 40])
    y = (x["od"] == 25)
    err = {k: ((x[c] > 0.5) != y) for k, c in cols.items() if k in ("production", "oracle_production") or k in MAIN}
    eb = pd.DataFrame({"n": x.groupby("twbin", observed=True).size(), "share_od25": y.groupby(x["twbin"], observed=True).mean(),
                       **{f"err_{k}": e.groupby(x["twbin"], observed=True).mean() for k, e in err.items()}})
    print(eb.round(3).to_string())
    res["errors_by_tailwind_lead24"] = eb.round(4).reset_index().astype({"twbin": str}).to_dict("records")

    # monthly
    x = t[t["lead"].isin(C.LEADS)].copy()
    x["month"] = pd.DatetimeIndex(x["issue"]).strftime("%Y-%m")
    yy = (x["od"] == 25).astype(float)
    mon = pd.DataFrame({k: ((x[c] - yy) ** 2).groupby(x["month"]).mean() for k, c in cols.items()
                        if k in ("production", "oracle_production") or k in MAIN or k.startswith("e2e")})
    print("Brier(1,6,24,48) by month\n", mon.round(4).to_string())
    res["brier_by_month"] = mon.round(5).to_dict()

    # change within 48 h / first change (perfect rollout, main variants)
    for name in MAIN.values():
        r = pd.read_parquet(C.OUT / f"pred_rollout_{name}.parquet")
        res[f"change_{name}"] = change_metrics(r, labels, "pnc_perfect")
        print("change", name, json.dumps(res[f"change_{name}"]))
        if "pnc_ifs" in r:
            res[f"change_ifs_{name}"] = change_metrics(r.dropna(subset=["pnc_ifs"]), labels, "pnc_ifs")
            print("change IFS plug-in", name, json.dumps(res[f"change_ifs_{name}"]))
    for p in e2e:
        nm = p.stem.replace("pred_e2e_", "")
        r = pd.read_parquet(p)
        res[f"change_e2e_{nm}"] = change_metrics(r, labels, "pnc_e2e")
        print("change e2e", nm, json.dumps(res[f"change_e2e_{nm}"]))
    (C.OUT / "summary.json").write_text(json.dumps(res, indent=1, default=str))


if __name__ == "__main__":
    main()
