// Proposed replacement for pushApartHill: backward-Euler step, Hill force solved exactly (quadratic per linear piece).
function makeHill(K, MUSCLE) {
  return function pushApartHill(o, RA, RB) {
    const { d, mA, mB } = o;
    const F0 = o.F, vmax = o.vmax, k = o.k || MUSCLE.k;
    const aFree = isFinite(RA), bFree = isFinite(RB);
    const iF0 = isFinite(F0) ? 1 / F0 : 0;
    const tComic = isFinite(F0) ? Math.sqrt(2 * d * Math.min(mA, mB) / Math.max(F0, 1e-9)) : 0;
    const dt = Math.max(tComic, d / vmax) / 4000;
    const sides = [];
    let xA = 0, xB = 0, vA = 0, vB = 0, t = 0, steps = 0;
    // Solve F = F0*hill(S(F)/vmax), S(F) = sum max(0, v_i + dt(F - R_i)/m_i). Hill is an involution, so
    // this is S(F) = vmax*hill(F/F0); Q(F) = S(F)(1 + F/(k F0)) - vmax(1 - F/F0) is increasing in F.
    const solveF = () => {
      const c = [], e = [];
      if (aFree) { c.push(vA - dt * RA / mA); e.push(dt / mA); }
      if (bFree) { c.push(vB - dt * RB / mB); e.push(dt / mB); }
      const S = (F) => c.reduce((s, ci, i) => s + Math.max(0, ci + e[i] * F), 0);
      const Q = (F) => S(F) * (1 + F * iF0 / k) - vmax * (1 - F * iF0);
      if (Q(0) >= 0) return 0;
      const Fmax = isFinite(F0) ? F0 : Infinity;
      const bps = c.map((ci, i) => -ci / e[i]).filter((b) => b > 0 && b < Fmax).sort((x, y) => x - y);
      const edges = [0, ...bps, Fmax];
      for (let j = 0; j + 1 < edges.length; j++) {
        const lo = edges[j], hi = edges[j + 1];
        if (isFinite(hi) && Q(hi) < 0) continue;
        const mid = isFinite(hi) ? 0.5 * (lo + hi) : lo + 1;
        let a = 0, b = 0;
        c.forEach((ci, i) => { if (ci + e[i] * mid > 0) { a += ci; b += e[i]; } });
        // (b iF0/k) F^2 + (b + a iF0/k + vmax iF0) F + (a - vmax) = 0, positive root, stable form
        const A2 = b * iF0 / k, B2 = b + a * iF0 / k + vmax * iF0, C2 = a - vmax;
        const disc = Math.max(0, B2 * B2 - 4 * A2 * C2);
        const F = -2 * C2 / (B2 + Math.sqrt(disc));
        return Math.min(Math.max(F, lo), hi);
      }
      return isFinite(F0) ? F0 : 0;
    };
    while (xA + xB < d && steps < 400000) {
      const F = solveF();
      const nvA = aFree ? Math.max(0, vA + dt * (F - RA) / mA) : 0;
      const nvB = bFree ? Math.max(0, vB + dt * (F - RB) / mB) : 0;
      xA += 0.5 * (vA + nvA) * dt; xB += 0.5 * (vB + nvB) * dt;
      vA = nvA; vB = nvB; t += dt; steps++;
      if (vA === 0 && vB === 0 && steps > 10) break;
    }
    const stalled = xA + xB < d * 0.999 && vA === 0 && vB === 0;
    return { t, stalled, saturated: false, xA, xB, vA, vB, pA: mA * vA, pB: mB * vB, EA: 0.5 * mA * vA * vA, EB: 0.5 * mB * vB * vB, steps };
  };
}
module.exports = { makeHill };
