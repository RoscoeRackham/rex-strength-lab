const { open } = require('./page.js');
(async () => {
  const { browser, page, errs, load, pick, text, settle } = await open();
  await load({ action: 'stomp' });
  await page.waitForTimeout(4000);
  const lad = await page.evaluate(() => { const t = document.body.innerText; const i = t.indexOf('Stomp felt'); return t.slice(Math.max(0, i - 600), i + 400); });
  console.log(lad);
  console.log('ERRS', errs);
  await browser.close();
})();
