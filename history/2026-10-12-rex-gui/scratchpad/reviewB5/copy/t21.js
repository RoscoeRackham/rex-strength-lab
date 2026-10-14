const run = require('./h.js');
run([
  { id: 'throw-inf-car-up', tab: 'throw', state: { inf: true, obj: 'car', angle: 90 }, pick: 'allout' },
  { id: 'throw-1e30-car-up', tab: 'throw', state: { logKg: 30, obj: 'car', angle: 90 }, pick: 'allout' },
]).then(()=>{});
