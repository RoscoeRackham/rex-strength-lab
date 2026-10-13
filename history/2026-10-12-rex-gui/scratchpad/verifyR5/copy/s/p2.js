const run = require('./harness.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const cases = [
  { id: 'thr-inf-90', tab: 'throw', state: { inf: true, obj: 'car', angle: 90 }, pick: 'allout' },
  { id: 'thr-inf-45-50', tab: 'throw', state: { inf: true, obj: 'car', angle: 45, airAbsorb: 0.5 }, pick: 'allout' },
  { id: 'thr-inf-45-off', tab: 'throw', state: Object.assign({ inf: true, obj: 'car', angle: 45 }, OFF), pick: 'allout' },
  { id: 'thr-inf-89', tab: 'throw', state: { inf: true, obj: 'car', angle: 89 }, pick: 'allout' },
  { id: 'thr-orbit', tab: 'throw', state: { obj: 'baseball', angle: 0, logKg: 8.2 }, pick: 'allout' },
  { id: 'thr-pyr', tab: 'throw', state: { obj: 'pyramid', angle: 90, logKg: 18.5, airAbsorb: 0.5 }, pick: 'allout' },
  { id: 'thr-pyr-ice', tab: 'throw', state: { obj: 'pyramid', angle: 90, logKg: 18.5, airAbsorb: 0.5, surface: 'ice' }, pick: 'allout' },
  { id: 'thr-sand-30', tab: 'throw', state: { obj: 'car', angle: 30, logKg: 6, surface: 'sand' }, pick: 'allout' },
  { id: 'thr-sand-45-noown', tab: 'throw', state: { obj: 'car', angle: 45, logKg: 6, surface: 'sand', ownRecoil: false }, pick: 'allout' },
  { id: 'thr-sand-30-ub', tab: 'throw', state: Object.assign({ obj: 'car', angle: 30, logKg: 6, surface: 'sand' }, OFF, { unbreakable: true }), pick: 'allout' },
  { id: 'jump-ice-inf', tab: 'jump', state: { inf: true, surface: 'ice' }, pick: 'allout' },
];
run(cases).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay); } });
