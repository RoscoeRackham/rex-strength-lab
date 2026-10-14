const { open, view } = require('./h.js');
const fs = require('fs');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
(async () => {
  const { browser, page, errs } = await open();
  const out = {};
  for (const [k, st, tab, eff] of [
    ['car-1e14-50', { obj: 'car', logKg: 14, airAbsorb: 0.5 }, 'throw', 'allout'],
    ['car-1e14-0', { obj: 'car', logKg: 14, airAbsorb: 0 }, 'throw', 'allout'],
    ['jump-1e14-windows', { logKg: 14 }, 'jump', 'windows'],
    ['jump-1e10-windows', { logKg: 10 }, 'jump', 'windows'],
    ['wthrow-1e14-100', { wrestleMove: 'throw', logKg: 14 }, 'wrestle', 'allout'],
    ['wthrow-1e8-100', { wrestleMove: 'throw', logKg: 8 }, 'wrestle', 'allout'],
    ['wthrow-1e8-50', { wrestleMove: 'throw', logKg: 8, airAbsorb: 0.5 }, 'wrestle', 'allout'],
    ['wlift-sand', { wrestleMove: 'lift', surface: 'sand' }, 'wrestle', null],
    ['arm-1e8', { logKg: 8 }, 'arm', 'allout'],
    ['arm-1e8-off', Object.assign({ logKg: 8 }, OFF), 'arm', 'allout'],
    ['arm-1e8-ollieown', { logKg: 8, oSame: false }, 'arm', 'allout'],
    ['col-imm', { colImm: true }, 'collide', null],
    ['col-imm-plaster', { colImm: true }, 'collide', 'plaster'],
    ['col-push', { colMode: 'push' }, 'collide', null],
    ['col-push-bolt', { colMode: 'push', anchor: 'bolted', oAnchor: 'bolted' }, 'collide', 'ground'],
    ['col-stomp', { colSrc: 'stomp' }, 'collide', 'allout'],
    ['catch-partner-1e8', { cObj: 'partner', logKg: 8 }, 'catch', 'allout'],
  ]) { out[k] = await view(page, st, tab, eff); console.log('done', k); fs.writeFileSync('dump7.json', JSON.stringify(out, null, 1)); }
  console.log('errs', errs);
  await browser.close();
})();
