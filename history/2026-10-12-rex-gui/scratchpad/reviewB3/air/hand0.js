const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const K = P.K;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const M = P.RESTRAINT.MOVES.throw;
const o = D.objects.find(x => x.id === 'baseball');
for (const kg of [1e7, 1e9, 1e11]) for (const share of [0, 0.01, 0.5, 1]) {
  const c = { F: kg * K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.throwObject(c, o, 45);
  const opt = { obj: o, angle: 45, body, surface, airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true, near: 30 };
  const b = M.blastParts(r, opt);
  console.log('dial', kg.toExponential(0), 'share', share, 'v', r.v.toFixed(0), 'Eobj', r.Eobj.toExponential(3), 'blast', M.blast(r, opt).toExponential(3), 'hand', (b.hand || 0).toExponential(3), 'R(100 Pa) m', P.blastRadius(M.blast(r, opt), 100).toFixed(0));
}
