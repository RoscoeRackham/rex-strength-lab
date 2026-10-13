const open = require('./pw.js');
(async () => {
  const { browser, page, load } = await open(390, 'dark');
  await load({ action: 'punch', logKg: 1 }, false);
  const t = await page.$$('#bay .tiles');
  if (t[0]) await t[0].screenshot({ path: process.env.S + '/tiles390.png' });
  await browser.close();
})();
