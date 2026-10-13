const { P, D, g, surf, rex, ollie, ON, ctxOf } = require('./setup.js');
const obj = (id) => D.objects.find(o => o.id === id);
const M = P.RESTRAINT.MOVES;
for (const [oid, ang] of [['car', 45], ['car', 0], ['baseball', 45], ['bus', 30], ['piano', 45]]) {
  const c = ctxOf(100 * 907.18474, ON);
  const o = { obj: obj(oid), angle: ang, target: 30 };
  const p = P.RESTRAINT.planNow('throw', c, o);
  for (const e of ['plaster', 'rattle']) {
    const res = p.result('preset:' + e);
    if (!res || res.never) { console.log(oid, ang, e, 'never'); continue; }
    const r = p.run(res.use);
    const opt = p.opt;
    const land = M.throw.landShake(r, opt), own = r.toGround ? P.impulseSource(opt.surface, r.toGround.J, r.toGround.T) : null;
    console.log(oid, ang, e, 'use kg', (res.use / g).toExponential(2), 'from', M.throw.shakeFrom(r, opt), 'ppv5 land', land ? P.ppvAt(land, 5).toExponential(2) : null, 'own', own ? P.ppvAt(own, 5).toExponential(2) : null, 'landed', r.flight.landed, 'range', r.flight.range.toFixed(1));
  }
}
