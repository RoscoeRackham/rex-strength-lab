const { P, D, g, rex, ollie, surf, ON, OFF, ctx, DIAL } = require('./env.js');
for (const [src, kg] of [['sprint', 2570], ['jump', Infinity], ['stomp', Infinity], ['stomp', 1e9]]) {
  const r = P.collide(ctx(kg, ollie, ON), ctx(kg, rex, ON), { source: src, gb: 100 / 299792458 });
  console.log(src, kg, Object.keys(r).join(','), r.noCharge, r.outcome, r.heldBy, r.v0);
}
