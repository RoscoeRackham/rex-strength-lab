const { open } = require('./page.js');
(async () => {
  const { browser, page, errs, load, pick, text, settle } = await open();
  await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(800); await settle('bay');
  const t = await text('bay'); const i = t.indexOf('Adjust effort');
  console.log(t.slice(i, i + 2200));
  await page.screenshot({ path: 'default-throw.png', fullPage: false });
  console.log('ERRS', errs);
  await browser.close();
})();
