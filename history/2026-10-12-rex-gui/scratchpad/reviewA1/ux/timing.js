const { NEW, launch } = require('./common');
(async () => {
  const b = await launch();
  const url = NEW();
  for (const duoAction of ['arm', 'wrestle', 'catch', 'collide']) {
    const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(url); await page.evaluate((a) => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: a, action: 'throw' })), duoAction); await page.reload();
    await page.waitForTimeout(6000);
    await page.evaluate(() => {
      window.__lt = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ type: 'longtask', buffered: false });
      window.__mut = (label) => { const t0 = performance.now(); window.__marks = { t0 }; const mo = (id, k) => new MutationObserver(() => { if (!window.__marks[k]) window.__marks[k] = Math.round(performance.now() - t0); }).observe(document.getElementById(id), { childList: true, subtree: true, characterData: true });
        mo('bay', 'rex'); mo('duo-bay', 'duo'); requestAnimationFrame(() => { window.__marks.raf1 = Math.round(performance.now() - t0); }); };
    });
    for (const [what, act] of [['chip Spider-Man', async () => page.click('#tier-chips .chip[data-id]:nth-child(2)')], ['chip All-Star', async () => page.click('#tier-chips .chip:nth-child(5)')], ['surface sand', async () => page.selectOption('#surface', 'sand')], ['surface concrete', async () => page.selectOption('#surface', 'concrete')]]) {
      await page.evaluate(() => { window.__lt = []; window.__marks = null; document.addEventListener('pointerdown', () => window.__mut(), { once: true, capture: true }); document.getElementById('surface').addEventListener('change', () => { if (!window.__marks) window.__mut(); }, { once: true, capture: true }); });
      const t0 = Date.now();
      await act();
      const tAct = Date.now() - t0;
      await page.waitForTimeout(4000);
      const r = await page.evaluate(() => ({ marks: window.__marks, longtasks: window.__lt, pending: /working it out/i.test(document.getElementById('duo-bay').textContent) }));
      console.log(duoAction.padEnd(8), what.padEnd(18), 'action returned in', tAct + 'ms', JSON.stringify(r));
    }
    await page.close();
  }
  await b.close();
})();
