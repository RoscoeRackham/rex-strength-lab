const run = require('./h.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
run([
  { id: 'col-bolted-off-plaster-big', tab: 'collide', state: { anchor: 'bolted', logKg: 14, colSrc: 'jump', ...OFF }, pick: 'plaster' },
  { id: 'col-bolted-off-rattle-big', tab: 'collide', state: { anchor: 'bolted', logKg: 14, colSrc: 'jump', ...OFF }, pick: 'rattle' },
]).then(()=>{});
