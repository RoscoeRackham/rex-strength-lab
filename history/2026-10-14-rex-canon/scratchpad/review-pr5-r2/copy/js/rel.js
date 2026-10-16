global.window = {};
const LAB = __dirname + '/../repo/rex-strength-lab';
const P = require(LAB + '/src/engine.js'); require(LAB + '/src/data.js'); const D = window.DINO_DATA; const LAD = require(LAB + '/src/ladder.js');
const g = P.K.g, conc = D.surfaces.find((s) => s.id === 'concrete');
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), O3 = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const DEF = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
const ctx = (kg, body, x) => Object.assign({ F: kg * g, mode: 'comic', body: body || R3, surface: conc, anchor: 'friction' }, DEF, x || {});
for (const lk of [14, 15, 16, 17, 18, 19, 20]) {
  const A = ctx(10 ** lk), B = ctx(10 ** lk, O3), t = P.throwPartner(A, B, 45), tb = P.RESTRAINT.takenBack('wrestleThrow', t, { A, B, whoA: 'rex', angle: 45 });
  console.log('wrestle', lk, 'v/c', (t.r.v / P.K.c).toPrecision(3), 'rel', !!t.r.flight.relativistic, 'Eobj', t.r.Eobj.toPrecision(3), 'rex', tb.by.rex.E.toPrecision(3), 'ollie', tb.by.ollie.E.toPrecision(3), LAD.glow(tb.by.rex.E, D.energyRefs).text);
}
for (const lk of [14, 15, 16, 17]) {
  const A = ctx(10 ** lk), t = P.tossPartner(A, O3, 'Ollie', 'hard', 10, 'friction'), tb = P.RESTRAINT.takenBack('toss', t, { A, B: ctx(10 ** lk, O3), whoA: 'rex' });
  console.log('toss', lk, t.result, 'v/c', (t.v / P.K.c).toPrecision(3), 'rex', tb.by.rex.E.toPrecision(3), JSON.stringify(Object.fromEntries(Object.entries(tb.parts).filter(([k, v]) => v > 0))));
}
