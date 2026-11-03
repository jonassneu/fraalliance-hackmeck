"""Walk-forward decision rollouts for the integration study (fra.blend.decision_walk_forward).

    uv run python experiments/integration/run_wf.py long     # long test (issues of the production test rows from
                                                             # 2026-06-01): configs main / lag1 / gust_metar / native
    uv run python experiments/integration/run_wf.py rwy18    # RWY 18 study: issues 2025-09-01 .. 2026-05-31 (config
                                                             # main; folds aligned with the long test, 39 weeks earlier)
Output: experiments/integration/dec_<what>.parquet (+ .json with the Part B / decision state of the run).
"""

import os

for _k in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(_k, "1")

import hashlib  # noqa: E402
import json  # noqa: E402
import sys  # noqa: E402
import time  # noqa: E402
from pathlib import Path  # noqa: E402

import pandas as pd  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from fra import blend as BL  # noqa: E402
from fra import evalkit  # noqa: E402

OUT = Path(__file__).resolve().parent
RWY18_START = pd.Timestamp("2025-09-01", tz="UTC")
CONFIGS = {
    "long": [dict(name="main", params="DEFAULT", lag_h=2),
             dict(name="lag1", params="DEFAULT", lag_h=1),
             dict(name="gust_metar", params="DEFAULT", lag_h=2, gust_metar=True),
             dict(name="native", params="DEFAULT_NATIVE", lag_h=2)],
    "rwy18": [dict(name="main", params="DEFAULT", lag_h=2)],
}


def blob(path):
    b = Path(path).read_bytes()
    return hashlib.sha1(b"blob %d\0" % len(b) + b).hexdigest()


def main(what):
    from experiments import harness as Hn
    t0 = time.time()
    d = Hn.load()
    if what == "long":
        z, y, p, ok = Hn.production_preds(d, "od25")
        issues = z.loc[ok, "issue"].unique()
        start = evalkit.TEST_START
    else:
        z, y, p, ok = Hn.walk_forward(d, "rwy18", Hn.prod_model("rwy18"), start=RWY18_START)
        iss = pd.DatetimeIndex(z.loc[ok, "issue"].unique())
        issues = iss[iss < evalkit.TEST_START]
        start = RWY18_START
    print(f"{what}: {len(issues)} issue times from {start.date()}", flush=True)
    dec = BL.decision_walk_forward(issues, start=start, configs=CONFIGS[what], workers=4)
    path = OUT / f"dec_{what}.parquet"
    tmp = path.with_name(f".{path.name}.tmp")
    dec.to_parquet(tmp)
    os.replace(tmp, path)
    from fra import fcerror as B
    meta = dict(what=what, start=str(start), n_issues=int(len(issues)), rows=int(len(dec)),
                configs=CONFIGS[what], n_paths=BL.N_PATHS, seed=BL.SEED, seconds=round(time.time() - t0),
                run_at=pd.Timestamp.now("UTC").isoformat(), fcerror_blob=blob(ROOT / "fra/fcerror.py"),
                decision_blob=blob(ROOT / "fra/decision.py"), blend_blob=blob(ROOT / "fra/blend.py"),
                partb_lib=[[str(p), int(m)] for p, m in B._sig()],
                labels_mtime=os.path.getmtime(ROOT / "data/labels.parquet"))
    (OUT / f"dec_{what}.json").write_text(json.dumps(meta, indent=1, default=str))
    print(f"wrote {path} ({len(dec)} rows) in {time.time() - t0:.0f}s", flush=True)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "long")
