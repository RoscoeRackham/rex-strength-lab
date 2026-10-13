const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file://' + path.join(__dirname, 'pages', 'branch.html'));
  for (const d of ['arm', 'wrestle', 'catch', 'collide', null]) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), d ? { duoOpen: true, duoAction: d, action: 'throw' } : { duoOpen: false, action: 'throw' });
    await page.reload(); await page.waitForTimeout(4000);
    await page.evaluate(() => { window.__lt = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: false }); });
    // change Rex's Throw object (a Rex-bay control)
    const opts = await page.evaluate(() => { const s = document.querySelector('#bay select'); return s ? { id: s.id, v: Array.from(s.options).map((o) => o.value) } : null; });
    await page.selectOption('#bay select#' + opts.id, opts.v[2]); await page.waitForTimeout(2500);
    console.log(d || 'closed', 'long tasks after a Rex-bay select change (ms):', JSON.stringify(await page.evaluate(() => window.__lt)));
  }
  await browser.close();
})();
