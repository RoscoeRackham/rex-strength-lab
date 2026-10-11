const { P } = require('./common.js');
const { refFly } = require('./ref.js');
const K = P.K;
const cases = [
  [100, 45, 0], [3000, 45, 1.8], [5000, 89.9, 0], [5000, 89, 0], [7000, 30, 1.8], [7500, 10, 1.8], [7800, 1, 1.8], [7900, 0, 1.8], [7880, 0, 1.8],
  [9000, 60, 0], [10000, 89.99, 0], [10000, 45, 0], [11000, 90, 0], [11000, 85, 0], [11150, 45, 0], [11186, 89, 0], [11300, 90, 0], [2000, 0, 1.8], [500, 90, 0], [10500, 5, 1.8],
];
for (const [v0, th, h0] of cases) {
  const e = P.fly({ v0, thetaDeg: th, h0, m: 1, A: 1, Cd: 0 });
  const r = refFly({ v0, thetaDeg: th, h0, m: 1, A: 1, Cd: 0, rtol: 1e-12, tMax: 3e8 });
  const fmt = (x) => x == null ? '-' : (+x.toPrecision(7));
  console.log(`v0=${v0} th=${th} h0=${h0}\n  eng: land=${e.landed} esc=${e.escaped} orb=${e.orbit} range=${fmt(e.range)} apex=${fmt(e.apex)} t=${fmt(e.time)} vImp=${fmt(e.vImpact)} ang=${fmt(e.impactAngleDeg)}\n  ref: esc=${!!r.escaped} TO=${!!r.timedOut} range=${fmt(r.range)} apex=${fmt(r.apex)} t=${fmt(r.time)} vImp=${fmt(r.vImpact)} ang=${fmt(r.impactAngleDeg)}`);
}
