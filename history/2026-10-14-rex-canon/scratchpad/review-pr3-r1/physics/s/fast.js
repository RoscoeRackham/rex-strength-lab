const { P, D, g, surf, obj, R0, F0, ON, OFF4, M, cOf, oOf, planOf, sig } = require('./common.js');
const person = obj('person');
for (const [lk, ang] of [[9.15, 45], [9, 45], [8, 45], [9.3, 90], [9.5, 90], [5.5, 45]]) {
  const F = Math.pow(10, lk) * g;
  const r = P.throwObject(cOf(F, { safePassenger: true }), person, ang);
  const o = oOf({ safePassenger: true, angle: ang });
  const ls = M.throw.landShake(r, o);
  const reach = P.RESTRAINT.reach('throw', r, o);
  const ppv5 = ls ? P.ppvAt ? P.ppvAt(ls, 5) : null : null;
  console.log('logKg', lk, 'ang', ang, 'v', sig(r.v), 'landed', r.flight.landed, 'vImp', r.flight.landed ? sig(r.flight.vImpact) : '-', 'Eimp', sig(r.Eimpact), 'quake', r.quake, 'crater', r.crater,
    '| pulse T', ls && sig(ls.T), 'Fpeak', ls && sig(ls.F), 'p on 0.67m2 MPa', ls && sig(ls.F / 0.67 / 1e6), '| plaster reach', sig(reach.plaster), 'feel', sig(reach.feel), 'rattle', sig(reach.rattle));
}
console.log(Object.keys(P).filter(k => /ppv|quake|seism|plaster/i.test(k)));
