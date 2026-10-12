// Load the page with a saved setting that makes the default (least disruptive) effort solve slowly, and time the freeze
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const URL = pathToFileURL(process.argv[2]).href;
const st = JSON.parse(process.argv[3]);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript((st) => {
    if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); sessionStorage.setItem('seeded', '1'); }
    window.__long = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true });
  }, st);
  const t0 = Date.now();
  await page.goto(URL, { timeout: 300000 });
  const tGoto = Date.now() - t0;
  await page.waitForFunction(() => document.querySelector('#bay') && document.querySelector('#bay').children.length > 0, null, { timeout: 300000 });
  const tFirst = Date.now() - t0;
  const info = await page.evaluate(() => ({ long: window.__long.slice(), eff: (document.querySelector('.effort-read') || {}).innerText, verdict: (document.querySelector('.verdict') || {}).innerText, sel: (document.querySelector('#effort') || {}).value }));
  console.log('goto', tGoto, 'ms; bay rendered at', tFirst, 'ms; long tasks', JSON.stringify(info.long));
  console.log('preset', info.sel, '| verdict:', info.verdict);
  console.log('effort readout:', (info.eff || '').slice(0, 300));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
