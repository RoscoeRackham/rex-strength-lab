const { P, D, rex, ollie, surf, obj, ctx, ON } = require('./h.js');
console.log('whipEff', rex.whipEff, 'handEff', rex.handEff, 'strokes', JSON.stringify(rex.strokes), 'limbPulse', P.limbPulse(rex));
const RS = P.RESTRAINT;
for (const o of ['baseball', 'shot', 'bowling', 'car']) for (const kg of [3e3, 1e4, 1e5]) {
  const c = ctx(Object.assign({ kg }, ON));
  const r = P.throwOnce(c, obj(o), 45);
  if (!r.canMove) { console.log(o, kg, 'no'); continue; }
  const pB = r.push.pB, pArm = pB * r.armMass / r.mB;
  const op = Object.assign({ near: 5, body: rex, surface: surf('concrete'), anchor: 'friction', m: rex.m, obj: obj(o), angle: 45 }, ON);
  const src = P.impulseSource(surf('concrete'), r.toGround.J, r.toGround.T), srcB = P.impulseSource(surf('concrete'), pB, Math.max(P.limbPulse(rex), r.push.t));
  console.log(o.padEnd(8), kg.toExponential(0), 'v', r.v.toFixed(1), 'push.t', r.push.t.toFixed(3), 'pObj', (r.toGround.J).toFixed(1), 'pArm', pArm.toFixed(1), 'ppv5 J=pObj', (P.ppvAt(src, 5) * 1e3).toFixed(3), 'J=pB', (P.ppvAt(srcB, 5) * 1e3).toFixed(3), 'plaster pObj', P.plasterReach(src).toFixed(2), 'pB', P.plasterReach(srcB).toFixed(2));
}
