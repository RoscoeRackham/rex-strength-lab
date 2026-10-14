const { NEW, launch, DIR, path } = require('./common');
(async () => {
  const b = await launch();
  for (const w of [360, 1280]) {
    const page = await b.newPage({ viewport: { width: w, height: 800 } });
    await page.goto(NEW()); await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ groundHolds: true, gentleHold: true, safePassenger: true, silentStrike: true, softLanding: true, coolFlight: true, anchor: 'bolted', oAnchor: 'bolted', mode: 'real', oH: 123.456, oM: 1e12, H: 0.4, m: 5e9, duoAction: 'collide' }))); await page.reload(); await page.waitForTimeout(2500);
    await page.evaluate(() => { document.getElementById('powers').open = true; document.getElementById('duo').open = true; document.getElementById('ollie-setup').open = true; }); await page.waitForTimeout(300); await page.selectOption('#absorb', 'runaway');
    await page.evaluate(() => { document.getElementById('o-own').click(); });
    await page.waitForTimeout(800);
    const r = await page.evaluate(() => ({ ov: document.documentElement.scrollWidth - document.documentElement.clientWidth, powers: document.getElementById('powers-sum').textContent, setup: document.getElementById('setup-sum').textContent, duo: document.getElementById('duo-sum').textContent, ollie: document.getElementById('ollie-sum').textContent }));
    console.log(w, JSON.stringify(r));
    const s = await page.$('aside'); await s.screenshot({ path: path.join(DIR, 'shots', 'allon-aside-' + w + '.png'), clip: undefined });
    const d = await page.$('#duo > summary'); await d.screenshot({ path: path.join(DIR, 'shots', 'allon-duosum-' + w + '.png') });
    await page.close();
  }
  await b.close();
})();
