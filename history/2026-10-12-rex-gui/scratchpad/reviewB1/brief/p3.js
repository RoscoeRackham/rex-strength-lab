const { open } = require('./page.js');
(async () => {
  const { browser, page, errs, load, pick, text, settle } = await open();
  const allStar = { action: 'throw', obj: 'allstar', logKg: Math.log10(1.81436948e23) + 1e-12, angle: 0, mode: 'comic' };
  for (const extra of [{}, { airAbsorb: 0, keepForm: false }, { airAbsorb: 0.5, keepForm: false }, { airAbsorb: 0.5, keepForm: true }, { airAbsorb: 0, keepForm: true }]) {
    await load(Object.assign({}, allStar, extra)); await pick('#effort', 'allout');
    const t = await text('bay');
    const i = t.indexOf('All-out');
    console.log('=====', JSON.stringify(extra), '\n', t.slice(t.indexOf('Adjust effort'), t.indexOf('Adjust effort') + 4500));
  }
  console.log('ERRS', errs);
  await browser.close();
})();
