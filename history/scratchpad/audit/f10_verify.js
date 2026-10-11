const { P, ctx } = require('./lib.js');
const c = P.K.c;
// 1) stomp split across tiers, with momenta
for (const o of [{}, { logKg: 4 }, { logKg: 8 }, { logKg: 20 }, { logKg: 24 }, { logKg: 34 }, { inf: true }]) {
  const cx = ctx(o), r = P.stomp(cx), p = r.push;
  console.log(JSON.stringify(o), 'Fstomp', r.F.toExponential(3), 'RA=W', ((cx.body.m - cx.body.legEff) * P.K.g).toFixed(1),
    'EA', p.EA.toExponential(3), 'EB', p.EB.toExponential(3), 'footShare', (p.EB / (p.EA + p.EB)), 'pA/pB', p.pA / p.pB,
    'UIclaim', 1 - cx.body.legEff / cx.body.m);
}
// 2) limit of xA, xB as F -> inf (comic), punch geometry and jump geometry
const b = P.makeBody({});
const punchArgs = { d: b.strokes.punch, mA: b.m - b.handEff, mB: b.handEff, RA: 1e3, RB: 0, mode: 'comic' };
const jumpArgs = { d: b.strokes.leg, mA: b.m - b.feetMass, mB: b.feetMass, RA: (b.m - b.feetMass) * P.K.g, RB: 9e5, mode: 'comic' };
for (const [name, a] of [['punch', punchArgs], ['jump', jumpArgs]]) {
  for (const F of [1e5, 1e10, 1e15, 1e20, 1e25, 1e30, 1e50, 1e300, Infinity]) {
    const r = P.pushApart(Object.assign({}, a, { F }));
    console.log(name, 'F', F, 'xA', r.xA.toFixed(5), 'xB', r.xB.toFixed(5));
  }
}
// analytic limit: x(f,m,t) -> c t as f -> inf, so xA = xB = d/2
// 3) proposed fix applied to a copy of the branch
function fixedInf(d, mA, mB, RA, RB) {
  const aMoves = isFinite(RA), bMoves = isFinite(RB);
  return { xA: aMoves ? (bMoves ? d / 2 : d) : 0, xB: bMoves ? (aMoves ? d / 2 : d) : 0 };
}
console.log('fixed punch inf', fixedInf(punchArgs.d, punchArgs.mA, punchArgs.mB, 1e3, 0), 'fixed jump inf', fixedInf(jumpArgs.d, jumpArgs.mA, jumpArgs.mB, 1, 9e5));
// 4) real mode at inf: not affected (saturated branch)
const rr = P.pushApart(Object.assign({}, punchArgs, { F: Infinity, mode: 'real', vmax: 10 }));
console.log('real inf punch', rr.xA, rr.xB, rr.saturated);
