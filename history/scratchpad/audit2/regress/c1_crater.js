const { P, ctx } = require('./common.js');
// Independent Collins et al. 2005 (eqs 21, 22, 27): D_tc = 1.161 (rho_i/rho_t)^(1/3) L^0.78 v^0.44 g^-0.22 sin^(1/3)
function collins(L, v, ri, rt, angDeg) {
  const Dtc = 1.161 * Math.cbrt(ri / rt) * L ** 0.78 * v ** 0.44 * 9.81 ** -0.22 * Math.cbrt(Math.sin(angDeg * Math.PI / 180));
  const Dfr = 1.25 * Dtc < 3200 ? 1.25 * Dtc : 1.17 * Dtc ** 1.13 / 3200 ** 0.13;
  return { Dtc, Dfr };
}
for (const [L, v, ri, rt, a] of [[1, 2000, 1000, 2400, 90], [10, 15000, 3000, 2500, 45], [100, 20000, 3000, 2500, 90], [1000, 20000, 3000, 2500, 90], [10000, 20000, 3000, 2500, 90]]) {
  const m = Math.PI / 6 * ri * L ** 3, E = 0.5 * m * v * v;
  const e = P.craterDiameter({ L, v, rhoI: ri, rhoT: rt, angleDeg: a, E });
  const r = collins(L, v, ri, rt, a);
  console.log(`L=${L} v=${v}: engine ${e.D.toPrecision(5)} ref ${r.Dfr.toPrecision(5)} (Dtc ${r.Dtc.toPrecision(4)})`);
}
// continuity at the 20 km/s switch for a low-density object (car rho 115) and foot (1000)
for (const ri of [115, 1000, 3000, 8000]) {
  const L = 2; const m = Math.PI / 6 * ri * L ** 3;
  const D = (v) => P.craterDiameter({ L, v, rhoI: ri, rhoT: 2400, angleDeg: 90, E: 0.5 * m * v * v }).D;
  console.log(`rho_i=${ri}: D(19999.9)=${D(19999.9).toFixed(2)} D(20000.1)=${D(20000.1).toFixed(2)} ratio ${(D(20000.1) / D(19999.9)).toFixed(3)}`);
}
// complex-crater transition continuity
const Dt = (Dtc) => { const L = Math.pow(Dtc / (1.161 * Math.pow(9.81, -0.22) * Math.pow(20000, 0.44)), 1 / 0.78); return P.craterDiameter({ L, v: 20000, rhoI: 2500, rhoT: 2500, angleDeg: 90, E: 1 }).D; };
console.log('transition: D(Dtc=2559)', Dt(2559).toFixed(0), 'D(Dtc=2561)', Dt(2561).toFixed(0));
// stomp crater vs strength, comic, concrete, comic ground or not
for (const lg of [6, 8, 10, 12, 14, 16, 20, 24, 30, 34]) {
  for (const gh of [false, true]) {
    const s = P.stomp(ctx({ kg: Math.pow(10, lg), groundHolds: gh }));
    console.log(`lg ${lg} holds ${gh}: vFoot ${s.vFoot.toExponential(3)} E ${s.E.toExponential(3)} crater ${s.crater.toPrecision(4)} hole ${s.holeDepth.toPrecision(3)} extrap ${s.craterExtrapolated}`);
  }
}
