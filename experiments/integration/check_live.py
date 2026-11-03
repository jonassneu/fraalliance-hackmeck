"""Checks of the live blend entry (fra.blend.forecast) as the ops registry would call it.

    uv run python experiments/integration/check_live.py [--no-live]
1. live: the current hour with models = {pinned production logit, decision bundle}, fra.predict.DATA pointed at the
   logit's folder (as fra.archive.run_forecast does); fra.archive.check_output must pass; runtime measured.
   (One live fra.predict call: 1 prognosis + 1-2 radar requests through the INAA slots, Open-Meteo, IEM.)
2. fallback: a missing decision bundle must give the logit forecast unchanged, blend_ok False (no network: the logit
   output of check 1 is reused).
3. code path: decision_forecast() with archive inputs and the walk-forward week's model reproduces the walk-forward
   rows of dec_long.parquet exactly (same paths, rollout, lead mapping).
Output: live_check.json
"""

import os

for _k in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(_k, "1")

import json  # noqa: E402
import sys  # noqa: E402
import time  # noqa: E402
from pathlib import Path  # noqa: E402

import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from fra import blend as BL  # noqa: E402
from fra import decision as D  # noqa: E402
from fra import evalkit  # noqa: E402

OUT = Path(__file__).resolve().parent
PROD = ROOT / "data/archive/models/production/model.pkl"


def check_code_path(n=6):
    dec = pd.read_parquet(OUT / "dec_long.parquet").query("config == 'main'")
    rng = np.random.default_rng(1)
    issues = pd.DatetimeIndex(rng.choice(dec["issue"].unique(), n, replace=False))
    BL._wf_init()
    from fra import fcerror as B
    metar = pd.read_parquet(B._metar_file())
    res = []
    for t in issues:
        w = int(evalkit.test_weeks(pd.DatetimeIndex([t]))[0])
        ws = evalkit.week_start(w)
        rows = BL._G["rows"][BL._G["rows"].index + D.FUT * BL.HOUR <= ws]
        r18t = BL._G["r18rows"][BL._G["r18rows"].index + 2 * BL.HOUR <= ws]
        bundle = {"od": D.DecisionModel(**BL.SPEC).fit(rows), "rwy18": D.Rwy18Model().fit(r18t)}
        od = int(BL._G["labels"]["od"].reindex([t - 2 * BL.HOUR]).iloc[0])
        r = BL.decision_forecast(t, od, bundle=bundle, metar=metar, live=False)
        x = dec[dec["issue"] == t].sort_values("lead")
        res.append(dict(issue=str(t), od_now=od, max_abs_diff_p25=float(np.max(np.abs(r["p25"] - x["p25"].to_numpy()))),
                        max_abs_diff_pnc=float(np.max(np.abs(r["pnc"] - x["pnc"].to_numpy()))),
                        max_abs_diff_c07=float(np.max(np.abs(r["c07"] - x["c07"].to_numpy())))))
    return res


def main(live=True):
    out = {}
    import fra.predict as FP
    from fra.archive import check_output
    models = {"model": PROD, "decision": BL.DECISION_MODEL}
    if live:
        data0 = FP.DATA
        FP.DATA = PROD.parent
        try:
            t0 = time.time()
            o, iss, od_now, change = BL.forecast(models=models)
            secs = time.time() - t0
        finally:
            FP.DATA = data0
        check_output(o)
        out["live"] = dict(issue=str(iss), od_now=int(od_now), next_change=str(change), seconds_total=round(secs, 2),
                           attrs=o.attrs["blend"], check_output="passed", columns=list(o.columns),
                           p_od25_lead1_6_24_48=o.set_index("lead_h").loc[[1, 6, 24, 48], ["p_od25", "p_od25_logit",
                                                                                           "p_od25_decision"]]
                           .round(3).to_dict("index"))
        print(json.dumps(out["live"], indent=1, default=str)[:3000], flush=True)
        logit_out = o.copy()
        logit_out["p_od25"], logit_out["p_rwy18_open"] = o["p_od25_logit"], o["p_rwy18_open_logit"]
        logit_out = logit_out.drop(columns=[c for c in o.columns if c.endswith(("_logit", "_decision")) or
                                            c.startswith("blend_")])
        # 2. fallback (fra.predict stubbed with the logit output above: no network)
        orig = FP.forecast
        FP.forecast = lambda issue=None: (logit_out.copy(), iss, od_now, change)
        try:
            f, *_ = BL.forecast(models={"model": PROD, "decision": "/nonexistent/decision.pkl"})
        finally:
            FP.forecast = orig
        check_output(f)
        same = bool((f["p_od25"].to_numpy() == logit_out["p_od25"].to_numpy()).all()
                    and (f["p_rwy18_open"].to_numpy() == logit_out["p_rwy18_open"].to_numpy()).all())
        out["fallback"] = dict(blend_ok=bool(f["blend_ok"].iloc[0]), status=f["blend_status"].iloc[0],
                               logit_unchanged=same, check_output="passed")
        print(out["fallback"], flush=True)
    out["code_path"] = check_code_path()
    print(pd.DataFrame(out["code_path"]).to_string(index=False))
    old = json.loads((OUT / "live_check.json").read_text()) if (OUT / "live_check.json").exists() else {}
    old.update(out)
    old["checked_at"] = pd.Timestamp.now("UTC").isoformat()
    (OUT / "live_check.json").write_text(json.dumps(old, indent=1, default=str))


if __name__ == "__main__":
    main(live="--no-live" not in sys.argv)
