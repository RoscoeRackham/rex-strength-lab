const { open } = require('./lib');
(async () => {
  const { browser, page, errs } = await open(null);
  const t = await page.evaluate(() => {
    const q = (s) => { const n = document.querySelector(s); return n ? n.innerText : null; };
    document.querySelector('#powers').open = true;
    return { aside: q('aside'), duoSum: q('#duo-sum'), ollieSum: q('#ollie-sum'), powersSum: q('#powers-sum'), setupSum: q('#setup-sum'), cue: q('#more-below'), cueHidden: document.querySelector('#more-below').hidden };
  });
  console.log(JSON.stringify(t, null, 1));
  console.log('errs', errs);
  await browser.close();
})();
