const { P, D, g, ON, OFF, ctx } = require('./h.js');
const M = P.RESTRAINT.MOVES.throw;
for (const oid of ['car', 'bus', 'baseball']) for (const dial of [90718.474, 1e7, 1e9]) {
  const c = ctx(dial, { surf: 'concrete', pw: ON });
  const p = P.RESTRAINT.planNow('throw', c, { obj: D.objects.find(o => o.id === oid), angle: 45 });
  const out = [];
  for (const id of ['preset:rattle', 'preset:plaster', 'hazard:plaster']) { const x = p.ensure(id); if (x.never) { out.push(id + ' never'); continue; } out.push(id + ' ' + (x.use / g).toPrecision(3) + ' ' + M.shakeFrom(p.run(x.use), p.opt)); }
  console.log(oid, dial.toPrecision(3), out.join(' | '));
}
