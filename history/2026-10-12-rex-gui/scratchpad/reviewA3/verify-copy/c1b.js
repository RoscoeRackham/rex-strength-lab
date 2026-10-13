const { open, settle, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  const { ctx, page } = await open(b, 'branch', { duoOpen: true, duoAction: 'arm', anchor: 'bolted', surface: 'sand' });
  await settle(page, '#duo-bay');
  await page.selectOption('#duo-effort', 'allout');
  await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('#duo-bay details').forEach(d => d.open = true));
  const t = await settle(page, '#duo-bay');
  for (const line of t.split('\n')) if (/holds|footing|Usable|Feet hold|Standing up|wins|pins|drags/.test(line)) console.log(line);
  console.log('errors:', page.errs);
  await ctx.close(); await b.close();
})();
