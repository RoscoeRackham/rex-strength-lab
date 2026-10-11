// Patched copy of pushApartHill (scratch only) to validate the proposed fix.
const P = require('/home/user/dino-strength-sim/src/engine.js');
const hill = P.hill;
function hillFixed(o) {
  const { d, mA, mB, F: F0, vmax } = o; const k = 0.25;
  const RA = o.RA == null ? 0 : o.RA, RB = o.RB == null ? 0 : o.RB;
  const aFree = isFinite(RA), bFree = isFinite(RB);
  let xA = 0, xB = 0, vA = 0, vB = 0, t = 0, steps = 0;
  const acc = (vA_, vB_) => { const F = F0 * hill((vA_ + vB_) / vmax, k); let aA = 0, aB = 0;
    if (aFree && (vA_ > 0 || F > RA)) aA = (F - RA) / mA; if (bFree && (vB_ > 0 || F > RB)) aB = (F - RB) / mB; return [aA, aB]; };
  const mMove = Math.min(aFree ? mA : Infinity, bFree ? mB : Infinity);
  const tEst = Math.max(Math.sqrt(2 * d * mMove / F0), d / vmax);
  const dt = Math.min(tEst / 4000, 0.02 * vmax * mMove / F0);   // never let one step change speed by more than 2% of vmax
  while (xA + xB < d && steps < 2e6) {
    const [a1A, a1B] = acc(vA, vB);
    const [a2A, a2B] = acc(Math.max(0, vA + 0.5 * dt * a1A), Math.max(0, vB + 0.5 * dt * a1B));
    const nvA = Math.max(0, vA + dt * a2A), nvB = Math.max(0, vB + dt * a2B);
    xA += 0.5 * (vA + nvA) * dt; xB += 0.5 * (vB + nvB) * dt; vA = nvA; vB = nvB; t += dt; steps++;
    if (vA === 0 && vB === 0 && steps > 10) break;
  }
  return { vA, vB, steps };
}
const g = P.K.g, body = P.makeBody({});
for (const kg of [1e6, 1e7, 1e8, 1e9, 1e10, 1e11]) {
  const o = { F: kg * g * 0.3, d: body.strokes.punch, mA: body.m - body.handEff, mB: body.handEff, RA: 1412, RB: 0, vmax: 17, mode: 'real' };
  const e = P.pushApart(o), f = hillFixed(o);
  console.log('punch lift', kg.toExponential(0), '| engine vB', e.vB.toFixed(3), e.saturated ? '(sat)' : '', '| fixed-dt vB', f.vB.toFixed(3), 'steps', f.steps);
}
