// Does the saturation stop (same speed at two efforts) miss hazards that keep growing after the speed saturates?
const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
const R = P.RESTRAINT;
const crushObjs = D.objects.filter((o) => o.crush).map((o) => o.id);
console.log('objects with crush:', crushObjs.join(' '));
let found = 0;
for (const mode of ['real', 'comic']) for (const anchor of ['bolted', 'braced', 'friction']) for (const sid of ['granite', 'concrete']) for (const oid of crushObjs) for (const Fkg of [1e6, 1e9, 1e12, Infinity]) {
  const c = ctxOf(Fkg * g, { mode, anchor, surface: surf(sid) });
  const o = { near: 5, obj: obj(oid), angle: 45, target: 30 };
  const p = R.planNow('throw', c, o);
  const M = R.MOVES.throw;
  const ce = p.ceiling();
  const hz = ['crush', 'passenger', 'ground', 'boom', 'air', 'plaster'];
  // all-out (or 1e30 kg for unlimited)
  const top = isFinite(c.F) ? c.F : 1e30 * g;
  const rt = p.run(top);
  for (const h of R.HAZARDS) {
    const res = p.result('hazard:' + h.id);
    if (res.never && h.test(M, rt, p.opt)) { found++; console.log('MISSED', h.id, mode, anchor, sid, oid, Fkg, 'never but on all-out; speed all-out', rt.v.toPrecision(4), 'grip', rt.gripRatio.toPrecision(3), 'ceiling', ce.by, ce.below && (ce.below / g).toPrecision(3)); }
  }
}
console.log('missed', found);
