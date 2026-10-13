const { withPage, DIR } = require('./page.js');
const fs = require('fs');
(async () => {
  const errs = await withPage(async (page, load) => {
    for (const [logD, share] of [[6, 1], [7.3, 1], [6, 0.5]]) {
      await load({ action: 'throw', duoOpen: true, duoAction: 'catch', cObj: 'baseball', cLogD: logD, cStyle: 'hard', logKg: Math.log10(1.81436948e23) + 1e-12, airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true }, null, 'allout');
      const t = await page.evaluate(() => document.body.innerText);
      fs.writeFileSync(DIR + '/catch_' + logD + '_' + share + '.txt', t);
    }
  });
  console.log('errors', errs);
})();
