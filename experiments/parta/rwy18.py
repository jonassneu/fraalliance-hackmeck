"""RWY 18 West closure decision model given the ACTUAL wind (fra.decision.Rwy18Model).

All busy departure hours with a RWY 18 judgement (fra.labels: >= 15 movements, local hour >= 6), 2025-06 .. 2026-10:
39 'closed' hours on 11 local days. Closures at the night-ban edge (local 22 / 23 h) are flagged in `counts`; they are
kept because RWY 18 was used in 334 of 336 judged hours at local 22 and 7 of 8 at local 23 (no procedural non-use). Too few for walk-forward folds -> grouped
cross-validation by calendar day (whole days held out), plus the official rule and threshold scans on the observed wind,
both over all hours and within OD 07 only (closures under OD 25 are rare, so comparing rules over all hours mixes the
rule with the operating direction).

Caveats built into the output:
  * METAR reports a gust only when it exceeds the mean by ~10 kt: only 2 closure hours have a gust tailwind different
    from the steady one, so 'gust vs steady tailwind' cannot be distinguished with these data;
  * the 'wind-driven only' fits drop closure hours with steady tailwind < 8 kt, i.e. select rows on the outcome AND
    the predictor: their AUC / BSS / thresholds are descriptive, not out-of-sample skill.

    uv run python experiments/parta/rwy18.py   -> experiments/parta/rwy18_results.json, printed tables
"""

import json

import numpy as np
import pandas as pd
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import GroupKFold

import common as C
from common import D

RICH = ["tw18_0", "tw18g_0", "tw18_n3max", "od07", "xw18g_0"]
SETS = {
    "tw18": ["tw18_0"],
    "tw18+od": ["tw18_0", "od07"],
    "tw18pos+od": ["tw18_pos", "od07"],
    "rich": RICH,
    "rich+100m": RICH + ["tw18h_0"],
    "gust+od": ["tw18g_0", "od07"],
}
CS = [0.01, 0.05, 0.3, 1.0]


def oof(r, feats, Cv, n_splits=20):
    g = r.index.tz_convert(D.TZ).normalize().asi8
    p = np.full(len(r), np.nan)
    clim = np.full(len(r), np.nan)
    for tr, te in GroupKFold(n_splits=n_splits).split(r, groups=g):
        a = r.iloc[tr]
        if a["closed"].nunique() < 2:
            p[te] = clim[te] = a["closed"].mean()
            continue
        m = D.Rwy18Model(C=Cv, features=feats).fit(a)
        p[te] = m.p_closed(r.iloc[te], r["od"].iloc[te])
        clim[te] = a["closed"].mean()
    return p, clim


def scores(y, p, clim):
    b = float(np.mean((p - y) ** 2))
    bc = float(np.mean((clim - y) ** 2))
    n = len(y)
    out = {"auc": float(roc_auc_score(y, p)), "brier": b, "bss": 1 - b / bc,
           "logloss": float(-np.mean(y * np.log(np.clip(p, 1e-6, 1)) + (1 - y) * np.log(np.clip(1 - p, 1e-6, 1))))}
    for thr in (0.5, 0.2):
        f = p >= thr
        out[f"hits@{thr}"] = int((f & (y == 1)).sum())
        out[f"fa_per_1000h@{thr}"] = 1000 * float((f & (y == 0)).sum()) / n
    return out


def rule_scan(r):
    y = r["closed"].to_numpy()
    n = len(y)
    out = []
    for name, col in [("gust tailwind", "tw18g_0"), ("steady tailwind", "tw18_0"), ("100 m tailwind", "tw18h_0")]:
        if col not in r:
            continue
        for x in range(5, 21):
            f = (r[col] >= x).to_numpy()
            out.append({"rule": name, "kt": x, "fires": int(f.sum()), "hits": int((f & (y == 1)).sum()),
                        "fa_per_1000h": round(1000 * float((f & (y == 0)).sum()) / n, 2),
                        "precision": round(float(y[f].mean()), 3) if f.any() else np.nan})
    return pd.DataFrame(out)


def counts(r):
    c = r[r["closed"] == 1]
    lh = c.index.tz_convert(D.TZ)
    gust_rep = (r["tw18g_0"] - r["tw18_0"]) > 0.05          # a reported gust raises the tailwind on 18
    return {"n_hours": int(len(r)), "n_closed": int(len(c)), "n_closed_local_days": int(lh.normalize().nunique()),
            "closed_by_od": {str(int(k)): int(v) for k, v in c["od"].value_counts().items()},
            "closed_tw18_lt10": int((c["tw18_0"] < 10).sum()), "closed_tw18_lt8": int((c["tw18_0"] < 8).sum()),
            "closed_with_reported_gust": int(gust_rep[r["closed"] == 1].sum()),
            "share_hours_with_reported_gust": round(float(gust_rep.mean()), 4),
            "closed_local_hour_ge22": [str(t) for t in lh[lh.hour >= 22]]}


def main():
    labels, obs, F, _ = C.load()
    allj = D.rwy18_rows(F, exclude_night=False)
    excl = D.rwy18_rows(F, exclude_night=True)
    lh_all = allj.index.tz_convert(D.TZ).hour
    by_lh = allj.groupby(lh_all)["closed"].agg(["size", "sum"])
    print("judged hours / closed by local hour:\n", by_lh.T.to_string())
    r = D.rwy18_rows(F)
    r["od07"] = (r["od"] == 7).astype(float)
    r["tw18_pos"] = np.maximum(r["tw18_0"], 0)
    y = r["closed"].to_numpy()
    print(f"{len(r)} judged busy hours, {y.sum()} closed, {r.index.min()} .. {r.index.max()}")
    cnt = {"all_judged (used)": counts(r), "night-ban hour excluded (sensitivity)": counts(excl),
           "judged_and_closed_by_local_hour": {int(k): [int(a), int(b)] for k, (a, b) in by_lh.iterrows()}}
    print(json.dumps(cnt, indent=1))
    ev = r[r["closed"] == 1].copy()
    m = pd.read_parquet(C.DATA / "metar_full.parquet") if (C.DATA / "metar_full.parquet").exists() else \
        pd.read_parquet(C.DATA / "metar.parquet")
    m = m[~m.index.ceil("h").duplicated(keep="last")]
    mm = m.set_index(m.index.ceil("h"))[["drct", "sknt", "gust"]]
    ev = ev.join(mm, how="left")
    cols = ["od", "drct", "sknt", "gust", "tw18_0", "tw18g_0", "tw18_n3max", "tw18h_0", "xw18g_0"]
    print(ev[[c for c in cols if c in ev]].round(1).to_string())

    # closure rate by steady tailwind on 18 and OD
    r["twbin"] = pd.cut(r["tw18_0"], [-40, 0, 5, 8, 10, 12, 15, 40])
    tab = r.groupby(["twbin", "od"], observed=True)["closed"].agg(["size", "sum", "mean"]).round(3)
    print(tab.to_string())

    scan = rule_scan(r)
    print(scan[scan["kt"].isin([8, 10, 11, 12, 13, 14, 15, 16])].to_string(index=False))
    r07 = r[r["od"] == 7]
    scan07 = rule_scan(r07)
    print("WITHIN OD 07 ONLY (%d hours, %d closed)" % (len(r07), r07["closed"].sum()))
    print(scan07[scan07["kt"].isin([10, 12, 13, 14, 15, 16])].to_string(index=False))
    fires_by_od = {f"{col}>={x}": {str(int(k)): int(v) for k, v in r.loc[r[col] >= x, "od"].value_counts().items()}
                   for col, x in [("tw18g_0", 15), ("tw18_0", 15), ("tw18_0", 13)]}
    print("rule firings by OD:", fires_by_od)

    res = {**cnt["all_judged (used)"], "counts": cnt, "cv": {}, "rule_scan": scan.to_dict("records"),
           "rule_scan_od07": scan07.to_dict("records"), "rule_fires_by_od": fires_by_od,
           "closures": ev[[c for c in cols if c in ev]].round(2).reset_index().astype(str).to_dict("records")}
    for name, feats in SETS.items():
        for Cv in CS:
            ok = r[feats].notna().all(axis=1).to_numpy() if "tw18h_0" in feats else np.ones(len(r), bool)
            p, clim = oof(r[ok], feats, Cv)
            s = scores(y[ok], p, clim)
            res["cv"][f"{name}|C={Cv}"] = s
            print(f"{name:14s} C={Cv:<5} " + " ".join(f"{k}={v:.3f}" if isinstance(v, float) else f"{k}={v}" for k, v in s.items()))

    # fitted on everything: coefficients and the effective steady-tailwind threshold (P(closed) = 0.5, OD 07)
    fits = {}
    for name in ("tw18+od", "tw18pos+od", "rich"):
        for Cv in (0.05, 0.3, 1.0):
            mod = D.Rwy18Model(C=Cv, features=SETS[name]).fit(r)
            co = mod.coefficients()
            grid = pd.DataFrame({"tw18_0": np.arange(0, 30.01, 0.1)})
            for f in SETS[name]:
                if f not in grid:
                    grid[f] = r.loc[r["od"] == 7, f].median() if f != "od07" else 1.0
            grid["tw18_pos"] = np.maximum(grid["tw18_0"], 0)
            grid["tw18g_0"] = grid["tw18_0"] if "tw18g_0" in SETS[name] else 0   # no reported gust
            grid["tw18_n3max"] = grid["tw18_0"] if "tw18_n3max" in SETS[name] else 0
            pc = mod.p_closed(grid, 7)
            thr = {q: (float(grid["tw18_0"][pc >= q].min()) if (pc >= q).any() else None) for q in (0.2, 0.5, 0.8)}
            fits[f"{name}|C={Cv}"] = {"coef": co.round(4).to_dict(), "steady_tw18_at_p": thr}
            print(name, Cv, co.round(3).to_dict(), "steady tw18 (OD 07) where P(closed) >= 0.2/0.5/0.8:", thr)
    res["fits"] = fits

    # wind-driven closures only: closure hours with steady tailwind on 18 < 8 kt are not explained by wind
    # (Apr 2026 maintenance-like block, calm hours) -> drop them, refit, read off the threshold
    wind = r[~((r["closed"] == 1) & (r["tw18_0"] < 8))]
    res["wind_only"] = {"n_closed": int(wind["closed"].sum()),
                        "note": "DESCRIPTIVE: closure rows dropped on outcome and predictor (tw18 < 8 kt); "
                                "AUC/BSS are not out-of-sample skill"}
    for name in ("tw18+od", "tw18pos+od", "rich"):
        for Cv in (0.05, 0.3, 1.0):
            p, clim = oof(wind, SETS[name], Cv)
            s = scores(wind["closed"].to_numpy(), p, clim)
            mod = D.Rwy18Model(C=Cv, features=SETS[name]).fit(wind)
            grid = pd.DataFrame({"tw18_0": np.arange(0, 30.01, 0.1)})
            grid["tw18_pos"] = np.maximum(grid["tw18_0"], 0)
            grid["tw18g_0"], grid["tw18_n3max"], grid["xw18g_0"] = grid["tw18_0"], grid["tw18_0"], 3.0
            pc = mod.p_closed(grid, 7)
            thr = {q: (round(float(grid["tw18_0"][pc >= q].min()), 1) if (pc >= q).any() else None) for q in (0.2, 0.5, 0.8)}
            res["wind_only"][f"{name}|C={Cv}"] = {**s, "coef": mod.coefficients().round(4).to_dict(), "steady_tw18_at_p": thr}
            print(f"WIND-ONLY {name:12s} C={Cv:<5} auc={s['auc']:.3f} bss={s['bss']:.3f} hits@0.5={s['hits@0.5']} "
                  f"fa@0.5={s['fa_per_1000h@0.5']:.2f} hits@0.2={s['hits@0.2']} fa@0.2={s['fa_per_1000h@0.2']:.2f} "
                  f"P(closed|OD07, steady tw18) >= 0.2/0.5/0.8 at {thr}")
    (C.OUT / "rwy18_results.json").write_text(json.dumps(res, indent=1, default=str))


if __name__ == "__main__":
    main()
