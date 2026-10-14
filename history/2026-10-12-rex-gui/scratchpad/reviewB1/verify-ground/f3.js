const { P, D, g, ON, OFF, ctx } = require('./h.js');
const M = P.RESTRAINT.MOVES.throw;
const bus = D.objects.find(o => o.id === 'bus');
for (const surf of ['concrete', 'granite']) {
  const c = ctx(1e9, { surf, pw: ON });
  const p = P.RESTRAINT.planNow('throw', c, { obj: bus, angle: 45 });
  for (const id of ['preset:plaster', 'hazard:plaster', 'preset:rattle']) {
    const x = p.ensure(id); if (x.never) { console.log(surf, id, 'never'); continue; }
    const r = p.run(x.use);
    const land = M.landShake(r, p.opt), all = M.shake(r, p.opt);
    console.log(surf, id, (x.use / g).toPrecision(3), 'kg; from', M.shakeFrom(r, p.opt), '; landing plaster reach', P.plasterReach ? P.plasterReach(land).toFixed(2) : '?', 'combined', P.plasterReach ? P.plasterReach(all).toFixed(2) : '?', '; ppv5 land', (P.ppvAt(land,5)*1000).toFixed(3), 'all', (P.ppvAt(all,5)*1000).toFixed(3), 'range', r.flight.range.toFixed(1));
  }
}
