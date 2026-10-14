const { open } = require('./page.js');
(async () => {
  const { browser, page, errs, load, pick, text, settle } = await open();
  for (const surface of ['granite', 'concrete', 'sand']) {
    await load({ action: 'stomp', surface });
    const t = await text('bay');
    const i = t.indexOf('Effort');
    console.log('=====', surface, '\n', t.slice(0, 2600));
  }
  console.log('ERRS', errs);
  await browser.close();
})();
