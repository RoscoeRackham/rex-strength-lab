// node perf.js '<json state>' : load time, long tasks, and the bay's effort text after settling
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), { pathToFileURL } = require('url');
(async () => {
  const over = JSON.parse(process.argv[2] || '{}');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  const prev = pathToFileURL('/home/user/rex-strength-lab/rex-strength-lab/dist/preview.html').href;
  await page.goto(prev);
  await page.evaluate((o) => { localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign(JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'), o))); }, over);
  await page.addInitScript(() => { window.__long = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true }); });
  const t0 = Date.now();
  await page.goto(prev);
  const tLoad = Date.now() - t0;
  const t1 = Date.now();
  let txt = '';
  for (let i = 0; i < 120; i++) { txt = await page.evaluate(() => { const r = document.querySelector('#bay .effort-read'); return r ? r.innerText : ''; }); if (txt && !/working it out|Working out/.test(txt)) break; await page.waitForTimeout(500); }
  const long = await page.evaluate(() => window.__long);
  console.log('load', tLoad, 'ms; settled after', Date.now() - t1, 'ms; long tasks', JSON.stringify(long.filter((x) => x > 200)), 'max', Math.max(0, ...long));
  console.log(txt.slice(0, 600));
  if (errs.length) console.log('ERRORS', errs.slice(0, 3));
  await browser.close();
})();
