// headless screenshot of site/airport3d.html: node shot.mjs out.png [js to eval before shot] [wait ms]
import { chromium } from 'playwright-core';
import { homedir } from 'os';
const [out, js = '', wait = '4000', w = '1600', h = '900', page_ = 'airport3d.html'] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || `${homedir()}/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`,
  args: ['--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
page.on('console', m => console.log('console.' + m.type() + ':', m.text()));
page.on('pageerror', e => console.log('PAGEERROR:', e.message));
await page.goto(new URL(`../site/${page_}`, import.meta.url).href);
await page.waitForTimeout(1500);
if (js) await page.evaluate(js);
await page.waitForTimeout(+wait);
await page.screenshot({ path: out });
await browser.close();
