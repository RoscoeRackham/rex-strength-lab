const { P, D, g, rex, ollie, surf, ON, OFF, ctx, DIAL } = require('./env.js');
for (const v of [100, 1000, 3e5]) for (const kg of [2600, 5000, DIAL]) {
  const r = P.collide(ctx(kg, ollie, ON), ctx(kg, rex, ON), { source: 'set', gb: v / 299792458 });
  const F = r.contact.soft, Q = r.h.Q, thump = F.t * P.K.a0 > Math.max(P.blastRadius(Q, 6900), 0.5);
  console.log(v, kg, r.outcome, 'Q', Q.toExponential(2), 'thump', thump, 'blastR harm', P.blastRadius(Q, P.RESTRAINT.R.DP_HARM).toFixed(1), 'moved', r.after.splat.moved && r.after.splat.moved.toFixed(0));
}
