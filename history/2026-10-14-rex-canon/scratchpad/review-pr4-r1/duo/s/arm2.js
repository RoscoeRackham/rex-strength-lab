const { P, D, g, rex, ollie, surf, ON, OFF, ctx, DIAL } = require('./env.js');
const show = (lbl, r) => console.log(lbl, JSON.stringify({ outcome: r.outcome, winner: r.winner, tableBreaks: r.tableBreaks, by: r.tableBreaksBy, padLoad: r.padLoad, tableLat: r.tableLat, AA: r.AA, AB: r.AB, pinV: r.pin && r.pin.v, pinE: r.pin && r.pin.E, slamRatio: r.slamRatio, loserSlides: r.loserSlides, winnerSlides: r.winnerSlides, tearA: r.tearA, tearB: r.tearB, toGround: r.toGround, recoil: r.recoilAbsorbed, drag: r.drag && r.drag.v }));
for (const [pw, PW] of [['ON', ON], ['ONkf', Object.assign({}, ON, { keepForm: false })], ['OFF', OFF], ['OFFrecoilonly', Object.assign({}, ON, { keepForm: false, ownRecoil: false })]]) for (const [aR, aO] of [['friction', 'friction'], ['bolted', 'friction'], ['friction', 'bolted']]) for (const [kR, kO] of [[DIAL, 1000], [1e9, 1000], [Infinity, 1000], [DIAL, DIAL * 0.5], [1e6, DIAL]]) {
  const cR = ctx(kR, rex, Object.assign({ anchor: aR }, PW)), cO = ctx(kO, ollie, Object.assign({ anchor: aO }, PW));
  show(pw + ' ' + aR[0] + aO[0] + ' R' + kR + ' O' + kO, P.armWrestle(cR, cO));
}
