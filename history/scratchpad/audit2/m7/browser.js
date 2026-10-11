const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { label: 'allstar car bolted', st: { logKg: Math.log10(1.81436948e23), inf: false, anchor: 'bolted', action: 'pull', obj: 'car' } },
    { label: '1e20 car bolted', st: { logKg: 20, inf: false, anchor: 'bolted', action: 'pull', obj: 'car' } },
    { label: '1e20 cc177 bolted', st: { logKg: 20, inf: false, anchor: 'bolted', action: 'pull', obj: 'cc177' } },
    { label: 'inf car bolted', st: { inf: true, anchor: 'bolted', action: 'pull', obj: 'car' } },
    { label: '1e20 car bolted plush (default H/m?)', st: { logKg: 20, inf: false, anchor: 'bolted', action: 'pull', obj: 'car', H: 0.3, m: 0.5 } },
    { label: '1e34 car bolted', st: { logKg: 34, inf: false, anchor: 'bolted', action: 'pull', obj: 'car' } },
  ];
  for (const c of cases) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, Object.assign({ mode: 'comic', surface: 'concrete', groundHolds: false, H: 2, m: 180, angle: 45 }, c.st));
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(800);
    const v = await page.evaluate(() => { const e = document.querySelector('.verdict'); return e ? e.textContent : null; });
    console.log(c.label, '=>', v);
    if (c.label.startsWith('allstar')) {
      await page.screenshot({ path: 'allstar-pull.png', fullPage: false });
      const asm = await page.evaluate(() => [...document.querySelectorAll('*')].filter((e) => e.children.length === 0 && /nothing passes light speed/.test(e.textContent)).map((e) => e.textContent).slice(0, 2));
      console.log('assumption text found:', asm);
    }
    await ctx.close();
  }
  await browser.close();
})();
