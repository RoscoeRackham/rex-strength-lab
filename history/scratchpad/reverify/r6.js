global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const surf = D.surfaces.find(s=>s.id==='concrete');
const H = P.DEFAULT_BODIES.rex.H;
const mR = 30 * P.bodyVolume(H, 'rex'), mO = 30 * P.bodyVolume(H, 'ollie');
console.log('plush masses', mR, mO);
for (let lk = 1; lk <= 2; lk += 0.05) {
  const c = { F: Math.pow(10, lk) * g, mode: 'comic', body: P.makeBody({H, m: mR}), surface: surf, groundHolds: false, anchor: 'friction' };
  const r = P.tossPartner(c, P.makeBody({H, m: mO, build:'ollie'}), 'Ollie', 'hard', 10, 'friction');
  const re = P.tossPartner(c, P.makeBody({H, m: mO, build:'ollie'}), 'Ollie', 'easy', 10, 'friction');
  console.log(lk.toFixed(2), r.result, r.v && r.v.toPrecision(3), '| easy', re.result, re.v && re.v.toPrecision(3), re.vMax && re.vMax.toPrecision(3));
}
