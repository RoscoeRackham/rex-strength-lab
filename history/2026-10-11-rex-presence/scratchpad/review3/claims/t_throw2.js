const { P, D, g, surf, obj, ctxOf } = require('./eng.js');
for (const kg of [1e7, 1e9, 1e12, 1e15, 1e18]) {
  const c = ctxOf(kg);
  const o = { obj: obj('car'), angle: 45, near: 5, target: 30 };
  const p = P.RESTRAINT.planNow('throw', c, o);
  const res = ['windows', 'houses', 'block'].map((id) => { const r = p.result('preset:' + id); return id + ':' + (r.never ? 'never' : (r.use / g).toExponential(2) + 'kg'); });
  const hz = P.RESTRAINT.HAZARDS.map((h) => { const r = p.result('hazard:' + h.id); return h.id + ':' + (r.never ? 'never' : (r.use / g).toExponential(2)); });
  const r = p.run(undefined);
  console.log(kg.toExponential(0), 'allout v', r.v.toFixed(0), 'dragLoss TNT kg', (r.dragLoss / 4.184e6).toExponential(2), 'vImpact', r.flight.vImpact && r.flight.vImpact.toFixed(0), res.join(' '), '|', hz.join(' '));
}
