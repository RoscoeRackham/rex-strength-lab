const { P, D, rex, ollie, surf, obj, ctx, ON } = require('./h.js');
for (const s of ['concrete', 'sand']) for (const kg of [1e4, 90718, 1e6]) for (const oA of ['friction', 'bolted']) {
  const cA = ctx(Object.assign({ kg, s, body: rex }, ON)), cB = ctx(Object.assign({ kg, s, body: ollie, anchor: oA }, ON));
  const r = P.shove(cA, cB);
  const fB = P.anchorCapacity({ body: ollie, surface: surf(s), theta: 0, anchor: oA, groundHolds: true }).R;
  const src = r.toGround ? P.impulseSource(surf(s), r.toGround.J, r.toGround.T) : null;
  console.log(s, kg.toExponential(1), 'ollie', oA, 'vB', r.vB.toFixed(2), 'pB', (r.vB * ollie.m).toFixed(0), 'fB.R*t', r.push && isFinite(fB) ? (fB * r.push.t).toFixed(0) : '-', 'J', r.toGround && r.toGround.J.toFixed(0), 'T', r.toGround && r.toGround.T.toFixed(3), 'stalled', r.stalled, 'ppv5', (P.ppvAt(src, 5) * 1e3).toFixed(2), 'plaster', P.plasterReach(src).toFixed(1));
}
