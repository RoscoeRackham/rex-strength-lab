const { open, settle } = require('./lib');
(async () => {
  const { browser, page, errs } = await open('new', null);
  await settle(page);
  await page.evaluate(() => { document.querySelector('#powers').open = true; });
  await page.waitForTimeout(300);
  console.log(await page.evaluate(() => document.querySelector('#powers').innerText));
  await page.evaluate(() => { document.querySelector('#duo').open = true; });
  await page.waitForTimeout(500);
  await settle(page, '#duo-bay');
  await page.evaluate(() => { document.querySelector('#ollie-setup').open = true; });
  console.log('==== DUO');
  console.log(await page.evaluate(() => document.querySelector('#duo').innerText.slice(0, 3000)));
  console.log('ollie-sum:', await page.evaluate(() => document.querySelector('#ollie-sum').textContent));
  console.log('errs', errs);
  await browser.close();
})();
