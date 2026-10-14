// Can a heroic preset (least / ceiling) land a bolted Sprint below his weight (tooGentle) without the slider?
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const S = __dirname;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const url = 'file://' + path.join(S, 'wrapped-branch.html');
  const cases = [];
  for (const near of [0.5, 1, 2, 5]) for (const surface of ['concrete', 'ice']) for (const effort of ['least', 'ceiling']) cases.push({ near, surface, effort });
  for (const cs of cases) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript((st) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); } catch (e) {} }, { action: 'sprint', anchor: 'bolted', near: cs.near, surface: cs.surface, logKg: 9 });
    await page.goto(url);
    await page.waitForSelector('#bay .verdict');
    if (cs.effort !== 'least') await page.selectOption('#effort', cs.effort);
    for (let i = 0; i < 60; i++) { const t = await page.textContent('#bay'); if (!/Working out|working it out/i.test(t)) break; await page.waitForTimeout(500); }
    const out = await page.evaluate(() => {
      const b = document.querySelector('#bay');
      const q = (s) => [...b.querySelectorAll(s)].map((e) => e.textContent.trim());
      return { verdict: q('.verdict')[0], happens: q('ul.happens li').filter((t) => /Bolted/.test(t)), tile: q('.tile')[0] };
    });
    console.log(JSON.stringify(cs), JSON.stringify(out));
    await ctx.close();
  }
  await browser.close();
})();
