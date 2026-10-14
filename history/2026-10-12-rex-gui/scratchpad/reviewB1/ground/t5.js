const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig, M } = require('./common.js');
for (const sid of ['concrete', 'sand', 'granite', 'asphalt']) for (const [oid, th] of [['car', 0], ['car', 30], ['bus', 45], ['baseball', 0]]) for (const lg of [5, 6, 7]) {
  const kg = Math.pow(10, lg);
  const c0 = ctxOf(kg, { surface: surf(sid) }), c1 = ctxOf(kg, { surface: surf(sid), unbreakable: true });
  const o0 = { surface: c0.surface, body: rex, m: rex.m, obj: obj(oid), angle: th, near: 5 }, o1 = Object.assign({ unbreakable: true }, o0);
  const t0 = P.throwObject(c0, obj(oid), th), t1 = P.throwObject(c1, obj(oid), th);
  if (!t0.canMove) continue;
  const same = t0.v === t1.v;
  const s0 = M.throw.shake(t0, o0), s1 = M.throw.shake(t1, o1);
  const r0 = P.RESTRAINT.reach('throw', t0, o0), r1 = P.RESTRAINT.reach('throw', t1, o1);
  if (same && (P.ppvAt(s0, 5) !== P.ppvAt(s1, 5)))
    console.log(sid, oid, th, '1e' + lg, 'same v', sig(t0.v, 4), 'ppv5 off', sig(P.ppvAt(s0, 5), 3), 'on', sig(P.ppvAt(s1, 5), 3), 'plaster off', sig(r0.plaster, 3), 'on', sig(r1.plaster, 3), 'sinkRatio off', sig(t0.sinkRatio, 3), 'shakeFrom on', M.throw.shakeFrom(t1, o1), 'plaster hazard off/on', P.RESTRAINT.HAZARDS.find(h=>h.id==='plaster').test(M.throw, t0, o0), P.RESTRAINT.HAZARDS.find(h=>h.id==='plaster').test(M.throw, t1, o1));
}
