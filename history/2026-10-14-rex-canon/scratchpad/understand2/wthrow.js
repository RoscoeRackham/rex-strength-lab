const { P, g, sig, rex, ollie, ctx, ppv, ob, F0, sf } = require('./h.js');
for (const [lbl, F] of [['default', F0], ['1e6', 1e6 * g], ['1e9', 1e9 * g]]) for (const th of [45, 0]) for (const [label, ex] of [['all on', {}], ['ownRecoil off', { ownRecoil: false }], ['ownRecoil only', { unbreakable: false, airAbsorb: 0, keepForm: false }]]) {
  const cA = ctx(Object.assign({ F }, ex)), cB = ctx(Object.assign({ F }, ex), ollie);
  const t = P.throwPartner(cA, cB, th), r = t.r;
  const pObj = r.canMove ? r.push.pB * t.obj.m / r.mB : 0;
  console.log('wthrow', lbl, th, label, JSON.stringify({ canMove: r.canMove, basis: r.basis, v: sig(r.v), recoilV: sig(r.recoilV), pObj: sig(pObj), toGround: r.toGround && { J: sig(r.toGround.J), T: sig(r.toGround.T), supplied: r.toGround.supplied && sig(r.toGround.supplied), whole: r.toGround.whole && sig(r.toGround.whole) }, ppvOwn: sig(ppv(cA, r.toGround)), sinkRatio: sig(r.sinkRatio), sinkRatioRaw: r.sinkRatioRaw && sig(r.sinkRatioRaw), landed: r.flight && r.flight.landed, vImpact: r.flight && sig(r.flight.vImpact), landToGround: t.landToGround && { J: sig(t.landToGround.J), supplied: sig(t.landToGround.supplied) }, fallsBack: t.fallsBack }));
}
