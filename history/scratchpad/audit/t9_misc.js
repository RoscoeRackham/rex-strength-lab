const P = require('/home/user/dino-strength-sim/src/engine.js');
const { refFly } = require('./ref.js');
const K = P.K, R = K.R_E, GM = K.GM;
// 1) range past antipode (unwrapping) -- vacuum Kepler
function kepler(v, thDeg, h0) {
  const th = thDeg * Math.PI / 180, r0 = R + h0;
  const eps = 0.5 * v * v - GM / r0, hm = r0 * v * Math.cos(th), p = hm * hm / GM;
  const e = Math.sqrt(1 + 2 * eps * hm * hm / GM / GM);
  const nuL = Math.acos((p / r0 - 1) / e), nuI = Math.acos((p / R - 1) / e);
  return { range: R * ((2 * Math.PI - nuI) - nuL), apex: -GM / (2 * eps) * (1 + e) - R };
}
for (const [v, th] of [[7800, 3], [7850, 2], [7700, 10], [9000, 20]]) {
  const k = kepler(v, th, 0), e = P.fly({ v0: v, thetaDeg: th, h0: 0, m: 1, A: 1, Cd: 0 });
  console.log(`unwrap v=${v} th=${th}: kepler range ${(k.range / 1e3).toFixed(3)} km (pi R = ${(Math.PI * R / 1e3).toFixed(0)} km) engine ${(e.range / 1e3).toFixed(3)} km rel ${((e.range - k.range) / k.range).toExponential(2)} steps ${e.steps}`);
}
// 2) uniform-density analytic jump apex vs engine (low apex so density ~ uniform)
const gs = GM / R ** 2;
for (const v0 of [5, 15, 30]) {
  const m = 180, A = 0.3, Cd = 1;
  const vt = Math.sqrt(2 * m * gs / (K.rho0 * Cd * A));
  const apexA = vt * vt / (2 * gs) * Math.log(1 + v0 * v0 / (vt * vt));
  const vImpA = vt * Math.sqrt(1 - Math.exp(-2 * gs * apexA / (vt * vt)));
  const e = P.fly({ v0, thetaDeg: 90, h0: 0, m, A, Cd });
  const r = refFly({ v0, thetaDeg: 90, h0: 0, m, A, Cd, rho: 'uniform' });
  console.log(`jump v0=${v0}: analytic(uniform rho, g=GM/R^2) apex ${apexA.toFixed(4)} vImp ${vImpA.toFixed(4)} | ref-uniform vImp ${r.vImpact.toFixed(4)} | engine(exp atm) apex ${e.apex.toFixed(4)} vImp ${e.vImpact.toFixed(4)} | rel apex ${((e.apex - apexA) / apexA).toExponential(2)} (expected ~ +apex/(3Hs)=${(apexA/3/K.Hs).toExponential(2)})`);
}
// terminal velocity in a long uniform-density fall (reference) vs analytic vt
{
  const m = 180, A = 0.3, Cd = 1;
  const vt = Math.sqrt(2 * m * gs / (K.rho0 * Cd * A));
  const r = refFly({ v0: 1e-6, thetaDeg: -90, h0: 5000, m, A, Cd, rho: 'uniform' });
  console.log('uniform-density 5 km drop: vImpact', r.vImpact.toFixed(5), 'analytic terminal', vt.toFixed(5));
  const e = P.fly({ v0: 1e-6, thetaDeg: -90, h0: 5000, m, A, Cd });
  const r2 = refFly({ v0: 1e-6, thetaDeg: -90, h0: 5000, m, A, Cd });
  console.log('exp-atm 5 km drop: engine vImpact', e.vImpact.toFixed(5), 'ref', r2.vImpact.toFixed(5), 'time', e.time.toFixed(3), r2.time.toFixed(3));
}
// 3) the timed-out tank trajectory: what actually happens (long tMax) vs reference
{
  const o = { v0: 112472.67720731982, thetaDeg: 30, h0: 1.8, m: 66800, A: 15, Cd: 1 };
  const e = P.fly(Object.assign({ tMax: 400 * 86400 }, o));
  const r = refFly(Object.assign({ tMax: 400 * 86400, rtol: 1e-10 }, o));
  console.log('tank 30deg 112 km/s, tMax 400 d: engine', JSON.stringify({ range_km: +(e.range / 1e3).toFixed(1), apex_km: +(e.apex / 1e3).toFixed(0), days: +(e.time / 86400).toFixed(2), vImp: +e.vImpact.toFixed(1), esc: e.escaped, TO: e.timedOut, steps: e.steps }));
  console.log('                                     ref   ', JSON.stringify({ range_km: +((r.range || 0) / 1e3).toFixed(1), apex_km: +(r.apex / 1e3).toFixed(0), days: +(r.time / 86400).toFixed(2), vImp: +(r.vImpact || 0).toFixed(1), esc: !!r.escaped, TO: !!r.timedOut }));
}
// 4) hypersonic sea-level step-size convergence: engine vs ref for a sweep
let worst = 0, wcase = null;
for (const v0 of [1e3, 1e4, 1e5, 1e6, 2.9e6]) for (const th of [0, 10, 45, 80]) for (const [m, A, Cd] of [[0.145, 0.00434, 0.35], [7.26, 0.0113, 0.47], [1360, 4, 1], [66800, 15, 1], [180, 0.3, 1]]) {
  const o = { v0, thetaDeg: th, h0: 1.8, m, A, Cd };
  const e = P.fly(o); const r = refFly(o);
  if (r.escaped || e.escaped) { if (r.escaped !== e.escaped) console.log('ESC MISMATCH', o); continue; }
  const err = Math.max(Math.abs(e.range - r.range) / Math.max(r.range, 1), Math.abs(e.vImpact - r.vImpact) / r.vImpact);
  if (err > worst) { worst = err; wcase = { o, e: [e.range, e.vImpact, e.steps], r: [r.range, r.vImpact] }; }
}
console.log('hypersonic sweep worst rel err (range or vImpact):', worst.toExponential(2), JSON.stringify(wcase));
