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
  dark: { east: '#c98500', west: '#3987e5', r18: '#c3c2b7', closed: '#d03b3b', arr: '#199e70', dep: '#f0efec', ground: '#8a8984', air: '#5f5e59' },
  light: { east: '#eda100', west: '#2a78d6', r18: '#52514e', closed: '#d03b3b', arr: '#1baf7a', dep: '#0b0b0b', ground: '#8a8984', air: '#b4b2ac' },
};
const PALETTES = MINIMAL; // ?palette=lh kept for old links, same colours
const LOOK = {
  dark: { bg: '#0e0e0d', ground: '#0b0b0a' },
  light: { bg: '#f4f4f2', ground: '#eeeeeb' },
};
// dark = x-ray (additive glow), light = white architectural model; URL > saved choice > system setting
const SYS_DARK = matchMedia('(prefers-color-scheme: dark)');
const THEME_Q = ['dark', 'light'].includes(Q.get('theme')) ? Q.get('theme') : null;
let saved = null;
try { saved = EMBED ? null : localStorage.getItem('fra3d-theme'); } catch { /* storage blocked */ }
let theme = THEME_Q || saved || (SYS_DARK.matches ? 'dark' : 'light');
let HEX = PALETTES[theme];
let C = {};
const NB = THREE.NormalBlending, AB = THREE.AdditiveBlending;
const HDG = { 25: 249, 7: 69, 18: 180 };
const SIM_SPEED = 5; // simulated seconds per real second

// map frame (x east, y north, h up) -> three (x, y up, z south)
const V = (x, y, h = 0) => new THREE.Vector3(x, h, -y);

// ------------------------------------------------------------------ renderer
const style = document.createElement('style');
style.textContent = css();
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
const camera = new THREE.PerspectiveCamera(36, 1, 20, 90000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.47;
controls.minDistance = 300;
controls.maxDistance = 30000;
controls.autoRotateSpeed = 1; // turns per minute (update gets dt): one slow turn a minute

// card: a calm panorama from the south-south-east, runways running across the frame
const HOMES = {
  card: { pos: V(-350, -4300, 2600), target: V(-1000, 150, 0) }, // replaced below: orbits around runway 18 West
  full: { pos: V(-900, -6300, 3700), target: V(-1900, -50, 0) },
  bare: { pos: V(-450, -8300, 5000), target: V(-2050, -300, 0) },
};
const home = () => (view.card ? HOMES.card : BARE ? HOMES.bare : HOMES.full);
camera.position.copy(home().pos);
controls.target.copy(home().target);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.55, 0.3, 0.3);
function tuneBloom() {
  bloom.enabled = theme === 'dark';
  bloom.strength = view.card ? 0.32 : 0.55;
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
  const cx = pad.left + (w - pad.left - pad.right) / 2, cy = pad.top + (h - pad.top - pad.bottom) / 2;
  if (BARE && w && h) camera.setViewOffset(w, h, w / 2 - cx, h / 2 - cy, w, h);
  else camera.clearViewOffset();
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(app);

// ------------------------------------------------------------------ helpers
const ADD = { transparent: true, blending: THREE.AdditiveBlending, depthWrite: false };
let order = 0;
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
grid.material.opacity = 0.45;
grid.material.depthWrite = false;
add(th(grid, { vertexColors: false, color: '#e3e2de', opacity: 0.9 }));
add(th(fill(S.forest, 0, '#121211', 0.9), { color: '#e6e6e2', opacity: 1 }));
add(th(fill(S.water, 0, '#101318', 0.9), { color: '#dfe3e8', opacity: 1 }));
add(th(fill(S.aerodrome, 0, '#151514', 0.85), { color: '#eae9e5', opacity: 1 }));
add(th(lines(S.aerodrome, 0, '#4a4945', 0.35, true), { color: '#cfcdc8', opacity: 0.8, blending: NB }));
add(th(fill(S.aprons, 0, '#1b1b1a', 0.95), { color: '#e0dfdb', opacity: 1 }));
add(th(lines(S.aprons, 0, '#45443f', 0.3, true), { color: '#cbc9c4', opacity: 0.7, blending: NB }));
add(th(ribbon(S.taxiways, 0, '#1f1f1d', 0.95), { color: '#d8d6d1', opacity: 1 }));
add(th(lines(S.taxiways.map(t => t.p), 0, '#5c5b55', 0.35), { color: '#c4c2bc', opacity: 0.6, blending: NB }));
for (const c of [0, 1, 2]) {
  const col = ['#6d6c66', '#4a4945', '#33322f'][c];
  add(th(lines(S.roads.filter(r => r.c === c).map(r => r.p), 0, col, [0.65, 0.5, 0.45][c]),
    { color: ['#c6c4bf', '#d1cfca', '#dddbd6'][c], opacity: 1, blending: NB }));
}
add(th(lines(S.rail, 0.5, '#8a8984', 0.5), { color: '#a3a19b', opacity: 0.85, blending: NB }));

// ------------------------------------------------------------------ buildings (x-ray volumes)
function buildings() {
  const pos = [], col = [], epos = [], ecol = [];
  const base = [0.6, 0.6, 0.58]; // neutral x-ray: white glow, colour is kept for meaning
  const K = { t: 1.2, w: 1.6, h: 0.9, a: 0.8, o: 0.24 };
  for (const b of S.buildings) {
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
    for (const t of THREE.ShapeUtils.triangulateShape(pts, [])) for (const i of t) { pos.push(pts[i].x, hi, -pts[i].y); col.push(...roof); }
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
  darkOnly.push(add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, ...ADD })), 50));
  lightOnly.push(add(new THREE.Mesh(g, new THREE.MeshLambertMaterial({ color: '#fbfbfa', side: THREE.DoubleSide })), 50));
  add(th(new THREE.LineSegments(geom(epos, ecol), new THREE.LineBasicMaterial({ vertexColors: true, ...ADD })),
    { vertexColors: false, color: '#9a9893', opacity: 0.35, blending: NB }), 51);
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
    col = mix(vec3(0.11, 0.11, 0.105), vec3(0.95), clamp(marks * 1.4, 0., 1.));
    float pulse = 0.5 + 0.5 * sin(uTime * 2.4);
    col = mix(col, uCol, clamp(uActive * (0.72 + 0.18 * pulse + edge * 0.9 + chev * 0.95), 0., 1.)); // highlight: whole strip in the flow colour
    vec3 closed = mix(vec3(0.82, 0.62, 0.62), vec3(0.75, 0.04, 0.05), clamp(0.6 * hatch + edge + cross, 0., 1.));
    col = mix(col, closed, uClosed);
  } else {             // x-ray: dark strip, glowing edges and chevrons
    col = vec3(0.045, 0.045, 0.043) + vec3(0.55, 0.55, 0.53) * marks;
    col += uCol * uActive * (0.28 + 0.1 * sin(uTime * 2.4) + edge * 0.7 + chev * 0.9);
    col = mix(col, vec3(0.05, 0.03, 0.03) + vec3(0.9, 0.16, 0.16) * (0.18 * hatch + 0.9 * edge + 0.7 * cross), uClosed);
  }
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`;

const RW = {};
for (const [i, r] of S.runways.entries()) {
  const A = r.p[0], B = r.p[r.p.length - 1];
  const len = Math.hypot(B[0] - A[0], B[1] - A[1]);
  const RW_X = 1.7; // drawn wider than real so the strips read even in the small dashboard card
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
{ // the dashboard card is about runway 18 West: orbit around its middle
  const r = RW.r18, mx = (r.A[0] + r.B[0]) / 2, my = (r.A[1] + r.B[1]) / 2;
  HOMES.card = { pos: V(mx + 800, my - 5600, 3300), target: V(mx, my, 0) };
  if (view.card) { camera.position.copy(HOMES.card.pos); controls.target.copy(HOMES.card.target); }
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
    darkOnly.push(add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: '#8a8984', opacity: 0.1, side: THREE.DoubleSide, ...ADD })), 55));
    lightOnly.push(add(new THREE.Mesh(g, new THREE.MeshLambertMaterial({ color: '#ffffff', side: THREE.DoubleSide })), 55));
    add(th(new THREE.LineSegments(mergeGeometries(edges), new THREE.LineBasicMaterial({ color: '#c3c2b7', opacity: 0.3, ...ADD })),
      { color: '#9a9893', opacity: 0.5, blending: NB }), 56);
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
    this.mat.opacity = (this.light ? 1 : view.card ? 0.35 : 0.3) * al;
    this.emat.opacity = al;
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
  const l = { el, p: V(x, y, h) };
  labels.push(l);
  return l;
}
for (const [name, x, y] of S.places || []) label(name, x, y, 60, 'place');
// orientation: compass letters at the scene edge, landmarks, WEST/EAST along the 07/25 axis, current flow arrow
const ARROW_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
const MID = [-716, 337], AX = [Math.sin(69 * Math.PI / 180), Math.cos(69 * Math.PI / 180)]; // runway system centre, 070° axis
for (const [t, x, y] of [['N', -716, 7300], ['E', 6300, 337], ['S', -716, -6600], ['W', -7700, 337]]) label(t, x, y, 0, 'cmp');
for (const [t, x, y] of [['Frankfurt city ↗', 7980, 8640], ['Taunus hills', -8130, 16000], ['Mainz · Wiesbaden', -14500, -1500], ['Darmstadt', 5700, -15000]]) label(t, x, y, 0, 'landmark');
function axisLabel(text, sign, dist) {
  const l = label(sign > 0 ? `${text}${ARROW_SVG}` : `${ARROW_SVG}${text}`, MID[0] + AX[0] * dist * sign, MID[1] + AX[1] * dist * sign, 0, 'axis');
  l.dir = V(MID[0] + AX[0] * (dist + 600) * sign, MID[1] + AX[1] * (dist + 600) * sign, 0);
  return l;
}
axisLabel('EAST', 1, 3900);
axisLabel('WEST', -1, 4300);
const flowLabel = label('', MID[0], MID[1], 0, 'flow');
const rwLabels = {};
for (const rw of Object.values(RW)) {
  rwLabels[rw.key] = [rw.A, rw.B].map((p, k) => {
    const s = k === 0 ? -1 : 1;
    return label('', p[0] + rw.ux * s * 300, p[1] + rw.uy * s * 300, 10, 'rwy');
  });
}
const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
function updateLabels() {
  const w = app.clientWidth, h = app.clientHeight;
  for (const l of labels) {
    _v.copy(l.p).project(camera);
    if (_v.z > 1 || Math.abs(_v.x) > 1.1 || Math.abs(_v.y) > 1.1) { l.el.style.display = 'none'; continue; }
    l.el.style.display = '';
    l.el.style.transform = `translate(${(_v.x + 1) / 2 * w}px, ${(1 - _v.y) / 2 * h}px) translate(-50%, -50%)`;
    if (l.dir) { // arrows point the way the world direction runs on screen, whatever the camera does
      _v2.copy(l.dir).project(camera);
      l.el.style.setProperty('--a', `${Math.atan2(-(_v2.y - _v.y) * h, (_v2.x - _v.x) * w) * 180 / Math.PI}deg`);
    }
  }
}

// ------------------------------------------------------------------ live traffic (fra.live -> live.json, OpenSky ADS-B)
let liveData = null, liveOk = false, liveSeen = 0, liveMode = false, wantLive = !CALM, lastGen = '';
const planes = new Map();
const PHASE_WORD = { arr: 'arriving', dep: 'departing', ground: 'on ground', low: 'low level', enroute: 'en route' };
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
    this.tag.innerHTML = `<i style="background:${HEX[phaseKey(f)]}"></i>${f.cs || f.id}`;
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
    this.mat.opacity = (theme === 'light' ? 1 : 0.55) * a;
    this.emat.opacity = (theme === 'light' ? 0.35 : 1) * a;
  }
  drawTag(w, h) {
    const vis = liveMode && this.alpha > 0.05 && (this.tagOn || this === pinned || this === hovered);
    if (!vis) { this.tag.style.display = 'none'; return; }
    _v.copy(this.obj.position).project(camera);
    if (_v.z > 1 || Math.abs(_v.x) > 1.05 || Math.abs(_v.y) > 1.05) { this.tag.style.display = 'none'; return; }
    this.tag.style.display = '';
    this.tag.style.opacity = this.alpha;
    this.tag.style.transform = `translate(${(_v.x + 1) / 2 * w}px, ${(1 - _v.y) / 2 * h - 16}px) translate(-50%, -100%)`;
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
function setLive(on) { // Now = real aircraft; any future hour = simulated traffic
  wantLive = on;
  liveMode = on && !!liveData;
  if (liveMode && !CALM) {
    state.ovOd = ''; state.ovR18 = '';
    segOd(state.ovOd); segR18(state.ovR18); setPlaying(false); setHour(0, true); knobTo(0, 'jump');
  } else if (state.run) setHour(state.hour, true);
  renderLiveBadge();
}

function exitLive() { // the user picked a forecast hour or a what-if: simulated traffic from here on
  if (!wantLive && !liveMode) return;
  wantLive = false; liveMode = false;
  state.ovOd = ''; state.ovR18 = ''; segOd(''); segR18('');
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
  needle: '<svg viewBox="0 0 24 24"><g class="needle"><path d="M12 2.6l3.3 9.4H8.7z" fill="#FF453A"/><path d="M12 21.4L8.7 12h6.6z" opacity=".5"/></g></svg>',
  sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.3"/><path d="M12 2.4v2.4M12 19.2v2.4M2.4 12h2.4M19.2 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M5.2 18.8l1.7-1.7M17.1 6.9l1.7-1.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  moon: '<svg viewBox="0 0 24 24"><path d="M20.4 14.7A8.7 8.7 0 0 1 9.3 3.6a8.7 8.7 0 1 0 11.1 11.1z"/></svg>',
  expand: '<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5"/></svg>',
  collapse: '<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M20 10h-6V4M4 14h6v6M14 10l6.5-6.5M10 14l-6.5 6.5"/></svg>',
  chevrons: '<svg viewBox="0 0 12 12"><path d="M3 4.6 6 1.9l3 2.7M3 7.4l3 2.7 3-2.7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
const hud = document.createElement('div');
hud.className = 'hud';
hud.innerHTML = `
  <div class="scrim top"></div><div class="scrim bottom"></div>
  <header class="hero">
    <div class="eyebrow">Frankfurt Airport · operating direction</div>
    <div class="dir" id="dir" aria-live="polite"></div>
    <div class="dir-sub" id="dir-sub"></div>
    <div class="seg" id="seg-od" role="radiogroup" aria-label="What-if operating direction"><i class="thumb"></i>
      <button role="radio" data-v="">Forecast</button><button role="radio" data-v="7">07 east</button><button role="radio" data-v="25">25 west</button></div>
  </header>
  <aside class="panel conditions" aria-label="Conditions">
    <div class="row">
      <div class="row-main"><div class="row-title">Runway 18 West</div><div class="row-value" id="r18-v"></div></div>
      <div class="row-sub" id="r18-s"></div>
      <div class="seg small" id="seg-r18" role="radiogroup" aria-label="What-if runway 18"><i class="thumb"></i>
        <button role="radio" data-v="">Forecast</button><button role="radio" data-v="1">Open</button><button role="radio" data-v="0">Closed</button></div>
    </div>
    <div class="row wind">
      <svg class="compass" viewBox="-22 -22 44 44"><circle r="21"/><line class="axis" x1="-15" y1="0" x2="15" y2="0" transform="rotate(${HDG[7] - 90})"/>
        <text y="-15">N</text><path class="arrow" id="wind-arrow" d="M0 12 L-4.4 4 L-1.3 4 L-1.3 -10 L1.3 -10 L1.3 4 L4.4 4Z"/></svg>
      <div><div class="row-main"><div class="row-title">Wind</div><div class="row-value" id="wind-v"></div></div><div class="row-sub" id="wind-s"></div></div>
    </div>
    <div class="row">
      <div class="row-main"><div class="row-title">Forecast issued</div><label class="menu"><select id="run" aria-label="Forecast run"></select>${ICON.chevrons}</label></div>
    </div>
    <div class="attrib">Map © OpenStreetMap contributors</div>
  </aside>
  <nav class="panel stack" aria-label="View">
    <button class="ib" id="b-home" aria-label="Reset view" title="Reset view">${ICON.needle}</button>
    <button class="ib" id="b-follow" aria-pressed="false" aria-label="Follow an arrival" title="Follow an arrival">${ICON.plane}</button>
    <button class="ib" id="b-orbit" aria-pressed="true" aria-label="Rotate slowly" title="Rotate slowly">${ICON.orbit}</button>
    <button class="ib" id="b-theme" aria-label="Light mode" title="Light mode">${ICON.sun}</button>
    <button class="ib" id="b-fs" aria-label="Full screen" title="Full screen">${ICON.expand}</button>
    <button class="ib" id="b-info" aria-expanded="false" aria-label="Legend" title="Legend">${ICON.info}</button>
  </nav>
  <div class="panel popover" id="legend" role="dialog" aria-label="Legend" hidden>
    <h3>Legend</h3>
    <div class="lg"><i id="lg-od"></i>Active runway, arrows show the flow</div>
    <div class="lg"><i style="background:repeating-linear-gradient(45deg,var(--closed) 0 3px,rgba(255,69,58,.25) 3px 6px)"></i>Runway closed</div>
    <div class="lg"><i style="background:var(--arr);height:3px"></i>Arrivals</div>
    <div class="lg"><i style="background:var(--dep);height:3px"></i>Departures</div>
    <div class="lg"><i style="background:rgba(70,130,255,.3);box-shadow:inset 0 0 0 1px #6fa0ff"></i>Buildings and parked aircraft</div>
    <div class="lg"><i style="background:linear-gradient(90deg,transparent,rgba(160,200,255,.7));height:2px"></i>Forecast wind</div>
    <div class="lg"><div class="src">Timeline: colour = predicted direction, paler = less certain, red marks = RWY 18 closed.<br>
      Map data © OpenStreetMap contributors (ODbL). Wind: ECMWF IFS via Open-Meteo.</div></div>
  </div>
  <div class="panel caption" id="caption" aria-live="polite"></div>
  <div class="panel actip" id="actip" hidden></div>
  <div class="panel aclegend" id="aclegend"></div>
  <button class="panel livebadge" id="livebadge" hidden></button>
  <div class="panel rose" id="rose" aria-hidden="true"><b data-d="N">N</b><b data-d="E">E</b><b data-d="S">S</b><b data-d="W">W</b><i id="rose-n"></i></div>
  <footer class="panel dock">
    <button class="play" id="play" aria-label="Pause">${ICON.pause}</button>
    <div class="scrub">
      <div class="track" id="track" role="slider" tabindex="0" aria-label="Forecast hour" aria-valuemin="1" aria-valuemax="48">
        <div class="segs" id="segs"></div><div class="marks" id="marks"></div>
        <div class="thumb-knob" id="knob"></div>
        <div class="panel bubble" id="bubble"><b id="bub-t"></b><span id="bub-l"></span></div>
      </div>
      <div class="ticks" id="ticks"></div>
    </div>
  </footer>
`;
app.appendChild(hud);
const $ = id => document.getElementById(id);

let fmtRun, fmtBub, fmtH, fmtDay;
function makeFormats() {
  fmtRun = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  fmtBub = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit' });
  fmtH = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hourCycle: 'h23' });
  fmtDay = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', day: 'numeric' });
}
makeFormats();
const pct = p => `${Math.round(p * 100)}%`;

const state = { run: null, hour: 0, playing: !RM.matches && !CALM, orbit: CARD0 || (!RM.matches && !BARE), follow: false, cur: null, ovOd: '', ovR18: '' };
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
const segOd = segmented($('seg-od'), v => { if (liveMode) { wantLive = false; liveMode = false; } state.ovOd = v; setHour(state.hour, true); });
const segR18 = segmented($('seg-r18'), v => { if (liveMode) { wantLive = false; liveMode = false; } state.ovR18 = v; setHour(state.hour, true); });

// ---- hero: the new direction slides in the way the traffic flows (east = right, west = left)
let heroEl = null, heroWord = '';
function setHero(word, color, sign) {
  if (word === heroWord) { heroEl.style.color = theme === 'light' ? '' : color; heroEl.firstChild.style.background = color; return; }
  const box = $('dir'), el = document.createElement('span'), old = heroEl, d = 26 * sign;
  el.innerHTML = `<i style="background:${color}"></i>${word}`;
  el.style.color = theme === 'light' ? '' : color;
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
  const bub = $('bubble'), w = bub.offsetWidth, tw = $('track').clientWidth;
  bub.style.transform = `translateX(${Math.max(-8, Math.min(tw - w + 8, x - w / 2))}px)`;
  const i = Math.max(0, Math.min(N() - 1, Math.round(knob.x)));
  $('bub-t').textContent = liveMode ? 'Now' : fmtBub.format(new Date(state.run.hours[i].t));
  $('bub-l').textContent = liveMode ? 'live aircraft' : `+${i + 1} h`;
  if (scrubbing && i !== state.hour) setHour(i);
}
function knobTo(i, opts) {
  if (opts === 'jump') { knob.jump(i); drawKnob(); return; }
  animate(knob.to(i, opts), drawKnob);
}
function renderLiveBadge() {
  const lg = document.getElementById('aclegend'), lb = document.getElementById('livebadge');
  if (!lg) return;
  const dot = k => `<i style="background:${HEX[k]}"></i>`;
  if (liveMode) {
    const n = [...planes.values()].filter(p => p.dead === null).length, stale = liveAge() > 60;
    lg.innerHTML = `<b class="${stale ? 'stale' : 'on'}">${stale ? 'Stale' : 'Live'}</b><span>${n} aircraft</span><span>${dot('arr')}Arriving</span><span>${dot('dep')}Departing</span><span>${dot('ground')}On ground</span><span>${dot('air')}En route</span>`;
  } else {
    const row = (liveData?.future || []).find(r => state.run && Date.parse(r.t) === Date.parse(state.run.hours[state.hour]?.t));
    lg.innerHTML = `<b class="sim">Simulated</b><span>${row ? `${row.arrivals} arrivals · ${row.departures} departures expected this hour` : 'illustrative traffic'}</span><span>${dot('arr')}Arrival</span><span>${dot('dep')}Departure</span>`;
  }
  if (lb && !CALM) {
    lb.hidden = !liveData;
    if (liveData) {
      const stale = liveAge() > 60;
      lb.className = `panel livebadge ${liveMode ? 'on' : ''} ${stale ? 'stale' : ''}`;
      lb.innerHTML = `<i></i>${stale ? 'Stale' : 'Live'} · ${[...planes.values()].filter(p => p.dead === null).length} aircraft · flown now OD ${liveData.od_live === 25 ? 25 : liveData.od_live === 7 ? '07' : '–'}`;
      lb.title = liveMode ? 'Showing live aircraft' : 'Back to live aircraft';
    }
  }
}
function setPlaying(on) {
  state.playing = on;
  $('play').innerHTML = on ? ICON.pause : ICON.play;
  $('play').setAttribute('aria-label', on ? 'Pause' : 'Play');
  hourTimer = 0;
}
$('play').onclick = () => { exitLive(); setPlaying(!state.playing); };
$('livebadge').onclick = () => setLive(true);
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
    track.setPointerCapture(e.pointerId);
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
    knob.onRest = () => { scrubbing = false; setHour(target); };
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
    hover = null; scrubbing = false;
    if (liveData) { setLive(true); knob.jump(x); knobTo(0, { damping: 1, response: 0.4 }); }
    else { setHour(from); knobTo(from, { damping: 1, response: 0.4 }); }
  };
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || drag || !state.run) return;
    const r = track.getBoundingClientRect(), pad = 24;
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top - pad && e.clientY <= r.bottom + pad;
    if (!inside) return endHover();
    if (!hover) { hover = { from: state.hour }; exitLive(); setPlaying(false); }
    scrubbing = true;
    moving.delete(knob); knob.v = 0; knob.onRest = null;
    knob.jump(Math.max(0, Math.min(N() - 1, (e.clientX - r.left) / (r.width / N()) - 0.5)));
    drawKnob();
  });
  document.documentElement.addEventListener('mouseleave', endHover);
}
addEventListener('keydown', e => {
  if (e.code === 'Space' && !/SELECT|BUTTON/.test(document.activeElement?.tagName)) { e.preventDefault(); setPlaying(!state.playing); }
});

// ---- legend popover: materialises out of its button and goes back into it
{
  const pop = $('legend'), btn = $('b-info'), s = new Spring(0, { damping: 1, response: 0.34 });
  const draw = p => {
    pop.style.opacity = Math.max(0, Math.min(1, p));
    pop.style.transform = `scale(${0.86 + 0.14 * p})`;
    pop.style.filter = `blur(${Math.max(0, (1 - p) * 10)}px)`;
  };
  const open = on => {
    btn.setAttribute('aria-expanded', on);
    if (on) pop.hidden = false;
    animate(s.to(on ? 1 : 0), draw, () => { if (!on) pop.hidden = true; });
  };
  draw(0);
  btn.onclick = () => open(btn.getAttribute('aria-expanded') !== 'true');
  addEventListener('pointerdown', e => {
    if (btn.getAttribute('aria-expanded') === 'true' && !pop.contains(e.target) && !btn.contains(e.target)) open(false);
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') open(false); });
}

// ---- forecast runs and hours
function setRun(name, keepHour) {
  state.run = F.runs.find(r => r.source === name) || F.runs[F.runs.length - 1];
  $('run').value = state.run.source;
  const hs = state.run.hours;
  $('track').setAttribute('aria-valuemax', hs.length);
  $('segs').innerHTML = hs.map(h => {
    const west = h.p25 >= 0.5, cert = Math.abs(h.p25 - 0.5) * 2;
    return `<i style="background:${west ? HEX.west : HEX.east};opacity:${(0.32 + 0.68 * cert).toFixed(2)}"></i>`;
  }).join('');
  $('marks').innerHTML = hs.map(h => `<i style="background:${h.p18 < 0.5 ? HEX.closed : 'transparent'}"></i>`).join('');
  $('ticks').innerHTML = hs.map((h, i) => {
    const d = new Date(h.t), hr = fmtH.format(d), left = ((i + 0.5) / hs.length * 100).toFixed(2);
    if (hr === '00') return `<span class="day" style="left:${left}%">${fmtDay.format(d)}</span>`;
    return ['06', '12', '18'].includes(hr) ? `<span style="left:${left}%">${hr}</span>` : '';
  }).join('');
  const i = keepHour ? Math.min(state.hour, hs.length - 1) : 0;
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

function setHour(i, force) {
  state.hour = Math.max(0, Math.min(N() - 1, i));
  const { h, od, r18 } = stateAt(state.hour);
  const changed = force || !state.cur || state.cur.od !== od || state.cur.r18 !== r18;
  state.cur = { od, r18, t: h.t, live: liveMode };
  $('track').setAttribute('aria-valuenow', state.hour + 1);
  $('track').setAttribute('aria-valuetext', `${fmtBub.format(new Date(h.t))}, ${od === 25 ? 'westbound' : 'eastbound'}`);

  const west = od === 25, odCol = west ? HEX.west : HEX.east;
  const pOd = west ? h.p25 : 1 - h.p25;
  setHero(west ? 'Westbound' : 'Eastbound', odCol, west ? -1 : 1);
  $('dir-sub').innerHTML = liveMode
    ? `<b>Live</b> · flown now <b>OD ${west ? 25 : '07'}</b> · ${[...planes.values()].filter(p => p.dead === null).length} real aircraft`
    : state.ovOd
    ? `What-if <b>OD ${west ? 25 : '07'}</b> · model gives it ${pct(pOd)}`
    : `<b>OD ${west ? 25 : '07'}</b> · ${pct(pOd)} likely · landings from the ${west ? 'east' : 'west'}`;
  $('lg-od').style.background = odCol;

  $('r18-v').innerHTML = `<span style="color:${r18 ? HEX.r18 : HEX.closed}">${r18 ? 'Open' : 'Closed'}</span>`;
  $('r18-s').textContent = state.ovR18 ? `What-if · model gives ${pct(h.p18)} open`
    : `${r18 ? 'Departures to the south' : 'Departures via Centre'} · ${pct(r18 ? h.p18 : 1 - h.p18)} likely`;

  if (h.ws !== undefined) {
    setWind(h.wd, h.ws);
    $('wind-arrow').setAttribute('transform', `rotate(${h.wd})`);
    const comp = hdg => -h.ws * Math.cos((h.wd - hdg) * Math.PI / 180); // + = tailwind
    const word = v => `${v >= 0 ? 'tailwind' : 'headwind'} ${Math.abs(v).toFixed(0)} kt`;
    $('wind-v').innerHTML = `${String(h.wd).padStart(3, '0')}° ${h.ws.toFixed(0)}<small>kt · G${h.wg.toFixed(0)}</small>`;
    $('wind-s').innerHTML = `${west ? 25 : '07'}: ${word(comp(HDG[od]))}<br>18: ${word(comp(HDG[18]))}`;
  } else {
    setWind(0, 0);
    $('wind-v').textContent = '–';
    $('wind-s').textContent = 'No wind forecast for this run';
  }

  for (const rw of Object.values(RW)) {
    const f = flow(rw, od), u = rw.mat.uniforms;
    const closed = rw.key === 'r18' && !r18;
    rw.target = { active: closed ? 0 : 1, closed: closed ? 1 : 0 };
    u.uDir.value = f.startIsA ? 1 : -1;
    u.uCol.value.set(rw.key === 'r18' ? HEX.r18 : odCol);
    const arr = rw.key === 'nw' || rw.key === 'south';
    const [la, lb] = rwLabels[rw.key];
    const startLbl = f.startIsA ? la : lb, endLbl = f.startIsA ? lb : la;
    const des = p => rw.key === 'r18' ? '18' : (p[0] < (p === rw.A ? rw.B : rw.A)[0] ? rw.d07 : rw.d25);
    const startP = f.startIsA ? rw.A : rw.B, endP = f.startIsA ? rw.B : rw.A;
    const chip = closed ? '<em class="chip closed">Closed</em>' : arr ? '<em class="chip arr">Arrivals</em>' : '<em class="chip dep">Departures</em>';
    startLbl.el.innerHTML = `<b>${des(startP)}</b>${chip}<small>${RW_NAMES[rw.key]}</small>`;
    endLbl.el.innerHTML = rw.key === 'r18' ? '' : `<b class="dim">${des(endP)}</b>`;
  }
  const act = new THREE.Vector4(), arrEnd = new THREE.Vector4(-1, -1, -1, -1);
  for (const rw of Object.values(RW)) {
    act.setComponent(rw.i, rw.key === 'r18' && !r18 ? 0 : 1);
    if (rw.key === 'nw' || rw.key === 'south') arrEnd.setComponent(rw.i, flow(rw, od).startIsA ? 0 : 1);
  }
  lightMat.uniforms.uAct.value.copy(act);
  lightMat.uniforms.uArr.value.copy(arrEnd);
  configureFlights(state.cur, clock.elapsedTime, changed && force);
  {
    const dir = west ? -1 : 1;
    flowLabel.dir = V(MID[0] + AX[0] * 900 * dir, MID[1] + AX[1] * 900 * dir, 0);
    flowLabel.el.innerHTML = `<i style="background:${odCol}"></i>Traffic flows ${west ? 'west' : 'east'} · OD ${west ? 25 : '07'}${ARROW_SVG}`;
    flowLabel.el.style.color = '';
  }
  renderLiveBadge();
  {
    const dot = c => `<i style="background:${c}"></i>`;
    $('caption').innerHTML = `<span><b>${fmtRun.format(new Date(h.t))}</b><small>+${state.hour + 1} h</small></span>`
      + `<span>${dot(odCol)}<b>${west ? '25' : '07'} ${west ? 'Westbound' : 'Eastbound'}</b><small>${pct(pOd)}</small></span>`
      + `<span>${dot(r18 ? HEX.r18 : HEX.closed)}<b>RWY 18 ${r18 ? 'usable' : 'closed'}</b><small>${pct(r18 ? h.p18 : 1 - h.p18)}</small></span>`
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
  $('b-orbit').setAttribute('aria-pressed', state.orbit);
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
$('b-orbit').onclick = () => { state.orbit = !state.orbit; setCamMode(camMode === 'follow' ? 'free' : camMode); };
let orbitResume = 0;
controls.addEventListener('start', () => { clearTimeout(orbitResume); state.orbit = false; setCamMode('free'); });
controls.addEventListener('end', () => { // the dashboard card picks up its slow turn again once left alone
  if (view.card) orbitResume = setTimeout(() => { state.orbit = true; setCamMode(camMode === 'follow' ? 'free' : camMode); }, 4000);
});
RM.addEventListener('change', () => { if (RM.matches) { state.orbit = false; setCamMode(camMode); } });

// ---- theme
function setTheme(t, persist) {
  theme = t;
  HEX = PALETTES[t];
  C = Object.fromEntries(Object.entries(HEX).map(([k, v]) => [k, new THREE.Color(v)]));
  app.classList.toggle('light', t === 'light');
  for (const [k, v] of Object.entries(HEX)) app.style.setProperty('--' + k, v);
  app.style.setProperty('--bg', LOOK[t].bg);
  scene.background.set(LOOK[t].bg);
  scene.fog.color.set(LOOK[t].bg);
  applyThemed();
  for (const rw of Object.values(RW)) rw.mat.uniforms.uLight.value = t === 'light' ? 1 : 0;
  lightMat.uniforms.uLight.value = t === 'light' ? 1 : 0;
  lightMat.blending = t === 'light' ? NB : AB;
  lightMat.needsUpdate = true;
  tuneBloom();
  const next = t === 'light' ? 'dark' : 'light';
  $('b-theme').innerHTML = next === 'light' ? ICON.sun : ICON.moon;
  $('b-theme').setAttribute('aria-label', next === 'light' ? 'Light mode' : 'Dark mode');
  $('b-theme').title = $('b-theme').getAttribute('aria-label');
  if (persist) try { localStorage.setItem('fra3d-theme', t); } catch { /* storage blocked */ }
  if (persist && window.parent !== window) window.parent.postMessage({ fra: 'theme-changed', value: t }, '*');
  if (state.run) { setRun(state.run.source, true); }
}
$('b-theme').onclick = () => setTheme(theme === 'light' ? 'dark' : 'light', true);
SYS_DARK.addEventListener('change', e => { if (!THEME_Q && !saved) setTheme(e.matches ? 'dark' : 'light'); });

// ---- full screen: a dashboard card expands into the complete view and returns to the card on exit
function setCardMode(on) {
  view.card = on;
  document.body.classList.toggle('card', on);
  document.body.classList.toggle('embed', EMBED && on);
  tuneBloom();
  resize();
  requestAnimationFrame(() => { segOd(state.ovOd); segR18(state.ovR18); drawKnob(); });
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
  $('b-fs').innerHTML = fs ? ICON.collapse : ICON.expand;
  $('b-fs').setAttribute('aria-label', fs ? 'Exit full screen' : 'Full screen');
  $('b-fs').title = $('b-fs').getAttribute('aria-label');
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
segOd('');
segR18('');
setPlaying(state.playing);
setCamMode('free');
resize();
requestAnimationFrame(() => { segOd(state.ovOd); segR18(state.ovR18); drawKnob(); });

const HOUR_S = 3.2;
const roseLetters = [...document.querySelectorAll('#rose b')], roseN = $('rose-n');
const needle = $('b-home').querySelector('.needle');
needle.style.transformOrigin = '12px 12px';
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
  for (const f of flights) f.obj.visible = !liveMode;
  if (liveMode) for (const f of flights) { f.trail.visible = false; f.line.visible = false; } else for (const f of flights) { f.trail.visible = true; f.line.visible = true; }
  windLines.visible = !RM.matches && !view.card;
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
  needle.style.transform = `rotate(${controls.getAzimuthalAngle() * 180 / Math.PI}deg)`;
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
  updateLabels();
  {
    const w = app.clientWidth, h = app.clientHeight;
    for (const p of planes.values()) p.drawTag(w, h);
    const tipFor = hovered || pinned, tip = $('actip');
    if (tipFor && (tipFor.dead === null) && (liveMode === (tipFor instanceof LivePlane))) {
      _v.copy(tipFor.obj.position).project(camera);
      tip.hidden = false;
      const html = tipText(tipFor);
      if (tip.dataset.k !== html) { tip.innerHTML = html; tip.dataset.k = html; }
      const x = (_v.x + 1) / 2 * w, y = (1 - _v.y) / 2 * h;
      tip.style.transform = `translate(${Math.min(w - tip.offsetWidth - 8, Math.max(8, x + 18))}px, ${Math.max(8, y - tip.offsetHeight - 18)}px)`;
    } else tip.hidden = true;
    if (Math.floor(now) !== Math.floor(now - dt)) renderLiveBadge();
  }
});
new ResizeObserver(() => { segOd(state.ovOd); segR18(state.ovR18); drawKnob(); }).observe(app);

// the dashboard drives the hour: postMessage({ fra: 'hour', i }) / ({ fra: 'run', name })
addEventListener('message', e => {
  const m = e.data;
  if (!m || typeof m !== 'object' || !m.fra) return;
  if (m.fra === 'hour') { setPlaying(false); setHour(m.i); knobTo(state.hour, { damping: 1, response: 0.3 }); }
  if (m.fra === 'run') setRun(m.name);
  if (m.fra === 'view') { // { live: true } = real aircraft now; { live: false, t, od, r18 } = a forecast hour, simulated traffic
    setPlaying(false);
    wantLive = !!m.live; liveMode = wantLive && !!liveData;
    state.ovOd = m.od ? String(m.od) : ''; state.ovR18 = m.r18 === undefined || m.r18 === null ? '' : m.r18 ? '1' : '0';
    let i = 0;
    if (m.t && state.run) {
      const t = Date.parse(m.t), hs = state.run.hours;
      i = hs.reduce((b, h, k) => (Math.abs(Date.parse(h.t) - t) < Math.abs(Date.parse(hs[b].t) - t) ? k : b), 0);
    }
    setHour(i, true); knobTo(i, 'jump');
  }
  if (m.fra === 'override') {
    state.ovOd = m.od ? String(m.od) : ''; state.ovR18 = m.r18 === undefined || m.r18 === null ? '' : m.r18 ? '1' : '0';
    segOd(state.ovOd); segR18(state.ovR18); setHour(state.hour);
  }
  if (m.fra === 'pad') {
    for (const k of ['top', 'right', 'bottom', 'left']) { pad[k] = +m[k] || 0; app.style.setProperty(`--pad-${k[0]}`, `${pad[k]}px`); }
    resize();
  }
  if (m.fra === 'fs') { parentFs = !!m.on; onFsChange(); }
  if (m.fra === 'theme' && (m.value === 'light' || m.value === 'dark') && m.value !== theme) setTheme(m.value);
  if (m.fra === 'tz' && typeof m.value === 'string' && m.value !== TZ) {
    TZ = m.value;
    makeFormats();
    for (const r of F.runs) $('run').querySelector(`option[value="${r.source}"]`).textContent = fmtRun.format(new Date(r.issue));
    setRun(state.run.source, true);
  }
});
if (window.parent !== window) window.parent.postMessage({ fra: 'ready' }, '*');

window.__fra = {
  wind: setWind,
  setHour(i) { setHour(i); knobTo(i, 'jump'); }, setRun, state, camera, controls, RW, flights: () => flights, setPlaying,
  setOverride(od, r18) { state.ovOd = od ?? ''; state.ovR18 = r18 ?? ''; segOd(state.ovOd); segR18(state.ovR18); setHour(state.hour); },
  follow() { setCamMode('follow'); },
  setTheme, setCardMode, planes: () => planes, live: () => ({ liveMode, wantLive, n: planes.size, gen: liveData?.generated }),
};
