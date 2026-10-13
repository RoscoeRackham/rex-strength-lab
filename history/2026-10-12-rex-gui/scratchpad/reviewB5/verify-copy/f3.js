const run = require('./harness.js');
run([
  { id: 'j14', tab: 'jump', state: { logKg: 14 }, pick: 'allout' },
  { id: 'j20', tab: 'jump', state: { logKg: 20 }, pick: 'allout' },
]).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay); } });
