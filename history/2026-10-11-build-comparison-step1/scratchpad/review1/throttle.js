// Load at 390 px with the CPU slowed 4x (Chrome DevTools' mid-range phone setting): long tasks on load.
const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await ctx.addInitScript(() => { window.__lt = []; try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({ type: 'longtask', buffered: true }); } catch (e) {} });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const t0 = Date.now();
  await p.goto('file://' + process.argv[2], { waitUntil: 'load', timeout: 180000 });
  const tl = Date.now() - t0;
  await p.waitForFunction(() => /measures/.test(document.getElementById('targetStatus').textContent) && /\b(pass|fail)\b/i.test(document.getElementById('validation').textContent), null, { timeout: 180000, polling: 200 });
  const td = Date.now() - t0;
  const lt = await p.evaluate(() => window.__lt.filter((x) => x[1] > 200));
  const fcp = await p.evaluate(() => performance.getEntriesByType('paint').map((e) => e.name + ' ' + Math.round(e.startTime)));
  console.log('4x CPU throttle: load event', tl, 'ms; tool example + validation + target done', td, 'ms; paints', fcp, '; long tasks >200 ms [start, duration]', JSON.stringify(lt));
  await browser.close();
})();
