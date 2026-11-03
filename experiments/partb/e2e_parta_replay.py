"""Part A end-to-end replay for Part B parameter variants (read-only use of experiments/parta/endtoend.py).

  OMP_NUM_THREADS=1 uv run python -m experiments.partb.e2e_parta_replay default native native_w0.25 ifs
Rolls Part A's decision model (fra.decision, variant logit_C0.1_f6, walk-forward weekly) out along 100 Part B paths per
issue exactly as experiments/parta/endtoend.py does, but with the chosen fra.fcerror parameter set, and scores P(OD 25)
on the production test rows (evalkit folds, 2026-06-01 .. holdout). Nothing is written to experiments/parta/: results go
to experiments/partb/e2e_replay/res_<variant>.json. ~30 s per variant (4 workers).
"""
import os
for _v in ["OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"]:
    os.environ.setdefault(_v, "1")
import json  # noqa: E402
import sys  # noqa: E402
import time  # noqa: E402
from concurrent.futures import ProcessPoolExecutor  # noqa: E402
from dataclasses import asdict, replace  # noqa: E402
from pathlib import Path  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "experiments" / "parta"))
sys.path.insert(0, str(ROOT))
import pandas as pd  # noqa: E402

import common as C  # noqa: E402  (experiments/parta/common.py)
import endtoend as EE  # noqa: E402  (experiments/parta/endtoend.py)
from fra import fcerror as B  # noqa: E402

OUT = Path(__file__).resolve().parent / "e2e_replay"
VARS = {"default": B.DEFAULT,
        "native": B.DEFAULT_NATIVE,
        "native_w0.25": replace(B.DEFAULT_NATIVE, ifs_entry_weight=0.25),
        "ifs": B.DEFAULT_IFS}
MODELS = ["logit_C0.1_f6"]


def run(name):
    d = list(B.sample_paths.__defaults__)
    d[2] = VARS[name]                                    # params default of sample_paths (fork -> workers inherit)
    B.sample_paths.__defaults__ = tuple(d)
    t0 = time.time()
    parts, diags = [], []
    weeks = C.week_starts()
    with ProcessPoolExecutor(4, initializer=EE._init) as ex:
        for df, dg in ex.map(EE.run_week, weeks, [MODELS] * len(weeks), [False] * len(weeks)):
            if df is not None:
                parts.append(df)
                diags.append(dg)
    out = pd.concat(parts, ignore_index=True)
    prod = C.prod_table()
    res = {"variant": name, "params": asdict(VARS[name]), "partb": EE.partb_state(B, B.load_library()),
           "path_diagnostics": EE.summarize_diag(diags), "seconds": round(time.time() - t0)}
    for m in MODELS:
        for mode in EE.MODES:
            pr = out[["issue", "lead", f"p_{m}_{mode}"]].rename(columns={f"p_{m}_{mode}": "p_e2e"})
            t = prod.merge(pr, on=["issue", "lead"], how="inner")
            x = C.rollout_metrics(t, "p_e2e")
            x["rows"] = len(t)
            res[f"{m}_{mode}"] = x
            print(f"{name:14s} {m} anticipate={mode:4s} acc " + "/".join(f"{100 * x[f'acc{L}']:.1f}" for L in C.LEADS)
                  + f"  Brier 1/6/24/48 = {x['brier1']:.4f}/{x['brier6']:.4f}/{x['brier24']:.4f}/{x['brier48']:.4f}"
                  f"  B = {x['brier_1_6_24_48']:.4f} (rows {len(t)})", flush=True)
    OUT.mkdir(exist_ok=True)
    tmp = OUT / f".res_{name}.json.tmp"
    tmp.write_text(json.dumps(res, indent=1, default=str))
    os.replace(tmp, OUT / f"res_{name}.json")


if __name__ == "__main__":
    for v in (sys.argv[1:] or list(VARS)):
        run(v)
