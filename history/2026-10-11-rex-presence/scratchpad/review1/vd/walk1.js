const { open } = require('./pw.js');
(async () => {
  const { browser, page, tab, bay, errs, openAll } = await open();
  await tab('walk');
  await openAll();
  const t = await bay();
  console.log(t);
  console.log('ERRS', errs);
  await browser.close();
})();
