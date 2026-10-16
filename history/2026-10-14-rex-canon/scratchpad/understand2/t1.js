const { P, D, g, surf, obj, rex, ollie, ON, ctxOf, sig } = require('./base.js');
// throw ledger today: object momentum, body recoil, ground (toGround), ocean (supplied), at 0/45/90 and three dials
const dials = [90718.474, 1e9, 1e12];
for (const th of [0, 45, 90]) for (const kg of dials) for (const [lab, ex] of [['off', {}], ['on', ON], ['UB only', { unbreakable: true }], ['OR only', { ownRecoil: true }]]) {
  const r = P.throwObject(ctxOf(kg, ex), obj('car'), th);
  if (!r.canMove) { console.log(th, kg, lab, 'cannot move'); continue; }
  const pObj = P.vToMomentum(r.v, obj('car').m);
  const pObj2 = r.push.pB * obj('car').m / r.mB;
  const pRec = r.push.pA - r.push.pB * r.armMass / r.mB;
  const tg = r.toGround;
  const ground = tg ? tg.J : null, sup = tg ? (tg.supplied || 0) : 0, whole = tg ? (tg.whole != null ? tg.whole : tg.J) : null;
  // ledger along the push line (1D): pObj - pRecoil - whole(ground+ocean) = 0 ?
  const res = tg ? (pObj2 - Math.max(0, pRec) - whole) / pObj2 : (pObj2 - Math.max(0, pRec)) / pObj2;
  console.log(th, sig(kg), lab, 'pObj', sig(pObj2), 'v', sig(r.v), 'recoilP', sig(Math.max(0, pRec)), 'recoilV', sig(r.recoilV), 'toGround', tg ? JSON.stringify(Object.fromEntries(Object.entries(tg).map(([k, v]) => [k, sig(v)]))) : '-', 'resid', sig(res), 'ocean.P', r.flight && r.flight.ocean ? sig(r.flight.ocean.P) : '-', 'basis', r.basis || 'comic');
}
