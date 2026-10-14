const run = require('./harness.js');
const m10 = 3007 * Math.pow(10 / 3.048, 3);
const cases = [
  { id: 'jump-softclay-H10', tab: 'jump', state: { surface: 'softclay', H: 10, m: m10, logKg: 7 }, pick: 'allout' },
];
run(cases).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay.split('\n').filter(l => /lands on bent|push time|can bear none|^Rex|tall|Takeoff/i.test(l)).join('\n')); } });
