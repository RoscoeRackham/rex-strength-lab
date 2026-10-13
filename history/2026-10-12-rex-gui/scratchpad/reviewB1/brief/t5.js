const { P, D, g, surf, rex, ollie, ON, ctxOf } = require('./setup.js');
const obj = (id) => D.objects.find(o => o.id === id);
const M = P.RESTRAINT.MOVES;
for (const lg of [7, 8, 9, 10]) {
  const c = ctxOf(Math.pow(10, lg), ON);
  const o = { obj: obj('car'), angle: 45, target: 30 };
  const p = P.RESTRAINT.planNow('throw', c, o);
  const res = p.result('preset:plaster');
  const hz = p.result('hazard:plaster');
  if (!res || res.never) { console.log(lg, 'plaster never'); continue; }
  const r = p.run(res.use);
  console.log(lg, 'plaster at kg', (res.use / g).toExponential(2), 'from', M.throw.shakeFrom(r, p.opt), 'landed', r.flight.landed, 'escaped', r.flight.escaped, 'orbit', r.flight.orbit, 'range', r.flight.range.toExponential(2));
}
