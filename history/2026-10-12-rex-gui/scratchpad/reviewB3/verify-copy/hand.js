const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const obj = D.objects.find(o => o.id === 'baseball');
for (const a of [0, 0.01, 0.5, 1]) {
  const ctx = { F: 1.8e23 * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: a, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.throwObject(ctx, obj, 0);
  const o = Object.assign({}, ctx, { obj, angle: 0, near: P.RESTRAINT.R.NEAR });
  const M = P.RESTRAINT.MOVES.throw;
  const b = M.blastParts(r, o);
  console.log('share', a, 'blast J', M.blast(r, o).toExponential(3), 'parts', JSON.stringify({ land: b.land, path: b.path, hand: b.hand }), 'from', M.blastFrom(r, o), 'Eobj', r.Eobj.toExponential(3), 'tTNT blast', (M.blast(r, o) / 4.184e9).toExponential(2));
}
