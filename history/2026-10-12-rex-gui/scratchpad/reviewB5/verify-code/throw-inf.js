const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const RS = P.RESTRAINT;
const obj = D.objects.find(o => o.id === 'car');
const surface = D.surfaces.find(s => s.id === 'concrete');
for (const ang of [90, 60]) for (const lk of [26, 30, 34, Infinity]) {
  const F = isFinite(lk) ? Math.pow(10, lk) * P.K.g : Infinity;
  const ctx = { F, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const opt = { near: 5, m: body.m, body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, obj, angle: ang };
  const r = RS.MOVES.throw.run(Object.assign({}, ctx, { use: F }), opt);
  const rc = RS.reach('throw', r, opt);
  const tg = r.toGround;
  console.log('angle', ang, 'logKg', lk, 'toGround', tg && { J: tg.J, whole: tg.whole, supplied: tg.supplied, T: tg.T }, 'plaster', rc.plaster, 'shakeFrom', RS.MOVES.throw.shakeFrom(r, opt));
}
