const { open } = require('./page.js');
(async () => {
  const { browser, page, load, tile } = await open();
  for (const lk of [9, 12]) for (const who of ['rex', 'ollie']) {
    await load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', wrestleWho: who, wAngle: 30, logKg: lk }, null);
    const v = await page.$eval('#duo-bay', (b) => { const m = b.textContent.match(/Effort[^]*?(Least disruptive[^]{0,80})/); return (b.querySelector('.verdict') || {}).textContent; });
    console.log('---', lk, who, 'least |', await tile('duo-bay'), '| verdict:', (v || '').slice(0, 160));
  }
  console.log('errs', page.errs);
  await browser.close();
})();
