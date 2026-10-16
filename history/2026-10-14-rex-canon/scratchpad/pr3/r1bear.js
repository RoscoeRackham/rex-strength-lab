global.window = {};
const path = require('path');
const ROOT = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(path.join(ROOT, 'src/engine.js')); require(path.join(ROOT, "src/data.js")); const D = window.DINO_DATA;
const person = D.objects.find((o) => o.id === 'person');
console.log('person', person.m, person.area, person.L, person.rho);
for (const s of D.surfaces) { const lg = P.PASSENGER.landGround(person, 50, s); console.log(s.id.padEnd(10), 'bear', (lg.bear / 1e3).toFixed(1), 'kN', 'vBear', lg.vBear.toFixed(1), 'm/s', 'check', (P.PASSENGER.landGround(person, lg.vBear * 0.999, s).gives), P.PASSENGER.landGround(person, lg.vBear * 1.001, s).gives); }
// compare with landShake's mean push
const g = P.K.g, R0 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true };
const conc = D.surfaces.find((s) => s.id === 'concrete');
for (const lk of [Math.log10(100 * 907.18474), 5.161, 6, 8, 9.15]) {
  const c = Object.assign({ F: Math.pow(10, lk) * g, mode: 'comic', body: R0, surface: conc, anchor: 'friction' }, ON);
  const r = P.throwObject(c, person, 45), o = Object.assign({ obj: person, angle: 45, near: 5, body: R0, surface: conc }, ON);
  const ls = P.RESTRAINT.MOVES.throw.landShake(r, o), lg = P.PASSENGER.landGround(person, r.flight.vImpact, conc);
  console.log(lk.toFixed(3), 'v', r.flight.vImpact.toFixed(1), 'mean', (ls.F / 2).toExponential(4), 'lg.push', lg.push.toExponential(4), 'ratio', (lg.push / lg.bear).toFixed(2), 'gives', lg.gives);
}
