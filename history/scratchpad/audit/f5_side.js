const P = require('/home/user/dino-strength-sim/src/engine.js');
const body = P.makeBody({});
const surf = { qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 };
const ball = { m: 0.145, area: 0.00434, Cd: 0.35, rho: 683 };
for (const kg of [1e6, 1e7, 1e8]) {
  const r = P.throwObject({ F: kg * P.K.g, mode: 'real', body, surface: surf, groundHolds: false, anchor: 'friction' }, ball, 45);
  console.log('real', kg, 'canMove', r.canMove, 'stalled', r.push.stalled, 'v', r.v, 'saturated', r.push.saturated);
}
const r = P.throwObject({ F: 1e30, mode: 'comic', body, surface: surf, groundHolds: false, anchor: 'friction' }, ball, 45);
console.log('comic F=1e30 N: v', r.v, 'v==c', r.v === P.K.c, 'Eobj', r.Eobj, 'push.EB*obj/mB', r.push.EB * 0.145 / (0.145 + body.whipEff));
