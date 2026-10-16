const { P, g, sig, rex, ollie, ctx, ppv, ob } = require('./h.js');
const pick = (L) => ({ result: L.result, vL: sig(L.aim && L.aim.vL), th: sig(L.aim && L.aim.thetaDeg), vArrive: sig(L.vArrive), angleDeg: sig(L.angleDeg), fast: !!L.fast,
  recoil: L.recoil && { v: sig(L.recoil.v), slide: sig(L.recoil.slide) },
  toGroundT: L.toGroundT && { J: sig(L.toGroundT.J), T: sig(L.toGroundT.T), supplied: L.toGroundT.supplied && sig(L.toGroundT.supplied), whole: L.toGroundT.whole && sig(L.toGroundT.whole) },
  ppvT: sig(ppv(ctx(), L.toGroundT)),
  toGroundC: L.toGroundC && { J: sig(L.toGroundC.J), T: sig(L.toGroundC.T), supplied: L.toGroundC.supplied && sig(L.toGroundC.supplied) },
  ppvC: sig(ppv(ctx(), L.toGroundC)),
  catch: L.catch && { clean: L.catch.clean, slips: L.catch.slips, R: sig(L.catch.R), F: sig(L.catch.F), uAfter: sig(L.catch.uAfter), slide: sig(L.catch.slide), carried: L.catch.carried, rel: L.catch.relativistic, tStroke: sig(L.catch.tStroke), pIn: L.catch.pIn && sig(L.catch.pIn), sinkRatio: sig(L.catch.sinkRatio), sinkRatioRaw: L.catch.sinkRatioRaw && sig(L.catch.sinkRatioRaw) },
  pObjArrive: L.vArrive ? sig(P.vToMomentum(L.vArrive, ob('baseball').m)) : null,
});
for (const [label, ex] of [['all on', {}], ['ownRecoil off', { ownRecoil: false }], ['ownRecoil only', { unbreakable: false, airAbsorb: 0, keepForm: false }], ['all off', { ownRecoil: false, unbreakable: false, airAbsorb: 0, keepForm: false }]]) {
  const cR = ctx(Object.assign({ F: 1e9 * g }, ex)), cO = ctx(Object.assign({ F: 1e9 * g }, ex), ollie);
  const L = P.catchLeg(cR, cO, ob('baseball'), 10, 'hard');
  console.log('fastball 10 m 1e9', label, JSON.stringify(pick(L)));
}
// throw at the same angle on the Throw tab
{ const cR = ctx({ F: 1e9 * g }), cO = ctx({ F: 1e9 * g }, ollie); const L = P.catchLeg(cR, cO, ob('baseball'), 10, 'hard'); const t = P.throwObject(Object.assign({}, cR, { noFlight: true }), ob('baseball'), L.aim.thetaDeg);
  console.log('throwObject same angle', JSON.stringify({ v: sig(t.v), pObj: sig(P.vToMomentum(t.v, ob('baseball').m)), toGround: t.toGround, recoilV: t.recoilV, push_pB: sig(t.push.pB), push_pA: sig(t.push.pA), mB: sig(t.mB), armMass: sig(t.armMass) })); }
// 1e20 carried off
for (const [label, ex] of [['all on', {}], ['ownRecoil off', { ownRecoil: false }]]) {
  const cR = ctx(Object.assign({ F: 1e20 * g }, ex)), cO = ctx(Object.assign({ F: 1e20 * g }, ex), ollie);
  const L = P.catchLeg(cR, cO, ob('baseball'), 10, 'hard');
  console.log('fastball 10 m 1e20', label, JSON.stringify(pick(L)));
}
