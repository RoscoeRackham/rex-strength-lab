const { P, surf, obj, rex, g } = require('./base.js');
const person = obj('person');
const F = Math.pow(10, 5) * g; // check default dial
console.log('person', person.m);
const ctx = { F: 90718 * g, mode: 'comic', body: rex, surface: surf('concrete'), groundHolds: false, anchor: 'friction' };
const p = P.RESTRAINT.planNow('throw', ctx, { obj: person, angle: 45, target: 30 });
const gl = p.goal(), ce = p.ceiling();
console.log('goal use kgf', gl.use / g, 'ceiling', ce.by, ce.use / g);
for (const h of p.hazards()) console.log(' hazard', h.id, h.never ? 'never' : (h.use / g).toFixed(0));
const r = p.run(gl.use);
console.log('launchG', r.launchG, 'launchT', r.launchT, 'felt', P.PASSENGER.felt(r.launchG, 45), 'noHarm', P.PASSENGER.noHarm(r.launchT), 'injury', P.PASSENGER.injury(r.launchT), 'vImpact', r.flight.vImpact, 'grip', r.gripRatio);
// effort at which felt > noHarm, and > injury
const s1 = P.RESTRAINT.search((u) => { const x = p.run(u); return x.canMove && P.PASSENGER.felt(x.launchG, 45) > P.PASSENGER.noHarm(x.launchT); }, p.lo, p.hi, false); while (s1.use === undefined) s1.step();
const s2 = P.RESTRAINT.search((u) => { const x = p.run(u); return x.canMove && P.PASSENGER.felt(x.launchG, 45) > P.PASSENGER.injury(x.launchT); }, p.lo, p.hi, false); while (s2.use === undefined) s2.step();
const x1 = p.run(s1.use), x2 = p.run(s2.use);
console.log('past ride limits from', (s1.use / g).toFixed(0), 'kgf; range', x1.flight.range, 'v', x1.v);
console.log('injury from', (s2.use / g).toFixed(0), 'kgf; range', x2.flight.range, 'v', x2.v, 'felt', P.PASSENGER.felt(x2.launchG, 45));
