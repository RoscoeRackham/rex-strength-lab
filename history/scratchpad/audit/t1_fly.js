const P = require('/home/user/dino-strength-sim/src/engine.js');
const { refFly } = require('./ref.js');
const K = P.K;
const gs = K.GM / K.R_E ** 2;
console.log('g at surface from GM/R^2 =', gs, ' K.g =', K.g, ' ratio', gs / K.g);
console.log('Hs =', K.Hs, ' check R_air*T0/g =', 287.05287 * 288.15 / K.g);
const cases = [
  ['vac 100 m/s 45', { v0: 100, thetaDeg: 45, h0: 0, m: 1, A: 1, Cd: 0 }],
  ['vac 1 km/s 45', { v0: 1000, thetaDeg: 45, h0: 0, m: 1, A: 1, Cd: 0 }],
  ['vac 5 km/s 45', { v0: 5000, thetaDeg: 45, h0: 0, m: 1, A: 1, Cd: 0 }],
  ['vac 7 km/s 30', { v0: 7000, thetaDeg: 30, h0: 1.8, m: 1, A: 1, Cd: 0 }],
  ['vac 10 km/s 90', { v0: 10000, thetaDeg: 90, h0: 0, m: 1, A: 1, Cd: 0 }],
  ['vac 11 km/s 90', { v0: 11000, thetaDeg: 90, h0: 0, m: 1, A: 1, Cd: 0 }],
  ['shot 13.8 37', { v0: 13.82, thetaDeg: 37, h0: 1.8, m: 7.26, A: 0.0113, Cd: 0.47 }],
  ['ball 38.8 0', { v0: 38.8, thetaDeg: 0, h0: 1.8, m: 0.145, A: 0.00434, Cd: 0.35 }],
  ['car 300 45', { v0: 300, thetaDeg: 45, h0: 1.8, m: 1360, A: 4, Cd: 1 }],
  ['car 3 km/s 45', { v0: 3000, thetaDeg: 45, h0: 1.8, m: 1360, A: 4, Cd: 1 }],
  ['car 100 km/s 45', { v0: 1e5, thetaDeg: 45, h0: 1.8, m: 1360, A: 4, Cd: 1 }],
  ['car 2900 km/s 45', { v0: 2.9e6, thetaDeg: 45, h0: 1.8, m: 1360, A: 4, Cd: 1 }],
  ['car 1e5 m/s 5deg', { v0: 1e5, thetaDeg: 5, h0: 1.8, m: 1360, A: 4, Cd: 1 }],
  ['tank 1e6 0deg', { v0: 1e6, thetaDeg: 0, h0: 1.8, m: 66800, A: 15, Cd: 1 }],
  ['dino jump 1e4 90', { v0: 1e4, thetaDeg: 90, h0: 0, m: 180, A: 0.3, Cd: 1 }],
  ['dino jump 1e6 90', { v0: 1e6, thetaDeg: 90, h0: 0, m: 180, A: 0.3, Cd: 1 }],
  ['moon 5 km/s 45', { v0: 5000, thetaDeg: 45, h0: 1.8, m: 7.342e22, A: 9.5e12, Cd: 1 }],
  ['moon 20 km/s 45', { v0: 20000, thetaDeg: 45, h0: 1.8, m: 7.342e22, A: 9.5e12, Cd: 1 }],
];
for (const [name, o] of cases) {
  const t0 = Date.now();
  const e = P.fly(o);
  const t1 = Date.now();
  const r = refFly(o);
  const rel = (a, b) => (b === 0 ? a : (a - b) / b);
  console.log(name.padEnd(18), 'eng: range', e.range.toPrecision(7), 'apex', e.apex.toPrecision(7), 'time', e.time.toPrecision(6), 'vImp', e.vImpact.toPrecision(6), 'ang', e.impactAngleDeg.toFixed(3), 'esc', e.escaped, 'TO', e.timedOut, 'steps', e.steps, (t1 - t0) + 'ms');
  console.log(''.padEnd(18), 'ref: range', (r.range || 0).toPrecision(7), 'apex', r.apex.toPrecision(7), 'time', r.time.toPrecision(6), 'vImp', (r.vImpact || 0).toPrecision(6), 'ang', (r.impactAngleDeg || 0).toFixed(3), 'esc', !!r.escaped, 'TO', !!r.timedOut);
  console.log(''.padEnd(18), 'relerr range', rel(e.range, r.range || 0).toExponential(2), 'apex', rel(e.apex, r.apex).toExponential(2), 'vImp', rel(e.vImpact, r.vImpact || 0).toExponential(2));
}
