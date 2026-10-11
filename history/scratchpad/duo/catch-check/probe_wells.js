global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const DD = window.DINO_DATA, K = P.K, g = K.g;
const bb = DD.objects.find((o) => o.id === 'baseball');
const GM = K.G * 4.12e17 * 0.18;
// 1-D straight path between point masses with sea-level drag: d(v^2)/dx = -2 dPhi/dx - (rho cd A/m) v^2
function run(GT, GC, D, x0, x1, vL, stopIfBelow) {
  const phi = (x) => -(GT ? GT / x : 0) - (GC ? GC / (D - x) : 0);
  let x = x0, v2 = vL * vL; const n = 200000, dx = (x1 - x0) / n; let vmin = Infinity, Edrag = 0;
  for (let i = 0; i < n; i++) {
    const xm = x + dx / 2;
    // RK2 on v^2
    const f = (xx, w) => { const v = Math.sqrt(Math.max(w, 0)); const cd = P.cdAt(bb.Cd, bb.CdSup, v / K.a0); return -2 * (phi(xx + 1e-6) - phi(xx - 1e-6)) / 2e-6 - K.rho0 * cd * bb.area / bb.m * Math.max(w, 0); };
    const k1 = f(x, v2), k2 = f(xm, v2 + 0.5 * dx * k1);
    const vv = Math.sqrt(Math.max(v2, 0)), cd = P.cdAt(bb.Cd, bb.CdSup, vv / K.a0);
    Edrag += 0.5 * K.rho0 * cd * bb.area / bb.m * Math.max(v2, 0) * dx;
    v2 += dx * k2; x += dx;
    if (v2 <= 0) return { reached: false, x, Edrag };
    vmin = Math.min(vmin, Math.sqrt(v2));
  }
  return { reached: true, vEnd: Math.sqrt(v2), vmin, Edrag };
}
const x0 = 0.5, D = 10, rHeld = 1 + 0.5 * Math.cbrt(0.1453 / 680), x1 = D - (rHeld + 0.6);
for (const [name, GT, GC, vDesign] of [['T9 NS thrower', GM, 0, 4314.63], ['T10 NS catcher', 0, GM, 10.16], ['T12 both NS', GM, GM, 4108.66]]) {
  const r = run(GT, GC, D, x0, x1, vDesign);
  // least launch speed that reaches with drag
  let lo = 1, hi = 20000;
  for (let i = 0; i < 80; i++) { const mid = 0.5 * (lo + hi); if (run(GT, GC, D, x0, x1, mid).reached) hi = mid; else lo = mid; }
  const best = run(GT, GC, D, x0, x1, hi);
  console.log(name, '| design launch', vDesign, '-> with drag:', r.reached ? 'reaches, arrives ' + r.vEnd.toFixed(1) + ' m/s, drag energy ' + r.Edrag.toExponential(3) + ' J/kg' : 'FALLS BACK at x=' + r.x.toFixed(3) + ' m, drag energy so far ' + r.Edrag.toExponential(3) + ' J/kg', '| least launch with drag', hi.toFixed(1), 'arrives', best.vEnd.toFixed(1), 'm/s');
}
console.log('path length', (x1 - x0).toFixed(3), '0.2 x supersonic e-fold', (0.2 * 2 * bb.m / (K.rho0 * bb.CdSup * bb.area)).toFixed(2));
// ball held in a normal Rex's hand 10 m from NS Ollie: the pull on it
console.log('Pull of NS Ollie on a ball in Rex hand (9.5 m away):', (bb.m * GM / 9.5 ** 2).toFixed(0), 'N; on Rex 4 kg hand+forearm:', (0.022 * 180 * GM / 9.5 ** 2).toFixed(0), 'N');
