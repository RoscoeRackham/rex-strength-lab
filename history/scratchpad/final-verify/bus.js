global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const obj = (id) => D.objects.find((o) => o.id === id);
const surface = D.surfaces.find((s) => s.id === 'concrete');
const mk = (b, F) => ({ F, mode: 'comic', body: P.makeBody(b), surface, groundHolds: false, anchor: 'friction' });
const R = P.DEFAULT_BODIES.rex;
for (const id of ['bus','tank','loco','semi','b777','cc177','pickup','car']) for (const lg of [Math.log10(100*907.18474), 5, 6, 8]) {
  const L = P.catchLeg(mk({ H: R.H, m: R.m, build: 'rex' }, Math.pow(10, lg) * g), mk({ H: R.H, m: R.m, build: 'ollie' }, Math.pow(10, lg) * g), obj(id), 10, 'easy');
  if (!L.catch) { console.log(id, lg.toFixed(2), L.result); continue; }
  const k = L.catch; console.log(id, lg.toFixed(2), L.result, 'slips', k.slips, 'slide', k.slide.toExponential(2), 'F', k.F.toPrecision(4), 'R', k.R.toPrecision(4), 'forced', k.forced, 'uAfter', k.uAfter.toExponential(2));
}
