"""Shared walk-forward harness for feature/model experiments (mirrors fra.train production exactly).

Usage:
    from experiments.harness import load, evaluate, PROD_OD, PROD_18
    d = load()                                   # cached feature table (all production columns + labels)
    d["my_feat"] = ...                           # add candidate columns (must use only info known at issue time!)
    evaluate(d, od_features=PROD_OD + ["my_feat"])
    evaluate(d, od_model=my_fit_predict)         # custom model: fn(train_df, y_train, test_df) -> p(OD 25)

Rules: walk-forward by week from 2026-09-15; each week is predicted by a model trained only on rows with
valid < first issue time of that week. Report = accuracy at leads 1/6/24/48 + Brier (1/6/24/48 and all leads).
Production OD model: logistic regression C=0.03, separate weights per lead bucket, last 120 days of training data.
"""

import sys
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from fra import train as T  # noqa: E402
from fra.dataset import DATA, build, hourly_metar, load_labels  # noqa: E402

CACHE = DATA / "wf_cache.parquet"
PROD_OD = list(T.LOGIT["od25"])
PROD_18 = list(T.LOGIT["rwy18"])
START = pd.Timestamp("2026-09-15", tz="UTC")


def load(refresh=False):
    """Production feature table incl. labels (od, rwy18_open) and baselines; cached."""
    if CACHE.exists() and not refresh:
        return pd.read_parquet(CACHE)
    fc = pd.read_parquet(DATA / "forecasts.parquet")
    lab, _ = load_labels()
    d = T.add_rule_features(build(fc, lab, hourly_metar()))
    b = T.baselines(d)
    d["base_prognosis_od25"] = b["od25"]["prognosis"]
    d.to_parquet(CACHE)
    return d


def design(z, F, buckets=T.BUCKETS):
    base = z[F].fillna(0).astype(float)
    cols = {}
    for lo, hi in buckets:
        m = ((z["lead"] >= lo) & (z["lead"] <= hi)).astype(float).values
        cols[f"b{lo}"] = m
        for c in F:
            cols[f"{c}_{lo}"] = base[c].values * m
    return pd.DataFrame(cols, index=z.index)


def logit_model(F, C=0.03, window=120, buckets=T.BUCKETS):
    def fp(tr, y, te):
        keep = (tr["valid"] >= tr["valid"].max() - pd.Timedelta(days=window)).values if window else np.ones(len(tr), bool)
        m = LogisticRegression(C=C, max_iter=4000, fit_intercept=False).fit(design(tr[keep], F, buckets), y[keep])
        return m.predict_proba(design(te, F, buckets))[:, 1]
    return fp


def walk_forward(d, target, fit_predict):
    col = "od" if target == "od25" else "rwy18_open"
    z = d[d[col].notna()].reset_index(drop=True)
    y = ((z["od"] == 25) if target == "od25" else z["rwy18_open"]).astype(int).values
    wk = ((z["issue"] - START).dt.days // 7).values
    p = np.full(len(z), np.nan)
    for w in np.unique(wk[wk >= 0]):
        te = wk == w
        tr = (z["valid"] < z["issue"][te].min()).values
        if len(np.unique(y[tr])) < 2:
            continue
        p[te] = fit_predict(z[tr], y[tr], z[te])
    ok = (wk >= 0) & ~np.isnan(p)
    return z, y, p, ok


def evaluate(d, od_features=None, od_model=None, rwy18_features=None, rwy18_model=None, label="", show_baselines=False):
    """Prints and returns metrics. Pass features (production logistic) or a custom fit_predict."""
    out = {}
    for target, F, M, prod in [("od25", od_features, od_model, PROD_OD), ("rwy18", rwy18_features, rwy18_model, PROD_18)]:
        if F is None and M is None:
            continue
        if M is None:
            M = logit_model(F, C=0.03 if target == "od25" else 1.0, window=120 if target == "od25" else None)
        z, y, p, ok = walk_forward(d, target, M)
        r = {}
        for L in [1, 6, 24, 48]:
            m = ok & (z["lead"] == L).values
            r[f"acc{L}"] = float(((p[m] > 0.5) == y[m]).mean())
        m4 = ok & z["lead"].isin([1, 6, 24, 48]).values
        r["brier_1_6_24_48"] = float(np.mean((p[m4] - y[m4]) ** 2))
        r["brier_all"] = float(np.mean((p[ok] - y[ok]) ** 2))
        if show_baselines and target == "od25":
            for name, col in [("rules", "rule_od25"), ("prognosis", "base_prognosis_od25"), ("persistence", "od_now25")]:
                print(f"  baseline {name}: " + " ".join(
                    f"{L}h {((z[col].values[ok & (z['lead'] == L).values]) == y[ok & (z['lead'] == L).values]).mean():.3f}"
                    for L in [1, 6, 24, 48]))
        out[target] = r
        print(f"{label:30s} {target:6s} " + " ".join(f"{k}={v:.4f}" for k, v in r.items()), flush=True)
    return out


if __name__ == "__main__":
    d = load(refresh="--refresh" in sys.argv)
    print(d.shape, "columns:", sorted(d.columns))
    evaluate(d, od_features=PROD_OD, rwy18_features=PROD_18, label="PRODUCTION", show_baselines=True)
