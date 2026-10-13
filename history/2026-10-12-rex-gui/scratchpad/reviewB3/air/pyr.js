const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const K = P.K;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const M = P.RESTRAINT.MOVES.throw;
for (const [id, angle] of [['pyramid', 90], ['pyramid', 0], ['everest', 45], ['allstar', 0]]) {
 const o = D.objects.find(x => x.id === id);
 for (const share of [0, 0.5]) for (const keepForm of [true, false]) {
  const c = { F: 1e30 * K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: share, keepForm, unbreakable: true, ownRecoil: true };
  // effort for ~1.01% c for pyramid; for others all-out at 1e30
  let use;
  if (id === 'pyramid') { let lo=1, hi=1e40; for (let i=0;i<200;i++){const mid=Math.sqrt(lo*hi); const r=P.throwObject(Object.assign({},c,{use:mid}),o,angle); if (r.v<0.0101*K.c) lo=mid; else hi=mid;} use=Math.sqrt(lo*hi); }
  const cc = Object.assign({}, c, use ? { use } : {});
  const r = P.throwObject(cc, o, angle);
  const opt = { obj: o, angle, body, surface, airAbsorb: share, keepForm, unbreakable: true, ownRecoil: true, near: 30 };
  const fa = P.fastAir(o, r.Eobj, angle, 1 - share);
  const b = M.blastParts(r, opt);
  console.log(id, angle, 'share', share, 'keepForm', keepForm, 'v/c', (r.v/K.c).toPrecision(4), 'Eobj', r.Eobj.toExponential(3), 'x', fa.x.toExponential(3), 'Eair(kx)', fa.Eair.toExponential(3), '(' + (100*fa.Eair/r.Eobj).toFixed(2) + '%)', 'Eair0', fa.Eair0.toExponential(3), '(' + (100*fa.Eair0/r.Eobj).toFixed(2) + '%)', 'blast', M.blast(r,opt).toExponential(3), '(' + (100*M.blast(r,opt)/r.Eobj).toFixed(2)+'%)', 'blastFrom', M.blastFrom(r,opt), 'radius100Pa', P.blastRadius(M.blast(r,opt), 100).toExponential(3), 'radius(Eair)', P.blastRadius(fa.Eair, 100).toExponential(3));
 }
}
