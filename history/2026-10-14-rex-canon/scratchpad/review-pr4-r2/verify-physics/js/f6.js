const { P, g, R3, O3, dial, c3 } = require('./common.js');
const c = P.K.c;
for (const frac of [0.001, 0.0099, 0.0101]) {
  const gb = frac / Math.sqrt(1 - frac * frac);
  const r = P.collide(c3(dial, O3), c3(dial, R3), { source: 'set', gb });
  const r0 = P.collide(c3(dial, O3, { ownRecoil: false }), c3(dial, R3, { ownRecoil: false }), { source: 'set', gb });
  const KE = P.momentumToKE(r.carry.pGain, R3.m);
  console.log((frac * 100).toFixed(2) + '% c: carried KE', KE.toExponential(3), 'Elocal(on)', r.Elocal.toExponential(3), 'hitAbsorbed', r.hitAbsorbed.E.toExponential(3), 'slide', r.after.splat.slide, '| power off Elocal', r0.Elocal.toExponential(3));
}
const k = 0.5 * P.K.rho0 * 1.0 * R3.frontArea; console.log('k', k.toFixed(3), 'm/2k', (R3.m / 2 / k).toFixed(0));
// drag share of KE along a slide from 300 km/s against friction R
const R = 17651.97, v = 0.001 * c / Math.sqrt(1 - 1e-6) / Math.sqrt(1 + 1e-6);
const x = P.collide(c3(dial, O3), c3(dial, R3), { source: 'set', gb: 0.001 / Math.sqrt(1 - 1e-6) }).after.splat.slide;
const KE = 0.5 * 3000 * (0.001 * c) ** 2;
console.log('friction work R*x', (R * x).toExponential(3), 'of KE', KE.toExponential(3), '-> air share', (1 - R * x / KE).toFixed(6), 'TNT kt', (KE / 4.184e12).toFixed(1));
