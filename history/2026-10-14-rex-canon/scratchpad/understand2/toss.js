const { P, g, sig, rex, ollie, ctx, ppv, ob, F0 } = require('./h.js');
const pt = (t, c) => ({ result: t.result, v: sig(t.v), rise: sig(t.rise), holdNeeded: sig(t.holdNeeded),
  toGroundT: t.toGroundT && { J: sig(t.toGroundT.J), T: sig(t.toGroundT.T), supplied: t.toGroundT.supplied && sig(t.toGroundT.supplied), whole: t.toGroundT.whole && sig(t.toGroundT.whole) }, ppvT: sig(ppv(c, t.toGroundT)),
  toGroundC: t.toGroundC && { J: sig(t.toGroundC.J), T: sig(t.toGroundC.T), supplied: t.toGroundC.supplied && sig(t.toGroundC.supplied), whole: t.toGroundC.whole && sig(t.toGroundC.whole) }, ppvC: sig(ppv(c, t.toGroundC)),
  pUp: t.v ? sig(P.vToMomentum(t.v, t.obj.m)) : null, pDown: t.flight ? sig(P.vToMomentum(t.flight.vImpact, t.obj.m)) : null, vImpact: t.flight && sig(t.flight.vImpact),
  catch: t.catch && { clean: t.catch.clean, F: sig(t.catch.F), uAfter: sig(t.catch.uAfter), tStroke: sig(t.catch.tStroke), slide: sig(t.catch.slide), sinkRatio: sig(t.catch.sinkRatio), sinkRatioRaw: t.catch.sinkRatioRaw && sig(t.catch.sinkRatioRaw), R: sig(t.catch.R) } });
for (const [lbl, F] of [['default dial', F0], ['1e6', 1e6 * g], ['1e9', 1e9 * g]]) for (const style of ['easy', 'hard']) for (const [label, ex] of [['all on', {}], ['ownRecoil off', { ownRecoil: false }], ['ownRecoil only', { unbreakable: false, airAbsorb: 0, keepForm: false }]]) {
  const c = ctx(Object.assign({ F }, ex)); const t = P.tossPartner(c, ollie, 'Ollie', style, 10, 'friction');
  console.log('toss', lbl, style, label, JSON.stringify(pt(t, c)));
}
