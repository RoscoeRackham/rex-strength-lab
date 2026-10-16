// quick engine probes for review round 2's fixes: node eng.js [repo rex-strength-lab dir]
global.window = {};
const path = require('path');
const ROOT = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(path.join(ROOT, 'src', 'engine.js')); require(path.join(ROOT, 'src', 'data.js'));
const D = window.DINO_DATA, g = P.K.g, L = require(path.join(ROOT, 'src', 'ladder.js'));
const R3 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), O3 = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
const conc = D.surfaces.find((s) => s.id === 'concrete'), obj = (id) => D.objects.find((o) => o.id === id);
const DEF = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
const c9 = (F, body, x) => Object.assign({ F, mode: 'comic', body: body || R3, surface: conc, anchor: 'friction' }, DEF, x || {});
const TB = P.RESTRAINT.takenBack, duo = (A, B, whoA, x) => Object.assign({ A, B, whoA }, x || {});
const parts = (tb) => JSON.stringify(Object.fromEntries(Object.entries(tb.parts).filter(([, v]) => v > 0).map(([k, v]) => [k, Number(v.toPrecision(6))])));
// code-1: arm
for (const [fa, fb, x] of [[1e9, 1e8], [1e8, 1e9], [1e9, 1e8, { unbreakable: false }], [1e6, 1e5], [1e9, 1e9], [1e14, 1e3]]) {
  const A = c9(fa * g, R3, x), B = c9(fb * g, O3, x), r = P.armWrestle(A, B), tb = TB('arm', r, duo(A, B, 'rex'));
  console.log('arm', fa, fb, JSON.stringify(x || {}), r.outcome, r.winner, r.pin && Number(r.pin.v.toPrecision(5)), r.pin && Number(r.pin.E.toPrecision(5)), 'rel', r.relativistic, 'crater', r.crater && r.crater.toFixed(2), '| rex', parts(tb.by.rex), 'ollie', parts(tb.by.ollie), tb.by.rex.E > 0 ? L.glow(tb.by.rex.E, D.energyRefs).text : '');
}
// code-2: the three page cases
for (const [id, D0, kg] of [['baseball', 10, 1e14], ['baseball', 1e3, 1e13], ['person', Math.pow(10, 4.5), 1e12], ['baseball', 300, 1e8], ['car', 1e4, 1e9]]) {
  const cR = c9(kg * g), cO = c9(kg * g, O3), a = P.catchLeg(cR, cO, obj(id), D0, 'hard'), tb = TB('catch', { a, b: a }, duo(cR, cO, 'rex', { obj: obj(id) }));
  console.log('catch', id, D0, kg, a.result, 'fast', !!a.fast, '| rex', parts(tb.by.rex), 'ollie', parts(tb.by.ollie));
}
