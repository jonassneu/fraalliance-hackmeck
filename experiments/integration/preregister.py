"""Write the holdout pre-registration (experiments/integration/preregistration.json) from the live variant registry,
the runtime manifests and the final long-test evaluation. Run once, BEFORE the holdout starts (2026-11-01 00:00 UTC);
it refuses to overwrite an existing file after that time. Re-running it before the holdout keeps the time of the
first version (first_written_utc) and includes every change made since as a time-stamped amendment
(experiments/integration/prereg_amendments.json).

    uv run python experiments/integration/preregister.py
"""

import hashlib
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
DST = OUT / "preregistration.json"
AMENDMENTS = OUT / "prereg_amendments.json"
REGISTRY = ROOT / "data" / "archive" / "variants.json"
RUNTIME = ROOT / "data" / "archive" / "runtime"
HOLDOUT_START = datetime(2026, 11, 1, tzinfo=timezone.utc)
FORECAST_MODULES = ["fra/blend.py", "fra/decision.py", "fra/fcerror.py", "fra/predict.py", "fra/dataset.py",
                    "fra/train.py", "fra/changetime.py", "fra/labels.py", "fra/rules.py", "fra/prognosis.py",
                    "fra/weather.py", "fra/singleruns.py", "fra/singleruns_icon.py", "fra/singleruns_iconeu.py",
                    "fra/archive.py"]


def sha256(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 16), b""):
            h.update(b)
    return h.hexdigest()


def runtime(tag):
    m = json.loads((RUNTIME / tag / "RUNTIME.json").read_text())
    return dict(tag=tag, created_utc=m["created_utc"], git_head=m["git_head"], dirty=m["dirty"],
                fra_code_version=m["fra_code_version"],
                forecast_modules_sha256={k: m["files"].get(k) for k in FORECAST_MODULES if k in m["files"]})


def long_test_evidence():
    import pandas as pd
    t = pd.read_csv(OUT / "final_eval_od.csv")
    ev = json.loads((OUT / "final_eval.json").read_text())

    def g(period, metric, lead, method, nd=4):
        r = t[(t.period == period) & (t.metric == metric) & (t.lead == lead) & (t.method == method)].iloc[0]
        return [round(float(r.est), nd), round(float(r.lo), nd), round(float(r.hi), nd)]

    out = {"source": "experiments/integration/final_eval.py -> final_eval.json, final_eval_od.csv (recomputed from "
                     "scratch on 31 Oct 2026; identical to the integration predictions, max |diff| 0.0)",
           "test": f"weekly walk-forward, issues {ev['issue_range'][0]} .. {ev['issue_range'][1]}, {ev['days']} days, "
                   f"{ev['rows']} (issue, lead) rows over 48 leads",
           "periods": {}}
    out["periods_note"] = ("long = issues 2026-06-01 .. 2026-10-30; pre_sep15_part = valid < 2026-09-15 (selection-free "
                           "only for the logit specification, NOT for the blend: all of Jun-Oct was used to select the "
                           "blend design); legacy_part = issues >= 2026-09-15. No part of the long test is "
                           "selection-free for the blend; only the holdout is.")
    for per in ("long", "pre_sep15_part", "legacy_part"):
        P = {}
        for m in ("blend", "logit", "prognosis", "rules", "persistence"):
            P[m] = {"acc_1_6_24_48": [g(per, "acc", L, m, 3)[0] for L in (1, 6, 24, 48)],
                    "brier_1_6_24_48": g(per, "brier", 0, m)}
        for m in ("blend - logit", "blend - prognosis", "blend - rules", "blend - persistence"):
            P[m] = {"acc_1_6_24_48": [g(per, "acc", L, m, 3) for L in (1, 6, 24, 48)],
                    "brier_1_6_24_48": g(per, "brier", 0, m), "brier_all_leads": g(per, "brier", -1, m)}
        out["periods"][per] = P
    nc = {m["method"]: round(m["event_acc"], 3) for m in ev["next_change"]["methods"]}
    out["next_change_event_accuracy"] = nc
    out["changed_hours"] = {k: {z["method"]: [round(z["est"], 3), round(z["lo"], 3), round(z["hi"], 3)]
                                for z in v["table"]} | {"n": v["n"]} for k, v in ev["changed_hours"].items()}
    rw = json.loads((OUT / "rwy18_results.json").read_text())
    out["rwy18_walk_forward_from_2025_09"] = {"logit_pooled_brier_ci": rw["pooled_brier_ci"].get("R1_logit"),
                                              "closure_days": rw.get("closure_days"), "decision": rw.get("decision")}
    return out


def live_runs(since="2026-10-31T18:00:00+00:00"):
    """Hourly runs of the registered system so far (issue >= since): champion, shadows, failures."""
    out = []
    for ln in (ROOT / "data" / "archive" / "runs.jsonl").read_text().splitlines():
        r = json.loads(ln)
        if r["issue_utc"] < since or not (r.get("steps") or {}).get("issue", {}).get("new"):
            continue
        st = r["steps"]
        sh = (st.get("shadow") or {}).get("variants") or {}
        out.append(dict(issue_utc=r["issue_utc"], run_utc=r["run_utc"], runtime=(r.get("runtime") or {}).get("tag"),
                        failed=r["failed"], champion=st["issue"].get("variant"),
                        model_role=st["issue"].get("model_role"), blend_ok=st["issue"].get("blend_ok"),
                        shadows={k: bool(v.get("ok") and v.get("new")) for k, v in sh.items()}))
    return out


def main():
    now = datetime.now(timezone.utc).replace(microsecond=0)
    if DST.exists() and now >= HOLDOUT_START and "--force-after-start" not in sys.argv:
        raise SystemExit(f"{DST} exists and the holdout has started: the pre-registration is locked")
    first = None
    if DST.exists():
        old = json.loads(DST.read_text())
        first = old.get("first_written_utc") or old.get("written_utc")
    amendments = json.loads(AMENDMENTS.read_text()) if AMENDMENTS.exists() else []
    reg = json.loads(REGISTRY.read_text())
    variants = []
    for v in reg["variants"]:
        if not v.get("enabled", True):
            continue
        models = {k: {"path": p, "sha256": sha256(ROOT / p)} for k, p in (v.get("models") or {}).items()}
        variants.append(dict(name=v["name"], role=v["role"], entry=v.get("entry") or "fra.predict:forecast",
                             runtime=runtime(v["runtime"]), models=models, registry_pins={
                                 "sha256": v.get("sha256"), "models_sha256": v.get("models_sha256")},
                             description=v.get("note")))
    plan = json.loads((OUT / "holdout_plan.json").read_text())
    doc = {
        "title": "Locked holdout of the live FRA operating-direction forecast: pre-registered comparison",
        "first_written_utc": first or now.isoformat(),
        "written_utc": now.isoformat(),
        "holdout_start_utc": HOLDOUT_START.isoformat(),
        "written_before_holdout": now < HOLDOUT_START,
        "registry_file": "data/archive/variants.json",
        "registry_updated_utc": reg.get("updated_utc"),
        "current_runtime": os.readlink(RUNTIME / "current"),
        "rollback_runtime": "2026-10-31-wave1-r2 (previous official system; registry champion logit-v1)",
        "variants": variants,
        **plan,
        "amendments": amendments,
        "long_test_evidence": long_test_evidence(),
        "live_runs_before_holdout": live_runs(),
    }
    tmp = DST.with_name(f".{DST.name}.{os.getpid()}.tmp")
    tmp.write_text(json.dumps(doc, indent=1, default=str) + "\n")
    os.replace(tmp, DST)
    print(f"wrote {DST} at {now.isoformat()} (before holdout: {doc['written_before_holdout']})")


if __name__ == "__main__":
    main()
