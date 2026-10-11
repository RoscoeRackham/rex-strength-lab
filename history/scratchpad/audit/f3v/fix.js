// Proposed minimal fix for pushApartHill (scratch only). Differences from engine:
//  1. When a step is stiff (dt > 0.25*tau0), the Hill force is taken implicitly (backward Euler in the
//     relative speed, 1-D bisection). L-stable: no overshoot past vmax, so no false stall.
//  2. No saturated closed form for finite F0: F0 is clamped to 1e9*inertialScale (results converge as
//     F0 -> inf, error ~ inertialScale/F0), so the post-ramp momentum exchange through RA/RB is kept.
//  3. stalled comes from the force balance, like comic mode.
const P = require('/home/user/dino-strength-sim/src/engine.js');
const hill = P.hill;
function pushApartHillFixed(o) {
  const { d, mA, mB, vmax } = o; const k = o.k || 0.25;
  const RA = o.RA == null ? 0 : o.RA, RB = o.RB == null ? 0 : o.RB;
  const aFree = isFinite(RA), bFree = isFinite(RB);
  const inertialScale = Math.max(mA, mB) * vmax * vmax / d + (aFree ? RA : 0) + (bFree ? RB : 0);
  const F0 = Math.min(o.F, 1e9 * inertialScale);                         // (2)
  const stalled = !(aFree && F0 > RA) && !(bFree && F0 > RB);            // (3)
  if (stalled) return { t: Infinity, stalled: true, saturated: false, xA: 0, xB: 0, vA: 0, vB: 0, pA: 0, pB: 0, EA: 0, EB: 0 };
  let xA = 0, xB = 0, vA = 0, vB = 0, t = 0;
  const mMove = Math.min(aFree ? mA : Infinity, bFree ? mB : Infinity);
  const tComic = Math.sqrt(2 * d * Math.min(mA, mB) / Math.max(F0, 1e-9));
  const tEst = Math.max(tComic, d / vmax);
  const dt = tEst / 4000;
  const tau0 = mMove * vmax / ((1 + 1 / k) * F0);                         // fastest relaxation time of Hill drive
  const stiff = dt > 0.25 * tau0;
  const acc = (vA_, vB_) => { const F = F0 * hill((vA_ + vB_) / vmax, k); let aA = 0, aB = 0;
    if (aFree && (vA_ > 0 || F > RA)) aA = (F - RA) / mA; if (bFree && (vB_ > 0 || F > RB)) aB = (F - RB) / mB; return [aA, aB]; };
  // implicit update: speeds after dt if the force over the step is F0*hill(wn/vmax)
  const after = (wn) => { const F = F0 * hill(wn / vmax, k);
    const nA = aFree && (vA > 0 || F > RA) ? Math.max(0, vA + dt * (F - RA) / mA) : 0;
    const nB = bFree && (vB > 0 || F > RB) ? Math.max(0, vB + dt * (F - RB) / mB) : 0; return [nA, nB]; };
  let steps = 0;
  while (xA + xB < d && steps < 400000) {
    let nvA, nvB;
    if (!stiff) {
      const [a1A, a1B] = acc(vA, vB);
      const [a2A, a2B] = acc(Math.max(0, vA + 0.5 * dt * a1A), Math.max(0, vB + 0.5 * dt * a1B));
      nvA = Math.max(0, vA + dt * a2A); nvB = Math.max(0, vB + dt * a2B);
    } else {
      let lo = 0, hi = Math.max(vmax, vA + vB);                           // h(w) = sum(after(w)) - w is decreasing
      for (let i = 0; i < 80; i++) { const m = 0.5 * (lo + hi); const [a, b] = after(m); if (a + b > m) lo = m; else hi = m; }
      [nvA, nvB] = after(lo);
    }
    xA += 0.5 * (vA + nvA) * dt; xB += 0.5 * (vB + nvB) * dt; vA = nvA; vB = nvB; t += dt; steps++;
    if (vA === 0 && vB === 0 && steps > 10) break;
  }
  return { t, stalled: false, saturated: false, xA, xB, vA, vB, steps, pA: mA * vA, pB: mB * vB, EA: 0.5 * mA * vA * vA, EB: 0.5 * mB * vB * vB };
}
module.exports = { pushApartHillFixed };
