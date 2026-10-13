const { P, D, surf, obj, rex, ollie, tons, ctx } = require('./lib.js');
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
for (const s of ['concrete', 'sand']) for (const lt of [3, 4, 5, 6, 7, 8]) {
  const kg = Math.pow(10, lt);
  const cR = ctx({ body: rex(), surface: s, kg }), cO = ctx({ body: ollie(), surface: s, kg });
  const r = P.shove(cR, cO);
  if (!r.toGround) { console.log(s, lt, 'no toGround', r.stalled); continue; }
  const fB = P.anchorCapacity({ body: cO.body, surface: cO.surface, theta: 0, anchor: cO.anchor, groundHolds: true, mA: cO.body.m });
  const pB = P.vToMomentum(r.vB, cO.body.m), pA = P.vToMomentum(r.vA, cR.body.m);
  const src = P.impulseSource(cR.surface, r.toGround.J, r.toGround.T), net = P.impulseSource(cR.surface, Math.max(0, pB - pA), r.toGround.T);
  console.log(s, '1e' + lt, 'J', fmt(r.toGround.J), 'T', fmt(r.toGround.T), 'pB', fmt(pB), 'fB.R*t', fmt(fB.R * r.push.t), 'vB', fmt(r.vB), 'ppv5', fmt(P.ppvAt(src, 5) * 1e3), 'plaster', fmt(P.plasterReach(src)), '| net only ppv5', fmt(P.ppvAt(net, 5) * 1e3), 'plaster', fmt(P.plasterReach(net)));
}
