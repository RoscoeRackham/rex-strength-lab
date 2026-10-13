global.window = {};
const W = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(W + '/src/engine.js'); require(W + '/src/data.js'); const D = window.DINO_DATA; const g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const kg = 1.8e23;
for (const [share, own] of [[0, false], [1, false], [1, true], [0.5, false]]) {
  const c = { F: kg * g, mode: 'comic', body: rex, surface: surf('concrete'), groundHolds: false, anchor: 'friction', airAbsorb: share, ownRecoil: own };
  const r = P.throwObject(c, obj('baseball'), 0);
  const o = { obj: obj('baseball'), angle: 0, near: 5, surface: c.surface, body: rex, anchor: 'friction', airAbsorb: share, ownRecoil: own };
  const M = P.RESTRAINT.MOVES.throw;
  console.log('share', share, 'own', own, 'recoil/c', (r.recoilV / P.K.c).toFixed(4), 'recoilE', (r.recoilE||0).toExponential(2), 'blast', M.blast(r, o).toExponential(3), 'from', M.blastFrom(r, o), 'boom', P.RESTRAINT.HAZARDS[0].test(M, r, o));
}
