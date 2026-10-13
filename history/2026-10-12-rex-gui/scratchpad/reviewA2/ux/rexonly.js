const { launch, open, S } = require('./lib.js');
// Rex-only controls (they change nothing in the two-player tests): does the open element redraw, and how long does the page block?
(async () => {
  const b = await launch();
  const allstar = 9.0; // set below via chip
  for (const duoOpen of [false, true]) {
    const page = await open(b, { w: 1280, h: 900, state: { duoOpen, duoAction: 'catch', mode: 'real', cObj: 'bus', action: 'throw' }, wait: 3000 });
    const ids = await page.evaluate(() => Array.from(document.querySelectorAll('#tier-chips .chip')).map((x) => x.dataset.id));
    await page.click('#tier-chips .chip[data-id="' + ids.find((i) => /star/i.test(i)) + '"]');
    await page.waitForTimeout(8000);
    await page.evaluate(() => {
      window.__longs = []; window.__duoMut = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__longs.push(Math.round(e.duration)); }).observe({ type: 'longtask' });
      new MutationObserver(() => { window.__duoMut++; }).observe(document.getElementById('duo-bay'), { childList: true });
    });
    // 1: change Rex's object
    const t0 = Date.now();
    await page.selectOption('#obj', { index: 2 });
    await page.waitForTimeout(4000);
    const a = await page.evaluate(() => ({ longs: window.__longs.slice(), duoRedraws: window.__duoMut }));
    // 2: keyboard-drag Rex's launch angle 10 steps
    await page.evaluate(() => { window.__longs = []; window.__duoMut = 0; });
    await page.focus('#angle');
    const t1 = Date.now();
    for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowRight');
    const keyMs = Date.now() - t1;
    await page.waitForTimeout(5000);
    const c = await page.evaluate(() => ({ longs: window.__longs.slice(), duoRedraws: window.__duoMut, angle: document.getElementById('angle').value }));
    console.log('duoOpen=' + duoOpen, 'Rex object change:', JSON.stringify(a), '| 10 angle key presses took ' + keyMs + ' ms:', JSON.stringify(c));
    await page.context().close();
  }
  await b.close();
})();
