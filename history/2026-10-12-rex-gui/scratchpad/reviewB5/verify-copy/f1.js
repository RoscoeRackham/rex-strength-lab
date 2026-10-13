const run = require('./harness.js');
run([
  { id: 'inf', tab: 'throw', state: { inf: true, obj: 'car', angle: 90 }, pick: 'allout' },
  { id: 'e30', tab: 'throw', state: { logKg: 30, obj: 'car', angle: 90 }, pick: 'allout' },
  { id: 'tossInf', tab: 'catch', state: { inf: true, cObj: 'partner' }, pick: 'allout' },
  { id: 'toss30', tab: 'catch', state: { logKg: 30, cObj: 'partner' }, pick: 'allout' },
]).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay); } });
