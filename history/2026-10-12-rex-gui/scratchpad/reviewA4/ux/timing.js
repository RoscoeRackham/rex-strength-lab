// Response time with the element open: strength chip and surface changes on the slowest two-player tests.
// Records when Rex's verdict changes, when the two-player bay is redrawn, and whether a frame was painted between.
const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  const setups = [
    ['Catch, bus, real muscle', { duoOpen: true, duoAction: 'catch', mode: 'real', cObj: 'bus', action: 'throw' }],
    ['Catch, comic', { duoOpen: true, duoAction: 'catch', action: 'throw' }],
    ['Collide charge', { duoOpen: true, duoAction: 'collide', action: 'throw' }],
    ['Wrestle throw, real', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', mode: 'real', action: 'throw' }],
  ];
  for (const [name, st] of setups) {
    const { page, errs } = await open(browser, { w: 1280, h: 900, state: st });
    await page.waitForTimeout(5000);
    for (const [what, act] of [['chip Hulk', async () => page.click('#tier-chips .chip:nth-child(4)')], ['chip ∞', async () => page.click('#tier-chips .chip:last-child')], ['surface sand', async () => page.selectOption('#surface', 'sand')], ['chip Spider-Man', async () => page.click('#tier-chips .chip:nth-child(2)')]]) {
      await page.evaluate(() => {
        window.__t = { start: 0, rex: null, duo: null, frames: [] };
        const rexBay = document.getElementById('bay'), duoBay = document.getElementById('duo-bay');
        if (window.__mo) window.__mo.forEach((m) => m.disconnect());
        const m1 = new MutationObserver(() => { if (window.__t.rex === null && window.__t.start) window.__t.rex = performance.now() - window.__t.start; });
        const m2 = new MutationObserver(() => { if (window.__t.start) window.__t.duo = performance.now() - window.__t.start; });
        m1.observe(rexBay, { childList: true, subtree: true, characterData: true }); m2.observe(duoBay, { childList: true, subtree: true, characterData: true });
        window.__mo = [m1, m2];
        const loop = () => { if (window.__t.start) window.__t.frames.push(performance.now() - window.__t.start); if (window.__t.frames.length < 400) requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
        document.addEventListener('pointerdown', () => { window.__t.start = performance.now(); }, { once: true, capture: true });
        document.getElementById('surface').addEventListener('change', () => { if (!window.__t.start) window.__t.start = performance.now(); }, { once: true, capture: true });
      });
      await act();
      await page.waitForTimeout(6000);
      const t = await page.evaluate(() => { const t = window.__t; const between = t.rex !== null && t.duo !== null ? t.frames.filter((f) => f > t.rex && f < t.duo).length : null; return { rex: t.rex && Math.round(t.rex), duo: t.duo && Math.round(t.duo), framesBetween: between, firstFrame: Math.round(t.frames[0] || -1) }; });
      console.log(name.padEnd(26), what.padEnd(16), JSON.stringify(t));
    }
    if (errs.length) console.log('  errs', errs);
    await page.context().close();
  }
  await browser.close();
})();
