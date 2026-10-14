const { launch, openPage, waitIdle } = require('./lib');
(async () => {
  const b = await launch();
  const POWERS_OFF = { groundHolds: false, gentleHold: false, safePassenger: false, silentStrike: false, softLanding: false, coolFlight: false };
  const { page, ctx } = await openPage(b, 'branch', Object.assign({ mode: 'real', anchor: 'bolted', oAnchor: 'bolted', duoOpen: true, duoAction: 'collide' }, POWERS_OFF));
  await waitIdle(page, '#duo-bay', 30000);
  const r = await page.evaluate(() => {
    const bay = document.getElementById('duo-bay');
    bay.querySelectorAll('details').forEach((d) => (d.open = true));
    const covered = new Set([...bay.querySelectorAll('.verdict, .status-row, .tiles')]);
    const outside = [];
    for (const li of bay.querySelectorAll('li, .math p, .math li, p')) { let p = li, inCov = false; while (p && p !== bay) { if (covered.has(p)) inCov = true; p = p.parentElement; } if (!inCov && li.textContent.trim().length > 30) outside.push(li.tagName + ': ' + li.textContent.trim().slice(0, 140)); }
    return outside.slice(0, 12);
  });
  console.log(r.join('\n'));
  await ctx.close(); await b.close();
})();
