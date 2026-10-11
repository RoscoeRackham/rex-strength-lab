global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = 9.80665;
const body = P.makeBody({ H: 2, m: 180 });
let n = 0, tot = 0, lo = null, hi = null;
for (let i = 0; i < 1900; i++) {
  const lg = 15 + i * 0.01;
  const c = { F: Math.pow(10, lg) * g, mode: 'comic', body, surface: D.surfaces.find((s) => s.id === 'concrete'), groundHolds: false, anchor: 'friction' };
  const v = P.jump(c).v; tot++;
  const b = v / K.c;
  if (b < 1 - 1e-12 && b * 100 >= 99.9999995) { n++; if (lo === null) lo = lg; hi = lg; }
}
console.log(n, 'of', tot, 'range logKg', lo, hi);
