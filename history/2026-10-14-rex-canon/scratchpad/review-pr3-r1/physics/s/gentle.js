const { P, D, g, surf, obj, R0, F0, ON, OFF4, M, cOf, oOf, planOf, sig } = require('./common.js');
const person = obj('person');
const r = P.throwObject(cOf(F0, { use: 3342 * g, safePassenger: true }), person, 45);
const o = oOf({ safePassenger: true });
const ls = M.throw.landShake(r, o);
const v = r.flight.vImpact, J = person.m * v;
console.log('quick: T', ls.T, 'ppv5 mm/s', P.ppvAt(ls, 5) * 1000, 'plaster limit mm/s at f', 1 / ls.T);
const Tg = v / (1.5 * g);
const gs = { kind: 'hann', F: 2 * J / Tg, T: Tg, ground: ls.ground };
console.log('gentle: T', Tg, 'ppv5 mm/s', P.ppvAt(gs, 5) * 1000, 'stop distance (const decel) m', v * v / (2 * 1.5 * g));
// the Hann pulse: displacement during the stop if the person decelerates as the pulse: average speed v/2 over T
console.log('quick stop distance', v * ls.T / 2, 'L', person.L || Math.cbrt(6 * person.m / (Math.PI * person.rho)));
// mean and peak g
console.log('mean g', v / ls.T / g, 'peak g', 2 * v / ls.T / g);
// what 59 g "spread through them" means: a uniform body force: no internal stress
// at the plaster ceiling
const p = planOf(F0, {}, true);
const ce = p.ceiling();
const rc = p.run(ce.use);
const lc = M.throw.landShake(rc, p.opt);
console.log('ceiling use', ce.use / g, 'v', rc.v, 'vImp', rc.flight.vImpact, 'T', lc.T, 'mean g', rc.flight.vImpact / lc.T / g, 'Fpeak', lc.F, 'pressure on 0.67 m2 MPa', lc.F / 0.67 / 1e6, 'ppv5', P.ppvAt(lc, 5) * 1000, 'plaster limit', P.plasterLimitHz(1 / lc.T) * 1000);
// all-out default
const ra = p.run(F0), la = M.throw.landShake(ra, p.opt);
console.log('allout vImp', ra.flight.vImpact, 'T ms', la.T * 1000, 'mean g', ra.flight.vImpact / la.T / g, 'Fpeak MN', la.F / 1e6, 'pressure on 0.67 MPa', la.F / 0.67 / 1e6, 'concrete qult MPa', surf('concrete').qult / 1e6);
