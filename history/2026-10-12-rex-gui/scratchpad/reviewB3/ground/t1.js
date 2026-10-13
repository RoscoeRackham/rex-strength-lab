const { P, D, g, surf, obj, rex, ollie, M, ctxOf, sig } = require('./common.js');
console.log('surfaces', D.surfaces.map(s=>s.id).join(','));
console.log('limbPulse rex', P.limbPulse(rex), 'expected', 2*0.026*Math.sqrt(0.45*3.048/0.9));
// stomp, jump, throw on sand & concrete, unbreakable on vs off, equal efforts
for (const sid of ['sand','concrete']) for (const lg of [2.5,3,3.5,4,5,6,8]) {
  const F = Math.pow(10, lg)*g;
  const c = ctxOf(F, {surface: surf(sid)}), cu = Object.assign({}, c, {unbreakable:true});
  const o = { surface: c.surface, body: rex, m: rex.m, near: 5, obj: obj('car'), angle: 30 }, ou = Object.assign({}, o, {unbreakable:true});
  const s0 = P.stomp(c), s1 = P.stomp(cu);
  const a0 = M.stomp.shake(s0,o), a1 = M.stomp.shake(s1, ou);
  const j0 = P.jump(c), j1 = P.jump(cu);
  const b0 = M.jump.shake(j0,o), b1 = M.jump.shake(j1, ou);
  const t0 = P.throwObject(c, obj('car'), 30), t1 = P.throwObject(cu, obj('car'), 30);
  const c0 = M.throw.shake(t0,o), c1 = M.throw.shake(t1, ou);
  console.log(sid, '1e'+lg, 'stomp ppv5', sig(P.ppvAt(a0,5)), sig(P.ppvAt(a1,5)), 'pl', sig(P.plasterReach(a0)), sig(P.plasterReach(a1)), 'hole', sig(s0.holeDepth), sig(s1.holeDepth), 'realBreaks', s1.realBreaks,
   '| jump v', sig(j0.v), sig(j1.v), 'over', j0.overLimit, 'ppv5', sig(P.ppvAt(b0,5)), sig(P.ppvAt(b1,5)), 'pl', sig(P.plasterReach(b0)), sig(P.plasterReach(b1)),
   '| throw v', sig(t0.v), sig(t1.v), 'ppv5', sig(P.ppvAt(c0,5)), sig(P.ppvAt(c1,5)), 'pl', sig(P.plasterReach(c0)), sig(P.plasterReach(c1)), t1.toGround ? 'J '+sig(t1.toGround.J)+' T '+sig(t1.toGround.T) : '');
}
