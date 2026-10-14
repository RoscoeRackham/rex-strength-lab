const { open, waitDone, chromium } = require('./page.js');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const st of [{ action: 'stomp' }, { action: 'jump' }, { action: 'throw' }, { action: 'stomp', surface: 'sand', logKg: 12 }]) {
    const page = await open(browser, st);
    await page.selectOption('#effort', 'ground');
    await page.waitForTimeout(500);
    const t = await waitDone(page, '#bay');
    const s = t.indexOf('Custom (use the slider)');
    console.log('=== ', JSON.stringify(st));
    console.log(t.slice(s + 60, s + 1500));
    console.log('ERRS', page.errs);
    await page.close();
  }
  await browser.close();
})();
