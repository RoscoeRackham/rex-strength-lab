const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const [w, h] of [[1280, 900], [1024, 768], [1440, 900]]) {
    const page = await open(b, { w, h, state: null, wait: 3000 });
    await page.mouse.move(120, 400);
    for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(150); }
    const r = await page.evaluate(() => { const a = document.querySelector('aside').getBoundingClientRect(); const s = document.querySelector('#powers > summary').getBoundingClientRect(); const g = document.querySelector('#surface').getBoundingClientRect(); return { scrollY: Math.round(scrollY), asideTop: Math.round(a.top), asideBottom: Math.round(a.bottom), powersSummaryTop: Math.round(s.top), powersSummaryBottom: Math.round(s.bottom), surfaceTop: Math.round(g.top), vh: innerHeight }; });
    console.log(w + 'x' + h, 'after 6 wheel notches over the sidebar:', JSON.stringify(r));
    await page.screenshot({ path: S + '/shots/wheel-trap-' + w + '.png' });
    await page.context().close();
  }
  await b.close();
})();
