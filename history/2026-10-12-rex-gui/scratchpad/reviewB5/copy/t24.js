const run = require('./h.js');
run([
  { id: 'throw-car-1e10-level-block', tab: 'throw', state: { logKg: 10, obj: 'car', angle: 0 }, pick: 'block' },
  { id: 'throw-car-1e9-level-block', tab: 'throw', state: { logKg: 9, obj: 'car', angle: 0 }, pick: 'block' },
  { id: 'throw-car-1e10-level-block-0', tab: 'throw', state: { logKg: 10, obj: 'car', angle: 0, airAbsorb: 0 }, pick: 'block' },
]).then(()=>{});
