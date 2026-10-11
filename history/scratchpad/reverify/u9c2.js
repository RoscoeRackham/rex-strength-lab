global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
const surface = D.surfaces.find((s) => s.id === 'concrete');
const mk = (lk, build) => ({ F: Math.pow(10, lk) * g, mode: 'comic', body: P.makeBody({ H: 3.048, m: 2700, build }), surface, groundHolds: false, anchor: 'friction' });
for (const [id, lk] of [['piano', 7], ['piano', 6], ['piano', 5], ['car', 5], ['motorcycle', 6]]) {
  const o = D.objects.find((x) => x.id === id);
  const cR = mk(lk, 'rex'), cO = mk(lk, 'ollie');
  const Dd = Math.max(P.catchMinD(cR.body, cO.body, o), 10);
  const a = P.catchLeg(cR, cO, o, Dd, 'hard');
  const k = a.catch;
  const presses = k && k.F * Math.sin(Math.max(0, a.angleDeg) * Math.PI / 180) > 0.1 * (cO.body.m + o.m) * g;
  console.log(id, lk, a.result, 'angleDeg', a.angleDeg, 'F', k && k.F.toExponential(3), 'Fsin', k && (k.F * Math.sin(a.angleDeg * Math.PI / 180)).toFixed(0), '0.1Mg', (0.1 * (cO.body.m + o.m) * g).toFixed(0), 'slips', k && k.slips, 'presses', presses, 'R', k && k.R.toFixed(0));
}
