const run = require('./h.js');
const cases = [];
for (const p of ['rattle', 'windows', 'houses', 'block', 'plaster', 'ground']) cases.push({ id: 'throw-car-1e6-' + p, tab: 'throw', state: { logKg: 6, obj: 'car' }, pick: p });
cases.push({ id: 'throw-car-1e6-windows-30', tab: 'throw', state: { logKg: 6, obj: 'car', airAbsorb: 0.3 }, pick: 'windows' });
cases.push({ id: 'catch-car-1e6-windows', tab: 'catch', state: { logKg: 6, cObj: 'car', cStyle: 'hard' }, pick: 'windows' });
run(cases).then(()=>{});
