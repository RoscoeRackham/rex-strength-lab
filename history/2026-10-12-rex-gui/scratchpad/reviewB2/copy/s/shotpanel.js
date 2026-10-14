const L = require('./lib.js');
(async () => {
  const { browser, page } = await L.open({ w: 390, h: 844, scheme: process.argv[2] || 'light' });
  await L.load(page, { airAbsorb: 0.3 });
  await page.evaluate(() => { document.getElementById('powers').open = true; });
  await page.waitForTimeout(300);
  const el = await page.$('#powers');
  await el.screenshot({ path: process.argv[3] });
  await browser.close();
})();
