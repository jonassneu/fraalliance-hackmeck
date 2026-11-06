// FRA 3D X-ray view: real airport geometry (OSM) + live animation of the forecast operating direction.
// Data comes inlined from fra/scene3d.py: window.FRA_SCENE (geometry, metres east/north of the ARP) and
// window.FRA_FORECAST (forecast runs, hourly P(OD 25), P(RWY 18 open), IFS wind).
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { css } from './style.js';
import { Spring, Spring3, project, rubberband } from './spring.js';

const S = window.FRA_SCENE;
const F = window.FRA_FORECAST;
let TZ = 'Europe/Berlin'; // the dashboard can switch this to UTC
const Q = new URLSearchParams(location.search);
const EMBED = Q.has('embed');
const CARD0 = Q.get('embed') === 'card'; // inside the dashboard: the page's 48 h chart drives the hour
const BARE = Q.get('embed') === 'bare';  // full-bleed stage under the dashboard's glass panels: no HUD of its own
const CALM = CARD0 || BARE;              // no autoplay: the page sets the hour (a card still orbits slowly)
const pad = { top: 0, right: 0, bottom: 0, left: 0 }; // screen area covered by the page's panels
const view = { card: CARD0 };            // a card leaves card mode while it is full screen
const LH = Q.get('palette') === 'lh' || Q.get('theme') === 'lh'; // dashboard palette: 25 blue, 07 yellow
// one validated pair carries meaning (blue = 25 west, amber = 07 east as on the dashboard; dataviz slots 1 + 4, CVD-checked in
// both modes), status red = closed; everything else is warm neutral grey so colour only appears where it means something
const MINIMAL = {
  dark: { eastLine: '#a3adc2', westLine: '#5fcab5', ghostE: '#a3adc2', ghostW: '#5fcab5', east: '#2f4a7a', west: '#4dbfa7', r18: '#c3c2b7', closed: '#d03b3b', arr: '#199e70', dep: '#f0efec', ground: '#8a8984', air: '#c3c2b7' },
  light: { eastLine: '#2c3e66', westLine: '#1f9e89', ghostE: '#2c3e66', ghostW: '#0c6355', east: '#2c3e66', west: '#1f9e89', r18: '#52514e', closed: '#d03b3b', arr: '#1baf7a', dep: '#0b0b0b', ground: '#8a8984', air: '#9a9893' },
};
const PALETTES = MINIMAL; // ?palette=lh kept for old links, same colours
const LOOK = {
  dark: { bg: '#0e0e0d', ground: '#0b0b0a' },
  light: { bg: '#eceeef', ground: '#e9ebec' },
};
// dark = x-ray (additive glow), light = white architectural model; URL > saved choice > light (the default)
const THEME_Q = ['dark', 'light'].includes(Q.get('theme')) ? Q.get('theme') : null;
let saved = null;
try { saved = EMBED ? null : localStorage.getItem('fra-theme') || null; } catch { /* storage blocked */ }
let theme = THEME_Q || saved || 'light';
document.documentElement.dataset.theme = theme;
let HEX = PALETTES[theme];
let C = {};
const NB = THREE.NormalBlending, AB = THREE.AdditiveBlending;
const HDG = { 25: 249, 7: 69, 18: 180 };
const SIM_SPEED = 5; // simulated seconds per real second

// map frame (x east, y north, h up) -> three (x, y up, z south)
const V = (x, y, h = 0) => new THREE.Vector3(x, h, -y);

// ------------------------------------------------------------------ renderer
const style = document.createElement('style');
style.textContent = css() + (() => { // the dashboard's header, from the same spec (fra.siteui.HEADER), at the same zoom
  const hc = (window.FRA_STYLE || {}).header_css; if (!hc) return '';
  return `@media (min-width:640px){${hc.replace(/([^;{}]+?)(;|})/g, (m, d, e) => (d.includes(':') && !d.includes('!important') ? `${d}!important${e}` : m))}.pbar,.rail,.mapov,.dock,.stack,.rose,.attrib{zoom:var(--hz,1)}}`;
})();
{ const hz = () => document.documentElement.style.setProperty('--hz', Math.max(1, Math.min(1.5, innerWidth / 1280, innerHeight / 810)).toFixed(4)); hz(); addEventListener('resize', hz); }
document.head.appendChild(style);
const app = document.getElementById('app');
if (EMBED) document.body.classList.add('embed');
if (CARD0) document.body.classList.add('card');
if (BARE) document.body.classList.add('bare');

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
app.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(LOOK.dark.bg);
scene.fog = new THREE.FogExp2(LOOK.dark.bg, 0.00004);
// only the light theme's shaded materials react to these
scene.add(new THREE.HemisphereLight('#ffffff', '#b9b7b2', 2.1));
const sun = new THREE.DirectionalLight('#ffffff', 1.7);
sun.position.copy(V(-5000, -7000, 9000));
scene.add(sun);
const camera = new THREE.PerspectiveCamera(36, 1, 250, 400000); // far enough for the phone framing (camera ~70 km up)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.47;
controls.minDistance = 800;
controls.maxDistance = 200000;
controls.autoRotateSpeed = 1; // turns per minute (update gets dt): one slow turn a minute

// card: a calm panorama from the south-south-east, runways running across the frame
const HOMES = {
  card: { pos: V(-800, -4800, 12000), target: V(-800, -800, 0) }, // the whole airport from high up, north up, no orbit
  full: { pos: V(-1000, -3000, 7400), target: V(-1000, 250, 0) }, // north up and steep, so Runway 18 reads as north-south
  bare: { pos: V(-450, -8300, 5000), target: V(-2050, -300, 0) },
};
const home = () => (view.card ? HOMES.card : BARE ? HOMES.bare : HOMES.full);
let homeOd = 7, camTouched = false; // the full view frames the paths of this direction until the user moves the camera
camera.position.copy(home().pos);
controls.target.copy(home().target);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.55, 0.3, 0.3);
function tuneBloom() {
  bloom.enabled = theme === 'dark';
  bloom.strength = view.card ? 0.08 : 0.14; // a faint glow: the runways read as lit, they do not bleed
  bloom.threshold = view.card ? 0.42 : 0.3;
}
composer.addPass(bloom);
composer.addPass(new OutputPass());

function resize() {
  const w = app.clientWidth, h = app.clientHeight;
  renderer.setSize(w, h);
  composer.setSize(w, h);
  bloom.resolution.set(w / 2, h / 2);
  camera.aspect = w / h;
  // wide cards: keep ~58° horizontal field of view instead of a fish-eye panorama
  camera.fov = view.card ? Math.min(36, Math.max(16, THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(29)) / camera.aspect)))) : 36;
  // centre the scene in the area the page's panels leave free (like map padding)
  const heroB = document.querySelector('.hero')?.getBoundingClientRect().bottom - app.getBoundingClientRect().top || 0;
  const HZ = w < 640 ? 1 : (parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1); // the panels are zoomed like the header: CSS px inside them = screen px / HZ
  const narrow = w < 640, railB = narrow ? (document.querySelector('.rail')?.getBoundingClientRect().bottom ?? 0) - app.getBoundingClientRect().top : 0;
  const dockH = narrow ? app.getBoundingClientRect().bottom - (document.querySelector('.dock')?.getBoundingClientRect().top ?? app.getBoundingClientRect().bottom) : 0;
  if (narrow) app.style.setProperty('--dock-h', `${Math.round(dockH)}px`);
  { const dk = document.querySelector('.dock'), rl = document.querySelector('.rail'); if (dk) app.style.setProperty('--dock-top-h', `${Math.round((app.getBoundingClientRect().bottom - dk.getBoundingClientRect().top) / HZ)}px`); if (rl) app.style.setProperty('--rail-r', `${Math.round((rl.getBoundingClientRect().right - app.getBoundingClientRect().left) / HZ)}px`); { const rb = rl.getBoundingClientRect(), ab = app.getBoundingClientRect(); if (!(typeof state !== 'undefined' && state.run && !isNowHour())) app.style.setProperty('--rail-b', `${Math.round((rb.bottom - ab.top) / HZ)}px`); app.style.setProperty('--rail-l', `${Math.round((rb.left - ab.left) / HZ)}px`); app.style.setProperty('--rail-w', `${Math.round(rb.width / HZ)}px`); }
    if (rl) rl.classList.toggle('over', rl.scrollHeight > rl.clientHeight + 1); } // the fade only when the panel scrolls // the map-key overlay sits above the timeline
  const dockD = app.getBoundingClientRect().bottom - (document.querySelector('.dock')?.getBoundingClientRect().top ?? app.getBoundingClientRect().bottom - 200);
  const railR = (document.querySelector('.rail')?.getBoundingClientRect().right ?? 380) - app.getBoundingClientRect().left;
  const P = BARE ? pad : view.card ? { top: 0, right: 0, bottom: 0, left: 0 } : narrow ? { top: railB + 12, right: 16, bottom: dockH + 4 + (document.querySelector('.mapov')?.offsetHeight || 0), left: 16 } /* phones: 12 px under the card; the key is the map's footer, so the map runs down to it */
    : { top: ((document.querySelector('.pbar')?.getBoundingClientRect().bottom ?? 56) - app.getBoundingClientRect().top) + 16, right: 32, bottom: dockD + 8, left: Math.min(railR, w * 0.4) + 32 }; /* desktop: 16 px under the header and 8 px over the timeline (the airport fills more of the map) */ // 40 px clear of the timeline // phones: the band between header and timeline; desktop: clear of the panel, the header and the timeline
  { const pb = document.querySelector('.pbar'), rl = document.querySelector('.rail'), st = document.querySelector('.stack'); // 16 px under the header, the same as the left gap (phones: 8)
    if (pb && rl && !BARE && !view.card) { const t = Math.round(pb.getBoundingClientRect().bottom - app.getBoundingClientRect().top + (narrow ? 8 : 16)); rl.style.top = `${t / HZ}px`; if (st && !narrow) st.style.setProperty('top', `${t / HZ}px`, 'important'); } }
  BTN = null; if (!narrow && !BARE && !view.card) { const st = document.querySelector('.stack'); if (st && st.offsetWidth) { const r = st.getBoundingClientRect(), ar = app.getBoundingClientRect(); BTN = [r.left - ar.left - 40, r.bottom - ar.top + 40]; } } // the button corner: an exclusion, not a top inset
  freeArea = P; app.style.setProperty('--free-cx', `${Math.round(P.left + (w - P.left - P.right) / 2)}px`); app.style.setProperty('--free-l', `${Math.round(P.left)}px`); // the key pill centres under the free viewport
  // (the map key lives in the panel)
  { const rl = document.querySelector('.rail'), dk = document.querySelector('.dock'); // the panel never runs under the timeline
    if (rl && dk && !narrow && !(typeof state !== 'undefined' && state.run && !isNowHour())) { app.classList.remove('keyfree'); /* placed from the idle panel only: hovering never moves the key */ const mk = document.getElementById('mapkey'); if (mk && mk.classList.contains('inrail')) { mk.classList.remove('inrail'); mk.classList.add('mapov', 'panel'); hud.appendChild(mk); } rl.style.minHeight = ''; const room = (dk.getBoundingClientRect().top - rl.getBoundingClientRect().top) / HZ - 12; rl.style.maxHeight = ''; /* measured in its under-the-panel layout */ const need = rl.scrollHeight, kh = (document.querySelector('.mapov')?.offsetHeight || 0) + 16; /* the page gutter between the card, the key and the timeline */
      rl.style.maxHeight = `${Math.max(200, room)}px`; const rb = rl.getBoundingClientRect(), ab = app.getBoundingClientRect(); void need; app.style.setProperty('--rail-b', `${Math.round((rb.bottom - ab.top) / HZ)}px`); app.classList.toggle('keyfree', rb.bottom + kh * HZ > dk.getBoundingClientRect().top - 16 * HZ); if (mk && app.classList.contains('keyfree')) { mk.classList.remove('mapov', 'panel'); mk.classList.add('inrail'); (rl.querySelector('.pdetrow') || rl.lastElementChild).after(mk); } /* no room under the panel: the key becomes the panel's last row, never a float in the scene */ { const r2 = rl.getBoundingClientRect(); rl.style.minHeight = `${Math.round(r2.height / HZ)}px`; app.style.setProperty('--rail-b', `${Math.round((r2.bottom - app.getBoundingClientRect().top) / HZ)}px`);
        const kr = mk && mk.classList.contains('mapov') ? mk.getBoundingClientRect() : null; if (kr && kr.height) { const want = Math.floor((kr.top - r2.top) / HZ - 16); if (want > r2.height / HZ) { rl.style.minHeight = `${want}px`; app.style.setProperty('--rail-b', `${Math.round((rl.getBoundingClientRect().bottom - app.getBoundingClientRect().top) / HZ)}px`); } } } /* hover swaps the panel's content in place: never shorter than idle */ } /* panel first: when the key does not fit under it, the key moves into the free viewport */ }
  const cx = P.left + (w - P.left - P.right) / 2, cy = P.top + (h - P.top - P.bottom) / 2;
  if ((BARE || !view.card) && w && h) camera.setViewOffset(w, h, w / 2 - cx, h / 2 - cy, w, h);
  else camera.clearViewOffset();
  camera.updateProjectionMatrix();
  fitHome();
}
function renderIssued() {
  if (!state.run) return;
  const age = Math.max(0, Math.round((Date.now() - Date.parse(state.run.issue)) / 6e4)), ageS = age < 60 ? `${age}\u202fmin ago` : age < 48 * 60 ? `${Math.round(age / 60)}\u202fh ago` : `${Math.round(age / 1440)} days ago`;
  const iss = new Date(state.run.issue), today = fmtDay.format(iss) === fmtDay.format(new Date());
  const nx = new Date(Math.ceil((Date.now() - 18e5 + 1) / 36e5) * 36e5 + 18e5); // the archive job runs every hour at :30, as on the dashboard
  $('issued-t').parentElement.querySelector('.frs').innerHTML = `<span class="fw">Forecast issued </span><span class="fi">Issued </span><b>${today ? '' : `<span class="fw">${fmtDay.format(iss)}, </span><span class="fi">${fmtDay.format(iss).split(' ')[0]} </span>`}${fmtHM(iss)}</b><span class="fw"> · next <b>${fmtHM(nx)}</b></span>${age < 90 ? ' · live' : ''}`; // "live" on phones too // one template on both pages // the age in the tooltip, as on the dashboard
  $('issued-t').parentElement.title = `${T.issued} ${fmtRun.format(iss)}, ${ageS}`;
  $('livedot').className = age < 90 ? 'ok' : 'old';
}
setInterval(() => renderIssued(), 60000);
const DEP_L = {}, GHOST_L = {}; let lastSegs = []; let VIEW_AZ = 0, LAST_WD = null, FIT_AZ = 0, FIT_PTS = [], FIT_STAT = null; const APP_L = {};
window.fitStat = () => ({ ...FIT_STAT, ...FIT_STAT2 });
const TOWNS_07 = [[50.0136, 8.428], [50.0098, 8.4535], [49.9899, 8.4225]].map(([la, lo]) => [(lo - 8.5706) * 71503, (la - 50.0333) * 111320]), TOWNS_25 = [[50.0531, 8.6947]].map(([la, lo]) => [(lo - 8.5706) * 71503, (la - 50.0333) * 111320]);
function appLen(rw, od) { // a landing path is drawn to about 1.5 km beyond the farthest town under it (as on the dashboard), at least 5 km
  const f = flow(rw, od), d = f.dir, s = f.start;
  const along = (od === 25 ? TOWNS_25 : TOWNS_07).map(t => { const dx = s[0] - t[0], dy = s[1] - t[1], a = dx * d[0] + dy * d[1], c = Math.abs(dx * d[1] - dy * d[0]); return a > 0 && c < 1500 ? a : 0; });
  return APP_L[`${rw.key}/${od}`] || 16000; // to where it would reach the panel or the timeline (fitHome), faded out over its outer third
} // the screen-up heading of the home view (0 = north up; phones turn the landing direction up)
let fitted = false, freeArea = { top: 0, right: 0, bottom: 0, left: 0 }, BTN = null, FIT_STAT2 = null;
const nar0 = () => app.clientWidth < 640;
function fitHome() { // full view: all runways fit the area the panels leave free, north up, steep
  if (BARE || !RW.r18 || !app.clientWidth) { scene.fog.density = 0.00004; farHidden = false; applyThemed(); for (const o of FAR) if (o.visible === undefined) o.visible = true; return; } // the dashboard card gets the same towns-and-paths view
  // the region people live in under the paths: Mainz in the west to Offenbach in the east
  // full view: the landing and take-off paths of the direction in use (07: approaches from the west, 25: from the east)
  // the airport plus about 6 km of approach on the landing side and the start of the climb-outs on the other
  const P = [...Object.values(RW).flatMap(r => [r.A, r.B]), ...(S.aerodrome || []).flat()], rx0 = Math.min(...P.map(p => p[0])), rx1 = Math.max(...P.map(p => p[0])), ry0 = Math.min(...P.map(p => p[1])), ry1 = Math.max(...P.map(p => p[1]));
  const ax = 6000 * Math.sin(69 * Math.PI / 180), ay = 6000 * Math.cos(69 * Math.PI / 180), w25 = homeOd === 25;
  const TW = (w25 ? [[50.0531, 8.6947]] /* Neu-Isenburg: the town within 1.5 km of the 25 approaches (the dashboard's rule) */ : [[50.0136, 8.428], [50.0098, 8.4535], [49.9899, 8.4225]]).map(([la, lo]) => [(lo - 8.5706) * 71503, (la - 50.0333) * 111320]); // Offenbach; Flörsheim, Raunheim, Rüsselsheim
  const DEPS = Object.values(RW).filter(r => r.key === 'centre' || r.key === 'r18').map(r => { const f = flow(r, homeOd), L = r.key === 'r18' ? 1100 : 1500; return [f.start[0] + f.dir[0] * (r.len + L), f.start[1] + f.dir[1] * (r.len + L)]; }); // the take-off arrows
  const allX = [rx0, rx1, ...TW.map(p => p[0]), ...(nar0() ? DEPS.map(p => p[0]) : [])], allY = [ry0, ry1, ...TW.map(p => p[1]), ...(nar0() ? DEPS.map(p => p[1]) : [])];
  const B = nar0() ? (m => [m[0] - m[4] * 0.1, m[1] + m[4] * 0.1, m[2] - m[5] * 0.1, m[3] + m[5] * 0.1])((a => [...a, a[1] - a[0], a[3] - a[2]])([Math.min(...allX) - 1800, Math.max(...allX), Math.min(...allY), Math.max(...allY)])) // phones: runways, towns and take-offs plus 10 % (the 1.8 km leaves room for the town names)
    : [Math.min(...allX) - 1800, Math.max(...allX) + 1200, Math.min(...allY) - 1200, Math.max(...allY) + 1200]; // the airport and the towns under the landing paths (ax, ay unused: the far approach may leave the frame)
  const nar = app.clientWidth < 640;
  const cx = view.card ? -6000 : (B[0] + B[1]) / 2, cy = view.card ? 0 : (B[2] + B[3]) / 2;
  const W = view.card ? 27000 : B[1] - B[0], Hh = view.card ? 20000 : B[3] - B[2];
  const w = app.clientWidth, h = app.clientHeight, fw = w - freeArea.left - freeArea.right, fh = h - freeArea.top - freeArea.bottom, tv = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const d = Math.max(Hh / (2 * tv * (fh / h)), W / (2 * tv * camera.aspect * (fw / w))), tilt = THREE.MathUtils.degToRad(nar ? 0.5 : 10); // phones: straight down // close to straight down: north up, nothing squeezed by perspective
  HOMES[view.card ? 'card' : 'full'] = { pos: V(cx, cy - d * Math.sin(tilt), d * Math.cos(tilt)), target: V(cx, cy, 0) };
  VIEW_AZ = 0;
  if (!view.card) { // fit bbox(airport + towns) into the free rect (panel, timeline and header as insets), centred, 86 % on the binding side; phones: the runways only
    const AF = (S.aerodrome || [[]])[0];
    // the approaches end 2 km beyond the farthest town under them (at least 6 km): that end, where they have faded out, is part of the frame
    const APPE = [];
    for (const rw of Object.values(RW)) if (rw.key === 'nw' || rw.key === 'south') {
      const f = flow(rw, homeOd), along = TW.map(t => { const dx = f.start[0] - t[0], dy = f.start[1] - t[1], a = dx * f.dir[0] + dy * f.dir[1], c = Math.abs(dx * f.dir[1] - dy * f.dir[0]); return a > 0 && c < 2500 ? a : 0; });
      const L = Math.max(4000, Math.max(...along) + 1000); APPE.push([f.start[0] - f.dir[0] * L, f.start[1] - f.dir[1] * L]); // framed to the outermost town + 1 km; drawn on to the panel edge (below)
    }
    const NAPT = Object.values(RW).length * 2 + AF.filter((_, i) => i % 10 === 0).length; // the first NAPT fit points are the airport's own
    const C = FIT_PTS = [...Object.values(RW).flatMap(r => [r.A, r.B]), ...AF.filter((_, i) => i % 10 === 0), ...TW, ...(nar ? [] : DEPS)] /* desktop: runways, take-off arrows and the towns' markers (the approaches run on to the panel) */, /* desktop: the approach dashes out to the towns too */ /* the airport, the towns and (desktop) the take-off arrows */ P3 = C.map(p => V(p[0], p[1], 0)), cam = camera.clone(), vv = new THREE.Vector3();
    const qx0 = (Math.min(...C.map(p => p[0])) + Math.max(...C.map(p => p[0]))) / 2, qy0 = (Math.min(...C.map(p => p[1])) + Math.max(...C.map(p => p[1]))) / 2;
    const camAt = (tx, ty, D, az, tt) => { const u = [Math.sin(az), Math.cos(az)]; return [V(tx - u[0] * D * Math.sin(tt), ty - u[1] * D * Math.sin(tt), D * Math.cos(tt)), V(tx, ty, 0)]; };
    const fcx = freeArea.left + fw / 2, fcy = freeArea.top + fh / 2, FILL = nar ? Math.min(0.97, 1 - 48 / Math.max(200, fw)) : 0.97; /* desktop: airport and the outermost town with a thin margin (the take-off arrows are cut 24 px above the timeline) */ /* phones: the town markers keep 24 px from the sides */ // a ~4 % margin on each side // 90 % of the binding side, centred in the free rect
    let best = null;
    for (const deg of nar ? [0] : [0, -6, 6, -12, 12]) for (const tdeg of nar ? [0.5] : [16, 20]) { // a small pitch; a small azimuth turn when it lets the airport-to-towns axis run more horizontally (fills the width better)
      const az = deg * Math.PI / 180, tt = tdeg * Math.PI / 180, u = [Math.sin(az), Math.cos(az)], r = [Math.cos(az), -Math.sin(az)];
      let tx = qx0, ty = qy0, D = 20000, fx = 0, fy = 0, cx = 0, cy = 0;
      for (let it = 0; it < 14; it++) {
        const [cp, ct] = camAt(tx, ty, D, az, tt); cam.position.copy(cp); cam.up.set(0, 1, 0); cam.lookAt(ct); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
        const sp = P3.map(q => { vv.copy(q).project(cam); return [(vv.x + 1) / 2 * w, (1 - vv.y) / 2 * h]; });
        const sx0 = Math.min(...sp.map(q => q[0])), sx1 = Math.max(...sp.map(q => q[0])), sy0 = Math.min(...sp.map(q => q[1])), sy1 = Math.max(...sp.map(q => q[1]));
        const push = BTN ? Math.max(0, ...sp.filter(q => q[0] > BTN[0]).map(q => BTN[1] - q[1])) : 0; // points under the button corner push the frame down (and shrink it to fit)
        const rpj = Object.values(RW).flatMap(r => [r.A, r.B]).map(q => { vv.copy(V(q[0], q[1], 0)).project(cam); return [(vv.x + 1) / 2 * w, (1 - vv.y) / 2 * h]; });
        const apt = nar ? sp : sp.slice(0, NAPT), ax = (Math.min(...apt.map(q => q[0])) + Math.max(...apt.map(q => q[0]))) / 2, ay = (Math.min(...apt.map(q => q[1])) + Math.max(...apt.map(q => q[1]))) / 2; void rpj; /* desktop: the airport (runways and aerodrome outline) centred in the free area, the towns and arrows fitted round it */ /* runways, approaches and towns centred, even padding */ // desktop: the airport at 55 % across, 45 % down the free area
        const AXF = 0.5, AYF = 0.5, /* the take-off arrows ~60 px above the timeline */ /* desktop: left of centre (toward the panel, as far as the frame allows) */ gx = freeArea.left + AXF * fw, gy = freeArea.top + AYF * fh;
        fx = Math.max((ax - sx0) / (AXF * fw), (sx1 - ax) / ((1 - AXF) * fw)); fy = Math.max((ay - sy0) / (AYF * fh), (sy1 - ay) / ((1 - AYF) * fh)); cx = (ax - gx) / fw; cy = (ay - gy - push / 2) / fh; // everything stays in frame around that point
        const FX = nar ? FILL : Math.min(FILL, 1 - 96 / fw), FY = nar ? FILL : Math.min(FILL, 1 - 104 / fh), ext = (q, mx, my) => (q.length ? Math.max((ax - Math.min(...q.map(p => p[0]))) / (AXF * fw - mx), (Math.max(...q.map(p => p[0])) - ax) / ((1 - AXF) * fw - mx), (ay - Math.min(...q.map(p => p[1])) + push) / (AYF * fh - my), (Math.max(...q.map(p => p[1])) - ay) / ((1 - AYF) * fh - my)) : 0),
          /* desktop, by what each point needs: the airport 48 px inside the free area, a town disc's centre on the free area's edge (the disc 20 px clear of the panel), a take-off arrow's tip 24 px from the sides and 40 px over the timeline (its arrowhead stays drawn) */
          sc = nar ? Math.max(fx / FX, (fy + push / fh) / FY) : Math.max(ext(sp.slice(0, NAPT), 48, 40), ext(sp.slice(NAPT, NAPT + TW.length), 0, 14), ext(sp.slice(NAPT + TW.length), 24, 32)), mpp = 2 * D * tv / h, ex = cx * fw * mpp, ey = cy * fh * mpp / Math.max(0.3, Math.cos(tt));
        tx += ex * r[0] - ey * u[0]; ty += ex * r[1] - ey * u[1];
        D *= Math.pow(sc, 0.8);
      }
      const cover = Math.min(fx, 1) * Math.min(fy, 1);
      if (!best || cover > best.cover * 1.03) best = { tx, ty, D, az, deg, tt, cover, fx, fy, cx, cy };
    }
    
    const [bp, bt] = camAt(best.tx, best.ty, best.D, best.az, best.tt);
    HOMES.full = { pos: bp, target: bt }; VIEW_AZ = best.deg;
    FIT_STAT = { w, h, fillX: +best.fx.toFixed(3), fillY: +best.fy.toFixed(3), offX: +best.cx.toFixed(3), offY: +best.cy.toFixed(3), tilt: Math.round(best.tt * 180 / Math.PI), free: [Math.round(freeArea.left), Math.round(freeArea.top), Math.round(fw), Math.round(fh)] };
    { // the approaches are drawn on until 40 px before the panel / the edge, fading out over their outer third
      cam.position.copy(bp); cam.up.set(0, 1, 0); cam.lookAt(bt); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
      const lim = [Math.max(0, freeArea.left - 32 + 8), freeArea.top, w, h - freeArea.bottom]; /* on to the panel's edge */ // to the panel's edge (faded in there), never poking out below it
      for (const rw of Object.values(RW)) if (rw.key === 'nw' || rw.key === 'south') {
        const f = flow(rw, homeOd); let L = 2000;
        for (; L < 16000; L += 50) { vv.copy(V(f.start[0] - f.dir[0] * L, f.start[1] - f.dir[1] * L, 0)).project(cam); const x = (vv.x + 1) / 2 * w, y = (1 - vv.y) / 2 * h; if (x < lim[0] || y < lim[1] || x > lim[2] || y > lim[3]) break; }
        APP_L[`${rw.key}/${homeOd}`] = L;
      }
      for (const k of Object.keys(GHOST_L)) delete GHOST_L[k];
      if (!nar) for (const rw of Object.values(RW)) if (rw.key === 'nw' || rw.key === 'south') { // the other direction's approaches stop at the free view's edge and before the buttons
        const o2 = homeOd === 25 ? 7 : 25, f = flow(rw, o2); let L = 1000;
        for (; L < 16000; L += 100) { vv.copy(V(f.start[0] - f.dir[0] * L, f.start[1] - f.dir[1] * L, 0)).project(cam); const x = (vv.x + 1) / 2 * w, y = (1 - vv.y) / 2 * h; if (x < freeArea.left || x > w - 16 || y < freeArea.top - 24 || y > h - freeArea.bottom || (BTN && x > BTN[0] && y < BTN[1])) break; }
        GHOST_L[`${rw.key}/${o2}`] = L;
      }
      for (const k of Object.keys(DEP_L)) delete DEP_L[k];
      if (!nar) for (const rw of Object.values(RW)) if (rw.key === 'centre' || rw.key === 'r18') { // take-off arrows end 24 px above the timeline card and inside the window
        const f = flow(rw, homeOd), e = [f.start[0] + f.dir[0] * rw.len, f.start[1] + f.dir[1] * rw.len]; let L = 0;
        for (; L < 1500; L += 25) { vv.copy(V(e[0] + f.dir[0] * (L + 25), e[1] + f.dir[1] * (L + 25), 0)).project(cam); const x = (vv.x + 1) / 2 * w, y = (1 - vv.y) / 2 * h; if (y > h - freeArea.bottom || x > w - 24 || y < freeArea.top - 32) break; }
        DEP_L[`${rw.key}/${homeOd}`] = L;
      }
      try { pathKey = ''; if (state.cur) drawPaths(state.cur.od, state.cur.r18); } catch {} // before the HUD exists: drawn by the first setHour
    }
  }
  { const sv = document.querySelector('.sbw svg'); if (sv && LAST_WD !== null) sv.style.setProperty('--a', `${LAST_WD + 180 - VIEW_AZ}deg`); } // the summary's wind arrow turns with the view
  scene.fog.density = (theme === 'light' ? 0.22 : 0.35) / d; // fog scales with the view, so the towns at the edge stay readable
  farHidden = true; for (const o of FAR) o.visible = false;
  if (fitted !== view.card + 1 || (!camTouched && camMode !== 'follow' && !view.card)) { fitted = view.card + 1; camera.position.copy(home().pos); controls.target.copy(home().target); } // re-framed on resize until the user moves the camera
}
const RO = new ResizeObserver(() => resize());
setTimeout(() => { if (!camTouched) resize(); }, 700); // once the panels and the timeline have their final size
RO.observe(app);
requestAnimationFrame(() => { for (const q of ['.rail', '.dock']) { const e = document.querySelector(q); if (e) RO.observe(e); } });

// ------------------------------------------------------------------ helpers
const ADD = { transparent: true, blending: THREE.AdditiveBlending, depthWrite: false };
let order = 0;
const FAR = []; let farHidden = false; // surroundings mapped only near the airport: hidden when zoomed out, so no cut-out blob
function add(obj, ro) {
  obj.renderOrder = ro ?? order++;
  obj.frustumCulled = false;
  scene.add(obj);
  return obj;
}
function geom(pos, col, colorSize = 3) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  if (col) g.setAttribute('color', new THREE.Float32BufferAttribute(col, colorSize));
  return g;
}
// material props per theme: the dark values are whatever the object was built with, light values are given here
const themed = [], darkOnly = [], lightOnly = [];

function th(obj, light) {
  const m = obj.material, dark = {};
  for (const k in light) dark[k] = k === 'color' ? m.color.clone() : m[k];
  themed.push({ m, dark, light: { ...light, ...(light.color ? { color: new THREE.Color(light.color) } : {}) } });
  return obj;
}
function applyThemed() {
  for (const t of themed) {
    for (const [k, v] of Object.entries(t[theme])) if (k === 'color') t.m.color.copy(v); else t.m[k] = v;
    t.m.needsUpdate = true;
  }
  for (const o of darkOnly) o.visible = theme === 'dark';
  for (const o of lightOnly) o.visible = theme === 'light';
  if (farHidden) for (const o of FAR) o.visible = false;
}
function fill(rings, h, color, opacity) {
  const pos = [];
  for (const r of rings) {
    const pts = r.map(p => new THREE.Vector2(p[0], p[1]));
    for (const t of THREE.ShapeUtils.triangulateShape(pts, [])) for (const i of t) pos.push(pts[i].x, h, -pts[i].y);
  }
  return new THREE.Mesh(geom(pos), new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide }));
}
function lines(polys, h, color, opacity, closed = false) {
  const pos = [];
  for (const p of polys) {
    const n = p.length, m = closed ? n : n - 1;
    for (let i = 0; i < m; i++) {
      const a = p[i], b = p[(i + 1) % n];
      pos.push(a[0], h, -a[1], b[0], h, -b[1]);
    }
  }
  return new THREE.LineSegments(geom(pos), new THREE.LineBasicMaterial({ color, opacity, ...ADD }));
}
const GHOST_OP = 1; // the "if switched" landings: the direction colour at full strength, dashed (the key's swatch the same)
function ribbon(polys, h, color, opacity) {
  const pos = [];
  for (const { p, w } of polys) {
    const hw = w / 2;
    for (let i = 0; i < p.length - 1; i++) {
      const [ax, ay] = p[i], [bx, by] = p[i + 1];
      const L = Math.hypot(bx - ax, by - ay) || 1, nx = -(by - ay) / L * hw, ny = (bx - ax) / L * hw;
      const q = [[ax + nx, ay + ny], [bx + nx, by + ny], [bx - nx, by - ny], [ax - nx, ay - ny]];
      for (const k of [0, 1, 2, 0, 2, 3]) pos.push(q[k][0], h, -q[k][1]);
    }
  }
  return new THREE.Mesh(geom(pos), new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide }));
}

// ------------------------------------------------------------------ ground
const ground = new THREE.Mesh(new THREE.PlaneGeometry(90000, 90000), new THREE.MeshBasicMaterial({ color: LOOK.dark.ground }));
th(ground, { color: LOOK.light.ground });
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
add(ground, -10);
const grid = new THREE.GridHelper(24000, 96, '#1f1f1d', '#191918');
grid.position.set(-1500, 0, 0);
grid.material.transparent = true;
grid.material.opacity = 0.22; // the grid recedes behind the airport
grid.material.depthWrite = false;
add(th(grid, { vertexColors: false, color: '#e3e2de', opacity: 0.9 }));
const gridVis = () => { grid.visible = app.clientWidth >= 640 && theme !== 'light'; }; // phones and the light theme: no grid banding
new ResizeObserver(gridVis).observe(app);
FAR.push(add(th(fill(S.forest, 0, '#121211', 0.9), { color: '#d6dacd', opacity: 1 })));
FAR.push(add(th(fill(S.water, 0, '#101318', 0.9), { color: '#bccddd', opacity: 1 })));
// the airport's own surfaces (OSM) stay visible at every zoom: they sit inside the mapped area, so no cut-out edge
add(th(fill(S.aerodrome, 0, '#3a3a35', 0.95), { color: '#d5cdbd', opacity: 1 })); // light: one ground tint for the airport, a clear step off the map
add(th(lines(S.aerodrome, 0, '#a5a49d', 0.9, true), { color: '#8f8b82', opacity: 1, blending: NB })); // light: a drawn boundary
add(th(fill(S.aprons, 0, '#56564f', 0.95), { color: '#aea492', opacity: 1 })); // light: aprons and terminals clearly darker than the airport ground
add(th(lines(S.aprons, 0, '#83827b', 0.6, true), { color: '#8a857b', opacity: 0.7, blending: NB }));
add(th(ribbon(S.taxiways, 0, '#45453f', 0.95), { color: '#a49e92', opacity: 1 }));
FAR.push(add(th(lines(S.taxiways.map(t => t.p), 0, '#5c5b55', 0.35), { color: '#d8d6d0', opacity: 0.35, blending: NB })));
for (const c of [0, 1, 2]) {
  const col = ['#6d6c66', '#4a4945', '#33322f'][c];
  FAR.push(add(th(lines(S.roads.filter(r => r.c === c).map(r => r.p), 0, col, [0.65, 0.5, 0.45][c]),
    { color: ['#aeaca6', '#bcbab4', '#cac8c2'][c], opacity: 0.55, blending: NB }))); // light: the streets recede so the airport stands out
}
const RIVER_PTS = []; // the Main's drawn points (scene metres) with their fade, for its name label
{ const MAIN = [[50.108, 8.78], [50.104, 8.74], [50.106, 8.69], [50.103, 8.65], [50.1, 8.58], [50.092, 8.545], [50.063, 8.53], [50.04, 8.5], [50.012, 8.47], [50.003, 8.44], [50.008, 8.4], [50.007, 8.33], [50.003, 8.275]].map(([la, lo]) => [(lo - 8.5706) * 71503, (la - 50.0333) * 111320]); // the Main, the 2D map's polyline
  // fading out beyond ~7 km of the airport, so it reads as context, not as a third flight path
  const SM = new THREE.CatmullRomCurve3(MAIN.map(p => new THREE.Vector3(p[0], p[1], 0)), false, 'centripetal').getSpacedPoints(180).map(v => [v.x, v.y]); // a smooth river, not a polyline
  for (let k = 0; k < SM.length - 1; k++) { const p0 = SM[k], p1 = SM[k + 1], t = (k + 0.5) / (SM.length - 1), d = Math.hypot((p0[0] + p1[0]) / 2 + 1500, (p0[1] + p1[1]) / 2);
    const f = Math.max(0, Math.min(1, (11000 - d) / 4000, 1 - (t - 0.6) / 0.4)); // faded by distance from the airport and over the last 40 % of its length
    if (f > 0.02) add(th(ribbon([{ p: [p0, p1], w: 60 }], 0.3, '#3a4f5e', 0.5 * f), { color: '#9fb8cf', opacity: 0.95 * f }));
    if (k % 3 === 0) RIVER_PTS.push([(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, f]); } }
FAR.push(add(th(lines(S.rail, 0.5, '#8a8984', 0.5), { color: '#c8c6c0', opacity: 0.7, blending: NB })));

{ // light theme: a stage, a disc about 3 % darker than the page under the airport and the towns, fading out
  const cv = document.createElement('canvas'); cv.width = cv.height = 256; const cx = cv.getContext('2d'), gr = cx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(0,0,0,0.045)'); gr.addColorStop(0.6, 'rgba(0,0,0,0.03)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = gr; cx.fillRect(0, 0, 256, 256);
  const disc = new THREE.Mesh(new THREE.PlaneGeometry(26000, 18000), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false }));
  disc.rotation.x = -Math.PI / 2; disc.position.copy(V(-2600, -800, -0.5)); add(disc, -9); lightOnly.push(disc);
}
// ------------------------------------------------------------------ buildings (x-ray volumes)
const AERO_BB = (() => { const r = (S.aerodrome || [[]])[0]; if (!r.length) return null; const xs = r.map(p => p[0]), ys = r.map(p => p[1]); return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]; })();
const FENCE = (S.aerodrome || [[]])[0];
const inFence = p => { let c = false; for (let i = 0, j = FENCE.length - 1; i < FENCE.length; j = i++) { const [xi, yi] = FENCE[i], [xj, yj] = FENCE[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; }; // the airport fence (OSM)
const onAirport = p => !!AERO_BB && p[0] > AERO_BB[0] && p[0] < AERO_BB[1] && p[1] > AERO_BB[2] && p[1] < AERO_BB[3];
function buildings() {
  const pos = [], col = [], epos = [], ecol = [], rpos = [], rposOut = [];
  const base = [0.6, 0.6, 0.58]; // neutral x-ray: white glow, colour is kept for meaning
  const K = { t: 1.2, w: 1.6, h: 0.9, a: 0.8, o: 0.24 };
  const areaOf = r => Math.abs(r.reduce((a, p, i) => { const q = r[(i + 1) % r.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0) / 2);
  for (const b of S.buildings) {
    if (areaOf(b.r) < (onAirport(b.r[0]) ? 400 : 2500)) continue; // sheds and houses read as specks; off the airport only the larger blocks stay
    const r = b.r, n = r.length, lo = b.m || 0, hi = Math.max(b.h, lo + 1), k = K[b.k] ?? 0.5;
    const bot = base.map(v => v * k * 0.03), top = base.map(v => v * k * 0.15), roof = base.map(v => v * k * 0.07);
    for (let i = 0; i < n; i++) {
      const a = r[i], c = r[(i + 1) % n];
      const q = [[a, lo, bot], [c, lo, bot], [c, hi, top], [a, hi, top]];
      for (const j of [0, 1, 2, 0, 2, 3]) {
        pos.push(q[j][0][0], q[j][1], -q[j][0][1]);
        col.push(...q[j][2]);
      }
    }
    const pts = r.map(p => new THREE.Vector2(p[0], p[1]));
    for (const t of THREE.ShapeUtils.triangulateShape(pts, [])) for (const i of t) { pos.push(pts[i].x, hi, -pts[i].y); col.push(...roof); (inFence(r[0]) ? rpos : rposOut).push(pts[i].x, 0.5, -pts[i].y); }
    // edges: roof outline, ground outline (airport only), verticals at corners
    const et = base.map(v => v * k * 0.6), eb = base.map(v => v * k * 0.15);
    for (let i = 0; i < n; i++) {
      const p0 = r[(i + n - 1) % n], a = r[i], c = r[(i + 1) % n];
      epos.push(a[0], hi, -a[1], c[0], hi, -c[1]); ecol.push(...et, ...et);
      if (b.k !== 'o') { epos.push(a[0], lo, -a[1], c[0], lo, -c[1]); ecol.push(...eb, ...eb); }
      const t1 = Math.atan2(a[1] - p0[1], a[0] - p0[0]), t2 = Math.atan2(c[1] - a[1], c[0] - a[0]);
      let turn = Math.abs(t2 - t1);
      if (turn > Math.PI) turn = 2 * Math.PI - turn;
      if (turn > 0.45) { epos.push(a[0], lo, -a[1], a[0], hi, -a[1]); ecol.push(...eb, ...et); }
    }
  }
  const g = geom(pos, col);
  g.computeVertexNormals();
  // footprints only, as one soft flat tone in both themes (no x-ray volumes, no outlines: at this scale those read as speckle)
  const flat = add(new THREE.Mesh(geom(rpos), new THREE.MeshBasicMaterial({ color: '#1b1c1e', transparent: true, opacity: 0.1, depthWrite: false, depthTest: false, side: THREE.DoubleSide })), 13);
  th(flat, { color: '#a59f93', opacity: 1 }); // light: solid warm-grey footprints, so the town and terminals read at a glance
  { const opos = []; for (const b of S.buildings) { if (areaOf(b.r) < (onAirport(b.r[0]) ? 400 : 2500)) continue; if (!inFence(b.r[0])) continue; const r = b.r; for (let i = 0; i < r.length; i++) { const a = r[i], c = r[(i + 1) % r.length]; opos.push(a[0], 0.6, -a[1], c[0], 0.6, -c[1]); } }
    const ol = add(new THREE.LineSegments(geom(opos), new THREE.LineBasicMaterial({ color: '#635e55', transparent: true, opacity: 0.95, depthTest: false })), 14); lightOnly.push(ol); } flat.material.color.set('#ffffff'); flat.material.opacity = 0.06; // dark: a faint white; light: 10 % ink
  themed[themed.length - 1].dark = { color: new THREE.Color('#ffffff'), opacity: 0.2 }; // dark: buildings clearly above the ground (and the raised apron)
  { const out = add(new THREE.Mesh(geom(rposOut), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.018, depthWrite: false, depthTest: false, side: THREE.DoubleSide })), 13);
    th(out, { color: '#b9b5ad', opacity: 0.3 }); } // outside the fence: 30 % of the airport's tone
  void g; void epos; void ecol;
}
buildings();

// ------------------------------------------------------------------ runways (shader: markings, flow chevrons, closure)
const RWY_VS = `
attribute vec2 rw; varying vec2 vR;
#include <common>
#include <fog_pars_vertex>
void main(){ vR = rw; vec4 mvPosition = modelViewMatrix*vec4(position,1.); gl_Position = projectionMatrix*mvPosition;
#include <fog_vertex>
}`;
const RWY_FS = `
uniform float uLen, uW, uDir, uActive, uClosed, uTime, uLight; uniform vec3 uCol; varying vec2 vR;
#include <common>
#include <fog_pars_fragment>
void main(){
  float ay = abs(vR.y), x = vR.x, endD = min(x, uLen - x);
  float edge = smoothstep(0.86, 0.92, ay);
  float dash = step(ay, 0.04) * step(mod(x, 60.), 30.) * step(70., endD);
  float keys = step(8., endD) * step(endD, 50.) * step(0.5, fract(ay * uW / 7.)) * step(ay, 0.8);
  float s = x * uDir - uTime * 70.;
  float ch = fract((s + ay * uW * 0.9) / 150.);
  float chev = smoothstep(0.0, 0.03, ch) * (1. - smoothstep(0.12, 0.17, ch)) * step(ay, 0.72) * step(90., endD);
  float marks = edge * 0.55 + dash * 0.6 + keys * 0.45;
  float hatch = step(0.55, fract((x + vR.y * uW * 0.5) / 45.)) * step(ay, 0.86);
  float cross = step(abs(abs(vR.y) - (1. - abs(fract(x / uLen * 6.) * 2. - 1.)) ), 0.07);
  vec3 col;
  if (uLight > 0.5) { // grey asphalt, white markings, flow painted in the direction colour
    col = mix(vec3(0.604, 0.592, 0.561), vec3(0.97), clamp(marks * 1.4, 0., 1.)); // light: mid-grey tarmac (#9a978f), the lines sit on something solid
    col = mix(col, uCol, clamp(uActive * (edge + chev + step(ay, 0.12)), 0., 1.)); // the direction: edges, centreline and chevrons in its colour // solid: the runway in use is the loudest thing on the map // highlight: whole strip in the flow colour
    vec3 closed = mix(vec3(0.82, 0.62, 0.62), vec3(0.75, 0.04, 0.05), clamp(0.6 * hatch + edge + cross, 0., 1.));
    col = mix(col, closed, uClosed);
  } else {             // x-ray: dark strip, glowing edges and chevrons
    col = vec3(0.17, 0.17, 0.16) + vec3(0.7, 0.7, 0.68) * marks; // dark: the strip a clear step above the map, its edges near white
    col += uCol * uActive * (0.12 + edge * 0.9 + chev * 1.0 + step(ay, 0.12) * 0.8); // tarmac stays dark; the direction glows along edges, centreline and chevrons
    col = mix(col, vec3(0.05, 0.03, 0.03) + vec3(0.9, 0.16, 0.16) * (0.18 * hatch + 0.9 * edge + 0.7 * cross), uClosed);
  }
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`;

const RW = {};
for (const [i, r] of S.runways.entries()) {
  const A = r.p[0], B = r.p[r.p.length - 1];
  const len = Math.hypot(B[0] - A[0], B[1] - A[1]);
  const RW_X = 1.35; // a little over true width, so the strips have presence at airport scale
  const ux = (B[0] - A[0]) / len, uy = (B[1] - A[1]) / len, nx = -uy * r.w * RW_X / 2, ny = ux * r.w * RW_X / 2;
  const g = new THREE.BufferGeometry();
  const c = [[A[0] + nx, A[1] + ny, 0, 1], [B[0] + nx, B[1] + ny, len, 1], [B[0] - nx, B[1] - ny, len, -1], [A[0] - nx, A[1] - ny, 0, -1]];
  const pos = [], rw = [];
  for (const k of [0, 1, 2, 0, 2, 3]) { pos.push(c[k][0], 0, -c[k][1]); rw.push(c[k][2], c[k][3]); }
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('rw', new THREE.Float32BufferAttribute(rw, 2));
  const uni = THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
    uLen: { value: len }, uW: { value: r.w * RW_X }, uDir: { value: 1 }, uActive: { value: 0 }, uClosed: { value: 0 },
    uTime: { value: 0 }, uCol: { value: new THREE.Color() }, uLight: { value: 0 },
  }]);
  const mat = new THREE.ShaderMaterial({ vertexShader: RWY_VS, fragmentShader: RWY_FS, uniforms: uni, fog: true, transparent: true, depthWrite: false, side: THREE.DoubleSide });
  add(new THREE.Mesh(g, mat), 40);
  const key = r.ref.startsWith('07L') ? 'nw' : r.ref.startsWith('07C') ? 'centre' : r.ref.startsWith('07R') ? 'south' : 'r18';
  const [d07, d25] = r.ref.includes('/') ? r.ref.split('/') : ['18', '36'];
  RW[key] = { i, key, A, B, len, ux, uy, mat, ref: r.ref, w: r.w, d07, d25 };
}
const RW_NAMES = { nw: 'Northwest', centre: 'Centre', south: 'South', r18: '18 West' };

// flow geometry for a runway given the operating direction: start point (threshold / start of roll) + unit direction
function flow(rw, od) {
  if (rw.key === 'r18') { // departures southbound only
    const north = rw.A[1] > rw.B[1] ? rw.A : rw.B, south = north === rw.A ? rw.B : rw.A;
    return { start: north, dir: [(south[0] - north[0]) / rw.len, (south[1] - north[1]) / rw.len], startIsA: north === rw.A };
  }
  const west = rw.A[0] < rw.B[0] ? rw.A : rw.B, east = west === rw.A ? rw.B : rw.A;
  const [s, e] = od === 7 ? [west, east] : [east, west];
  return { start: s, dir: [(e[0] - s[0]) / rw.len, (e[1] - s[1]) / rw.len], startIsA: s === rw.A };
}

// ------------------------------------------------------------------ airfield lights (points)
const LIGHT_COLORS = [[1, 0.9, 0.72], [0.95, 0.94, 0.9], [0.55, 0.62, 0.55], [0.5, 0.5, 0.48], [1, 0.2, 0.18]];
const LIGHT_SIZE = [26, 16, 10, 10, 14];
const lightMat = new THREE.ShaderMaterial({
  uniforms: { uAct: { value: new THREE.Vector4(1, 1, 1, 1) }, uArr: { value: new THREE.Vector4(-1, -1, -1, -1) }, uTime: { value: 0 }, uScale: { value: 600 }, uLight: { value: 0 } },
  vertexShader: `
    attribute vec3 color; attribute vec4 meta; // cls, runway, end (0=A,1=B), distance beyond end
    uniform vec4 uAct, uArr; uniform float uTime, uScale, uLight; varying vec3 vC; varying float vI;
    void main(){
      vec4 mv = modelViewMatrix * vec4(position, 1.);
      float cls = meta.x, rw = meta.y;
      vec4 oh = vec4(equal(vec4(rw), vec4(0., 1., 2., 3.)));
      float act = rw < -0.5 ? 1. : dot(uAct, oh), arr = rw < -0.5 ? -9. : dot(uArr, oh);
      float I = cls > 1.5 ? 0.45 : cls > 0.5 ? mix(0.12, 1.0, act) : 0.;
      if (cls < 0.5) {
        float on = abs(meta.z - arr) < 0.5 ? 1. : 0.;
        float rabbit = step(fract(uTime * 0.9 - meta.w / 950.), 0.07);
        I = on * (0.8 + 2.5 * rabbit) + (1. - on) * 0.08;
      }
      if (cls > 3.5) I = 0.9;
      vC = uLight > 0.5 ? color * color * 0.55 : color;
      vI = I;
      gl_PointSize = clamp(uScale * (cls < 0.5 ? 1.4 : 1.0) / -mv.z * 10., 1.2, 9.);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: `
    uniform float uLight; varying vec3 vC; varying float vI;
    void main(){
      vec2 d = gl_PointCoord - 0.5; float a = exp(-dot(d, d) * 14.);
      gl_FragColor = uLight > 0.5 ? vec4(vC, a * min(1., vI * 1.1)) : vec4(vC * vI * a, 1.);
    }`,
  ...ADD,
});
{
  const pos = [], col = [], meta = [];
  const rws = S.runways;
  for (const [x, y, cls, ri] of S.lights) {
    pos.push(x, 0.5, -y);
    col.push(...LIGHT_COLORS[cls]);
    let end = 0, beyond = 0;
    if (ri >= 0) {
      const A = rws[ri].p[0], B = rws[ri].p[rws[ri].p.length - 1];
      const dx = B[0] - A[0], dy = B[1] - A[1], L2 = dx * dx + dy * dy, s = ((x - A[0]) * dx + (y - A[1]) * dy) / L2;
      end = s < 0.5 ? 0 : 1;
      beyond = Math.max(0, s < 0 ? -s : s - 1) * Math.sqrt(L2);
    }
    meta.push(cls, ri, end, beyond);
  }
  const g = geom(pos, col);
  g.setAttribute('meta', new THREE.Float32BufferAttribute(meta, 4));
  add(new THREE.Points(g, lightMat), 60);
}

// ------------------------------------------------------------------ aircraft
function aircraftGeometry() {
  const parts = [];
  const cyl = (r0, r1, len, x, y, z, seg = 10) => {
    const g = new THREE.CylinderGeometry(r1, r0, len, seg, 1, true);
    g.rotateZ(-Math.PI / 2);
    g.translate(x, y, z);
    parts.push(g.toNonIndexed());
  };
  const flat = (pts, y, mirror = true) => { // [x, z] polygon at height y (wing-like), mirrored to -z
    const pos = [];
    for (const sgn of mirror ? [1, -1] : [1]) {
      const p = pts.map(([x, z]) => [x, y, z * sgn]);
      for (let i = 1; i < p.length - 1; i++) pos.push(...p[0], ...p[i], ...p[i + 1]);
    }
    parts.push(geom(pos));
  };
  cyl(1.95, 1.95, 30, 1, 2.4, 0);
  cyl(1.95, 0.25, 5.5, 18.75, 2.3, 0);
  cyl(1.95, 0.5, 8, -18, 2.9, 0);
  flat([[4.5, 1.5], [-6, 17.5], [-8.6, 17.5], [-4.5, 1.5]], 1.7);
  flat([[-15.2, 1], [-19.8, 6.8], [-21.4, 6.8], [-19.4, 1]], 3.3);
  { // fin
    const p = [[-14, 4], [-19.6, 11.8], [-21.6, 11.8], [-20.8, 4]].map(([x, y]) => [x, y, 0]);
    parts.push(geom([...p[0], ...p[1], ...p[2], ...p[0], ...p[2], ...p[3]]));
  }
  cyl(1.15, 1.15, 4.2, 1.8, 0.55, 6.2, 8);
  cyl(1.15, 1.15, 4.2, 1.8, 0.55, -6.2, 8);
  for (const p of parts) { p.deleteAttribute('normal'); p.deleteAttribute('uv'); }
  const g = mergeGeometries(parts);
  g.computeVertexNormals();
  return g;
}
const PLANE = aircraftGeometry();
const PLANE_EDGES = new THREE.EdgesGeometry(PLANE, 25);

{ // parked aircraft at stands, merged
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
  const meshes = [], edges = [];
  for (const [x, y, hd, size] of S.stands) {
    m.compose(V(x, y, 0.3), q.setFromAxisAngle(up, hd), new THREE.Vector3(size, size, size));
    meshes.push(PLANE.clone().applyMatrix4(m));
    edges.push(PLANE_EDGES.clone().applyMatrix4(m));
  }
  if (meshes.length) {
    const g = mergeGeometries(meshes);
    FAR.push(darkOnly.push(add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: '#8a8984', opacity: 0.1, side: THREE.DoubleSide, ...ADD })), 55)) && darkOnly[darkOnly.length - 1]);
    FAR.push(lightOnly[lightOnly.push(add(new THREE.Mesh(g, new THREE.MeshLambertMaterial({ color: '#ffffff', side: THREE.DoubleSide })), 55)) - 1]);
    FAR.push(add(th(new THREE.LineSegments(mergeGeometries(edges), new THREE.LineBasicMaterial({ color: '#c3c2b7', opacity: 0.3, ...ADD })),
      { color: '#cfcdc7', opacity: 0.3, blending: NB }), 56));
  }
}

// ------------------------------------------------------------------ flights
const GLIDE = Math.tan(3 * Math.PI / 180), CLIMB = Math.tan(7.5 * Math.PI / 180);
const ARR = { far: 16000, vApp: 72, td: 380, dec: 1.9, vExit: 14, exitT: 9 };
const DEP = { hold: 6, acc: 2.1, vRot: 82, climbDist: 13000 };
ARR.tTd = (ARR.far + ARR.td) / ARR.vApp;
ARR.tRoll = (ARR.vApp - ARR.vExit) / ARR.dec;
ARR.D = ARR.tTd + ARR.tRoll + ARR.exitT;
DEP.tRoll = DEP.vRot / DEP.acc;
DEP.dRoll = DEP.vRot ** 2 / (2 * DEP.acc);
DEP.D = DEP.hold + DEP.tRoll + DEP.climbDist / (DEP.vRot + 6);

// along-track distance from the threshold/start (m), altitude (m), pitch (rad) at time t of the cycle
function arrival(t) {
  if (t < ARR.tTd) {
    const a = -ARR.far + ARR.vApp * t;
    return [a, Math.max(0, (ARR.td - a) * GLIDE), 0.05, 0];
  }
  const tr = Math.min(t - ARR.tTd, ARR.tRoll);
  let a = ARR.td + ARR.vApp * tr - ARR.dec * tr * tr / 2;
  const te = Math.max(0, t - ARR.tTd - ARR.tRoll);
  return [a + ARR.vExit * te, 0, 0, Math.min(1, te / ARR.exitT)]; // last value: turn-off progress
}
function departure(t) {
  if (t < DEP.hold) return [0, 0, 0, 0];
  const tr = t - DEP.hold;
  if (tr < DEP.tRoll) return [DEP.acc * tr * tr / 2, 0, 0, 0];
  const a = DEP.dRoll + (DEP.vRot + 6) * (tr - DEP.tRoll);
  return [a, (a - DEP.dRoll) * CLIMB, 0.14, 0];
}

const TRAIL_N = 40;
class Flight { // a SIMULATED movement (future hours): expected traffic on the forecast runways, not a real aircraft
  constructor(kind, rw, od, phase, now) {
    this.kind = kind; this.rw = rw; this.f = flow(rw, od); this.phase = phase; this.born = now; this.dead = null;
    const startA = this.f.startIsA, p = startA ? rw.A : rw.B, q = startA ? rw.B : rw.A;
    this.des = rw.key === 'r18' ? '18' : p[0] < q[0] ? rw.d07 : rw.d25;
    this.label = `Simulated ${kind === 'arr' ? 'arrival' : 'departure'} · ${this.des}`;
    this.D = kind === 'arr' ? ARR.D : DEP.D;
    this.side = Math.random() < 0.5 ? 1 : -1;
    const col = kind === 'arr' ? C.arr : C.dep, light = (this.light = theme === 'light');
    const blend = { transparent: true, depthWrite: false, blending: light ? NB : AB };
    this.mat = light ? new THREE.MeshLambertMaterial({ color: '#ffffff', side: THREE.DoubleSide, transparent: true })
      : new THREE.MeshBasicMaterial({ color: new THREE.Color('#e8e7e3'), side: THREE.DoubleSide, ...ADD });
    this.emat = new THREE.LineBasicMaterial({ color: light ? col : col.clone().lerp(new THREE.Color('#ffffff'), 0.5), ...blend });
    this.obj = new THREE.Group();
    this.obj.add(new THREE.Mesh(PLANE, this.mat), new THREE.LineSegments(PLANE_EDGES, this.emat));
    add(this.obj, 70);
    const n = TRAIL_N;
    // RGBA vertex colours: alpha fades the trail in both blend modes
    this.tg = geom(new Float32Array(n * 2 * 3), new Float32Array(n * 2 * 4), 4);
    const idx = [];
    for (let i = 0; i < n - 1; i++) { const a = 2 * i; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    this.tg.setIndex(idx);
    this.trail = add(new THREE.Mesh(this.tg, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, ...blend })), 65);
    this.lg = geom(new Float32Array(n * 3), new Float32Array(n * 4), 4);
    this.line = add(new THREE.Line(this.lg, new THREE.LineBasicMaterial({ vertexColors: true, ...blend })), 66);
    this.col = col;
  }
  pose(t) { // world position + heading for cycle time t
    const [a, h, pitch, turn] = (this.kind === 'arr' ? arrival : departure)(t);
    const { start, dir } = this.f;
    let x = start[0] + dir[0] * a, y = start[1] + dir[1] * a, hd = Math.atan2(dir[1], dir[0]);
    if (turn > 0) { // roll-out turn-off towards the taxiway side
      const off = this.side * 90 * turn * turn;
      x += -dir[1] * off; y += dir[0] * off;
      hd += this.side * turn * 0.9;
    }
    return { x, y, h, hd, pitch };
  }
  alpha(t, now) {
    let a = Math.min(1, (now - this.born) / 1.5);
    if (this.dead !== null) a *= Math.max(0, 1 - (now - this.dead) / 1.5);
    const u = t / this.D;
    return a * Math.min(1, u / 0.04) * Math.min(1, (1 - u) / 0.05);
  }
  update(sim, now) {
    const t = ((sim / this.D + this.phase) % 1) * this.D;
    const p = this.pose(t), al = this.alpha(t, now);
    this.obj.position.copy(V(p.x, p.y, p.h + 2));
    this.obj.rotation.set(0, p.hd, p.pitch, 'YXZ');
    this.obj.scale.setScalar(view.card ? 4.5 : 2.4); // the card is small: bigger aircraft so they read
    this.mat.opacity = 0.08 * al; // simulated: an outline only, so it never reads as a real aircraft
    this.emat.opacity = 0.7 * al;
    this.cur = { ...p, al, t };
    const tp = this.tg.attributes.position.array, tc = this.tg.attributes.color.array;
    const lp = this.lg.attributes.position.array, lc = this.lg.attributes.color.array;
    for (let i = 0; i < TRAIL_N; i++) {
      const ti = Math.max(0, t - i * 1.6), q = this.pose(ti);
      const fade = (1 - i / TRAIL_N) ** 1.5 * al;
      tp.set([q.x, q.h + 2, -q.y, q.x, 0, -q.y], i * 6);
      const c = this.col;
      const cf = fade * (this.kind === 'arr' ? 0.14 : 0.06) * (this.light ? 3 : 1) * Math.min(1, 300 / (q.h + 60));
      tc.set([c.r, c.g, c.b, cf, c.r, c.g, c.b, 0], i * 8);
      lp.set([q.x, q.h + 2, -q.y], i * 3);
      lc.set([c.r, c.g, c.b, fade], i * 4);
    }
    for (const g of [this.tg, this.lg]) { g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true; }
  }
  dispose() {
    for (const o of [this.obj, this.trail, this.line]) scene.remove(o);
    this.tg.dispose(); this.lg.dispose(); this.mat.dispose(); this.emat.dispose();
  }
}

let flights = [];
// expected movements for a forecast hour -> simulated aircraft per runway (about one per 6 movements an hour)
function flightPlan(st) {
  if (st.live) return [];
  const row = (liveData?.future || []).find(r => Date.parse(r.t) === Date.parse(st.t));
  const n = c => (!c ? 0 : Math.max(1, Math.min(6, Math.round(c / 6))));
  if (!row) return [['arr', RW.nw, 3], ['arr', RW.south, 3], ['dep', RW.centre, st.r18 ? 3 : 4], ...(st.r18 ? [['dep', RW.r18, 3]] : [])];
  const a = row.arrivals || 0, d18 = st.r18 ? row.dep_18 || 0 : 0, dc = (row.dep_centre || 0) + (st.r18 ? 0 : row.dep_18 || 0);
  return [['arr', RW.nw, n(Math.ceil(a / 2))], ['arr', RW.south, n(Math.floor(a / 2))], ['dep', RW.centre, n(dc)], ['dep', RW.r18, n(d18)]];
}
let planKey = '';
function configureFlights(st, now, force) {
  const plan = flightPlan(st), key = JSON.stringify([st.od, st.r18, st.live, plan.map(x => x[2])]);
  if (!force && key === planKey) return;
  planKey = key;
  for (const f of flights) if (f.dead === null) f.dead = now;
  for (const [kind, rw, n] of plan) {
    if (!rw) continue;
    const off = Math.random();
    for (let k = 0; k < n; k++) flights.push(new Flight(kind, rw, st.od, (off + k / n) % 1, now));
  }
}

// ------------------------------------------------------------------ wind streaks
const WIND_N = 1400, WBOX = { x0: -10500, x1: 5500, y0: -9000, y1: 6000, h0: 40, h1: 700 };
const wind = { pos: new Float32Array(WIND_N * 3), vec: new THREE.Vector2(0, 0), kt: 0 };
for (let i = 0; i < WIND_N; i++) {
  wind.pos[i * 3] = THREE.MathUtils.lerp(WBOX.x0, WBOX.x1, Math.random());
  wind.pos[i * 3 + 1] = THREE.MathUtils.lerp(WBOX.y0, WBOX.y1, Math.random());
  wind.pos[i * 3 + 2] = THREE.MathUtils.lerp(WBOX.h0, WBOX.h1, Math.random() ** 1.6);
}
const windGeom = geom(new Float32Array(WIND_N * 6), new Float32Array(WIND_N * 8), 4);
const windLines = add(th(new THREE.LineSegments(windGeom, new THREE.LineBasicMaterial({ vertexColors: true, ...ADD })), { blending: NB }), 80);
function setWind(wd, kt) { // wd: meteorological "from" direction
  const to = (wd + 180) * Math.PI / 180;
  wind.vec.set(Math.sin(to), Math.cos(to));
  wind.kt = kt;
}
function updateWind(dt) {
  const v = wind.kt * 0.514 * 45, len = 60 + wind.kt * 14, p = wind.pos;
  const gp = windGeom.attributes.position.array, gc = windGeom.attributes.color.array;
  const W = WBOX.x1 - WBOX.x0, H = WBOX.y1 - WBOX.y0;
  for (let i = 0; i < WIND_N; i++) {
    let x = p[i * 3] + wind.vec.x * v * dt, y = p[i * 3 + 1] + wind.vec.y * v * dt;
    x = WBOX.x0 + ((((x - WBOX.x0) % W) + W) % W);
    y = WBOX.y0 + ((((y - WBOX.y0) % H) + H) % H);
    p[i * 3] = x; p[i * 3 + 1] = y;
    const h = p[i * 3 + 2], edge = Math.min(1, (x - WBOX.x0) / 1500, (WBOX.x1 - x) / 1500, (y - WBOX.y0) / 1500, (WBOX.y1 - y) / 1500);
    gp.set([x, h, -y, x - wind.vec.x * len, h, -(y - wind.vec.y * len)], i * 6);
    const b = 0.22 * Math.max(0, edge) * Math.min(1, wind.kt / 4 + 0.2);
    if (theme === 'light') gc.set([0.32, 0.32, 0.3, b * 2.2, 0.32, 0.32, 0.3, 0], i * 8);
    else gc.set([0.8, 0.8, 0.77, b, 0.8, 0.8, 0.77, 0], i * 8);
  }
  windGeom.attributes.position.needsUpdate = true;
  windGeom.attributes.color.needsUpdate = true;
}

// ------------------------------------------------------------------ labels
const labelLayer = document.createElement('div');
labelLayer.className = 'labels';
app.appendChild(labelLayer);
const labels = [];
function label(html, x, y, h, cls) {
  const el = document.createElement('div');
  el.className = 'lbl ' + (cls || '');
  el.innerHTML = html;
  labelLayer.appendChild(el);
  const l = { el, p: V(x, y, h), cls };
  labels.push(l);
  return l;
}
for (const [name, x, y] of S.places || []) label(name, x, y, 60, 'place');
// orientation: compass letters at the scene edge, landmarks, WEST/EAST along the 07/25 axis, current flow arrow
const ARROW_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
const MID = [-716, 337], AX = [Math.sin(69 * Math.PI / 180), Math.cos(69 * Math.PI / 180)]; // runway system centre, 070° axis
for (const [t, x, y] of [['Frankfurt city ↗', 7980, 8640], ['Taunus hills', -8130, 16000], ['Mainz · Wiesbaden', -14500, -1500], ['Darmstadt', 5700, -15000]]) label(t, x, y, 0, 'landmark');
function axisLabel(text, sign, dist) {
  const l = label(sign > 0 ? `${text}${ARROW_SVG}` : `${ARROW_SVG}${text}`, MID[0] + AX[0] * dist * sign, MID[1] + AX[1] * dist * sign, 0, 'axis');
  l.dir = V(MID[0] + AX[0] * (dist + 600) * sign, MID[1] + AX[1] * (dist + 600) * sign, 0);
  return l;
}
// towns under the paths (WGS84 -> scene metres around the aerodrome reference point 50.0333 N, 8.5706 E)
for (const [name, lat, lon] of [['Flörsheim', 50.0136, 8.428], ['Raunheim', 50.0098, 8.4535], ['Offenbach', 50.0956, 8.7761], ['Mainz', 49.9929, 8.2473], ['Rüsselsheim', 49.9899, 8.4225],
  ['Kelsterbach', 50.0613, 8.53], ['Frankfurt', 50.1109, 8.6821], ['Neu-Isenburg', 50.0531, 8.6947], ['Groß-Gerau', 49.9214, 8.485]])
  { const l = label(`<i></i><span>${name}</span>`, (lon - 8.5706) * 71503, (lat - 50.0333) * 111320, 0, 'town'); l.name = name; }
// wind over the airport: an arrow pointing the way it blows, with speed and direction (the reason the direction exists)
const windInd = label('', 900, 4300, 0, 'windind');
const rwLabels = {};
for (const rw of Object.values(RW)) {
  rwLabels[rw.key] = [rw.A, rw.B].map((p, k) => {
    const s = k === 0 ? -1 : 1;
    const sg = rw.key === 'south' ? -1 : 1; // north of 07L and 07C, south of 07R: the two inner runways get opposite sides
    const side = rw.key === 'r18' ? [1, 0] : [-rw.uy * Math.sign(rw.ux || 1) * sg, rw.ux * Math.sign(rw.ux || 1) * sg];
    if (rw.key === 'r18') { const so = rw.A[1] > rw.B[1] ? rw.A : rw.B, l = label('', so[0] + 260, so[1] + 200, 10, 'rwy'); l.rw = rw; l.end = V(so[0], so[1], 10); l.other = V((rw.A[1] > rw.B[1] ? rw.B : rw.A)[0], (rw.A[1] > rw.B[1] ? rw.B : rw.A)[1], 10); return l; } // at its south threshold
    const l = label('', p[0] - rw.ux * s * 260 + side[0] * 190, p[1] - rw.uy * s * 260 + side[1] * 190, 10, 'rwy');
    const q = k === 0 ? rw.B : rw.A; l.rw = rw; l.end = V(p[0], p[1], 10); l.other = V(q[0], q[1], 10); // this end and the other one
    return l;
  });
}
// approach and departure paths: dashed = landings coming in, solid = take-offs going out, arrows the way they fly
const pathGroup = add(new THREE.Group(), 46), pathArrows = [], pathTags = [];
for (let i = 0; i < 10; i++) pathArrows.push(label(ARROW_SVG, 0, 0, 0, 'parrow'));
for (let i = 0; i < 2; i++) pathTags.push(label('', 0, 0, 0, 'ptag'));
let pathKey = '', PATHS = [], PATH_PTS = [], GPATHS = [];
const nearSeg = (p, a, b) => { const vx = b[0] - a[0], vy = b[1] - a[1], q = Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / (vx * vx + vy * vy))); return Math.hypot(p[0] - a[0] - q * vx, p[1] - a[1] - q * vy); };
function pathBox(od) { // bbox of the landing / take-off paths of od, the runways and the towns under the approaches
  const segs = pathSegs(od, true).filter(g => g.kind !== 'ghost'), pts = segs.flatMap(g => [g.a, g.b]);
  for (const rw of Object.values(RW)) pts.push(rw.A, rw.B);
  for (const l of labels) if (l.cls === 'town') { const p = [l.p.x, -l.p.z]; if (segs.some(g => g.kind === 'arr' && nearSeg(p, g.a, g.b) < 1500)) pts.push(p); }
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
}
function pathSegs(od, r18) {
  const segs = [];
  for (const rw of Object.values(RW)) {
    if (rw.key === 'r18' && !r18) continue;
    const f = flow(rw, od), s = f.start, d = f.dir, e = [s[0] + d[0] * rw.len, s[1] + d[1] * rw.len];
    if (rw.key === 'nw' || rw.key === 'south') {
      const AL = appLen(rw, od); segs.push({ a: [s[0] - d[0] * AL, s[1] - d[1] * AL], b: s, kind: 'arr', key: rw.key, des: f.startIsA === (rw.A[0] < rw.B[0]) ? rw.d07 : rw.d25 }); // final approach, 16 km
      const g = flow(rw, od === 25 ? 7 : 25), gs = g.start; // the other direction, faint: where landings would come from after a switch
      if (GHOST) { const GL = GHOST_L[`${rw.key}/${od === 25 ? 7 : 25}`] ?? 16000; segs.push({ a: [gs[0] - g.dir[0] * GL, gs[1] - g.dir[1] * GL], b: gs, kind: 'ghost' }); } // to the edge of the free view, clear of the buttons (fitHome)
    }
    else { const DL = Math.min(rw.key === 'r18' ? 1100 : 1500, DEP_L[`${rw.key}/${od}`] ?? 1e9); segs.push({ a: e, b: [e[0] + d[0] * DL, e[1] + d[1] * DL], kind: 'dep', r18: rw.key === 'r18' }); } /* shortened so the arrow ends >= 24 px above the timeline (fitHome) */ // climb-out straight ahead
  }
  return segs;
}
function drawPaths(od, r18) {
  const DIM = NIGHT ? 0.25 : 1, key = `${od}/${r18}/${theme}/${GHOST}/${NIGHT}`; // the night ban: the paths at 25 %
  if (key === pathKey) return;
  pathKey = key; PATHS = [];
  for (const c of pathGroup.children) { c.geometry.dispose(); c.material.dispose(); }
  pathGroup.clear();
  const col = od === 25 ? HEX.westLine : HEX.eastLine, segs = pathSegs(od, r18); lastSegs = segs; // paths in the line tint (lighter in dark mode)
  PATHS = segs.filter(g => g.kind !== 'ghost').map(g => [g.a, g.b]); GPATHS = segs.filter(g => g.kind === 'ghost').map(g => [g.a, g.b]); // the other direction's approaches: runway tags keep clear of them too
  { // towns within 2 km of an active approach line are the ones being flown over now
    const near = (p, a, b) => { const vx = b[0] - a[0], vy = b[1] - a[1], q = Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / (vx * vx + vy * vy))); return Math.hypot(p[0] - a[0] - q * vx, p[1] - a[1] - q * vy); };
    for (const l of labels) if (l.cls === 'town') { const p = [l.p.x, -l.p.z]; l.el.classList.toggle('under', segs.some(g => { if (g.kind !== 'arr') return false; const R = od === 25 ? 14000 : 9000, L = Math.hypot(g.a[0] - g.b[0], g.a[1] - g.b[1]) || 1, bx = (g.a[0] - g.b[0]) / L, by = (g.a[1] - g.b[1]) / L, dx = p[0] - g.b[0], dy = p[1] - g.b[1], f = dx * bx + dy * by, c = Math.abs(dx * by - dy * bx); return f > 0 && f < R && c < 1500; })); } // the dashboard's town rule exactly: ahead of the threshold, under 9 km (07) / 14 km (25) out, within 1.5 km of the path // the dashboard's rule: within 1.5 km of the approach, 9 km out for 07, 14 km for 25
    TOWN_KEY = labels.filter(l => l.cls === 'town' && l.el.classList.contains('under')).sort((a, b) => a.p.x - b.p.x); // numbered west to east, as on the dashboard
    TOWN_KEY.forEach((l, k) => { l.el.querySelector('i').textContent = k + 1; l.el.classList.add('num'); l.el.title = l.name; });
    for (const l of labels) if (l.cls === 'town' && !TOWN_KEY.includes(l)) { l.el.querySelector('i').textContent = ''; l.el.classList.remove('num'); }
    try { renderMapKey(); } catch {}
  }
  for (const rw of Object.values(RW)) { // the runways themselves, bold enough to read at this scale
    const closed = rw.key === 'r18' && !r18, land = rw.key === 'nw' || rw.key === 'south';
    // the runway itself is the shader strip at true width; around it a soft glow in the direction colour
    if (!closed) {
      const halo = ribbon([{ p: [rw.A, rw.B], w: theme === 'light' ? 300 : 180 }], 2.5, col, (theme === 'light' ? 0.2 : 0.1) * DIM); halo.renderOrder = 46; pathGroup.add(halo);
      const cl = ribbon([{ p: [rw.A, rw.B], w: view.card ? 30 : (theme === 'light' ? 64 : 46) }], 3.5, col, NIGHT ? 0.35 : 1); cl.renderOrder = 48; pathGroup.add(cl); // the centreline in the direction colour
    }
  }
  for (const g of segs) {
    const L = Math.hypot(g.b[0] - g.a[0], g.b[1] - g.a[1]), u = [(g.b[0] - g.a[0]) / L, (g.b[1] - g.a[1]) / L], polys = [];
    if (g.kind !== 'dep') for (let q = 0; q < L; q += 560) polys.push({ p: [[g.a[0] + u[0] * q, g.a[1] + u[1] * q], [g.a[0] + u[0] * Math.min(L, q + 320), g.a[1] + u[1] * Math.min(L, q + 520)]], w: 65 }); // approach dashes: thin and half transparent
    else polys.push({ p: [g.a, g.b], w: 90 });
    const ink = theme === 'light' ? '#3a3a38' : '#d8d7d2';
    if (g.kind === 'arr') { // fading in from the far end: dashes in bands of rising opacity
      const B = 8; for (let k = 0; k < B; k++) { const part = polys.filter((_, i) => Math.min(B - 1, Math.floor(i / polys.length * B / 0.2)) === k); /* faded out over the outer 20 % */ if (!part.length) continue;
        const m = ribbon(part.map(q => ({ ...q, w: theme === 'light' ? 48 : 90 })), 2, col, Math.min(1, (theme === 'light' ? 0.9 : 1) * DIM * Math.min(1, (k + 0.3) / (B - 1)) * (theme === 'light' ? 1 : 1.2))); /* dark: wider, fully opaque dashes on the black map */ m.renderOrder = 46; pathGroup.add(m); }
      continue;
    }
    const mesh = g.kind === 'arr' ? ribbon(polys.map(q => ({ ...q, w: 48 })), 2, col, 0.9) : g.kind === 'ghost' ? Object.assign(ribbon(polys.map(q => ({ ...q, w: app.clientWidth < 640 ? 150 : 80 })), 2, od === 25 ? HEX.ghostE : HEX.ghostW, GHOST_OP * DIM), { ghost: true }) /* exactly the key's colour, opaque: the dash pattern says it is hypothetical (>= 3:1 on the map ground, check.mjs) */
      : ribbon(polys.map(q => ({ ...q, w: 40 })), 2, ink, 0.9 * DIM); mesh.renderOrder = 46; pathGroup.add(mesh); // a thin take-off line, as on the 2D map
  }
  let n = 0;
  for (const g of segs.filter(g => g.kind !== 'ghost')) for (const f of [g.kind === 'arr' ? 0.95 : 1]) { // landings: on the outer part, clear of the towns near the field; take-offs: the arrowhead at the end
    const l = pathArrows[n++]; if (!l) break;
    const p = [g.a[0] + (g.b[0] - g.a[0]) * f, g.a[1] + (g.b[1] - g.a[1]) * f];
    l.p.copy(V(p[0], p[1], 0)); l.dir = V(p[0] + (g.b[0] - g.a[0]) * 0.05, p[1] + (g.b[1] - g.a[1]) * 0.05, 0); l.off = false;
    l.el.style.color = g.kind === 'arr' ? col : 'var(--label)'; l.el.style.opacity = NIGHT ? '0.3' : ''; // the night ban dims the arrows too (every breakpoint)
  }
  for (; n < pathArrows.length; n++) pathArrows[n].off = true;
  const tags = segs.filter(g => g.kind === 'arr').map(g => [{ a: [g.a[0] + (g.b[0] - g.a[0]) * 0.12, g.a[1] + (g.b[1] - g.a[1]) * 0.12] , key: g.key }, 'a', `${g.des} landings`, g.key === 'nw' ? 1100 : -1100]) // north of the northern path, south of the southern
    .concat(segs.filter(g => g.kind === 'dep').map(g => [g.r18 ? { b: [g.b[0] + 2400, g.b[1] + 600] } : g, 'b', g.r18 ? '18 take-offs' : `${od === 25 ? '25C' : '07C'} take-offs`, g.r18 ? 1 : 1200]));
  const gh = segs.find(g => g.kind === 'ghost');
  while (pathTags.length < tags.length) pathTags.push(label('', 0, 0, 0, 'ptag'));
  pathTags.forEach((l, k) => {
    const tg = tags[k]; if (!tg) { l.off = true; return; }
    const [g, end, txt, dy] = tg; l.off = false; l.el.textContent = txt; l.p.copy(V(g[end][0], g[end][1] + (dy || 700), 0));
  });
}
const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
let PANEL_RECTS = [];
function panelRects() {
  const ar = app.getBoundingClientRect();
  PANEL_RECTS = [...document.querySelectorAll('.hud .panel:not([hidden]),.hud .hero,.hud .attrib')].map(el => {
    const b = el.getBoundingClientRect(); return b.width ? [b.left - ar.left, b.top - ar.top, b.right - ar.left, b.bottom - ar.top] : null; }).filter(Boolean);
}
let TOWN_RECTS = [];
function updateLabels() {
  TOWN_RECTS = []; const RWY_RECTS = []; updateLabels.sp = null;
  { const w = app.clientWidth, h = app.clientHeight; // every town dot first, so no name lands on another town's dot
    const ND = []; for (const l of labels) if (l.cls === 'town') { _v.copy(l.p).project(camera); let x = (_v.x + 1) / 2 * w, y = (1 - _v.y) / 2 * h; l.nd = null; l.tp = [x, y]; if (l.el.classList.contains('num') && !l.off) { l.nd = [x, y]; ND.push(l.nd); } }
    for (let it = 0; it < 4; it++) for (let i = 0; i < ND.length; i++) for (let j = i + 1; j < ND.length; j++) { // numbered discs (22 px) never touch: two closer than 26 px step apart along the line between them
      const a = ND[i], b = ND[j], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, k = (26 - d) / 2; if (k <= 0) continue; a[0] -= dx / d * k; a[1] -= dy / d * k; b[0] += dx / d * k; b[1] += dy / d * k; }
    for (const l of labels) if (l.cls === 'town') { const [x, y] = l.nd || l.tp; TOWN_RECTS.push([x - 10, y - 10, x + 10, y + 10]); }
    updateLabels.nd = ND.map(([x, y]) => [x - 11, y - 11, x + 11, y + 11]); }
  const w = app.clientWidth, h = app.clientHeight;
  for (const l of labels) {
    if (l.off) { l.el.style.display = 'none'; continue; }
    _v.copy(l.p).project(camera);
    if (_v.z > 1 || Math.abs(_v.x) > 1.1 || Math.abs(_v.y) > 1.1) { l.el.style.display = 'none'; continue; }
    let x = (_v.x + 1) / 2 * w, y = (1 - _v.y) / 2 * h;
    if (l.cls !== 'rwy' && l.cls !== 'windind') { // nothing half off the canvas or under the panels, the timeline or the controls
      const lw = l.lw || (l.lw = l.el.offsetWidth || 80), half = l.cls === 'town' ? 0 : lw / 2, nd = l.cls === 'town' && l.el.classList.contains('num'), x0 = nd ? x - 12 : l.cls === 'town' ? x - 8 : x - half, x1 = nd ? x + 12 : l.cls === 'town' ? x + 8 + lw : x + half; /* a numbered disc is 22 px: its name is in the key */
      if (x0 < 4 || x1 > w - 4 || y < 8 || y > h - 8 || PANEL_RECTS.some(r => x1 > r[0] - 8 && x0 < r[2] + 8 && y > r[1] - 12 && y < r[3] + 12)) { l.el.style.display = 'none'; continue; }
    }
    if (l.cls === 'town' && l.el.classList.contains('num')) { if (l.nd) [x, y] = l.nd; l.el.style.display = ''; l.el.style.transform = `translate(${x}px, ${y}px)`; continue; } // numbered: the name is in the key
    if (l.cls === 'town') { // the dot sits on the town; its name goes where no flight path runs
      const tw = l.tw || (l.tw = l.el.querySelector('span').offsetWidth || 60), hitR = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
      const own = [x - 10, y - 10, x + 10, y + 10], others = TOWN_RECTS.filter(q => !(q[0] === own[0] && q[1] === own[1]));
      // the 2D map's rule: 8 anchors around the marker (6 px, then 10 px from its ring), tested against the projected path segments
      const SP = updateLabels.sp || (updateLabels.sp = PATHS.map(([a, b]) => { const q = v => { _v2.copy(V(v[0], v[1], 0)).project(camera); return [(_v2.x + 1) / 2 * w, (1 - _v2.y) / 2 * h]; }; return [q(a), q(b)]; }));
      const segD = (a, b, r) => { const cx = Math.max(r[0], Math.min(r[2], (a[0] + b[0]) / 2)); let best = 1e9; for (let t = 0; t <= 1.0001; t += 0.02) { const px = a[0] + (b[0] - a[0]) * t, py = a[1] + (b[1] - a[1]) * t; best = Math.min(best, Math.hypot(Math.max(r[0] - px, 0, px - r[2]), Math.max(r[1] - py, 0, py - r[3]))); } void cx; return best; };
      const pad = q => [q[0] - 4, q[1] - 4, q[2] + 4, q[3] + 4], free = r => SP.every(([a, b]) => segD(a, b, r) >= 3) && !others.some(q => hitR(r, pad(q)));
      const sides = [], th = 18;
      for (const G of [14, 18, 24]) sides.push([G, -th / 2, [x + G - 2, y - th / 2, x + G + tw + 2, y + th / 2]]); // the right side first, at every gap
      for (const G of [14, 18]) { const dg = G * 0.75;
        for (const [ox, oy] of [[G, -th / 2], [-G - tw, -th / 2], [-tw / 2, -G - th], [-tw / 2, G], [dg, -dg - th], [-dg - tw, -dg - th], [dg, dg], [-dg - tw, dg]]) sides.push([ox, oy, [x + ox - 2, y + oy, x + ox + tw + 2, y + oy + th]]); }
      const onScr = r => r[0] >= 4 && r[2] <= w - 4 && !PANEL_RECTS.some(p => r[2] > p[0] - 4 && r[0] < p[2] + 4 && r[3] > p[1] - 4 && r[1] < p[3] + 4) && !RWY_RECTS.some(q => hitR(r, q));
      const side = sides.find(([, , r]) => free(r) && onScr(r)) || sides.find(([, , r]) => onScr(r) && !others.some(q => hitR(r, q))); // a path under a name is acceptable, a name on a name or off screen is not
      if (!side) { l.el.style.display = "none"; continue; }
      const sp = l.el.querySelector('span'); sp.style.left = `${side[0]}px`; sp.style.top = `${side[1]}px`; TOWN_RECTS.push(side[2]);
      l.el.style.display = ''; l.el.style.transform = `translate(${x}px, ${y}px)`; continue;
    }
    if (l.cls === 'rwy') { // a runway number never leaves the screen and never hides under a panel
      const hw = (l.w || (l.w = l.el.offsetWidth || 72)) / 2 + 8;
      x = Math.max(hw + 8, Math.min(w - hw - 8, x)); // 16 px clear of the screen edge
      if (PANEL_RECTS.some(r => x > r[0] - 30 && x < r[2] + 30 && y > r[1] - 12 && y < r[3] + 12)) { l.el.style.display = 'none'; continue; }
      if (!l.el.innerHTML) { l.el.style.display = 'none'; continue; } // the unused end's label holds no place
      let oX = 0, oY = 0;
      if (l.end) { // clear of every runway and path on screen (never on another runway's end): past the end, beside the runway, else hidden
        const pr = v => { _v2.copy(v).project(camera); return [(_v2.x + 1) / 2 * w, (1 - _v2.y) / 2 * h]; };
        const S2 = Object.values(RW).map(r => { const a = pr(V(r.A[0], r.A[1], 0)), b = pr(V(r.B[0], r.B[1], 0)); return [a, b, 170 * Math.hypot(b[0] - a[0], b[1] - a[1]) / r.len]; }); // centre line + half width in px
        const bw = (l.w || 40) / 2 - 4, clear = (cx, cy) => cx > bw + 20 && cx < w - bw - 20 && cy > 12 && cy < h - 12 && !PANEL_RECTS.some(r => cx + bw + 8 > r[0] && cx - bw - 8 < r[2] && cy + 15 > r[1] && cy - (w < 640 ? 20 : 15) < r[3]) /* 16 px inside the screen, never under a card; phones: 12 px under the top card */
          && !RWY_RECTS.some(q => cx - bw - 10 < q[2] && q[0] < cx + bw + 10 && cy - 15 < q[3] && q[1] < cy + 15) // not on a number already placed
          && !PATH_PTS.some(([px, py]) => Math.abs(px - cx) < bw + 5 && Math.abs(py - cy) < 15)
          && S2.every(([a, b, hw2]) => { const vx = b[0] - a[0], vy = b[1] - a[1], f = Math.max(0, Math.min(1, ((cx - a[0]) * vx + (cy - a[1]) * vy) / (vx * vx + vy * vy || 1))), px = a[0] + vx * f, py = a[1] + vy * f;
            return Math.max(Math.abs(px - cx) - bw, Math.abs(py - cy) - 11, 0) >= 5 + hw2; });
        const cands = [], own = [pr(l.end), pr(l.other)];
        const xing = (p1, p2, a, b) => { const d = (u, v, q) => (v[0] - u[0]) * (q[1] - u[1]) - (v[1] - u[1]) * (q[0] - u[0]); return d(a, b, p1) * d(a, b, p2) < 0 && d(p1, p2, a) * d(p1, p2, b) < 0; };
        const others = S2.filter(([a]) => !(Math.abs(a[0] - own[0][0]) < 0.5 && Math.abs(a[1] - own[0][1]) < 0.5) && !(Math.abs(a[0] - own[1][0]) < 0.5 && Math.abs(a[1] - own[1][1]) < 0.5));
        if (l.rw && l.rw.key === 'r18') { const E = pr(l.end), O = pr(l.other), L = Math.hypot(E[0] - O[0], E[1] - O[1]) || 1, ux = (E[0] - O[0]) / L, uy = (E[1] - O[1]) / L; // 18: beside its south threshold first
          for (const f of [0.08, 0.18, 0.3]) for (const sd of [1, -1]) for (const o of [18, 24, 30]) cands.push([E[0] - ux * L * f - uy * sd * o, E[1] - uy * L * f + ux * sd * o]); }
        for (const [E, O] of [[pr(l.end), pr(l.other)], [pr(l.other), pr(l.end)]]) {
          const L = Math.hypot(E[0] - O[0], E[1] - O[1]) || 1, ux = (E[0] - O[0]) / L, uy = (E[1] - O[1]) / L; // outward from this end
          for (let k = 0; k <= 5; k++) { const c = [E[0] + ux * (bw + 14 + k * 6), E[1] + uy * (bw + 14 + k * 6)]; if (!others.some(([a, b]) => xing(E, c, a, b))) cands.push(c); } // not across another runway
          for (const f of [0.12, 0.25, 0.4]) for (const sd of [1, -1]) for (const o of [24, 30, 38]) cands.push([E[0] - ux * L * f - uy * sd * o, E[1] - uy * L * f + ux * sd * o]);
        }
        let E0 = pr(l.end), O0 = pr(l.other), L0 = Math.hypot(E0[0] - O0[0], E0[1] - O0[1]) || 1, ux0 = (O0[0] - E0[0]) / L0, uy0 = (O0[1] - E0[1]) / L0, MC = Object.values(RW).map(r => pr(V((r.A[0] + r.B[0]) / 2, (r.A[1] + r.B[1]) / 2, 0))).reduce((a, q, _, A) => [a[0] + q[0] / A.length, a[1] + q[1] / A.length], [0, 0]), MID0 = [(E0[0] + O0[0]) / 2, (E0[1] + O0[1]) / 2], cen = l.rw && l.rw.key === 'centre', sn0 = (-uy0 * (MID0[0] - MC[0]) + ux0 * (MID0[1] - MC[1])) >= 0 ? 1 : -1, sn = cen ? (ux0 > 0 ? -1 : 1) : sn0, nx0 = -uy0 * sn, ny0 = ux0 * sn, /* the side away from the other runways (the centre runway: north) */ c = l.rw && l.rw.key === 'r18' ? [E0[0] + ux0 * 6 - Math.abs(uy0) * 30, E0[1] + uy0 * 6] /* 18: at its north end, on the west side, away from the 07R arrow */ : [E0[0] + ux0 * 24 + nx0 * 18, E0[1] + uy0 * 24 + ny0 * 18]; oX = -ux0; oY = -uy0; { const ownI = Object.values(RW).indexOf(l.rw), nearOwn = q => { let bi = -1, bd = 1e9; S2.forEach(([a, b], k) => { const vx = b[0] - a[0], vy = b[1] - a[1], f = Math.max(0, Math.min(1, ((q[0] - a[0]) * vx + (q[1] - a[1]) * vy) / (vx * vx + vy * vy || 1))), d = Math.hypot(q[0] - a[0] - vx * f, q[1] - a[1] - vy * f); if (d < bd) { bd = d; bi = k; } }); return bi === ownI; };
          // beside its runway: the tag's box 6 px clear of every strip, 6 px clear of the path arrows, 4 px clear of the town
          // discs, the dashes and the tags already placed; first beside the start end on the side away from the other runways,
          // then past the start end, then the other side, then the other end; the old rule only when nothing fits
          const tgh = (l.h || (l.h = l.el.offsetHeight || 20)) / 2, tw2 = (l.w || 40) / 2, bx = q => [q[0] - tw2, q[1] - tgh, q[0] + tw2, q[1] + tgh];
          const sep = (a, b) => Math.max(a[0] - b[2], b[0] - a[2], a[1] - b[3], b[1] - a[3]);
          const AR = pathArrows.filter(a => !a.off).map(a => { _v2.copy(a.p).project(camera); const ax = (_v2.x + 1) / 2 * w, ay = (1 - _v2.y) / 2 * h; return [ax - 11, ay - 14, ax + 11, ay + 14]; }); /* the arrow's 22 x 27 px box */
          const segBox = (a, b, r) => { let m = 1e9; for (let t = 0; t <= 1.0001; t += 0.025) { const px = a[0] + (b[0] - a[0]) * t, py = a[1] + (b[1] - a[1]) * t; m = Math.min(m, Math.hypot(Math.max(r[0] - px, 0, px - r[2]), Math.max(r[1] - py, 0, py - r[3]))); } return m; };
          const GS = GPATHS.map(([a, b]) => [pr(V(a[0], a[1], 0)), pr(V(b[0], b[1], 0))]), pm = w < 640 ? 4 : 8, fine = q => { const r = bx(q); return GS.every(([a, b]) => segBox(a, b, r) >= 4) && r[0] > 16 && r[2] < w - 16 && r[1] > 8 && r[3] < h - 8 && !PANEL_RECTS.some(p => r[2] + pm > p[0] && r[0] - pm < p[2] && r[3] + pm > p[1] && r[1] - (w < 640 ? 12 : pm) < p[3]) /* phones: 12 px under the top card */
            && S2.every(([a, b, hw2]) => segBox(a, b, r) >= hw2 + 6) && AR.every(a => sep(r, a) >= 6) && (updateLabels.nd || []).every(t => sep(r, t) >= 4) && RWY_RECTS.every(t => sep(r, t) >= 4)
            && !PATH_PTS.some(([px, py]) => px > r[0] - 4 && px < r[2] + 4 && py > r[1] - 4 && py < r[3] + 4) && nearOwn(q); };
          const beside = (E, O, sd, fs) => { const L = Math.hypot(O[0] - E[0], O[1] - E[1]) || 1, ux = (O[0] - E[0]) / L, uy = (O[1] - E[1]) / L, nx = -uy * sd, ny = ux * sd, pe = Math.abs(nx) * tw2 + Math.abs(ny) * tgh, out = [];
            for (const f of fs) for (const k of [0, 4, 8]) { const o = (S2[ownI] ? S2[ownI][2] : 4) + pe + 6 + k; out.push([E[0] + ux * L * f + nx * o, E[1] + uy * L * f + ny * o]); } return out; };
          const past = (E, O) => { const L = Math.hypot(O[0] - E[0], O[1] - E[1]) || 1, ux = (E[0] - O[0]) / L, uy = (E[1] - O[1]) / L, pa = Math.abs(ux) * tw2 + Math.abs(uy) * tgh, out = []; for (const k of [8, 14, 20]) out.push([E[0] + ux * (pa + k), E[1] + uy * (pa + k)]); return out; };
          const sd0 = Math.sign(nx0 * -uy0 + ny0 * ux0) || 1, FS = [0.06, 0.15, 0.25, 0.35];
          const nice = [...beside(E0, O0, sd0, FS), ...past(E0, O0), ...beside(E0, O0, -sd0, FS), ...beside(O0, E0, -sd0, FS), ...beside(O0, E0, sd0, FS), ...past(O0, E0)].find(fine);
          if (nice) { c = nice; oX = 0; oY = 0; }
          else if (!clear(c[0], c[1]) || !nearOwn(c)) { const c2 = cands.find(q => clear(q[0], q[1]) && nearOwn(q) && AR.every(a => sep(bx(q), a) >= 6)) || cands.find(q => clear(q[0], q[1]) && nearOwn(q)) || cands.find(q => nearOwn(q)); /* the old rule: clear of the path arrows first */ if (c2) { c = c2; oX = 0; oY = 0; } } } /* a tag stays nearest to its own runway; phones: clear of every other runway too */ // every tag beside its runway's start end (clear of the landing arrow), the same offset
        if (!c) { l.el.style.display = 'none'; continue; }
        [x, y] = c;
      }
      let rr = [x - hw + 6, y - 11, x + hw - 6, y + 11]; // runway numbers never stack: one that would touch an earlier one moves down, not out
      for (let k = 0; k < 4 && RWY_RECTS.some(q => rr[0] < q[2] && q[0] < rr[2] && rr[1] < q[3] && q[1] < rr[3]); k++) { x += (oX || 0) * 34; y += (oY || 1) * 34 * (oX ? 1 : 0.65); rr = [x - hw + 6, y - 11, x + hw - 6, y + 11]; } // outward along its own runway, so the order stays readable
      RWY_RECTS.push(rr);
    }
    l.el.style.display = '';
    l.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    if (l.dir) { // arrows point the way the world direction runs on screen, whatever the camera does
      _v2.copy(l.dir).project(camera);
      l.el.style.setProperty('--a', `${Math.atan2(-(_v2.y - _v.y) * h, (_v2.x - _v.x) * w) * 180 / Math.PI}deg`);
    }
  }
  placeRiverLabel(w, h);
}
// the Main, named along its line (as on the dashboard's map): an italic label just over or under the river where it is
// drawn at full strength, clear of the flight paths, the town markers, the runway tags and the cards; none if no spot is free
const riverEl = document.createElement('div'); riverEl.className = 'lbl rvl'; riverEl.textContent = 'Main'; labelLayer.appendChild(riverEl);
function placeRiverLabel(w, h) {
  if (BARE || view.card || w < 640 || !RIVER_PTS.length) { riverEl.style.display = 'none'; return; }
  const lw = riverEl.lw || (riverEl.lw = riverEl.offsetWidth || 34), lh = 16, P = q => { _v2.copy(V(q[0], q[1], 0)).project(camera); return [(_v2.x + 1) / 2 * w, (1 - _v2.y) / 2 * h, _v2.z]; };
  const SP = updateLabels.sp || PATHS.map(([a, b]) => [P(a), P(b)]), GP = GPATHS.map(([a, b]) => [P(a), P(b)]);
  const boxD = (a, b, r) => { let m = 1e9; for (let t = 0; t <= 1.0001; t += 0.02) { const px = a[0] + (b[0] - a[0]) * t, py = a[1] + (b[1] - a[1]) * t; m = Math.min(m, Math.hypot(Math.max(r[0] - px, 0, px - r[2]), Math.max(r[1] - py, 0, py - r[3]))); } return m; };
  const hitR = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3], rw = [...document.querySelectorAll('.lbl.rwy b, .lbl.parrow svg')].filter(e => e.offsetParent).map(e => { const q = e.getBoundingClientRect(), ar = app.getBoundingClientRect(); return [q.left - ar.left - 4, q.top - ar.top - 4, q.right - ar.left + 4, q.bottom - ar.top + 4]; });
  let best = null; const scr = [...document.querySelectorAll('.scrim')].filter(e => e.offsetHeight).map(e => { const q = e.getBoundingClientRect(), ar = app.getBoundingClientRect(); return [q.left - ar.left, q.top - ar.top, q.right - ar.left, q.bottom - ar.top]; }); // never under the header's or the timeline's fading scrim (it washes the text out)
  for (const q of RIVER_PTS) { if (q[2] < 0.7) continue; const [x, y, z] = P(q); if (z > 1) continue;
    for (const dy of [-(lh / 2 + 5), lh / 2 + 5]) { const r = [x - lw / 2, y + dy - lh / 2, x + lw / 2, y + dy + lh / 2];
      if (r[0] < 8 || r[2] > w - 8 || r[1] < 8 || scr.some(p => hitR(r, p)) || r[3] > h - 8 || PANEL_RECTS.some(p => hitR(r, [p[0] - 8, p[1] - 8, p[2] + 8, p[3] + 8])) || TOWN_RECTS.some(t => hitR(r, [t[0] - 6, t[1] - 6, t[2] + 6, t[3] + 6])) || rw.some(t => hitR(r, t))) continue;
      const c = Math.min(...SP.map(([a, b]) => boxD(a, b, r)), ...GP.map(([a, b]) => boxD(a, b, r)));
      if (!best || c > best.c) best = { c, x, y: y + dy }; } }
  if (!best || best.c < 6) { riverEl.style.display = 'none'; return; }
  riverEl.style.display = ''; riverEl.style.transform = `translate(${best.x.toFixed(1)}px, ${best.y.toFixed(1)}px) translate(-50%, -50%)`;
}

// ------------------------------------------------------------------ live traffic (fra.live -> live.json, OpenSky ADS-B)
let liveData = null, liveOk = false, liveSeen = 0, liveMode = false, wantLive = !CALM, lastGen = '';
const planes = new Map();
const PHASE_WORD = { arr: 'arriving', dep: 'departing', ground: 'on ground', low: 'low level', enroute: 'en route' };
const phaseDot = k => (k === 'ground' ? `<i style="background:transparent;box-shadow:inset 0 0 0 2px ${HEX.ground}"></i>`
  : k === 'air' ? `<i style="background:${HEX.air};border-radius:1px;transform:rotate(45deg) scale(.85)"></i>` : `<i style="background:${HEX[k]}"></i>`); // ring = on the ground, diamond = en route
const phaseKey = f => (f.phase === 'arr' ? 'arr' : f.phase === 'dep' ? 'dep' : f.phase === 'ground' || f.on_ground ? 'ground' : 'air');
class LivePlane {
  constructor(f) {
    this.id = f.id; this.dead = null; this.born = clock.elapsedTime; this.off = new THREE.Vector3();
    this.obj = new THREE.Group();
    this.mat = null; this.emat = null; this.key = '';
    add(this.obj, 72);
    this.tag = document.createElement('div');
    this.tag.className = 'lbl ac';
    labelLayer.appendChild(this.tag);
    this.fix(f, true);
  }
  style() { // colour by phase, built for the current theme
    const k = phaseKey(this.f) + theme;
    if (k === this.key) return;
    this.key = k;
    this.obj.clear(); this.mat?.dispose(); this.emat?.dispose();
    const col = new THREE.Color(HEX[phaseKey(this.f)]), light = theme === 'light';
    this.mat = light ? new THREE.MeshLambertMaterial({ color: col, side: THREE.DoubleSide, transparent: true })
      : new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide, transparent: true, opacity: 0.55, blending: AB, depthWrite: false });
    this.emat = new THREE.LineBasicMaterial({ color: light ? '#0b0b0b' : col.clone().lerp(new THREE.Color('#ffffff'), 0.35), transparent: true, depthWrite: false, opacity: light ? 0.35 : 1, blending: light ? NB : AB });
    this.obj.add(new THREE.Mesh(PLANE, this.mat), new THREE.LineSegments(PLANE_EDGES, this.emat));
  }
  fix(f, first) { // a new position report: dead-reckon it to now, ease away the jump
    const age = Math.min(60, Math.max(0, Date.now() / 1000 - (liveData?.opensky_time || Date.now() / 1000)));
    const tr = (f.track || 0) * Math.PI / 180, spd = f.on_ground ? Math.min(f.spd || 0, 15) : f.spd || 0;
    this.vel = [spd * Math.sin(tr), spd * Math.cos(tr), f.on_ground ? 0 : f.vrate || 0];
    const np = [f.x + this.vel[0] * age, f.y + this.vel[1] * age, Math.max(0, (f.on_ground ? 0 : f.z) + this.vel[2] * age)];
    if (!first && this.pos) this.off.set(this.pos[0] - np[0], this.pos[1] - np[1], this.pos[2] - np[2]);
    this.pos = np; this.f = f; this.dead = null;
    this.hd = Math.PI / 2 - tr;
    this.pitch = f.on_ground ? 0 : Math.atan2(f.vrate || 0, Math.max(30, spd));
    this.style();
    const near = (f.alt_ft ?? 99999) < 3000 || (f.dist_km ?? 99) < 20;
    this.tagOn = near;
    this.tag.innerHTML = `${phaseDot(phaseKey(f))}${f.cs || f.id}`; this.tagW = 0;
  }
  step(dt, now) {
    for (let k = 0; k < 3; k++) this.pos[k] += this.vel[k] * dt;
    this.pos[2] = Math.max(0, this.pos[2]);
    this.off.multiplyScalar(Math.exp(-dt * 2.5));
    const x = this.pos[0] + this.off.x, y = this.pos[1] + this.off.y, z = Math.max(0, this.pos[2] + this.off.z);
    this.cur = { x, y, h: z, hd: this.hd, pitch: this.pitch, t: 0 };
    this.obj.position.copy(V(x, y, z + 2));
    this.obj.rotation.set(0, this.hd, this.pitch, 'YXZ');
    this.obj.scale.setScalar((view.card ? 5 : 3) * (this.f.on_ground ? 0.8 : 1));
    let a = Math.min(1, (now - this.born) / 1.2);
    if (this.dead !== null) a *= Math.max(0, 1 - (now - this.dead) / 1.5);
    this.alpha = a;
    const show = liveMode;
    this.obj.visible = show && a > 0.01;
    this.mat.opacity = (theme === 'light' ? 1 : 0.55) * a * (feedLate() ? 0.3 : 1);
    this.emat.opacity = (theme === 'light' ? 0.35 : 1) * a;
  }
  drawTag(w, h) {
    const vis = liveMode && this.alpha > 0.05 && (this.tagOn || this === pinned || this === hovered);
    if (!vis) { this.tag.style.display = 'none'; return; }
    _v.copy(this.obj.position).project(camera);
    if (_v.z > 1 || Math.abs(_v.x) > 1.05 || Math.abs(_v.y) > 1.05) { this.tag.style.display = 'none'; return; }
    const x = (_v.x + 1) / 2 * w, y = (1 - _v.y) / 2 * h - 14;
    this.tag.style.display = '';
    this.tag.style.opacity = this.alpha * (feedLate() ? 0.5 : 1);
    this.tag.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
    if (!this.tagW) this.tagW = this.tag.offsetWidth || 60;
    return { p: this, r: [x - this.tagW / 2 - 2, y - 20, x + this.tagW / 2 + 2, y + 1], pri: this === pinned || this === hovered ? 0 : 1 };
  }
  dispose() { scene.remove(this.obj); this.mat?.dispose(); this.emat?.dispose(); this.tag.remove(); }
}
function applyLive(d) {
  liveData = d;
  if (d.generated === lastGen) return;
  lastGen = d.generated;
  const now = clock.elapsedTime, seen = new Set();
  for (const f of d.flights || []) {
    if (!Number.isFinite(f.x) || !Number.isFinite(f.y)) continue;
    seen.add(f.id);
    const p = planes.get(f.id);
    if (p) p.fix(f); else planes.set(f.id, new LivePlane(f));
  }
  for (const [id, p] of planes) if (!seen.has(id) && p.dead === null) p.dead = now;
  if (wantLive && !liveMode) setLive(true);
  renderLiveBadge();
}
async function pollLive() {
  try {
    const r = await fetch('live.json', { cache: 'no-store' });
    if (!r.ok) throw new Error(r.status);
    const d = await r.json();
    liveOk = true; liveSeen = Date.now();
    applyLive(d);
  } catch { liveOk = false; renderLiveBadge(); }
}
if (location.protocol.startsWith('http')) { pollLive(); setInterval(pollLive, 5000); }
function liveAge() { return liveData ? (Date.now() - Date.parse(liveData.generated)) / 1000 : Infinity; }
const LATE_S = 15 * 60; // older than this, live positions are history, not live
const OFFLINE_S = 6 * 3600; // older than this the feed counts as offline: no aircraft are drawn at all
const feedLate = () => liveAge() > LATE_S;
const feedOffline = () => !!liveData && liveAge() > OFFLINE_S;
const ageWords = s => (s >= 172800 ? `${Math.round(s / 86400)} days old` : s >= 5400 ? `${Math.round(s / 3600)} h old` : `${Math.round(s / 60)} min old`);
function setLive(on) { // Now = real aircraft; any future hour = simulated traffic
  wantLive = on;
  liveMode = on && !!liveData && !feedOffline();
  if (liveMode && !CALM) {
    state.ovOd = ''; state.ovR18 = '';
    syncMode(); setPlaying(false); setHour(curIdx(), true); knobTo(curIdx(), 'jump');
  } else if (state.run) setHour(state.hour, true);
  renderLiveBadge();
}

function exitLive() { // the user picked a forecast hour or a what-if: simulated traffic from here on
  if (!wantLive && !liveMode) return;
  wantLive = false; liveMode = false;
  state.ovOd = ''; state.ovR18 = ''; syncMode();
}

// ---- hover / click: which aircraft is which
let hovered = null, pinned = null, downAt = null;
function pickAircraft(cx, cy) {
  const r = renderer.domElement.getBoundingClientRect(), w = r.width, h = r.height;
  let best = null, bd = 26;
  const cands = liveMode ? [...planes.values()].filter(p => p.dead === null && p.obj.visible) : flights.filter(f => f.dead === null && f.cur && f.obj.visible !== false);
  for (const c of cands) {
    _v.copy(c.obj.position).project(camera);
    if (_v.z > 1) continue;
    const d = Math.hypot((_v.x + 1) / 2 * w - (cx - r.left), (1 - _v.y) / 2 * h - (cy - r.top));
    if (d < bd) { bd = d; best = c; }
  }
  return best;
}
function tipText(c) {
  if (!c) return '';
  if (c instanceof LivePlane) return `<b>${c.f.cs || c.f.id}</b>${c.f.label ? `<span>${c.f.label.replace(/^[^·]*·\s*/, '')}</span>` : `<span>${PHASE_WORD[c.f.phase] || ''}</span>`}<small>Live ADS-B position · OpenSky</small>`;
  return `<b>${c.label}</b><span>Expected traffic for ${fmtRun.format(new Date(state.run.hours[state.hour].t))} under the forecast direction</span><small>Not a real aircraft</small>`;
}
renderer.domElement.addEventListener('pointermove', e => {
  if (e.buttons) return;
  const c = pickAircraft(e.clientX, e.clientY);
  if (c !== hovered) { hovered = c; renderer.domElement.style.cursor = c ? 'pointer' : ''; }
});
renderer.domElement.addEventListener('pointerleave', () => { hovered = null; });
renderer.domElement.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener('pointerup', e => {
  if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5) return;
  const c = pickAircraft(e.clientX, e.clientY);
  if (c) { pinned = c; followed = c; setCamMode('follow'); } else if (pinned) { pinned = null; }
});

// ------------------------------------------------------------------ motion: UI springs, reduced motion
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const moving = new Set();
function animate(spring, onUpdate, onRest) {
  spring.onUpdate = onUpdate;
  spring.onRest = onRest;
  if (RM.matches) spring.jump(spring.target);
  moving.add(spring);
  return spring;
}
function stepSprings(dt) {
  for (const s of moving) {
    s.step(dt);
    s.onUpdate?.(s.x);
    if (s.resting) { moving.delete(s); s.onRest?.(); }
  }
}

// ------------------------------------------------------------------ HUD
const ICON = {
  play: '<svg viewBox="0 0 24 24"><path d="M7 4.6v14.8a1 1 0 0 0 1.52.85l12.1-7.4a1 1 0 0 0 0-1.7L8.52 3.75A1 1 0 0 0 7 4.6z"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><rect x="5.5" y="4" width="4.6" height="16" rx="1.4"/><rect x="13.9" y="4" width="4.6" height="16" rx="1.4"/></svg>',
  plane: '<svg viewBox="0 0 24 24"><path d="M21.5 15.6v-1.9l-8.3-5.2V3.6a1.45 1.45 0 0 0-2.9 0v4.9L2 13.7v1.9l8.3-2.6v5.1l-2.1 1.6v1.5l3.6-1 3.6 1v-1.5l-2.1-1.6V13z"/></svg>',
  orbit: '<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M19.6 13.4A7.8 7.8 0 1 1 17.5 6.5"/><path d="M18.4 2.8v4.4H14"/></svg>',
  info: '<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19zm0 1.8a7.7 7.7 0 1 0 0 15.4 7.7 7.7 0 0 0 0-15.4zM12 10.3c.55 0 .95.4.95.95v5.4a.95.95 0 0 1-1.9 0v-5.4c0-.55.4-.95.95-.95zm0-3.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/></svg>',
  warn: '<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  home: '<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><circle cx="12" cy="12" r="7.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="M12 8.5l2 3.5h-4z" style="fill:currentColor;stroke:none"/></svg>',
  needle: '<svg viewBox="0 0 24 24"><g class="needle"><path d="M12 2.6l3.3 9.4H8.7z" fill="#FF453A"/><path d="M12 21.4L8.7 12h6.6z" opacity=".5"/></g></svg>',
  sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.3"/><path d="M12 2.4v2.4M12 19.2v2.4M2.4 12h2.4M19.2 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M5.2 18.8l1.7-1.7M17.1 6.9l1.7-1.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  moon: '<svg viewBox="0 0 24 24"><path d="M20.4 14.7A8.7 8.7 0 0 1 9.3 3.6a8.7 8.7 0 1 0 11.1 11.1z"/></svg>',
  expand: '<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5"/></svg>',
  collapse: '<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M20 10h-6V4M4 14h6v6M14 10l6.5-6.5M10 14l-6.5 6.5"/></svg>',
  chevrons: '<svg viewBox="0 0 12 12"><path d="M3 4.6 6 1.9l3 2.7M3 7.4l3 2.7 3-2.7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
const T = window.FRA_COPY || {}; // one vocabulary with the dashboard (fra.siteui.COPY)
const HZ = (window.FRA_STYLE || {}).hatch || { css: 'repeating-linear-gradient(135deg,{c} 0 1.5px,transparent 1.5px 4.5px)', light: 'rgba(255,255,255,.4)', dark: 'rgba(255,255,255,.5)' };
const ARROW_SVG2 = d => `<svg class="tarr" viewBox="0 0 34 24" aria-hidden="true"><path d="${((window.FRA_STYLE || {}).arrow || { e: 'M3 12h27M22 4l8 8-8 8', w: 'M31 12H4M12 4l-8 8 8 8' })[d]}"/></svg>`; // the headline's arrow
const HATCH = t => HZ.css.replace('{c}', t === 'light' ? HZ.light : HZ.dark); /* dark: light stripes, ~3:1 on the navy bar (siteui.HATCH) */ // the night-ban hatch, the dashboard's definition
const hud = document.createElement('div');
hud.className = 'hud';
hud.innerHTML = `
  <div class="scrim top"></div><div class="scrim bottom"></div>
  <header class="panel pbar"><a class="pbrand" href="index.html">${(window.FRA_STYLE || {}).logo || ''}Runway Direction Forecast<span>Frankfurt Airport</span></a>
    <nav class="ptabs" aria-label="Pages"><a href="index.html">Dashboard</a><a aria-current="page">3D view</a></nav>
    <div class="prun"><i id="livedot"></i><span class="frs"></span><b id="issued-t" hidden></b></div>
    <button class="pthm" id="b-thm" title="Light / dark theme" aria-label="Light / dark theme"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg></button>
    <div class="ptz" role="group" aria-label="Time zone"><button data-v="Europe/Berlin" aria-pressed="true" id="tzl3">Local</button><button data-v="UTC" aria-pressed="false">UTC</button></div></header>
  <div class="rail">
  <header class="hero">
    <a class="dash" href="index.html">← Dashboard</a>
    <div class="eyebrow" id="eyebrow">${T.now}</div>
    <div class="dir" id="dir" aria-live="polite"></div>
    <div class="outl" id="outl"></div><div class="disl" id="disl" hidden></div><div class="ground" id="ground"></div>
    <div class="dir-sub" id="dir-sub"></div>
    <div class="sumbar" id="sumbar"></div>
    <button class="more" id="b-more" aria-expanded="false">Wind, Runway 18 and details</button>
    <div class="hsec"><div class="risknext" id="dir-next"></div></div>
    <div class="hsec conditions" aria-label="Conditions">
    <div class="row wind">
      <div class="row-main"><div class="row-title" id="wind-t">${T.wind}</div><div class="row-value"><span class="wcomp" id="wcomp" title="The arrow points the way the wind blows (north up)"><i></i></span><span id="wind-v"></span></div></div>
      <div class="row-sub" id="wind-why"></div>
      <div class="row-sub" id="wind-s"></div>
    </div>
    <div class="row">
      <div class="row-main"><div class="row-title">Runway 18</div><div class="row-value" id="r18-v"></div></div>
      <div class="row-sub" id="r18-s"></div>
    </div>
    <div class="row pdetrow"><details class="pdet"><summary>Details</summary><div class="acc" id="acc"></div><div class="probl">The direction switches at short notice when the wind turns, so airlines and ground crews can't plan for it.</div><div class="probl" id="pdetx"></div><div class="probl" id="pdetw"></div></details></div>
    <div class="row mapkey" id="mapkey" aria-label="Map key"></div>
    <div class="row how"><details><summary>How this works</summary>Our forecast blends two models trained on the directions actually flown at Frankfurt over the last 120 days; one of them runs 200 wind scenarios around the ECMWF and ICON forecasts. Calibrated out of sample and tested hour by hour on Jun to Oct 2026. The official forecast (INAA) is the operating-direction forecast published by the Umwelthaus. 07 and 25 are the runway headings (070° east, 250° west); Runway 18 West is used for take-offs to the south only. The live record since 1 Nov is only a few days long, too short to judge yet.<span class="howpg" id="how-pg"></span></details></div>
    </div>
    <div class="seg" id="seg-mode" role="radiogroup" aria-label="Show"><i class="thumb"></i>
      <button role="radio" data-v="live" title="Real aircraft right now (ADS-B)">Live</button><button role="radio" data-v="fc" title="Simulated traffic for the hour picked on the timeline">Forecast</button></div>
  </header>
  </div>
  <div class="attrib">${((window.FRA_STYLE || {}).footer_lines || [(window.FRA_STYLE || {}).footer || 'Official forecast = INAA (Umwelthaus). Map data © OpenStreetMap contributors. Wind: ECMWF IFS, DWD ICON.']).map(t => `<span class="al">${t}</span>`).join(' ')}</div>
  <nav class="panel stack" aria-label="View">
    <div class="ib windchip" id="windchip" title="Forecast wind at the shown hour; the arrow points the way it blows"></div>
    <button class="ib" id="b-home">${ICON.orbit}<span>Reset view</span></button>
    <button class="ib" id="b-follow" aria-pressed="false" hidden>${ICON.plane}<span>Follow a landing aircraft</span></button>
    <button class="ib" id="b-fs">${ICON.expand}<span>Full screen</span></button>
  </nav>
  <div class="hint3" id="hint3" aria-hidden="true">Drag to rotate · scroll to zoom</div>
  <div class="panel caption" id="caption" aria-live="polite"></div>
  <div class="panel actip" id="actip" hidden></div>
  <div class="acring" id="acring" hidden></div>
  <div class="panel aclegend" id="aclegend"></div>
  <div class="panel rose" id="rose" aria-hidden="true"><b data-d="N">N</b><b data-d="E">E</b><b data-d="S">S</b><b data-d="W">W</b><i id="rose-n"></i></div>
  <footer class="panel dock">
    <div class="dhd"><div class="dhl"><b class="dtitle">Next 48 hours</b><div class="readout" aria-live="polite"><span class="ro" id="dro"></span><button class="rback" id="dback" style="visibility:hidden">Back to now</button></div><span class="dpk" id="dpk" title="Highest hourly chance outside the night ban (23:00 to 05:00, no flights)"></span></div>
      <label class="menu dmenu" title="Pick an older forecast to compare"><span>Replay an earlier run</span><select id="run" aria-label="Forecast run"></select><i class="chev" aria-hidden="true"></i></label></div>
    <button class="play" id="play" aria-label="Pause">${ICON.pause}</button>
    <div class="rowlbl" aria-hidden="true"><span id="dir-l">Direction</span><span id="risk-l" hidden></span><span id="r18-l">Runway 18</span><span id="wind-l" hidden>${T.headwind}</span></div>
    <div class="scrub">
      <div class="ticks" id="ticks"></div>
      <div class="track" id="track" role="slider" tabindex="0" aria-label="Forecast hour" aria-valuemin="1" aria-valuemax="48">
        <div class="nights" id="nights"></div><div class="mids" id="mids"></div><div class="segs" id="segs"></div><svg class="risk" id="risk" preserveAspectRatio="none" aria-hidden="true" hidden></svg><svg class="windrow" id="windrow" aria-hidden="true"></svg><span class="rgl0" aria-hidden="true">0</span><i class="pgwash3" id="pgwash"></i><span class="rgl" id="rgl">10\u202f%</span><span class="rgl2" id="rgl2" aria-hidden="true" hidden></span><span class="rpk" id="rpk"></span><span class="pgl" id="pgl" hidden title="Official forecast (INAA): possible switch">Official</span><div class="pgmark" id="pgmark" hidden title="Official INAA forecast: possible switch"></div><div class="marks" id="marks"></div>
        <div class="nowline" id="nowline"></div><div class="selcol" id="selcol"></div>
        <div class="thumb-knob" id="knob"></div>
        <div class="bubble" id="bubble"><b id="bub-t"></b></div>
      </div>
    </div>
    <button class="keyb" id="b-key" aria-expanded="false" aria-label="Show the legend">i</button>
    <div class="dkey" id="dkey" aria-hidden="true"></div>
  </footer>
`;
app.appendChild(hud);
const $ = id => document.getElementById(id);
{ // one accuracy line from the backtest the dashboard uses (window.FRA_QUALITY); omitted when it is missing
  const R = ((window.FRA_QUALITY || {}).od25 || []).filter(r => r.acc !== null && r.acc !== undefined), r24 = R.find(r => r.lead === 24);
  const beats = R.length && R.every(r => r.prog !== null && r.prog !== undefined && r.acc > r.prog);
  const ti = (window.FRA_QUALITY || {}).test_info, MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const a0 = ti && new Date(ti.start), b0 = ti && new Date(a0.getTime() + ti.days * 864e5), per = ti ? `backtest ${MON[a0.getUTCMonth()]}–\u2060${MON[b0.getUTCMonth()]}\u00a0${b0.getUTCFullYear()}` : '';
  const pc = v => Math.round(v * 100), rng = a => { const lo = Math.min(...a), hi = Math.max(...a); return lo === hi ? `${lo}` : `${lo}–${hi}`; }, hasP = R.length && R.every(r => r.prog !== null && r.prog !== undefined);
  $('acc').innerHTML = R.length ? `<div class="pstat"><div class="kv"><span>Hours correct</span><b>${rng(R.map(r => pc(r.acc)))}\u202f%${hasP ? ` <small>· official <em>${rng(R.map(r => pc(r.prog)))}\u202f%</em></small>` : ''}</b></div></div>` : ''; // one row; the gain is under Details
  if ($('pdetx') && R.length && hasP) $('pdetx').innerHTML = `${rng(R.map(r => Math.round((1 - (1 - r.acc) / (1 - r.prog)) * 100)))}\u202f% fewer wrong hours than the official forecast, ${Math.min(...R.map(r => r.lead))}–${Math.max(...R.map(r => r.lead))}\u202fh ahead.`;
  $('acc').title = R.map(r => `${r.lead} h ahead: ${Math.round(r.acc * 100)}% right (official ${Math.round(r.prog * 100)}%)`).join('\n');
}
$('b-key').onclick = () => { const on = !app.classList.contains('keyon'); app.classList.toggle('keyon', on); $('b-key').setAttribute('aria-expanded', on); requestAnimationFrame(resize); };
$('b-more').onclick = () => { const on = !app.classList.contains('sheet'); app.classList.toggle('sheet', on); $('b-more').setAttribute('aria-expanded', on); };

let fmtRun, fmtBub, fmtH, fmtDay;
function makeFormats() {
  fmtRun = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  fmtBub = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  fmtH = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hourCycle: 'h23' });
  fmtDay = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short' });
}
makeFormats();
const pct = p => (p >= 0.995 ? '>99\u202f%' : p < 0.005 ? '<1\u202f%' : `${Math.round(p * 100)}\u202f%`); // same format as the dashboard

const state = { run: null, hour: 0, playing: false, orbit: false, follow: false, cur: null, ovOd: '', ovR18: '' };
for (const r of F.runs) $('run').insertAdjacentHTML('beforeend', `<option value="${r.source}">${fmtRun.format(new Date(r.issue))}</option>`);

// ---- segmented controls: the selection thumb springs from wherever it is
function segmented(el, onPick) {
  const thumb = el.querySelector('.thumb'), btns = [...el.querySelectorAll('button')];
  const sx = new Spring(0, { damping: 1, response: 0.3 }), sw = new Spring(0, { damping: 1, response: 0.3 });
  const draw = () => { thumb.style.transform = `translateX(${sx.x}px)`; thumb.style.width = `${sw.x}px`; };
  let first = true;
  const select = v => {
    const b = btns.find(b => b.dataset.v === v) || btns[0];
    btns.forEach(x => x.setAttribute('aria-checked', x === b));
    if (first || !el.offsetWidth) { sx.jump(b.offsetLeft); sw.jump(b.offsetWidth); draw(); first = !el.offsetWidth; return; }
    animate(sx.to(b.offsetLeft), draw);
    animate(sw.to(b.offsetWidth), draw);
  };
  btns.forEach(b => b.addEventListener('click', () => { select(b.dataset.v); onPick(b.dataset.v); }));
  return select;
}
const segMode = segmented($('seg-mode'), v => { if (v === 'live') setLive(true); else { exitLive(); setHour(state.hour, true); } syncMode(); });
function syncMode() {
  const b = $('seg-mode').querySelector('[data-v=live]');
  b.disabled = !liveData || feedOffline();
  $('seg-mode').hidden = !liveData || feedOffline(); // no feed: no choice to offer
  $('b-follow').hidden = !liveMode;
  const txt = !liveData ? 'Live (no feed)' : feedOffline() ? 'Live (offline)' : feedLate() ? `Live (${ageWords(liveAge())})` : 'Live';
  if (liveMode && feedOffline()) { liveMode = false; setHour(state.hour, true); } // went offline while showing it
  if (b.textContent !== txt) b.textContent = txt;
  segMode(liveMode ? 'live' : 'fc');
}

// ---- hero: the new direction slides in the way the traffic flows (east = right, west = left)
let heroEl = null, heroWord = '';
function setHero(word, color, sign) {
  if (word === heroWord) return; // the title stays neutral; the plate carries the direction colour
  const box = $('dir'), el = document.createElement('span'), old = heroEl, d = 26 * sign;
  const m = /^(\d\d) (.*)$/.exec(word); // "07 Eastbound": the runway number as a painted plate, as on the dashboard
  if (m) { el.innerHTML = `<b class="dbadge"></b>`; el.firstChild.textContent = m[1]; el.firstChild.style.setProperty('--dc', m[1] === '25' ? HEX.west : HEX.east); el.firstChild.dataset.d = m[1]; el.append(` ${m[2]}`); if (/^Frankfurt flies (East|West)$/.test(m[2])) el.insertAdjacentHTML('beforeend', ARROW_SVG2(m[2].endsWith('West') ? 'w' : 'e').replace('class="tarr"', 'class="tarr harr"')); /* the dashboard headline's drawn arrow */ } else el.textContent = word;
  box.appendChild(el);
  heroEl = el;
  if (!heroWord) { heroWord = word; return; }
  heroWord = word;
  animate(new Spring(0, { damping: 1, response: 0.42 }).to(1), p => {
    el.style.opacity = p;
    el.style.transform = `translateX(${(p - 1) * d}px)`;
  });
  if (old) animate(new Spring(0, { damping: 1, response: 0.32 }).to(1), p => {
    old.style.opacity = 1 - p;
    old.style.transform = `translateX(${p * d}px)`;
  }, () => old.remove());
}

// ---- timeline scrubber: 1:1 drag, momentum projection, rubber-banding, springs
const knob = new Spring(0, { damping: 1, response: 0.4 });
let scrubbing = false;
const N = () => state.run.hours.length;
function knobPx(v) { return (v + 0.5) * ($('track').clientWidth / N()); }
function drawKnob() {
  const x = knobPx(knob.x);
  $('knob').style.transform = `translateX(${x}px)`;
  $('knob').style.visibility = liveMode || (!scrubbing && Math.round(knob.x) === curIdx()) ? 'hidden' : ''; // at now, the now line is the one marker
  { const i = Math.max(0, Math.min(N() - 1, Math.round(knob.x))); Object.assign($('selcol').style, { left: `${i / N() * 100}%`, width: `${100 / N()}%` }); }
  const i = Math.max(0, Math.min(N() - 1, Math.round(knob.x)));
  bubText(i);
  const bub = $('bubble'), w = bub.offsetWidth, tw = $('track').clientWidth;
  bub.style.visibility = liveMode || !(scrubbing || state.hour !== curIdx()) ? 'hidden' : '';
  { const pinned = !HOVERING && !scrubbing && state.hour !== curIdx() && !liveMode; bub.classList.toggle('pin', pinned); $('knob').classList.toggle('pin', pinned); } // a click pins: 2 px line, filled chip // only on hover, scrub or a picked hour; now is in the panel
  { const k = bub.style.visibility === 'hidden' ? -1 : state.hour; const rs = $('risk') ? $('risk').querySelectorAll('rect') : []; rs.forEach((r, i) => r.classList.toggle('hov', i === k)); } // the hovered bar, darker (as on the dashboard)
  const lo = 0, hi = Math.max(0, tw - w); // the hour label stays inside the timeline panel, like the dashboard's
  bub.style.transform = `translateX(${Math.max(lo, Math.min(hi, x - w / 2))}px)`;
  { const br = bub.getBoundingClientRect(), vis = bub.style.visibility !== 'hidden'; // the pill sits on the tick row: only the tick labels it lands on step aside
    $('ticks').querySelectorAll('span.day,span.hr,span.nowtick').forEach(l => { l.style.translate = ''; const r = l.getBoundingClientRect(), kx2 = $('knob') ? $('knob').getBoundingClientRect().left + $('knob').getBoundingClientRect().width / 2 : -1e9, hit = vis && ((r.right > br.left - 6 && r.left < br.right + 6 && r.bottom > br.top - 2 && r.top < br.bottom + 2) || (l.classList.contains('hr') && r.left - 2 < kx2 && r.right + 2 > kx2)); /* the shared rule: 6 px around the pill, and the label under the cursor line */
      if (hit && l.classList.contains('day')) { const dx = br.right + 8 - r.left, tr = $('ticks').getBoundingClientRect(); if (dx > 0 && dx <= 60 * (parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1) && r.right + dx <= tr.right) { /* over 60 px: hidden, as on the dashboard */ l.style.translate = `${dx}px 0`; l.classList.remove('near'); return; } }
      l.classList.toggle('near', hit); }); // ticks under the pill hide; a day label moves right past it (never back over the day before), hidden when that leaves the plot
    const pk = $('rpk'), pr = pk.getBoundingClientRect(), kx = $('track').getBoundingClientRect().left + x; pk.classList.toggle('off', vis); if ($('rpkl')) $('rpkl').style.opacity = vis ? '0' : ''; if ($('rpkh')) $('rpkh').style.opacity = vis ? '0' : ''; void pr; void kx; // label and leader together // the peak label never sits under the cursor
    const tg = $('pgl'), tr = tg.getBoundingClientRect(), ch = $('track').querySelector('.swchip')?.getBoundingClientRect(), kxs = (r => r.left + r.width / 2)($('knob').getBoundingClientRect()), r18t = $('track').querySelector('.r18tag')?.getBoundingClientRect(), over = (!tg.hidden && kxs > tr.left - 3 && kxs < tr.right + 3) || (ch && kxs > ch.left - 3 && kxs < ch.right + 3) || (r18t && r18t.width && kxs > r18t.left - 3 && kxs < r18t.right + 3); /* the shared tag-gap rule, on screen coordinates (the dock is zoomed) */ /* the Official tag and the "to 25" chip */
    $('knob').style.setProperty('top', over ? 'var(--dt)' : '0px', 'important'); } { const kn = $('knob'), kr = kn.getBoundingClientRect(), kxl = kr.left + kr.width / 2, hz = app.clientWidth < 640 ? 1 : (parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1); // the cursor breaks behind the in-bar label and, on phones, behind every row title (as on the dashboard)
      const boxes = [...document.querySelectorAll('.segs .dlab'), ...(app.clientWidth < 640 ? document.querySelectorAll('.dock .rowlbl > span') : [])].filter(l => !l.hidden).map(l => l.getBoundingClientRect()).filter(r => r.width && kxl > r.left - 3 && kxl < r.right + 3);
      const gaps = boxes.map(r => [(r.top - kr.top) / hz - 2, (r.bottom - kr.top) / hz + 2]).sort((a, b) => a[0] - b[0]);
      kn.style.setProperty('--mk', gaps.length ? `linear-gradient(${gaps.map(([a, b]) => `#000 ${a.toFixed(1)}px,transparent ${a.toFixed(1)}px,transparent ${b.toFixed(1)}px,#000 ${b.toFixed(1)}px`).join(',')})` : 'none'); } // the line starts under the Official tag when it would cross it
  if (scrubbing && i !== state.hour) setHour(i);
}
const peakNote = (p, t) => `Highest: ${pct(p)} at ${new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(t))}`; // the dashboard's formatter
let PGDIS = [], GHOST = false, OTHER = 'West', HOVERING = false, TOWN_KEY = [], NIGHT = false;
function renderMapKey() { // the map key: an overlay at the bottom-left of the 3D viewport, above the timeline
  const el = document.getElementById('mapkey'); if (!el) return; if (!el.classList.contains('mapov') && !el.classList.contains('inrail')) { el.classList.add('mapov', 'panel'); hud.appendChild(el); }
  const odK = (typeof state !== 'undefined' && state.cur) ? state.cur.od : 7, oK = odK === 25 ? 'east' : 'west'; // the dashboard's key: Landings in the shown direction's colour, the other direction's approaches only when a switch is in play
  el.innerHTML = `<span><i class="plk" style="border-top-color:var(--${odK === 25 ? 'westLine' : 'eastLine'})!important"></i>${T.landings}</span><span><i class="tok"></i>${T.takeoffs}</span>${GHOST ? `<span><i class="plk gh" data-tok="ghost${oK === 'west' ? 'W' : 'E'}" data-op="${GHOST_OP}" style="border-top-color:var(--ghost${oK === 'west' ? 'W' : 'E'})!important;opacity:${GHOST_OP}"></i>${oK === 'west' ? 'West' : 'East'} (if switched)</span>` : ''}<span class="kbr"></span>` + TOWN_KEY.map((l, k) => `<span class="tkey"><b>${k + 1}</b>${l.name}</span>`).join('');
  { // the third column as wide as its longest label in either direction ("West (if switched)"): the key keeps its
    // width when a hovered hour swaps the label, with no dead space on its right (desktop: the key takes the card's width)
    const cx = renderMapKey.cx || (renderMapKey.cx = document.createElement('canvas').getContext('2d')), cs = getComputedStyle(el); cx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const w = Math.max(...['West', 'East'].map(d => cx.measureText(`${d} (if switched)`).width)), rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    el.style.setProperty('--kc3', `${Math.ceil(w + 1.375 * rem + 1)}px`); }
}
const curIdx = () => (state.run ? Math.max(0, Math.min(N() - 1, Math.floor((Date.now() - Date.parse(state.run.hours[0].t)) / 36e5))) : 0);
const isNowHour = () => liveMode || state.hour === curIdx();
// how long the direction has held, the kicker's last part (the dashboard's rule: hours under 48, then days)
const heldFor = () => { const hrs = window.FRA_SINCE ? Math.max(0, Math.round((Date.now() - Date.parse(window.FRA_SINCE)) / 36e5)) : null; return hrs === null ? '' : ` · ${hrs >= 48 ? `${Math.round(hrs / 24)} days` : `${hrs}\u202fh`}`; };
const odName = od => (od === 25 ? '25 West' : '07 East'); // one wording on both pages: the plate and East / West
function drawPgMark() { // where the official INAA prognosis disagrees with our model, marked on the strip
  const el = $('pgmark'); if (!state.run) return;
  const key = $('pgkey'); if (key) key.style.display = PGDIS.length ? '' : 'none';
  if (!PGDIS.length) { el.hidden = true; return; }
  const n = N(); el.hidden = false;
  Object.assign(el.style, { left: `${PGDIS[0] / n * 100}%`, width: `${(PGDIS[PGDIS.length - 1] - PGDIS[0] + 1) / n * 100}%` });
}
function bubText(i) { // the scrubber label: the selected hour and what is forecast for it
  const h = state.run.hours[i], west = h.p25 >= 0.5;
  const now = liveMode || i === curIdx();
  const wd = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short' }).format(new Date(h.t));
  $('bub-t').innerHTML = `<svg class="pinG" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l-1 6 3 3v2h-4v7l-1 1-1-1v-7H7v-2l3-3z" fill="currentColor"/></svg>${wd} ${fmtHM(new Date(h.t))}`; // short: the full date is in the readout
  const tw = h.ws === undefined ? null : Math.round(h.ws * Math.cos((h.wd - (h.od === 25 ? 249 : 69)) * Math.PI / 180)); // + = headwind on the runways in use
  const hsN = state.run.hours, nb = !liveMode && isNight(h), nk = nb ? hsN.findIndex((x, k) => k > i && !isNight(x)) : -1; // a night hour reads as the night ban whether it is now, pinned or hovered (as on the dashboard)
  if (nb) { const sm = innerWidth < 480, nx = nk >= 0 ? T.night_next.replace('{od}', hsN[nk].od === 25 ? '25' : '07').replace('{t}', fmtHM(new Date(hsN[nk].t))).replace(/^N/, 'n') : 'night ban'; $('dro').innerHTML = `<b>${sm ? `${new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short' }).format(new Date(h.t))} ${fmtHM(new Date(h.t))}` : fmtBub.format(new Date(h.t))}</b> · ${nx}`; } // the shared night phrase (siteui.COPY.night_next) else
  else $('dro').innerHTML = `<b>${now ? slotLab(h.t) : fmtBub.format(new Date(h.t))}</b> · ${now ? `${pct(west ? h.p25 : 1 - h.p25)} ${west ? 'West' : 'East'}` : `${pct(pOther(h))} chance of ${OTHER}`}${tw === null ? '' : ` · ${tw >= 0 ? 'headwind' : 'tailwind'} ${Math.abs(tw)}\u202fkt`}`; // phones: the wind is in the panel
  $('dback').style.visibility = now || HOVERING ? 'hidden' : 'visible'; // only once a click has pinned an hour // in the DOM always: no layout shift; only off the current hour
}
function knobTo(i, opts) {
  if (opts === 'jump') { knob.jump(i); drawKnob(); return; }
  animate(knob.to(i, opts), drawKnob);
}
function drawNow() { // a vertical line at the current time, labelled, when it falls inside this run
  if (!state.run) return;
  const hs = state.run.hours, t0 = Date.parse(hs[0].t), f = (Date.now() - t0) / (hs.length * 36e5), on = f > -0.03 && f < 1;
  const x = Math.max(0, f) * 100;
  $('nowline').style.display = on ? '' : 'none'; $('nowline').style.left = `${x}%`;
  const tw = $('ticks').clientWidth || 1, nt = $('nowtick'), busy = [];
  if (nt) { nt.style.display = on ? '' : 'none'; nt.style.left = `${x}%`; }
  { const st0 = $('tick-start'); if (st0 && nt && on) st0.style.left = `${x * tw / 100}px`; } // the first date at Now (the Now tag sits on the hour row)
  const pl = $('pgl');
  if (pl) { pl.hidden = !PGDIS.length; if (PGDIS.length) { const near = (1 - PGDIS[0] / hs.length) * ($('track').clientWidth || 999) < 120; pl.style.right = near ? '0' : 'auto'; pl.style.left = near ? 'auto' : `${(PGDIS[0] / hs.length * 100).toFixed(2)}%`; // near the end: anchored inside the right edge
    const fh = t => +fmtH.format(new Date(t)), wd = t => new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short' }).format(new Date(t));
    { const ta = hs[PGDIS[0]].t, tb = new Date(Date.parse(hs[PGDIS[PGDIS.length - 1]].t) + 36e5), hh = t => String(fh(t)).padStart(2, '0'), full = `Official: switch ${wd(ta)} ${hh(ta)}:00–${wd(tb)} ${hh(tb)}:00`;
      const ctx = drawNow.cx || (drawNow.cx = document.createElement('canvas').getContext('2d')); ctx.font = '500 11px "IBM Plex Sans", system-ui, sans-serif';
      const TW = $('track').clientWidth || 999, room = (1 - PGDIS[0] / hs.length) * TW, mid = (((window.FRA_STYLE || {}).pgtag || {}).long || 'Official: {da} {ha}h → {db} {hb}h').replace('{da}', wd(ta)).replace('{ha}', hh(ta)).replace('{db}', wd(tb)).replace('{hb}', hh(tb)), ph = innerWidth < 480, mw = q => ctx.measureText(q).width + 12;
      const fit = [mid].find(s2 => mw(s2) <= room), txt = fit || (ph ? mid : 'Official'); void full; pl.dataset.l = mid; pl.dataset.m = (((window.FRA_STYLE || {}).pgtag || {}).mid || 'Official').replace('{db}', wd(tb)).replace('{hb}', hh(tb)); requestAnimationFrame(fitTagChip); /* one wording on both pages (siteui.STYLE.pgtag) */ pl.textContent = txt; // the dashboard's rule: left-aligned at the window start when it fits up to the plot edge, else right-aligned with a tick at the window start
      pl.classList.toggle('ra', !fit); pl.style.right = fit ? 'auto' : '0'; pl.style.left = fit ? `${(PGDIS[0] / hs.length * 100).toFixed(2)}%` : 'auto'; pl.style.setProperty('--tk', `${Math.max(0, Math.round(mw(txt) - room))}px`);
      pl.title = `Official forecast (INAA): possible switch ${wd(ta)} ${hh(ta)}:00 to ${wd(tb)} ${hh(tb)}:00`; } fitTagChip(); /* at once, so no frame shows the tag over the chip */ // as much as fits, the full window in the title
    const wsh = $('pgwash'); if (wsh) Object.assign(wsh.style, { display: '', left: `${(PGDIS[0] / hs.length * 100).toFixed(2)}%`, width: `${((PGDIS[PGDIS.length - 1] - PGDIS[0] + 1) / hs.length * 100).toFixed(2)}%` }); }
  else { const wsh = $('pgwash'); if (wsh) wsh.style.display = 'none'; } } // at the bracket's left end, never clipped // on the bracket, at the right end of the bar's top edge
  for (const l of $('ticks').querySelectorAll('span.hr')) { const c = +l.dataset.x * tw / 100, hw = l.offsetWidth / 2; const tk = l.previousElementSibling && l.previousElementSibling.classList.contains('tk') ? l.previousElementSibling : null; if (tk) tk.style.visibility = ''; l.style.visibility = l.offsetWidth && (busy.some(([a, b]) => c + hw > a && c - hw < b) || (on && c + hw + 6 > x * tw / 100 - (nt ? nt.offsetWidth : 30) && c - hw - 6 < x * tw / 100) /* the Now chip runs left from its line, into the gutter */) ? 'hidden' : ''; if (tk) tk.style.visibility = l.style.visibility; } // a label that touches the Now chip goes, and its tick with it (no orphan tick)
  { const tr = $('ticks').getBoundingClientRect(); $('ticks').querySelectorAll('span.day').forEach(l => { l.classList.remove('dend'); if (l.getBoundingClientRect().right > tr.right + 1) l.classList.add('dend'); }); // a day label that would overflow is right-aligned at the plot edge
    const pr = $('pgl') && !$('pgl').hidden ? $('pgl').getBoundingClientRect() : null; if (pr) $('ticks').querySelectorAll('span.hr').forEach(l => { const r = l.getBoundingClientRect(); if (r.right > pr.left - 4 && r.left < pr.right + 4 && r.bottom > pr.top - 2) l.style.visibility = 'hidden'; }); } // tick labels under the Official tag step aside
  const firstDay = $('ticks').querySelector('span.day'), st = $('tick-start');
  if (st) st.style.visibility = firstDay && parseFloat(firstDay.style.left) / 100 * tw < 90 ? 'hidden' : ''; // the start day, unless its midnight label is right there
}
const fmtHM = d => new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(d);
// the current slot's name, as on the dashboard: a forecast hour runs from its valid time (label index = hour start) for one
// hour, so a fresh forecast's first slot starts after the issue; named by its window, never as a later clock time
const slotLab = t => { const a = Date.parse(t); return `${fmtHM(new Date(a))}\u2013${fmtHM(new Date(a + 36e5))}`; }; // the current slot as its one-hour window (the card title already says what comes next)
function renderLiveBadge() { // one freshness state, with its time: the hero line and the legend never disagree
  const lg = document.getElementById('aclegend');
  if (!lg) return;
  syncMode(); drawNow();
  const dot = k => phaseDot(k);
  if (liveMode) {
    const n = [...planes.values()].filter(p => p.dead === null).length, stale = liveAge() > 60, at = fmtHM(new Date(liveData.generated));
    $('dir-sub').innerHTML = feedLate() ? `<span class="late">${ICON.warn}Aircraft positions are from ${at}, ${ageWords(liveAge())}, shown faded</span>`
      : `<span class="${stale ? 'dot-stale' : 'dot-live'}"></span>Live · ${n} aircraft · updated ${at}`;
    lg.innerHTML = `<span>${dot('arr')}Arriving</span><span>${dot('dep')}Departing</span><span>${dot('ground')}On the ground</span><span>${dot('air')}En route</span>`;
  } else {
    const od = state.cur?.od ?? 7, c = od === 25 ? 'var(--west)' : 'var(--east)', c2 = od === 25 ? 'var(--east)' : 'var(--west)';
    lg.innerHTML = `<span><i class="pl" style="--c:${c}"></i>${od === 25 ? '25' : '07'} landings</span><span><i class="pl solid"></i>Take-offs</span><span><i class="ring"></i>Under a landing path now</span>` + (GHOST ? `<span><i class="pl" style="--c:${c2};opacity:.6"></i>Landings after a switch to ${od === 25 ? '07' : '25'}</span>` : '');
  }
}
function setPlaying(on) {
  state.playing = on;
  $('play').innerHTML = on ? `${ICON.pause}<span>Pause</span>` : `${ICON.play}<span>Play 48\u202fh</span>`;
  $('play').title = 'Step through the forecast hour by hour';
  hourTimer = 0;
}
$('play').onclick = () => { exitLive(); setPlaying(!state.playing); };
{
  const track = $('track');
  let drag = null;
  const value = (e, d) => {
    const r = track.getBoundingClientRect(), pph = r.width / N();
    let v = (e.clientX - r.left - d.offset) / pph - 0.5;
    const lo = 0, hi = N() - 1;
    if (v < lo) v = lo - rubberband((lo - v) * pph, r.width) / pph;
    if (v > hi) v = hi + rubberband((v - hi) * pph, r.width) / pph;
    return v;
  };
  track.addEventListener('pointerdown', e => {
    exitLive();
    track.setPointerCapture(e.pointerId); HOVERING = false; hover = null; // a click pins: leaving the timeline no longer springs back
    track.classList.add('dragging');
    setPlaying(false);
    const r = track.getBoundingClientRect(), x = e.clientX - r.left, kx = knobPx(knob.x);
    const onKnob = Math.abs(x - kx) < 16;
    drag = { offset: onKnob ? x - kx : 0, hist: [{ x: e.clientX, t: e.timeStamp }] };
    drag.v = onKnob ? knob.x : value(e, drag);
    scrubbing = true;
    moving.delete(knob); // grab it mid-flight: continue from the on-screen value
    knob.v = 0;
    if (!onKnob) knobTo(value(e, drag), { damping: 1, response: 0.18 });
  });
  track.addEventListener('pointermove', e => {
    if (!drag) return;
    drag.hist.push({ x: e.clientX, t: e.timeStamp });
    while (drag.hist.length > 2 && e.timeStamp - drag.hist[0].t > 100) drag.hist.shift();
    moving.delete(knob);
    drag.v = value(e, drag);
    knob.jump(drag.v);
    drawKnob();
  });
  const release = e => {
    if (!drag) return;
    track.classList.remove('dragging');
    const h = drag.hist, a = h[0], b = h[h.length - 1], dt = (b.t - a.t) / 1000;
    const vpx = dt > 0.008 && e.timeStamp - b.t < 80 ? (b.x - a.x) / dt : 0;
    const pph = track.clientWidth / N();
    const target = Math.max(0, Math.min(N() - 1, Math.round(drag.v + project(vpx, 0.99) / pph)));
    knobTo(target, { velocity: vpx / pph, damping: Math.abs(vpx) > 300 ? 0.8 : 1, response: 0.4 });
    drag = null;
    moving.add(knob);
    knob.onRest = () => { scrubbing = false; setHour(target); drawKnob(); }; /* the pill turns into the filled pinned chip */
  };
  track.addEventListener('pointerup', release);
  track.addEventListener('pointercancel', release);
  track.addEventListener('keydown', e => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowDown: -1, ArrowUp: 1, PageDown: -6, PageUp: 6 }[e.key];
    let i = step !== undefined ? state.hour + step : e.key === 'Home' ? 0 : e.key === 'End' ? N() - 1 : null;
    if (i === null) return;
    e.preventDefault();
    exitLive();
    setPlaying(false);
    i = Math.max(0, Math.min(N() - 1, i));
    setHour(i);
    knobTo(i, { damping: 1, response: 0.3 });
  });
  // mouse hover previews: the knob follows the cursor; leaving the timeline springs back to the live view
  let hover = null;
  const endHover = () => {
    if (!hover) return;
    const from = hover.from, x = knob.x;
    hover = null; HOVERING = false; scrubbing = false;
    if (liveData) { setLive(true); knob.jump(x); knobTo(0, { damping: 1, response: 0.4 }); }
    else { setHour(from); knobTo(from, { damping: 1, response: 0.4 }); }
  };
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || drag || !state.run) return;
    const r = track.getBoundingClientRect(), pad = 24;
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top - pad && e.clientY <= r.bottom + pad;
    if (!inside) return endHover();
    if (!hover) { hover = { from: state.hour }; exitLive(); setPlaying(false); } HOVERING = true;
    scrubbing = true;
    moving.delete(knob); knob.v = 0; knob.onRest = null;
    knob.jump(Math.max(0, Math.min(N() - 1, (e.clientX - r.left) / (r.width / N()) - 0.5)));
    drawKnob();
  });
  document.documentElement.addEventListener('mouseleave', endHover);
  $('dback').onclick = () => { setPlaying(false); if (liveData && !feedOffline()) setLive(true); else setHour(curIdx()); knobTo(curIdx(), { damping: 1, response: 0.4 }); };
}
addEventListener('keydown', e => {
  if (e.code === 'Space' && !/SELECT|BUTTON/.test(document.activeElement?.tagName)) { e.preventDefault(); setPlaying(!state.playing); }
});


// ---- forecast runs and hours
const isNight = h => { const x = +fmtH.format(new Date(h.t)); return x >= 23 || x < 5; }; // night ban 23-05 local
// dock rows, laid out like the dashboard chart: event row (the hour label), direction, switch chance, Runway 18, headwind
const DOCK = { rh: 24, r18: false, wind: false };
function swScale(peak) { // the shared switch-chance scale (fra.siteui.SWITCH, the same function on the dashboard)
  const S = (window.FRA_STYLE || {}).switch || { real: 0.2, real_h: 80, calm_top: 0.2, calm_h: 40, grid: 0.1 };
  const top = Math.min(1, Math.max(S.nice_min || 0.2, Math.ceil(peak / (S.nice_step || 0.1) - 1e-9) * (S.nice_step || 0.1))); // the dashboard's nice top (siteui.SWITCH)
  return { top, h: Math.min(80, peak >= S.real ? S.real_h : S.calm_h_3d || 50), grid: top / 2 }; // never taller than the dashboard's chance row // the 10 % gridline gives the headroom
}
function dockLayout(hs) {
  const oth = h => (hs[curIdx()].od === 25 ? 1 - h.p25 : h.p25), real = Math.max(...hs.map(oth)) >= 0.2, nar = app.clientWidth < 640;
  DOCK.sc = swScale(Math.max(...hs.map(oth))); DOCK.rh = DOCK.sc.h; // the dashboard's scale and row height: as tall as the peak needs
  DOCK.r18 = hs.some(h => !isNight(h) && h.p18 < 0.9);
  DOCK.wind = false; // the headwind row lives on the dashboard; the 3D dock keeps direction and switch chance at full size
  const lane = DOCK.r18 && !nar ? 12 : 0; DOCK.rh -= lane + (nar ? 0 : 10); /* desktop: the 10 px added to the band over the plot come from the plot (the peak note ~10 px under the bar); the lane over the cells holds the "18 closed" tag 3.5 px clear of its bracket */ if (!nar && innerHeight / (parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1) < 790) DOCK.rh -= 16; // a short window (768 px): the chance plot gives 16 px, so the left card, the key and the timeline keep their 16 px gutters // desktop: the "18 closed" tag sits in the Runway 18 lane, which takes 8 px from the chance plot (the dock keeps its height)
  const ph = app.clientWidth < 600, dt = ph ? 30 : 24, /* the tag band: a 16 px tag (official, switch chip, "18 closed") 5 px under the hour axis and 3 px over the bar */ dh = nar ? 32 : 34, lgH = (() => { const k = $('dkey'), tr = $('track'); if (!k || !tr) return 0; if (k.classList.contains('inbar') || k.parentElement === tr) { k.classList.remove('inbar'); document.querySelector('.dock').appendChild(k); } return 0; })(), /* every width: the legend under the last row, clear of the Now and cursor lines (as on the dashboard) */ rt = dt + dh + lgH + (ph ? 30 : nar ? 12 : 22), /* 22 px under the bar: the band the peak note sits in, above the top gridline */ /* phones: an 8 px gap above and below each row name */ mt = rt + DOCK.rh + (ph ? 34 : 16 + lane), /* phones: the Runway 18 name in its own 16 px line between the chance baseline and the cells */ wt = mt + (DOCK.r18 ? 18 : 4), wh = 44; // phones: each row's name in the 20 px above it
  const th = DOCK.wind ? wt + wh : DOCK.r18 ? mt + 10 : rt + DOCK.rh;
  DOCK.rt = rt;
  for (const [k, v] of Object.entries({ dt, dh, rt, rh: DOCK.rh, mt, wt, wh, th })) app.style.setProperty(`--${k}`, `${v}px`);
  $('wind-l').hidden = !DOCK.wind; $('windrow').style.display = DOCK.wind ? '' : 'none';
}
function drawWindRow() { // headwind on the runways in use, against the switch limit (tailwind above 1 kt), as on the dashboard
  const el = $('windrow'); if (!state.run || !DOCK.wind) { el.innerHTML = ''; return; }
  const hs = state.run.hours, W = $('track').clientWidth, H = 44, cw = W / hs.length; if (!W) return;
  const hw = h => h.ws * Math.cos((h.wd - (h.od === 25 ? 249 : 69)) * Math.PI / 180), have = hs.filter(h => h.ws !== undefined), vals = have.map(hw);
  const hi = Math.max(6, Math.ceil(Math.max(...vals) + 1)), lo = Math.min(-4, Math.floor(Math.min(...vals) - 1)), top = 4, bot = H - 2;
  const y = v => top + (hi - Math.max(lo, Math.min(hi, v))) / (hi - lo) * (bot - top), step = hi - lo > 24 ? 10 : 5, ticks = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) if (v >= 0 || v <= -step) ticks.push(v);
  let d = '', pen = false;
  hs.forEach((h, i) => { if (h.ws === undefined) { pen = false; return; } d += `${pen ? 'L' : 'M'}${((i + 0.5) * cw).toFixed(1)} ${y(hw(h)).toFixed(1)}`; pen = true; });
  el.setAttribute('viewBox', `0 0 ${W} ${H}`); el.setAttribute('width', W); el.setAttribute('height', H);
  el.innerHTML = `<rect x="0" y="${y(-1)}" width="${W}" height="${Math.max(0, bot - y(-1))}" class="zone"/>`
    + ticks.map(v => `<line x1="0" x2="${W}" y1="${y(v)}" y2="${y(v)}" class="${v ? 'grid' : 'zero'}"/>`).join('')
    + `<line x1="0" x2="${W}" y1="${y(-1)}" y2="${y(-1)}" class="lim"/><path class="ln" d="${d}"/>`
    + ticks.map(v => `<rect x="1" y="${y(v) - 14}" width="${v ? 34 : 12}" height="13" rx="2" class="chip"/><text x="4" y="${y(v) - 3}">${v ? `${Math.abs(v)} kt` : '0'}</text>`).join('')
    + `<text x="${W - 4}" y="${Math.min(bot - 1, y(-1) + 11)}" text-anchor="end" class="limt">limit</text>`;
}
new ResizeObserver(() => { if (state.run) { dockLayout(state.run.hours); drawWindRow(); drawNow(); requestAnimationFrame(drawR18Note); } }).observe(app);
function drawR18Note() { // desktop, as on the dashboard: an "18 closed" tag in the Runway 18 lane, between the chance plot's
  // baseline and the cells, sitting on a bracket over the first closed run (no leader); the top lane carries only the switch chip
  const tr = $('track'); if (!tr) return; tr.querySelectorAll('.r18tag, .r18lead, .r18brk').forEach(e => e.remove());
  const cs = [...$('marks').querySelectorAll(':scope > i.x')].filter(e => e.getBoundingClientRect().width); if (app.clientWidth < 640 || $('marks').hidden || !cs.length) return;
  const hz = parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1, T0 = tr.getBoundingClientRect(), loc = r => ({ l: (r.left - T0.left) / hz, r: (r.right - T0.left) / hz, t: (r.top - T0.top) / hz, b: (r.bottom - T0.top) / hz });
  let E = 0; while (E + 1 < cs.length && cs[E + 1].getBoundingClientRect().left - cs[E].getBoundingClientRect().right < 4 * hz) E++; // the first closed run
  const C = loc(cs[0].getBoundingClientRect()), C2 = loc(cs[E].getBoundingClientRect()), TW = tr.clientWidth, cx = (C.l + C2.r) / 2;
  tr.insertAdjacentHTML('beforeend', `<span class="r18tag" title="Runway 18 closed from ${fmtBub.format(new Date(state.run.hours[[...$('marks').children].indexOf(cs[0])].t))}">18 closed</span><i class="r18brk" style="left:${C.l}px;width:${C2.r - C.l}px;top:${C.t - 4}px"></i>`);
  const tg = tr.querySelector('.r18tag'), w = tg.offsetWidth, h = tg.offsetHeight, top = C.t - 7.5 - h, /* 3.5 px clear of its bracket */ left = Math.max(0, Math.min(TW - w, cx - w / 2)); // centred on the run, on its bracket
  Object.assign(tg.style, { left: `${left}px`, top: `${top}px` });
}
function fitTicks() { // hide only the ticks that touch the "Forecast ends" label; skipped while the dock has no layout yet
  const tk = $('ticks'), e = tk.querySelector('.end'); if (!e) return;
  const r = e.getBoundingClientRect(); if (!r.width || !tk.getBoundingClientRect().width) return;
  e.style.visibility = ''; // the end label gives way to a day label it would touch (the hour labels sit on their own line)
  for (const s of tk.querySelectorAll('span.day,span.start')) { const b = s.getBoundingClientRect(); if (b.width && s.style.visibility !== 'hidden' && b.right > r.left - 8 && b.left < r.right) e.style.visibility = 'hidden'; }
}
new ResizeObserver(() => fitTicks()).observe(document.body);
function setRun(name, keepHour) {
  state.run = F.runs.find(r => r.source === name) || F.runs[F.runs.length - 1];
  $('run').value = state.run.source;
  renderIssued(); // the header says which forecast is shown, its age, as on the dashboard
  const hs = state.run.hours;
  $('track').setAttribute('aria-valuemax', hs.length);
  const hatch = (a, b, w = 3) => `repeating-linear-gradient(135deg,${a} 0 ${w}px,${b} ${w}px ${2 * w}px)`;
  requestAnimationFrame(() => { const sg = $('segs'), TW = sg.clientWidth, H2 = hs, c0 = curIdx(), TMIN = ((window.FRA_STYLE || {}).switch_tab_min) || 24; // the dashboard's rule: the predicted switch at least 24 px wide (into the 24 px kept free), faded like its hours, always with its chip
    sg.querySelector('.swtab')?.remove(); $('track').querySelectorAll('.swchip, .swtick, .swstem').forEach(e => e.remove());
    const ci = H2.findIndex((x2, q) => q > c0 && x2.od !== H2[c0].od); if (ci < 0) return; let e2 = ci; while (e2 + 1 < H2.length && H2[e2 + 1].od === H2[ci].od) e2++;
    const cwp = TW / H2.length, x0 = ci * cwp, segW = (e2 + 1 - ci) * cwp, od2 = H2[ci].od, lo = H2.slice(ci, e2 + 1).some(x2 => Math.min(x2.p25, 1 - x2.p25) >= 0.1);
    if (segW < TMIN) sg.insertAdjacentHTML('beforeend', `<i class="swtab ${od2 === 25 ? 'w' : 'e'}${lo ? ' lo' : ''}" style="left:${Math.min(x0, TW - TMIN)}px;width:${TMIN}px;background:${od2 === 25 ? HEX.west : HEX.east}" title="The switch starts here; the forecast ends after this hour"></i>`);
    $('track').insertAdjacentHTML('beforeend', `<span class="swchip ${od2 === 25 ? 'w' : 'e'}" style="--dc:${od2 === 25 ? HEX.west : HEX.east}" title="Switch to ${od2 === 25 ? '25' : '07'} expected ${fmtBub.format(new Date(H2[ci].t))}">to ${od2 === 25 ? '25' : '07'}<span class="swt"> · ${new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(H2[ci].t))}</span></span>`); // the switch hour on the chip, as on the dashboard
    const chip = $('track').querySelector('.swchip'), cw2 = chip.offsetWidth, cl = Math.max(0, Math.min(x0, TW - cw2)); /* inside the axis */ chip.style.left = `${cl}px`;
    if (cl < x0 - 1) $('track').insertAdjacentHTML('beforeend', `<i class="swtick" style="left:${x0}px"></i>`); // a chip pushed left of its hour: a dark tick across the bar marks the switch hour
    $('track').insertAdjacentHTML('beforeend', `<i class="swstem" style="left:${(sg.querySelectorAll(':scope > i.w, :scope > i.e')[ci]?.offsetLeft ?? x0) - 0.5}px;background:${od2 === 25 ? HEX.west : HEX.east}"></i>`); // a 1 px stem from the chip down to the switch moment, as the "18 closed" tag has
    fitTagChip(); });
  $('segs').innerHTML = hs.map(h => {
    const west = h.p25 >= 0.5, other = Math.min(h.p25, 1 - h.p25); // <2%: solid, 2-25%: faded (less certain), more: hatched
    const c = west ? HEX.west : HEX.east; // solid = very likely; white stripes = less certain (2-25%); two colours = either way; grey = night ban
    const bg = isNight(h) ? `${HATCH(theme)} fixed,${c}` : c; /* fixed: one continuous pattern per night, no seam at each hour */ // night: the direction stays visible under a light hatch, as on the dashboard
    return `<i class="${west ? 'w' : 'e'}${!isNight(h) && other >= 0.1 ? ' lo' : ''}" style="background:${bg}" title="${isNight(h) ? 'Night ban, no scheduled flights' : `${odName(west ? 25 : 7)}, ${pct(1 - other)}`}"></i>`;
  }).join('') + (() => { // "07 East →" on each run of one direction (from its first hour outside the night ban, if 5 h fit)
    let out = '', i = 0;
    while (i < hs.length) { let j = i; const w = hs[i].p25 >= 0.5; while (j + 1 < hs.length && (hs[j + 1].p25 >= 0.5) === w) j++;
      // one rule on both pages: at the band start when its first solid run (no night hatch, after the now line) is >= the
      // label's width + 8 px, else at the start of the first run that is (8 px in); never on the start of a night band
      const nf = Math.max(0, (Date.now() - Date.parse(hs[0].t)) / (hs.length * 36e5)), TW = $('segs').clientWidth || $('track').clientWidth || 1000, ctx = dockLayout.cx || (dockLayout.cx = document.createElement('canvas').getContext('2d'));
      ctx.font = '600 13px "IBM Plex Sans", system-ui, sans-serif'; const lw = ctx.measureText(w ? '25 West' : '07 East').width + 35;
      let a = -1, lf = 0; for (let q = i; q <= j;) { while (q <= j && isNight(hs[q])) q++; if (q > j) break; let r = q; while (r + 1 <= j && !isNight(hs[r + 1])) r++; const f0 = Math.max(q / hs.length, q <= nf * hs.length ? nf : 0); if (((r + 1) / hs.length - f0) * TW >= lw + 8) { a = q; lf = f0; break; } q = r + 1; }
      if (a >= 0) out += `<span class="dlab ${w ? 'w' : 'e'}" style="left:calc(${(lf * 100).toFixed(2)}% + 8px)">${w ? `${ARROW_SVG2('w')}25 West` : `07 East${ARROW_SVG2('e')}`}</span>`;
      i = j + 1; }
    return out; })();
  $('marks').innerHTML = hs.map(h => `<i class="${h.p18 < 0.5 ? 'x' : h.p18 < 0.9 ? 'r' : 'o'}${isNight(h) ? ' n' : ''}" title="Runway 18 ${isNight(h) ? 'night ban' : h.p18 < 0.5 ? 'closed' : h.p18 < 0.9 ? `${pct(1 - h.p18)} chance of a closure` : 'open'}"></i>`).join('');
  dockLayout(hs);
  requestAnimationFrame(() => requestAnimationFrame(drawR18Note));
  { // switch chance per hour on the dashboard's scale: 0 to 20 % in a half-height row while no real switch is in view, else 0 to 100 %
    { OTHER = hs[curIdx()].od === 25 ? 'East' : 'West'; } // what the bars measure: p(the other direction) that hour
    const PKI = hs.reduce((m, h, i) => (!isNight(h) && (m < 0 || (OTHER === 'East' ? 1 - h.p25 : h.p25) > (OTHER === 'East' ? 1 - hs[m].p25 : hs[m].p25)) ? i : m), -1); // the labelled peak (outside the night ban), one step darker
    const oth = pOther /* the dashboard's meaning: p(the other direction than the one flown now) */, TOP = DOCK.sc.top, W = hs.length * 10, RH = DOCK.rh, LS = 0, PH = RH - LS, GY = Math.max(LS + 0.5, RH - DOCK.sc.grid / TOP * PH); // a 16 px strip on top for the peak label
    $('risk').setAttribute('viewBox', `0 0 ${W} ${RH}`);
    app.style.setProperty('--gf', (DOCK.sc.grid / TOP).toFixed(3)); // the 10 % label sits on its gridline
    $('rgl').style.top = `${DOCK.rt + GY + 1}px`;
    $('risk').innerHTML = `<line x1="0" y1="${GY}" x2="${W}" y2="${GY}" class="grid"/>` + (TOP > DOCK.sc.grid + 1e-9 ? `<line x1="0" y1="0.5" x2="${W}" y2="0.5" class="grid half"/>` : '') + `<line x1="0" y1="${RH - 0.5}" x2="${W}" y2="${RH - 0.5}" class="base calm"/>` + hs.map((h, i) => { const o = oth(h), ht = o < (((window.FRA_STYLE || {}).switch || {}).min_bar ?? 0.01) ? 0 : Math.max(2, Math.min(1, o / TOP) * PH);
      /* night hours keep their tone: the night band sits behind the bars (as on the dashboard) */ const vpp = 10 * hs.length / ($('track').clientWidth || 1000), bw = Math.min(10 - 2 * vpp, 14 * vpp); return !ht ? `<rect x="${(i * 10 + (10 - bw) / 2).toFixed(2)}" y="${RH - 1}" width="${bw.toFixed(2)}" height="1" fill="${theme === 'light' ? '#4b4d53' : '#9aa0a6'}" opacity=".3"/>` /* under 1 %: a 1 px stub, so the row reads as ~0, not as missing */ : `<rect x="${(i * 10 + (10 - bw) / 2).toFixed(2)}" y="${RH - ht}" width="${bw.toFixed(2)}" height="${ht}" fill="${theme === 'light' ? '#4b4d53' : '#9aa0a6'}" opacity="${o >= 0.2 || i === PKI ? 1 : 0.85}"${i === PKI ? ` style="filter:brightness(${theme === 'light' ? '.75' : '1.1'})"` : ''}><title>${fmtBub.format(new Date(h.t))}: ${pct(o)} chance of ${OTHER} that hour</title></rect>`; }).join('');
    $('rgl').textContent = `${Math.round(DOCK.sc.grid * 100)} %`;
    { const t2 = $('rgl2'); if (t2) { t2.textContent = `${Math.round(TOP * 100)}\u202f%`; t2.hidden = !(TOP > DOCK.sc.grid + 1e-9) || !!DOCK.sc.calm; } } // the scale's top, as on the dashboard
    { // the single peak callout, as on the dashboard: "5 % · Fri 22:00", beside the tallest bar
      const pk = hs.reduce((m, h, i) => (!isNight(h) && (isNight(hs[m]) || oth(h) > oth(hs[m])) ? i : m), 0) /* the peak outside the night ban, as on the dashboard */, o = oth(hs[pk]), el = $('rpk');
      if (o < 0.01 || DOCK.sc.calm) { el.textContent = ''; if ($('rpkl')) $('rpkl').style.display = 'none'; if ($('rpkh')) $('rpkh').style.display = 'none'; } // a calm day names its peak in the row label
      else {
        const f = (pk + 0.5) / hs.length;
        el.textContent = peakNote(o, hs[pk].t); if ($('dpk')) $('dpk').textContent = ''; // at the chance row's right end, just above its bar, as on the dashboard
        const bh = Math.max(2, Math.min(1, o / TOP) * PH); // just above its bar, inside the row, as on the dashboard
        // the note inside the plot, in a 15 px band along its top, ending 6 px before the first bar that reaches into that
        // band (as on the dashboard): clear of the direction bar, the switch chip and every bar; a dot marks the peak bar.
        // Measured from the drawn bars (track coordinates), so it holds on every layout.
        const placeBand = () => { const tr = $('track').getBoundingClientRect(), hz = parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1, sc = app.clientWidth < 640 ? 1 : hz;
          const rk = $('risk').getBoundingClientRect(), bars = [...document.querySelectorAll('#risk rect')].map(b => { const r = b.getBoundingClientRect(); return { l: (r.left - tr.left) / sc, r: (r.right - tr.left) / sc, t: (r.top - tr.top) / sc, h: r.height / sc }; });
          const BAND = 18, top = (rk.top - tr.top) / sc + 4, /* its capitals 4 px under the top gridline */ w0 = el.offsetWidth || 120, pb = bars[pk]; if (!pb) return; const cx = (pb.l + pb.r) / 2; let R = cx - 8;
          { // desktop, when the band between the direction bar and the plot holds it (the dashboard's rule): the note above the
            // top gridline, the leader along its mid-height (above the plot, so clear of every bar top) and a short vertical
            // tick down to the peak dot
            const sg = $('segs').getBoundingClientRect(), gap = (rk.top - sg.bottom) / sc, h0 = el.offsetHeight || 14;
            if (app.clientWidth >= 640 && gap >= 17 && R - w0 >= 0) { const t0 = (rk.top - tr.top) / sc - 1 - h0;
              Object.assign(el.style, { visibility: '', left: `${R.toFixed(1)}px`, right: 'auto', top: `${t0.toFixed(1)}px`, transform: 'translateX(-100%)' }); el.dataset.band = '1'; el.classList.add('up');
              let ld = $('rpkl'); if (!ld) { ld = document.createElement('i'); ld.id = 'rpkl'; ld.className = 'rpkl'; $('track').appendChild(ld); }
              Object.assign(ld.style, { left: `${cx.toFixed(1)}px`, top: `${(pb.t - 3).toFixed(1)}px`, height: '0px', display: '' });
              let lh = $('rpkh'); if (!lh) { lh = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); lh.id = 'rpkh'; lh.setAttribute('class', 'rpkh'); lh.setAttribute('aria-hidden', 'true'); lh.innerHTML = '<path/>'; $('track').appendChild(lh); }
              const ly = t0 + h0 / 2, x0 = R + 3; lh.firstChild.setAttribute('d', `M${x0.toFixed(1)} ${ly.toFixed(1)}L${cx.toFixed(1)} ${ly.toFixed(1)}L${cx.toFixed(1)} ${(pb.t - 6).toFixed(1)}`); lh.style.display = ''; return; }
            el.classList.remove('up'); }
          for (let it = 0; it < bars.length; it++) { let moved = false; for (let k = 0; k < pk; k++) { const b = bars[k]; if (b.h > 1.5 && b.t < top + BAND + 1 && b.r > R - w0 - 2 && b.l - 6 < R) { R = b.l - 6; moved = true; } } if (!moved) break; }
          el.style.visibility = R - w0 < 0 ? 'hidden' : ''; // no room in the band: the dot alone (re-measured on the next frame)
          Object.assign(el.style, { left: `${R.toFixed(1)}px`, right: 'auto', top: `${top.toFixed(1)}px`, transform: 'translateX(-100%)' }); el.dataset.band = '1';
          let ld = $('rpkl'); if (!ld) { ld = document.createElement('i'); ld.id = 'rpkl'; ld.className = 'rpkl'; $('track').appendChild(ld); }
          Object.assign(ld.style, { left: `${cx.toFixed(1)}px`, top: `${(pb.t - 3).toFixed(1)}px`, height: '0px', display: '' });
          // a 1 px leader from the note's end to the peak dot (as on the dashboard): at the note's mid-height, lifted over any bar between them
          let lh = $('rpkh'); if (!lh) { lh = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); lh.id = 'rpkh'; lh.setAttribute('class', 'rpkh'); lh.setAttribute('aria-hidden', 'true'); lh.innerHTML = '<path/>'; $('track').appendChild(lh); }
          const ly = top + (el.offsetHeight || 14) / 2, dy = pb.t - 3, x0 = R + 3, yL = Math.max(top - 4, Math.min(ly, dy, ...bars.filter((b, k) => k < pk && b.h > 1.5 && b.r > x0 && b.l < cx - 3).map(b => b.t - 3)));
          lh.firstChild.setAttribute('d', `M${x0.toFixed(1)} ${ly.toFixed(1)}` + (yL < ly ? `L${x0.toFixed(1)} ${yL.toFixed(1)}` : '') + (dy - yL > 4 ? `L${cx.toFixed(1)} ${yL.toFixed(1)}L${cx.toFixed(1)} ${(dy - 3).toFixed(1)}` : `L${(cx - 3).toFixed(1)} ${yL.toFixed(1)}`));
          lh.style.display = R - w0 < 0 ? 'none' : ''; };
        placeBand();
        requestAnimationFrame(() => { placeBand(); const q = el.getBoundingClientRect(), hit = !el.textContent || [...document.querySelectorAll('#risk rect')].some(b => { const r = b.getBoundingClientRect(); return r.height > 1.5 && r.right > q.left && r.left < q.right && r.bottom > q.top && r.top < q.bottom; }) || [document.getElementById('dkey')].some(k => { if (!k || !k.offsetHeight) return false; const r = k.getBoundingClientRect(); return r.bottom > q.top && r.top < q.bottom; });
          if (hit && el.textContent) { el.textContent = ''; if ($('rpkh')) $('rpkh').style.display = 'none'; return; } // the dot stays on the peak bar
          const ld = $('rpkl'), br = document.querySelectorAll('#risk rect')[pk]?.getBoundingClientRect(), tr = $('track').getBoundingClientRect(), hz = parseFloat(document.documentElement.style.getPropertyValue('--hz')) || 1;
          if (ld && br && el.textContent && !el.textContent.startsWith('peak ') && !el.dataset.band) { const t0 = (q.top + q.height / 2 - tr.top) / (app.clientWidth < 640 ? 1 : hz); Object.assign(ld.style, { top: `${t0}px`, height: `${Math.max(0, (br.top - q.top - q.height / 2) / (app.clientWidth < 640 ? 1 : hz) - 3)}px` }); } }); // no room for the note: the dot and its leader go too (never a lone dot); else the leader runs from the note to its bar
        { const c0 = curIdx(), noSw = !hs.some((x, q) => q > c0 && x.od !== hs[c0].od); if (noSw) { if ($('rpkh')) $('rpkh').style.display = 'none'; const ty = DOCK.rt + RH - bh - 2; if (bh + 20 <= RH) { el.textContent = `peak ${pct(o)}`; Object.assign(el.style, { left: `${((pk + 0.5) / hs.length * ($('track').clientWidth || 1) + 4).toFixed(1)}px`, top: `${ty - 18}px`, transform: 'translateX(-100%)' }); Object.assign($('rpkl').style, { top: `${ty}px`, height: '0px' }); } else { el.textContent = ''; $('rpkl').style.display = 'none'; } } } // as on the dashboard: "peak 20 %" on its dot, or the darker bar alone // no switch expected: the panel names the peak; here only its dot and the darker bar (as on the dashboard)
      }
    }
    { const pk = hs.reduce((m, h, i) => (!isNight(h) && (isNight(hs[m]) || oth(h) > oth(hs[m])) ? i : m), 0) /* the peak outside the night ban, as on the dashboard */; $('rgl').hidden = !!DOCK.sc.calm;
      $('risk-l').innerHTML = `${T.switch} ${OTHER}`; }
    $('risk').removeAttribute('hidden'); $('risk-l').hidden = false; // an SVG element has no .hidden property
    $('marks').hidden = !DOCK.r18; $('r18-l').hidden = !DOCK.r18;
  }
  drawWindRow();
  { // the key lists only what this run shows
    const any = f => hs.some(f), K = [];
    for (const o of [7, 25]) K.push([o === 25 ? 'west' : 'east', `<span><i style="background:var(--${o === 25 ? 'west' : 'east'})"></i>${o === 25 ? '25 West' : '07 East'}</span>`]);
    K.push(['official', `<span id="pgkey" style="display:none"><i class="pgk"></i>${T.inaa_flag}</span>`]); // shown by drawPgMark
    if (any(isNight)) K.push(['night', `<span><i class="nightk" style="background:${HATCH(theme)},${HEX.east}"></i>${T.night}</span>`]);
    if (DOCK.wind) K.push(['limit', `<span><i class="limk"></i>${T.limit}</span>`]);
    if (any(h => !isNight(h) && Math.min(h.p25, 1 - h.p25) >= 0.1)) K.push(['faded', `<span><i class="lessk"></i>${T.faded}</span>`]);
    { const cx = any(h => !isNight(h) && h.p18 < 0.5), rk = any(h => !isNight(h) && h.p18 >= 0.5 && h.p18 < 0.9); // one item for Runway 18, as on the dashboard (siteui.COPY.r18_*)
      if (cx || rk) K.push(['r18', `<span class="kr18" title="${T.r18_tip || ''}">${cx ? '<i class="closedk"></i>' : ''}${rk ? '<i class="riskk"></i>' : ''}${cx && rk ? T.r18_both : cx ? T.r18_closed : T.r18_risk}</span>`]); }
    { const ORD = ((window.FRA_STYLE || {}).legend_order) || []; K.sort((a, b) => ORD.indexOf(a[0]) - ORD.indexOf(b[0])); } // the dashboard's order (siteui.STYLE.legend_order)
    renderMapKey();  // the map key lives in the scene
    $('dkey').innerHTML = K.map(k => k[1]).join('');
  }
  { // night ban 23-05 local as grey bands behind both rows
    const night = isNight;
    let b = '', a = -1;
    hs.forEach((h, i) => {
      if (night(h) && a < 0) a = i;
      if (a >= 0 && (!night(h) || i === hs.length - 1)) { const e = night(h) ? i + 1 : i; b += `<i style="left:${(a / hs.length * 100).toFixed(2)}%;width:${((e - a) / hs.length * 100).toFixed(2)}%"></i>`; a = -1; }
    });
    $('nights').innerHTML = b;
  }
  // the axis on top, as on the dashboard: dates on the first line (at midnight, the start, the end), 06 / 12 / 18 on the second
  const wide = innerWidth >= (((window.FRA_STYLE || {}).axis || {}).short_below || 520) && ($('track').clientWidth || 800) / hs.length * 6 >= (((window.FRA_STYLE || {}).axis || {}).long_px || 48), /* the shared axis rule (fra.siteui.AXIS) */ endD = new Date(new Date(hs[hs.length - 1].t).getTime() + 36e5);
  $('ticks').innerHTML = hs.map((h, i) => { // Now alone at the start: the readout carries the date, day labels sit at midnights only
    const d = new Date(h.t), hr = fmtH.format(d), left = (i / hs.length * 100).toFixed(2); // the hour starts at the cell's left edge
    if (hr === '00') return `<i class="dl" style="left:${left}%"></i><span class="day" style="left:${left}%">${fmtDay.format(d)}</span>`; // every midnight; one near the end is right-aligned inside
    return ['06', '12', '18'].includes(hr) && i <= hs.length - 4 ? `<i class="tk" style="left:${left}%"></i><span class="hr" data-x="${left}" style="left:${left}%">${wide ? `${hr}:00` : hr}</span>` : '';
  }).join('') + `<span class="nowtick" id="nowtick" title="Current hour; forecast issued ${fmtHM(new Date(state.run.issue))}">Now</span>`;
  $('mids').innerHTML = hs.map((h, k) => (k && fmtH.format(new Date(h.t)) === '00' ? `<i style="left:${(k / hs.length * 100).toFixed(2)}%"></i>` : '')).join(''); // midnight: one hairline through every row
  requestAnimationFrame(fitTicks);
  const i = keepHour ? Math.min(state.hour, hs.length - 1) : curIdx();
  setHour(i, true);
  knobTo(i, 'jump');
}
$('run').onchange = e => { setRun(e.target.value); };

function stateAt(i) {
  const h = state.run.hours[i];
  const od = state.ovOd ? +state.ovOd : liveMode && liveData ? liveData.od_live || liveData.od_now || h.od : h.od;
  const r18 = state.ovR18 ? state.ovR18 === '1' : h.p18 >= 0.5;
  return { h, od, r18 };
}

const pOther = h => (OTHER === 'East' ? 1 - h.p25 : h.p25); // the one value the chance row, its readout and the panel show: p(the direction other than the one flown now)
function fitTagChip() { // the dashboard's fitTag: the official tag steps down "Official: Fri 19h → Sat 13h", "Official → Sat 13h", "Official" and ends 4 px before the switch chip
  const tg = $('pgl'), chip = $('track')?.querySelector('.swchip'); if (!tg || tg.hidden || !chip || !PGDIS.length) return;
  const TW = $('track').clientWidth, lim = chip.offsetLeft - 4, xa = PGDIS[0] / state.run.hours.length * TW;
  if (tg.offsetLeft + tg.offsetWidth <= lim) return;
  for (const t of [tg.dataset.l, tg.dataset.m, 'Official']) { if (!t) continue; tg.textContent = t; if (xa + tg.offsetWidth <= lim) { Object.assign(tg.style, { left: `${xa}px`, right: 'auto' }); tg.classList.remove('ra'); return; } }
  tg.textContent = 'Official'; Object.assign(tg.style, { left: `${Math.max(0, lim - tg.offsetWidth)}px`, right: 'auto' }); tg.classList.remove('ra');
}
function setHour(i, force) {
  state.hour = Math.max(0, Math.min(N() - 1, i));
  const { h, od, r18 } = stateAt(state.hour);
  const changed = force || !state.cur || state.cur.od !== od || state.cur.r18 !== r18;
  state.cur = { od, r18, t: h.t, live: liveMode };
  $('track').setAttribute('aria-valuenow', state.hour + 1);
  $('track').setAttribute('aria-valuetext', `${fmtBub.format(new Date(h.t))}, ${od === 25 ? 'westbound' : 'eastbound'}`);

  const west = od === 25, odCol = west ? HEX.west : HEX.east;
  const pOd = west ? h.p25 : 1 - h.p25;
  setHero(isNowHour() ? `${west ? '25' : '07'} Frankfurt flies ${west ? 'West' : 'East'}` : isNight(h) ? (k => { const H2 = state.run.hours, o = k < 0 ? (west ? '25' : '07') : H2[k].p25 >= 0.5 ? '25' : '07'; return `${o} ${k < 0 ? 'Night ban' : T.night_next.replace('{od}', o).replace('{t}', fmtHM(new Date(H2[k].t)))}`; })(state.run.hours.findIndex((x, q) => q > state.hour && !isNight(x))) : `${west ? '25' : '07'} Expected: ${west ? 'West' : 'East'}`, odCol, west ? -1 : 1); $('dir').classList.toggle('fut', !isNowHour()); $('dir').classList.toggle('nbh', !isNowHour() && isNight(h)); /* night ban: an outlined badge, no operations */ document.querySelector('.rail .hero')?.classList.toggle('fut', !isNowHour()); // a forecast hour: the story lines step out // a forecast hour reads as a forecast; now restores it
  $('eyebrow').textContent = isNowHour() ? (window.FRA_SINCE ? `${T.now} · since ${fmtDay.format(new Date(window.FRA_SINCE))}, ${fmtHM(new Date(window.FRA_SINCE))}${heldFor()}` : T.now) : `Frankfurt · forecast for ${new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(h.t))}`;
  $('ground').textContent = '';
  if (!liveMode) $('dir-sub').innerHTML = '';
  bubText(state.hour);
  { // the key question, without scrubbing: does it change, and when
    const hs = state.run.hours, from = liveMode ? 0 : state.hour, j = hs.findIndex((x, k) => k > from && x.od !== h.od);
    const other = k => (h.od === 25 ? 1 - hs[k].p25 : hs[k].p25);
    const worst = Math.max(...hs.slice(from).map((_, q) => other(from + q)));
    const end = fmtBub.format(new Date(new Date(hs[hs.length - 1].t).getTime() + 36e5));
    const prog = x => (x.pg === undefined ? null : x.pg >= 0.75 ? 25 : x.pg <= 0.25 ? 7 : 0), dis = [];
    { const PW = window.FRA_PGWIN; const shared = PW && state.run && state.run.source === PW.run; // the default run: the windows computed once in Python, the same as the dashboard's
      hs.forEach((x, q) => { if (q < (liveMode ? 0 : Math.min(from, curIdx()))) return; const t = Date.parse(x.t), s = prog(x);
        if (shared ? PW.win.some(w => t >= Date.parse(w.start) && t < Date.parse(w.end)) : ((s && s !== x.od) || (s === 0 && Math.max(x.p25, 1 - x.p25) >= 0.9))) dis.push(q); }); }
    PGDIS = dis;
    const pgWhat = dis.length ? (dis.some(q => prog(hs[q]) === 0) ? 'Possible switch' : `Switch to ${prog(hs[dis[0]]) === 25 ? '25' : '07'}`) : '';
    const wk = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    const wq = hs.findIndex((_, q) => q >= from && other(q) === worst);
    const wqOp = hs.reduce((m, x, q) => (q >= from && !isNight(x) && (m < 0 || other(q) > other(m)) ? q : m), -1), worstOp = wqOp < 0 ? worst : other(wqOp); // shown: outside the night ban
    { // the dashboard hero's outlook and official-disagreement lines, the same strings
      const wday = t => new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short' }).format(new Date(t)), hh = t => +fmtH.format(new Date(t));
      const part = t => { const v = hh(t); return v >= 23 || v < 5 ? 'night' : v < 12 ? 'morning' : v < 17 ? 'afternoon' : 'evening'; };
      const big = worst >= 0.2, wdT = t => `${wday(t)}\u00a0${fmtHM(new Date(t))}`, oname = o => (o === 25 ? 'West' : 'East');
      const atNow = isNowHour(), oh = pOther(h); // a picked or hovered hour: the panel describes that hour, not now
      $('outl').innerHTML = !atNow && isNight(h) ? 'No scheduled flights 23:00 to 05:00' : !atNow ? `${pct(h.p25 >= 0.5 ? h.p25 : 1 - h.p25)} ${h.p25 >= 0.5 ? 'West' : 'East'} this hour` // the switch chance is the row below
        : j >= 0 ? T.out_expected.replace('{to}', oname(h.od === 25 ? 7 : 25)).replace('{t}', `<span class="nw">${new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(hs[j].t))}</span>`) + (hs.length - 1 - j <= 1 ? (T.out_edge || '') : '') : big ? T.out_possible.replace('{p}', pct(worst)).replace('{to}', oname(h.od === 25 ? 7 : 25)).replace('{when}', (hs.length - 1 - wq <= 2 ? T.out_when_end : T.out_when_mid).replace('{t}', wdT(hs[wq].t))) /* siteui.COPY, shared with the dashboard */ : T.out_none; // the model's own 48 h number (p_change_48h)
      const disagree = dis.length && j < 0 && !big && (atNow || dis.includes(state.hour)); // the official line only while the shown hour is inside its window
      $('disl').hidden = !disagree;
      $('outl').title = state.run.p_change === null || state.run.p_change === undefined ? '' : `Calibrated chance of any switch in 48 h: ${pct(state.run.p_change)}\nThe hourly bars are uncalibrated model probabilities.`;
      if (!dis.length) $('disl').innerHTML = ''; else { const part2 = t => { const v = hh(t); return v >= 23 || v < 5 ? 'night' : v < 11 ? 'morning' : v < 14 ? 'midday' : v < 17 ? 'afternoon' : 'evening'; };
        const a = hs[dis[0]].t, b = new Date(Date.parse(hs[dis[dis.length - 1]].t) + 36e5).toISOString(), e = new Date(Date.parse(b) - 36e5), sameNight = wday(e) === wday(a) || (Date.parse(b) - Date.parse(a) <= 18 * 36e5 && hh(e) < 5);
        const when = sameNight ? `${wday(a)}\u00a0${part2(a)}` : `from ${wday(a)}\u00a0${part2(a)} to ${wday(b)}\u00a0${part2(b)}`; // the dashboard's words (siteui.COPY.disagree)
        $('disl').innerHTML = disagree ? (T.disagree || '{of} warns of a switch {when}; we don\'t expect one.').replace('{of}', `<span class="ofn">${T.of_name || 'The official forecast'}</span>`).replace('{when}', when) : ''; }
    }
    { // one line: the peak ahead (now) or the shown hour's chance, with a small bar on the timeline's scale
      const oh = pOther(h), v = isNowHour() ? worst : oh, sc = DOCK.sc ? DOCK.sc.top : 0.2, bar = `<i class="swb"><i style="width:${(Math.min(1, v / sc) * 100).toFixed(0)}%"></i></i>`;
      $('dir-next').innerHTML = false && j >= 0 && isNowHour() ? /* the outlook already names the switch time: no repeat */ `<div class="kv"><span>${T.nextsw}</span><b>to ${h.od === 25 ? '07' : '25'}, ${wk.format(new Date(hs[j].t))}</b></div>`
        : isNowHour() ? `<div class="kv" title="The operating hour (outside the 23:00 to 05:00 night ban) with the highest chance of ${OTHER}, to ${end}. The 48 h figure above is calibrated on past switches from the highest hourly chance, so it can be lower."><span>${T.switch} ${OTHER}</span><b>${worstOp < 0.01 ? 'Under 1\u202f% every hour' : T.peak_by.replace('{p}', pct(worstOp)).replace('{t}', peakNote(worstOp, hs[wqOp < 0 ? wq : wqOp].t).replace(/^.* at /, ''))}</b></div>`
        : `<div class="kv"><span>${T.switch} ${OTHER}</span><b>${pct(oh)} at ${fmtHM(new Date(h.t))}</b></div>`; }
    { // phones: a compact answer card (the plate and headline, the outlook, the accuracy)
      const Rq = ((window.FRA_QUALITY || {}).od25 || []).filter(r => r.acc !== null && r.acc !== undefined), pc = v => Math.round(v * 100), rg = a => (Math.min(...a) === Math.max(...a) ? `${Math.min(...a)}` : `${Math.min(...a)}–${Math.max(...a)}`);
      const since = window.FRA_SINCE ? `since ${fmtDay.format(new Date(window.FRA_SINCE))}, ${fmtHM(new Date(window.FRA_SINCE))}${heldFor()}` : ''; // the kicker as on every other page and width // the dashboard phone's order: eyebrow, answer, outlook, proof, problem, official warning
      $('sumbar').innerHTML = `<div class="sb0">${!isNowHour() ? `Frankfurt · <span class="nw">forecast for ${new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short' }).format(new Date(h.t))} ${fmtHM(new Date(h.t))}</span>` : `${T.now}${since ? ` · <span class="nw">${since}</span>` : ''}`}</div><div class="sb1${!isNowHour() && isNight(h) ? ' nbh' : ''}"><b class="dbadge" style="--dc:${h.od === 25 ? HEX.west : HEX.east}" data-d="${h.od === 25 ? '25' : '07'}">${h.od === 25 ? '25' : '07'}</b><span class="nw">${isNowHour() ? `flies ${h.od === 25 ? 'West' : 'East'}\u00a0${ARROW_SVG2(h.od === 25 ? 'w' : 'e')}` : (/^\d\d (.*)$/.exec(heroWord || '') || [0, ''])[1]}</span></div><div class="sb2">${$('outl').innerHTML.replace(/ expected (<span class="nw">)/, ' · $1')}</div>`
        + `<details class="sbx"${app.classList.contains('sbopen') ? ' open' : ''}><summary>Details</summary>` + (Rq.length ? `<div class="sb3">Right <b>${rg(Rq.map(r => pc(r.acc)))}\u202f%</b> of hours · official <em>${rg(Rq.map(r => pc(r.prog)))}\u202f%</em></div>` : '')
        + `<div class="sb4">The direction switches at short notice when the wind turns, so airlines and ground crews can't plan for it.</div>${$('disl').hidden ? '' : `<div class="sb5">${$('disl').innerHTML}</div>`}</details>`;
      { const sm = $('sumbar').querySelector('.sbx>summary'), o2 = $('sumbar').querySelector('.sb1'); if (sm && o2) { const o0 = $('sumbar').querySelector('.sb0'); sm.style.top = `${Math.max(o2.offsetTop + (o2.offsetHeight - (sm.offsetHeight || 24)) / 2, o0 ? o0.offsetTop + o0.offsetHeight + 2 : 0)}px`; } } // Details sits on the headline row, right-aligned, never on the kicker line; the outlook runs full width
      { const d = $('sumbar').querySelector('.sbx'); if (d) d.ontoggle = () => { app.classList.toggle('sbopen', d.open); requestAnimationFrame(resize); }; } // phones: proof, problem and the official line behind a toggle, so the map keeps its room
    }
    $('how-pg').textContent = dis.length ? ` The official forecast flags ${fmtBub.format(new Date(hs[dis[0]].t))} to ${fmtHM(new Date(new Date(hs[dis[dis.length - 1]].t).getTime() + 36e5))} as a possible switch (orange bracket on the timeline).`
      : hs.some(x => x.pg !== undefined) ? ' The official forecast agrees with ours for this run.' : '';
    GHOST = j >= 0 || worst >= 0.2; /* only when the outlook names a switch (expected or possible) */ // the alternative paths only when our own switch risk is real
    drawPgMark(); // an orange bracket above the strip where INAA flags a possible switch
  }

  { // a fact for now, a chance for a forecast hour, never both in one phrase
    const day = state.run.hours.slice(liveMode ? 0 : state.hour), worst = Math.max(...day.map(x => 1 - x.p18));
    const wk = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }) /* "Fri 6 Nov, 07:00": the dashboard's closure range */, c0 = day.findIndex(x => x.p18 < 0.5); let c1 = c0; while (c0 >= 0 && c1 + 1 < day.length && day[c1 + 1].p18 < 0.5) c1++; // the first forecast closure ahead (the dashboard's rule: closed below 50 % open)
    const TR = window.FRA_TRAFFIC, fraH = t => +new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', hourCycle: 'h23' }).format(new Date(t));
    const moved = TR && c0 >= 0 ? Math.max(...day.slice(c0, c1 + 1).map(x => Math.round(TR.perHour[fraH(x.t)] / 2 * (TR.share18 || 0)))) : 0; // the dashboard's figure: the most departures an hour that move
    // the current hour (as on the dashboard, siteui.COPY.r18_*): the next closure is the value, a hollow ring while it is
    // scheduled, a filled dot while it is in effect; the date, the routine state and what it moves are the lines under it
    const wd0 = t => new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short' }).format(new Date(t)), dk = t => new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(t));
    let big = '', lines = [], st = 'hour';
    if (isNowHour()) {
      const mv = (moved > 0 ? T.r18_moves : T.r18_moves0).replace('{n}', moved);
      if (c0 < 0) { st = 'none'; big = T.r18_open.replace('{n}', day.length); // the dashboard's lines: the highest daytime closure chance, what it carries at the busiest
        const dd = day.filter(x => !isNight(x)), wd = dd.length ? Math.max(...dd.map(x => 1 - x.p18)) : 0, most = TR && dd.length ? Math.max(...dd.map(x => Math.round(TR.perHour[fraH(x.t)] / 2 * (TR.share18 || 0)))) : 0;
        lines = [T.r18_open_max.replace('{p}', pct(wd)), ...(most > 0 ? [T.r18_carries.replace('{n}', most)] : [])]; }
      else { const s0 = day[c0].t, e0 = Date.parse(day[c1].t) + 36e5;
        if (c0 === 0) { st = 'now'; big = T.r18_until.replace('{b}', dk(e0) === dk(Date.now()) ? fmtHM(new Date(e0)) : `${wd0(e0)} ${fmtHM(new Date(e0))}`); lines = [mv]; }
        else { st = 'sched'; const iso = t => dk(t).split('/').reverse().join('-'), nd = Math.round((Date.parse(iso(s0)) - Date.parse(iso(Date.now()))) / 864e5);
          // the quiet line (the dashboard's rule): the relative day, the at-risk hours next to the closure in the lane as the "at risk" range, the routine state
          const risk = x => x.p18 >= 0.5 && x.p18 < 0.9 && !isNight(x); let a2 = c0, b2 = c1; while (a2 - 1 > 0 && risk(day[a2 - 1])) a2--; while (b2 + 1 < day.length && risk(day[b2 + 1])) b2++;
          const sA = day[a2].t, eB = Date.parse(day[b2].t) + 36e5, may = a2 < c0 || b2 > c1 ? T.r18_may.replace('{a}', fmtHM(new Date(sA))).replace('{b}', dk(eB) === dk(sA) ? fmtHM(new Date(eB)) : `${wd0(eB)} ${fmtHM(new Date(eB))}`) : '';
          big = T.r18_closes.replace('{date}', fmtDay.format(new Date(s0))).replace('{a}', fmtHM(new Date(s0))).replace('{b}', dk(e0) === dk(s0) ? fmtHM(new Date(e0)) : `${wd0(e0)} ${fmtHM(new Date(e0))}`); lines = [[T.r18_rel[Math.min(nd, 2)].replace('{n}', nd), may, T.r18_date].filter(Boolean).join(' · '), mv]; } } }
    $('r18-v').dataset.state = st;
    $('r18-v').innerHTML = st !== 'hour' ? `<span class="badge r18b">${st === 'none' ? '' : `<i class="r18d${st === 'sched' ? ' ring' : ''}" aria-hidden="true"></i>`}${big}</span>`
      : isNight(h) ? '<span class="badge nb">Night ban</span>' : `<span class="badge${r18 ? '' : ' closed'}">${r18 ? `${(window.FRA_STYLE || {}).check || ''}In use` : 'Closed'}</span>`; // a forecast hour: its own state; the night ban: no take-offs, so no status
    $('r18-s').innerHTML = lines.map((t, k) => `<span class="${k === lines.length - 1 && (st !== 'none' || k) ? 'r18i' : 'r18w'}">${t}</span>`).join(''); $('r18-s').classList.toggle('r18is', lines.length > 0); $('r18-v').title = r18 ? `Closure chance to the end of the forecast: at most ${pct(worst)} in any hour` : 'Its take-offs use the Centre runway';
  }

  if (h.ws !== undefined) {
    setWind(h.wd, h.ws);
    const ws = Math.round(h.ws), comp = hdg => -h.ws * Math.cos((h.wd - hdg) * Math.PI / 180); // + = tailwind, from the unrounded speed (as on the dashboard), rounded only when shown
    const wg = Math.round(h.wg), gust = hdg => -wg * Math.cos((h.wd - hdg) * Math.PI / 180);
    const word0 = v => `${v >= 0 ? 'tailwind' : 'headwind'} ${Math.round(Math.abs(v))}\u202fkt`;
    const word = (v, hdg = null) => { const g = hdg === null ? null : gust(hdg); return word0(v) + (g !== null && wg > ws + 2 && Math.round(Math.abs(g)) !== Math.round(Math.abs(v)) ? `, gusts ${Math.round(Math.abs(g))}` : ''); };
    const from = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'][Math.round(h.wd / 45) % 8];
    const cmp = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(h.wd / 45) % 8];
    $('wind-t').textContent = isNowHour() ? `${T.wind} now` : `${T.wind} at ${fmtHM(new Date(h.t))}`; // its basis named: the current hour or the shown one
    // the compass wind stays a quiet line under the value at every width: the label column carries the row's name only
    { const tI = Math.round(comp(HDG[od])); $('wind-v').innerHTML = `${tI > 0 ? 'tailwind' : 'headwind'} ${Math.abs(tI)}\u202fkt on ${west ? 25 : '07'}`; } // one wind order on both pages: "headwind 5 kt", as in the timeline readouts
    windInd.el.innerHTML = `<svg viewBox="0 0 24 24" style="--a:${h.wd + 180}deg"><path d="M12 21V4M6 10l6-6 6 6"/></svg><span><b>${ws}\u202fkt ${['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(h.wd / 45) % 8]}</b></span>`; // the arrow: just the speed and where it comes from; the full line is in the panel
    $('windchip').innerHTML = windInd.el.innerHTML;
    LAST_WD = h.wd;
     // phones: the wind in the summary bar, turned with the view
    $('wcomp').innerHTML = `<svg viewBox="0 0 24 24" style="--a:${h.wd + 180}deg"><path d="M12 21V4M6 10l6-6 6 6"/></svg>` // the arrow is drawn pointing south: rotating by the FROM direction makes it point downwind;
    const t25 = Math.round(-ws * Math.cos((h.wd - HDG[25]) * Math.PI / 180)); // + = tailwind for westbound
    const tIn = Math.round(comp(HDG[od]));
    $('wind-why').textContent = `from ${cmp} · ${String(Math.round(h.wd)).padStart(3, '0')}°`; /* the direction only: the speed that matters is the value above */ $('wind-why').title = 'The official rule switches direction when the tailwind stays above 1 kt for 30 minutes, or at once from 10 kt';
    const xw = Math.round(Math.abs(h.ws * Math.sin((h.wd - HDG[od]) * Math.PI / 180)));
    $('wind-s').innerHTML = ''; { const pw = $('pdetw'); if (pw) pw.innerHTML = `<b>Wind per runway</b><br>${String(h.wd).padStart(3, '0')}°, gusts ${Math.round(h.wg)}\u202fkt<br>`
      + `${west ? 25 : '07'}: ${word(comp(HDG[od]), HDG[od])}, crosswind ${xw}\u202fkt<br>18: ${word(comp(HDG[18]), HDG[18])}`; } // inside Details: one disclosure at the bottom
  } else {
    setWind(0, 0);
    windInd.el.innerHTML = ''; $('windchip').innerHTML = '';
    $('wind-v').textContent = 'n/a';
    $('wind-s').textContent = 'No wind forecast for this run';
  }

  for (const rw of Object.values(RW)) {
    const f = flow(rw, od), u = rw.mat.uniforms;
    const closed = rw.key === 'r18' && !r18;
    rw.target = { active: closed ? 0 : 1, closed: closed ? 1 : 0 };
    u.uDir.value = f.startIsA ? 1 : -1;
    u.uCol.value.set(odCol); // every runway in use in the direction colour
    const arr = rw.key === 'nw' || rw.key === 'south';
    const [la, lb] = rwLabels[rw.key];
    const startLbl = f.startIsA ? la : lb, endLbl = f.startIsA ? lb : la;
    const des = p => rw.key === 'r18' ? '18' : (p[0] < (p === rw.A ? rw.B : rw.A)[0] ? rw.d07 : rw.d25);
    const startP = f.startIsA ? rw.A : rw.B, endP = f.startIsA ? rw.B : rw.A;
    const chip = closed ? '<em class="chip closed">Closed</em>' : '';
    startLbl.el.innerHTML = `<b>${des(startP)}</b>${chip}`; startLbl.w = 0;
    endLbl.el.innerHTML = ''; // only the designator in use is named
  }
  const act = new THREE.Vector4(), arrEnd = new THREE.Vector4(-1, -1, -1, -1);
  for (const rw of Object.values(RW)) {
    act.setComponent(rw.i, rw.key === 'r18' && !r18 ? 0 : 1);
    if (rw.key === 'nw' || rw.key === 'south') arrEnd.setComponent(rw.i, flow(rw, od).startIsA ? 0 : 1);
  }
  lightMat.uniforms.uAct.value.copy(act);
  lightMat.uniforms.uArr.value.copy(arrEnd);
  if (!view.card && !BARE && od !== homeOd) { homeOd = od; fitHome(); if (!camTouched) flyHome(); }
  configureFlights(state.cur, clock.elapsedTime, changed && force);
  NIGHT = !isNowHour() && isNight(h); drawPaths(od, r18);
  renderLiveBadge();
  {
    const dot = c => `<i style="background:${c}"></i>`;
    $('caption').innerHTML = `<span><b>${fmtRun.format(new Date(h.t))}</b><small>+${state.hour + 1}\u202fh</small></span>`
      + `<span>${dot(odCol)}<b>${west ? '25' : '07'} ${west ? 'Westbound' : 'Eastbound'}</b><small>${pct(pOd)}</small></span>`
      + `<span>${dot(r18 ? 'var(--label3)' : HEX.closed)}<b>Runway 18 ${r18 ? 'usable' : 'closed'}</b><small>${pct(r18 ? h.p18 : 1 - h.p18)}</small></span>`
;
  }
}

// ---- camera: springs from the current view; any touch on the map hands control back immediately
const camPos = new Spring3({ damping: 1, response: 1.2 }), camTgt = new Spring3({ damping: 1, response: 1.2 });
let camMode = 'free'; // free | fly | follow
function setCamMode(m) {
  if (m !== 'free' && camMode === 'free') { camPos.jump(camera.position); camTgt.jump(controls.target); }
  camMode = m;
  state.follow = m === 'follow';
  $('b-follow').setAttribute('aria-pressed', state.follow);
  controls.autoRotate = state.orbit && m === 'free';
}
function flyHome() {
  setCamMode('fly');
  const h = home();
  camPos.to(h.pos, { damping: 1, response: 1.2 });
  camTgt.to(h.target, { damping: 1, response: 1.2 });
  if (RM.matches) { camPos.jump(h.pos); camTgt.jump(h.target); }
}
$('b-home').onclick = flyHome;
$('b-follow').onclick = () => (state.follow ? flyHome() : setCamMode('follow'));
let orbitResume = 0;
controls.addEventListener('start', () => { camTouched = true; clearTimeout(orbitResume); state.orbit = false; setCamMode('free'); });
RM.addEventListener('change', () => { if (RM.matches) { state.orbit = false; setCamMode(camMode); } });

// ---- theme
function setTheme(t, persist) {
  theme = t;
  HEX = PALETTES[t];
  C = Object.fromEntries(Object.entries(HEX).map(([k, v]) => [k, new THREE.Color(v)]));
  app.classList.toggle('light', t === 'light');
  for (const [k, v] of Object.entries(HEX)) app.style.setProperty('--' + k, v);
  { const TB = (window.FRA_STYLE || {}).tag_bg; if (TB) { app.style.setProperty('--tagbg', t === 'light' ? TB.light : TB.dark); app.style.setProperty('--tagink', t === 'light' ? TB.ink_light : TB.ink_dark); } } // the official tag: the dashboard's colour
  app.style.setProperty('--bg', LOOK[t].bg);
  scene.background.set(LOOK[t].bg);
  scene.fog.color.set(LOOK[t].bg);
  applyThemed();
  for (const rw of Object.values(RW)) rw.mat.uniforms.uLight.value = t === 'light' ? 1 : 0;
  document.querySelectorAll('.dir .dbadge').forEach(b => b.style.setProperty('--dc', b.textContent === '25' ? HEX.west : HEX.east)); // the plate in this theme's direction colour
  lightMat.uniforms.uLight.value = t === 'light' ? 1 : 0;
  lightMat.blending = t === 'light' ? NB : AB;
  lightMat.needsUpdate = true;
  tuneBloom();
  if (typeof gridVis === 'function') gridVis();
  if (document.documentElement.dataset.theme !== t) document.documentElement.dataset.theme = t;
  if (persist) try { localStorage.setItem('fra-theme', t); } catch { /* storage blocked */ }
  if (persist && window.parent !== window) window.parent.postMessage({ fra: 'theme-changed', value: t }, '*');
  if (state.run) { setRun(state.run.source, true); }
}
new MutationObserver(() => { const t = document.documentElement.dataset.theme; if ((t === 'dark' || t === 'light') && t !== theme) setTheme(t); })
  .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// ---- full screen: a dashboard card expands into the complete view and returns to the card on exit
function setCardMode(on) {
  view.card = on;
  document.body.classList.toggle('card', on);
  document.body.classList.toggle('embed', EMBED && on);
  tuneBloom();
  resize();
  requestAnimationFrame(() => { syncMode(); drawKnob(); });
  flyHome();
}
function fsElement() { return document.fullscreenElement || document.webkitFullscreenElement; }
let parentFs = false; // the dashboard made this iframe full screen (its own button): leaving goes through the dashboard
$('b-fs').onclick = async () => {
  if (parentFs) { window.parent.postMessage({ fra: 'exit-fs' }, '*'); return; }
  if (fsElement()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
  const req = app.requestFullscreen || app.webkitRequestFullscreen;
  try {
    if (!req) throw new Error('no fullscreen');
    await req.call(app);
  } catch {
    // e.g. iframe without allow="fullscreen": open the standalone page instead
    if (location.protocol === 'file:' || location.protocol.startsWith('http')) {
      window.open(`${location.pathname}?run=${encodeURIComponent(state.run.source)}&theme=${theme}${LH ? '&palette=lh' : ''}`, '_blank');
    }
  }
};
function onFsChange() {
  const fs = !!fsElement() || parentFs;
  $('b-fs').innerHTML = `${fs ? ICON.collapse : ICON.expand}<span>${fs ? 'Exit full screen' : 'Full screen'}</span>`;
  if (CARD0) setCardMode(!fs);
  else document.body.classList.toggle('embed', EMBED && !fs);
}
document.addEventListener('fullscreenchange', onFsChange);
document.addEventListener('webkitfullscreenchange', onFsChange);

// ------------------------------------------------------------------ loop
const clock = new THREE.Clock();
let sim = 0, hourTimer = 0, followed = null;
setTheme(theme);
setRun(Q.get('run') || F.default);
syncMode();
setPlaying(state.playing);
setCamMode('free');
resize();
requestAnimationFrame(() => { syncMode(); drawKnob(); });

const HOUR_S = 3.2;
const roseLetters = [...document.querySelectorAll('#rose b')], roseN = $('rose-n');
const _want = new THREE.Vector3(), _look = new THREE.Vector3();
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.1), now = clock.elapsedTime;
  sim += dt * SIM_SPEED;
  if (state.playing && !scrubbing) {
    hourTimer += dt;
    if (hourTimer > HOUR_S) {
      hourTimer = 0;
      const next = (state.hour + 1) % N();
      setHour(next);
      knobTo(next, next === 0 ? 'jump' : { damping: 1, response: 0.45 });
    }
  }
  stepSprings(dt);
  for (const rw of Object.values(RW)) {
    const u = rw.mat.uniforms, k = 1 - Math.exp(-dt * 3);
    u.uActive.value += ((rw.target?.active ?? 0) - u.uActive.value) * k;
    u.uClosed.value += ((rw.target?.closed ?? 0) - u.uClosed.value) * k;
    u.uTime.value = now;
  }
  lightMat.uniforms.uTime.value = now;
  lightMat.uniforms.uScale.value = app.clientHeight / 1.6;
  flights = flights.filter(f => {
    if (f.dead !== null && now - f.dead > 1.6) { f.dispose(); return false; }
    f.update(sim, now);
    return true;
  });
  for (const [id, p] of planes) {
    if (p.dead !== null && now - p.dead > 1.6) { if (pinned === p) pinned = null; if (hovered === p) hovered = null; p.dispose(); planes.delete(id); continue; }
    p.step(dt, now);
  }
  for (const f of flights) f.obj.visible = false; // simulated traffic is not drawn: only real aircraft (live) are
  for (const f of flights) { f.trail.visible = false; f.line.visible = false; }
  windLines.visible = false; // the streaks read as dust; wind is in the card
  if (!RM.matches) updateWind(dt);

  if (camMode === 'follow') {
    if (pinned && pinned.dead === null) followed = pinned;
    else if (!followed || followed.dead !== null || followed instanceof LivePlane || followed.cur.t > ARR.tTd + ARR.tRoll * 0.6) {
      const live = flights.filter(f => f.dead === null && f.kind === 'arr' && f.cur && f.cur.t < ARR.tTd * 0.8);
      followed = live.filter(f => f.cur.t > ARR.tTd * 0.35).sort((a, b) => a.cur.t - b.cur.t)[0]
        || live.sort((a, b) => b.cur.t - a.cur.t)[0] || followed;
    }
    if (followed?.cur) {
      const p = followed.cur, dx = Math.cos(p.hd), dy = Math.sin(p.hd);
      _want.copy(V(p.x - dx * 900 + dy * 260, p.y - dy * 900 - dx * 260, p.h + 260));
      _look.copy(V(p.x + dx * 1500, p.y + dy * 1500, Math.max(0, p.h - 150)));
      camPos.to(_want, { damping: 1, response: 0.9 });
      camTgt.to(_look, { damping: 1, response: 0.9 });
    }
  }
  if (camMode !== 'free') {
    camPos.step(dt, camera.position);
    camTgt.step(dt, controls.target);
    if (camMode === 'fly' && camPos.resting && camTgt.resting) setCamMode('free');
  }
  controls.update(dt); // dt: the orbit turns at the same speed on 60 and 144 Hz screens
  $('rose').style.opacity = Math.abs(controls.getAzimuthalAngle()) > 0.09 ? 1 : 0; // only when the view is turned away from north up
  {
    const t = controls.target, w = app.clientWidth, h = app.clientHeight;
    _v.copy(t).project(camera);
    const ox = _v.x * w, oy = _v.y * h;
    for (const el of roseLetters) {
      const [ex, ny] = { N: [0, 1], E: [1, 0], S: [0, -1], W: [-1, 0] }[el.dataset.d];
      _v2.set(t.x + ex * 2000, 0, t.z - ny * 2000).project(camera);
      const a = Math.atan2(_v2.y * h - oy, _v2.x * w - ox);
      el.style.transform = `translate(${Math.cos(a) * 22}px, ${-Math.sin(a) * 22}px)`;
      if (el.dataset.d === 'N') roseN.style.transform = `rotate(${90 - a * 180 / Math.PI}deg)`;
    }
  }
  composer.render();
  panelRects();
  { // flight paths sampled on screen, for the town labels to steer clear of
    const w = app.clientWidth, h = app.clientHeight; PATH_PTS = [];
    for (const [a, b] of PATHS) for (let k = 0; k <= 160; k++) { _v.copy(V(a[0] + (b[0] - a[0]) * k / 160, a[1] + (b[1] - a[1]) * k / 160, 0)).project(camera); PATH_PTS.push([(_v.x + 1) / 2 * w, (1 - _v.y) / 2 * h]); }
  }
  updateLabels();
  {
    const w = app.clientWidth, h = app.clientHeight;
    { // flight tags: never on top of each other or of a panel (pinned / hovered first, then the lowest aircraft)
      const keep = PANEL_RECTS.slice();
      const cand = [];
      for (const p of planes.values()) { const c = p.drawTag(w, h); if (c) cand.push(c); }
      cand.sort((a, b) => a.pri - b.pri || (a.p.pos[2] - b.p.pos[2]));
      const hit = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
      for (const c of cand) {
        if (c.pri && keep.some(k => hit(c.r, k))) { c.p.tag.style.display = 'none'; continue; }
        keep.push(c.r);
      }
    }
    const tipFor = hovered || pinned, tip = $('actip');
    if (tipFor && (tipFor.dead === null) && (liveMode === (tipFor instanceof LivePlane))) {
      _v.copy(tipFor.obj.position).project(camera);
      tip.hidden = false;
      const html = tipText(tipFor);
      if (tip.dataset.k !== html) { tip.innerHTML = html; tip.dataset.k = html; }
      const x = (_v.x + 1) / 2 * w, y = (1 - _v.y) / 2 * h;
      const tw = tip.offsetWidth, th = tip.offsetHeight, hit = r => PANEL_RECTS.some(k => r[0] < k[2] && k[0] < r[2] && r[1] < k[3] && k[1] < r[3]);
      const spots = [[x + 18, y - th - 18], [x - tw - 18, y - th - 18], [x + 18, y + 18], [x - tw - 18, y + 18]]
        .map(([a, b]) => [Math.min(w - tw - 8, Math.max(8, a)), Math.min(h - th - 8, Math.max(8, b))]);
      const [tx, ty] = spots.find(([a, b]) => !hit([a, b, a + tw, b + th])) || spots[0];
      tip.style.transform = `translate(${tx}px, ${ty}px)`;
      $('acring').hidden = false; $('acring').style.transform = `translate(${x}px, ${y}px)`;
    } else { tip.hidden = true; $('acring').hidden = true; }
    if (Math.floor(now) !== Math.floor(now - dt)) renderLiveBadge();
  }
});
new ResizeObserver(() => { syncMode(); drawKnob(); }).observe(app);

// the dashboard drives the hour: postMessage({ fra: 'hour', i }) / ({ fra: 'run', name })
addEventListener('message', e => {
  const m = e.data;
  if (!m || typeof m !== 'object' || !m.fra) return;
  if (m.fra === 'hour') { setPlaying(false); setHour(m.i); knobTo(state.hour, { damping: 1, response: 0.3 }); }
  if (m.fra === 'run') setRun(m.name);
  if (m.fra === 'view') { // { live: true } = real aircraft now; { live: false, t, od, r18 } = a forecast hour, simulated traffic
    setPlaying(false);
    wantLive = !!m.live; liveMode = wantLive && !!liveData && !feedOffline();
    state.ovOd = m.od ? String(m.od) : ''; state.ovR18 = m.r18 === undefined || m.r18 === null ? '' : m.r18 ? '1' : '0';
    let i = curIdx();
    if (m.t && state.run) {
      const t = Date.parse(m.t), hs = state.run.hours;
      i = hs.reduce((b, h, k) => (Math.abs(Date.parse(h.t) - t) < Math.abs(Date.parse(hs[b].t) - t) ? k : b), 0);
    }
    setHour(i, true); knobTo(i, 'jump'); syncMode();
  }
  if (m.fra === 'override') {
    state.ovOd = m.od ? String(m.od) : ''; state.ovR18 = m.r18 === undefined || m.r18 === null ? '' : m.r18 ? '1' : '0';
    syncMode(); setHour(state.hour);
  }
  if (m.fra === 'pad') {
    for (const k of ['top', 'right', 'bottom', 'left']) { pad[k] = +m[k] || 0; app.style.setProperty(`--pad-${k[0]}`, `${pad[k]}px`); }
    resize();
  }
  if (m.fra === 'fs') { parentFs = !!m.on; onFsChange(); }
  if (m.fra === 'theme' && (m.value === 'light' || m.value === 'dark') && m.value !== theme) setTheme(m.value);
  if (m.fra === 'tz' && typeof m.value === 'string' && m.value !== TZ) setTz(m.value);
});
function setTz(v) { // Local (Frankfurt) or UTC, from the top bar or the dashboard
  TZ = v;
  makeFormats();
  for (const r of F.runs) $('run').querySelector(`option[value="${r.source}"]`).textContent = fmtRun.format(new Date(r.issue));
  setRun(state.run.source, true);
  document.querySelectorAll('.ptz button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === TZ));
  try { localStorage.setItem('fra-tz', TZ === 'UTC' ? 'utc' : 'local'); } catch { /* storage blocked */ }
}
$('b-thm').onclick = () => setTheme(theme === 'light' ? 'dark' : 'light', true);
const thmLabel = () => { const t = 'Light / dark theme'; $('b-thm').title = t; $('b-thm').setAttribute('aria-label', t); }; // one name on both pages
thmLabel(); new MutationObserver(thmLabel).observe(app, { attributes: true, attributeFilter: ['class'] });
try { if (innerWidth >= 480) $('tzl3').textContent = `Local (${new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', timeZoneName: 'short' }).formatToParts(new Date()).find(p => p.type === 'timeZoneName').value})`; } catch { /* keep "Local" */ }
document.querySelectorAll('.ptz button').forEach(b => b.addEventListener('click', () => { if (b.dataset.v !== TZ) setTz(b.dataset.v); }));
try { if (!EMBED && localStorage.getItem('fra-tz') === 'utc') setTz('UTC'); } catch { /* storage blocked */ }
if (window.parent !== window) window.parent.postMessage({ fra: 'ready' }, '*');

window.__fra = {
  wind: setWind,
  setHour(i) { setHour(i); knobTo(i, 'jump'); }, setRun, state, camera, controls, RW, flights: () => flights, setPlaying,
  setOverride(od, r18) { state.ovOd = od ?? ''; state.ovR18 = r18 ?? ''; syncMode(); setHour(state.hour); },
  follow() { setCamMode('follow'); },
  setTheme, setCardMode, planes: () => planes,
  rwScreen() { // each runway's ends on screen, with its designators (check.mjs: every tag sits nearest its own runway)
    const w = app.clientWidth, h = app.clientHeight, v = new THREE.Vector3(), ar = app.getBoundingClientRect(), p = q => { v.copy(V(q[0], q[1], 0)).project(camera); return [ar.left + (v.x + 1) / 2 * w, ar.top + (1 - v.y) / 2 * h]; };
    return Object.values(RW).map(r => { const a = p(r.A), b = p(r.B); return [[r.d07, r.d25], a, b, 170 * Math.hypot(b[0] - a[0], b[1] - a[1]) / r.len]; }); // [3]: the strip's half width in px
  },
  depTips() { // the take-off arrows' tips on screen and the free viewport (check.mjs)
    const w = app.clientWidth, h = app.clientHeight, v = new THREE.Vector3(), F = freeArea;
    return { tips: (lastSegs || []).filter(g => g.kind === 'dep').map(g => { v.copy(V(g.b[0], g.b[1], 0)).project(camera); return [(v.x + 1) / 2 * w, (1 - v.y) / 2 * h]; }), free: [F.left, F.top, w - F.right, h - F.bottom] };
  },
  fitStats() { // the framed box (airport + towns) on screen against the free rect: fill on each side and the centre offset
    const w = app.clientWidth, h = app.clientHeight, v = new THREE.Vector3(), sp = FIT_PTS.map(p => { v.copy(V(p[0], p[1], 0)).project(camera); return [(v.x + 1) / 2 * w, (1 - v.y) / 2 * h]; });
    const x0 = Math.min(...sp.map(q => q[0])), x1 = Math.max(...sp.map(q => q[0])), y0 = Math.min(...sp.map(q => q[1])), y1 = Math.max(...sp.map(q => q[1])), F = freeArea, fw = w - F.left - F.right, fh = h - F.top - F.bottom;
    const rp = Object.values(RW).flatMap(r => [r.A, r.B]).map(p => { v.copy(V(p[0], p[1], 0)).project(camera); return [(v.x + 1) / 2 * w, (1 - v.y) / 2 * h]; }); return { rwW: +((Math.max(...rp.map(q => q[0])) - Math.min(...rp.map(q => q[0]))) / fw).toFixed(2), rwH: +((Math.max(...rp.map(q => q[1])) - Math.min(...rp.map(q => q[1]))) / fh).toFixed(2), fillW: +((x1 - x0) / fw).toFixed(2), fillH: +((y1 - y0) / fh).toFixed(2), offX: +(((x0 + x1) / 2 - (F.left + fw / 2)) / fw).toFixed(3), offY: +(((y0 + y1) / 2 - (F.top + fh / 2)) / fh).toFixed(3) };
  }, live: () => ({ liveMode, wantLive, n: planes.size, gen: liveData?.generated }),
  ghost(show) { // the "if switched" dashes: shown or hidden, and points along them on screen (check.mjs measures their contrast on the map)
    const w = app.clientWidth, h = app.clientHeight, v = new THREE.Vector3(), out = []; pathGroup.children.forEach(m => { if (m.ghost) m.visible = show; });
    for (const g of (lastSegs || []).filter(q => q.kind === 'ghost')) for (const f of [0.15, 0.25, 0.35]) { const a = g.a || g.p?.[0], b = g.b || g.p?.[g.p.length - 1]; if (!a || !b) continue; v.copy(V(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, 0)).project(camera); out.push([(v.x + 1) / 2 * w, (1 - v.y) / 2 * h]); }
    return out; },
};
