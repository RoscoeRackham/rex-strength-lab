const { P, g, sig, rex, ollie, ctx, ppv, F0 } = require('./h.js');
for (const [label, ex] of [['all on', {}], ['ownRecoil only', { airAbsorb: 0, keepForm: false, unbreakable: false }], ['unbreakable only', { ownRecoil: false, airAbsorb: 0, keepForm: false }], ['all off', { ownRecoil: false, airAbsorb: 0, keepForm: false, unbreakable: false }]]) {
  const cR = ctx(ex), cO = ctx(ex, ollie);
  const s = P.shove(cR, cO), s1 = P.shoveOnce ? null : null;
  const A = rex, armMass = 2 * A.handEff;
  const pB = s.vB > 0 ? P.vToMomentum(s.vB, ollie.m) : 0, pA = s.vA > 0 ? P.vToMomentum(s.vA, rex.m) : 0;
  console.log(label, JSON.stringify({ basis: s.basis, vB: sig(s.vB), slideB: sig(s.slideB), vA: sig(s.vA), pB: sig(pB), pA: sig(pA), push_pB: sig(s.push.pB), push_pA: sig(s.push.pA), push_t: sig(s.push.t), push_xA: sig(s.push.xA), push_xB: sig(s.push.xB), heldBack: s.heldBack, Fdrive: sig(s.Fdrive), toGround: s.toGround && { J: sig(s.toGround.J), T: sig(s.toGround.T) }, ppv5: sig(ppv(cR, s.toGround)), toGroundB: s.toGroundB }));
}
// bolted partner
{ const cR = ctx({}), cO = ctx({ anchor: 'bolted' }, ollie); const s = P.shove(cR, cO); console.log('bolted Ollie', JSON.stringify({ vB: s.vB, vA: s.vA, stalled: s.stalled, toGround: s.toGround, toGroundB: s.toGroundB })); }
{ const cR = ctx({ ownRecoil: false }), cO = ctx({ anchor: 'bolted' }, ollie); const s = P.shove(cR, cO); console.log('bolted Ollie, ownRecoil off', JSON.stringify({ vB: s.vB, vA: s.vA, stalled: s.stalled, toGround: s.toGround, toGroundB: s.toGroundB })); }
{ const cR = ctx({ unbreakable: false }), cO = ctx({ anchor: 'bolted', unbreakable: false }, ollie); const s = P.shove(cR, cO); console.log('bolted Ollie, ownRecoil only', JSON.stringify({ vB: s.vB, vA: s.vA, stalled: s.stalled, toGround: s.toGround, toGroundB: s.toGroundB })); }
