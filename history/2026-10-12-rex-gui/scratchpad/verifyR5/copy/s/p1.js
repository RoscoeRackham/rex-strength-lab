const run = require('./harness.js');
const cases = [
  { id: 'jump-sand-m5000-lg5', tab: 'jump', state: { surface: 'sand', m: 5000, logKg: 5 }, pick: 'allout' },
  { id: 'jump-sand-lg5', tab: 'jump', state: { surface: 'sand', logKg: 5 }, pick: 'allout' },
  { id: 'jump-inf-conc', tab: 'jump', state: { inf: true }, pick: 'allout' },
  { id: 'jump-gravel-lg6', tab: 'jump', state: { surface: 'gravel', logKg: 6 }, pick: 'allout' },
];
run(cases).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay); } });
