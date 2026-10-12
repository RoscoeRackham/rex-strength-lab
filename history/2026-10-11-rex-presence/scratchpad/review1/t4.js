const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
for (const [F, sid] of [[1e8 * g, 'concrete'], [1e5*g, 'sand']]) {
const c = ctxOf(F, {surface: surf(sid)});
const o = { obj: obj('car'), angle: 45, target: 30 };
const p = P.RESTRAINT.planNow('throw', c, o);
console.log(sid, 'goal', p.goal().use / g, 'ceiling', JSON.stringify(p.ceiling()), 'crush', JSON.stringify(p.result('hazard:crush')));
for (let lg = 4.3; lg <= 5.3; lg += 0.05) {
  const u = Math.pow(10, lg) * g, r = p.run(u);
  console.log(lg.toFixed(2), 'grip', r.gripRatio.toFixed(3), 'heldBack', r.heldBack, 'v', r.v.toFixed(2), 'range', r.flight && r.flight.range.toFixed(1), 'sink', r.sinkRatio.toFixed(2), 'basis', r.basis || 'comic', 'Fused?', (Math.hypot(0, 0)));
}
}
