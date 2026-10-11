const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, R = K.R_E, GM = K.GM;
for (const v of [11090, 11150, 11160, 11170, 11180, 11185, 11186, 11186.2, 11187, 11190, 11200]) {
  const t0 = Date.now();
  const e = P.fly({ v0: v, thetaDeg: 90, h0: 0, m: 1, A: 1, Cd: 0 });
  const eps = 0.5 * v * v - GM / R;
  const ra = eps < 0 ? -GM / eps : Infinity;
  // analytic radial-Kepler round-trip time (R -> ra -> R) for eps<0
  let T = Infinity;
  if (eps < 0) {
    const a = ra / 2; // radial ellipse, e=1
    // r = a(1 - cos E), t = sqrt(a^3/GM)(E - sin E)
    const E0 = Math.acos(1 - R / a);
    T = 2 * Math.sqrt(a ** 3 / GM) * (Math.PI - (E0 - Math.sin(E0)));
  }
  console.log(`v=${v}: escaped=${e.escaped} timedOut=${e.timedOut} apex=${(e.apex/1e3).toFixed(0)} km (analytic ${isFinite(ra)?((ra-R)/1e3).toFixed(0):'inf'} km) time=${(e.time/86400).toFixed(2)} d (analytic ${(T/86400).toFixed(2)} d) vImpact=${e.vImpact.toFixed(1)} range=${e.range.toExponential(2)} steps=${e.steps} ${Date.now()-t0}ms`);
}
// Earth's Hill sphere and Moon distance for context
const rH = 1.496e11 * Math.cbrt(5.972e24 / (3 * 1.989e30));
console.log('Earth Hill radius km', (rH / 1e3).toFixed(0), ' Moon distance 384400 km');
// speed whose vacuum apex reaches the Moon / Hill sphere
for (const r of [3.844e8, rH]) console.log('v for apex r=', r.toExponential(3), Math.sqrt(2 * GM * (1 / R - 1 / r)).toFixed(1));
