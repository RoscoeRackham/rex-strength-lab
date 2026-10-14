const run = require('./harness.js');
const cases = [
  { id: 'lift-bus-sand', tab: 'lift', state: { obj: 'bus', surface: 'sand' } },
  { id: 'lift-bus-gravel', tab: 'lift', state: { obj: 'loco', surface: 'gravel', logKg: 6 } },
  { id: 'lift-bus-softclay', tab: 'lift', state: { obj: 'bus', surface: 'softclay' } },
  { id: 'lift-bus-sand-dense', tab: 'lift', state: { obj: 'bus', surface: 'sand', m: 5000 } },
  { id: 'thr-gravel', tab: 'throw', state: { obj: 'car', surface: 'gravel', logKg: 6 }, pick: 'allout' },
  { id: 'thr-clay', tab: 'throw', state: { obj: 'car', surface: 'softclay', logKg: 6 }, pick: 'allout' },
  { id: 'jump-clay', tab: 'jump', state: { surface: 'softclay', logKg: 6 }, pick: 'allout' },
];
run(cases).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay.split('\n').filter(l => /footprint|sink|doesn’t give|Feet|can carry/i.test(l)).join('\n')); } });
