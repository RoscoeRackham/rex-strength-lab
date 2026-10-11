const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const prev = process.env.URL || 'file:///home/user/dino-strength-sim/dist/preview.html';
const out = __dirname;
const cases = JSON.parse(process.argv[2]);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light', ignoreHTTPSErrors: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(prev); await page.waitForTimeout(1200);
  for (let [name, st, sel, idx] of cases) { if (typeof st === "string") st = JSON.parse(st);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, angle: 45, mode: 'comic', inf: false }, s))), st);
    await page.reload(); await page.waitForTimeout(400);
    const els = await page.$$(sel);
    const e = els[idx || 0];
    if (!e) { console.log(name, 'no element', els.length); continue; }
    await e.scrollIntoViewIfNeeded();
    await e.screenshot({ path: out + '/' + name + '.png' });
    console.log(name, 'ok');
  }
  await browser.close();
})();
