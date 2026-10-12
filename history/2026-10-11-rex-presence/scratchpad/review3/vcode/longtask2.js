const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const st = JSON.parse(process.argv[2]), click = process.argv[3];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript((s) => { window.__lt = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ type: 'longtask', buffered: true }); if (!sessionStorage.getItem('s')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('s', '1'); } }, st);
  await page.goto(pathToFileURL(__dirname + '/preview.html').href);
  const pend = () => page.evaluate(() => /Working out|working it out/i.test(document.querySelector('#bay').textContent));
  for (let i = 0; i < 400 && await pend(); i++) await page.waitForTimeout(250);
  await page.waitForTimeout(1500);
  console.log('load long tasks:', JSON.stringify(await page.evaluate(() => window.__lt.map((x) => x[1]))));
  await page.evaluate(() => { window.__lt = []; window.__t0 = performance.now(); });
  if (click.startsWith('select:')) { const [, sel, val] = click.split(':'); await page.selectOption(sel, val); }
  else { if (!(await page.isVisible(click))) await page.click('#setup > summary'); await page.click(click); }
  const t0 = Date.now(); let doneAt = null;
  await page.waitForTimeout(100);
  for (let i = 0; i < 600; i++) { if (!(await pend())) { doneAt = Date.now() - t0; break; } await page.waitForTimeout(250); }
  await page.waitForTimeout(500);
  const lt = await page.evaluate(() => window.__lt.map(([s, d]) => [Math.round(s - window.__t0), d]));
  console.log('after click', click, ': settled at', doneAt, 'ms; tasks [start,dur]:', JSON.stringify(lt));
  console.log('max', Math.max(0, ...lt.map((x) => x[1])), 'count >1000ms', lt.filter((x) => x[1] > 1000).length);
  console.log('readout:', await page.evaluate(() => ((document.querySelector('#bay .effort-read') || {}).textContent || '').slice(0, 220)));
  await browser.close();
})();
