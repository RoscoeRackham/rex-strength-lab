// Independent check: feet resisted by Poncelet-type ground R(v) = A (q + k rho v^2), inelastic lock at full extension.
// Closed form for feet: mB dv/dt = (F - A q) - A k rho v^2  ->  v = vt tanh(t/tau), x = vt tau ln cosh(t/tau)
const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, body = P.makeBody({});
const S = (id) => D.surfaces.find(s => s.id === id);
const T = Object.fromEntries(D.tiers.map(t => [t.id, t.liftKg]));
const mA = body.m - body.feetMass, mB = body.feetMass, d = body.strokes.leg, A = 2 * body.footArea;
const lncosh = (z) => z > 20 ? z - Math.LN2 + Math.log1p(Math.exp(-2*z)) : Math.log(Math.cosh(z));
function jumpPoncelet(Fj, surf, k) {
  const fA = Fj - mA * g, f0 = Fj - A * surf.qult;
  if (fA <= 0) return 0;
  if (f0 <= 0) { // ground holds: classic
    const t = Math.sqrt(2 * d * mA / fA); return fA * t / body.m; // as in engine, pA/m with feet at rest (then yanked)
  }
  const c = A * k * surf.rho;
  const vt = Math.sqrt(f0 / c), tau = mB / Math.sqrt(f0 * c);
  const xB = (t) => vt * tau * lncosh(t / tau), vB = (t) => vt * Math.tanh(t / tau);
  const xA = (t) => fA * t * t / (2 * mA);
  let lo = 0, hi = 1; while (xA(hi) + xB(hi) < d) hi *= 2;
  for (let i = 0; i < 300; i++) { const m = 0.5*(lo+hi); if (xA(m) + xB(m) < d) lo = m; else hi = m; }
  const t = hi;
  const pA = fA * t, pB = mB * vB(t);
  return { v: Math.max(0, pA - pB) / body.m, t, pA, pB, sink: xB(t), groundImpulse: Fj * t - pB };
}
for (const [surf, kg] of [['sand', T.spidey], ['sand', 1e6], ['sand', 1.36e11], ['sand', T.secretwars], ['concrete', 1e6], ['concrete', T.secretwars], ['granite', 1e7]]) {
  const ctx = { F: kg * g, mode: 'comic', body, surface: S(surf), groundHolds: false, anchor: 'friction' };
  const j = P.jump(ctx);
  const r = jumpPoncelet(j.F, S(surf), 1);
  const asym = d * Math.sqrt(j.F * 1 * S(surf).rho * A) / body.m;
  console.log(surf.padEnd(8), kg.toExponential(3), '| engine v', j.v.toPrecision(4), '| Poncelet k=1 v', r.v.toPrecision(4), 'ratio', (r.v / j.v).toFixed(2), 'asym', asym.toPrecision(4), 'sink', r.sink.toPrecision(3),
    '| k=0.5 v', jumpPoncelet(j.F, S(surf), 0.5).v.toPrecision(4), 'k=2 v', jumpPoncelet(j.F, S(surf), 2).v.toPrecision(4));
}
// monotonicity of Poncelet model across strength on sand & concrete
for (const surf of ['sand','concrete']) { let prev = 0, mono = true; for (let e = 2.7; e < 16; e += 0.01) { const Fj = 10**e * g * P.MUSCLE.jump.comicFrac; const r = jumpPoncelet(Fj, S(surf), 1); const v = typeof r === 'number' ? r : r.v; if (v < prev * (1 - 1e-9)) { mono = false; console.log('  non-monotone at', e.toFixed(2), v, prev); } prev = v; } console.log(surf, 'Poncelet monotone:', mono); }
