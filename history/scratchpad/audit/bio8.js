const P = require('/home/user/dino-strength-sim/src/engine.js');
const body = P.makeBody({});
const surface = { mu: 0.8, qult: 1e6, shear: 1e6, rho: 2000 };
for (const mult of [1, 2, 3, 10, 100]) {
  const F = mult * P.CAL_LIFT_KG * P.K.g;
  const r = P.sprint({ F, mode: 'real', body, surface, groundHolds: true, anchor: 'bolted' });
  console.log('x' + mult, 'vTop', r.vTop.toFixed(2), 'm/s =', (r.vTop / 0.44704).toFixed(1), 'mph; limit', r.topLimit);
}
console.log('MUSCLE.run', P.MUSCLE.run);
console.log('40 mph =', (40 * 0.44704).toFixed(2), 'm/s; 35 mph =', (35 * 0.44704).toFixed(2));
console.log('19.3 m/s =', (19.3 / 0.44704).toFixed(2), 'mph =', (19.3 * 3.6).toFixed(1), 'km/h');
