global.window = {};
const ROOT = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(ROOT + '/src/engine.js'); require(ROOT + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, M = P.RESTRAINT.MOVES;
const person = D.objects.find((o) => o.id === 'person'), surf = (id) => D.surfaces.find((x) => x.id === id);
const R0 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const cOf = (F, x) => Object.assign({ F, mode: 'comic', body: R0, surface: surf('concrete'), anchor: 'friction' }, ON, x || {});
const oOf = (x) => Object.assign({ obj: person, angle: 45, near: 5, body: R0, surface: surf('concrete') }, ON, x || {});
const esc = P.throwObject(cOf(1e9 * g, { safePassenger: true }), person, 45), rel = P.throwObject(cOf(1e20 * g, { safePassenger: true }), person, 45);
console.log('esc', esc.v, JSON.stringify({ landed: esc.flight.landed, esc: esc.flight.escaped, orbit: esc.flight.orbit, rel: esc.flight.relativistic }), M.throw.passengerLanding(esc, oOf({ safePassenger: true })));
console.log('rel', rel.v, JSON.stringify({ landed: rel.flight.landed, rel: rel.flight.relativistic }), M.throw.passengerLanding(rel, oOf({ safePassenger: true })));
const fast = P.throwObject(cOf(1e9 * g, { use: 1e7 * g, safePassenger: true }), person, 45);
const on = oOf({ safePassenger: true }), off = oOf({ safePassenger: false });
console.log(M.throw.blastParts(fast, on), M.throw.blastParts(fast, off), fast.Eimpact);
const carF = P.throwObject(cOf(1e9 * g, { use: 1e7 * g }), D.objects.find((x) => x.id === 'car'), 45);
console.log(carF.flight.vImpact, carF.Eimpact, M.throw.blastParts(carF, oOf({ obj: D.objects.find((x) => x.id === 'car'), safePassenger: true })));
console.log(M.throw.blastParts(fast, { airAbsorb: 1, safePassenger: true }));
for (const kg of [1e10, 1e11, 1e12]) { const e = P.throwObject(cOf(kg * g, { safePassenger: true }), person, 45); console.log(kg, e.v, e.flight.landed, e.flight.escaped, e.flight.relativistic); }
for (const u of [3e7, 1e8, 1e9]) { const c = P.throwObject(cOf(1e10 * g, { use: u * g }), D.objects.find((x) => x.id === 'car'), 45); console.log('car', u, c.flight.landed, c.flight.vImpact, c.Eimpact); }
