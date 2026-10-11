global.window = {};
const A = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const B = require('./engine_exact.js');
const surf = D.surfaces.find((s) => s.id === 'concrete');
const C = (P, kg) => ({ F: kg * 9.80665, mode: 'comic', body: P.makeBody({ H: 2, m: 180 }), surface: surf, groundHolds: false, anchor: 'friction' });
let n = 0, diff = 0;
for (const id of ['piano', 'car', 'bus', 'tank', 'loco', 'b777', 'eiffel', 'titanic', 'pyramid']) for (const lg of [6, 8, 10, 12, 14, 16, 18, 20, 22]) for (const ld of [1, 2, 3, 4, 5, 6, 7]) {
  const o = D.objects.find((x) => x.id === id), Dd = Math.pow(10, ld);
  const a = A.catchLeg(C(A, Math.pow(10, lg)), C(A, Math.pow(10, lg)), o, Dd, 'hard');
  const b = B.catchLeg(C(B, Math.pow(10, lg)), C(B, Math.pow(10, lg)), o, Dd, 'hard');
  n++;
  const va = a.aim ? a.aim.vL : a.vL, vb = b.aim ? b.aim.vL : b.vL;
  if (a.result !== b.result || (va && vb && Math.abs(va / vb - 1) > 0.05)) { diff++; console.log(id, 'lg' + lg, 'D 1e' + ld, 'table:', a.result, va && va.toPrecision(3), (a.aim && a.aim.thetaDeg || a.thetaDeg || 0).toFixed(1) + '°', ' exact:', b.result, vb && vb.toPrecision(3), (b.aim && b.aim.thetaDeg || b.thetaDeg || 0).toFixed(1) + '°'); }
}
console.log('n', n, 'differ', diff);
