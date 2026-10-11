global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const obj = (id) => D.objects.find((o) => o.id === id);
const surface = D.surfaces.find((s) => s.id === 'concrete');
const mk = (b, F, extra) => Object.assign({ F, mode: 'comic', body: P.makeBody(b), surface, groundHolds: false, anchor: 'friction' }, extra || {});
const R = P.DEFAULT_BODIES.rex, O = P.DEFAULT_BODIES.ollie;
console.log('defaults', R, O);
const F0 = 100 * 907.18474 * g;
for (const [id, style, D_] of [['baseball','easy',10],['baseball','hard',10],['bowling','easy',10],['car','easy',10],['car','hard',10],['piano','hard',10],['tank','hard',10],['shot','easy',100]]) {
  const o = obj(id) || obj(id + 'ball') ;
  if (!o) { console.log('no', id); continue; }
  const L = P.catchLeg(mk({ H: R.H, m: R.m, build: 'rex' }, F0), mk({ H: O.H, m: O.m, build: 'ollie' }, F0), o, D_, style);
  if (!L.catch) { console.log(id, style, L.result); continue; }
  const k = L.catch, m = o.m, mS = m + k.mh, d = k.stroke;
  // independent integration of the stroke at the stated force F, relative to catcher, feet hold (no slide) unless slips
  const sinG = Math.max(0, Math.sin(L.angleDeg * Math.PI / 180));
  let v = k.v1, x = 0, t = 0; const dt = Math.min(k.tStroke, 2*d/k.v1) / 2e5;
  const a = (k.F - k.Fpull) / mS + (k.slips ? (k.aNet - (k.F - k.Fpull) / mS) : 0);
  while (v > 0 && x < d * 1.5 && t < 1e7) { x += v * dt; v -= a * dt; t += dt; }
  console.log(id, style, 'angle', L.angleDeg.toFixed(1), 'vArr', L.vArrive.toPrecision(4), 'F', k.F.toPrecision(4), 'Fpull', k.Fpull.toPrecision(4), 'Fcap', k.Fcap.toPrecision(3), 'F/Fcap', (k.F/k.Fcap).toPrecision(3), 'v1', k.v1.toPrecision(4),
    'tStroke', k.tStroke.toPrecision(4), '2d/v1', (2*d/k.v1).toPrecision(4), 'integrated t', t.toPrecision(4), 'x', x.toPrecision(4), 'vSlam', k.vSlam,
    'forced', k.forced, 'slips', k.slips, 'clean', k.clean, 'tContact', k.tContact.map(z=>z.toPrecision(3)).join('-'), 'uAfter', k.uAfter.toPrecision(3), 'aNet', k.aNet.toPrecision(4));
}
