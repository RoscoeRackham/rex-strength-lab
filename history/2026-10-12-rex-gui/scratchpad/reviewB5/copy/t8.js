const run = require('./h.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
run([
  { id: 'weight-def', tab: 'weight', state: {} },
  { id: 'weight-dense-def', tab: 'weight', state: { m: 3e7 } },
  { id: 'weight-dense-off', tab: 'weight', state: { m: 3e7, ...OFF } },
  { id: 'weight-dense-sand-def', tab: 'weight', state: { m: 3e5, surface: 'sand' } },
  { id: 'walk-def', tab: 'walk', state: {} },
  { id: 'walk-sand-dense-def', tab: 'walk', state: { m: 3e5, surface: 'sand' } },
  { id: 'walk-sand-dense-off', tab: 'walk', state: { m: 3e5, surface: 'sand', ...OFF } },
]).then(()=>{});
