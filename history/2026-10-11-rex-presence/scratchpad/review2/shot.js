const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
const R = P.RESTRAINT;
for (const oid of ['shot', 'bowling', 'person']) for (const sid of ['concrete', 'sand']) {
  const c = ctxOf(90718 * g, { surface: surf(sid) });
  const p = R.planNow('throw', c, { near: 5, obj: obj(oid), angle: 45, target: 30 });
  const gl = p.goal(), ce = p.ceiling();
  console.log(oid, sid, 'goal', (gl.use / g).toPrecision(3), 'ceiling by', ce.by, (ce.below / g).toPrecision(3), '| hazards', R.HAZARDS.map((h) => { const r = p.result('hazard:' + h.id); return h.id + ':' + (r.never ? '-' : (r.use / g).toPrecision(3)); }).join(' '));
  const r = p.run(ce.use), src = R.MOVES.throw.shake(r, Object.assign({}, p.opt, { surface: surf(sid), body: rex }));
  if (src) console.log('    at ceiling: vImpact', r.flight.vImpact.toPrecision(3), 'range', r.flight.range.toPrecision(3), 'pulse', (1 / src.T).toPrecision(3), 'Hz');
}
