// Longest main-thread block after a change, branch (element open) vs main (Rex + Ollie view), real-muscle Catch with a bus
const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  for (const [file, st] of [['branch.html', { duoOpen: true, duoAction: 'catch', mode: 'real', cObj: 'bus', action: 'throw' }], ['main.html', { group: 'duo', duoAction: 'catch', mode: 'real', cObj: 'bus', action: 'throw' }]]) {
    const { page } = await open(browser, { w: 1280, h: 900, file, state: st });
    await page.waitForTimeout(6000);
    for (const [what, act] of [['chip ∞', async () => page.click('#tier-chips .chip:last-child')], ['surface sand', async () => page.selectOption('#surface', 'sand')], ['surface concrete', async () => page.selectOption('#surface', 'concrete')], ['chip Hulk', async () => page.click('#tier-chips .chip:nth-child(4)')]]) {
      await page.evaluate(() => { window.__lt = []; if (window.__po) window.__po.disconnect(); window.__po = new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(Math.round(e.duration)); }); window.__po.observe({ type: 'longtask' }); });
      await act();
      await page.waitForTimeout(7000);
      const lt = await page.evaluate(() => window.__lt);
      console.log(file.padEnd(12), what.padEnd(17), 'long tasks (ms):', JSON.stringify(lt), 'total', lt.reduce((a, b) => a + b, 0));
    }
    await page.context().close();
  }
  await browser.close();
})();
