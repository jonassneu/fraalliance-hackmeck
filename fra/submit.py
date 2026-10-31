"""Builds the submission folder: fresh 48 h forecast (CSV + PNG + dashboard), evaluation tables, model card."""

import shutil
import sys

from fra import dashboard, predict, report
from fra.dataset import DATA

OUT = DATA.parent / "submission"


def main(issue=None):
    OUT.mkdir(exist_ok=True)
    out, issue, od_now, change = predict.forecast(issue)
    tag = f"{issue:%Y%m%dT%H}"
    csv = DATA / f"forecast_{tag}.csv"
    out.to_csv(csv, index=False)
    predict.plot(out, issue, od_now, change, DATA / f"forecast_{tag}.png")
    dashboard.render(csv)
    report.main()
    for f in [csv, DATA / f"forecast_{tag}.png", DATA / "eval.csv", DATA / "changetime_eval.csv"]:
        shutil.copy(f, OUT / f.name)
    shutil.copy(DATA.parent / "site" / "index.html", OUT / "dashboard.html")
    if (DATA.parent / "site" / "model.html").exists():  # "Model" page: training data + accuracy
        page = (DATA.parent / "site" / "model.html").read_text(encoding="utf-8")
        (OUT / "model.html").write_text(page.replace('href="index.html"', 'href="dashboard.html"'), encoding="utf-8")
    if (DATA.parent / "site" / "airport3d.html").exists():  # the dashboard's live 3D view
        shutil.copy(DATA.parent / "site" / "airport3d.html", OUT / "airport3d.html")
    shutil.copy(DATA.parent / "MODEL_CARD.md", OUT / "MODEL_CARD.md")
    (OUT / "README.md").write_text(f"""# Submission: FRA operating direction forecast

- `forecast_{tag}.csv`: hourly forecast issued {issue:%Y-%m-%d %H:%M} UTC for the next 48 h
  (`p_od25` = P(OD 25 west), `od_pred`, `od_certainty`, `p_rwy18_open`, `rwy18_pred_open`, official-rule baseline,
  `next_change_utc`, `p_change_48h`, likely change window). Current flown OD at issue: {od_now}.
  Next probable change: {change if change is not None else "none expected within 48 h"}.
- `forecast_{tag}.png`, `dashboard.html`: the same forecast as a chart and dashboard (open the HTML offline; it
  includes the 14-day track record and the published-prognosis comparison). `airport3d.html`: 3D view, embedded next to the timeline.
  `model.html`: the pitch page: how much better than the published prognosis, direction switches, how it works, how it was tested.
- `MODEL_CARD.md`: data sources, model, quality (walk-forward), key drivers, limitations.
- `eval.csv`, `changetime_eval.csv`: raw evaluation tables.

Reproduce any issue time: `uv run python -m fra.predict YYYY-MM-DDTHH:00` (UTC; past times use only data available then).
""")
    print(f"submission written to {OUT} (issue {issue}, OD now {od_now}, next change {change})")


if __name__ == "__main__":
    main(*sys.argv[1:2])
