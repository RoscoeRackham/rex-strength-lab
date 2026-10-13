const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
const M = P.RESTRAINT.MOVES;
for (const sid of ['granite']) for (const kg of [3e7, 1e8, 3e8, 1e9]) {
  const c = Object.assign(ctx({ F: kg*K.g, surface: surf(sid) }), ON);
  const j = P.jump(c);
  const o = { surface: c.surface, body: c.body, m: c.body.m, unbreakable: true, near: 5 };
  const land = M.jump.shake(j, o);
  const po = P.impulseSource(c.surface, P.vToMomentum(j.v, c.body.m), j.push.t);
  console.log(sid, kg.toExponential(0), 'v', j.v.toFixed(1), 'vLand', j.landing.v.toFixed(1), 'landed', j.landing.landed, 'overLimitReal', j.overLimitReal, 'pushOff?', !!j.pushOff, '| shake used ppv5', (P.ppvAt(land,5)*1000).toFixed(2), 'reach', P.plasterReach(land).toFixed(1), '| push-off alone ppv5', (P.ppvAt(po,5)*1000).toFixed(2), 'reach', P.plasterReach(po).toFixed(1));
}
