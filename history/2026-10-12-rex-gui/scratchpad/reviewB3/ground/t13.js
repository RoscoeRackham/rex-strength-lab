const { P, D, g, surf, obj, rex, ollie, M, ctxOf, sig } = require('./common.js');
// throw: J = pObj - pRecoil; momentum sum zero (object, thrower, ground)
for (const [own, ub, sid] of [[false,true,'ice'],[false,true,'concrete'],[true,false,'concrete'],[true,true,'sand']]) for (const oid of ['bus','car','baseball']) for (const kg of [1e4,1e6]) {
  const c = ctxOf(kg*g, { surface: surf(sid), ownRecoil: own, unbreakable: ub });
  const r = P.throwObject(c, obj(oid), 30);
  if (!r.canMove || !r.toGround) continue;
  const pObj = P.vToMomentum(r.v, obj(oid).m), pRec = P.vToMomentum(r.recoilV, rex.m);
  const res = (pObj - pRec - r.toGround.J) / pObj;
  if (Math.abs(res) > 1e-6) console.log('THROW MISMATCH', own, ub, sid, oid, kg, sig(res));
}
// shove momentum sum
for (const [own, ub] of [[false,true],[true,false],[true,true]]) for (const kg of [1e4,1e5,1e6]) {
  const cA = ctxOf(kg*g, { ownRecoil: own, unbreakable: ub }), cB = Object.assign(ctxOf(kg*g, { ownRecoil: own, unbreakable: ub }), { body: ollie });
  const r = P.shove(cA, cB);
  if (!r.toGround) continue;
  const fB = P.anchorCapacity({ body: ollie, surface: cB.surface, theta: 0, anchor: 'friction', groundHolds: P.holdsGround(cB) }).R;
  const pB = P.vToMomentum(r.vB, ollie.m), pA = P.vToMomentum(r.vA, rex.m);
  const sum = pB - pA - r.toGround.J + fB * r.push.t + r.Fg * r.push.t * 0;
  console.log('shove', own, ub, sig(kg), 'J', sig(r.toGround.J), 'pB', sig(pB), 'pA', sig(pA), 'fB t', sig(fB*r.push.t), 'residual/pB', sig(sum/Math.max(pB,1e-9)));
}
// limbPulse
console.log('limbPulse 3.048', P.limbPulse(rex), '50 m', P.limbPulse(P.makeBody({build:'rex', H: 50, m: 1060*P.bodyVolume(50,'rex')})), 'expected', 0.052*Math.sqrt(0.45*50/0.9));
// catcher toGroundC vs momentum
const cR = ctxOf(1e6*g, { unbreakable: true }), cO = Object.assign({}, cR, { body: ollie });
const L = P.catchLeg(cR, cO, obj('car'), 30, 'hard');
console.log('catch', L.result, 'J', sig(L.toGroundC.J), 'pIn', sig(P.vToMomentum(L.vArrive, obj('car').m)), 'after', sig((ollie.m + obj('car').m) * L.catch.uAfter));
