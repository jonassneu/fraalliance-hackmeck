"""Single-feature additions / substitutions vs production (OD 25 target)."""
import sys, json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import pandas as pd
from experiments.harness import evaluate, PROD_OD
from fra.dataset import DATA

d = pd.read_parquet(DATA / "ops_feats.parquet")
P = PROD_OD
def sub(a, b): return [b if c == a else c for c in P]
cands = {
    "PRODUCTION": P,
    "+prog_trans": P + ["prog_trans"],
    "+prog_tdir": P + ["prog_tdir"],
    "+prog_signed_trans": P + ["prog_signed_trans"],
    "+prog_rev3": P + ["prog_rev3"],
    "+prog_rev6": P + ["prog_rev6"],
    "sub prog_signed_filled": sub("prog_signed", "prog_signed_filled"),
    "+prog_gap": P + ["prog_gap"],
    "+prog_disagree": P + ["prog_disagree"],
    "+prog_x_now": P + ["prog_x_now"],
    "+prog_chg_before_valid": P + ["prog_chg_before_valid"],
    "+nsw24": P + ["nsw24"],
    "+nsw72": P + ["nsw72"],
    "+h_since_sw": P + ["h_since_sw"],
    "+od_3h_ago": P + ["od_3h_ago"],
    "+od_24h_ago": P + ["od_24h_ago"],
    "+west_share24": P + ["west_share24"],
    "+west_frac_now": P + ["west_frac_now"],
    "+obs_tw25_f": P + ["obs_tw25_f"],
    "+obs_tw25_max3": P + ["obs_tw25_max3"],
    "+obs_tw25_min3": P + ["obs_tw25_min3"],
    "+obs_tw25_trend3": P + ["obs_tw25_trend3"],
    "+tw25_bias": P + ["tw25_bias"],
    "+tw25_bias_dec": P + ["tw25_bias_dec"],
    "sub tw25_corr": sub("tw25", "tw25_corr"),
    "+rule_now_disagree": P + ["rule_now_disagree"],
    "+obs_tw25_x_now": P + ["obs_tw25_x_now"],
    "+od_rule_now": P + ["od_rule_now"],
    "+weekend": P + ["weekend"],
    "+dow": P + ["dow_sin", "dow_cos"],
    "+now_dec3": P + ["now_dec3"],
    "+now_dec12": P + ["now_dec12"],
    "+lead_frac": P + ["lead_frac"],
}
def one(kF):
    return kF[0], evaluate(d, od_features=kF[1], label=kF[0])["od25"]


if __name__ == "__main__":
    from multiprocessing import Pool
    only = sys.argv[1:]
    todo = [(k, F) for k, F in cands.items() if not only or k in only or k == "PRODUCTION"]
    with Pool(8) as pool:
        res = dict(pool.map(one, todo, chunksize=1))
    out = pd.DataFrame(res).T
    base = out.loc["PRODUCTION"]
    delta = (out - base)
    delta[[c for c in out if c.startswith("acc")]] *= 100
    print("\nDELTA vs production (acc in pp, brier abs):")
    print(delta.sort_values("brier_all").round(4).to_string())
    out.to_csv(Path(__file__).parent / "results" / f"results_{len(todo)}.csv")
