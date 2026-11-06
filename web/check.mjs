// Smoke check: loads both pages at 1440 and 390 and exits non-zero on any page error or console error.
// node web/check.mjs   (run after every change to the site generators)
import { chromium } from 'playwright-core';
import { homedir } from 'os';
import { statSync, readdirSync } from 'fs';
import { inflateSync } from 'zlib';
// mean RGB of a small PNG screenshot (8-bit RGB/RGBA, not interlaced): samples the WebGL map, which the DOM cannot read
const pngMean = buf => { let o = 8, w, h, ct; const idat = []; while (o < buf.length) { const n = buf.readUInt32BE(o), t = buf.toString('ascii', o + 4, o + 8), d = buf.subarray(o + 8, o + 8 + n); if (t === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); ct = d[9]; } if (t === 'IDAT') idat.push(d); o += 12 + n; }
  const bpp = ct === 6 ? 4 : 3, raw = inflateSync(Buffer.concat(idat)), st = w * bpp, px = Buffer.alloc(st * h);
  for (let y = 0; y < h; y++) { const f = raw[y * (st + 1)]; for (let x = 0; x < st; x++) { const v = raw[y * (st + 1) + 1 + x], a = x >= bpp ? px[y * st + x - bpp] : 0, b = y ? px[(y - 1) * st + x] : 0, c = x >= bpp && y ? px[(y - 1) * st + x - bpp] : 0, q = a + b - c, pa = Math.abs(q - a), pb = Math.abs(q - b), pc = Math.abs(q - c);
    px[y * st + x] = (v + [0, a, b, (a + b) >> 1, pa <= pb && pa <= pc ? a : pb <= pc ? b : c][f]) & 255; } }
  const m = [0, 0, 0]; for (let i = 0; i < w * h; i++) for (let k = 0; k < 3; k++) m[k] += px[i * bpp + k] / (w * h); return m; };
const lumN = c => { const v = c.map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
const TAGS = [], WEST = [], NIGHTRO = [], TAGBG = [], TAGBGD = [], HDR = {}, TLH = {};
const PAGES = ['index.html', 'airport3d.html'], SIZES = [[1440, 900], [390, 844], [1280, 800], [1600, 900], [1366, 768], [1920, 1080]], OVER = [[1280, 800], [1600, 900], [390, 844], [1366, 768]];
// clipped text (an element whose own text is wider than its box and overflow is not visible), and a timeline plot that runs past its card's bottom padding
const overflowProbe = () => {
  const out = [], vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el) || !el.childNodes.length || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el); if (cs.overflowX === 'visible' && cs.textOverflow !== 'ellipsis') continue; if (cs.overflowX === 'auto' || cs.overflowX === 'scroll') continue;
    if (el.scrollWidth > el.clientWidth + 1) out.push(`clipped text "${el.textContent.trim().slice(0, 40)}" (${el.scrollWidth} > ${el.clientWidth})`);
  }
  { const a = document.querySelector('#lod'), b = document.querySelector('#lpg'), z = parseFloat(document.body.style.zoom) || 1; // the 48 h chart: no dead band between the direction bar and the chance plot (phones carry the row name in that gap)
    if (innerWidth >= 480 && a && b && vis(a) && vis(b)) { const gap = (b.getBoundingClientRect().top - a.getBoundingClientRect().bottom) / z; if (gap > 26) out.push(`direction bar to chance plot: ${Math.round(gap)} px (> 26)`); } } /* round 14: 24 px on desktop, where the peak note sits with the 3D view's air under the bar (was > 20) */
  if (innerWidth >= 640) { // row names centred on their plots (text centre within 3 px)
    const z = parseFloat(document.body.style.zoom) || 1, tc = el => { const rg = document.createRange(); rg.selectNodeContents(el); const rs = [...rg.getClientRects()].filter(q => q.height); if (!rs.length) return null; return (Math.min(...rs.map(q => q.top)) + Math.max(...rs.map(q => q.bottom))) / 2; };
    for (const [l, p] of [['.hl[style*="grid-row:3"]', '#lod'], ['#hlsw', '#lpg'], ['.hl[style*="grid-row:6"]', '#lwd'], ['#dir-l', '#segs'], ['#risk-l', '#risk'], ['#hl18', '#l18'], ['#r18-l', '#marks']]) { const a = document.querySelector(l), b = document.querySelector(p); if (!a || !b || !vis(a) || !vis(b) || a.hidden) continue;
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
        for (const b of document.querySelectorAll('#lpg > div > i, #risk rect')) { const r = b.getBoundingClientRect(); if (r.height < 3 || r.left < W.left || r.right > W.right) continue; /* round 13: night bars keep their tone (was: skipped, muted on purpose) */ const bc = getComputedStyle(b), col = rgba(b.tagName === 'rect' ? bc.fill : bc.backgroundColor); if (!col) continue;
          const op = (parseFloat(bc.opacity) || 1) * (parseFloat(b.getAttribute('opacity')) || 1) * col[3], fg = over(col, washed, op); if (cr(fg, washed) < 2) { out.push(`a bar under the official wash has contrast ${cr(fg, washed).toFixed(2)}:1 (< 2)`); break; } } } } }
  { // every "if switched" swatch is drawn in exactly the colour (and opacity) of its lines on the map
    const sw = document.querySelector('#mlggh:not([hidden]) path'), ln = document.querySelector('#map .gapp');
    if (sw && ln) { const a = getComputedStyle(sw), b = getComputedStyle(ln); if (a.stroke !== b.stroke || Math.abs(parseFloat(a.opacity) - parseFloat(b.opacity)) > 0.01) out.push(`the "if switched" swatch (${a.stroke} @${a.opacity}) differs from its map lines (${b.stroke} @${b.opacity})`); }
    const g3 = document.querySelector('.row.mapkey .plk.gh'); if (g3) { const app = document.getElementById('app'), tok = getComputedStyle(app).getPropertyValue('--' + g3.dataset.tok).trim(), c = getComputedStyle(g3).borderTopColor, hex = tok.replace('#', ''), rgb = `rgb(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)})`;
      if (c !== rgb || Math.abs(parseFloat(getComputedStyle(g3).opacity) - parseFloat(g3.dataset.op)) > 0.01) out.push(`the 3D "if switched" swatch (${c} @${getComputedStyle(g3).opacity}) differs from its map lines (${rgb} @${g3.dataset.op})`); } } /* round 12: the lines' opacity read from the map (GHOST_OP, now 1), was a fixed 0.6 */
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
// layout and legibility rules for both pages (run once per page and size, after load): annotation clearances, row names,
// number-unit spacing, text contrast, the live dot, phone legend and touch targets, 3D labels and cards
const designProbe = () => {
  // the peak note's ink (round 13): from its baseline 0.72 em up to the capitals and 0.22 em down to the descenders, in screen px
  // (an SVG text's box carries the font's whole line gap, larger than the glyphs)
  const inkBox = n => { const sc = document.getElementById('app') ? (parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1) : (parseFloat(document.body.style.zoom) || 1), fs = parseFloat(getComputedStyle(n).fontSize) * sc, r = n.getBoundingClientRect(); let bl;
    if (n instanceof SVGElement) { const m = n.getScreenCTM(); bl = m.f + m.d * +n.getAttribute('y'); } else { const sp = document.createElement('span'); sp.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'; n.appendChild(sp); bl = sp.getBoundingClientRect().top; sp.remove(); }
    return { left: r.left, right: r.right, top: bl - 0.72 * fs, bottom: bl + 0.22 * fs, width: r.width, height: 0.94 * fs }; };
  const out = [], z = parseFloat(document.body.style.zoom) || 1, W = innerWidth;
  const SEC_R = '8px'; // round 9: one radius for every secondary button and select (the segmented controls' 8 px)
  const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.05 && !el.closest('[hidden]'); };
  const R = el => el.getBoundingClientRect(), hit = (a, b, m = 0) => a.right > b.left - m && a.left < b.right + m && a.bottom > b.top - m && a.top < b.bottom + m;
  const textBox = el => { const rg = document.createRange(); rg.selectNodeContents(el); const rs = [...rg.getClientRects()].filter(q => q.width && q.height); if (!rs.length) return null; return { left: Math.min(...rs.map(q => q.left)), right: Math.max(...rs.map(q => q.right)), top: Math.min(...rs.map(q => q.top)), bottom: Math.max(...rs.map(q => q.bottom)) }; };
  const col = c => { let m = /rgba?\(([^)]+)\)/.exec(c || ''); if (m) { const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; } m = /color\(srgb ([^)]+)\)/.exec(c || ''); if (m) { const p = m[1].split(/[ \/]+/).filter(Boolean).map(Number); return [p[0] * 255, p[1] * 255, p[2] * 255, p.length > 3 ? p[3] : 1]; } return null; };
  const lum = c => { const v = c.slice(0, 3).map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; }, cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const mix = (f, b, a) => [0, 1, 2].map(i => f[i] * a + b[i] * (1 - a));
  const bgBehind = el => { const layers = []; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage !== 'none' && !/gradient/.test(cs.backgroundImage)) return null; const c = col(cs.backgroundColor); if (c && c[3] > 0) { layers.push(c); if (c[3] >= 0.99) break; } }
    let b = layers.length && layers[layers.length - 1][3] >= 0.99 ? layers.pop() : [255, 255, 255, 1]; for (let i = layers.length - 1; i >= 0; i--) b = [...mix(layers[i], b, layers[i][3]), 1]; return b; };
  const opOf = el => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity); return o; };
  const ownText = el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
  // 48 h chart annotations: event tags 2 px clear of the hour axis, the Now tag 2 px clear of the Now line, the peak note clear of the bar and tags
  { const ru = document.getElementById('ruler'); if (vis(ru)) { const rb = R(ru).bottom; for (const m of document.querySelectorAll('#ev .mk')) if (vis(m) && R(m).top < rb + 4 * z) out.push(`the "${m.textContent.trim()}" tag sits under 4 px from the hour axis`); /* round 9: 4 px (was 2) */
      const nt = ru.querySelector('.nowtag'), nl = document.querySelector('#bands .nowl'); if (vis(nt) && nl && R(nt).right > R(nl).left - 2 * z) out.push('the Now tag touches the Now line'); } }
  { const pn = document.querySelector('#pkl text, #rpk'); if (pn && vis(pn) && pn.textContent.trim()) { const q = inkBox(pn); /* round 13: its ink (was its box, which carries the line gap) */ for (const s of ['#lod', '#segs', '.swchip', '#lod .pgtag', '#pgl']) for (const t of document.querySelectorAll(s)) if (vis(t) && hit(q, R(t), 2 * z)) out.push(`the peak note "${pn.textContent.trim()}" touches ${s}`); } }
  // row names: a row with a name has a drawing (>= 6 px), the Runway 18 name sits clear of the chance plot above it; 3D: names left-aligned
  for (const [l, p, above] of [['#hl18', '#l18', '#lpg'], ['#r18-l', '#marks', '#risk']]) { const a = document.querySelector(l), b = document.querySelector(p); if (!vis(a) || a.hidden || !b) continue;
    if (b.getBoundingClientRect().height < 6) out.push(`the row ${l} has no drawing (${Math.round(b.getBoundingClientRect().height)} px tall)`);
    const t = textBox(a), c = document.querySelector(above); if (t && c && vis(c) && hit(t, R(c), -1)) out.push(`the row name ${l} overprints ${above}`); }
  if (W >= 640) { const ls = ['#dir-l', '#risk-l', '#r18-l'].map(s => document.querySelector(s)).filter(e => vis(e) && !e.hidden).map(e => [e.id, textBox(e)]).filter(x => x[1]); if (ls.length > 1) { const x0 = ls[0][1].left; for (const [id, b] of ls) if (Math.abs(b.left - x0) > 2) out.push(`the row name #${id} is not left-aligned with the others (${Math.round(b.left - x0)} px)`); } }
  // one thin no-break space between a number and its unit
  { const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; const seen = new Set(); while ((n = tw.nextNode())) { const pe = n.parentElement; if (!pe || pe.closest('script,style,title') || !vis(pe)) continue;
      for (const m of n.textContent.matchAll(/\d[  ](?:%|kt|km|min|h)(?![A-Za-z])|\d(?:%|kt|km)(?![A-Za-z])/g)) { const k = n.textContent.slice(Math.max(0, m.index - 8), m.index + 6); if (!seen.has(k)) { seen.add(k); out.push(`number and unit not joined by a thin no-break space: "${k}"${pe instanceof SVGElement ? ' (SVG)' : ''}`); } } } } /* round 12: a missing space too ("90%"), in HTML and SVG text */
  // text contrast >= 4.5:1 (>= 3:1 from 24 px) against what is behind it; text painted on shapes (bar labels, map plates) is set by those shapes
  for (const el of document.querySelectorAll('body *')) { if (!ownText(el) || el.closest('script,style,title,option,select,.dlab,.mv,text.tnumt,text.rwt')) continue; const r = R(el); if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > W) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || el.closest('button:disabled')) continue; const o = opOf(el); if (o < 0.05) continue;
    const svg = el instanceof SVGElement, fg = col(svg ? cs.fill : cs.color), bg = bgBehind(svg ? el.ownerSVGElement || el : el); if (!fg || !bg) continue;
    const c = cr(mix(fg, bg, fg[3] * o), bg), big = parseFloat(cs.fontSize) >= 24; if (c < (big ? 3 : 4.5)) out.push(`text contrast "${el.textContent.trim().slice(0, 30)}" ${c.toFixed(2)}:1 (< ${big ? 3 : 4.5})`); }
  // the live dot never reads as the West colour: hues >= 40 degrees apart
  { const d = document.querySelector('.upd > i, #livedot'), wk = [...document.querySelectorAll('#tlf span, #dkey span')].find(s => /25 West/.test(s.textContent)); if (vis(d) && wk && wk.querySelector('i')) {
      const hue = c => { const [r, g, b] = c.map(v => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d0 = mx - mn; if (!d0) return 0; const h0 = mx === r ? ((g - b) / d0) % 6 : mx === g ? (b - r) / d0 + 2 : (r - g) / d0 + 4; return (h0 * 60 + 360) % 360; };
      const was = d.className; d.className = 'ok'; const a = hue(col(getComputedStyle(d).backgroundColor)); d.className = was; /* the live state's colour, whatever the age of this build */ const b = hue(col(getComputedStyle(wk.querySelector('i')).backgroundColor)), dh = Math.min(Math.abs(a - b), 360 - Math.abs(a - b)); if (dh < 40) out.push(`the live dot's hue is ${Math.round(dh)} degrees from the West colour (< 40)`); } }
  if (W < 480) { // phones: the legend under every chart row, the Now line ends above it and crosses no row name; 44 px touch targets
    const lg = document.getElementById('tlf'), lw = document.getElementById('lwd'); if (vis(lg) && lg.children.length && vis(lw) && R(lg).top < R(lw).bottom) out.push('the 48 h legend sits inside the chart (phones: under its last row)');
    const nl = document.querySelector('#bands .nowl'); if (nl && vis(nl)) { if (vis(lg) && R(nl).bottom > R(lg).top + 1 && hit(R(nl), R(lg))) out.push('the Now line runs into the legend'); for (const t of document.querySelectorAll('#tl .hl')) { const b = vis(t) && textBox(t); if (b && hit(R(nl), b)) out.push(`the Now line crosses the row name "${t.textContent.trim()}"`); } }
    for (const b of document.querySelectorAll('.topbar .nav a, #tz button, #zoom button, .ptabs a, .ptz button')) if (vis(b) && R(b).height < 43.5) out.push(`the control "${b.textContent.trim() || b.id}" is ${Math.round(R(b).height)} px tall (< 44)`); }
  if (document.getElementById('app') && document.querySelector('.dock')) { // the 3D view
    if (W >= 640) { const a = document.querySelector('.attrib'), d = document.querySelector('.dock'), t = a && vis(a) && textBox(a); if (t && t.top - R(d).bottom < 12) out.push(`the footer sits ${Math.round(t.top - R(d).bottom)} px under the chart card (< 12)`);
      const rail = document.querySelector('.rail') || document.querySelector('.hud .hero'); if (rail) for (const e of rail.querySelectorAll('*')) if (ownText(e) && vis(e) && !e.closest('.tkey b') /* the numbered town discs are markers */ && parseFloat(getComputedStyle(e).fontSize) < 12.5) { out.push(`the left card sets "${e.textContent.trim().slice(0, 24)}" in ${getComputedStyle(e).fontSize} (< 13 px)`); break; } }
    else { const cards = [...document.querySelectorAll('.hud .panel:not([hidden]), .hud .hero, .dock')].filter(vis).map(R);
      for (const l of document.querySelectorAll('.lbl.rwy')) { if (l.style.display === 'none' || !l.textContent.trim() || !vis(l)) continue; const q = R(l); if (q.left < 16 || q.right > W - 16) out.push(`the 3D "${l.textContent.trim()}" tag is within 16 px of the screen edge`); if (cards.some(c => hit(q, c))) out.push(`the 3D "${l.textContent.trim()}" tag runs under a card`); }
      const dk = document.querySelector('.dock'), hr = document.querySelector('.hud .hero'); if (vis(dk) && vis(hr) && getComputedStyle(dk).borderTopLeftRadius !== getComputedStyle(hr).borderTopLeftRadius) out.push(`the bottom sheet's corner (${getComputedStyle(dk).borderTopLeftRadius}) differs from the cards' (${getComputedStyle(hr).borderTopLeftRadius})`); } }
  // phones: no text closer than 16 px to either screen edge (the dashboard's page margin)
  if (W < 480 && document.getElementById('answer')) for (const el of document.querySelectorAll('body *')) { if (!ownText(el) || el.closest('script,style,title,svg') || !vis(el)) continue; const t = textBox(el); if (t && (t.left < 16 - 0.5 || t.right > W - 16 + 0.5)) { out.push(`"${el.textContent.trim().slice(0, 30)}" runs within ${Math.round(Math.min(t.left, W - t.right))} px of the screen edge (< 16)`); break; } }
  // phones: the 48 h legend under the chart's last row on both pages (never between rows)
  if (W < 480) { const k = document.querySelector('.dock #dkey'), last = [...document.querySelectorAll('#marks, #risk')].filter(vis).map(R); if (vis(k) && k.children.length && last.length && R(k).top < Math.max(...last.map(q => q.bottom)) - 0.5) out.push('the 3D legend sits inside the chart (phones: under its last row)'); }
  // phones: the readout line sits 8 to 18 px above the date axis (no dead band)
  if (W < 480) { const ro = document.querySelector('#oduse, #dro'), d = [...document.querySelectorAll('#ruler .d, #ticks span.day')].filter(vis); const t = ro && vis(ro) && textBox(ro); if (t && d.length) { const g = Math.min(...d.map(e => R(e).top)) - t.bottom; if (g > 18 || g < 8) out.push(`the readout sits ${Math.round(g)} px above the date axis (8 to 18)`); } }
  // phones: a row name that a day line or night band runs behind sits on an opaque chip
  if (W < 480) { const bands = [...document.querySelectorAll('#nbands .night, #bands .night, #mids .mid, #nights i, #mids i')].filter(e => R(e).width && R(e).height).map(R);
    for (const n of document.querySelectorAll('#tl .hl, .dock .rowlbl > span')) { const t = vis(n) && !n.hidden && textBox(n); if (!t || !bands.some(b => hit(t, b))) continue; const c = col(getComputedStyle(n).backgroundColor); if (!c || c[3] < 0.99) out.push(`a day line or night band runs behind the row name "${n.textContent.trim()}"`); } }
  // axis values (hour, day and value ticks) at 12 px or more
  for (const e of document.querySelectorAll('#ruler .h, #ruler .d, #ticks span.hr, #ticks span.day, .lpg text.gt, .lwd text.ax, .dock .rgl0, .dock .rgl2')) if (vis(e) && e.textContent.trim() && parseFloat(getComputedStyle(e).fontSize) < 11.99) { out.push(`the axis value "${e.textContent.trim()}" is set in ${getComputedStyle(e).fontSize} (< 12 px)`); break; }
  // the predicted switch: its chip names the switch hour
  { const c = document.querySelector('.lanes > .swchip, #track .swchip'); if (vis(c) && !/\b\w{3} \d\d:\d\d\b/.test(c.textContent)) out.push(`the switch chip "${c.textContent.trim()}" does not name the switch hour`); }
  // round 12: the in-bar direction label never sits on a night band (it moves to the first daytime stretch that holds it)
  { const nb = [...document.querySelectorAll('#nbands .night, #bands .night, #nights i')].filter(e => R(e).width).map(R); for (const l of document.querySelectorAll('#lod .dlab, #segs .dlab')) { if (!vis(l)) continue; const q = R(l); if (nb.some(b => q.right > b.left + 0.5 && q.left < b.right - 0.5)) out.push(`the bar label "${l.textContent.trim()}" sits on a night band`); } }
  // round 12 (dashboard, desktop): the 48 h chart about two thirds of the main row, its hourly cells >= 16 px at 1440
  if (document.getElementById('answer') && W >= 900) { const a = document.querySelector('.tlc'), b = document.querySelector('.c3d'), c = document.querySelector('#lod > div'); if (vis(a) && vis(b)) { const f = R(a).width / (R(a).width + R(b).width); if (f < 0.64 || f > 0.75) out.push(`the 48 h card takes ${Math.round(f * 100)} % of the main row (about two thirds)`); }
    if (W === 1440 && c && R(c).width < 15.5) out.push(`the 48 h chart's hourly cells are ${R(c).width.toFixed(1)} px at 1440 (< 16)`); }
  // the in-bar direction label sits on an opaque chip (the night hatch never runs behind it), its text >= 4.5:1 on it
  for (const l of document.querySelectorAll('#lod .dlab, #segs .dlab')) { if (!vis(l)) continue; const b = col(getComputedStyle(l).backgroundColor), f = col(getComputedStyle(l).color); if (!b || b[3] < 0.99) { out.push(`the bar label "${l.textContent.trim()}" has no solid chip`); continue; } if (f && cr(f, b) < 4.5) out.push(`the bar label "${l.textContent.trim()}" has contrast ${cr(f, b).toFixed(2)}:1 on its chip (< 4.5)`); }
  // desktop dashboard: the hero's top-right figure at the KPI figures' weight, smaller than the headline, its label's top on
  // the kicker's top (round 11: the slot holds the Runway 18 status, was the accuracy figure; the KPI figures are in the
  // accuracy detail view, so the weight is compared while it is open)
  if (W >= 900 && document.getElementById('answer')) { const n = document.querySelector('.r18h .r18s b'), h = document.querySelector('#answer > span:not(.dbadge)'), k = document.querySelector('.lede-l .eyebrow'), e = document.querySelector('.r18h .r18l'), kp = document.querySelector('.accst dd');
    if (!vis(n) || !vis(e)) out.push('the hero has no Runway 18 block (label and status)');
    if (vis(n) && vis(kp) && getComputedStyle(n).fontWeight !== getComputedStyle(kp).fontWeight) out.push(`the Runway 18 status (${getComputedStyle(n).fontWeight}) is not at the KPI figures' weight (${getComputedStyle(kp).fontWeight})`);
    if (vis(n) && vis(h) && parseFloat(getComputedStyle(n).fontSize) >= parseFloat(getComputedStyle(h).fontSize)) out.push('the Runway 18 status is not smaller than the headline');
    // round 12 (was: the Runway 18 label's top on the kicker's top): both hero columns end on one bottom edge (+-1 px), >= 16 px
    // (the page gutter) above the cards; the label directly over the status (<= 8 px)
    { const lastOf = sel => [...document.querySelectorAll(sel)].filter(x => vis(x) && x.textContent.trim()).map(textBox).filter(Boolean).reduce((m, q) => (!m || q.bottom > m.bottom ? q : m), null);
      const L = lastOf('.lede-l > *'), Rb = lastOf('.r18h .r18l, .r18h .r18s, .r18h .r18w, .r18h .r18i'), cards = [...document.querySelectorAll('.tlc, .c3d')].filter(vis).map(x => R(x).top);
      if (L && Rb && Math.abs(L.bottom - Rb.bottom) > 1) out.push(`the hero columns end ${Math.round(Math.abs(L.bottom - Rb.bottom) / z)} px apart (one bottom edge)`);
      if (L && cards.length && (Math.min(...cards) - Math.max(L.bottom, Rb ? Rb.bottom : 0)) / z < 15.5) out.push(`the hero's last line sits ${((Math.min(...cards) - Math.max(L.bottom, Rb ? Rb.bottom : 0)) / z).toFixed(1)} px above the cards (< 16)`);
      // round 14 (retired: round 13's label top on the kicker's top and the four lines spread evenly): each line on its partner
      // line in the left column, baselines within 1 px: the label on the headline's (close over its closure), the closure on
      // the switch line's, the quiet line on the switch line's second line, what it moves on the trust line
      { const bl = el => { const sp = document.createElement('span'); sp.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'; el.appendChild(sp); const y = sp.getBoundingClientRect().top; sp.remove(); return y; };
        for (const [a, b, nm] of [['.r18h .r18l', '#answer > span:not(.dbadge)', 'label on the headline'], ['.r18h .r18s b', '#subhead .sh1', 'closure on the switch line'], ['.r18h .r18w', '#subhead .sh2', 'quiet line on the switch line\'s second line'], ['.r18h .r18i', '#trust', 'closure\'s effect on the trust line']]) {
          const x = document.querySelector(a), y = document.querySelector(b); if (!vis(x) || !x.textContent.trim() || !vis(y)) continue; const d = (bl(x) - bl(y)) / z; if (Math.abs(d) > 1) out.push(`the Runway 18 ${nm}: baselines ${d.toFixed(1)} px apart (> 1)`); } }
      { const rg = document.querySelector('.r18h .r18d'), blk = document.querySelector('.r18h'); if (vis(rg) && vis(n)) { const q = R(rg), t = textBox(n); if (q.left < R(blk).left - 0.5) out.push(`the Runway 18 ring hangs ${Math.round((R(blk).left - q.left) / z)} px into the gutter`); if (t && (q.left > t.left + 1 || q.top > t.bottom || q.bottom < t.top)) out.push('the Runway 18 ring is not inline before the closure'); } } } }
  // red is the Runway 18 closure only: the headwind limit (line, label, key, band) is neutral grey
  for (const [s, p] of [['.lwd .lim', 'stroke'], ['.lwd .limt', 'fill'], ['.limsw', 'borderTopColor'], ['.lwd .zone', 'fill']]) { const e = document.querySelector(s); if (!e) continue; const c = col(getComputedStyle(e)[p]); if (c && c[3] > 0 && Math.max(...c.slice(0, 3)) - Math.min(...c.slice(0, 3)) > 40) { out.push(`the headwind limit (${s}) is coloured (${getComputedStyle(e)[p]}): red is for the closure`); break; } }
  // round 11: retired "the phone accuracy label reads as the desktop one" (both the phone block and the desktop label are
  // gone: one trust line serves every width)
  // no text-glyph arrows: arrows are the drawn SVG arrow
  { const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) { const pe = n.parentElement; if (!pe || pe.closest('script,style,title,option') || !vis(pe)) continue; if (/[→←↗↘⌄]/.test(n.textContent)) { out.push(`a text-glyph arrow in "${n.textContent.trim().slice(0, 30)}"`); break; } } }
  // buttons that look like buttons: "3D view" >= 32 px with an outline; the 3D phone "Details" >= 44 px with a fill or outline
  // round 13: retired '"3D view" is a 32 px outlined button' (it is the quiet "Open in 3D" link; see the flight-path card rules)
  if (W < 640) { const d = document.querySelector('.sbx > summary'); if (vis(d)) { const cs = getComputedStyle(d), bg = col(cs.backgroundColor); if (R(d).height < 43.5 || ((!bg || bg[3] === 0) && cs.boxShadow === 'none' && parseFloat(cs.borderTopWidth) === 0)) out.push(`"Details" is not a 44 px button shape (${Math.round(R(d).height)} px)`); } }
  if (document.getElementById('app') && document.querySelector('.dock') && window.__fra) { // the 3D view: card, map and sheet layout
    const base = el => { const s = document.createElement('span'); s.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'; el.appendChild(s); const y = s.getBoundingClientRect().top; s.remove(); return y; };
    if (W >= 640) {
      // the Runway 18 row: name and status on one baseline; the later closure a second line under the status, right-aligned with it and with the other rows' values
      const v = document.getElementById('r18-v'), t = v && v.closest('.row-main')?.querySelector('.row-title');
      if (vis(v) && vis(t)) { const ys = [t, ...v.querySelectorAll('.badge')].filter(vis).map(base); if (Math.max(...ys) - Math.min(...ys) > 1) out.push(`the Runway 18 row's texts sit on baselines ${Math.round(Math.max(...ys) - Math.min(...ys))} px apart (> 1)`);
        const bd = v.querySelector('.badge'), cl = document.querySelector('#r18-s .r18w, #r18-s .r18i'), wv = document.querySelector('.rail .row.wind .row-value'); if (vis(bd) && vis(cl)) { const a = textBox(bd), tl = textBox(t); for (const ln of document.querySelectorAll('#r18-s .r18w, #r18-s .r18i')) { const q = vis(ln) && textBox(ln); const wy = document.getElementById('wind-why'), fs = e => parseFloat(getComputedStyle(e).fontSize); if (q && a && (Math.abs(q.right - a.right) > 1.5 || q.top < a.bottom - 1)) { out.push('the Runway 18 lines are not right-aligned under the status, as the wind\'s compass line under its value'); break; } if (vis(wy) && Math.abs(fs(ln) - fs(wy)) > 0.01) { out.push(`the Runway 18 line is ${fs(ln)} px, the wind's compass line ${fs(wy)} px`); break; } } /* round 15: right-aligned under the status, the wind sub-line's size (round 13: from the label edge) */
          if (a && vis(wv) && Math.abs(a.right - textBox(wv).right) > 1.5) out.push(`the Runway 18 status ends ${Math.round(textBox(wv).right - a.right)} px from the other rows' values`); } }
      // every row of the left card's conditions has one divider above it, all of one weight and colour
      { const ds = []; for (const e of document.querySelectorAll('.rail .hsec, .rail .conditions > .row')) { if (!vis(e)) continue; for (const ps of [null, '::before']) { const c = getComputedStyle(e, ps); if (ps && (c.content === 'none' || c.display === 'none')) continue; if (parseFloat(c.borderTopWidth) > 0 && c.borderTopStyle !== 'none') { ds.push([e.className, c.borderTopWidth, c.borderTopColor]); break; } } }
        const rows = [...document.querySelectorAll('.rail .hsec, .rail .conditions > .row')].filter(e => vis(e) && !e.classList.contains('wind')); if (ds.length < rows.length) out.push(`${rows.length - ds.length} rows of the left card have no divider`);
        if (new Set(ds.map(d => d[1] + d[2])).size > 1) out.push(`the left card's dividers differ: ${[...new Set(ds.map(d => d[1] + ' ' + d[2]))].join(', ')}`); }
      // one page gutter: the cards' edges and the footer's text on the header logo's left edge; the buttons' right edge on the chart card's; 24 px over the footer
      { const lg = document.querySelector('.pbrand'), rl = document.querySelector('.rail'), dk = document.querySelector('.dock'), at = document.querySelector('.attrib'), st = document.querySelector('.stack'), L = lg && textBox(lg) && R(lg).left;
        if (L && vis(rl) && vis(dk)) { for (const [n, x] of [['left card', R(rl).left], ['chart card', R(dk).left], ['footer', vis(at) && textBox(at) ? textBox(at).left : L]]) if (Math.abs(x - L) > 1.5) out.push(`the ${n} starts at x=${Math.round(x)}, the header logo at x=${Math.round(L)}`);
          if (vis(st) && Math.abs(R(st).right - R(dk).right) > 1.5) out.push(`the map buttons end at x=${Math.round(R(st).right)}, the chart card at x=${Math.round(R(dk).right)}`);
          const tb = vis(at) && textBox(at); if (tb && tb.top - R(dk).bottom < 24) out.push(`the footer sits ${Math.round(tb.top - R(dk).bottom)} px under the chart card (< 24)`); } }
      // the airport fills the map: its runways span >= 30 % of the free area's width
      if (W === 1440 && window.__fra.depTips && window.__fra.rwScreen) { const F = window.__fra.depTips().free, xs = window.__fra.rwScreen().flatMap(r => [r[1][0], r[2][0]]), f = (Math.max(...xs) - Math.min(...xs)) / (F[2] - F[0]); if (f < 0.3) out.push(`the runways span ${Math.round(f * 100)} % of the free map width (< 30)`); }
      // runway tags beside their runways: the tag 3 px clear of every runway strip
      if (window.__fra.rwScreen) { const rw = window.__fra.rwScreen(); for (const l of document.querySelectorAll('.lbl.rwy')) { if (l.style.display === 'none' || !l.textContent.trim() || !vis(l)) continue; const q = R(l.querySelector('b') || l);
          for (const r of rw) { let d = 1e9; for (let f = 0; f <= 1; f += 0.01) { const x = r[1][0] + (r[2][0] - r[1][0]) * f, y = r[1][1] + (r[2][1] - r[1][1]) * f; d = Math.min(d, Math.hypot(Math.max(q.left - x, 0, x - q.right), Math.max(q.top - y, 0, y - q.bottom))); } if (d < (r[3] || 0) + 3) { out.push(`the 3D "${l.textContent.trim()}" tag sits ${Math.round(d - (r[3] || 0))} px from runway ${r[0].join('/')}'s strip (< 3)`); break; } } } }
      // Details in the left card is an outlined control at the secondary controls' one radius (round 9: was a pill)
      const d = document.querySelector('.rail .pdet > summary'); if (vis(d)) { const cs = getComputedStyle(d); if (R(d).height / z < 27.5 || cs.borderTopLeftRadius !== SEC_R || (cs.boxShadow === 'none' && parseFloat(cs.borderTopWidth) === 0) || R(d).width > R(d.closest('.rail')).width * 0.6) out.push(`"Details" in the left card is not an outlined control at the shared ${SEC_R} radius (${Math.round(R(d).width)} x ${Math.round(R(d).height)} px, radius ${cs.borderTopLeftRadius})`); }
      // the drag and zoom hint: present, >= 12 px, clear of the cards and buttons
      const hn = document.getElementById('hint3'); if (!vis(hn) || !/Drag to rotate/.test(hn.textContent)) out.push('the 3D map has no "Drag to rotate · scroll to zoom" hint');
      else { if (parseFloat(getComputedStyle(hn).fontSize) < 12) out.push(`the map hint is set in ${getComputedStyle(hn).fontSize} (< 12 px)`); for (const s of ['.rail', '.dock', '.stack', '.mapov']) { const e = document.querySelector(s); if (vis(e) && hit(R(hn), R(e), 4)) out.push(`the map hint runs within 4 px of ${s}`); } }
      // the left card's text inset equals the chart card's
      const rl = document.querySelector('.rail'), ey = document.getElementById('eyebrow'), dk = document.querySelector('.dock'), dt = [...dk.querySelectorAll('*')].find(e => ownText(e) && vis(e) && /^Next \d+ hours/.test(e.textContent.trim()));
      if (vis(rl) && vis(ey) && dt) { const a = textBox(ey).left - R(rl).left, b = textBox(dt).left - R(dk).left; if (Math.abs(a - b) > 2) out.push(`the left card's text inset (${Math.round(a)} px) differs from the chart card's (${Math.round(b)} px)`); }
      // the airport (its runways) centred in the free area between the cards and the buttons
      if (W === 1440 && window.__fra.depTips && window.__fra.rwScreen) { const F = window.__fra.depTips().free, rw = window.__fra.rwScreen(), xs = rw.flatMap(r => [r[1][0], r[2][0]]), ys = rw.flatMap(r => [r[1][1], r[2][1]]), ar = document.getElementById('app').getBoundingClientRect();
        const dx = ((Math.min(...xs) + Math.max(...xs)) / 2 - ar.left - (F[0] + F[2]) / 2) / (F[2] - F[0]), dy = ((Math.min(...ys) + Math.max(...ys)) / 2 - ar.top - (F[1] + F[3]) / 2) / (F[3] - F[1]);
        if (Math.abs(dx) > 0.03 || Math.abs(dy) > 0.04) out.push(`the airport sits off the free area's centre (${Math.round(dx * 100)} % across, ${Math.round(dy * 100)} % down)`); }
    } else {
      // phones: the bottom sheet inset and rounded like the cards above it
      const dk = document.querySelector('.dock'), hr = document.querySelector('.hud .hero') || document.querySelector('.rail .hero');
      if (vis(dk) && vis(hr)) { const a = R(dk), b = R(hr), cd = getComputedStyle(dk), ch = getComputedStyle(hr);
        if (Math.abs(a.left - b.left) > 1 || Math.abs(a.right - b.right) > 1) out.push(`the bottom sheet (${Math.round(a.left)}-${Math.round(a.right)}) is not inset like the cards (${Math.round(b.left)}-${Math.round(b.right)})`);
        if (W - a.right < 4 || innerHeight - a.bottom < 4) out.push('the bottom sheet runs to the screen edge');
        if (new Set([cd.borderTopLeftRadius, cd.borderTopRightRadius, cd.borderBottomLeftRadius, cd.borderBottomRightRadius, ch.borderTopLeftRadius]).size > 1) out.push(`the bottom sheet's corners (${cd.borderRadius}) differ from the cards' (${ch.borderTopLeftRadius})`); }
      // phones: the Now pill 12 px inside the sheet; the value labels inside the plot, 4 px clear of the Now line
      const nt = document.getElementById('nowtick'); if (vis(nt) && vis(dk) && R(nt).left - R(dk).left < 11.5) out.push(`the Now pill sits ${Math.round(R(nt).left - R(dk).left)} px from the sheet's edge (< 12)`);
      const kn = document.querySelector('.dock .nowline'), tr = document.getElementById('track'); if (vis(kn) && vis(tr)) for (const l of document.querySelectorAll('.dock .rgl0, .dock .rgl2')) { if (!vis(l) || !l.textContent.trim()) continue; const t = textBox(l); if (!t) continue; if (t.left < R(tr).left) out.push(`the axis value "${l.textContent.trim()}" sits outside the plot`); else if (R(kn).left < t.left && t.left - R(kn).right < 3.5) out.push(`the axis value "${l.textContent.trim()}" sits ${Math.round(t.left - R(kn).right)} px from the Now line (< 4)`); }
      // phones: each row name's chip is its text plus 2 px a side (a narrow notch in the night band)
      for (const n of document.querySelectorAll('.dock .rowlbl > span')) { const t = vis(n) && !n.hidden && textBox(n); if (t && Math.abs(R(n).width - (t.right - t.left) - 4) > 0.75) out.push(`the row name chip "${n.textContent.trim()}" is ${Math.round(R(n).width - (t.right - t.left))} px wider than its text (not 4)`); }
      // phones: runway tags small (<= 17 px tall) and off every runway strip
      const rw = window.__fra.rwScreen ? window.__fra.rwScreen() : [], cross = (q, a, b) => { for (let f = 0; f <= 1; f += 0.02) { const x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f; if (x > q.left + 1 && x < q.right - 1 && y > q.top + 1 && y < q.bottom - 1) return true; } return false; };
      for (const l of document.querySelectorAll('.lbl.rwy')) { if (l.style.display === 'none' || !l.textContent.trim() || !vis(l)) continue; const q = R(l.querySelector('b') || l); if (q.height > 17.5) out.push(`the 3D "${l.textContent.trim()}" tag is ${Math.round(q.height)} px tall on the phone map (> 17)`); const r = rw.find(r => cross(q, r[1], r[2])); if (r) out.push(`the 3D "${l.textContent.trim()}" tag covers runway ${r[0].join('/')}`); }
    } }
  if (document.getElementById('app') && window.__fra) { // the 3D map: runway tags 2 px clear of the path arrows and the numbered town discs; the discs 4 px apart
    const sepR = (a, b) => Math.max(a.left - b.right, b.left - a.right, a.top - b.bottom, b.top - a.bottom);
    const arrows = [...document.querySelectorAll('.lbl.parrow')].filter(e => e.style.display !== 'none' && vis(e)).map(e => R(e.querySelector('svg') || e)), discs = [...document.querySelectorAll('.lbl.town.num')].filter(e => e.style.display !== 'none').map(e => e.querySelector('i') || e.querySelector('b') || e).filter(vis).map(R);
    for (const l of document.querySelectorAll('.lbl.rwy')) { if (l.style.display === 'none' || !l.textContent.trim() || !vis(l)) continue; const q = R(l.querySelector('b') || l);
      if (arrows.some(a => sepR(q, a) < 2)) out.push(`the 3D "${l.textContent.trim()}" tag touches a path arrow`); if (discs.some(d => sepR(q, d) < 2)) out.push(`the 3D "${l.textContent.trim()}" tag touches a town marker`); }
    for (let i = 0; i < discs.length; i++) for (let j = i + 1; j < discs.length; j++) if (sepR(discs[i], discs[j]) < 4) out.push(`two town markers sit ${Math.round(sepR(discs[i], discs[j]))} px apart (< 4)`);
    if (W < 600) { const k = document.querySelector('.row.mapkey.mapov'), dk = document.querySelector('.dock'); if (vis(k) && vis(dk)) { const pk = parseFloat(getComputedStyle(k).paddingLeft), pd = parseFloat(getComputedStyle(dk).paddingLeft); if (Math.abs(pk - pd) > 1) out.push(`the map key's inset (${pk} px) differs from the bottom sheet's (${pd} px)`);
        const items = [...k.children].filter(e => vis(e) && e.textContent.trim()).map(R), tops = [...new Set(items.map(q => Math.round(q.top)))]; if (tops.length > 2) out.push(`the map key runs to ${tops.length} rows (> 2)`); const lefts = tops.map(t => Math.min(...items.filter(q => Math.round(q.top) === t).map(q => q.left))); if (Math.max(...lefts) - Math.min(...lefts) > 1) out.push('the map key rows do not start on one left edge'); } } }
  // round 15: the in-bar direction label, one rule on both pages: at the band start (8 px in) when the first solid run (no
  // night hatch, after the Now line) is >= the label's width + 8 px, else at the start of the first run that is
  if (W >= 640) { const bar = document.querySelector('#lod, #segs'), lb = bar && bar.querySelector('.dlab'); if (vis(lb) && lb.offsetWidth) { const sc = R(lb).width / lb.offsetWidth, cells = [...bar.children].filter(e => e.tagName !== 'SPAN' && R(e).width), nl = [...document.querySelectorAll('#bands .nowl, .dock .nowline')].find(vis), nx = nl ? R(nl).left + R(nl).width / 2 : -1e9, w0 = cells[0] && cells[0].classList.contains('w');
      const runs = []; let cur = null; for (const c of cells) { if (c.classList.contains('w') !== w0) break; const q = R(c); if (c.classList.contains('n') || /repeating-linear-gradient/.test(c.getAttribute('style') || '')) { cur = null; continue; } if (q.right <= nx) continue; if (!cur) runs.push(cur = [Math.max(q.left, nx), q.right]); else cur[1] = q.right; }
      const want = runs.find(([a, b]) => (b - a) / sc >= lb.offsetWidth + 8 - 0.5), d = want ? (R(lb).left - want[0]) / sc : null;
      if (want && (d < 0 || d > 4)) out.push(`the "${lb.textContent.trim()}" label sits ${d.toFixed(1)} px from the start of the first solid run that holds it (${runs.indexOf(want) ? 'after a night band' : 'the band start'}; want 0 to 4)`); } }
  // round 13 (was, at every width: its capitals 4 px under the top gridline): desktop, the peak note above the chance plot's top
  // gridline, clear of it (>= 1 px) and >= 3 px under the direction bar; phones keep the in-plot rule below
  if (W >= (document.getElementById('answer') ? 900 : 640)) { const n = document.querySelector('#pkl text, #rpk'); if (!n || !vis(n) || !n.textContent.trim() || /^peak /.test(n.textContent.trim())) {} else { const q = inkBox(n), g = [...document.querySelectorAll('#lpg line.grid, #risk line.grid')].map(R).filter(x => x.width).reduce((m, x) => (!m || x.top < m.top ? x : m), null), bar = document.querySelector('#lod, #segs');
      if (g && q.bottom > g.top - 1) out.push(`the peak note reaches ${(q.bottom - g.top + 1).toFixed(1)} px into the top gridline (it sits above it)`); { const mn = document.getElementById('answer') ? 6 : 8; /* round 14: the dashboard's note >= 6 px under the bar (was >= 3 on both); round 15: the 3D note >= 8 px */ if (vis(bar) && q.top - R(bar).bottom < mn * z - 0.5) out.push(`the peak note sits ${((q.top - R(bar).bottom) / z).toFixed(1)} px under the direction bar (< ${mn})`); } } }
  else { const n = document.querySelector('#pkl text, #rpk'); if (n && vis(n) && n.textContent.trim()) { const fs = parseFloat(getComputedStyle(n).fontSize); let bl; if (n instanceof SVGElement) { const m = n.getScreenCTM(); bl = m.f + m.d * +n.getAttribute('y'); } else { const sp = document.createElement('span'); sp.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'; n.appendChild(sp); bl = sp.getBoundingClientRect().top; sp.remove(); }
      const q = R(n), cap = bl - 0.7 * fs * z; for (const l of document.querySelectorAll('#lpg line.grid, #risk line.grid')) { const g = R(l); if (g.right < q.left || g.left > q.right || g.top > bl) continue; if (cap - g.top < 4 * z - 0.5) out.push(`the peak note's capitals sit ${(cap - g.top).toFixed(1)} px under a gridline (< 4)`); } } }
  // phones: segmented controls show >= 3 px of track round the selected pill
  if (W < 480) for (const [tr, on] of [['#tz', ':scope > i'], ['#zoom', ':scope > i'], ['.topbar .nav', 'a[aria-current]'], ['.ptz', 'button[aria-pressed=true]'], ['.ptabs', 'a[aria-current]']]) { const t = document.querySelector(tr), p = t && t.querySelector(on); if (!vis(t) || !p || !R(p).width) continue; const a = R(t), b = R(p), m = Math.min(b.left - a.left, a.right - b.right, b.top - a.top, a.bottom - b.bottom); if (m < 2.5) out.push(`the selected pill in ${tr} sits ${m.toFixed(1)} px from its track's edge (< 3)`); }
  // no visible text under 12 px on either page (SVG text at its drawn size); the numbered town discs are markers, not text
  { const disc = '.tnumt, .mlgt i, #mlgtowns .tk i, .tkey b, .lbl.town b, .lbl.num b';
    for (const el of document.querySelectorAll('body *')) { if (!ownText(el) || el.closest('script,style,title,option') || el.matches(disc) || !vis(el)) continue; const r = R(el); if (r.bottom < 0 || r.top > innerHeight) continue;
      let fs = parseFloat(getComputedStyle(el).fontSize); if (el instanceof SVGElement && el.getScreenCTM()) { const m = el.getScreenCTM(); fs *= Math.hypot(m.a, m.b) / z; }
      if (fs < 11.99) { out.push(`"${el.textContent.trim().slice(0, 30)}" is set in ${fs.toFixed(1)} px (< 12)`); break; } } }
  if (document.getElementById('answer')) { // the dashboard
    // desktop 1440 x 900: the chance plot gets >= 56 px
    if (W >= 1440 && innerHeight >= 900) { const p = document.getElementById('lpg'); if (vis(p) && R(p).height < 55.5) out.push(`the chance plot is ${Math.round(R(p).height)} px tall (< 56)`); }
    // round 12 (was: the tag in the top lane, a leader to the closed cells, broken at the bar and the chance plot): the "18
    // closed" tag in the Runway 18 lane, sitting on a bracket over the closed run (its centre over the bracket, its bottom 3 to 5 px over
    // the bracket's top), >= 4 px under the chance plot's baseline and clear of the hour axis, over no bar, >= 4 px from every
    // other tag, chip and row name, inside the axis; no leader
    { const t = document.querySelector('#ev .mk.r18'), c = document.querySelector('#l18 > div.x'), bk = document.querySelector('#bands .r18brk');
      if (document.querySelector('.r18lead')) out.push('the "18 closed" tag still has a leader');
      if (vis(t) && c && R(c).width) { const T = R(t), C = R(c), P = R(document.getElementById('lpg')), L = R(document.getElementById('lod')), ax = R(document.getElementById('ruler'));
        if (!vis(bk)) out.push('no bracket over the closed Runway 18 cells'); else { const B = R(bk); if (Math.abs(B.left - C.left) > 1 || B.bottom > C.top + 0.5 || C.top - B.bottom > 3) out.push('the closure bracket does not sit on the closed cells');
          const cx = (T.left + T.right) / 2; if (W >= 480) { if (cx < B.left - 1 || cx > B.right + 1) out.push(`the "18 closed" tag is not on its bracket (${Math.round(T.left - B.right)} px past its end)`); }
          else { /* phones: the row name shares the lane and moves with the Now line; the tag's left edge sits at the bracket start, or 4 px after the name if that start
            comes within 4 px of it, or 4 px before the name if after it runs past the plot end (never left of the plot); within 1 px */
            const nb = textBox(document.getElementById('hl18')); let want = Math.max(B.left, L.left);
            if (nb && want < nb.right + 4 && want + T.width > nb.left - 4) { want = nb.right + 4; if (want + T.width > L.right) want = Math.max(L.left, nb.left - 4 - T.width); }
            if (Math.abs(T.left - want) > 1) out.push(`the "18 closed" tag starts ${(T.left - want).toFixed(1)} px off its place (bracket start or 4 px clear of the row name)`);
            if (nb && T.right > nb.left - 3.5 && T.left < nb.right + 3.5 && T.bottom > nb.top && T.top < nb.bottom) out.push('the "18 closed" tag is under 4 px from the Runway 18 row name'); } if ((B.top - T.bottom) / z < 3 - 0.05 || (B.top - T.bottom) / z > 5) out.push(`the "18 closed" tag is not just over its bracket (${((B.top - T.bottom) / z).toFixed(1)} px, not 3 to 5)`); } /* round 15: >= 3 px clear of the bracket (was: on it, touching) */
        if ((T.top - P.bottom) / z < 3.5) out.push(`the "18 closed" tag sits ${((T.top - P.bottom) / z).toFixed(1)} px under the chance plot's baseline (< 4)`);
        if (T.top < ax.bottom + 4 * z) out.push('the "18 closed" tag is not clear of the hour axis');
        if (T.left < L.left - 0.5 || T.right > L.right + 0.5) out.push('the "18 closed" tag runs past the axis');
        for (const b of document.querySelectorAll('#lpg > div > i')) { const r = R(b); if (r.height && hit(T, r)) { out.push('the "18 closed" tag overlaps a chance bar'); break; } }
        for (const o of document.querySelectorAll('.lanes > .swchip, #lod .pgtag, #ev .mk:not(.r18), .tl .hl, .lpg text, #pkl text')) { if (!vis(o) || o.hidden) continue; const q = o.closest('.hl') ? textBox(o) : R(o); if (q && hit(T, q, 4 * z - 0.5)) { out.push(`the "18 closed" tag is under 4 px from "${o.textContent.trim().slice(0, 16)}"`); break; } } } }
    // the headwind scale: its labels a text height apart (no two boxes overlap), the limit labelled with its value and unit
    { const ls = [...document.querySelectorAll('.lwd text.ax, .lwd #limt')].filter(vis).map(e => [e, R(e)]);
      for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++) { const a = ls[i][1], b = ls[j][1]; if (a.right > b.left && b.right > a.left && a.bottom > b.top + 0.5 && b.bottom > a.top + 0.5) out.push(`the headwind labels "${ls[i][0].textContent.trim()}" and "${ls[j][0].textContent.trim()}" overlap`); }
      const lm = document.getElementById('limt'); if (lm && vis(lm) && !/^limit \u2212\d+\u202fkt$/.test([...lm.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim())) out.push(`the headwind limit reads "${lm.textContent.trim()}" (not "limit \u2212N kt")`); }
    // the accuracy claim looks like a link at rest (an underline >= 2:1 on the page); the (i) 6 px after "Fewer errors", inside the column
    { const u = [...document.querySelectorAll('#trust a.beat .u, #trustph a.beat .u')].find(vis) || document.querySelector('#trust a.beat .u'); if (!u && document.getElementById('trust')?.textContent.trim()) out.push('the trust line has no link to the accuracy detail view'); if (vis(u)) { /* round 11: the trust line's link (was the hero's claim) */ const cs = getComputedStyle(u), dc = col(cs.textDecorationColor), bg = bgBehind(u); if (!/underline/.test(cs.textDecorationLine) || !dc || !bg || cr(mix(dc, bg, dc[3]), bg) < 2) out.push('the accuracy claim has no visible underline at rest'); }
      const hd = document.querySelector('#db text.hd'), ib = document.querySelector('#dbib svg'), db = document.getElementById('db'); if (vis(hd) && vis(ib)) { const a = R(hd), b = R(ib); if (b.left - a.right < 6 * z - 0.5) out.push(`the (i) sits ${(b.left - a.right).toFixed(1)} px after "Fewer errors" (< 6)`); if (db && b.right > R(db).right + 0.5) out.push('the (i) runs past the accuracy column'); } }
    // round 11: retired "the intro runs on to the accuracy block" (the intro sentence and the hero accuracy block are gone)
    // the flight-path map: runway plates and the stacked chip clear of the landing lines (6 px) and the runway strips (2 px)
    // round 8: every drawn path counts, the take-offs and the other direction's dashed approaches too
    // round 15: a plate on its 2 px map-colour halo may sit over an "if switched" line (see the round 15 rule below); every other line 6 px
    { const segs = []; for (const p of document.querySelectorAll('#map path.app, #map path.dep, #map path.gapp')) { const m = (p.getAttribute('d') || '').match(/-?[\d.]+/g); if (m && m.length >= 4) segs.push([+m[0], +m[1], +m[2], +m[3], 6, p.classList.contains('gapp')]); }
      for (const l of document.querySelectorAll('#map line.rwy')) segs.push([+l.getAttribute('x1'), +l.getAttribute('y1'), +l.getAttribute('x2'), +l.getAttribute('y2'), 2 + 2.5]);
      const dS = (x, y, [ax, ay, bx, by]) => { const vx = bx - ax, vy = by - ay, f = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / (vx * vx + vy * vy || 1))); return Math.hypot(x - ax - vx * f, y - ay - vy * f); };
      for (const r of document.querySelectorAll('#map rect.rwp')) { const x0 = +r.getAttribute('x'), y0 = +r.getAttribute('y'), x1 = x0 + +r.getAttribute('width'), y1 = y0 + +r.getAttribute('height');
        for (const sg of segs) { if (sg[5] && r.previousElementSibling?.classList.contains('rwph')) continue; let d = 1e9; for (let f = 0; f <= 1; f += 0.01) { const x = sg[0] + (sg[2] - sg[0]) * f, y = sg[1] + (sg[3] - sg[1]) * f; d = Math.min(d, Math.hypot(Math.max(x0 - x, 0, x - x1), Math.max(y0 - y, 0, y - y1))); } void dS;
          if (d < sg[4] - 0.5) { out.push(`a runway plate on the flight-path map sits ${d.toFixed(1)} px from a ${sg[4] === 6 ? 'path line' : 'runway strip'}`); break; } } } }
    // the (i) beside "Fewer errors": a 16 px drawn icon at the drawn arrows' stroke weight, in a >= 32 px hit area
    { const b = document.getElementById('dbib'), sv = b && b.querySelector('svg'), ar = document.querySelector('.beat .tarr'); if (vis(b)) { const q = R(b); if (q.width / z < 31.5 || q.height / z < 31.5) out.push(`the (i) hit area is ${Math.round(q.width / z)} x ${Math.round(q.height / z)} px (< 32)`);
      if (!sv || Math.abs(R(sv).width / z - 16) > 0.5) out.push('the (i) is not a 16 px drawn icon');
      else if (vis(ar)) { const a = parseFloat(getComputedStyle(sv).strokeWidth) * R(sv).width / 16, c = parseFloat(getComputedStyle(ar).strokeWidth) * R(ar).width / 34; if (Math.abs(a - c) > 0.35 * z) out.push(`the (i) stroke (${a.toFixed(2)} px) differs from the drawn arrow's (${c.toFixed(2)} px)`); } } }
    // light: the official amber text >= 5:1 (one step darker than its 4.6:1)
    for (const e of document.querySelectorAll('.accst .of, #trust .of')) { /* round 11: the official figures live in the accuracy detail view */ if (!vis(e) || !e.textContent.trim()) continue; const fg = col(getComputedStyle(e).color), bg = bgBehind(e); if (fg && bg && lum(bg) > 0.5 && cr(fg, bg) < 5) { out.push(`the official amber "${e.textContent.trim()}" is ${cr(fg, bg).toFixed(2)}:1 (< 5)`); break; } }
    // light: tertiary grey text >= 5:1 on the page
    { const f = document.querySelector('.pfoot, footer'); if (vis(f)) { const fg = col(getComputedStyle(document.documentElement).getPropertyValue('--ink3').trim().replace(/^#(..)(..)(..)$/, (m, a, b, c) => `rgb(${parseInt(a, 16)}, ${parseInt(b, 16)}, ${parseInt(c, 16)})`)), bg = bgBehind(f); if (fg && bg && lum(bg) > 0.5 && cr(fg, bg) < 5) out.push(`tertiary grey on the page is ${cr(fg, bg).toFixed(2)}:1 (< 5)`); } }
    if (W < 480) { // phones: the Now pill 12 px inside the card, value labels 4 px clear of the Now line, row-name chips their text + 4 px
      const nt = document.querySelector('.ruler .nowtag'), cd = document.querySelector('.tlc'), nl = document.querySelector('#bands .nowl');
      if (vis(nt) && vis(cd) && R(nt).left - R(cd).left < 11.5) out.push(`the Now pill sits ${Math.round(R(nt).left - R(cd).left)} px from the card's edge (< 12)`);
      if (nl && vis(nl)) for (const t of document.querySelectorAll('.lpg text.gt, .lwd text.ax')) { if (!vis(t) || !/^\d/.test(t.textContent.trim())) continue; const q = textBox(t) || R(t); if (q.left < R(nl).right + 3.5) out.push(`the axis value "${t.textContent.trim()}" sits ${(q.left - R(nl).right).toFixed(1)} px from the Now line (< 4)`); }
      for (const n of document.querySelectorAll('#tl .hl')) { const t = vis(n) && !n.hidden && textBox(n); if (t && Math.abs(R(n).width - (t.right - t.left) - 4) > 0.75) out.push(`the row name chip "${n.textContent.trim()}" is ${Math.round(R(n).width - (t.right - t.left))} px wider than its text (not 4)`); }
      // phones: the time-zone switch and the page tabs are the same height
      const tz = document.getElementById('tz'), nv = document.querySelector('.topbar .nav'); if (vis(tz) && vis(nv) && Math.abs(R(tz).height - R(nv).height) > 1) out.push(`the time-zone switch (${Math.round(R(tz).height)} px) and the tabs (${Math.round(R(nv).height)} px) differ in height`); }
  }
  // round 5: first screen on phones, one kicker, thin Now line, headwind and accuracy axes, runway plates, row names, 3D legend spacing
  if (document.getElementById('answer')) { // the dashboard
    // phones (390 x 844): the headwind plot's top inside the first screen (the intro sentence moves under the panels)
    if (W < 480 && innerHeight >= 800) { const p = document.getElementById('lwd'); if (vis(p) && R(p).top > innerHeight - 24) out.push(`the headwind plot starts at y=${Math.round(R(p).top)}, below the first screen (> ${innerHeight - 24})`); }
    // the kicker reads "Runway direction now · since <day>, <time> · <how long>" at every width (round 11: the duration moved here from the stat row)
    { const k = document.getElementById('eyebrow'); if (vis(k)) { const t = k.innerText.replace(/\s+/g, ' ').trim(), b = getComputedStyle(k, '::before').content; if (!/^Runway direction now · since \w{3} \d{1,2} \w{3}, \d\d:\d\d · \d+ (days|\u202fh)$/.test(t.replace(/(\d) h$/, '$1\u202fh')) || (b && b !== 'none' && b !== 'normal')) out.push(`the kicker reads "${b && b !== 'none' && b !== 'normal' ? b.replace(/"/g, '') : ''}${t}" (not "Runway direction now · since Day D Mon, HH:MM · N days")`); } }
    // round 11 (reversed: was "desktop: the 0 line carries no label"): the 0 line labelled "0" at every width, now that the
    // limit sits at its true distance under it and its label under its own line; the area past the limit shaded to the plot's bottom
    if (W >= 480) { const z0 = document.querySelector('.lwd line.zero'), l0 = [...document.querySelectorAll('.lwd text.ax')].find(t => vis(t) && t.textContent.trim() === '0'); if (z0 && R(z0).width && !l0) out.push('the headwind 0 line has no "0" label');
      else if (z0 && l0) { const zy = R(z0).top, lb = R(l0); if (zy < lb.top || zy > lb.bottom) out.push(`the headwind "0" label sits off its line (${Math.round(lb.top - zy)} px)`); }
      const zn = document.querySelector('.lwd .zone'), sv = document.querySelector('#lwd svg'); if (zn && sv && R(sv).height && R(sv).bottom - R(zn).bottom > 1.5) out.push(`the headwind area past the limit is shaded only ${Math.round(R(zn).height)} px (not to the plot's bottom)`); }
    // the accuracy axis values sit just under the plot (<= 8 px from its axis line)
    { const ax = document.querySelector('.db .dbax'); if (ax && vis(document.getElementById('db'))) { const y = R(ax).top; for (const t of document.querySelectorAll('.db text.tk')) { const q = R(t); if (q.top - y > 8 || q.top < y - 4) /* the text box starts above the glyphs */ { out.push(`the accuracy axis value "${t.textContent.trim()}" sits ${Math.round(q.top - y)} px under the plot (0 to 8)`); break; } } } }
    // the flight-path map: one plate per runway, each beside its own strip (<= 16 px from it); the stacked chip only where the map is too small (1280, 1366)
    { const ls = [...document.querySelectorAll('#map line.rwy')], chip = document.querySelector('#map .rwt11'); if (chip && ((W >= 1440 && innerHeight >= 900) || W < 480)) out.push('the flight-path map stacks the runway names in one chip'); if (ls.length && !chip) {
      const pts = [...document.querySelectorAll('#map text.rwt')]; for (const l of ls) { const t = pts.find(e => e.textContent.trim() === l.dataset.des), rc = t && t.previousElementSibling; if (!t || !rc) { out.push(`the flight-path map has no plate for runway ${l.dataset.des}`); continue; }
          const x0 = +rc.getAttribute('x'), y0 = +rc.getAttribute('y'), x1 = x0 + +rc.getAttribute('width'), y1 = y0 + +rc.getAttribute('height'), a = [+l.getAttribute('x1'), +l.getAttribute('y1')], b = [+l.getAttribute('x2'), +l.getAttribute('y2')]; let d = 1e9;
          for (let f = 0; f <= 1; f += 0.01) { const x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f; d = Math.min(d, Math.hypot(Math.max(x0 - x, 0, x - x1), Math.max(y0 - y, 0, y - y1))); }
          if (d > 16) out.push(`the map's "${l.dataset.des}" plate sits ${Math.round(d)} px from its strip (> 16)`); } } }
  }
  // round 14: on the flight-path map (where each runway has its own plate) every plate clears the starts of the take-off
  // lines and of the "if switched" dashes by >= 4 px. Round 15 (retired: "no plate splits an 'if switched' line", the
  // dashes then stopped at the plate): each "if switched" line is one continuous path, and a plate over one sits on top
  // with a 2 px halo in the map's background colour
  if (W >= 1440 && innerHeight >= 900 && document.getElementById('answer')) { const sv = document.querySelector('#map svg'); if (sv && !sv.querySelector('.rwt11')) {
      const pts = d => (d.match(/-?[\d.]+/g) || []).map(Number), plates = [...sv.querySelectorAll('rect.rwp')].map(r => { const x0 = +r.getAttribute('x'), y0 = +r.getAttribute('y'); return [r.nextElementSibling?.textContent.trim(), [x0, y0, x0 + +r.getAttribute('width'), y0 + +r.getAttribute('height')], r]; });
      const pb = (x, y, q) => Math.hypot(Math.max(q[0] - x, 0, x - q[2]), Math.max(q[1] - y, 0, y - q[3]));
      const starts = [...sv.querySelectorAll('path.dep')].map(p => ['take-off line', pts(p.getAttribute('d')).slice(0, 2)]);
      const runs = {}; for (const p of sv.querySelectorAll('path.gapp')) { const v = pts(p.getAttribute('d')); starts.push(['"if switched" dashes', v.slice(0, 2)]); (runs[p.dataset.l] = runs[p.dataset.l] || []).push(v); }
      for (const [n, q] of plates) for (const [what, [x, y]] of starts) { const d = pb(x, y, q) - 1; if (d < 4) out.push(`the map's "${n}" plate sits ${d.toFixed(1)} px from the start of a ${what} (< 4)`); }
      for (const [l, rs] of Object.entries(runs)) { if (rs.length > 1) out.push(`an "if switched" line is drawn in ${rs.length} pieces (one continuous line)`);
        const [ax, ay, bx, by] = rs[0]; for (const [n, q, r] of plates) { let hit = false; for (let t = 0; t <= 1 && !hit; t += 0.005) hit = pb(ax + (bx - ax) * t, ay + (by - ay) * t, q) < 1.5;
          if (!hit) continue; const h = r.previousElementSibling, hx = h && +h.getAttribute('x'), hy = h && +h.getAttribute('y'), card = getComputedStyle(sv.closest('.card, .c3d') || document.body).backgroundColor;
          if (!h || !h.classList.contains('rwph') || q[0] - hx < 1.99 || q[1] - hy < 1.99 || hx + +h.getAttribute('width') - q[2] < 1.99 || hy + +h.getAttribute('height') - q[3] < 1.99 || getComputedStyle(h).fill !== card) out.push(`the map's "${n}" plate crosses an "if switched" line without a 2 px halo in the map's colour`); } void l; } } }
  // phones: a thin Now line on both pages (<= 1.25 px), still the darkest rule
  if (W < 480) for (const s of ['#bands .nowl', '.dock .nowline']) { const n = document.querySelector(s); if (vis(n) && R(n).width > 1.25) out.push(`the Now line (${s}) is ${R(n).width.toFixed(1)} px wide on phones (> 1.25)`); }
  // the Runway 18 row name within 12 px of its cell strip (above it or beside it), on both pages
  for (const [l, p] of [['#hl18', '#l18'], ['#r18-l', '#marks']]) { const a = document.querySelector(l), b = document.querySelector(p); if (!vis(a) || a.hidden || !vis(b)) continue; const t = textBox(a); if (t && R(b).top - t.bottom > 12) out.push(`the row name ${l} sits ${Math.round(R(b).top - t.bottom)} px above its strip (> 12)`); }
  // 3D desktop (taller than 800 px): the legend row 24 px clear of the Runway 18 strip
  if (document.getElementById('app') && W >= 640 && innerHeight > 800) { const m = document.getElementById('marks'), k = document.getElementById('dkey'); if (vis(m) && vis(k) && R(k).top - R(m).bottom < 24) out.push(`the 3D legend sits ${Math.round(R(k).top - R(m).bottom)} px under the Runway 18 strip (< 24)`); }
  // round 6: one kicker on both pages, the phone accuracy block, the accuracy card's labels, map plates and key, one control style, the theme toggle
  const light = document.documentElement.dataset.theme !== 'dark';
  // the theme toggle has an accessible name and a tooltip, the same on both pages
  { const b = document.querySelector('#theme, #b-thm'); if (b && (b.getAttribute('aria-label') !== 'Light / dark theme' || b.title !== 'Light / dark theme')) out.push(`the theme toggle is named "${b.getAttribute('aria-label')}" / titled "${b.title}" (not "Light / dark theme")`); }
  // light: every amber (official) text >= 5:1 on what is behind it, on both pages
  if (light) for (const el of document.querySelectorAll('body *')) { if (!ownText(el) || !vis(el) || el.closest('script,style,title,option')) continue; const cs = getComputedStyle(el), fg = col(el instanceof SVGElement ? cs.fill : cs.color); if (!fg || !(fg[0] > fg[1] && fg[1] > fg[2] && fg[0] - fg[2] > 60)) continue;
    const bg = bgBehind(el instanceof SVGElement ? el.ownerSVGElement || el : el); if (bg && cr(fg, bg) < 5) { out.push(`the amber text "${el.textContent.trim().slice(0, 20)}" is ${cr(fg, bg).toFixed(2)}:1 (< 5)`); break; } }
  if (document.getElementById('app') && window.__fra) { // the 3D view
    // the kicker reads "Runway direction now · since <day>, <time>" at every width (phones: the card's first line)
    { const k = [document.getElementById('eyebrow'), document.querySelector('.sumbar .sb0')].find(vis); if (k) { const t = k.innerText.replace(/\s+/g, ' ').trim(); if (!/^Runway direction now · since \w{3} \d{1,2} \w{3}, \d\d:\d\d · \d+ (days|\u202fh)$/.test(t.replace(/(\d) h$/, '$1\u202fh'))) out.push(`the 3D kicker reads "${t}" (not "Runway direction now · since Day D Mon, HH:MM · N days")`); /* round 12: with how long, as on the dashboard */
        if (W >= 640 && k.id === 'eyebrow') { const q = textBox(k); if (q && (q.bottom - q.top) / (parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1) > 22) out.push('the 3D kicker wraps'); } } }
    if (W < 640) {
      // phones: Details never sits on a line of the card's text
      const d = document.querySelector('.sbx > summary'); if (vis(d)) for (const s of ['.sb0', '.sb1', '.sb2']) { const e = document.querySelector(`.sumbar ${s}`), t = vis(e) && textBox(e); if (t && hit(R(d), t, -0.5)) out.push(`"Details" overlaps the card's ${s} text`); }
      // phones: runway tags 12 px under the top card
      const hr = document.querySelector('.hud .hero'); if (vis(hr)) for (const l of document.querySelectorAll('.lbl.rwy')) { if (l.style.display === 'none' || !l.textContent.trim() || !vis(l)) continue; const q = R(l.querySelector('b') || l); if (q.top - R(hr).bottom < 12 && q.bottom > R(hr).top) out.push(`the 3D "${l.textContent.trim()}" tag sits ${Math.round(q.top - R(hr).bottom)} px under the top card (< 12)`); }
      // phones: the map key is the map's footer (no card shadow of its own), 8 px or less above the bottom sheet
      const k = document.querySelector('.row.mapkey.mapov'), dk = document.querySelector('.dock'); if (vis(k) && vis(dk)) { if (getComputedStyle(k).boxShadow !== 'none') out.push('the phone map key is a card of its own (it has a shadow)'); if (R(dk).top - R(k).bottom > 8.5) out.push(`the phone map key sits ${Math.round(R(dk).top - R(k).bottom)} px above the bottom sheet (> 8)`); }
      // phones: the 48 h legend on an aligned grid (at most three column starts, every row starting on the first); the hour ticks at the row names' size
      const items = [...document.querySelectorAll('.dock > #dkey > *')].filter(vis).map(R); if (items.length > 1) { const xs = [...new Set(items.map(q => Math.round(q.left)))], rows = [...new Set(items.map(q => Math.round(q.top)))];
        if (xs.length > 3) out.push(`the 3D legend items start at ${xs.length} x positions (> 3 columns)`); const firsts = rows.map(t => Math.min(...items.filter(q => Math.round(q.top) === t).map(q => q.left))); if (Math.max(...firsts) - Math.min(...firsts) > 1) out.push('the 3D legend rows do not start on one left edge'); }
      const tk = [...document.querySelectorAll('#ticks span.hr')].find(vis), rn = [...document.querySelectorAll('.dock .rowlbl > span')].find(vis); if (tk && rn && getComputedStyle(tk).fontSize !== getComputedStyle(rn).fontSize) out.push(`the hour ticks (${getComputedStyle(tk).fontSize}) and the row names (${getComputedStyle(rn).fontSize}) differ in size`);
    } else {
      // desktop: Reset view, Full screen and Details share one outlined style (border, radius, height), text >= 4.5:1 on their fill
      const bs = ['#b-home', '#b-fs', '.rail .pdet > summary'].map(s => document.querySelector(s)).filter(vis); const sig = b => { const c = getComputedStyle(b); return `${c.borderTopWidth} ${c.borderTopStyle} ${c.borderTopColor} r${c.borderTopLeftRadius} h${Math.round(R(b).height / z)}`; };
      if (bs.length === 3 && new Set(bs.map(sig)).size > 1) out.push(`the 3D controls differ: ${bs.map(b => `${b.id || 'Details'}: ${sig(b)}`).join('; ')}`);
      for (const b of bs) { const c = getComputedStyle(b), fg = col(c.color), bg = bgBehind(b); if (!(parseFloat(c.borderTopWidth) > 0) || c.borderTopStyle === 'none') out.push(`"${b.textContent.trim()}" has no outline`); /* zoomed panels compute 1 px as 0.9 */ if (fg && bg && cr(fg, bg) < 4.5) out.push(`"${b.textContent.trim()}" text is ${cr(fg, bg).toFixed(2)}:1 (< 4.5)`); }
      const sel = document.querySelector('.dmenu select'); if (vis(sel) && bs.length && Math.abs(R(sel).height - R(bs[0]).height) > 1) out.push(`the run picker (${Math.round(R(sel).height)} px) and the map buttons (${Math.round(R(bs[0]).height)} px) differ in height`);
      // round 11: retargeted "the drag hint >= 7:1 on its chip" (the chip is gone: the hint is plain text): >= 4.5:1 against
      // the map where it sits, as drawn (halo included), measured from the pixels in the main loop
    }
    // light: runway tags are light plates with dark text (secondary to the path lines)
    if (light) for (const l of document.querySelectorAll('.lbl.rwy b')) { if (!vis(l) || !l.textContent.trim()) continue; const c = getComputedStyle(l), b = col(c.backgroundColor), f = col(c.color); if (!b || lum(b) < 0.8 || !f || lum(f) > 0.1) { out.push(`the 3D "${l.textContent.trim()}" tag is not a light plate with dark text (${c.backgroundColor} / ${c.color})`); break; } }
  }
  if (document.getElementById('answer')) { // the dashboard
    // phones (390 x 844): the whole headwind plot inside the first screen
    if (W < 480 && innerHeight >= 800) { const p = document.getElementById('lwd'); if (vis(p) && R(p).bottom > innerHeight + 0.5) out.push(`the headwind plot ends at y=${Math.round(R(p).bottom)}, below the first screen (> ${innerHeight})`); }
    // round 11 (was the phone accuracy block): the accuracy is one quiet line, smaller than the outlook, in the secondary
    // grey; from 480 px under the outlook (4 to 16 px, one line on desktop); phones: a footnote under the cards, the first
    // screen keeps the chart
    if (W < 480) { const p = document.getElementById('trustph'), c = document.querySelector('.c3d') || document.querySelector('.tlc'); if (!vis(p)) out.push('phones: no trust line'); else if (vis(c) && R(p).top < R(c).bottom) out.push('phones: the trust line sits above the cards');
      if (vis(document.getElementById('trust'))) out.push('phones: the trust line shows twice'); }
    { const p = W < 480 ? document.getElementById('trustph') : document.getElementById('trust'), sh = document.getElementById('subhead');
      if (vis(p) && vis(sh)) { const a = textBox(sh), b = textBox(p), ink2 = getComputedStyle(document.documentElement).getPropertyValue('--ink2').trim(); if (W >= 480 && a && b && ((b.top - a.bottom) / z < 4 || (b.top - a.bottom) / z > 16)) out.push(`the trust line sits ${Math.round((b.top - a.bottom) / z)} px under the outlook (4 to 16)`);
        if (parseFloat(getComputedStyle(p).fontSize) >= parseFloat(getComputedStyle(sh).fontSize)) out.push(`the trust line (${getComputedStyle(p).fontSize}) is not smaller than the outlook line (${getComputedStyle(sh).fontSize})`);
        if (parseFloat(getComputedStyle(p).fontSize) > 15.01) out.push(`the trust line is set in ${getComputedStyle(p).fontSize} (> 15 px, the body size)`);
        const hx = h => { const m = /^#(..)(..)(..)$/.exec(h); return m ? `rgb(${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)})` : h; }; if (ink2 && getComputedStyle(p).color !== hx(ink2)) out.push(`the trust line is ${getComputedStyle(p).color}, not the secondary grey ${hx(ink2)}`);
        if (W >= 900 && b && (b.bottom - b.top) / z > 24) out.push('the trust line wraps on desktop'); } }
    // desktop: the kicker >= 15 px under the header rule
    if (W >= 900) { const k = document.getElementById('eyebrow'), tb = document.querySelector('.topbar'), t = vis(k) && textBox(k); if (t && tb && (t.top - R(tb).bottom) / z < 15) out.push(`the kicker sits ${Math.round((t.top - R(tb).bottom) / z)} px under the header rule (< 15)`); }
    // accuracy by lead time: every label at 13 px or more, >= 5:1 on the card in light
    { const db = document.getElementById('db'); if (vis(db)) for (const t of db.querySelectorAll('text')) { if (!vis(t) || !t.textContent.trim()) continue; const m = t.getScreenCTM(), fs = parseFloat(getComputedStyle(t).fontSize) * (m ? Math.hypot(m.a, m.b) : 1) / z; if (fs < 12.99) { out.push(`the accuracy card sets "${t.textContent.trim()}" in ${fs.toFixed(1)} px (< 13)`); break; }
        const fg = col(getComputedStyle(t).fill), bg = bgBehind(t.ownerSVGElement); if (light && fg && bg && cr(fg, bg) < 5) { out.push(`the accuracy card's "${t.textContent.trim()}" is ${cr(fg, bg).toFixed(2)}:1 (< 5)`); break; } } }
    // the flight-path map: every runway plate 6 px clear of the path arrowheads; light: plates are light with dark text (a closed runway stays red)
    { const sv = document.querySelector('#map svg'); if (sv) { const bb = e => { const b = e.getBBox(); return [b.x, b.y, b.x + b.width, b.y + b.height]; }, sep = (a, b) => Math.max(a[0] - b[2], b[0] - a[2], a[1] - b[3], b[1] - a[3]), ar = [...sv.querySelectorAll('path.arw')].map(bb);
        for (const p of sv.querySelectorAll('rect.rwp')) { const q = bb(p), s = Math.min(...ar.map(a => sep(q, a))); if (s < 6) { out.push(`a runway plate on the flight-path map sits ${s.toFixed(1)} px from an arrowhead (< 6)`); break; } }
        if (light) for (const p of sv.querySelectorAll('rect.rwp:not(.cl)')) { const f = col(getComputedStyle(p).fill), t = p.nextElementSibling, tf = t && col(getComputedStyle(t).fill); if (!f || lum(f) < 0.8 || (tf && lum(tf) > 0.1)) { out.push(`a runway plate on the flight-path map is not light with dark text (${getComputedStyle(p).fill})`); break; } } } }
    // desktop: the flight-path key's rows start on one left edge, the card title's
    if (W >= 900) { const k = document.querySelector('.c3d .mlg'), ti = document.querySelector('.c3d .mhd .lbl'); if (vis(k) && vis(ti)) { const items = [...k.children].filter(e => vis(e) && e.textContent.trim()).map(R), rows = [...new Set(items.map(q => Math.round(q.top)))], firsts = rows.map(t => Math.min(...items.filter(q => Math.round(q.top) === t).map(q => q.left))), tl = textBox(ti).left;
      if (Math.max(...firsts) - Math.min(...firsts) > 1) out.push('the flight-path key rows do not start on one left edge'); else if (Math.abs(firsts[0] - tl) > 2) out.push(`the flight-path key starts ${Math.round(firsts[0] - tl)} px from the card title's edge`); } }
  }
  // round 7: accuracy axis, micro-labels, footer measure, map north and scale, theme glyph, 3D chevron, footer air, Now tag, map key strip
  const fsOf = el => { let fs = parseFloat(getComputedStyle(el).fontSize); if (el instanceof SVGElement && el.getScreenCTM()) { const m = el.getScreenCTM(); fs *= Math.hypot(m.a, m.b) / z; } return fs; };
  if (document.getElementById('answer')) { // the dashboard
    // accuracy by lead time: every gridline ends on the baseline, a tick mark under it runs >= 3 px below, its value centred under it
    { const ax = document.querySelector('.db .dbax'); if (ax && vis(document.getElementById('db'))) { const y = R(ax).top, gl = [...document.querySelectorAll('.db line.dbg')], tm = [...document.querySelectorAll('.db line.dbtm')], tk = [...document.querySelectorAll('.db text.tk')];
      if (tm.length !== gl.length) out.push(`the accuracy axis has ${gl.length} gridlines and ${tm.length} tick marks`);
      for (const g of gl) { const q = R(g), m = tm.find(t => Math.abs(R(t).left - q.left) < 0.6), l = tk.find(t => Math.abs((R(t).left + R(t).right) / 2 - (q.left + q.right) / 2) < 1.5);
        if (Math.abs(q.bottom - y) > 1) { out.push(`an accuracy gridline stops ${Math.round(y - q.bottom)} px short of the baseline`); break; }
        if (!m || R(m).top > y + 1 || (R(m).bottom - y) / z < 2.5) { out.push('an accuracy gridline has no tick mark through the baseline'); break; }
        if (!l || R(l).top < R(m).bottom - 2 * z) { out.push('an accuracy tick value is not directly under its tick mark'); break; } } } }
    // desktop: the accuracy rows get the card's height: 19 px or more each, the stat tiles <= 12 px under the axis values
    if (W >= 900) { const db = document.getElementById('db'), st = document.querySelector('.rec .accst'), rules = [...document.querySelectorAll('.db line.dbrule')].map(l => R(l).top).sort((a, b) => a - b), tk = [...document.querySelectorAll('.db text.tk')].filter(vis);
      if (vis(db) && vis(st) && tk.length) { const g = (R(st).top - Math.max(...tk.map(t => R(t).bottom))) / z; if (g > 12.5) out.push(`the accuracy tiles sit ${Math.round(g)} px under the axis values (> 12: the space belongs to the rows)`); if (g < 3.5) out.push(`the accuracy tiles sit ${Math.round(g)} px under the axis values (< 4)`);
        for (let i = 1; i < rules.length; i++) if ((rules[i] - rules[i - 1]) / z < 18.5) { out.push(`an accuracy row is ${Math.round((rules[i] - rules[i - 1]) / z)} px tall (< 19)`); break; } } }
    // the 48 h card's micro-labels (chance scale, headwind scale, limit) at 13 px in the accuracy axis's grey
    { const ref = document.querySelector('.db text.tk'), rf = ref && getComputedStyle(ref).fill; for (const t of document.querySelectorAll('.lpg text.gt, .lwd text.ax, .lwd #limt')) { if (!vis(t) || !t.textContent.trim()) continue; const fs = fsOf(t);
      if (fs < 12.99) { out.push(`the 48 h scale label "${t.textContent.trim().slice(0, 16)}" is set in ${fs.toFixed(1)} px (< 13)`); break; } if (rf && getComputedStyle(t).fill !== rf) { out.push(`the 48 h scale label "${t.textContent.trim().slice(0, 16)}" is ${getComputedStyle(t).fill}, the accuracy axis ${rf}`); break; } } }
    // desktop: the footer in two short lines, the second ending on the accuracy card's right edge; neither wider than 62 % of the window
    if (W >= 1280) { const fl = [...document.querySelectorAll('.pfoot .fl')].filter(vis), rc = document.querySelector('.c3d'); /* round 11: the right column's card is the flight-path map (was the accuracy card) */
      if (fl.length !== 2) out.push(`the footer has ${fl.length} lines (not 2)`); else { for (const f of fl) { const t = textBox(f); if (t && t.right - t.left > 0.62 * W) out.push(`a footer line runs ${Math.round(t.right - t.left)} px wide (> 62 % of the window)`); if (t && t.bottom - t.top > 24 * z) out.push(`the footer line "${f.textContent.slice(0, 20)}" wraps`); }
        if (vis(rc) && Math.abs(textBox(fl[1]).right - R(rc).right) > 1) out.push(`the footer's second line ends ${Math.round(R(rc).right - textBox(fl[1]).right)} px from the right column's card edge`); /* round 9: on the content's right edge, as on the 3D view (was: from the card's left edge) */
        const tc = document.querySelector('.tlc'); if (vis(tc) && Math.abs(textBox(fl[0]).left - R(tc).left) > 1) out.push(`the footer's first line starts ${Math.round(textBox(fl[0]).left - R(tc).left)} px from the 48 h card's edge`); }
      // round 8: the backtest is named once on the dashboard (the footer's second line, with its length)
      { const n = (document.body.innerText.match(/Backtest/g) || []).length; if (n !== 1) out.push(`the dashboard names the backtest ${n} times (not once)`); if (fl.length === 2 && !/^Backtest: \d+\s?months, walk-forward/.test(fl[1].textContent)) out.push(`the footer's backtest line does not lead with its length ("${fl[1].textContent.slice(0, 40)}")`); } }
    // the flight-path map: a drawn north arrow >= 14 px, a 2 px scale bar, their labels >= 13 px
    { const n = document.querySelector('#map .scl path.narw'), b = document.querySelector('#map .scl path.sbar'), ts = [...document.querySelectorAll('#map .scl text')];
      if (document.querySelector('#map .scl')) { if (!n || R(n).height / z < 13.5) out.push(`the map's north arrow is ${n ? Math.round(R(n).height / z) : 0} px tall (< 14)`);
        if (!b || parseFloat(getComputedStyle(b).strokeWidth) < 2) out.push(`the map's scale bar is ${b ? getComputedStyle(b).strokeWidth : 'missing'} thick (< 2 px)`);
        for (const t of ts) if (fsOf(t) < 12.99) { out.push(`the map's "${t.textContent}" is set in ${fsOf(t).toFixed(1)} px (< 13)`); break; } } }
  }
  // the theme toggle (both pages): an 18 px glyph at a 1.5 px stroke in a >= 32 px hit area
  { const b = document.querySelector('#theme, #b-thm'), sv = b && b.querySelector('svg'), k = document.getElementById('app') ? (parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1) : z;
    if (vis(b) && sv && W >= 640) { const g = R(sv).width / k, st = parseFloat(sv.getAttribute('stroke-width') || getComputedStyle(sv).strokeWidth) * g / 24;
      if (Math.abs(g - 18) > 0.5) out.push(`the theme glyph is ${g.toFixed(1)} px (not 18)`); if (Math.abs(st - 1.5) > 0.3) out.push(`the theme glyph's stroke is ${st.toFixed(2)} px (not 1.5)`); if (R(b).width / k < 31.5 || R(b).height / k < 31.5) out.push(`the theme toggle's hit area is ${Math.round(R(b).width / k)} x ${Math.round(R(b).height / k)} px (< 32)`); } }
  if (document.getElementById('app') && document.querySelector('.dock') && W >= 640) { // the 3D view, desktop
    // the run picker: the Details chevron (size, stroke, colour, direction), no other glyph; the map buttons' edge colour round its track
    { const c = document.querySelector('.dmenu .chev'), d = document.querySelector('.rail .pdet > summary'); if (document.querySelector('.dmenu svg')) out.push('the run picker draws its own chevron glyph');
      if (vis(c) && vis(d)) { const a = getComputedStyle(c), q = getComputedStyle(d, '::before'), sig = x => [x.width, x.height, x.borderRightWidth, x.borderBottomWidth, x.borderRightColor, x.borderTopWidth, x.borderLeftWidth].join(' '); if (sig(a) !== sig(q)) out.push(`the run picker's chevron (${sig(a)}) differs from Details' (${sig(q)})`); }
      else if (vis(d)) out.push('the run picker has no chevron');
      const sel = document.querySelector('.dmenu select'), hb = document.getElementById('b-home'); if (vis(sel) && vis(hb)) { const sh = getComputedStyle(sel).boxShadow, ec = getComputedStyle(hb).borderTopColor, rings = [...sh.matchAll(/(rgba?\([^)]+\)|color\([^)]+\))\s+0px\s+0px\s+0px\s+([\d.]+)px/g)].sort((x, y) => +y[2] - +x[2]);
        if (!rings.length || rings[0][1].replace(/\s/g, '') !== ec.replace(/\s/g, '')) out.push(`the run picker's outer edge (${rings.length ? rings[0][1] : 'none'}) is not the map buttons' (${ec})`); } }
    // the footer >= 16 px over the window's bottom
    { const a = document.querySelector('.attrib'), t = a && vis(a) && textBox(a); if (t && innerHeight - t.bottom < 15.5) out.push(`the footer sits ${Math.round(innerHeight - t.bottom)} px over the window's bottom (< 16)`); }
  }
  // desktop, both pages: the Now tag hangs off its line: its right edge 2 to 6 px left of the line, the line up to the tag
  if (W >= 640) { const t = document.querySelector('#ruler .nowtag, #nowtick'), l = document.querySelector('#bands .nowl, #nowline'), k = document.getElementById('app') ? (parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1) : z;
    if (vis(t) && l && vis(l)) { const g = (R(l).left - R(t).right) / k; if (g < 1.5 || g > 6.5) out.push(`the Now tag ends ${g.toFixed(1)} px from the Now line (2 to 6)`); if (R(l).top > R(t).bottom - 4) out.push(`the Now line starts ${Math.round(R(l).top - R(t).bottom)} px under the Now tag (it should reach it)`); } }
  // round 8 (desktop, both pages): the Now tag points at its line: a pointer on its right side, in the tag's colour, its tip on the line
  if (W >= 640) { const t = document.querySelector('#ruler .nowtag, #nowtick'), l = document.querySelector('#bands .nowl, #nowline');
    if (vis(t) && l && vis(l)) { const a = getComputedStyle(t, '::after'), bw = parseFloat(a.borderLeftWidth) || 0, tip = R(t).right + bw * (R(t).width / t.offsetWidth || 1);
      if (a.content === 'none' || a.position !== 'absolute' || bw < 3 || a.borderLeftColor !== getComputedStyle(t).backgroundColor) out.push(`the Now tag has no pointer at its line (${a.content}, ${a.borderLeftWidth} ${a.borderLeftColor})`);
      else if (tip < R(l).left - 1 || tip > R(l).right + 1) out.push(`the Now tag's pointer ends at x=${tip.toFixed(1)}, not on the Now line (${R(l).left.toFixed(1)} to ${R(l).right.toFixed(1)})`); } }
  // round 8 (both pages): the theme toggle outlined like the other header controls: a 1 px ring at rest, the header's 8 px radius
  if (W >= 640) { const b = document.querySelector('#theme, #b-thm'); if (vis(b)) { const c = getComputedStyle(b), ring = /inset/.test(c.boxShadow) && /0px 0px 0px 1px/.test(c.boxShadow);
    if (!ring && parseFloat(c.borderTopWidth) !== 1) out.push(`the theme toggle has no 1 px outline at rest (${c.boxShadow})`); if (c.borderTopLeftRadius !== '8px') out.push(`the theme toggle's radius is ${c.borderTopLeftRadius} (not 8px)`); } }
  // round 8, dashboard: the accuracy card's official values at our values' size and weight (colour is the only difference)
  { const vs = [...document.querySelectorAll('.db text.dbv')].filter(vis); if (vs.length) { const sig = e => { const c = getComputedStyle(e); return `${c.fontSize} ${c.fontWeight}`; }, set = new Set(vs.map(sig)); if (set.size > 1) out.push(`the accuracy values differ in size or weight: ${[...set].join(' / ')}`); } }
  if (document.getElementById('app') && document.querySelector('.dock') && W >= 640) { const hz = parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1, dk = document.querySelector('.dock');
    // round 8, 3D: the chart card's legend as close to its bottom edge as its title is to its top (no dead band under it)
    { const h = document.querySelector('.dock .dhd'), k = document.getElementById('dkey'), th = vis(h) && textBox(h), tk = vis(k) && textBox(k); if (th && tk) { const top = (th.top - R(dk).top) / hz, bot = (R(dk).bottom - tk.bottom) / hz; if (bot - top > 3) out.push(`the 3D chart card has ${bot.toFixed(0)} px under its legend, ${top.toFixed(0)} px over its title (> 3 px apart)`); } }
    // round 8, 3D light: the run picker's edge reads as one 1 px line: the track (painted over the edge's spread) as light as the picker itself
    if (light) { const sel = document.querySelector('.dmenu select'); if (vis(sel)) { const sh = getComputedStyle(sel).boxShadow, m = /^(rgba?\([^)]+\)|color\([^)]+\))\s+0px\s+0px\s+0px\s+2px,\s*(rgba?\([^)]+\)|color\([^)]+\))/.exec(sh), bg = col(getComputedStyle(sel).backgroundColor);
      const tr = m && col(m[1]), ed = m && col(m[2]), seen = tr && ed && tr.slice(0, 3).map((v, i) => v * (tr[3] ?? 1) + ed[i] * (1 - (tr[3] ?? 1))), c = seen && bg ? (Math.max(lum(seen), lum(bg)) + 0.05) / (Math.min(lum(seen), lum(bg)) + 0.05) : 9;
      if (c > 1.1) out.push(`the run picker's track shows ${c.toFixed(2)}:1 against the picker (> 1.1: its edge reads 2 px or more)`); } }
    // round 8, 3D (from 1200 px): the footer in two short lines on one row: the sources on the chart card's left edge, the backtest note ending on its right edge
    if (W >= 1200) { const ls = [...document.querySelectorAll('.attrib .al')].filter(vis); if (ls.length !== 2) out.push(`the 3D footer has ${ls.length} lines (not 2)`); else { const [a, b] = ls.map(textBox);
      if (Math.abs(a.left - R(dk).left) > 1) out.push(`the 3D footer's first line starts ${Math.round(a.left - R(dk).left)} px from the chart card's edge`); if (Math.abs(b.right - R(dk).right) > 1) out.push(`the 3D footer's second line ends ${Math.round(b.right - R(dk).right)} px from the chart card's right edge`);
      for (const q of [a, b]) if (q.bottom - q.top > 20 * hz) out.push('a 3D footer line wraps'); if (Math.abs(a.top - b.top) > 1) out.push('the 3D footer lines sit on different rows'); if (b.left - a.right < 24 * hz) out.push(`the 3D footer lines are ${Math.round(b.left - a.right)} px apart (< 24)`);
      if (!/^Backtest: \d+\s?months, walk-forward/.test(ls[1].textContent)) out.push(`the 3D footer's backtest line does not lead with its length ("${ls[1].textContent.slice(0, 40)}")`); } } }
  // 3D desktop: the map key a strip at the map's bottom-left, outside the left card: on the page gutter, 12 px over the chart card,
  // 12 px or more under the left card, over no town marker or runway tag
  if (document.getElementById('app') && W >= 640 && window.__fra) { const k = document.getElementById('mapkey'), rl = document.querySelector('.rail'), dk = document.querySelector('.dock'), hz = parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1;
    if (k && rl && dk) { if (rl.contains(k)) out.push('the map key sits inside the left card (desktop: a strip on the map)');
      else if (vis(k)) { const q = R(k); if (Math.abs(q.left - R(rl).left) > 1.5) out.push(`the map key starts at x=${Math.round(q.left)}, the left card at x=${Math.round(R(rl).left)}`);
        if (Math.abs((R(dk).top - q.bottom) / hz - 16) > 1.5) out.push(`the map key sits ${Math.round((R(dk).top - q.bottom) / hz)} px over the chart card (not 16)`); /* round 12: the page gutter, was 12 */
        if ((q.top - R(rl).bottom) / hz < 15.5) out.push(`the map key sits ${Math.round((q.top - R(rl).bottom) / hz)} px under the left card (< 16)`);
        for (const m of document.querySelectorAll('.lbl.town.num, .lbl.rwy')) { if (m.style.display === 'none') continue; const e = m.querySelector('i') || m.querySelector('b') || m; if (vis(e) && hit(R(e), q)) { out.push(`the map key covers the map's "${m.textContent.trim()}"`); break; } } } } }
  // round 9 (desktop): hero scale and edges, card header rows, the limit label in its plot, tag clearances, neutral town
  // markers, the Main named, dashes clear of arrowheads, the map key's padding, legend edges, the 3D Runway 18 note and
  // headline arrow, one control radius, the first slot's name
  const hzR = document.getElementById('app') ? (parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1) : z;
  if (document.getElementById('answer') && W >= 900) { // the dashboard
    // the hero's top-right figure <= 32 px on screen and smaller than the headline; its block on its card column's edge, no
    // divider (round 11: the Runway 18 block in the right column, over the flight-path card; was the accuracy block)
    { const n = document.querySelector('.r18h .r18s b'), h = document.querySelector('#answer > span:not(.dbadge)'), pr = document.querySelector('.r18h'), lb = document.querySelector('.r18h .r18l'), rc = document.querySelector('.c3d');
      if (vis(n) && vis(h)) { const a = parseFloat(getComputedStyle(n).fontSize) * z, b = parseFloat(getComputedStyle(h).fontSize) * z; if (a > 32.5 || a >= b) out.push(`the Runway 18 status is ${a.toFixed(1)} px on screen (> 32, or not under the headline's ${b.toFixed(1)})`); }
      if (vis(pr) && parseFloat(getComputedStyle(pr).borderLeftWidth) > 0 && getComputedStyle(pr).borderLeftStyle !== 'none') out.push('the Runway 18 block has a divider on its left');
      if (vis(lb) && vis(rc)) { const t = textBox(lb); if (t && Math.abs(t.left - R(rc).left) > 1) out.push(`the Runway 18 block starts ${Math.round(t.left - R(rc).left)} px from its card column's edge (the kicker's rule: on the edge)`); } }
    // one header row on every card: the three titles at one offset from their card tops (+-1 px)
    { const ts = [['#tlh', '.tlc'], ['#rec .acchd .lbl', '#rec'], ['.c3d .mhd .lbl', '.c3d']].map(([t, c]) => { const e = document.querySelector(t), k = document.querySelector(c); if (!vis(e) || !vis(k)) return null; const n0 = [...e.childNodes].find(x => x.nodeType === 3 && x.textContent.trim()); if (!n0) return null; const rg = document.createRange(); rg.selectNodeContents(n0); return [t, (rg.getBoundingClientRect().top - R(k).top) / z]; }).filter(Boolean);
      if (ts.length >= 2 && Math.max(...ts.map(x => x[1])) - Math.min(...ts.map(x => x[1])) > 1) out.push( /* round 11: every visible card (the accuracy card in its detail view); was all three on the page */`the card titles sit at different offsets from their card tops: ${ts.map(x => `${x[0]} ${x[1].toFixed(1)}`).join(', ')}`); }
    // the headwind limit's label inside the plot, just above its dashed line; the gutter carries numeric ticks only
    { const lm = document.getElementById('limt'), sv = document.querySelector('#lwd svg'), ln = document.querySelector('.lwd line.lim');
      if (vis(lm) && sv && ln) { const q = R(lm), P = R(sv), y = R(ln).top; if (q.left < P.left - 0.5 || q.right > P.right + 0.5) out.push('the headwind limit label sits outside its plot (in the row-label gutter)'); const m = lm.getScreenCTM(), bl = m.f + m.d * +lm.getAttribute('y'); /* its baseline: the label has no descenders */ const cap = bl - 0.7 * parseFloat(getComputedStyle(lm).fontSize) * z; if (cap - y < 2 * z - 0.5 || cap - y > 8 * z) out.push(`the headwind limit label's capitals sit ${((cap - y) / z).toFixed(1)} px under its line (not 2 to 8: just under it)`); } /* round 11: under its line (was over it): over it lies the 0 line, 1 kt away */
      for (const t of document.querySelectorAll('.lwd text.ax')) if (vis(t) && !/^\d+$/.test(t.textContent.trim())) { out.push(`the headwind gutter carries "${t.textContent.trim()}" (numeric ticks only)`); break; } }
    // the take-off arrowheads: the other direction's dashes start 8 px or more beyond them
    { const sv = document.querySelector('#map svg'); if (sv) { const bb = e => { const b = e.getBBox(); return [b.x, b.y, b.x + b.width, b.y + b.height]; }, ar = [...sv.querySelectorAll('path.arw')].map(bb);
        for (const p of sv.querySelectorAll('path.gapp')) { const m = (p.getAttribute('d') || '').match(/-?[\d.]+/g); if (!m || m.length < 4) continue; const [ax, ay, bx, by] = m.map(Number); let d = 1e9;
          for (let f = 0; f <= 1; f += 0.01) { const x = ax + (bx - ax) * f, y = ay + (by - ay) * f; for (const q of ar) d = Math.min(d, Math.hypot(Math.max(q[0] - x, 0, x - q[2]), Math.max(q[1] - y, 0, y - q[3]))); }
          if (d < 8) { out.push(`a dashed "if switched" approach runs ${d.toFixed(1)} px from a take-off arrowhead (< 8)`); break; } } } }
    // town markers: neutral discs (never the East colour), on a 2 px halo, drawn over the paths; the key's discs the same
    { const c = document.querySelector('#map circle.tnum'), hl = c && c.previousElementSibling, k = document.querySelector('#mlgtowns .tk i');
      if (c) { const cs = getComputedStyle(c), east = getComputedStyle(document.documentElement).getPropertyValue('--east').trim(), ec = col(east.replace(/^#(..)(..)(..)$/, (m, a, b, d) => `rgb(${parseInt(a, 16)}, ${parseInt(b, 16)}, ${parseInt(d, 16)})`)), f = col(cs.fill);
        if (f && ec && Math.abs(f[0] - ec[0]) + Math.abs(f[1] - ec[1]) + Math.abs(f[2] - ec[2]) < 30) out.push('the map\'s town markers are drawn in the East colour');
        if (Math.abs(parseFloat(cs.strokeWidth) - 1.5) > 0.01) out.push(`the town marker's ring is ${cs.strokeWidth} (not 1.5 px)`);
        if (!hl || !hl.classList.contains('tnumh') || +hl.getAttribute('r') < +c.getAttribute('r') + 0.75 + 2 - 0.01) out.push('the town marker has no 2 px halo');
        const all = [...c.ownerSVGElement.querySelectorAll('*')], last = Math.max(...[...c.ownerSVGElement.querySelectorAll('path.app, path.dep, path.gapp')].map(e => all.indexOf(e))); if (all.indexOf(hl || c) < last) out.push('a flight path is drawn over a town marker');
        if (vis(k)) { const kc = getComputedStyle(k); if (kc.backgroundColor !== cs.fill || !kc.boxShadow.includes(cs.stroke)) out.push(`the key's town disc (${kc.backgroundColor}, ${kc.boxShadow}) differs from the map's (${cs.fill}, ${cs.stroke})`); } } }
    // the Main named on the map: >= 12 px, >= 3:1 on the card
    { const t = document.querySelector('#map text.rvl'); if (document.querySelector('#map path.river')) { if (!vis(t)) out.push('the river on the flight-path map is unlabelled'); else { const fs = fsOf(t), fg = col(getComputedStyle(t).fill), bg = bgBehind(t.ownerSVGElement); if (fs < 11.99) out.push(`the river label is ${fs.toFixed(1)} px (< 12)`); if (fg && bg && cr(fg, bg) < 4.5) out.push(`the river label is ${cr(fg, bg).toFixed(2)}:1 (< 4.5)`); /* round 10: was 3 */ } } }
    // the 48 h legend starts on the row names' edge
    { const g = document.querySelector('#tlf > span'), n = [...document.querySelectorAll('#tl .hl')].find(e => vis(e) && !e.hidden), t = n && textBox(n); if (vis(g) && t && Math.abs(R(g).left - t.left) > 1) out.push(`the 48 h legend starts ${Math.round(R(g).left - t.left)} px from the row names' edge`); }
  }
  if (W >= 640) { // both pages
    // the switch chip (and the official tag) 4 px over the direction bar (round 12: was 3 to 4)
    { const bar = document.querySelector('#lod, #segs'); for (const c of document.querySelectorAll('.lanes > .swchip, #lod .pgtag, #track .swchip, #track .pgl')) { if (!vis(c) || c.hidden || !vis(bar)) continue; const g = (R(bar).top - R(c).bottom) / hzR; if (g < 3.5 || g > 4.5) out.push(`the "${c.textContent.trim().slice(0, 16)}" tag sits ${g.toFixed(1)} px over the direction bar (not 4)`); } }
    // one radius for the secondary buttons and selects (the select's outer edge is its radius plus its 2 px track)
    for (const s of [/* round 13: '#open3d' is a text link now */ '#zoom', '#tz', '#b-home', '#b-fs', '.rail .pdet > summary', '.dmenu select']) { const e = document.querySelector(s); if (!vis(e)) continue; const c = getComputedStyle(e), ring = s === '.dmenu select' && /\b2px\b/.test(c.boxShadow) ? 2 : 0, r = parseFloat(c.borderTopLeftRadius) + ring; if (Math.abs(r - parseFloat(SEC_R)) > 0.01) out.push(`the control ${s} has a ${r} px radius (not the shared ${SEC_R})`); }
    // the first forecast slot is named by its hour window ("Next hour" before it starts), never as a later clock time
    // round 14 (was "Next hour, HH:MM-HH:MM", bold): the slot as its window alone, the readout regular with only the time in
    // medium (the card title is the one bold word); the window still one hour
    { const ro = document.querySelector('#oduse b, #dro b'); if (vis(ro)) { const t = ro.textContent.trim(); if (/^Now, \d\d:\d\d$/.test(t)) out.push(`the readout names the current slot "${t}" (a clock time later than now)`);
        if (/^(Next|This) hour/.test(t)) out.push(`the readout repeats the title's word: "${t}"`);
        const m = /^(\d\d):(\d\d)\u2013(\d\d):(\d\d)$/.exec(t); if (m && ((+m[3] * 60 + +m[4]) - (+m[1] * 60 + +m[2]) + 1440) % 1440 !== 60) out.push(`the readout's slot "${t}" is not one hour`);
        const rw = +getComputedStyle(ro.parentElement).fontWeight, bw = +getComputedStyle(ro).fontWeight; if (rw > 400 || bw > 500 || bw < 500) out.push(`the readout is not regular with its time in medium (${rw} / ${bw})`); }
      const rr = document.querySelector('#oduse, #dro'); if (vis(rr) && /\d\u202fkt/.test(rr.textContent)) { const x = rr.textContent.replace(/[^\S\u202f]+/g, ' '); /* keep the narrow no-break space the pattern asks for (\s matches it) */ if (!/(headwind|tailwind) \d+\u202fkt/.test(x) || /\d\u202fkt (headwind|tailwind)/.test(x)) out.push(`the readout's wind is not "headwind N kt": "${x.trim()}"`); } }
  }
  if (document.getElementById('app') && W >= 640 && window.__fra) { // the 3D view
    // the map key: as wide as its content, the same padding left and right
    { const k = document.getElementById('mapkey'); if (vis(k)) { const its = [...k.children].filter(e => vis(e) && e.textContent.trim()); if (its.length) { const l = Math.min(...its.map(e => R(e).left)), r = Math.max(...its.map(e => textBox(e)?.right ?? R(e).left)); const pl = (l - R(k).left) / hzR, pr = (R(k).right - r) / hzR; if (Math.abs(pl - pr) > 2) out.push(`the map key's padding is ${pl.toFixed(1)} px left, ${pr.toFixed(1)} px right (> 2 px apart)`); } } }
    // round 14: the map key on the info card's content edges (its left text edge on the card's, +-1 px), 5 to 12 px between
    // its edges and its text boxes above and below (about 10 px to the glyphs)
    { const k = document.getElementById('mapkey'), h = document.querySelector('.rail .hero'); if (vis(k) && vis(h) && k.classList.contains('mapov')) { const its = [...k.children].filter(e => vis(e) && e.textContent.trim()).map(textBox).filter(Boolean); const hc = getComputedStyle(h), cl = R(h).left + (parseFloat(hc.paddingLeft) + parseFloat(hc.borderLeftWidth)) * hzR;
        if (its.length) { const l = Math.min(...its.map(q => q.left)), t = (Math.min(...its.map(q => q.top)) - R(k).top) / hzR, b = (R(k).bottom - Math.max(...its.map(q => q.bottom))) / hzR;
          if (Math.abs(l - cl) / hzR > 1) out.push(`the map key's text starts ${((l - cl) / hzR).toFixed(1)} px from the info card's content edge`);
          if (t < 11 || t > 18 || b < 11 || b > 18) out.push(`the map key's text sits ${t.toFixed(1)} px under its top, ${b.toFixed(1)} px over its bottom (11 to 18)`);
          /* round 15 (was: 5 to 12 px to the text, 6 px padding): 12 px padding over and under its rows; the gutters to the info card and to the timeline card equal (+-1.5 px) and >= 12 px */
          { const kc = getComputedStyle(k), dk = document.querySelector('.dock'); if (Math.abs(parseFloat(kc.paddingTop) - 12) > 0.5 || Math.abs(parseFloat(kc.paddingBottom) - 12) > 0.5) out.push(`the map key's padding is ${kc.paddingTop} over, ${kc.paddingBottom} under its rows (12 px)`);
            if (vis(dk)) { const g1 = (R(k).top - R(h).bottom) / hzR, g2 = (R(dk).top - R(k).bottom) / hzR; if (Math.abs(g1 - g2) > 1.5 || Math.min(g1, g2) < 12) out.push(`the map key's gutters differ: ${g1.toFixed(1)} px under the info card, ${g2.toFixed(1)} px over the timeline card`); } } } } }
    // round 14: the card's Details 7 to 12 px under its hairline (was about 4) (the other rows' text sits about 10 px under theirs), the kicker
    // >= 6 px over the headline's badge
    { const d = document.querySelector('.rail .pdetrow'), s0 = d && d.querySelector('.pdet > summary'); if (vis(s0)) { const g = (R(s0).top - R(d).top) / hzR; if (g < 6.5 || g > 12) out.push(`"Details" sits ${g.toFixed(1)} px under its hairline (7 to 12)`); }
      const e = document.querySelector('.rail .hero > .eyebrow'), bd = document.querySelector('.rail .hero .dbadge'), et = vis(e) && textBox(e); if (et && vis(bd)) { const g = (R(bd).top - et.bottom) / hzR; if (g < 6) out.push(`the kicker sits ${g.toFixed(1)} px over the headline's badge (< 6)`); } }
    // round 14: one wind order on both pages: "headwind 5 kt on 07" in the card, its line under it the direction only
    { const v = document.getElementById('wind-v'), y = document.getElementById('wind-why'); if (vis(v) && /kt/.test(v.textContent) && !/^(headwind|tailwind) \d+\u202fkt on (07|25)$/.test(v.textContent.trim())) out.push(`the 3D wind reads "${v.textContent.trim()}" (not "headwind N kt on 07")`);
      if (y && y.textContent.trim() && !/^from (N|NE|E|SE|S|SW|W|NW) · \d{3}°$/.test(y.textContent.trim())) out.push(`the 3D wind's line reads "${y.textContent.trim()}" (not "from NE · 053°")`); }
    // round 14: the 3D Runway 18 quiet line in the dashboard's words ("at risk", "open until then")
    { const w = document.querySelector('#r18-s .r18w'); if (vis(w) && document.getElementById('r18-v')?.dataset.state === 'sched' && !/^(Today|Tomorrow|In \d+ days)( · at risk \d\d:\d\d\u2013(\w{3} )?\d\d:\d\d)? · open until then$/.test(w.textContent.trim())) out.push(`the 3D Runway 18 quiet line reads "${w.textContent.trim()}" (not "Tomorrow · at risk HH:MM-HH:MM · open until then")`); }
    // the 48 h legend starts on the row names' edge (as on the dashboard)
    { const g = document.querySelector('.dock #dkey > span'), n = document.getElementById('dir-l'), t = vis(n) && textBox(n); if (vis(g) && t && Math.abs(R(g).left - t.left) > 1) out.push(`the 3D legend starts ${Math.round(R(g).left - t.left)} px from the row names' edge`); }
    // the headline's drawn arrow (as on the dashboard); no unexplained wind glyph
    { const d = document.getElementById('dir'); if (vis(d) && /flies (East|West)/.test(d.textContent) && !d.querySelector('svg.tarr')) out.push('the 3D headline has no arrow'); const w = document.getElementById('wcomp'); if (w && vis(w) && w.querySelector('svg')) out.push('the 3D wind row shows an unexplained arrow glyph'); }
    // round 12 (was: the tag 4 px under the hour axis, a leader to the closed cells): the "18 closed" tag in the Runway 18
    // lane on a bracket over the closed run, >= 4 px under the chance plot, over no bar, >= 4 px from the switch chip and the
    // official tag, inside the track; no leader
    { const cs = [...document.querySelectorAll('#marks > i.x')].filter(e => R(e).width), tg = document.querySelector('#track .r18tag');
      if (document.querySelector('#track .r18lead')) out.push('the 3D "18 closed" tag still has a leader');
      if (cs.length && vis(document.getElementById('marks'))) { if (!vis(tg)) out.push('the 3D timeline has no "18 closed" tag');
        else { const T = R(tg), C = R(cs[0]), P = R(document.getElementById('risk')), K = R(document.getElementById('track')), bk = document.querySelector('#track .r18brk');
          if ((T.top - P.bottom) / hzR < 3.5) out.push(`the 3D "18 closed" tag sits ${((T.top - P.bottom) / hzR).toFixed(1)} px under the chance plot (< 4)`);
          if (T.left < K.left - 0.5 || T.right > K.right + 0.5) out.push('the 3D "18 closed" tag runs past the track');
          for (const b of document.querySelectorAll('#risk rect')) { const r = R(b); if (r.height > 1 && hit(T, r)) { out.push('the 3D "18 closed" tag overlaps a chance bar'); break; } }
          for (const o of document.querySelectorAll('#track .swchip, #track .pgl, #rpk, #r18-l')) { if (!vis(o) || o.hidden) continue; if (hit(T, R(o), 4 * hzR - 0.5)) { out.push(`the 3D "18 closed" tag is under 4 px from "${o.textContent.trim().slice(0, 16)}"`); break; } }
          if (!vis(bk)) out.push('no bracket over the closed Runway 18 cells (3D)'); else { const B = R(bk); if (Math.abs(B.left - C.left) > 1 || B.bottom > C.top + 0.5 || C.top - B.bottom > 3 * hzR) out.push('the 3D closure bracket does not sit on the closed cells');
            const cx = (T.left + T.right) / 2; if (cx < B.left - 1 || cx > B.right + 1 || (B.top - T.bottom) / hzR < 3 - 0.05 || (B.top - T.bottom) / hzR > 5) out.push(`the 3D "18 closed" tag is not just over its bracket (${((B.top - T.bottom) / hzR).toFixed(1)} px, not 3 to 5)`); } /* round 15: >= 3 px clear of the bracket (was: on it, touching) */ } } }
    // town markers: neutral discs on a 2 px halo (never the East colour), the key's discs the same
    { const m = [...document.querySelectorAll('.lbl.town.num i')].find(vis), k = document.querySelector('.row.mapkey .tkey b');
      if (m) { const a = getComputedStyle(m), f = col(a.backgroundColor), ec = [44, 62, 102]; if (f && Math.abs(f[0] - ec[0]) + Math.abs(f[1] - ec[1]) + Math.abs(f[2] - ec[2]) < 30) out.push('the 3D town markers are drawn in the East colour');
        if (!/0px 0px 0px 2px/.test(a.boxShadow) || !/inset/.test(a.boxShadow)) out.push(`the 3D town marker has no ring and 2 px halo (${a.boxShadow})`);
        if (vis(k)) { const b = getComputedStyle(k), ring = s => (/(rgba?\([^)]+\)|color\([^)]+\)) 0px 0px 0px 1.5px inset|inset 0px 0px 0px 1.5px (rgba?\([^)]+\))/.exec(s) || [])[0]; if (b.backgroundColor !== a.backgroundColor || b.color !== a.color || !ring(b.boxShadow) || ring(b.boxShadow) !== ring(a.boxShadow)) out.push(`the 3D key's town disc differs from the map's (${b.backgroundColor} / ${a.backgroundColor})`); } } }
    // the Main named on the map (1440 x 900), >= 12 px, >= 3:1 on the scene
    if (W === 1440) { const t = document.querySelector('.lbl.rvl'); if (!t || t.style.display === 'none' || !vis(t)) out.push('the river on the 3D map is unlabelled'); else { const fs = parseFloat(getComputedStyle(t).fontSize), fg = col(getComputedStyle(t).color), bg = col(getComputedStyle(document.getElementById('app')).getPropertyValue('--bg').trim().replace(/^#(..)(..)(..)$/, (q, a, b, d) => `rgb(${parseInt(a, 16)}, ${parseInt(b, 16)}, ${parseInt(d, 16)})`)); if (fs < 12) out.push(`the 3D river label is ${fs} px (< 12)`); if (fg && bg && cr(fg, bg) < 4.5) out.push(`the 3D river label is ${cr(fg, bg).toFixed(2)}:1 (< 4.5)`); /* round 10: was 3 */ } }
  }
  // round 10: hero type steps, the limit label's end, knockouts and leaders, card paddings and gutters, one amber, chip
  // contrast, map plates at their thresholds, the 3D key's width, the Main's contrast, one accuracy name
  { const light = (() => { const a = document.getElementById('app'); if (a) return a.classList.contains('light'); const b = col(getComputedStyle(document.body).backgroundColor); return !b || lum(b) > 0.4; })();
    // a label crossed by a line needs a knockout: an opaque element of its background colour covering its text box
    const crossBy = (t, lines) => lines.filter(l => vis(l) || (l.tagName === 'line' && R(l).height + R(l).width > 0)).map(R).filter(q => q.width + q.height > 0 && hit(q, t, -0.5));
    const covered = (t, kos, bg) => kos.some(k => { const r0 = R(k), sp = k instanceof SVGElement ? 0 : parseFloat((/ 0px 0px 0px ([\d.]+)px/.exec(getComputedStyle(k).boxShadow) || [0, 0])[1]) * (document.getElementById('app') ? (parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1) : z), q = { left: r0.left - sp, right: r0.right + sp, top: r0.top - sp, bottom: r0.bottom + sp }, c = col(k instanceof SVGElement ? getComputedStyle(k).fill : getComputedStyle(k).backgroundColor); return c && c[3] > 0.99 && bg && Math.max(...[0, 1, 2].map(i => Math.abs(c[i] - bg[i]))) < 2 && q.left <= t.left + 0.5 && q.right >= t.right - 0.5 && q.top <= t.top + 0.5 && q.bottom >= t.bottom - 0.5; });
    if (document.getElementById('answer') && W >= 900) { // the dashboard (desktop)
      // one type step for the outlook line, the hero figure and the KPI figures (size and weight); the figure directly under its label
      { const els = [['subhead', '.lede .subhead'], ['Runway 18 status', '.r18h .r18s b'], ['KPI figure', '.accst dd']].map(([n, s]) => [n, document.querySelector(s)]).filter(x => vis(x[1])); /* round 11: the hero's top-right figure is the Runway 18 status */
        // round 13 (was: all three on one step; retired: the status <= 8 px under its label): the outlook line and the KPI figures
        // one step (size and weight); the Runway 18 status at their weight, the next step down the type scale (siteui.TYPE), so it
        // never competes with the switch line
        if (els.length < 2) out.push('the hero has no outlook line or Runway 18 status'); else { const k = els.map(([n, e]) => [n, parseFloat(getComputedStyle(e).fontSize), getComputedStyle(e).fontWeight]), sh = k.find(x => x[0] === 'subhead');
          const peers = k.filter(x => x[0] !== 'Runway 18 status'); if (new Set(peers.map(x => `${x[1]}/${x[2]}`)).size > 1) out.push(`the outlook line and KPI figures are not one type step: ${peers.map(x => `${x[0]} ${x[1]}/${x[2]}`).join(', ')}`);
          const TY = [11, 13, 15, 18, 24, 36, 56], dn = TY[TY.indexOf(sh ? sh[1] : -1) - 1], st = k.find(x => x[0] === 'Runway 18 status'); if (st && sh && (st[1] !== dn || st[2] !== sh[2])) out.push(`the Runway 18 status is ${st[1]}/${st[2]}, not one type step under the switch line (${dn}/${sh[2]})`); } }
      // the headwind limit label at the left end of its plot (a spot further left would cross the headwind line)
      { const lm = document.getElementById('limt'), sv = document.querySelector('#lwd svg'), pa = document.querySelector('#lwd path.ln-w');
        if (vis(lm) && sv && pa) { const q = R(lm), P = R(sv); if (q.left - P.left > 12 * z) { const m = pa.getScreenCTM(), L = pa.getTotalLength(), w = q.width, box = [P.left + 6 * z, q.top, P.left + 6 * z + w, q.bottom]; let blocked = false;
            for (let s = 0; s <= L && !blocked; s += 2) { const p = pa.getPointAtLength(s), x = m.a * p.x + m.c * p.y + m.e, y = m.b * p.x + m.d * p.y + m.f; if (x >= box[0] - 4 * z && x <= box[2] + 4 * z && y >= box[1] - 3 * z && y <= box[3]) blocked = true; }
            if (!blocked) out.push(`the headwind limit label starts ${Math.round((q.left - P.left) / z)} px into its plot (its left end is free)`); } } }
      // the accuracy dumbbells: a gridline through a value label only behind a card-colour knockout
      { const bg = col(getComputedStyle(document.getElementById('rec') || document.body).backgroundColor), lines = [...document.querySelectorAll('#db line.dbg, #db line.dbrule')], kos = [...document.querySelectorAll('#db .dbko')];
        for (const v of document.querySelectorAll('#db text.dbv')) { const t = textBox(v) || R(v); if (crossBy(t, lines).length && !covered(t, kos, bg)) { out.push(`a gridline runs through the accuracy value "${v.textContent.trim()}"`); break; } } }
      // the accuracy card's three column headers at one weight and colour
      { const hs = [...document.querySelectorAll('#db text.dbt')].filter(t => /^(Ahead|% of hours correct|Fewer errors)$/.test(t.textContent.trim())); if (hs.length === 3 && new Set(hs.map(t => `${getComputedStyle(t).fontWeight}/${getComputedStyle(t).fill}`)).size > 1) out.push(`the accuracy column headers differ: ${hs.map(t => `${t.textContent.trim()} ${getComputedStyle(t).fontWeight}`).join(', ')}`); }
      // the accuracy card's bottom padding (to its last text) equals its top padding (to its title), +-1.5 px
      { const rc = document.getElementById('rec'), tt = rc && rc.querySelector('.acchd .lbl'), ls = rc ? [...rc.querySelectorAll('.accst dt')].filter(vis) : [];
        if (vis(rc) && vis(tt) && ls.length) { const a = (textBox(tt).top - R(rc).top) / z, b = (R(rc).bottom - Math.max(...ls.map(e => textBox(e)?.bottom ?? 0))) / z; if (Math.abs(a - b) > 1.5) out.push(`the accuracy card's padding is ${a.toFixed(1)} px on top, ${b.toFixed(1)} px at the bottom (> 1.5 px apart)`); } }
      // round 11 (was: the two gutters round the accuracy card equal; it left the page): the two cards one row, their tops and
      // bottoms on one line (+-1 px), the gutter between the columns the cells' 12 px
      { const a = document.querySelector('.tlc'), c = document.querySelector('.c3d'); if (vis(a) && vis(c) && !document.getElementById('recdlg')?.open) { const g1 = (R(c).left - R(a).right) / z; if (Math.abs(g1 - 12) > 1) out.push(`the gutter between the cards is ${g1.toFixed(1)} px (not 12)`);
        if (Math.abs(R(a).top - R(c).top) > 1 || Math.abs(R(a).bottom - R(c).bottom) > 1) out.push(`the 48 h card (${Math.round(R(a).top)}-${Math.round(R(a).bottom)}) and the flight-path card (${Math.round(R(c).top)}-${Math.round(R(c).bottom)}) are not one row`); } }
      // the flight-path map: each parallel runway's plate at its landing threshold (within 6 px), else a leader tick from the plate to it
      { const sv = document.querySelector('#map svg'); if (sv && vis(sv)) { const w25 = sv.classList.contains('w'), m = sv.getScreenCTM(), S = (x, y) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f];
          const thr = {}; for (const l of sv.querySelectorAll('line.rwy')) { const a = S(+l.getAttribute('x1'), +l.getAttribute('y1')), b = S(+l.getAttribute('x2'), +l.getAttribute('y2')); thr[l.dataset.des] = (w25 ? a[0] > b[0] : a[0] < b[0]) ? a : b; }
          for (const t of sv.querySelectorAll('text.rwt:not(.rwt11)')) { const d = t.textContent.trim(); if (d === '18' || !thr[d]) continue; const p = t.previousElementSibling; if (!p || !p.classList.contains('rwp')) continue; const q = R(p), T = thr[d], dist = Math.hypot(Math.max(q.left - T[0], 0, T[0] - q.right), Math.max(q.top - T[1], 0, T[1] - q.bottom)) / z;
            if (dist <= 6) continue; const tk = sv.querySelector(`path.rwtk[data-des="${d}"]`); if (!tk) { out.push(`the map's "${d}" plate sits ${Math.round(dist)} px from its threshold with no leader`); continue; }
            const L = tk.getTotalLength(), p0 = tk.getPointAtLength(0), p1 = tk.getPointAtLength(L), a = S(p0.x, p0.y), b = S(p1.x, p1.y), dA = Math.hypot(Math.max(q.left - a[0], 0, a[0] - q.right), Math.max(q.top - a[1], 0, a[1] - q.bottom)) / z, dB = Math.hypot(b[0] - T[0], b[1] - T[1]) / z;
            if (dA > 1.5 || dB > 4) out.push(`the map's "${d}" leader does not run from its plate (${dA.toFixed(1)} px) to its threshold (${dB.toFixed(1)} px)`); } } }
    }
    // the peak note (both pages): a line through it only behind a knockout of the card colour; a 1 px leader from its end to the peak dot, over no bar
    { const n = document.querySelector('#pkl text, #rpk'); if (n && vis(n) && n.textContent.trim() && !/^peak /.test(n.textContent.trim())) { const t = textBox(n) || R(n), card = col(getComputedStyle(document.querySelector('.tlc, .dock')).backgroundColor);
        const lines = [...document.querySelectorAll('#mids .mid, #mids i, #lpg svg line, #risk line')];
        const kos = [...document.querySelectorAll('#pkl .pko'), ...(n.id === 'rpk' ? [n] : [])];
        if (crossBy(t, lines).length && !covered(t, kos, card)) out.push('a day line or gridline runs through the peak note');
        const ld = document.querySelector('#pkl path.pkl, #rpkh path'), dot = document.querySelector('#pkl .pkd, #rpkl');
        if (!ld || !vis(ld.closest('svg') || ld)) out.push('the peak note has no leader to its dot'); else if (dot) { const m = ld.getScreenCTM(), Ln = ld.getTotalLength(), P = s => { const p = ld.getPointAtLength(s); return [m.a * p.x + m.c * p.y + m.e, m.b * p.x + m.d * p.y + m.f]; }, a = P(0), b = P(Ln), D = R(dot), dc = n.id === 'rpk' ? [D.left + 0.5, D.bottom] : [(D.left + D.right) / 2, (D.top + D.bottom) / 2], hz = (parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1) * z;
          if (Math.abs(a[0] - t.right) > 5 * hz || a[1] < t.top - 1 || a[1] > t.bottom + 1) out.push(`the peak leader does not start at the note's end (${Math.round(a[0] - t.right)} px)`);
          if (Math.hypot(b[0] - dc[0], b[1] - dc[1]) > 5 * hz) out.push(`the peak leader ends ${Math.round(Math.hypot(b[0] - dc[0], b[1] - dc[1]))} px from the peak dot (> 5)`);
          const bars = [...document.querySelectorAll('#lpg > div > i, #risk rect')].map(R).filter(q => q.height > 1.5); for (let s = 0; s <= Ln; s += 1) { const [x, y] = P(s); if (bars.some(q => x > q.left + 0.5 && x < q.right - 0.5 && y > q.top + 0.5 && y < q.bottom)) { out.push('the peak leader crosses a bar'); break; } }
          // round 13: the leader never runs within 4 px over a bar top (it ends with a vertical tick down to the peak dot)
          for (let s = 0; s <= Ln; s += 1) { const [x, y] = P(s), q = bars.find(b => x > b.left + 0.5 && x < b.right - 0.5 && y <= b.top + 0.5); if (q && q.top - y < 4 * hz - 0.5) { out.push(`the peak leader passes ${((q.top - y) / hz).toFixed(1)} px over a bar top (< 4)`); break; } } } } }
    // amber text (light): one dark amber on each page, >= 4.5:1, and only on values: the word "official" stays grey
    if (light) { const amb = []; for (const el of document.querySelectorAll('body *')) { if (!ownText(el) || el.closest('script,style,title,option') || !vis(el)) continue; const cs = getComputedStyle(el), c = col(el instanceof SVGElement ? cs.fill : cs.color); if (!c) continue;
        const [r, g, b] = c, mx = Math.max(r, g, b), mn = Math.min(r, g, b); if (!(r === mx && mx - mn > 60 && g > b + 20 && (g - b) / (mx - mn) < 0.85)) continue; // orange-to-amber hues
        const bgc = col(cs.backgroundColor); if (bgc && bgc[3] > 0.5) continue; // a tag on its own fill
        amb.push([el, `rgb(${c.slice(0, 3).map(Math.round).join(', ')})`]); const own = [...el.childNodes].filter(x => x.nodeType === 3).map(x => x.textContent).join(''); if (/official/i.test(own)) out.push(`the word "official" is set in amber ("${el.textContent.trim().slice(0, 30)}")`);
        const bb = bgBehind(el instanceof SVGElement ? el.ownerSVGElement || el : el); if (bb && cr(c, bb) < 4.5) out.push(`amber text "${el.textContent.trim().slice(0, 20)}" is ${cr(c, bb).toFixed(2)}:1 (< 4.5)`); }
      const set = new Set(amb.map(x => x[1])); if (set.size > 1) out.push(`amber text in ${set.size} colours: ${[...set].join(', ')}`); }
    // the switch chip's text >= 4.5:1 on the chip
    for (const ch of document.querySelectorAll('#lod .swchip, .lanes > .swchip, #track .swchip')) { if (!vis(ch)) continue; const f = col(getComputedStyle(ch).color), b = col(getComputedStyle(ch).backgroundColor); if (f && b && b[3] > 0.99 && cr(f, b) < 4.5) out.push(`the switch chip "${ch.textContent.trim()}" is ${cr(f, b).toFixed(2)}:1 (< 4.5)`); }
    // 3D desktop: the map key exactly as wide as the info card above it (one left and one right edge)
    if (document.getElementById('app') && W >= 640 && window.__fra) { const k = document.getElementById('mapkey'), rl = document.querySelector('.rail'); if (vis(k) && rl && !rl.contains(k) && (Math.abs(R(k).left - R(rl).left) > 1.5 || Math.abs(R(k).right - R(rl).right) > 1.5)) out.push(`the map key spans x=${Math.round(R(k).left)}-${Math.round(R(k).right)}, the info card x=${Math.round(R(rl).left)}-${Math.round(R(rl).right)}`); }
    // one name for the accuracy figure: the 3D card's row says "Hours correct", as the dashboard's label does
    { const r = [...document.querySelectorAll('#acc .kv > span')].find(vis); if (r && r.textContent.trim() !== 'Hours correct') out.push(`the 3D accuracy row is named "${r.textContent.trim()}" (the dashboard says "Hours correct")`);
      const d = [document.getElementById('trust'), document.getElementById('trustph')].find(vis); if (d && !/^Hours correct\b/.test(d.textContent.trim())) out.push(`the dashboard's trust line "${d.textContent.trim().slice(0, 30)}" does not start "Hours correct"`); } /* round 11: the trust line (was the hero's accuracy label) */
  }
  // round 11: the operator's view. The accuracy card in a detail view, the hero's Runway 18 block, no repeated facts in the
  // 48 h card, the switch line's timing and certainty, the headwind limit at its true scale, unambiguous map plates, page
  // tabs as a segmented control, event tags on one baseline with stems, the 3D hint as plain text and one left-stack gap
  { const baseOf = el => { const sp = document.createElement('span'); sp.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'; el.appendChild(sp); const y = sp.getBoundingClientRect().top; sp.remove(); return y; };
    if (document.getElementById('answer')) { // the dashboard
      const dlg = document.getElementById('recdlg'), open = !!(dlg && dlg.open), rc = document.getElementById('rec');
      // the accuracy card lives in its detail view (a modal dialog), off the main screen; open, it sits inside the window
      if (!rc || !dlg || !dlg.contains(rc)) out.push('the accuracy card is not inside its detail view');
      else if (!open && vis(rc)) out.push('the accuracy card is on the main screen (it belongs in its detail view)');
      else if (open) { if (!vis(rc)) out.push('the accuracy detail view is open but its card is hidden'); else { const q = R(rc); if (q.left < -0.5 || q.top < -0.5 || q.right > W + 0.5 || q.bottom > innerHeight + 0.5) out.push(`the accuracy detail view runs off the window (${Math.round(q.left)},${Math.round(q.top)} to ${Math.round(q.right)},${Math.round(q.bottom)})`); }
        const x = rc.querySelector('.recx'); if (!vis(x) || R(x).width / z < 31.5 || R(x).height / z < 31.5) out.push('the accuracy detail view has no 32 px close button'); }
      if (!open) for (const sel of ['.proof', '.pinl', '.pf3', '.accst', '#db']) { const e = document.querySelector(sel); if (vis(e)) { out.push(`"${sel}" is on the main screen (the accuracy lives in its detail view)`); break; } }
      // round 12 (was: "In use now" / "Closed now" big, the closure a red-dot line under it): the Runway 18 block's state
      // from the forecast at the current hour. A closure in the window: scheduled -> "Closes <today|tomorrow|Day> HH:MM-HH:MM"
      // on a hollow ring, then "(Day D Mon) · in use until then"; in effect -> "Closed now until HH:MM" on a filled dot; both
      // with what it moves; the ring and dot in the closed cells' red. None -> "Open for the next N h", no marker
      { const b = document.getElementById('r18h'), st = b && b.querySelector('.r18s b'), dot = b && b.querySelector('.r18d'), w = b && b.querySelector('.r18w'), im = b && b.querySelector('.r18i');
        if (!vis(b) || !st) out.push('the hero has no Runway 18 block');
        else if (typeof H !== 'undefined' && typeof nowIdx === 'function') { const n0 = nowIdx(), t = st.textContent.trim(); const Wn = []; H.forEach((h, i) => { if (h.p18 < 0.5) { if (Wn.length && Wn[Wn.length - 1][1] === i - 1) Wn[Wn.length - 1][1] = i; else Wn.push([i, i]); } }); // closed below 50 % open
          const w0 = Wn.find(([, e]) => e >= n0), a0 = w0 ? w0[0] : -1, b0 = w0 ? w0[1] : -1; // the first closure that has not ended
          const red = (document.querySelector('#l18 > div.x') && getComputedStyle(document.querySelector('#l18 > div.x')).backgroundColor) || null, kd = x => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(x)), hhmm = x => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(x)), dname = x => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(x));
          const state = a0 < 0 ? 'none' : a0 <= n0 ? 'now' : 'sched';
          if (b.dataset.state !== state) out.push(`the Runway 18 block is in state "${b.dataset.state}" (the forecast says "${state}")`);
          if (state === 'none') { if (!/^Open for the next \d+\u202fh$/.test(t)) out.push(`no closure ahead, but the Runway 18 status reads "${t}"`); if (vis(dot)) out.push('no closure ahead, but the Runway 18 block has a closure marker'); }
          else { const s0 = H[a0].t, e0 = Date.parse(H[b0].t) + 36e5, end = kd(e0) === kd(s0) ? hhmm(e0) : null;
            if (state === 'sched') { // round 13 (was "Closes tomorrow HH:MM-HH:MM" over "(Day D Mon) · in use until then"): the absolute day in
              // the headline, the relative day in the quiet line with the range the at-risk hours drawn next to it in the lane widen it
              // to (left out when there are none); no parentheses
              const iso = x => kd(x).split('/').reverse().join('-'), nd = Math.round((Date.parse(iso(s0)) - Date.parse(iso(Date.now()))) / 864e5), rel = nd === 0 ? 'Today' : nd === 1 ? 'Tomorrow' : `In ${nd} days`;
              const ngt = x => { const hh = +new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', hourCycle: 'h23' }).format(new Date(x)); return hh >= 23 || hh < 5; }, risk = x => x.p18 >= 0.5 && x.p18 < 0.9 && !ngt(x.t);
              let a2 = a0, b2 = b0; while (a2 - 1 > n0 && risk(H[a2 - 1])) a2--; while (b2 + 1 < H.length && risk(H[b2 + 1])) b2++; const e2 = Date.parse(H[b2].t) + 36e5;
              const may = a2 < a0 || b2 > b0 ? ` · at risk ${hhmm(H[a2].t)}\u2013${kd(e2) === kd(H[a2].t) ? hhmm(e2) : `${dname(e2).split(' ')[0]} ${hhmm(e2)}`}` : '';
              if (end && t !== `Closes ${dname(s0)}, ${hhmm(s0)}\u2013${end}`) out.push(`the Runway 18 status reads "${t}" (want "Closes ${dname(s0)}, ${hhmm(s0)}\u2013${end}")`);
              if (!vis(w) || w.textContent.trim() !== `${rel}${may} · open until then`) out.push(`the Runway 18 quiet line reads "${w ? w.textContent.trim() : ''}" (want "${rel}${may} · open until then")`); /* round 14: the legend's term, "at risk" (was "may run"), and "open until then" (was "in use until then") */
              if (/[()]/.test(b.textContent)) out.push('the Runway 18 block carries parentheses');
              if (!vis(dot) || !dot.classList.contains('ring') || !/(^|\s)(rgba\(0, 0, 0, 0\)|transparent)/.test(getComputedStyle(dot).backgroundColor) || (red && getComputedStyle(dot).borderTopColor !== red)) out.push('a scheduled Runway 18 closure is not keyed by a hollow ring in the closed cells\' red'); }
            else { if (!/^Closed now until (\w{3} )?\d\d:\d\d$/.test(t) || (end && kd(e0) === kd(Date.now()) && t !== `Closed now until ${end}`)) out.push(`the Runway 18 status reads "${t}" (want "Closed now until ${end || 'Day HH:MM'}")`);
              if (!vis(dot) || dot.classList.contains('ring') || (red && getComputedStyle(dot).backgroundColor !== red)) out.push('a Runway 18 closure in effect is not keyed by a filled dot in the closed cells\' red'); }
            if (!im || !/^(\u2248\d+ departures an hour move to the Centre runway|Inside the night ban, so no departures move)$/.test(im.textContent.trim())) out.push(`the Runway 18 block does not say what the closure moves ("${im ? im.textContent.trim() : ''}")`); } } }
      // the 48 h card repeats nothing the hero says: no closure line, no last or next switch
      { const c = document.querySelector('.tlc'); if (c) { const tx = c.innerText; for (const re of [/Runway 18 closed \w{3} \d/, /Last switch/, /Next likely switch/]) if (re.test(tx)) out.push(`the 48 h card repeats the hero: "${tx.match(re)[0]}"`); } }
      // round 12 (retired: "its foot: one compact wind line"): no wind line in the 48 h card; the readout's headwind is the one
      // wind figure for the next hour
      { const c = document.querySelector('.tlc'); if (c && /Wind (in 24|at \w{3} \d)/.test(c.innerText)) out.push('the 48 h card carries a wind line'); }
      // round 12: the trust line names our figure only; the official comparison lives in the accuracy detail view
      { const tl = document.getElementById('trust'); if (vis(tl)) { const tx = tl.textContent.replace(/[ \t\n\r]+/g, ' ').trim(); if (!/^Hours correct \d+(–\d+)?\u202f%, \d+–\d+\u202fh ahead · how we measure$/.test(tx)) out.push(`the trust line reads "${tx}"`); }
        if (open && rc && !/official/i.test(rc.textContent)) out.push('the accuracy detail view does not compare with the official forecast'); }
      // the switch line: the instant as "Day D Mon, HH:MM"; under it the hours to go and the certainty
      if (typeof D !== 'undefined' && D.change && document.getElementById('subhead')?.textContent.includes('expected')) { const a = document.querySelector('#subhead .sh1'), b = document.querySelector('#subhead .sh2');
        if (!a || !/expected \w{3} \d{1,2} \w{3}, \d\d:\d\d/.test(a.textContent)) out.push(`the switch line "${a ? a.textContent.trim() : ''}" does not name the instant as "Day D Mon, HH:MM"`);
        if (!b || !/^(in \u2248\d+\s?h · )?(\d+|<1|>99)\u202f% chance of (West|East) at \w{3} \d\d:\d\d$/.test(b.textContent.replace(/[ \t\n\r]+/g, ' ').trim())) out.push(`the switch line carries no timing and certainty tied to the switch ("${b ? b.textContent.trim() : ''}")`); } /* round 15: "81 % chance of West at Sat 17:00", the charts' preposition (round 13: "by"; round 12: "Highest chance of West: 81 % at Sat 17:00") */
      // the headwind limit at its true distance under 0: its offset from the 0 line is 1 kt on the plot's scale (read from the
      // 0 and 10 lines), within 1.5 px
      { const z0 = document.querySelector('.lwd line.zero'), g10 = document.querySelector('.lwd line[data-v="10"]'), lim = document.querySelector('.lwd line.lim');
        if (lim && R(lim).width) { if (!z0 || !g10) out.push('the headwind plot has no 0 and 10 lines to read its scale from'); else { const y0 = R(z0).top, k = (y0 - R(g10).top) / 10, got = R(lim).top - y0; if (Math.abs(got - k) > 1.5 * z) out.push(`the headwind limit is drawn ${(got / z).toFixed(1)} px under 0; 1 kt on its scale is ${(k / z).toFixed(1)} px (> 1.5 px apart)`); } } }
      // the flight-path map: no plate box on a runway strip, and every plate nearer its own strip than any other by 4 px
      { const sv = document.querySelector('#map svg'); if (sv) { const L = [...sv.querySelectorAll('line.rwy')].map(l => [l.dataset.des, +l.getAttribute('x1'), +l.getAttribute('y1'), +l.getAttribute('x2'), +l.getAttribute('y2'), (parseFloat(getComputedStyle(l).strokeWidth) || 4) / 2]);
          const bd = (q, l) => { let d = 1e9; for (let f = 0; f <= 1; f += 0.005) { const x = l[1] + (l[3] - l[1]) * f, y = l[2] + (l[4] - l[2]) * f; d = Math.min(d, Math.hypot(Math.max(q[0] - x, 0, x - q[2]), Math.max(q[1] - y, 0, y - q[3]))); } return d - l[5]; };
          for (const t of sv.querySelectorAll('text.rwt:not(.rwt11)')) { const r = t.previousElementSibling; if (!r || !r.classList.contains('rwp')) continue; const x0 = +r.getAttribute('x'), y0 = +r.getAttribute('y'), q = [x0, y0, x0 + +r.getAttribute('width'), y0 + +r.getAttribute('height')], d = t.textContent.trim(), own = L.find(l => l[0] === d);
            for (const l of L) if (bd(q, l) < 0) out.push(`the map's "${d}" plate overlaps runway ${l[0]}'s strip`);
            if (own && L.length > 1) { const d0 = bd(q, own), o = L.filter(l => l !== own).reduce((a, l) => (bd(q, l) < bd(q, a) ? l : a)); if (bd(q, o) - d0 < 4) out.push(`the map's "${d}" plate is ${bd(q, o).toFixed(1)} px from runway ${o[0]}, ${d0.toFixed(1)} px from its own (< 4 px nearer its own)`); } } } }
    }
    // both pages (desktop): the page tabs a segmented control like the time-zone switch: its track colour and height, the
    // current page a raised pill in its thumb's colour and shadow
    if (W >= 900 || (document.getElementById('app') && W >= 640)) { const nav = document.querySelector('.topbar .nav, .ptabs'), cur = nav && nav.querySelector('a[aria-current]'), tz = document.querySelector('#tz, .ptz'), th = document.querySelector('#tz > i, .ptz button[aria-pressed=true]');
      if (vis(nav) && vis(cur) && vis(tz) && th) { const a = getComputedStyle(nav), b = getComputedStyle(tz), c = getComputedStyle(cur), d = getComputedStyle(th);
        if (a.backgroundColor !== b.backgroundColor) out.push(`the page tabs' track (${a.backgroundColor}) differs from the time-zone switch's (${b.backgroundColor})`);
        if (c.backgroundColor !== d.backgroundColor || c.boxShadow !== d.boxShadow) out.push(`the current tab (${c.backgroundColor} / ${c.boxShadow}) is not the time-zone switch's raised pill (${d.backgroundColor} / ${d.boxShadow})`);
        if (Math.abs(R(nav).height - R(tz).height) > 1) out.push(`the page tabs (${Math.round(R(nav).height)} px) and the time-zone switch (${Math.round(R(tz).height)} px) differ in height`); } }
    // both pages (desktop): round 12 (retired: the "18 closed" tag and the switch chip on one baseline): the top annotation
    // lane carries only the switch chip, the "18 closed" tag sits under the direction bar; the chip's 1 px stem from its
    // bottom to the direction bar, under the chip, on the switch moment (a boundary between the two directions' cells)
    if (W >= 640) { const tg = document.querySelector('#ev .mk.r18, #track .r18tag'), ch = document.querySelector('.lanes > .swchip, #track .swchip'), bar = document.querySelector('#lod, #segs');
      if (vis(tg) && vis(bar) && R(tg).top < R(bar).bottom) out.push('the "18 closed" tag sits in the top annotation lane (it belongs in the Runway 18 lane)'); void baseOf;
      if (vis(ch) && vis(bar)) { const st = document.querySelector('.lanes > .swstem, #track .swstem'); if (!st || !R(st).height) out.push('the switch chip has no stem to the switch moment');
        else { const q = R(st), c = R(ch), B = R(bar), x = (q.left + q.right) / 2; if (q.width / hzR > 1.25) out.push(`the switch stem is ${(q.width / hzR).toFixed(1)} px wide (not 1)`);
          if (Math.abs(q.top - c.bottom) > 1 || Math.abs(q.bottom - B.top) > 1) out.push('the switch stem does not run from the chip to the direction bar'); if (x < c.left || x > c.right) out.push('the switch stem is not under its chip');
          const cells = [...bar.children].filter(e => (e.tagName === 'DIV' || e.tagName === 'I') && /^(w|e)\b/.test(e.className) && R(e).width), edges = cells.slice(1).filter((e, k) => e.className[0] !== cells[k].className[0]).map(e => R(e).left);
          if (!edges.length || Math.min(...edges.map(v => Math.abs(v - x))) > 1.5 * hzR) out.push(`the switch stem (x=${x.toFixed(1)}) is not on the switch moment (${edges.map(v => v.toFixed(1)).join(', ') || 'no boundary'})`); } } }
    if (document.getElementById('app') && window.__fra && W >= 640) { // the 3D view (desktop)
      // the map hint is plain text: no fill, outline or shadow box, 13 px
      { const hn = document.getElementById('hint3'); if (vis(hn)) { const c = getComputedStyle(hn), bg = col(c.backgroundColor); if ((bg && bg[3] > 0) || c.boxShadow !== 'none' || parseFloat(c.borderTopWidth) > 0) out.push(`the map hint looks like a control (${c.backgroundColor}, ${c.boxShadow}, ${c.borderTopWidth})`); if (Math.abs(parseFloat(c.fontSize) - 13) > 0.01) out.push(`the map hint is set in ${c.fontSize} (not 13 px)`); } }
      // one gap in the left stack: the info card to the map key as the map key to the timeline (+-1.5 px)
      { const k = document.getElementById('mapkey'), rl = document.querySelector('.rail'), dk = document.querySelector('.dock'); if (vis(k) && rl && !rl.contains(k) && vis(dk)) { const a = (R(k).top - R(rl).bottom) / hzR, b = (R(dk).top - R(k).bottom) / hzR; if (Math.abs(a - b) > 1.5) out.push(`the left stack's gaps differ: ${a.toFixed(1)} px card to key, ${b.toFixed(1)} px key to timeline`); } }
      // the accuracy row under Details (not on the card until it opens)
      { const a = document.getElementById('acc'), d = document.querySelector('.rail .pdet'); if (a && d && !d.contains(a)) out.push('the 3D accuracy row is not under Details'); if (a && d && !d.open && a.checkVisibility && a.checkVisibility()) out.push('the 3D accuracy row shows with Details closed'); /* a closed details' content keeps a layout box: ask the renderer */ }
      // the Runway 18 row: what the next closure moves, a line under the closure, right-aligned with it (round 12: the
      // dashboard's words, "an hour"; the closure is the status itself, keyed by a ring while scheduled, a dot while in effect)
      { const v = document.getElementById('r18-v'), c = v && v.querySelector('.badge.r18b'), i = document.querySelector('#r18-s .r18i'), st = v && v.dataset.state, dot = v && v.querySelector('.r18d');
        if (vis(c) && (st === 'sched' || st === 'now')) { if (!vis(i)) out.push('the 3D Runway 18 row does not say what the closure moves'); else { const a = textBox(c), b = textBox(i), tl = textBox(v.closest('.row-main').querySelector('.row-title')); void tl; if (Math.abs(b.right - a.right) > 1.5 || b.top < a.bottom - 1) out.push('the 3D Runway 18 impact is not a line under the closure, right-aligned with it'); /* round 15: right-aligned again, as the wind's compass line (round 13: from the label edge) */ if (!/^(\u2248\d+ departures an hour move to the Centre runway|Inside the night ban, so no departures move)$/.test(i.textContent.trim())) out.push(`the 3D Runway 18 impact reads "${i.textContent.trim()}"`); }
          if (!vis(dot) || dot.classList.contains('ring') !== (st === 'sched')) out.push(`the 3D Runway 18 closure (${st}) is not keyed by ${st === 'sched' ? 'a hollow ring' : 'a filled dot'}`); }
        if (window.__fra.state && v && v.closest('.row') && vis(v)) { const wt = document.getElementById('wind-t'); if (vis(wt) && !/^Wind (now|at \d\d:\d\d)$/.test(wt.textContent.trim())) out.push(`the 3D wind row's label "${wt.textContent.trim()}" does not name its hour`); } }
      // round 13: the wind row's label column carries its name only; the compass wind a quiet line under the value, right-aligned with it
      { const wy = document.getElementById('wind-why'), wv = document.getElementById('wind-v'), wt = document.getElementById('wind-t'); if (vis(wy) && vis(wv) && wy.textContent.trim()) { const a = textBox(wv), b = textBox(wy); if (wy.closest('.row-main')) out.push('the compass wind sits on the wind row\'s label line'); else if (a && b && (Math.abs(a.right - b.right) > 1.5 || b.top < a.bottom - 1)) out.push('the compass wind is not a line under the wind value, right-aligned with it'); } }
      // round 13: one pitch between all rows of the card: every hairline 3-9 px from the text above and below it, all within 2.5 px
      // (the Details row aside: the card's spare height goes above it by design)
      { const hr = document.querySelector('.rail > .hero'), texts = []; if (vis(hr)) { const tw = document.createTreeWalker(hr, NodeFilter.SHOW_TEXT); let nd; while ((nd = tw.nextNode())) { if (!nd.textContent.trim() || !nd.parentElement.checkVisibility() || nd.parentElement.closest('.mapkey')) continue; const rg = document.createRange(); rg.selectNodeContents(nd); for (const q of rg.getClientRects()) if (q.width) texts.push(q); }
        const gaps = []; for (const e of hr.querySelectorAll('.hsec, .conditions > .row:not(.mapkey):not(.pdetrow)')) { if (!vis(e)) continue; const c = getComputedStyle(e), b = getComputedStyle(e, '::before'); if (!(parseFloat(c.borderTopWidth) > 0 || (b.content !== 'none' && parseFloat(b.borderTopWidth) > 0))) continue; const y = R(e).top, up = texts.filter(q => q.bottom <= y + 0.5), dn = e.classList.contains('pdetrow') ? [] : texts.filter(q => q.top >= y - 0.5); /* the Details row: a button, its box is the measure */
          if (up.length) gaps.push((y - Math.max(...up.map(q => q.bottom))) / hzR); if (dn.length) gaps.push((Math.min(...dn.map(q => q.top)) - y) / hzR); }
        if (gaps.length && (Math.min(...gaps) < 3 || Math.max(...gaps) > 9 || Math.max(...gaps) - Math.min(...gaps) > 2.5)) out.push(`the card's rows are not on one pitch: ${gaps.map(g => g.toFixed(1)).join(' / ')} px from their hairlines`); } }
      // round 13: the map key, when it floats below the card, on the card's surface, radius and shadow
      { const k = document.querySelector('.row.mapkey.mapov'), hr = document.querySelector('.rail > .hero'); if (vis(k) && vis(hr)) { const a = getComputedStyle(k), b = getComputedStyle(hr); for (const p of ['backgroundColor', 'borderTopLeftRadius', 'boxShadow']) if (a[p] !== b[p]) out.push(`the map key's ${p} (${a[p]}) differs from the card's (${b[p]})`); } }
      // round 12: the left card one padding on all four sides and no dead band under its last row (<= 8 px past the padding)
      { const hr = document.querySelector('.rail > .hero'); if (vis(hr)) { const c = getComputedStyle(hr), p = [c.paddingTop, c.paddingRight, c.paddingBottom, c.paddingLeft].map(parseFloat), kf = document.getElementById('app')?.classList.contains('keyfree'), q = kf ? p : [p[0], p[1], p[3]]; /* round 15: with the map key floating under the card, its bottom padding 12 px (the key's 12 px padding comes from there); every other side equal */ if (Math.max(...q) - Math.min(...q) > 0.5 || (!kf && Math.abs(p[2] - 12) > 0.5)) out.push(`the left card's padding differs by side (${p.join(' / ')}; want equal${kf ? '' : ', the bottom 12'})`);
          const last = [...hr.querySelectorAll('*')].filter(e => vis(e) && !e.closest('.mapkey') && (ownText(e) || e.tagName === 'SUMMARY')).map(R).reduce((m, q) => Math.max(m, q.bottom), 0); const dead = (R(hr).bottom - last) / hzR - p[2]; if (dead > 8) out.push(`the left card has a ${Math.round(dead)} px dead band under its last row`); } }
    } }
  // round 13: the night band sits behind the chance bars, which keep their tone: equal-certainty bars (same opacity step, the
  // peak bar aside) have one fill inside and outside the night bands, and a night bar is on top of its band
  { const nb = [...document.querySelectorAll('#nbands .night, #bands .night, #nights i')].filter(e => R(e).width).map(R), inN = q => nb.some(b => (q.left + q.right) / 2 > b.left && (q.left + q.right) / 2 < b.right);
    const key = b => { const c = getComputedStyle(b); return `${b.tagName === 'rect' ? c.fill : c.backgroundColor}|${(parseFloat(c.opacity) || 1) * (parseFloat(b.getAttribute('opacity')) || 1)}|${c.filter}`; };
    const bars = [...document.querySelectorAll('#lpg > div > i, #risk rect')].filter(b => R(b).height > 2 && !b.classList.contains('pkb') && !b.getAttribute('style')?.includes('brightness')), byOp = {};
    for (const b of bars) { const c = getComputedStyle(b), op = ((parseFloat(c.opacity) || 1) * (parseFloat(b.getAttribute('opacity')) || 1)).toFixed(2), pg = b.closest('[class*=pgw]') || /risk-w/.test(b.getAttribute('style') || ''); if (pg) continue; (byOp[op] = byOp[op] || []).push([b, inN(R(b))]); }
    for (const [op, xs] of Object.entries(byOp)) { const a = xs.find(x => x[1]), d = xs.find(x => !x[1]); if (a && d && key(a[0]) !== key(d[0])) { out.push(`a night bar is drawn unlike its daytime twin (${key(a[0])} vs ${key(d[0])}): the night band belongs behind the bars`); break; } }
    const nbar = bars.find(b => inN(R(b)) && R(b).height > 4); if (nbar) { const q = R(nbar), els = [...document.querySelectorAll('#nbands, #bands, #nights, #nbands .night, #bands .night, #nights i, .lanes, #track, #lpg, #lpg *, #risk, #risk *')], pe = els.map(e => e.style.pointerEvents); els.forEach(e => { e.style.pointerEvents = 'auto'; }); /* hit-testable for the paint-order test only */
      const e = document.elementFromPoint((q.left + q.right) / 2, (q.top + q.bottom) / 2); els.forEach((x, i) => { x.style.pointerEvents = pe[i]; }); if (e && (e.classList.contains('night') || e.closest('#nights'))) out.push('the night band is drawn over the chance bars'); } }
  // round 13: the flight-path card (desktop): each intro sentence on one line; "Open in 3D" a quiet text link (the header tab is
  // the button); every flight line ends >= 8 px inside the card's padding; arrowheads >= 8 px apart and from the "if switched"
  // dashes; the drawing centred between the intro and the key (+-3 px)
  if (document.getElementById('answer') && W >= 900) {
    for (const sp of document.querySelectorAll('#mapif .mi0, #mapif .mi1')) { if (!vis(sp)) continue; const own = [...sp.childNodes].filter(n => !(n.nodeType === 1 && n.classList.contains('mi1'))), rg = document.createRange(), tops = new Set(); for (const n of own) { rg.selectNodeContents(n); for (const q of rg.getClientRects()) if (q.width) tops.add(Math.round(q.top)); } if (tops.size > 1) out.push(`the flight-path intro "${sp.textContent.trim().slice(0, 24)}" wraps to ${tops.size} lines`); }
    { const a = document.getElementById('open3d'); if (vis(a)) { const c = getComputedStyle(a), u = a.querySelector('.u'), bg = col(c.backgroundColor); if (c.boxShadow !== 'none' || parseFloat(c.borderTopWidth) > 0 || (bg && bg[3] > 0)) out.push('"Open in 3D" is drawn as a button (the header tab is the button)'); if (a.textContent.trim() !== 'Open in 3D' || !u || !/underline/.test(getComputedStyle(u).textDecorationLine) || !a.querySelector('svg.tarr')) out.push(`the 3D link is not "Open in 3D" with an underline and its arrow ("${a.textContent.trim()}")`); } }
    const mp = document.getElementById('map'); if (vis(mp)) { const M = R(mp), pts = p => { const m = p.getScreenCTM(), L = p.getTotalLength(), P = t => { const q = p.getPointAtLength(t); return [m.a * q.x + m.c * q.y + m.e, m.b * q.x + m.d * q.y + m.f]; }, r = []; for (let t = 0; t <= L; t += 2) r.push(P(t)); r.push(P(L)); return r; };
      for (const p of mp.querySelectorAll('path.app, path.dep, path.gapp, path.arw')) { const ps = pts(p); for (const q of [ps[0], ps[ps.length - 1]]) { const d = Math.min(q[0] - M.left, M.right - q[0], q[1] - M.top, M.bottom - q[1]) / z; if (d < 7.5) { out.push(`a flight-path line (${p.getAttribute('class')}) ends ${d.toFixed(1)} px inside the card's padding (< 8)`); break; } } }
      const gp = (a, b) => Math.max(0, a.left - b.right, b.left - a.right, a.top - b.bottom, b.top - a.bottom) / z, aw = [...mp.querySelectorAll('path.arw')].map(R);
      for (let i = 0; i < aw.length; i++) for (let j = i + 1; j < aw.length; j++) if (gp(aw[i], aw[j]) < 8) out.push(`two arrowheads on the flight-path map sit ${gp(aw[i], aw[j]).toFixed(1)} px apart (< 8)`);
      for (const g of mp.querySelectorAll('path.gapp')) { const ps = pts(g); for (const r of aw) { const d = Math.min(...ps.map(([x, y]) => Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom)))) / z; if (d < 8) { out.push(`an arrowhead sits ${d.toFixed(1)} px from an "if switched" dash (< 8)`); break; } } }
      const core = [...mp.querySelectorAll('line.rwy, path.dep, path.arw, circle.tnum, rect.rwp')].map(R).filter(q => q.width || q.height), kb = document.querySelector('.c3d .mlg');
      if (core.length && vis(kb)) { const top = Math.min(...core.map(q => q.top)), bot = Math.max(...core.map(q => q.bottom)), a = (top - M.top) / z, b = (R(kb).top - bot) / z; if (Math.abs(a - b) > 3) out.push(`the flight-path drawing is not centred between the intro and the key (${a.toFixed(1)} px above, ${b.toFixed(1)} px below)`); } } }
  return out;
};
const LIVE = [], R18NAME = new Set(), R18LEG = new Set(), CTRL = {}, R18RNG = [], R18MOVE = [], SWT = [], KICK = [], PEAK = [], GHOSTC = [];
// round 11: the accuracy card is the dashboard's detail view, opened from the trust line; its assertions (every one that ran
// on the card when it sat on the page) run with it open. Esc closes it.
const withDialog = async (page, tag, probes) => {
  const ok = await page.evaluate(() => { const a = [...document.querySelectorAll('#trust a.beat, #trustph a.beat')].find(e => e.getBoundingClientRect().width); if (!a) return 'the trust line has no visible link to the accuracy detail view'; a.click(); return document.getElementById('recdlg')?.open ? null : 'the trust line link does not open the accuracy detail view'; });
  if (ok) return [`${tag}: ${ok}`];
  await page.waitForTimeout(400); const out = [];
  for (const pr of probes) out.push(...(await page.evaluate(pr)).map(m => `${tag} (accuracy view open): ${m}`));
  await page.keyboard.press('Escape'); await page.waitForTimeout(250);
  if (await page.evaluate(() => document.getElementById('recdlg')?.open)) out.push(`${tag}: Esc does not close the accuracy detail view`);
  return out; };
// round 11: the 3D card's accuracy row is under Details: its assertions run with Details open
const withDetails = async (page, tag) => {
  const has = await page.evaluate(() => { const d = document.querySelector('.rail .pdet'); if (!d || !d.querySelector('summary').getBoundingClientRect().width) return false; d.querySelector('summary').click(); return d.open; });
  if (!has) return [];
  await page.waitForTimeout(400); const out = [];
  if (!(await page.evaluate(() => { const r = [...document.querySelectorAll('#acc .kv > span')].find(e => e.getBoundingClientRect().width); return r && r.textContent.trim() === 'Hours correct'; }))) out.push(`${tag}: Details open, but no "Hours correct" row`);
  await page.evaluate(() => document.querySelector('.rail .pdet summary').click()); await page.waitForTimeout(300); return out; };
// the darkest pixel of an element against the mean of the same spot with it hidden (WebGL map behind it, halo and scrims included)
const contrastOnMap = async (page, sel) => {
  const q = await page.evaluate(s => { const t = document.querySelector(s); if (!t || t.style.display === 'none' || !t.getBoundingClientRect().width) return null; const r = t.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; }, sel);
  if (!q) return null; const clip = { x: Math.floor(q[0]), y: Math.floor(q[1]), width: Math.ceil(q[2]), height: Math.ceil(q[3]) }, on = await page.screenshot({ clip });
  await page.evaluate(s => { document.querySelector(s).style.visibility = 'hidden'; }, sel); const off = pngMean(await page.screenshot({ clip })); await page.evaluate(s => { document.querySelector(s).style.visibility = ''; }, sel);
  let o = 8, wd, ht, ct; const idat = []; while (o < on.length) { const n = on.readUInt32BE(o), t = on.toString('ascii', o + 4, o + 8), d = on.subarray(o + 8, o + 8 + n); if (t === 'IHDR') { wd = d.readUInt32BE(0); ht = d.readUInt32BE(4); ct = d[9]; } if (t === 'IDAT') idat.push(d); o += 12 + n; }
  const bpp = ct === 6 ? 4 : 3, raw = inflateSync(Buffer.concat(idat)), st = wd * bpp, px = Buffer.alloc(st * ht);
  for (let y = 0; y < ht; y++) { const f = raw[y * (st + 1)]; for (let x = 0; x < st; x++) { const v = raw[y * (st + 1) + 1 + x], a = x >= bpp ? px[y * st + x - bpp] : 0, b = y ? px[(y - 1) * st + x] : 0, c = x >= bpp && y ? px[(y - 1) * st + x - bpp] : 0, p2 = a + b - c, pa = Math.abs(p2 - a), pb = Math.abs(p2 - b), pc = Math.abs(p2 - c); px[y * st + x] = (v + [0, a, b, (a + b) >> 1, pa <= pb && pa <= pc ? a : pb <= pc ? b : c][f]) & 255; } }
  let dk = null; for (let i = 0; i < wd * ht; i++) { const c = [px[i * bpp], px[i * bpp + 1], px[i * bpp + 2]]; if (!dk || lumN(c) < lumN(dk)) dk = c; }
  return (Math.max(lumN(dk), lumN(off)) + 0.05) / (Math.min(lumN(dk), lumN(off)) + 0.05); };
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
  errors.push(...(await page.evaluate(designProbe)).map(m => `${pg} ${w}: ${m}`));
  if (pg === 'index.html') errors.push(...await withDialog(page, `${pg} ${w}`, OVER.some(([ow, oh]) => ow === w && oh === h) ? [designProbe, overflowProbe] : [designProbe]));
  else if (w >= 640) errors.push(...await withDetails(page, `${pg} ${w}`));
  if (w === 1440) { // round 11: what a Runway 18 closure moves and the switch instant, the same on both pages
    const v = await page.evaluate(() => [(document.querySelector('#r18h .r18i, #r18-s .r18i')?.textContent.match(/\u2248(\d+) departures/) || [])[1] || null, (document.querySelector('#subhead .sh1 .nw, #outl .nw')?.textContent || '').trim() || null]);
    R18MOVE.push([pg, v[0]]); SWT.push([pg, v[1]]); }
  if (w === 1440 && pg.includes('3d')) { const r = await contrastOnMap(page, '#hint3'); if (r === null) errors.push(`${pg} ${w}: the map hint is not drawn`); else if (r < 4.5) errors.push(`${pg} ${w}: the map hint reads ${r.toFixed(2)}:1 against the map behind it (< 4.5)`); }
  { const t = await page.evaluate(() => { const hd = document.querySelector('.upd, .prun'), n = [...document.querySelectorAll('#hl18, #r18-l, .row-title')].filter(e => /Runway 18/.test(e.textContent)).map(e => e.textContent.trim()); return [hd ? / · live\b/.test(hd.textContent) : null, n]; }); // the live status and the Runway 18 name: the same on every width and page
    LIVE.push([pg, w, t[0]]); for (const n of t[1]) R18NAME.add(n); }
  { const t = await page.evaluate(() => { const out = [], leg = [...document.querySelectorAll('#tlf span, #dkey span')].map(e => e.textContent.trim()).filter(x => /Runway 18/.test(x)); // one wording on both pages
      for (const e of document.querySelectorAll('#pkl text, #rpk')) { const x = e.textContent.replace(/\s+/g, ' ').trim(); if (x && /%/.test(x) && !/^Highest: (\d+|<1|>99) % at \w{3} \d\d:\d\d$/.test(x)) out.push(`the peak reads "${x}" (not "Highest: N % at Day HH:MM")`); }
      if (window.__fra) for (const e of document.querySelectorAll('#dir-next .kv b')) { const x = e.textContent.replace(/\s+/g, ' ').trim(); if (x && /%/.test(x) && !/^((\d+|<1|>99) % at \w{3} \d\d:\d\d|Under 1 % every hour|(\d+|<1|>99) % at \d\d:\d\d)$/.test(x)) out.push(`the 3D chance row reads "${x}" (not "N % at Day HH:MM")`); } /* round 15: "at", as the hero and the charts; round 13: the hero's words (was "Highest: N % at Day HH:MM"); a picked hour keeps "N % at HH:MM" */
      const v = document.getElementById('r18-v'), shut = [...document.querySelectorAll('#marks i.x')].some(e => e.getBoundingClientRect().width); if (v && shut && /In use/.test(v.textContent) && !/closed/i.test(v.textContent)) out.push(`the Runway 18 row says "${v.textContent.trim()}" while the chart shows it closed`);
      const z = document.querySelector('#zoom button'), zt = document.querySelector('#zoom > i'), sel = document.querySelector('.dmenu select'); const ctl = z ? { h: Math.round(z.getBoundingClientRect().height / (parseFloat(document.body.style.zoom) || 1)), r: getComputedStyle(zt || z).borderTopLeftRadius } : sel && sel.offsetWidth ? { h: Math.round(sel.offsetHeight), r: getComputedStyle(sel).borderTopLeftRadius, ring: /\b2px\b/.test(getComputedStyle(sel).boxShadow) } : null;
      return { out, leg, ctl }; });
    errors.push(...t.out.map(m => `${pg} ${w}: ${m}`)); for (const x of t.leg) R18LEG.add(x); if (t.ctl && w === 1440) CTRL[pg] = t.ctl; }
  if (w === 1440) TLH[pg] = await page.evaluate(() => { // round 13: the timeline card's header: the title's inset from the card, the readout on its baseline and its gap after it
    const z = parseFloat(document.body.style.zoom) || parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1, tb = e => { const rg = document.createRange(); rg.selectNodeContents(e); const rs = [...rg.getClientRects()].filter(q => q.width); return rs.length ? { left: Math.min(...rs.map(q => q.left)), top: Math.min(...rs.map(q => q.top)), right: Math.max(...rs.map(q => q.right)) } : null; };
    const base = el => { const s = document.createElement('span'); s.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'; el.appendChild(s); const y = s.getBoundingClientRect().top; s.remove(); return y; };
    const c = document.querySelector('.tlc, .dock'), t = document.querySelector('#tlh, .dtitle'), r = document.querySelector('#oduse, #dro'); if (!c || !t || !r) return null; const C = c.getBoundingClientRect(), T = tb(t), O = tb(r); if (!T || !O) return null;
    return { left: (T.left - C.left) / z, top: (T.top - C.top) / z, gap: (O.left - T.right) / z, base: (base(r) - base(t)) / z }; });
  if (w === 1440) HDR[pg] = await page.evaluate(() => { // round 9: the header identical on both pages: its bottom rule, the brand's and the tabs' baselines
    const b = document.querySelector('.topbar, .pbar'), base = el => { const s = document.createElement('span'); s.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'; el.appendChild(s); const y = s.getBoundingClientRect().top; s.remove(); return y; };
    const br = b.querySelector('.brand, .pbrand'), tab = b.querySelector('nav a, .ptabs a'), up = b.querySelector('.upd, .prun'); return b ? { rule: b.getBoundingClientRect().bottom, brand: br ? base(br) : null, tab: tab ? base(tab) : null, upd: up && up.offsetWidth ? base(up) : null } : null; });
  if (w === 1440 && pg.includes('3d')) { // round 10: the 3D river label >= 4.5:1 against the map where it sits, as drawn (scrims and halo included):
    // its darkest pixel against the mean of the same spot with the label hidden
    const q = await page.evaluate(() => { const t = document.querySelector('.lbl.rvl'); if (!t || t.style.display === 'none') return null; const r = t.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
    if (q) { const clip = { x: Math.floor(q[0]), y: Math.floor(q[1]), width: Math.ceil(q[2]), height: Math.ceil(q[3]) }, on = await page.screenshot({ clip });
      await page.evaluate(() => { document.querySelector('.lbl.rvl').style.visibility = 'hidden'; }); const off = pngMean(await page.screenshot({ clip })); await page.evaluate(() => { document.querySelector('.lbl.rvl').style.visibility = ''; });
      let o = 8, wd, ht, ct; const idat = []; while (o < on.length) { const n = on.readUInt32BE(o), t = on.toString('ascii', o + 4, o + 8), d = on.subarray(o + 8, o + 8 + n); if (t === 'IHDR') { wd = d.readUInt32BE(0); ht = d.readUInt32BE(4); ct = d[9]; } if (t === 'IDAT') idat.push(d); o += 12 + n; }
      const bpp = ct === 6 ? 4 : 3, raw = inflateSync(Buffer.concat(idat)), st = wd * bpp, px = Buffer.alloc(st * ht);
      for (let y = 0; y < ht; y++) { const f = raw[y * (st + 1)]; for (let x = 0; x < st; x++) { const v = raw[y * (st + 1) + 1 + x], a = x >= bpp ? px[y * st + x - bpp] : 0, b = y ? px[(y - 1) * st + x] : 0, c = x >= bpp && y ? px[(y - 1) * st + x - bpp] : 0, p2 = a + b - c, pa = Math.abs(p2 - a), pb = Math.abs(p2 - b), pc = Math.abs(p2 - c); px[y * st + x] = (v + [0, a, b, (a + b) >> 1, pa <= pb && pa <= pc ? a : pb <= pc ? b : c][f]) & 255; } }
      let dk = null; for (let i = 0; i < wd * ht; i++) { const c = [px[i * bpp], px[i * bpp + 1], px[i * bpp + 2]]; if (!dk || lumN(c) < lumN(dk)) dk = c; }
      const r = (Math.max(lumN(dk), lumN(off)) + 0.05) / (Math.min(lumN(dk), lumN(off)) + 0.05); if (r < 4.5) errors.push(`${pg} ${w}: the 3D river label reads ${r.toFixed(2)}:1 against the map behind it (< 4.5)`); } }
  if (w === 1440) R18RNG.push([pg, await page.evaluate(() => { const v = document.querySelector('#r18h .r18s b, #r18-v .badge.r18b'); if (!v) return null; return [v, ...document.querySelectorAll('#r18h .r18w, #r18h .r18i, #r18-s .r18w, #r18-s .r18i')].map(e => e.textContent.replace(/\s+/g, ' ').trim()).join(' | '); })]); // round 12: the Runway 18 status and its lines word for word (was: the closure range)
  if (w === 1440) { const v = await page.evaluate(() => { const k = document.getElementById('eyebrow'), pk = x => { const m = (x || '').replace(/[ \t\n\r]+/g, ' ').match(/(\d+|<1|>99)\u202f% (?:at|chance of \w+ at) (\w{3} \d\d:\d\d)/); return m ? `${m[1]} % ${m[2]}` : null; }; /* the number and the Day HH:MM compared; round 15: one preposition, "at", on the hero, the 3D card and the charts (round 13: "by" on the first two) */
      return { k: k ? k.innerText.replace(/\s+/g, ' ').trim() : null, p: [...document.querySelectorAll('#subhead .sh2, #pkl text, #rpk, #dir-next .kv b')].filter(e => e.getBoundingClientRect().width).map(e => [e.id || e.className.baseVal || e.className || e.tagName, pk(e.textContent)]) }; });
    KICK.push([pg, v.k]); PEAK.push(...v.p.map(([n, x]) => [`${pg} ${n}`, x])); }
  if (w === 1440 && pg.includes('3d')) { // round 12: the "if switched" dashes >= 3:1 against the map where they run (their darkest pixel against the same spot without them)
    const pts = await page.evaluate(() => (window.__fra.ghost ? window.__fra.ghost(true) : []).filter(([x, y]) => x > 20 && y > 20 && x < innerWidth - 20 && y < innerHeight - 20)); await page.waitForTimeout(250);
    for (const [x, y] of pts) { const clip = { x: Math.round(x) - 10, y: Math.round(y) - 10, width: 20, height: 20 }, on = await page.screenshot({ clip }); await page.evaluate(() => window.__fra.ghost(false)); await page.waitForTimeout(250); const off = pngMean(await page.screenshot({ clip })); await page.evaluate(() => window.__fra.ghost(true)); await page.waitForTimeout(250);
      let o = 8, wd, ht, ct; const idat = []; while (o < on.length) { const n = on.readUInt32BE(o), t = on.toString('ascii', o + 4, o + 8), d = on.subarray(o + 8, o + 8 + n); if (t === 'IHDR') { wd = d.readUInt32BE(0); ht = d.readUInt32BE(4); ct = d[9]; } if (t === 'IDAT') idat.push(d); o += 12 + n; }
      const bpp = ct === 6 ? 4 : 3, raw = inflateSync(Buffer.concat(idat)), st = wd * bpp, px = Buffer.alloc(st * ht);
      for (let yy = 0; yy < ht; yy++) { const f = raw[yy * (st + 1)]; for (let xx = 0; xx < st; xx++) { const v = raw[yy * (st + 1) + 1 + xx], a = xx >= bpp ? px[yy * st + xx - bpp] : 0, b = yy ? px[(yy - 1) * st + xx] : 0, c = xx >= bpp && yy ? px[(yy - 1) * st + xx - bpp] : 0, p2 = a + b - c, pa = Math.abs(p2 - a), pb = Math.abs(p2 - b), pc = Math.abs(p2 - c); px[yy * st + xx] = (v + [0, a, b, (a + b) >> 1, pa <= pb && pa <= pc ? a : pb <= pc ? b : c][f]) & 255; } }
      let dk = null; for (let i = 0; i < wd * ht; i++) { const c = [px[i * bpp], px[i * bpp + 1], px[i * bpp + 2]]; if (!dk || lumN(c) < lumN(dk)) dk = c; }
      GHOSTC.push((Math.max(lumN(dk), lumN(off)) + 0.05) / (Math.min(lumN(dk), lumN(off)) + 0.05)); }
    if (!pts.length) errors.push(`${pg} ${w}: no "if switched" dashes to measure`); else if (Math.min(...GHOSTC) < 3) errors.push(`${pg} ${w}: the "if switched" dashes read ${Math.min(...GHOSTC).toFixed(2)}:1 against the map (< 3)`); }
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
for (const pg of PAGES) for (const [dw, dh] of [[1440, 900], [390, 844]]) { // dark mode encodings: faded vs confident >= 3:1, bars under the wash >= 2:1
  const page = await browser.newPage({ viewport: { width: dw, height: dh } });
  await page.goto(new URL(`../site/${pg}?theme=dark`, import.meta.url).href); await page.waitForTimeout(pg.includes('3d') ? 3000 : 1200);
  if (pg === 'index.html') errors.push(...(await withDialog(page, `${pg} ${dw} dark`, [designProbe])));
  errors.push(...(await page.evaluate(() => { const out = [];
    const col = c => { let m = /rgba?\(([^)]+)\)/.exec(c || ''); if (m) { const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; } m = /color\(srgb ([^)]+)\)/.exec(c || ''); if (m) { const p = m[1].split(/[ \/]+/).filter(Boolean).map(Number); return [p[0] * 255, p[1] * 255, p[2] * 255, p.length > 3 ? p[3] : 1]; } return null; };
    const lum = c => { const v = c.slice(0, 3).map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; }, cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
    const bgOf = e => col(getComputedStyle(e).backgroundColor), fillOf = e => col(getComputedStyle(e).fill);
    const lo = document.querySelector('#lod .e.lo, #segs i.lo'), hi = [...document.querySelectorAll('#lod .e:not(.lo), #segs i:not(.lo)')].find(e => !e.className.includes('nb') && bgOf(e) && bgOf(e)[3] > 0.5);
    if (lo && hi) { const r = cr(bgOf(lo), bgOf(hi)); if (r < 3) out.push(`dark: faded vs confident ${r.toFixed(2)}:1 (< 3)`); }
    // round 13: retired "dark: night vs normal bars >= 1.5:1" (night bars keep their tone; see "night bars" in designProbe)
    { const wash = document.querySelector('#lpg .pgwash, #pgwash'), card = document.querySelector('.tlc, .dock'); if (wash && card && getComputedStyle(wash).display !== 'none') { const W = wash.getBoundingClientRect(), cs = getComputedStyle(wash), wc = col(wash.tagName === 'rect' ? cs.fill : cs.backgroundColor), bg = col(getComputedStyle(card).backgroundColor);
      if (wc && bg) { const mix = (f, b, a) => [0, 1, 2].map(i => f[i] * a + b[i] * (1 - a)), washed = mix(wc, bg, wc[3]);
        for (const b of document.querySelectorAll('#lpg > div > i:not(.nt), #risk rect:not(.nt)')) { const r = b.getBoundingClientRect(); if (r.height < 3 || r.left < W.left || r.right > W.right) continue; const c = b.tagName === 'rect' ? fillOf(b) : bgOf(b); if (!c) continue; const rr = cr(mix(c, washed, c[3] * (parseFloat(getComputedStyle(b).opacity) || 1)), washed); if (rr < 2) { out.push(`dark: a bar under the wash ${rr.toFixed(2)}:1 (< 2)`); break; } } } } }
    { // the night hatch >= 2.8:1 on its bar, faded hours >= 3:1 on the card, Runway 18 cells visible on the card (open >= 1.5:1, closed >= 3:1)
      const card = bgOf(document.querySelector('.tlc, .dock')), mixc = (f, b, a) => [0, 1, 2].map(i => f[i] * a + b[i] * (1 - a));
      const hb = [...document.querySelectorAll('#lod > div, #segs i')].find(e => !e.classList.contains('lo') && /repeating-linear-gradient/.test(getComputedStyle(e).backgroundImage) && e.getBoundingClientRect().width);
      if (hb) { const st = col((/rgba?\([^)]+\)/.exec(getComputedStyle(hb).backgroundImage) || [''])[0]), bar = bgOf(hb); if (st && bar) { const r = cr(mixc(st, bar, st[3]), bar); if (r < 2.8) out.push(`dark: night hatch on its bar ${r.toFixed(2)}:1 (< 2.8)`); } }
      const lo = document.querySelector('#lod .lo, #segs i.lo'); if (lo && card && bgOf(lo)) { const r = cr(bgOf(lo), card); if (r < 3) out.push(`dark: faded hours on the card ${r.toFixed(2)}:1 (< 3)`); }
      if (card) for (const [s, min] of [['#l18 > div:not(.x):not(.r), #marks i.o', 1.5], ['#l18 > div.x, #marks i.x', 3]]) { let worst = 99; for (const e of document.querySelectorAll(s)) { const c = bgOf(e); if (!c || !e.getBoundingClientRect().width) continue; worst = Math.min(worst, cr(mixc(c, card, c[3] * parseFloat(getComputedStyle(e).opacity)), card)); } if (worst < min) out.push(`dark: Runway 18 cells (${s.split(',')[0]}) on the card ${worst.toFixed(2)}:1 (< ${min})`); } }
    { // the night band reads on the card: >= 1.15:1 against it
      const card = bgOf(document.querySelector('.tlc, .dock')), nb = [...document.querySelectorAll('#nbands .night, #bands .night, #nights i')].find(e => e.getBoundingClientRect().width); const c = nb && bgOf(nb);
      if (card && c) { const r = cr([0, 1, 2].map(i => c[i] * c[3] + card[i] * (1 - c[3])), card); if (r < 1.15) out.push(`dark: the night band on the card ${r.toFixed(2)}:1 (< 1.15)`); } }
    { const t = [...document.querySelectorAll('#lod .pgtag, #pgl')].find(e => !e.hidden && e.offsetWidth); if (t) out.push('TAGBG:' + getComputedStyle(t).backgroundColor); }
    return out; })).concat(await page.evaluate(designProbe)).filter(m => { if (m.startsWith('TAGBG:')) { TAGBGD.push([pg, m.slice(6)]); return false; } return true; }).map(m => `${pg} ${dw} dark: ${m}`));
  if (pg.includes('3d')) { // dark map: the airport's surfaces between 07C and 07R clearly lighter than the map's black (>= 2.2:1 phone, 1.8:1 desktop)
    const rw = await page.evaluate(() => window.__fra?.rwScreen?.()), M = {}; for (const [n, a, b] of rw || []) M[n[0]] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    if (M['07C'] && M['07R']) { const x = (M['07C'][0] + M['07R'][0]) / 2, y = (M['07C'][1] + M['07R'][1]) / 2, m = pngMean(await page.screenshot({ clip: { x: x - 3, y: y - 3, width: 7, height: 7 } })), bg = [14, 14, 13], r = (lumN(m) + 0.05) / (lumN(bg) + 0.05), min = dw < 480 ? 2.2 : 1.8;
      if (r < min) errors.push(`${pg} ${dw} dark: the airport surface reads ${r.toFixed(2)}:1 on the map (< ${min})`); } }
  await page.close();
}
{ const v = new Set(TAGBG.map(t => t[1])); if (v.size > 1) errors.push(`the official tag's colour differs: ${TAGBG.map(t => `${t[0]}: ${t[1]}`).join('; ')}`); }
for (const W of ['390', '1440']) { const g = NIGHTRO.filter(t => t[0].endsWith(' ' + W)); const v = new Set(g.map(t => t[1])); if (v.size > 1) errors.push(`the pinned night readouts differ at ${W}: ${g.map(t => `${t[0]}: ${t[1]}`).join(' | ')}`); }
{ const v = new Set(WEST.map(t => t.split(':')[1])); if (v.size > 1) errors.push(`the West-mode town lists differ: ${WEST.join(' | ')}`); }
{ const v = new Set(TAGS.map(t => t[1])); if (v.size > 1) errors.push(`the official windows differ: ${TAGS.map(t => `${t[0]}: ${t[1] || '(none)'}`).join('; ')}`); }
for (const pg of PAGES) { const v = LIVE.filter(t => t[0] === pg && t[2] !== null); if (new Set(v.map(t => t[2])).size > 1) errors.push(`${pg}: the header's live status differs by width: ${v.map(t => `${t[1]}: ${t[2] ? 'live' : '-'}`).join(', ')}`); }
if (R18LEG.size > 1) errors.push(`the Runway 18 legend item is worded differently: ${[...R18LEG].map(n => `"${n}"`).join(', ')}`);
{ const a = CTRL['index.html'], b = CTRL['airport3d.html']; if (a && b && (a.h !== b.h || a.r !== b.r || !b.ring)) errors.push(`the 3D run picker (${b.h} px, radius ${b.r}${b.ring ? ', track' : ', no track'}) differs from the zoom pills (${a.h} px, radius ${a.r})`); }
{ const v = R18RNG.map(t => t[1]); if ((v.some(x => !x) && v.some(x => x)) || new Set(v).size > 1) errors.push(`the Runway 18 status differs between the pages: ${R18RNG.map(t => `${t[0]}: "${t[1] || ''}"`).join('; ')}`); }
{ const a = TLH['index.html'], b = TLH['airport3d.html']; if (!a || !b) errors.push('the timeline card header was not measured on both pages'); else { for (const p of ['base']) for (const [pg, v] of [['index.html', a], ['airport3d.html', b]]) if (Math.abs(v[p]) > 1) errors.push(`${pg}: the readout sits ${v[p].toFixed(1)} px off the timeline title's baseline (inline when it fits)`);
  for (const p of ['left', 'top', 'gap']) if (Math.abs(a[p] - b[p]) > 1.5) errors.push(`the timeline card header differs between the pages: ${p} ${a[p].toFixed(1)} vs ${b[p].toFixed(1)} px`); } } // round 13
{ const a = HDR['index.html'], b = HDR['airport3d.html']; if (a && b) for (const k of ['rule', 'brand', 'tab', 'upd']) if (a[k] !== null && b[k] !== null && Math.abs(a[k] - b[k]) > 0.5) errors.push(`the header's ${k === 'rule' ? 'bottom rule' : k + ' baseline'} sits at y=${a[k].toFixed(1)} on the dashboard, y=${b[k].toFixed(1)} on the 3D view (1440 x 900)`); }
{ const v = R18MOVE.map(t => t[1]); if ((v.some(x => !x) && v.some(x => x)) || new Set(v).size > 1) errors.push(`what a Runway 18 closure moves differs between the pages: ${R18MOVE.map(t => `${t[0]}: ${t[1] ? `\u2248${t[1]} departures an hour` : '(not said)'}`).join('; ')}`); }
{ const v = SWT.map(t => t[1]); if ((v.some(x => !x) && v.some(x => x)) || new Set(v).size > 1) errors.push(`the switch instant is written differently: ${SWT.map(t => `${t[0]}: "${t[1] || ''}"`).join('; ')}`); }
if (R18NAME.size > 1) errors.push(`Runway 18 is named differently: ${[...R18NAME].map(n => `"${n}"`).join(', ')}`);
{ const v = KICK.map(t => t[1]); if ((v.some(x => !x) && v.some(x => x)) || new Set(v).size > 1) errors.push(`the kicker differs between the pages: ${KICK.map(t => `${t[0]}: "${t[1] || ''}"`).join('; ')}`); } // round 12: one string per fact
{ const v = PEAK.map(t => t[1]); if (PEAK.length < 4 || v.some(x => !x) || new Set(v).size > 1) errors.push(`the highest chance is worded differently: ${PEAK.map(t => `${t[0]}: "${t[1] || ''}"`).join('; ')}`); } // hero, both charts and the 3D card
{ const v = new Set(TAGBGD.map(t => t[1])); if (v.size > 1) errors.push(`dark: the official tag's colour differs: ${TAGBGD.map(t => `${t[0]}: ${t[1]}`).join('; ')}`); }
await browser.close();
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`check ok: ${PAGES.length} pages x ${SIZES.length} sizes, no errors, no clipped text or plots at ${OVER.map(o => o.join('x')).join(', ')}`);
