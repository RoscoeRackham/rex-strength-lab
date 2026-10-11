const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [surface, logKg, inf] of [['gravel',34,false],['gravel',34,true],['softclay',34,false],['softclay',34,true]]) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, { logKg, inf, mode: 'real', surface, groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'jump', obj: 'car', angle: 45 });
    await page.goto('file:///home/user/dino-strength-sim/dist/index.html');
    await page.waitForTimeout(1500);
    const txt = await page.evaluate(() => { const v = document.querySelector('.verdict'); const chips = [...document.querySelectorAll('.status')].map(e=>e.textContent); return (v ? v.textContent : '(no verdict)') + ' | ' + chips.join(' ; '); });
    console.log(surface, inf ? 'INF' : '1e'+logKg, '=>', txt);
    await ctx.close();
  }
  await browser.close();
})();
