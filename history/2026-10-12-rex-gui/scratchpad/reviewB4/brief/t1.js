const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  await load(page, {}, 'throw');
  console.log((await text(page, 'bay')).slice(0, 3000));
  console.log('POWERS:', (await text(page, 'powers')).slice(0, 2000));
  console.log(errs);
  await browser.close();
})();
