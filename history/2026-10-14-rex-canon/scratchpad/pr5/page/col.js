global.window = {};
const M = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(M + '/src/engine.js'); require(M + '/src/data.js');
const LAD = require(M + '/src/ladder.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT, TB = R.takenBack;
const sf = (id) => D.surfaces.find((s) => s.id === id);
const DEF = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), O3 = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const c9 = (F, body, x) => Object.assign({ F, mode: 'comic', body: body || R3, surface: sf('concrete'), anchor: 'friction' }, DEF, x || {});
for (const [lab, F, gb, who] of [['ollie charges, gb 1e4', 100*907*g, 1e4, 'ollie'], ['rex charges, gb 1e4', 100*907*g, 1e4, 'rex'], ['ollie charges inf F gb 1e4', Infinity, 1e4, 'ollie'], ['ollie charges gb 10^3', 100*907*g, 1e3, 'ollie'], ['ollie gb 10^2', 100*907*g, 1e2, 'ollie']]) {
  const A = c9(F, who === 'ollie' ? O3 : R3), B = c9(F, who === 'ollie' ? R3 : O3);
  const r = P.collide(A, B, { source: 'set', gb });
  const tb = TB('collide', r, { A, B, whoA: who });
  const gl = LAD.glow(tb.by.rex.E, D.energyRefs);
  console.log(lab, r.outcome, 'E', tb.E.toExponential(3), 'rex', tb.by.rex.E.toExponential(3), 'ollie', tb.by.ollie.E.toExponential(3), 'strength', gl.strength, gl.text);
}
// steady push
{ const A = c9(100*907*g, O3), B = c9(100*907*g); const r = P.standoff(A, B); const tb = TB('standoff', r, { A, B, whoA: 'ollie' }); console.log('standoff', tb.E); }
// defaults: sprint
{ const A = c9(100*907*g, O3), B = c9(100*907*g); const r = P.collide(A, B, { source: 'sprint' }); const tb = TB('collide', r, { A, B, whoA: 'ollie' }); console.log('sprint all-out', tb.by.rex.E, tb.by.ollie.E, LAD.glow(tb.by.rex.E, D.energyRefs).text); }
