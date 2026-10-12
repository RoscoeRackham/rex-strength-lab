const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
const c = ctxOf(90718.474 * g);
const o = { obj: obj('car'), angle: 45, target: 30 };
const p = P.RESTRAINT.planNow('throw', c, o);
const ce = p.ceiling();
console.log('goal kg', (p.goal().use / g).toFixed(0), 'ceiling by', ce.by, 'below kg', (ce.below / g).toFixed(0), 'share', (100 * ce.below / c.F).toFixed(1) + '%');
let prev = null;
for (let kg = 20000; kg <= 90718; kg += 100) {
  const r = p.run(kg * g); const cr = r.gripRatio > 1;
  if (cr !== prev) { console.log('kg', kg, 'crush', cr, 'grip', r.gripRatio.toFixed(3), 'basis', r.basis || 'comic', 'range', r.flight.range.toFixed(1)); prev = cr; }
}
const r = p.run(38000 * g);
console.log('at 38000 kg:', 'grip', r.gripRatio.toFixed(2), 'hazards on:', P.RESTRAINT.HAZARDS.filter(h => h.test(P.RESTRAINT.MOVES.throw, r, p.opt)).map(h => h.id));
