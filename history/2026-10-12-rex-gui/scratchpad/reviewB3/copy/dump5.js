const { open, view } = require('./h.js');
const fs = require('fs');
(async () => {
  const { browser, page, errs } = await open();
  const out = {};
  for (const [k, st, tab, eff] of [
    ['catch-1e8-100', { cStyle: 'hard', cObj: 'baseball', logKg: 8 }, 'catch', 'allout'],
    ['catch-1e8-50', { cStyle: 'hard', cObj: 'baseball', logKg: 8, airAbsorb: 0.5 }, 'catch', 'allout'],
    ['catch-1e8-50-nokeep', { cStyle: 'hard', cObj: 'baseball', logKg: 8, airAbsorb: 0.5, keepForm: false }, 'catch', 'allout'],
    ['catch-allstar-100', { cStyle: 'hard', cObj: 'baseball', logKg: Math.log10(1.8e23) }, 'catch', 'allout'],
    ['catch-allstar-50', { cStyle: 'hard', cObj: 'baseball', logKg: Math.log10(1.8e23), airAbsorb: 0.5 }, 'catch', 'allout'],
    ['catch-partner', { cObj: 'partner' }, 'catch', null],
    ['catch-partner-allout', { cObj: 'partner' }, 'catch', 'allout'],
    ['catch-partner-1e8', { cObj: 'partner', logKg: 8 }, 'catch', 'allout'],
    ['catch-car-1e8-100', { cStyle: 'hard', cObj: 'car', logKg: 8 }, 'catch', 'allout'],
    ['catch-car-1e8-100-windows', { cStyle: 'hard', cObj: 'car', logKg: 8 }, 'catch', 'windows'],
    ['catch-car-1e10-100-block', { cStyle: 'hard', cObj: 'car', logKg: 10 }, 'catch', 'block'],
  ]) { out[k] = await view(page, st, tab, eff); console.log('done', k); fs.writeFileSync('dump5.json', JSON.stringify(out, null, 1)); }
  console.log('errs', errs);
  await browser.close();
})();
