const { open, view } = require('./h.js');
const fs = require('fs');
(async () => {
  const { browser, page, errs } = await open();
  const out = {};
  const cases = [
    ['ball-allout-100', { obj: 'baseball' }, 'allout'],
    ['ball-1e6-100', { obj: 'baseball', logKg: 6 }, 'allout'],
    ['ball-1e6-50', { obj: 'baseball', logKg: 6, airAbsorb: 0.5 }, 'allout'],
    ['ball-1e6-0', { obj: 'baseball', logKg: 6, airAbsorb: 0 }, 'allout'],
    ['ball-1e6-0-nokeep', { obj: 'baseball', logKg: 6, airAbsorb: 0, keepForm: false }, 'allout'],
    ['allstar-100', { obj: 'baseball', logKg: Math.log10(1.8e23), angle: 0 }, 'allout'],
    ['allstar-50', { obj: 'baseball', logKg: Math.log10(1.8e23), angle: 0, airAbsorb: 0.5 }, 'allout'],
    ['allstar-0', { obj: 'baseball', logKg: Math.log10(1.8e23), angle: 0, airAbsorb: 0 }, 'allout'],
    ['allstar-0-nokeep', { obj: 'baseball', logKg: Math.log10(1.8e23), angle: 0, airAbsorb: 0, keepForm: false }, 'allout'],
    ['allstar-50-nokeep', { obj: 'baseball', logKg: Math.log10(1.8e23), angle: 0, airAbsorb: 0.5, keepForm: false }, 'allout'],
    ['allstar-off', { obj: 'baseball', logKg: Math.log10(1.8e23), angle: 0, airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, 'allout'],
  ];
  for (const [k, st, eff] of cases) out[k] = await view(page, st, 'throw', eff);
  fs.writeFileSync('dump2.json', JSON.stringify(out, null, 1));
  console.log('errs', errs);
  await browser.close();
})();
