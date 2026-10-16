const { P, ctx, octx, K, g } = require('./h.js');
const j = (r) => JSON.stringify(r, (k, v) => typeof v === 'number' ? +v.toPrecision(4) : v);
const cR = ctx({ keepForm: false }), cO = octx({ keepForm: false, F: 1000 * g });
const r = P.armWrestle(cR, cO);
console.log('on', j({ PA: r.PA, PB: r.PB, tableLat: r.tableLat, tableBreaks: r.tableBreaks, by: r.tableBreaksBy, padLoad: r.padLoad, outcome: r.outcome, pin: r.pin, slamRatio: r.slamRatio, toGround: r.toGround }));
const r0 = P.armWrestle(ctx({ keepForm: false, ownRecoil: false }), octx({ keepForm: false, F: 1000 * g, ownRecoil: false }));
console.log('off', j({ PA: r0.PA, PB: r0.PB, tableLat: r0.tableLat, tableBreaks: r0.tableBreaks, by: r0.tableBreaksBy, padLoad: r0.padLoad, outcome: r0.outcome, pin: r0.pin, loserSlides: r0.loserSlides }));
// loser's pad under reading B: Pw minus what spins the loser's forearm, with the engine's own pin kinematics
const eff = 0.022 * Math.pow(0.827 * 0.1525 / 0.19, 2), hold = 0.022 * 0.682 * 0.1525 / 0.19;
const Pw = r.PA, Pl = r.PB, mA = 3000, mB = 3000, M = eff * (mA + mB), a = (Pw - Pl) / M;
// loser's forearm: I_l alpha needs torque; CM accel: m_l r_l alpha = hold*ml*a (a: hand accel)
const Rl = Pw - hold * mB * a;
console.log('loser pad (coupled kinematics)', Rl.toPrecision(4), 'x tableLat', (Rl / r.tableLat).toPrecision(3), 'Pw', Pw.toPrecision(4));
// equal presses unequal by small amount: stalemate break condition uses min
for (const kg of [1000, 2000, 5000, 20000]) {
  const q = P.armWrestle(ctx({ keepForm: false }), octx({ keepForm: false, F: kg * g }));
  console.log('Ollie', kg, 'kg: PA', q.PA.toPrecision(4), 'PB', q.PB.toPrecision(4), 'tableLat', q.tableLat.toPrecision(4), 'breaks', q.tableBreaks, q.tableBreaksBy, 'outcome', q.outcome, 'padLoad', q.padLoad.toPrecision(4));
}
