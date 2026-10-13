const run = require('./harness.js');
run([
  { id: 'pyr', tab: 'throw', state: { logKg: 18.5, obj: 'pyramid', angle: 90, airAbsorb: 0.5 }, pick: 'allout' },
  { id: 'jumpInf', tab: 'jump', state: { inf: true }, pick: 'allout' },
]).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay); } });
