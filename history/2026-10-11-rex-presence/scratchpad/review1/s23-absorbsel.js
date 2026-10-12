const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  for (const w of [1280]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(PREV); await page.waitForTimeout(1200);
    await page.evaluate(() => { document.querySelector('#comic-setup').open = true; });
    const r = await page.evaluate(() => {
      const s = document.querySelector('#absorb'); const cs = getComputedStyle(s); const cv = document.createElement('canvas').getContext('2d'); cv.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      const avail = s.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 20;
      return { avail: Math.round(avail), clipped: [...s.options].map((o) => [o.text, Math.round(cv.measureText(o.text).width)]).filter((x) => x[1] > avail) };
    });
    console.log(w, JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
