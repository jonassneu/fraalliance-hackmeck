"""Task 3: does the airport behave the same over 12 years?

    uv run python experiments/history12/era.py

Data: pass-1 radar hours (hour starts 06/12/18 UTC, every year sampled the same way), flown OD of the hour (>= 4
movements, confirmed source gaps excluded), observed METAR wind during the hour (h12lib.hourly_wind).

Per year:
  * P(OD 07 | tailwind on RWY 25), binned;
  * logistic fit P(OD 07) = sigmoid(a + b * tw25) -> tailwind at P = 0.5 (x50 = -a / b), 95 % CI from a week-block
    bootstrap (400 resamples of 7-day blocks: weather regimes last days);
  * pooled fit over all years, then per-year intercept shift d_y with the pooled slope fixed, expressed in kt
    (shift_kt = -d_y / b: negative = OD 07 at a lower tailwind than the pooled behaviour); heterogeneity
    Q = sum((d_y - mean_w)^2 / se_y^2) ~ chi2(k - 1);
  * state-dependent version from same-day sample pairs 6 h apart (06 -> 12, 12 -> 18 UTC): x50 for 'leave 25'
    (previous sample OD 25) and 'return to 25' (previous sample OD 07): hysteresis per year;
  * RWY 18: closure rate (judged busy hour without a RWY 18 departure) by steady tailwind on 18 under OD 07, and
    per-year offsets of a pooled logistic closed ~ max(tw18, 0) + OD07 (the fra.decision.Rwy18Model features).
    Days that look like a planned runway outage (fra.decision.rwy18_outage_days: all judged hours closed, one of
    them in < 8 kt tailwind on 18, or >= 90 % of >= 8 judged hours closed with at least half of the closures below
    8 kt; e.g. the COVID shutdown May - 15 Oct 2020, works 2017-05-25/26) are excluded and counted per year; the pooled
    bins / logistic also leave out the COVID window (fra.decision.COVID, routine non-use in low traffic).
Unconditional P(OD 07 | wind) also depends on how persistent the weather was in a year (hysteresis), so the
state-dependent thresholds are the cleaner behaviour measure.

Outputs: era_bins.csv, era_thresholds.csv, era_state_thresholds.csv, era_rwy18_bins.csv, era_rwy18_years.csv,
era_summary.json (experiments/history12/).
"""

import numpy as np
import pandas as pd
from scipy import stats

import h12lib as L
from fra.decision import COVID  # noqa: E402

TW_EDGES = [-np.inf, -5, -2, 0, 1, 2, 3, 4, 5, 7, np.inf]
TW18_EDGES = [-np.inf, 0, 5, 8, 10, 12, 15, np.inf]
N_BOOT = 400
MIN_YEAR_HOURS = 300            # a year needs this many labelled pass-1 hours to get its own fit


def data(gap_rule=None):
    t = L.hour_table(gap_rule=gap_rule)
    d = t[t["pass1"] & t["od"].notna() & t["tw25"].notna() & ~t["gap"]].copy()
    d["y07"] = (d["od"] == 7).astype(float)
    return t, d


def bins(d):
    d = d.assign(bin=pd.cut(d["tw25"], TW_EDGES))
    g = d.groupby(["year", "bin"], observed=True)["y07"]
    out = pd.DataFrame({"n": g.size(), "p_od07": g.mean()}).reset_index()
    pooled = d.groupby("bin", observed=True)["y07"].agg(["size", "mean"]).reset_index()
    pooled.columns = ["bin", "n", "p_od07"]
    pooled["year"] = "all"
    out = pd.concat([out, pooled[out.columns]], ignore_index=True)
    out["bin"] = out["bin"].astype(str)
    return out


def _x50(b):
    return -b[0] / b[1] if b[1] > 1e-6 else np.nan


def thresholds(d):
    """Per-year logistic fits + bootstrap CIs; pooled fit; per-year offsets with the pooled slope."""
    bp = L.logit_fit(d["tw25"].to_numpy(), d["y07"].to_numpy())
    eta_p = bp[0] + bp[1] * d["tw25"].to_numpy()
    rows = []
    for y, g in d.groupby("year"):
        x, yy = g["tw25"].to_numpy(), g["y07"].to_numpy()
        W = L.boot_row_weights(L.week_blocks(g.index), N_BOOT, seed=20261031 + int(y))
        b = L.logit_fit(x, yy)
        eta0 = eta_p[d["year"].to_numpy() == y]
        dy = L.logit_offset_fit(eta0, yy)
        bs_x50, bs_b, bs_d = [], [], []
        for w in W:
            bb = L.logit_fit(x, yy, w)
            bs_x50.append(_x50(bb))
            bs_b.append(bb[1])
            bs_d.append(L.logit_offset_fit(eta0, yy, w))
        lo, hi = L.ci(bs_x50)
        dlo, dhi = L.ci(bs_d)
        rows.append({"year": y, "n_hours": len(g), "n_weeks": int(L.week_blocks(g.index).max() + 1),
                     "share_od07": yy.mean(), "share_tw25_gt5": (x > 5).mean(), "mean_tw25": x.mean(),
                     "a": b[0], "b_per_kt": b[1], "b_lo": L.ci(bs_b)[0], "b_hi": L.ci(bs_b)[1],
                     "x50_kt": _x50(b), "x50_lo": lo, "x50_hi": hi,
                     "offset_logit": dy, "offset_se": float(np.nanstd(bs_d)), "offset_lo": dlo, "offset_hi": dhi,
                     "shift_kt": -dy / bp[1], "shift_lo": -dhi / bp[1], "shift_hi": -dlo / bp[1],
                     "own_fit": len(g) >= MIN_YEAR_HOURS})
    r = pd.DataFrame(rows)
    ok = r[r["own_fit"]]
    pooled = {"a": bp[0], "b_per_kt": bp[1], "x50_kt": _x50(bp), "n_hours": len(d)}
    if len(ok) >= 2:
        w = 1 / ok["offset_se"] ** 2
        m = float(np.sum(w * ok["offset_logit"]) / np.sum(w))
        Q = float(np.sum(w * (ok["offset_logit"] - m) ** 2))
        pooled.update(Q=Q, df=len(ok) - 1, p_heterogeneity=float(stats.chi2.sf(Q, len(ok) - 1)),
                      years_ci_excludes_pooled=[int(y) for y in ok.loc[(ok["offset_lo"] > 0) | (ok["offset_hi"] < 0),
                                                                        "year"]],
                      years_shift_gt_1kt=[int(y) for y in ok.loc[ok["shift_kt"].abs() > 1, "year"]])
    return r, pooled


def state_pairs(t):
    """Same-day pass-1 sample pairs 6 h apart with both OD observed: prev_od, od, tw25 of the later hour."""
    p = t[t["pass1"] & t["od"].notna() & ~t["gap"]]
    prev = p["od"].reindex(p.index - pd.Timedelta(hours=6))
    p = p.assign(prev_od=prev.to_numpy())
    p = p[p["prev_od"].notna() & p.index.hour.isin([12, 18]) & p["tw25"].notna()]
    return p


def state_thresholds(t):
    p = state_pairs(t)
    rows = []
    for (y, prev), g in p.groupby(["year", "prev_od"]):
        x = g["tw25"].to_numpy()
        yy = (g["od"] == 7).astype(float).to_numpy()
        if len(g) < 40 or yy.min() == yy.max():
            continue
        b = L.logit_fit(x, yy)
        W = L.boot_row_weights(L.week_blocks(g.index), N_BOOT, seed=7 + int(y) + int(prev))
        bs = [_x50(L.logit_fit(x, yy, w)) for w in W]
        lo, hi = L.ci(bs)
        rows.append({"year": y, "prev_od": int(prev), "n_pairs": len(g),
                     "n_switch": int((g["od"] != g["prev_od"]).sum()),
                     "x50_kt": _x50(b), "x50_lo": lo, "x50_hi": hi, "b_per_kt": b[1]})
    for prev, g in p.groupby("prev_od"):
        x = g["tw25"].to_numpy()
        yy = (g["od"] == 7).astype(float).to_numpy()
        b = L.logit_fit(x, yy)
        rows.append({"year": "all", "prev_od": int(prev), "n_pairs": len(g),
                     "n_switch": int((g["od"] != g["prev_od"]).sum()), "x50_kt": _x50(b), "b_per_kt": b[1]})
    return pd.DataFrame(rows)


def rwy18(t):
    """Closure rate under OD 07 by steady tailwind on 18 (all fetched judged hours with a directly observed OD; the
    RWY 18 judgement needs no bridging, so pass-1 sampling is not required)."""
    r = t[t["judged18"] & t["od"].notna() & t["tw18"].notna()].copy()
    r["closed"] = r["closed18"]
    out_days = L.rwy18_outage_days(r.index, r["closed"], r["tw18"])
    r["outage"] = r.index.floor("D").isin(out_days)
    outage_by_year = r[r["outage"]].groupby(r[r["outage"]].index.year).agg(
        outage_days=("closed", lambda x: x.index.floor("D").nunique()), outage_hours=("closed", "size"))
    r = r[~r["outage"]]
    # COVID window (fra.decision.COVID): 15-30 movement hours often had no RWY 18 departure without any closure, so
    # the pooled bins / logistic leave it out (per-year rows 2020-21 are still reported against the pooled fit)
    cov = (r.index >= COVID[0]) & (r.index < COVID[1])
    o7 = r[r["od"] == 7].assign(bin=lambda x: pd.cut(x["tw18"], TW18_EDGES))
    g = o7.groupby(["year", "bin"], observed=True)["closed"]
    b = pd.DataFrame({"n": g.size(), "closed": g.sum(), "rate": g.mean()}).reset_index()
    gp = o7[~cov[(r["od"] == 7).to_numpy()]].groupby("bin", observed=True)["closed"]
    bp = pd.DataFrame({"n": gp.size(), "closed": gp.sum(), "rate": gp.mean()}).reset_index().assign(year="all")
    b = pd.concat([b, bp[b.columns]], ignore_index=True)
    b["bin"] = b["bin"].astype(str)
    # pooled logistic (Rwy18Model features) + per-year offsets
    X = np.column_stack([np.maximum(r["tw18"].to_numpy(), 0), (r["od"] == 7).astype(float).to_numpy()])
    yv = r["closed"].to_numpy()
    bpool = L.logit_fit(X[~cov], yv[~cov], ridge=1e-3)
    eta = bpool[0] + X @ bpool[1:]
    rows = []
    for y, g in r.groupby("year"):
        m = (r["year"] == y).to_numpy()
        dy = L.logit_offset_fit(eta[m], yv[m]) if yv[m].sum() > 0 else -np.inf
        W = L.boot_row_weights(L.week_blocks(g.index), 200, seed=18 + int(y))
        bs = [L.logit_offset_fit(eta[m], yv[m], w) if (yv[m] * w).sum() > 0 else np.nan for w in W]
        lo, hi = L.ci(bs)
        o = g[g["od"] == 7]
        rows.append({"year": y, "judged": len(g), "closed": int(g["closed"].sum()), "judged_od07": len(o),
                     "closed_od07": int(o["closed"].sum()),
                     "closed_od07_tw18_lt8": int(o.loc[o["tw18"] < 8, "closed"].sum()),
                     "od07_tw18_ge12": int((o["tw18"] >= 12).sum()),
                     "closed_od07_tw18_ge12": int(o.loc[o["tw18"] >= 12, "closed"].sum()),
                     "rate_od07_tw18_lt8": o.loc[o["tw18"] < 8, "closed"].mean(),
                     "rate_od07_tw18_ge12": o.loc[o["tw18"] >= 12, "closed"].mean(),
                     "offset_logit": dy, "offset_lo": lo, "offset_hi": hi,
                     "pass1_only_judged": int(g["pass1"].sum()),
                     "outage_days_excluded": int(outage_by_year["outage_days"].get(y, 0)),
                     "outage_hours_excluded": int(outage_by_year["outage_hours"].get(y, 0))})
    pooled = {"intercept": bpool[0], "per_kt_tw18_pos": bpool[1], "od07": bpool[2], "n": int((~cov).sum()),
              "closed": int(yv[~cov].sum()),
              "covid_window_excluded_from_pooled": [str(COVID[0].date()), str(COVID[1].date())],
              "outage_days_excluded": [str(d.date()) for d in out_days],
              "p_closed_od07_at_kt": {k: float(1 / (1 + np.exp(-(bpool[0] + bpool[1] * k + bpool[2]))))
                                      for k in (5, 10, 12, 15, 18, 20)}}
    return b, pd.DataFrame(rows), pooled


def main(write=True, gap_rule=None):
    t, d = data(gap_rule)
    b = bins(d)
    thr, pooled = thresholds(d)
    st = state_thresholds(t)
    rb, ry, rp = rwy18(t)
    summary = {"built_at": pd.Timestamp.now(tz="UTC").isoformat(), "years": sorted(int(y) for y in d["year"].unique()),
               "od_pooled": pooled, "rwy18_pooled": rp,
               "note": "pass-1 hours only (06/12/18 UTC); unconditional fits mix behaviour and weather persistence; "
                       "see era_state_thresholds.csv for the hysteresis-resolved thresholds"}
    if write:
        L.atomic_write(b, L.OUT / "era_bins.csv", index=False, float_format="%.4g")
        L.atomic_write(thr, L.OUT / "era_thresholds.csv", index=False, float_format="%.4g")
        L.atomic_write(st, L.OUT / "era_state_thresholds.csv", index=False, float_format="%.4g")
        L.atomic_write(rb, L.OUT / "era_rwy18_bins.csv", index=False, float_format="%.4g")
        L.atomic_write(ry, L.OUT / "era_rwy18_years.csv", index=False, float_format="%.4g")
        L.write_json(summary, L.OUT / "era_summary.json")
    return {"bins": b, "thresholds": thr, "pooled": pooled, "state": st, "rwy18_bins": rb, "rwy18_years": ry,
            "rwy18_pooled": rp}


if __name__ == "__main__":
    pd.set_option("display.width", 250)
    pd.set_option("display.max_columns", 40)
    r = main()
    piv = r["bins"].pivot(index="year", columns="bin", values="p_od07")
    print((100 * piv[[c for c in r["bins"]["bin"].unique()]]).round(0).to_string())
    print(r["thresholds"].round(2).to_string(index=False))
    print(r["pooled"])
    print(r["state"].round(2).to_string(index=False))
    print(r["rwy18_years"].round(3).to_string(index=False))
    print(r["rwy18_bins"].pivot(index="year", columns="bin", values="rate").round(3).to_string())
    print(r["rwy18_pooled"])
