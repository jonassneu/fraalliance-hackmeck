"""Planning alerts from the latest issued forecast -> site/alerts.json, plus a desktop notification (notify-send)
when an alert newly appears. No e-mail, nothing posted anywhere.

    uv run python -m fra.alerts [forecast_csv] [--no-notify]     (default: newest data/archive/issued/forecast_*.csv)

Alerts and thresholds (fixed here; they were NOT tuned on the live record / holdout):
- "od_switch": an operating-direction change is predicted to start within SWITCH_H = 12 h. The change time is the
  next-change rule of fra.changetime as stored in the issued forecast (next_change_utc: first hour where P(other OD)
  >= 0.5 and stays >= 0.4 for 3 h; tuned walk-forward 15 Sep - 30 Oct 2026: 73 % of actual changes caught within
  +-3 h, event accuracy 80 % vs 60 % for the official rules). Level "warning" if it starts within SOON_H = 6 h, else
  "watch". The alert also carries P(change within 48 h) and the likely window.
  Check of the 0.5 entry threshold within 12 h on the out-of-fold walk-forward predictions 1 Jun - 30 Oct 2026
  (experiments/eval_long/preds_cv.parquet, leads 1/2/3/6/9/12, 3,637 issue times, 20 % with a sustained change
  within 12 h): the alert is up for 17.9 % of issue times, a sustained change follows within 15 h in 92.8 % of
  them, and 77 % of the changes within 12 h are alerted (72 % of those 6-12 h ahead). Entry 0.4: 89 % / 80 %;
  0.6: 94 % / 72 %; 0.7: 96 % / 63 %. (The 3 h persistence of the rule removes a few more one-hour blips.)
- "rwy18": Runway 18 West closure risk, min P(open) < R18_P = 0.8 within the next R18_H = 24 h: the warning level
  of the separate RWY 18 study (Sep 2025 - Oct 2026: ~50 % of closure hours flagged,
  ~1 false alarm per 1,000 h). Jun - Oct 2026 out of fold (leads <= 24) holds only 2 closure hours, both isolated
  non-wind hours that neither the model nor the official rule saw coming; 1 false alarm in 20,514 open rows.
Freshness: alerts are evaluated at the current time, not at the issue time. Alert hours that already passed are
dropped and lead_h counts from now. If the newest issued forecast is older than STALE_H = 2 h (the hourly issue
failed), no alerts are raised from it: alerts.json carries stale=true and a message, nothing is notified and the
alert state is left untouched.
Notification rule: only when an alert key (od_switch:<from>-<to>, rwy18) was not active in the previous run and was
not notified in the last RENOTIFY_H = 3 h (no flapping). State: data/archive/alerts_state.json, written only by
notifying runs (the systemd job); `--no-notify` runs never touch it, so they cannot swallow a notification.
Operations check (not a planning alert, not shown on the site): official forecast hours of the last COVERAGE_H = 48 h
that were never issued (job not running: e.g. no user session without systemd lingering, or a failed issue step).
They are holes in the live record / holdout forever; each new gap is notified once (key coverage:<last missing hour>)
and listed in alerts.json under "ops".
"""

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
ARCHIVE = ROOT / "data" / "archive"
ISSUED = ARCHIVE / "issued"
STATE = ARCHIVE / "alerts_state.json"
OUT = ROOT / "site" / "alerts.json"

SWITCH_H, SOON_H = 12, 6
R18_H, R18_P = 24, 0.8
RENOTIFY_H = 3
STALE_H = 2
COVERAGE_H = 48
TZ = "Europe/Berlin"


def two(od):
    return "25" if int(od) == 25 else "07"


def local(t):
    return pd.Timestamp(t).tz_convert(TZ).strftime("%a %H:%M")


def iso(t):
    return None if t is None or pd.isna(t) else pd.Timestamp(t).tz_convert("UTC").isoformat()


def newest_issued():
    files = sorted(ISSUED.glob("forecast_*.csv"))
    return files[-1] if files else None


def load(path):
    f = pd.read_csv(path)
    f["valid_utc"] = pd.to_datetime(f["valid_utc"], utc=True, format="ISO8601")
    f = f.sort_values("valid_utc").reset_index(drop=True)
    issue = (pd.to_datetime(f["issue_utc"].iloc[0], utc=True) if "issue_utc" in f
             else f["valid_utc"].iloc[0] - pd.Timedelta(hours=1))
    return f, issue


def change_info(f):
    """(next change time or None, window start, window end, P(change in 48 h)) as issued; recomputed with
    fra.changetime.next_change for forecast files without these columns."""
    od_now = int(f["od_now"].iloc[0])
    if "next_change_utc" in f:
        g = lambda c: pd.to_datetime(f[c].iloc[0], utc=True) if c in f and pd.notna(f[c].iloc[0]) else None
        p = float(f["p_change_48h"].iloc[0]) if "p_change_48h" in f and pd.notna(f["p_change_48h"].iloc[0]) else None
        return g("next_change_utc"), g("change_window_start"), g("change_window_end"), p
    from fra.changetime import next_change
    t, info = next_change(f["valid_utc"], f["p_od25"].values, od_now)
    return t, info.get("window_start"), info.get("window_end"), info.get("p_change_48h")


def compute(path, now=None):
    f, issue = load(path)
    now = pd.Timestamp(now) if now is not None else pd.Timestamp.now("UTC")
    age_h = (now - issue) / pd.Timedelta(hours=1)
    od_now = int(f["od_now"].iloc[0])
    to = 7 if od_now == 25 else 25
    p_other = np.where(od_now == 25, 1 - f["p_od25"].values, f["p_od25"].values)
    lead = ((f["valid_utc"] - issue) / pd.Timedelta(hours=1)).round().astype(int).values
    ahead = (f["valid_utc"] + pd.Timedelta(hours=1) > now).values  # valid hour not over yet
    hrs = lambda t: max(0, int(round((pd.Timestamp(t) - now) / pd.Timedelta(hours=1))))  # lead from NOW
    base = dict(generated=iso(now), issue=iso(issue), source=Path(path).name, od_now=od_now, age_h=round(age_h, 2),
                thresholds=dict(switch_within_h=SWITCH_H, switch_warning_within_h=SOON_H,
                                switch_rule=("the next change as issued with the forecast (fra.changetime "
                                             "hysteresis rule of the issuing variant)"),
                                rwy18_p_open_below=R18_P, rwy18_within_h=R18_H, stale_after_h=STALE_H))
    if age_h > STALE_H:
        return dict(base, stale=True, alerts=[],
                    message=(f"No current forecast: the newest one was issued {local(issue)} local "
                             f"({age_h:.0f} h ago). Alerts are paused until a new forecast is issued."))
    alerts = []
    t, ws, we, p48 = change_info(f)
    if t is not None and t + pd.Timedelta(hours=1) > now:  # a change hour that is already over is no alert
        lt = int(round((t - issue) / pd.Timedelta(hours=1)))  # threshold on the issue lead (as calibrated)
        if lt <= SWITCH_H:
            i = int(np.flatnonzero(lead == lt)[0]) if (lead == lt).any() else 0
            ln = hrs(t)
            soon = ln <= SOON_H
            when = f"in {ln} h" if ln else "this hour"
            win = f", likely between {local(ws)} and {local(pd.Timestamp(we) + pd.Timedelta(hours=1))}" if ws is not None and we is not None else ""
            alerts.append(dict(
                key=f"od_switch:{two(od_now)}-{two(to)}", kind="od_switch", level="warning" if soon else "watch",
                title=f"OD switch likely within {SOON_H if soon else SWITCH_H} h: {two(od_now)} → {two(to)}",
                text=(f"Change from OD {two(od_now)} to OD {two(to)} expected around {local(t)} local ({when}){win}. "
                      f"P(OD {two(to)}) at that hour {p_other[i]:.0%}, P(any change within 48 h) "
                      f"{(p48 if p48 is not None else float('nan')):.0%}."),
                t=iso(t), start=iso(ws), end=iso(we), lead_h=ln, issue_lead_h=lt, p=round(float(p_other[i]), 3),
                p_change_48h=None if p48 is None else round(float(p48), 3), od_from=od_now, od_to=to))
    p18 = f["p_rwy18_open"].values
    risk = np.flatnonzero((lead <= R18_H) & (p18 < R18_P) & ahead)
    if len(risk):
        a, b = risk[0], risk[-1]
        lo = int(np.argmin(np.where((lead <= R18_H) & ahead, p18, 9)))
        level = "warning" if p18[lo] < 0.5 else "watch"
        alerts.append(dict(
            key="rwy18", kind="rwy18", level=level,
            title=f"Runway 18 West closure risk {local(f['valid_utc'].iloc[a])}–"
                  f"{local(f['valid_utc'].iloc[b] + pd.Timedelta(hours=1))}",
            text=(f"P(Runway 18 usable) below {R18_P:.0%} in {len(risk)} of the next {R18_H} h, lowest {p18[lo]:.0%} at "
                  f"{local(f['valid_utc'].iloc[lo])} local; departures would move to the Centre runway."),
            start=iso(f["valid_utc"].iloc[a]), end=iso(f["valid_utc"].iloc[b]), hours=int(len(risk)),
            p_min=round(float(p18[lo]), 3), t=iso(f["valid_utc"].iloc[lo]), lead_h=hrs(f["valid_utc"].iloc[a])))
    return dict(base, stale=False, alerts=alerts)


def notify(alert):
    exe = shutil.which("notify-send")
    if not exe:
        return "notify-send not available"
    env = dict(os.environ)
    env.setdefault("DBUS_SESSION_BUS_ADDRESS", f"unix:path=/run/user/{os.getuid()}/bus")
    r = subprocess.run([exe, "-a", "FRA runway forecast", "-u", "critical" if alert["level"] == "warning" else "normal",
                        "-i", "dialog-warning", alert["title"], alert["text"]], env=env, capture_output=True, text=True,
                       timeout=15)
    return "sent" if r.returncode == 0 else f"notify-send failed: {(r.stderr or '').strip()[:120]}"


def coverage_gap(now):
    """Official issue hours of the last COVERAGE_H h (from the first issued forecast on) without a forecast file. The
    current hour is checked from :45 on (the job runs at :30)."""
    issued = sorted(pd.Timestamp(p.stem.split("_")[1], tz="UTC") for p in ISSUED.glob("forecast_*.csv"))
    if not issued:
        return None
    hi = (now - pd.Timedelta(minutes=45)).floor("h")
    lo = max(issued[0], hi - pd.Timedelta(hours=COVERAGE_H - 1))
    exp = pd.date_range(lo, hi, freq="h") if hi >= lo else pd.DatetimeIndex([], tz="UTC")
    miss = exp.difference(pd.DatetimeIndex(issued))
    return dict(window_h=COVERAGE_H, expected=int(len(exp)), missing=int(len(miss)),
                missing_hours=[iso(t) for t in miss[-24:]], last_missing=iso(miss[-1]) if len(miss) else None)


def update(path=None, send=True):
    path = Path(path) if path else newest_issued()
    if path is None:
        print("no issued forecast yet (data/archive/issued/) - nothing to alert on")
        return None
    now = pd.Timestamp.now("UTC")
    rec = compute(path, now)
    try:
        state = json.loads(STATE.read_text())
    except (OSError, ValueError):  # first run or a damaged file: start clean
        state = {"active": {}, "notified": {}}
    prev = set(state.get("active", {}))
    active = {}
    for a in rec["alerts"]:
        k = a["key"]
        active[k] = state.get("active", {}).get(k, iso(now))  # first seen
        a["since"] = active[k]
        last = state.get("notified", {}).get(k)
        recent = last is not None and now - pd.Timestamp(last) < pd.Timedelta(hours=RENOTIFY_H)
        a["new"] = k not in prev
        if a["new"] and not recent and send:
            a["notify"] = notify(a)
            if a["notify"] == "sent":
                state.setdefault("notified", {})[k] = iso(now)
    state["active"] = active
    state["issue"] = rec["issue"]
    ops_sent = False
    try:
        gap = coverage_gap(now)
    except Exception as ex:
        gap = dict(error=f"{type(ex).__name__}: {str(ex)[:120]}")
    rec["ops"] = dict(coverage=gap)
    if gap and gap.get("missing") and send:
        k = f"coverage:{gap['last_missing']}"
        if k not in state.get("notified", {}):
            gap["notify"] = notify(dict(level="warning", title=f"FRA forecast: {gap['missing']} hour(s) not issued",
                                        text=f"no official forecast for {', '.join(local(t) for t in gap['missing_hours'][-4:])}"
                                             " (job not running?). These hours stay missing in the live record."))
            if gap["notify"] == "sent":
                state.setdefault("notified", {})[k] = iso(now)
                ops_sent = True
    # the state is the notifier's memory: only a notifying run with a current forecast may update it (a --no-notify
    # run would mark a new alert as seen and the next systemd run would never notify it; a stale forecast says
    # nothing about which alerts are active)
    outs = [(OUT, json.dumps(rec, indent=1))] + ([(STATE, json.dumps(state, indent=1))]
                                                 if send and (not rec["stale"] or ops_sent) else [])
    for p, blob in outs:
        p.parent.mkdir(parents=True, exist_ok=True)
        tmp = p.with_name(f".{p.name}.{os.getpid()}.tmp")
        tmp.write_text(blob)
        os.replace(tmp, p)
    return rec


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    rec = update(args[0] if args else None, send="--no-notify" not in sys.argv)
    if rec is None:
        return
    if rec.get("stale"):
        print(f"STALE: {rec['message']}; wrote {OUT}")
    elif not rec["alerts"]:
        print(f"no alerts (forecast issued {rec['issue']}, OD {two(rec['od_now'])}); wrote {OUT}")
    for a in rec["alerts"]:
        print(f"[{a['level']}] {a['title']} | {a['text']} | new={a['new']} notify={a.get('notify', '-')}")


if __name__ == "__main__":
    main()
