const { open } = require('./harness');
(async () => {
  const { browser, page, errs } = await open();
  const r = await page.evaluate(() => { window.__set({ tab: 'throw' }); return window.__snap(); });
  console.log(JSON.stringify(r, null, 1));
  console.log(errs);
  await browser.close();
})();
