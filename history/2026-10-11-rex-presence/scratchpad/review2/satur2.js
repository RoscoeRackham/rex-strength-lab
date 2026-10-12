const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
const R = P.RESTRAINT;
for (const [oid, anchor, sid, mode] of [['loco', 'braced', 'granite', 'comic'], ['b777', 'braced', 'granite', 'comic'], ['car', 'braced', 'granite', 'comic'], ['loco', 'friction', 'concrete', 'comic']]) {
  const c = ctxOf(1e12 * g, { mode, anchor, surface: surf(sid) });
  const o = { near: 5, obj: obj(oid), angle: 45, target: 30 };
  const p = R.planNow('throw', c, o);
  console.log(oid, anchor, sid, mode, 'goal', JSON.stringify(p.goal()).slice(0, 120));
  console.log('  ceiling', JSON.stringify(p.ceiling()));
  for (const h of R.HAZARDS) { const r = p.result('hazard:' + h.id); console.log('   ', h.id, r.never ? 'never' : (r.use / g).toPrecision(3), r.never ? '' : ''); }
  const row = [];
  for (let lg = 2; lg <= 12; lg += 0.5) { const r = p.run(Math.pow(10, lg) * g); row.push(lg + ':' + r.v.toPrecision(3) + (r.heldBack ? 'h' : '') + (R.HAZARDS.filter((h) => h.test(R.MOVES.throw, r, p.opt)).map((h) => h.id[0]).join(''))); }
  console.log('  v by log10 effort:', row.join(' '));
  console.log('  saturated?', JSON.stringify(Object.fromEntries(R.HAZARDS.map((h) => [h.id, p.result('hazard:' + h.id)]).map(([k, v]) => [k, v.never]))));
}
