// Headless check of the generated site: loads a page, reports console errors / page errors, optional screenshot.
//   node ops/check_site.mjs [url-or-path] [screenshot.png] [width] [height]
//   default: file://<repo>/site/index.html ; for the http path run `uv run python -m http.server 8000 --directory site`
//   and pass http://localhost:8000/index.html (then alerts.json / live_record.json polling is exercised too).
// Uses playwright-core from web/node_modules and the chromium in ~/.cache/ms-playwright (see web/shot.mjs).
import { createRequire } from 'module';
import { homedir } from 'os';
import { readdirSync, existsSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(repo, 'web', 'package.json'));
const { chromium } = require('playwright-core');
const [target = path.join(repo, 'site', 'index.html'), shot, vw = '1440', vh = '900'] = process.argv.slice(2);
const url = /^https?:|^file:/.test(target) ? target : pathToFileURL(path.resolve(target)).href;
const pw = path.join(homedir(), '.cache', 'ms-playwright');
const dir = readdirSync(pw).filter(d => /^chromium-\d+$/.test(d)).sort().pop();
const exe = path.join(pw, dir, 'chrome-linux64', 'chrome');
if (!existsSync(exe)) { console.error(`no chromium at ${exe}`); process.exit(2); }

const browser = await chromium.launch({ executablePath: exe, args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: +vw, height: +vh } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
await page.goto(url);
await page.waitForTimeout(3000);
const info = await page.evaluate(() => ({
  title: document.title,
  alerts: document.getElementById('alerts')?.innerText ?? null,
  live: document.getElementById('lrec')?.innerText ?? null,
  od: document.getElementById('odnum')?.innerText ?? null,
  change: document.getElementById('chgval')?.innerText ?? null,
  windLane: document.querySelectorAll('#lwd svg').length,
  progLane: document.querySelectorAll('#lpg .w, #lpg .e, #lpg .m').length,
  scrollH: document.body.scrollHeight, innerH: innerHeight, zoom: document.body.style.zoom,
}));
console.log(JSON.stringify(info, null, 1));
if (shot) await page.screenshot({ path: shot });
await browser.close();
if (errors.length) { console.log(errors.join('\n')); process.exit(1); }
console.log('OK: no JS errors');
