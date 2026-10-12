const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
for (const b of [rex, cal, big]) for (const mode of ['comic', 'real']) for (const sid of ['sand', 'gravel', 'softclay', 'stiffclay', 'concrete', 'granite']) {
  const c = ctxOf(Infinity, { body: b, mode, surface: surf(sid) });
  const p = P.RESTRAINT.plan('jump', c, { target: 3 });
  const ce = p.ensure('hazard:ground');
  let worst = null;
  for (let lg = Math.log10(p.lo / g); lg <= 12; lg += 0.1) {
    const u = Math.pow(10, lg) * g, r = p.run(u);
    if (r.landing.ratio > 1 && !r.groundFails) { worst = { lg: lg.toFixed(1), landRatio: r.landing.ratio.toFixed(2), sink: r.landing.sink.toFixed(3), apex: r.flight.apex.toFixed(2) }; break; }
  }
  console.log(b.build, b.H, mode, sid, 'ground hazard from', (ce.use / g).toExponential(2), 'kg', worst ? 'LANDING BREAKS GROUND FIRST at 10^' + worst.lg + ' kg ' + JSON.stringify(worst) : '');
}
