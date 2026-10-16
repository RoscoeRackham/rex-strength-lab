global.window = {}; const root = process.argv[2]; const P = require(root + '/src/engine.js'); require(root + '/src/data.js'); const D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), ob = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie || P.DEFAULT_BODIES.rex));
const CAUGHT = ['caught', 'wreckage', 'slams', 'cant-hold-it'];
const combos = {}; let n = 0, bad = [];
for (const kf of [true, false]) for (const [kR, kO] of [[1e12, 1e12], [1e16, 1e16], [1e20, 1e20], [1e25, 1e25], [1e12, 500]]) for (const oid of ['baseball', 'car', 'semi', 'person']) for (const Dm of [10, 1e4, 1e6]) for (const st of ['easy', 'hard']) {
  const mk = (kg, b) => ({ F: kg * g, mode: 'comic', body: b, surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: kf, unbreakable: true, ownRecoil: true, safePassenger: true });
  const cR = mk(kR, body), cO = mk(kO, ob), o = D.objects.find((x) => x.id === oid);
  const legs = [P.catchLeg(cR, cO, o, Dm, st), P.catchLeg(cO, cR, o, Dm, st)];
  for (const L of legs) { if (!L) continue; n++; const k = L.result + ' T:' + (L.recoilAbsorbedT ? 'abs' : L.toGroundT ? 'gnd' : '-') + ' reaches:' + CAUGHT.includes(L.result); combos[k] = (combos[k] || 0) + 1; }
}
console.log(n + ' legs'); for (const k of Object.keys(combos).sort()) console.log(k.padEnd(50) + combos[k]);
