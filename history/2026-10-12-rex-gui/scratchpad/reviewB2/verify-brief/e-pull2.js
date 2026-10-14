const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surface = D.surfaces.find((s) => s.id === 'concrete');
for (const obj of D.objects) {
  const c = { F: 1e12 * g, mode: 'comic', surface, anchor: 'friction', airAbsorb: 1, keepForm: true, ownRecoil: true, unbreakable: true, body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }) };
  const r = P.pull(c, obj);
  if (!r.canMove) { console.log(obj.id, 'cannot move'); continue; }
  const J = P.vToMomentum(r.vEnd, obj.m) + r.resist * r.t10m;
  const src = P.impulseSource(surface, J, r.t10m);
  console.log(obj.id, 'm', obj.m.toExponential(2), 't10m', r.t10m.toFixed(2), 'J', J.toExponential(2), 'ppv@5m mm/s', (P.ppvAt(src, 5) * 1000).toPrecision(3), 'plaster@5m', P.plasterOver(src, 5));
}
