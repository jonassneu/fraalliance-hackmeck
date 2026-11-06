"""Jury dashboard "Runway Operations" -> site/index.html (plus the 3D view site/airport3d.html via fra.scene3d).

    uv run python -m fra.dashboard [forecast_csv]      (default: newest data/forecast_*.csv)

Built for the duty planner, laid out as one laptop screen in a quiet Apple-style look (fra.siteui): one summary
surface on top (operating direction, next direction change, Runway 18 West), the 48 h timeline below with our
forecast, the published Umwelthaus prognosis, Runway 18 and wind as lanes, and a 2D map of the paths next to it
(the full 3D view is airport3d.html). Tall windows scroll instead of stretching; under 900 px it is one column. Hovering the timeline previews an hour, a click or drag holds it; the summary and the 3D view
follow the shown hour. Keys: arrows step / jump between events, Space plays, Esc returns to now.
Self-contained page (inline CSS + JS, data as JSON); times are rendered client-side so the Local/UTC switch works
offline.

Live operation (ops/README.md): fra.archive issues a forecast every hour into data/archive/issued/ and rebuilds the
site from it; a strip below the summary shows the alerts (fra.alerts) and the live record of those hourly forecasts
(fra.scoring), refreshed from site/alerts.json and site/live_record.json when served over http. For issued forecasts
the published prognosis and the wind come from what fra.archive retrieved at the issue hour.
"""

import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd

from fra import prognosis, scene3d, siteui

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
SITE = ROOT / "site"
# live operation (fra.archive / fra.scoring / fra.alerts): forecasts issued every hour, the published prognosis and
# the ECMWF wind as retrieved live, and the scored live record
ISSUED = DATA / "archive" / "issued"
PROG_LIVE = DATA / "archive" / "prognosis_live.parquet"
LIVE_RECORD = DATA / "archive" / "live_record.json"
RUNS_3D = 24  # newest issued forecasts embedded in the 3D view (plus the hackathon runs in data/)


# ---------------------------------------------------------------- data

def newest_forecast():
    files = sorted([*DATA.glob("forecast_*.csv"), *ISSUED.glob("forecast_*.csv")], key=lambda p: p.stat().st_mtime)
    if not files:
        sys.exit("no data/forecast_*.csv found - run `uv run python -m fra.predict` first")
    return files[-1]


def load_forecast(path):
    f = pd.read_csv(path)
    f["valid_utc"] = pd.to_datetime(f["valid_utc"], utc=True)
    f = f.sort_values("valid_utc").reset_index(drop=True)
    if "od_pred" not in f:
        f["od_pred"] = np.where(f["p_od25"] >= 0.5, 25, 7)
    return f


def iso(ts):
    return None if ts is None or pd.isna(ts) else pd.Timestamp(ts).tz_convert("UTC").isoformat()


def flown_od():
    """Flown OD per hour, computed fresh from data/inaa_counts.csv (incl. the forward hours fra.archive appends);
    falls back to data/labels.parquet."""
    try:
        from fra.labels import load_counts, to_labels
        return to_labels(load_counts())["od"]
    except Exception:
        p = DATA / "labels.parquet"
        return pd.read_parquet(p)["od"] if p.exists() else None


def in_use_since(issue, od_now):
    """Start of the current flown operating direction (INAA radar labels), None if the labels are stale."""
    lab = flown_od()
    if lab is None:
        return None
    lab = lab.dropna()
    lab = lab[lab.index <= issue]
    if lab.empty or issue - lab.index[-1] > pd.Timedelta(hours=12):
        return None
    other = lab[lab != od_now]
    return other.index[-1] + pd.Timedelta(hours=1) if len(other) else lab.index[0]


def next_change(f, od_now):
    """(time, window start, window end, probability of a change within 48 h) from the forecast CSV.

    Older forecast files lack the change-time columns: fall back to the first sustained crossing of P = 0.5."""
    row = f.iloc[0]
    if "next_change_utc" in f:
        t = pd.to_datetime(row["next_change_utc"], utc=True) if pd.notna(row["next_change_utc"]) else None
        ws = pd.to_datetime(row["change_window_start"], utc=True) if pd.notna(row.get("change_window_start")) else t
        we = pd.to_datetime(row["change_window_end"], utc=True) if pd.notna(row.get("change_window_end")) else t
        p = float(row["p_change_48h"]) if pd.notna(row.get("p_change_48h")) else None
        return t, ws, we, p
    other = f["p_od25"].values if od_now == 7 else 1 - f["p_od25"].values
    sm = pd.Series(other).rolling(3, center=True, min_periods=1).mean().values
    flip = (sm >= 0.5) & (np.append(sm[1:], 0) >= 0.5)
    if not flip.any():
        return None, None, None, float(other.max())
    i = int(np.argmax(flip))
    t = f["valid_utc"].iloc[i]
    return t, t - pd.Timedelta(hours=1), t + pd.Timedelta(hours=1), float(sm[i:i + 6].mean())


INTEGRATION = ROOT / "experiments" / "integration"   # walk-forward backtest of the blended forecast (fra.blend)


def official_kind():
    """'blend' if the registry champion (the official forecast) is the blended forecast (fra.blend), else 'logit'."""
    try:
        reg = json.loads((DATA / "archive" / "variants.json").read_text())
        ch = next(v for v in reg.get("variants", []) if v.get("role") == "champion" and v.get("enabled", True))
        return "blend" if str(ch.get("entry", "")).startswith("fra.blend:") else "logit"
    except Exception:
        return "logit"


def blend_backtest(r4):
    """OD rows (leads 1/6/24/48) and next-change numbers of the blended forecast on the long walk-forward test
    (experiments/integration/final_eval_od.csv, final_wf_long.parquet, nextchange_results.json); None if missing."""
    try:
        t = pd.read_csv(INTEGRATION / "final_eval_od.csv")
        t = t[(t["period"] == "long") & (t["metric"] == "acc")]
        try:  # changed hours per lead (only for the hover text; the large prediction table is not committed)
            wf = pd.read_parquet(INTEGRATION / "final_wf_long.parquet", columns=["lead", "od", "od_now", "p_blend"])
            wf = wf[wf["p_blend"].notna()]
        except Exception:
            wf = None
        g = lambda L, m: t[(t["lead"] == L) & (t["method"] == m)]
        rows = []
        for L in (1, 6, 24, 48):
            if g(L, "blend").empty:
                return None
            w = wf[wf["lead"] == L] if wf is not None else None
            rows.append(dict(lead=L, acc=r4(g(L, "blend")["est"].iloc[0]), rule=r4(g(L, "rules")["est"].iloc[0]),
                             prog=r4(g(L, "prognosis")["est"].iloc[0]), pers=r4(g(L, "persistence")["est"].iloc[0]),
                             n=int(g(L, "blend")["n"].iloc[0]),
                             changed=None if w is None else int((w["od"] != w["od_now"]).sum())))
        nc = json.loads((INTEGRATION / "nextchange_results.json").read_text())
        m = {x["method"]: x for x in nc["methods"]}
        pick = {"model": "blend: hysteresis rule, nested", "rule": "official rules", "prog": "published prognosis"}
        sw = None
        if all(v in m for v in pick.values()):
            sw = {k: dict(hit=r4(m[v]["hit_rate"]), mae=r4(m[v]["timing_mae_h"]), fa=int(m[v]["false_alarm"]),
                          acc=r4(m[v]["event_acc"])) for k, v in pick.items()}
            sw["n"], sw["changes"] = int(m[pick["model"]]["n_issues"]), int(m[pick["model"]]["n_actual_change"])
        return rows, sw
    except Exception:
        return None


def test_info(kind):
    """How the backtest was made, for the honest framing on the site: the long walk-forward test (period, days,
    forecasts per lead), the pooled Brier(1,6,24,48) of the official forecast vs the logistic model alone and the
    published prognosis with 95 % day-block bootstrap CIs, the part before 2026-09-15, and the locked live holdout.
    Blend: experiments/integration/final_eval_od.csv; logit: data/eval_long_ci.csv + data/train_meta.json.
    None if the files are missing."""
    try:
        meta = json.loads((DATA / "train_meta.json").read_text()) if (DATA / "train_meta.json").exists() else {}
        out = dict(kind=kind, start=meta.get("test_start", "2026-06-01"), selection=meta.get("selection_start", "2026-09-15"),
                   holdout=meta.get("holdout_start", "2026-11-01"), verdict="2026-12-01", verdict_weeks=4)
        try:  # the pre-registered first verdict of the holdout (4 weeks of issue times, evaluated after their labels)
            pre = json.loads((INTEGRATION / "preregistration.json").read_text())
            pw = pre["analysis"]["primary_window"]
            out["verdict"] = str(pw["evaluate_after_utc"])[:10]
            out["verdict_weeks"] = round((pd.Timestamp(pw["issue_to_utc"]) - pd.Timestamp(pw["issue_from_utc"])).days / 7)
        except Exception:
            pass
        r = lambda v: None if v is None or pd.isna(v) else round(float(v), 4)
        if kind == "blend":
            t = pd.read_csv(INTEGRATION / "final_eval_od.csv")
            get = lambda per, met, L, m: t[(t["period"] == per) & (t["metric"] == met) & (t["lead"] == L) & (t["method"] == m)]
            one = get("long", "acc", 1, "blend").iloc[0]
            ci = lambda per, m: [r(x) for x in get(per, "brier", 0, m)[["est", "lo", "hi"]].iloc[0]]
            out.update(days=int(one["n_days"]), n=int(one["n"]), brier=ci("long", "blend"), brier_logit=ci("long", "logit"),
                       brier_prog=ci("long", "prognosis"), brier_diff=ci("long", "blend - logit"),
                       pre=dict(days=int(get("pre_sep15_part", "acc", 1, "blend")["n_days"].iloc[0]),
                                acc24=r(get("pre_sep15_part", "acc", 24, "blend")["est"].iloc[0]),
                                acc24_logit=r(get("pre_sep15_part", "acc", 24, "logit")["est"].iloc[0]),
                                acc24_prog=r(get("pre_sep15_part", "acc", 24, "prognosis")["est"].iloc[0]),
                                brier=ci("pre_sep15_part", "blend"), brier_logit=ci("pre_sep15_part", "logit")))
        else:
            t = pd.read_csv(DATA / "eval_long_ci.csv")
            t = t[(t["target"] == "od25") & (t["rows"] == "all")]
            one = t[(t["metric"] == "acc") & (t["lead"] == 1) & (t["method"] == "model")].iloc[0]
            b = t[(t["metric"] == "brier") & (t["lead"] == 0) & (t["method"] == "model")]
            out.update(days=int(one["n_days"]), n=int(one["n"]),
                       brier=[r(x) for x in b[["est", "lo", "hi"]].iloc[0]] if len(b) else None)
        return out
    except Exception:
        return None


def quality():
    """Walk-forward backtest of the OFFICIAL forecast for the site: the blend's (fra.blend, experiments/integration)
    when the registry champion is the blend, else the logit's (data/eval.csv, data/changetime_eval.csv). RWY 18 is
    the logit's in both cases (the blend takes P(RWY 18 open) from the logit). These are walk-forward numbers (each
    week forecast by models fitted only on earlier data), but the design was chosen on the same weeks; the independent
    test is the live record from 1 Nov 2026 (kind / honest in the output)."""
    p = DATA / "eval.csv"
    if not p.exists():
        return None
    ev = pd.read_csv(p)
    r4 = lambda v: None if pd.isna(v) else round(float(v), 4)
    out = {}
    for target in ("od25", "rwy18"):
        rows = ev[ev["target"] == target].sort_values("lead_h")
        out[target] = [dict(lead=int(r.lead_h), acc=r4(r.model_acc), rule=r4(r.rule_acc), prog=r4(r.prognosis_acc),
                            pers=r4(r.persistence_acc), n=int(r.n), changed=int(r.n_changed)) for r in rows.itertuples()]
    meta = DATA / "train_meta.json"
    out["test"] = json.loads(meta.read_text()).get("label_kind", "") if meta.exists() else ""
    out["kind"] = "logit"
    bb = blend_backtest(r4) if official_kind() == "blend" else None
    if bb is not None:
        out["od25"], out["kind"] = bb[0], "blend"
    out["test_info"] = test_info(out["kind"])
    if bb is not None:
        if bb[1] is not None:
            out["switch"] = bb[1]
            return out
    ct = DATA / "changetime_eval.csv"  # next-change timing, walk-forward (fra.changetime)
    if ct.exists():
        c = pd.read_csv(ct).set_index("method")
        pick = {"model": "model (nested-tuned rule)", "rule": "official rules (rule_od25)",
                "prog": "published prognosis (main >= 0.5)"}
        if all(v in c.index for v in pick.values()):
            out["switch"] = {k: dict(hit=r4(c.at[v, "hit_rate"]), mae=r4(c.at[v, "timing_mae_h"]),
                                     fa=int(c.at[v, "false_alarm"]), acc=r4(c.at[v, "event_acc"]))
                             for k, v in pick.items()}
            out["switch"]["n"] = int(c.at[pick["model"], "n_issues"])
            out["switch"]["changes"] = int(c.at[pick["model"], "n_actual_change"])
    return out


def published_prognosis(issue, valid):
    """Umwelthaus OD prognosis as published at the issue time (latest archived as-of <= issue, at most 3 h old):
    P(west) per valid hour (1 = OD 25, 0 = OD 07, 0.5 = mixed) and the stated probability. None if unavailable.
    Sources: data/prognosis.parquet (history) and data/archive/prognosis_live.parquet (fetched hourly by fra.archive)."""
    parts = []
    for p in (prognosis.ARCHIVE, PROG_LIVE):
        try:
            a = pd.read_parquet(p, columns=["asof", "kind", "start", "state", "prob"])
            parts.append(a[a["asof"] <= issue])
        except Exception:
            pass
    if not parts:
        return None
    arch = pd.concat(parts, ignore_index=True).drop_duplicates(["asof", "kind", "start"], keep="last")
    asof = arch["asof"].max()
    if pd.isna(asof) or issue - asof > pd.Timedelta(hours=3):
        return None
    leads = [int(round((v - asof) / pd.Timedelta(hours=1))) for v in valid]
    f = prognosis.features(pd.DatetimeIndex([asof]), leads, arch[arch["asof"] == asof]).set_index("lead")
    return dict(asof=asof, west=[f.at[l, "prog_main_west"] for l in leads], prob=[f.at[l, "prog_main_prob"] for l in leads])


def traffic():
    """Typical movements per local hour and the share of departures on Runway 18 (INAA radar counts)."""
    try:
        from fra.live import hourly_profile
        prof, _ = hourly_profile()
        # share of departures on Runway 18 from the case briefing (6 of 10); the radar estimate (share18) is rougher
        return dict(perHour=[round(float(prof.get(h, 0))) for h in range(24)], share18=0.6)
    except Exception:
        return None


def run_hours(path):
    """scene3d.forecast_payload (hourly p25 / p18 / od / rule + ECMWF IFS wind from data/ifs_runs.parquet). For live
    forecasts that archive is older than usual (> 12 h before the issue), so the wind is taken from the live ECMWF IFS
    forecast fra.archive retrieved at the issue hour instead (display only, the model fetches its own inputs)."""
    run = scene3d.forecast_payload(Path(path))
    issue = pd.Timestamp(run["issue"])
    init = pd.to_datetime(run.get("wind_init"), utc=True, errors="coerce")
    if pd.notna(init) and init >= issue - pd.Timedelta(hours=12):
        return run
    try:
        from fra.archive import latest_live_wind
        w = latest_live_wind(issue)
    except Exception:
        w = None
    if w is None:
        return run
    for h in run["hours"]:
        t = pd.Timestamp(h["t"])
        if t in w.index and pd.notna(w.at[t, "wind_speed"]):
            h.update(wd=round(float(w.at[t, "wind_direction"])), ws=round(float(w.at[t, "wind_speed"]), 1),
                     wg=round(float(w.at[t, "wind_gusts"]), 1))
    run["wind_init"] = w.attrs.get("init")
    return run


def alerts_for(path):
    """Planning alerts for this forecast, evaluated now (fra.alerts, same thresholds as site/alerts.json): alerts,
    stale flag (forecast older than fra.alerts.STALE_H: no alerts from it) and the stale message."""
    try:
        from fra import alerts
        rec = alerts.compute(path)
        return dict(alerts=rec["alerts"], stale=bool(rec.get("stale")), message=rec.get("message"), issue=rec.get("issue"))
    except Exception as e:
        print(f"alerts unavailable: {e}")
        return dict(alerts=[], stale=False, message=None, issue=None)


def live_record():
    """Compact live record for the panel (fra.scoring -> data/archive/live_record.json); 'collecting' until the
    first issued forecasts can be scored."""
    try:
        rec = json.loads(LIVE_RECORD.read_text())
    except Exception:
        first = sorted(ISSUED.glob("forecast_*.csv"))
        start = pd.to_datetime(first[0].stem[9:], format="%Y%m%dT%H", utc=True) if first else None
        return dict(status="collecting", start=iso(start), windows={})
    keys = ("name", "n_issues", "n_scored_issues", "first_issue", "last_issue", "od", "switch", "coverage")
    return dict({k: rec.get(k) for k in ("status", "start", "labels_until", "n_forecasts", "generated", "rolling_days",
                                         "holdout_from")},
                windows={k: {kk: w.get(kk) for kk in keys} for k, w in rec.get("windows", {}).items()})


def map_geo():
    """Runway centre lines (end points) and the airport outline for the 2D paths map, in metres east / north of the
    aerodrome reference point (data/scene3d.json, OSM). None without the cache."""
    try:
        g = json.loads((DATA / "scene3d.json").read_text())
    except Exception:
        return None
    rws = [dict(ref=r["ref"], a=r["p"][0], b=r["p"][-1]) for r in g.get("runways", [])]
    ring = (g.get("aerodrome") or [[]])[0]
    return dict(runways=rws, area=[[round(x, -1), round(y, -1)] for x, y in ring[::4]])


def official_windows(hours, change_t=None, gap_h=2):
    """The hours where the published INAA prognosis disagrees with ours, as windows [start, end) (end = the first hour
    after the window, the one convention for the tag and its tooltip). An hour counts when INAA says the other
    direction (west >= 0.75 or <= 0.25 against our od), or "change possible" (0.25 < west < 0.75) while we are >= 90 %
    sure, except within 3 h of our own predicted switch. Windows separated by <= gap_h hours are merged. Computed once
    here and passed to both pages, so the dashboard (desktop and phone) and the 3D view show the same windows."""
    ts = [pd.Timestamp(h["t"]) for h in hours]
    ci = None if change_t is None else min(range(len(ts)), key=lambda i: abs((ts[i] - pd.Timestamp(change_t)).total_seconds()))
    idx = []
    for i, h in enumerate(hours):
        if "pg" not in h:
            continue
        w = h["pg"]
        s = 25 if w >= 0.75 else 7 if w <= 0.25 else 0
        sure = max(h["p25"], 1 - h["p25"]) >= 0.9
        if (s and s != h["od"]) or (s == 0 and sure and (ci is None or abs(i - ci) > 3)):
            idx.append(i)
    wins = []
    for i in idx:
        if wins and i - wins[-1][1] <= gap_h + 1:
            wins[-1][1] = i
        else:
            wins.append([i, i])
    return [dict(start=iso(ts[a]), end=iso(ts[b] + pd.Timedelta(hours=1)),
                 kind="possible" if any(0.25 < hours[k]["pg"] < 0.75 for k in range(a, b + 1) if "pg" in hours[k]) else "switch")
            for a, b in wins]


def payload(path):
    f = load_forecast(path)
    run = run_hours(path)  # hourly p25 / p18 / od / rule + ECMWF IFS wind
    issue = pd.Timestamp(run["issue"])
    od_now = int(f["od_now"].iloc[0]) if "od_now" in f and pd.notna(f["od_now"].iloc[0]) else int(f["od_pred"].iloc[0])
    t, ws, we, p_change = next_change(f, od_now)
    p6 = f["p_od25"].values[:6]
    conf6 = np.maximum(p6, 1 - p6).mean()  # how sure the model is about the direction it predicts
    hours = run["hours"]
    if t is not None:  # the switch time is the first forecast hour in the other direction: the same hour the 3D view and the chart show
        flip = next((h for h in hours if pd.Timestamp(h["t"]) >= issue.floor("h") and h["od"] != od_now), None)
        if flip is not None:
            t = pd.Timestamp(flip["t"])
    pg = published_prognosis(issue, [pd.Timestamp(h["t"]) for h in hours])
    al = alerts_for(path)
    if pg:
        for h, w, pr in zip(hours, pg["west"], pg["prob"]):
            if pd.notna(w):
                h["pg"], h["pgp"] = round(float(w), 2), round(float(pr), 2)
    return dict(run=Path(path).name, issue=iso(issue), wind_init=iso(pd.Timestamp(run["wind_init"]))
                if run.get("wind_init") else None, generated=iso(pd.Timestamp.now("UTC")),
                od_now=od_now, since=iso(in_use_since(issue, od_now)), conf6=round(float(conf6), 3),
                change=None if t is None else dict(t=iso(t), start=iso(ws), end=iso(we)), p_change=p_change,
                hours=hours, pgwin=official_windows(hours, t), quality=quality(), prog_asof=iso(pg["asof"]) if pg else None, traffic=traffic(),
                alerts=al["alerts"], alerts_stale=al["stale"], alerts_msg=al["message"], alerts_issue=al["issue"],
                live=live_record(), geo=map_geo())


# ---------------------------------------------------------------- page

ICONS = dict(
    up='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V5M6 11l6-6 6 6"/></svg>',
    play='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.6v14.8a1 1 0 0 0 1.52.85l12.1-7.4a1 1 0 0 0 0-1.7L8.52 3.75A1 1 0 0 0 7 4.6z"/></svg>',
    pause='<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5.5" y="4" width="4.6" height="16" rx="1.4"/><rect x="13.9" y="4" width="4.6" height="16" rx="1.4"/></svg>',
    copy='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',
    layout='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M10 4v16M10 12h11"/></svg>',
    ok='<svg class="st" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12.5 2.8 2.8L16.5 9.5"/></svg>',
    no='<svg class="st" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>',
    expand='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
    pin='<svg class="pinG" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l-1 6 3 3v2h-4v7l-1 1-1-1v-7H7v-2l3-3z" fill="currentColor"/></svg>',
)

CSS = """
/* one rule per selector and breakpoint (consolidated); colour by job: East navy, West teal, official orange, tailwind red */
html,body{overflow-x:hidden;overflow-y:auto}
html{color-scheme:light}
body{display:flex;flex-direction:column}
main{position:relative;flex:none;display:grid;grid-template-columns:repeat(24,minmax(0,1fr));grid-template-rows:repeat(23,var(--rowh,21px));padding:0 18px 14px}
.topbar .nav{margin-left:-8px}
.eyebrow{margin:0;font-size:15px;color:var(--ink2)}
.answer{display:flex;align-items:center;gap:16px;margin-top:6px}
.headline .sep{color:var(--ink2);font-weight:400}
.headline .qual{font-weight:500;color:var(--ink2)}
.ipill{flex:none;padding:3px 10px;border-radius:999px;background:var(--fill);font-size:13px;color:var(--ink2);white-space:nowrap}
.stats3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin:16px 0 0;padding-top:12px;border-top:1px solid var(--line)}
.stats3>div{display:flex;flex-direction:column;gap:2px;min-width:0}
.stats3 dd{margin:0;font-size:24px;font-weight:600;letter-spacing:-.02em;line-height:1.1;color:var(--ink);white-space:nowrap}
.stats3 dt{font-size:13px;line-height:1.35;color:var(--ink)}
.stats3 .of{font-size:13px;color:var(--ink2)}
abbr[title]{text-decoration:underline dotted var(--b1);text-underline-offset:3px;cursor:help}
.cell{position:relative;display:flex;min-width:0;min-height:0;padding:6px}
.cell>.card{flex:1;min-width:0;min-height:0;overflow:hidden}
.pc{display:flex;flex-direction:column;padding:16px 24px}
.hcol{display:flex;flex-direction:column;min-width:0}
.hcol.hnow{grid-column:1;grid-row:1}
.hcol.out{border-left:1px solid var(--line);padding-left:32px;grid-column:2;grid-row:1}
.more{grid-column:1;grid-row:1;align-self:end;margin-top:12px;padding-top:8px;border-top:1px solid var(--line);font-size:13px;color:var(--ink2)}
.more summary{cursor:pointer;font-weight:500;color:var(--ink2);width:max-content}
.morebody{display:flex;flex-direction:column;gap:10px;margin-top:10px}
.r18line{display:flex;align-items:center;gap:10px}
.r18line b{color:var(--ink);font-weight:600}
.method{margin-top:auto;padding-top:10px;font-size:13px;color:var(--ink2)}
.method b{font-weight:600;color:var(--ink)}
.method .mt{width:100%;font-size:12px;color:var(--ink3)}
.pill{padding:1px 8px;border-radius:999px;background:var(--fill);font-size:13px;font-weight:500;color:var(--ink2);white-space:nowrap}
.pill:empty{display:none}
.tag{font-size:13px;font-weight:500;line-height:20px;padding:0 8px;border-radius:6px;background:var(--fill);color:var(--ink)}
.tag.later{background:var(--ink);color:var(--on-ink)}
.back{margin-left:auto;font-size:13px;font-weight:500;color:var(--ink);text-decoration:underline;text-decoration-color:var(--b2);text-underline-offset:4px}
.back:hover{text-decoration-color:currentColor}
.val{margin-top:12px;min-width:0}
.foot{margin-top:12px;padding-top:12px;border-top:1px solid var(--line);min-width:0}
.foot:empty{display:none}
.glance dd small{font-size:13px}
.rows{margin:0;display:flex;flex-direction:column}
.rows>div{display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding:6px 0;border-top:1px solid var(--line)}
.rows>div:first-child{border-top:0}
.rows dt small{font-size:13px;color:var(--ink3)}
.hcol.out .foot{margin-top:12px;border-top:0;padding-top:0}
.od{display:flex;align-items:center;gap:20px}
.num{flex:none;font:600 36px/1 var(--sans);letter-spacing:-.02em;color:var(--ink)}
.dbadge{min-width:36px;height:28px;font-size:15px;font-weight:600;box-shadow:inset 0 -3px 0 var(--dc,transparent)}
.word{display:flex;align-items:center;gap:12px;font-size:24px;font-weight:500;letter-spacing:-.01em;line-height:1.2}
.desc{margin-top:2px;font-size:15px;line-height:1.5;color:var(--ink2)}
.sw{display:inline-block;width:10px;height:10px;border-radius:3px;flex:none}
.facts{display:grid;grid-template-columns:auto auto;gap:10px 32px;margin:0;justify-content:start}
.dd2{display:block;margin-top:3px;font-size:13px;font-weight:400;color:var(--ink2)}
.facts dt{font-size:13px;color:var(--ink2);white-space:nowrap}
.facts dd{margin:4px 0 0;font:500 15px/1.2 var(--mono);white-space:nowrap}
.facts dd small{font-size:13px;font-weight:400;color:var(--ink2)}
.stats{margin-top:12px;padding-top:4px;border-top:1px solid var(--line)}
.acs:first-child{padding-left:0;border-left:0}
.acs b small{display:block;font-size:13px;font-weight:400;letter-spacing:0;color:var(--ink2)}
.acs>span{font-size:13px;line-height:1.35;color:var(--ink2)}
.rtab th{font-weight:400;font-size:13px;color:var(--ink2);text-align:right;padding:0 0 4px}
.rtab th:first-child,.rtab td:first-child{text-align:left}
.rtab td:first-child{color:var(--ink)}
.rtab .o1{background:rgb(var(--ink-rgb) / .045);color:var(--ink);font-weight:600;text-align:center!important;padding:0 6px}
.rtab th.o1{font-weight:500;border-radius:6px 6px 0 0}
.rtab td.dl{color:var(--ink);font-weight:700}
.rs{display:flex;flex-direction:column;gap:2px;margin-top:8px;padding-top:6px;border-top:1px solid var(--line);font-size:13px;color:var(--ink2)}
.rs b{font-weight:600;color:var(--ink)}
.r18note{margin-top:8px;font-size:13px;color:var(--ink2)}
.r18note:empty{display:none}
.big{display:flex;align-items:baseline;gap:12px;font-size:36px;font-weight:500;letter-spacing:-.015em;line-height:1.15;white-space:nowrap}
.big small{font-size:15px;font-weight:400;letter-spacing:0;color:var(--ink2)}
.big button{font-weight:500;letter-spacing:-.015em}
.big button:hover{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:6px}
.dot{width:12px;height:12px;border-radius:50%;flex:none;align-self:center}
.sub,.flow{margin-top:8px;font-size:13px;color:var(--ink2)}
.flow{display:flex;align-items:center;gap:6px;color:var(--ink)}
.flow b{font-weight:600}
.big2{font-size:18px;font-weight:600;letter-spacing:-.01em;line-height:1.25}
.pnum{margin-left:6px;padding:0 8px;border-radius:6px;background:var(--fill);font-weight:600}
.big3{font-size:18px;font-weight:500}
.badge.sm{font-size:15px}
.status{display:inline-flex;align-items:center;gap:6px;font-weight:600;color:var(--ink)}
.status::before{content:"";width:8px;height:8px;border-radius:50%}
.status.closed::before{background:var(--red)}
.mute{color:var(--ink3)}
.flag b{font-weight:600}
.flag{margin-top:14px;font-size:15px;line-height:1.45;background:transparent;border-left:3px solid var(--b2);border-radius:0;padding:4px 0 4px 12px;color:var(--ink2)}
.flag.ok{border-left-color:var(--line)}
.howbtn{margin-top:8px;font-size:13px;font-weight:500;color:var(--ink2);text-decoration:underline;text-decoration-color:var(--b2);text-underline-offset:3px}
.howpop{position:fixed;z-index:40;max-width:340px;padding:12px 14px;border-radius:10px;background:var(--card);box-shadow:var(--shadow);font-size:13px;line-height:1.5;color:var(--ink2)}
.badge{display:inline-flex;align-items:center;gap:8px;padding:2px 12px 2px 10px;border-radius:999px;background:var(--fill);font-size:18px;font-weight:500}
.badge::before{content:"";width:10px;height:10px;border-radius:50%;background:var(--c,var(--ink3))}
.dirw{display:inline-flex;align-items:center;gap:10px;font-size:24px;font-weight:600}
.dirw i{width:14px;height:14px;border-radius:3px}
.howto{font-size:13px;color:var(--ink3);line-height:1.45}
.howto summary{cursor:pointer;color:var(--ink2);font-weight:500}
.quiet+.quiet{margin-top:8px}
.st{width:28px;height:28px;flex:none;align-self:center}
.notes{margin-top:8px;display:grid;gap:4px;font-size:13px;color:var(--ink2);line-height:1.45}
.notes b,.alert b{color:var(--ink);font-weight:500}
.alert{display:grid;gap:4px;font-size:13px;color:var(--ink2);line-height:1.45}
.alert b{font-size:13px}
.alert b::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);margin-right:8px;vertical-align:1px}
.quiet{font-size:13px;color:var(--ink2);line-height:1.45}
.alerts{display:flex;align-items:center;gap:24px;min-width:0;padding:0 24px;overflow:hidden}
.alerts.on{background:var(--alert-bg);box-shadow:inset 0 0 0 1px rgba(216,57,46,.22)}
.al{display:flex;align-items:center;gap:8px;min-width:0;font-size:13px;color:var(--ink2);white-space:nowrap}
.al span{overflow:hidden;text-overflow:ellipsis}
.al b{display:inline-flex;align-items:center;gap:4px;color:var(--ink);font-weight:500}
.al i{flex:none;width:8px;height:8px;border-radius:50%;background:var(--red)}
.al.watch i{background:none;box-shadow:inset 0 0 0 2px var(--red)}
.al.ok i{background:var(--green)}
.al.stale i{background:var(--ink3)}
.lrec{display:flex;flex-direction:column;min-width:0;padding:12px 20px}
.lrec .lh{display:flex;align-items:center;height:24px;font-size:13px;font-weight:500;color:var(--ink2);cursor:help;flex:none}
.lrec table{width:100%;border-collapse:collapse;margin-top:4px;font-size:13px}
.lrec th{font-weight:400;color:var(--ink3);text-align:right;padding:0 0 4px}
.lrec td{padding:3px 0;border-top:1px solid var(--line);text-align:right;font-family:var(--mono);color:var(--ink2);white-space:nowrap}
.lrec th:first-child,.lrec td:first-child{text-align:left;font-family:var(--sans)}
.lrec td.v{color:var(--ink);font-weight:500;font-size:13px}
.lrec .lq{margin-top:8px;font-size:13px;color:var(--ink2);line-height:1.45}
.hd{display:flex;align-items:center;gap:12px;height:32px;flex:none}
#play svg{width:12px;height:12px}
.c3d{position:relative;overflow:hidden;min-height:0;display:flex;flex-direction:column;padding:16px 20px 14px}
.mhd{display:flex;align-items:center;gap:10px;flex:none;min-width:0}
.mhd .lbl{flex:1;min-width:0}
.chip{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:500;white-space:nowrap;pointer-events:none;user-select:none}
.chip .rw{height:20px}
.chip small{font-size:13px;font-weight:400;color:var(--ink2)}
.map{flex:1;min-height:0;position:relative;margin-top:6px}
.map svg{position:absolute;inset:0;display:block;overflow:hidden}
.map .rwy{stroke:var(--rwy);stroke-width:5;stroke-linecap:butt}
.map svg.e .rwy{stroke:var(--east-line)}
.map svg.w .rwy{stroke:var(--west-line)} /* runways in use in the direction colour (as in 3D); a closed one light grey */
.map .rwy.closed{stroke:rgb(var(--ink-rgb) / .2)!important;opacity:1}
.map .app{fill:none;stroke-width:2;stroke-dasharray:7 5}
.map .dep{fill:none;stroke:var(--ink);stroke-width:2}
.map .arw{fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.map .town{font:400 13px var(--sans);fill:var(--ink2)}
.map .town.under{font-size:13px;font-weight:600;fill:var(--ink)}
.map .tdot{fill:var(--ink3)}
.map .tring{fill:var(--card);stroke:var(--east-line);stroke-width:2}
.map .tcore{fill:var(--east-line)}
.map .town.halo{stroke-width:3px}
.map .ptag{font:500 13px var(--sans);fill:var(--ink2)}
.mlg{display:flex;align-items:center;flex-wrap:wrap;gap:4px 14px;flex:none;margin-top:6px;font-size:13px;color:var(--ink2);white-space:nowrap}
.mlg span{display:inline-flex;align-items:center;gap:6px}
.mlg svg{width:22px;height:10px}
.m3d{margin-left:auto;font-size:13px;font-weight:500;color:var(--ink2);text-decoration:underline;text-decoration-color:var(--b2);text-underline-offset:3px;white-space:nowrap}
.m3d:hover{text-decoration-color:currentColor}
.mv{display:none;position:absolute;inset:6px;z-index:6;border-radius:16px;cursor:grab;touch-action:none;background:rgb(var(--ink-rgb) / .03);box-shadow:inset 0 0 0 1.5px rgb(var(--ink-rgb) / .35);transition:background-color .15s var(--ease)}
body.edit .mv{display:block}
.mv:hover{background:rgb(var(--ink-rgb) / .07)}
.mv b{position:absolute;top:12px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;height:24px;padding:0 10px;border-radius:6px;background:var(--ink);color:var(--on-ink);font-size:13px;font-weight:500;white-space:nowrap;pointer-events:none}
.mv b::before{content:"";width:8px;height:12px;background:radial-gradient(circle,var(--on-ink) 1px,transparent 1.4px) 0 0/4px 4px}
.mv i{position:absolute;right:0;bottom:0;width:28px;height:28px;cursor:nwse-resize}
.mv i::after{content:"";position:absolute;right:8px;bottom:8px;width:10px;height:10px;border-right:2px solid var(--ink);border-bottom:2px solid var(--ink);border-bottom-right-radius:4px}
.cell.lift{z-index:8}
.cell.lift>.card{box-shadow:var(--shadow)}
.cell.lift .mv{cursor:grabbing}
.ghost{display:none;margin:6px;border-radius:16px;border:2px dashed rgb(var(--ink-rgb) / .3);background:rgb(var(--ink-rgb) / .03);pointer-events:none}
body.rzing .ghost{display:block}
body.rzing,body.rzing *{user-select:none}
body.edit iframe{pointer-events:none}
.btn[hidden]{display:none}
#rzbtn,.tl-link{height:auto;padding:0;gap:6px;background:transparent;box-shadow:none;color:var(--ink2);font-size:13px;font-weight:400;text-decoration:underline;text-decoration-color:var(--b2);text-underline-offset:3px}
#rzbtn:hover,.tl-link:hover{background:transparent;color:var(--ink)}
#rzbtn:hover{background:var(--fill)}
#rzbtn[aria-pressed=true]{background:var(--ink);color:var(--on-ink);box-shadow:none;text-decoration:none;padding:2px 8px;border-radius:6px}
.lpg{align-items:flex-end}
.lpg text,.lwd text{font:400 13px var(--sans);font-variant-numeric:tabular-nums;fill:var(--ink2)}
.tchip{fill:var(--card)}
.lpg .base{stroke:rgb(var(--ink-rgb) / .12);stroke-width:1}
.halo{paint-order:stroke;stroke:var(--card);stroke-width:3px;stroke-linejoin:round}
.ruler .pgl{top:auto;bottom:2px}
.pgl{position:absolute;top:3px;padding:0 5px;border-radius:3px;background:rgba(224,138,0,.14);line-height:14px!important;font:500 13px/16px var(--sans);color:var(--inaa-ink);white-space:nowrap}
.pgb{position:absolute;top:-7px;height:6px;border:2px solid var(--amber);border-bottom:0;border-radius:2px 2px 0 0;pointer-events:none}
.lpg>div i{display:block;width:100%;background:var(--west);border-radius:2px 2px 0 0}
.mk.pg{background:var(--asphalt);transform:translateX(-100%)}
.mk.pg:active{transform:translateX(-100%) scale(.95)}
.hl small .sw{width:8px;height:8px;border-radius:2px}
.hl small .sw+.sw{margin-left:4px}
.ln{display:flex;gap:var(--g,2px);min-height:0;position:relative;z-index:1}
.ln>div{flex:1;min-width:0}
.lod{gap:0}
.lod>div{border-radius:0;background:var(--east)}
.lod>div:first-child{border-radius:4px 0 0 4px}
.lod>div:last-child{border-radius:0 4px 4px 0}
.lod .w{background:var(--west)}
.lod .s.e,.smallsw{background:repeating-linear-gradient(135deg,var(--east) 0 3px,rgba(255,255,255,.7) 3px 5px)}
.lod .s.w{background:repeating-linear-gradient(135deg,var(--west) 0 3px,rgba(255,255,255,.7) 3px 5px)}
.lod>div.n{background-image:var(--hatch-bg)}
.lod .lo{opacity:1}
.lod .e.lo{background:color-mix(in srgb,var(--east) 38%,var(--card))!important}
.lod .w.lo{background:color-mix(in srgb,var(--west) 38%,var(--card))!important} /* faded keeps its direction: a 38 % tint */
.lod .u,.mixed{background:repeating-linear-gradient(135deg,var(--west) 0 3px,var(--east) 3px 6px)}
.l18 .n{opacity:.7} /* night: dimmed, but a closure still reads */
:root[data-theme=dark] .l18>div:not(.x):not(.r){background:#4a4b50} /* dark: open hours >= 1.5:1 on the card */
.lpg>div{background:transparent;display:flex;align-items:flex-end;border-radius:2px}
.lpg .w{background:var(--west)}
.lpg .e{background:var(--east)}
.lpg .m{background:repeating-linear-gradient(135deg,var(--west) 0 3px,var(--east) 3px 6px)}
.pgsw{background:linear-gradient(90deg,var(--west) 50%,var(--east) 50%)}
.l18>div{border-radius:3px;background:var(--fill)}
.l18 .x{background:var(--red)}
.l18 .r,.risksw{background:repeating-linear-gradient(135deg,var(--red) 0 2px,transparent 2px 5px);box-shadow:inset 0 0 0 1px var(--red)}
.lwd .ln-w{fill:none;stroke:var(--ink);stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round}
.lwd .grid{stroke:var(--line);stroke-width:1}
.lwd .flagband{fill:rgba(224,138,0,.08)}
.lwd .flagt{font-size:12px;font-weight:500;fill:var(--inaa-ink)}
.lwd .dip{fill:var(--amber);stroke:var(--card);stroke-width:1.5}
.lwd .dipt{font-size:12px;font-weight:500;fill:#a35f00}
.lwd .tip-w{fill:none;stroke:var(--ink2);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.ruler{position:relative;border-bottom:1px solid var(--line)}
.ruler .d.end{font-weight:400;color:var(--ink2)}
.ruler .h{position:absolute;bottom:5px;transform:translateX(-50%);font:400 13px/1 var(--sans);color:var(--ink2);white-space:nowrap}
.ruler .d,.ruler .h{transition:opacity .15s var(--ease)}
.ruler .off{opacity:0}
.ruler .t{position:absolute;bottom:0;width:1px;height:4px;background:rgb(var(--ink-rgb) / .2)}
.ev{position:relative;z-index:2}
.mk{position:absolute;top:0;height:20px;padding:0 6px;border-radius:4px;transform:translateX(-50%);font:500 13px/20px var(--mono);white-space:nowrap;background:var(--asphalt);color:var(--paint);box-shadow:inset 0 -2px 0 var(--dc,transparent);transition:transform .12s var(--ease)}
.mk.r18{--dc:var(--red)}

#lod .swchip,.lanes > .swchip{position:absolute;top:-14px;height:14px;padding:0 6px;border-radius:3px 3px 0 0;font:500 12px/14px var(--sans);color:#fff;background:var(--dc);z-index:8;white-space:nowrap;cursor:pointer}
#lod .swchip.w,.lanes > .swchip.w{color:#0f1a17} /* dark ink on teal, white on navy: >= 4.5:1 in both themes */
#lod .swchip.e,.lanes > .swchip.e{color:#fff}
@media (max-width:479px){.tl{position:relative} .tl > #tlf.inbar{position:absolute;left:0;right:0;margin:0;z-index:7;row-gap:2px;font-size:13px;background:var(--card);padding:2px 0} #lod{align-self:start;height:var(--dirh,44px)}} /* the bar keeps its height; the legend sits on top of the cursor line */
#lod .swtab{position:absolute;top:0;bottom:0;border-radius:0 6px 6px 0;z-index:2;pointer-events:auto}
.now{position:absolute;top:0;left:0;height:20px;padding:0 6px;border-radius:4px;font:500 13px/20px var(--sans);background:var(--fill);color:var(--ink)}
.mk:active{transform:translateX(-50%) scale(.95)}
.nightsw{background:rgb(var(--ink-rgb) / .07)}
.night{background:rgb(var(--ink-rgb) / .025);position:absolute;top:0;bottom:0}
.dlab{position:absolute;top:50%;transform:translateY(-50%);z-index:2;font:600 13px/1 var(--sans);color:var(--on-dir);white-space:nowrap;pointer-events:none}
.rl{position:absolute;left:6px;top:2px;z-index:3;font:600 12px/14px var(--sans);letter-spacing:.05em;text-transform:uppercase;color:var(--ink2);pointer-events:none;white-space:nowrap}
.lod .rl{top:50%;transform:translateY(-50%);color:var(--on-dir);left:8px}
.lpg .rl,.lwd .rl{background:color-mix(in srgb,var(--card) 80%,transparent);padding:0 3px;left:3px}
.pgt{position:absolute;top:-8px;bottom:0;background:rgba(224,138,0,.06)}
.icon.thm{background:transparent;color:var(--ink2)}
.icon.thm svg{width:16px;height:16px}
.icon.thm:hover{background:var(--fill)}
.icon.thm{box-shadow:inset 0 0 0 1px var(--line)} /* outlined like the other header controls, so it reads as a button */
.icon.thm:focus-visible{border-radius:8px}
.tlf .cap{margin-left:auto;color:var(--ink2)}
.upd{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink2);white-space:nowrap}
.upd.stale i{background:var(--east)}
.pfoot span{flex:1}
@media (max-width:899px){
  body{width:auto}
  #rzbtn,#rzreset{display:none}
  .brand{font-size:18px}
  .brand span{display:none}
  .topbar .nav a{padding:3px 10px;border-radius:6px}
  .topbar .nav a[aria-current]{background:var(--card);box-shadow:0 1px 2px rgba(0,0,0,.12)}
  .answer{order:-1;flex-direction:column;align-items:flex-start;gap:8px;margin:0 0 8px}
  .headline .lg{display:none}
  .stats3{grid-template-columns:1fr;gap:12px}
  .stats3 dd{font-size:24px}
  .pgw{display:none}
}
@media (max-width:479px){
  .rtab th:nth-child(3),.rtab td:nth-child(3){display:none}
  .lede{flex-direction:column;align-items:flex-start;gap:12px;padding:0 16px 12px}
  .score{margin-left:0;flex-wrap:wrap}
  main{display:flex;flex-direction:column;gap:12px;padding:0 10px 16px}
  .cell{padding:0}
  .hero{grid-template-columns:minmax(0,1fr);grid-template-rows:auto;row-gap:18px;padding:18px 18px 16px}
  .hcol.hnow,.hcol.out{grid-column:1;grid-row:auto}
  .hcol.out{border-left:0;padding-left:0;padding-top:16px;border-top:1px solid var(--line)}
  .stats{margin-top:16px}
  .big2{font-size:24px}
  .tlc{padding:16px 14px}
  .hd{flex-wrap:wrap;height:auto;gap:8px}
  .tl{grid-template-columns:84px minmax(0,1fr);grid-template-rows:34px 20px 32px var(--swh,40px) var(--r18,0px) 60px}
  .tl.noev{grid-template-rows:34px 0 32px var(--swh,40px) var(--r18,0px) 60px}
  .hl.top{padding-right:28px}
  .hl.top small{display:none}
  .c3d{height:300px}
  .mlg{flex-wrap:wrap;row-gap:4px}
}
.proof:empty{display:none}
.hero .hcol .stats,.hero .hcol.out .foot{margin-top:auto}
.hero .hcol.out .foot{border-top:1px solid var(--line);padding-top:4px}
.hero .val{margin-top:12px}
.cmp>div{display:contents}
.cmp span{color:var(--ink2)}
.cmp b{font-weight:600;color:var(--ink)}
.cmp.one{grid-template-columns:auto minmax(0,1fr)}
.cmp .pgbsw{width:14px!important;height:12px!important}
.oursw{display:block;width:14px;height:8px;border-radius:2px;background:var(--risk)}
.sts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:10px}
.acs{display:flex;flex-direction:column;padding:0 14px;border-left:1px solid var(--line);min-width:0;gap:1px}
.acs b{color:var(--ink);font-size:24px;font-weight:600;letter-spacing:-.02em;line-height:1.15}
.acs .sl{font-size:13px;line-height:1.3;color:var(--ink)}
.acs .sc{font-size:13px;line-height:1.3;color:var(--ink2)}
.nw{white-space:nowrap}
.mb{display:flex;flex-direction:column;gap:3px;margin-top:auto;padding-top:6px}
.mb i{display:block;height:6px;border-radius:3px;background:var(--ink)}
.mb i.o{height:3px;border-radius:2px;background:var(--amber)}
.rtab{width:100%;border-collapse:collapse;font-size:15px;margin-top:10px}
.rtab td{text-align:right;border-top:1px solid var(--line);color:var(--ink2);height:24px}
.rtab tr.fa td{border-top:1px solid rgb(var(--ink-rgb) / .16)}
.limsw{width:16px!important;height:0!important;border-radius:0!important;border-top:2px dashed var(--red);opacity:.85}
.lwd .lim{stroke:var(--red);stroke-width:1;stroke-dasharray:3 3;opacity:.9}
@media (max-width:899px){
  .topbar .brand{grid-area:brand;flex-basis:auto;font-size:14px!important;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .topbar .nav{padding:2px;border-radius:8px;background:var(--fill);margin-left:0;grid-area:nav;justify-self:start;margin:0}
  .topbar-r{justify-content:space-between;width:auto;margin-left:auto;display:contents}
  .topbar #theme{grid-area:thm}
  .topbar #tz{grid-area:tz;justify-self:end}
  .pf1{height:auto;line-height:1.1}
  .pf2{font-size:15px}
  .hero .hcol .stats{margin-top:12px}
}
.headline{display:flex;align-items:center;margin:0;font-weight:600;color:var(--ink);font-size:56px;line-height:1.08;gap:16px;letter-spacing:-.025em}
.headline .dbadge{background:var(--dc);color:var(--on-dir);box-shadow:none;font-size:.625em;height:1.733em;min-width:2.2em;border-radius:6px}
.headline .arr{font-weight:500;flex:none;fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;color:var(--ink);width:42px;height:30px;stroke-width:3.4}
.brand{font-size:15px}
.brand span{font-size:15px}
.nav a,.upd{font-size:15px}
.lbl{display:flex;align-items:center;gap:8px;height:24px;font-weight:600;color:var(--ink);letter-spacing:.01em;white-space:nowrap;flex:none;font-size:15px}
.lbl small{font-weight:400;color:var(--ink3);font-size:13px}
.hd h2{margin:0;font-weight:600;letter-spacing:-.01em;white-space:nowrap;font-size:15px}
.strip{display:grid;grid-template-columns:1.25fr 1fr 1fr 1.25fr;margin:0;padding:0 0 10px;border-bottom:1px solid var(--line)}
.strip>div{display:flex;flex-direction:column;gap:2px;padding:0 16px;border-left:1px solid var(--line);min-width:0}
.strip>div:first-child{padding-left:0;border-left:0}
.strip dt{font-size:13px;color:var(--ink2);white-space:nowrap}
.strip dd{margin:0;font-size:15px;font-weight:500;color:var(--ink);white-space:nowrap}
.hero .r18note:not(:empty){margin-top:8px}
.out .lbl .tag{margin-left:8px}
.out .lbl .back{margin-left:auto}
.ogrid .val{margin:0;display:flex}
.ogrid .foot{margin:0;padding:0;border:0}
.ogrid .rows>div{padding:6px 0}
.rows dt{color:var(--ink2);white-space:nowrap;font-size:15px}
.rows dd{margin:0;font-weight:500;color:var(--ink);text-align:right;font-size:15px}
.cmp .half{display:flex;flex-direction:column;gap:1px;padding-left:12px;border-left:3px solid transparent}
.cmp .half.warn{border-left-color:var(--amber)}
.cmp .half span{font-size:13px;color:var(--ink2)}
.cmp .half b{font-size:15px;font-weight:600;color:var(--ink)}
.cmp .half small{font-size:15px;color:var(--ink2)}
.mcap{margin-top:2px;font-size:13px;color:var(--ink2)}
.cmp>.half{display:flex}
.cmp{grid-template-columns:14px auto minmax(0,1fr);font-size:15px;line-height:1.35;flex:1;display:flex;flex-direction:column;justify-content:center;gap:12px;padding:12px 14px;border-radius:10px;background:rgb(var(--ink-rgb) / .035);align-items:stretch}
.tl.noev{grid-template-rows:34px 0 32px var(--swh,40px) var(--r18,0px) minmax(56px,1fr)}
.lanes{grid-column:2;grid-row:1/-1;display:grid;grid-template-rows:subgrid;grid-template-columns:minmax(0,1fr);min-width:0;position:relative;user-select:none;touch-action:pan-y;margin-right:8px}
.tlf span{display:inline-flex;align-items:center;gap:4px}
.out{display:flex;flex-direction:column;flex:1;min-height:0;margin-top:10px}
.ogrid{flex:1;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;align-items:stretch;display:block;margin-top:6px}
.ogrid .val:empty{display:none}
.ostrip{grid-template-columns:1fr 1fr 1.2fr;border-bottom:0;padding:0}
.ostrip dd .pgbsw{display:inline-block;margin-right:8px;vertical-align:1px}
.tl{flex:1;min-height:0;display:grid;row-gap:6px;margin-top:8px;grid-template-rows:34px 20px 32px var(--swh,40px) var(--r18,0px) minmax(56px,1fr);grid-template-columns:120px minmax(0,1fr)}
.lwd svg{display:block;overflow:visible}
.lwd .ax{font-size:13px;fill:var(--ink2)}
.rec .lbl small,.c3d .lbl small,.out .lbl small{font-size:13px;font-weight:400;color:var(--ink2)}
.kpi{display:flex;align-items:baseline;gap:12px;margin-top:2px}
.kpi b{font-size:36px;font-weight:600;letter-spacing:-.025em;line-height:1.05;color:var(--ink)}
.kpi span{font-size:15px;color:var(--ink2)}
.kpil{display:flex;justify-content:space-between;gap:12px;font-size:13px;color:var(--ink2)}
.kpil .dbk{margin:0}
.db svg{display:block;overflow:visible}
.db .dbt{font-size:13px;fill:var(--ink2)}
.db .dbs{stroke:rgb(var(--ink-rgb) / .25);stroke-width:2}
.db .dbo{fill:var(--amber)}
.db .dbm{fill:#26282c;stroke:#000;stroke-opacity:.35;stroke-width:1}
:root[data-theme=dark] .db .dbm{fill:#eceef0;stroke:#fff;stroke-opacity:.5} /* ours: dark graphite with a thin ring, apart from the chance bars */
.db .dbv{font-size:13px;font-weight:600;fill:var(--ink)}
.dbk span{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.dbk i{width:9px;height:9px;border-radius:50%;background:var(--ink)}
.dbk i.o{background:var(--amber)}
.aline{margin-top:2px;font-size:13px;line-height:1.35;color:var(--ink2)}
.rec .db+.aline{margin-top:2px;padding-top:5px;border-top:1px solid var(--line)}
.aline b{font-weight:600;color:var(--ink)}
@media (max-width:899px){
  .disagree{font-size:15px}
  .ostrip{grid-template-columns:1fr 1fr}
  .kpil{flex-direction:column;gap:2px}
  .ostrip>div:nth-child(3){grid-column:1/-1;padding-left:0;border-left:0}
  .subhead{font-size:18px}
  .expl,.disagree{font-size:15px}
  .strip{grid-template-columns:1fr 1fr;row-gap:12px}
  .strip>div:nth-child(3){padding-left:0;border-left:0}
  .ogrid{grid-template-columns:minmax(0,1fr);gap:12px}
  .pf1 b{font-size:24px}
  .pf1 span{font-size:18px}
}
.lede .eyebrow{margin:0 0 2px;font-size:15px;font-weight:500;color:var(--ink2)}
.facthd{display:none}
.facthd:has(.tag:not([hidden])){display:flex;align-items:center;gap:8px;margin-bottom:6px}
.strip dt abbr{text-decoration:underline dotted var(--b1);text-underline-offset:3px;cursor:help}
.lpg svg{position:absolute;left:0;top:0;pointer-events:none;overflow:visible}
.lpg .gt{font-size:13px;fill:var(--ink2)}
:root[data-theme=dark] .dlab.w,:root[data-theme=dark] .headline .dbadge[style*="west"]{color:#10131c}
@media (prefers-color-scheme:dark){
  :root:not([data-theme=light]) .dlab.w,:root:not([data-theme=light]) .headline .dbadge[style*="west"]{color:#10131c}
}
#lod .pgin{position:absolute;top:-8px;z-index:3;height:16px;padding:0 5px;border-radius:3px;background:var(--amber);color:#fff;font:600 12px/16px var(--sans);letter-spacing:.02em}
:root[data-theme=dark] #lod .pgin{color:#1b1c1f}
.dbh b{font-size:15px;font-weight:600;color:var(--ink)}
.rec .kpil{margin-top:2px;font-size:13px;color:var(--ink2)}
.db .dbl.hi{font-weight:700}
.pairs>div{display:flex;flex-direction:column;gap:1px}
.pairs .pv{font-size:15px;color:var(--ink2)}
.pairs .pv b{font-size:15px;font-weight:600;color:var(--ink);font-variant-numeric:tabular-nums}
.pairs .pl{line-height:1.25;font-size:13px;color:var(--ink2)}
.topbar{height:56px;box-shadow:0 1px 0 var(--line);margin-bottom:0}
.brand svg{width:24px;height:24px;color:var(--ink)}
@media (max-width:600px){
  main{display:flex;flex-direction:column}
  .cell[data-p=tl]{order:1}
  .cell[data-p=rec]{order:2}
  .cell[data-p=hero]{order:3}
  .cell[data-p=v3d]{order:4}
  .tl{grid-template-columns:64px minmax(0,1fr);grid-template-rows:34px 20px 28px max(var(--swh,24px),32px) var(--r18,0px) 96px}
  .tl.noev{grid-template-columns:64px minmax(0,1fr);grid-template-rows:34px 0 28px max(var(--swh,24px),32px) var(--r18,0px) 96px}
  .hl{font-size:13px;line-height:1.2}
  .hl small{display:none}
  .hl[style*="grid-row:6"]{justify-content:flex-start!important}
  .pairs{grid-template-columns:1fr}
}
.expl{margin:6px 0 0;line-height:1.4;margin-top:8px;font-size:18px;color:var(--ink)}
.hero .strip dd{overflow:visible!important;text-overflow:clip!important;white-space:nowrap}
#ev .pgb{top:auto;bottom:-3px;height:7px;border-width:2px}
:root[data-theme=dark] #ev .pgl{color:#1b1c1f}
.nowt{position:absolute;bottom:3px;font:600 13px/1 var(--sans);color:var(--ink);display:none}
.hl[style*="grid-row:6"]{align-items:flex-start}
.lpg .base.calm{stroke:var(--risk);stroke-opacity:.7}
.pairs .pv b.of{color:var(--inaa-ink)}
.lwd .nowpt{fill:var(--ink)}
.tarr{display:inline-block;width:1.15em;height:.8em;margin:0 .3em;vertical-align:-.05em;fill:none;stroke:currentColor;stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round}
.map .lead{stroke:var(--ink2);stroke-width:1}
@media (max-width:899px){
  .expl{font-size:15px}
  .hero .strip>div:first-child{grid-column:1/-1;padding-bottom:10px}
  .hero .strip>div:nth-child(2){padding-left:0;border-left:0}
}
@media (max-width:600px){
  .tl,.tl.noev{grid-template-columns:64px minmax(0,1fr);grid-template-rows:34px var(--evh,0px) 32px var(--swh,40px) var(--r18,0px) 96px}
  .lpg .gt{display:none}
}
.pf3 span{font-size:13px;color:var(--ink2)}
.strip dt small{font-size:13px;color:var(--ink3)}
.acch small{font-weight:400;display:inline;white-space:nowrap}
.acch .k{display:inline-flex;align-items:center;gap:4px}
.acch i{vertical-align:middle;display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--ink)}
.acch i.ko{background:var(--amber)}
.dbh{flex-wrap:wrap;gap:4px 12px;margin-top:6px;display:flex;justify-content:space-between;align-items:center}
.dbu{font-size:13px;color:var(--ink2)}
.dbk{display:flex;gap:16px;margin-top:2px;color:var(--ink2);font-size:13px}
@media (max-width:899px){
  .lbl.acch{flex-wrap:wrap;height:auto;row-gap:2px;white-space:normal}
  .acch small{display:block;flex-basis:100%;white-space:normal;margin-left:0}
  .acch .sep{display:none}
  .hero .strip dt{white-space:normal}
}
.disagree{margin:8px 0 0;align-items:center;gap:10px;line-height:1.4;margin-top:6px;display:block;color:var(--ink);font-size:15px}
.disagree::before{content:"";flex:none;border-top:2px solid var(--amber);width:8px;height:8px;border-radius:50%;background:var(--amber);border:0;display:none}
.disagree .ofn{font-weight:400;color:var(--inaa-ink);text-decoration:underline dotted;text-decoration-thickness:1px;text-underline-offset:3px;cursor:help}
.hl{grid-column:1;display:flex;flex-direction:column;padding:2px 8px 0 0;white-space:normal;font-size:13px;font-weight:500;line-height:1.3;justify-content:center;padding-top:0}
.bands{position:absolute;left:0;right:0;top:32px;bottom:0;pointer-events:none;z-index:4}
#ev .pgl{top:-1px;bottom:auto;height:14px;padding:0 4px;border-radius:3px;background:var(--amber);color:#fff;font:600 12px/14px var(--sans);letter-spacing:.03em;transform:none}
.hero{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);grid-template-rows:1fr;column-gap:32px;display:flex;flex-direction:column;justify-content:center;padding:12px 24px;align-self:stretch}
.hero .strip dd small{font-size:15px;font-weight:400;color:var(--ink2)}
.rec .pairs .pv b{font-size:15px}
.accsub .k{display:inline-flex;align-items:center;gap:4px}
.accsub i{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--ink)}
.accsub i.ko{background:var(--amber)}
.accsub .nw{margin-left:auto}
.db .dbax{stroke:rgb(var(--ink-rgb) / .32);stroke-width:1} /* the plot ends visibly here: its values sit just under it */
.db .dbt.sub{font-size:12px}
@media (max-width:899px){
  .accsub .nw{margin-left:0}
  .accsub{flex-wrap:wrap;gap:4px 12px}
}
.hero .strip{border-bottom:0;padding:0;justify-content:start;column-gap:0;grid-template-columns:auto auto auto}
.pf1 span{font-weight:500;opacity:1;color:var(--ink2);font-size:18px}
.pf3 b.of{color:var(--inaa-ink);font-size:15px;font-weight:600}
.rec .lbl small{font-size:13px}
.db .abbr{text-decoration:underline dotted;text-underline-offset:3px;cursor:help}
.pairs{display:grid;margin-top:2px;padding-top:4px;border-top:1px solid var(--line);grid-template-columns:1fr!important;gap:2px!important}
.pairs .pl1 b{font-size:15px;font-weight:600;color:var(--ink);font-variant-numeric:tabular-nums}
.pairs .pl1 .of{color:var(--inaa-ink)}
@media (max-width:899px){
  .upd{display:block;font-size:13px}
  .hero .strip{grid-template-columns:1fr}
  .hero .strip>div{padding-left:0;border-left:0;padding-bottom:8px}
}
.lede-l{flex:1 1 auto;min-width:0;padding:0 6px}
.pf2{line-height:1.35;font-weight:500;font-size:15px;margin-top:12px}
.tfoot{display:flex;flex-direction:row!important;align-items:center;gap:16px;margin-top:14px;padding:12px 0 0;border-top:1px solid var(--line);background:none;box-shadow:none;border-radius:0}
.tfoot .facthd{flex:none;width:112px;justify-content:flex-end;margin:0;display:flex}
.hl small{align-items:center;gap:4px;font-size:13px;font-weight:400;color:var(--ink2);display:block}
.accsub{display:flex;align-items:center;gap:14px;font-size:13px;color:var(--ink2);margin-top:2px;justify-content:flex-start}
.dbcap{margin-top:0;font-size:13px;line-height:1.3;color:var(--ink2)}
.rec .pairs{margin-top:0;padding-top:3px!important}
.pairs .pl1{display:block!important;font-size:13px;color:var(--ink2);line-height:1.4}
@media (max-width:899px){
  .tfoot{flex-direction:column;align-items:stretch}
  .tfoot .strip{grid-template-columns:1fr}
  .tfoot .facthd{width:auto;justify-content:flex-start}
}
.tlc .tlf{margin-bottom:8px}
.pfe{margin:0 0 2px;font-size:15px;font-weight:500;color:var(--ink2);line-height:20.3px}
.pf1{display:flex;height:auto;line-height:1.1;align-items:baseline;gap:0;margin-top:0}
.pf1 b{letter-spacing:-.02em;font-weight:600;font-size:36px;line-height:44px}
.db .dbt.unit{font-size:12px;fill:var(--ink2)}
@media (max-width:899px){
  .lbl.acct{height:auto;row-gap:2px;white-space:normal;margin-bottom:6px}
}
.db .dbph{font-size:13px;font-weight:400;fill:var(--ink2)}
@media (max-width:899px){
  .proof .pf3:last-child{margin-top:4px}
}
@media (max-width:479px){
  .hl small{display:none}
  #lod,#lpg,#lwd{margin-top:20px}
  .lpg .gt{display:inline;font-size:12px}
}
.tlc{display:flex;flex-direction:column;min-width:0;min-height:0;padding:16px 24px;justify-content:flex-start;will-change:transform}
@media (max-width:479px){
  .tfoot .strip{grid-template-columns:1fr 1fr}
}
.acct{flex-wrap:wrap;display:flex;align-items:baseline}
.acct .accsub{display:inline-flex;margin:0 0 0 8px;gap:12px;font-weight:400;margin-left:auto!important;font-size:13px}
.db .dbi circle{fill:none;stroke:var(--ink2);stroke-width:1}
.db .dbi{cursor:help}
.db .dbt.hd{font-weight:400;fill:var(--ink2)} /* the three column headers at one weight and colour */
@media (max-width:899px){
  .acct .accsub{margin-left:0!important}
}
.proof .pf2{margin-top:12px!important}
.pfm{font-size:15px;color:var(--ink);margin-top:4px}
.pfbars{margin-top:12px;display:grid;gap:5px;max-width:360px}
@media (min-width:900px) and (max-height:830px){
  .pfbars{margin-top:8px;gap:3px}
  .proof .pf2{margin-top:8px!important}
  .lede{padding-top:16px}
}
.pfr{display:grid;grid-template-columns:58px minmax(0,1fr) 64px;align-items:center;gap:8px;font-size:13px}
.pfn{color:var(--ink2)}
.pft{position:relative;height:6px;border-radius:3px;background:rgb(var(--ink-rgb) / .07)}
.pft i{position:absolute;top:0;bottom:0;border-radius:3px;background:var(--east)}
.pft i.o{background:var(--amber)}
.pfv{text-align:right;font-weight:600;color:var(--ink);font-variant-numeric:tabular-nums}
.pfv.of{color:var(--inaa-ink)}
.eof{white-space:nowrap;font-weight:400;color:var(--ink2)} /* "(end of forecast)": secondary, never split */
@media (max-width:479px){.eof{display:block}.eofs{display:none}} /* phones: the phrase on its own line, no leading separator */
.pfm .pfo{color:var(--ink2);cursor:help}
.pfm .pfo b{color:var(--inaa-ink)} /* only the official value in amber; the words in the secondary grey (as on the 3D card) */
.pfs{padding-left:66px;font-size:12px;color:var(--ink3)}
.pfsx{display:flex;justify-content:space-between}
.pfsx b{font-weight:400}
#lod .pgline{position:absolute;top:0;height:3px;z-index:3;background:var(--amber);pointer-events:auto}
.pgbsw{border-bottom:0;align-self:center;width:14px;height:10px;border:0;border-top:3px solid var(--amber);background:var(--east);border-radius:2px}
#hlsw{justify-content:flex-end;padding-top:0}
@media (max-width:479px){
  #hlsw{justify-content:flex-start}
  .tfoot .strip>div{padding:0 0 8px;border:0}
  .pfr{grid-template-columns:54px minmax(0,1fr) 60px}
}
@media (min-width:900px){
  .c3d .mhd{grid-column:1/-1}
}
.subhead{margin:4px 0 0;color:var(--ink);line-height:1.25;margin-top:10px;font-size:24px;font-weight:500}
.lede .subhead,.lede .expl,.lede .disagree{max-width:60ch;text-wrap:pretty}
.accsub2{display:flex;align-items:baseline;gap:12px;margin:0 0 2px;font-size:13px;color:var(--ink2)}
.accsub2>span:first-child{flex:1;min-width:0}
.accsub2 i{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--ink)}
.accsub2 i.ko{background:var(--amber)}
.db .dbpill{fill:rgb(var(--ink-rgb) / .08)}
.db .dbpt{font-size:12px;fill:var(--ink2)}
.rec .dbcap{margin:0 0 2px;font-size:13px;color:var(--ink2);display:none}
.upd i{background:var(--live);width:8px;height:8px;border-radius:50%;flex:none}
.upd i.ok{background:var(--live)} /* yellow-green: never read as the West teal */
.upd i.old{background:var(--b1)}
.upd .age{color:var(--ink2)}
.tfoot .strip{flex:1;display:grid;padding:0;grid-template-columns:repeat(3,minmax(0,1fr))}
.tfoot .strip dd{overflow:visible;white-space:nowrap;font-size:15px}
.ruler .d.d0{top:auto;bottom:4px;font-weight:600}
.tlc .tfoot{margin-top:12px;padding-top:10px}
.tfoot .strip dd .status{font-size:15px}
.tfoot .strip dd small{display:block;font-size:13px;white-space:nowrap}
.pfoot{display:flex;align-items:center;gap:12px;font-size:13px;color:var(--ink2);padding:0 24px 2px;padding-bottom:24px}
.pissued{display:none}
@media (max-width:899px){
  .topbar .upd .uh{display:none}
  .pissued .uh{display:none}
  .pissued{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:2px 0 6px;font-size:13px;color:var(--ink2)}
  .pissued i{width:7px;height:7px;border-radius:50%}
  .pissued i.ok{background:var(--live)}
  .pissued i.old{background:var(--b1)}
  .pissued .iss{font-weight:500;color:var(--ink)}
  .pissued .age{white-space:nowrap}
  .accsub2{flex-wrap:wrap}
  .accsub2>span:first-child{flex-basis:100%}
}
.ruler .nowtag{position:absolute;z-index:2;height:14px;padding:0 5px;border-radius:3px;transform:translateX(calc(-100% - 4px));background:var(--ink);color:var(--on-ink);font:600 12px/14px var(--sans);top:auto;bottom:3px}
@media (min-width:640px){.ruler .nowtag::after{content:'';position:absolute;left:100%;top:50%;margin-top:-4px;border-style:solid;border-width:4px 0 4px 4px;border-color:transparent;border-left-color:var(--ink)}} /* a pointer from the tag to its line: the tag reads as the line's label */
@media (max-width:479px){
  .hl{align-self:start;position:relative;pointer-events:none;font-size:13px;white-space:nowrap;grid-column:2/-1;width:max-content;padding:0 6px 0 8px;z-index:6}
  .pfe{white-space:normal}
}
.lpg .gtr{fill:var(--ink3)}
.lpg .grid{stroke-width:1;stroke:rgb(var(--ink-rgb) / .07)}
.lpg .pgwash,.pgwash{fill:rgba(224,138,0,.09)}
:root[data-theme=dark] .lod .e.lo{background:color-mix(in srgb,var(--east) 40%,var(--ink))!important;opacity:1!important;filter:none;box-shadow:none} /* dark: the direction toward the text colour, >= 3:1 against card and confident bar (check.mjs) */
:root[data-theme=dark] .lod .w.lo{background:color-mix(in srgb,var(--west) 40%,var(--ink))!important;opacity:1!important;filter:none;box-shadow:none}
.tlf .losw{opacity:1;background:linear-gradient(90deg,color-mix(in srgb,var(--east) 38%,var(--card)) 50%,color-mix(in srgb,var(--west) 38%,var(--card)) 50%)!important} /* split: navy tint and teal tint */
:root[data-theme=dark] .tlf .losw{opacity:1;background:linear-gradient(90deg,color-mix(in srgb,var(--east) 40%,var(--ink)) 50%,color-mix(in srgb,var(--west) 40%,var(--ink)) 50%)!important;box-shadow:0 0 0 1px rgba(255,255,255,.35)}
@media (min-width:900px){
  .c3d .mlg span{align-items:flex-start;white-space:nowrap}
}
.hd #zoom{margin-left:auto}
.hdsel:not(:has(.tag:not([hidden])))+#zoom{margin-left:auto!important}
.hdsel:not(:has(.tag:not([hidden]))){display:none}
.ruler .d.off{opacity:0}
.db .dbt.cap{font-size:12px;fill:var(--ink3)}
.proof .pfe{margin-bottom:2px}
.proof .pfe,.proof .pf1,.proof .pfm{margin:0}
.lede .subhead,.lede .disagree{max-width:60ch}
.tlf i{width:10px;height:10px;border-radius:3px;opacity:1}
:root[data-theme=dark] .lpg .pgwash{fill:rgba(240,150,40,.09)}
@media (max-width:899px){
  .proof .pf3{text-wrap:balance;margin-top:8px}
}
.db .dbt.tk{font-size:12px;fill:var(--ink3)}
.expl .sm{display:none}
.lede{flex:none;gap:32px;justify-content:flex-start;padding:24px 18px 10px;display:grid;grid-template-columns:minmax(0,1fr) auto;padding-right:24px;align-items:start!important}
.proof{color:var(--ink);align-items:flex-start;text-align:left;border-left:1px solid var(--line);margin-left:28px;flex:none;margin-top:0;margin:0 0 0 6px;padding:0 0 0 22px;justify-content:flex-start;display:flex;flex-direction:column;padding-top:0;align-self:start;gap:0;min-width:0}
.proof .pf1{margin-top:6px}
.proof .pfm{margin-top:2px}
.proof .pf3{font-size:15px;color:var(--ink);line-height:1.4;margin-top:12px;text-wrap:balance}
.lede-l .eyebrow,.proof .pfe{line-height:20px}
@media (max-width:899px){
  .lede-l{flex:1 1 auto;padding:0;display:flex;flex-direction:column}
  .lede-l .eyebrow{order:0}
  .lede-l .headline{order:1}
  .lede-l .pissued{order:2;margin:6px 0 2px}
  .expl .lg{display:none}
  .expl .sm{display:inline}
  .proof{align-items:flex-start;text-align:left;margin-top:14px;border-top:1px solid var(--line);padding-top:12px;margin-left:0;margin:14px -6px 0;padding:14px 16px;border:0;border-left:0;background:var(--card);border-radius:16px;box-shadow:inset 0 0 0 1px rgba(27,28,30,.04)}
  .lede{align-items:stretch;gap:0;flex-direction:column;padding:12px 16px 12px;display:flex;border-bottom:0}
}
.hdsel.on{display:flex!important}
.hdsel small{font-variant-numeric:tabular-nums;font-size:13px!important;min-width:0;text-align:right;color:var(--ink);white-space:nowrap}
.hdsel{align-items:center;margin-left:auto;white-space:nowrap;display:none!important;gap:8px!important}
.hdsel .back{margin-left:0;white-space:nowrap;font-size:13px}
.db .dbf{font-size:13px;font-weight:400!important;fill:var(--ink2)!important;font-variant-numeric:tabular-nums}
.db .dbfc{fill:rgb(var(--ink-rgb) / .04);display:none}
.accsub2 .k{display:inline-flex;align-items:center;gap:4px;white-space:nowrap;margin-right:6px}
.tlf .pgbsw{width:16px;height:9px;border:0;border-radius:2px;background:var(--amber)}
main,.lede,.pfoot{max-width:1360px;margin-left:auto;margin-right:auto;box-sizing:border-box;width:100%}
@media (max-width:899px){
  .topbar{flex-wrap:wrap;display:grid;align-items:center;gap:10px 12px;padding:12px 16px;height:auto;grid-template-columns:minmax(0,1fr) auto auto!important;grid-template-areas:"brand thm tz" "nav upd upd"!important;column-gap:8px!important}
  .topbar .upd{display:flex;flex-wrap:nowrap;font-size:13px;white-space:nowrap;justify-self:end;grid-area:upd}
  .hdsel small{min-width:0;white-space:normal;text-align:left}
  .hd{flex-wrap:wrap}
  .hdsel.on{order:9;flex-basis:100%;flex-wrap:wrap}
}
.acchd{display:flex;align-items:baseline;justify-content:space-between;gap:12px;min-width:0}
.acchd .lbl{flex:0 1 auto;min-width:0}
.acck{display:inline-flex;gap:12px;flex:none;font-size:13px;color:var(--ink2);white-space:nowrap}
.acck .k{display:inline-flex;align-items:center;gap:6px}
.acck i{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--ink)}
.acck i.ko{background:var(--amber)}
.accsub3{margin:0 0 4px;font-size:13px;color:var(--ink2)}
.db .dbrule{stroke:rgb(var(--ink-rgb) / .06);stroke-width:1}
.db .dbtag{fill:rgb(var(--ink-rgb) / .07)}
.db .dbplan{font-size:12px;font-weight:400;fill:var(--ink2)}
.db .dbhi{fill:rgb(var(--ink-rgb) / .06)}
.db .dbacc{fill:var(--east)}
.db .dbl{fill:var(--ink);font-size:13px;font-weight:600}
.db .dbi text{font-weight:700;fill:var(--ink2);font-size:12px;font-style:normal}
.readout .ro b{font-weight:500;color:var(--ink)} /* the readout regular, only its time in medium: the bold title before it stays the one bold word */
.readout .rback{flex:none;transition:background-color .15s var(--ease);height:28px;padding:0 12px;border-radius:8px;background:var(--fill);box-shadow:none;font-size:13px;font-weight:500;color:var(--ink);line-height:28px;margin-left:0} /* inline right after the readout, as in 3D */
.readout .rback:hover{background:var(--hover);color:var(--ink)}
.readout .rback[hidden]{display:none}
.tl,.tl.noev{min-height:0;flex:0 0 auto;row-gap:0;grid-template-rows:34px var(--evh,0px) calc(16px + var(--dirh,36px)) calc(12px + var(--swh,44px)) var(--r18row,0px) calc(24px + var(--hwh,70px));margin-top:8px}
#ruler{grid-row:1}
#ev{grid-row:2}
#ev .mk{top:4px} /* 4 px clear of the hour axis above it */
#lod{grid-row:3}
#lpg{grid-row:4}
#l18{grid-row:5}
#lwd{grid-row:6}
.tl .ln,.tl .hl{margin-top:16px}
@media (min-width:480px){.tl .hl[style*="grid-row:3"]{margin-top:20px}} /* centred on the bar, not on the bar plus the tag band */
.lwd{display:block;margin-top:16px}
.ph{position:absolute;left:0;width:0;z-index:3;pointer-events:none;will-change:transform;top:0;bottom:0}
.ph::before{content:"";position:absolute;bottom:0;border-radius:1px;background:var(--ink);top:var(--lt,32px);width:1.5px;left:-.75px}
.ruler .h.off,.ruler .nowtag.off,.lpg .pk.off,.lwd .limt.off{opacity:0}
.ruler .d.dend{left:auto}
.ruler .t.dd{height:100%;background:rgb(var(--ink-rgb) / .14)}
@media (max-width:479px){
  .tl .ln,.lwd{margin-top:36px!important}
  .tl .hl{margin-top:12px;height:16px;line-height:16px}
  .tfoot .strip>div:first-child,.tfoot .strip>div:nth-child(2){grid-column:auto;padding-bottom:0}
  .tfoot .strip>div:nth-child(3){grid-column:1/-1}
  .tfoot .strip dd{white-space:normal}
}
.mids{position:absolute;left:0;right:0;top:32px;z-index:0;pointer-events:none}
.mids .mid{position:absolute;top:0;bottom:0;width:1px;background:rgb(var(--ink-rgb) / .14)}
.lpg .pk text{font-size:12px;fill:var(--ink2)}
.lpg .pkbg{fill:var(--card)}
.lpg i.pkb{filter:brightness(.75)}
.lpg .pkt{font:500 12px var(--sans);fill:var(--ink2)}
:root[data-theme=dark] .lpg i.pkb{filter:brightness(1.1)} /* one graphite step up, not white */
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .lpg i.pkb{filter:brightness(1.1)}}
.ruler .d{position:absolute;top:0;font:600 13px/1 var(--sans);white-space:nowrap;transition:opacity .15s;background:var(--card);padding:0 3px;margin-left:-3px;z-index:1}
.nowtag{cursor:help}
:root[data-theme=dark] .map .area{fill:rgb(var(--ink-rgb) / .07)!important}
@media (prefers-color-scheme:dark){
  :root:not([data-theme=light]) .map .area{fill:rgb(var(--ink-rgb) / .07)}
}
@media (max-width:479px){
  #hdsel.readout{font-size:12px;line-height:16px;white-space:normal;align-items:flex-start;margin-top:8px;min-height:32px;height:auto}
  .readout .ro{white-space:normal;overflow:visible;text-overflow:clip}
}
.upd .frs{color:var(--ink2);font-variant-numeric:tabular-nums}
.upd .frs b{font-weight:600;color:var(--ink2)}
.lwd .limt.gutter{fill:var(--ink2)!important;font-weight:400!important}
.pf3 a.beat:hover{text-decoration-color:currentColor}
#rec.flash{animation:recflash 1.4s var(--ease)}
@keyframes recflash{0%,60%{box-shadow:0 0 0 3px var(--east-line)}100%{box-shadow:inset 0 0 0 1px rgba(27,28,30,.04)}}
@media (max-width:480px){
  .topbar .seg button{font-size:12px;padding:0 8px}
  .lwd .limt.gutter{display:none}
}
#hdsel.readout{display:flex;align-items:center;gap:16px;margin:2px 0 0;font-size:13px;color:var(--ink2);white-space:nowrap;min-width:0;overflow:visible;justify-content:flex-start;height:28px;line-height:28px}
.readout .ro{min-width:0;overflow:hidden;text-overflow:ellipsis;line-height:20px}
.pf3 a.beat span{font-size:inherit;color:inherit}
.tlf{display:flex;align-items:center;flex-wrap:wrap;font-size:13px;color:var(--ink2);white-space:nowrap;flex:none;gap:4px 8px;margin-top:16px;margin-bottom:0}
@media (min-width:480px){
  .tl,.tl.noev{grid-template-columns:136px minmax(0,1fr);flex:1 1 auto;grid-template-rows:40px var(--evh,0px) calc(20px + 36px) minmax(calc(12px + 58px),1fr) var(--r18row,0px) calc(12px + 66px);margin-top:4px}
  .ruler .d{top:0}
  .ph::before{top:var(--lt,20px)}
}
.pf3 a.beat .u{text-decoration:underline;text-decoration-color:var(--b2);text-underline-offset:4px;font-weight:400;color:inherit}
.pf3 a.beat .ar{color:var(--east-line)} /* only the arrow carries colour */
.pf3 a.beat:hover .u{text-decoration-color:currentColor}
.pf3 a.beat .ar{text-decoration:none}
@media (max-width:480px){
  .upd .fw{display:none}
  .lede .headline .ff{display:none}
  .lede .eyebrow::before{content:"Frankfurt · "}
}
.lpg .pk{font-weight:400;transition:opacity .15s var(--ease);font-size:12px;fill:var(--ink2)}
@media (min-width:480px){
  #lpg{margin-top:12px}
  #hlsw{margin-top:12px;justify-content:center} /* centred on the 0-20 % plot */
}
.lwd .limt.kn{paint-order:stroke;stroke:var(--card);stroke-width:4px;stroke-linejoin:round}
.c3d .mlg span,.c3d .mlg .tk{gap:6px}
.lede .proof .pfm{margin-top:4px}
.lede .proof .pf3{margin-top:4px}
.pf3 a.beat{text-decoration-color:var(--b2);text-decoration:none;text-underline-offset:4px;display:inline;font-size:inherit;color:inherit}
.lpg>div.hov i{background:var(--ink)!important;opacity:1!important}
.lwd .hdot{fill:var(--ink);stroke:var(--card);stroke-width:1.5}
.lpg .pkc{fill:var(--ink2)}
.pf3{margin-top:4px;color:var(--ink2);font-size:18px}
.pf3 b.of,.pfm b.of{font-weight:600}
:root[data-theme=dark] .lpg .pgwash,:root[data-theme=dark] .pgwash{fill:rgba(255,165,50,.08)!important} /* translucent: the bars stay visible (>= 2:1, check.mjs) */
.map svg.nb .app,.map svg.nb .arw,.map svg.nb .dep{opacity:.25}
.rec .db{margin-top:0;flex:1 1 auto;min-height:0}
.rec .accst{margin-top:6px}
.map .area{stroke-linejoin:round;fill:rgb(var(--ink-rgb) / .05);stroke:rgb(var(--ink-rgb) / .3);stroke-width:.75} /* a hairline outline on a light surface */
.lpg .gt,.lwd .ax{font-size:12px;fill:var(--ink3)}
#lod .pgtag.ra::after{content:'';position:absolute;left:var(--tk);bottom:-4px;width:1px;height:4px;background:inherit}
#lod .pgtag{position:absolute;top:-14px;z-index:7;height:14px;padding:0 6px;border-radius:3px 3px 0 0;font:500 12px/14px var(--sans);letter-spacing:.02em;white-space:nowrap;background:var(--inaa-ink);color:#fff}
:root[data-theme=dark] #lod .pgtag{background:#f0a030;color:#1b1c1f} /* siteui.STYLE.tag_bg, the same on the 3D view */
.db .dbko{fill:var(--card)}
.db .dbv.o{fill:var(--inaa-ink)} /* the official values at our values' size and weight: colour is the only difference */
.db .dbv,.db .dbt.tk{paint-order:stroke;stroke:var(--card);stroke-width:4px;stroke-linejoin:round} /* the gridlines stop behind the labels */
@media (min-width:900px){
  .lede .lede-l{display:contents}
  .lede-l .eyebrow{grid-area:1/1}
  .lede #answer{grid-area:2/1;align-self:start}
  .lede .proof .pfm{margin-top:12px}
  .lede .proof .pf3{margin-top:4px}
  .lede .pinl{display:none}
  .ldiv{grid-area:1/2/span 5/3;width:1px;display:none}
}
@media (max-width:899px){
  .ldiv{display:none}
}
.lede .disagree[hidden]{display:none!important}
@media (min-width:900px){
  .lede .expl{grid-area:4/1;align-self:last baseline;font-size:15px;line-height:1.4;margin-top:12px}
  .lede .disagree{grid-area:5/1;margin-top:4px}
  .lede .subhead{grid-area:3/1;margin-top:16px}
}
.map .gapp{fill:none;stroke:var(--west-line);stroke-width:2;stroke-dasharray:6 4;opacity:.85}
.mlg #mlggh[hidden]{display:none!important}
.mlg .ghk{width:18px;height:0;border-top:1.5px dashed var(--west-line);opacity:.8;display:inline-block}
.map .tnum{fill:var(--east-line);stroke:var(--card);stroke-width:6;paint-order:stroke} /* a 3 px card-colour halo: the line visibly breaks around the disc */
.map .tnumt{font:600 11px var(--sans);fill:var(--card)}
.mlgt{display:inline-flex;align-items:center;flex-wrap:wrap;gap:16px}
.mlgt .tk{display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
.mlgt i{display:inline-grid;place-items:center;width:15px;height:15px;border-radius:50%;background:var(--east-line);color:var(--card);font:600 11px/1 var(--sans);font-style:normal}
.accst dd .vs{font-size:13px;font-weight:400;color:var(--ink2)}
.accst dd .vs .of{font-weight:600;color:var(--inaa-ink)}
.c3d .mlg{align-self:center;font-size:13px;color:var(--ink2)}
.lwd .limt{transition:opacity .15s var(--ease);font-weight:500;font-size:12px;fill:var(--red)!important}
@media (min-width:900px){
  .lede.lede{display:grid;grid-template-rows:auto auto auto auto auto;row-gap:0;align-items:start!important;padding-left:18px;padding-right:18px;grid-template-columns:minmax(0,14fr) 0 minmax(0,10fr)!important;column-gap:0!important;padding-top:14px}
  .lede .proof.proof{grid-area:1/3/span 5/4;display:flex;flex-direction:column;align-self:start!important;padding-left:32px;margin-left:-33px;margin:0 0 0 6px!important;padding:0 0 0 22px!important;border:0;border-left:1px solid var(--line)}
  .lede .proof .pf1{margin:0;display:block}
  .lede .proof .pfe{margin:var(--pfb,0px) 0 4px!important} /* the eyebrow travels with the number: just above it */
  .lede .proof .pf1 b{font-weight:600;letter-spacing:-.02em;color:var(--ink);font-variant-numeric:tabular-nums;font-size:36px;line-height:1.1}
}
.lanes:focus{outline:none}
.lanes:focus-visible{outline-offset:6px;border-radius:8px;outline:2px solid rgb(var(--ink-rgb) / .3)}
.ph b{position:absolute;left:0;border-radius:4px;white-space:nowrap;height:18px;padding:0 6px;font:600 12px/18px var(--sans);transform:translateX(0);background:var(--card);color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--ink);display:inline-flex;align-items:center;gap:3px;top:0}
.ph.pin b{background:var(--ink)!important;color:var(--on-ink)!important;box-shadow:none!important}
.ph.pin::before{width:2px!important;left:-1px!important}
.ph::before{-webkit-mask:var(--mk,none);mask:var(--mk,none)}
.ph .pinG{width:10px;height:10px}
.upd .iss{display:inline-block;border-radius:8px;font-size:15px;line-height:20px;padding:0;background:none;color:var(--ink);font-weight:400!important}
.db .dbg{stroke:rgb(var(--ink-rgb) / .1);stroke-width:1}
.lwd .nowv{font-size:13px;fill:var(--ink2);paint-order:stroke;stroke:var(--card);stroke-width:4px;display:none}
@media (max-width:479px){
  .c3d .mhd{flex-wrap:wrap}
  .c3d .mhd .lbl{flex-wrap:wrap;height:auto;row-gap:0}
  .c3d .mhd .lbl small{flex-basis:100%;order:3;margin:0}
  .tfoot .strip,.tfoot .strip.strip{display:grid;column-gap:16px;row-gap:12px;grid-template-columns:1fr}
  .tfoot .strip>div:first-child,.tfoot .strip>div:nth-child(2),.tfoot .strip>div:nth-child(3){grid-column:auto}
}
@media (min-width:480px){
  #lwd{margin-top:12px}
  .tl .hl[style*="grid-row:6"]{margin-top:12px}
}
.lwd .zone{fill:rgba(216,57,46,.14)}
:root[data-theme=dark] .lwd .zone{fill:rgba(239,91,79,.2)}
.lwd .zero{stroke:var(--ink2);stroke-width:1;stroke-dasharray:none}
.status.open::before{background:none;width:12px;height:12px;border-radius:0;font-size:13px;line-height:12px;color:var(--ink2);text-align:center;content:none!important;display:none!important}
.status .ck,.badge .ck{width:14px;height:14px;margin-right:4px;vertical-align:-2px;color:var(--ink2)}
.map .rwp{fill:#55575d;stroke:var(--card);stroke-width:2;paint-order:stroke}
.map .rwt{font:600 13px/1 var(--sans);fill:#fff}
.map .rwt.rwt11{font-size:12px}
.map .rwhalo,.map .rwph{fill:var(--card)}
.map .rwld{fill:none;stroke:rgb(var(--ink-rgb) / .5);stroke-width:1}
.map .rwldd{fill:rgb(var(--ink-rgb) / .5)}
.map .rwtk{fill:none;stroke:var(--ink2);stroke-width:1} /* a plate's leader tick to its runway's threshold */
.map .river{stroke-linejoin:round;stroke-linecap:round;fill:none!important;stroke:#8fb3d1!important;stroke-width:1.5!important}
.map .scl path{fill:none;stroke:var(--ink3);stroke-width:1}
.map .scl text{fill:var(--ink3);font-size:13px}
.mlg .mscl{margin-left:auto;gap:4px;color:var(--ink2);align-items:baseline!important}
.mlg .mscl svg{align-self:baseline}
.mlg .mscl[hidden]{display:none!important}
.mlg .mscl svg{width:auto;height:5px}
.mlg .msb{display:inline-flex;flex-direction:column;align-items:center;gap:1px}
.mlg .msb b{font-weight:400;font-size:12px;line-height:12px}
.mlg .mscl path{fill:none;stroke:var(--ink2);stroke-width:1}
.nowl{position:absolute;bottom:0;z-index:4;width:1.5px;margin-left:-.75px;opacity:1;top:-6px;background:#4b4d53}
:root[data-theme=dark] .nowl{background:var(--ink)}
@media (min-width:900px){
  .proof{margin:0 0 0 6px;padding-left:22px;justify-self:stretch;align-self:stretch;display:flex;flex-direction:column;justify-content:flex-start;padding-top:0;margin-top:0}
}
@media (max-width:479px){
  .lede .headline{text-wrap:balance;font-size:36px!important;line-height:1.1}
  .lede .headline .dbadge{font-size:24px!important;height:40px!important;min-width:52px!important}
  .lede .headline .arr{width:30px;height:22px}
  .tl,.tl.noev{grid-template-rows:34px var(--evh,0px) calc(36px + var(--dirh,44px) + var(--lgh,0px)) calc(36px + min(var(--swh,76px), 96px)) var(--r18row,0px) calc(36px + min(var(--hwh,72px), 96px));grid-template-columns:28px minmax(0,1fr)}
}
.tfoot .strip>div{padding-right:16px;min-width:0}
.tfoot .strip dd,.tfoot .strip dd small{overflow:visible;text-overflow:clip;white-space:normal} /* a fact wraps to a second line rather than losing its end to an ellipsis */
@media (prefers-color-scheme:dark){
  :root:not([data-theme=light]){--risk:#9a9a9a}
}
:root[data-theme=dark]{color-scheme:dark;--risk:#9a9a9a;--risk-w:#c4c4c4}
.pinl{display:none;margin:4px 0 0;font-size:15px;color:var(--ink)}
.pinl .of{font-weight:600;color:var(--inaa-ink)}
.pinl .pl1,.pinl .pl2{display:block}
.pinl .pn{font-size:24px;font-weight:600;line-height:1.2}
.pinl .pl2{margin-top:2px;font-weight:500;color:var(--ink);text-decoration:underline;text-decoration-color:var(--b2);text-underline-offset:4px}
.pinl .nw{white-space:nowrap}
.ccell{cursor:pointer;border-radius:8px;transition:background .15s}
.ccell:hover{background:var(--hover)}
.ccell:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
.lede .expl{text-wrap:pretty;max-width:60ch;line-height:1.35;font-size:15px;color:var(--ink2);margin-top:12px}
@media (min-width:900px){
  .lede{grid-template-columns:minmax(0,14fr) minmax(0,10fr);column-gap:0;align-items:stretch;padding-top:8px;padding-bottom:6px}
  .pfoot{padding-bottom:8px}
}
.lede .disagree{margin-top:6px}
@media (max-width:899px){
  .lede .subhead{font-size:18px;font-weight:600;white-space:normal;margin-top:16px}
  .lede-l .pinl{order:3}
  .lede-l .subhead{order:3}
  .lede-l .expl{order:4}
  .lede-l .disagree{order:5}
}
@media (max-width:479px){
  .pinl{display:block}
  .proof{margin:12px 0 0;padding:12px 0 0;display:none}
  .lede .expl{font-size:15px}
}
.accst{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:2px 0 0;padding-top:6px;border-top:1px solid var(--line);align-items:start}
.rec .accst.accst{margin-top:13px} /* 16 px from the axis labels to the divider (the plot keeps 3 px under its labels) */
@media (max-width:479px){.rec .accst.accst{margin-top:16px}}
.accst dd{font-size:24px!important;line-height:1.15}
@media (max-width:479px){.accst dt{white-space:normal!important}}
@media (max-width:479px){#answer .dbadge{height:36px!important;min-height:36px!important}} /* the 07 badge on the 36 px step */
@media (max-width:479px){#hdsel.readout{flex-wrap:wrap;height:auto;row-gap:4px} #hdsel .ro{flex:1 1 100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis} #hdsel .rback{margin-left:0}} /* phones: "Back to now" on its own row; the readout keeps one line */
.accst .nw{white-space:nowrap}
.accst dt.ofl{font-size:13px;color:var(--ink2)}
.accst>div{display:flex;flex-direction:column;gap:0;min-width:0}
.accst dd{align-items:baseline;gap:6px;margin:0;font-weight:600;color:var(--ink);white-space:normal;display:block;font-size:18px;line-height:1.2}
.accst dd .of{font-size:15px;font-weight:500;color:var(--inaa-ink)}
.accst dt{font-size:13px;line-height:1.25;color:var(--ink2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rec .accsub3{margin-bottom:0}
.db{margin-top:5px;position:relative}
/* the (i): a 16 px drawn icon at the drawn arrows' stroke weight, in a 32 px hit area */
.dbib{position:absolute;width:32px;height:32px;padding:0;border:0;border-radius:50%;background:none;color:var(--ink2);display:grid;place-items:center;cursor:help}
.dbib svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}
.dbib svg .dot{fill:currentColor;stroke:none}
.dbib:hover,.dbib[aria-expanded=true]{color:var(--ink);background:var(--fill)}
.dbib:focus-visible{outline:2px solid var(--ink);outline-offset:-2px}
.dbpop{position:absolute;right:0;top:4px;z-index:20;width:260px;padding:8px 12px;border-radius:8px;background:var(--card);box-shadow:var(--shadow);font-size:13px;line-height:1.45;color:var(--ink2);white-space:normal}
.rec{display:flex;flex-direction:column;padding:16px 22px 16px;padding-top:12px;padding-bottom:12px;overflow:visible}
.cell[data-p=rec]>.card{overflow:visible}
.eyebrow,.pfe{white-space:normal}
@media (min-width:900px){
  .c3d{grid-template-columns:minmax(0,1fr) var(--keyw,140px);grid-template-rows:auto minmax(0,1fr);column-gap:10px;display:flex;flex-direction:column;position:relative}
  .c3d .map{grid-column:1;grid-row:2;flex:1 1 auto;margin-top:2px}
  .c3d .mlg{grid-column:2;grid-row:2;justify-content:center;white-space:normal;line-height:1.3;flex-wrap:nowrap;margin-top:6px;position:absolute;left:16px;right:auto;top:auto;bottom:10px;flex-direction:row;align-items:center;z-index:3;margin:0;padding:4px 8px;border-radius:6px;background:color-mix(in srgb,var(--card) 88%,transparent);font-size:12px;gap:2px 10px;right:16px;flex-wrap:wrap}
  .c3d .mlg span,.c3d .mlg .tk{gap:6px}
  .c3d .mlg .mscl{gap:4px}
  .c3d .mlgt{flex-wrap:nowrap;gap:10px}
  .c3d .mlg svg{width:18px}
  .c3d .mlg .mscl svg{width:auto}
  .c3d .mlg svg{flex:none;margin-top:0;width:18px}
}
@media (max-width:899px){
  .headline{display:block;flex-wrap:wrap;font-size:24px;gap:10px}
  .headline .dbadge{vertical-align:4px;margin-right:6px;font-size:18px;height:30px;min-width:40px}
  .headline .arr{vertical-align:-1px;margin-left:6px;width:26px;height:18px}
}
@media (min-width:480px){
  #lod{margin-top:20px}
}
@media (min-width:900px) and (max-height:860px){
  .lede .subhead{font-size:18px;margin-top:16px}
  .lede .expl{margin-top:8px}
}
.upd .fi{display:none}
@media (max-width:480px){
  .upd .fi{display:inline}
  .eyebrow .ebl{display:none}
}
@media (min-width:900px) and (max-height:860px){
  .lede .proof .pf1 b{font-size:36px}
}
.lpg .pkl{fill:none;stroke:var(--ink2);stroke-width:1}
.lpg .pko{fill:var(--card)} /* the peak note's knockout: no day line or gridline runs through its text */
@media (min-width:900px){ /* every desktop canvas is ~810 px high after the zoom */
  .lede.lede{padding-top:8px;padding-bottom:0}
  .lede #subhead{margin-top:8px!important}
  .lede #expl{margin-top:16px!important} /* tiers: outlook, 16, problem, 8, official */
  .lede #disagree{margin-top:8px!important;line-height:18px;text-wrap:pretty} /* room for a two-line official sentence */
  .lede #expl{line-height:18px;max-width:60ch} /* never wider than the headline */
}
@media (min-width:900px){
  .lede .lede-l>*{padding-left:6px;padding-right:24px}
}
@media (min-width:480px){
  .hl{font-size:13px}
}
.lpg .pk.off{opacity:0}
.db .dbfn{font-weight:600;fill:var(--ink)}
:root[data-theme=dark] .night{background:rgba(0,0,0,.22)} /* dark: a shade darker than the plot, never lighter */
@media (max-width:479px){
  .ruler .h.h0{display:none}
}
@media (max-width:899px){
  .topbar .seg button,#tz button{height:26px!important;font-size:12px!important;padding:0 8px!important}
}
@media (min-width:900px) and (max-height:860px){
  .tlc{padding-top:12px;padding-bottom:12px}
}
.accst dt .of{font-weight:600;color:var(--inaa-ink)}
@media (min-width:480px){
  #hlsw,.hl{white-space:nowrap}
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme=light]) .night{background:rgba(0,0,0,.22)}
}
.accst .ofl{color:var(--ink2)}
.map .rvl{font:italic 400 12px var(--sans);fill:#5f88ab}
@media (max-width:479px){
  .accst dt:not(.ofl){overflow:visible;white-space:nowrap;min-height:0}
}
:root[data-theme=dark] .map .river{stroke:#4f7394!important}
.lpg .pkd{fill:var(--ink)}
.lpg .grid.half{stroke:rgb(var(--ink-rgb) / .14);stroke-dasharray:2 3} /* the dotted mid gridline */
.ruler .h.tagged{visibility:hidden}
.pfb{margin-top:4px;font-size:13px;color:var(--ink3)}
/* the Runway 18 closure note: one full-width line above the three facts, so the facts keep their width */
.tlc .tfoot{flex-wrap:wrap;row-gap:6px}
.tlc .tfoot .r18note{order:-1;flex:1 0 100%;margin:0}
.tlc .tfoot .alert{display:block;line-height:20px}
.tlc .tfoot .alert span::before{content:" · "}
.tlc .tfoot .alert b::before{width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:-1px} /* the closed cells' red square: this line is their key */
@media (min-width:480px){
  .tlc .tlf{margin-top:10px}
  .tlc .tfoot{margin-top:10px;padding-top:8px}
  /* the Runway 18 row and its closure line cost height in a card of fixed height: the two plots give it back,
     the headwind plot down to 46 px and the chance plot down to 32 px on short windows (1366 x 768) */
  .tl.r18on,.tl.noev.r18on{--r18row:26px!important;grid-template-rows:40px var(--evh,0px) calc(20px + 36px) minmax(calc(12px + 32px),1fr) var(--r18row,0px) minmax(calc(12px + 46px),calc(12px + 60px))}
}
@media (max-width:479px){ /* phones: every control in the header and the zoom switch is a 44 px touch target */
  .topbar .nav a,#tz button,#zoom button{height:44px!important;min-height:44px;display:inline-flex;align-items:center}
  .topbar #theme{height:44px}
}
@media (max-width:479px){
  .tl.r18on,.tl.noev.r18on{--r18row:48px!important} /* phones: the row name in the 36 px above, then 12 px cells (the row was 0 px tall) */
}
@media (min-width:900px){
  .topbar{padding-left:max(24px, calc((100% - 1360px) / 2 + 24px))!important;padding-right:max(24px, calc((100% - 1360px) / 2 + 24px))!important}
}

/* the hero column never grows past the page margin (its no-wrap runs wrap as whole runs instead) */
.lede-l{min-width:0}
.pinl .pl0{display:block;font-size:15px;font-weight:500;color:var(--ink2);line-height:20px}
.pinl .pl1{display:flex;flex-wrap:wrap;align-items:baseline;column-gap:12px;row-gap:0}
.pinl .pl1 .nw{color:var(--ink2)}
.pinl .pl2{display:inline-flex;align-items:center;text-decoration:none}
.pinl .pl2 .u{text-decoration:underline;text-decoration-color:var(--b2);text-underline-offset:4px}
.pinl .pn{font-weight:500}
/* text arrows are the drawn arrow, at text size, in the link's colour */
.beat .tarr,.m3d .tarr{margin:0 0 0 .35em;width:1.05em;height:.75em;vertical-align:-.02em;stroke-width:3}
.pf3 a.beat .tarr{color:var(--east-line)}
/* "3D view": a small ghost button */
.m3d{display:inline-flex;align-items:center;height:32px;margin:-7px 0;padding:0 10px;border-radius:8px;box-shadow:inset 0 0 0 1px var(--b2);text-decoration:none;color:var(--ink);transition:background-color .15s var(--ease)}
.m3d:hover{background:var(--hover)}
/* the hero accuracy: the KPI figures' step (24 px semibold), smaller than the headline; its label's top on the kicker's
   top and the number directly under its label */
.lede .proof .pf1 b{font-weight:600!important;letter-spacing:-.01em}
@media (min-width:900px){
  .lede .proof .pfe{margin:0 0 4px!important}
  .lede .proof .pf1{margin-top:0!important}
  .lede .proof .pf1 b{font-size:24px!important;line-height:1.15!important}
  .lede .subhead{font-size:24px!important;font-weight:600!important;line-height:1.25!important} /* one type step with the hero figure and the KPI figures */
}
/* the accuracy card's bottom padding (to its last line of text) equals its top padding (to its title): the space comes
   from the gap above the 49 / 65 % row */
@media (min-width:900px){
  .rec{padding-bottom:18px!important}
  .rec .accst.accst{margin-top:2px}
  .rec .acchd{height:26px;min-height:26px;box-sizing:border-box;padding-top:0} /* the title where it was (as on the other cards), 6 px less under it */
  .rec .accst.accst{padding-top:4px}
  .rec .accst dd{line-height:1} /* the KPI figures' line box on the glyphs */
}
/* the switch chip names its hour; a tick marks the hour when the chip has to sit left of it */
#lod .swchip,.lanes > .swchip{height:16px;font:500 13px/16px var(--sans)}
.lanes > .swtick{position:absolute;width:2px;margin-left:-1px;background:var(--ink);z-index:3;pointer-events:none}
/* the in-bar direction label on a solid chip of its bar colour, so the night hatch never runs behind it */
.dlab{padding:3px 6px;margin-left:-6px;border-radius:3px;line-height:14px}
.dlab.e{background:var(--east)}
.dlab.w{background:var(--west);color:#10131c} /* dark ink on teal in both themes (>= 4.5:1), as the switch chip */
/* axis values at the 13 px step */
.lpg .gt,.lwd .ax{font-size:13px}
/* the headwind limit: a neutral dashed line (red is the Runway 18 closure only) */
.lwd .lim{stroke:var(--ink2);opacity:1}
.lwd .zone{fill:rgb(var(--ink-rgb) / .07)}
:root[data-theme=dark] .lwd .zone{fill:rgba(255,255,255,.08)}
.lwd .limt{fill:var(--ink2)!important}
.limsw{border-top-color:var(--ink2)!important;opacity:1}
/* dark: the night band a step lighter than the card, with hairline edges */
:root[data-theme=dark] .night{background:rgba(255,255,255,.06);box-shadow:inset 1px 0 rgba(255,255,255,.09),inset -1px 0 rgba(255,255,255,.09)}
@media (prefers-color-scheme:dark){
  :root:not([data-theme=light]) .night{background:rgba(255,255,255,.06);box-shadow:inset 1px 0 rgba(255,255,255,.09),inset -1px 0 rgba(255,255,255,.09)}
  :root:not([data-theme=light]) .lwd .zone{fill:rgba(255,255,255,.08)}
}
@media (max-width:479px){
  /* row names on a card-coloured chip: day lines and night bands stop at the name */
  .tl .hl{background:var(--card);border-radius:4px}
  /* "Back to now" on the readout line, over its right end: no reserved row under the readout */
  #hdsel.readout{position:relative;flex-wrap:nowrap}
  #hdsel .rback{position:absolute;right:0;top:50%;transform:translateY(-50%);margin:0}
  #hdsel.readout{height:32px;align-items:center}
  #hdsel .ro{white-space:normal!important;line-height:16px;max-height:32px;overflow:hidden;text-overflow:clip}
  #hdsel:has(.rback[style*="visible"]) .ro{padding-right:112px} /* pinned: up to two 16 px lines beside the button, in the same 32 px row */
  /* segmented controls: the track shows 4 px round the selected pill */
  .seg{padding:4px}
  .seg>i{top:4px;height:calc(100% - 8px)!important}
  .topbar .nav{padding:4px}
  #tz button{padding:0 6px!important}
}
/* desktop top band: the intro runs the width of its column, up to the accuracy block's rule */
@media (min-width:900px){ .lede .expl{max-width:none;padding-right:8px} }
/* the 48 h card: a slimmer direction bar gives the chance plot its height */
@media (min-width:480px){
  .tl.r18on,.tl.noev.r18on{grid-template-rows:40px var(--evh,0px) calc(18px + 28px) minmax(calc(8px + 32px),1fr) var(--r18row,0px) minmax(calc(12px + 46px),calc(12px + 60px))}
  .tl.r18on #lod{margin-top:18px}
  .tl.r18on #lpg{margin-top:8px}
  .tlc .tlf{margin-top:8px}
  .tlc .tfoot{margin-top:8px}
}
.r18lead{position:absolute;width:1px;background:var(--red);opacity:.6;pointer-events:none}
.r18brk{position:absolute;height:3px;border:1px solid var(--red);border-bottom:0;border-radius:2px 2px 0 0;opacity:.6;pointer-events:none;box-sizing:border-box} /* a bracket over the closed cells, where the leader lands */
@media (max-width:479px){
  /* phones: the Now pill 12 px inside the card, row-name chips their text width + 4 px (the text stays where it was) */
  .tl,.tl.noev{grid-template-columns:31px minmax(0,1fr)}
  .ruler .nowtag{padding:0 4px}
  .tl .hl{padding:0 2px;margin-left:calc(6px + var(--nowx,0px))}
}
/* the accuracy claim reads as a link at rest, on every width: a visible underline under its words */
.pf3 a.beat .u,.pinl .pl2 .u{text-decoration:underline;text-decoration-color:rgb(var(--ink-rgb) / .4);text-decoration-thickness:1px;text-underline-offset:4px}
.pf3 a.beat:hover .u,.pinl .pl2:hover .u{text-decoration-color:currentColor}
.phexpl{display:none}
@media (max-width:479px){
  /* phones: the 48 h chart's headwind row starts inside the first screen; the intro sentence moves under the panels */
  .topbar{padding-top:8px!important;padding-bottom:8px!important;row-gap:6px!important}
  .lede{padding-top:10px!important;padding-bottom:10px!important}
  .lede .subhead{margin-top:10px!important}
  .lede .expl{display:none}
  .phexpl{display:block;margin:4px 24px 8px;font-size:15px;line-height:1.4;color:var(--ink2);text-wrap:pretty} /* on the footer text's left edge */
  .tlc{padding-top:12px!important}
  /* the kicker reads as on desktop: "Runway direction now · since <day>, <time>" */
  .lede .eyebrow::before{content:none!important}
  .lede .eyebrow .ebl{display:inline!important}
  /* a thin Now line: still the darkest rule, no longer an axis */
  .nowl{width:1px;margin-left:-.5px}
}
@media (max-width:479px){
  /* phones: the accuracy block set apart from the headline by a hairline and 8 px more air; its figure no larger than the outlook line */
  .lede .pinl{margin-top:8px;padding-top:8px;border-top:1px solid var(--line)}
  .lede .pinl .pn{font-size:18px;line-height:24px}
  .lede .pinl .pl1{column-gap:10px}
  /* the 48 h card: a tighter top, so the headwind plot ends inside the first screen */
  .lede{padding-bottom:8px!important}
  .tlc{padding-top:8px!important}
  .tl,.tl.noev{grid-template-rows:34px var(--evh,0px) calc(32px + var(--dirh,44px) + var(--lgh,0px)) calc(32px + min(var(--swh,76px), 96px)) var(--r18row,0px) calc(32px + min(var(--hwh,72px), 96px))}
  .tl .ln,.lwd{margin-top:32px!important}
  .tl .hl{margin-top:10px}
}
/* accuracy by lead time: every label at the 13 px secondary step, in the body's secondary grey (>= 5:1) */
.db .dbt.tk,.db .dbt.sub,.db .dbt.cap,.db .dbt.unit,.db .dbpt,.db .dbplan{font-size:13px;fill:var(--ink2)}
/* accuracy by lead time: a thin baseline with tick marks through it, the values directly under them; the rows take the
   card's spare height, the stat tiles 8 px under the axis values */
.db .dbax,.db .dbtm{stroke:rgb(var(--ink-rgb) / .45);stroke-width:1}
@media (min-width:480px){.rec .accst.accst{margin-top:8px}}
/* 48 h card: the chance and headwind scale values and the limit label in the accuracy axis's 13 px secondary grey */
.lpg .gt,.lwd .ax{font-size:13px;fill:var(--ink2)}
.lwd .limt{font-size:13px;font-weight:400}
/* the flight-path map's north arrow and scale bar: a drawn 14 px arrow, a 2 px bar, 13 px secondary labels */
.map .scl path{fill:none;stroke:var(--ink2);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.map .scl path.narw{stroke-width:1.5}
.map .scl text{font-size:13px;fill:var(--ink2)}
.map .scl text.nlbl{font-weight:600}
/* the theme toggle: an 18 px glyph at the other icons' 1.5 px stroke (24-unit box at 2 units), in a 32 px hit area */
.icon.thm svg{width:18px;height:18px}
/* the footer: two short lines side by side (desktop), the sources under the 48 h card, the backtest note under the
   accuracy card from its left edge (--fc2, set by fit()), never one line across the whole window */
@media (min-width:900px){.pfoot>span:first-child{display:grid;grid-template-columns:var(--fc2,58%) minmax(0,1fr);flex:1}.pfoot .fl{display:block;min-width:0;padding-right:16px}}
@media (min-width:1280px){.pfoot .fl{white-space:nowrap}} /* one line each, whatever font is in when fit() measures */
/* runway plates on the light map: a white plate with a dark hairline and dark text, secondary to the paths */
:root:not([data-theme=dark]) .map .rwp:not(.cl){fill:var(--card);stroke:#55575d;stroke-width:1;paint-order:normal}
:root:not([data-theme=dark]) .map .rwt:not(.cl){fill:var(--ink)}
.map .rwt.cl{fill:#fff}
@media (min-width:900px){
  /* the flight-path key: two rows (paths, then places) on the card's text edge */
  .c3d .mlg{justify-content:flex-start!important;left:12px!important;right:auto!important;max-width:calc(100% - 24px)}
  .c3d .mlg .mlgt{flex-basis:100%}
  /* the hero 8 px further from the header rule */
  .lede.lede{padding-top:16px}
}
/* round 9 (desktop). The hero: the accuracy figure one type step under the headline (24 px, the headline stays the one
   large figure), the accuracy block on its card column's edge like the kicker on the 48 h card's (no divider, no inset). */
@media (min-width:900px){
  .lede .proof.proof{border-left:0!important;padding-left:0!important}
  .lede .proof .pf1 b,.lede .proof .pf1 b.pn{font-size:24px!important;line-height:1.1}
  /* one header row on every card: 12 px under the card's top edge, 32 px tall (the controls' height), the title and the
     control on its right centred in it, so the three titles sit at one offset from their card tops */
  .tlc.tlc,.rec.rec,.c3d.c3d{padding-top:12px}
  .tlc .hd,.rec .acchd,.c3d .mhd{height:32px;min-height:32px;margin-top:0;align-items:center;flex:none}
  .tlc .hd h2,.rec .acchd .lbl,.c3d .mhd .lbl{line-height:24px;height:24px;align-items:center}
  /* the footer: the backtest note ends on the content's right edge (the accuracy and flight-path cards'), as on the 3D view */
  .pfoot .fl+.fl{text-align:right;padding-right:0}
}
/* the switch chip and the official tag: free-standing labels 3 px over the direction bar (not tabs on its edge); the
   "18 closed" tag 6 px under the hour axis */
#lod .swchip,.lanes > .swchip,#lod .pgtag{border-radius:3px}
#lod .pgtag{top:-17px}
#lod .pgtag.ra::after{bottom:-7px;height:7px}
#ev .mk{top:6px}
/* the numbered towns: neutral markers (white disc, dark-grey ring, dark numeral) on a 2 px card halo, so a path passing
   under one visibly breaks; never the East navy. The key's discs are the same marker. */
.map .tnumh{fill:var(--card)}
.map .tnum.tnum{fill:var(--card);stroke:var(--ink2);stroke-width:1.5;paint-order:normal}
.map .tnumt.tnumt{fill:var(--ink)}
.mlgt i,.mlgt .tk i{background:var(--card)!important;color:var(--ink)!important;box-shadow:inset 0 0 0 1.5px var(--ink2)}
/* the Main: named along its line in a darker step of its blue (an italic map label) */
.map .rvl{font:italic 600 13px var(--sans);fill:#244f72;paint-order:stroke;stroke:var(--card);stroke-width:3px;stroke-linejoin:round} /* the river's name: a darker blue on a card-colour halo (>= 4.5:1), as on the 3D map */
:root[data-theme=dark] .map .rvl{fill:#8fb3d1}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .map .rvl{fill:#8fb3d1}}
/* the headwind limit's label inside the plot, over its line, on a card-coloured halo */
.lwd .limt.inplot{paint-order:stroke;stroke:var(--card);stroke-width:4px;stroke-linejoin:round}
/* round 11: the operator's view. The hero answers now, the switch (when and how sure) and Runway 18; the accuracy is one
   quiet line whose link opens the accuracy card as a detail view; the 48 h card and the map share the main row. */
.lede .trust{margin:8px 0 0;font-size:15px;line-height:20px;color:var(--ink2);text-wrap:pretty}
.lede .trust .nw{white-space:nowrap}
.lede .trust a.beat{color:inherit;white-space:nowrap}
.lede .trust a.beat .u{text-decoration:underline;text-decoration-color:rgb(var(--ink-rgb) / .4);text-decoration-thickness:1px;text-underline-offset:4px}
.lede .trust a.beat:hover{color:var(--ink)}
.lede .trust a.beat:hover .u{text-decoration-color:currentColor}
.lede .trust .tarr{color:currentColor}
/* the switch line: the instant at the KPI step, the hours to go and the certainty on a second, lighter line */
.lede .subhead .sh1,.lede .subhead .sh2{display:block}
.lede .subhead .sh2{margin-top:2px;font-size:18px;font-weight:400;line-height:24px;color:var(--ink2)}
.lede .subhead .nw{white-space:nowrap}
/* the hero's Runway 18 block: label on the kicker's line, the state at the KPI step, the next closure keyed by the closed cells' red */
.r18h .r18l{font-size:15px;font-weight:500;line-height:20px;color:var(--ink2)}
.r18h .r18s{margin-top:4px}
.r18h .r18s b{display:block;font-size:24px;font-weight:600;line-height:1.15;letter-spacing:-.01em;color:var(--ink)}
.r18h .r18n{margin:8px 0 0;font-size:15px;line-height:20px;color:var(--ink2)}
.r18h .r18w,.r18h .r18i{display:block;padding-left:18px}
.r18h .r18w b{font-weight:500;color:var(--ink)}
.r18h .r18d{display:inline-block;width:10px;height:10px;margin:0 8px 0 -18px;border-radius:50%;background:var(--red);vertical-align:0}
.r18h .r18i .sep{display:none}
.r18h .r18w.calm{padding-left:0}
@media (min-width:900px){
  .lede .r18h{grid-area:1/3/span 5/4;margin:0 0 0 6px;padding:0;align-self:start;min-width:0}
  .lede .trust{grid-area:4/1}
}
@media (max-width:899px){
  .lede .r18h{margin:12px 0 0;padding:12px 0 0;border-top:1px solid var(--line)}
}
/* the 48 h card's foot: one compact wind line under the legend */
.tlc .tfoot{display:block;margin:6px 0 0;padding:0;border:0}
.tlc .wind24{margin:0;font-size:13px;line-height:20px;color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tlc .wind24 b{font-weight:600;color:var(--ink)}
.tlc .wind24 .wk::after{content:" ·"}
.tlc .wind24 .ws::before{content:"· "}
/* the accuracy detail view: the accuracy card, as it was on the page, in a modal dialog */
.recdlg{padding:0;border:0;background:none;color:inherit;overflow:visible;max-width:calc(100vw - 32px);max-height:none}
.recdlg::backdrop{background:rgb(18 19 22 / .36)}
.recdlg .rec{width:520px;height:262px;box-sizing:border-box;box-shadow:0 24px 64px rgb(18 19 22 / .28)}
.rec .acchd{gap:12px}
.rec .acchd .lbl small{margin-left:8px}
.rec .acchd .acck{margin-left:auto}
.recx{flex:none;width:32px;height:32px;margin:0 -8px 0 0;border-radius:8px;display:grid;place-items:center;color:var(--ink2)}
.recx svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}
.recx:hover{background:var(--hover);color:var(--ink)}
@media (max-width:899px){
  .recdlg .rec{width:min(520px, calc(100vw - 32px));height:auto}
}
/* the flight-path card's operator line: what a switch would change on the map */
.c3d .mif{margin:0;font-size:13px;line-height:18px;color:var(--ink2)}
.c3d .mif[hidden]{display:none}
/* the 48 h card, now without its stat row: the chance and headwind plots share the height (the headwind plot to ~0.6 of
   the chance plot's), the limit's label under its dashed line on the shaded zone (no halo needed there) */
@media (min-width:480px){
  .tl.r18on,.tl.noev.r18on{grid-template-rows:40px var(--evh,0px) calc(18px + 28px) minmax(calc(8px + 32px),1fr) var(--r18row,0px) minmax(calc(12px + 46px),.62fr)}
  .tl,.tl.noev{grid-template-rows:40px var(--evh,0px) calc(20px + 36px) minmax(calc(12px + 58px),1fr) var(--r18row,0px) minmax(calc(12px + 66px),.62fr)}
}
.lwd .limt.inplot{stroke:none}
/* the event tags: "18 closed" and the switch chip one height, one font, on one baseline 3 px over the direction bar; each
   joined to its moment by a 1 px stem */
@media (min-width:480px){
  #ev .mk{height:16px;font:500 13px/16px var(--sans);border-radius:3px}
}
.lanes > .swstem{position:absolute;width:1px;z-index:8;pointer-events:none}
/* phones: the trust line under the outlook (before the Runway 18 block); the Runway 18 block compact: name and state on
   one line, the closure and what it moves under it, so the 48 h chart's headwind row stays on the first screen */
@media (max-width:899px){
  .lede-l .trust{order:4}
}
@media (max-width:479px){
  .lede .subhead .sh2{font-size:15px;line-height:20px}
  .lede .subhead .sh2 .nw{white-space:normal}
  .lede .trust{font-size:13px;line-height:18px;margin-top:4px}
  .lede .r18h{margin-top:8px;padding-top:8px;display:flex;flex-wrap:wrap;align-items:baseline;column-gap:8px}
  .r18h .r18s{margin:0}
  .r18h .r18s b{font-size:15px;line-height:20px;display:inline}
  .r18h .r18n{flex:1 0 100%;margin-top:2px;font-size:13px;line-height:18px}
  .r18h .r18d{width:8px;height:8px;margin-right:6px;margin-left:-14px}
  .r18h .r18w,.r18h .r18i{padding-left:14px}
}
@media (max-width:479px){ .tlc .wind24{white-space:normal} }
@media (min-width:900px) and (max-height:860px){ .lede .trust{margin-top:4px} .lede .subhead .sh2{margin-top:0} }
/* phones: the trust line moves under the cards, a footnote above the page footer; the Runway 18 block without its rule */
.trustph{display:none}
@media (max-width:479px){
  .lede .trust{display:none}
  .trustph{display:block;margin:12px 16px 0;font-size:13px;line-height:18px;color:var(--ink2);text-wrap:pretty}
  .trustph .nw{white-space:nowrap}
  .trustph a.beat{color:inherit}
  .trustph a.beat .u{text-decoration:underline;text-decoration-color:rgb(var(--ink-rgb) / .4);text-decoration-thickness:1px;text-underline-offset:4px}
  .trustph .tarr{color:currentColor}
  .lede .r18h{border-top:0;padding-top:0;margin-top:10px}
}
@media (max-width:479px){ /* the Runway 18 block costs the first screen ~60 px: the chance plot gives up to 20 of it (78 px, was 96) */
  .tl,.tl.noev{grid-template-rows:34px var(--evh,0px) calc(32px + var(--dirh,44px) + var(--lgh,0px)) calc(32px + min(var(--swh,76px), 76px)) var(--r18row,0px) calc(32px + min(var(--hwh,72px), 96px))}
}
.recdlg .rec.rec{padding-bottom:16px!important} /* the card's bottom padding to its last text equals its top padding to the title */
@media (max-width:479px){ .c3d{height:320px} } /* phones: the map keeps its height under the operator line */
/* round 12. The Runway 18 block: a closure in the window is the big line ("Closes tomorrow 07:00-16:00"), keyed by the
   closed cells' red: a hollow ring while it is scheduled, a filled dot while it is in effect; the date, the routine state
   and what it moves are the quiet lines. Its lines take the metrics of the left column's (the
   switch line, its second line, the trust line), and the block sits on the left column's bottom edge. */
.r18h .r18s b{display:block}
.r18h .r18d{display:inline-block;box-sizing:border-box;width:12px;height:12px;margin:0 10px 0 0;border-radius:50%;border:2.5px solid var(--red);background:var(--red);vertical-align:1px}
.r18h .r18d.ring{background:transparent}
.r18h .r18n{margin:0}
.r18h .r18w,.r18h .r18i{display:block;padding-left:0}
@media (min-width:900px){
  .r18h .r18d{margin:0 8px 0 0;vertical-align:1px} /* inline before the headline, inside the column (never in the gutter) */
  .lede.lede{grid-template-columns:minmax(0,17fr) 0 minmax(0,7fr)!important;padding-bottom:16px}
  /* the block spans the left column's height, each line on its partner's baseline (alignR18): the label on the
     headline's, the closure on the switch line's, the quiet line on its second line's, what it moves on the trust line's */
  .lede .r18h{grid-area:1/3/-1/4;align-self:stretch;display:flex;flex-direction:column;justify-content:flex-start}
  .lede .r18h .r18n{display:contents}
  .lede .r18h .r18s,.lede .r18h .r18w,.lede .r18h .r18i{margin-top:0}
  .r18h .r18s b{font-size:18px;line-height:24px} /* one type step (siteui.TYPE) under the switch line, so the two never compete */
  .r18h .r18w{margin-top:2px;line-height:20px} /* each line its text height: the gaps the block spreads are the gaps you see */
  .r18h .r18i{margin-top:8px;line-height:20px}
}
@media (min-width:900px) and (max-height:860px){ .lede .r18h .r18w{margin-top:0} .lede .r18h .r18i{margin-top:0} }
/* round 12: the 48 h chart about two thirds of the main row (hourly cells ~16 px at 1440), the row names' column to its
   longest name */
@media (min-width:900px){ .tl,.tl.noev{grid-template-columns:112px minmax(0,1fr)} }
/* round 13: "Open in 3D" a quiet text link in the trust line's "how we measure" style (the header tab is the button) */
.c3d .m3d{height:auto;margin:0 0 0 auto;padding:0;border-radius:0;box-shadow:none;background:none;color:var(--ink2);font-size:13px;font-weight:400;line-height:20px;text-decoration:none}
.c3d .m3d .u{text-decoration:underline;text-decoration-color:rgb(var(--ink-rgb) / .4);text-decoration-thickness:1px;text-underline-offset:4px}
.c3d .m3d:hover{background:none;color:var(--ink)}
.c3d .m3d:hover .u{text-decoration-color:currentColor}
/* round 13: the readout on the title's line when it fits (placeReadout), on the title's baseline, 16 px after it */
@media (min-width:900px){
  .tlc.roinl .hd #hdsel.readout{flex:1 1 auto;min-width:0;margin:0 4px;height:24px;line-height:24px;align-self:center;position:relative;top:1px} /* 16 px after the title with the row gap (12), on its baseline */
  .tlc.roinl .hd #hdsel .ro{line-height:24px;white-space:nowrap}
  .tlc.roinl .hd #hdsel .rback{position:absolute;right:0;top:50%;transform:translateY(-50%);margin:0}
  .tlc.roinl .hd #zoom{margin-left:0}
}
/* round 13: the night bands behind the bars (the lanes isolate, so -1 stays above the card) */
.lanes{isolation:isolate}
#nbands{z-index:-1}
/* a 24 px band between the direction bar and the chance plot (round 13: 18), where the peak note sits above the top
   gridline with the 3D view's air under the bar */
@media (min-width:900px){ #lpg,.tl.r18on #lpg{margin-top:24px} #hlsw{margin-top:24px} }
/* the "18 closed" tag in the Runway 18 lane: the row gives it 8 px more above its cells (16 px tag, 4 px over the chance
   plot's baseline, sitting on the 3 px bracket) */
@media (min-width:480px){ .tl.r18on,.tl.noev.r18on{--r18row:38px!important} .tl.r18on #l18{margin-top:28px} .tl.r18on #hl18{position:relative;top:9px} } /* 4 px more over the cells (from the chance plot): the "18 closed" tag 3 px clear of its bracket */
/* the switch chip and the official tag 4 px over the direction bar */
#lod .pgtag{top:-18px}
#ev .mk.r18.inlane{z-index:7}
#ev .mk.r18.inlane.edge{transform:none} #ev .mk.r18.inlane.edge:active{transform:scale(.95)} /* phones: placed by its left edge */
/* the flight-path card's operator line: what flies now, then what would fly if switched, each clause kept whole */
.c3d .mif .mi0,.c3d .mif .mi1{display:block}
.c3d .mif .nw{white-space:nowrap}
@media (max-width:479px){ .c3d .mif .mi0{display:none} }
/* the footer: the backtest note ends on the right content edge whatever the right column's width */
@media (min-width:900px){ .pfoot>span:first-child{grid-template-columns:minmax(0,1fr) auto} .pfoot .fl+.fl{padding-left:24px} }
@media (max-width:479px){
  .r18h .r18d{width:9px;height:9px;border-width:2px;margin:0 6px 0 0;vertical-align:0}
}
"""


JS = r"""
const $ = id => document.getElementById(id), D = JSON.parse($('data').textContent), H0 = D.hours;
let H = D.hours; // replaced by the live forecast (live.json) when served over http
const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };
const still = matchMedia('(prefers-reduced-motion: reduce)');
// sel = hour shown (-1 = now); pin = hour held by a click, drag or key (hover only previews, leaving returns to it)
let tz = store.get('fra-tz') === 'utc' ? 'UTC' : 'Europe/Berlin', span = 48, off = 0, sel = -1, pin = -1, playing = 0, dragging = false;

// ---- formatting (Local = Frankfurt time; the night ban and traffic profile are always Frankfurt hours)
const fmt = o => new Intl.DateTimeFormat('en-GB', { timeZone: tz, hourCycle: 'h23', ...o });
const hm = t => fmt({ hour: '2-digit', minute: '2-digit' }).format(new Date(t));
const dhm = t => fmt({ weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(t)); // Fri 6 Nov, 19:00 everywhere
const dayf = t => fmt({ weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(t));
const hourOf = t => +fmt({ hour: '2-digit' }).format(new Date(t));
const fraHour = t => +new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', hourCycle: 'h23' }).format(new Date(t));
const plus1h = t => new Date(new Date(t).getTime() + 3600e3);
const pct = p => (p >= 0.995 ? '>99\u202f%' : p < 0.005 ? '<1\u202f%' : `${Math.round(p * 100)}\u202f%`); // the one probability format
const word = od => (od === 25 ? 'West' : 'East'); // one wording on both pages: the plate (07 / 25) and East / West
const two = od => (od === 25 ? '25' : '07');
const col = od => (od === 25 ? 'var(--west)' : 'var(--east)');
const sw = od => `<i class="sw" style="background:${col(od)}"></i>`;
const rw = od => `<b>${two(od)}</b>`;
const hoursFrom = t => Math.round((new Date(t) - new Date(D.issue)) / 3600e3);
const compass = d => ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(((d % 360) + 360) % 360 / 45) % 8];
const comp = (h, hdg) => -h.ws * Math.cos((h.wd - hdg) * Math.PI / 180); // + = tailwind on that heading
const night = t => { const h = fraHour(t); return h >= 23 || h < 5; };
const prog = h => (h.pg === undefined ? null : h.pg >= 0.75 ? 25 : h.pg <= 0.25 ? 7 : 0); // 0 = mixed / change possible
const pOf = (h, od) => (od === 25 ? h.p25 : 1 - h.p25);
const idxOf = t => H.findIndex(h => Date.parse(h.t) === Date.parse(t));
try { if (innerWidth >= 480) document.getElementById('tzl').textContent = `Local (${new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', timeZoneName: 'short' }).formatToParts(new Date()).find(p => p.type === 'timeZoneName').value})`; } catch {}
document.addEventListener('click', e => { // "How this works" opens a popover, so the card never clips it
  { const a = e.target.closest('a.beat'); if (a) { e.preventDefault(); openRec(); return; } } // the trust line links to its evidence: the accuracy detail view
  { const d = $('recdlg'); if (d && d.open && (e.target === d || e.target.closest('.recx'))) { d.close(); return; } } // closes on its button or a click outside the card
  { const dp = document.getElementById('dbpop'); if (dp && !e.target.closest('#dbib,#dbpop')) { dp.hidden = true; document.getElementById('dbib')?.setAttribute('aria-expanded', 'false'); } } // the (i) popover closes on a tap elsewhere
  const b = e.target.closest('.howbtn'), p = $('howpop');
  if (b) { const r = b.getBoundingClientRect(), z = zoom(); p.hidden = !p.hidden; p.style.left = `${r.left / z}px`; p.style.top = `${(r.bottom + 6) / z}px`; return; }
  if (!e.target.closest('#howpop')) p.hidden = true;
});
const nowIdx = () => Math.max(0, Math.min(H.length - 1, Math.floor((Date.now() - Date.parse(H[0].t)) / 36e5))); // the hour we are in
// the current slot's name: a forecast hour runs from its valid time (fra.dataset: label index = hour start) for one hour, so
// the first slot of a fresh forecast (lead 1 h) starts after the issue; named by its window, never as a later clock time
const slotLab = t => { const a = Date.parse(t); return `${hm(a)}\u2013${hm(a + 36e5)}`; }; // the current slot as its one-hour window (the card title already says what comes next)

// ---- events = timeline markers: the predicted direction change, Runway 18 closures
function events() {
  const ev = [];
  // the switch itself: its chip sits on the tag band (renderTimeline)
  H.forEach((h, i) => { if (h.p18 < 0.5 && (i === 0 || H[i - 1].p18 >= 0.5)) ev.push({ i, kind: 'r18', label: '18 closed' }); });
  const pg = pgDiff(); // the one disagreement worth seeing: marked where it happens
  return ev.sort((a, b) => a.i - b.i);
}
function r18Windows() { // [start, end] index ranges where Runway 18 is predicted not usable
  const w = [];
  H.forEach((h, i) => { if (h.p18 < 0.5) { if (w.length && w[w.length - 1][1] === i - 1) w[w.length - 1][1] = i; else w.push([i, i]); } });
  return w;
}

// ---- summary: the shown hour (now = the flown direction)
function renderOD() {
  const now = sel < 0, h = now ? H[nowIdx()] : H[sel], od = now ? D.od_now : h.od;
  $('odtag').textContent = ''; $('odtag').hidden = true; // the date sits on the axis pill only
  $('hdsel').classList.toggle('on', !now);
  $('odtag').classList.toggle('later', !now);
  $('back').style.visibility = pin >= 0 && pin !== nowIdx() && sel === pin ? 'visible' : 'hidden'; // only once a click has pinned an hour // in the DOM always: no layout shift
  $('odnum').textContent = two(od); $('odnum').style.setProperty('--dc', col(od));
  $('odword').textContent = word(od);
  $('oddesc').innerHTML = `All take-offs and landings toward the ${od === 25 ? 'west' : 'east'} (heading ${od === 25 ? '250' : '070'}°); landings over ${od === 25 ? 'Offenbach' : 'Flörsheim, Raunheim and Rüsselsheim'}.`;
  const hrs = D.since ? Math.max(0, Math.round((Date.now() - Date.parse(D.since)) / 36e5)) : null;
  const dur = hrs === null ? 'n/a' : hrs >= 48 ? `${Math.round(hrs / 24)} days` : `${hrs}\u202fh`;
  // one definition on both pages: the component of the forecast wind (unrounded) along the runway in use, rounded once
  const tw = h.ws === undefined ? null : Math.round(comp(h, od === 25 ? 249 : 69));
  const twS = h.ws === undefined ? 'n/a' : `${Math.round(h.ws)}\u202fkt from ${compass(h.wd)} (${String(h.wd).padStart(3, '0')}°)`;
  const ok = h.p18 >= 0.5, r18 = [`Runway 18 West${now ? '' : ` at ${hm(h.t)}`}`, `<span class="status ${ok ? 'open' : 'closed'}">${ok ? 'Open' : 'Closed'}</span><span class="dd2">take-offs to the south only</span>`, `Closure chance ${now ? 'now' : `at ${hm(h.t)}`}: ${pct(1 - h.p18)}. It closes when the wind across it is too strong.`];
  const windT = 'The official rule switches direction when the tailwind stays above 1\u202fkt for more than 30 minutes, or at once from 10\u202fkt';
  const twS2 = h.ws === undefined ? 'n/a' : `${tw === null ? '' : `${tw > 0 ? 'tailwind' : 'headwind'} ${Math.abs(tw)}\u202fkt on ${two(od)}`} <small>from ${compass(h.wd)} · ${String(h.wd).padStart(3, '0')}°</small>`;
  const oth = x => Math.min(x.p25, 1 - x.p25), pkH = H.slice(nowIdx()).reduce((a, x) => (oth(x) > oth(a) ? x : a), H[nowIdx()]);
  void twS2; void windT;
  // no wind line in the 48 h card's foot: the readout carries the next hour's headwind and the chart its 48 h course
  if ($('eyebrow')) $('eyebrow').innerHTML = D.since ? `<span class="ebl">Runway direction now · </span><span class="nw">since ${dayf(D.since)}<span class="ebl">, ${hm(D.since)}</span></span>${hrs === null ? '' : `<span class="nw"> · ${dur}</span>`}` : 'Runway direction now'; // how long it has held: the kicker's last part
  { const twH = h.ws === undefined ? null : Math.round(-comp(h, od === 25 ? 249 : 69)), osw = Math.min(h.p25, 1 - h.p25);
    // the readout under the card title: the hour under the cursor (or now), always the same four facts
    const si = now ? nowIdx() : sel, nb = night(h.t), nk = nb ? H.findIndex((x, k) => k > si && !night(x.t)) : -1; // a night hour reads as the night ban whether it is now or pinned (as in 3D)
    const ph2 = matchMedia('(max-width:479px)').matches, tlab = t => (ph2 ? `${dayf(t).split(' ')[0]} ${hm(t)}` : dhm(t)); // phones: the weekday and the time
    if (nb) $('oduse').innerHTML = `<b>${tlab(h.t)}</b> · ${nk >= 0 ? T.night_next.replace('{od}', two(H[nk].od)).replace('{t}', hm(H[nk].t)).replace(/^N/, 'n') : 'night ban'}`; else // the shared night phrase (siteui.COPY.night_next) // the night ban: what happens next, not a direction nobody flies
    $('oduse').innerHTML = `<b>${now ? slotLab(h.t) : tlab(h.t)}</b> · ${now ? `${pct(pOf(h, od))} ${word(od)}` : `${pct(pOf(h, D.od_now === 25 ? 7 : 25))} chance of ${word(D.od_now === 25 ? 7 : 25)}`}${twH === null ? '' : ` · ${twH >= 0 ? 'headwind' : 'tailwind'} ${Math.abs(twH)}\u202fkt`}`; } // headwind on phones too, as in 3D
}
function r18Now() { // the Runway 18 status at the current hour (both pages, siteui.COPY.r18_*): the next closure in the window,
  // scheduled or in effect, or none; never the hovered hour
  const n0 = nowIdx(), W = r18Windows().find(([, e]) => e >= n0), dep18 = D.traffic ? D.traffic.share18 : null;
  if (!W) { // open throughout: the highest closure chance of a daytime hour, then what it carries at the busiest
    const day = H.slice(n0).filter(x => !night(x.t)), worst = day.length ? Math.max(...day.map(x => 1 - x.p18)) : 0;
    const most = dep18 && day.length ? Math.max(...day.map(x => Math.round(D.traffic.perHour[fraHour(x.t)] / 2 * dep18))) : 0;
    return { state: 'none', big: T.r18_open.replace('{n}', H.length - n0), lines: [T.r18_open_max.replace('{p}', pct(worst)), ...(most > 0 ? [T.r18_carries.replace('{n}', most)] : [])] }; }
  const [a, b] = W, win = H.slice(Math.max(a, n0), b + 1), s = H[a].t, e = plus1h(H[b].t), dk = t => fmt({ year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(t));
  const moved = dep18 ? Math.max(...win.map(x => Math.round(D.traffic.perHour[fraHour(x.t)] / 2 * dep18))) : 0;
  const end = dk(e) === dk(s) ? hm(e) : `${dayf(e).split(' ')[0]} ${hm(e)}`; // an end on another day carries its weekday
  const mv = moved > 0 ? T.r18_moves.replace('{n}', moved) : T.r18_moves0;
  if (a <= n0) return { state: 'now', big: T.r18_until.replace('{b}', dk(e) === dk(Date.now()) ? hm(e) : `${dayf(e).split(' ')[0]} ${hm(e)}`), lines: [mv] };
  // the quiet line: the relative day, then the at-risk hours drawn next to the closure in the lane (open below 90 %, outside
  // the night ban) as the "at risk" range, then the routine state
  const nd = Math.round((Date.parse(dk(s).split('/').reverse().join('-')) - Date.parse(dk(Date.now()).split('/').reverse().join('-'))) / 864e5);
  const risk = x => x.p18 >= 0.5 && x.p18 < 0.9 && !night(x.t); let a2 = a, b2 = b; while (a2 - 1 > n0 && risk(H[a2 - 1])) a2--; while (b2 + 1 < H.length && risk(H[b2 + 1])) b2++;
  const e2 = plus1h(H[b2].t), may = a2 < a || b2 > b ? T.r18_may.replace('{a}', hm(H[a2].t)).replace('{b}', dk(e2) === dk(H[a2].t) ? hm(e2) : `${dayf(e2).split(' ')[0]} ${hm(e2)}`) : '';
  const rel = [T.r18_rel[Math.min(nd, 2)].replace('{n}', nd), may, T.r18_date].filter(Boolean).join(' · ');
  return { state: 'sched', big: T.r18_closes.replace('{date}', dayf(s)).replace('{a}', hm(s)).replace('{b}', end), lines: [rel, mv] };
}
function renderR18() { // the hero's Runway 18 block: a closure in the window is the big line (a hollow ring while scheduled, a filled
  // dot while in effect, both the closed cells' red); the routine state is the quiet part
  const el = $('r18h'); if (!el) return;
  const r = r18Now(), mk = r.state === 'none' ? '' : `<i class="r18d${r.state === 'sched' ? ' ring' : ''}" aria-hidden="true"></i>`;
  el.dataset.state = r.state;
  el.innerHTML = `<div class="r18l">Runway 18</div><div class="r18s"><b>${mk}${r.big}</b></div>${(r.lines || []).length ? `<p class="r18n">${r.lines.map((t, k) => `<span class="${k === r.lines.length - 1 && (r.state !== 'none' || k) ? 'r18i' : 'r18w'}">${t}</span>`).join('')}</p>` : ''}`;
  el.title = 'Take-offs to the south only. It closes when the wind across it is too strong; its departures then use the Centre runway.';
  alignR18();
}
function alignR18() { // desktop: each Runway 18 line on the baseline of its partner in the left column: the label on the
  // headline's, the closure on the switch line's, the quiet line on its second line's, what it moves on the trust line's
  const el = $('r18h'); if (!el) return; const ls = [...el.querySelectorAll('.r18l, .r18s, .r18w, .r18i')]; ls.forEach(e => { e.style.marginTop = ''; });
  if (NARROW.matches) return;
  const base = e => { const s = document.createElement('span'); s.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'; e.appendChild(s); const y = s.getBoundingClientRect().top; s.remove(); return y; };
  for (const [a, b] of [['.r18l', '#answer > span:not(.dbadge)'], ['.r18s b', '#subhead .sh1'], ['.r18w', '#subhead .sh2'], ['.r18i', '#trust']]) {
    const x = el.querySelector(a), y = document.querySelector(b), box = x && (x.closest('.r18s') || x); if (!x || !y || !x.offsetWidth || !y.offsetWidth) continue;
    const d = (base(y) - base(x)) / zoom(); box.style.marginTop = `${Math.max(0, parseFloat(getComputedStyle(box).marginTop) + d).toFixed(2)}px`; }
}
function impact(t) {
  if (night(t)) return 'Night ban from 23:00 to 05:00, no scheduled traffic';
  if (!D.traffic) return '';
  const n = D.traffic.perHour[fraHour(t)];
  return `${n >= 60 ? '<b>Busy hour</b>' : n >= 35 ? 'Moderate traffic' : 'Quiet hour'}, about ${n} movements an hour`;
}
function pgDiff() { // the hours where the published INAA prognosis disagrees with us, and our chance for them
  if (!H.some(h => h.pg !== undefined)) return null;
  const dis = []; // the windows computed once in Python (official_windows): every hour inside them
  H.forEach((h, i) => { const t = Date.parse(h.t); if ((D.pgwin || []).some(w => t >= Date.parse(w.start) && t < Date.parse(w.end))) dis.push(i); });
  if (!dis.length) return { agree: true };
  const x = dis.map(i => ({ h: H[i], s: prog(H[i]) })), m = Math.min(...x.map(y => pOf(y.h, y.h.od)));
  return { idx: dis, what: x.some(y => y.s === 0) ? 'possible switch' : `switch to ${two(x[0].s)}`,
    span: `${dhm(H[dis[0]].t)} to ${hm(plus1h(H[dis[dis.length - 1]].t))}`, ours: pct(1 - m) };
}
function progNote() { // where the published Umwelthaus prognosis differs from us
  if (!H.some(h => h.pg !== undefined)) return '';
  const ci = D.change ? idxOf(D.change.t) : -9, mixed = [], dis = [];
  H.forEach((h, i) => {
    const s = prog(h);
    if (s === 0) mixed.push(i);
    // a definite prognosis against ours, or "mixed" where we are sure and see no change nearby
    if ((s && s !== h.od) || (s === 0 && pOf(h, h.od) >= 0.9 && Math.abs(i - ci) > 3)) dis.push(i);
  });
  const span_ = ix => `${dhm(H[ix[0]].t)} to ${hm(plus1h(H[ix[ix.length - 1]].t))}`;
  if (!dis.length) return mixed.length ? `The published prognosis <b>agrees</b>. It marks ${span_(mixed)} as a possible switch, like our uncertain hours.` : 'The published prognosis <b>agrees</b> for all 48\u202fh.';
  const x = dis.map(i => ({ h: H[i], s: prog(H[i]) })), what = x.some(y => y.s === 0) ? 'a possible switch' : `a switch to ${two(x[0].s)}`;
  const m = Math.min(...x.map(y => pOf(y.h, y.h.od)));
  return `The published prognosis expects <b>${what}</b> ${span_(dis)}. We give a switch then a ${pct(1 - m)} chance.`;
}
function renderChange() {
  const to = D.od_now === 25 ? 7 : 25, p = D.p_change ?? 0;
  const meter = pct(p);
  const notes = [D.change ? impact(D.change.t) : '', progNote()].filter(Boolean).map(n => `<div>${n}</div>`).join('');
  if (D.change) {
    const i = idxOf(D.change.t);
    $('chgval').innerHTML = `<div class="big"><button id="gochg" title="Show on the timeline">${dhm(D.change.t)}</button><small>in ${hoursFrom(D.change.t)}\u202fh</small></div>`
      + `<div class="flow">${rw(D.od_now)} ${word(D.od_now)} to ${rw(to)} ${word(to)}</div>`;
    $('chgfoot').innerHTML = `<dl class="facts"><div><dt>Chance</dt><dd>${meter}</dd></div>`
      + (p < 0.75 ? `<div><dt>Likely window</dt><dd>${hm(D.change.start)} to ${hm(plus1h(D.change.end))}</dd></div>` : '') + `</dl><div class="notes">${notes}</div>`;
    $('gochg').onclick = () => { setPlaying(0); go(i); };
    const wd = t => `${dayf(t).split(' ')[0]} ${hm(t)}`;
    $('answer').innerHTML = `${badge(D.od_now)}<span><span class="ff">Frankfurt </span>flies ${word(D.od_now)}</span>${arrow(D.od_now)}`;
    // the switch with its timing and certainty, from numbers already on the page: the hours to go, and the highest hourly
    // chance of the new direction (the chart's "Highest" note) and when it is reached
    const oth = x => pOf(x, to), n0 = nowIdx(), pk = H.reduce((m, x, k) => (k >= n0 && !night(x.t) && (m < 0 || oth(x) > oth(H[m])) ? k : m), -1), inH = Math.round((Date.parse(D.change.t) - Date.now()) / 36e5);
    const pkT = pk < 0 ? null : H[pk].t;
    const cert = [inH > 0 ? `in \u2248${inH}\u202fh` : '', pkT ? T.peak_hi.replace('{to}', word(to)).replace('{p}', pct(oth(H[pk]))).replace('{t}', dhm(pkT).replace(/ \d+ \w+,/, '')) : ''].filter(Boolean).map(x => `<span class="nw">${x}</span>`).join(' · '); // the charts' peak (number and Day HH:MM) tied to the switch: "81 % chance of West by Sat 17:00"
    $('subhead').innerHTML = `<span class="sh1">${T.out_expected.replace('{to}', word(to)).replace('{t}', `<span class="nw">${dhm(D.change.t)}</span>`)}${H.length - 1 - idxOf(D.change.t) <= 1 ? T.out_edge : ''}</span>${cert ? `<span class="sh2">${cert}</span>` : ''}`; // one format for the switch instant in prose: "Sat 7 Nov, 14:00"
    $('disagree').hidden = true;
  } else {
    const pg = pgDiff(), end = dhm(plus1h(H[H.length - 1].t));
    const stay = D.p_change === null || D.p_change === undefined ? null : 1 - D.p_change;
    const oth = h => Math.min(h.p25, 1 - h.p25), from = nowIdx(), hw = H.slice(from).reduce((a, h) => (oth(h) > oth(a) ? h : a), H[from]);
    const days = [...new Set(H.slice(from).filter(h => !night(h.t) && oth(h) < 0.02).map(h => dayf(h.t).split(' ')[0]))];
    // the headline is the direction; a small risk is the subline (a risk headline only from 20%)
    const big = oth(hw) >= 0.2, pgT = pg && !pg.agree ? pg.span.replace(/^(\w+) \d+ \w+,/, '$1') : null;
    const endT = plus1h(H[H.length - 1].t), wd = t => `${dayf(t).split(' ')[0]}\u00a0${hm(t)}`;
    $('answer').innerHTML = `${badge(D.od_now)}<span><span class="ff">Frankfurt </span>flies ${word(D.od_now)}</span>${arrow(D.od_now)}`;
    const atEnd = H.length - 1 - H.indexOf(hw) <= 2, whenPk = (atEnd ? T.out_when_end : T.out_when_mid).replace('{t}', wd(hw.t)); // the possible-switch tier names its number, not a sustained switch // a peak in the horizon's last 3 h may only be the start of a rise
    $('subhead').innerHTML = big ? T.out_possible.replace('{p}', pct(oth(hw))).replace('{to}', word(D.od_now === 25 ? 7 : 25)).replace('{when}', whenPk) : T.out_none; // siteui.COPY, shared with the 3D panel // the model's own 48 h number (p_change_48h)
    $('subhead').title = D.p_change === null || D.p_change === undefined ? '' : `Calibrated chance of any switch in 48 h: ${pct(D.p_change)}\nThe hourly bars are uncalibrated model probabilities.`;
    // the official forecast against ours, framed on purpose: they disagree about the same evening
    const pgA = pg && !pg.agree ? H[pg.idx[0]].t : null, pgB = pg && !pg.agree ? plus1h(H[pg.idx[pg.idx.length - 1]].t) : null;
    const wday = t => dayf(t).split(' ')[0];
    const part = t => { const v = hourOf(t); return v >= 23 || v < 5 ? 'night' : v < 12 ? 'morning' : v < 17 ? 'afternoon' : 'evening'; };
    const pgShort = pgA ? `${wday(pgA)} ${hm(pgA)}–${hm(pgB)}` : null; // what it flags is in the comparison above
    $('chgval').innerHTML = big ? `<div class="sub">Possible switch to ${two(D.od_now === 25 ? 7 : 25)} ${whenPk}, ${pct(oth(hw))} chance at that hour.</div>` : '';
    // one hero line, only when the two forecasts disagree (the one statement of it on the page)
    $('disagree').hidden = !(pgA && !big);
    const part2 = t => { const v = hourOf(t); return v >= 23 || v < 5 ? 'night' : v < 11 ? 'morning' : v < 14 ? 'midday' : v < 17 ? 'afternoon' : 'evening'; };
    const when = (a, b) => { const e = new Date(Date.parse(b) - 36e5), sameNight = wday(e) === wday(a) || (Date.parse(b) - Date.parse(a) <= 18 * 36e5 && hourOf(e) < 5); return sameNight ? `${wday(a)}\u00a0${part2(a)}` : `from ${wday(a)}\u00a0${part2(a)} to ${wday(b)}\u00a0${part2(b)}`; }; // the window as words (siteui.COPY.disagree)
    $('disagree').innerHTML = pgA && !big ? T.disagree.replace('{of}', `<b class="ofn" tabindex="0" title="INAA (Umwelthaus), the official forecast">${T.of_name}</b>`).replace('{when}', when(pgA, pgB)) : '';
    // the outlook as a compact table; the peak is said here once (the chart marks it), the end of the forecast is on the chart
    $('chgfoot').innerHTML = `<dl class="strip ostrip"><div><dt>${T.nextsw}</dt><dd>${big ? wd(hw.t) : 'none in 48\u202fh'}</dd></div>`
      + `<div><dt>${T.peak}</dt><dd>${pct(oth(hw))} · ${wd(hw.t)}</dd></div>`
      + `<div${pg ? ` title="${esc(progNote().replace(/<[^>]+>/g, ''))}"` : ''}><dt>${T.inaa}</dt><dd>${pgShort ? `<i class="pgbsw"></i>${pgShort}` : (pg ? 'agrees, no switch' : 'n/a')}</dd></div></dl>`;
  }
}
const arr = od => `<svg class="tarr" viewBox="0 0 34 24" aria-hidden="true"><path d="${ST.arrow[od === 25 ? 'w' : 'e']}"/></svg>`; // the headline's arrow, at text size
const badge = od => `<span class="rw dbadge" style="--dc:${col(od)}">${two(od)}</span>`;
const arrow = od => `<svg class="arr" viewBox="0 0 34 24" aria-hidden="true"><path d="${od === 25 ? 'M31 12H4M12 4l-8 8 8 8' : 'M3 12h27M22 4l8 8-8 8'}"/></svg>`;
const INAA = 'the <abbr title="INAA: the official operating-direction forecast published by the Umwelthaus (Forum Flughafen und Region)">official forecast (INAA)</abbr>';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
addEventListener('keydown', e => { const d = $('recdlg'); if (e.key === 'Escape' && d && d.open) { e.preventDefault(); e.stopImmediatePropagation(); d.close(); } }, true); // Esc closes the detail view first (the timeline's Esc is "back to now")
function openRec() { // the accuracy detail view: drawn when it opens (a closed dialog has no size to lay out in)
  const d = $('recdlg'); if (!d) return; if (!d.open) d.showModal(); renderRecord(); $('rec').querySelector('.recx')?.focus({ preventScroll: true });
}
function renderProof(R, hasP, per) { // one quiet line under the outlook: hours right over all lead times and a link to the detail view (which compares with the official forecast)
  const el = $('trust'); if (!el) return;
  if (!R.length) { el.innerHTML = ''; if ($('trustph')) $('trustph').innerHTML = ''; return; }
  const p = v => Math.round(v * 100), rng = a => { const lo = Math.min(...a), hi = Math.max(...a); return lo === hi ? `${lo}` : `${lo}–${hi}`; };
  const L = R.map(r => r.lead);
  el.innerHTML = `<span class="nw">Hours correct ${rng(R.map(r => p(r.acc)))}\u202f%,</span> <span class="nw">${Math.min(...L)}–${Math.max(...L)}\u202fh ahead</span>` // the official comparison is in the detail view
    + ` · <a class="beat" href="#rec" aria-haspopup="dialog"><span class="u">how we measure</span>${arr(7)}</a>`;
  if ($('trustph')) $('trustph').innerHTML = el.innerHTML; // phones: the same line as a footnote under the cards (the first screen keeps the chart)
}
function renderRecord() { // walk-forward backtest of the official forecast: hours right per lead time, next to the official forecast (INAA)
  const Q = D.quality || {}, R = (Q.od25 || []).filter(r => r.acc !== null && r.acc !== undefined), el = $('rec');
  if (!R.length) { el.innerHTML = '<div class="lbl">How reliable is this?</div><div class="quiet">No backtest available.</div>'; renderProof(R, false, ''); return; }
  const p = v => Math.round(v * 100), r24 = R.find(r => r.lead === 24) || R[R.length - 1], hasP = R.every(r => r.prog !== null && r.prog !== undefined);
  const beats = hasP && R.every(r => r.acc > r.prog), ti = Q.test_info, S = Q.switch;
  const a = ti && new Date(ti.start), b = ti && new Date(a.getTime() + ti.days * 864e5);
  const per = ti ? `${MON[a.getUTCMonth()]}–\u2060${MON[b.getUTCMonth()]}\u00a0${b.getUTCFullYear()}` : ''; // kept on one line
  const NB = ' ', er = v => (1 - v) * 100, fewer = r => Math.round((1 - er(r.acc) / er(r.prog)) * 100), sw = S && S.model && S.prog;
  const mon = per.replace(/ \d{4}$/, '');
  const beatsR = hasP && R.every(r => r.acc > r.prog);
  el.innerHTML = `<div class="acchd"><div class="lbl">How reliable is this?<small>hours correct by lead time</small></div>${hasP ? '<span class="acck"><span class="k"><i class="km"></i>ours</span><span class="k"><i class="ko"></i>official</span></span>' : ''}<button class="recx" aria-label="Close" title="Close (Esc)"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg></button></div>`
    + (hasP && beatsR ? '' : '')
    + `<div class="db" id="db"></div>`
    + (sw ? `<dl class="accst" title="Backtest over ${ti ? Math.round(ti.days / 30.4) : ''} months (${mon})"><div><dd>${S.model.fa}</dd><dt><span class="nw">false switch alarms</span> <span class="nw">in ${ti ? Math.round(ti.days / 30.4) : ''}${NB}months</span></dt><dt class="ofl">official: <b class="of">${S.prog.fa}</b> alarms</dt></div>`
      + `<div><dd>${p(S.model.hit)}${NB}%</dd><dt title="A real switch counts as caught when the forecast puts it within 3 hours of when it actually happened (fra/scoring.py)"><span class="nw">of switches predicted</span> <span class="nw">within ±3${NB}h</span></dt><dt class="ofl">official: <b class="of">${p(S.prog.hit)}${NB}%</b></dt></div></dl>` : ''); // per cell: the number, one caption, the official line
  { // columns: lead | dot plot (capped) | fewer errors | the 24 h tag, right-aligned; every row the same height, faint rules between
    const box = $('db'), W0 = box.clientWidth || 400, narrow = W0 < 380;
    const ctx = renderRecord.cx || (renderRecord.cx = document.createElement('canvas').getContext('2d'));
    ctx.font = '600 13px "IBM Plex Sans", system-ui, sans-serif'; const lw = Math.max(ctx.measureText('Ahead').width, ...R.map(r => ctx.measureText(`${r.lead}${NB}h`).width));
    const w24 = ctx.measureText(`${r24.lead}${NB}h`).width; ctx.font = '400 12px "IBM Plex Sans", system-ui, sans-serif'; const PLAN = narrow ? '' : ' · planning horizon', tagW = 0; // the 24 h row says why it matters, in its own cell
    const lwP = Math.max(lw, w24 + ctx.measureText(PLAN).width);
    ctx.font = '400 13px "IBM Plex Sans", system-ui, sans-serif'; const fwm = Math.ceil(Math.max(...R.map(r => ctx.measureText(`${Math.round((1 - (1 - r.acc) / (1 - r.prog)) * 100)}${NB}%`).width), ctx.measureText('Fewer errors').width + 16)) + 4;
    const L = Math.ceil(lwP) + 16, OV = 28, /* the 100 % line stays clear of the Fewer errors column */ FW = narrow ? Math.max(60, fwm) : 72, /* desktop: the column as wide as its numbers; the header reaches left over the plot's header row */ TG = tagW ? 12 + tagW : 0; // 40 px for the official values left of their dots, 36 for ours on the right
    const AX = Math.max(80, Math.min(9999, W0 - L - OV - (FW ? 8 + FW : 0) - TG)), FX = L + AX + OV + (FW ? 8 + FW : 0), W = Math.min(W0, FX + TG), TK = 4, BOT = TK + 14, AV = box.clientHeight || 0, top = narrow ? 22 : (AV - 26 - BOT) / R.length >= 21 ? 26 : (AV - 22 - BOT) / R.length >= 19 ? 22 : 20; // a little more air under the header when the card has room
    const lo = 86, hi = 100, X = v => L + (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo) * AX;
    // under the plot: 4 px tick marks through the baseline, the values directly under them (baseline 16 px below the axis)
    // desktop: the rows share whatever height the card leaves (rounded per row, so the rules stay on the pixel grid)
    const RH = narrow ? 26 : Math.max(19, Math.min(30, (AV - top - BOT) / R.length)), Y0 = R.map((_, k) => top + Math.round(k * RH)), yB = top + Math.round(R.length * RH), H = yB + BOT;
    let g = '';
    R.forEach((r, k) => { if (k) g += `<line x1="0" x2="${W}" y1="${Y0[k] + 0.5}" y2="${Y0[k] + 0.5}" class="dbrule"/>`; });
    ctx.font = '400 12px "IBM Plex Sans", system-ui, sans-serif'; const pcW = ctx.measureText('% of hours correct').width; ctx.font = '500 12px "IBM Plex Sans", system-ui, sans-serif';
    const HD = 'Fewer errors'; void pcW; // one short header at every width, with its (i)
    g += `<text x="0" y="${top - 8}" class="dbt">Ahead</text><text x="${L + AX / 2}" y="${top - 8}" text-anchor="middle" class="dbt">% of hours correct</text>`; // centred over the plot
    for (const v of [88, 92, 96, 100]) /* one 86-100 domain at every width, across the whole middle column; a faint line at every labelled tick, on the pixel grid */ g += `<line x1="${Math.round(X(v)) + 0.5}" x2="${Math.round(X(v)) + 0.5}" y1="${top}" y2="${yB}" class="dbg"/><line x1="${Math.round(X(v)) + 0.5}" x2="${Math.round(X(v)) + 0.5}" y1="${yB}" y2="${yB + TK}" class="dbtm"/><text x="${X(v)}" y="${yB + TK + 12}" text-anchor="middle" class="dbt tk">${v}${NB}%</text>`;
    g += `<line x1="${L}" x2="${L + AX}" y1="${yB + 0.5}" y2="${yB + 0.5}" class="dbax"/>`; // the axis spans exactly the rows' x-range
    if (FW) g += `<text x="${FX - 22}" y="${top - 8}" text-anchor="end" class="dbt hd">${HD}</text>`; // 6 px before the (i), which ends on the column's right edge
    ctx.font = '600 13px "IBM Plex Sans", system-ui, sans-serif'; const ko = (x0, y, t, end) => { const w = ctx.measureText(t).width + 4; return `<rect class="dbko" x="${(end ? x0 - w + 2 : x0 - 2).toFixed(1)}" y="${y - 10}" width="${w.toFixed(1)}" height="18"/>`; }; // the text's full line box (ascent and descent) // a card-colour knockout: no gridline runs through a value
    R.forEach((r, k) => {
      const y = Math.round((Y0[k] + (k + 1 < R.length ? Y0[k + 1] : yB)) / 2), a = p(r.acc), o = hasP ? p(r.prog) : null;
      g += `<text x="0" y="${y + 4}" class="dbl">${r.lead}${NB}h${r === r24 ? `<tspan class="dbplan">${PLAN}</tspan>` : ''}</text>`;
      if (o !== null) g += `<line x1="${X(o)}" x2="${X(a)}" y1="${y}" y2="${y}" class="dbs"/><circle cx="${X(o)}" cy="${y}" r="5" class="dbo"/>${ko(X(o) - 11, y, `${o}${NB}%`, true)}<text x="${X(o) - 11}" y="${y + 4}" text-anchor="end" class="dbv o">${o}${NB}%</text>`;
      g += `<circle cx="${X(a)}" cy="${y}" r="5.5" class="dbm"/>${ko(X(a) + 11.5, y, `${a}${NB}%`, false)}<text x="${X(a) + 11.5}" y="${y + 4}" class="dbv">${a}${NB}%</text>`;
      if (o !== null && FW) g += `<text x="${FX}" y="${y + 4}" text-anchor="end" class="dbf"><title>${fewer(r)}${NB}% fewer wrong hours than the official forecast, ${r.lead}${NB}h ahead</title><tspan class="dbfn">${fewer(r)}${NB}%</tspan></text>`;
    });
    box.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Hours correct per lead time, ours against the official forecast">${g}</svg>`
      + (FW ? `<button class="dbib" id="dbib" style="left:${FX - 24}px;top:${top - 27}px" aria-label="What fewer errors than official means" aria-expanded="false" aria-controls="dbpop"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.75"/><path d="M8 7.2v4.3"/><circle class="dot" cx="8" cy="4.9" r="1"/></svg></button>`
      + `<div class="dbpop" id="dbpop" role="tooltip" hidden style="top:${top + 2}px">Share of the official forecast\u2019s wrong hours we avoid. ${fewer(r24)}\u202f% fewer = ${fewer(r24)} of every 100 errors gone (${r24.lead}\u202fh ahead).</div>` : '');
    const ib = $('dbib'), pop = $('dbpop'); // a real popover: hover, focus and tap
    if (ib) { const show = on => { pop.hidden = !on; ib.setAttribute('aria-expanded', on); };
      ib.onmouseenter = () => show(true); ib.onmouseleave = () => { if (document.activeElement !== ib) show(false); };
      ib.onfocus = () => show(true); ib.onblur = () => show(false); ib.onclick = e => { e.stopPropagation(); show(pop.hidden); }; }
  }
  renderProof(R, hasP, per);
  el.title = `Backtest${per ? `, ${per}` : ''}: each week is forecast by a model trained only on earlier data.\n`
    + R.map(r => `${r.lead}\u202fh ahead: ${p(r.acc)}\u202f% right (official forecast ${p(r.prog)}\u202f%, no change ${p(r.pers)}\u202f%)`).join('\n');
}

// ---- live operation: alerts (fra.alerts) and the record of the forecasts issued live each hour (fra.scoring)
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pc1 = p => (p === null || p === undefined ? 'n/a' : `${(p * 100).toFixed(1)}\u202f%`);
function renderAlerts() {
  if (!$('alerts')) return; // panel removed from the page
  const A = D.alerts || [], iss = D.alerts_issue || D.issue, age = (Date.now() - Date.parse(iss)) / 36e5;
  if (D.alerts_stale || age > 2) { // fra.alerts.STALE_H: no alerts from a forecast that is no longer current
    $('alerts').classList.remove('on');
    $('alerts').innerHTML = `<div class="al stale"><i></i><b>Alerts paused</b><span>${esc(D.alerts_stale && D.alerts_msg ? D.alerts_msg
      : `No current forecast. The newest one was issued ${dhm(iss)}, ${Math.round(age)}\u202fh ago. Alerts resume with the next forecast.`)}</span></div>`;
    return;
  }
  $('alerts').classList.toggle('on', A.length > 0);
  $('alerts').innerHTML = A.length ? A.map(a => {
    const [title, when] = a.kind === 'od_switch'
      ? [`Direction change from ${rw(a.od_from)} to ${rw(a.od_to)} ${a.lead_h ? `in ${a.lead_h}\u202fh` : 'this hour'}`,
        `around ${dhm(a.t)}${a.start && a.end ? `, likely between ${hm(a.start)} and ${hm(plus1h(a.end))}` : ''}, ${pct(a.p)} likely at that hour`]
      : ['Runway 18 West closure risk', `${dhm(a.start)} to ${hm(plus1h(a.end))}, at worst ${pct(a.p_min)} usable`];
    return `<div class="al ${a.level}" title="${esc(a.text)}"><i></i><b>${title}</b><span>${when}</span></div>`;
  }).join('') : '<div class="al ok"><i></i><b>No alerts</b><span>No direction change expected within 12\u202fh, and Runway 18 stays usable over the next 24\u202fh</span></div>';
}
function renderLiveRecord() {
  if (!$('lrec')) return; // panel removed from the page
  const L = D.live || {}, w = (L.windows || {})['30d'], od = (w && w.od) || {};
  const leads = ['1', '6', '24', '48'].filter(k => od[k] && od[k].n);
  const since = L.start ? `${dayf(L.start)}, ${hm(L.start)}` : null;
  // the live record is the independent test: forecasts issued before the outcome exists; issue times from
  // holdout_from (1 Nov 2026 00 UTC) form the locked holdout that decides between the model variants
  const ho = (L.windows || {}).holdout, hoN = (ho && ho.n_scored_issues) || 0;
  const tipL = esc('We archive every hourly forecast before the outcome is known, then score it against the direction actually flown, which radar shows about 3\u202fh later.'
    + (L.holdout_from ? ` Forecasts issued from ${dayf(L.holdout_from)} ${hm(L.holdout_from)} ${tz === 'UTC' ? 'UTC' : 'local time'} on form the locked holdout, the independent test of the model.` : ''));
  if (!leads.length) {
    $('lrec').innerHTML = `<div class="lh" title="${tipL}">Live record</div>`
      + `<div class="lq" title="${tipL}">${since ? `Collecting since ${since}` : 'Collecting from the first live forecast'}. The first scores arrive about 3\u202fh after each forecast hour.</div>`;
    return;
  }
  const old = Date.now() - Date.parse(L.start) > (L.rolling_days || 30) * 864e5;
  const miss = (w.coverage || {}).missing || 0;
  const tipN = esc(`${w.n_scored_issues} forecasts scored ${old ? `over the last ${L.rolling_days || 30} days` : `since ${dayf(L.start)}`}${hoN ? `, ${hoN} of them in the holdout` : ''}. ${miss ? `${miss} hours had no forecast. ` : ''}`) + tipL;
  $('lrec').innerHTML = `<div class="lh" title="${tipN}">Live record</div>`
    + `<table><thead><tr><th>Ahead</th><th>Right</th><th title="The official rules, scored the same way">Rules</th></tr></thead><tbody>`
    + leads.map(k => `<tr title="${k}\u202fh ahead, ${od[k].n} hours scored. For comparison, the official rules scored ${pc1(od[k].rule)}, the published prognosis ${pc1(od[k].prog)} and no change ${pc1(od[k].pers)}."><td>${k}\u202fh</td><td class="v">${pc1(od[k].acc)}</td><td>${pc1(od[k].rule)}</td></tr>`).join('')
    + '</tbody></table>';
}
async function pollOps() { // alerts.json (fra.alerts) and live_record.json (fra.scoring) are refreshed every hour
  const get = async f => { try { const r = await fetch(f, { cache: 'no-store' }); return r.ok ? await r.json() : null; } catch { return null; } };
  const [a, l] = await Promise.all([get('alerts.json'), get('live_record.json')]);
  if (a && Date.parse(a.issue) >= Date.parse(D.issue)) {
    D.alerts = a.alerts; D.alerts_stale = !!a.stale; D.alerts_msg = a.message; D.alerts_issue = a.issue; renderAlerts();
  }
  if (l && l.start) { D.live = l; renderLiveRecord(); }
}

// ---- timeline
const lanes = $('lanes');
const geom = () => { const W = $('lod').clientWidth, g = span >= 48 ? 2 : 3, cw = (W - (span - 1) * g) / span; return { W, g, cw }; };
const xOf = i => { const { g, cw } = geom(); return (i - off) * (cw + g) + cw / 2; };
function idxAt(e) { // from the on-screen rect, so it stays right when fit() zooms the page
  const r = $('lod').getBoundingClientRect();
  return Math.max(0, Math.min(H.length - 1, off + Math.floor(((e.clientX - r.left) / r.width) * span)));
}
const peakNote = (p, t) => `Highest: ${pct(p)} at ${dhm(t).replace(/ \d+ \w+,/, '')}`; // outside the night ban (the tooltip says so) // one formatter for the panel and the charts
const otherName = () => (D.od_now === 25 ? 'East' : 'West'); // the bars: p(the other direction than the one flown now), whatever the forecast does later // what the bars measure: p(the other direction) that hour
function swScale(peak) { // the shared switch-chance scale (fra.siteui.SWITCH, the same in the 3D view)
  const S = ST.switch;
  const top = Math.min(1, Math.max(S.nice_min, Math.ceil(peak / S.nice_step - 1e-9) * S.nice_step)); // a nice top: the peak rounded up to 10 %, 20 % to 100 % (siteui.SWITCH, the same in 3D)
  return { top, h: peak >= S.real ? S.real_h : S.calm_h, grid: top / 2 }; // the 10 % gridline gives the headroom
}
function fitTag(tg, xa, lim) { // shared with 3D: the tag never runs into the switch chip; the text steps down "Official: Fri 19h → Sat 13h", "Official → Sat 13h", "Official"
  const tl0 = tg.offsetLeft, tr0 = tl0 + tg.offsetWidth; if (tr0 <= lim) return;
  for (const t of [tg.dataset.l, tg.dataset.m, 'Official']) { if (!t) continue; tg.textContent = t; if (xa + tg.offsetWidth <= lim) { tg.style.right = 'auto'; tg.style.left = `${xa}px`; tg.classList.remove('ra'); return; } }
  tg.textContent = 'Official'; tg.style.left = `${Math.max(0, lim - tg.offsetWidth)}px`; tg.style.right = 'auto'; tg.classList.remove('ra'); }
function pgTag(xa, Wl, ta, tb) { // the official window: as much of "Official: switch Fri 19:00–Sat 10:00" as fits, the full text in the title
  const d = t => dayf(t).split(' ')[0], hh = t => String(hourOf(t)).padStart(2, '0'), full = `Official: switch ${d(ta)} ${hh(ta)}:00–${d(tb)} ${hh(tb)}:00`;
  const ctx = pgTag.cx || (pgTag.cx = document.createElement('canvas').getContext('2d')); ctx.font = '500 12px "IBM Plex Sans", system-ui, sans-serif';
  const ph = matchMedia('(max-width:479px)').matches, room = Wl - xa, mid = ST.pgtag.long.replace('{da}', d(ta)).replace('{ha}', hh(ta)).replace('{db}', d(tb)).replace('{hb}', hh(tb)), wd = q => ctx.measureText(q).width + 12;
  const fit = [mid].find(q => wd(q) <= room), txt = fit || (ph ? mid : 'Official'), /* one wording on both pages (siteui.STYLE.pgtag) */ w = wd(txt), ra = !fit; // left-aligned at the window start when it fits up to the plot edge; else right-aligned at the plot edge with a tick at the window start
  const m2 = (ST.pgtag.mid || 'Official').replace('{db}', d(tb)).replace('{hb}', hh(tb));
  return `<span data-l="${mid}" data-m="${m2}" data-x="${xa}" class="pgtag${ra ? ' ra' : ''}" style="${ra ? `right:0;--tk:${Math.max(0, Math.round(w - (Wl - xa)))}px` : `left:${xa}px`}" title="Official forecast (INAA): possible switch ${d(ta)} ${hh(ta)}:00 to ${d(tb)} ${hh(tb)}:00">${txt}</span>`;
}
function pgRunsOf() { // shown-hour index ranges where the official INAA forecast flags a possible switch
  const I = [...((pgDiff() || {}).idx || [])].filter(i => i >= off && i < off + span).map(i => i - off).sort((a, b) => a - b);
  return I.reduce((r, i) => { const l = r[r.length - 1]; if (l && l[1] === i - 1) l[1] = i; else r.push([i, i]); return r; }, []);
}
{ let rq = 0; const ro = new ResizeObserver(() => { cancelAnimationFrame(rq); rq = requestAnimationFrame(() => { for (const id of ['lpg', 'lwd']) { const e = document.getElementById(id), sv = e && e.querySelector(':scope > svg, svg'); if (e && sv && Math.abs((+sv.getAttribute('height') || 0) - e.clientHeight) > 1) { renderTimeline(); return; } } }); });
  addEventListener('DOMContentLoaded', () => ['lpg', 'lwd'].forEach(id => document.getElementById(id) && ro.observe(document.getElementById(id)))); } // a row that grows after layout is redrawn at its real height
function renderTimeline() {
  $('dirkey').innerHTML = '';
  $('tlh').textContent = `Next ${span} hours`;
  off = Math.max(0, Math.min(off, H.length - span));
  const hs = H.slice(off, off + span), { g, cw } = geom(), x = i => i * (cw + g);
  const NX = innerWidth < 480 && nowIdx() >= off && nowIdx() < off + span ? Math.min(160, Math.max(0, x(nowIdx() - off) - g / 2)) : 0; $('tl').style.setProperty('--nowx', `${NX}px`); // phones: row names and value labels start right of the Now line, wherever it is (an older run puts it inside the plot)
  const every = span === 48 ? 6 : span === 24 ? 3 : 2;
  lanes.style.setProperty('--g', `${g}px`);
  let ru = '';
  // two lines: the date on top at midnight (it replaces 00:00), 06 / 12 / 18 below at every width, the horizon's end top right
  const step = every * (cw + g), hf = hr => (innerWidth >= ST.axis.short_below && step >= ST.axis.long_px ? `${String(hr).padStart(2, '0')}:00` : String(hr).padStart(2, '0')); // the shared axis rule: 18:00, or 18 where it is tight
  const W0 = $('lod').clientWidth;
  // the date row (dates, and "Now" as a tag on the now line) above the time row (every 6 h, never in the last 3 h: the same end at every width)
  const ctx = renderTimeline.cx || (renderTimeline.cx = document.createElement('canvas').getContext('2d')), ni = nowIdx();
  ctx.font = '600 12px "IBM Plex Sans", system-ui, sans-serif';
  let nowX = -1e9;
  if (ni >= off && ni < off + span) { const nx = x(ni - off) - g / 2; ru += `<span class="nowtag" style="left:${nx}px" title="Current hour; forecast issued ${hm(D.issue)}">Now</span>`; nowX = nx; } // on the hour row, at the now line
  ctx.font = '600 12px "IBM Plex Sans", system-ui, sans-serif'; const nowW = ctx.measureText('Now').width + 10; ctx.font = '400 12px "IBM Plex Sans", system-ui, sans-serif';
  hs.forEach((h, i) => {
    const hr = hourOf(h.t), c = x(i) - g / 2; // the hour starts at its cell's left edge, like the night bands
    const lw = ctx.measureText(hf(hr)).width / 2, nearNow = false; void lw; void nowW; void nowX; // the Now collision is measured on the real boxes after layout (below)
    if (hr === 0) ru += `<i class="t dd" style="left:${c}px"></i>${c + 4 + ctx.measureText(dayf(h.t)).width <= W0 ? `<span class="d" style="left:${c + 4}px">${dayf(h.t)}</span>` : `<span class="d dend" style="right:0">${dayf(h.t)}</span>`}`; // every midnight gets its day; near the end it is right-aligned to the plot edge
    else if (hr % every === 0 && i <= hs.length - 4) ru += `<i class="t" style="left:${c}px"></i><span class="h" data-x="${c}" style="left:${c}px">${hf(hr)}</span>`; // a tick too close to the Now chip goes with its mark (as in 3D)
  });
  // Now alone at the start: the readout carries the date, day labels sit at midnights only
  $('ruler').innerHTML = ru;
  { const nt = $('ruler').querySelector('.nowtag'); if (nt) { const q = nt.getBoundingClientRect(), m = 6 * zoom(); $('ruler').querySelectorAll('.h').forEach(l => { const r = l.getBoundingClientRect(); if (r.right > q.left - m && r.left < q.right + m) { const mk = l.previousElementSibling; if (mk && mk.classList.contains('t')) mk.remove(); l.remove(); } }); } } // an hour label whose real box comes within 6 px of the Now chip goes, with its mark
  requestAnimationFrame(() => { const tags = [...$('lod').querySelectorAll('.pgtag')].map(t => t.getBoundingClientRect()); $('ruler').querySelectorAll('.h').forEach(l => { const r = l.getBoundingClientRect(); l.classList.toggle('tagged', tags.some(q => r.right > q.left - 4 && r.left < q.right + 4 && r.bottom > q.top - 2 && r.top < q.bottom + 2)); }); }); // a tick label under the Official tag steps aside
  const ev = events();
  const pgR = pgRunsOf(hs);
  $('tl').style.setProperty('--evh', ev.length ? '20px' : '0px');
  $('tl').classList.toggle('noev', !ev.length);
  $('ev').innerHTML = ev.filter(e => e.i >= off && e.i < off + span)
    .map(e => `<button class="mk ${e.kind}" data-i="${e.i}" style="left:${e.kind === 'pg' ? x(Math.min(e.end, off + span - 1) - off) + cw : x(e.i - off) + cw / 2}px${e.od ? `;--dc:${col(e.od)}` : ''}" title="Show ${dhm(H[e.i].t)}">${e.label}</button>`).join('');
  if (innerWidth >= 480) $('ev').querySelectorAll('.mk:not(.r18)').forEach(m => { m.style.top = `${$('lod').offsetTop - $('ev').offsetTop - m.offsetHeight - 4}px`; }); // on the switch chip's baseline: 4 px over the direction bar
  const sure = h => Math.max(h.p25, 1 - h.p25) >= 0.75, differs = h => { const s = prog(h); return s === null ? '' : s === 0 ? (sure(h) ? 'm' : '') : s !== h.od ? (s === 25 ? 'w' : 'e') : ''; };
  const small = h => Math.min(h.p25, 1 - h.p25) >= 0.1; // below 90% confidence: faded
  const pgI = new Set((pgDiff() || {}).idx || []);
  const pgRuns = pgRunsOf(hs);
  // INAA flags a possible switch here: an orange bracket above the strip (a comparison, not an alarm)
  const segL = []; { let i = 0; while (i < hs.length) { let j = i; while (j + 1 < hs.length && hs[j + 1].od === hs[i].od) j++;
    const lw = (() => { ctx.font = '600 13px "IBM Plex Sans", system-ui, sans-serif'; const w0 = ctx.measureText(`${two(hs[i].od)} ${word(hs[i].od)}`).width + 35; ctx.font = '400 12px "IBM Plex Sans", system-ui, sans-serif'; return w0; })(); // text, arrow and chip padding
    // one rule on both pages: at the band start when its first solid run (no night hatch) is >= the label's width + 8 px,
    // else at the start of the first run that is (8 px in); it never sits on the start of a night band
    let a = i, b = i - 1; for (let q = i; q <= j;) { while (q <= j && night(hs[q].t)) q++; let r = q; while (r + 1 <= j && !night(hs[r + 1].t)) r++; if (q > j) break; if (x(r) + cw - Math.max(x(q), nowX) >= lw + 8) { a = q; b = r; break; } q = r + 1; }
    if (b >= a && a <= j) segL.push(`<span class="dlab ${hs[i].od === 25 ? 'w' : 'e'}" style="left:${Math.max(x(a), nowX) + 8}px">${hs[i].od === 25 ? `${arr(25)}25 West` : `07 East${arr(7)}`}</span>`); i = j + 1; } }
  $('lod').innerHTML = pgR.map(([a, b]) => `<span class="pgline" style="left:${x(a)}px;width:${x(b) - x(a) + cw}px" title="Official forecast (INAA): possible switch"></span>${pgTag(x(a), $('lod').clientWidth, hs[a].t, plus1h(hs[b].t))}`).join('') + segL.join('') + hs.map(h => `<div class="${h.p25 >= 0.5 ? 'w' : 'e'}${night(h.t) ? ' n' : small(h) ? ' lo' : ''}" title="${night(h.t) ? 'Night ban, no scheduled flights' : `${pct(Math.min(h.p25, 1 - h.p25))} chance of the other direction`}"></div>`).join('');
  { // the predicted switch (one rule on both pages, siteui.STYLE.switch_tab_min): its segment at least 24 px wide (into the 24 px kept free
    // right of every row), faded like any hour under 90 % sure, and always its "to 25" chip on the tag band's baseline
    lanes.querySelectorAll(':scope > .swchip, :scope > .swtick, :scope > .swstem').forEach(c => c.remove());
    const Wl = $('lod').clientWidth, TMIN = ST.switch_tab_min || 24, odS = D.od_now === 25 ? 7 : 25, ci = D.change ? (k => (k < 0 ? -1 : k))(hs.findIndex(h => h.od === odS)) : -1; // the first hour in the other direction
    if (ci > 0 && ci < hs.length) { let e2 = ci; while (e2 + 1 < hs.length && hs[e2 + 1].od === hs[ci].od) e2++;
      const segW = x(e2) + cw - x(ci), w2 = Math.max(TMIN, segW), lo = hs.slice(ci, e2 + 1).some(h => small(h)), od2 = odS;
      if (segW < TMIN) $('lod').insertAdjacentHTML('beforeend', `<i class="swtab ${od2 === 25 ? 'w' : 'e'}${lo ? ' lo' : ''}" style="left:${Math.min(x(ci), Wl - TMIN)}px;width:${Math.min(w2, Wl)}px;background:${col(od2)}" title="The switch to ${two(od2)} starts here; the forecast ends ${dhm(plus1h(hs[hs.length - 1].t))}"></i>`);
      $('lod').insertAdjacentHTML('beforeend', `<span class="swchip ${od2 === 25 ? 'w' : 'e'}" style="left:${x(ci)}px;--dc:${col(od2)}" data-i="${ci + off}" title="Switch to ${two(od2)} expected ${dhm(hs[ci].t)}">to ${two(od2)}<span class="swt"> · ${dhm(hs[ci].t).replace(/ \d+ \w+,/, '')}</span></span>`);
      const chip = $('lod').querySelector('.swchip'), cwid = chip.offsetWidth, cl = Math.max(0, Math.min(x(ci), Wl - cwid)); /* inside the axis, like the segment */ chip.style.left = `${cl}px`;
      { const lod = $('lod'); lanes.querySelectorAll(':scope > .swchip').forEach(c => c.remove()); lanes.appendChild(chip); chip.style.left = `${lod.offsetLeft + cl}px`; chip.style.top = `${lod.offsetTop - chip.offsetHeight - 4}px`; /* 4 px of air over the bar */
        if (cl < x(ci) - 1) { const tk = document.createElement('i'); tk.className = 'swtick'; tk.style.cssText = `left:${lod.offsetLeft + x(ci)}px;top:${lod.offsetTop}px;height:${lod.offsetHeight}px`; lanes.appendChild(tk); }
        { const st = document.createElement('i'); st.className = 'swstem'; const cc = lod.querySelectorAll(':scope > div')[ci]; st.style.cssText = `left:${lod.offsetLeft + (cc ? cc.offsetLeft : x(ci)) - 0.5}px;top:${chip.offsetTop + chip.offsetHeight}px;height:${Math.max(0, lod.offsetTop - chip.offsetTop - chip.offsetHeight)}px;background:${col(od2)}`; lanes.appendChild(st); } } // a 1 px stem from the chip down to the switch moment, as the "18 closed" tag has // a chip pushed left of its hour (near the axis end): a dark tick across the bar marks the switch hour itself // in the lanes, above the cursor line: a solid chip the line never splits
      for (const tg of $('lod').querySelectorAll('.pgtag')) fitTag(tg, +tg.dataset.x, cl - 4); } } // the tag steps down its ladder and ends 4 px before the chip: one row, one baseline
  { // switch chance per hour: a 40 px row on 0 to 20% while the peak is small (same scale as the 3D view), 80 px on 0 to 100% when a real switch is in view
    const oth = h => (D.od_now === 25 ? 1 - h.p25 : h.p25) /* one meaning across the window: p(the direction other than the one flown at its start), never min(p, 1-p) */, W = $('lod').clientWidth, peak = Math.max(...H.map(oth)), SC = swScale(peak), TOP = SC.top;
    $('tl').style.setProperty('--swh', `${SC.h}px`);
    const LH = $('lpg').clientHeight || SC.h, LS = 0, PH = LH - LS, pk = hs.reduce((m, h, i) => (!night(h.t) && (night(hs[m].t) || oth(h) > oth(hs[m])) ? i : m), 0), yv = v => LH - Math.min(1, v / TOP) * PH, gy = Math.max(LS + 0.5, yv(SC.grid));
    const bar = o => (o < ST.switch.min_bar ? 0 : Math.max(2, Math.min(1, o / TOP) * PH)); // under 1 % (siteui.SWITCH.min_bar, both pages): only the baseline
    const IN = matchMedia('(max-width:479px)').matches, tX = IN ? 5 + NX : -4, tA = IN ? 'start' : 'end'; // phones: the ticks inside the plot's left edge, 4 px clear of the Now line
    let ov = `<text x="${tX}" y="${LH - 3}" text-anchor="${tA}" class="gt halo">0</text><line x1="0" x2="${W}" y1="${gy}" y2="${gy}" class="grid half"/>` /* the mid gridline, dotted and unlabelled: only 0 and the top carry values */
      + (TOP > SC.grid + 1e-9 ? `<line x1="0" x2="${W}" y1="${LS + 0.5}" y2="${LS + 0.5}" class="grid half"/><text x="${tX}" y="${LS + (IN ? 12 : 6)}" text-anchor="${tA}" class="gt halo">${Math.round(TOP * 100)}\u202f%</text>` : '') /* the scale's top: a faint line and its value */
      + `<line x1="0" x2="${W}" y1="${LH - 0.5}" y2="${LH - 0.5}" class="base calm"/>`;
    const n0c = nowIdx(), cci = D.change ? -1 : H.reduce((m, x2, k) => (k >= n0c && !night(x2.t) && (m < 0 || oth(x2) > oth(H[m])) ? k : m), -1); // the footer's closest call
    if (oth(hs[pk]) >= 0.01 && H.indexOf(hs[pk]) === cci) { const px = x(pk) + cw / 2, py = LH - bar(oth(hs[pk])) - 2, ty = py - 6; // the footer names the hour: here just "peak 20 %" on its dot
      if (ty - 9 >= LS + 1) ov += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="2" class="pkd"/><text x="${Math.min(W, px + 3).toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="end" class="pkt halo">peak ${pct(oth(hs[pk]))}</text>`; } // no room above the bar: the darker bar alone
    else if (oth(hs[pk]) >= 0.01) { // the peak, annotated clear of the gridline
      // just above the tallest bar, centred on it, always inside its own row
      const t = peakNote(oth(hs[pk]), hs[pk].t, false);
      const lx = x(pk) + cw / 2, by = LH - bar(oth(hs[pk])), ctx4 = renderTimeline.cx; ctx4.font = '400 12px "IBM Plex Sans", system-ui, sans-serif'; const tw4 = ctx4.measureText(t).width;
      // the note sits inside the plot, in a 14 px band along its top, ending 6 px before the first bar that reaches into
      // that band: clear of the direction bar, the switch chip and every bar; its capitals 4 px under the top gridline
      const BAND = 19, topOf = j => LH - bar(oth(hs[j])); let R = lx - 8;
      // desktop, when the band between the direction bar and the plot holds it: the note above the top gridline (its
      // descenders >= 2 px over it, its capitals >= 3 px under the bar), the leader along the note's mid-height (always
      // above the plot, so >= 4 px over every bar top) and a short vertical tick down to the peak dot
      const gapUp = $('lpg').offsetTop - $('lod').offsetTop - $('lod').offsetHeight;
      if (!IN && gapUp >= 17 && R - tw4 >= 4) { const bl = -5, ly = bl - 4, dy = by - 2;
        const lead = `M${(R + 3).toFixed(1)} ${ly}L${lx.toFixed(1)} ${ly}L${lx.toFixed(1)} ${(dy - 3).toFixed(1)}`;
        ov += `<g class="pk up" id="pkl" data-x="${W - 60}" data-w="120"><title>Highest hourly chance outside the night ban (23:00 to 05:00, no flights). The 48 h figure in the outlook tooltip is calibrated on past switches, so it can be lower.</title><path d="${lead}" class="pkl"/><circle cx="${lx.toFixed(1)}" cy="${dy.toFixed(1)}" r="2" class="pkd"/><rect class="pko" x="${(R - tw4 - 3).toFixed(1)}" y="${bl - 11}" width="${(tw4 + 5).toFixed(1)}" height="13"/><text x="${R.toFixed(1)}" y="${bl}" text-anchor="end" class="halo">${t}</text></g>`; }
      else { for (let it = 0; it < hs.length; it++) { let moved = false; for (let j = 0; j < pk; j++) if (topOf(j) < BAND + 1 && x(j) + cw > R - tw4 - 2 && x(j) - 6 < R) { R = x(j) - 6; moved = true; } if (!moved) break; }
      if (R - tw4 >= 4) { // a 1 px leader from the note's end to the peak dot: at the note's mid-height, lifted over any bar between them
        const ly = BAND - 9, dy = by - 2, mid = hs.map((h2, j) => j).filter(j => j < pk && x(j) + cw > R + 3 && x(j) < lx - 3), yL = Math.max(1, Math.min(ly, dy, ...mid.map(j => topOf(j) - 3))); // never under the dot: the leader stays above the peak bar
        const lead = `M${(R + 3).toFixed(1)} ${ly}` + (yL < ly ? `L${(R + 3).toFixed(1)} ${yL.toFixed(1)}` : '') + (dy - yL > 4 ? `L${lx.toFixed(1)} ${yL.toFixed(1)}L${lx.toFixed(1)} ${(dy - 3).toFixed(1)}` : `L${(lx - 3).toFixed(1)} ${yL.toFixed(1)}`);
        ov += `<g class="pk" id="pkl" data-x="${W - 60}" data-w="120"><title>Highest hourly chance outside the night ban (23:00 to 05:00, no flights). The 48 h figure in the outlook tooltip is calibrated on past switches, so it can be lower.</title><path d="${lead}" class="pkl"/><circle cx="${lx.toFixed(1)}" cy="${dy.toFixed(1)}" r="2" class="pkd"/><rect class="pko" x="${(R - tw4 - 3).toFixed(1)}" y="${BAND - 18}" width="${(tw4 + 5).toFixed(1)}" height="19"/><text x="${R.toFixed(1)}" y="${BAND - 4}" text-anchor="end" class="halo">${t}</text></g>`; }
      else ov += `<g class="pk" id="pkl" data-x="${W - 60}" data-w="120"><circle cx="${lx.toFixed(1)}" cy="${(by - 2).toFixed(1)}" r="2" class="pkd"/></g>`; } // no room in the band: the dot alone (the value is in the tooltip of the bar)
    }
    const wash = pgRunsOf(hs).map(([a, b]) => `<rect x="${x(a)}" y="${LS}" width="${x(b) - x(a) + cw}" height="${PH}" class="pgwash"/>`).join('');
    ov = wash + ov;
    const oname = otherName(hs); $('hlsw').innerHTML = `${T.switch} ${oname}`;
    $('lpg').innerHTML = hs.map(h => { const o = oth(h); return `<div title="${dhm(h.t)}: ${pct(o)} chance of ${oname} that hour"><i style="height:${(bar(o) || 1).toFixed(1)}px;${bar(o) ? '' : 'opacity:.3!important;'}background:${pgI.has(H.indexOf(h)) ? 'var(--risk-w,var(--risk))' : 'var(--risk)'};opacity:${o >= 0.2 || h === hs[pk] ? 1 : 0.85}"${h === hs[pk] ? ' class="pkb"' : ''}></i></div>`; }).join('') /* night hours keep their tone: the night band sits behind the bars (#nbands), never a paler bar that reads as "less sure" */ // neutral graphite: not a direction colour, not INAA orange, not the tailwind red (same in 3D)
      + `<span><svg width="${W}" height="${LH}" aria-hidden="true">${ov}</svg></span>`;
  }

  $('l18').innerHTML = hs.map(h => `<div class="${h.p18 < 0.5 ? 'x' : h.p18 < 0.9 ? 'r' : ''}${night(h.t) ? ' n' : ''}"></div>`).join('');
  { // tailwind on the runways in use against the official rule: above 1\u202fkt sustained = switch, from 10\u202fkt = switch at once
    const hw = $('lwd').clientHeight, W = $('lod').clientWidth, have = hs.filter(h => h.ws !== undefined);
    if (!have.length) $('lwd').innerHTML = '';
    else {
      const hw_ = h => -comp(h, h.od === 25 ? 249 : 69), vals = have.map(hw_); // + = headwind (fine), - = tailwind
      // one linear scale from tailwind (below 0) to headwind: the limit (-1 kt) sits 1 kt under the 0 line, as far as 1 kt
      // is anywhere on the plot; the scale reaches far enough down for the limit's label to sit under its line (13 px)
      const top = 6, bot = hw - 2, B = bot - top, hi = Math.max(12, Math.ceil(Math.max(...vals))), dMin = Math.max(2, Math.ceil(14 * (hi + 1) / Math.max(1, B - 14)));
      const lo = Math.min(-1 - dMin, Math.floor(Math.min(...vals)) - 1), k = B / (hi - lo), y = v => top + (hi - Math.max(lo, Math.min(hi, v))) * k;
      renderTimeline.hwY = i => (hs[i] && hs[i].ws !== undefined ? y(hw_(hs[i])) : null);
      let d = '', pen = false;
      hs.forEach((h, i) => { if (h.ws === undefined) { pen = false; return; } d += `${pen ? 'L' : 'M'}${(x(i) + cw / 2).toFixed(1)} ${y(hw_(h)).toFixed(1)}`; pen = true; });
      const step = hi - lo > 24 ? 10 : 5, ticks = [];
      for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) if (v === 0 || v === 10 || (v === 5 && innerWidth >= 480 && y(0) - y(10) >= 20)) ticks.push(v); // 0 and 10; desktop: a 5 kt grid line too (unlabelled: three labels in 20 px would touch)
      const band = '';
      // tailwind beyond the switch limit: shaded, so the side of the line that matters is obvious
      $('lwd').innerHTML = `<svg width="${W}" height="${hw}" viewBox="0 0 ${W} ${hw}" aria-hidden="true">${band}`
        + `<rect x="0" y="${y(-1)}" width="${W}" height="${Math.max(4, hw - y(-1))}" class="zone"/>` /* the area past the switch limit, lightly shaded (neutral grey) */
        + ticks.map(v => `<line x1="0" x2="${W}" y1="${y(v)}" y2="${y(v)}" class="${v ? 'grid' : 'zero'}" data-v="${v}"/>`).join('')

        + (matchMedia('(max-width:479px)').matches ? `<line x1="${5 + NX + 72}" x2="${W}" y1="${y(-1)}" y2="${y(-1)}" class="lim"/><text x="${5 + NX}" y="${(y(-1) + 13).toFixed(1)}" text-anchor="start" class="limt kn" id="limt" data-x="${5 + NX + 34}" data-w="68"><title>${T.limit}. ${T.limit_tip}</title>limit \u22121\u202fkt</text>` // phones: the limit label at the plot's left, under the 0 (the line dips toward the limit near a switch, at the right end)
          : (() => { // desktop: inside the plot, just above the dashed line at its left end (the gutter keeps the numeric ticks
            // only), at the leftmost spot where the headwind line stays clear of the label's box (the line dips toward the
            // limit before a switch, usually at the right end); 6 px in from the Now line
            const LW = 64, by = y(-1) + 13, top = y(-1) + 1, xs = have.map(h => [x(hs.indexOf(h)) + cw / 2, y(hw_(h))]); // under the line, in the shaded zone: above it the 0 line is only 1 kt away
            const yAt = px => { for (let q = 1; q < xs.length; q++) if (xs[q][0] >= px) { const [a, b] = [xs[q - 1], xs[q]], f = (px - a[0]) / ((b[0] - a[0]) || 1); return a[1] + (b[1] - a[1]) * Math.max(0, Math.min(1, f)); } return xs.length ? xs[xs.length - 1][1] : 0; };
            const free = l => { for (let px = l - 4; px <= l + LW + 4; px += 2) if (yAt(px) > top - 3) return false; return true; };
            let L = 6; while (L + LW < W - 4 && !free(L)) L += cw;
            if (L + LW >= W - 4) L = 6;
            return `<line x1="0" x2="${W}" y1="${y(-1)}" y2="${y(-1)}" class="lim"/><text x="${L.toFixed(1)}" y="${by.toFixed(1)}" text-anchor="start" class="limt kn inplot" id="limt" data-x="${(L + LW / 2).toFixed(1)}" data-w="${LW}"><title>${T.limit}. ${T.limit_tip}</title>limit \u22121\u202fkt</text>`; })())
        + `<path class="ln-w" d="${d}"/>`
        + (() => { const ni = nowIdx() - off; if (ni < 0 || ni >= hs.length || hs[ni].ws === undefined) return ''; const px = x(ni) + cw / 2, py = y(hw_(hs[ni]));
          return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="3" class="nowpt"/>`; })() // the dot at Now; its value is in the readout
        + ticks.filter(v => v !== 5).map(v => `<text x="${matchMedia('(max-width:479px)').matches ? 5 + NX : -5}" y="${y(v) + (matchMedia('(max-width:479px)').matches ? -3 : 4)}" text-anchor="${matchMedia('(max-width:479px)').matches ? 'start' : 'end'}" class="ax halo">${v ? Math.abs(v) : '0'}</text>`).join('') + '</svg>'; // the scale in the gutter, outside the plot, the 0 line labelled (the limit's label sits under its own line)
    }
    const r18 = hs.some(h => !night(h.t) && h.p18 < 0.9);
    $('tl').style.setProperty('--r18row', r18 ? '36px' : '0px'); $('tl').classList.toggle('r18on', r18); $('hl18').style.display = r18 ? '' : 'none'; $('l18').style.display = r18 ? '' : 'none'; // rows are placed explicitly, so a hidden row leaves no gap
  }
  { // legend: only what the shown hours contain
    const L = [];
    [7, 25].forEach(o => L.push([`<i style="background:${col(o)}"></i>`, `${two(o)} ${o === 25 ? 'West' : 'East'}`, '', o === 25 ? 'west' : 'east'])); // both, always (same legend set as the 3D view)
    if (hs.some(h => !night(h.t) && small(h))) L.push(['<i class="losw" style="background:var(--east)"></i>', T.faded, '', 'faded']);
    if (pgRuns.length) L.push(['<i class="pgbsw"></i>', T.inaa_flag, '', 'official']);
    { // Runway 18, one item (siteui.COPY.r18_*), worded as in the 3D view at every width
      const cx = hs.some(h => h.p18 < 0.5), rk = hs.some(h => h.p18 >= 0.5 && h.p18 < 0.9);
      if (cx || rk) L.push([`${cx ? '<i style="background:var(--red)"></i>' : ''}${rk ? '<i class="risksw"></i>' : ''}`, cx && rk ? T.r18_both : cx ? T.r18_closed : T.r18_risk, T.r18_tip, 'r18']); }
    if (hs.some(h => night(h.t))) L.push(['<i style="background:var(--hatch-bg),var(--east)"></i>', T.night, '', 'night']);
    // the headwind limit is named in its plot ("limit", with the rule in its tooltip) at every width: the legend keeps one row
    { const ORD = ST.legend_order || []; L.sort((a, b) => ORD.indexOf(a[3]) - ORD.indexOf(b[3])); } // one order on both pages (siteui.STYLE.legend_order)
    $('tlf').innerHTML = L.map(([i, s, tt]) => `<span${tt ? ` title="${tt}"` : ''}>${i}${s}</span>`).join('');
    { const tl = $('tl'), lg = $('tlf'); if (lg.parentElement === tl) tl.after(lg); lg.classList.remove('inbar'); lg.style.top = ''; tl.style.setProperty('--lgh', '0px'); } // every width: the legend under the last chart row, clear of the Now and cursor lines
  }
  let bands = '', nbands = '', a = -1;
  hs.forEach((h, i) => {
    if (night(h.t) && a < 0) a = i;
    if (a >= 0 && (!night(h.t) || i === hs.length - 1)) {
      const b = night(h.t) ? i : i - 1;
      nbands += `<div class="night" style="left:${x(a) - g / 2}px;width:${x(b) - x(a) + cw + g}px"></div>`; a = -1;
    }
  });
  if (nowIdx() >= off && nowIdx() < off + span) bands += `<div class="nowl" style="left:${x(nowIdx() - off) - g / 2}px"></div>`; // over every row (z-index above the lanes)
  $('bands').innerHTML = bands; $('nbands').innerHTML = nbands; // the night bands behind every row's marks, the now line over them
  $('mids').innerHTML = hs.map((h, i) => (i && hourOf(h.t) === 0 ? `<div class="mid" style="left:${x(i) - g / 2}px"></div>` : '')).join(''); // midnight: one hairline behind every row (labels mask it; same alpha as the 3D view)
  { const b = $('bands'), lw = $('lwd'); b.style.bottom = 'auto'; b.style.height = `${Math.max(0, lw.offsetTop + lw.offsetHeight - b.offsetTop)}px`; $('mids').style.height = b.style.height; $('nbands').style.bottom = 'auto'; $('nbands').style.height = b.style.height; } // the now line ends with the last row
  lanes.querySelectorAll('.mk').forEach(m => {
    m.addEventListener('pointerdown', e => { e.stopPropagation(); setPlaying(0); go(+m.dataset.i); }); // respond on press
    m.addEventListener('click', e => { if (!e.detail) { setPlaying(0); go(+m.dataset.i); } }); // keyboard
  });
  drawHead();
  requestAnimationFrame(placeR18); // after layout
}
function placeR18() { // every width: the "18 closed" tag in the Runway 18 lane, on a bracket over the first closed run (between
    // the chance plot's baseline and the cells, no leader); the top annotation lane carries only the switch chip
    const b = $('bands'), t = $('ev').querySelector('.mk.r18'), cs = [...$('l18').querySelectorAll(':scope > div.x')], c = cs[0]; if (!b || !t || !c || !c.offsetWidth) return;
    b.querySelectorAll('.r18brk').forEach(e => e.remove()); // placed again once the web font is in (the row name's width changes)
    const z = zoom(), B = b.getBoundingClientRect(), C = c.getBoundingClientRect(), V = $('ev').getBoundingClientRect(), L = $('lod').getBoundingClientRect();
    let E = 0; while (E + 1 < cs.length && cs[E + 1].getBoundingClientRect().left - cs[E].getBoundingClientRect().right < 4 * z) E++; // the first closed run
    const R2 = cs[E].getBoundingClientRect(), bt = (C.top - B.top) / z - 4;
    b.insertAdjacentHTML('beforeend', `<div class="r18brk" style="left:${(C.left - B.left) / z}px;width:${(R2.right - C.left) / z}px;top:${bt}px"></div>`);
    t.classList.add('inlane'); t.style.top = `${(C.top - V.top) / z - 7.5 - t.offsetHeight}px`; // 3.5 px clear of its bracket (the bracket 4 px over the cells)
    if (innerWidth >= 480) { // the row name sits left of the axis: centred on the run, inside the axis
      t.classList.remove('edge');
      const nm = (() => { const e = $('hl18'); if (!e || !e.offsetWidth) return null; const rg = document.createRange(); rg.selectNodeContents(e); const q = [...rg.getClientRects()].filter(r => r.width); return q.length ? Math.max(...q.map(r => r.right)) : null; })();
      const w = t.offsetWidth, cx = ((C.left + R2.right) / 2 - V.left) / z, lo = Math.max((L.left - V.left) / z, nm === null ? -1e9 : (nm - V.left) / z + 4.5) + w / 2, hi = (L.right - V.left) / z - w / 2;
      t.style.left = `${Math.max(lo, Math.min(hi, cx))}px`; return; }
    // phones: the row name shares the lane and moves with the Now line, so the tag is placed by its left edge (no centring,
    // so a late font swap cannot shift it): at the bracket start; if that would come within 4 px of the name, 4 px after
    // the name; if that runs past the plot end, 4 px before the name (never left of the plot)
    const nb = (() => { const e = $('hl18'); if (!e || !e.offsetWidth) return null; const rg = document.createRange(); rg.selectNodeContents(e); const q = [...rg.getClientRects()].filter(r => r.width); return q.length ? [Math.min(...q.map(r => r.left)), Math.max(...q.map(r => r.right))] : null; })();
    const w = t.getBoundingClientRect().width, pl = L.left, pr = L.right; let x0 = Math.max(C.left, pl);
    if (nb && x0 < nb[1] + 4 && x0 + w > nb[0] - 4) { x0 = nb[1] + 4; if (x0 + w > pr) x0 = Math.max(pl, nb[0] - 4 - w); }
    t.classList.add('edge'); t.style.left = `${(x0 - V.left) / z}px`; }

// playhead: 1:1 under the pointer; keys, play and markers glide it on a critically damped spring (response 0.3 s)
// that always starts from where it is, so it can be redirected mid-flight
const head = { x: 0, v: 0, to: 0, raf: 0, on: false };
function paintHead() {
  const W = $('lod').clientWidth, b = $('phl'), w = b.offsetWidth;
  $('ph').style.transform = `translateX(${head.x}px)`;
  b.style.transform = `translateX(${Math.max(-head.x, Math.min(-w / 2, W - head.x - w))}px)`; // clamped inside the plot
  const show = !$('ph').hidden; // the pill sits on the tick row: only the tick labels it lands on step aside
  { const br = b.getBoundingClientRect(), rr = $('ruler').getBoundingClientRect(), z = zoom();
    $('ruler').querySelectorAll('.d,.h,.nowtag').forEach(l => { l.style.translate = ''; l.style.opacity = ''; if (!show) return; const r = l.getBoundingClientRect(); const lx = $('ph').getBoundingClientRect().left; if (!((r.right > br.left - 6 && r.left < br.right + 6 && r.bottom > br.top - 2 && r.top < br.bottom + 2) || (l.classList.contains('h') && r.left - 2 < lx && r.right + 2 > lx))) return; /* 3D's rule: 6 px around the pill, and the tick label under the cursor line */
      if (l.classList.contains('d')) { const right = br.right + 8 - r.left; // only to the right, past the pill (never back over the day before); hidden when that leaves the plot
        if (right > 0 && right / z <= 60 && r.right + right <= rr.right) { /* a nudge over 60 px would lose its divider: hidden instead */ l.style.translate = `${(right / z).toFixed(1)}px 0`; return; } }
      l.style.opacity = '0'; }); } // ticks under the pill hide; a day label moves aside, hidden only when there is no room
  { const ph = $('ph'), z = zoom(), pr = ph.getBoundingClientRect(), lt = parseFloat(getComputedStyle(ph).getPropertyValue('--lt')) || 0; // the cursor breaks behind the in-bar label ("07 East →") and, on phones, behind every row title it crosses
    const boxes = show ? [...$('lod').querySelectorAll('.dlab'), ...(NARROW.matches ? document.querySelectorAll('#tl .hl') : [])].map(l => l.getBoundingClientRect()).filter(r => r.width && pr.left > r.left - 3 && pr.left < r.right + 3) : [];
    const gaps = boxes.map(r => [(r.top - pr.top) / z - lt - 2, (r.bottom - pr.top) / z - lt + 2]).sort((a, b) => a[0] - b[0]);
    ph.style.setProperty('--mk', gaps.length ? `linear-gradient(${gaps.map(([a, b]) => `#000 ${a.toFixed(1)}px,transparent ${a.toFixed(1)}px,transparent ${b.toFixed(1)}px,#000 ${b.toFixed(1)}px`).join(',')})` : 'none'); }
  { const lod = $('lod'), cx0 = $('ph').getBoundingClientRect().left, over = show && [...lod.querySelectorAll('.pgtag'), ...lanes.querySelectorAll('.swchip')].some(t => { const r = t.getBoundingClientRect(); return cx0 > r.left - 3 && cx0 < r.right + 3; }); // the shared tag-gap rule: under the Official tag or the switch chip the line starts below the tag band
    $('ph').style.setProperty('--lt', `${over ? lod.offsetTop : 20}px`); } // the line starts under the Official tag when it would cross it
  for (const id of ['pkl', 'limt']) { const pk = document.getElementById(id); if (pk) pk.classList.toggle('off', show && (id === 'pkl' || Math.abs(+pk.dataset.x - head.x) < +pk.dataset.w / 2 + 8)); } // the peak label steps out while a flag is shown // in-plot labels never sit under the cursor
}
function moveHead(x, glide) {
  head.to = x;
  if (!glide || !head.on || still.matches) { cancelAnimationFrame(head.raf); head.raf = 0; head.x = x; head.v = 0; paintHead(); return; }
  if (head.raf) return;
  const k = (2 * Math.PI / 0.3) ** 2, c = 4 * Math.PI / 0.3;
  let last = performance.now();
  const tick = now => {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    for (let n = Math.max(1, Math.ceil(dt * 240)), h = dt / n; n--;) { head.v += (-k * (head.x - head.to) - c * head.v) * h; head.x += head.v * h; }
    if (Math.abs(head.x - head.to) < 0.2 && Math.abs(head.v) < 2) { head.x = head.to; head.v = 0; }
    paintHead();
    head.raf = head.x === head.to && head.v === 0 ? 0 : requestAnimationFrame(tick);
  };
  head.raf = requestAnimationFrame(tick);
}
function drawHead(glide = false) {
  const show = sel >= off && sel < off + span;
  $('ph').hidden = !show;
  { const k = show ? sel - off : -1; [...$('lpg').children].forEach((d, i) => d.classList && d.classList.toggle('hov', i === k)); // the hovered bar, darker
    const sv = $('lwd').querySelector('svg'); let dt = $('hdot'); const yy = show && renderTimeline.hwY ? renderTimeline.hwY(sel - off) : null;
    if (sv) { if (!dt) { dt = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); dt.id = 'hdot'; dt.setAttribute('r', '4'); dt.setAttribute('class', 'hdot'); sv.appendChild(dt); }
      dt.style.display = yy === null ? 'none' : ''; if (yy !== null) { dt.setAttribute('cx', xOf(sel).toFixed(1)); dt.setAttribute('cy', yy.toFixed(1)); } } } // a dot on the headwind line at the cursor
  const pinned = show && pin >= 0 && sel === pin; $('ph').classList.toggle('pin', pinned); // a click pins: 2 px line, filled chip with a pin
  if (show) { $('phl').innerHTML = `${pinned ? ICON.pin : ''}${dayf(H[sel].t).split(' ')[0]} ${hm(H[sel].t)}`; moveHead(xOf(sel), glide); } else paintHead(); // the full date is in the readout
  head.on = show;
  lanes.setAttribute('aria-valuenow', sel + 1);
  lanes.setAttribute('aria-valuetext', sel < 0 ? 'Now' : dhm(H[sel].t));
}
function select(i, { glide = false, hold = false } = {}) {
  sel = i < 0 ? -1 : Math.max(0, Math.min(H.length - 1, i));
  if (hold) pin = sel;
  if (sel >= 0 && (sel < off || sel >= off + span)) { off = Math.max(0, Math.min(H.length - span, sel - Math.floor(span / 2))); renderTimeline(); }
  else drawHead(glide);
  renderOD(); renderR18(); renderMap();
}
const go = i => select(i, { glide: true, hold: true });
document.addEventListener('click', e => { const b = e.target.closest('.ccell, .swchip'); if (b) go(+b.dataset.i); }); document.addEventListener('keydown', e => { const b = e.target.closest?.('.ccell'); if (b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); go(+b.dataset.i); } }); // the closest call pins its hour (the whole cell)
function step(d) { go((sel < 0 ? (d > 0 ? -1 : 0) : sel) + d); }
function jumpEvent(dir) {
  const ev = events(), cur = sel;
  const e = dir > 0 ? ev.find(x => x.i > cur) : [...ev].reverse().find(x => x.i < (cur < 0 ? 0 : cur));
  if (e) go(e.i); else if (dir < 0) go(-1);
}
function setPlaying(dir) {
  playing = dir;
  $('play').innerHTML = dir ? `${ICON.pause}<span>Pause</span>` : `${ICON.play}<span>Play 48\u202fh</span>`;
  $('play').setAttribute('aria-label', dir ? 'Pause' : 'Play the next 48 hours');
  clearInterval(setPlaying.t);
  if (!dir) return;
  if (sel < 0 || sel >= H.length - 1) go(0);
  setPlaying.t = setInterval(() => (sel >= H.length - 1 ? setPlaying(0) : go(sel + 1)), 600);
}
lanes.addEventListener('pointerdown', e => {
  if (e.button) return;
  lanes.setPointerCapture(e.pointerId); dragging = true; setPlaying(0);
  select(idxAt(e), { hold: true });
});
lanes.addEventListener('pointermove', e => {
  if (!dragging && e.pointerType !== 'mouse') return;
  if (!dragging && playing) setPlaying(0);
  const i = idxAt(e);
  if (i !== sel) select(i, { hold: dragging });
});
const endDrag = () => { dragging = false; };
lanes.addEventListener('pointerup', endDrag);
lanes.addEventListener('pointercancel', endDrag);
lanes.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && !dragging && sel !== pin) select(pin, { glide: true }); });
addEventListener('keydown', e => {
  if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key, big = e.shiftKey ? 6 : 1;
  const act = {
    ArrowRight: () => step(big), ArrowLeft: () => step(-big), ArrowDown: () => jumpEvent(1), ArrowUp: () => jumpEvent(-1),
    Home: () => go(0), End: () => go(H.length - 1), Escape: () => go(-1), ' ': () => setPlaying(playing ? 0 : 1),
  }[k];
  if (!act || (k === ' ' && document.activeElement?.tagName === 'BUTTON')) return;
  e.preventDefault();
  if (k !== ' ') setPlaying(0);
  act();
});
$('play').onclick = () => setPlaying(playing ? 0 : 1);
$('back').onclick = () => { setPlaying(0); go(-1); };

// ---- segmented controls: the white thumb slides to the pressed segment
function thumb(seg) {
  const on = seg.querySelector('[aria-pressed=true]'), i = seg.querySelector(':scope>i');
  if (on) { i.style.width = `${on.offsetWidth}px`; i.style.transform = `translateX(${on.offsetLeft}px)`; }
}
function press(seg, btn) { seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b === btn)); thumb(seg); }
document.querySelectorAll('#zoom button').forEach(b => b.addEventListener('click', () => {
  span = +b.dataset.v; press($('zoom'), b);
  off = sel < 0 ? 0 : sel - Math.floor(span / 2);
  renderTimeline();
}));

// ---- header: live feed, time zone
let live = null;
function renderUpdated() {
  const stale = live && (Date.now() - Date.parse(live.generated)) / 1000 > 120;
  $('upd').className = `upd${stale ? ' stale' : ''}`;
  const age = Math.max(0, Math.round((Date.now() - Date.parse(D.issue)) / 6e4)), ageS = age < 60 ? `${age}\u202fmin ago` : age < 48 * 60 ? `${Math.round(age / 60)}\u202fh ago` : `${Math.round(age / 1440)} days ago`;
  const today = dayf(D.issue) === dayf(new Date());
  const nx = new Date(Math.ceil((Date.now() - 18e5 + 1) / 36e5) * 36e5 + 18e5); // the archive job runs every hour at :30 (fra-archive.timer)
  $('upd').title = `Forecast run issued ${hm(D.issue)}; the next run is published around ${hm(nx)}`;
  $('upd').innerHTML = `<i class="${age < 90 ? 'ok' : 'old'}"></i><span class="frs"><span class="fw">Forecast issued </span><span class="fi">Issued </span><b>${today ? '' : `<span class="fw">${dayf(D.issue)}, </span><span class="fi">${dayf(D.issue).split(' ')[0]} </span>`}${hm(D.issue)}</b><span class="fw"> · next <b>${hm(nx)}</b></span>${age < 90 ? ' · live' : ''}</span>`; // "live" on phones too // one template on both pages // the age in the tooltip, refreshed every minute // an older run: its weekday only on phones, so the brand keeps its width
  void ageS;
}
setInterval(renderUpdated, 60000);
const _ru = renderUpdated; renderUpdated = function () { _ru(); if ($('pissued')) $('pissued').innerHTML = $('upd').innerHTML; }; // phones: the issue time under the eyebrow
async function pollLive() {
  try {
    const r = await fetch('live.json', { cache: 'no-store' });
    if (!r.ok) throw new Error(r.status);
    const d = await r.json();
    if (d.issue && Date.parse(d.issue) < Date.parse(D.issue)) throw new Error('stale'); // old fra.live feed: keep this forecast
    const fresh = !live || live.issue !== d.issue;
    live = d;
    if (fresh && d.forecast?.length) {
      const keep = sel >= 0 ? Date.parse(H[sel].t) : null, held = pin >= 0 ? Date.parse(H[pin].t) : null;
      const base = new Map(H0.map(h => [Date.parse(h.t), h]));
      H = d.forecast.map(r => { const b = base.get(Date.parse(r.t)) || {}; return { ...b, t: r.t, p25: r.p25, p18: r.p18, od: r.od, rule: r.rule }; });
      if (d.od_now) D.od_now = d.od_now;
      if (d.issue) D.issue = d.issue;
      D.change = d.next_change ? { t: d.next_change, start: d.next_change, end: d.next_change } : null;
      if (d.p_change_48h !== undefined && d.p_change_48h !== null) D.p_change = d.p_change_48h;
      sel = keep === null ? -1 : idxOf(new Date(keep).toISOString());
      pin = held === null ? -1 : idxOf(new Date(held).toISOString());
      renderAll();
    }
  } catch {}
  renderUpdated();
}
document.querySelectorAll('#tz button').forEach(b => b.addEventListener('click', () => {
  tz = b.dataset.v === 'utc' ? 'UTC' : 'Europe/Berlin'; store.set('fra-tz', b.dataset.v); renderAll();
}));

// ---- paths map: a 2D schematic of the runways and the landing / take-off paths at the shown hour (the 3D view has the rest)
const TOWNS = [['Flörsheim', 50.0136, 8.428, 'sw'], ['Raunheim', 50.0098, 8.4535, 'e'], ['Rüsselsheim', 49.9899, 8.4225, 'e'], ['Offenbach', 50.0956, 8.7761, 'n'],
  ['Kelsterbach', 50.0613, 8.53, 'n'], ['Frankfurt', 50.1109, 8.6821, 'n'], ['Neu-Isenburg', 50.0531, 8.6947, 's'], ['Mainz', 49.9929, 8.2473, 's'], ['Groß-Gerau', 49.9214, 8.485, 's']]
  .map(([n, la, lo, side]) => ({ n, side, p: [(lo - 8.5706) * 71503, (la - 50.0333) * 111320] }));
const RIVER = [[50.108, 8.78], [50.104, 8.74], [50.106, 8.69], [50.103, 8.65], [50.1, 8.58], [50.092, 8.545], [50.063, 8.53], [50.04, 8.5], [50.012, 8.47], [50.003, 8.44], [50.008, 8.4], [50.007, 8.33], [50.003, 8.275]]
  .map(([la, lo]) => [(lo - 8.5706) * 71503, (la - 50.0333) * 111320]);
const CLIMB = 400, APP = od => (od === 25 ? 14000 : 9000); // metres drawn: final approach (to Offenbach for 25, the towns west of the field for 07) and climb-out
function mapPaths(od, r18) { // runways in their designators for od, approach / take-off segments in metres
  const G = D.geo, out = { rw: [], seg: [] };
  for (const r of G.runways) {
    const n18 = r.ref === '18', [w, e] = r.a[0] < r.b[0] ? [r.a, r.b] : [r.b, r.a], [nn, ss] = r.a[1] > r.b[1] ? [r.a, r.b] : [r.b, r.a];
    const L = Math.hypot(e[0] - w[0], e[1] - w[1]), u = [(e[0] - w[0]) / L, (e[1] - w[1]) / L], [d07, d25] = r.ref.split('/');
    // Runway 18's plate: beside its south end, clear of the centre runway's plate
    if (n18) { out.rw.push({ a: nn, b: ss, des: '18', at: [ss[0], ss[1] + 250], side: [-1, 0], out: null, closed: !r18 }); if (r18) out.seg.push({ kind: 'dep', a: ss, b: [ss[0], ss[1] - 900] }); continue; }
    const thr = od === 25 ? e : w, s = od === 25 ? -1 : 1, des = od === 25 ? d25 : d07;
    // plates off the strokes, at the runway end no path uses: landing runways at their far end, the centre runway behind its take-off start
    const land = !/C/.test(r.ref), pe = od === 25 ? w : e, sg = pe === e ? 1 : -1;
    out.rw.push(land ? { a: w, b: e, des, at: pe, out: [u[0] * sg, u[1] * sg] } : { a: w, b: e, des, at: [(w[0] + e[0]) / 2, (w[1] + e[1]) / 2], out: null, side: [u[1], -u[0]] }); // the centre runway: beside its middle, off the 18 junction
    if (/C/.test(r.ref)) { const end = od === 25 ? w : e; let t = 0; while (t < 4000 && inPoly([end[0] + u[0] * t * s, end[1] + u[1] * t * s], G.area)) t += 50; // to the outline
      if (od === 25) { const r18 = G.runways.find(q => q.ref === '18'); if (r18) { const x18 = Math.min(r18.a[0], r18.b[0]); t = Math.max(t, (end[0] - (x18 - 1500)) / Math.abs(u[0] || 1) - CLIMB); } } // 25: the take-off arrow starts past runway 18, never on it
      out.seg.push({ kind: 'dep', a: [end[0], end[1]], b: [end[0] + u[0] * (t + CLIMB) * s, end[1] + u[1] * (t + CLIMB) * s] }); } // from the runway end, on its centreline
    else { // the approach drawn to about 1.5 km beyond the farthest town under it
      const back = [-u[0] * s, -u[1] * s], along = TOWNS.map(t => { const dx = t.p[0] - thr[0], dy = t.p[1] - thr[1], f = dx * back[0] + dy * back[1]; return f > 0 && f < APP(od) && Math.abs(dx * back[1] - dy * back[0]) < 1500 ? f : 0; });
      const len = Math.min(APP(od), Math.max(5000, Math.max(...along) + 1500));
      out.seg.push({ kind: 'app', a: [thr[0] + back[0] * len, thr[1] + back[1] * len], b: thr, des }); // to about 1.5 km beyond the farthest town under it
    }
  }
  return out;
}
function inPoly(p, poly) { // ray casting
  let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; }
  return c;
}
function hull(P) { // convex hull (monotone chain) of [x, y] points
  const p = [...P].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...p].reverse()) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
function renderMap() {
  const el = $('map'); if (!el || !D.geo) return;
  const now = sel < 0, h = now ? H[nowIdx()] : H[sel], od = now ? D.od_now : h.od, r18 = h.p18 >= 0.5, M = mapPaths(od, r18);
  const nbm = !now && night(h.t); $('mapwhen').textContent = innerWidth < 480 ? (nbm ? `${dhm(h.t)} · night ban, no flights` : `${now ? 'now' : dhm(h.t)} · landings from the ${od === 25 ? 'east' : 'west'}`) : now ? 'now' : dhm(h.t); // desktop: the hour in the title row and what flies in the operator line under it (the column is narrow); phones: both in the title row, the map keeps its height
  $('mlgapp').setAttribute('stroke', `var(--${od === 25 ? 'west' : 'east'}-line)`);
  const near = (p, a, b) => { const vx = b[0] - a[0], vy = b[1] - a[1], q = Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / (vx * vx + vy * vy))); return Math.hypot(p[0] - a[0] - q * vx, p[1] - a[1] - q * vy); };
  const towns = TOWNS.map(t => ({ ...t, under: M.seg.some(g => g.kind === 'app' && near(t.p, g.a, g.b) < 1500) })).filter(t => t.under); // only the towns flown over
  // fit everything drawn (the approaches to their faded ends, runways, take-off arrows, the towns) to the card with 24 px padding
  const PAD = 16; // runways, take-offs, towns: 16 px padding on every side
  const feet = towns.map(t => { let best = null; for (const g of M.seg.filter(q => q.kind === 'app')) { const vx = g.b[0] - g.a[0], vy = g.b[1] - g.a[1], q = Math.max(0, Math.min(1, ((t.p[0] - g.a[0]) * vx + (t.p[1] - g.a[1]) * vy) / (vx * vx + vy * vy))), f = [g.a[0] + q * vx, g.a[1] + q * vy], d = Math.hypot(t.p[0] - f[0], t.p[1] - f[1]); if (!best || d < best[1]) best = [f, d]; } return best ? best[0] : t.p; }); // the landing path drawn to each town (both directions)
  const pts = [...feet, ...M.seg.filter(g => g.kind === 'dep').flatMap(g => [g.a, g.b]), /* runways, take-offs and towns: the airport large; the approach tails run off the edge */ ...M.rw.flatMap(r => [r.a, r.b]), ...(D.geo.area || []), ...towns.map(t => t.p)]; // the core: airport, take-offs, towns
  { const kx = Math.min((el.clientWidth - 32) / (Math.max(...pts.map(q => q[0])) - Math.min(...pts.map(q => q[0]))), (el.clientHeight - 32) / (Math.max(...pts.map(q => q[1])) - Math.min(...pts.map(q => q[1]))));
    const wt = towns.reduce((a, t) => (t.p[0] < a.p[0] ? t : a), towns[0] || { p: [0, 0] }); void wt; void kx; } // room for the westernmost town's name
  { // desktop: the key column takes whatever width the drawing does not need, so the drawing area has the content's proportions
    const card = el.closest('.c3d'), asp = (Math.max(...pts.map(q => q[0])) - Math.min(...pts.map(q => q[0]))) / (Math.max(...pts.map(q => q[1])) - Math.min(...pts.map(q => q[1])));
     } // drawn again at the new size
  const W = el.clientWidth, Hh = el.clientHeight; if (!W || !Hh) return;
  const x0 = Math.min(...pts.map(p => p[0])), x1 = Math.max(...pts.map(p => p[0])), y0 = Math.min(...pts.map(p => p[1])), y1 = Math.max(...pts.map(p => p[1]));
  const PV = NARROW.matches ? 16 : 12 /* desktop: 12 px under the intro as over the key, so the drawing is centred between them */, KH = NARROW.matches ? PV : Math.max(8, (el.closest('.c3d')?.querySelector('.mlg')?.offsetHeight || 0) + 12), /* the key row at the bottom stays clear */ k = Math.min((W - 2 * PAD) / (x1 - x0), (Hh - PV - KH) / (y1 - y0)) * (NARROW.matches ? 1 : 0.95), /* the legend row stays clear */ /* desktop: 5 % under the fit, so the arrowheads at the airport's east end keep apart and the lines end inside the padding */ /* a 10 % larger drawing collides with the key at 1280: kept at 24 px */ ox = (W - (x1 - x0) * k) / 2, /* the airport ends at the right padding; the approaches run on to the left */ /* desktop: the airport at the right edge, the approaches fill the left */ oy = PV + (Hh - PV - KH - (y1 - y0) * k) / 2;
  const X = p => ox + (p[0] - x0) * k, Y = p => oy + (y1 - p[1]) * k, Xinv = (sx, sy) => [x0 + (sx - ox) / k, y1 - (sy - oy) / k], xy = p => `${X(p).toFixed(1)} ${Y(p).toFixed(1)}`;
  const KB = (() => { const kb = el.closest('.c3d')?.querySelector('.mlg'); if (!kb || NARROW.matches) return null; const z = zoom(), a = kb.getBoundingClientRect(), m = el.getBoundingClientRect(); return [(a.left - m.left) / z - 10, (a.top - m.top) / z - 10, (a.right - m.left) / z + 10, (a.bottom - m.top) / z + 10]; })();
  for (const sg of M.seg) if (sg.kind === 'app') { // draw each approach on until it meets the padding edge (left or bottom), so the lines fill the card without being cut
    const ux = sg.a[0] - sg.b[0], uy = sg.a[1] - sg.b[1], L0 = Math.hypot(ux, uy), dx = ux / L0, dy = uy / L0;
    const sx = X(sg.a), sy = Y(sg.a), ex = dx * k, ey = -dy * k; // screen px per metre along the line
    let t = 1e9; const IN = 8; /* on to 8 px inside the card's padding: no line touches the padding */ if (ex < 0) t = Math.min(t, (IN - sx) / ex); if (ex > 0) t = Math.min(t, (W - IN - sx) / ex); if (ey < 0) t = Math.min(t, (IN - sy) / ey);  // both lines end 24 px inside the card
    if (t < 1e9 && Math.hypot(X(sg.a) - X(sg.b), Y(sg.a) - Y(sg.b)) + t * k > 0) { const L0p = Math.hypot(X(sg.a) - X(sg.b), Y(sg.a) - Y(sg.b)), Ltot = L0p + t * k, keep = Ltot; /* longer or shorter: a path already past the inset is cut back to it */ sg.a = [sg.b[0] + (sg.a[0] - sg.b[0]) * keep / L0p, sg.b[1] + (sg.a[1] - sg.b[1]) * keep / L0p]; } // a quarter shorter than the run to the edge (they fade out there)
    if (KB) { const L1 = Math.hypot(sg.a[0] - sg.b[0], sg.a[1] - sg.b[1]); let q = 0; // stop before the key
      const SB = [W - 16 - 2000 * k - 84, KB[1] - 30, W, KB[1]]; for (; q < L1; q += 20) { const px = X(sg.b) + (X(sg.a) - X(sg.b)) * q / L1, py = Y(sg.b) + (Y(sg.a) - Y(sg.b)) * q / L1; if ((px > KB[0] && px < KB[2] && py > KB[1] && py < KB[3]) || (px > SB[0] && px < SB[2] && py > SB[1] && py < SB[3])) break; } // stop before the key and the scale
      if (q < L1) sg.a = [sg.b[0] + (sg.a[0] - sg.b[0]) * q / L1, sg.b[1] + (sg.a[1] - sg.b[1]) * q / L1]; }
  }
  const c = `var(--${od === 25 ? 'west' : 'east'}-line)`;
  let g = '', SCL = null;
  if (D.geo.area.length) { // the airport as one smooth outline: the convex hull, corners rounded (curves through the edge midpoints)
    const dp = (P, tol) => { if (P.length < 3) return P; const [a, b] = [P[0], P[P.length - 1]]; let im = 0, dm = 0; // Douglas-Peucker
      for (let i = 1; i < P.length - 1; i++) { const d = ptSeg0(P[i], a, b); if (d > dm) { dm = d; im = i; } }
      return dm > tol ? [...dp(P.slice(0, im + 1), tol).slice(0, -1), ...dp(P.slice(im), tol)] : [a, b]; };
    const ptSeg0 = (p, a, b) => { const vx = b[0] - a[0], vy = b[1] - a[1], f = Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / (vx * vx + vy * vy || 1))); return Math.hypot(p[0] - a[0] - vx * f, p[1] - a[1] - vy * f); };
    const hp0 = D.geo.area.map(q => [X(q), Y(q)]), hp = dp([...hp0, hp0[0]], 2.5).slice(0, -1); // the true outline, small jogs removed (1.5 px tolerance)
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], n = hp.length;
    const d = 'M' + hp.map(q => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L'); void mid; void n; // straight edges, round joins: the true outline, fewer corners
    g = `${(() => { // the label where nothing else is: away from the paths, the towns and the airport
      const lines2 = M.seg.map(g => [X(g.a), Y(g.a), X(g.b), Y(g.b)]), tw = towns.map(t => [X(t.p), Y(t.p)]), RP = RIVER.map(r => [X(r), Y(r)]);
      const dseg = (px, py, [ax, ay, bx, by]) => { const vx = bx - ax, vy = by - ay, f = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy || 1))); return Math.hypot(px - ax - vx * f, py - ay - vy * f); };
      let best = null;
      // the label's box (about 30 x 11 px) just under or just over the line; scored by its box's distance to every path
      // and town marker, so no stroke runs into a letter
      const bxd = (q, [ax, ay, bx, by]) => { let m = 1e9; for (let f = 0; f <= 1; f += 0.02) { const px = ax + (bx - ax) * f, py = ay + (by - ay) * f; m = Math.min(m, Math.hypot(Math.max(q[0] - px, 0, px - q[2]), Math.max(q[1] - py, 0, py - q[3]))); } return m; };
      for (let k2 = 0; k2 < RP.length - 1; k2++) for (let f = 0, fs = 8 / (Math.hypot(RP[k2 + 1][0] - RP[k2][0], RP[k2 + 1][1] - RP[k2][1]) || 8); f <= 1; f += fs) for (const dy of [13, -6]) { const qx = RP[k2][0] + (RP[k2 + 1][0] - RP[k2][0]) * f, qy = RP[k2][1] + (RP[k2 + 1][1] - RP[k2][1]) * f + dy, q = [qx - 1, qy - 10, qx + 31, qy + (dy < 0 ? 1 : 3)]; /* "Main": capitals and x-height, no descenders */
        if (qx < 24 || qx > Math.min(...M.rw.flatMap(r => [X(r.a), X(r.b)])) - 70 || qy < 14 || qy > Hh - 40 || (D.geo.area.length && inPoly(Xinv(qx, qy), D.geo.area))) continue;
        const near = RP.slice(0, -1).map((r0, k3) => bxd(q, [r0[0], r0[1], RP[k3 + 1][0], RP[k3 + 1][1]])); if (Math.min(...near) < 1.5) continue; // never on its own line
        const c = Math.min(...lines2.map(l => bxd(q, l)), ...tw.map(([tx, ty]) => Math.hypot(Math.max(q[0] - tx, 0, tx - q[2]), Math.max(q[1] - ty, 0, ty - q[3])) - 10)) - (dy < 0 ? 1 : 0); void dseg;
        if (!best || c > best.c) best = { qx, qy, c }; }
      return `<path class="river" d="M${RIVER.map(q => xy(q)).join('L')}"/>` + (best && best.c > 4 ? `<text class="rvl" x="${best.qx.toFixed(1)}" y="${best.qy.toFixed(1)}">Main</text>` : ''); })()}` + g + `<path class="area" d="${d}Z"/>`; // the Main at every size (clipped by the frame), its label where it fits; then the airport outline
    { const KM = [1, 2, 3, 5, 10].find(v => v * 1000 * k >= 40) || 10, km2 = Math.round(KM * 1000 * k), sc = $('mscl'); /* a bar of at least 40 px */ if (sc) sc.innerHTML = `<span>N\u00a0↑</span><span class="msb"><b>${KM}\u202fkm</b><svg width="${km2 + 2}" height="5" viewBox="0 0 ${km2 + 2} 5" aria-hidden="true"><path d="M1 4h${km2}M1 1v3M${km2 + 1} 1v3"/></svg></span>`; /* the distance over its bar: narrow enough for the key row */ let inRow = true; if (sc) { sc.hidden = false; const k0 = sc.parentElement.firstElementChild; inRow = false; void k0; sc.hidden = true; /* the scale sits in the drawing's bottom-right corner, never squeezed into the key row */ }
      if (!inRow) { const sx = W - 8 - km2, sy = (KB ? KB[1] + 10 : Hh) - 8, cx = renderMap.cx || (renderMap.cx = document.createElement('canvas').getContext('2d')); cx.font = '400 13px "IBM Plex Sans", system-ui, sans-serif';
        const kw = cx.measureText(`${KM}\u202fkm`).width, ax = Math.round(sx - 8 - kw - 16) + 0.5; // north: a drawn 14 px arrow with its N, 16 px left of the distance; the bar 2 px thick with 6 px end ticks
        g += `<g class="scl"><path class="sbar" d="M${sx} ${sy}h${km2}M${sx} ${sy - 5}v6M${sx + km2} ${sy - 5}v6"/><text x="${sx - 8}" y="${sy + 1}" text-anchor="end">${KM}\u202fkm</text>`
          + `<path class="narw" d="M${ax} ${sy + 1}V${sy - 13}M${ax - 4.5} ${sy - 8.5}L${ax} ${sy - 13}L${ax + 4.5} ${sy - 8.5}"/><text class="nlbl" x="${ax - 8}" y="${sy + 1}" text-anchor="end">N</text></g>`; } /* no room in the key row with 10 px gaps: at the map's bottom-right instead */ } // north and the scale: the key row's right end
  }
  const SEG = [], GAPP = []; // every stroke on screen, for the label pass; the other direction's dashed approaches
  // town markers at their place, at least 22 px apart (pushed apart along the line between them)
  const R = 5.5, MK = towns.map(t => ({ t, x: X(t.p), y: Y(t.p) }));
  for (const m of MK) for (const sg of M.seg.filter(g => g.kind === 'app')) { const ax = X(sg.a), ay = Y(sg.a), bx = X(sg.b), by = Y(sg.b), vx = bx - ax, vy = by - ay, L2 = vx * vx + vy * vy || 1, f = Math.max(0, Math.min(1, ((m.x - ax) * vx + (m.y - ay) * vy) / L2)), px = ax + vx * f, py = ay + vy * f, d = Math.hypot(m.x - px, m.y - py);
    if (d < 6) { const nx = -vy / Math.sqrt(L2), ny = vx / Math.sqrt(L2), sgn = ((m.x - px) * nx + (m.y - py) * ny) >= 0 ? 1 : -1, mv = Math.min(4, 6 - d); m.x += nx * sgn * mv; m.y += ny * sgn * mv; } } // a marker on a landing line moves at most 4 px off it; its card-colour halo breaks the line around the disc
  // markers stay at the towns' true positions (same lat/lon and projection as the 3D view); only the names move
  for (let i = 0; i < MK.length; i++) for (let j = i + 1; j < MK.length; j++) { const a2 = MK[i], b2 = MK[j], dx = b2.x - a2.x, dy = b2.y - a2.y, d = Math.hypot(dx, dy) || 1, mv = Math.min(4, Math.max(0, (19 - d) / 2)); if (mv > 0) { a2.x -= dx / d * mv; a2.y -= dy / d * mv; b2.x += dx / d * mv; b2.y += dy / d * mv; } } // two close markers step apart, at most 4 px each
  { const oth25 = od === 25 ? 7 : 25, i0 = now ? nowIdx() : sel, show = H.slice(i0).some(x => x.od === oth25) || H.slice(i0).some(x => (od === 25 ? x.p25 : 1 - x.p25) <= 0.8); // the other direction's landings, faint: only when a switch away from the shown direction is expected or possible (>= 20 %)
    { const mi = $('mapif'); if (mi) { const lt = o => `landings from the ${o === 25 ? 'east' : 'west'},</span> <span class="nw">take-offs ${o === 25 ? 'west' : 'east'}</span>`; /* each sentence one line in the card's width */ // 07: approaches come in from the west
        mi.hidden = innerWidth < 480 && (!show || nbm); mi.innerHTML = nbm ? '<span class="mi0">Night ban, no flights</span>' : `<span class="mi0"><span class="nw">${lt(od).replace(/^l/, 'L')}</span>${show ? `<span class="mi1"><span class="nw">If switched: ${lt(oth25)}</span>` : ''}`; } } // the operator's reading of the solid and the faint dashed paths
    const kg = el.closest('.c3d')?.querySelector('#mlggh'); if (kg) { kg.hidden = !show; kg.querySelector('path').setAttribute('stroke', `var(--${oth25 === 25 ? 'west' : 'east'}-line)`); kg.lastChild.textContent = `${oth25 === 25 ? 'West' : 'East'} (if switched)`; } // never the same sample as "Landings"
    if (show) for (const sg of mapPaths(oth25, r18).seg.filter(q => q.kind === 'app')) { const ux = sg.a[0] - sg.b[0], uy = sg.a[1] - sg.b[1], L0 = Math.hypot(ux, uy), far0 = [sg.b[0] + ux / L0 * 40000, sg.b[1] + uy / L0 * 40000], fx = X(far0) - X(sg.b), fy = Y(far0) - Y(sg.b), fit8 = Math.min(1, ...[fx > 0 ? (W - 8 - X(sg.b)) / fx : fx < 0 ? (8 - X(sg.b)) / fx : 1, fy > 0 ? (Hh - 8 - Y(sg.b)) / fy : fy < 0 ? (8 - Y(sg.b)) / fy : 1].map(v => Math.max(0, v))), far = [sg.b[0] + (far0[0] - sg.b[0]) * fit8, sg.b[1] + (far0[1] - sg.b[1]) * fit8]; /* on to the card's edge, ending 8 px inside it */ g += `<!--gapp${GAPP.length}-->`; GAPP.push([X(far), Y(far), X(sg.b), Y(sg.b), `var(--${oth25 === 25 ? 'west' : 'east'}-line)`]); SEG.push([X(far), Y(far), X(sg.b), Y(sg.b), null, null, 1, 'go']); } } // a plate may sit over it (on a 2 px halo), at a small cost: clear spots still win // drawn after the plates are placed (they keep clear of these dashes too)
  for (const s of M.seg) { // chevrons: landings point at the runway, take-offs away from it
    const ax = X(s.a), ay = Y(s.a), bx = X(s.b), by = Y(s.b), L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L;
    // landing chevrons where the path is farthest from any town (their names go near the towns)
    const f0 = 0.2; // chevrons on the solid part
    const n = 8; // 11 px chevrons
    const at = s.kind === 'app' ? 0.86 : 1, cx = ax + (bx - ax) * at - (s.kind === 'app' ? 0 : ux), cy = ay + (by - ay) * at - (s.kind === 'app' ? 0 : uy); // one chevron per path: near the landing threshold, at the end of a take-off
    const chev = `M${(cx - ux * n - uy * n).toFixed(1)} ${(cy - uy * n + ux * n).toFixed(1)}L${cx.toFixed(1)} ${cy.toFixed(1)}L${(cx - ux * n + uy * n).toFixed(1)} ${(cy - uy * n - ux * n).toFixed(1)}`;
    const gid = `mf${SEG.length}`; // each approach fades in over its outer 20 %
    g += s.kind === 'app' ? `<defs><linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}"><stop offset="0" stop-color="${c}" stop-opacity="1"/><stop offset="1" stop-color="${c}" stop-opacity="1"/></linearGradient></defs><path class="app" stroke="url(#${gid})" d="M${xy(s.a)}L${xy(s.b)}"/><path class="arw" stroke="${c}" d="${chev}"/>`
      : `<path class="dep" d="M${(() => { if (!D.geo.area.length) return xy(s.a); let t0 = 0; for (let q = 0; q <= 1; q += 0.02) { const p = [s.a[0] + (s.b[0] - s.a[0]) * q, s.a[1] + (s.b[1] - s.a[1]) * q]; if (!inPoly(p, D.geo.area)) { t0 = q; break; } } return xy([s.a[0] + (s.b[0] - s.a[0]) * t0, s.a[1] + (s.b[1] - s.a[1]) * t0]); })()}L${xy(s.b)}"/><path class="arw" stroke="var(--ink)" d="${chev}"/>`; // the take-off line starts outside the airport outline
    SEG.push([ax, ay, bx, by, s.kind === 'app' ? ux : null, s.kind === 'app' ? uy : null]);
    SEG.push([cx - ux * n - uy * n, cy - uy * n + ux * n, cx, cy, null, null], [cx - ux * n + uy * n, cy - uy * n - ux * n, cx, cy, null, null]); // the chevron's arms
  }
  for (const r of M.rw) { g += `<line data-des="${r.des}" class="rwy${r.closed ? ' closed' : ''}" x1="${X(r.a)}" y1="${Y(r.a)}" x2="${X(r.b)}" y2="${Y(r.b)}"/>`; SEG.push([X(r.a), Y(r.a), X(r.b), Y(r.b), null, null, 4]); }
  const placed = []; let gp = ''; if (SCL) placed.push(SCL);
  { const kb = el.closest('.c3d')?.querySelector('.mlg'); if (kb && !NARROW.matches) { const z = zoom(), a = kb.getBoundingClientRect(), m = el.getBoundingClientRect(); placed.push([(a.left - m.left) / z - 4, (a.top - m.top) / z - 4, (a.right - m.left) / z + 4, (a.bottom - m.top) / z + 4]); } } // the key overlay: no plate or name under it
  const ov = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
  const ptBox = (x, y, q) => Math.hypot(Math.max(q[0] - x, 0, x - q[2]), Math.max(q[1] - y, 0, y - q[3]));
  const ptSeg = (x, y, ax, ay, bx, by) => { const vx = bx - ax, vy = by - ay, f = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / (vx * vx + vy * vy || 1))); return Math.hypot(x - ax - vx * f, y - ay - vy * f); };
  const segHit = (ax, ay, bx, by, q) => { // does the segment pass through the box (Liang-Barsky)
    let t0 = 0, t1 = 1; const dx = bx - ax, dy = by - ay;
    for (const [p, r] of [[-dx, ax - q[0]], [dx, q[2] - ax], [-dy, ay - q[1]], [dy, q[3] - ay]]) { if (!p) { if (r < 0) return false; } else { const t = r / p; if (p < 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t); } }
    return t0 <= t1;
  };
  const segBox = (sg, q) => { // exact distance between a stroke (minus its half width) and a box
    const [ax, ay, bx, by] = sg;
    const d = segHit(ax, ay, bx, by, q) ? 0 : Math.min(ptBox(ax, ay, q), ptBox(bx, by, q), ...[[q[0], q[1]], [q[2], q[1]], [q[0], q[3]], [q[2], q[3]]].map(([x, y]) => ptSeg(x, y, ax, ay, bx, by)));
    return d - (sg[6] || 1.5);
  };
  const platesFor = (list, placed) => { let gp = '', worst = 0; for (const r of [...list].sort((a, b) => (/C/.test(b.des) - /C/.test(a.des)) || ((a.des === '18') - (b.des === '18')))) { // designator plates (the centre runway first, it has the fewest free spots; Runway 18 last, so the parallels keep their thresholds): past the runway end no path uses, else the clearest spot along it
    const w = r.des.length * 8 + 8, ax = X(r.a), ay = Y(r.a), bx = X(r.b), by = Y(r.b), L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L;
    const want = r.out ? [X(r.at) + r.out[0] * (w / 2 + 6), Y(r.at) - r.out[1] * (w / 2 + 6)] : r.side ? [X(r.at) + r.side[0] * 16, Y(r.at) - r.side[1] * 16] : null;
    const cand = []; void want;
    // one rule on both pages: at the runway's landing threshold (west in 07 operations, east in 25; Runway 18 at its north end), offset
    // perpendicular on the outer side (away from the other runways; the centre runway: north) at a fixed distance
    const RC = M.rw.map(q => [(X(q.a) + X(q.b)) / 2, (Y(q.a) + Y(q.b)) / 2]).reduce((a2, q, _, A2) => [a2[0] + q[0] / A2.length, a2[1] + q[1] / A2.length], [0, 0]);
    const aFirst = r.des === '18' ? ay <= by : (od === 25 ? ax >= bx : ax <= bx), thr = aFirst ? [ax, ay] : [bx, by], dirIn = aFirst ? [ux, uy] : [-ux, -uy]; // the landing threshold: west end in 07 operations, east in 25, north for 18 (whatever order the geometry has)
    let nx = -uy, ny = ux; const cen = /C/.test(r.des);
    if (cen ? ny > 0 : (nx * ((ax + bx) / 2 - RC[0]) + ny * ((ay + by) / 2 - RC[1])) < 0) { nx = -nx; ny = -ny; }
    if (r.des === '18' && nx > 0) { nx = -nx; ny = -ny; } // 18: on its west side
    const o0 = Math.abs(nx) * w / 2 + Math.abs(ny) * 9 + 2.5 + 8; // 8 px clear of the stroke (a badge height + 4 does not fit the card: they land inside the airport)
    { const ha = Math.abs(dirIn[0]) * w / 2 + Math.abs(dirIn[1]) * 9 + 4; // one rule on both pages: 4 px before the threshold on the runway's axis; sideways only as far as a path needs
      for (const o of [0, 18, -18]) cand.push([thr[0] - dirIn[0] * ha + nx * o, thr[1] - dirIn[1] * ha + ny * o, Math.abs(o) / 3]); } // on the axis, 4 px before the threshold; sideways when a landing path arrives there
    for (const [t, pen] of [[w / 2 + 4, 10], [w / 2 + 16, 20], [w / 2 + 28, 30]]) for (const [o, sd, pe] of [[o0, 1, 0], [o0 + 8, 1, 25], [o0, -1, 60], [o0 + 8, -1, 80]]) cand.push([thr[0] + dirIn[0] * t + nx * o * sd, thr[1] + dirIn[1] * t + ny * o * sd, pen + pe]); // else beside the runway, just inside the threshold
    for (let f = 0.1; f <= 0.91; f += 0.05) for (const [o, pe] of [[o0 - 4, 0], [o0, 6], [o0 + 6, 12]]) cand.push([thr[0] + dirIn[0] * L * f + nx * o, thr[1] + dirIn[1] * L * f + ny * o, 50 + pe + 40 * f]); // else beside its own strip, further along it (as in the 3D view)
    if (r.des === '18') for (let f = 0.1; f <= 0.91; f += 0.025) for (let o = o0 - 4; o <= o0 + 10; o += 1) for (const sd of [1, -1]) cand.push([thr[0] + dirIn[0] * L * f + nx * o * sd, thr[1] + dirIn[1] * L * f + ny * o * sd, 50 + 2 * (o - o0 + 4) + (sd < 0 ? 20 : 0) + 40 * f]); // Runway 18 (placed after the parallels): the closest clear spot beside its strip, either side
    { const fe = [thr[0] + dirIn[0] * L, thr[1] + dirIn[1] * L]; // else past the far end, on or near the axis (the centre runway between two dashed approaches)
      for (const t of [w / 2 + 4, w / 2 + 10, w / 2 + 16, w / 2 + 24]) for (const o of [0, -4, 4, -8, 8, -12, 12, -16, 16]) cand.push([fe[0] + dirIn[0] * t + nx * o, fe[1] + dirIn[1] * t + ny * o, 90 + t + Math.abs(o)]); }
    for (let gx = -70; gx <= 70; gx += 10) for (let gy = -40; gy <= 40; gy += 6) cand.push([thr[0] + gx, thr[1] + gy, 120 + Math.hypot(gx, gy)]); // crowded: the nearest free spot to the threshold
    let best = null;
    for (const [px, py, pen] of cand) {
      const q = [px - w / 2, py - 9, px + w / 2, py + 9];
      let cost = pen;
      if (q[0] < 12 || q[2] > W - 12 || q[1] < 8 || q[3] > Hh - 4) cost += 1e4; /* every plate (07C too) 12 px inside the card's sides */ // never touching the card's top padding
      for (const z of placed) if (ov(q, [z[0] - 2, z[1] - 2, z[2] + 2, z[3] + 2])) cost += 8000;
      for (const sg of SEG) { const own = sg[6] === 4 && Math.abs(sg[0] - ax) < 0.01 && Math.abs(sg[1] - ay) < 0.01, d = segBox(sg, q); if (d < (own ? 2 : 6)) cost += sg[7] === 'go' ? 30 : 3000; } /* an "if switched" approach: the plate may sit over it, on its halo */ /* its own runway: it sits at its end */ // >= 4 px from every stroke, arrow and approach line, its own runway included
      /* on the airport is fine (as in the 3D view): every plate stays at its threshold */
      for (const m of MK) if (ov(q, [m.x - R - 3, m.y - R - 3, m.x + R + 3, m.y + R + 3])) cost += 2000;
      for (const o of M.rw) { if (o === r) continue; const oax = X(o.a), oay = Y(o.a), obx = X(o.b), oby = Y(o.b), oL = Math.hypot(obx - oax, oby - oay) || 1, ex = (obx - oax) / oL * 16, ey = (oby - oay) / oL * 16; // never on another runway's line or its run-out: a plate there reads as that runway's
        if (segBox([oax - ex, oay - ey, obx + ex, oby + ey, null, null, 2.5], q) < 12) cost += 2500; }
      { const dOwn = ptSeg(px, py, ax, ay, bx, by); if (M.rw.some(o => o !== r && ptSeg(px, py, X(o.a), Y(o.a), X(o.b), Y(o.b)) < dOwn)) cost += 5000; /* nearest its own runway */
        if (segBox([ax, ay, bx, by], q) > 14) cost += 1500; } /* beside its own strip, not adrift */
      if (r.des !== '18') cost += ptBox(thr[0], thr[1], q); /* a parallel runway: among clear spots, the one nearest its landing threshold */
      if (!best || cost < best.cost) best = { cost, px, py };
    }
    const { px, py } = best; if (r.des !== '18') worst = Math.max(worst, best.cost);
    placed.push([px - w / 2 - 2, py - 11, px + w / 2 + 2, py + 11]);
    { const q = [px - w / 2, py - 9, px + w / 2, py + 9], d = ptBox(thr[0], thr[1], q); // a parallel runway's plate more than 6 px from its threshold: a 1 px leader tick from the plate to it
      if (r.des !== '18' && d > 6) { const cx = Math.max(q[0] + 3, Math.min(q[2] - 3, thr[0])), cy = Math.max(q[1], Math.min(q[3], thr[1])), L2 = Math.hypot(thr[0] - cx, thr[1] - cy) || 1, ex = thr[0] - (thr[0] - cx) / L2 * 3, ey = thr[1] - (thr[1] - cy) / L2 * 3;
        gp += `<path class="rwtk" data-des="${r.des}" d="M${cx.toFixed(1)} ${cy.toFixed(1)}L${ex.toFixed(1)} ${ey.toFixed(1)}"/>`; } }
    { const q = [px - w / 2, py - 9, px + w / 2, py + 9]; if (GAPP.some(([gx0, gy0, gx1, gy1]) => segBox([gx0, gy0, gx1, gy1, null, null, 1], q) < 2)) gp += `<rect class="rwph" x="${(px - w / 2 - 2).toFixed(1)}" y="${(py - 11).toFixed(1)}" width="${w + 4}" height="22" rx="5"/>`; } // over an "if switched" line: a 2 px halo in the map's colour, the line visibly passing under the plate
    gp += `<rect class="rwp${r.closed ? ' cl' : ''}" x="${(px - w / 2).toFixed(1)}" y="${(py - 9).toFixed(1)}" width="${w}" height="18" rx="3"${r.closed ? ' style="fill:var(--red);stroke:none"' : ''}/><text class="rwt${r.closed ? ' cl' : ''}" x="${px.toFixed(1)}" y="${(py + 4).toFixed(1)}" text-anchor="middle">${r.des}</text>`;
  } return { gp, worst }; };
  { // each runway's plate beside its own strip (as in the 3D view); when the map is too small for that, one stacked chip at the parallel thresholds
    const tryP = placed.slice(), ind = platesFor(M.rw, tryP), grouped = ind.worst >= 1000 && M.rw.filter(r => r.des !== '18').length === 3; // a parallel plate found no clear spot beside its strip
    if (!grouped) { gp += ind.gp; placed.splice(0, placed.length, ...tryP); }
    else {
      const PAR = M.rw.filter(r => r.des !== '18'), thrOf = r => { const ax = X(r.a), ay = Y(r.a), bx = X(r.b), by = Y(r.b), af = od === 25 ? ax >= bx : ax <= bx; return af ? [ax, ay] : [bx, by]; };
      const PT = PAR.map(r => ({ r, t: thrOf(r) })).sort((p1, p2) => p1.t[1] - p2.t[1]);
      if (grouped) { // one stacked chip "07L / 07C / 07R" (top to bottom, as the runways lie) beside the thresholds, a bracket spanning the three runway ends
        const cw = 34, ch = 44, low = PT[2].t, apps = M.seg.filter(g => g.kind === 'app').map(g => [X(g.a), Y(g.a), X(g.b), Y(g.b)]);
        const lineY = x => Math.max(-1e9, ...apps.map(([ax, ay, bx, by]) => (Math.min(ax, bx) <= x && x <= Math.max(ax, bx) && bx !== ax ? ay + (by - ay) * (x - ax) / (bx - ax) : -1e9))); // the lowest landing path at x
        let bestC = null;
        const lineT = x => Math.min(1e9, ...apps.map(([ax, ay, bx, by]) => (Math.min(ax, bx) <= x && x <= Math.max(ax, bx) && bx !== ax ? ay + (by - ay) * (x - ax) / (bx - ax) : 1e9))); // the highest landing path at x
        for (const side of [-1, 1]) for (let dx = -160; dx <= 10; dx += 6) for (let dy = 0; dy <= 90; dy += 4) { // below the lowest landing path (else above the highest), near the thresholds, clear of every stroke and marker
          const cx0 = low[0] + dx - cw, cy0 = side > 0 ? Math.max(lineY(cx0), lineY(cx0 + cw)) + 8 + dy : Math.min(lineT(cx0), lineT(cx0 + cw)) - 8 - ch - dy, q = [cx0, cy0, cx0 + cw, cy0 + ch];
          if (!isFinite(cy0)) continue;
          if (q[0] < 8 || q[2] > W - 8 || q[1] < 8 || q[3] > (KB ? KB[1] + 6 : Hh) - 4) continue;
          let cost = Math.hypot(q[2] - low[0], (side > 0 ? q[1] : q[3]) - low[1]) + (side > 0 ? 60 : 0); /* above the highest landing path, by the west end of the 07 runways */
          for (const sg of SEG) if (segBox(sg, q) < 8) cost += 3000; /* 8 px clear of every path: the chip never overprints a line */
          for (const m of MK) if (ov(q, [m.x - R - 4, m.y - R - 4, m.x + R + 4, m.y + R + 4])) cost += 3000;
          for (const z of placed) if (ov(q, z)) cost += 3000;
          if (!bestC || cost < bestC.cost) bestC = { cost, cx0, cy0 }; }
        const { cx0, cy0 } = bestC || { cx0: low[0] - 6 - cw, cy0: low[1] - ch / 2 }, lx = Math.min(Math.max(low[0], cx0), cx0 + cw), ly = cy0 > low[1] ? cy0 : cy0 + ch; // a short leader from the chip to the thresholds
        gp += `<path class="rwld" d="M${lx.toFixed(1)} ${ly.toFixed(1)}L${(cy0 > low[1] ? low[0] : PT[0].t[0]).toFixed(1)} ${(cy0 > low[1] ? low[1] + 3 : PT[0].t[1] - 3).toFixed(1)}"/><circle class="rwldd" cx="${(cy0 > low[1] ? low[0] : PT[0].t[0]).toFixed(1)}" cy="${(cy0 > low[1] ? low[1] + 3 : PT[0].t[1] - 3).toFixed(1)}" r="2"/><rect class="rwhalo" x="${(cx0 - 3).toFixed(1)}" y="${(cy0 - 3).toFixed(1)}" width="${cw + 6}" height="${ch + 6}" rx="5"/><rect class="rwp" x="${cx0.toFixed(1)}" y="${cy0.toFixed(1)}" width="${cw}" height="${ch}" rx="3"/>` + PT.map((q, k) => `<text class="rwt rwt11" x="${(cx0 + cw / 2).toFixed(1)}" y="${(cy0 + 15 + k * 13).toFixed(1)}" text-anchor="middle">${q.r.des}</text>`).join('');
        placed.push([cx0 - 2, cy0 - 2, cx0 + cw + 2, cy0 + ch + 2]);
      }

      gp += platesFor(M.rw.filter(r => r.des === '18'), placed).gp;
    }
  }

  [...MK].sort((a2, b2) => a2.t.p[0] - b2.t.p[0]).forEach((m, k) => { m.no = k + 1; }); // numbered west to east, the same on both pages
  for (const m of MK) g += `<circle class="tnumh" cx="${m.x.toFixed(1)}" cy="${m.y.toFixed(1)}" r="10.25"/><circle class="tnum" cx="${m.x.toFixed(1)}" cy="${m.y.toFixed(1)}" r="7.5"/><text class="tnumt" x="${m.x.toFixed(1)}" y="${(m.y + 3.8).toFixed(1)}" text-anchor="middle">${m.no}</text>`;
  { const kt = el.closest('.c3d')?.querySelector('#mlgtowns'); if (kt) kt.innerHTML = [...MK].sort((a2, b2) => a2.no - b2.no).map(m => `<span class="tk"><i>${m.no}</i>${m.t.n}</span>`).join(''); }
  // the towns are named in the key row (numbered); the subtitle keeps the short form
  { // the other direction's dashed approaches: one continuous dashed line from the card's edge to the threshold; a plate
    // over it sits on top with a 2 px map-colour halo (the plate pass adds it). Only the outer start gives way, 9 px clear
    // of any take-off arrowhead, so a dash never touches an arrow
    const heads = [...(g + gp).matchAll(/<path class="arw"[^>]* d="([^"]+)"/g)].map(m => { const v = (m[1].match(/-?[\d.]+/g) || []).map(Number), xs = v.filter((_, k) => k % 2 === 0), ys = v.filter((_, k) => k % 2 === 1); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; });
    GAPP.forEach(([ax, ay, bx, by, col], i) => { const L = Math.hypot(bx - ax, by - ay) || 1, n = Math.ceil(L * 2);
      let f0 = 0; for (let k = 0; k <= n; k++) { const f = k / n; if (heads.some(q => ptBox(ax + (bx - ax) * f, ay + (by - ay) * f, q) < 9)) f0 = (k + 1) / n; }
      g = g.replace(`<!--gapp${i}-->`, f0 < 1 ? `<path class="gapp" data-l="${ax.toFixed(1)} ${ay.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}" style="stroke:${col};stroke-dashoffset:${(-f0 * L).toFixed(1)}" d="M${(ax + (bx - ax) * f0).toFixed(1)} ${(ay + (by - ay) * f0).toFixed(1)}L${bx.toFixed(1)} ${by.toFixed(1)}"/>` : ''); }); }
  g += gp; // plates on top
  el.innerHTML = `<svg width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}" aria-hidden="true" class="${od === 25 ? 'w' : 'e'}${nbm ? ' nb' : ''}"><defs><clipPath id="mclip"><rect x="0" y="0" width="${W}" height="${Math.max(0, KB ? KB[1] + 6 : Hh)}"/></clipPath><filter id="mblur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8"/></filter><mask id="medge" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${Hh}"><rect x="4" y="12" width="${Math.max(0, W - 16)}" height="${Math.max(0, (KB ? KB[1] + 6 : Hh) - 28)}" fill="#fff" filter="url(#mblur)"/></mask><linearGradient id="mfadeg" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="${Math.min(0.5, 72 / W).toFixed(3)}" stop-color="#fff" stop-opacity="1"/></linearGradient><mask id="mfade" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${Hh}"><rect x="0" y="0" width="${W}" height="${Hh}" fill="url(#mfadeg)"/></mask></defs><g clip-path="url(#mclip)">${g.replace(/<path class="(river|app)"/g, '<path mask="url(#medge)" class="$1"')}</g></svg>`; // the river and the landing paths fade out over ~24 px at the edges
}

function renderAll() {
  press($('tz'), $('tz').querySelector(`[data-v=${tz === 'UTC' ? 'utc' : 'local'}]`));
  renderUpdated(); renderRecord(); renderChange(); renderTimeline(); renderOD(); renderR18(); renderMap(); renderAlerts(); renderLiveRecord();
}
function zoom() { return parseFloat(document.body.style.zoom) || 1; }
const NARROW = matchMedia('(max-width: 899px)');
function fit() { // desktop: laid out at >= 1280 px wide, scaled to the window (up to the height that still fits one
  // screen, ~800 px); the page keeps its natural height and scrolls on tall windows. Phones: one column, no scaling
  const b = document.body;
  if (NARROW.matches) { b.style.zoom = ''; b.style.width = ''; }
  else { const z = Math.max(1, Math.min(1.5, innerWidth / 1280, innerHeight / 810)); b.style.zoom = z.toFixed(4); b.style.width = `${innerWidth / z}px`; }
  b.style.height = '';
  MAIN.style.setProperty('--rowh', '21px');
  { const ft = document.querySelector('.pfoot > span:first-child'), rc = document.querySelector('.c3d'); // the footer's second line starts under the flight-path card
    if (ft && rc && !NARROW.matches) ft.style.setProperty('--fc2', `${Math.max(0, (rc.getBoundingClientRect().left - ft.getBoundingClientRect().left) / (parseFloat(b.style.zoom) || 1)).toFixed(1)}px`); }
  if (!NARROW.matches) { // spread the spare height of a tall window over the grid rows, so nothing piles up under the footer
    const z = parseFloat(b.style.zoom) || 1, spare = innerHeight - b.getBoundingClientRect().height - 12 * z; /* the footer keeps >= 12 px to the window's bottom */
    if (spare > 0) MAIN.style.setProperty('--rowh', `${Math.min(24, 21 + spare / z / ROWS).toFixed(2)}px`); // a little air on a laptop; tall windows keep content-sized cards
    else if (spare < 0) MAIN.style.setProperty('--rowh', `${Math.max(20, 21 + spare / z / ROWS).toFixed(2)}px`); // a short window (1366 x 768): the cards give up to 1 px a row so the page stays one screen
  }
  placeReadout(); alignR18(); renderTimeline(); renderMap(); if ($('recdlg')?.open) renderRecord(); document.querySelectorAll('.seg').forEach(thumb);
}
function placeReadout() { // the 48 h card's header as in 3D: the title, then the readout on its line when it fits (a 420 px slot,
  // room for the longest readout and "Back to now"), the controls at the right; otherwise the readout is the second line
  const hd = document.querySelector('.tlc .hd'), ro = $('hdsel'), h2 = $('tlh'), zm = $('zoom'), card = document.querySelector('.tlc'); if (!hd || !ro || !h2 || !zm) return;
  const below = () => { if (ro.parentElement === hd) hd.after(ro); card.classList.remove('roinl'); };
  if (NARROW.matches) return below();
  if (ro.parentElement !== hd) h2.after(ro); card.classList.add('roinl');
  if ((zm.getBoundingClientRect().left - h2.getBoundingClientRect().right) / zoom() - 32 < 420) below();
}

// ---- layout: panels on a 24 x 30 grid; Layout mode drags them (move) or their corner (resize), the others make room
const COLS = 24, ROWS = 23, MAIN = document.querySelector('main'), GHOST = $('ghost');
const PANELS = { tl: ['Forecast', 13, 14], v3d: ['Map', 6, 9] }; // name, min w, min h (the accuracy card is the detail view, off the grid)
// the default: one hero across the top, the timeline and the paths map below it
const DEF = { tl: { x: 0, y: 0, w: 17, h: 23 }, v3d: { x: 17, y: 0, w: 7, h: 23 } }; // the 48 h chart about two thirds, the flight-path map a compact schematic in the right column
const CELL = {};
document.querySelectorAll('.cell').forEach(c => {
  const k = c.dataset.p, mv = document.createElement('div');
  mv.className = 'mv'; mv.innerHTML = `<b>${PANELS[k][0]}</b><i title="Drag to resize"></i>`; c.appendChild(mv); CELL[k] = c;
});
const clone = L => JSON.parse(JSON.stringify(L));
const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const fits = L => Object.entries(L).every(([k, r]) => r.x >= 0 && r.y >= 0 && r.x + r.w <= COLS && r.y + r.h <= ROWS
  && r.w >= PANELS[k][1] && r.h >= PANELS[k][2]);
function settle(L, k) { // the panel k keeps its place; every other one floats up as far as it can, below anything it would overlap
  const ids = Object.keys(L).sort((a, b) => (a === k ? -1 : b === k ? 1 : 0) || L[a].y - L[b].y || L[a].x - L[b].x), done = [];
  for (const id of ids) {
    const r = L[id];
    if (id !== k) {
      while (r.y > 0 && !done.some(o => hit({ ...r, y: r.y - 1 }, o))) r.y--;
      for (let o; (o = done.find(d => hit(r, d)));) r.y = o.y + o.h;
    }
    done.push(r);
  }
  return L;
}
const HZ = ['x', 'w', 'y', 'h', 1], VT = ['y', 'h', 'x', 'w', 2];
const overlaps = L => Object.keys(L).some((a, i, ks) => ks.slice(i + 1).some(b => hit(L[a], L[b])));
function pushEdge(T, id, d, A) { // the far edge of T[id] moved by d (T[id] already resized): the panels touching that edge give way
  const [p, s, q, u, mi] = A, r = T[id], edge = r[p] + r[s] - d;
  for (const [o, n] of Object.entries(T)) {
    if (o === id || n[p] !== edge || !(n[q] < r[q] + r[u] && r[q] < n[q] + n[u])) continue;
    if (d > 0) {
      n[p] += d;
      if (n[s] - d >= PANELS[o][mi]) n[s] -= d; else pushEdge(T, o, d, A); // too small to shrink: it slides, the next one shrinks
    } else {
      const g = { ...n, [p]: n[p] + d, [s]: n[s] - d }; // grow into the freed space, if nothing else is there
      if (!Object.entries(T).some(([o2, m]) => o2 !== o && hit(g, m))) T[o] = g;
    }
  }
}
function loadLay() {
  try {
    const L = JSON.parse(store.get('fra-layout32') || 'null');
    if (L && Object.keys(PANELS).every(k => L[k] && ['x', 'y', 'w', 'h'].every(q => Number.isInteger(L[k][q])))
      && fits(L) && !overlaps(L)) return L;
  } catch {}
  return clone(DEF);
}
let LAY = loadLay();
const custom = () => JSON.stringify(LAY) !== JSON.stringify(DEF);
const area = r => `${r.y + 1} / ${r.x + 1} / span ${r.h} / span ${r.w}`;
let reflowQ = 0;
function applyLay() {
  for (const k in LAY) CELL[k].style.gridArea = area(LAY[k]);
  cancelAnimationFrame(reflowQ);
  reflowQ = requestAnimationFrame(() => { renderTimeline(); renderMap(); document.querySelectorAll('.seg').forEach(thumb); });
}
function gridStep() { // CSS px per column / row (the page is zoomed: pointer deltas are divided by zoom())
  const cs = getComputedStyle(MAIN);
  return [(MAIN.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) / COLS,
    (MAIN.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)) / ROWS];
}
MAIN.addEventListener('pointerdown', e => {
  const mv = e.target.closest('.mv'); if (!mv || e.button) return;
  e.preventDefault(); mv.setPointerCapture(e.pointerId);
  const c = mv.parentElement, k = c.dataset.p, sizing = e.target.tagName === 'I', start = clone(LAY), s = start[k];
  const [cw, rh] = gridStep(), z = zoom(), x0 = e.clientX, y0 = e.clientY, mr = MAIN.getBoundingClientRect(),
    cs = getComputedStyle(MAIN), pl = parseFloat(cs.paddingLeft), pt = parseFloat(cs.paddingTop);
  document.body.classList.add('rzing'); c.classList.add('lift'); GHOST.style.gridArea = area(s);
  const move = ev => {
    const dx = (ev.clientX - x0) / z, dy = (ev.clientY - y0) / z; let T = clone(start); const r = T[k];
    let ok = false;
    if (sizing) { // neighbours shrink (or slide) to make room; a smaller panel hands its space to them
      const w = Math.max(PANELS[k][1], Math.min(COLS - r.x, Math.round(s.w + dx / cw)));
      const h = Math.max(PANELS[k][2], Math.min(ROWS - r.y, Math.round(s.h + dy / rh)));
      if (w !== s.w) { r.w = w; pushEdge(T, k, w - s.w, HZ); }
      if (h !== s.h) { r.h = h; pushEdge(T, k, h - s.h, VT); }
      ok = fits(T) && !overlaps(T);
    } else { // room below: the others move down; no room: swap places with the panel under the pointer
      r.x = Math.max(0, Math.min(COLS - r.w, Math.round(s.x + dx / cw)));
      r.y = Math.max(0, Math.min(ROWS - r.h, Math.round(s.y + dy / rh)));
      settle(T, k); ok = fits(T);
      if (!ok) {
        const gx = Math.floor(((ev.clientX - mr.left) / z - pl) / cw), gy = Math.floor(((ev.clientY - mr.top) / z - pt) / rh);
        const o = Object.keys(start).find(id => id !== k && hit({ x: gx, y: gy, w: 1, h: 1 }, start[id]));
        if (o) { const S = clone(start); S[k] = { ...start[o] }; S[o] = { ...start[k] }; if (fits(S)) { T = S; ok = true; } }
      }
    }
    if (ok) { LAY = T; applyLay(); GHOST.style.gridArea = area(LAY[k]); }
    // the lifted panel follows the pointer; the dashed ghost shows where it lands
    if (!sizing) c.style.transform = `translate(${dx - (LAY[k].x - s.x) * cw}px,${dy - (LAY[k].y - s.y) * rh}px)`;
  };
  const up = () => {
    mv.removeEventListener('pointermove', move); mv.removeEventListener('pointerup', up); mv.removeEventListener('pointercancel', up);
    c.style.transform = ''; c.classList.remove('lift'); document.body.classList.remove('rzing');
    const T = settle(clone(LAY), null); if (fits(T)) LAY = T;
    applyLay(); store.set('fra-layout32', JSON.stringify(LAY)); $('rzreset').hidden = !custom();
  };
  mv.addEventListener('pointermove', move); mv.addEventListener('pointerup', up); mv.addEventListener('pointercancel', up);
});
function setEdit(on) {
  document.body.classList.toggle('edit', on);
  $('rzbtn').setAttribute('aria-pressed', on); $('rzbtn').querySelector('span').textContent = on ? 'Done' : 'Edit layout';
  $('rzreset').hidden = !on || !custom();
}
{ // theme switch: auto -> dark -> light
  const cur = () => document.documentElement.dataset.theme || 'auto', dark = () => cur() === 'dark' || (cur() === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  const show = () => { $('open3d').href = `airport3d.html?run=${encodeURIComponent(D.run)}${cur() !== 'auto' ? `&theme=${cur()}` : matchMedia('(prefers-color-scheme: dark)').matches ? '&theme=dark' : '&theme=light'}`; };
  $('theme').onclick = () => { const n = dark() ? 'light' : 'dark'; document.documentElement.dataset.theme = n; store.set('fra-theme', n); show(); };
  $('rzbtn').hidden = !new URLSearchParams(location.search).has('edit'); // the layout editor stays, behind ?edit
  setTimeout(show);
}
$('rzbtn').onclick = () => setEdit(!document.body.classList.contains('edit'));
$('rzreset').onclick = () => { LAY = clone(DEF); store.set('fra-layout32', ''); applyLay(); setEdit(true); };
addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('edit')) setEdit(false); });
applyLay();
addEventListener('resize', fit);
try { document.fonts.ready.then(() => { alignR18(); renderMap(); placeR18(); }); } catch {} // again once the web font is in: the metrics change
setPlaying(0);
renderAll();
fit();
requestAnimationFrame(() => document.querySelectorAll('.seg').forEach(s => s.classList.add('on')));
if (location.protocol.startsWith('http')) { pollLive(); setInterval(pollLive, 30000); pollOps(); setInterval(pollOps, 60000); }
"""

PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dashboard · FRA Runway Direction Forecast</title>__META__
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<script>try{const q=new URLSearchParams(location.search).get('theme'),t=['dark','light'].includes(q)?q:localStorage.getItem('fra-theme');document.documentElement.dataset.theme=t||'light'}catch{document.documentElement.dataset.theme='light'}</script>
<style>__BASE____CSS__</style></head><body>
__BAR__
<section class="lede" aria-label="Summary">
  <div class="lede-l">
  <div class="eyebrow" id="eyebrow">Runway direction now</div>
  <h1 class="headline" id="answer"></h1>
  <p class="subhead" id="subhead"></p>
  <p class="trust" id="trust"></p>
  <p class="disagree" id="disagree" hidden></p>
  </div>
  <i class="ldiv" aria-hidden="true"></i>
  <aside class="r18h" id="r18h" aria-label="Runway 18"></aside>
</section>
<main>
  <div class="cell" data-p="tl">
    <section class="card tlc" aria-label="Next 48 hours">
      <div class="hd">
        <h2 id="tlh">Forecast</h2>
        <button class="btn" id="play" hidden></button>
        <div class="seg" id="zoom" role="group" aria-label="Zoom"><i></i><button data-v="12">12 h</button><button data-v="24">24 h</button><button data-v="48" aria-pressed="true">48 h</button></div>
      </div>
      <div class="readout" id="hdsel" aria-live="polite"><span class="tag" id="odtag" hidden>Now</span><span class="ro" id="oduse"></span><button class="rback" id="back" style="visibility:hidden">Back to now</button></div>
      <div class="tl" id="tl">
        <div class="hl" style="grid-row:3">Direction<small id="dirkey">__SW07__07</small></div>
        <div class="hl" style="grid-row:4" id="hlsw">__T_switch__<small>__T_per_hour__</small></div>
        <div class="hl" style="grid-row:5" id="hl18">Runway 18</div>
        <div class="hl" style="grid-row:6" title="The official rule switches direction when the tailwind stays above 1 kt for more than 30 minutes, or at once from 10 kt">Headwind (kt)</div>
        <div class="lanes" id="lanes" tabindex="0" role="slider" aria-label="Forecast hour" aria-valuemin="0" aria-valuemax="48"
          title="Hover to preview an hour, click or drag to hold it. Left and right arrows step 1 h, or 6 h with Shift. Up and down arrows jump to the previous or next event. Esc goes back to now.">
          <div class="bands nbands" id="nbands"></div><div class="bands" id="bands"></div><div class="mids" id="mids"></div>
          <div class="ruler" id="ruler"></div>
          <div class="ev" id="ev"></div>
          <div class="ln lod" id="lod"></div>
          <div class="ln lpg" id="lpg"></div>
          <div class="ln l18" id="l18"></div>
          <div class="ln lwd" id="lwd"></div>
          <div class="ph" id="ph" hidden><b id="phl"></b></div>
        </div>
      </div>
      <div class="tlf" id="tlf"></div>
      <div class="hero tfoot" aria-label="Conditions now">
        <div hidden><div id="chgval"></div><div id="chgfoot"></div></div>
        <div hidden><span id="odnum"></span><span id="odword"></span><div id="oddesc"></div></div>
      </div>
    </section>
  </div>
  <div class="cell" data-p="v3d">
    <section class="card c3d" aria-label="Landing and take-off paths">
      <div class="mhd"><div class="lbl">Flight paths<small id="mapwhen">now</small></div><a class="m3d" id="open3d" href="airport3d.html" title="The airport in 3D at this forecast"><span class="u">Open in 3D</span><svg class="tarr" viewBox="0 0 34 24" aria-hidden="true"><path d="M3 12h27M22 4l8 8-8 8"/></svg></a></div>
      <p class="mif" id="mapif" hidden></p>
      <div class="map" id="map" role="img" aria-label="Map of the landing and take-off paths at the shown hour"></div>
      <div class="mlg"><span><svg viewBox="0 0 22 10"><path d="M1 5h20" stroke="var(--east)" stroke-width="2.5" stroke-dasharray="6 4" id="mlgapp"/></svg>Landings</span>
        <span><svg viewBox="0 0 22 10"><path d="M1 5h20" stroke="var(--ink)" stroke-width="1.75"/></svg>Take-offs</span>
        <span id="mlggh" hidden><svg viewBox="0 0 22 10"><path d="M1 5h20" stroke="var(--west-line)" stroke-width="2" stroke-dasharray="6 4" opacity=".85"/></svg>West (if switched)</span>
        <span class="mlgt" id="mlgtowns"></span>
        <span class="mscl" id="mscl"></span>
</div>
    </section>
  </div>
  <div class="ghost" id="ghost"></div>
</main>
<dialog class="recdlg" id="recdlg" aria-label="How reliable is this?">
  <section class="card pc rec" aria-label="How reliable is this?" id="rec"></section>
</dialog>
<p class="trust trustph" id="trustph"></p>
<footer class="pfoot"><span>__FOOTER_LINES__</span>
  <button class="btn" id="rzreset" hidden title="Back to the default layout">Reset</button>
  <button class="btn" id="rzbtn" aria-pressed="false" title="Rearrange the panels: drag a panel to move it, or its corner to resize it. Esc when done."><span>Edit layout</span></button></footer>
<div class="howpop" id="howpop" hidden>Our forecast blends two models trained on the directions actually flown at Frankfurt over the last 120 days; one of them runs 200 wind scenarios around the ECMWF and ICON forecasts. Calibrated out of sample and tested hour by hour on Jun to Oct 2026. INAA is the official operating-direction forecast published by the Umwelthaus. The live record since 1 Nov is only a few days long, too short to judge yet.</div>
<script type="application/json" id="data">__DATA__</script>
<script>const ICON = __ICONS__, T = __COPY__, ST = __STYLE__;
__JS__</script>
</body></html>
"""

BAR_RIGHT = ('<span class="upd" id="upd" aria-live="polite"></span>'

             '<button class="icon thm" id="theme" title="Light / dark theme" aria-label="Light / dark theme"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg></button>'
             '<div class="seg" id="tz" role="group" aria-label="Time zone"><i></i><button data-v="local" id="tzl">Local</button><button data-v="utc">UTC</button></div>')


def backtest_months(d):
    """Length of the walk-forward backtest in months (None when unknown), for the footer's backtest line."""
    days = (((d or {}).get("quality") or {}).get("test_info") or {}).get("days")
    return round(days / 30.4) if days else None


def page(d):
    """The dashboard HTML for a payload() dict."""
    sw = lambda c: f'<i class="sw" style="background:var(--{c})"></i>'
    html = (PAGE.replace("__ISSUE__", pd.Timestamp(d["issue"]).strftime("%Y-%m-%d %H:%M UTC"))
            .replace("__META__", siteui.meta("Dashboard · FRA Runway Direction Forecast")).replace("__FOOTER_LINES__", " ".join(f'<span class="fl">{t}</span>' for t in siteui.footer_lines(backtest_months(d))))
            .replace("__BASE__", siteui.BASE_CSS).replace("__CSS__", CSS + "@media (min-width:900px){" + siteui.header_css(dict(bar=".topbar", brand=".brand", nav=".topbar .nav", icon=".topbar .icon", seg="#tz", upd=".upd", pill_bg="var(--card)", pill_sh="0 1px 2px rgba(20,20,22,.08),0 0 0 1px rgba(20,20,22,.05)", pill_ink="var(--ink)")) + ".topbar{margin-bottom:0}}")
            .replace("__BAR__", siteui.bar("forecast", BAR_RIGHT)).replace("__LAYOUT__", ICONS["layout"])
            .replace("__SW25__", sw("west")).replace("__SW07__", sw("east")).replace("__EXPAND__", ICONS["expand"])
            .replace("__ICONS__", json.dumps(ICONS)).replace("__COPY__", json.dumps(siteui.COPY)).replace("__STYLE__", json.dumps(siteui.STYLE)).replace("__T_switch__", siteui.COPY["switch"]).replace("__T_town__", siteui.COPY["town"]).replace("__T_per_hour__", siteui.COPY["per_hour"])
            .replace("__DATA__", json.dumps(d, separators=(",", ":")).replace("</", "<\\/"))
            .replace("__JS__", JS))
    return siteui.snap_type(html)


def write_atomic(path, text):
    tmp = path.with_name(f".{path.name}.tmp")
    tmp.write_text(text, encoding="utf-8")
    tmp.replace(path)  # a browser polling the site never reads a half-written page


def render_3d(path, months=None):
    """site/airport3d.html. A forecast issued by fra.archive is embedded together with the hackathon runs
    (data/forecast_*.csv) and the newest RUNS_3D issued runs, each with run_hours() wind; same page as
    fra.scene3d.render, which only knows data/forecast_*.csv."""
    path = Path(path)
    cache = DATA / "scene3d.json"
    if path.parent.resolve() != ISSUED.resolve() or not cache.exists() or not scene3d.BUNDLE.exists():
        return scene3d.render(path)
    files = {p.name: p for p in sorted(DATA.glob("forecast_*.csv"))}
    files.update({p.name: p for p in sorted(ISSUED.glob("forecast_*.csv"))[-RUNS_3D:]})
    files[path.name] = path
    runs = sorted((run_hours(p) for p in files.values()), key=lambda r: r["issue"])
    for r in runs:  # the official prognosis for the default run, so the 3D view can show where it disagrees
        if r["source"] != path.name:
            continue
        pg = published_prognosis(pd.Timestamp(r["issue"]), [pd.Timestamp(h["t"]) for h in r["hours"]])
        if pg:
            for h, w, pr in zip(r["hours"], pg["west"], pg["prob"]):
                if pd.notna(w):
                    h["pg"], h["pgp"] = round(float(w), 2), round(float(pr), 2)
    fcj = dict(default=path.name, runs=runs)
    html = (scene3d.PAGE.replace("__SCENE__", cache.read_text().strip())
            .replace("__FORECAST__", json.dumps(fcj, separators=(",", ":")))
            .replace("__COPY__", json.dumps(siteui.COPY, separators=(",", ":")))
            .replace("__META__", siteui.meta("3D view · FRA Runway Direction Forecast"))
            .replace("__STYLE__", json.dumps(dict(siteui.STYLE, footer_lines=list(siteui.footer_lines(months))), separators=(",", ":")))
            .replace("__BUNDLE__", scene3d.BUNDLE.read_text().replace("</script", "<\\/script")))
    out = SITE / "airport3d.html"
    write_atomic(out, siteui.snap_type(html))
    print(f"wrote {out} ({len(html) / 1e6:.1f} MB), default run {path.name}, {len(runs)} runs")
    return out


def render(path):
    path = Path(path)
    d = payload(path)
    SITE.mkdir(exist_ok=True)
    out = SITE / "index.html"
    write_atomic(out, page(d))
    og = ROOT / "assets" / "screenshots" / "dashboard.png"
    if og.exists():  # the share image, next to the pages so a relative og:image works wherever site/ is served
        (SITE / "og.png").write_bytes(og.read_bytes())
    try:
        out3d = render_3d(path, backtest_months(d))
        if out3d:  # the same backtest numbers as the dashboard, for the 3D view's track-record line
            h = Path(out3d).read_text(encoding="utf-8")
            q = json.dumps(dict(quality=d.get("quality")), separators=(",", ":")).replace("</", "<\\/")
            write_atomic(Path(out3d), h.replace("<script>window.FRA_SCENE=", f"<script>window.FRA_QUALITY={q}.quality;window.FRA_SINCE={json.dumps(d.get('since'))};window.FRA_PGWIN={json.dumps(dict(run=d.get('run'), win=d.get('pgwin') or []))};window.FRA_TRAFFIC={json.dumps(d.get('traffic'))};window.FRA_SCENE=", 1))
    except (SystemExit, Exception) as e:  # the 3D view needs the data/osm cache + web bundle
        print(f"3D view not rebuilt: {e}")
    return out, d

if __name__ == "__main__":
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else newest_forecast()
    out, d = render(src)
    ch = "none within 48 h" if d["change"] is None else d["change"]["t"]
    print(f"wrote {out} from {src.name} (issued {d['issue']}, OD {d['od_now']:02d}, next change: {ch})")
