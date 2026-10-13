const run = require('./harness.js');
const cases = [
  { id: 'thr-inf-default', tab: 'throw', state: { inf: true }, pick: 'allout' },
  { id: 'wr-throw-inf', tab: 'wrestle', state: { inf: true, wrestleMove: 'throw', wAngle: 45 }, pick: 'allout' },
  { id: 'wr-throw-inf-30', tab: 'wrestle', state: { inf: true, wrestleMove: 'throw', wAngle: 30 }, pick: 'allout' },
];
run(cases).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k, /NaN|undefined/.test(v.bay) ? 'HAS NaN/undefined' : 'clean'); console.log(v.bay.split('\n').filter(l => /ground can bear|can bear it|takes the whole push|NaN|sideways part/i.test(l)).join('\n')); } });
