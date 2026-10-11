const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('file://' + __dirname + '/preview.html'); await page.waitForTimeout(5000);
  const r = await page.evaluate(() => {
    const ov = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const wide = [...document.querySelectorAll('article.feat, #feats .intro, #ladder .intro, #assume > div')].filter((n) => n.scrollWidth > n.clientWidth + 1).map((n) => n.className + ':' + n.textContent.slice(0, 40));
    return { ov, wide };
  });
  console.log(JSON.stringify(r), errs);
  await page.locator('#feats').screenshot({ path: __dirname + '/feats-390.png' });
  await browser.close();
})();
