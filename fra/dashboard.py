"""Jury dashboard "Runway Operations" -> site/index.html (plus site/model.html via fra.modelpage and the 3D view site/airport3d.html via fra.scene3d).

    uv run python -m fra.dashboard [forecast_csv]      (default: newest data/forecast_*.csv)

Built for the duty planner, laid out as one laptop screen in a quiet Apple-style look (fra.siteui): one summary
surface on top (operating direction, next direction change, Runway 18 West), the 48 h timeline below with our
forecast, the published Umwelthaus prognosis, Runway 18 and wind as lanes, and the 3D airport (airport3d.html, an
iframe) next to it. Hovering the timeline previews an hour, a click or drag holds it; the summary and the 3D view
follow the shown hour. Keys: arrows step / jump between events, Space plays, Esc returns to now.
Self-contained page (inline CSS + JS, data as JSON); times are rendered client-side so the Local/UTC switch works
offline.
"""

import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd

from fra import modelpage, prognosis, scene3d, siteui

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
SITE = ROOT / "site"


# ---------------------------------------------------------------- data

def newest_forecast():
    files = sorted(DATA.glob("forecast_*.csv"), key=lambda p: p.stat().st_mtime)
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


def in_use_since(issue, od_now):
    """Start of the current flown operating direction (INAA radar labels), None if the labels are stale."""
    p = DATA / "labels.parquet"
    if not p.exists():
        return None
    lab = pd.read_parquet(p)["od"].dropna()
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


def quality():
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
    P(west) per valid hour (1 = OD 25, 0 = OD 07, 0.5 = mixed) and the stated probability. None if unavailable."""
    try:
        arch = pd.read_parquet(prognosis.ARCHIVE)
    except Exception:
        return None
    asof = arch.loc[arch["asof"] <= issue, "asof"].max()
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


def payload(path):
    f = load_forecast(path)
    run = scene3d.forecast_payload(Path(path))  # hourly p25 / p18 / od / rule + ECMWF IFS wind
    issue = pd.Timestamp(run["issue"])
    od_now = int(f["od_now"].iloc[0]) if "od_now" in f and pd.notna(f["od_now"].iloc[0]) else int(f["od_pred"].iloc[0])
    t, ws, we, p_change = next_change(f, od_now)
    p6 = f["p_od25"].values[:6]
    conf6 = np.maximum(p6, 1 - p6).mean()  # how sure the model is about the direction it predicts
    hours = run["hours"]
    pg = published_prognosis(issue, [pd.Timestamp(h["t"]) for h in hours])
    if pg:
        for h, w, pr in zip(hours, pg["west"], pg["prob"]):
            if pd.notna(w):
                h["pg"], h["pgp"] = round(float(w), 2), round(float(pr), 2)
    return dict(run=Path(path).name, issue=iso(issue), wind_init=iso(pd.Timestamp(run["wind_init"]))
                if run.get("wind_init") else None, generated=iso(pd.Timestamp.now("UTC")),
                od_now=od_now, since=iso(in_use_since(issue, od_now)), conf6=round(float(conf6), 3),
                change=None if t is None else dict(t=iso(t), start=iso(ws), end=iso(we)), p_change=p_change,
                hours=hours, quality=quality(), prog_asof=iso(pg["asof"]) if pg else None, traffic=traffic())


# ---------------------------------------------------------------- page

ICONS = dict(
    up='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V5M6 11l6-6 6 6"/></svg>',
    play='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.6v14.8a1 1 0 0 0 1.52.85l12.1-7.4a1 1 0 0 0 0-1.7L8.52 3.75A1 1 0 0 0 7 4.6z"/></svg>',
    pause='<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5.5" y="4" width="4.6" height="16" rx="1.4"/><rect x="13.9" y="4" width="4.6" height="16" rx="1.4"/></svg>',
    copy='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',
    expand='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
)

CSS = """
/* colour by job: 25 = blue, 07 = amber (validated pair, CVD-safe, same as the 3D view); Runway 18 = status
   (usable = soft green that recedes, not usable = red that pops); text always in ink, never in a series colour */
body{display:flex;flex-direction:column}
main{flex:1;min-height:0;display:flex;flex-direction:column;gap:12px;padding:0 24px 20px}

/* summary: one surface, three columns sharing their rows (label / value / details) so the hairlines line up */
.sum{display:grid;grid-template-columns:1.2fr 1fr 1fr;grid-template-rows:auto auto auto;flex:none}
.sum>section{grid-row:span 3;display:grid;grid-template-rows:subgrid;padding:18px 26px 20px;min-width:0}
.sum>section+section{border-left:1px solid var(--line)}
.lbl{display:flex;align-items:center;gap:8px;height:22px;font-size:13px;font-weight:600;color:var(--ink2);white-space:nowrap}
.lbl small{font-size:13px;font-weight:400;color:var(--ink3)}
.tag{font-size:11.5px;font-weight:600;padding:2px 9px;border-radius:999px;background:var(--fill);color:var(--ink)}
.tag.later{background:var(--ink);color:#fff}
.back{margin-left:auto;font-size:12.5px;font-weight:500;color:var(--accent)}
.back:hover{text-decoration:underline;text-underline-offset:3px}
.val{margin-top:12px;min-width:0}
.foot{align-self:start;margin:16px 0 0;padding-top:14px;border-top:1px solid var(--line);min-width:0}
.od{display:flex;align-items:flex-end;gap:16px}
.num{font-size:68px;font-weight:700;letter-spacing:-.045em;line-height:.84}
.word{display:flex;align-items:center;gap:8px;font-size:21px;font-weight:600;letter-spacing:-.02em;line-height:1.2}
.desc{font-size:13px;color:var(--ink2)}
.sw{display:inline-block;width:10px;height:10px;border-radius:3px;flex:none}
.facts{display:flex;gap:28px}
.facts dt{font-size:12px;color:var(--ink2)}
.facts dd{margin:2px 0 0;font-size:16px;font-weight:600;letter-spacing:-.01em;white-space:nowrap}
.big{display:flex;align-items:center;gap:10px;font-size:30px;font-weight:700;letter-spacing:-.03em;line-height:1.15;white-space:nowrap}
.big small{align-self:flex-end;padding-bottom:5px;font-size:14px;font-weight:400;letter-spacing:0;color:var(--ink2)}
.big button{font-weight:700;letter-spacing:-.03em}
.big button:hover{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:5px}
.dot{width:11px;height:11px;border-radius:50%;flex:none}
.sub,.flow{margin-top:4px;font-size:13px;color:var(--ink2)}
.flow{display:flex;align-items:center;gap:6px}
.flow b{color:var(--ink);font-weight:600}
.meter{display:inline-block;vertical-align:middle;width:64px;height:4px;border-radius:2px;background:var(--fill);margin-left:8px;overflow:hidden}
.meter i{display:block;height:100%;border-radius:2px;background:var(--ink)}
.notes{margin-top:10px;display:grid;gap:3px;font-size:12px;color:var(--ink2);line-height:1.35}
.notes b,.alert b{color:var(--ink);font-weight:600}
.alert{display:grid;gap:2px;font-size:12px;color:var(--ink2);line-height:1.35}
.alert b{font-size:13px}
.alert b::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);margin-right:7px;vertical-align:1px}
.quiet{font-size:12.5px;color:var(--ink2);line-height:1.4}

/* the timeline + the 3D view: take whatever height is left */
.row2{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) 420px;gap:12px}
.tlc{display:flex;flex-direction:column;min-width:0;min-height:0;padding:16px 24px 16px}
.hd{display:flex;align-items:center;gap:10px;height:28px;flex:none}
.hd h2{margin:0;font-size:17px;font-weight:600;letter-spacing:-.02em;white-space:nowrap}
.hd .icon{margin-left:auto}
.c3d{position:relative;overflow:hidden;background:#f4f4f2;min-height:0}
.f3d{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}
.fs{position:absolute;right:10px;bottom:10px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;
  background:var(--glass);-webkit-backdrop-filter:blur(20px) saturate(180%);backdrop-filter:blur(20px) saturate(180%);
  box-shadow:0 1px 3px rgba(0,0,0,.14),0 0 0 .5px rgba(0,0,0,.06);transition:transform .12s ease-out,background-color .15s}
.fs svg{width:12px;height:12px}
.fs:hover{background:#fff}
.fs:active{transform:scale(.92)}

/* timeline: labels and lanes share one grid; the direction lane absorbs spare height */
.tl{flex:1;min-height:0;display:grid;grid-template-columns:96px minmax(0,1fr);row-gap:8px;margin-top:12px;
  grid-template-rows:22px 20px minmax(48px,1fr) 10px 18px 30px}
.tl.noev{grid-template-rows:22px 0 minmax(48px,1fr) 10px 18px 30px}
.hl{grid-column:1;display:flex;flex-direction:column;justify-content:center;font-size:12px;font-weight:600;line-height:1.25;white-space:nowrap}
.hl small{display:flex;align-items:center;gap:4px;font-size:11px;font-weight:400;color:var(--ink3)}
.hl small .sw{width:8px;height:8px;border-radius:2px}
.hl small .sw+.sw{margin-left:4px}
.lanes{grid-column:2;grid-row:1/-1;display:grid;grid-template-rows:subgrid;position:relative;user-select:none;touch-action:pan-y}
.lanes:focus-visible{outline:2px solid rgba(0,113,227,.3);outline-offset:6px;border-radius:8px}
.ln{display:flex;gap:var(--g,2px);min-height:0;position:relative;z-index:1}
.ln>div{flex:1;min-width:0}
.lod>div{display:flex;flex-direction:column;border-radius:4px;overflow:hidden;background:var(--east)}
.lod i,.l18 i{flex:none;background:var(--west)}
.lpg>div{border-radius:2px;background:var(--fill)}
.lpg .w{background:var(--west)}.lpg .e{background:var(--east)}
.mixed,.lpg .m{background:repeating-linear-gradient(135deg,var(--west) 0 3px,var(--east) 3px 6px)}
.l18>div{display:flex;flex-direction:column;border-radius:3px;overflow:hidden;background:var(--ok)}
.l18 i{background:var(--red)}
.lwd>div{display:flex;flex-direction:column;align-items:center;color:var(--ink2)}
.lwd svg{width:11px;height:11px}
.lwd small{font-size:10.5px;color:var(--ink3);margin-top:1px}
.ruler{position:relative;border-bottom:1px solid var(--line)}
.ruler .d{position:absolute;bottom:5px;font-size:11.5px;font-weight:600;white-space:nowrap}
.ruler .h{position:absolute;bottom:5px;transform:translateX(-50%);font-size:11px;color:var(--ink3);white-space:nowrap}
.ruler .d,.ruler .h{transition:opacity .15s}
.ruler .off{opacity:0}
.ruler .t{position:absolute;bottom:0;width:1px;height:4px;background:rgba(0,0,0,.18)}
.ruler .t.dd{height:100%;background:var(--line)}
.ev{position:relative;z-index:2}
.mk{position:absolute;top:1px;height:18px;padding:0 8px;border-radius:999px;transform:translateX(-50%);font-size:11px;font-weight:600;
  line-height:18px;white-space:nowrap;background:var(--ink);color:#fff;transition:transform .12s ease-out}
.mk.r18{background:var(--red)}
.mk:active{transform:translateX(-50%) scale(.94)}
.bands{position:absolute;left:0;right:0;top:30px;bottom:0;pointer-events:none}
.night,.nightsw{background:rgba(0,0,0,.045)}
.night{position:absolute;top:0;bottom:0;border-radius:6px}
.ph{position:absolute;top:0;bottom:-4px;left:0;width:0;z-index:3;pointer-events:none;will-change:transform}
.ph::before{content:"";position:absolute;top:20px;bottom:0;left:-1px;width:2px;border-radius:1px;background:var(--ink)}
.ph b{position:absolute;top:0;left:0;height:20px;padding:0 8px;border-radius:6px;background:var(--ink);color:#fff;
  font-size:11.5px;font-weight:600;line-height:20px;white-space:nowrap}
.tlf{display:flex;align-items:center;gap:16px;margin-top:14px;font-size:11.5px;color:var(--ink2);white-space:nowrap;flex:none}
.tlf span{display:inline-flex;align-items:center;gap:6px}
.tlf i{width:10px;height:10px;border-radius:3px}
.upd{display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--ink2);white-space:nowrap}
.upd i{width:7px;height:7px;border-radius:50%;background:var(--green)}
.upd.stale i{background:var(--east)}
.toast{position:fixed;left:50%;bottom:24px;padding:9px 16px;border-radius:999px;background:var(--glass);
  -webkit-backdrop-filter:blur(20px) saturate(180%);backdrop-filter:blur(20px) saturate(180%);box-shadow:var(--lift);
  font-size:13px;font-weight:500;pointer-events:none;opacity:0;transform:translate(-50%,10px) scale(.96);
  transition:opacity .2s,transform .4s cubic-bezier(.2,.9,.25,1)}
.toast.on{opacity:1;transform:translate(-50%,0) scale(1)}
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
const dhm = t => fmt({ weekday: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(t));
const dayf = t => fmt({ weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(t));
const hourOf = t => +fmt({ hour: '2-digit' }).format(new Date(t));
const fraHour = t => +new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', hourCycle: 'h23' }).format(new Date(t));
const plus1h = t => new Date(new Date(t).getTime() + 3600e3);
const pct = p => (p >= 0.995 ? '>99%' : p < 0.005 ? '<1%' : `${Math.round(p * 100)}%`);
const word = od => (od === 25 ? 'Westbound' : 'Eastbound');
const two = od => (od === 25 ? '25' : '07');
const col = od => (od === 25 ? 'var(--west)' : 'var(--east)');
const sw = od => `<i class="sw" style="background:${col(od)}"></i>`;
const hoursFrom = t => Math.round((new Date(t) - new Date(D.issue)) / 3600e3);
const comp = (h, hdg) => -h.ws * Math.cos((h.wd - hdg) * Math.PI / 180); // + = tailwind on that heading
const night = t => { const h = fraHour(t); return h >= 23 || h < 5; };
const prog = h => (h.pg === undefined ? null : h.pg >= 0.75 ? 25 : h.pg <= 0.25 ? 7 : 0); // 0 = mixed / change possible
const pOf = (h, od) => (od === 25 ? h.p25 : 1 - h.p25);
const idxOf = t => H.findIndex(h => Date.parse(h.t) === Date.parse(t));

// ---- events = timeline markers: the predicted direction change, Runway 18 closures
function events() {
  const ev = [];
  if (D.change) { const i = idxOf(D.change.t); if (i >= 0) ev.push({ i, kind: 'od', label: `⇄ ${two(D.od_now === 25 ? 7 : 25)}` }); }
  H.forEach((h, i) => { if (h.p18 < 0.5 && (i === 0 || H[i - 1].p18 >= 0.5)) ev.push({ i, kind: 'r18', label: '18 ✕' }); });
  return ev.sort((a, b) => a.i - b.i);
}
function r18Windows() { // [start, end] index ranges where Runway 18 is predicted not usable
  const w = [];
  H.forEach((h, i) => { if (h.p18 < 0.5) { if (w.length && w[w.length - 1][1] === i - 1) w[w.length - 1][1] = i; else w.push([i, i]); } });
  return w;
}

// ---- summary: the shown hour (now = the flown direction)
function renderOD() {
  const now = sel < 0, h = now ? H[0] : H[sel], od = now ? D.od_now : h.od;
  $('odtag').textContent = now ? 'Now' : dhm(h.t);
  $('odtag').classList.toggle('later', !now);
  $('back').hidden = now;
  $('odnum').textContent = two(od);
  $('odword').innerHTML = `${sw(od)}${word(od)}`;
  $('oddesc').textContent = `Take-offs and landings toward ${od === 25 ? '250' : '070'}°`;
  const wind = h.ws === undefined ? '–' : `${String(h.wd).padStart(3, '0')}° ${Math.round(h.ws)} kt`;
  const since = D.since ? (dayf(D.since) === dayf(D.issue) ? hm(D.since) : dhm(D.since)) : '–';
  const facts = now ? [['In use since', since], ['Confidence (6 h)', pct(D.conf6)], ['Wind', wind]]
    : [['Ahead', `${hoursFrom(h.t)} h`], ['Probability', pct(pOf(h, od))], ['Wind', wind]];
  $('odfacts').innerHTML = facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
}
function renderR18() {
  const now = sel < 0, h = now ? H[0] : H[sel], ok = h.p18 >= 0.5, day1 = H.slice(0, 24);
  let sub;
  if (!now) sub = `${pct(ok ? h.p18 : 1 - h.p18)} likely`;
  else if (ok) sub = day1.every(x => x.p18 >= 0.5) ? `At least ${pct(Math.min(...day1.map(x => x.p18)))} usable over the next 24 h` : `${pct(h.p18)} likely`;
  else { const back = H.findIndex(x => x.p18 >= 0.5); sub = back < 0 ? 'Not expected back within 48 h' : `Likely usable again ${dhm(H[back].t)}`; }
  $('r18val').innerHTML = `<div class="big"><i class="dot" style="background:var(--${ok ? 'green' : 'red'})"></i>${ok ? 'Usable' : 'Not usable'}`
    + `${now ? '' : `<small>at ${hm(h.t)}</small>`}</div><div class="sub">${sub}</div>`;
  const W = r18Windows(), dep18 = D.traffic ? D.traffic.share18 : null;
  if (W.length) {
    const [a, b] = W.find(([, e]) => e >= Math.max(0, sel)) || W[0], win = H.slice(a, b + 1);
    const tw = Math.max(-99, ...win.filter(x => x.ws !== undefined).map(x => comp(x, 180)));
    const moved = dep18 ? Math.max(...win.map(x => Math.round(D.traffic.perHour[fraHour(x.t)] / 2 * dep18))) : 0;
    $('r18foot').innerHTML = `<div class="alert"><b>Not usable ${dhm(win[0].t)}–${hm(plus1h(win[win.length - 1].t))}</b>`
      + `<span>${moved > 0 ? `~${moved} departures/h move to the Centre runway` : 'Inside the night ban, no departures affected'}`
      + `${tw >= 5 ? `, tailwind up to ${Math.round(tw)} kt` : ''}</span></div>`;
  } else $('r18foot').innerHTML = '<div class="quiet">No closure expected within 48 h</div>';
}
function impact(t) {
  if (night(t)) return 'Night ban (23–05), no scheduled traffic';
  if (!D.traffic) return '';
  const n = D.traffic.perHour[fraHour(t)];
  return `${n >= 60 ? '<b>Busy hour</b>' : n >= 35 ? 'Moderate traffic' : 'Quiet hour'}, ~${n} movements/h`;
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
  const span_ = ix => `${dhm(H[ix[0]].t)}–${hm(plus1h(H[ix[ix.length - 1]].t))}`;
  if (!dis.length) return mixed.length ? `Published prognosis <b>agrees</b> (change possible ${span_(mixed)})` : 'Published prognosis <b>agrees</b> for all 48 h';
  const x = dis.map(i => ({ h: H[i], s: prog(H[i]) })), what = x.some(y => y.s === 0) ? 'a possible change' : `OD ${two(x[0].s)}`;
  const m = Math.min(...x.map(y => pOf(y.h, y.h.od)));
  return `Published prognosis expects <b>${what}</b> ${span_(dis)}; we expect ${two(x[0].h.od)} (${m >= 0.995 ? '' : 'at least '}${pct(m)} sure)`;
}
function renderChange() {
  const to = D.od_now === 25 ? 7 : 25, p = D.p_change ?? 0;
  const meter = pct(p);
  const notes = [D.change ? impact(D.change.t) : '', progNote()].filter(Boolean).map(n => `<div>${n}</div>`).join('');
  if (D.change) {
    const i = idxOf(D.change.t);
    $('chgval').innerHTML = `<div class="big"><button id="gochg" title="Show on the timeline">${dhm(D.change.t)}</button><small>in ${hoursFrom(D.change.t)} h</small></div>`
      + `<div class="flow">${sw(D.od_now)}<b>${two(D.od_now)}</b> ${word(D.od_now)} →&nbsp;${sw(to)}<b>${two(to)}</b> ${word(to)}</div>`;
    $('chgfoot').innerHTML = `<dl class="facts"><div><dt>Probability</dt><dd>${meter}</dd></div>`
      + (p < 0.75 ? `<div><dt>Likely window</dt><dd>${hm(D.change.start)}–${hm(plus1h(D.change.end))}</dd></div>` : '') + `</dl><div class="notes">${notes}</div>`;
    $('gochg').onclick = () => { setPlaying(0); go(i); };
  } else {
    $('chgval').innerHTML = `<div class="big">None<small>within 48 h</small></div><div class="flow">${sw(D.od_now)}<b>${two(D.od_now)}</b> ${word(D.od_now)} holds</div>`;
    $('chgfoot').innerHTML = `<dl class="facts"><div><dt>Chance of a change</dt><dd>${meter}</dd></div></dl><div class="notes">${notes}</div>`;
  }
}

// ---- timeline
const lanes = $('lanes');
const geom = () => { const W = $('lod').clientWidth, g = span >= 48 ? 2 : 3, cw = (W - (span - 1) * g) / span; return { W, g, cw }; };
const xOf = i => { const { g, cw } = geom(); return (i - off) * (cw + g) + cw / 2; };
function idxAt(e) { // from the on-screen rect, so it stays right when fit() zooms the page
  const r = $('lod').getBoundingClientRect();
  return Math.max(0, Math.min(H.length - 1, off + Math.floor(((e.clientX - r.left) / r.width) * span)));
}
function renderTimeline() {
  off = Math.max(0, Math.min(off, H.length - span));
  const hs = H.slice(off, off + span), { g, cw } = geom(), x = i => i * (cw + g);
  const every = span === 48 ? 6 : span === 24 ? 3 : 2, num = span === 48 ? 3 : span === 24 ? 2 : 1;
  lanes.style.setProperty('--g', `${g}px`);
  let ru = '';
  hs.forEach((h, i) => {
    const hr = hourOf(h.t), c = x(i) + cw / 2;
    if (i === 0) ru += `<span class="d" data-x="34" style="left:0">${dayf(h.t)}</span>`;
    else if (hr === 0) ru += `<i class="t dd" style="left:${x(i) - g / 2}px"></i><span class="d" data-x="${x(i) + 39}" style="left:${x(i) + 5}px">${dayf(h.t)}</span>`;
    if (hr % every === 0 && hr !== 0) {
      ru += `<i class="t" style="left:${c}px"></i>`;
      if (c > 84) ru += `<span class="h" data-x="${c}" style="left:${c}px">${String(hr).padStart(2, '0')}:00</span>`;
    }
  });
  $('ruler').innerHTML = ru;
  const ev = events();
  $('tl').classList.toggle('noev', !ev.length);
  $('ev').innerHTML = ev.filter(e => e.i >= off && e.i < off + span)
    .map(e => `<button class="mk ${e.kind}" data-i="${e.i}" style="left:${x(e.i - off) + cw / 2}px" title="Show ${dhm(H[e.i].t)}">${e.label}</button>`).join('');
  const hOD = $('lod').clientHeight, h18 = $('l18').clientHeight; // whole pixels: no hairline slivers for ~0%
  $('lod').innerHTML = hs.map(h => `<div><i style="height:${Math.round(h.p25 * hOD)}px"></i></div>`).join('');
  $('lpg').innerHTML = hs.map(h => { const s = prog(h); return `<div class="${s === null ? '' : s === 0 ? 'm' : s === 25 ? 'w' : 'e'}"></div>`; }).join('');
  $('l18').innerHTML = hs.map(h => `<div><i style="height:${Math.round((1 - h.p18) * h18)}px"></i></div>`).join('');
  $('lwd').innerHTML = hs.map((h, i) => (h.ws === undefined ? '<div></div>'
    : `<div><span style="display:block;transform:rotate(${h.wd + 180}deg);opacity:${Math.min(1, 0.4 + h.ws / 14)}">${ICON.up}</span>${(off + i) % num === 0 ? `<small>${Math.round(h.ws)}</small>` : ''}</div>`)).join('');
  let bands = '', a = -1;
  hs.forEach((h, i) => {
    if (night(h.t) && a < 0) a = i;
    if (a >= 0 && (!night(h.t) || i === hs.length - 1)) {
      const b = night(h.t) ? i : i - 1;
      bands += `<div class="night" style="left:${x(a) - g / 2}px;width:${x(b) - x(a) + cw + g}px"></div>`; a = -1;
    }
  });
  $('bands').innerHTML = bands;
  lanes.querySelectorAll('.mk').forEach(m => {
    m.addEventListener('pointerdown', e => { e.stopPropagation(); setPlaying(0); go(+m.dataset.i); }); // respond on press
    m.addEventListener('click', e => { if (!e.detail) { setPlaying(0); go(+m.dataset.i); } }); // keyboard
  });
  drawHead();
}

// playhead: 1:1 under the pointer; keys, play and markers glide it on a critically damped spring (response 0.3 s)
// that always starts from where it is, so it can be redirected mid-flight
const head = { x: 0, v: 0, to: 0, raf: 0, on: false };
function paintHead() {
  const W = $('lod').clientWidth, b = $('phl'), w = b.offsetWidth;
  $('ph').style.transform = `translateX(${head.x}px)`;
  b.style.transform = `translateX(${Math.min(-w / 2, W - head.x - w)}px)`;
  const show = !$('ph').hidden; // ruler labels under the time label step aside
  $('ruler').querySelectorAll('[data-x]').forEach(l => l.classList.toggle('off', show && Math.abs(+l.dataset.x - head.x) < w / 2 + 30));
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
  if (show) { $('phl').textContent = dhm(H[sel].t); moveHead(xOf(sel), glide); } else paintHead();
  head.on = show;
  lanes.setAttribute('aria-valuenow', sel + 1);
  lanes.setAttribute('aria-valuetext', sel < 0 ? 'Now' : dhm(H[sel].t));
}
function select(i, { glide = false, hold = false } = {}) {
  sel = i < 0 ? -1 : Math.max(0, Math.min(H.length - 1, i));
  if (hold) pin = sel;
  if (sel >= 0 && (sel < off || sel >= off + span)) { off = Math.max(0, Math.min(H.length - span, sel - Math.floor(span / 2))); renderTimeline(); }
  else drawHead(glide);
  renderOD(); renderR18(); sync3d();
}
const go = i => select(i, { glide: true, hold: true });
function step(d) { go((sel < 0 ? (d > 0 ? -1 : 0) : sel) + d); }
function jumpEvent(dir) {
  const ev = events(), cur = sel;
  const e = dir > 0 ? ev.find(x => x.i > cur) : [...ev].reverse().find(x => x.i < (cur < 0 ? 0 : cur));
  if (e) go(e.i); else if (dir < 0) go(-1);
}
function setPlaying(dir) {
  playing = dir;
  $('play').innerHTML = dir ? ICON.pause : ICON.play;
  $('play').setAttribute('aria-label', dir ? 'Pause' : 'Play the next 48 hours');
  clearInterval(setPlaying.t);
  if (!dir) return;
  if (sel < 0 || sel >= H.length - 1) go(0);
  setPlaying.t = setInterval(() => (sel >= H.length - 1 ? setPlaying(0) : go(sel + 1)), 600);
}
lanes.addEventListener('pointerdown', e => {
  if (e.button) return;
  lanes.setPointerCapture(e.pointerId); dragging = true; setPlaying(0); lanes.focus({ preventScroll: true });
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

// ---- header: live feed, briefing, time zone
let live = null;
function renderUpdated() {
  const stale = live && (Date.now() - Date.parse(live.generated)) / 1000 > 120;
  $('upd').className = `upd${stale ? ' stale' : ''}`;
  $('upd').innerHTML = live ? `<i></i>Updated ${hm(live.generated)}` : `Issued ${dayf(D.issue)}, ${hm(D.issue)}`; // dot only when live
}
async function pollLive() {
  try {
    const r = await fetch('live.json', { cache: 'no-store' });
    if (!r.ok) throw new Error(r.status);
    const d = await r.json(), fresh = !live || live.issue !== d.issue;
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
function briefing() {
  const L = [], to = D.od_now === 25 ? 7 : 25;
  L.push(`FRA runway operations · forecast issued ${dayf(D.issue)} ${hm(D.issue)} (${tz === 'UTC' ? 'UTC' : 'local'})`);
  L.push(`Now: OD ${two(D.od_now)} ${word(D.od_now)}${D.since ? ` since ${dhm(D.since)}` : ''} · confidence next 6 h ${pct(D.conf6)}`);
  L.push(D.change ? `Next direction change: ${two(D.od_now)} -> ${two(to)} at ${dhm(D.change.t)} (in ${hoursFrom(D.change.t)} h, probability ${pct(D.p_change ?? 0)})`
    + `${(D.p_change ?? 0) < 0.75 ? `, window ${hm(D.change.start)}-${hm(plus1h(D.change.end))}` : ''}. ${impact(D.change.t).replace(/<[^>]+>/g, '')}`
    : `Next direction change: none expected within 48 h (chance ${pct(D.p_change ?? 0)}).`);
  const pn = progNote().replace(/<[^>]+>/g, ''); if (pn) L.push(pn + '.');
  const W = r18Windows();
  L.push(W.length ? `Runway 18 West: NOT usable ${W.map(([a, b]) => `${dhm(H[a].t)}-${hm(plus1h(H[b].t))}`).join(', ')}; departures via Centre runway.`
    : `Runway 18 West: usable all 48 h (min ${pct(Math.min(...H.map(h => h.p18)))}).`);
  const Q = D.quality, q24 = Q?.od25.find(x => x.lead === 24), S = Q?.switch;
  if (q24) L.push(`Track record (out of sample): direction right ${(q24.acc * 100).toFixed(1)}% at 24 h ahead (official rules ${(q24.rule * 100).toFixed(1)}%)`
    + (S ? `; changes called within ±3 h ${Math.round(S.model.hit * 100)}%, ${S.model.fa} false alarms (rules ${S.rule.fa}).` : '.'));
  return L.join('\n');
}
function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 1800); }
$('brief').onclick = async () => {
  const txt = briefing();
  try { await navigator.clipboard.writeText(txt); }
  catch { const a = document.createElement('textarea'); a.value = txt; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); }
  toast('Briefing copied');
};
document.querySelectorAll('#tz button').forEach(b => b.addEventListener('click', () => {
  tz = b.dataset.v === 'utc' ? 'UTC' : 'Europe/Berlin'; store.set('fra-tz', b.dataset.v); renderAll(); post3d({ fra: 'tz', value: tz });
}));

// ---- 3D view: an iframe that follows the playhead (now = live aircraft, a selected hour = simulated traffic)
const f3d = $('f3d');
let ready3d = false;
const post3d = m => { if (ready3d) f3d.contentWindow.postMessage(m, '*'); };
const sync3d = () => post3d(sel < 0 ? { fra: 'view', live: true } : { fra: 'view', live: false, t: H[sel].t });
f3d.src = `airport3d.html?run=${encodeURIComponent(D.run)}&theme=light&embed=card`;
addEventListener('message', e => {
  if (e.source !== f3d.contentWindow || !e.data) return;
  if (e.data.fra === 'ready') { ready3d = true; post3d({ fra: 'tz', value: tz }); sync3d(); }
  if (e.data.fra === 'exit-fs' && fsEl()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
});
const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
$('fs3d').onclick = () => { const r = f3d.requestFullscreen || f3d.webkitRequestFullscreen; if (r) r.call(f3d); };
const onFs = () => { // zoom on <body> would scale the full-screen iframe too: undo it while full screen
  const on = fsEl() === f3d;
  if (on) document.body.style.zoom = 1; else fit();
  post3d({ fra: 'fs', on });
};
document.addEventListener('fullscreenchange', onFs);
document.addEventListener('webkitfullscreenchange', onFs);

function renderAll() {
  press($('tz'), $('tz').querySelector(`[data-v=${tz === 'UTC' ? 'utc' : 'local'}]`));
  renderUpdated(); renderChange(); renderTimeline(); renderOD(); renderR18();
}
function zoom() { return parseFloat(document.body.style.zoom) || 1; }
function fit() { // one screen, never a scrollbar: lay out at >= 1280 px wide, scale to the window, the timeline row takes the rest
  const b = document.body, height = z => {
    b.style.zoom = 1; b.style.height = 'auto'; b.style.width = `${Math.max(1280, innerWidth / z)}px`; renderTimeline(); return b.scrollHeight; };
  let z = Math.min(2, innerWidth / 1280);
  for (let k = 0; k < 4; k++) z = Math.min(2, innerWidth / 1280, innerHeight / height(z));
  const h = height(z);
  if (h * z > innerHeight) z = innerHeight / h;
  b.style.height = `${innerHeight / z}px`;
  b.style.zoom = z.toFixed(4);
  renderTimeline(); document.querySelectorAll('.seg').forEach(thumb);
}
addEventListener('resize', fit);
setPlaying(0);
renderAll();
fit();
requestAnimationFrame(() => document.querySelectorAll('.seg').forEach(s => s.classList.add('on')));
if (location.protocol.startsWith('http')) { pollLive(); setInterval(pollLive, 30000); }
"""

PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FRA Runway Operations, issued __ISSUE__</title><link rel="icon" href="data:,">
<style>__BASE____CSS__</style></head><body>
__BAR__
<main>
  <div class="card sum">
    <section aria-label="Operating direction">
      <div class="lbl">Operating direction<span class="tag" id="odtag">Now</span><button class="back" id="back" hidden>Back to now</button></div>
      <div class="val od"><div class="num" id="odnum"></div><div><div class="word" id="odword"></div><div class="desc" id="oddesc"></div></div></div>
      <dl class="foot facts" id="odfacts"></dl>
    </section>
    <section aria-label="Next direction change">
      <div class="lbl">Next direction change</div>
      <div class="val" id="chgval"></div>
      <div class="foot" id="chgfoot"></div>
    </section>
    <section aria-label="Runway 18 West">
      <div class="lbl">Runway 18 West<small>departures to the south</small></div>
      <div class="val" id="r18val"></div>
      <div class="foot" id="r18foot"></div>
    </section>
  </div>

  <div class="row2">
    <section class="card tlc" aria-label="Next 48 hours">
      <div class="hd">
        <h2>Next 48 hours</h2>
        <button class="icon" id="play" title="Play / pause (Space)"></button>
        <div class="seg" id="zoom" role="group" aria-label="Zoom"><i></i><button data-v="12">12 h</button><button data-v="24">24 h</button><button data-v="48" aria-pressed="true">48 h</button></div>
      </div>
      <div class="tl" id="tl">
        <div class="hl" style="grid-row:3">Direction<small>__SW25__25__SW07__07</small></div>
        <div class="hl" style="grid-row:4"><small>Prognosis</small></div>
        <div class="hl" style="grid-row:5">Runway 18</div>
        <div class="hl" style="grid-row:6">Wind<small>kt</small></div>
        <div class="lanes" id="lanes" tabindex="0" role="slider" aria-label="Forecast hour" aria-valuemin="0" aria-valuemax="48"
          title="Hover to preview · click or drag to hold an hour · ←/→ 1 h (Shift 6 h) · ↑/↓ previous/next event · Space play · Esc back to now">
          <div class="bands" id="bands"></div>
          <div class="ruler" id="ruler"></div>
          <div class="ev" id="ev"></div>
          <div class="ln lod" id="lod"></div>
          <div class="ln lpg" id="lpg"></div>
          <div class="ln l18" id="l18"></div>
          <div class="ln lwd" id="lwd"></div>
          <div class="ph" id="ph" hidden><b id="phl"></b></div>
        </div>
      </div>
      <div class="tlf">
        <span><i class="mixed"></i>Mixed prognosis</span><span><i style="background:var(--ok)"></i>Runway 18 usable</span>
        <span><i style="background:var(--red)"></i>Not usable</span><span><i class="nightsw"></i>Night ban 23–05</span>
      </div>
    </section>
    <section class="card c3d">
      <iframe class="f3d" id="f3d" title="3D view of Frankfurt Airport at the selected hour" allow="fullscreen" allowfullscreen loading="lazy"></iframe>
      <button class="fs" id="fs3d" title="Full screen (Esc to leave)" aria-label="Show the 3D view full screen">__EXPAND__</button>
    </section>
  </div>
</main>
<div class="toast" id="toast" role="status"></div>
<script type="application/json" id="data">__DATA__</script>
<script>const ICON = __ICONS__;
__JS__</script>
</body></html>
"""

BAR_RIGHT = ('<span class="upd" id="upd" aria-live="polite"></span>'
             '<button class="btn" id="brief" title="Copy a plain-text shift briefing">__COPY__Copy briefing</button>'
             '<div class="seg" id="tz" role="group" aria-label="Time zone"><i></i><button data-v="local">Local</button><button data-v="utc">UTC</button></div>')


def page(d):
    """The dashboard HTML for a payload() dict."""
    sw = lambda c: f'<i class="sw" style="background:var(--{c})"></i>'
    return (PAGE.replace("__ISSUE__", pd.Timestamp(d["issue"]).strftime("%Y-%m-%d %H:%M UTC"))
            .replace("__BASE__", siteui.BASE_CSS).replace("__CSS__", CSS)
            .replace("__BAR__", siteui.bar("forecast", BAR_RIGHT.replace("__COPY__", ICONS["copy"])))
            .replace("__SW25__", sw("west")).replace("__SW07__", sw("east")).replace("__EXPAND__", ICONS["expand"])
            .replace("__ICONS__", json.dumps(ICONS))
            .replace("__DATA__", json.dumps(d, separators=(",", ":")).replace("</", "<\\/"))
            .replace("__JS__", JS))


def render(path):
    path = Path(path)
    d = payload(path)
    SITE.mkdir(exist_ok=True)
    out = SITE / "index.html"
    out.write_text(page(d), encoding="utf-8")
    if d.get("quality"):
        modelpage.render(d["quality"], SITE / "model.html")
    try:
        scene3d.render(path)
    except (SystemExit, Exception) as e:  # the 3D view needs the data/osm cache + web bundle
        print(f"3D view not rebuilt: {e}")
    return out, d

if __name__ == "__main__":
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else newest_forecast()
    out, d = render(src)
    ch = "none within 48 h" if d["change"] is None else d["change"]["t"]
    print(f"wrote {out} from {src.name} (issued {d['issue']}, OD {d['od_now']:02d}, next change: {ch})")
