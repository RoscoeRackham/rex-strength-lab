const { open, settle } = require('./lib.js');
(async () => {
  for (const which of ['main', 'branchfix']) for (const act of ['arm', 'collide']) for (const e of ['allout', 'custom']) {
    const { browser, page, errs } = await open(which, { duoOpen: true, duoAction: act });
    await settle(page, '#duo-bay');
    const before = await page.evaluate(() => document.querySelector('#duo-bay .effort-read').innerText.replace(/\n+/g, ' | '));
    await page.selectOption('#duo-effort', e);
    await page.waitForTimeout(1500);
    await settle(page, '#duo-bay');
    await page.waitForTimeout(3000);
    const read = await page.evaluate(() => document.querySelector('#duo-bay .effort-read').innerText.replace(/\n+/g, ' | '));
    console.log(which, act, e, '\n   least:', before.slice(0, 220), '\n   after:', read.slice(0, 300));
    if (errs.length) console.log('errs', errs);
    await browser.close();
  }
})();
