// usage: node load.js head|main '<json state>' [timeoutSec]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const [ver, st, tmo] = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.addInitScript((s) => {
    localStorage.setItem('rex-lab-v1', s);
    window.__lt = [];
    try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true }); } catch (e) {}
  }, st);
  const t0 = Date.now();
  await page.goto(pathToFileURL(__dirname + '/' + ver + '-preview.html').href, { timeout: (Number(tmo) || 300) * 1000 });
  const tLoad = Date.now() - t0;
  await page.waitForTimeout(2500);
  const info = await page.evaluate(() => ({ lt: window.__lt, bay: document.querySelector('#bay').innerText.slice(0, 1500) }));
  console.log(JSON.stringify({ ver, tLoad, longTasks: info.lt, errs }));
  console.log(info.bay);
  await browser.close();
})();
