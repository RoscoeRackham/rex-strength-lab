const { launch, OUT, PREV } = require('./lib');
// Time every timer/raf callback (renders run inside them) while the effort slider gets 60 Hz input events.
(async () => {
  const b = await launch();
  const cases = [
    { name: 'throw-inf-real', st: { action: 'throw', inf: true, mode: 'real' }, sl: '#effort-use', from: 0.95, to: 0.05 },
    { name: 'throw-inf-real-high', st: { action: 'throw', inf: true, mode: 'real' }, sl: '#effort-use', from: 0.95, to: 0.6 },
    { name: 'throw-100t-real', st: { action: 'throw', mode: 'real' }, sl: '#effort-use', from: 1, to: 0 },
    { name: 'stomp-inf', st: { action: 'stomp', inf: true }, sl: '#effort-use', from: 0.95, to: 0.05 },
    { name: 'pull-inf-real', st: { action: 'pull', inf: true, mode: 'real' }, sl: '#effort-use', from: 0.95, to: 0.05 },
    { name: 'walk', st: { action: 'walk' }, sl: '#step-effort', from: 0, to: 1 },
    { name: 'duo-catch', st: { group: 'duo', duoAction: 'catch' }, sl: '#duo-effort-use', from: 1, to: 0 },
    { name: 'duo-wrestle-throw', st: { group: 'duo', duoAction: 'wrestle', wrestleMove: 'throw' }, sl: '#duo-effort-use', from: 1, to: 0 },
  ];
  for (const cs of cases) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript((s) => {
      localStorage.setItem('rex-lab-v1', JSON.stringify(s));
      window.__cb = [];
      const wrap = (fn, kind) => function () { const t = performance.now(); try { return fn.apply(this, arguments); } finally { const d = performance.now() - t; if (d > 4) window.__cb.push([kind, Math.round(d)]); } };
      const st = window.setTimeout; window.setTimeout = (fn, ms, ...a) => st(typeof fn === 'function' ? wrap(fn, 't' + (ms || 0)) : fn, ms, ...a);
      const raf = window.requestAnimationFrame; window.requestAnimationFrame = (fn) => raf(wrap(fn, 'raf'));
    }, cs.st);
    await page.goto(PREV);
    await page.waitForSelector(cs.sl, { timeout: 60000 });
    await page.waitForTimeout(3000);
    await page.evaluate(() => { window.__cb = []; window.__muts = 0; new MutationObserver(() => window.__muts++).observe(document.querySelector('#bay'), { childList: true }); });
    // 60 events over 1 s, as a drag would send, then let it settle
    const res = await page.evaluate(async ({ sl: sel, from, to }) => {
      const s = document.querySelector(sel); const lo = Number(s.min), hi = Number(s.max);
      const reads = [];
      const t0 = performance.now();
      for (let i = 0; i < 60; i++) {
        s.value = String(lo + (hi - lo) * (from + (to - from) * i / 59));
        s.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise((r) => setTimeout(r, 16));
        if (i % 10 === 9) reads.push(((document.querySelector('.effort-read b') || {}).textContent || (document.querySelector('#bay .verdict') || {}).textContent || '').slice(0, 60));
      }
      const tDrag = performance.now() - t0;
      const mutsDuring = window.__muts;
      await new Promise((r) => setTimeout(r, 1500));
      return { tDrag: Math.round(tDrag), mutsDuring, mutsAfter: window.__muts, reads, slow: window.__cb.filter((x) => x[1] > 4) };
    }, cs);
    const slow = res.slow.map((x) => x[1]);
    console.log('==', cs.name, 'drag wall', res.tDrag, 'ms; bay updates during drag', res.mutsDuring, 'after', res.mutsAfter, '; callbacks >4ms:', slow.length, 'max', Math.max(0, ...slow), 'sum', slow.reduce((a, x) => a + x, 0));
    console.log('   kinds', JSON.stringify(res.slow.slice(0, 30)));
    console.log('   readout during drag', JSON.stringify(res.reads));
    await ctx.close();
  }
  await b.close();
})();
