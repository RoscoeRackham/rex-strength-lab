const { open, settle, launch } = require('./lib.js');
async function run(b, st, oLog, effort) {
  const { ctx, page } = await open(b, 'branch', st);
  await settle(page, '#duo-bay');
  if (oLog != null) {
    await page.evaluate(() => { document.querySelector('#ollie-setup').open = true; }); await page.click('#o-own');
    await page.evaluate((v) => { const s = document.querySelector('#o-strength'); s.value = v; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, oLog);
  }
  if (effort) { await page.selectOption('#duo-effort', effort); }
  await page.waitForTimeout(500);
  await page.evaluate(() => document.querySelectorAll('#duo-bay details').forEach(d => d.open = true));
  const t = await settle(page, '#duo-bay');
  for (const line of t.split('\n')) console.log('  ' + line);
  console.log('  errors:', page.errs);
  await ctx.close();
}
(async () => {
  const b = await launch();
  console.log('== finding state (Rex bolted, dial 1 t, Ollie own 1,000 t), default effort');
  await run(b, { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push', anchor: 'bolted', logKg: 3 }, 6);
  console.log('== Rex bolted, dial 3 t (standing), Ollie 9 t body, all-out');
  await run(b, { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push', anchor: 'bolted', logKg: Math.log10(3100), oM: 9000 }, 7, 'allout');
  await b.close();
})();
