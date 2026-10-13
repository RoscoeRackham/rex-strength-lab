const run = require('./h.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
run([
  { id: 'lift-esb-def', tab: 'lift', state: { logKg: 12, obj: 'esb' } },
  { id: 'lift-esb-off', tab: 'lift', state: { logKg: 12, obj: 'esb', ...OFF } },
  { id: 'lift-everest-sand-def', tab: 'lift', state: { logKg: 16, obj: 'everest', surface: 'sand' } },
  { id: 'lift-moon-def', tab: 'lift', state: { logKg: 24, obj: 'moon' } },
]).then(()=>{});
