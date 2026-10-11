// Constant-Cd vs Mach-dependent sphere drag (subcritical sphere 0.47 -> supersonic ~0.92-1.0; representative curve, cf. Hoerner 1965, Bailey & Hiatt 1972)
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K;
const tbl = [[0, 0.47], [0.6, 0.50], [0.8, 0.60], [1.0, 0.85], [1.2, 0.98], [1.5, 1.00], [2.0, 0.98], [3.0, 0.95], [5.0, 0.92], [100, 0.92]];
const cdM = (M) => { for (let i = 1; i < tbl.length; i++) if (M <= tbl[i][0]) { const [m0, c0] = tbl[i - 1], [m1, c1] = tbl[i]; return c0 + (c1 - c0) * (M - m0) / (m1 - m0); } return 0.92; };
// simple RK4 flat-earth uniform-ish (exp atm) integrator with Cd(M) scaled by ratio to subsonic value
function flyCd(v0, thDeg, h0, m, A, cd0, scale) {
  let x = 0, y = h0, vx = v0 * Math.cos(thDeg * Math.PI / 180), vy = v0 * Math.sin(thDeg * Math.PI / 180), t = 0;
  const g = K.GM / K.R_E ** 2;
  const acc = (x, y, vx, vy) => { const v = Math.hypot(vx, vy); const rho = K.rho0 * Math.exp(-Math.max(0, y) / K.Hs); const cd = scale ? cd0 * cdM(v / K.a0) / 0.47 : cd0; const k = 0.5 * rho * cd * A / m * v; return [-k * vx, -g - k * vy]; };
  while (true) {
    const v = Math.hypot(vx, vy); const dt = Math.min(1e-3, 1e-4 * 1000 / Math.max(v, 1));
    const s = [x, y, vx, vy];
    const f = (s) => { const a = acc(...s); return [s[2], s[3], a[0], a[1]]; };
    const k1 = f(s), k2 = f(s.map((v_, i) => v_ + 0.5 * dt * k1[i])), k3 = f(s.map((v_, i) => v_ + 0.5 * dt * k2[i])), k4 = f(s.map((v_, i) => v_ + dt * k3[i]));
    const n = s.map((v_, i) => v_ + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    if (n[1] < 0) { const fr = y / (y - n[1]); return { range: x + (n[0] - x) * fr }; }
    [x, y, vx, vy] = n; t += dt;
  }
}
for (const [name, m, A, cd0] of [['shot', 7.26, 0.0113, 0.47], ['baseball', 0.145, 0.00434, 0.35]]) {
  for (const v0 of [300, 600, 1000, 3000]) {
    const a = flyCd(v0, 45, 1.8, m, A, cd0, false).range, b = flyCd(v0, 45, 1.8, m, A, cd0, true).range;
    const e = P.fly({ v0, thetaDeg: 45, h0: 1.8, m, A, Cd: cd0 });
    console.log(`${name} v0=${v0} 45deg: engine range ${e.range.toFixed(0)} m (my const-Cd ${a.toFixed(0)}) | with Cd(Mach) ${b.toFixed(0)} m | engine/Mach-aware = ${(a / b).toFixed(2)}x ; e-fold claim ${(2 * m / (K.rho0 * cd0 * A)).toFixed(0)} m vs supersonic ${(2 * m / (K.rho0 * cd0 * cdM(2) / 0.47 * A)).toFixed(0)} m`);
  }
}
