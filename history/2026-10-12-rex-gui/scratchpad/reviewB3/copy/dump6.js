const { open, view } = require('./h.js');
const fs = require('fs');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
(async () => {
  const { browser, page, errs } = await open();
  const out = {};
  for (const [k, st, tab, eff] of [
    ['stomp-sand-allout', { surface: 'sand' }, 'stomp', 'allout'],
    ['stomp-sand-1e8', { surface: 'sand', logKg: 8 }, 'stomp', 'allout'],
    ['stomp-conc-1e8', { logKg: 8 }, 'stomp', 'allout'],
    ['stomp-conc-1e12', { logKg: 12 }, 'stomp', 'allout'],
    ['stomp-conc-1e12-ground', { logKg: 12 }, 'stomp', 'ground'],
    ['jump-sand-1e8', { surface: 'sand', logKg: 8 }, 'jump', 'allout'],
    ['jump-conc-1e14', { logKg: 14 }, 'jump', 'allout'],
    ['jump-conc-1e14-off', Object.assign({ logKg: 14 }, OFF), 'jump', 'allout'],
    ['lift-sand-tank', { surface: 'sand', obj: 'tank' }, 'lift', null],
    ['lift-sand-everest', { surface: 'sand', obj: 'everest', logKg: 15 }, 'lift', null],
    ['weight-osmium-sand', { surface: 'sand', m: 22590 * 2.84 }, 'weight', null],
    ['weight-wd', { m: 1e9 * 2.84 }, 'weight', null],
    ['sprint-sand-allout', { surface: 'sand' }, 'sprint', 'allout'],
    ['punch-1e10', { logKg: 10 }, 'punch', 'allout'],
    ['punch-1e10-50', { logKg: 10, airAbsorb: 0.5 }, 'punch', 'allout'],
    ['clap-1e10', { logKg: 10 }, 'clap', 'allout'],
    ['pull-tank-bolted', { obj: 'tank', anchor: 'bolted' }, 'pull', 'allout'],
    ['pull-carrier', { obj: 'nimitz' }, 'pull', 'allout'],
    ['pull-carrier-off', Object.assign({ obj: 'nimitz' }, OFF), 'pull', 'allout'],
    ['throw-bus-ice', { obj: 'bus', surface: 'ice', logKg: 6 }, 'throw', 'allout'],
    ['throw-bus-ice-off', Object.assign({ obj: 'bus', surface: 'ice', logKg: 6 }, OFF), 'throw', 'allout'],
    ['throw-pyramid-up', { obj: 'pyramid', logKg: 22, angle: 90 }, 'throw', 'allout'],
    ['throw-pyramid-up-50', { obj: 'pyramid', logKg: 22, angle: 90, airAbsorb: 0.5 }, 'throw', 'allout'],
    ['throw-down', { obj: 'baseball', logKg: Math.log10(1.8e23), angle: 0 }, 'throw', 'allout'],
    ['walk-stamp-clay', { surface: 'softclay', stepEffort: 1 }, 'walk', null],
  ]) { out[k] = await view(page, st, tab, eff); console.log('done', k); fs.writeFileSync('dump6.json', JSON.stringify(out, null, 1)); }
  console.log('errs', errs);
  await browser.close();
})();
