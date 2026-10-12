// node longtask.js '<state>' [seconds]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const st = JSON.parse(process.argv[2]), secs = Number(process.argv[3] || 40);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript((s) => { window.__lt = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ type: 'longtask', buffered: true }); if (!sessionStorage.getItem('s')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('s', '1'); } }, st);
  await page.goto(pathToFileURL(__dirname + '/preview.html').href);
  const t0 = Date.now();
  let doneAt = null;
  while (Date.now() - t0 < secs * 1000) { const p = await page.evaluate(() => /Working out|working it out/i.test(document.querySelector('#bay').textContent)); if (!p) { doneAt = Date.now() - t0; break; } await page.waitForTimeout(250); }
  const lt = await page.evaluate(() => window.__lt);
  const sorted = lt.map((x) => x[1]).sort((a, b) => b - a);
  console.log(JSON.stringify(st), 'search done at', doneAt, 'ms; long tasks', lt.length, 'top', sorted.slice(0, 8).join(','), 'total', sorted.reduce((a, b) => a + b, 0));
  console.log('readout:', await page.evaluate(() => ((document.querySelector('#bay .effort-read') || {}).textContent || '').slice(0, 200)));
  await browser.close();
})();
