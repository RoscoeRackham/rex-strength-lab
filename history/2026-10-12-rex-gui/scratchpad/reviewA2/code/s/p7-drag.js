// main-thread blocking while a sidebar slider other than the strength dial is dragged, element open vs closed
const { wrap, launch, settle, S } = require('./h.js');
const path = require('path');
const which = process.argv[2] || 'new', slider = process.argv[3] || 'density';
(async () => {
  const b = await launch();
  for (const [label, st] of [['closed', { duoOpen: false, action: 'throw', group: 'solo' }], ['open-arm', { duoOpen: true, duoAction: 'arm', action: 'throw' }], ['open-catch', { duoOpen: true, duoAction: 'catch', action: 'throw' }], ['open-collide', { duoOpen: true, duoAction: 'collide', action: 'throw' }], ['open-wrestle', { duoOpen: true, duoAction: 'wrestle', action: 'throw' }]]) {
    if (which === 'main' && label !== 'closed') { st.group = 'duo'; }
    const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await p.goto(wrap(path.join(S, which === 'main' ? 'main.html' : 'lab/dist/index.html'), which));
    await p.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await p.reload(); await p.waitForTimeout(800); await settle(p, 'bay'); if (which === 'new' && st.duoOpen) await settle(p, 'duo-bay');
    await p.evaluate(() => { document.getElementById('setup').open = true; window.__lt = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(e.duration); }).observe({ type: 'longtask', buffered: false }); });
    // a drag: 30 input events, one per 16 ms, as a thumb moving across the density slider
    const t0 = Date.now();
    await p.evaluate(async (id) => { const s = document.getElementById(id); const v0 = Number(s.value); for (let i = 0; i < 30; i++) { s.value = String(v0 + 0.02 * (i + 1)); s.dispatchEvent(new Event('input', { bubbles: true })); await new Promise((r) => setTimeout(r, 16)); } }, slider);
    const dragMs = Date.now() - t0;
    await p.waitForTimeout(3000);
    const lt = await p.evaluate(() => window.__lt);
    console.log(which, label, 'drag of 30 steps took', dragMs, 'ms; long tasks:', lt.length, 'total', Math.round(lt.reduce((a, x) => a + x, 0)), 'ms, max', Math.round(Math.max(0, ...lt)), 'ms');
    await p.close();
  }
  await b.close();
})();
