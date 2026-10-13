const { P, D, rex, ollie, surf, obj, ctx, ON } = require('./h.js');
const RS = P.RESTRAINT;
for (const s of ['sand', 'softclay', 'gravel']) for (const kg of [90718, 1e6]) {
  const c = ctx(Object.assign({ kg, s }, ON));
  const r = P.stomp(c);
  const o = Object.assign({ near: 5, body: rex, surface: surf(s), anchor: 'friction', m: rex.m }, ON);
  const src = RS.MOVES.stomp.shake(r, o);
  const q1 = P.qultFor(surf(s), rex.footB) * rex.footArea; // one foot's bearing
  const J = src.F * src.T / 2, Jcap = Math.min(J, q1 * src.T);
  const src2 = P.impulseSource(surf(s), Jcap, src.T);
  console.log(s, kg.toExponential(1), 'vFoot', r.vFoot.toFixed(1), 'realHole', r.realHole.toFixed(2), 'hole shown', r.holeDepth.toFixed(3), 'realBreaks', r.realBreaks, 'J', J.toFixed(0), 'T', src.T.toFixed(3), 'peak F', src.F.toPrecision(3), 'one-foot bearing', q1.toPrecision(3), '| ppv5', (P.ppvAt(src, 5) * 1e3).toFixed(2), 'plaster', P.plasterReach(src).toFixed(1), '| capped ppv5', (P.ppvAt(src2, 5) * 1e3).toFixed(2), 'plaster', P.plasterReach(src2).toFixed(1));
}
