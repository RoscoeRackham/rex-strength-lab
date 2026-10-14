const { P, K } = require('./common');
// analytic conic: direction change between launch velocity and asymptotic velocity
function turn(u, angDeg, r0) {
  const GM = K.GM, a = angDeg * Math.PI / 180;
  const eps = u * u / 2 - GM / r0; if (eps <= 0) return NaN;
  const h = r0 * u * Math.cos(a), e = Math.sqrt(1 + 2 * eps * h * h / (GM * GM));
  // true anomaly at launch (outbound): r = p/(1+e cos nu), p = h^2/GM
  const p = h * h / GM, cosnu = (p / r0 - 1) / e, nu0 = Math.acos(Math.max(-1, Math.min(1, cosnu)));
  const nuInf = Math.acos(-1 / e);
  // flight path angle gamma: tan(gamma) = e sin nu / (1 + e cos nu); velocity direction angle in inertial frame = nu + pi/2 - gamma
  const dir = (nu) => nu + Math.PI / 2 - Math.atan2(e * Math.sin(nu), 1 + e * Math.cos(nu));
  return (dir(nuInf) - dir(nu0)) * 180 / Math.PI;
}
// numerical check
function turnNum(u, angDeg, r0) {
  const GM = K.GM, a = angDeg * Math.PI / 180;
  let x = 0, y = r0, vx = u * Math.cos(a), vy = u * Math.sin(a), dt = 0.5;
  const th0 = Math.atan2(vy, vx);
  for (let i = 0; i < 4e7; i++) {
    const r = Math.hypot(x, y); if (r > 3e10) break;
    dt = 1e-3 * r / Math.hypot(vx, vy);
    // leapfrog
    let ax = -GM * x / r ** 3, ay = -GM * y / r ** 3;
    vx += 0.5 * dt * ax; vy += 0.5 * dt * ay; x += dt * vx; y += dt * vy;
    const r2 = Math.hypot(x, y); ax = -GM * x / r2 ** 3; ay = -GM * y / r2 ** 3; vx += 0.5 * dt * ax; vy += 0.5 * dt * ay;
  }
  return (th0 - Math.atan2(vy, vx)) * 180 / Math.PI;
}
const r0 = K.R_E + 2.7;
for (const [u, ang] of [[11600, 30], [16000, 30], [23200, 30], [677e3, 60], [7062e3, 30]]) {
  const L = P.straightThrow(u, ang, 2.7);
  console.log('u', u / 1000, 'km/s at', ang, 'deg: conic turn', turn(u, ang, r0).toFixed(4), 'deg; numeric', turnNum(u, ang, r0).toFixed(4), 'deg; straightThrow(u).bendMax', (L.bendMax * 180 / Math.PI * 3600).toExponential(3), 'arcsec');
}
const Lrel = P.straightThrow(7062e3, 30, 2.7);
console.log('page quote 0.3 arcsec = straightThrow(7,062 km/s).bendMax =', (Lrel.bendMax * 180 / Math.PI * 3600).toFixed(3), 'arcsec');
// what is r.v for the 1e14 kg dial?
const { ctx, obj } = require('./common');
const r = P.throwObject(ctx(1e14, { airAbsorb: 0 }), obj('baseball'), 30);
console.log('release speed at 1e14 kg dial', (r.v / 1000).toFixed(0), 'km/s', 'bendMax at that', (P.straightThrow(r.v, 30, 0).bendMax * 206265).toFixed(3), 'arcsec');
const L90 = P.straightThrow(r.v, 90, 2.7); console.log('angle 90 bendMax', L90.bendMax);
