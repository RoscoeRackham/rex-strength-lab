const { withPage, grab } = require('./page.js');
const fs = require('fs');
(async () => {
  const errs = await withPage(async (page, load) => {
    const LK = Math.log10(1.81436948e23);
    const runs = [
      ['allstar_D1e3_100', { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cLogD: 3, cStyle: 'hard', logKg: LK }],
      ['allstar_D2e4_100', { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cLogD: Math.log10(2e4), cStyle: 'hard', logKg: LK }],
      ['allstar_D1e6_100', { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cLogD: 6, cStyle: 'hard', logKg: LK }],
      ['allstar_D2e7_100', { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cLogD: 7.3, cStyle: 'hard', logKg: LK }],
      ['allstar_D1e6_50', { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cLogD: 6, cStyle: 'hard', logKg: LK, airAbsorb: 0.5 }],
      ['default_100t_least', { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cLogD: 1, cStyle: 'hard' }],
    ];
    for (const [name, st] of runs) {
      await load(st, null, 'allout');
      const t = await page.evaluate(() => document.querySelector('#duo-bay, details') ? document.body.innerText : document.body.innerText);
      fs.writeFileSync(__dirname + '/catch_' + name + '.txt', t);
      console.log('=====', name, '\n', grab(t, 'Rex fires', 700));
    }
    // and default least effort for burst
    await load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cLogD: 1, cStyle: 'hard' }, null, null);
    const t = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(__dirname + '/catch_default_least.txt', t);
    console.log('===== default least\n', grab(t, 'Rex fires', 700));
  });
  console.log('errors', errs);
})();
