const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
const lp = P.limbPulse(rex());
for (const kg of [1e5, 1e6, 1e8, 1e10]) {
  const c = Object.assign(ctx({ F: kg*K.g }), ON);
  const j = P.jump(c);
  if (!j.pushOff) { console.log(kg, 'no pushOff'); continue; }
  const s = P.impulseSource(c.surface, j.pushOff.J, j.pushOff.T), s2 = P.impulseSource(c.surface, j.pushOff.J, Math.max(lp, j.pushOff.T));
  const land = P.RESTRAINT.MOVES.jump.shake(j, { surface: c.surface, body: c.body, m: c.body.m, unbreakable: true });
  console.log(kg.toExponential(0), 'v', j.v.toFixed(1), 'J', j.pushOff.J.toExponential(2), 'T', j.pushOff.T.toExponential(2), 'reach', P.plasterReach(s).toFixed(1), 'floored reach', P.plasterReach(s2).toFixed(1), 'all sources reach', P.plasterReach(land).toFixed(1), 'landed', j.landing.landed, 'land t', j.landing.t.toExponential(2));
}
// throw with toGround T
for (const kg of [1e5, 1e6, 1e8]) {
  const c = Object.assign(ctx({ F: kg*K.g }), ON);
  const r = P.throwObject(c, obj('car'), 30);
  console.log('throw car', kg.toExponential(0), 'J', r.toGround.J.toExponential(2), 'T', r.toGround.T.toExponential(2), 'push.t', r.push.t.toExponential(2));
}
