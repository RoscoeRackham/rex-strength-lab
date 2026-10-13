const { open, settle, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const which of ['branch', 'main']) {
    const st = which === 'branch' ? { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push', surface: 'sand' } : { group: 'duo', duoAction: 'wrestle', wrestleMove: 'push', surface: 'sand' };
    const { ctx, page } = await open(b, which, st);
    const sel = which === 'branch' ? '#duo-bay' : '#bay';
    // open math
    const t = await settle(page, sel);
    await page.evaluate((s) => document.querySelectorAll(s + ' details').forEach(d => d.open = true), sel);
    const t2 = await settle(page, sel);
    console.log('==== ' + which);
    for (const line of t2.split('\n')) if (/Pushing straight|Walking drive|Hold =|Drive =|Equal bodies|holds .* drives|same grip/.test(line)) console.log(line);
    console.log('errors:', page.errs);
    await ctx.close();
  }
  await b.close();
})();
