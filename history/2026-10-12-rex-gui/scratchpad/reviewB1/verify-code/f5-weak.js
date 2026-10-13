const { open, settle } = require('./lib.js');
(async () => {
  for (const act of ['arm', 'collide']) for (const e of ['plaster', 'ground', 'rattle']) {
    const { browser, page, errs } = await open('branch', { duoOpen: true, duoAction: act, logKg: 3 });
    await settle(page, '#duo-bay');
    await page.selectOption('#duo-effort', e);
    await page.waitForTimeout(800);
    await settle(page, '#duo-bay');
    const read = await page.evaluate(() => document.querySelector('#duo-bay .effort-read').innerText.replace(/\n+/g, ' | '));
    const bad = await page.evaluate(() => /undefined|NaN/.test(document.querySelector('#duo-bay').innerText));
    console.log(act, e, 'undefined/NaN in bay:', bad, '::', read.slice(0, 250));
    if (errs.length) console.log(errs);
    await browser.close();
  }
})();
