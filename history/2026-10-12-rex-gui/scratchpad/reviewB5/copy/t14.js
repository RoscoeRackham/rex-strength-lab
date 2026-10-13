const run = require('./h.js');
const cases = [];
for (const lk of [8, 9]) for (const p of ['rattle', 'windows', 'houses', 'block']) cases.push({ id: 'throw-car-' + lk + '-' + p, tab: 'throw', state: { logKg: lk, obj: 'car', near: 50 }, pick: p });
cases.push({ id: 'catch-car-9-windows', tab: 'catch', state: { logKg: 9, cObj: 'car', cStyle: 'hard' }, pick: 'windows' });
cases.push({ id: 'catch-car-9-houses', tab: 'catch', state: { logKg: 9, cObj: 'car', cStyle: 'hard' }, pick: 'houses' });
run(cases).then(()=>{});
