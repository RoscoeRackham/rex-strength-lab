global.window = {};
const LAB = __dirname + '/../repo/rex-strength-lab';
const P = require(LAB + '/src/engine.js'); require(LAB + '/src/data.js'); const D = window.DINO_DATA; const LAD = require(LAB + '/src/ladder.js');
const g = P.K.g, conc = D.surfaces.find((s) => s.id === 'concrete');
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), O3 = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const DEF = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
const dial = 100 * 907.18474;
const ctx = (kg, body, x) => Object.assign({ F: kg * g, mode: 'comic', body: body || R3, surface: conc, anchor: 'friction' }, DEF, x || {});
const cO = ctx(dial, O3), cR = ctx(dial, R3);
const r = P.collide(cO, cR, { source: 'set', gb: 0.001/Math.sqrt(1-1e-6), bounce: false });
console.log(Object.keys(r), r.outcome, r.noCharge, r.v0);
const t = P.RESTRAINT.takenBack('collide', r, { A: cO, B: cR, whoA: 'ollie' });
console.log(t.by.rex.E, t.by.ollie.E, JSON.stringify(t.parts));
for (const J of [t.by.rex.E, t.by.ollie.E]) { const gl = LAD.glow(J, D.energyRefs); console.log(gl.text, gl.level.toFixed(3), LAD.compare(J, D.energyRefs).text); }
console.log('Q', r.Q, 'h.Q', r.h && r.h.Q, 'hitAbsorbed', JSON.stringify(r.hitAbsorbed), 'stop', JSON.stringify(r.carry && r.carry.stop));
const r2 = P.collide(cO, cR, { source: 'sprint', bounce: false }); const t2 = P.RESTRAINT.takenBack('collide', r2, { A: cO, B: cR, whoA: 'ollie' });
console.log('sprint', r2.outcome, 'Q', r2.Q, 'h.Q', r2.h && r2.h.Q, 'rex', t2.by.rex.E, 'ollie', t2.by.ollie.E, LAD.glow(t2.by.rex.E, D.energyRefs).text, LAD.compare(t2.by.rex.E, D.energyRefs).text, LAD.glow(t2.by.ollie.E, D.energyRefs).text);
