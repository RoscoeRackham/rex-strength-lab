// Real (Hill) mode: F = F0*hill((vA+vB)/vmax). Same ground laws as jump_pon.js. Semi-implicit midpoint like engine, tiny dt.
const { P, D, g, S, T, ctx } = require('./common');
function sim(F0, body, surf, k, vmax) {
  const mB = body.feetMass, mA = body.m - mB, A = 2 * body.footArea, d = body.strokes.leg, q = surf.qult, rho = surf.rho;
  const acc = (vA, vB) => { const F = F0 * P.hill((vA + vB) / vmax, P.MUSCLE.k);
    const aA = (vA > 0 || F > mA * g) ? (F - mA * g) / mA : 0;
    const aB = (vB > 0 || F > q * A) ? (F - A * (q + k * rho * vB * vB)) / mB : 0; return [aA, aB]; };
  let xA = 0, xB = 0, vA = 0, vB = 0; const dt = 2e-7;
  for (let i = 0; i < 5e7 && xA + xB < d; i++) { const [a1, b1] = acc(vA, vB); const mA_ = Math.max(0, vA + 0.5 * dt * a1), mB_ = Math.max(0, vB + 0.5 * dt * b1); const [a2, b2] = acc(mA_, mB_); const nA = Math.max(0, vA + dt * a2), nB = Math.max(0, vB + dt * b2); xA += 0.5 * (vA + nA) * dt; xB += 0.5 * (vB + nB) * dt; vA = nA; vB = nB; }
  return { v: mA * vA / body.m, sink: xB };
}
for (const tid of ['spidey', 'thing', 'secretwars']) {
  const c = ctx(T[tid].liftKg, { surface: 'sand', mode: 'real' }); const r = P.jump(c);
  const vmax = P.MUSCLE.jump.vmax * c.body.s;
  const e0 = sim(r.F, c.body, S.sand, 0, vmax), e5 = sim(r.F, c.body, S.sand, 0.5, vmax), e1 = sim(r.F, c.body, S.sand, 1, vmax);
  console.log(`real mode sand ${tid}: engine v ${r.v.toPrecision(3)} saturated ${r.push.saturated} sink ${r.sink.toPrecision(3)} | my k=0 ${e0.v.toPrecision(3)} | k=0.5 ${e5.v.toPrecision(3)} | k=1 ${e1.v.toPrecision(3)} (ratio k=1/engine ${(e1.v / r.v).toFixed(2)})`);
}
