"""Writes the one-page MODEL_CARD.md from data/eval.csv, data/importance.json and the label set."""

import json

import pandas as pd

from fra.dataset import DATA

ROOT = DATA.parent
NAMES = {"tw25": "tailwind on RWY 25 (forecast)", "tw25_roll6": "tailwind on RWY 25, 6 h mean", "tw25_prev3": "tailwind on 25, 3 h earlier",
         "tw25_next3": "tailwind on 25, 3 h later", "tw18": "tailwind on RWY 18", "tw18_gust": "gust tailwind on RWY 18",
         "tw18_roll6": "tailwind on RWY 18, 6 h mean", "xw18_gust": "gust crosswind on RWY 18", "xw25_gust": "gust crosswind on 25",
         "od_now": "current flown OD", "od_rule_now": "rules applied to current METAR", "rwy18_now": "RWY 18 in use now",
         "obs_tw25": "observed tailwind on 25 (METAR)", "obs_tw18": "observed tailwind on 18 (METAR)", "lead": "lead time",
         "run_age_h": "age of the weather run", "hour": "hour of day", "doy_sin": "season", "doy_cos": "season",
         "pressure_msl": "pressure", "temperature": "temperature", "wind_speed": "wind speed", "wind_gusts": "gusts",
         "wind_direction": "wind direction", "cloud_cover": "cloud cover", "precipitation": "precipitation",
         "obs_wind_speed": "observed wind speed", "obs_wind_gusts": "observed gusts",
         "prog_signed": "published INAA prognosis", "prog_alt_signed": "prognosis alternative scenario",
         "od_now25": "current flown OD", "rule_od25": "official rule on forecast", "rule_18": "official RWY 18 rule",
         "rwy18_now_f": "RWY 18 in use now", "hour_sin": "time of day", "hour_cos": "time of day", "night": "night ban", "tw25_100m": "tailwind on 25 at 100 m", "tw25_cons": "ECMWF+ICON consensus tailwind on 25", "tw25_cons_roll6": "consensus tailwind, 6 h mean",
         "tw25_pastmin6": "lowest tailwind on 25 in the 6 h before", "xwf_east_tanh": "NE (Bise) vs SE easterly regime",
         "shear_tw25": "tailwind shear 100 m vs 10 m"}


def pct(x):
    return f"{100 * x:.1f}%" if pd.notna(x) else "–"


def changetime_table():
    p = DATA / "changetime_eval.csv"
    if not p.exists():
        return "(run `uv run python -m fra.changetime`)"
    c = pd.read_csv(p)
    keep = {"model (nested-tuned rule)": "**Our model**", "official rules (rule_od25)": "Baseline: official rules",
            "published prognosis (main >= 0.5)": "Baseline: published INAA prognosis", "persistence (never change)": "Baseline: naive \"no change\""}
    rows = ["| Method | Change caught within ±3 h | Timing error on hits | False alarms | Correct 'no change' | Event accuracy |",
            "|---|---|---|---|---|---|"]
    for k, name in keep.items():
        r = c[c["method"] == k]
        if len(r):
            r = r.iloc[0]
            mae = f"{r['timing_mae_h']:.1f} h" if pd.notna(r["timing_mae_h"]) else "–"
            rows.append(f"| {name} | {pct(r['hit_rate'])} | {mae} | {int(r['false_alarm'])} | {int(r['correct_no_change'])} | **{pct(r['event_acc'])}** |")
    b = c[c["method"] == "p_change_48h (logistic)"]
    if len(b):
        b = b.iloc[0]
        rows.append(f"\n{int(c['n_issues'].max())} issue times, {int(c['n_actual_change'].max())} with an actual change within 48 h. "
                    f"P(change within 48 h): Brier {b['brier']:.3f} vs {b['brier_climatology']:.3f} for the base rate. "
                    f"The likely window covers {pct(b['window_coverage'])} of actual changes (mean width {b['window_width_h']:.1f} h).")
    return "\n".join(rows)


def main():
    ev = pd.read_csv(DATA / "eval.csv")
    imp = json.loads((DATA / "importance.json").read_text())
    lab = pd.read_parquet(DATA / "labels.parquet")
    meta = json.loads((DATA / "train_meta.json").read_text()) if (DATA / "train_meta.json").exists() else {}

    rows = []
    for _, r in ev[ev["lead_h"].isin([1, 6, 24, 48])].iterrows():
        tgt = "Operating direction" if r["target"] == "od25" else "RWY 18 open"
        rows.append(f"| {tgt} | +{r['lead_h']} h | {int(r['n'])} | **{pct(r['model_acc'])}** | {pct(r['rule_acc'])} | "
                    f"{pct(r['persistence_acc'])} | {pct(r.get('prognosis_acc'))} | {r['model_brier']:.3f} | {pct(r.get('model_acc_changed'))} | "
                    f"{pct(r.get('rule_acc_changed'))} ({int(r.get('n_changed', 0))}) |")

    def drivers(t):
        seen, out = set(), []
        for k in imp[t]:
            n = NAMES.get(k, k)
            if n not in seen:
                seen.add(n)
                out.append(n)
        return ", ".join(out[:6])

    od = lab["od"].dropna()
    card = f"""# Model card: FRA operating direction and RWY 18 forecast

**Task:** for every hour up to t+48 h, predict P(OD 25 west) vs OD 07 east and P(RWY 18 West usable for departures), with a certainty score and the next probable change time (FraAlliance case, AI Week 2026).

## Data (all public, cited)
| Data | Source | Use |
|---|---|---|
| Flown operating direction + RWY 18 use | Umwelthaus INAA / FANOMOS radar tracks, https://inaa.umwelthaus.org/ (`Fanomos/GetFlightTracks`) | Labels. Low-level tracks (< 3,000 ft, < 15 km): ~250° → OD 25, ~070° → OD 07, southbound west of the field → RWY 18 departure |
| Weather forecasts as issued | Open-Meteo Single Runs API, ECMWF IFS, https://open-meteo.com/en/docs/single-runs-api | Features: only runs initialised ≥ 6 h before the issue time |
| Published OD prognosis (8 h blocks, main + alternative scenario) | Umwelthaus INAA `Direction/GetDirectionData?currentTime=…`, as live at the issue time | Feature and extra baseline |
| Second weather model | Open-Meteo Previous Runs (best_match ≈ DWD ICON), vintage ≥ 1 day old | Feature (ensemble partner) |
| Second weather model, exact runs | Open-Meteo Single Runs, DWD ICON-D2 (3-hourly runs, init ≥ 4 h before issue) | ECMWF+ICON consensus tailwind |
| Wind at 100 m (ECMWF IFS) | Open-Meteo Single Runs, same run as above | Feature (winds aloft) |
| Observed weather | Iowa Environmental Mesonet METAR EDDF, https://mesonet.agron.iastate.edu/request/download.phtml | Current wind at issue time |
| Rules | FraAlliance case, section 3 | Baseline and engineered features (tailwind/crosswind components for 070/250/180) |

Labels: {len(od):,} labelled hours ({od.index.min():%Y-%m-%d} to {od.index.max():%Y-%m-%d}), OD 25 share {(od == 25).mean():.0%}. Hourly in the test period, 3–6 sampled hours per day in training (the source serves ~0.4 requests/s).

## Model
For the operating direction: a regularised logistic regression (C = 0.03) with separate weights per lead bucket (1–3, 4–12, 13–30, 31–48 h). Inputs: the published INAA prognosis (main and alternative scenario, signed by its stated probability), the official rule applied to the ECMWF forecast, the current flown OD, the forecast tailwind on RWY 25 (10 m: hourly, 6 h mean, 3 h before/after; at 100 m; the ECMWF+ICON-D2 consensus, the lowest tailwind over the previous 6 h, 100 m–10 m shear, and a NE-Bise vs SE regime indicator), and the time of day incl. the night ban. Trained on the most recent 120 days only (recent regimes beat older history in walk-forward tests). Probabilities are sharpened per lead bucket by temperature scaling, fitted out of sample on the last 14 training days. Under walk-forward testing it beat larger feature sets and a LightGBM ensemble, because there are only a few weeks of history. RWY 18: one logistic model across all leads (C = 3; rule, current use, gust tailwind, 6 h mean tailwind, observed tailwind). "Next change" uses a hysteresis rule tuned walk-forward (`fra/changetime.py`): P(other OD) ≥ 0.5, then it stays ≥ 0.4 for 3 h. It comes with P(change within 48 h) and a likely window. "Certainty" is |P − 0.5| × 2.

## Quality ({meta.get('label_kind', '').removeprefix('real, ')}; only data available at forecast time)
| Target | Lead | n | **Our model** | Baseline: official rules | Baseline: naive "no change" | Baseline: published INAA prognosis | ML Brier | ML on changed hours | Rules on changed hours (n) |
|---|---|---|---|---|---|---|---|---|---|
""" + "\n".join(rows) + """

**RWY 18:** genuine closures are rare (wind closures on 3–4 days in 16 months, all OD 07 with wind 010–050° at 11–23 kt), so accuracy above is close to the 99 % "always open" base rate. Closure skill from an extended walk-forward (weekly folds from Sep 2025, trained strictly on the past, `experiments/rwy18/`): Brier skill vs climatology 0.55 at +1 h, 0.35 at +24 h; AUC 0.71. The model flags ~50 % of closure hours at a P(open) < 0.8 warning level (every wind-driven closure it could be scored on was flagged; the rest are non-wind closures), with 1.1 false alarms per 1,000 h. The official rule on the forecast catches about the same share but gives 20 false alarms per 1,000 h, because the airport applies the 15 kt limit to the steady wind, not gusts. Only ~4 scoreable wind-closure hours exist, so treat these numbers as indicative.

"Changed hours" are hours where the state at the valid time differs from the state at issue time. That is where planning matters, and where persistence scores 0 %.

## Next change time (walk-forward, issue times from 22 Sep 2026)
""" + changetime_table() + f"""

## Key drivers (logistic contribution: |coefficient| × feature spread)
- **Operating direction:** {drivers('od25')}
- **RWY 18:** {drivers('rwy18')}

## Limitations
- RWY 18 "closed" is a proxy: no southbound departures in a busy hour (≥ 15 movements, from 06 local). The first hour after the night ban is excluded, because it is an arrival wave without departures (9 of the 10 test-period "closures" under the first label definition were this artefact). Not-used ≠ closed.
- About 30 % of the OD "changes" at +1 h are the first morning hour after the night ban (the evening OD is carried through the night), so switch detection at +1 h is harder in this metric than in reality.
- The case rules (10/15 kt) differ from Fraport's public policy (≈5 kt tailwind, west preference). The model learns the flown behaviour, which is a large part of its edge over the rule baseline.
- Evaluation is walk-forward: each test week (from 15 Sep 2026) is predicted by a model trained only on outcomes known before that week. The test period is short (autumn 2026), with few switch events and no confidence intervals (±~0.8 pp sampling noise per lead).
- About 24 % of OD test hours (night ban, < 4 movements) carry the last flown OD forward instead of being directly observed.
- Live forecasts use the latest Open-Meteo ECMWF run (the init time is approximated); training uses exact archived runs.
"""
    (ROOT / "MODEL_CARD.md").write_text(card)
    print(card)


if __name__ == "__main__":
    main()
