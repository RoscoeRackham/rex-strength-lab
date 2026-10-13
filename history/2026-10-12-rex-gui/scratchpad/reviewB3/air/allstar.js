const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const K = P.K;
console.log('Hs', K.Hs, 'rho0', K.rho0, 'c', K.c, 'R_E', K.R_E);
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const o = D.objects.find(x => x.id === 'baseball');
const M = P.RESTRAINT.MOVES.throw;
for (const share of [0, 0.5, 0.9, 0.99, 0.999, 1]) {
  const c = { F: 1.8e23 * K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: share, keepForm: share > 0, unbreakable: true, ownRecoil: true };
  const r = P.throwObject(c, o, 0);
  const fa = P.fastAir(o, r.Eobj, 0, 1 - share);
  const opt = { obj: o, angle: 0, body, surface, airAbsorb: share, keepForm: share>0, unbreakable: true, ownRecoil: true, near: 30 };
  const b = M.blastParts(r, opt);
  console.log('share', share, 'v/c', r.v/K.c, 'gamma-1', (r.Eobj/(o.m*K.c*K.c)).toExponential(4), 'Eobj', r.Eobj.toExponential(4), 'x', fa.x.toExponential(4), 'Eair', fa.Eair.toExponential(4), 'ratio to 0%', (fa.Eair/fa.Eair0).toFixed(6), 'keep', fa.keep.toExponential(3), 'dHalf', fa.dHalf, 'vOut/c', fa.vOut/K.c, 'land', b.land.toExponential(4), 'path', b.path.toExponential(4), 'line', JSON.stringify(r.line), 'recoilV', r.recoilV);
}
