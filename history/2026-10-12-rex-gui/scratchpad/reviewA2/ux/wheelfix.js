const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const which of ['branch', 'fixwheel']) for (const [w, h] of [[1280, 900], [1024, 768]]) {
    const page = await open(b, { which, w, h, state: { duoOpen: true }, wait: 3000 });
    await page.mouse.move(120, 400);
    const log = [];
    for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(150); log.push(await page.evaluate(() => Math.round(scrollY) + '/' + Math.round(document.querySelector('aside').scrollTop))); }
    // and back up: does the sidebar return to the dial?
    for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, -400); await page.waitForTimeout(150); }
    const up = await page.evaluate(() => Math.round(scrollY) + '/' + Math.round(document.querySelector('aside').scrollTop));
    const pw = await page.evaluate(() => { const r = document.querySelector('#powers > summary').getBoundingClientRect(); return Math.round(r.top); });
    console.log(which, w + 'x' + h, 'down:', log.join(' '), '| back up:', up);
    await page.context().close();
  }
  await b.close();
})();
