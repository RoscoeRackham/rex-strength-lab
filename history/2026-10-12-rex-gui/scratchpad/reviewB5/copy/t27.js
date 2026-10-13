const run = require('./h.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
run([
  { id: 'wr-throw-rel-100', tab: 'wrestle', state: { wrestleMove: 'throw', logKg: 20, wAngle: 30 }, pick: 'allout' },
  { id: 'wr-throw-rel-50', tab: 'wrestle', state: { wrestleMove: 'throw', logKg: 20, wAngle: 30, airAbsorb: 0.5 }, pick: 'allout' },
  { id: 'wr-throw-rel-off', tab: 'wrestle', state: { wrestleMove: 'throw', logKg: 20, wAngle: 30, ...OFF }, pick: 'allout' },
  { id: 'wr-throw-orbit-100', tab: 'wrestle', state: { wrestleMove: 'throw', logKg: 11.6, wAngle: 0 }, pick: 'allout' },
]).then(()=>{});
