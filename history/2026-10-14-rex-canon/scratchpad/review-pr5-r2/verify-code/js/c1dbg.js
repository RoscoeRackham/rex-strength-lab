const { open } = require('./page.js');
(async () => {
  const { browser, page, load, tile, text } = await open();
  await load({ duoOpen: true, duoAction: 'arm', logKg: 9, oSame: false, oLogKg: 8 }, 'allout');
  console.log((await text('duo-bay')).slice(0, 2500));
  await browser.close();
})();
