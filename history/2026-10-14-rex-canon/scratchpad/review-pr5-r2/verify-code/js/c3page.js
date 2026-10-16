const { open } = require('./page.js');
(async () => {
  const { browser, page, load, tile } = await open();
  await load({ action: 'throw', obj: 'tank', angle: 45, logKg: 16.5 }, 'allout');
  console.log('tank 45 1e16.5 allout |', await tile('bay'));
  console.log('errs', page.errs);
  await browser.close();
})();
