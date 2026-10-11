const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    ['throw_default', null],
    ['lift_meter', { logKg: 3.5, inf:false, mode:'comic', surface:'concrete', groundHolds:false, anchor:'friction', H:2, m:180, action:'lift', obj:'car', angle:45 }],
  ];
  for (const scheme of ['light','dark']) for (const [name, st] of cases) {
    const ctx = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    if (st) await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(1200);
    const info = await page.evaluate(() => {
      const g = document.querySelector('#bay svg path[stroke-opacity="0.55"]');
      const meters = [...document.querySelectorAll('#bay svg[aria-label*="capacity"]')].map(s=>s.getAttribute('aria-label'));
      const st = [...document.querySelectorAll('#bay .status')].map(s=>s.textContent);
      const legend = [...document.querySelectorAll('#bay span')].filter(s=>/no air/.test(s.textContent)).length;
      return { ghost: !!g, meters, st, legend };
    });
    console.log(scheme, name, JSON.stringify(info));
    const bay = await page.$('main.panel');
    await bay.screenshot({ path: `l08_${name}_${scheme}.png` });
    await ctx.close();
  }
  await browser.close();
})();
