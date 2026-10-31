"""Inspect RWY18 closure labels: are 'closed' hours real north-wind events?"""
import sys
from pathlib import Path
import numpy as np, pandas as pd
ROOT = Path(__file__).resolve().parents[2]; sys.path.insert(0, str(ROOT))
from fra.dataset import hourly_metar
pd.set_option("display.width", 250)
c = pd.read_csv(ROOT/"data/inaa_counts.csv", parse_dates=["time"]).drop_duplicates("time", keep="last").set_index("time").sort_index()
c["n"] = c.west + c.east
c["tot"] = c.n + c.rwy18_deps
c["r18"] = c.rwy18_deps / c.tot.replace(0, np.nan)
c["od"] = np.where(c.west >= c.east, 25, 7)
m = hourly_metar()  # index = ceil hour; obs valid for hour ending at index
# obs for hour START t: use METAR at t+1h (end of hour) and t (start)
for k, lag in [("start", 0), ("end", 1)]:
    mm = m.reindex(c.index + pd.Timedelta(hours=lag))
    c[f"dir_{k}"] = mm.wind_direction.values; c[f"spd_{k}"] = mm.wind_speed.values; c[f"gst_{k}"] = mm.wind_gusts.values
    c[f"tw18_{k}"] = mm.tw18.values; c[f"tw18g_{k}"] = mm.tw18_gust.values
busy = c[c.n >= 15]
print("busy hours", len(busy), "closed (rwy18_deps==0):", (busy.rwy18_deps == 0).sum())
print("\nCLOSED HOURS (busy, 0 southbound deps):")
print(busy[busy.rwy18_deps == 0][["west","east","rwy18_deps","od","dir_start","spd_start","gst_start","tw18g_start","dir_end","spd_end","gst_end","tw18g_end"]].to_string())
print("\nLow-usage busy hours (1<=deps<=3):")
print(busy[(busy.rwy18_deps >= 1) & (busy.rwy18_deps <= 3)][["west","east","rwy18_deps","od","dir_end","spd_end","gst_end","tw18g_end","hour" if "hour" in busy else "n"]].to_string())
print("\nr18 ratio by OD (busy):"); print(busy.groupby("od").r18.describe().to_string())
print("\nr18 ratio quantiles busy:", busy.r18.quantile([0, .01, .02, .05, .1, .25, .5]).round(3).to_dict())
print("\nTailwind>=15kt gust hours (busy) and their rwy18 usage:")
tw = busy[(busy.tw18g_end >= 15) | (busy.tw18g_start >= 15)]
print(tw[["west","east","rwy18_deps","od","dir_end","spd_end","gst_end","tw18g_end","tw18g_start","r18"]].to_string())
print("\nTailwind>=10 mean (not gust) hours busy:")
tw2 = busy[(busy.tw18_end >= 10) | (busy.tw18_start >= 10)]
print(tw2[["west","east","rwy18_deps","od","dir_end","spd_end","gst_end","tw18_end","tw18g_end","r18"]].to_string())
# distribution of rwy18_deps by hour of day & OD
busy = busy.assign(hour=busy.index.hour)
print("\nmean deps by hour (busy):"); print(busy.groupby("hour")[["rwy18_deps","n","r18"]].mean().round(2).T.to_string())
print("\nmean r18 by OD and hour:"); print(busy.pivot_table(index="od", columns="hour", values="r18", aggfunc="mean").round(2).to_string())
# north-wind sector hours
nw = busy[(busy.dir_end >= 320) | (busy.dir_end <= 40)]
print("\nnorth sector (320-040) busy hours:", len(nw), " closed:", (nw.rwy18_deps==0).sum(), " mean r18:", nw.r18.mean().round(3))
print(nw.sort_values("spd_end", ascending=False).head(25)[["west","east","rwy18_deps","od","dir_end","spd_end","gst_end","tw18g_end","r18"]].to_string())
print("\ntest period (>=2026-09-15) busy:", (busy.index >= "2026-09-15").sum(), "closed:", ((busy.index >= "2026-09-15") & (busy.rwy18_deps==0)).sum())
