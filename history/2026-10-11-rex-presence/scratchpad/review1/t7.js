const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
const c = ctxOf(90718.474 * g);
const o = { obj: obj('car'), angle: 45, target: 30 };
const p = P.RESTRAINT.planNow('throw', c, o);
for (const kg of [25000, 25700, 26632]) {
  const r = p.run(kg * g);
  const src = P.RESTRAINT.MOVES.throw.shake(r, p.opt);
  console.log(kg, 'vImpact', r.flight.vImpact.toFixed(2), 'src', JSON.stringify({F: src.F, T: src.T}), 'ppv5', (P.ppvAt(src, 5)*1000).toFixed(3), 'mm/s', 'L', obj('car').L, 'reach', JSON.stringify(P.RESTRAINT.reach('throw', r, p.opt)));
}
