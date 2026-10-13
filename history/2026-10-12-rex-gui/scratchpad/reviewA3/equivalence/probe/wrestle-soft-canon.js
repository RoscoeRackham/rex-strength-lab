// Wrestle push on sand with a heavy Rex: does the walking-drive sentence and formula match the engine's numbers?
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = path.join(__dirname, '..');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [v, st] of [['main', { group: 'duo' }], ['branch', { duoOpen: true }]]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript((s) => { localStorage.setItem('rex-lab-v1', s); }, JSON.stringify(Object.assign({ duoAction: 'wrestle', wrestleMove: 'push', wrestleWho: 'rex', surface: 'sand', H: 3.048, m: 3007, logKg: 9 }, st)));
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(S, v + '.html'));
    const sel = v === 'main' ? '#bay' : '#duo-bay';
    for (let i = 0; i < 100; i++) { const t = await page.evaluate((s) => document.querySelector(s).textContent, sel); if (!/working it out|working out/i.test(t)) break; await page.waitForTimeout(200); }
    await page.waitForTimeout(500);
    const r = await page.evaluate((s) => { const b = document.querySelector(s); const q = (x) => Array.from(b.querySelectorAll(x)).map((e) => e.textContent.replace(/\s+/g, ' ').trim()); return { verdict: q('.verdict'), happens: Array.from(b.querySelectorAll('.happens li')).map((e) => e.textContent), math: q('.math .eq') }; }, sel);
    console.log('==', v); console.log(' verdict:', r.verdict[0]); console.log(' item 2:', r.happens[1]); console.log(' math:', r.math[0]);
    await ctx.close();
  }
  await browser.close();
})();
