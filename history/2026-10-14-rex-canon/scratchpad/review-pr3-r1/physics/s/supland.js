const { P, D, g, surf, obj, R0, F0, ON, OFF4, M, cOf, oOf, planOf, sig } = require('./common.js');
const person = obj('person');
for (const s of [0, 0.5, 0.9, 0.99]) for (const ang of [0, 10, 45]) for (const lk of [6, 7, 8]) {
  const F = Math.pow(10, lk) * g;
  const r = P.throwObject(cOf(F, { safePassenger: true, airAbsorb: s }), person, ang);
  if (!r.flight || !r.flight.landed || r.flight.relativistic) continue;
  if (r.flight.vImpact < P.K.a0) continue;
  const on = oOf({ safePassenger: true, angle: ang, airAbsorb: s }), off = oOf({ safePassenger: false, angle: ang, airAbsorb: s });
  const bOn = M.throw.blastParts(r, on), bOff = M.throw.blastParts(r, off);
  // drag force at landing (air's share): energy per metre
  const k = 1 - s, Fd = 0.5 * 1.225 * r.flight.vImpact ** 2 * (person.Cd) * person.area * k;
  console.log('air', s, 'ang', ang, 'logKg', lk, 'v', sig(r.v), 'range', sig(r.flight.range), 'vImp', sig(r.flight.vImpact), 'Eimp', sig(r.Eimpact), '| land on', sig(bOn.land), 'off', sig(bOff.land), 'path', sig(bOn.path), '| air share drag at landing J/m', sig(Fd), 'x30m', sig(30 * Fd), 'frac of Eimp', sig(30 * Fd / r.Eimpact),
    '| blastFrom on', M.throw.blastFrom(r, on), 'off', M.throw.blastFrom(r, off));
}
