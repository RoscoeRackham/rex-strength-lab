global.window = {};
const LAB = __dirname + '/../repo/rex-strength-lab';
const P = require(LAB + '/src/engine.js'); require(LAB + '/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
for (const sid of ['concrete', 'sand', 'granite', 'clay']) for (const kg of [100 * 907.18474, 1e6, 1e9, 1e15]) {
  const c = { F: kg * g, mode: 'comic', body: R3, surface: D.surfaces.find((s) => s.id === sid), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.stomp(c); const t = P.RESTRAINT.takenBack('stomp', r, c);
  console.log(sid, kg.toExponential(2), 'E', r.E.toPrecision(3), 'absorbed', (r.absorbed || 0).toPrecision(3), 'tally', t.E.toPrecision(3));
}
