const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const st of [{ action: 'throw', obj: 'loco', logKg: 18.7, angle: 80 }, { action: 'throw', obj: 'titanic', logKg: 20, angle: 45 }]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript((s) => localStorage.setItem('rex-lab-v1', s), JSON.stringify(st));
    const page = await ctx.newPage();
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(800);
    const r = await page.evaluate(() => ({ verdict: document.querySelector('.verdict').textContent, distTile: [...document.querySelectorAll('.tile')].find(t => t.querySelector('.k').textContent === 'Distance').textContent, chartTop: [...document.querySelectorAll('#bay svg text')].map(t => t.textContent).find(t => t.startsWith('top')) }));
    console.log(JSON.stringify(st), JSON.stringify(r));
    if (st.obj === 'loco') await page.locator('main.panel').screenshot({ path: __dirname + '/lay_apex-mismatch-loco.png' });
    await ctx.close();
  }
  await browser.close();
})();
