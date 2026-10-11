global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const surf = D.surfaces.find(s=>s.id==='concrete');
for (const H of [P.DEFAULT_BODIES.rex.H, 2]) {
const mR = 30 * P.bodyVolume(H, 'rex'), mO = 30 * P.bodyVolume(H, 'ollie');
let seen = {};
for (let lk = 0.9; lk <= 2.2; lk += 0.002) {
  const c = { F: Math.pow(10, lk) * g, mode: 'comic', body: P.makeBody({H, m: mR}), surface: surf, groundHolds: false, anchor: 'friction' };
  const r = P.tossPartner(c, P.makeBody({H, m: mO, build:'ollie'}), 'Ollie', 'hard', 10, 'friction');
  const key = r.result + (r.result==='caught' && r.v < 0.05 ? '-tiny' : '');
  if (!seen[key]) { seen[key] = 1; console.log(H, lk.toFixed(3), r.result, r.v, r.flight && r.flight.apex); }
}
}
