// Which slider positions make a render slow? Step the effort slider through its range (input events) and time each render.
const { launch, open, OUT, PREV } = require('./lib');
const INSTR = `
window.__times = [];
const _raf = window.requestAnimationFrame.bind(window);
window.requestAnimationFrame = (cb) => _raf((t) => { const t0 = performance.now(); try { cb(t); } finally { window.__times.push(performance.now() - t0); } });
`;
(async () => {
  const b = await launch();
  const runs = (process.argv[2] ? [JSON.parse(process.argv[2])] : [
    { inf: true, mode: 'real', action: 'throw', group: 'solo' },
    { inf: true, mode: 'comic', action: 'throw', group: 'solo' },
    { inf: true, mode: 'real', action: 'stomp', group: 'solo' },
    { inf: true, mode: 'real', action: 'jump', group: 'solo' },
    { inf: true, mode: 'real', action: 'clap', group: 'solo' },
    { inf: true, mode: 'real', action: 'sprint', group: 'solo' },
    { inf: true, mode: 'real', action: 'pull', group: 'solo' },
  ]);
  for (const s of runs) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(INSTR);
    await page.addInitScript((x) => localStorage.setItem('rex-lab-v1', x), JSON.stringify(s));
    await page.goto(PREV);
    for (let i = 0; i < 200; i++) { await page.waitForTimeout(100); if (!(await page.evaluate(() => /working it out|Working out/i.test(document.querySelector('#bay').innerText)))) break; }
    await page.waitForTimeout(500);
    const r = await page.evaluate(async () => {
      const sl = document.querySelector('#effort-use');
      const lo = Number(sl.min), hi = Number(sl.max);
      const out = [];
      for (let k = 0; k <= 60; k++) {
        const v = lo + (hi - lo) * k / 60;
        const s2 = document.querySelector('#effort-use');
        s2.value = String(v);
        window.__times = [];
        s2.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise((res) => setTimeout(res, 60));
        const t = Math.max(0, ...window.__times);
        out.push([Number(v.toFixed(2)), Math.round(t)]);
      }
      return { lo, hi, out };
    });
    const slow = r.out.filter((x) => x[1] > 50);
    console.log(JSON.stringify(s), 'range', r.lo.toFixed(2), r.hi.toFixed(2), 'max', Math.max(...r.out.map((x) => x[1])), 'ms; slow (log10 kg, ms):', JSON.stringify(slow));
    await ctx.close();
  }
  await b.close();
})();
