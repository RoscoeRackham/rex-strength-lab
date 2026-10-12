const { open, tab } = require('./lib');
(async () => {
  for (const w of [360, 390, 768, 1280]) {
    const { browser, page } = await open({ w, h: 900 });
    await page.evaluate(() => { const d = document.querySelector('#comic-setup'); d.open = true; });
    await page.waitForTimeout(200);
    const meas = (sel) => page.evaluate((sel) => {
      const s = document.querySelector(sel); if (!s) return null;
      const cs = getComputedStyle(s); const cv = document.createElement('canvas').getContext('2d'); cv.font = cs.font;
      const inner = s.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      return [...s.options].map((o) => [o.text, Math.round(cv.measureText(o.text).width), Math.round(inner), o.selected]).filter((x) => x[1] > x[2]);
    }, sel);
    console.log(w, 'absorb', JSON.stringify(await meas('#absorb')));
    await tab(page, 'throw', false, 1200);
    console.log(w, 'effort', JSON.stringify(await meas('#effort')));
    await tab(page, 'collide', true, 2000);
    console.log(w, 'duo-effort', JSON.stringify(await meas('#duo-effort')));
    if (w === 1280 || w === 390) { await page.evaluate(() => document.querySelector('#comic-setup').scrollIntoView()); const e = await page.$('#absorb'); await e.screenshot({ path: `u8-absorb-${w}.png` }); const e2 = await page.$('#duo-effort'); await e2.screenshot({ path: `u8-duo-${w}.png` }); }
    await browser.close();
  }
})();
