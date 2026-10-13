const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const K = P.K;
const bR = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const bO = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const mk = (body, share, F, anchor) => ({ F, mode: 'comic', body, surface, anchor: anchor || 'friction', airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true });
for (const id of ['baseball', 'car', 'pyramid']) for (const F of [1e24 * K.g, 1e25 * K.g, 1e27*K.g, Infinity]) for (const anchor of ['bolted']) {
  const o = D.objects.find(x => x.id === id);
  const L = P.catchLeg(mk(bR, 1, F), mk(bO, 1, F, anchor), o, 1000, 'hard');
  const k = L.catch;
  const r = P.throwObject(Object.assign({}, mk(bR, 1, F), { noFlight: true }), o, L.aim ? L.aim.thetaDeg : 0);
  console.log(id, F/K.g, anchor, L.result, 'Eobj', r.Eobj.toExponential(4), 'gamma', (1 + r.Eobj/(o.m*K.c*K.c)).toExponential(3), 'Ecatch', k && k.Ecatch && k.Ecatch.toExponential(4), 'ratio', k && (k.Ecatch / r.Eobj).toPrecision(4), 'toGroundC.J', L.toGroundC && L.toGroundC.J.toExponential(3));
}
