global.window = {};
const LAB = __dirname + '/../repo/rex-strength-lab';
const P = require(LAB + '/src/engine.js'); require(LAB + '/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, conc = D.surfaces.find((s) => s.id === 'concrete'), obj = (id) => D.objects.find((x) => x.id === id);
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
for (const [id, kg, ang] of [['baseball', 100 * 907.18474, 45], ['baseball', 1e6, 45], ['shotput', 100 * 907.18474, 45], ['car', 1e6, 45], ['car', 1e7, 20], ['person', 1e6, 45], ['bar', 100*907.18474, 45]]) for (const s of [0.5, 0.3]) {
  if (!obj(id)) { console.log('no', id); continue; }
  const c = { F: kg * g, mode: 'comic', body: R3, surface: conc, anchor: 'friction', airAbsorb: s, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
  const r = P.throwObject(c, obj(id), ang), t = P.RESTRAINT.takenBack('throw', r, Object.assign({}, c, { obj: obj(id), angle: ang }));
  const kAir = 1 - s;
  console.log(id, kg.toExponential(1), ang, 'share', s, 'v', r.v.toPrecision(3), 'super', r.v >= P.K.a0, 'rel', !!r.flight.relativistic, 'dragLoss0', r.dragLoss0 && r.dragLoss0.toPrecision(4), 'blast kAir*dl0', r.dragLoss0 && (kAir * r.dragLoss0).toPrecision(4), 'Eobj', r.Eobj.toPrecision(4), 'tile drag', t.parts.drag.toPrecision(4), 'pass', t.parts.passenger.toPrecision(3));
}
