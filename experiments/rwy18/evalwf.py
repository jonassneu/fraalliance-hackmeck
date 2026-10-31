"""Extended walk-forward for RWY18 with label variants + closure-oriented metrics.
usage: python evalwf.py <group>   (group in: base, feat, small)"""
import sys, json
from pathlib import Path
import numpy as np, pandas as pd
from sklearn.metrics import roc_auc_score, average_precision_score
ROOT = Path(__file__).resolve().parents[2]; sys.path.insert(0, str(ROOT))
from experiments import harness as H
from experiments.harness import logit_model, PROD_18
pd.set_option("display.width", 250)

LEADS = [1, 6, 24, 48]


def wf(d, labcol, nowcol, fit_predict, start):
    """Weekly walk-forward from `start`; returns frame with y, p, clim (train base rate), rule, persistence."""
    z = d[d[labcol].notna()].reset_index(drop=True).copy()
    z["rwy18_now_f"] = z[nowcol]                      # the production 'current state' feature under this label
    y = z[labcol].astype(int).values
    wk = ((z["issue"] - start).dt.days // 7).values
    p = np.full(len(z), np.nan); clim = np.full(len(z), np.nan)
    for w in np.unique(wk[wk >= 0]):
        te = wk == w
        tr = (z["valid"] < z["issue"][te].min()).values
        clim[te] = y[tr].mean()
        if len(np.unique(y[tr])) < 2:
            continue
        p[te] = fit_predict(z[tr], y[tr], z[te])
    z["y"], z["p"], z["clim"], z["wk"] = y, p, clim, wk
    z["rule"] = z["rule_18"].astype(float); z["pers"] = z["rwy18_now_f"].astype(float)
    return z[(wk >= 0)]


def metrics(z, pcol="p", warn=0.8):
    rows = []
    for L in LEADS + ["all"]:
        m = z if L == "all" else z[z.lead == L]
        m = m[m[pcol].notna()]
        y, p = m.y.values, m[pcol].values
        if len(m) == 0:
            continue
        closed = y == 0
        bs = np.mean((p - y) ** 2); bs_clim = np.mean((m.clim.values - y) ** 2)
        r = dict(lead=L, n=len(m), n_closed=int(closed.sum()), acc=np.mean((p > 0.5) == y), brier=bs,
                 bss=1 - bs / bs_clim if bs_clim > 0 else np.nan,
                 auc=roc_auc_score(closed, 1 - p) if closed.any() and (~closed).any() else np.nan,
                 ap=average_precision_score(closed, 1 - p) if closed.any() else np.nan,
                 hit50=np.mean(p[closed] < 0.5) if closed.any() else np.nan, fa50=int(((p < 0.5) & ~closed).sum()),
                 hitW=np.mean(p[closed] < warn) if closed.any() else np.nan, faW=int(((p < warn) & ~closed).sum()))
        rows.append(r)
    return pd.DataFrame(rows)


def report(z, name, pcols=("p", "rule", "pers")):
    out = {}
    for pc in pcols:
        mt = metrics(z, pc)
        out[pc] = mt
        print(f"--- {name} [{pc}]"); print(mt.round(4).to_string(index=False), flush=True)
    return out


def candidates(group):
    B1 = [(1, 48)]
    C = {}
    if group == "base":
        C["PROD"] = logit_model(PROD_18, C=1.0, window=None)
        C["PROD_nobucket"] = logit_model(PROD_18, C=1.0, window=None, buckets=B1)
        C["PROD_C0.1"] = logit_model(PROD_18, C=0.1, window=None)
        C["+tw18_100m"] = logit_model(PROD_18 + ["tw18_100m_f"], C=1.0, window=None)
        C["+max3"] = logit_model(PROD_18 + ["tw18g_max3"], C=1.0, window=None)
        C["+max7"] = logit_model(PROD_18 + ["tw18g_max7"], C=1.0, window=None)
    elif group == "feat":
        C["+cons"] = logit_model(PROD_18 + ["tw18g_cons"], C=1.0, window=None)
        C["+xw"] = logit_model(PROD_18 + ["xw18_gust"], C=1.0, window=None)
        C["+ne"] = logit_model(PROD_18 + ["tw18g_ne"], C=1.0, window=None)
        C["+od"] = logit_model(PROD_18 + ["tw18_od07", "tw18_x_tw25"], C=1.0, window=None)
        C["+ge10/12"] = logit_model(PROD_18 + ["tw18g_ge10", "tw18g_ge12"], C=1.0, window=None)
        C["+100m+max3"] = logit_model(PROD_18 + ["tw18_100m_f", "tw18g_max3"], C=1.0, window=None)
    elif group == "nb2":
        C["nb+100m"] = logit_model(PROD_18 + ["tw18_100m_f"], C=1.0, window=None, buckets=B1)
        C["nb+cons"] = logit_model(PROD_18 + ["tw18g_cons"], C=1.0, window=None, buckets=B1)
        C["nb+100m+cons"] = logit_model(PROD_18 + ["tw18_100m_f", "tw18g_cons"], C=1.0, window=None, buckets=B1)
        C["nb+tw18"] = logit_model(PROD_18 + ["tw18"], C=1.0, window=None, buckets=B1)
        C["nb+100m+max3"] = logit_model(PROD_18 + ["tw18_100m_f", "tw18g_max3"], C=1.0, window=None, buckets=B1)
        C["nb_C0.3"] = logit_model(PROD_18, C=0.3, window=None, buckets=B1)
        C["nb_C3"] = logit_model(PROD_18, C=3.0, window=None, buckets=B1)
    elif group == "small":
        S = ["rule_18", "rwy18_now_f", "tw18g_max3", "tw18_100m_f"]
        C["small_nb"] = logit_model(S, C=1.0, window=None, buckets=B1)
        C["small_nb_C0.1"] = logit_model(S, C=0.1, window=None, buckets=B1)
        C["small_b"] = logit_model(S, C=1.0, window=None)
        C["small+ne_nb"] = logit_model(S + ["tw18g_ne"], C=1.0, window=None, buckets=B1)
        C["small+xw+ne_nb"] = logit_model(S + ["tw18g_ne", "xw18_gust"], C=1.0, window=None, buckets=B1)
        C["tiny_nb"] = logit_model(["rwy18_now_f", "tw18g_max3"], C=1.0, window=None, buckets=B1)
    return C


if __name__ == "__main__":
    group = sys.argv[1]
    d = pd.read_parquet(ROOT / "data/rwy18_cache.parquet")
    start_ext = pd.Timestamp("2025-09-01", tz="UTC"); start_std = H.START
    res = {}
    for name, fp in candidates(group).items():
        for lab in (["v1", "v2"] if group == "base" else ["v2"]):
            labcol, nowcol = f"lab_{lab}", ("rwy18_now_f" if lab == "v1" else f"now_{lab}")
            for sname, st in [("ext", start_ext), ("std", start_std)]:
                z = wf(d, labcol, nowcol, fp, st)
                key = f"{name}|{lab}|{sname}"
                out = report(z, key, pcols=("p", "rule", "pers") if name in ("PROD", "small_nb") else ("p",))
                res[key] = {k: v.to_dict("records") for k, v in out.items()}
    (ROOT / "data" / "rwy18_preds").mkdir(parents=True, exist_ok=True)
    json.dump(res, open(ROOT / f"data/rwy18_preds/res_{group}.json", "w"), default=float)
