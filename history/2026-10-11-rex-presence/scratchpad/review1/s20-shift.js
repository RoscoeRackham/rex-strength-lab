const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  for (const st of [{}, { inf: true, mode: 'real' }, { inf: true }]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ action: 'lift' }, s))); sessionStorage.setItem('x', 1); } }, st);
    await page.goto(PREV); await page.waitForTimeout(1500);
    const out = [];
    for (const tab of ['throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull']) {
      const t0 = Date.now();
      await page.click('#tab-' + tab);
      const y0 = await page.evaluate(() => { const t = document.querySelector('#bay .tiles'); return t ? Math.round(t.getBoundingClientRect().top + scrollY) : null; });
      await page.waitForFunction(() => !/Working out/.test((document.querySelector('.effort-read') || {}).innerText || ''), null, { timeout: 60000, polling: 20 }).catch(() => null);
      const ms = Date.now() - t0;
      const y1 = await page.evaluate(() => { const t = document.querySelector('#bay .tiles'); return t ? Math.round(t.getBoundingClientRect().top + scrollY) : null; });
      out.push(tab + ' ' + ms + 'ms shift ' + (y1 - y0) + 'px');
    }
    console.log(JSON.stringify(st), out.join('; '));
    await ctx.close();
  }
  await b.close();
})();
