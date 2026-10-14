const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  const cases = [
    { duoAction: 'catch', mode: 'real', cObj: 'bus' },
    { duoAction: 'catch', cObj: 'bus' },
    { duoAction: 'catch', cObj: 'partner' },
    { duoAction: 'wrestle', wrestleMove: 'throw' },
    { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' },
    { duoAction: 'collide' },
    { duoAction: 'collide', colMode: 'push' },
    { duoAction: 'arm' },
    { duoAction: 'arm', mode: 'real' },
  ];
  const actions = [['chip All-Star', '#tier-chips .chip[data-id="allstar"]'], ['chip Spider', '#tier-chips .chip:nth-child(2)'], ['surface', 'surface']];
  for (const c of cases) {
    const page = await open(b, { w: 1280, h: 900, state: Object.assign({ duoOpen: true, action: 'throw' }, c), wait: 6000 });
    const ids = await page.evaluate(() => Array.from(document.querySelectorAll('#tier-chips .chip')).map((x) => x.dataset.id));
    for (const [name, sel] of actions) {
      await page.evaluate(() => {
        window.__t = { frames: [], longs: [] };
        const t = window.__t;
        const mo = (id, k) => new MutationObserver(() => { if (!t[k]) t[k] = performance.now(); else t[k + 'Last'] = performance.now(); }).observe(document.getElementById(id), { childList: true, subtree: true, characterData: true });
        if (!window.__mo) { window.__mo = 1; mo('bay', 'solo'); mo('duo-bay', 'duo'); new PerformanceObserver((l) => { for (const e of l.getEntries()) if (window.__t) window.__t.longs.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ type: 'longtask' }); }
        else { /* observers write into the new __t via closure? no: rebind */ }
        const loop = () => { t.frames.push(performance.now()); if (t.frames.length < 400) requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
      });
      // re-register observers on each run so they write into the current __t
      await page.evaluate(() => {
        const t = window.__t;
        if (window.__mos) for (const m of window.__mos) m.disconnect();
        window.__mos = ['bay', 'duo-bay'].map((id) => { const k = id === 'bay' ? 'solo' : 'duo'; const m = new MutationObserver(() => { if (!t[k]) t[k] = performance.now(); t[k + 'Last'] = performance.now(); }); m.observe(document.getElementById(id), { childList: true, subtree: true, characterData: true }); return m; });
      });
      const t0 = await page.evaluate(() => performance.now());
      if (sel === 'surface') await page.selectOption('#surface', { index: 3 });
      else if (name === 'chip All-Star') await page.click('#tier-chips .chip[data-id="' + ids.find((i) => /star/i.test(i)) + '"]');
      else await page.click('#tier-chips .chip[data-id="' + ids[1] + '"]');
      await page.waitForTimeout(7000);
      const r = await page.evaluate((t0) => {
        const t = window.__t;
        const f = t.frames.filter((x) => x > t0);
        const frameBetween = t.solo && t.duo ? f.some((x) => x > t.solo && x < t.duo) : null;
        const longs = t.longs.filter(([s]) => s >= t0 - 50).map(([s, d]) => [Math.round(s - t0), d]);
        return { solo: t.solo && Math.round(t.solo - t0), duo: t.duo && Math.round(t.duo - t0), duoLast: t.duoLast && Math.round(t.duoLast - t0), frameBetween, longs: longs.slice(0, 6), working: !!document.querySelector('#duo-bay .effort-read b') && /working/.test(document.querySelector('#duo-bay .effort-read b').textContent) };
      }, t0);
      console.log(JSON.stringify(c), name, JSON.stringify(r));
      // go back to the start values
      await page.evaluate(() => { });
    }
    await page.context().close();
  }
  await b.close();
})();
