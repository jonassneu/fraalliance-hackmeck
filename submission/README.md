# Submission: FRA operating direction forecast

- `forecast_20261030T12.csv`: hourly forecast issued 2026-10-30 12:00 UTC for the next 48 h
  (`p_od25` = P(OD 25 west), `od_pred`, `od_certainty`, `p_rwy18_open`, `rwy18_pred_open`, official-rule baseline,
  `next_change_utc`, `p_change_48h`, likely change window). Current flown OD at issue: 7.
  Next probable change: none expected within 48 h.
- `forecast_20261030T12.png`, `dashboard.html`: the same forecast as a chart and dashboard (open the HTML offline; it
  includes the 14-day track record and the published-prognosis comparison). `airport3d.html`: 3D view, embedded next to the timeline.
  `model.html`: the pitch page: how much better than the published prognosis, direction switches, how it works, how it was tested.
- `MODEL_CARD.md`: data sources, model, quality (walk-forward), key drivers, limitations.
- `eval.csv`, `changetime_eval.csv`: raw evaluation tables.

Reproduce any issue time: `uv run python -m fra.predict YYYY-MM-DDTHH:00` (UTC; past times use only data available then).
