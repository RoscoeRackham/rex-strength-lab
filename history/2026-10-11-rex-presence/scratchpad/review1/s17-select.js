const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  for (const w of [360, 390]) {
    for (const st of [{ action: 'throw' }, { group: 'duo', duoAction: 'arm' }]) {
      const ctx = await b.newContext({ viewport: { width: w, height: 800 } });
      const page = await ctx.newPage();
      await page.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('x', 1); } }, st);
      await page.goto(PREV); await page.waitForTimeout(1500);
      const r = await page.evaluate(() => {
        const s = document.querySelector('#effort') || document.querySelector('#duo-effort');
        const cs = getComputedStyle(s); const cv = document.createElement('canvas').getContext('2d'); cv.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
        const avail = s.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 20; // ~20 px for the arrow
        return { id: s.id, avail: Math.round(avail), clipped: [...s.options].map((o) => [o.text, Math.round(cv.measureText(o.text).width)]).filter((x) => x[1] > avail) };
      });
      console.log(w, JSON.stringify(r));
      await ctx.close();
    }
  }
  await b.close();
})();
