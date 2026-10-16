const ENG = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab/src/engine.js';
global.window = global;
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const P = require(ENG);
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((x) => x.id === id), obj = (id) => D.objects.find((x) => x.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const ctxOf = (F, extra) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction' }, extra || {});
const sh = (L) => JSON.stringify({ res: L.result, carried: L.catch && L.catch.carried, uAfter: L.catch && L.catch.uAfter, slide: L.catch && L.catch.slide, sinkRaw: L.catch && L.catch.sinkRatioRaw, rAC: L.recoilAbsorbedC, tgC: L.toGroundC, vArr: L.vArrive, p: L.vArrive && P.vToMomentum(L.vArrive, L.obj ? L.obj.m : 0) });
// (1) unbounded
const c1 = ctxOf(Infinity, ON), L1 = P.catchLeg(c1, Object.assign({}, c1, { body: ollie }), obj('baseball'), 10, 'hard');
console.log('inf', sh(L1), 'want sink', (ollie.m + obj('baseball').m) * g / (P.qultFor(surf('concrete'), ollie.footB) * 2 * ollie.footArea));
// (2) cant-hold-it
for (const st of [ON, Object.assign({}, ON, { ownRecoil: false }), {}, { ownRecoil: true }]) {
  const cT = ctxOf(1e5 * g, st), cC = Object.assign(ctxOf(500 * g, st), { body: ollie });
  const L2 = P.catchLeg(cT, cC, obj('car'), 30, 'easy');
  console.log('canthold', JSON.stringify(st), sh(L2), 'p', P.vToMomentum(L2.vArrive, obj('car').m));
}
// (3) wreckage
for (const st of [Object.assign({}, ON, { keepForm: false }), Object.assign({}, ON, { keepForm: false, ownRecoil: false }), {}, { ownRecoil: true }]) {
  const cT = ctxOf(1e6 * g, st), L3 = P.catchLeg(cT, Object.assign({}, cT, { body: ollie }), obj('motorcycle'), 10, 'hard');
  console.log('wreck', JSON.stringify(st), sh(L3), 'p', P.vToMomentum(L3.vArrive, obj('motorcycle').m));
}
