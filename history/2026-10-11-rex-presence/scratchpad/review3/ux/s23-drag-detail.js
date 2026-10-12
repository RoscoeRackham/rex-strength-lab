// Mouse-drag the effort slider and log each animation-frame callback's duration with the slider value at that moment.
const { launch, PREV, OUT } = require('./lib');
const INSTR = `
window.__times = [];
const _raf = window.requestAnimationFrame.bind(window);
window.requestAnimationFrame = (cb) => { const stack = (new Error()).stack.split('\\n').slice(2, 4).join(' / ').replace(/file:[^)]*preview.html:/g, ''); return _raf((t) => { const s = document.querySelector('#effort-use'); const v = s ? s.value : null; const t0 = performance.now(); try { cb(t); } finally { window.__times.push([Math.round(performance.now() - t0), v && Number(v).toFixed(2), stack.slice(0, 120)]); } }); };
`;
(async () => {
  const b = await launch();
  const s = JSON.parse(process.argv[2] || '{"inf":true,"mode":"real","action":"throw","group":"solo"}');
  for (let rep = 0; rep < 2; rep++) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(INSTR);
    await page.addInitScript((x) => localStorage.setItem('rex-lab-v1', x), JSON.stringify(s));
    await page.goto(PREV);
    for (let i = 0; i < 200; i++) { await page.waitForTimeout(100); if (!(await page.evaluate(() => /working it out|Working out/i.test(document.querySelector('#bay').innerText)))) break; }
    await page.waitForTimeout(1500);
    await page.evaluate(() => { for (const d of document.querySelectorAll('#bay details.effort-adjust')) d.open = true; });
    await page.waitForTimeout(300);
    const el = await page.$('#effort-use');
    await el.scrollIntoViewIfNeeded();
    const box = await el.boundingBox();
    const y = box.y + box.height / 2, x0 = box.x + 8, x1 = box.x + box.width - 8;
    await page.evaluate(() => { window.__times = []; });
    await page.mouse.move(x0 + (x1 - x0) * 0.1, y);
    await page.mouse.down();
    for (let i = 0; i <= 30; i++) { await page.mouse.move(x0 + (x1 - x0) * (0.1 + 0.8 * i / 30), y); await page.waitForTimeout(16); }
    await page.mouse.up();
    await page.waitForTimeout(800);
    const t = await page.evaluate(() => window.__times);
    console.log('rep', rep, 'frames', t.length, 'slow:', JSON.stringify(t.filter((x) => x[0] > 50)));
    await ctx.close();
  }
  await b.close();
})();
