global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surface = D.surfaces.find((s) => s.id === 'concrete');
const R = P.DEFAULT_BODIES.rex, O = P.DEFAULT_BODIES.ollie;
const mk = (F) => ({ F, mode: 'comic', body: P.makeBody({ H: R.H, m: R.m, build: 'rex' }), surface, groundHolds: false, anchor: 'friction' });
const ob = P.makeBody({ H: O.H, m: O.m, build: 'ollie' });
for (const lg of [3.3, 3.45, 3.5, 3.55, 3.6, 3.7, 4, 5]) {
  for (const st of ['easy', 'hard']) {
    const t = P.tossPartner(mk(Math.pow(10, lg) * g), ob, 'Ollie', st, 10);
    console.log(lg, st, t.result, 'hTarget', t.hTarget, 'rise', t.rise && t.rise.toPrecision(4), 'apex', t.apex && t.apex.toPrecision(4), 'hRel', t.hRelease, 'catch', !!t.catch, 'v', t.v && t.v.toPrecision(3));
  }
}
console.log(Object.keys(P.tossPartner(mk(1e5 * g), ob, 'Ollie', 'easy', 10)));
