const { open, settle, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const anchor of ['bolted', 'friction']) {
    const st = { duoOpen: true, duoAction: 'collide', colMode: 'charge', colWho: 'rex', anchor, oAnchor: 'bolted', colBounce: 'bounce', colSrc: 'sprint' };
    const { ctx, page } = await open(b, 'branch', st);
    await settle(page, '#duo-bay');
    await page.selectOption('#duo-effort', 'allout');
    await page.waitForTimeout(400);
    await page.evaluate(() => document.querySelectorAll('#duo-bay details').forEach(d => d.open = true));
    const t = await settle(page, '#duo-bay');
    console.log('== Rex anchor ' + anchor);
    for (const line of t.split('\n')) if (/bounces|slides|Bolted|bolted|charges|m\/s/.test(line)) console.log('  ' + line.slice(0, 400));
    console.log('  errors:', page.errs);
    await ctx.close();
  }
  await b.close();
})();
