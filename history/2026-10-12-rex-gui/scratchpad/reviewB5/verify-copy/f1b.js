const run = require('./harness.js');
run([
  { id: 'tossInf', tab: 'catch', state: { inf: true, cObj: 'partner', cStyle: 'hard' }, pick: 'allout' },
  { id: 'toss30', tab: 'catch', state: { logKg: 30, cObj: 'partner', cStyle: 'hard' }, pick: 'allout' },
]).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay); } });
