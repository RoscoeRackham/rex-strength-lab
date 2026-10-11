// Real mode, saturated (F0 >> everything): leg extends at vmax; feet in quasi-equilibrium
// F = A(q + k rho vB^2) with vB = vmax - vA; body mA dvA/dt = F - mA g; stroke ends at t = d/vmax.
const { P, D, g, S, T, ctx } = require('./common');
for (const sid of ['sand', 'clay']) for (const k of [0, 0.5, 1]) {
  const c = ctx(T.secretwars.liftKg, { surface: sid, mode: 'real' }); const r = P.jump(c); const b = c.body;
  const mB = b.feetMass, mA = b.m - mB, A = 2 * b.footArea, vmax = P.MUSCLE.jump.vmax * b.s, q = S[sid].qult, rho = S[sid].rho;
  let vA = 0; const N = 1e6, dt = b.strokes.leg / vmax / N;
  for (let i = 0; i < N; i++) { const vB = Math.max(0, vmax - vA); vA += dt * (A * (q + k * rho * vB * vB) / mA - g); vA = Math.max(0, vA); }
  const v = mA * vA / b.m;
  console.log(`${sid} SecretWars real mode k=${k}: engine v ${r.v.toPrecision(3)} (apex ${r.flight.apex.toPrecision(3)} m) | quasi-static v ${v.toPrecision(3)} apex(no air) ${(v * v / 2 / g).toPrecision(3)} m`);
}
