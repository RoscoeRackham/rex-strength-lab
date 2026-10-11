const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  const { ctx, p } = await open(b, 390, 844, 'light');
  const r = await p.evaluate(() => {
    const out = [];
    Array.from(document.querySelectorAll('.fig[data-id]')).forEach((c) => { const t0 = performance.now(); c.click(); out.push([c.getAttribute('data-id'), Math.round(performance.now() - t0)]); });
    return out;
  });
  const ms = r.map((x) => x[1]).sort((a, b) => a - b);
  console.log('drawer open ms: median', ms[ms.length >> 1], 'max', ms[ms.length - 1], r.filter((x) => x[1] > 300).map((x) => x.join(' ')).join(', '));
  await ctx.close(); await b.close();
})();
