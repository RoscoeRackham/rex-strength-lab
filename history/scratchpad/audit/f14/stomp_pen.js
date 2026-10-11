// Independent check of stomp hole depth: numerically integrate a rigid foot (mass m = legEff)
// decelerated by R(v) = A (q + k rho v^2) - m g, from the engine's own impact speed vFoot.
// k = 0 must reproduce the engine's E/(qA) (validates the setup); k = 0.5, 1 = Poncelet / cavity expansion.
const { P, D, g, S, T, ctx } = require('./common');
function depth(m, A, q, rho, k, v0) {
  // integrate in velocity: dz = m v dv / (A(q + k rho v^2) - m g)  (exact for this ODE), log-spaced steps
  let z = 0, v = v0; const N = 200000;
  const vmin = Math.max(v0 * 1e-9, 1e-9);
  const r = Math.pow(vmin / v0, 1 / N);
  for (let i = 0; i < N; i++) { const v2 = v * r; const vm = 0.5 * (v + v2); z += m * vm * (v - v2) / (A * (q + k * rho * vm * vm) - m * g); v = v2; }
  return z;
}
const fmt = (x) => x.toPrecision(3);
for (const sid of ['sand', 'clay', 'concrete']) for (const tid of ['human', 'spidey', 'thing', 'secretwars']) {
  const c = ctx(T[tid].liftKg, { surface: sid });
  const r = P.stomp(c);
  const m = c.body.legEff, A = c.body.footArea, q = S[sid].qult, rho = S[sid].rho;
  const vNR = Math.sqrt(2 * r.E / m); // non-relativistic equivalent for the k=0 check
  const d0 = depth(m, A, q, rho, 0, Math.min(r.vFoot, vNR));
  const d05 = depth(m, A, q, rho, 0.5, r.vFoot), d1 = depth(m, A, q, rho, 1, r.vFoot);
  console.log(`${sid.padEnd(8)} ${tid.padEnd(10)} vFoot ${fmt(r.vFoot)} m/s  v/v* ${fmt(r.vFoot / Math.sqrt(q / rho))}  engine hole ${fmt(r.holeDepth)} m | my k=0 ${fmt(d0)} | k=0.5 ${fmt(d05)} | k=1 ${fmt(d1)} | engine/k=0.5 ${fmt(r.holeDepth / d05)}  engine/k=1 ${fmt(r.holeDepth / d1)} | crater ${fmt(r.crater)} m`);
}
