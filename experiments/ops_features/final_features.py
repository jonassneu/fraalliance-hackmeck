"""Drop-in versions of the recommended features (for fra/dataset.py build + fra/predict.py live).
d: feature frame with columns issue, valid, lead, od_now (flown OD of hour [issue-1h, issue)), night (valid local 23-05)."""
import numpy as np
import pandas as pd

NIGHT = [23, 0, 1, 2, 3, 4]


def add_ops_features(d, metar_hourly, prog_archive):
    """metar_hourly = fra.dataset.hourly_metar(); prog_archive = rows of data/prognosis.parquet (asof == issue used)."""
    now = 2 * (d["od_now"] == 25).astype(float) - 1
    # 1) night reset: labels carry the evening OD through the night ban -> morning OD is re-decided
    known_local = pd.DatetimeIndex(d["issue"] - pd.Timedelta(hours=1)).tz_convert("Europe/Berlin").hour
    valid_night = pd.DatetimeIndex(d["valid"]).tz_convert("Europe/Berlin").hour.isin(NIGHT)
    d["now_reset"] = 3 * now * (np.isin(known_local, NIGHT) & ~valid_night)
    # 2) official rule on the latest METAR disagrees with the flown OD (short leads only), signed to the rule's OD
    obs = metar_hourly["tw25"].ffill(limit=3).reindex(d["issue"]).values
    rule = np.where(obs > 1, -1, np.where(obs < -1, 1, now))
    d["rule_now_disagree_s"] = 3 * (rule != now) * rule * (d["lead"] <= 3)
    # 3) published prognosis block containing valid is a transition state (12/21/13/31/23/32)
    p = prog_archive[(prog_archive["kind"] == "main") & prog_archive["state"].ne("0")]
    m = pd.merge_asof(d[["issue", "valid"]].reset_index().sort_values("valid"),
                      p[["asof", "start", "state"]].rename(columns={"asof": "issue"}).sort_values("start"),
                      left_on="valid", right_on="start", by="issue", direction="backward").set_index("index")
    inblock = m["valid"] < m["start"] + pd.Timedelta(hours=8)
    d["prog_trans3"] = 3 * (inblock & (m["state"].str.len() == 2)).reindex(d.index).fillna(False).astype(float)
    return d


if __name__ == "__main__":  # consistency check vs the experiment columns
    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
    from fra.dataset import DATA, hourly_metar
    d = pd.read_parquet(DATA / "ops_feats.parquet")
    e = add_ops_features(d[["issue", "valid", "lead", "od_now", "night"]].copy(), hourly_metar(),
                         pd.read_parquet(DATA / "prognosis.parquet"))
    for a, b in [("now_reset", "now_reset"), ("rule_now_disagree_s", "rule_now_disagree_s"), ("prog_trans3", "prog_trans")]:
        print(a, "max abs diff vs experiment:", float(np.abs(e[a].values - 3 * d[b].fillna(0).values).max()))
