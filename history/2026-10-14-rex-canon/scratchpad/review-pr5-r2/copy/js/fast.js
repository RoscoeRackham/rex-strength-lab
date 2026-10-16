global.window = {};
const LAB = __dirname + '/../repo/rex-strength-lab';
const P = require(LAB + '/src/engine.js'); require(LAB + '/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, conc = D.surfaces.find((s) => s.id === 'concrete'), obj = (id) => D.objects.find((x) => x.id === id);
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const mk = (kg, body, x) => Object.assign({ F: kg * g, mode: 'comic', body: body || R3, surface: conc, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, x || {});
for (const [om, kg] of [[3000, 1e16], [1e6, 1e19], [1e6, 3e18]]) for (const s of [1, 0.5]) {
  const OB = P.makeBody({ build: 'ollie', H: 3.06, m: om });
  const A = mk(kg, R3, { airAbsorb: s }), B = mk(kg, OB), t = P.throwPartner(A, B, 45);
  const tb = P.RESTRAINT.takenBack('wrestleThrow', t, { A, B, whoA: 'rex', angle: 45 });
  const fa1 = P.fastAir(t.obj, t.r.Eobj, 45, 1), faK = P.fastAir(t.obj, t.r.Eobj, 45, 1 - s);
  console.log('ollie', om, 'dial', kg, 'share', s, 'rel', !!t.r.flight.relativistic, 'Eobj', t.r.Eobj.toPrecision(3), 'tile', tb.by.rex.E.toPrecision(3), 'realAir(fastAir kA=1)', fa1.Eair.toPrecision(3), (100 * fa1.Eair / t.r.Eobj).toFixed(1) + '%', 'air at kA', faK.Eair.toPrecision(3), (100 * faK.Eair / t.r.Eobj).toFixed(1) + '%');
}
// the Throw tab: a car at 1e16 45 deg
for (const [id, kg] of [['car', 1e16], ['tank', 1e18], ['loco', 1e18]]) { const c = mk(kg), r = P.throwObject(c, obj(id), 45), tb = P.RESTRAINT.takenBack('throw', r, Object.assign({}, c, { obj: obj(id), angle: 45 })); const fa1 = P.fastAir(obj(id), r.Eobj, 45, 1); console.log(id, kg, 'rel', !!r.flight.relativistic, 'Eobj', r.Eobj.toPrecision(3), 'tile', tb.E.toPrecision(3), 'fastAir', fa1.Eair.toPrecision(3), (100 * fa1.Eair / r.Eobj).toFixed(1) + '%', 'outweighs', fa1.outweighs); }
{ const O3 = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie }), A = mk(1e16), t = P.tossPartner(A, O3, 'Ollie', 'hard', 10, 'friction'); const tb = P.RESTRAINT.takenBack('toss', t, { A, B: mk(1e16, O3), whoA: 'rex' }); const fa = P.fastAir(t.obj, tb.E, 90, 1); console.log('toss 1e16', t.result, (t.v / P.K.c).toPrecision(3), 'tile', tb.E.toPrecision(3), 'fastAir 90', fa.Eair.toPrecision(3), (100 * fa.Eair / tb.E).toFixed(1) + '%'); }
