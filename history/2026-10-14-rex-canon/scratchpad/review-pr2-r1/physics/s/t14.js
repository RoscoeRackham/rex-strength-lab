const { P, D, g, c, surf, obj, rex, ollie, ON, ctxOf, DEF, sig } = require('./hv.js');
const R = P.RESTRAINT, M = R.MOVES.throw;
for (const [F, th, oid, tgt] of [[1e12 * g, 45, 'car', 30], [1e9 * g, 90, 'bus', 1000]]) {
  const cx = ctxOf(F, Object.assign({ use: F }, ON));
  const o = { obj: obj(oid), angle: th, target: tgt, near: 5 };
  const p = R.planNow('throw', cx, o);
  const all = p.run(F); const opt = p.opt;
  const src = M.shake(all, opt);
  console.log(sig(F / g), oid, th, 'all-out v', sig(all.v), 'flight', JSON.stringify({ landed: all.flight.landed, esc: all.flight.escaped, rel: all.flight.relativistic }), 'shake srcs', Array.isArray(src) ? src.length : src ? 1 : 0, 'RA', all.recoilAbsorbed ? sig(all.recoilAbsorbed.J) : '-', 'TG', all.toGround ? sig(all.toGround.J) : '-');
  const ce = p.ceiling(); console.log('  ceil', ce.by, sig(ce.use / g), 'goal', sig(p.goal().use / g), 'presets', p.presets().map(x => x.id + ':' + (x.never ? 'never' : sig(x.use / g))).join(' '));
  const rg = p.run(p.goal().use), sg = M.shake(rg, opt);
  console.log('  least: ', 'ppv5 mm/s', sg ? sig(1000 * P.ppvAt(sg, 5)) : '-');
}
