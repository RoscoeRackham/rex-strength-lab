const R = process.argv[2];
const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA; const L = require(R + '/src/ladder.js');
const g = P.K.g, obj = (id) => D.objects.find((x) => x.id === id);
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, o || {});
const O = () => P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
// unbounded throw
const c = mk({ F: Infinity }), r = P.throwObject(c, obj('car'), 45);
const tb = P.RESTRAINT.takenBack('throw', r, Object.assign({}, c, { obj: obj('car'), angle: 45 }));
console.log('throw inf: v/c', r.v0 / 299792458, 'E', tb.E, 'unbounded', tb.unbounded, 'parts', JSON.stringify(tb.parts));
// paradox collide: Rex bolted, Ollie charges at unlimited? use the canon paradox: B bolted on unbreakable footing
const A = mk({ body: O() }), B = mk({ anchor: 'bolted' }), rc = P.collide(A, B, { source: 'sprint' });
const tc = P.RESTRAINT.takenBack('collide', rc, { A, B, whoA: 'ollie' });
console.log('collide bolted Rex: outcome', rc.outcome, 'E', tc.E, 'rex', tc.by.rex.E, 'ollie', tc.by.ollie.E, JSON.stringify(tc.parts));
// the 499 kJ hit
const A2 = mk({ body: O() }), B2 = mk(), r2 = P.collide(A2, B2, { source: 'sprint' });
const t2 = P.RESTRAINT.takenBack('collide', r2, { A: A2, B: B2, whoA: 'ollie' });
const refs = D.energyRefs, fl = refs.find((x) => x.key === L.GLOW_KEYS.flicker);
for (const J of [t2.by.rex.E, 449e3, 451e3, 470e3, 516e3, 517.5e3, 600e3]) { const w = L.glow(J, refs); console.log((J/1e3).toFixed(1) + ' kJ', 'glow:', w.text, 'level', w.level.toFixed(4), 'strength', w.strength.toFixed(4), '| compare:', L.compare(J, refs).text); }
console.log('flicker rung J', fl.J, 'rough', fl.rough, 'band low', fl.J / L.SAME);
