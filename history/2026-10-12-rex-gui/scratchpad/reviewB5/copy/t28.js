const run = require('./h.js');
run([
  { id: 'toss-inf', tab: 'catch', state: { inf: true, cObj: 'partner', cStyle: 'hard' }, pick: 'allout' },
  { id: 'toss-1e30', tab: 'catch', state: { logKg: 30, cObj: 'partner', cStyle: 'hard' }, pick: 'allout' },
]).then(()=>{});
