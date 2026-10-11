const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const [w, h, scheme, sel, out, dpr, hash] = process.argv.slice(2);
  const page = await (await browser.newContext({ viewport: { width: +w, height: +h }, colorScheme: scheme, deviceScaleFactor: +(dpr || 2) })).newPage();
  await page.goto('file://' + __dirname + '/mock.html' + (hash ? '#' + hash : ''), { waitUntil: 'networkidle' });
  if (hash) await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const el = await page.$(sel);
  await el.screenshot({ path: __dirname + '/' + out });
  await browser.close();
})();
