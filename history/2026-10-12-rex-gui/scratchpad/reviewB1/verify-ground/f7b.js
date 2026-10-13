const { P, D, g, ON, OFF, ctx } = require('./h.js');
for (const kg of [1e7]) {
  const cO = ctx(kg, { build: 'ollie', pw: ON }), cR = ctx(kg, { pw: ON });
  const b = P.collide(cO, Object.assign({}, cR, { immovable: true }), { source: 'sprint' });
  console.log(b.outcome, 'held', b.held, 'quakeHeld', b.quakeHeld, 'Q', b.h && b.h.Q, 'toGround', b.toGround);
}
