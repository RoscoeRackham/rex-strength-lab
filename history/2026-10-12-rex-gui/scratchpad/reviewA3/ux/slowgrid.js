// the slowest two-player redraws after a strength chip, with the element open (1280x900)
const { launch, open } = require('./lib.js');
(async () => {
  const b = await launch();
  const cases = [
    { duoAction: 'arm' }, { duoAction: 'wrestle', wrestleMove: 'throw' }, { duoAction: 'wrestle', wrestleMove: 'lift' }, { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' },
    { duoAction: 'catch', cObj: 'bus' }, { duoAction: 'catch', cObj: 'partner' }, { duoAction: 'catch', cObj: 'baseball' }, { duoAction: 'collide' }, { duoAction: 'collide', colSrc: 'jump' }, { duoAction: 'collide', colMode: 'push' },
  ];
  const rows = [];
  for (const mode of ['comic', 'real']) for (const c of cases) {
    const page = await open(b, { w: 1280, h: 900, state: Object.assign({ duoOpen: true, action: 'throw', mode }, c), wait: 5000 });
    await page.evaluate(() => { window.__L = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__L.push([e.startTime, e.duration]); }).observe({ type: 'longtask' });
      window.__mut = (id) => new Promise((res) => { const m = new MutationObserver(() => { m.disconnect(); res(performance.now()); }); m.observe(document.getElementById(id), { childList: true, subtree: true }); }); });
    const ids = await page.evaluate(() => Array.from(document.querySelectorAll('#tier-chips .chip')).map((x) => x.dataset.id));
    for (const id of ids) {
      const r = await page.evaluate(async (id) => {
        window.__L = [];
        const t0 = performance.now();
        const ps = window.__mut('bay'), pd = window.__mut('duo-bay');
        document.querySelector('#tier-chips .chip[data-id="' + id + '"]').click();
        const timeout = new Promise((res) => setTimeout(() => res(null), 8000));
        const s = await Promise.race([ps, timeout]), d = await Promise.race([pd, timeout]);
        await new Promise((res) => setTimeout(res, 300));
        const working = /working it out/i.test(document.getElementById('duo-bay').textContent);
        return { solo: s && Math.round(s - t0), duo: d && Math.round(d - t0), maxLong: Math.round(Math.max(0, ...window.__L.map((x) => x[1]))), working };
      }, id);
      // if a background search is still going, wait for it
      if (r.working) { const t = Date.now(); await page.waitForFunction(() => !/working it out/i.test(document.getElementById('duo-bay').textContent), null, { timeout: 30000 }).catch(() => {}); r.bgDone = Date.now() - t; }
      rows.push(Object.assign({ mode, case: JSON.stringify(c), chip: id }, r));
    }
    await page.context().close();
  }
  rows.sort((a, b) => (b.maxLong || 0) - (a.maxLong || 0));
  for (const r of rows.slice(0, 15)) console.log(JSON.stringify(r));
  console.log('rows', rows.length, 'solo after duo in any row:', rows.filter((r) => r.solo && r.duo && r.duo < r.solo).length);
  await b.close();
})();
