const { launch, open } = require('./lib.js');
(async () => {
  const b = await launch();
  const init = () => {
    window.__ev = { frames: [], longs: [] };
    const t = window.__ev;
    const loop = () => { t.frames.push(performance.now()); if (t.frames.length < 900) requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    new MutationObserver(() => {
      if (!t.solo && document.querySelector('#bay .verdict, #bay .callout')) t.solo = performance.now();
      if (!t.duo && document.querySelector('#duo-bay .verdict')) t.duo = performance.now();
    }).observe(document, { childList: true, subtree: true });
    try { new PerformanceObserver((l) => { for (const e of l.getEntries()) t.longs.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ type: 'longtask', buffered: true }); } catch (e) {}
  };
  for (const st of [{ duoOpen: true, duoAction: 'catch', mode: 'real', cObj: 'bus', logKg: Math.log10(1.81e20) }, { duoOpen: true, duoAction: 'arm' }, { duoOpen: true, duoAction: 'catch', mode: 'real', cObj: 'bus', inf: true }]) {
    const page = await open(b, { w: 1280, h: 900, state: st, wait: 7000, init: { fn: init } });
    const r = await page.evaluate(() => { const t = window.__ev; const fb = t.frames.filter((f) => f > t.solo && f < t.duo); return { solo: Math.round(t.solo), duo: Math.round(t.duo), framesBetween: fb.length, longs: t.longs.slice(0, 6) }; });
    console.log(JSON.stringify(st).slice(0, 80), JSON.stringify(r));
    await page.context().close();
  }
  await b.close();
})();
