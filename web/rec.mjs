// record a short clip of the live 3D page: node rec.mjs outdir
import { chromium } from 'playwright-core';
import { homedir } from 'os';
const [dir = '../.shots/rec'] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || `${homedir()}/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`,
  args: ['--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist'],
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir, size: { width: 1280, height: 720 } } });
const page = await ctx.newPage();
page.on('pageerror', e => console.log('PAGEERROR:', e.message));
await page.goto('file://' + new URL('../site/airport3d.html?run=forecast_20261029T06.csv', import.meta.url).pathname);
await page.evaluate(() => { window.__fra.setHour(15); });
await page.waitForTimeout(9000);                       // orbit + timeline playing into the RWY 18 closure
await page.evaluate(() => window.__fra.setOverride('25', ''));
await page.waitForTimeout(5000);                       // flip to westbound
await page.click('#cam-follow');
await page.waitForTimeout(9000);                       // chase an arrival
await ctx.close();
console.log(await page.video().path());
await browser.close();
