"""Robustness: walk-forward from an earlier start (monkeypatched harness.START, file untouched); per-week Brier.
Period before 2026-09-15 was NOT used for feature selection -> genuine holdout."""
import os
for _v in ["OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"]:
    os.environ[_v] = "1"
import sys
import warnings
from multiprocessing import Pool

import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")
import experiments.harness as H  # noqa: E402
from experiments.weather_features.run import P  # noqa: E402

H.START = pd.Timestamp(sys.argv[1] if len(sys.argv) > 1 else "2026-03-01", tz="UTC")
SPLIT = pd.Timestamp("2026-09-15", tz="UTC")
XF = ["xw25_fut12", "tw25_fut12", "tw25_pastmin6"]
CANDS = {} if len(sys.argv) > 2 else {
    "PROD": P,
    "+xwfut12": P + ["xw25_fut12"],
    "+xw25_signed": P + ["xw25_signed"],
    "+tw25_fut12": P + ["tw25_fut12"],
    "+pastmin6": P + ["tw25_pastmin6"],
    "+XF": P + XF,
    "+XF+rev": P + XF + ["tw25_rev"],
    "+XF+xw+shear+rev": P + XF + ["xw25_signed", "shear_tw25", "tw25_rev"],
    "+XF+xw+shear+rev+lagstd+ecicon": P + XF + ["xw25_signed", "shear_tw25", "tw25_rev", "tw25_lagstd", "ec_icon_diff"],
    "+XF+xw+shear+rev+lagstd": P + XF + ["xw25_signed", "shear_tw25", "tw25_rev", "tw25_lagstd"],
}
if len(sys.argv) > 2:
    CANDS = {"PROD": P, **{f"+{c}": P + c.split(",") for c in sys.argv[2].split(";")}}
D = None


def init():
    global D
    D = pd.read_parquet(H.ROOT / "data" / "weather_feats.parquet")


def job(name):
    z, y, p, ok = H.walk_forward(D, "od25", H.logit_model(CANDS[name]))
    return name, pd.DataFrame({"issue": z["issue"], "lead": z["lead"], "y": y, "p": p, "ok": ok})


if __name__ == "__main__":
    with Pool(8, initializer=init) as pool:
        res = dict(pool.map(job, list(CANDS), chunksize=1))
    base = res["PROD"]
    rows = []
    for name, r in res.items():
        r = r[r.ok]
        se = (r.p - r.y) ** 2
        b = base[base.ok]
        bse = (b.p - b.y) ** 2
        early, late = r.issue < SPLIT, r.issue >= SPLIT
        wk = ((r.issue - H.START).dt.days // 7)
        dw = (se.groupby(wk).mean() - bse.groupby(wk).mean())
        acc = lambda m, L: ((r.p[m & (r.lead == L)] > .5) == r.y[m & (r.lead == L)]).mean()
        rows.append(dict(name=name, brier_early=se[early].mean(), brier_late=se[late].mean(),
                         d_early=se[early].mean() - bse[early].mean(), d_late=se[late].mean() - bse[late].mean(),
                         weeks_better=int((dw < 0).sum()), weeks_worse=int((dw > 0).sum()),
                         acc24_early=acc(early, 24), acc48_early=acc(early, 48), acc6_early=acc(early, 6)))
    pd.set_option("display.width", 220)
    t = pd.DataFrame(rows).set_index("name").sort_values("d_early")
    print(f"start={H.START.date()}  early = [start, 2026-09-15) holdout, late = production test period")
    print(t.round(4).to_string())
    mon = {}
    for name, r in res.items():
        r = r[r.ok]; b = base[base.ok]
        mon[name] = ((r.p - r.y) ** 2).groupby(r.issue.dt.strftime("%y-%m")).mean() - ((b.p - b.y) ** 2).groupby(b.issue.dt.strftime("%y-%m")).mean()
    print("monthly dBrier vs PROD (x1000):")
    print((pd.DataFrame(mon).drop(columns="PROD") * 1000).round(1).T.to_string())
