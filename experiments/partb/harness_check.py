"""Do Part B path features help the production OD logit? (read-only use of experiments/harness.py + wf_cache)

  OMP_NUM_THREADS=1 uv run python -m experiments.partb.harness_check
Computes fra.fcerror.path_features for every (issue, lead) row of the harness table (walk-forward by construction),
caches them in experiments/partb/pw_features.parquet and evaluates PROD_OD + candidate feature sets with the
production walk-forward (weekly from 2026-09-15, 120-day window, C=0.03, NO temperature scaling in the harness).
"""
import os
for _v in ["OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"]:
    os.environ.setdefault(_v, "1")
import sys  # noqa: E402
import time  # noqa: E402
from pathlib import Path  # noqa: E402

import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from experiments import harness as H  # noqa: E402
from fra import fcerror as F  # noqa: E402

CACHE = Path(__file__).resolve().parent / "pw_features.parquet"


def features(d, refresh=False):
    if CACHE.exists() and not refresh:
        f = pd.read_parquet(CACHE)
    else:
        t = time.time()
        f = F.path_features(d[["issue", "lead"]].drop_duplicates())
        tmp = CACHE.with_suffix(".tmp.parquet")
        f.to_parquet(tmp)
        os.replace(tmp, CACHE)
        print(f"path_features for {len(f)} rows in {time.time()-t:.0f}s", flush=True)
    return d.merge(f, on=["issue", "lead"], how="left")


if __name__ == "__main__":
    d = H.load()
    d = features(d, refresh="--refresh" in sys.argv)
    print("pw coverage (non-NaN) in test period:",
          d.loc[d.issue >= H.START, "pw_tw25_gt0"].notna().mean().round(3))
    d["pw_lo_gt0"] = np.log((d.pw_tw25_gt0 + 0.01) / (1.01 - d.pw_tw25_gt0))   # logit-ish transforms
    d["pw_lo_gt5"] = np.log((d.pw_tw25_gt5 + 0.01) / (1.01 - d.pw_tw25_gt5))
    H.evaluate(d, od_features=H.PROD_OD, label="PRODUCTION")
    for name, extra in [("+P(tw25>0)", ["pw_tw25_gt0"]),
                        ("+P(tw25>5)", ["pw_tw25_gt5"]),
                        ("+P>0,P>5", ["pw_tw25_gt0", "pw_tw25_gt5"]),
                        ("+logit P>0,P>5", ["pw_lo_gt0", "pw_lo_gt5"]),
                        ("+mean,sd", ["pw_tw25_mean", "pw_tw25_sd"]),
                        ("+P>0,P>5,max6", ["pw_tw25_gt0", "pw_tw25_gt5", "pw_tw25_max6_gt5"])]:
        H.evaluate(d, od_features=H.PROD_OD + extra, label=name)
