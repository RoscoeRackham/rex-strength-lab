const { open, settle, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const st of [{ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push', anchor: 'bolted', oM: 9000 }, { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push', surface: 'sand', oM: 9000 }]) {
    const { ctx, page } = await open(b, 'branch', st);
    await settle(page, '#duo-bay');
    await page.selectOption('#duo-effort', 'allout');
    await page.waitForTimeout(400);
    const t = await settle(page, '#duo-bay');
    console.log('== ' + JSON.stringify(st));
    for (const line of t.split('\n')) if (/Pushing|holds .*drives|heavier|Rex \+ Ollie|t ·|3\.01 t|9 t/.test(line)) console.log('  ' + line);
    console.log('  errors:', page.errs);
    await ctx.close();
  }
  await b.close();
})();
