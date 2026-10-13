// Ollie's density slider moved 10 steps by keyboard with a slow two-player test showing: long tasks, branch vs main
const { launch, open } = require('./lib.js');
(async () => {
  const b = await launch();
  const base = { mode: 'real', duoAction: 'catch', cObj: 'bus', logKg: Math.log10(1.81e20) };
  for (const which of ['branch', 'main']) for (const sl of ['#o-density', '#o-strength']) {
    const st = Object.assign({}, base, which === 'main' ? { group: 'duo' } : { duoOpen: true });
    const page = await open(b, { w: 1280, h: 900, which, state: st, wait: 6000 });
    await page.evaluate(() => { const o = document.getElementById('ollie-setup') || document.querySelector('details#ollie-setup'); if (o) o.open = true; });
    if (sl === '#o-strength') await page.click('#o-own');
    await page.waitForTimeout(3000);
    await page.evaluate(() => { window.__L = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__L.push(e.duration); }).observe({ type: 'longtask' }); });
    await page.focus(sl);
    const t0 = Date.now();
    for (let i = 0; i < 10; i++) { await page.keyboard.press('ArrowRight'); }
    const tKeys = Date.now() - t0;
    await page.waitForTimeout(5000);
    const L = await page.evaluate(() => window.__L);
    console.log(which, sl, 'keys took', tKeys, 'ms; long tasks', L.length, 'total', Math.round(L.reduce((a, b) => a + b, 0)), 'max', Math.round(Math.max(0, ...L)), page.errs.length ? page.errs.slice(0, 2) : '');
    await page.context().close();
  }
  await b.close();
})();
