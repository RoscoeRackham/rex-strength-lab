const { open, settle, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const colBounce of ['bounce', 'splat']) {
    const st = { duoOpen: true, duoAction: 'collide', colMode: 'charge', colWho: 'rex', anchor: 'friction', oAnchor: 'bolted', colSrc: 'sprint', colBounce };
    const { ctx, page } = await open(b, 'branch', st);
    await settle(page, '#duo-bay');
    await page.selectOption('#duo-effort', 'allout');
    await page.waitForTimeout(400);
    const t = await settle(page, '#duo-bay');
    console.log('== ' + colBounce);
    for (const line of t.split('\n')) if (/pushes with|load on the rock|Rock cracks/.test(line)) console.log('  ' + line.slice(0, 500));
    console.log('  errors:', page.errs);
    await ctx.close();
  }
  // compute radii and ratio for both forces
  const sig = 8.38e6, tearCap = 1.5e6 * 0.4645152;
  for (const F of [1.57e6, 3.14e6]) console.log('F', F, 'rT', Math.sqrt(F / (2 * Math.PI * sig)).toFixed(3), 'tear', (F / tearCap).toFixed(2));
  await b.close();
})();
