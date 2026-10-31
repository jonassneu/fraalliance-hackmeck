"""Usage: uv run python -m experiments.weather_features.run round1  -> evaluates single-feature additions in parallel."""
import os
for _v in ["OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"]:
    os.environ[_v] = "1"
import sys
import warnings
from multiprocessing import Pool

import pandas as pd

warnings.filterwarnings("ignore")
from experiments.harness import PROD_OD, ROOT, evaluate  # noqa: E402

D = None


def init():
    global D
    D = pd.read_parquet(ROOT / "data" / "weather_feats.parquet")


def job(spec):
    label, F = spec
    import io, contextlib
    with contextlib.redirect_stdout(io.StringIO()):
        r = evaluate(D, od_features=F, label=label)["od25"]
    return label, r


SETS = {
    "round1": [("PROD", PROD_OD)] + [(f"+{c}", PROD_OD + [c]) for c in [
        "tw25_prevrun", "tw25_rev", "tw25_absrev", "tw25_lagmean", "tw25_lagstd", "ec_icon_diff", "ec_icon_absdiff",
        "shear_tw25", "tw25_gust", "xw25_signed", "tw25_sig1.5", "tw25_sig3.0", "tw25_sig_ec", "tw25_pos", "tw25_neg",
        "tw25_ge10", "tw07_ge10", "tw25_fut6", "tw25_past6", "tw25_pastmax6", "tw25_pastmin6", "frac_tw_pos_past6",
        "tw25_fut12", "tw25_past12", "tw25_pastmax12", "tw25_pastmin12", "frac_tw_pos_past12", "dp6", "p_anom",
        "east_regime", "ne_regime", "calm", "u", "vv", "cape_log", "precip_log", "ws_ratio100", "inv_night",
        "tw25_over_unc", "tw25_x_lead", "calm_x_tw", "wind_speed", "temperature", "cloud_cover"]],
}
P = PROD_OD
SETS["round2"] = [("PROD", P)] + [(f"+{c}", P + [c]) for c in [
    "xw25_100m_signed", "xw25_roll6", "xw25_fut12", "icon_xw25", "xw25_cons", "obs_xw25", "obs_xw25_x_short",
    "north", "xw25_pos", "xw25_neg", "xw_x_tw", "xw_abs"]] + [
    ("+xw+u", P + ["xw25_signed", "u"]),
    ("+xw+fut12", P + ["xw25_signed", "tw25_fut12"]),
    ("+xw+pastmin6", P + ["xw25_signed", "tw25_pastmin6"]),
    ("+xw+fut12+pastmin6", P + ["xw25_signed", "tw25_fut12", "tw25_pastmin6"]),
    ("+xwcons+fut12+pastmin6", P + ["xw25_cons", "tw25_fut12", "tw25_pastmin6"]),
    ("+xwroll6+fut12+pastmin6", P + ["xw25_roll6", "tw25_fut12", "tw25_pastmin6"]),
    ("+xw+obsxw+fut12+pastmin6", P + ["xw25_signed", "obs_xw25", "tw25_fut12", "tw25_pastmin6"]),
    ("+xw+fut12+pastmin6+calm", P + ["xw25_signed", "tw25_fut12", "tw25_pastmin6", "calm"]),
    ("+xw+fut12+pastmin6+shear", P + ["xw25_signed", "tw25_fut12", "tw25_pastmin6", "shear_tw25"]),
    ("+xw+fut12+pastmin6+rev", P + ["xw25_signed", "tw25_fut12", "tw25_pastmin6", "tw25_rev"]),
    ("+xw+fut12+pastmin6+pos", P + ["xw25_signed", "tw25_fut12", "tw25_pastmin6", "tw25_pos"]),
    ("+xw+fut12+pastmin6+lagstd", P + ["xw25_signed", "tw25_fut12", "tw25_pastmin6", "tw25_lagstd"]),
    ("+xw+fut12+pastmin6+ecicon", P + ["xw25_signed", "tw25_fut12", "tw25_pastmin6", "ec_icon_diff"]),
    ("+u+vv", P + ["u", "vv"]),
    ("+u+vv+fut12+pastmin6", P + ["u", "vv", "tw25_fut12", "tw25_pastmin6"]),
]
XF = ["xw25_fut12", "tw25_fut12", "tw25_pastmin6"]
SETS["round3"] = [("PROD", P), ("+xwfut12", P + ["xw25_fut12"])] + [(f"+{c}", P + [c]) for c in [
    "xw25_w0_6", "xw25_w0_18", "xw25_w0_24", "xw25_w-6_6", "xw25_w-12_0", "xw25_w6_18", "xw25_w-12_12", "xw100_fut12",
    "tw25_w0_18", "tw25_w0_24", "tw25_w6_18", "tw25_100_fut12", "xw25_fut12_prevrun", "xw25_fut12_lag"]] + [
    ("+XF", P + XF),
    ("+XF+xw", P + XF + ["xw25_signed"]),
    ("+XF+shear", P + XF + ["shear_tw25"]),
    ("+XF+rev", P + XF + ["tw25_rev"]),
    ("+XF+lagstd", P + XF + ["tw25_lagstd"]),
    ("+XF+xw+shear+rev", P + XF + ["xw25_signed", "shear_tw25", "tw25_rev"]),
    ("+XF+xw+shear+rev+lagstd+ecicon", P + XF + ["xw25_signed", "shear_tw25", "tw25_rev", "tw25_lagstd", "ec_icon_diff"]),
    ("+xwfut12+xw-12_0", P + ["xw25_fut12", "xw25_w-12_0"]),
    ("+xwfut24+tw24+pastmin6", P + ["xw25_w0_24", "tw25_w0_24", "tw25_pastmin6"]),
    ("+xwlag+XF-", P + ["xw25_fut12_lag", "tw25_fut12", "tw25_pastmin6"]),
]
SETS["final"] = [("PROD", P),
    ("A +pastmin6", P + ["tw25_pastmin6"]),
    ("B +pastmin6+xwf_east_tanh", P + ["tw25_pastmin6", "xwf_east_tanh"]),
    ("C +B+shear+rev", P + ["tw25_pastmin6", "xwf_east_tanh", "shear_tw25", "tw25_rev"]),
    ("D +C+ec_icon_diff", P + ["tw25_pastmin6", "xwf_east_tanh", "shear_tw25", "tw25_rev", "ec_icon_diff"]),
    ("E +pastmin6+shear+rev", P + ["tw25_pastmin6", "shear_tw25", "tw25_rev"]),
    ("F +xwf_east_tanh", P + ["xwf_east_tanh"]),
    ("G +C+tw25_fut12", P + ["tw25_pastmin6", "xwf_east_tanh", "shear_tw25", "tw25_rev", "tw25_fut12"]),
    ("H +C+lagstd", P + ["tw25_pastmin6", "xwf_east_tanh", "shear_tw25", "tw25_rev", "tw25_lagstd"]),
]

if __name__ == "__main__":
    specs = SETS[sys.argv[1]] if sys.argv[1] in SETS else eval(sys.argv[1])
    with Pool(min(len(specs), 8), initializer=init) as p:
        res = p.map(job, specs, chunksize=1)
    base = dict(res).get("PROD")
    rows = []
    for label, r in res:
        rows.append({"label": label, **r})
    t = pd.DataFrame(rows).set_index("label")
    if base:
        t["dBrier"] = t["brier_1_6_24_48"] - base["brier_1_6_24_48"]
        t["dBrierAll"] = t["brier_all"] - base["brier_all"]
    t = t.sort_values("brier_all")
    pd.set_option("display.width", 200)
    print(t.round(4).to_string())
    t.to_csv(ROOT / "experiments" / "weather_features" / "results" / f"res_{sys.argv[1][:20].replace('/', '_')}.csv")
