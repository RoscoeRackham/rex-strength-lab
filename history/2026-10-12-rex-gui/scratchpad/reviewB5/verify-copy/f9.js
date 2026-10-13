const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const surface = D.surfaces.find(s => s.id === 'granite');
const loco = D.objects.find(o => o.id === 'loco');
for (const m of [3007, 3e9]) {
  const body = P.makeBody({ build: 'rex', H: 3.048, m });
  for (const own of [false, true]) {
    const ctx = { F: 1e14 * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: own };
    const r = P.pull(ctx, loco);
    const sh = P.RESTRAINT.MOVES.pull.shake(r, { ownRecoil: true, surface, obj: loco, body });
    console.log('m', m, 'own', own, 'anchorR', r.anchor && r.anchor.R, 't10m', r.t10m, 'vEnd', r.vEnd, 'resist', r.resist, 'limitedBy', r.limitedBy, 'J(rope)', P.vToMomentum(r.vEnd, loco.m) + r.resist * r.t10m, 'plasterReach(if counted)', sh ? P.plasterReach(sh) : null, 'ppv5', sh ? P.ppvAt && P.ppvAt(sh, 5) : null);
  }
}
