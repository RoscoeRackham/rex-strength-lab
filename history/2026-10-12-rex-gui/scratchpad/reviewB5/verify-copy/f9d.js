const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const surface = D.surfaces.find(s => s.id === 'granite');
const src = P.impulseSource(surface, 14.7e9 * 2.02, 2.02);
console.log('14.7 GN over 2.02 s: plaster', P.plasterReach(src), 'feel', P.ppvReach(src, P.VIB.TH.feel));
let worst = 0;
for (const o of D.objects.filter(x => !x.noPull)) for (const m of [3007, 3e6, 3e9, 3e12]) for (const lk of [6, 10, 14, 20, 30]) {
  const body = P.makeBody({ build: 'rex', H: 3.048, m });
  const ctx = { F: Math.pow(10, lk) * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: false };
  const r = P.pull(ctx, o); if (!r.canMove) continue;
  const sh = P.RESTRAINT.MOVES.pull.shake(r, { ownRecoil: true, surface, obj: o, body });
  const pr = sh ? P.plasterReach(sh) : 0, fe = sh ? P.ppvReach(sh, P.VIB.TH.feel) : 0;
  if (fe > worst) { worst = fe; console.log('worst so far', o.id, m, lk, 'plaster', pr, 'feel', fe, 'capR', r.anchor.R.toExponential(2), 'meanF', ((P.vToMomentum(r.vEnd, o.m) + r.resist * r.t10m) / r.t10m).toExponential(2)); }
}
