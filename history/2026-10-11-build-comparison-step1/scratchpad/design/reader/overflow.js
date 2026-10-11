const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await page.goto('file://' + __dirname + '/mock.html', { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > 390.5).slice(0, 15).map(e => e.tagName + '.' + e.className.baseVal + e.className + ' ' + Math.round(e.getBoundingClientRect().right)));
  console.log(r.join('\n'));
  await browser.close();
})();
