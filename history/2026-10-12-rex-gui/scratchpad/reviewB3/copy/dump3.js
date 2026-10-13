const { open, view } = require('./h.js');
const fs = require('fs');
(async () => {
  const { browser, page, errs } = await open();
  const out = {};
  const box = async (st, tab, eff) => { const t = await view(page, st, tab, eff); return t; };
  for (const [k, st, eff] of [
    ['car-windows-100-d7', { obj: 'car', logKg: 7 }, 'windows'],
    ['car-windows-100-d10', { obj: 'car', logKg: 10, angle: 0 }, 'windows'],
    ['car-houses-100-d10', { obj: 'car', logKg: 10, angle: 0 }, 'houses'],
    ['car-block-100-d10', { obj: 'car', logKg: 10, angle: 0 }, 'block'],
    ['car-block-30-d10', { obj: 'car', logKg: 10, angle: 0, airAbsorb: 0.3 }, 'block'],
    ['car-block-0-d10', { obj: 'car', logKg: 10, angle: 0, airAbsorb: 0 }, 'block'],
    ['car-ground-100', { obj: 'car' }, 'ground'],
    ['car-ground-100-d10', { obj: 'car', logKg: 10 }, 'ground'],
    ['car-plaster-100', { obj: 'car' }, 'plaster'],
    ['car-rattle-100', { obj: 'car' }, 'rattle'],
    ['car-ceiling-100', { obj: 'car' }, 'ceiling'],
  ]) out[k] = await box(st, 'throw', eff);
  fs.writeFileSync('dump3.json', JSON.stringify(out, null, 1));
  console.log('errs', errs);
  await browser.close();
})();
