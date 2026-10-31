"""Track record for the dashboard: the last 14 flown days, forecast 24 h ahead vs what was actually flown -> data/trackrecord.json

    uv run python -m fra.trackrecord          (also called by fra.dashboard when the cache is older than the labels)

Out of sample: one model trained only on outcomes known before the first issue time of the window (same rule as the
walk-forward evaluation), then every hour of the window is predicted from the forecast issued 24 h before it.
Baselines at the same issue times: the published Umwelthaus prognosis and the official rules on the forecast wind.
"""

import json

import numpy as np
import pandas as pd

from fra.dataset import DATA, build, hourly_metar, load_labels
from fra.train import add_rule_features, fit, predict

OUT = DATA / "trackrecord.json"
DAYS, LEAD = 14, 24


def compute():
    labels, _ = load_labels()
    flown = labels["od"].dropna()
    end = flown.index.max()
    start = end - pd.Timedelta(days=DAYS) + pd.Timedelta(hours=1)
    d = add_rule_features(build(pd.read_parquet(DATA / "forecasts.parquet"), labels, hourly_metar(),
                                leads=sorted({1, 2, 3, 6, 9, 12, 18, LEAD, 30, 36, 42, 48})))
    test = d[(d["lead"] == LEAD) & (d["valid"] >= start) & (d["valid"] <= end)].sort_values("valid")
    t0 = test["issue"].min()
    p25 = predict(fit(d[d["valid"] < t0], "od25"), test, "od25")
    pw = test["prog_main_west"]
    prog = np.where(pw.isna(), np.nan, np.where(pw >= 0.5, 25, 7))
    rows = [dict(t=v.isoformat(), y=int(y), p25=round(float(p), 3), rule=25 if r == 1 else 7,
                 prog=None if np.isnan(g) else int(g))
            for v, y, p, r, g in zip(test["valid"], test["od"].fillna(flown.reindex(test["valid"]).ffill()),
                                     p25, test["rule_od25"], prog)]
    acc = lambda k: float(np.mean([(r[k] if k != "p25" else (25 if r["p25"] >= .5 else 7)) == r["y"]
                                   for r in rows if r[k] is not None]))
    switches = int(sum(a["y"] != b["y"] for a, b in zip(rows, rows[1:])))
    out = dict(lead=LEAD, start=start.isoformat(), end=end.isoformat(), trained_before=t0.isoformat(),
               labels_until=end.isoformat(), switches=switches,
               acc=dict(model=round(acc("p25"), 4), prog=round(acc("prog"), 4), rule=round(acc("rule"), 4)), hours=rows)
    OUT.write_text(json.dumps(out, separators=(",", ":")))
    return out


def load():
    """Cached track record, recomputed when the flown labels are newer than the cache."""
    lab = DATA / "labels.parquet"
    if OUT.exists() and (not lab.exists() or OUT.stat().st_mtime >= lab.stat().st_mtime):
        return json.loads(OUT.read_text())
    return compute()


if __name__ == "__main__":
    r = compute()
    print(f"{r['start']} .. {r['end']}: {len(r['hours'])} h, {r['switches']} switches flown, "
          f"24 h-ahead accuracy model {r['acc']['model']:.1%} / prognosis {r['acc']['prog']:.1%} / rules {r['acc']['rule']:.1%}")
