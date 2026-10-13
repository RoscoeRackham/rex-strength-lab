const run = require('./h.js');
run([
  { id: 'catch-car-1e9-0', tab: 'catch', state: { logKg: 9, cObj: 'car', cStyle: 'hard', airAbsorb: 0 }, pick: 'allout' },
  { id: 'catch-car-1e9-0-keepoff', tab: 'catch', state: { logKg: 9, cObj: 'car', cStyle: 'hard', airAbsorb: 0, keepForm: false }, pick: 'allout' },
]).then(()=>{});
