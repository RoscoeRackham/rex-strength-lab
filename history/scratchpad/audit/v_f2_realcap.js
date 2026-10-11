const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g; const body = P.makeBody({});
const mA = body.m - body.feetMass, mB = body.feetMass, d = body.strokes.leg, m = body.m, vmax = P.MUSCLE.jump.vmax * body.s, k = P.MUSCLE.k;
// Feet held (no sinking). Force = min(F0*hill(vA/vmax), cap). Integrate body over stroke d.
function run(F0, cap) {
  let x = 0, v = 0; const dt = 1e-7;
  while (x < d) { const F = Math.min(F0 * P.hill(v / vmax, k), cap); const a = (F - mA * g) / mA; if (a <= 0 && v <= 0) return 0; v += a * dt; x += v * dt; }
  return mA * v / m;
}
for (const [sid, q] of [['asphalt', 2e6], ['concrete', 10e6], ['granite', 400e6]]) {
  const RB = q * 2 * body.footArea - mB * g;
  const F0 = 1e8 * g; // strength well above the ground limit
  const vClamp = run(F0, RB), vF0eqRB = run(RB, Infinity);
  const j = P.jump({ F: F0, mode: 'real', body, surface: { qult: q }, groundHolds: false });
  console.log(sid.padEnd(8), 'real-mode best (clamp instantaneous force at RB):', vClamp.toFixed(2), 'm/s | F0 set to RB:', vF0eqRB.toFixed(2), '| engine now:', j.v.toFixed(2));
}
