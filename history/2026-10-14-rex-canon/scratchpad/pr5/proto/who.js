global.window = {};
const M = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(M + '/src/engine.js'); require(M + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, TB = P.RESTRAINT.takenBack;
const sf = (id) => D.surfaces.find((s) => s.id === id);
const DEF = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), O3 = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const c9 = (F, body, x) => Object.assign({ F, mode: 'comic', body: body || R3, surface: sf('concrete'), anchor: 'friction' }, DEF, x || {});
const dial = 100 * 907.18474 * g;
for (const whoA of ['ollie', 'rex']) { const cA = whoA === 'ollie' ? c9(dial, O3) : c9(dial), cB = whoA === 'ollie' ? c9(dial) : c9(dial, O3); const r = P.collide(cA, cB, { source: 'sprint' }); const t = TB('collide', r, { A: cA, B: cB, whoA }); console.log(whoA, r.outcome, r.v0, JSON.stringify(t.by.rex.parts), JSON.stringify(t.by.ollie.parts)); }
for (const kg of [6e9]) { const c = c9(kg * g), r = P.throwObject(c, D.objects.find((o)=>o.id==='car'), 0); const t = TB('throw', r, Object.assign({}, c, { obj: D.objects.find((o)=>o.id==='car'), angle: 0 })); console.log(t.parts.drag, r.Eobj, t.parts.drag / r.Eobj - 1, r.flight.ocean); }
