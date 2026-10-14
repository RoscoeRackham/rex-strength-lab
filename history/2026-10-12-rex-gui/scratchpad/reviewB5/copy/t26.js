const run = require('./h.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
run([
  { id: 'col-set-off-plaster', tab: 'collide', state: { anchor: 'bolted', colSrc: 'set', colGB: Math.log10(11186/299792458), logKg: 14, ...OFF }, pick: 'plaster' },
]).then(()=>{});
