// The person's landing: energy, momentum, the shaking pulse; the landing blast at high dials; what PR3's landing
// options would change; and the presence.js checks' numbers at 3,007 kg.
global.window = {};
const ROOT = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
const P = require(ROOT + '/src/engine.js');
require(ROOT + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT, M = R.MOVES;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 3) => (typeof x !== 'number' || !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const POW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const person = ob('person');
const ctxOf = (F, extra) => Object.assign({ F, mode: 'comic', body, surface: sf('concrete'), anchor: 'friction' }, POW, extra || {});
console.log('person', JSON.stringify({ m: person.m, area: person.area, Cd: person.Cd, CdSup: person.CdSup, rho: person.rho, L: person.L, passenger: person.passenger }));
// least effort with SP on: 3,340 kg-force
const r = P.throwObject(ctxOf(100 * 907.18474 * g, { use: 3340 * g, safePassenger: true }), person, 45);
const o = { obj: person, angle: 45, near: 5, surface: sf('concrete'), body, safePassenger: true };
const ls = M.throw.landShake(r, o);
const L = Math.cbrt(6 * person.m / (Math.PI * person.rho));
console.log('least SP on: v', sig(r.v), 'vImpact', sig(r.flight.vImpact), 'Eimpact J', sig(r.Eimpact), 'momentum', sig(P.vToMomentum(r.flight.vImpact, person.m)), 'L', sig(L), 'pulse T', sig(L / r.flight.vImpact), 'mean force kN', sig(P.vToMomentum(r.flight.vImpact, person.m) / (L / r.flight.vImpact) / 1000), 'g during stop', sig(r.flight.vImpact / (L / r.flight.vImpact) / g), 'ppv 5 m mm/s', sig(P.ppvAt(ls, 5) * 1000));
// if Safe passenger's 'manageable push' at landing meant a gentle stop (1.5 g held), the pulse would be v / (1.5 g)
const Tg = r.flight.vImpact / (1.5 * g), soft = P.impulseSource(sf('concrete'), P.vToMomentum(r.flight.vImpact, person.m), Tg);
console.log('  alt reading, stopped at 1.5 g: T', sig(Tg), 's, ppv 5 m', sig(P.ppvAt(soft, 5) * 1000), 'mm/s');
// at what effort does the alt reading's plaster hazard start? scan
for (const kg of [27100, 1e5, 1e6, 1e7, 1e8]) {
  const rr = P.throwObject(ctxOf(1e12 * g, { use: kg * g, safePassenger: true }), person, 45);
  if (!rr.flight || !rr.flight.landed) { console.log('  ', kg, 'kgf: no landing', JSON.stringify({ esc: rr.flight && rr.flight.escaped, orb: rr.flight && rr.flight.orbit })); continue; }
  const v = rr.flight.vImpact, a = P.impulseSource(sf('concrete'), P.vToMomentum(v, person.m), Math.max(1e-3, L / v)), b = P.impulseSource(sf('concrete'), P.vToMomentum(v, person.m), v / (1.5 * g));
  const bl = M.throw.blastParts(rr, Object.assign({}, o, POW));
  console.log('  ', kg, 'kgf: release', sig(rr.v), 'lands', sig(v), 'E', sig(rr.Eimpact), 'J; plaster(L/v)', P.plasterOver(a, 5), 'reach', sig(P.plasterReach(a)), 'm; plaster(1.5 g stop)', P.plasterOver(b, 5), sig(P.plasterReach(b)), 'm; blast land', sig(bl.land), 'path', sig(bl.path), 'J');
}
// presence.js checks at 3,007 kg (its own body)
const rex7 = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const c7 = (F, x) => Object.assign({ F, mode: 'comic', body: rex7, surface: sf('concrete'), groundHolds: false, anchor: 'friction' }, x || {});
const tp = P.throwObject(c7(90718 * g, { use: 4000 * g }), person, 45), tAll = P.throwObject(c7(90718 * g), person, 45);
const pz = R.HAZARDS.find((h) => h.id === 'passenger');
console.log('presence tp v', sig(tp.v), 'launch felt', sig(P.PASSENGER.felt(Math.max(tp.launchG, tp.launchGPeak), 45)), 'limit', sig(P.PASSENGER.noHarm(tp.launchT)), 'haz off', pz.test(M.throw, tp, { obj: person, angle: 45 }), 'haz SP', pz.test(M.throw, tp, { obj: person, angle: 45, safePassenger: true }));
console.log('presence tAll v', sig(tAll.v), 'dragG', sig(P.PASSENGER.dragG(person, tAll.v)), 'haz SP (main)', pz.test(M.throw, tAll, { obj: person, angle: 45, safePassenger: true }), 'haz off', pz.test(M.throw, tAll, { obj: person, angle: 45 }));
// powers.js 5a check at 7e4 kg: drag numbers
const rex7b = rex7, r5a = P.throwObject(Object.assign({ F: 7e4 * g, mode: 'comic', body: rex7b, surface: sf('concrete'), anchor: 'friction' }, { airAbsorb: 0.6, safePassenger: true }), person, 30);
console.log('powers 5a: v', sig(r5a.v), 'dragG real', sig(P.PASSENGER.dragG(person, r5a.v)), 'launch felt', sig(P.PASSENGER.felt(Math.max(r5a.launchG, r5a.launchGPeak), 30)), 'limit', sig(P.PASSENGER.noHarm(r5a.launchT)),
  'passenger SP-off at 0.6/0/1:', [0.6, 0, 1].map((s) => M.throw.passenger(r5a, { obj: person, angle: 30, airAbsorb: s })).join());
