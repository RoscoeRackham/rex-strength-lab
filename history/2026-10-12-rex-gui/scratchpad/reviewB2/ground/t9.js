const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
for (const kg of [90718, 1e6, 1e8, 1.8e23]) {
  const c = Object.assign(ctx({ F: kg*K.g }), ON);
  const r = P.throwObject(c, obj(kg > 1e20 ? 'baseball' : 'car'), kg > 1e20 ? 0 : 45);
  const src = P.impulseSource(c.surface, r.toGround.J, r.toGround.T);
  const strain5 = 0.75 * src.F / (2*Math.PI*src.ground.rho*src.ground.cs**2*25);
  console.log(kg.toExponential(2), 'J', r.toGround.J.toExponential(2), 'F', src.F.toExponential(2), 'nonlinear@5m', P.ppvNonlinear(src, 5), 'static strain@5m', strain5.toExponential(2), 'ppv/cs', (P.ppvAt(src,5)/250).toExponential(2), 'plasterReach', P.plasterReach(src).toExponential(2));
}
// stomp at default all-out
const c = Object.assign(ctx({ F: 90718*K.g }), ON); const st = P.stomp(c); const s = P.RESTRAINT.MOVES.stomp.shake(st, { surface: c.surface, body: c.body, unbreakable: true });
console.log('stomp default all-out nonlinear@5m', P.ppvNonlinear(s, 5), 'plaster', P.plasterReach(s));
