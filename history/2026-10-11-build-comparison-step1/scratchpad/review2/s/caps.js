const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  for (const [w, h, dpr] of [[360, 740, 3], [390, 844, 3], [414, 896, 3], [768, 1024, 1], [1024, 768, 1], [1280, 900, 1]]) {
    const { ctx, p } = await open(b, w, h, 'light', { dpr });
    await p.evaluate(() => document.getElementById('tool').scrollIntoView());
    await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5, null, { timeout: 60000 });
    const r = await p.evaluate(() => {
      const spans = Array.from(document.querySelectorAll('#viewCaps span'));
      const rects = spans.map((s) => { const rg = document.createRange(); rg.selectNodeContents(s); const rs = Array.from(rg.getClientRects()); return { t: s.textContent, lines: rs.length, l: Math.round(rs[0].left), r: Math.round(Math.max(...rs.map((x) => x.right))) }; });
      const gaps = rects.slice(1).map((x, i) => x.l - rects[i].r);
      // where are the views on the canvas (from the measured result) vs the captions' centres
      const c = document.getElementById('sheetCanvas').getBoundingClientRect();
      return { capsW: Math.round(document.getElementById('viewCaps').getBoundingClientRect().width), rects, gapsBetween: gaps };
    });
    console.log(w, JSON.stringify(r));
    if (w <= 414) await p.locator('.viewer').evaluate((el) => el.scrollIntoView({ block: 'center' }));
    if (w <= 414) await p.screenshot({ path: `${R}/ux/viewcaps-${w}.png`, clip: await p.evaluate(() => { const a = document.querySelector('.viewer').getBoundingClientRect(), b = document.getElementById('viewCaps').getBoundingClientRect(); return { x: 0, y: a.top - 4, width: window.innerWidth, height: b.bottom - a.top + 30 }; }) });
    await ctx.close();
  }
  await b.close();
})();
