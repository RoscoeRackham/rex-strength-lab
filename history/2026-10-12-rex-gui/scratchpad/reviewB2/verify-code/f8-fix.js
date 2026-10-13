const { open } = require('./pagelib.js');
(async () => {
  const P = await open(__dirname + '/pmut/fix08.html');
  const run = async (sel, prep) => {
    await P.load({ duoOpen: true, duoAction: 'catch', mode: 'real' }, 'bay'); await P.settle('duo-bay');
    await P.page.evaluate(() => { document.getElementById('powers').open = true; });
    await P.page.waitForTimeout(1500);
    await P.page.evaluate(() => { window.__lt = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(e.duration); }).observe({ type: 'longtask', buffered: false }); });
    await P.page.focus(sel);
    const t0 = Date.now();
    for (let i = 0; i < 20; i++) { await P.page.keyboard.press('ArrowLeft'); await P.page.waitForTimeout(60); }
    const tKeys = Date.now() - t0;
    await P.page.waitForTimeout(500);
    const lt = await P.page.evaluate(() => window.__lt.slice());
    const tot = lt.reduce((a, b) => a + b, 0);
    console.log(sel, 'keys wall', tKeys, 'ms; long tasks', lt.length, 'total', tot.toFixed(0), 'ms; longest', Math.max(0, ...lt).toFixed(0), 'ms');
  };
  await run('#air-absorb');
  await run('#strength');
  await run('#air-absorb');
  await run('#strength');
  console.log('errors', P.errs);
  await P.close();
})();
