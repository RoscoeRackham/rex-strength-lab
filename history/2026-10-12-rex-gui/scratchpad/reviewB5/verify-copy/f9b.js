const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const surface = D.surfaces.find(s => s.id === 'granite');
for (const id of ['loco', 'nimitz', 'empire', 'titanic']) {
  const o = D.objects.find(x => x.id === id); if (!o) { console.log('no', id); continue; }
  for (const m of [3007, 3e9]) {
    const body = P.makeBody({ build: 'rex', H: 3.048, m });
    for (const own of [false, true]) {
      const ctx = { F: 1e14 * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: own };
      const r = P.pull(ctx, o);
      const sh = P.RESTRAINT.MOVES.pull.shake(r, { ownRecoil: true, surface, obj: o, body });
      console.log(id, 'm', m, 'own', own, 'canMove', r.canMove, 'anchorR', (r.anchor && r.anchor.R).toExponential(3), 't10m', r.t10m && r.t10m.toFixed(3), 'meanF', ((P.vToMomentum(r.vEnd, o.m) + r.resist * r.t10m) / r.t10m).toExponential(3), 'plaster(if counted)', sh ? P.plasterReach(sh).toFixed(2) : null);
    }
  }
}
