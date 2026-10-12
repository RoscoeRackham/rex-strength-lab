const { open } = require('./pw.js');
(async () => {
  const { browser, page, tab, bay, errs, openAll } = await open();
  await tab('throw');
  await page.selectOption('#obj', 'person');
  await page.waitForTimeout(2500);
  await openAll();
  await page.waitForTimeout(500);
  const t = await bay();
  console.log(t);
  console.log('ERRS', errs);
  await browser.close();
})();
