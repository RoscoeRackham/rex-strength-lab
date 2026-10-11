const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const files = { cur: __dirname + '/cur-preview.html', prev: __dirname + '/../../audit2/prev_orig.html', fix: __dirname + '/fix-preview.html' };
const scen = [
  ['default car45 comic', null],
  ['car45 real', { mode: 'real', action: 'throw', obj: 'car', angle: 45 }],
  ['shuttle89 real', { mode: 'real', action: 'throw', obj: 'shuttle', angle: 89 }],
];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, st] of scen) for (const which of ['fix']) for (const rate of [1, 4]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    if (st) await ctx.addInitScript((s) => { localStorage.setItem('rex-lab-v1', s); }, JSON.stringify(st));
    const page = await ctx.newPage();
    await page.goto('file://' + files[which]);
    await page.waitForFunction(() => document.querySelector('#ladder-viz svg'));
    await page.waitForTimeout(5000);
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate });
    await page.evaluate(() => { window.__lt = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(Math.round(e.duration)); }).observe({ type: 'longtask' }); window.__frames = 0; const f = () => { window.__frames++; requestAnimationFrame(f); }; requestAnimationFrame(f); });
    const s = await page.$('#strength');
    await s.scrollIntoViewIfNeeded();
    const box = await s.boundingBox();
    // value range 1..34 across the slider width; drag from logKg 4 to 7 over ~1 s with 40 moves
    const xAt = (v) => box.x + box.width * (v - 1) / 33;
    const y = box.y + box.height / 2;
    const v0 = await page.$eval('#strength', (e) => Number(e.value));
    await page.mouse.move(xAt(v0), y); await page.mouse.down();
    const t0 = Date.now();
    await page.evaluate(() => { window.__frames = 0; window.__inputs = 0; document.querySelector('#strength').addEventListener('input', () => window.__inputs++); });
    for (let i = 0; i <= 40; i++) { await page.mouse.move(xAt(4 + 3 * i / 40), y); }
    await page.mouse.up();
    const dt = Date.now() - t0;
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => ({ lt: window.__lt, frames: window.__frames, inputs: window.__inputs, val: document.querySelector('#strength').value, verdict: (document.querySelector('#bay .verdict') || {}).textContent }));
    const lt = r.lt.filter(Boolean);
    console.log(name.padEnd(20), which, 'x' + rate, 'drag ms', dt, 'inputs', r.inputs, 'frames', r.frames, 'longtasks', lt.length, 'max', Math.max(0, ...lt), 'sum', lt.reduce((a, b) => a + b, 0), '|', (r.verdict || '').slice(0, 70));
    await ctx.close();
  }
  await browser.close();
})();
