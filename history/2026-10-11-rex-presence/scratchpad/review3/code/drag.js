// Drag a slider in the two-player Catch test (real muscle) and record long tasks: does the search pause like it does
// for Rex's strength dial? sliders: '#strength' (Rex's dial), '#o-effort-use' (Ollie's own effort), '#o-strength'.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const url = pathToFileURL(__dirname + '/../preview.html').href;
const which = process.argv[2] || '#o-effort-use';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', JSON.stringify({ group: 'duo', duoAction: 'catch', cObj: 'car', mode: 'real', oSame: false })); sessionStorage.setItem('seeded', '1'); }
    window.__long = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true });
  });
  await page.goto(url);
  const settle = async () => { for (let i = 0; i < 900; i++) { const p = await page.evaluate(() => /Working out|working it out/.test(document.querySelector('#bay').textContent)); if (!p) return; await page.waitForTimeout(100); } };
  await settle();
  if (which === '#o-effort-use') { await page.evaluate(() => { document.querySelector('#duo-effort-use').closest('details').open = true; }); await page.click('#o-effort-own'); await settle(); }
  if (which === '#o-strength') { await page.evaluate(() => { document.querySelector('#o-own').click(); }); await settle(); }
  await page.waitForTimeout(500);
  const info = await page.evaluate((w) => { const s = document.querySelector(w); return { min: Number(s.min), max: Number(s.max), value: Number(s.value) }; }, which);
  await page.evaluate(() => { window.__long = []; });
  const t0 = Date.now();
  // ten drag steps, 50 ms apart, like a pointer drag
  for (let k = 1; k <= 10; k++) {
    const v = info.value - k * Math.min(0.15, (info.value - info.min) / 11);
    await page.evaluate(([w, val]) => { const s = document.querySelector(w); s.focus(); s.value = String(val); s.dispatchEvent(new Event('input', { bubbles: true })); }, [which, v]);
    await page.waitForTimeout(50);
  }
  const dragMs = Date.now() - t0;
  const long = await page.evaluate(() => window.__long.slice());
  console.log(JSON.stringify({ slider: which, dragWallMs: dragMs, longTasksDuringDrag: long, maxTask: Math.max(0, ...long), sum: long.reduce((a, b) => a + b, 0) }));
  await browser.close();
})();
