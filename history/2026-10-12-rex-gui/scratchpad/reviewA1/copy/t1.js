const { open, settle } = require('./lib');
(async () => {
  const { browser, page, errs } = await open('new', null);
  await settle(page);
  const out = await page.evaluate(() => {
    const t = (s) => { const e = document.querySelector(s); return e ? e.innerText : null; };
    return { aside: t('aside'), duoSum: t('#duo-sum'), duoOpen: document.querySelector('#duo').open, powersSum: t('#powers-sum'), setupSum: t('#setup-sum'), ollieSum: t('#ollie-sum') };
  });
  console.log(JSON.stringify(out, null, 1));
  console.log('errs', errs);
  await browser.close();
})();
