const { P, D, body, surface, ctx, obj, K } = require('./common');
const R = P.RESTRAINT;
const o = obj('baseball');
const opt = (c, angle) => ({ obj: o, angle, target: 30, near: 5, body, surface, anchor: c.anchor, airAbsorb: c.airAbsorb, keepForm: c.keepForm, unbreakable: c.unbreakable, ownRecoil: c.ownRecoil, m: body.m });
// scan dial for speeds near 1% c
function at(kg, share) { const c = ctx(kg, { airAbsorb: share }); const r = P.throwObject(c, o, 0); const op = opt(c, 0); return { r, parts: R.MOVES.throw.blastParts(r, op), blast: R.MOVES.throw.blast(r, op), op }; }
let lo = 1e9, hi = 1e20;
for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); const a = at(mid, 1); if (a.r.flight.relativistic) hi = mid; else lo = mid; }
for (const kg of [lo, hi]) { const a = at(kg, 1); const g = 1 + a.r.Eobj / (o.m * K.c * K.c); const h = P.handAir(body, o, a.r.v, g);
  console.log('kg', kg.toExponential(6), 'v km/s', (a.r.v / 1000).toFixed(2), 'rel', a.r.flight.relativistic, 'parts', JSON.stringify(a.parts), 'handAir E', h.E.toExponential(3), 'mAir', h.mAir.toFixed(4), 'windows r', P.blastRadius(a.blast, R.R.DP_WINDOWS).toFixed(1)); }
// dial 1e9 kg
const a = at(1e9, 1); const h = P.handAir(body, o, a.r.v, 1);
console.log('1e9 kg: v', (a.r.v/1000).toFixed(2), 'km/s; parts', JSON.stringify(a.parts), '; handAir E', h.E.toExponential(3), 'J; mAir', h.mAir.toFixed(4), 'kg; area', h.area, 'd', h.d);
console.log('  overpressure at 15 m from handAir E:', P.overpressureAt ? P.overpressureAt(h.E, 15).toFixed(0) : 'n/a', 'Pa; half:', P.overpressureAt ? P.overpressureAt(h.E/2, 15).toFixed(0) : '', 'Pa; windows radius', P.blastRadius(h.E, R.R.DP_WINDOWS).toFixed(1), 'm; half', P.blastRadius(h.E/2, R.R.DP_WINDOWS).toFixed(1));
// plan windows preset at dial 1e9 kg
const c = ctx(1e9); const pl = R.planNow('throw', c, { obj: o, angle: 0, target: 30 });
console.log('windows preset at 1e9, 100%:', JSON.stringify(pl.result('preset:windows')), ' houses', JSON.stringify(pl.result('preset:houses')));
const c0 = ctx(1e9, { airAbsorb: 0 }); const pl0 = R.planNow('throw', c0, { obj: o, angle: 0, target: 30 });
console.log('windows preset at 1e9, 0%:', JSON.stringify(pl0.result('preset:windows')));
// punch at the same dial
const pr = P.punch(ctx(1e9)); console.log('punch at 1e9: vFist', pr.vFist.toFixed(0), 'E', pr.E.toExponential(3), 'blast', R.MOVES.punch.blast(pr, {}).toExponential(3));
