const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const url = process.argv[2];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const results = {};
  for (const rate of [1, 4]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate });
    await page.addInitScript(() => { window.__lt = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true }); });
    await page.goto(url);
    await page.waitForTimeout(rate === 1 ? 2000 : 5000);
    console.log(`rate ${rate}x load long tasks: ${JSON.stringify(await page.evaluate(() => window.__lt))}`);
    const ladder = () => page.evaluate(() => [...document.querySelectorAll('#ladder-viz g.mk')].map(g => g.getAttribute('aria-label')).join(' | '));
    results['load' + rate] = await ladder();
    const steps = [['Real', '#mode-real'], ['Kaiju', 'button.chip[data-h="50"]'], ['Comic', '#mode-comic'], ['Dino 2m', 'button.chip[data-h="2"]'], ['gh on', '#ground-holds'], ['gh off', '#ground-holds'], ['Real again', '#mode-real'], ['Comic again', '#mode-comic']];
    for (const [name, sel] of steps) {
      await page.evaluate(() => { window.__lt = []; window.__done = null; window.__t0 = performance.now(); const w = document.querySelector('#ladder-viz'); new MutationObserver(() => { if (window.__done == null) window.__done = performance.now(); }).observe(w, { childList: true }); });
      await page.click(sel);
      await page.waitForTimeout(rate === 1 ? 1500 : 4000);
      const r = await page.evaluate(() => ({ lt: window.__lt, done: window.__done == null ? null : Math.round(window.__done - window.__t0) }));
      results[name + rate] = await ladder();
      console.log(`  ${name.padEnd(12)} long tasks ${JSON.stringify(r.lt).padEnd(14)} ladder redrawn +${r.done} ms`);
    }
    // rapid toggling: click Comic/Real/Kaiju quickly and check final ladder matches settled state
    await page.click('#mode-real'); await page.waitForTimeout(50); await page.click('button.chip[data-h="50"]'); await page.waitForTimeout(50); await page.click('#mode-comic');
    await page.waitForTimeout(rate === 1 ? 2500 : 6000);
    results['rapid' + rate] = await ladder();
    console.log('  errors:', errs);
    await page.close();
  }
  require('fs').writeFileSync(process.argv[3], JSON.stringify(results, null, 1));
  await browser.close();
})();
