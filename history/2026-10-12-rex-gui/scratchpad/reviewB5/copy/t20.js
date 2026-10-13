const run = require('./h.js');
run([
  { id: 'jump-inf', tab: 'jump', state: { inf: true }, pick: 'allout' },
  { id: 'throw-inf-car', tab: 'throw', state: { inf: true, obj: 'car' }, pick: 'allout' },
]).then(()=>{});
