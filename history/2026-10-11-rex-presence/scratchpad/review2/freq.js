const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
const R = P.RESTRAINT;
for (const oid of ['car', 'piano', 'motorcycle', 'shot', 'bowling', 'person', 'desoto']) for (const sid of ['concrete', 'sand']) {
  const c = ctxOf(1e9 * g, { surface: surf(sid) });
  const o = { near: 5, obj: obj(oid), angle: 45, target: 30 };
  const p = R.planNow('throw', c, o);
  const res = p.result('hazard:plaster');
  if (res.never) { console.log(oid, sid, 'plaster never'); continue; }
  const r = p.run(res.use), src = R.MOVES.throw.shake(r, Object.assign({}, p.opt, { surface: surf(sid), body: rex }));
  console.log(oid, sid, 'plaster onset', (res.use / g).toPrecision(3), 'kg; vImpact', r.flight.vImpact.toPrecision(3), 'pulse T', (src.T * 1000).toPrecision(3), 'ms ->', (1 / src.T).toPrecision(3), 'Hz; ppv@5', (P.ppvAt(src, 5) * 1000).toPrecision(3), 'mm/s; 50.8 mm/s reached at 5 m?');
}
