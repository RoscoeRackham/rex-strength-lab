// Time the render at each slider position on a fine grid (input events, one per frame).
const { launch, PREV } = require('./lib');
const INSTR = `
window.__times = [];
const _raf = window.requestAnimationFrame.bind(window);
window.requestAnimationFrame = (cb) => _raf((t) => { const t0 = performance.now(); try { cb(t); } finally { window.__times.push(performance.now() - t0); } });
`;
(async () => {
  const b = await launch();
  const s = JSON.parse(process.argv[2] || '{"inf":true,"mode":"real","action":"throw","group":"solo"}');
  const a = Number(process.argv[3] || 1.5), z = Number(process.argv[4] || 34), st = Number(process.argv[5] || 0.05);
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(INSTR);
  await page.addInitScript((x) => localStorage.setItem('rex-lab-v1', x), JSON.stringify(s));
  await page.goto(PREV);
  for (let i = 0; i < 200; i++) { await page.waitForTimeout(100); if (!(await page.evaluate(() => /working it out|Working out/i.test(document.querySelector('#bay').innerText)))) break; }
  await page.waitForTimeout(800);
  const r = await page.evaluate(async ([a, z, st]) => {
    const out = [];
    for (let v = a; v <= z + 1e-9; v += st) {
      const s2 = document.querySelector('#effort-use');
      s2.value = String(v);
      window.__times = [];
      s2.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((res) => requestAnimationFrame(() => setTimeout(res, 0)));
      await new Promise((res) => setTimeout(res, 5));
      out.push([Number(Number(s2.value).toFixed(2)), Math.round(Math.max(0, ...window.__times)), (document.querySelector('#bay .verdict') || {}).textContent.slice(0, 70)]);
    }
    return out;
  }, [a, z, st]);
  const slow = r.filter((x) => x[1] > 50);
  console.log('positions', r.length, 'max', Math.max(...r.map((x) => x[1])), 'ms; over 50 ms:', slow.length);
  for (const x of slow.slice(0, 40)) console.log('  ', JSON.stringify(x));
  await ctx.close();
  await b.close();
})();
