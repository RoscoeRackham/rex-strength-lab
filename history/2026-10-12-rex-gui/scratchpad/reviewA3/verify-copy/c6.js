const { open, settle, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const anchor of ['friction', 'bolted']) {
    const st = { duoOpen: true, duoAction: 'collide', colMode: 'charge', colWho: 'ollie', colSrc: 'jump', surface: 'sand', anchor };
    const { ctx, page } = await open(b, 'branch', st);
    await settle(page, '#duo-bay');
    await page.selectOption('#duo-effort', 'allout');
    await page.waitForTimeout(400);
    const t = await settle(page, '#duo-bay');
    console.log('== Rex anchor ' + anchor);
    for (const line of t.split('\n')) if (/lands|driven|sand|budge|holds Rex|What holds|bolts|sink/.test(line)) console.log('  ' + line.slice(0, 400));
    console.log('  errors:', page.errs);
    await ctx.close();
  }
  // Weight tab text
  const { ctx, page } = await open(b, 'branch', { action: 'weight', anchor: 'bolted', surface: 'sand' });
  const t = await settle(page, '#bay');
  for (const line of t.split('\n')) if (/Bolted|sink/.test(line)) console.log('  WEIGHT: ' + line.slice(0, 400));
  await ctx.close();
  await b.close();
})();
