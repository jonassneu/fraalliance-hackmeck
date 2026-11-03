"""Task 2: yearly operating-direction shares from the radar history vs. published figures, data coverage, source
gaps and the COVID years.

    uv run python experiments/history12/shares.py

Estimators (per year / period, daytime only):
  time share      share of sampled hours flown in OD 25 (hour label: west >= east among >= 4 low-level movements)
  movement share  all classified movements of an hour (west + east + RWY 18 departures) attributed to the hour's OD:
                  sum over OD 25 hours / sum over all hours
  w/e ratio       sum(west) / sum(west + east): biased low, because under OD 25 more departures use RWY 18 (classified
                  'south', not 'west'): 2026 hourly data, 07-21 local: 57.0 west/east + 25.7 RWY 18 per OD 25 hour
                  vs. 63.5 + 20.4 per OD 07 hour (totals 82.7 vs. 83.9). Kept as a diagnostic only.
Both use the pass-1 hours (hour starts 06/12/18 UTC = 07/13/19 local in winter, 08/14/20 in summer) so that every
year is measured the same way; 'all' variants use every fetched daytime hour (since the backfill completed on
2026-11-02 every daytime hour of 2014-01-01 .. today, so 'all' is the full-hour estimate in every year).
OD label gaps follow fra.labels.GAP_RULE (h12lib.hour_table); RWY 18 judgements leave out every confirmed suspect.
The sampling error of the pass-1 estimator against the full-hour truth is measured on the hourly 2026 data.
Night (22-06 local) figures cannot be checked: the history samples contain no night hours.

Outputs (experiments/history12/):
  yearly_shares.csv          per year: coverage, shares (pass-1 / all), COVID / threshold counts, RWY 18 judged hours
  published_compare.csv      every published figure next to the radar estimate for the same period and hours
  monthly_compare_2015_2018.csv  monthly time share vs. the published monthly table (once 2015-2018 are fetched)
  metar_check.csv            METAR wind statistics per year, 2015-2018 vs. the published METAR table
  shares_summary.json
"""

import numpy as np
import pandas as pd

import h12lib as L
from fra.labels import GAP_RULE  # noqa: E402  (h12lib puts the repository on sys.path)

FLAG_PP = 3.0
MIN_COVERAGE = 0.95         # share of the period's days with >= 1 pass-1 sample before a comparison is judged


def _months(spec):
    """'5-10' -> [5..10]; '1-3+8-10' -> [1,2,3,8,9,10]."""
    out = []
    for part in str(spec).split("+"):
        a, b = (int(x) for x in part.split("-"))
        out += list(range(a, b + 1))
    return out


def _local_ok(t, hours):
    """Mask of hour rows whose local hour lies in the published window (all pass-1 samples are 07-20 local)."""
    lh = t["local_hour"]
    if hours in ("all", "05-23"):
        return (lh >= 5) & (lh < 23)
    if hours == "06-22":
        return (lh >= 6) & (lh < 22)
    if hours == "22-06":
        return (lh >= 22) | (lh < 6)
    raise ValueError(hours)


def estimate(t):
    """time share / movement share (OD 25, %) and counts on hour rows t (already filtered)."""
    lab = t[t["od"].notna()]
    n_h = len(lab)
    ts = 100 * (lab["od"] == 25).mean() if n_h else np.nan
    tot = lab["n"] + lab["rwy18_deps"]
    mv = 100 * tot[lab["od"] == 25].sum() / tot.sum() if n_h else np.nan
    we = 100 * lab["west"].sum() / lab["n"].sum() if n_h else np.nan
    return {"n_hours": n_h, "time_share": ts, "movement_share": mv, "we_ratio": we,
            "n_days": int(lab.index.floor("D").nunique())}


def sampling_error(t):
    """Pass-1 estimator vs. all daytime hours on the hourly forward data (2026-02-11 ..): per calendar month and
    for the whole span. Returns DataFrame + RMS (pp)."""
    h = t[(t["source"] == "forward") & (t.index >= pd.Timestamp("2026-02-11", tz="UTC")) & _local_ok(t, "05-23")
          & t["od"].notna()]
    rows = []
    for (y, m), g in h.groupby([h.index.year, h.index.month]):
        a, p = estimate(g), estimate(g[g["pass1"]])
        rows.append({"year": y, "month": m, "all_time": a["time_share"], "pass1_time": p["time_share"],
                     "all_mv": a["movement_share"], "pass1_mv": p["movement_share"], "n_all": a["n_hours"],
                     "n_pass1": p["n_hours"]})
    d = pd.DataFrame(rows)
    if not len(d):
        return d, {}
    d["diff_time"] = d["pass1_time"] - d["all_time"]
    d["diff_mv"] = d["pass1_mv"] - d["all_mv"]
    full_a, full_p = estimate(h), estimate(h[h["pass1"]])
    return d, {"months": len(d), "rms_month_time_pp": float(np.sqrt(np.mean(d["diff_time"] ** 2))),
               "rms_month_mv_pp": float(np.sqrt(np.mean(d["diff_mv"] ** 2))),
               "span_all_time": full_a["time_share"], "span_pass1_time": full_p["time_share"],
               "span_all_mv": full_a["movement_share"], "span_pass1_mv": full_p["movement_share"],
               "span": f"{h.index.min().date()} .. {h.index.max().date()}",
               "time_vs_movement_all_pp": full_a["time_share"] - full_a["movement_share"]}


def yearly(t, sus, complete):
    rows = []
    for y in sorted(t["year"].unique()):
        g = t[t["year"] == y]
        start = max(pd.Timestamp(f"{y}-01-01", tz="UTC"), pd.Timestamp("2014-01-01", tz="UTC"))
        end = min(pd.Timestamp(f"{y + 1}-01-01", tz="UTC"), t.index.max().ceil("D"))
        n_days = int((end - start) / pd.Timedelta(days=1))
        p1 = g[g["pass1"]]
        day = _local_ok(g, "05-23")
        e1 = estimate(p1[_local_ok(p1, "05-23")])
        ea = estimate(g[day])
        s = sus[sus["time"].dt.year == y] if len(sus) else sus
        p1day = p1[~p1["gap"]]
        rows.append({
            "year": y, "first_hour": g.index.min(), "last_hour": g.index.max(),
            "days_in_span": n_days,
            "days_with_pass1": int(p1.index.floor("D").nunique()),
            "pass1_hours": len(p1), "pass1_expected": 3 * n_days,
            "pass1_coverage": len(p1) / (3 * n_days) if n_days else np.nan,
            "fetched_hours": len(g), "complete_days": int(complete.year.isin([y]).sum()) if len(complete) else 0,
            "source_history_hours": int((g["source"] == "history").sum()),
            "source_forward_hours": int((g["source"] == "forward").sum()),
            "gap_hours_od": int(g["gap"].sum()),
            "confirmed_suspect_hours": int(g["confirmed"].sum()),
            "suspect_pending": int((s["status"] == "pending").sum()) if len(s) else 0,
            "suspect_confirmed": int((s["status"] == "confirmed").sum()) if len(s) else 0,
            "pass1_mean_moves": p1day["n"].mean(),
            "pass1_share_lt4": (p1day["n"] < 4).mean(),
            "pass1_share_lt10": (p1day["n"] < 10).mean(),
            "pass1_share_lt15": (p1day["n"] < 15).mean(),
            "pass1_rwy18_judged": int(p1["judged18"].sum()),
            "pass1_rwy18_judged_share": p1["judged18"].mean(),
            "rwy18_judged_all": int(g["judged18"].sum()),
            "rwy18_closed_all": int(np.nansum(g["closed18"])),
            "rwy18_closed_od07": int(np.nansum(g["closed18"].where(g["od"] == 7))),
            "pass1_time_share_od25": e1["time_share"], "pass1_movement_share_od25": e1["movement_share"],
            "pass1_we_ratio_od25": e1["we_ratio"],
            "pass1_labelled_hours": e1["n_hours"],
            "all_time_share_od25": ea["time_share"], "all_movement_share_od25": ea["movement_share"],
            "all_labelled_hours": ea["n_hours"],
            "metar_missing_share": g["tw25"].isna().mean(),
            "partial_year": bool(len(p1) < 0.95 * 3 * n_days),
        })
    return pd.DataFrame(rows)


def compare(t, pub):
    rows = []
    p1 = t[t["pass1"]]
    for _, r in pub.iterrows():
        out = r.to_dict()
        if pd.isna(r["year"]) or r["period"].startswith("long_term"):
            # long-term means: compare with the pooled estimate over all complete years so far
            yrs = sorted(set(t["year"]))
            sub = p1[_local_ok(p1, r["local_hours"] if r["local_hours"] != "22-06" else "05-23")]
            if r["period"] == "long_term_6vM":
                sub = sub[sub["month"].isin(range(5, 11))]
            e = estimate(sub)
            out.update(radar_time_share=e["time_share"], radar_movement_share=e["movement_share"],
                       radar_hours=e["n_hours"], coverage=np.nan, radar_years=f"{min(yrs)}-{max(yrs)}",
                       diff_pp=np.nan, flag="", status="pooled (reference only)")
            rows.append(out)
            continue
        y = int(r["year"])
        months = list(range(1, 13)) if r["period"] == "full_year" else _months(r["months"])
        if r["local_hours"] == "22-06":
            out.update(status="not checkable: the history samples contain no night hours", flag="")
            rows.append(out)
            continue
        sub = p1[(p1["year"] == y) & p1["month"].isin(months) & _local_ok(p1, r["local_hours"])]
        days = pd.date_range(f"{y}-01-01", f"{y}-12-31", freq="D", tz="UTC")
        days = days[days.month.isin(months)]
        cov = sub.index.floor("D").nunique() / len(days)
        e = estimate(sub)
        # every fetched daytime hour of the period (the backfill is complete: all 19 daytime hours of every day)
        suba = t[(t["year"] == y) & t["month"].isin(months) & _local_ok(t, r["local_hours"])]
        ea = estimate(suba)
        # stated metric: time share (verified) or movement share (inferred for the 6vM noise-review figures, where
        # the definition is not printed). Movement-share rows are flagged only if BOTH radar metrics differ > 3 pp.
        inferred = str(r["metric"]).startswith("movement")
        metric = "movement_share" if inferred else "time_share"
        d_t = e["time_share"] - float(r["br25_pct"]) if np.isfinite(e["time_share"]) else np.nan
        d_m = e["movement_share"] - float(r["br25_pct"]) if np.isfinite(e["movement_share"]) else np.nan
        diff = d_m if inferred else d_t
        judged = cov >= MIN_COVERAGE
        bad = (abs(d_t) > FLAG_PP and abs(d_m) > FLAG_PP) if inferred else abs(d_t) > FLAG_PP
        flag = ""
        if judged:
            flag = "DIFF>3pp" if bad else ("ok" if abs(diff) <= FLAG_PP else "ok (time share)")
        da_t = ea["time_share"] - float(r["br25_pct"]) if np.isfinite(ea["time_share"]) else np.nan
        da_m = ea["movement_share"] - float(r["br25_pct"]) if np.isfinite(ea["movement_share"]) else np.nan
        bad_a = (abs(da_t) > FLAG_PP and abs(da_m) > FLAG_PP) if inferred else abs(da_t) > FLAG_PP
        flag_a = ("DIFF>3pp" if bad_a else "ok") if judged and ea["n_hours"] else ""
        out.update(radar_time_share=e["time_share"], radar_movement_share=e["movement_share"],
                   radar_we_ratio=e["we_ratio"], radar_hours=e["n_hours"], coverage=cov, compared_metric=metric,
                   diff_pp=diff,
                   diff_time_pp=d_t, diff_movement_pp=d_m, flag=flag,
                   all_time_share=ea["time_share"], all_movement_share=ea["movement_share"], all_hours=ea["n_hours"],
                   diff_time_all_pp=da_t, diff_movement_all_pp=da_m, flag_all=flag_a,
                   status=("compared" if judged else ("no radar data yet" if e["n_hours"] == 0
                                                       else f"partial coverage {cov:.0%}")))
        rows.append(out)
    return pd.DataFrame(rows)


def monthly_compare(t, pubm):
    ta = t[_local_ok(t, "05-23")]
    p1 = ta[ta["pass1"]]
    rows = []
    for _, r in pubm.iterrows():
        sub = p1[(p1["year"] == r["year"]) & (p1["month"] == r["month"])]
        e = estimate(sub)
        ea = estimate(ta[(ta["year"] == r["year"]) & (ta["month"] == r["month"])])
        ndays = pd.Period(f"{int(r['year'])}-{int(r['month']):02d}").days_in_month
        rows.append({"year": r["year"], "month": r["month"], "published_br07": r["br07_pct"],
                     "radar_br07_time": 100 - e["time_share"] if e["n_hours"] else np.nan,
                     "radar_hours": e["n_hours"], "coverage": sub.index.floor("D").nunique() / ndays,
                     "radar_br07_time_all": 100 - ea["time_share"] if ea["n_hours"] else np.nan,
                     "radar_hours_all": ea["n_hours"]})
    d = pd.DataFrame(rows)
    d["diff_pp"] = d["radar_br07_time"] - d["published_br07"]
    d["diff_all_pp"] = d["radar_br07_time_all"] - d["published_br07"]
    return d


def metar_stats():
    """Per year (04:50-22:50 local, as the published table): share of reports with a component from 070 >= 0 kt
    (direction 340-160 deg), >= 5 kt, variable direction, calm; plus AUTO / gust-group shares and mean speed."""
    m = pd.read_parquet(L.DATA / "metar_full.parquet")
    m = m[m["sknt"].notna()]
    loc = m.index.tz_convert(L.TZ)
    mins = loc.hour * 60 + loc.minute
    m = m[(mins >= 4 * 60 + 50) & (mins <= 22 * 60 + 50)]
    d = m["drct"].astype(float)
    s = m["sknt"].astype(float)
    calm = s == 0
    vrb = d.isna() & ~calm
    comp70 = s * np.cos(np.radians(d - 70.0))
    ge0 = (~calm & d.notna() & ((d >= 340) | (d <= 160)))
    ge5 = d.notna() & (comp70 >= 5)
    txt = m["metar"].astype(str)
    out = pd.DataFrame({"year": m.index.year, "ge0": ge0, "ge5": ge5, "vrb": vrb, "calm": calm,
                        "auto": txt.str.contains(" AUTO "), "gust": m["gust"].notna(), "spd": s})
    g = out.groupby("year")
    return pd.DataFrame({"reports": g.size(), "share_70deg_ge0_pct": 100 * g["ge0"].mean(),
                         "share_70deg_ge5kt_pct": 100 * g["ge5"].mean(), "variable_pct": 100 * g["vrb"].mean(),
                         "calm_pct": 100 * g["calm"].mean(), "auto_pct": 100 * g["auto"].mean(),
                         "gust_group_pct": 100 * g["gust"].mean(), "mean_speed_kt": g["spd"].mean()}).reset_index()


def main(write=True, gap_rule=None):
    t = L.hour_table(gap_rule=gap_rule)
    sus = L.suspects()
    complete = L.complete_day_index()
    pub = pd.read_csv(L.OUT / "published_shares.csv")
    pubm = pd.read_csv(L.OUT / "published_monthly_2015_2018.csv")
    pubw = pd.read_csv(L.OUT / "published_metar_2015_2018.csv")
    yr = yearly(t, sus, complete)
    cmp_ = compare(t, pub)
    mon = monthly_compare(t, pubm)
    se, se_sum = sampling_error(t)
    ms = metar_stats()
    mchk = ms.merge(pubw[["year", "share_70deg_component_ge0_pct", "share_70deg_component_ge5kt_pct",
                          "variable_pct", "calm_pct"]].rename(columns=lambda c: c if c == "year" else "pub_" + c),
                    on="year", how="left")
    judged = cmp_[cmp_["status"] == "compared"]
    mon_ok = mon[mon["coverage"] >= MIN_COVERAGE]
    summary = {
        "built_at": pd.Timestamp.now(tz="UTC").isoformat(),
        "radar_years": sorted(int(y) for y in t["year"].unique()),
        "history_first_hour": t[t["source"] == "history"].index.min(),
        "sampling_error_pass1_vs_all_2026": se_sum,
        "compared": int(len(judged)), "flagged_gt3pp": judged[judged["flag"] == "DIFF>3pp"][
            ["year", "period", "local_hours", "metric", "verified", "br25_pct", "radar_time_share",
             "radar_movement_share", "diff_time_pp", "diff_movement_pp"]].to_dict("records"),
        "diffs": judged[["year", "period", "metric", "verified", "diff_time_pp", "diff_movement_pp"]].to_dict("records"),
        "mean_abs_diff_time_pp": float(judged["diff_time_pp"].abs().mean()) if len(judged) else None,
        "mean_abs_diff_movement_pp": float(judged["diff_movement_pp"].abs().mean()) if len(judged) else None,
        "flagged_gt3pp_all_hours": judged[judged["flag_all"] == "DIFF>3pp"][
            ["year", "period", "metric", "verified", "br25_pct", "all_time_share", "all_movement_share"]
        ].to_dict("records") if "flag_all" in judged else [],
        "gap_rule": GAP_RULE,
        "monthly_2015_2018": {"months_compared": int(len(mon_ok)),
                              "mae_pp": float(mon_ok["diff_pp"].abs().mean()) if len(mon_ok) else None,
                              "mae_all_hours_pp": float(mon_ok["diff_all_pp"].abs().mean()) if len(mon_ok) else None,
                              "max_abs_all_hours_pp": float(mon_ok["diff_all_pp"].abs().max()) if len(mon_ok)
                              else None,
                              "corr_all_hours": float(mon_ok[["radar_br07_time_all", "published_br07"]]
                                                      .corr().iloc[0, 1]) if len(mon_ok) > 2 else None,
                              "corr": float(mon_ok[["radar_br07_time", "published_br07"]].corr().iloc[0, 1])
                              if len(mon_ok) > 2 else None},
        "suspects": sus["status"].value_counts().to_dict() if len(sus) else {},
    }
    if write:
        L.atomic_write(yr, L.OUT / "yearly_shares.csv", index=False, float_format="%.4g")
        L.atomic_write(cmp_, L.OUT / "published_compare.csv", index=False, float_format="%.4g")
        L.atomic_write(mon, L.OUT / "monthly_compare_2015_2018.csv", index=False, float_format="%.4g")
        L.atomic_write(se, L.OUT / "sampling_error_2026.csv", index=False, float_format="%.4g")
        L.atomic_write(mchk, L.OUT / "metar_check.csv", index=False, float_format="%.4g")
        L.write_json(summary, L.OUT / "shares_summary.json")
    return {"yearly": yr, "compare": cmp_, "monthly": mon, "sampling": (se, se_sum), "metar": mchk,
            "summary": summary}


if __name__ == "__main__":
    pd.set_option("display.width", 250)
    pd.set_option("display.max_columns", 40)
    r = main()
    y = r["yearly"]
    print(y[["year", "days_with_pass1", "pass1_hours", "pass1_coverage", "complete_days", "pass1_mean_moves",
             "pass1_share_lt4", "pass1_share_lt15", "pass1_rwy18_judged", "rwy18_closed_all",
             "pass1_time_share_od25", "pass1_movement_share_od25", "all_time_share_od25"]].round(3).to_string(index=False))
    c = r["compare"]
    print(c[["year", "period", "months", "local_hours", "metric", "verified", "br25_pct", "radar_time_share",
             "radar_movement_share", "coverage", "diff_time_pp", "diff_movement_pp", "flag", "status"]]
          .round(2).to_string(index=False))
    print(r["sampling"][1])
    print(r["metar"].round(2).to_string(index=False))
    print(r["summary"]["monthly_2015_2018"])
