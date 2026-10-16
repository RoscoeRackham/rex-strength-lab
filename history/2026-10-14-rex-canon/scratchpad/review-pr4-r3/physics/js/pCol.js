const { open, load, text, settle } = require('./pw.js');
(async () => {
  const { browser, page, errs } = await open();
  await load(page, { duoAction: 'collide' });
  const t = await text(page);
  console.log('=== Collide default least\n' + t.slice(0, 6000));
  const eff = await page.evaluate(() => window.DinoPhys ? 1 : 0);
  console.log('errors', errs);
  await browser.close();
})();
