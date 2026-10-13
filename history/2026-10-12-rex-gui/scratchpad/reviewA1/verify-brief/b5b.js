const { launch, openPage, waitIdle } = require('./lib');
(async () => {
  const b = await launch();
  const { page, ctx } = await openPage(b, 'branch', { duoOpen: true, duoAction: 'arm' }, { width: 1280, height: 900 });
  await waitIdle(page, '#duo-bay', 30000);
  const r = (sel) => page.evaluate((s) => { const e = document.querySelector(s); const b = e.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom)]; }, sel);
  const docTop = (sel) => page.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().top + scrollY), sel);
  // scan scroll positions from the duo element's top to its end; report when #powers summary is first fully visible
  const start = await docTop('#duo'), end = await page.evaluate(() => { const d = document.getElementById('duo').getBoundingClientRect(); return Math.round(d.bottom + scrollY - innerHeight); });
  let first = null;
  for (let y = start; y <= end; y += 20) { await page.evaluate((yy) => window.scrollTo(0, yy), y); const s = await r('#powers > summary'); if (s[0] >= 0 && s[1] <= 900) { first = y; break; } }
  console.log('duo element top at doc y=' + start + ', page can scroll to y=' + end + ' at its end; Their powers summary first fully on screen at y=' + first + ' (' + (first - start) + ' px below the element top)');
  await page.evaluate((yy) => window.scrollTo(0, yy), start);
  console.log('at element top: #surface', await r('#surface'), ' #powers summary', await r('#powers > summary'), ' size&density details open:', await page.evaluate(() => document.querySelector('aside details.setup').id + '=' + document.querySelector('aside details.setup').open));
  await ctx.close(); await b.close();
})();
