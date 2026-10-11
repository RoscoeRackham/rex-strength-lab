// Analytic vacuum (Kepler) apex & range for launch from r0 = R+h0 with speed v at elevation theta (round Earth, GM).
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, R = K.R_E, GM = K.GM;
function kepler(v, thDeg, h0) {
  const th = thDeg * Math.PI / 180, r0 = R + h0;
  const eps = 0.5 * v * v - GM / r0;
  const hmom = r0 * v * Math.cos(th);
  const a = -GM / (2 * eps);
  const e = Math.sqrt(Math.max(0, 1 + 2 * eps * hmom * hmom / (GM * GM)));
  const p = hmom * hmom / GM;
  const ra = a * (1 + e);
  // true anomaly at launch (ascending): r0 = p/(1+e cos nu) ; landing at r=R (descending)
  const nu0 = -Math.acos(Math.max(-1, Math.min(1, (p / r0 - 1) / e))); // ascending branch (radial vel>0 => sin(nu)>0); use sign convention
  // radial velocity >0 when sin(nu)>0 ; so launch nu0 = +acos(...) is descending? For r' = sqrt(GM/p) e sin nu, positive when nu in (0,pi).
  const nuL = Math.acos(Math.max(-1, Math.min(1, (p / r0 - 1) / e)));
  const nuI = Math.acos(Math.max(-1, Math.min(1, (p / R - 1) / e)));
  // launch at nu = nuL (ascending, 0<nu<pi), apex at nu=pi, land at nu = 2pi - nuI
  const dnu = (2 * Math.PI - nuI) - nuL;
  return { apex: ra - R, range: R * dnu, e, a };
}
const cases = [[100, 45, 0], [1000, 45, 0], [5000, 45, 0], [7000, 30, 1.8], [10000, 90, 0], [11000, 90, 0], [13.82, 37, 1.8]];
for (const [v, th, h0] of cases) {
  const k = kepler(v, th, h0);
  const e = P.fly({ v0: v, thetaDeg: th, h0, m: 1, A: 1, Cd: 0 });
  console.log(`v=${v} th=${th} h0=${h0}: kepler apex ${k.apex.toPrecision(8)} range ${k.range.toPrecision(8)} | engine apex ${e.apex.toPrecision(8)} range ${e.range.toPrecision(8)} | rel apex ${((e.apex - k.apex) / k.apex).toExponential(2)} range ${((e.range - k.range) / k.range).toExponential(2)} | flat(g=9.80665) range ${(v*v*Math.sin(2*th*Math.PI/180)/K.g).toPrecision(6)} apex ${(v*v*Math.sin(th*Math.PI/180)**2/(2*K.g)).toPrecision(6)}`);
}
// radial apex formula check
for (const v of [10000, 11000, 11150, 11180]) {
  const ra = 1 / (1 / R - v * v / (2 * GM));
  console.log('vertical', v, 'apex km', ((ra - R) / 1000).toFixed(1), 'flat v^2/2g km', (v * v / 2 / K.g / 1000).toFixed(1));
}
console.log('escape speed from surface', Math.sqrt(2 * GM / R), 'from 1.8 m', Math.sqrt(2 * GM / (R + 1.8)));
