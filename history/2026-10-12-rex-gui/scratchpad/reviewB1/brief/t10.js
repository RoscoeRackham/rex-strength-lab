const { P, D, g, surf, rex, ollie, ON, ctxOf } = require('./setup.js');
const obj = (id) => D.objects.find(o => o.id === id);
const M = P.RESTRAINT.MOVES;
for (const [oid, lg, ang] of [['bus', 9, 45], ['piano', 9, 45], ['car', 12, 45], ['bus', 12, 45]]) {
  const c = ctxOf(Math.pow(10, lg), ON);
  const o = { obj: obj(oid), angle: ang, target: 30 };
  const p = P.RESTRAINT.planNow('throw', c, o);
  for (const e of ['plaster']) {
    const res = p.result('preset:' + e);
    const hz = p.result('hazard:plaster');
    if (!res || res.never) { console.log(oid, lg, e, 'never'); continue; }
    const r = p.run(res.use);
    console.log(oid, lg, e, 'use kg', (res.use / g).toExponential(2), 'from', M.throw.shakeFrom(r, p.opt), 'landed', r.flight.landed, 'escaped', r.flight.escaped, 'orbit', r.flight.orbit, 'v', r.v.toFixed(0));
    const ra = p.run(undefined); console.log('   all-out from', M.throw.shakeFrom(ra, p.opt), 'landed', ra.flight.landed, 'v', ra.v.toExponential(2));
  }
}
