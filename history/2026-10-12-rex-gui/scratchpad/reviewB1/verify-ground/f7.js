const { P, D, g, ON, OFF, ctx } = require('./h.js');
for (const kg of [8.45e3, 8.6e3, 1e5]) {
  const cO = ctx(kg, { build: 'ollie', pw: ON }), cR = ctx(kg, { pw: ON });
  const a = P.collide(cO, cR, { source: 'sprint' });
  const b = P.collide(cO, Object.assign({}, cR, { immovable: true }), { source: 'sprint' });
  const mv = (r) => r.after && r.after.splat ? r.after.splat.moved : null;
  console.log(kg, 'normal:', a.outcome, 'moved', mv(a), 'toGround', a.toGround && a.toGround.J, '| immovable:', b.outcome, 'moved', mv(b), 'toGround', b.toGround, 'h.Q', b.h && b.h.Q);
}
