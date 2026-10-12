const { open } = require('./pw.js');
(async () => {
  const { browser, page, tab, bay } = await open();
  await tab('throw');
  await page.selectOption('#obj', 'person');
  await page.waitForTimeout(2500);
  await page.selectOption('#effort', 'ceiling');
  await page.waitForTimeout(2500);
  const t = await bay();
  const lines = t.split('\n').filter((l) => /Launch:|Courtesy|Effort:|g for|ceiling|flies|injury/i.test(l));
  console.log(lines.join('\n'));
  await browser.close();
})();
