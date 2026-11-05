// Smoke check: loads both pages at 1440 and 390 and exits non-zero on any page error or console error.
// node web/check.mjs   (run after every change to the site generators)
import { chromium } from 'playwright-core';
import { homedir } from 'os';
import { statSync, readdirSync } from 'fs';
const TAGS = [], WEST = [], NIGHTRO = [], TAGBG = [], TAGBGD = [];
const PAGES = ['index.html', 'airport3d.html'], SIZES = [[1440, 900], [390, 844], [1280, 800], [1600, 900], [1366, 768], [1920, 1080]], OVER = [[1280, 800], [1600, 900], [390, 844]];
// clipped text (an element whose own text is wider than its box and overflow is not visible), and a timeline plot that runs past its card's bottom padding
const overflowProbe = () => {
  const out = [], vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el) || !el.childNodes.length || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el); if (cs.overflowX === 'visible' && cs.textOverflow !== 'ellipsis') continue; if (cs.overflowX === 'auto' || cs.overflowX === 'scroll') continue;
    if (el.scrollWidth > el.clientWidth + 1) out.push(`clipped text "${el.textContent.trim().slice(0, 40)}" (${el.scrollWidth} > ${el.clientWidth})`);
  }
  { const a = document.querySelector('#lod'), b = document.querySelector('#lpg'), z = parseFloat(document.body.style.zoom) || 1; // the 48 h chart: no dead band between the direction bar and the chance plot (phones carry the row name in that gap)
    if (innerWidth >= 480 && a && b && vis(a) && vis(b)) { const gap = (b.getBoundingClientRect().top - a.getBoundingClientRect().bottom) / z; if (gap > 20) out.push(`direction bar to chance plot: ${Math.round(gap)} px (> 20)`); } }
  if (innerWidth >= 640) { // row names centred on their plots (text centre within 3 px)
    const z = parseFloat(document.body.style.zoom) || 1, tc = el => { const rg = document.createRange(); rg.selectNodeContents(el); const rs = [...rg.getClientRects()].filter(q => q.height); if (!rs.length) return null; return (Math.min(...rs.map(q => q.top)) + Math.max(...rs.map(q => q.bottom))) / 2; };
    for (const [l, p] of [['.hl[style*="grid-row:3"]', '#lod'], ['#hlsw', '#lpg'], ['.hl[style*="grid-row:6"]', '#lwd'], ['#dir-l', '#segs'], ['#risk-l', '#risk']]) { const a = document.querySelector(l), b = document.querySelector(p); if (!a || !b || !vis(a) || !vis(b) || a.hidden) continue;
      const c = tc(a), r = b.getBoundingClientRect(); if (c !== null && Math.abs(c - (r.top + r.bottom) / 2) / z > 3) out.push(`row name ${l} is ${Math.round((c - (r.top + r.bottom) / 2) / z)} px off its plot's centre`); } }
  if (innerWidth >= 900 && document.querySelector('#answer')) { const f = document.querySelector('.pfoot, footer'); if (f && f.getBoundingClientRect().bottom > innerHeight + 0.5) out.push(`the dashboard runs past the window (footer ${Math.round(f.getBoundingClientRect().bottom - innerHeight)} px below)`); } // one screen
  { const t = document.getElementById('tlf'); if (t && innerWidth >= 1280 && t.children.length) { const rows = new Set([...t.children].map(e => Math.round(e.getBoundingClientRect().top))).size; if (rows > 1) out.push(`the 48 h legend wraps to ${rows} rows`); } } // one legend row on desktop
  { const chip = document.querySelector('#lod .swchip, .lanes > .swchip, #track .swchip'); if (chip && chip.offsetWidth) { const c = chip.getBoundingClientRect(); for (const t of document.querySelectorAll('#lod .pgtag, #pgl')) { if (t.hidden || !t.offsetWidth) continue; const r = t.getBoundingClientRect(); if (r.right > c.left + 0.5 && r.left < c.right - 0.5 && r.bottom > c.top && r.top < c.bottom) out.push(`the official tag runs into the switch chip`); } } } // tag vs chip
  { const n = document.querySelector('#pkl text, #rpk'); if (n && vis(n) && n.textContent.trim() && getComputedStyle(n).opacity !== '0') { const q = n.getBoundingClientRect(); // the peak note never sits on a bar
      for (const b of document.querySelectorAll('#lpg > div > i, #risk rect')) { const r = b.getBoundingClientRect(); if (r.height > 1.5 && r.right > q.left + 1 && r.left < q.right - 1 && r.bottom > q.top + 1 && r.top < q.bottom - 1) { out.push(`the peak note overlaps a bar`); break; } } } }
  { for (const [row, kids] of [['#lod', '#lod > div, #lod > .swtab'], ['#segs', '#segs > i']]) { const R = document.querySelector(row); if (!R || !R.offsetWidth) continue; const end = R.getBoundingClientRect().right; // the direction bar never runs past the axis end
      for (const k of document.querySelectorAll(kids)) { const q = k.getBoundingClientRect(); if (q.width && q.right > end + 0.5) { out.push(`the direction bar runs ${Math.round(q.right - end)} px past the axis end`); break; } } } }
  { // every runway tag sits nearest its own runway (2D map and 3D view)
    const segD = (p, a, b) => { const vx = b[0] - a[0], vy = b[1] - a[1], f = Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / (vx * vx + vy * vy || 1))); return Math.hypot(p[0] - a[0] - vx * f, p[1] - a[1] - vy * f); };
    const lines = [...document.querySelectorAll('#map line.rwy')].map(l => { const sv = l.ownerSVGElement, m = sv.getScreenCTM(), P = (x, y) => { const pt = sv.createSVGPoint(); pt.x = x; pt.y = y; const q = pt.matrixTransform(m); return [q.x, q.y]; }; return [l.dataset.des, P(+l.getAttribute('x1'), +l.getAttribute('y1')), P(+l.getAttribute('x2'), +l.getAttribute('y2'))]; });
    for (const t of document.querySelectorAll('#map .rwt:not(.rwt11)')) { const q = t.getBoundingClientRect(), c = [q.left + q.width / 2, q.top + q.height / 2]; if (!lines.length) break; const best = lines.reduce((a, l) => (segD(c, l[1], l[2]) < segD(c, a[1], a[2]) ? l : a)); if (best[0] !== t.textContent.trim()) { out.push(`the map's "${t.textContent.trim()}" plate sits nearest runway ${best[0]}`); break; } }
    const F = window.__fra; if (F && F.rwScreen) {
      const rw = F.rwScreen();
      for (const t of document.querySelectorAll('.lbl.rwy')) { if (t.style.display === 'none' || !t.textContent.trim()) continue; const q = t.getBoundingClientRect(); if (!q.width) continue; const c = [q.left + q.width / 2, q.top + q.height / 2], best = rw.reduce((a, r) => (segD(c, r[1], r[2]) < segD(c, a[1], a[2]) ? r : a)); if (!best[0].includes(t.textContent.trim())) { out.push(`the 3D "${t.textContent.trim()}" tag sits nearest another runway`); break; } } } }
  { // bars under the official wash stay visible: contrast >= 2:1 against the washed plot
    const rgba = c => { const m = /rgba?\(([^)]+)\)/.exec(c || ''); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
    const over = (f, b, a) => [0, 1, 2].map(i => f[i] * a + b[i] * (1 - a)), lum = c => { const v = c.map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
    const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
    const wash = document.querySelector('#lpg .pgwash, #pgwash'), card = document.querySelector('.tlc, .dock');
    if (wash && card && vis(wash) && getComputedStyle(wash).display !== 'none') { const W = wash.getBoundingClientRect(), cs = getComputedStyle(wash), wc = rgba(wash.tagName === 'rect' ? cs.fill : cs.backgroundColor), bg = rgba(getComputedStyle(card).backgroundColor);
      if (wc && bg) { const washed = over(wc, bg, wc[3] * (parseFloat(cs.opacity) || 1));
        for (const b of document.querySelectorAll('#lpg > div > i, #risk rect')) { const r = b.getBoundingClientRect(); if (r.height < 3 || r.left < W.left || r.right > W.right || b.classList.contains('nt')) continue; /* night bars are muted on purpose */ const bc = getComputedStyle(b), col = rgba(b.tagName === 'rect' ? bc.fill : bc.backgroundColor); if (!col) continue;
          const op = (parseFloat(bc.opacity) || 1) * (parseFloat(b.getAttribute('opacity')) || 1) * col[3], fg = over(col, washed, op); if (cr(fg, washed) < 2) { out.push(`a bar under the official wash has contrast ${cr(fg, washed).toFixed(2)}:1 (< 2)`); break; } } } } }
  { // every "if switched" swatch is drawn in exactly the colour (and opacity) of its lines on the map
    const sw = document.querySelector('#mlggh:not([hidden]) path'), ln = document.querySelector('#map .gapp');
    if (sw && ln) { const a = getComputedStyle(sw), b = getComputedStyle(ln); if (a.stroke !== b.stroke || Math.abs(parseFloat(a.opacity) - parseFloat(b.opacity)) > 0.01) out.push(`the "if switched" swatch (${a.stroke} @${a.opacity}) differs from its map lines (${b.stroke} @${b.opacity})`); }
    const g3 = document.querySelector('.row.mapkey .plk.gh'); if (g3) { const app = document.getElementById('app'), tok = getComputedStyle(app).getPropertyValue('--' + g3.dataset.tok).trim(), c = getComputedStyle(g3).borderTopColor, hex = tok.replace('#', ''), rgb = `rgb(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)})`;
      if (c !== rgb || Math.abs(parseFloat(getComputedStyle(g3).opacity) - 0.6) > 0.01) out.push(`the 3D "if switched" swatch (${c} @${getComputedStyle(g3).opacity}) differs from its map lines (${rgb} @0.6)`); } }
  { // no visible tick or day label under the Official tag or the hover pill
    const shown = el => { const cs = getComputedStyle(el); return vis(el) && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.05 && !el.closest('.off'); };
    const blocks = [...document.querySelectorAll('#lod .pgtag, #phl, #pgl, #bubble, #ph, #knob')].filter(e => vis(e) && getComputedStyle(e).visibility !== 'hidden' && !e.closest('[hidden]')).map(e => [e, e.getBoundingClientRect()]);
    for (const l of document.querySelectorAll('#ruler .h, #ruler .d, #ticks span.hr, #ticks span.day')) { if (!shown(l) || l.classList.contains('off') || l.classList.contains('near')) continue; const r = l.getBoundingClientRect();
      for (const [e, q] of blocks) { if ((e.id === 'ph' || e.id === 'knob') && !/\b(h|hr)\b/.test(l.className)) continue; /* the cursor line: hour labels only */ const m = (e.id === 'phl' || e.id === 'bubble') && /\b(h|hr)\b/.test(l.className) ? 6 : -1; /* hour ticks: 4 px clear of the hover pill */ if (r.right > q.left - m && r.left < q.right + m && r.bottom > q.top + 1 && r.top < q.bottom - 1) out.push(`tick label "${l.textContent}" under ${e.id || e.className}`); } } }
  for (const [plot, card] of [['#lpg', '.tlc'], ['#lwd', '.tlc'], ['#risk', '.dock'], ['#segs', '.dock']]) {
    const a = document.querySelector(plot), c = document.querySelector(card); if (!a || !c || !vis(a)) continue;
    const pb = parseFloat(getComputedStyle(c).paddingBottom) || 0, ab = a.getBoundingClientRect().bottom, cb = c.getBoundingClientRect().bottom - pb + 1;
    if (ab > cb) out.push(`${plot} runs ${Math.round(ab - cb)} px past ${card}'s bottom padding`);
    if (card === '.dock' && innerWidth >= 640) { const rl = document.querySelector('.rail'); if (rl && rl.scrollHeight > rl.clientHeight + 1) out.push(`the 3D panel scrolls (${rl.scrollHeight} > ${rl.clientHeight})`);  /* no double dividers: two horizontal rules (>100 px wide) within 6 px of each other */
      if (rl) { const ys = []; for (const e of rl.querySelectorAll('*')) { const r = e.getBoundingClientRect(); if (!r.height && !r.width) continue;
          for (const ps of [null, '::before', '::after']) { const c = getComputedStyle(e, ps); if (ps && c.content === 'none') continue; const wd = ps ? parseFloat(c.width) || 0 : r.width; if (wd < 100) continue;
            if (parseFloat(c.borderTopWidth) > 0 && c.borderTopStyle !== 'none') ys.push(ps ? r.top + (parseFloat(c.top) || 0) : r.top);
            if (parseFloat(c.borderBottomWidth) > 0 && c.borderBottomStyle !== 'none') ys.push(ps ? r.top + (parseFloat(c.top) || 0) + parseFloat(c.height || 0) : r.bottom); } }
        ys.sort((a, b) => a - b); for (let i = 1; i < ys.length; i++) if (ys[i] - ys[i - 1] < 6) out.push(`double divider in the 3D panel at y=${Math.round(ys[i])}`); } }
    if (card === '.dock' && c.getBoundingClientRect().bottom > innerHeight + 1) out.push(`${card} runs ${Math.round(c.getBoundingClientRect().bottom - innerHeight)} px below the window`);
  }
  return out;
};
const browser = await chromium.launch({ executablePath: `${homedir()}/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`, args: ['--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
const errors = [];
{ // a failed build leaves an old bundle in place: the sources must not be newer than dist/app.js
  const here = new URL('.', import.meta.url).pathname, bundle = statSync(`${here}dist/app.js`).mtimeMs;
  for (const f of readdirSync(`${here}src`)) if (statSync(`${here}src/${f}`).mtimeMs > bundle) errors.push(`web/src/${f} is newer than web/dist/app.js: run npm run build`); }
for (const pg of PAGES) for (const [w, h] of SIZES) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on('pageerror', e => errors.push(`${pg} ${w}: pageerror ${e.message}`));
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.g(oogleapis|static)|live\.json|alerts\.json|live_record\.json|ERR_FILE_NOT_FOUND|ERR_INTERNET_DISCONNECTED|ERR_NAME_NOT_RESOLVED/.test(m.text())) errors.push(`${pg} ${w}: console ${m.text()}`); });
  await page.goto(new URL(`../site/${pg}`, import.meta.url).href);
  await page.waitForTimeout(pg.includes('3d') ? 3000 : 1200);
  if (OVER.some(([ow, oh]) => ow === w && oh === h)) {
    errors.push(...(await page.evaluate(overflowProbe)).map(m => `${pg} ${w}: ${m}`));
    const keyBox = () => page.evaluate(() => { const k = document.querySelector('.mapov'); if (!k) return null; const r = k.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(v => Math.round(v)).join(','); }), key0 = pg.includes('3d') && w >= 640 ? await keyBox() : null;
    for (const f of [0.1, 0.5, 0.85, 0.97]) { // hovering hours (a night hour near the end), where the hero and readouts change
      const r = await page.evaluate(s => { const b = document.querySelector(s)?.getBoundingClientRect(); return b && [b.left, b.top, b.width, b.height]; }, pg.includes('3d') ? '#track' : '#lod');
      if (!r) continue; await page.mouse.move(r[0] + r[2] * f, r[1] + r[3] / 2); await page.waitForTimeout(400);
      errors.push(...(await page.evaluate(overflowProbe)).map(m => `${pg} ${w} hover ${f}: ${m}`));
      if (key0) { const k1 = await keyBox(); if (k1 !== key0) errors.push(`${pg} ${w} hover ${f}: the map key moved (${key0} -> ${k1})`); }
    }
    if (pg.includes('3d') && w >= 640) { const d = await page.evaluate(() => window.__fra?.depTips?.()); // take-off arrow tips: 24 px inside the free viewport
      if (d) for (const [x, y] of d.tips) if (x < d.free[0] + 24 || x > d.free[2] - 24 || y < d.free[1] + 24 - 48 || y > d.free[3] - 24 + 24) errors.push(`${pg} ${w}: a take-off arrow tip at ${Math.round(x)},${Math.round(y)} is within 24 px of the free viewport's edge`); }
    { const r = await page.evaluate(s => { const b = document.querySelector(s)?.getBoundingClientRect(); return b && [b.left, b.top, b.width, b.height]; }, pg.includes('3d') ? '#track' : '#lod');
      if (r) for (let i = 0; i < 48; i += 3) { // every 3rd hour, pinned: the pill never sits on a tick or day label
        await page.mouse.click(r[0] + r[2] * (i + 0.5) / 48, r[1] + r[3] / 2); await page.mouse.move(r[0] + r[2] * (i + 0.5) / 48, r[1] + r[3] / 2); await page.waitForTimeout(300);
        errors.push(...(await page.evaluate(overflowProbe)).filter(m => m.startsWith('tick label')).map(m => `${pg} ${w} hover hour ${i}: ${m}`));
        const far = await page.evaluate(() => { const z = parseFloat(document.body.style.zoom) || parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1; for (const l of document.querySelectorAll('#ruler .d, #ticks span.day')) { const t = l.style.translate; const m = /(-?[\d.]+)px/.exec(t || ''); const cs = getComputedStyle(l); if (m && Math.abs(+m[1]) * (l.closest('#ruler') ? 1 : 1 / z) > 61 && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.05 && !l.classList.contains('near')) return `${l.textContent} moved ${Math.round(+m[1])} px`; } return null; });
        if (far) errors.push(`${pg} ${w} hover hour ${i}: a day label is nudged over 60 px from its divider (${far})`);
        const cross = await page.evaluate(() => { const lg = document.querySelector('#tlf, #dkey'); if (!lg || !lg.offsetWidth || lg.classList.contains('inbar')) return null; /* phones: the legend sits on an opaque layer above the line */ const L = lg.getBoundingClientRect(); // the cursor line stops above the legend
          for (const el of document.querySelectorAll('#ph, .thumb-knob, #knob, .knob')) { if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') continue; for (const ps of [null, '::before', '::after']) { const c = getComputedStyle(el, ps); if (ps && c.content === 'none') continue; if (c.display === 'none' || c.visibility === 'hidden') continue;
            const r = el.getBoundingClientRect(), top = ps ? r.top + (parseFloat(c.top) || 0) : r.top, bot = ps ? (c.bottom !== 'auto' ? r.bottom - (parseFloat(c.bottom) || 0) : top + parseFloat(c.height || 0)) : r.bottom;
            if (bot > L.top + 1 && top < L.bottom && r.left < L.right && r.right > L.left - 2) return `${el.id || el.className}${ps || ''} reaches ${Math.round(bot)} > legend ${Math.round(L.top)}`; } } return null; });
        if (cross) errors.push(`${pg} ${w} hover hour ${i}: cursor line runs into the legend (${cross})`); } }
    await page.mouse.move(2, h - 2); await page.waitForTimeout(400);
  }
  if (w >= 1280) { const rows = await page.evaluate(() => { const z = parseFloat(document.body.style.zoom) || 1, out = []; // every timeline row's drawing has the row's height
      for (const id of ['lpg', 'lwd']) { const e = document.getElementById(id), sv = e && e.querySelector('svg'); if (e && sv && e.offsetHeight && Math.abs(+sv.getAttribute('height') - e.clientHeight) > 1) out.push(`#${id} row ${e.clientHeight} px, drawing ${sv.getAttribute('height')} px`); }
      const r = document.getElementById('risk'); if (r && r.getAttribute('viewBox') && r.getBoundingClientRect().height) { const vb = +r.getAttribute('viewBox').split(' ')[3], hz = parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1, hh = r.getBoundingClientRect().height / hz; if (Math.abs(vb - hh) > 1) out.push(`#risk row ${Math.round(hh)} px, drawing ${vb} px`); }
      return out; });
    errors.push(...rows.map(m => `${pg} ${w}x${h}: ${m}`)); }
  { const tt = await page.evaluate(() => [...document.querySelectorAll('#lod .pgtag, #pgl')].filter(e => !e.hidden && e.offsetWidth).map(e => (e.title.match(/\w{3} \d\d:00 to \w{3} \d\d:00/) || [''])[0])); TAGS.push([`${pg} ${w}`, tt.join(' + ')]); }
  { const c = await page.evaluate(() => { const t = [...document.querySelectorAll('#lod .pgtag, #pgl')].find(e => !e.hidden && e.offsetWidth); if (!t) return null; const cs = getComputedStyle(t), p = x => (x.match(/[\d.]+/g) || []).slice(0, 3).map(Number), lum = c => { const v = c.map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; }, a = lum(p(cs.backgroundColor)), b = lum(p(cs.color)); return [cs.backgroundColor, (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)]; });
    if (c) { TAGBG.push([`${pg} ${w}`, c[0]]); if (c[1] < 4.5) errors.push(`${pg} ${w}: the official tag's text contrast is ${c[1].toFixed(2)}:1 (< 4.5)`); } } // one tag colour on both pages, readable // the official windows, one list for every page and size
  { const m = await page.evaluate(() => { // the predicted switch: a segment >= 24 px with its chip
      const want = (typeof D !== 'undefined' && D && D.change) || (window.__fra && (() => { const st = window.__fra.state, hs = st.run.hours, c0 = Math.max(0, Math.min(hs.length - 1, Math.floor((Date.now() - Date.parse(hs[0].t)) / 36e5))); return hs.some((h, q) => q > c0 && h.od !== hs[c0].od); })());
      if (!want) return null; const chip = document.querySelector('#lod .swchip, .lanes > .swchip, #track .swchip'); if (!chip || !chip.offsetWidth) return 'the predicted switch has no chip';
      const tab = document.querySelector('#lod .swtab, #segs .swtab'); if (tab && tab.getBoundingClientRect().width < 23.5 * (parseFloat(document.body.style.zoom) || parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1) * 0.99) return 'the switch segment is under 24 px'; return null; });
    if (m) errors.push(`${pg} ${w}: ${m}`); }
  { const r = await page.evaluate(s => { const b = document.querySelector(s)?.getBoundingClientRect(); return b && b.width ? [b.left, b.top, b.width, b.height] : null; }, pg.includes('3d') ? '#track' : '#lod'); // every size: a pinned cursor never runs through a tag (Official, "to 25")
    if (r) { for (const i of [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 44, 46, 47]) { await page.mouse.click(r[0] + r[2] * (i + 0.5) / 48, r[1] + r[3] / 2); await page.mouse.move(2, h - 2); await page.waitForTimeout(220);
        const m = await page.evaluate(() => { const ph = document.getElementById('ph'), kn = document.getElementById('knob'), z = parseFloat(document.body.style.zoom) || 1; let x, top;
          if (ph) { const r = ph.getBoundingClientRect(); x = r.left; top = r.top + (parseFloat(getComputedStyle(ph).getPropertyValue('--lt')) || 0) * z; } else if (kn) { const r = kn.getBoundingClientRect(); x = r.left + r.width / 2; top = r.top; } else return null;
          for (const t of document.querySelectorAll('#lod .pgtag, .lanes > .swchip, #lod .swchip, #pgl, #track .swchip')) { if (t.hidden || !t.offsetWidth) continue; const q = t.getBoundingClientRect(); if (x > q.left + 1 && x < q.right - 1 && top < q.bottom - 1) return `the cursor runs through the tag "${t.textContent.trim()}"`; } return null; });
        if (m) { errors.push(`${pg} ${w}x${h} pin hour ${i}: ${m}`); break; } }
      await page.keyboard.press('Escape').catch(() => {}); } }
  const blank = await page.evaluate(p => (p.includes('3d') ? !document.querySelector('#dir')?.textContent.trim() : !document.querySelector('#answer')?.textContent.trim()), pg);
  if (blank) errors.push(`${pg} ${w}: the answer did not render`);
  await page.close();
}
for (const [pg, w, h, kind] of [['index.html', 1440, 900, 'west'], ['airport3d.html', 1440, 900, 'west'], ['airport3d.html', 390, 844, 'night'], ['airport3d.html', 1440, 900, 'westpin'], ['airport3d.html', 390, 844, 'westpin'], ['index.html', 390, 844, 'night'], ['index.html', 390, 844, 'westpin'], ['index.html', 390, 844, 'title'], ['airport3d.html', 390, 844, 'title'], ['index.html', 1440, 900, 'night'], ['airport3d.html', 1440, 900, 'night']]) { // states the main pass misses: a West hour hovered, a night hour pinned on the phone
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on('pageerror', e => errors.push(`${pg} ${w} ${kind}: pageerror ${e.message}`));
  await page.goto(new URL(`../site/${pg}`, import.meta.url).href); await page.waitForTimeout(pg.includes('3d') ? 3000 : 1200);
  const hrs = await page.evaluate(() => (typeof D !== 'undefined' && D ? H.slice(off, off + span) : window.__fra.state.run.hours).map(x => [x.od, +new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', hourCycle: 'h23' }).format(new Date(x.t))]));
  const k = kind === 'title' ? 2 : kind.startsWith('west') ? hrs.findIndex(x => x[0] === 25) : hrs.findIndex((x, i) => i > 2 && (x[1] >= 23 || x[1] < 5));
  if (k >= 0) { const r = await page.evaluate(s => { const b = document.querySelector(s).getBoundingClientRect(); return [b.left, b.top, b.width, b.height]; }, pg.includes('3d') ? '#track' : '#lod');
    const x = r[0] + r[2] * (k + 0.5) / hrs.length, y = r[1] + r[3] / 2;
    if (kind === 'night' || kind === 'westpin' || kind === 'title') { await page.mouse.click(x, y); await page.mouse.move(5, 5); } else await page.mouse.move(x, y);
    await page.waitForTimeout(pg.includes('3d') && kind.startsWith('west') ? 3000 : 900); // the camera flies to the West frame
    errors.push(...(await page.evaluate(overflowProbe)).map(m => `${pg} ${w} ${kind} hour ${k}: ${m}`));
    const bk = await page.evaluate(() => { const b = document.querySelector('#dback, #back'); if (!b || getComputedStyle(b).visibility === 'hidden' || !b.offsetWidth) return null; const q = b.getBoundingClientRect(); for (const e of document.querySelectorAll('#ticks span, #ruler span, .nowtick')) { const r = e.getBoundingClientRect(); if (r.width && e.offsetParent && r.right > q.left && r.left < q.right && r.bottom > q.top && r.top < q.bottom && getComputedStyle(e).visibility !== 'hidden') return `"Back to now" overlaps "${e.textContent}"`; } return null; });
    if (bk) errors.push(`${pg} ${w} ${kind}: ${bk}`); }
  if (k >= 0 && pg.includes('3d') && w < 640 && kind !== 'west' && await page.evaluate(() => getComputedStyle(document.getElementById('dback')).visibility !== 'hidden')) { /* only when the pin is off the current hour */ await page.waitForFunction(() => /forecast for/.test(document.querySelector('.sb0')?.textContent || ''), null, { timeout: 4000 }).catch(() => {}); const eb = await page.evaluate(() => document.querySelector('.sb0')?.textContent || ''); /* waited for the pin to reach the eyebrow */ if (!/forecast for/.test(eb)) errors.push(`${pg} ${w} ${kind}: the phone eyebrow does not name the pinned hour ("${eb}")`); }
  if (kind === 'night' && k >= 0) NIGHTRO.push([`${pg} ${w}`, await page.evaluate(() => (document.getElementById('oduse') || document.getElementById('dro')).textContent.replace(/\s+/g, ' ').trim())]);
  if (w < 640 && k >= 0) { const m = await page.evaluate(() => { // phones, pinned: the cursor line never runs through a row title (it breaks behind each one)
      const ln = document.getElementById('ph') || document.getElementById('knob'); if (!ln) return null; const lr = ln.getBoundingClientRect(), x = lr.left + lr.width / 2, z = parseFloat(document.body.style.zoom) || 1;
      const lt = ln.id === 'ph' ? (parseFloat(getComputedStyle(ln).getPropertyValue('--lt')) || 0) : 0, mk = getComputedStyle(ln).getPropertyValue('--mk'), gaps = [...mk.matchAll(/transparent ([\d.-]+)px,transparent ([\d.-]+)px/g)].map(g => [+g[1], +g[2]]);
      for (const t of document.querySelectorAll('#tl .hl, .dock .rowlbl > span')) { if (t.hidden || !t.offsetWidth) continue; const r = t.getBoundingClientRect(); if (!(x > r.left && x < r.right)) continue; const a = (r.top - lr.top) / z - lt, b = (r.bottom - lr.top) / z - lt; if (b < 0) continue;
        if (!gaps.some(([g0, g1]) => g0 <= a + 1 && g1 >= b - 1)) return `the cursor crosses the row title "${t.textContent.trim().slice(0, 20)}"`; } return null; });
    if (m) errors.push(`${pg} ${w} ${kind}: ${m}`); }
  if (k >= 0 && kind.startsWith('west')) { const t = await page.evaluate(() => { const names = [...document.querySelectorAll('#mlgtowns .tk, .row.mapkey .tkey')].map(e => e.textContent.replace(/^\d+/, '').trim()); const discs = [...document.querySelectorAll('.lbl.town.num')].filter(e => e.style.display !== 'none' && (e.querySelector('i') || e).getBoundingClientRect().width).length; return { names, discs, three: !!window.__fra }; });
    WEST.push(`${pg}:${t.names.join(',')}`); if (t.three && t.discs < t.names.length) errors.push(`${pg} ${w} ${kind}: the key lists ${t.names.length} towns, ${t.discs} drawn`); }
  if (kind === 'westpin' && k >= 0 && pg.includes('3d')) { const v = await page.evaluate(() => { const ro = (document.getElementById('dro')?.textContent.match(/(\d+|<1|>99)\s*%\s*chance of/) || [])[1], pn = (document.querySelector('#dir-next .kv b')?.textContent.match(/(\d+|<1|>99)\s*%/) || [])[1]; return [ro, pn]; });
    if (!v[0] || v[0] !== v[1]) errors.push(`${pg} ${w} West pin: the panel's chance (${v[1]} %) differs from the timeline readout (${v[0]} %)`); }
  await page.close();
}
for (const pg of PAGES) { // dark mode encodings: faded vs confident >= 3:1, night vs normal bars >= 1.5:1, bars under the wash >= 2:1
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(new URL(`../site/${pg}?theme=dark`, import.meta.url).href); await page.waitForTimeout(pg.includes('3d') ? 3000 : 1200);
  errors.push(...(await page.evaluate(() => { const out = [];
    const col = c => { let m = /rgba?\(([^)]+)\)/.exec(c || ''); if (m) { const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; } m = /color\(srgb ([^)]+)\)/.exec(c || ''); if (m) { const p = m[1].split(/[ \/]+/).filter(Boolean).map(Number); return [p[0] * 255, p[1] * 255, p[2] * 255, p.length > 3 ? p[3] : 1]; } return null; };
    const lum = c => { const v = c.slice(0, 3).map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; }, cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
    const bgOf = e => col(getComputedStyle(e).backgroundColor), fillOf = e => col(getComputedStyle(e).fill);
    const lo = document.querySelector('#lod .e.lo, #segs i.lo'), hi = [...document.querySelectorAll('#lod .e:not(.lo), #segs i:not(.lo)')].find(e => !e.className.includes('nb') && bgOf(e) && bgOf(e)[3] > 0.5);
    if (lo && hi) { const r = cr(bgOf(lo), bgOf(hi)); if (r < 3) out.push(`dark: faded vs confident ${r.toFixed(2)}:1 (< 3)`); }
    const nt = document.querySelector('#lpg > div > i.nt, #risk rect.nt'), nm = [...document.querySelectorAll('#lpg > div > i:not(.nt):not(.pkb), #risk rect:not(.nt)')].find(e => e.getBoundingClientRect().height > 2);
    if (nt && nm) { const a = nt.tagName === 'rect' ? fillOf(nt) : bgOf(nt), b = nm.tagName === 'rect' ? fillOf(nm) : bgOf(nm); if (a && b) { const r = cr(a, b); if (r < 1.5) out.push(`dark: night vs normal bars ${r.toFixed(2)}:1 (< 1.5)`); } }
    { const wash = document.querySelector('#lpg .pgwash, #pgwash'), card = document.querySelector('.tlc, .dock'); if (wash && card && getComputedStyle(wash).display !== 'none') { const W = wash.getBoundingClientRect(), cs = getComputedStyle(wash), wc = col(wash.tagName === 'rect' ? cs.fill : cs.backgroundColor), bg = col(getComputedStyle(card).backgroundColor);
      if (wc && bg) { const mix = (f, b, a) => [0, 1, 2].map(i => f[i] * a + b[i] * (1 - a)), washed = mix(wc, bg, wc[3]);
        for (const b of document.querySelectorAll('#lpg > div > i:not(.nt), #risk rect:not(.nt)')) { const r = b.getBoundingClientRect(); if (r.height < 3 || r.left < W.left || r.right > W.right) continue; const c = b.tagName === 'rect' ? fillOf(b) : bgOf(b); if (!c) continue; const rr = cr(mix(c, washed, c[3] * (parseFloat(getComputedStyle(b).opacity) || 1)), washed); if (rr < 2) { out.push(`dark: a bar under the wash ${rr.toFixed(2)}:1 (< 2)`); break; } } } } }
    { const t = [...document.querySelectorAll('#lod .pgtag, #pgl')].find(e => !e.hidden && e.offsetWidth); if (t) out.push('TAGBG:' + getComputedStyle(t).backgroundColor); }
    return out; })).filter(m => { if (m.startsWith('TAGBG:')) { TAGBGD.push([pg, m.slice(6)]); return false; } return true; }).map(m => `${pg} dark: ${m}`));
  await page.close();
}
{ const v = new Set(TAGBG.map(t => t[1])); if (v.size > 1) errors.push(`the official tag's colour differs: ${TAGBG.map(t => `${t[0]}: ${t[1]}`).join('; ')}`); }
for (const W of ['390', '1440']) { const g = NIGHTRO.filter(t => t[0].endsWith(' ' + W)); const v = new Set(g.map(t => t[1])); if (v.size > 1) errors.push(`the pinned night readouts differ at ${W}: ${g.map(t => `${t[0]}: ${t[1]}`).join(' | ')}`); }
{ const v = new Set(WEST.map(t => t.split(':')[1])); if (v.size > 1) errors.push(`the West-mode town lists differ: ${WEST.join(' | ')}`); }
{ const v = new Set(TAGS.map(t => t[1])); if (v.size > 1) errors.push(`the official windows differ: ${TAGS.map(t => `${t[0]}: ${t[1] || '(none)'}`).join('; ')}`); }
{ const v = new Set(TAGBGD.map(t => t[1])); if (v.size > 1) errors.push(`dark: the official tag's colour differs: ${TAGBGD.map(t => `${t[0]}: ${t[1]}`).join('; ')}`); }
await browser.close();
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`check ok: ${PAGES.length} pages x ${SIZES.length} sizes, no errors, no clipped text or plots at ${OVER.map(o => o.join('x')).join(', ')}`);
