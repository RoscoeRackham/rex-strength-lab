const { P, D, g, S, O, ctx } = require('./common.js');
for (const id of ['car', 'shot', 'baseball', 'tank', 'pyramid', 'bus', 'piano', 'semi']) { const o = O(id); console.log(id, 'm', o.m, 'L', o.L, 'rho', o.rho); }
const cd = (o, v, rhoT) => { const L = o.L || Math.cbrt(6 * o.m / (Math.PI * (o.rho || 1000))); const E = P.keFromV(v, o.m); return P.craterDiameter({ L, v, rhoI: o.rho || 1000, rhoT, angleDeg: 45, E }).D; };
for (const id of ['car', 'shot', 'tank', 'bus', 'semi', 'pyramid']) {
  const o = O(id);
  const a = cd(o, 19999.9, 2400), b = cd(o, 20000.1, 2400);
  console.log(id.padEnd(8), 'D(19999.9)', a.toFixed(1), 'D(20000.1)', b.toFixed(1), 'jump', ((b / a - 1) * 100).toFixed(2) + '%');
}
// stomp foot: L from mB at rho 1000
const body = P.makeBody({});
const mB = body.legEff; const L = Math.cbrt(6 * mB / (Math.PI * 1000));
for (const v of [19999.9, 20000.1]) console.log('stomp foot v', v, P.craterDiameter({ L, v, rhoI: 1000, rhoT: 2400, angleDeg: 90, E: P.keFromV(v, mB) }).D);
// monotone scan of D vs v for each object
for (const id of ['car', 'shot', 'tank', 'bus', 'pyramid', 'baseball']) {
  const o = O(id); let prev = 0, bad = '';
  for (let lv = 3.3; lv < 7.5; lv += 0.0005) { const v = Math.pow(10, lv); const D_ = cd(o, v, 2400); if (D_ < prev * (1 - 1e-9)) { bad = 'drops at v=' + v.toFixed(1) + ' ' + prev + ' -> ' + D_; break; } prev = D_; }
  console.log(id, bad || 'D monotone in v');
}
