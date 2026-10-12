global.window = global;
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const o = global.DINO_DATA.objects.find((x) => x.id === 'person');
console.log('person', JSON.stringify(o));
for (const n of [1, 1.5, 2, 4, 6]) {
  let lo = 0.1, hi = 1000; for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (P.PASSENGER.dragG(o, m) > n) hi = m; else lo = m; }
  console.log(n + ' g at', lo.toFixed(1), 'm/s (engine); fact (Cd 1.1):', Math.sqrt(2 * n * 9.80665 * 90.26 / (1.225 * 1.1 * 0.67)).toFixed(1));
}
