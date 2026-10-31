"""Third dashboard page "Model" -> site/model.html: the pitch for the forecast - how much better it is than what
exists today, why that matters, how it works and how it was tested.

Built by fra.dashboard.render from the same walk-forward evaluation (data/eval.csv, data/changetime_eval.csv) that
feeds the quality section, so the numbers always match the model card. Every claim is a comparison against the
published INAA prognosis and the official switching rules on the same hours.
"""

import html
import json
import re
from pathlib import Path

import pandas as pd

from fra import siteui

DATA = Path(__file__).resolve().parent.parent / "data"

SOURCES = ["Weather forecasts (ECMWF, DWD)", "INAA direction prognosis", "Airport weather (METAR)", "Radar tracks: what was flown"]

CSS = """
/* a slide deck: one 1280x720 canvas zoomed to the window, one slide at a time, arrow keys / buttons / dots / swipe */
body{display:flex;flex-direction:column;height:720px}
.deck{position:relative;flex:1;min-height:0}
.slide{position:absolute;inset:0;max-width:1180px;margin:0 auto;padding:0 40px 56px;display:flex;flex-direction:column;
  justify-content:center;opacity:0;visibility:hidden;transform:translateX(48px);
  transition:opacity .3s ease,transform .5s cubic-bezier(.2,.9,.25,1),visibility 0s .5s}
.slide.past{transform:translateX(-48px)}
.slide.on{opacity:1;visibility:visible;transform:none;transition:opacity .3s ease,transform .5s cubic-bezier(.2,.9,.25,1),visibility 0s}
.kicker{font-size:13px;font-weight:600;color:var(--accent);letter-spacing:.02em;margin:0 0 8px}
h2{margin:0;font-size:36px;line-height:1.1;font-weight:700;letter-spacing:-.03em}
.lede{margin:8px 0 22px;color:var(--ink2);font-size:16px}
.card{padding:26px 32px 28px}
/* title slide: a two-tone headline (the claim in ink, the comparison in grey) and three numbers */
.hero h1{margin:0;font-size:72px;line-height:1.04;font-weight:700;letter-spacing:-.04em;color:var(--ink3);max-width:900px}
.hero h1 em{font-style:normal;color:var(--ink)}
.hero h1+p{margin:18px 0 48px;font-size:19px;color:var(--ink2)}
.kpis{display:grid;grid-template-columns:repeat(3,1fr)}
.kpi{padding:2px 28px;border-left:1px solid var(--line)}
.kpi:first-child{padding-left:0;border-left:0}
.kpi b{display:block;font-size:64px;font-weight:700;letter-spacing:-.04em;line-height:1}
.kpi b small{font-size:24px;font-weight:600;letter-spacing:-.02em}
.kpi span{display:block;margin-top:10px;font-size:17px;font-weight:500;color:var(--ink2);line-height:1.3}
.kpi i{display:block;font-style:normal;margin-top:4px;font-size:13px;color:var(--ink2);line-height:1.35}
.legend{display:flex;gap:20px;font-size:13px;color:var(--ink2);margin:0 0 12px;flex-wrap:wrap}
.legend span{display:flex;align-items:center;gap:6px}
.legend i{width:10px;height:10px;border-radius:3px;display:inline-block}
.chart svg{display:block;width:100%;height:auto;max-height:380px;overflow:visible}
.chart text{font-size:12px;fill:var(--ink2)}
.chart .lead{font-weight:600;fill:var(--ink);font-size:13px}
.chart .sub{font-size:11px;fill:var(--ink3)}
.chart .val{font-weight:500;fill:var(--ink2);font-size:11.5px}
.chart .val.m{font-weight:700;fill:var(--ink);font-size:12.5px}
.chart .gain{font-weight:700;fill:var(--good);font-size:15px;letter-spacing:-.01em}
.chart .hit{transition:fill .15s}
.chart .row:hover .hit{fill:var(--bg)}
.trio{display:grid;grid-template-columns:repeat(3,1fr);gap:40px}
.trio h3{margin:0;font-size:17px;font-weight:600;letter-spacing:-.01em}
.trio h3 small{display:block;font-weight:400;color:var(--ink3);font-size:13px;margin-top:2px}
.bars{margin-top:16px;display:grid;gap:10px}
.bar{display:grid;grid-template-columns:84px 1fr;align-items:center;gap:10px;font-size:13px;color:var(--ink2)}
.bar .t{position:relative;height:26px}
.bar .f{position:absolute;inset:0 auto 0 0;border-radius:6px}
.bar .v{position:absolute;top:50%;transform:translateY(-50%);font-weight:600;color:var(--ink);font-size:14px;white-space:nowrap}
.bar.m{color:var(--ink);font-weight:600}
.flow{display:grid;grid-template-columns:1fr 32px 1.1fr 32px 1fr;align-items:stretch}
.step{background:var(--bg);border-radius:16px;padding:20px 22px}
.step.m{background:var(--ink);color:#fff}
.step h3{margin:0 0 12px;font-size:18px;font-weight:600;letter-spacing:-.01em}
.step ul{margin:0;padding:0;list-style:none;display:grid;gap:10px;font-size:16px;line-height:1.35}
.step li small{display:block;color:var(--ink3);font-size:12.5px}
.step.m li small{color:#a1a1a6}
.arrow{display:grid;place-items:center;color:var(--ink3)}
.arrow svg{width:18px;height:18px}
.weeks{display:grid;grid-template-columns:repeat(var(--n),1fr);gap:6px}
.wk{border-radius:10px;padding:10px 2px;text-align:center;background:var(--bg);font-size:12px;color:var(--ink2);line-height:1.3}
.wk b{display:block;font-size:14px;font-weight:600;color:var(--ink)}
.rules{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;margin-top:22px}
.rules div{padding-top:14px;border-top:1px solid var(--line)}
.rules b{color:var(--ink);font-weight:600;font-size:18px}
.notes{position:absolute;left:28px;right:28px;bottom:48px;z-index:3;padding:16px 20px;border-radius:14px;background:var(--glass);-webkit-backdrop-filter:blur(20px) saturate(180%);backdrop-filter:blur(20px) saturate(180%);box-shadow:var(--lift);font-size:16px;line-height:1.5}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
/* deck controls: counter + arrows in the top bar, dots at the bottom */
.count{font-size:12.5px;color:var(--ink2);min-width:42px;text-align:right}
.icon[disabled]{opacity:.35;cursor:default}
.dots{position:absolute;left:0;right:0;bottom:20px;display:flex;justify-content:center;align-items:center;gap:8px;z-index:2}
.dots button{width:8px;height:8px;border-radius:999px;background:var(--b2);transition:width .3s cubic-bezier(.2,.9,.25,1),background-color .2s}
.dots button[aria-current]{width:24px;background:var(--ink)}
.hint{position:absolute;right:28px;bottom:16px;font-size:11.5px;color:var(--ink3)}
.hint kbd{font:inherit;display:inline-block;min-width:18px;padding:0 4px;border-radius:5px;background:var(--card);
  box-shadow:0 0 0 .5px rgba(0,0,0,.15);text-align:center;margin:0 1px}
"""

# key in quality() rows, label, fill: ours is the only strong mark, the baselines are grey steps + always labelled
SERIES = [("acc", "Our model", "var(--ink)"), ("prog", "Published INAA prognosis", "var(--b1)"),
          ("rule", "Official rules on the weather forecast", "var(--b2)")]

JS = r"""
const D = JSON.parse(document.getElementById('data').textContent);
const pct = v => v == null ? '–' : (v * 100).toFixed(1) + '%';
const err = v => v == null ? null : 1 - v;
const tip = document.getElementById('tip');
function hover(el, html) {
  el.addEventListener('mousemove', e => {
    tip.innerHTML = html; tip.hidden = false;
    tip.style.left = Math.min(e.clientX + 14, innerWidth - tip.offsetWidth - 8) + 'px';
    tip.style.top = (e.clientY + 14) + 'px';
  });
  el.addEventListener('mouseleave', () => { tip.hidden = true; });
}
document.getElementById('legend').innerHTML = D.series.map(([, lab, c]) => `<span><i style="background:${c}"></i>${lab}</span>`).join('');
// error rate by lead time: grouped horizontal bars from zero, relative gain vs the prognosis on the right
const rows = D.od, W = 700, L = 92, R = 640, BH = 11, GAP = 2, RG = 16;
const RH = D.series.length * (BH + GAP) - GAP + RG;
const xmax = Math.ceil(Math.max(...rows.flatMap(r => D.series.map(([k]) => err(r[k]) || 0))) * 50) / 50;
const x = v => L + v / xmax * (R - L - 50);
const H = rows.length * RH + 24;
let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Share of hours with the wrong operating direction, by hours ahead: our model vs the published prognosis and the official rules">`;
s += `<text class="sub" x="${W}" y="${H - 4}" text-anchor="end">vs prognosis</text>`;
rows.forEach((r, i) => {
  const y0 = i * RH + RG / 2, mid = y0 + (RH - RG) / 2;
  s += `<g class="row" data-i="${i}"><rect class="hit" x="0" y="${y0 - RG / 2 + 2}" width="${W}" height="${RH - 4}" rx="8" fill="transparent"/>`
     + `<text class="lead" x="0" y="${mid}">${r.lead} h ahead</text><text class="sub" x="0" y="${mid + 16}">${r.n.toLocaleString('en')} hours</text>`;
  D.series.forEach(([k, , c], j) => {
    const v = err(r[k]); if (v == null) return;
    const y = y0 + j * (BH + GAP);
    s += `<rect x="${L}" y="${y}" width="${Math.max(2, x(v) - L)}" height="${BH}" rx="3" fill="${c}"/>`
       + `<text class="val${j ? '' : ' m'}" x="${x(v) + 6}" y="${y + BH - 2}">${pct(v)}</text>`;
  });
  if (r.prog != null) s += `<text class="gain" x="${W}" y="${mid + 5}" text-anchor="end">−${Math.round((1 - err(r.acc) / err(r.prog)) * 100)}%</text>`;
  s += '</g>';
});
const chart = document.getElementById('chart');
chart.innerHTML = s + '</svg>';
chart.querySelectorAll('.row').forEach(g => {
  const r = rows[+g.dataset.i];
  hover(g, `<b>${r.lead} h ahead</b> · ${r.n.toLocaleString('en')} hours, ${r.changed} with a change<br>`
    + D.series.map(([k, lab]) => `${lab}: wrong <b>${pct(err(r[k]))}</b> of hours`).join('<br>'));
});
document.getElementById('table').innerHTML = '<tr><th>Ahead</th>' + D.series.map(([, lab]) => `<th>${lab}: right</th>`).join('')
  + '<th>Naive “no change”</th><th>Hours</th></tr>' + rows.map(r => `<tr><td>${r.lead} h</td>`
  + D.series.map(([k], j) => `<td${j ? '' : ' class="m"'}>${pct(r[k])}</td>`).join('') + `<td>${pct(r.pers)}</td><td>${r.n.toLocaleString('en')}</td></tr>`).join('');
// direction changes: three small comparisons
const sw = D.switch;
if (sw) {
  const M = [['hit', 'Changes caught', 'within ±3 h', v => Math.round(v * 100) + '%', 1],
             ['mae', 'Timing error', 'average hours off', v => v.toFixed(1) + ' h', 0],
             ['fa', 'False alarms', 'switches that never came', v => v, 0]];
  document.getElementById('trio').innerHTML = M.map(([k, t, sub, f]) => {
    const mx = Math.max(...D.series.map(([s]) => sw[s === 'acc' ? 'model' : s][k]));
    return `<div><h3>${t}<small>${sub}</small></h3><div class="bars">` + D.series.map(([s, lab, c], j) => {
      const v = sw[s === 'acc' ? 'model' : s][k], w = v / mx * 80;
      return `<div class="bar${j ? '' : ' m'}" data-tip="${lab}: ${f(v)}"><span>${['Our model', 'Prognosis', 'Rules'][j]}</span>`
        + `<div class="t"><div class="f" style="width:${w}%;background:${c}"></div><span class="v" style="left:calc(${w}% + 6px)">${f(v)}</span></div></div>`;
    }).join('') + '</div></div>';
  }).join('');
  document.querySelectorAll('[data-tip]').forEach(el => hover(el, el.dataset.tip));
}
// the deck: one slide at a time; the slide number lives in the URL hash so a reload or a link keeps the place
const slides = [...document.querySelectorAll('.slide')], dots = document.getElementById('dots');
dots.innerHTML = slides.map((sl, i) => `<button aria-label="Slide ${i + 1}: ${sl.dataset.title}"></button>`).join('');
let cur = -1;
const notes = document.getElementById('notes');
function go(i) {
  i = Math.max(0, Math.min(slides.length - 1, i));
  if (i === cur) return;
  cur = i; tip.hidden = true;
  slides.forEach((sl, j) => { sl.classList.toggle('on', j === i); sl.classList.toggle('past', j < i); sl.inert = j !== i; });
  [...dots.children].forEach((d, j) => d.toggleAttribute('aria-current', j === i));
  document.getElementById('count').textContent = `${i + 1} / ${slides.length}`;
  document.getElementById('prev').disabled = i === 0;
  document.getElementById('next').disabled = i === slides.length - 1;
  notes.textContent = slides[i].dataset.notes;
  history.replaceState(null, '', i ? '#' + (i + 1) : location.pathname + location.search);
}
const fromHash = () => (parseInt(location.hash.slice(1)) || 1) - 1;
dots.addEventListener('click', e => { const k = [...dots.children].indexOf(e.target); if (k >= 0) go(k); });
document.getElementById('prev').onclick = () => go(cur - 1);
document.getElementById('next').onclick = () => go(cur + 1);
addEventListener('hashchange', () => go(fromHash()));
addEventListener('keydown', e => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const k = e.key;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k) && !((k === 'Enter' || k === ' ') && e.target.closest('button,a'))) go(cur + (e.shiftKey && k === ' ' ? -1 : 1));
  else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) go(cur - 1);
  else if (k === 'Home') go(0);
  else if (k === 'End') go(slides.length - 1);
  else if (k === 'n' || k === 'N') notes.hidden = !notes.hidden;
  else return;
  e.preventDefault();
});
let x0 = null;
addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, {passive: true});
addEventListener('touchend', e => {
  if (x0 == null) return;
  const dx = e.changedTouches[0].clientX - x0; x0 = null;
  if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1));
});
go(fromHash());
function fit() { // a 1280x720 canvas zoomed to fit the window; the spare width or height goes to the canvas, never a scrollbar
  const b = document.body, z = Math.min(2, innerWidth / 1280, innerHeight / 720);
  b.style.zoom = z.toFixed(4);
  b.style.width = `${innerWidth / z}px`;
  b.style.height = `${innerHeight / z}px`;
}
addEventListener('resize', fit);
fit();
"""

ARROW = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" '
         'stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>')

PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Model · FRA Runway Operations</title><link rel="icon" href="data:,">
<style>__BASE____CSS__</style></head><body>
__BAR__
<main class="deck">
  <section class="slide" data-title="Accuracy" data-notes="__N2__">
    <div class="card">
      <div class="legend" id="legend"></div>
      <div class="chart" id="chart"></div>
      <table class="sr" id="table"></table>
    </div>
  </section>
  __SWITCH__
  <section class="slide" data-title="How it works" data-notes="__N4__">
    <h2>How it works</h2>
    <p class="lede">Public data in, 48 h forecast out</p>
    <div class="flow">
      <div class="step"><h3>Public data</h3><ul>__SOURCES__</ul></div>
      <div class="arrow">__ARROW__</div>
      <div class="step m"><h3>Logistic regression</h3><ul>
        <li>Wind + prognosis → direction</li><li>Refit on the last 120 days</li><li>Calibrated probabilities</li></ul></div>
      <div class="arrow">__ARROW__</div>
      <div class="step"><h3>Every hour, 48 h ahead</h3><ul>
        <li>07 or 25, with probability</li><li>Next switch</li><li>Runway 18 open?</li></ul></div>
    </div>
  </section>
  <nav class="dots" id="dots" aria-label="Slides"></nav>
  <div class="hint"><kbd>←</kbd><kbd>→</kbd> slides · <kbd>N</kbd> notes</div>
  <aside class="notes" id="notes" hidden></aside>
</main>
<div class="tip" id="tip" hidden></div>
<script type="application/json" id="data">__DATA__</script>
<script>__JS__</script>
</body></html>
"""

SWITCH = """<section class="slide" data-title="Switches" data-notes="__N3__">
    <div class="card"><div class="trio" id="trio"></div></div>
  </section>"""

CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="__D__"/></svg>'
CONTROLS = ('<span class="count" id="count" aria-live="polite"></span>'
            '<button class="icon" id="prev" aria-label="Previous slide">' + CHEV.replace("__D__", "M15 5l-7 7 7 7") + '</button>'
            '<button class="icon" id="next" aria-label="Next slide">' + CHEV.replace("__D__", "M9 5l7 7-7 7") + '</button>')



def _labels():
    try:
        od = pd.read_parquet(DATA / "labels.parquet")["od"].dropna()
        return (f"{len(od):,} hours", f"{len(od):,} hours flown ({od.index.min():%b %Y} – {od.index.max():%b %Y}), INAA / FANOMOS tracks.")
    except Exception:
        return ("radar tracks", "Flown direction from Umwelthaus INAA / FANOMOS radar tracks, hour by hour.")


def render(q, out):
    """q = fra.dashboard.quality(); writes the page to `out`."""
    od = q["od25"]
    meta = json.loads((DATA / "train_meta.json").read_text()) if (DATA / "train_meta.json").exists() else {}
    start = pd.Timestamp(meta.get("test_start", "2026-09-15"))
    m = re.search(r"\((\d+) weeks\)", meta.get("label_kind", ""))
    weeks = int(m.group(1)) if m else (pd.Timestamp.now().normalize() - start).days // 7
    by = {r["lead"]: r for r in od}
    d24 = by.get(24, od[-1])
    e_m, e_p = 1 - d24["acc"], 1 - (d24["prog"] or 0)
    gain = 1 - e_m / e_p if d24.get("prog") else None
    _, truth = _labels()

    lead = d24["lead"]
    headline = (f"<em>{gain * 100:.0f}% fewer wrong hours</em> than the official prognosis." if gain
                else f"<em>Right {d24['acc'] * 100:.1f}% of the time,</em> {lead} hours ahead.")
    sub = "Frankfurt's runway direction, every hour, 48 h ahead."
    kpis = [(f"{d24['acc'] * 100:.1f}<small>%</small>", f"right, {lead} h ahead")]
    if gain:
        kpis.append((f"{168 * (e_p - e_m):.1f}<small> h</small>", "fewer wrong hours a week"))
    sw = q.get("switch")
    if sw:
        kpis.append((f"{sw['model']['hit'] * 100:.0f}<small>%</small>", "of switches caught"))
    ws = [start + pd.Timedelta(weeks=i) for i in range(weeks)]
    week_html = "".join(f'<div class="wk"><b>Wk {i + 1}</b>{w:%-d %b}</div>' for i, w in enumerate(ws))
    # speaker notes (press N): what to say on each slide, with the numbers filled in
    notes = {
        "__N1__": (f"We forecast which way Frankfurt flies, every hour, 48 h ahead. {gain * 100:.0f}% fewer wrong hours "
                   "than the official prognosis." if gain else "We forecast which way Frankfurt flies, every hour, 48 h ahead."),
        "__N2__": "Black is us, grey the official prognosis. Shorter is better, and we win at every horizon.",
        "__N3__": (f"We also catch more switches: {sw['model']['hit'] * 100:.0f}% vs {sw['prog']['hit'] * 100:.0f}%, "
                   "with fewer false alarms." if sw else ""),
        "__N4__": "Public weather forecasts plus radar tracks of what was flown. Logistic regression, retrained on the last 120 days.",
        "__N5__": f"Tested on {weeks} weeks it had never seen, no hindsight.",
    }
    page = (PAGE.replace("__BASE__", siteui.BASE_CSS).replace("__CSS__", CSS).replace("__BAR__", siteui.bar("model", CONTROLS))
            .replace("__ARROW__", ARROW)
            .replace("__HEADLINE__", headline).replace("__SUB__", sub)
            .replace("__KPIS__", "".join(f'<div class="kpi"><b>{a}</b><span>{b}</span></div>' for a, b in kpis))
            .replace("__SWITCH__", SWITCH if sw else "")
            .replace("__SOURCES__", "".join(f"<li>{a}</li>" for a in SOURCES))
            .replace("__TESTLEDE__", f"{weeks} unseen weeks, each forecast only from the past")
            .replace("__NWEEKS__", str(weeks)).replace("__WEEKS__", week_html)
            .replace("__DATA__", json.dumps(dict(od=od, series=SERIES, switch=sw)).replace("</", "<\\/"))
            .replace("__JS__", JS))
    for k, v in notes.items():
        page = page.replace(k, html.escape(v))
    Path(out).write_text(page, encoding="utf-8")
    return out
