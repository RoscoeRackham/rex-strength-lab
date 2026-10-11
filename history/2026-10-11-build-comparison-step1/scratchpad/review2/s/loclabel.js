const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  for (const w of [390, 1280]) {
    const { ctx, p } = await open(b, w, 844, 'light');
    for (const id of ['under25', 'past25', 'top', 'empty', 'giants', 'empty-2', 'rex-and-ollie', 'empty-3', 'meatball']) {
      await p.evaluate((id) => document.getElementById(id).scrollIntoView({ block: 'start' }), id);
      await p.waitForTimeout(120);
      const r = await p.evaluate(() => ({ vis: document.getElementById('locNow').textContent, aria: document.getElementById('locTape').getAttribute('aria-label') }));
      console.log(w, id.padEnd(14), '| visible:', r.vis.padEnd(36), '| aria:', r.aria);
    }
    if (w === 390) { await p.evaluate(() => document.getElementById('meatball').scrollIntoView({ block: 'start' })); await p.waitForTimeout(150); await p.screenshot({ path: R + '/locator-meatball-390.png', clip: { x: 0, y: 0, width: 390, height: 300 } }); }
    await ctx.close();
  }
  await b.close();
})();
