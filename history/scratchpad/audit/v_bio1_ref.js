// Independent stiff-stable reference: backward Euler on velocities, exact scalar root for u each step.
const P = require('/home/user/dino-strength-sim/src/engine.js');
function refPush({ F: F0, d, mA, mB, RA, RB, vmax, k = 0.25, N = 200000 }) {
  const aFree = isFinite(RA), bFree = isFinite(RB);
  const hill = (u) => (u <= 0 ? 1 : u >= 1 ? 0 : (1 - u) / (1 + u / k));
  const T = Math.max(d / vmax, Math.sqrt(2 * d * Math.min(mA, mB) / F0)) * 3;
  let dt = T / N;
  let vA = 0, vB = 0, xA = 0, xB = 0, t = 0;
  const newV = (u) => {
    const F = F0 * hill(u);
    const nA = aFree ? Math.max(0, vA + dt * (F - RA) / mA) : 0;
    const nB = bFree ? Math.max(0, vB + dt * (F - RB) / mB) : 0;
    return [nA, nB];
  };
  for (let s = 0; s < 50 * N && xA + xB < d; s++) {
    // root of G(u) = (nA+nB)/vmax - u, G decreasing in u
    let lo = 0, hi = 1;
    { const [a, b] = newV(1); if ((a + b) / vmax >= 1) lo = hi = 1; }
    for (let i = 0; i < 200 && hi - lo > 1e-15; i++) { const m = 0.5 * (lo + hi); const [a, b] = newV(m); if ((a + b) / vmax > m) lo = m; else hi = m; }
    const [nA, nB] = newV(0.5 * (lo + hi));
    let ddt = dt;
    const dx = 0.5 * (vA + nA) * dt + 0.5 * (vB + nB) * dt;
    if (xA + xB + dx > d) { // partial last step (linear)
      const f = (d - xA - xB) / dx; ddt = dt * f;
      vA = vA + (nA - vA) * f; vB = vB + (nB - vB) * f; xA += 0.5 * (vA + vA) * 0; 
      return { vA, vB, t: t + ddt };
    }
    xA += 0.5 * (vA + nA) * dt; xB += 0.5 * (vB + nB) * dt; vA = nA; vB = nB; t += dt;
    if (vA === 0 && vB === 0 && s > 100) return { vA: 0, vB: 0, stalled: true, t };
  }
  return { vA, vB, t };
}
module.exports = { refPush };
if (require.main === module) {
  const g = 9.80665;
  const concrete = { qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 };
  const body = P.makeBody({ H: 2, m: 180 });
  const cases = (kg) => {
    const ancP = P.anchorCapacity({ body, surface: concrete, theta: 0, anchor: 'friction' });
    const th = Math.PI / 4;
    const bbB = 0.145 + body.whipEff;
    const ancB = P.anchorCapacity({ body, surface: concrete, theta: th, anchor: 'friction', extraMass: 0.145 });
    return {
      punch: [{ F: 0.3 * kg * g, d: body.strokes.punch, mA: body.m - body.handEff, mB: body.handEff, RA: ancP.R, RB: 0, vmax: 17 }, 'vB'],
      clap: [{ F: 0.3 * kg * g, d: body.strokes.clap, mA: body.m, mB: body.handEff, RA: Infinity, RB: 0, vmax: 17 }, 'vB'],
      stomp: [{ F: 0.5 * kg * g, d: body.strokes.stomp, mA: body.m - body.legEff, mB: body.legEff, RA: (body.m - body.legEff) * g, RB: 0, vmax: 16 }, 'vB'],
      jumpBody: [{ F: 1.0 * kg * g, d: body.strokes.leg, mA: body.m - body.feetMass, mB: body.feetMass, RA: (body.m - body.feetMass) * g, RB: concrete.qult * 2 * body.footArea, vmax: 30 }, 'vA'],
      baseball: [{ F: 0.3 * kg * g, d: body.strokes.whip, mA: body.m - body.whipEff, mB: bbB, RA: ancB.R, RB: bbB * g * Math.sin(th), vmax: 55 }, 'vB'],
    };
  };
  const engineVal = (name, kg) => {
    const c = { F: kg * g, mode: 'real', body, surface: concrete, groundHolds: false, anchor: 'friction' };
    if (name === 'punch') return P.punch(c).vFist;
    if (name === 'clap') return P.clap(c).vHand;
    if (name === 'stomp') return P.stomp(c).vFoot;
    if (name === 'jumpBody') return P.jump(c).push.vA;
    if (name === 'baseball') return P.throwObject(c, { m: 0.145, area: 0.00434, Cd: 0.35, rho: 683 }, 45).v;
  };
  for (const kg of [511, 1e4, 1e6, 1e7, 1e8, 1e9]) {
    const row = [];
    for (const [name, [o, side]] of Object.entries(cases(kg))) {
      const N = kg >= 1e7 ? 2000000 : 200000;
      const r = refPush(Object.assign({}, o, { N }));
      row.push(`${name} ref ${r[side].toFixed(3)} eng ${engineVal(name, kg).toFixed(3)}`);
    }
    console.log(kg.toExponential(1), '| ' + row.join(' | '));
  }
}
