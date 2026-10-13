const { P, D, rex, ollie, surf, obj, ctx, ON } = require('./h.js');
const near = 5;
for (const s of ['concrete', 'sand']) for (const anchor of ['bolted', 'friction']) for (const src of ['sprint', 'jump']) for (const kg of [90718, 1e6, 1e8]) {
  const cA = ctx(Object.assign({ kg, s, body: ollie }, ON)), cB = ctx(Object.assign({ kg, s, body: rex, anchor }, ON));
  const r = P.collide(cA, cB, { source: src, gb: 0, bounce: false });
  if (!r || r.noCharge) { console.log(s, anchor, src, kg, 'nocharge', r && r.noCharge); continue; }
  const sc = r.toGround ? P.impulseSource(surf(s), r.toGround.J, r.toGround.T) : null;
  console.log(s.padEnd(8), anchor.padEnd(8), src.padEnd(6), kg.toExponential(1), 'v0', r.v0.toFixed(1), 'outcome', r.outcome, 'held', r.held, 'tg', r.toGround ? JSON.stringify({ J: +r.toGround.J.toPrecision(3), T: +r.toGround.T.toPrecision(3), how: r.toGround.how, sup: r.toGround.supplied && +r.toGround.supplied.toPrecision(3) }) : '-', 'ppv5', (P.ppvAt(sc, near) * 1e3).toFixed(2), 'plaster', P.plasterReach(sc).toFixed(1), 'pA', r.pA.toPrecision(3));
}
