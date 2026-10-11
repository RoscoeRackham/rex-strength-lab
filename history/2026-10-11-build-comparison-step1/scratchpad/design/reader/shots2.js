const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, scheme] of [[1280, 'light'], [1280, 'dark'], [390, 'light']]) {
    const page = await (await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: scheme })).newPage();
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto('file://' + __dirname + '/styles.html', { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${__dirname}/styles-${w}-${scheme}.png`, fullPage: true });
    console.log(w, scheme, errs.join('|'), await page.evaluate(() => document.documentElement.scrollWidth));
  }
  await browser.close();
})();
