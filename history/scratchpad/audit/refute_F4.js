// Independent re-check of F4 (stomp hole depth = E/(q_ult * footArea))
const { P, D, g, ctx } = require('./lib.js');
const c0 = P.K.c;
// Non-relativistic Poncelet: m dv/dt = -A (q + k rho v^2) => x = m/(2 k rho A) ln(1 + k rho v^2/q)
const ponNR = (m, A, rho, q, v, k) => m / (2 * k * rho * A) * Math.log1p(k * rho * v * v / q);
// Relativistic-momentum Poncelet: dp/dt = -A (q + k rho v^2), dx = v dt  => dx = v dp / (A (q + k rho v^2)); integrate in log p
function ponRel(m, A, rho, q, v0, k) {
  if (!(v0 > 0)) return 0;
  const g0 = 1 / Math.sqrt(1 - Math.min(v0 / c0, 1 - 1e-16) ** 2);
  let p0 = g0 * m * v0;
  const N = 200000, lo = Math.log(p0) - 60, hi = Math.log(p0);
  let x = 0; const h = (hi - lo) / N;
  for (let i = 0; i < N; i++) {
    const lp = lo + (i + 0.5) * h, p = Math.exp(lp);
    const v = p / Math.sqrt(m * m + (p / c0) ** 2);
    x += v * p * h / (A * (q + k * rho * v * v));
  }
  return x;
}
const Rearth = 6.371e6;
for (const mode of ['comic', 'real']) for (const t of D.tiers) for (const s of D.surfaces) {
  const c = ctx({ kg: t.liftKg, inf: !isFinite(t.liftKg), surface: s.id, mode });
  const r = P.stomp(c);
  const m = c.body.legEff, A = c.body.footArea;
  const nr5 = ponNR(m, A, s.rho, s.qult, r.vFoot, 0.5), rel5 = isFinite(r.E) ? ponRel(m, A, s.rho, s.qult, r.vFoot, 0.5) : Infinity;
  const show = r.holeDepth > 0.05; // UI sentence threshold
  console.log(mode.padEnd(5), t.id.padEnd(10), s.id.padEnd(8), 'vFoot', r.vFoot.toExponential(2), 'E', r.E.toExponential(2),
    '| engine hole', r.holeDepth.toExponential(3), 'm', (r.holeDepth > 2 * Rearth ? '(>Earth dia)' : ''),
    '| crater', r.crater.toExponential(3), '| PonceletNR k=.5', nr5.toExponential(3), '| PonceletRel k=.5', rel5.toExponential(3),
    '| ratio engine/rel', (r.holeDepth / rel5).toExponential(2), show ? 'UI-sentence' : '');
}
