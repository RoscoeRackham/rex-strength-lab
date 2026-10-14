// Finding 1: dense catcher, powers off, branch vs main
const S = __dirname;
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const B = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const M = require(S + '/engine-main.js');
const g = 9.80665;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
function run(P, oid, style, mO, Fkg, D0, extra) {
  const R = Object.assign({ F: Fkg * g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf('granite'), anchor: 'bolted', groundHolds: false }, extra || {});
  const O = Object.assign({ F: Fkg * g, mode: 'comic', body: P.makeBody({ build: 'ollie', H: 3.048, m: mO }), surface: surf('granite'), anchor: 'bolted', groundHolds: false }, extra || {});
  const L = P.catchLeg(R, O, obj(oid), D0, style);
  return L;
}
for (const [oid, style] of [['shot', 'easy'], ['shot', 'hard'], ['baseball', 'easy'], ['baseball', 'hard']]) {
  for (const mO of [2e23, 1e20]) {
    const a = run(M, oid, style, mO, 1e30, 100), b = run(B, oid, style, mO, 1e30, 100, { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false });
    const f = (L) => L.catch ? `res=${L.result} vArr=${(L.vArrive/2.998e8*100).toFixed(3)}%c Ecatch=${L.catch.Ecatch.toExponential(3)} E1=${L.catch.E1.toExponential(3)} first=${(L.catch.firstShare||0).toFixed(4)} rel=${!!L.catch.relativistic}` : `res=${L.result}`;
    console.log(oid, style, 'mO', mO, 'wellDom', b.wells && b.wells.wellDominated);
    console.log('  main  ', f(a));
    console.log('  branch', f(b));
  }
}
