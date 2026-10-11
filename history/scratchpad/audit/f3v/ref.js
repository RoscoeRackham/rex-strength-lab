// Independent reference for pushApart real mode, no time stepping.
// While both free sides move (F(w) > R side or v>0): integrate in w = vA+vB.
//   dw/dt = G(w) = aA(w) + aB(w),  dx/dw = w/G(w),  dvB/dw = aB/G, dvA/dw = aA/G
// Valid while aA,aB >= 0 (true when F(w) >= RA,RB, i.e. all but the last sliver near vmax).
// For safety, fall back to a very fine RK4 in time for the near-vmax tail.
const hillF = (u, k) => (u <= 0 ? 1 : u >= 1 ? 0 : (1 - u) / (1 + u / k));
function refHill(o) {
  const { F: F0, d, mA, mB, vmax } = o; const k = o.k || 0.25;
  const RA = o.RA == null ? 0 : o.RA, RB = o.RB == null ? 0 : o.RB;
  const aFree = isFinite(RA), bFree = isFinite(RB);
  // state in time, RK4 with dt limited by |dv| <= 1e-4 vmax and dx <= 1e-5 d
  let xA = 0, xB = 0, vA = 0, vB = 0, t = 0;
  const acc = (vA_, vB_) => {
    const F = F0 * hillF((vA_ + vB_) / vmax, k);
    let aA = 0, aB = 0;
    if (aFree && (vA_ > 0 || F > RA)) aA = (F - RA) / mA;
    if (bFree && (vB_ > 0 || F > RB)) aB = (F - RB) / mB;
    return [aA, aB];
  };
  for (let i = 0; i < 2e7; i++) {
    const [aA, aB] = acc(vA, vB);
    const am = Math.max(Math.abs(aA), Math.abs(aB), 1e-30);
    let dt = Math.min(1e-4 * vmax / am, 1e-5 * d / Math.max(vA + vB, 1e-12));
    // RK4 on (vA,vB) with clamp at zero
    const f = (va, vb) => acc(Math.max(0, va), Math.max(0, vb));
    const k1 = [aA, aB];
    const k2 = f(vA + 0.5 * dt * k1[0], vB + 0.5 * dt * k1[1]);
    const k3 = f(vA + 0.5 * dt * k2[0], vB + 0.5 * dt * k2[1]);
    const k4 = f(vA + dt * k3[0], vB + dt * k3[1]);
    const nvA = Math.max(0, vA + dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]));
    const nvB = Math.max(0, vB + dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]));
    const dxA = 0.5 * (vA + nvA) * dt, dxB = 0.5 * (vB + nvB) * dt;
    if (xA + xB + dxA + dxB >= d) {
      const fr = (d - xA - xB) / (dxA + dxB);
      vA += (nvA - vA) * fr; vB += (nvB - vB) * fr; xA += dxA * fr; xB += dxB * fr; t += dt * fr;
      return { vA, vB, xA, xB, t, done: true };
    }
    xA += dxA; xB += dxB; vA = nvA; vB = nvB; t += dt;
    if (vA === 0 && vB === 0 && i > 100) return { vA, vB, xA, xB, t, done: false };
  }
  return { vA, vB, xA, xB, t, done: false, maxed: true };
}
// Quadrature check (independent of time stepping) for the regime aA,aB>=0 throughout
function quadHill(o, N) {
  const { F: F0, d, mA, mB, vmax } = o; const k = o.k || 0.25;
  const RA = o.RA == null ? 0 : o.RA, RB = o.RB == null ? 0 : o.RB;
  const aFree = isFinite(RA), bFree = isFinite(RB);
  const aOf = (w) => { const F = F0 * hillF(w / vmax, k); return [aFree ? (F - RA) / mA : 0, bFree ? (F - RB) / mB : 0]; };
  // integrate w from 0 upward with Simpson in small panels until x reaches d or aA<0
  N = N || 2e6;
  // find w* where G=0 (upper limit)
  let lo = 0, hi = vmax;
  for (let i = 0; i < 200; i++) { const m = 0.5 * (lo + hi); const [a, b] = aOf(m); if (a + b > 0) lo = m; else hi = m; }
  const wStar = lo;
  let x = 0, vA = 0, vB = 0, w = 0;
  // use substitution to resolve the log singularity: step in s = -ln(1 - w/wStar)
  const sMax = 60; const ds = sMax / N;
  let prev = null;
  const integrand = (s) => { const ww = wStar * (1 - Math.exp(-s)); const dwds = wStar * Math.exp(-s); const [a, b] = aOf(ww); const G = a + b; return [ww * dwds / G, a * dwds / G, b * dwds / G, ww]; };
  let I0 = integrand(0);
  for (let i = 0; i < N; i++) {
    const s0 = i * ds, s1 = s0 + ds, sm = s0 + 0.5 * ds;
    const Im = integrand(sm), I1 = integrand(s1);
    const dx = ds / 6 * (I0[0] + 4 * Im[0] + I1[0]);
    if (x + dx >= d) { const fr = (d - x) / dx; vA += fr * ds / 6 * (I0[1] + 4 * Im[1] + I1[1]); vB += fr * ds / 6 * (I0[2] + 4 * Im[2] + I1[2]); return { vA, vB, w: I0[3] + fr * (I1[3] - I0[3]), regimeOK: Math.min(aOf(I1[3])[0], aOf(I1[3])[1]) >= 0 }; }
    x += dx; vA += ds / 6 * (I0[1] + 4 * Im[1] + I1[1]); vB += ds / 6 * (I0[2] + 4 * Im[2] + I1[2]);
    I0 = I1;
  }
  return { vA, vB, w: wStar, reachedWstar: true, x };
}
module.exports = { refHill, quadHill, hillF };
