const { P, g, ctx, D } = require('./lib.js');
// Poncelet penetration: m dv/dt = -A (q + k rho v^2), k ~ 0.5-1 (Cd/2 of a blunt nose). Depth = m/(2 k rho A) ln(1 + k rho v0^2 / q)
const pon = (m, A, rho, q, v, k) => m / (2 * k * rho * A) * Math.log(1 + k * rho * v * v / q);
for (const [s, kg] of [['sand', 9072], ['sand', 90718], ['concrete', 90718], ['concrete', 1.36e14], ['granite', 1.36e14], ['granite', 1.8e20]]) {
  const c = ctx({ kg, surface: s });
  const r = P.stomp(c);
  const m = c.body.legEff, A = c.body.footArea, rho = c.surface.rho, q = c.surface.qult;
  console.log(s.padEnd(8), 'lift', kg.toExponential(2), '| vFoot', r.vFoot.toExponential(3), 'm/s | engine hole E/(q A)', r.holeDepth.toExponential(3), 'm | Poncelet (k=0.5)', pon(m, A, rho, q, r.vFoot, 0.5).toFixed(2), 'm, (k=1)', pon(m, A, rho, q, r.vFoot, 1).toFixed(2), 'm | dynamic/static pressure', (0.5 * rho * r.vFoot ** 2 / q).toExponential(2), '| Earth diameter 1.27e7 m');
}
