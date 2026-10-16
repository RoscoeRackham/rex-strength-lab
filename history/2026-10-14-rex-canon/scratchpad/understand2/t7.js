// where does his own push (toGround) set the throw's plaster ceiling or a shaking preset today, with their powers on?
const { P, D, g, surf, obj, rex, ollie, ON, ctxOf, sig } = require('./base.js');
const M = P.RESTRAINT.MOVES.throw;
const objs = D.objects.filter((o) => !o.noThrow).map((o) => o.id);
const hits = [];
let n = 0;
const t0 = Date.now();
for (const kg of [90718.474, 1e9]) for (const sid of ['concrete', 'sand', 'softclay', 'granite', 'gravel']) for (const oid of objs) for (const ang of [0, 20, 45, 70, 90]) {
  const c = ctxOf(kg, Object.assign({}, ON, { surface: surf(sid) }));
  const p = P.RESTRAINT.planNow('throw', c, { obj: obj(oid), angle: ang, target: 30 });
  n++;
  const oo = Object.assign({ near: 5 }, p.opt);
  const ce = p.ceiling();
  for (const id of ['hazard:plaster', 'preset:rattle', 'preset:plaster']) {
    const j = p.result(id);
    if (!j || j.never || !isFinite(j.use)) continue;
    const r = p.run(j.use);
    if (!r.canMove || !r.toGround) continue;
    if (M.shakeFrom(r, oo) === 'him') hits.push([sig(kg), sid, oid, ang, id, 'at', sig(j.use / g), 'kgf', ce.by === 'plaster' && id === 'hazard:plaster' ? 'SETS CEILING' : ''].join(' '));
  }
}
console.log(n, 'plans in', Date.now() - t0, 'ms;', hits.length, 'where his push is the larger shaking at the onset');
console.log(hits.slice(0, 60).join('\n'));
