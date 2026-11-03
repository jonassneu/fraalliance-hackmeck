"""Task 3 of wave 3: the confirmed suspect hours of the 12-year radar backfill. Which of them are real gaps, which are
valid low-traffic hours (COVID, first hour after the night ban), and what does the gap rule do to the yearly shares
and the Part A training rows?

    uv run python experiments/history12/suspects.py

Background: fra.history re-fetches a daytime hour (local 06-21) with < 10 classified movements or < 40 % of the
same-day median (>= 2 other hours, median >= 30) after >= 30 min and marks it 'confirmed' when the second answer is
still low. Until 2026-11-03 every confirmed hour was a label gap (fra.labels.history_gaps, rule 'confirmed'). The
rule 'traffic' (fra.labels.GAP_RULE, now the default; coded after the pre-registered wave-3 run had printed its primary
result, so wave-3 results under it are a post-hoc sensitivity) keeps a confirmed hour as a gap only if it is also below
40 % of the median of the same local hour on the 7 days before and after (same day excluded).

Checks:
  * reproducibility: first and second answer of every confirmed hour (movements, KML placemarks);
  * the old rule applied to the forward file (data/inaa_counts.csv, no suspect rule, used by the live labels);
  * per confirmed hour: movements, same-day median, same-hour median of the surrounding days, ratio, class
      no_label (< 4 west+east movements: no OD label under any rule), gap (still a gap), readmitted (valid OD hour);
  * OD selectivity of the old rule (06-local hours dropped vs. kept), RWY 18 behaviour of the re-admitted hours;
  * effects of the rule: yearly OD 25 shares (pass-1 and all hours), the published 2020/2021 figures, Part A
    training rows per year (fra.decision.transitions on run.history_labels).

Outputs (experiments/history12/): suspects_hours.csv, suspects_by_year.csv, suspects_by_month_covid.csv,
suspects_by_local_hour.csv, suspects_shares.csv, suspects_rows.csv, suspects_summary.json.
"""

import json

import numpy as np
import pandas as pd

import h12lib as L
from fra import decision as D  # noqa: E402
from fra.labels import GAP_REL, history_gaps, load_counts, same_hour_reference  # noqa: E402

COVID = D.COVID
HOLDOUT = pd.Timestamp("2026-11-01", tz="UTC")


def suspect_table():
    p = L.DATA / "logs" / "history_suspect.json"
    s = json.loads(p.read_text())
    d = pd.DataFrame([{"end": k, **v} for k, v in s.items()])
    d["time"] = pd.to_datetime(d["end"], utc=True) - pd.Timedelta(hours=1)
    return d.set_index("time").sort_index()


def old_rule_on_forward():
    """fra.history.is_suspect (same-day reference) applied to the forward file's daytime hours (< holdout)."""
    from fra import history as Hm
    f = load_counts()
    f = f[f.index < HOLDOUT]
    n = (f["west"] + f["east"] + f["rwy18_deps"]).astype(int)
    day_n = Hm._day_moves(f)
    rows = []
    for t, v in n[Hm._daytime_mask(n.index)].items():
        ref = Hm._ref(day_n, t)
        rows.append({"time": t, "n": int(v), "ref": ref, "suspect": bool(Hm.is_suspect(t, v, ref))})
    d = pd.DataFrame(rows).set_index("time")
    d["local_hour"] = d.index.tz_convert(L.TZ).hour
    allc = load_counts(include_history=True, complete_only=False)
    d["ref_same_hour"] = same_hour_reference(allc[allc.index < HOLDOUT], d.index)
    d["still_low"] = d["n"] < GAP_REL * d["ref_same_hour"]
    return d


def hours():
    s = suspect_table()
    c = s[s["status"] == "confirmed"].copy()
    allc = load_counts(include_history=True, complete_only=False)
    cc = allc.reindex(c.index)
    c["west"], c["east"], c["rwy18_deps"] = cc["west"], cc["east"], cc["rwy18_deps"]
    c["n_od"] = c["west"] + c["east"]
    c["n_all"] = c["n_od"] + c["rwy18_deps"]
    c["ref_same_hour"] = same_hour_reference(allc, c.index)
    c["ratio"] = c["n_all"] / c["ref_same_hour"]
    gaps = history_gaps("traffic")
    c["cls"] = np.where(c["n_od"] < L.MIN_MOVES, "no_label", np.where(c.index.isin(gaps), "gap", "readmitted"))
    c["traffic_gap"] = c.index.isin(gaps)
    c["old_reason"] = np.where(c["n_all"] < 10, "abs<10", "rel<40%")
    loc = c.index.tz_convert(L.TZ)
    c["local_hour"], c["year"], c["month"] = loc.hour, c.index.year, c.index.month
    c["covid"] = (c.index >= COVID[0]) & (c.index < COVID[1])
    c["od"] = np.where(c["n_od"] >= L.MIN_MOVES, np.where(c["west"] >= c["east"], 25.0, 7.0), np.nan)
    c["judgeable18"] = (c["n_od"] >= L.BUSY) & (c["local_hour"] >= 6)
    c["closed18"] = np.where(c["judgeable18"], (c["rwy18_deps"] == 0).astype(float), np.nan)
    return s, c


def by(c, keys):
    c = c.assign(_nl=(c["cls"] == "no_label").astype(int), _gap=c["traffic_gap"].astype(int),
                 _ra=(c["cls"] == "readmitted").astype(int),
                 _ra10=((c["cls"] == "readmitted") & (c["n_all"] < 10)).astype(int),
                 _ra6=((c["cls"] == "readmitted") & (c["local_hour"] == 6)).astype(int))
    g = c.groupby(keys)
    out = pd.DataFrame({
        "confirmed": g.size(), "no_label_lt4": g["_nl"].sum(), "gap_traffic_rule": g["_gap"].sum(),
        "readmitted_od_hours": g["_ra"].sum(), "readmitted_abs_lt10": g["_ra10"].sum(),
        "readmitted_local06": g["_ra6"].sum(),
        "median_moves": g["n_all"].median(), "median_ratio_same_hour": g["ratio"].median(),
    })
    return out.reset_index()


def share_effects():
    """Yearly OD 25 time / movement shares (pass-1 and all daytime hours, 05-23 local) under both gap rules."""
    import shares as S
    rows = []
    tabs = {r: L.hour_table(with_wind=False, gap_rule=r) for r in ("confirmed", "traffic")}
    for rule, t in tabs.items():
        t = t[t.index < HOLDOUT]
        for y in sorted(t["year"].unique()):
            g = t[(t["year"] == y) & S._local_ok(t, "05-23")]
            e1, ea = S.estimate(g[g["pass1"]]), S.estimate(g)
            rows.append({"rule": rule, "year": y, "pass1_hours": e1["n_hours"], "pass1_time": e1["time_share"],
                         "pass1_mv": e1["movement_share"], "all_hours": ea["n_hours"], "all_time": ea["time_share"],
                         "all_mv": ea["movement_share"]})
        # published 6vM 2020 (Jan-Mar + Aug-Oct) and 2021 (Jul-Dec), 06-22 local; city full year 2021
        for y, months, name in ((2020, [1, 2, 3, 8, 9, 10], "6vM 2020 (79.6)"), (2021, list(range(7, 13)),
                                                                                  "6vM 2021 (69.6)"),
                                (2021, list(range(1, 13)), "full year 2021 (67, unverified)")):
            g = t[(t["year"] == y) & t["month"].isin(months) & S._local_ok(t, "06-22")]
            e1, ea = S.estimate(g[g["pass1"]]), S.estimate(g)
            rows.append({"rule": rule, "year": name, "pass1_hours": e1["n_hours"], "pass1_time": e1["time_share"],
                         "pass1_mv": e1["movement_share"], "all_hours": ea["n_hours"], "all_time": ea["time_share"],
                         "all_mv": ea["movement_share"]})
    d = pd.DataFrame(rows)
    w = d.pivot(index="year", columns="rule")
    w.columns = [f"{a}_{b}" for a, b in w.columns]
    for k in ("pass1_hours", "pass1_time", "pass1_mv", "all_hours", "all_time", "all_mv"):
        w[f"{k}_diff"] = w[f"{k}_traffic"] - w[f"{k}_confirmed"]
    w = w.reset_index()
    w["year"] = w["year"].astype(str)
    return w


def row_effects():
    """Part A training rows (fra.decision.transitions of run.history_labels) per year under both gap rules."""
    import run as R
    obs = D.load_obs()
    out = {}
    for rule in ("confirmed", "traffic"):
        lab = R.history_labels(rule)
        r = D.transitions(D.features(obs, lab))
        r = r[r.index < HOLDOUT]
        r = r.assign(_sw=(r["stay"] == 0).astype(int), _p7=(r["od_prev"] == 7).astype(int),
                     _sw7=((r["od_prev"] == 7) & (r["stay"] == 0)).astype(int),
                     _mo=(r["kind"] == "morning").astype(int))
        g = r.groupby(r.index.year)
        lab = lab[lab.index < HOLDOUT]
        out[rule] = pd.DataFrame({"observed_hours": lab["west_frac"].notna().groupby(lab.index.year).sum(),
                                  "rows": g.size(), "switches": g["_sw"].sum(), "rows_prev07": g["_p7"].sum(),
                                  "switches_prev07": g["_sw7"].sum(), "morning_rows": g["_mo"].sum()})
    w = out["confirmed"].join(out["traffic"], suffixes=("_confirmed", "_traffic")).fillna(0)
    for k in ("observed_hours", "rows", "switches", "rows_prev07", "switches_prev07", "morning_rows"):
        w[f"{k}_diff"] = w[f"{k}_traffic"] - w[f"{k}_confirmed"]
    w = w.astype(int).reset_index(names="year")
    tot = w.drop(columns="year").sum()
    w = pd.concat([w, pd.DataFrame([{"year": "all", **tot.to_dict()}])], ignore_index=True)
    return w


def rwy18_check(c):
    """Re-admitted, judgeable hours: share without a RWY 18 departure under OD 25, vs. kept judged hours of the same
    local hour outside the COVID window (all fetched hours < 2026-11-01)."""
    t = L.hour_table(with_wind=False, gap_rule="traffic")
    t = t[(t.index < HOLDOUT) & ~((t.index >= COVID[0]) & (t.index < COVID[1]))]
    t = t[(t["n"] >= L.BUSY) & (t["local_hour"] >= 6) & (t["od"] == 25)]
    t["closed"] = (t["rwy18_deps"] == 0).astype(float)
    rows = []
    for lh in (6, "other"):
        m = (t["local_hour"] == 6) if lh == 6 else (t["local_hour"] != 6)
        for grp, mm in (("kept (never suspect)", ~t["confirmed"]), ("readmitted", t["confirmed"] & ~t["gap"])):
            g = t[m & mm]
            rows.append({"local_hour": str(lh), "group": grp, "judged_od25": len(g),
                         "no_rwy18_dep": int(g["closed"].sum()),
                         "rate": g["closed"].mean() if len(g) else np.nan,
                         "median_moves": float(g["n"].median()) if len(g) else np.nan})
    return pd.DataFrame(rows)


def main(write=True):
    s, c = hours()
    fwd = old_rule_on_forward()
    yr = by(c, "year")
    mon = by(c[(c["year"] >= 2020) & (c["year"] <= 2021)], ["year", "month"])
    lh = by(c, "local_hour")
    sh = share_effects()
    rows = row_effects()
    r18 = rwy18_check(c)
    l6 = L.hour_table(with_wind=False, gap_rule="confirmed")
    l6 = l6[(l6["local_hour"] == 6) & (l6["source"] == "history") & (l6["n"] >= L.MIN_MOVES)]
    l6 = l6.assign(od_raw=np.where(l6["west"] >= l6["east"], 25.0, 7.0))     # flown OD whatever the gap flag
    sel = l6.groupby("confirmed").agg(hours=("od_raw", "size"),
                                      od25_share=("od_raw", lambda x: float((x == 25).mean())),
                                      median_moves=("n", "median"))
    ra = c[c["cls"] == "readmitted"]
    sel_all = {"readmitted_od25_share": float((ra["od"] == 25).mean()),
               "kept_history_od25_share_same_local_hours": float(
                   (l6["od_raw"][~l6["confirmed"]] == 25).mean())}
    cov = c[c["covid"]]
    summ = {
        "built_at": pd.Timestamp.now(tz="UTC").isoformat(),
        "statuses": s["status"].value_counts().to_dict(),
        "confirmed": int(len(c)),
        "reproducible_counts": {"n1_eq_n2": int((c["n1"] == c["n2"]).sum()),
                                "placemarks_equal_where_both_known": int((c["placemarks1"] == c["placemarks2"]).sum()),
                                "placemarks_both_known": int((c["placemarks1"].notna()
                                                              & c["placemarks2"].notna()).sum())},
        "classes": c["cls"].value_counts().to_dict(),
        "old_reason": c["old_reason"].value_counts().to_dict(),
        "readmitted_local06": int(((c["cls"] == "readmitted") & (c["local_hour"] == 6)).sum()),
        "readmitted_covid": int(((c["cls"] == "readmitted") & c["covid"]).sum()),
        "covid_window": {"confirmed": int(len(cov)), "readmitted": int((cov["cls"] == "readmitted").sum()),
                         "readmitted_lt10_moves": int(((cov["cls"] == "readmitted") & (cov["n_all"] < 10)).sum()),
                         "gap": int((cov["cls"] == "gap").sum()), "no_label": int((cov["cls"] == "no_label").sum())},
        "forward_file_old_rule": {"daytime_hours": int(len(fwd)), "flagged": int(fwd["suspect"].sum()),
                                  "flagged_local06": int((fwd["suspect"] & (fwd["local_hour"] == 6)).sum()),
                                  "flagged_still_low_same_hour": int((fwd["suspect"] & fwd["still_low"]).sum()),
                                  "flagged_hours": fwd[fwd["suspect"]].reset_index()[["time", "n", "ref",
                                                                                     "ref_same_hour"]]
                                  .to_dict("records"),
                                  "median_moves_by_local_hour": fwd.groupby("local_hour")["n"].median().to_dict()},
        "local06_od_selectivity_old_rule": sel.reset_index().to_dict("records"),
        "readmitted_od_selectivity": sel_all,
        "rwy18_readmitted_vs_kept_od25": r18.to_dict("records"),
        "rows_total": rows[rows["year"] == "all"].iloc[0].to_dict(),
    }
    if write:
        L.atomic_write(c.reset_index()[["time", "west", "east", "rwy18_deps", "n_all", "n1", "n2", "placemarks1",
                                        "placemarks2", "ref2", "ref_same_hour", "ratio", "old_reason", "cls",
                                        "local_hour", "covid", "od", "judgeable18", "closed18", "source"]],
                       L.OUT / "suspects_hours.csv", index=False, float_format="%.4g")
        L.atomic_write(yr, L.OUT / "suspects_by_year.csv", index=False, float_format="%.4g")
        L.atomic_write(mon, L.OUT / "suspects_by_month_covid.csv", index=False, float_format="%.4g")
        L.atomic_write(lh, L.OUT / "suspects_by_local_hour.csv", index=False, float_format="%.4g")
        L.atomic_write(sh, L.OUT / "suspects_shares.csv", index=False, float_format="%.4g")
        L.atomic_write(rows, L.OUT / "suspects_rows.csv", index=False)
        L.write_json(summ, L.OUT / "suspects_summary.json")
    return {"hours": c, "by_year": yr, "by_month": mon, "by_local_hour": lh, "shares": sh, "rows": rows,
            "rwy18": r18, "summary": summ, "forward": fwd}


if __name__ == "__main__":
    pd.set_option("display.width", 250)
    pd.set_option("display.max_columns", 50)
    r = main()
    s = r["summary"]
    print({k: v for k, v in s.items() if k not in ("forward_file_old_rule",)})
    print({k: v for k, v in s["forward_file_old_rule"].items() if k != "flagged_hours"})
    print(r["by_year"].round(2).to_string(index=False))
    print(r["by_month"].round(2).to_string(index=False))
    print(r["by_local_hour"].round(2).to_string(index=False))
    print(r["shares"].round(2).to_string(index=False))
    print(r["rows"].to_string(index=False))
    print(r["rwy18"].round(4).to_string(index=False))
