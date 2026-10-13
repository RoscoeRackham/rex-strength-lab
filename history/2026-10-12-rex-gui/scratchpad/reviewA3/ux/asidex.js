const { launch, open } = require('./lib.js');
(async () => {
  const b = await launch();
  const all = { mode: 'real', groundHolds: true, anchor: 'bolted', oAnchor: 'bolted', gentleHold: true, safePassenger: true, silentStrike: true, softLanding: true, coolFlight: true, inf: true, H: 0.4, m: 3e9, build: 'rex' };
  for (const [w, h] of [[920, 700], [1024, 768], [1280, 900], [932, 430]]) for (const st of [null, all]) {
    const page = await open(b, { w, h, state: st, wait: 2500 });
    await page.evaluate(() => { document.getElementById('powers').open = true; document.getElementById('setup').open = true; });
    const res = [];
    for (const m of ['ocean', 'gradual', 'instant', 'runaway']) {
      await page.selectOption('#absorb', m); await page.waitForTimeout(300);
      res.push(m + ':' + (await page.evaluate(() => { const a = document.querySelector('aside'); return (a.scrollWidth - a.clientWidth) + '/' + (document.documentElement.scrollWidth - document.documentElement.clientWidth); })));
    }
    const sum = await page.evaluate(() => document.getElementById('powers-sum').textContent);
    console.log(w + 'x' + h, st ? 'all-on' : 'default', res.join(' '), '|', sum, page.errs.length ? page.errs.slice(0, 2) : '');
    await page.context().close();
  }
  await b.close();
})();
