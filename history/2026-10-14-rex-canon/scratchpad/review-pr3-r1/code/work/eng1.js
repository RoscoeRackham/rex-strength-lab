const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/code/repo/rex-strength-lab';
const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), person = D.objects.find(o => o.id === 'person');
const surf = D.surfaces.find(s => s.id === 'concrete');
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const c = (F, x) => Object.assign({ F, mode: 'comic', body, surface: surf, anchor: 'friction' }, ON, x || {});
const M = P.RESTRAINT.MOVES.throw;
const r = P.throwObject(c(100 * 907.18474 * g, { use: 3342 * g, safePassenger: true }), person, 45);
const o = Object.assign({ obj: person, angle: 45, near: 5, body, surface: surf, safePassenger: true }, ON);
const pl = M.passengerLanding(r, o), ls = M.landShake(r, o);
console.log('v', r.v, 'vImpact', r.flight.vImpact, 'Eimpact', r.Eimpact, 'pl', pl, 'landShake', ls, 'avg g', ls && pl.J / ls.T / person.m / g, 'person m', person.m);
// with the switch: Infinity strength
for (const F of [Infinity, 1e20 * g, 1e12 * g, 1e9 * g]) {
  for (const sp of [true, false]) {
    const rr = P.throwObject(c(F, { safePassenger: sp }), person, 45);
    const oo = Object.assign({}, o, { safePassenger: sp });
    let pl2, bl, err;
    try { pl2 = M.passengerLanding(rr, oo); bl = M.blastParts(rr, oo); } catch (e) { err = e.message; }
    console.log('F', F / g, 'sp', sp, 'v', rr.v, 'landed', rr.flight && rr.flight.landed, 'rel', rr.flight && rr.flight.relativistic, 'Eimpact', rr.Eimpact, 'pl', JSON.stringify(pl2), 'blast', JSON.stringify(bl), err || '');
  }
}
