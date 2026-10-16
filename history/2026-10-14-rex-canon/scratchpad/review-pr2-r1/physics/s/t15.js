const { P, D, g, c, surf, obj, rex, ollie, ON, ctxOf, DEF, sig } = require('./hv.js');
const R = P.RESTRAINT;
for (const F of [DEF, 1e7 * g, 1e8 * g, 1e9 * g]) for (const oid of ['car', 'pickup', 'baseball']) for (const th of [0, 45]) for (const sid of ['concrete', 'sand']) {
  const cx = ctxOf(F, Object.assign({ surface: surf(sid) }, ON)), o = obj(oid);
  const r = P.throwObject(cx, o, th);
  const opt = Object.assign({ near: 5, obj: o, angle: th, surface: surf(sid), body: rex }, ON);
  const rc = R.reach('throw', r, opt);
  console.log(sig(F / g, 3), oid, th, sid, 'landed', r.flight.landed, 'plasterReach', sig(rc.plaster, 3), 'rattle', sig(rc.rattle, 3));
}
