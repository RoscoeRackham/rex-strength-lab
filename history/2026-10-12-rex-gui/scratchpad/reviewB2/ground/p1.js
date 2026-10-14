const { open, waitDone, chromium } = require('./page.js');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await open(browser, { surface: 'sand', action: 'stomp', logKg: 12 });
  await page.selectOption('#effort', 'windows');
  await page.waitForTimeout(500);
  const t = await waitDone(page, '#bay');
  console.log(t.slice(0, 3000));
  console.log('ERRS', page.errs);
  await page.screenshot({ path: __dirname + '/stomp-sand-windows.png', fullPage: false });
  await browser.close();
})();
