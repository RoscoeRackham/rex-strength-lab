const fs = require('fs');
const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
eval(fs.readFileSync('/home/user/dino-strength-sim/src/data.js', 'utf8'));
const D = window.DINO_DATA;
const g = P.K.g;
const sand = D.surfaces.find(s => s.id === 'sand');
const deg = Math.PI / 180;
const Nq = (phi) => Math.exp(Math.PI * Math.tan(phi * deg)) * Math.tan((45 + phi / 2) * deg) ** 2;
const NgV = (phi) => 2 * (Nq(phi) + 1) * Math.tan(phi * deg);      // Vesic 1973
const NgM = (phi) => (Nq(phi) - 1) * Math.tan(1.4 * phi * deg);   // Meyerhof 1963
const NgH = (phi) => 1.5 * (Nq(phi) - 1) * Math.tan(phi * deg);   // Hansen 1970
const gam = sand.rho * g;
const qSurf = (B, phi, Ng = NgV) => 0.5 * gam * B * Ng(phi) * 0.6;  // square, D=0
console.log('gamma', gam.toFixed(0), 'N/m3');
for (const phi of [28, 30, 32, 35]) console.log('phi', phi, 'Nq', Nq(phi).toFixed(2), 'Ng Vesic', NgV(phi).toFixed(2), 'Meyerhof', NgM(phi).toFixed(2), 'Hansen', NgH(phi).toFixed(2));
// Terzaghi local shear for loose sand: phi' = atan(2/3 tan phi)
const phiLoc = (phi) => Math.atan(2 / 3 * Math.tan(phi * deg)) / deg;
console.log('local-shear phi* for 30', phiLoc(30).toFixed(1));
console.log('\nH | B(m) | engine stand ratio | Vesic q(28/30/35) kPa | true stand ratio(28/30/35) | Meyerhof30 ratio | jump RB engine vs Vesic30 (N)');
for (const H of [0.4, 2, 13.3, 50, 500]) {
  const body = P.makeBody({ H, m: 180 * (H / 2) ** 3 });
  const ctx = { F: 511 * g, mode: 'comic', body, surface: sand, groundHolds: false, anchor: 'friction' };
  const r = P.lift(ctx, { m: 1e-9 });
  const B = Math.sqrt(body.footArea);
  const ps = body.m * g / (2 * body.footArea);
  const q = [28, 30, 35].map(p => qSurf(B, p));
  const j = P.jump(ctx);
  console.log(H, B.toFixed(3), r.standRatio.toFixed(3), q.map(x => (x / 1e3).toFixed(1)).join('/'), q.map(x => (ps / x).toFixed(2)).join('/'), (ps / qSurf(B, 30, NgM)).toFixed(2), j.groundLimitForce.toExponential(3), (qSurf(B, 30) * 2 * body.footArea).toExponential(3));
}
// width at which constant 150 kPa matches Vesic 30
console.log('\nB where Vesic30 surface q = 150 kPa:', (150e3 / (0.5 * gam * NgV(30) * 0.6)).toFixed(2), 'm -> H =', (2 * (150e3 / (0.5 * gam * NgV(30) * 0.6)) / Math.sqrt(0.045)).toFixed(1), 'm');
// embedment gain rate gamma*Nq*sq (sq = 1+tan phi for square, Vesic)
console.log('depth gain gamma Nq sq at 30deg (kPa per m)', (gam * Nq(30) * (1 + Math.tan(30 * deg)) / 1e3).toFixed(0));
// equilibrium sink depth at 2 m and Kaiju (phi 30, dq=1+2tan(1-sin)^2 D/B)
for (const H of [2, 50]) {
  const body = P.makeBody({ H, m: 180 * (H / 2) ** 3 });
  const B = Math.sqrt(body.footArea), ps = body.m * g / (2 * body.footArea);
  for (const load of [0, 1]) {
    const p = ps * (1 + load * 0); // just standing
    let lo = 0, hi = 10 * B;
    const f = (Dd) => qSurf(B, 30) + gam * Dd * Nq(30) * (1 + Math.tan(30 * deg));
    for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (f(mid) < p) lo = mid; else hi = mid; }
    if (load === 0) console.log('H', H, 'standing equilibrium embed (phi30) m', lo.toFixed(4), 'frac of B', (lo / B).toFixed(3));
  }
}
// Kaiju lift-tab sentence
const kb = P.makeBody({ H: 50, m: 180 * 25 ** 3 });
const kr = P.lift({ F: 511 * g, mode: 'comic', body: kb, surface: sand, groundHolds: false }, D.objects.find(o => o.id === 'car'));
console.log('\nKaiju sand lift standRatio', kr.standRatio.toFixed(3), '-> UI: "already sinks just standing ... ' + kr.standRatio.toFixed(1) + 'x what the ground can carry"');
// anchor capacity at 2 m, sand, throw a car at 45 deg
const b2 = P.makeBody({});
const anc = P.anchorCapacity({ body: b2, surface: sand, theta: 45 * deg, anchor: 'friction', groundHolds: false, extraMass: 1360 });
console.log('2 m sand car 45deg anchor', anc);
const ancV = { ...sand, qult: qSurf(Math.sqrt(b2.footArea), 30) };
console.log('same with Vesic30 surface q', P.anchorCapacity({ body: b2, surface: ancV, theta: 45 * deg, anchor: 'friction', groundHolds: false, extraMass: 0 }));
