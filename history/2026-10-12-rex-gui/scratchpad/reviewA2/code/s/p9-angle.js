// dragging Rex's Throw angle slider: how long the main thread is blocked, element closed vs open (each tab)
const { wrap, launch, settle, S } = require('./h.js');
const path = require('path');
const id = process.argv[2] || 'angle', base = JSON.parse(process.argv[3] || '{"action":"throw"}');
(async () => {
  const b = await launch();
  for (const [label, extra] of [['closed', { duoOpen: false }], ['open-arm', { duoOpen: true, duoAction: 'arm' }], ['open-wrestle', { duoOpen: true, duoAction: 'wrestle' }], ['open-catch', { duoOpen: true, duoAction: 'catch' }], ['open-collide', { duoOpen: true, duoAction: 'collide' }]]) {
    const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await p.goto(wrap(path.join(S, 'lab/dist/index.html'), 'new'));
    await p.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({}, base, extra));
    await p.reload(); await p.waitForTimeout(800); await settle(p, 'bay'); if (extra.duoOpen) await settle(p, 'duo-bay');
    // warm: one step so plans for nearby angles exist like in a real drag
    await p.evaluate(() => { window.__lt = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(e.duration); }).observe({ type: 'longtask' }); });
    const t0 = Date.now();
    const frames = await p.evaluate(async (sid) => { const s = document.getElementById(sid); s.focus(); const v0 = Number(s.value); let fr = 0; let on = true; (function f() { fr++; if (on) requestAnimationFrame(f); })();
      for (let i = 0; i < 20; i++) { s.value = String(Math.min(Number(s.max), v0 + (sid === "angle" ? 1 : 0.05) * (i + 1))); s.dispatchEvent(new Event('input', { bubbles: true })); await new Promise((r) => setTimeout(r, 16)); }
      on = false; return fr; }, id);
    const ms = Date.now() - t0;
    await p.waitForTimeout(1500);
    const lt = await p.evaluate(() => window.__lt);
    console.log(label.padEnd(13), '20 steps in', ms, 'ms;', frames, 'frames painted; long tasks', lt.length, 'total', Math.round(lt.reduce((a, x) => a + x, 0)), 'ms, max', Math.round(Math.max(0, ...lt)));
    await p.close();
  }
  await b.close();
})();
