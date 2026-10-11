// screenshot specific element: node crop.js width scheme selector outname [stateJSON]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const [w, scheme, sel, out, st] = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: +w, height: 900 }, colorScheme: scheme });
  if (st) await ctx.addInitScript((s) => { localStorage.setItem('rex-lab-v1', s); }, st);
  const page = await ctx.newPage();
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(1000);
  const e = await page.$(sel);
  await e.screenshot({ path: __dirname + '/' + out });
  await browser.close();
})();
