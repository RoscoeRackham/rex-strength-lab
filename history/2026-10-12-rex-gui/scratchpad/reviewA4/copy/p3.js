const { open } = require('./lib');
(async () => {
  const { browser, page, errs } = await open(null, { wait: 800 });
  const dump = async (lbl) => console.log(lbl, '|', await page.evaluate(() => ['#setup-sum','#powers-sum','#duo-sum','#ollie-sum'].map(s=>document.querySelector(s).textContent).join('  |  ')));
  await page.evaluate(() => { document.querySelector('#powers').open = true; document.querySelector('#duo').open = true; document.querySelector('#ollie-setup').open = true; });
  await page.waitForTimeout(500);
  await page.click('#o-own'); await page.waitForTimeout(300); await dump('o-own');
  await page.check('#o-inf'); await page.waitForTimeout(300); await dump('o-inf');
  for (const v of ['gradual','instant','runaway']) { await page.selectOption('#absorb', v); await page.waitForTimeout(300); await dump(v); }
  await page.check('#bolt-ollie'); await page.waitForTimeout(300); await dump('bolt-ollie');
  console.log(errs);
  await browser.close();
})();
