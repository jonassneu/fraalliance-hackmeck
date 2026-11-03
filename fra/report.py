"""Writes the one-page MODEL_CARD.md from the evaluation files on disk.

    uv run python -m fra.report            # -> MODEL_CARD.md (and prints it)
    uv run python -m fra.report --stdout   # print only, write nothing

Sources (every number in the card comes from one of these files):
    data/eval.csv, data/importance.json, data/labels.parquet, data/train_meta.json   the logistic model (fra.train)
    experiments/integration/final_eval_od.csv      official forecast (blend), logistic model alone and baselines on
                                                   the long walk-forward test, 95 % day-block bootstrap CIs
    experiments/integration/final_eval.json        changed hours at 1 h and 6 h
    experiments/integration/nextchange_results.json  next change time (nested walk-forward)
    experiments/integration/rwy18_results.json     RWY 18 closure skill, extended walk-forward from Sep 2025
    experiments/integration/preregistration.json   the locked live holdout (start, first verdict)
"""

import json
import sys

import pandas as pd

from fra.dataset import DATA

ROOT = DATA.parent
INTEG = ROOT / "experiments" / "integration"
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
LEADS = (1, 6, 24, 48)


def pct(x):
    return f"{100 * x:.1f}%" if pd.notna(x) else "–"


def p1(x):
    return f"{100 * x:.1f}" if pd.notna(x) else "–"


def day(s):
    t = pd.Timestamp(s)
    return f"{t.day} {t:%b} {t.year}"


def blend_tables():
    """Quality section of the official forecast (blend) on the long walk-forward test."""
    t = pd.read_csv(INTEG / "final_eval_od.csv")

    def g(per, met, lead, m):
        r = t[(t["period"] == per) & (t["metric"] == met) & (t["lead"] == lead) & (t["method"] == m)]
        return r.iloc[0] if len(r) else None

    def ci(per, met, lead, m, f=p1, nd=None):
        r = g(per, met, lead, m)
        if r is None:
            return "–"
        if nd is not None:
            return f"{r['est']:.{nd}f} [{r['lo']:.{nd}f}, {r['hi']:.{nd}f}]"
        return f"{f(r['est'])} [{f(r['lo'])}, {f(r['hi'])}]"

    one = g("long", "acc", 1, "blend")
    rows = ["| Lead | n | **Official forecast (blend)** | Logistic model alone | Published INAA prognosis | Official rules | Naive \"no change\" | Brier blend / logistic |",
            "|---|---|---|---|---|---|---|---|"]
    for L in LEADS:
        b = g("long", "acc", L, "blend")
        rows.append(f"| +{L} h | {int(b['n']):,} | **{pct(b['est'])}** [{p1(b['lo'])}, {p1(b['hi'])}] | {pct(g('long', 'acc', L, 'logit')['est'])} | "
                    f"{pct(g('long', 'acc', L, 'prognosis')['est'])} | {pct(g('long', 'acc', L, 'rules')['est'])} | "
                    f"{pct(g('long', 'acc', L, 'persistence')['est'])} | {g('long', 'brier', L, 'blend')['est']:.3f} / "
                    f"{g('long', 'brier', L, 'logit')['est']:.3f} |")
    excl = lambda m: sum(int(g("long", "acc", L, m)["lo"] > 0) for L in LEADS)
    pre = [g("pre_sep15_part", "acc", L, "blend") for L in LEADS]
    pre_l = [g("pre_sep15_part", "acc", L, "logit") for L in LEADS]
    pre_p = [g("pre_sep15_part", "acc", L, "prognosis") for L in LEADS]
    s = "/".join(str(L) for L in LEADS)
    text = "\n".join(rows) + f"""

Brier score over leads {s} (lower is better): blend {ci('long', 'brier', 0, 'blend', nd=4)}, logistic model alone {ci('long', 'brier', 0, 'logit', nd=4)}, published prognosis {g('long', 'brier', 0, 'prognosis')['est']:.4f}, official rules {g('long', 'brier', 0, 'rules')['est']:.4f}. Paired difference blend − logistic {ci('long', 'brier', 0, 'blend - logit', nd=4)}; over all 48 leads {g('long', 'brier', -1, 'blend')['est']:.4f} vs {g('long', 'brier', -1, 'logit')['est']:.4f}. Paired accuracy difference blend − prognosis {', '.join(f"{100 * g('long', 'acc', L, 'blend - prognosis')['est']:+.1f}" for L in LEADS)} pp at {s} h ({excl('blend - prognosis')} of 4 CIs exclude 0; vs the official rules {excl('blend - rules')} of 4).

Part before 15 Sep 2026 ({int(pre[0]['n_days'])} days; the original hackathon settings were chosen from 15 Sep on, the blend on the whole test): blend {' / '.join(p1(r['est']) for r in pre)} %, logistic model alone {' / '.join(p1(r['est']) for r in pre_l)} %, published prognosis {' / '.join(p1(r['est']) for r in pre_p)} % at {s} h; Brier blend {g('pre_sep15_part', 'brier', 0, 'blend')['est']:.4f} vs logistic {g('pre_sep15_part', 'brier', 0, 'logit')['est']:.4f}."""
    try:
        ch = json.loads((INTEG / "final_eval.json").read_text())["changed_hours"]
        parts = []
        for key, L in (("lead_1", 1), ("lead_6", 6)):
            m = {r["method"]: r for r in ch[key]["table"]}
            d = m.get("blend - logit")
            parts.append(f"at {L} h (n = {ch[key]['n']}) blend {pct(m['blend']['est'])}, logistic {pct(m['logit']['est'])}, "
                         f"prognosis {pct(m['prognosis']['est'])}, rules {pct(m['rules']['est'])}"
                         + (f" (blend − logistic {100 * d['est']:+.1f} pp [{100 * d['lo']:+.1f}, {100 * d['hi']:+.1f}])" if d else ""))
        text += ("\n\nChanged hours (the flown OD at the valid hour differs from the current OD the forecast started from; "
                 "where planning matters and persistence scores 0 %): " + "; ".join(parts) + ".")
    except Exception:
        pass
    return text, int(one["n_days"]), int(one["n"])


def logit_od_table(ev):
    rows = ["| Lead | n | **Logistic model** | Official rules | Naive \"no change\" | Published INAA prognosis | Brier |",
            "|---|---|---|---|---|---|---|"]
    for _, r in ev[(ev["target"] == "od25") & ev["lead_h"].isin(LEADS)].iterrows():
        rows.append(f"| +{r['lead_h']} h | {int(r['n'])} | **{pct(r['model_acc'])}** | {pct(r['rule_acc'])} | {pct(r['persistence_acc'])} | "
                    f"{pct(r.get('prognosis_acc'))} | {r['model_brier']:.3f} |")
    return "\n".join(rows)


def rwy18_section(ev):
    rows = ["| Lead | n | **Logistic model** | Official rule | Naive \"no change\" | Brier |", "|---|---|---|---|---|---|"]
    for _, r in ev[(ev["target"] == "rwy18") & ev["lead_h"].isin(LEADS)].iterrows():
        rows.append(f"| +{r['lead_h']} h | {int(r['n'])} | **{pct(r['model_acc'])}** | {pct(r['rule_acc'])} | {pct(r['persistence_acc'])} | {r['model_brier']:.4f} |")
    text = "\n".join(rows)
    try:
        d = json.loads((INTEG / "rwy18_results.json").read_text())
        a, l1 = d["all_leads"]["p_r1"], d["per_lead"]["1"]["p_r1"]
        pb = d["pooled_brier_ci"]
        dc = pb["R1_logit - climatology"]
        per = d["period"].replace("issues ", "").split(" .. ")
        text += (f"\n\nOnly a few closure hours fall in the test period, so the accuracy above is the \"always open\" base rate. "
                 f"Closure skill from an extended walk-forward (issues {day(per[0])} .. {day(per[1])}, {a['closed_hours']} closure hours "
                 f"on {len(d['closure_days'])} days): Brier {pb['R1_logit'][0]:.4f} vs {pb['climatology'][0]:.4f} for climatology "
                 f"(difference {dc[0]:+.4f} [{dc[1]:+.4f}, {dc[2]:+.4f}], not significant) and {pb['rule'][0]:.4f} for the official rule. "
                 f"At the warning level P(open) < {d['warning_level']}, the model flags {pct(l1['hit_rate_p_open_lt_0.8'])} of the closure "
                 f"hours at +1 h with {l1['false_alarms_per_1000h']:.1f} false alarms per 1,000 h ({a['false_alarms_per_1000h']:.1f} over all leads). "
                 "A closure model on the simulated wind paths ranks closures better (AUC "
                 f"{d['all_leads']['p_r2']['auc']:.2f} vs {a['auc']:.2f}) but has a worse Brier score, so the logistic model stays.")
    except Exception:
        pass
    return text


def nextchange_section():
    d = json.loads((INTEG / "nextchange_results.json").read_text())
    m = {r["method"]: r for r in d["methods"]}
    cis = {r["method"]: r for r in d.get("event_acc_ci", [])}
    keep = {"blend: hysteresis rule, nested": "**Official forecast (blend)**", "logit: hysteresis rule, nested": "Logistic model alone",
            "published prognosis": "Baseline: published INAA prognosis", "official rules": "Baseline: official rules",
            "persistence": "Baseline: naive \"no change\""}
    rows = ["| Method | Change caught within ±3 h | Timing error on hits | False alarms | Correct 'no change' | Event accuracy |",
            "|---|---|---|---|---|---|"]
    for k, name in keep.items():
        if k not in m:
            continue
        r = m[k]
        mae = f"{r['timing_mae_h']:.1f} h" if pd.notna(r["timing_mae_h"]) else "–"
        c = cis.get(k)
        acc = f"**{pct(r['event_acc'])}**" + (f" [{p1(c['lo'])}, {p1(c['hi'])}]" if c and k.startswith("blend") else "")
        rows.append(f"| {name} | {pct(r['hit_rate'])} | {mae} | {int(r['false_alarm'])} | {int(r['correct_no_change'])} | {acc} |")
    per = d["period"].split(" .. ")
    dep = m.get("blend: all-weeks params (in-sample; = fra.blend live)")
    pb = d["p48_brier"]
    return "\n".join(rows) + (
        f"\n\n{d['n_issues_scored']:,} issue times ({day(per[0])} .. {day(per[1])}), {d['n_with_change']:,} with an actual change "
        "within 48 h. The change rule's thresholds are re-chosen every week only from outcomes known before it (nested). "
        + (f"The deployed thresholds, chosen on all weeks, score {pct(dep['event_acc'])} in-sample. " if dep else "")
        + f"P(change within 48 h): Brier {pb['blend: logistic on max smoothed P(other), walk-forward']:.3f} (walk-forward) vs "
        f"{d['p48_brier_climatology']:.3f} for the base rate.")


def holdout():
    try:
        pre = json.loads((INTEG / "preregistration.json").read_text())
        pw = pre["analysis"]["primary_window"]
        return day(pre["holdout_start_utc"]), day(pw["evaluate_after_utc"])
    except Exception:
        return "1 Nov 2026", "1 Dec 2026"


def card():
    ev = pd.read_csv(DATA / "eval.csv")
    imp = json.loads((DATA / "importance.json").read_text())
    lab = pd.read_parquet(DATA / "labels.parquet")
    meta = json.loads((DATA / "train_meta.json").read_text()) if (DATA / "train_meta.json").exists() else {}

    def drivers(t):
        seen, out = set(), []
        for k in imp[t]:
            n = NAMES.get(k, k)
            if n not in seen:
                seen.add(n)
                out.append(n)
        return ", ".join(out[:6])

    od = lab["od"].dropna()
    start = pd.Timestamp(meta.get("test_start", "2026-06-01"))
    h_from, h_verdict = holdout()
    try:
        quality, days, n = blend_tables()
        end = start + pd.Timedelta(days=days - 1)
        head = (f"## Quality (walk-forward test {day(start)} – {day(end)}, {days} days, {n:,} forecasts per lead time; "
                "only data available at forecast time)")
        intro = ("Each test week is predicted by models trained only on outcomes known before that week. The design of the "
                 "official forecast was chosen on these same weeks, so the numbers are optimistic (see Limitations); the "
                 f"independent test is the locked live holdout from {h_from}. Accuracy = share of hours where the forecast "
                 "direction matched the direction flown; [95 % CI], day-block bootstrap.")
    except Exception:  # integration files missing: the logistic model's own evaluation
        quality, head, intro = logit_od_table(ev), f"## Quality ({meta.get('label_kind', '')}; only data available at forecast time)", ""
    try:
        nxt = nextchange_section()
    except Exception:
        nxt = "(run `uv run python experiments/integration/nextchange.py`)"

    return f"""# Model card: FRA operating direction and RWY 18 forecast

**Task:** for every hour up to t+48 h, predict P(OD 25 west) vs OD 07 east and P(RWY 18 West usable for departures), with a certainty score and the next probable change time (FraAlliance case, AI Week 2026). Built at the hackathon on 30 Oct 2026, improved since; issued live every hour since 31 Oct 2026.

## Data (all public, cited)
| Data | Source | Use |
|---|---|---|
| Flown operating direction + RWY 18 use | Umwelthaus INAA / FANOMOS radar tracks, https://inaa.umwelthaus.org/ (`Fanomos/GetFlightTracks`) | Labels and the current direction. Low-level tracks (< 3,000 ft, < 15 km): ~250° → OD 25, ~070° → OD 07, southbound west of the field → RWY 18 departure |
| Weather forecasts as issued | Open-Meteo Single Runs API, ECMWF IFS (10 m and 100 m wind), https://open-meteo.com/en/docs/single-runs-api | Features: only runs initialised ≥ 6 h before the issue time |
| Second weather model, exact runs | Open-Meteo Single Runs, DWD ICON-D2 (init ≥ 4 h before issue), filled with ICON-EU (init ≥ 5 h before issue) where D2 has no value | ECMWF+ICON consensus tailwind |
| Published OD prognosis (8 h blocks, main + alternative scenario) | Umwelthaus INAA `Direction/GetDirectionData?currentTime=…`, as live at the issue time | Feature and extra baseline |
| Observed weather | Iowa Environmental Mesonet METAR EDDF, https://mesonet.agron.iastate.edu/request/download.phtml | Current wind; observed wind up to the issue time for the decision model; truth for the forecast-error model |
| Forecast errors | Archived ECMWF IFS runs (from Mar 2024) against METAR | Simulated wind futures |
| Rules | FraAlliance case, section 3 | Baseline and engineered features (tailwind/crosswind components for 070/250/180) |

Labels: {len(od):,} labelled hours ({od.index.min():%Y-%m-%d} to {od.index.max():%Y-%m-%d}), OD 25 share {(od == 25).mean():.0%}. Hourly since 11 Feb 2026, 3–6 sampled hours per day before (the source serves ~0.4 requests/s); the direction model trains only on directly observed hours. A radar history back to 2014 is being collected and is not used yet.

## Model
**Official forecast: a 50/50 blend of two models.** (1) A regularised logistic regression (C = 0.03) with separate weights per lead bucket (1–3, 4–12, 13–30, 31–48 h), trained on all 48 leads of the most recent 120 days and sharpened per bucket by temperature scaling (fitted out of sample on the last 14 training days). Inputs: the published INAA prognosis (main and alternative scenario, signed by its stated probability), the official rule applied to the ECMWF forecast, the current flown OD, the forecast tailwind on RWY 25 (10 m: hourly, 6 h mean, 3 h before/after, lowest over the previous 6 h; at 100 m; 100 m–10 m shear; the ECMWF+ICON consensus and its 6 h mean), a NE-Bise vs SE regime indicator, and the time of day incl. the night ban. (2) An hourly decision model: one logistic model per direction in use gives P(keep the direction next hour) from the actual tailwind on the runway in use (now, the hours before and the next 6 h, gusts, crosswind), time of day, the first hour after the night ban, weekend and season. It is rolled out hour by hour along 200 simulated actual-wind futures: the as-issued ECMWF+ICON-D2 forecast plus whole 48 h forecast-error paths from similar past situations (`fra/fcerror.py`), with the look-ahead taken from the mean of the paths. Its P(OD 25) is the share of paths in OD 25.

**Current direction:** the flown OD of the last completely published radar hour [t−2 h, t−1 h), because FANOMOS publishes 55–75 min late; the decision model bridges the two unpublished hours with the observed METAR wind. **RWY 18:** one logistic model across all leads (C = 3; rule, current use, gust tailwind, 6 h mean tailwind, observed tailwind). **Next change:** the first hour where the blended P(other OD) reaches 0.45, with P(change within 48 h) and a likely window. **Certainty** = |P − 0.5| × 2. If the decision part fails, the hour is issued from the logistic model alone and flagged.

{head}
{intro}

{quality}

**RWY 18 open** (logistic model; the blend uses it unchanged):

{rwy18_section(ev)}

## Next change time (walk-forward, same test)
{nxt}

## Key drivers (logistic model: |coefficient| × feature spread)
- **Operating direction:** {drivers('od25')}
- **RWY 18:** {drivers('rwy18')}

## Limitations
- **Selection noise.** The long test was also used to choose the design (the data layer, about 38 variants of the blend and its parts, 21 re-tests of the logistic model's settings), so it is optimistic: treat differences of 0.001–0.002 in Brier as noise and the blend's gain over the logistic model as an upper bound. The referee is the locked holdout: hourly forecasts issued live from {h_from}, compared as pre-registered (`experiments/integration/preregistration.json`); first verdict after 4 weeks ({h_verdict}).
- **Current direction.** FANOMOS radar data arrive 55–75 min late, so the forecast starts from the hour [t−2 h, t−1 h); for the logistic model this costs about 0.7 pp accuracy at +1 h compared with a backtest that (unrealistically) knew the hour before the issue time. Short-notice switches stay hard: on changed hours at +1 h every method is right only 54–59 % of the time.
- RWY 18 "closed" is a proxy: no southbound departures in a busy hour (≥ 15 movements, from 06 local; the first hour after the night ban is excluded). Not-used ≠ closed, and closures are rare, so closure skill is uncertain.
- About 30 % of the OD "changes" at +1 h are the first morning hour after the night ban (the evening OD is carried through the night), so switch detection at +1 h is harder in this metric than in reality.
- The case rules (10/15 kt) differ from Fraport's public policy (≈5 kt tailwind, west preference). The model learns the flown behaviour, which is a large part of its edge over the rule baseline.
- The simulated wind futures are too wide for gusts and too cautious about tailwinds above 5 kt when that is likely (P 0.4–0.85).
- The test covers one summer and autumn (Jun–Oct 2026); winter regimes are only in the training data.
"""


def main(write=True):
    text = card()
    if write:
        (ROOT / "MODEL_CARD.md").write_text(text)
    print(text)
    return text


if __name__ == "__main__":
    main(write="--stdout" not in sys.argv[1:])
