const { withPage, DIR } = require('./page.js');
const fs = require('fs');
(async () => {
  const errs = await withPage(async (page, load) => {
    for (const [logKg, eff] of [[Math.log10(100 * 907.18474), 'allout'], [Math.log10(100 * 907.18474), 'least']]) {
      await load({ action: 'throw', duoOpen: true, duoAction: 'catch', cObj: 'baseball', cLogD: 1, cStyle: 'hard', logKg }, null, eff);
      const t = await page.evaluate(() => document.body.innerText);
      const i = t.indexOf('Rex fires the baseball');
      console.log('==== ', eff, '\n', t.slice(i, i + 1600));
    }
  });
  console.log('errors', errs);
})();
