const { open, settle, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  const { ctx, page } = await open(b, 'branch', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push', anchor: 'friction', logKg: 3 });
  await settle(page, '#duo-bay');
  await page.evaluate(() => { document.querySelector('#ollie-setup').open = true; });
  await page.click('#o-own');
  await page.evaluate(() => { const s = document.querySelector('#o-strength'); s.value = 6; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); });
  await page.selectOption('#duo-effort', 'allout');
  await page.waitForTimeout(400);
  await page.evaluate(() => document.querySelectorAll('#duo-bay details').forEach(d => d.open = true));
  const t = await settle(page, '#duo-bay');
  const L = t.split('\n');
  for (let i = 0; i < L.length; i++) if (/Pushing|holds .*drives|Rex’s strength|Hold =/.test(L[i])) console.log('  ' + L[i] + (/strength$/.test(L[i]) ? ' = ' + L[i + 1] : ''));
  console.log('  errors:', page.errs);
  await ctx.close(); await b.close();
})();
