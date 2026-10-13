const { P, D, g, surf, obj, rex, ollie, M, ctxOf, sig } = require('./common.js');
for (const sid of ['sand','concrete']) for (const lg of [4,5,6]) {
  const c = ctxOf(Math.pow(10,lg)*g, { surface: surf(sid), unbreakable: true });
  const j = P.jump(c), j0 = P.jump(Object.assign({}, c, {unbreakable:false}));
  const o = { surface: c.surface, body: rex, m: rex.m, unbreakable: true };
  const po = P.impulseSource(c.surface, j.pushOff.J, Math.max(1e-9, j.pushOff.T));
  // what the real ground bears over the same push: RBreal x T (beyond his weight)
  const Jbear = Math.min(j.pushOff.J, Math.max(0, j.groundLimitReal - rex.m*g) * j.pushOff.T);
  const pb = P.impulseSource(c.surface, Jbear, Math.max(1e-9, j.pushOff.T));
  console.log(sid, '1e'+lg, 'F', sig(j.F), 'RBreal', sig(j.groundLimitReal), 'over', j.overLimitReal, 'v', sig(j.v), '(real ground', sig(j0.v)+')', 'pushOff J', sig(j.pushOff.J), 'T', sig(j.pushOff.T), 'ppv5', sig(P.ppvAt(po,5)), 'plaster', sig(P.plasterReach(po)), '| bearing-capped J', sig(Jbear), 'ppv5', sig(P.ppvAt(pb,5)), 'plaster', sig(P.plasterReach(pb)), '| real-ground jump shake ppv5', sig(P.ppvAt(M.jump.shake(j0, {surface:c.surface, body: rex, m: rex.m}),5)));
}
