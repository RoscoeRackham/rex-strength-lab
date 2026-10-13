const { P, obj, rex, ctx, K, D } = require('./env.js');
const M = P.RESTRAINT.MOVES.throw;
for (const [kg, id, ang] of [[1.81436948e23, 'baseball', 0], [1e6, 'bus', 30]]) {
  const c = ctx(kg, rex());
  const o = Object.assign({}, c, { obj: obj(id), angle: ang, near: P.RESTRAINT.R.NEAR, target: 30 });
  const r = M.run(c, o);
  const land = M.landShake(r, o);
  console.log(`${id} kg=${kg.toExponential(2)} landed=${r.flight && r.flight.landed} relativistic=${r.flight && r.flight.relativistic} landShake=${land ? 'yes' : 'none'} toGround=${JSON.stringify(r.toGround)} shakeFrom=${M.shakeFrom(r, o)} plasterOver=${P.plasterOver ? P.plasterOver(M.shake(r, o), o.near) : '?'}`);
}
