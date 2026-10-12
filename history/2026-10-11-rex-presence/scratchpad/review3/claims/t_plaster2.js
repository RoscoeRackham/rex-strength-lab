const { P, D, g, surf, obj, ctxOf } = require('./eng.js');
for (const id of ['shot', 'bowling', 'motorcycle', 'bar511', 'piano']) for (const kg of [1e7, 1e10, 1e14]) {
  const c = ctxOf(kg);
  const o = { obj: obj(id), angle: 45, near: 5, target: 30 };
  const p = P.RESTRAINT.planNow('throw', c, o);
  const h = p.result('hazard:plaster');
  if (h.never) { console.log(id, kg.toExponential(0), 'never'); continue; }
  const r = p.run(h.use), src = P.RESTRAINT.MOVES.throw.shake(r, p.opt);
  const T = src.T || 2 * src.tau;
  console.log(id, kg.toExponential(0), 'onset', (h.use / g / 1000).toFixed(2), 't; landing', r.flight.vImpact.toFixed(1), 'm/s; pulse', (1 / T).toFixed(0), 'Hz; PPV@5m at onset', (P.ppvAt(src, 5) * 1000).toFixed(1), 'mm/s');
}
