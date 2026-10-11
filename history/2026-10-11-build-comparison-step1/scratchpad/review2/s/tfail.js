const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  const { ctx, p } = await open(b, 390, 844, 'light');
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => /measures/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 });
  for (const [shape, tv] of [['ronnie_coleman', 15], ['ansur2_m_largest_arm', 15], ['ansur2_m_p5', 900], ['ansur2_m_p95', 15]]) {
    await p.selectOption('#tShape', shape);
    await p.fill('#tTarget', String(tv));
    await p.click('#targetBtn');
    await p.waitForFunction(() => !/Drawing/.test(document.getElementById('targetStatus').textContent), null, { timeout: 120000 });
    const r = await p.evaluate(() => ({ st: document.getElementById('targetStatus').textContent, src: !!document.getElementById('tgtFront').getAttribute('src') }));
    console.log(shape, tv, JSON.stringify(r));
    if (!r.src) { await p.locator('.target').screenshot({ path: R + '/ux/target-failed-390.png' }); }
  }
  await ctx.close(); await b.close();
})();
