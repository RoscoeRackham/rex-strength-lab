const { P, g, R3, O3, ON, dial, c3, sig } = require('./common.js');
const on = (x) => Object.assign({}, ON, x || {});
const effMass = 0.022 * Math.pow(0.827 * 0.1525 / 0.19, 2), holdArm = 0.022 * 0.682 * 0.1525 / 0.19;
for (const [lab, own] of [['power on', true], ['power off', false]]) {
  const x = { keepForm: false, ownRecoil: own };
  const r = P.armWrestle(c3(dial, R3, on(x)), c3(1000 * g, O3, on(x)));
  const Pw = r.PA, Pl = r.PB, ml = O3.m, mw = R3.m, M = effMass * (R3.m + O3.m), a = (Pw - Pl) / M;
  const C = Pl + effMass * ml * a;   // contact force at the hands (loser's forearm dynamics)
  const Rl = holdArm * ml * a - C;   // loser's elbow pivot force (forearm translational balance)
  const Rw = C + holdArm * mw * a;   // winner's elbow pivot force (engine's power-off formula)
  console.log(lab, { outcome: r.outcome, tableBreaks: r.tableBreaks, by: r.tableBreaksBy, PA: sig(Pw), PB: sig(Pl), tableLat: sig(r.tableLat), padLoad: sig(r.padLoad), pinV: r.pin && sig(r.pin.v), pinE: r.pin && sig(r.pin.E), slamRatio: r.slamRatio && sig(r.slamRatio), M: sig(M), a: sig(a), C: sig(C), loserPad: sig(Math.abs(Rl)), winnerPadFull: sig(Rw), PwMinusHoldArm: sig(Pw - holdArm * ml * a) });
}
// how many runs in test 8i's grid would break by the loser's pad
let n = 0, runs = 0; const ex = [];
const surf = require('./common.js').surf;
for (const lg of [2.5, 3, 3.5, 4, 5, 6, 9, 12, 20]) for (const lo of [2, 2.5, 3, 4, 6, 9]) for (const sid of ['sand', 'concrete', 'ice', 'granite', 'softclay']) for (const anc of ['friction', 'bolted']) for (const kf of [false, true]) for (const ub of [false, true]) {
  const x = { keepForm: kf, unbreakable: ub, surface: surf(sid), anchor: anc };
  const r = P.armWrestle(c3(Math.pow(10, lg) * g, R3, on(x)), c3(Math.pow(10, lo) * g, O3, on(x)));
  runs++;
  if (r.outcome === 'pin' && !r.tableBreaks) {
    const aw = r.winner === 'A'; const Pw = aw ? r.PA : r.PB, Pl = aw ? r.PB : r.PA, ml = (aw ? O3 : R3).m;
    const a = (Pw - Pl) / (effMass * (R3.m + O3.m)), C = Pl + effMass * ml * a, Rl = Math.abs(holdArm * ml * a - C);
    if (Rl > r.tableLat) { n++; if (ex.length < 5) ex.push([lg, lo, sid, anc, kf, ub, sig(Rl), sig(r.tableLat)].join(' ')); }
  }
}
console.log('grid runs', runs, 'pins on the table whose loser pad (rigid-forearm model) exceeds tableLat:', n, ex);
