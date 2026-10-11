global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const surf = D.surfaces.find(s=>s.id==='concrete');
for (const [H, m, kg] of [[2,5.4,10],[2,7.2,10],[2,21.6,10],[3.048,76.4,20],[3.048,76.4,30],[0.4, 30*P.bodyVolume(0.4,'rex'), 1]]) {
  const c = { F: kg * g, mode: 'comic', body: P.makeBody({H, m}), surface: surf, groundHolds: false, anchor: 'friction' };
  const t = P.throwObject(c, P.partnerAsObject(P.makeBody({H, m, build:'ollie'}), 'Ollie'), 90);
  const r = P.tossPartner(c, P.makeBody({H, m, build:'ollie'}), 'Ollie', 'hard', 10, 'friction');
  console.log(H, m.toFixed(2), kg, r.result, r.v, 'canHold', t.canHold, 'canMove', t.canMove, 'needed', t.needed && t.needed.toPrecision(3), 'F', (kg*g).toPrecision(3));
}
