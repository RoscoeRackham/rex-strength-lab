const { NEW, launch } = require('./common');
(async () => {
  const b = await launch();
  for (const open of [false, true]) {
    const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(NEW()); await page.evaluate((o) => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: o, duoAction: 'catch', action: 'throw', mode: 'real', cObj: 'bus' })), open); await page.reload(); await page.waitForTimeout(12000);
    await page.evaluate(() => { window.__lt = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(Math.round(e.duration)); }).observe({ type: 'longtask' }); window.__duoMut = 0; new MutationObserver(() => window.__duoMut++).observe(document.getElementById('duo-bay'), { childList: true, subtree: true }); });
    // Rex's angle slider: 10 arrow presses, then Rex's object select
    await page.focus('#angle');
    const t0 = Date.now();
    for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowRight');
    const tKeys = Date.now() - t0;
    await page.waitForTimeout(3000);
    const r1 = await page.evaluate(() => ({ lt: window.__lt.slice(), duoMut: window.__duoMut }));
    await page.evaluate(() => { window.__lt = []; window.__duoMut = 0; });
    const t1 = Date.now(); await page.selectOption('#obj', 'baseball'); const tSel = Date.now() - t1;
    await page.waitForTimeout(3000);
    const r2 = await page.evaluate(() => ({ lt: window.__lt.slice(), duoMut: window.__duoMut }));
    console.log(open ? 'duo OPEN  ' : 'duo closed', '| 10 angle key presses took', tKeys + 'ms', 'longtasks', JSON.stringify(r1.lt), 'duo-bay mutations', r1.duoMut, '| obj select', tSel + 'ms', 'longtasks', JSON.stringify(r2.lt), 'duo-bay mutations', r2.duoMut);
    await page.close();
  }
  await b.close();
})();
