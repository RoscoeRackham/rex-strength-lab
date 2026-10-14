const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [label, st, sel] of [['catch real duo open', { duoOpen: true, duoAction: 'catch', mode: 'real', action: 'throw' }, '#air-absorb'], ['catch real, strength dial', { duoOpen: true, duoAction: 'catch', mode: 'real', action: 'throw' }, '#strength']]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(S + '/pagecmp/branch.html').href);
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    await page.reload(); await page.waitForTimeout(1500);
    for (let i = 0; i < 200; i++) { const busy = await page.evaluate(() => /working it out|Working out/i.test(document.getElementById('duo-bay').textContent + document.getElementById('bay').textContent)); if (!busy) break; await page.waitForTimeout(250); }
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    // long-task observer
    await page.evaluate(() => { window.__lt = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(e.duration); }).observe({ entryTypes: ['longtask'] }); });
    const t0 = Date.now();
    const exists = await page.$(sel);
    if (!exists) { console.log(label, 'no', sel); await page.close(); continue; }
    await page.focus(sel);
    for (let i = 0; i < 20; i++) { await page.keyboard.press(sel === '#air-absorb' ? 'ArrowLeft' : 'ArrowRight'); await page.waitForTimeout(60); }
    await page.waitForTimeout(3000);
    const lt = await page.evaluate(() => window.__lt);
    console.log(label, 'wall', Date.now() - t0, 'ms; long tasks', lt.length, 'max', Math.round(Math.max(0, ...lt)), 'sum', Math.round(lt.reduce((a, b) => a + b, 0)));
    await page.close();
  }
  await browser.close();
})();
