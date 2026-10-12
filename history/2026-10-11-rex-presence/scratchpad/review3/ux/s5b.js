// Drag the effort sliders with the mouse; time each render (rAF callbacks and timers) and long tasks; check the readout follows.
const { launch, open, OUT } = require('./lib');
const INSTR = `
window.__times = []; window.__long = [];
const _raf = window.requestAnimationFrame.bind(window);
window.requestAnimationFrame = (cb) => _raf((t) => { const t0 = performance.now(); try { cb(t); } finally { window.__times.push(['raf', performance.now() - t0]); } });
const _st = window.setTimeout.bind(window);
window.setTimeout = (cb, ms, ...a) => _st(() => { const t0 = performance.now(); try { cb(...a); } finally { const d = performance.now() - t0; if (d > 5) window.__times.push(['timeout', d]); } }, ms);
try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(Math.round(e.duration)); }).observe({ entryTypes: ['longtask'] }); } catch (e) {}
`;
async function drag(page, sel, label, readSel) {
  await page.evaluate(() => { for (const d of document.querySelectorAll('#bay details.effort-adjust')) d.open = true; });
  await page.waitForTimeout(200);
  const el = await page.$(sel);
  await el.scrollIntoViewIfNeeded();
  const box = await el.boundingBox();
  await page.evaluate(() => { window.__times = []; window.__long = []; });
  const y = box.y + box.height / 2;
  const x0 = box.x + 8, x1 = box.x + box.width - 8;
  // start near the left, drag right in 30 steps
  await page.mouse.move(x0 + (x1 - x0) * 0.1, y);
  await page.mouse.down();
  const reads = [];
  const t0 = Date.now();
  for (let i = 0; i <= 30; i++) {
    await page.mouse.move(x0 + (x1 - x0) * (0.1 + 0.8 * i / 30), y);
    await page.waitForTimeout(16);
    if (i % 6 === 0) reads.push(await page.evaluate((r) => { const e = document.querySelector(r); return e ? e.innerText.split('\n')[0].slice(0, 90) : null; }, readSel));
  }
  await page.mouse.up();
  const dt = Date.now() - t0;
  await page.waitForTimeout(800);
  const res = await page.evaluate((s) => { const e = document.querySelector(s); return { connected: !!e, value: e && e.value, vt: e && e.getAttribute('aria-valuetext'), times: window.__times, long: window.__long }; }, sel);
  const raf = res.times.filter((x) => x[0] === 'raf').map((x) => x[1]), to = res.times.filter((x) => x[0] === 'timeout').map((x) => x[1]);
  const st = (a) => a.length ? { n: a.length, max: Math.round(Math.max(...a)), med: Math.round(a.slice().sort((p, q) => p - q)[a.length >> 1]), over50: a.filter((x) => x > 50).length } : null;
  console.log(label, 'drag wall', dt, 'ms; rAF renders', JSON.stringify(st(raf)), 'timeouts>5ms', JSON.stringify(st(to)), 'longtasks', JSON.stringify(res.long.slice(0, 20)), 'final', res.value, res.vt);
  for (const r of reads) console.log('   read:', r);
}
(async () => {
  const b = await launch();
  const runs = [['throw inf comic', { inf: true, mode: 'comic', action: 'throw', group: 'solo' }, '#effort-use', '.effort-read'],['throw inf comic', { inf: true, mode: 'comic', action: 'throw', group: 'solo' }, '#effort-use', '.effort-read'],['throw inf comic', { inf: true, mode: 'comic', action: 'throw', group: 'solo' }, '#effort-use', '.effort-read']];
  for (const [label, s, sel, rd] of runs) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(INSTR);
    await page.addInitScript((x) => localStorage.setItem('rex-lab-v1', x), JSON.stringify(s));
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    const tl = Date.now();
    await page.goto(require('./lib').PREV);
    for (let i = 0; i < 200; i++) { await page.waitForTimeout(100); if (!(await page.evaluate(() => /working it out|Working out/.test(document.querySelector('#bay').innerText)))) break; }
    const load = await page.evaluate(() => ({ long: window.__long.slice(0, 10) }));
    console.log('==', label, 'settled', Date.now() - tl, 'ms after goto; long tasks at load', JSON.stringify(load.long));
    await drag(page, sel, label, rd);
    if (errs.length) console.log('  errs', errs);
    await ctx.close();
  }
  await b.close();
})();
