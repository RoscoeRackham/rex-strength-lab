const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
const RS = P.RESTRAINT;
for (const id of ['piano', 'motorcycle', 'car', 'pickup', 'desoto', 'bus', 'person', 'shot', 'baseball']) for (const sid of ['concrete', 'sand']) {
  const c = ctxOf(90718.474 * g, { surface: surf(sid) });
  const p = RS.planNow('throw', c, { obj: obj(id), angle: 45, target: 30 });
  const ce = p.ceiling();
  if (!ce.by) { console.log(id, sid, 'no ceiling'); continue; }
  // dense scan below the ceiling
  let bad = null;
  for (let i = 0; i <= 400; i++) {
    const u = p.lo * Math.pow(ce.below / p.lo, i / 400);
    const r = p.run(u);
    const on = RS.HAZARDS.filter((h) => h.test(RS.MOVES.throw, r, p.opt)).map((h) => h.id);
    if (on.length) { bad = { kg: (u / g).toFixed(0), on, basis: r.basis || 'comic' }; break; }
  }
  console.log(id, sid, 'ceiling', ce.by, (ce.below / g).toFixed(0), 'kg', bad ? 'HAZARD BELOW CEILING: ' + JSON.stringify(bad) : 'ok');
}
