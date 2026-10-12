const { open, tab } = require('./libnew');
(async () => {
  const { browser, page } = await open({ w: 1280, h: 900, saved: { logKg: 25, action: 'throw' } });
  await tab(page, 'throw', false, 4000);
  console.log(await page.$eval('#bay .effort-read', (e) => e.innerText));
  const sig = await page.evaluate(() => 100 * 26600 / 1e25);
  console.log('true share % for 26.6 t at 1e25 kg:', sig);
  await browser.close();
})();
