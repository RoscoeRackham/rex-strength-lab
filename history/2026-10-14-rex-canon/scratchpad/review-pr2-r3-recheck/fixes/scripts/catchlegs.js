global.window = {}; const root = process.argv[2]; const P = require(root + '/src/engine.js'); require(root + '/src/data.js'); const D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), ob = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie || P.DEFAULT_BODIES.rex));
const CAUGHT = ['caught', 'wreckage', 'slams', 'cant-hold-it'];
const combos = {}, n = { legs: 0 };
for (const mode of ['comic', 'real']) for (const sid of ['concrete', 'sand', 'ice']) for (const own of [true, false]) for (const ub of [true, false]) for (const [kR, kO] of [[90718, 90718], [90718, 2000], [90718, 500], [1e9, 3000], [1e20, 1e20], [3000, 3000]]) for (const oid of ['baseball', 'person', 'car', 'bus', 'semi']) for (const Dm of [3, 30, 1000]) for (const st of ['easy', 'hard']) {
  const mk = (kg, b) => ({ F: kg * g, mode, body: b, surface: D.surfaces.find((s) => s.id === sid), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: ub, ownRecoil: own, safePassenger: true });
  const cR = mk(kR, body), cO = mk(kO, ob), o = D.objects.find((x) => x.id === oid);
  for (const L of [P.catchLeg(cR, cO, o, Dm, st), P.catchLeg(cO, cR, o, Dm, st)]) {
    if (!L) continue; n.legs++;
    const k = (own ? 'on ' : 'off') + (ub ? ' ub' : '   ') + ' ' + L.result + ' T:' + (L.recoilAbsorbedT ? 'abs' : L.toGroundT ? 'gnd' : '-') + ' C:' + (L.recoilAbsorbedC ? 'abs' : L.toGroundC ? 'gnd' : '-') + ' reaches:' + CAUGHT.includes(L.result);
    combos[k] = (combos[k] || 0) + 1;
  }
}
console.log(n.legs + ' legs'); for (const k of Object.keys(combos).sort()) console.log(k.padEnd(60) + combos[k]);
