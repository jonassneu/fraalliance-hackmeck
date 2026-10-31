"""Candidate RWY18 features + label variants (issue-time safe). Import: from experiments.rwy18.features import prepare"""
import sys
from pathlib import Path
import numpy as np, pandas as pd
ROOT = Path(__file__).resolve().parents[2]; sys.path.insert(0, str(ROOT))
from experiments.harness import load
from fra import singleruns_icon as icon
from fra.rules import tailwind, crosswind

DATA = ROOT / "data"


def label_variants():
    c = pd.read_csv(DATA / "inaa_counts.csv", parse_dates=["time"]).drop_duplicates("time", keep="last").set_index("time").sort_index()
    n = c.west + c.east
    tot = n + c.rwy18_deps
    r18 = c.rwy18_deps / tot.replace(0, np.nan)
    loc = c.index.tz_convert("Europe/Berlin").hour
    busy = n >= 15
    dep_hour = loc >= 6          # first hour after the night ban (05 local) is the arrival wave: no departures
    out = pd.DataFrame(index=c.index)
    out["v1"] = np.where(busy, (c.rwy18_deps > 0), np.nan)                      # production
    out["v2"] = np.where(busy & dep_hour, (c.rwy18_deps > 0), np.nan)           # exclude post-ban hour
    out["v3"] = np.where(busy & dep_hour, (r18 >= 0.05), np.nan)                # ratio: <5 % of movements = (partly) closed
    out["v4"] = np.where((tot >= 30) & dep_hour, (r18 >= 0.08), np.nan)         # stricter busy + ratio
    out["r18"] = np.where(busy & dep_hour, r18, np.nan)
    return out.astype(float)


def same_run_neighbourhood(d):
    """Gust tailwind on 18 at valid+k from the SAME IFS run (k=-3..3): max / mean windows."""
    r = pd.read_parquet(DATA / "ifs_runs.parquet")
    r["twg"] = tailwind(r.wind_gusts, r.wind_direction, 180)
    r["tw"] = tailwind(r.wind_speed, r.wind_direction, 180)
    r["xwg"] = crosswind(r.wind_gusts, r.wind_direction, 180)
    s = r.set_index(["init", "valid"])
    key = pd.MultiIndex.from_arrays([d.run_init, d.valid])
    cols = {}
    for k in range(-3, 4):
        kk = pd.MultiIndex.from_arrays([d.run_init, d.valid + pd.Timedelta(hours=k)])
        cols[k] = s["twg"].reindex(kk).to_numpy()
    M = np.column_stack([cols[k] for k in range(-3, 4)])
    d["tw18g_max3"] = np.nanmax(M[:, 2:5], axis=1)          # valid-1..valid+1
    d["tw18g_max7"] = np.nanmax(M, axis=1)                  # valid-3..valid+3
    d["tw18g_mean3"] = np.nanmean(M[:, 2:5], axis=1)
    d["tw18g_prev3"] = cols[-3]; d["tw18g_next3"] = cols[3]
    return d


def icon_features(d):
    issues = pd.DatetimeIndex(sorted(d.issue.unique()))
    leads = sorted(d.lead.unique())
    runs = pd.read_parquet(icon.ARCHIVE)
    f = icon._features(runs, issues, leads)[["issue", "lead", "icon_tw18"]]
    g = runs.copy(); g["wind_speed"] = g["wind_gusts"]      # gust tailwind via the same as-of logic
    fg = icon._features(g, issues, leads)[["issue", "lead", "icon_tw18"]].rename(columns={"icon_tw18": "icon_tw18_gust"})
    d = d.merge(f, on=["issue", "lead"], how="left").merge(fg, on=["issue", "lead"], how="left")
    d["tw18_cons"] = d[["tw18", "icon_tw18"]].mean(axis=1)                       # falls back to ECMWF alone
    d["tw18g_cons"] = d[["tw18_gust", "icon_tw18_gust"]].mean(axis=1)
    d["tw18g_maxmod"] = d[["tw18_gust", "icon_tw18_gust"]].max(axis=1)
    return d


def prepare(refresh=False):
    d = load(refresh=refresh).copy()
    lab = label_variants()
    for v in ["v1", "v2", "v3", "v4", "r18"]:
        d[f"lab_{v}"] = lab[v].reindex(d["valid"]).values
    # issue-time state under each label variant (last flown hour = issue-1h), NaN -> 1 (open) like production
    known = d["issue"] - pd.Timedelta(hours=1)
    for v in ["v2", "v3"]:
        d[f"now_{v}"] = lab[v].reindex(known).fillna(1).values
    d = same_run_neighbourhood(d)
    d = icon_features(d)
    # simple engineered extras
    d["tw18_100m_f"] = d["tw18_100m"].fillna(d["tw18"])
    d["north"] = ((d.wind_direction >= 330) | (d.wind_direction <= 30)).astype(float)
    d["ne"] = ((d.wind_direction >= 350) | (d.wind_direction <= 90)).astype(float)
    d["tw18g_ne"] = d["tw18_gust"] * d["ne"]
    d["tw18g_pos"] = d["tw18_gust"].clip(lower=0)
    d["tw18g_ge10"] = (d["tw18_gust"] >= 10).astype(float)
    d["tw18g_ge12"] = (d["tw18_gust"] >= 12).astype(float)
    d["xw18_rule"] = (d["xw18_gust"] > 40).astype(float)
    d["tw18_od07"] = d["tw18_gust"] * (1 - d["od_now25"])
    d["tw18_x_tw25"] = d["tw18_gust"] * (d["tw25"] > 1).astype(float)          # forecast OD 07 x tailwind on 18
    return d


if __name__ == "__main__":
    d = prepare()
    for v in ["v1", "v2", "v3", "v4"]:
        t = d[d[f"lab_{v}"].notna()]
        print(v, "rows", len(t), "closed", int((t[f"lab_{v}"] == 0).sum()), "closed valid hours", t.loc[t[f"lab_{v}"] == 0, "valid"].nunique(),
              "| test(>=09-15) rows", int((t.issue >= "2026-09-15").sum()), "closed", int(((t.issue >= "2026-09-15") & (t[f"lab_{v}"] == 0)).sum()))
    print(d[["icon_tw18", "icon_tw18_gust", "tw18g_max3", "tw18g_max7", "tw18_100m"]].describe().round(2).to_string())
    print("closed hours v3:"); t = d[d.lab_v3 == 0].drop_duplicates("valid"); print(t[["valid", "lab_v2", "lab_r18"]].to_string())
    d.to_parquet(DATA / "rwy18_cache.parquet")
