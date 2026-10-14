const { open, settle, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const anchor of ['bolted', 'friction']) for (const angle of [45, 80]) {
    const { ctx, page } = await open(b, 'branch', { action: 'throw', anchor, surface: 'sand', obj: 'car', angle });
    await settle(page, '#bay');
    const opts = await page.evaluate(() => [...document.querySelectorAll('#effort option')].map(o => o.value));
    await page.selectOption('#effort', opts.includes('allout') ? 'allout' : opts[opts.length - 1]);
    await page.waitForTimeout(400);
    const t = await settle(page, '#bay');
    console.log('== anchor ' + anchor + ' angle ' + angle + ' (options ' + opts.join(',') + ')');
    for (const line of t.split('\n')) if (/drives his feet down|footing never gives|equal and opposite|upper bound|sink/.test(line)) console.log('  ' + line.slice(0, 600));
    console.log('  errors:', page.errs);
    await ctx.close();
  }
  await b.close();
})();
