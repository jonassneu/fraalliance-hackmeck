"""Gust and wind-aloft feature candidates for the RWY 18 model (single additions to the production feature set)."""
import os
for _v in ["OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"]:
    os.environ[_v] = "1"
import io, contextlib, warnings
from multiprocessing import Pool
import numpy as np
import pandas as pd
warnings.filterwarnings("ignore")
from experiments.harness import PROD_18, ROOT, evaluate
from experiments.weather_features.feats import _ifs, _lookup
from fra.rules import tailwind

D = None


def build():
    d = pd.read_parquet(ROOT / "data" / "weather_feats.parquet")
    r = _ifs()
    r["tw18g"] = tailwind(r.wind_gusts, r.wind_direction, 180)
    r["tw18"] = tailwind(r.wind_speed, r.wind_direction, 180)
    ri, v = d.run_init, d.valid
    d["tw18g_max3"] = np.nanmax(np.vstack([_lookup(r, "tw18g", ri, v + pd.Timedelta(hours=h)) for h in (-1, 0, 1)]), axis=0)
    d["tw18g_prevrun"] = _lookup(r, "tw18g", ri - pd.Timedelta(hours=6), v)
    d["tw18g_lagmax"] = np.fmax(d["tw18_gust"], d["tw18g_prevrun"])
    d["tw18g_excess"] = (d["tw18_gust"] - 10).clip(lower=0)
    d["tw18g_sig"] = 1 / (1 + np.exp(-(d["tw18_gust"] - 15) / 3))
    d["gust_spread"] = d["wind_gusts"] - d["wind_speed"]
    return d


def init():
    global D
    D = build()


def job(spec):
    label, F = spec
    with contextlib.redirect_stdout(io.StringIO()):
        return label, evaluate(D, rwy18_features=F, label=label)["rwy18"]


if __name__ == "__main__":
    P = PROD_18
    specs = [("PROD", P)] + [(f"+{c}", P + [c]) for c in ["tw18g_max3", "tw18g_lagmax", "tw18g_excess", "tw18g_sig",
             "gust_spread", "tw18_100m", "xw18_gust", "wind_gusts", "tw18_m2", "cape_log", "precip_log", "shear_tw25"]]
    with Pool(8, initializer=init) as p:
        res = p.map(job, specs, chunksize=1)
    t = pd.DataFrame([{"label": l, **r} for l, r in res]).set_index("label")
    t["dBrierAll"] = t.brier_all - t.loc["PROD", "brier_all"]
    print(t.sort_values("brier_all").round(4).to_string())
