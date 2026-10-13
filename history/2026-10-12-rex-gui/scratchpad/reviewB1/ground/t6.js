const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig, M } = require('./common.js');
for (const sid of ['granite', 'concrete']) for (const [oid, th] of [['bus', 45], ['car', 30]]) {
  const res = {};
  for (const ub of [false, true]) {
    const c = ctxOf(1e9, { surface: surf(sid), unbreakable: ub });
    const p = P.RESTRAINT.planNow('throw', c, { obj: obj(oid), angle: th, target: 30, near: 5 });
    res[ub] = {};
    for (const n of ['preset:rattle', 'preset:plaster', 'hazard:plaster', 'hazard:ground', 'goal']) { const r = p.result(n); res[ub][n] = r ? (r.never ? 'never' : sig(r.use / g, 3)) : null; }
    const ce = p.ceiling(); res[ub].ceiling = ce.by + ' ' + sig(ce.below / g, 3);
    // the run at preset:rattle: does the ground break with it off?
    const rr = p.result('preset:rattle'); if (rr && !rr.never) { const run = p.run(rr.use); res[ub].rattleRunSink = sig(run.sinkRatio, 3) + '/' + sig(run.sinkRatioRaw, 3) + ' v ' + sig(run.v, 4); }
    const rp = p.result('preset:plaster'); if (rp && !rp.never) { const run = p.run(rp.use); res[ub].plasterRunSink = sig(run.sinkRatio, 3) + '/' + sig(run.sinkRatioRaw, 3) + ' v ' + sig(run.v, 4); }
  }
  console.log(sid, oid, th, JSON.stringify(res));
}
