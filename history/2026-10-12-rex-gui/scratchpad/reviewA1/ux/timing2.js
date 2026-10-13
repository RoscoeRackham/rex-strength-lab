const { NEW, launch } = require('./common');
(async () => {
  const b = await launch();
  const url = NEW();
  const cases = [
    { duoOpen: true, duoAction: 'catch', mode: 'real', action: 'throw' },
    { duoOpen: true, duoAction: 'catch', mode: 'real', action: 'throw', cObj: 'bus' },
    { duoOpen: true, duoAction: 'collide', mode: 'real', action: 'throw' },
    { duoOpen: true, duoAction: 'wrestle', mode: 'real', action: 'throw', wrestleMove: 'throw' },
    { duoOpen: false, duoAction: 'catch', mode: 'real', action: 'throw' },
  ];
  for (const st of cases) {
    const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(url); await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    const tLoad = Date.now(); await page.reload();
    await page.waitForFunction(() => document.querySelector('#bay .verdict'), null, { timeout: 30000 });
    const rexFirst = Date.now() - tLoad;
    await page.waitForTimeout(8000);
    await page.evaluate(() => { window.__lt = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(Math.round(e.duration)); }).observe({ type: 'longtask' }); });
    const chips = await page.$$eval('#tier-chips .chip', (xs) => xs.map((x) => x.textContent));
    for (const [what, act] of [['chip ' + chips[0], (p) => p.click('#tier-chips .chip >> nth=0')], ['chip ' + chips[4], (p) => p.click('#tier-chips .chip >> nth=4')], ['surface sand', (p) => p.selectOption('#surface', 'sand')], ['surface granite', (p) => p.selectOption('#surface', 'granite').catch(() => p.selectOption('#surface', { index: 0 }))]]) {
      await page.evaluate(() => {
        window.__lt = [];
        if (window.__obs) window.__obs.forEach((o) => o.disconnect());
        const m = window.__m = {}; window.__obs = [];
        const arm = () => { m.t0 = performance.now(); requestAnimationFrame(() => { m.frame = Math.round(performance.now() - m.t0); }); };
        document.addEventListener('pointerdown', arm, { once: true, capture: true });
        document.getElementById('surface').addEventListener('change', () => { if (!m.t0) arm(); }, { once: true, capture: true });
        for (const [id, k] of [['bay', 'rex'], ['duo-bay', 'duo']]) { const o = new MutationObserver(() => { if (m.t0 && m[k] === undefined) m[k] = Math.round(performance.now() - m.t0); m[k + 'Last'] = Math.round(performance.now() - m.t0); }); o.observe(document.getElementById(id), { childList: true, subtree: true, characterData: true }); window.__obs.push(o); }
      });
      await act(page);
      await page.waitForTimeout(6000);
      const r = await page.evaluate(() => ({ m: window.__m, lt: window.__lt.slice(0, 8), working: /working it out/i.test(document.getElementById('duo-bay').textContent) }));
      delete r.m.t0;
      console.log(JSON.stringify(st).slice(0, 90).padEnd(92), what.padEnd(26), JSON.stringify(r));
    }
    console.log('   rex verdict first appeared after load:', rexFirst + 'ms');
    await page.close();
  }
  await b.close();
})();
