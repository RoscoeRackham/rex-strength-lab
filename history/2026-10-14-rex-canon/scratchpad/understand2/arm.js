const { P, g, sig, rex, ollie, ctx, ppv, ob, F0, sf } = require('./h.js');
const pa = (r) => ({ outcome: r.outcome, winner: r.winner, tableBreaks: r.tableBreaks, pin: r.pin && { t: sig(r.pin.t), v: sig(r.pin.v), M: sig(r.pin.M), p: sig(P.vToMomentum(r.pin.v, r.pin.M)), dA: sig(r.pin.dA) }, limbPulse: sig(P.limbPulse(rex)), toGround: r.toGround && { J: sig(r.toGround.J), T: sig(r.toGround.T) }, PA: sig(r.PA), PB: sig(r.PB), padLoad: sig(r.padLoad) });
for (const [lbl, FA, FB] of [['default both', F0, F0], ['default vs 1/2', F0, F0 / 2], ['1e18 vs 1e4', 1e18 * g, 1e4 * g], ['2e3 vs 1e3', 2e3 * g, 1e3 * g], ['1e6 vs 1e5', 1e6 * g, 1e5 * g]]) for (const [label, ex] of [['all on', {}], ['ownRecoil off', { ownRecoil: false }]]) {
  const cA = ctx(Object.assign({ F: FA }, ex)), cB = ctx(Object.assign({ F: FB }, ex), ollie);
  const r = P.armWrestle(cA, cB);
  console.log('arm', lbl, label, JSON.stringify(pa(r)), 'ppv', sig(ppv(cA, r.toGround)));
}
