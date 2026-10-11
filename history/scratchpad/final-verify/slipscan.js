global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const obj = (id) => D.objects.find((o) => o.id === id);
const surface = D.surfaces.find((s) => s.id === 'concrete');
const mk = (b, F, extra) => Object.assign({ F, mode: 'comic', body: P.makeBody(b), surface, groundHolds: false, anchor: 'friction' }, extra || {});
const R = P.DEFAULT_BODIES.rex, O = P.DEFAULT_BODIES.ollie;
const out = [];
for (const id of ['piano','car','bus','semi','tank','loco','shot','bowling']) for (const lg of [5,6,7,8]) for (const style of ['easy','hard']) {
  const F0 = Math.pow(10, lg) * g;
  const L = P.catchLeg(mk({ H: R.H, m: R.m, build: 'rex' }, F0), mk({ H: O.H, m: O.m, build: 'ollie' }, F0), obj(id), 10, style);
  if (L.catch && L.catch.slips) out.push([id, lg, style, L.result, L.angleDeg.toFixed(1)]);
}
console.log(JSON.stringify(out));
