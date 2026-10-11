const P0 = require('/home/user/dino-strength-sim/src/engine.js');
const P2 = require('./engine_v_bio1_fix.js');
const { refPush } = require('./v_bio1_ref.js');
const g = 9.80665;
const concrete = { qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 };
// Kaiju jump around 1e7.95
let body = P0.makeBody({ H: 50, m: 180 * Math.pow(25, 3) });
for (const lk of [7.9, 7.95]) {
  const F = Math.pow(10, lk) * g, mA = body.m - body.feetMass, RB = concrete.qult * 2 * body.footArea;
  const r = refPush({ F, d: body.strokes.leg, mA, mB: body.feetMass, RA: mA * g, RB, vmax: 30 * body.s, N: 100000 });
  console.log(`Kaiju jump 1e${lk}: F/RB(ground) = ${(F / RB).toFixed(3)}  ref v ${(r.vA * mA / body.m).toFixed(4)}  fix ${P2.jump({ F, mode: 'real', body, surface: concrete, groundHolds: false, anchor: 'friction' }).v.toFixed(4)}`);
}
// 2 m car around 1e4.8
body = P0.makeBody({ H: 2, m: 180 });
for (const lk of [4.75, 4.8]) {
  const F = Math.pow(10, lk) * g; const car = { m: 1360, area: 4, Cd: 1.0, crush: 1e6, rho: 300 };
  const th = Math.PI / 4, anc = P0.anchorCapacity({ body, surface: concrete, theta: th, anchor: 'friction', extraMass: car.m });
  const arm = 2 * body.handEff, mB = car.m + arm;
  const r = refPush({ F: 0.3 * F, d: body.strokes.throw, mA: body.m - arm, mB, RA: anc.R, RB: mB * g * Math.SQRT1_2, vmax: 55, N: 100000 });
  console.log(`2 m car 1e${lk}: anchor limit ${anc.limit} R ${anc.R.toExponential(3)} (0.3F = ${(0.3 * F).toExponential(3)})  ref v ${r.vB.toFixed(4)}  fix ${P2.throwObject({ F, mode: 'real', body, surface: concrete, groundHolds: false, anchor: 'friction' }, car, 45).v.toFixed(4)}`);
}
