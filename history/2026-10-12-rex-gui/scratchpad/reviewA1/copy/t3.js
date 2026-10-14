const { open, settle, S } = require('./lib');
const fs = require('fs');
(async () => {
  for (const which of ['new', 'old']) {
    const { browser, page, errs } = await open(which, null);
    await settle(page);
    await page.waitForTimeout(3000);
    await page.evaluate(() => { for (const d of document.querySelectorAll('details')) d.open = true; });
    await page.waitForTimeout(3000);
    const txt = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(S + '/out/full-' + which + '.txt', txt);
    await browser.close();
  }
})();
