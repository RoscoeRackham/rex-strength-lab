// Reference integrator: same physics model as engine fly(), independent code.
// Adaptive Dormand-Prince 5(4) with tight tolerances, event location by bisection on dense steps.
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K;
function refFly(o) {
  const { v0, m, A, Cd } = o;
  const th = (o.thetaDeg == null ? 45 : o.thetaDeg) * Math.PI / 180;
  const h0 = o.h0 || 0, R = K.R_E;
  const beta = Cd * A / (2 * m);
  const rhoMode = o.rho || 'exp';
  const f = (s) => {
    const [x, y, vx, vy] = s;
    const r2 = x * x + y * y, r = Math.sqrt(r2);
    const h = r - R;
    const rho = rhoMode === 'uniform' ? K.rho0 : (h <= 0 ? K.rho0 : K.rho0 * Math.exp(-h / K.Hs));
    const v = Math.hypot(vx, vy);
    const gk = o.flat ? 0 : -K.GM / (r2 * r);
    const dk = -beta * rho * v;
    if (o.flat) return [vx, vy, dk * vx, -o.flat + dk * vy];
    return [vx, vy, gk * x + dk * vx, gk * y + dk * vy];
  };
  // DP45 tableau
  const a = [[], [1/5], [3/40, 9/40], [44/45, -56/15, 32/9], [19372/6561, -25360/2187, 64448/6561, -212/729],
    [9017/3168, -355/33, 46732/5247, 49/176, -5103/18656], [35/384, 0, 500/1113, 125/192, -2187/6784, 11/84]];
  const b5 = [35/384, 0, 500/1113, 125/192, -2187/6784, 11/84, 0];
  const b4 = [5179/57600, 0, 7571/16695, 393/640, -92097/339200, 187/2100, 1/40];
  const c = [0, 1/5, 3/10, 4/5, 8/9, 1, 1];
  const step = (s, dt) => {
    const k = [];
    for (let i = 0; i < 7; i++) {
      const si = s.slice();
      for (let j = 0; j < i; j++) for (let q = 0; q < 4; q++) si[q] += dt * a[i][j] * k[j][q];
      k.push(f(si));
    }
    const y5 = s.slice(), y4 = s.slice();
    for (let i = 0; i < 7; i++) for (let q = 0; q < 4; q++) { y5[q] += dt * b5[i] * k[i][q]; y4[q] += dt * b4[i] * k[i][q]; }
    return [y5, y4];
  };
  let s = o.flat ? [0, h0, v0 * Math.cos(th), v0 * Math.sin(th)] : [0, R + h0, v0 * Math.cos(th), v0 * Math.sin(th)];
  const height = (s_) => o.flat ? s_[1] : Math.hypot(s_[0], s_[1]) - R;
  const angOf = (s_) => o.flat ? s_[0] / R : Math.atan2(s_[0], s_[1]);
  let t = 0, dt = 1e-4, apex = h0, ang = 0, prevA = 0;
  const rtol = o.rtol || 1e-11, tMax = o.tMax || 1e9;
  let steps = 0;
  while (t < tMax && steps < 5e7) {
    const [y5, y4] = step(s, dt);
    let err = 0;
    for (let q = 0; q < 4; q++) {
      const sc = 1e-9 + rtol * Math.max(Math.abs(s[q]), Math.abs(y5[q]));
      err = Math.max(err, Math.abs(y5[q] - y4[q]) / sc);
    }
    if (err > 1) { dt *= Math.max(0.1, 0.9 * Math.pow(err, -0.2)); continue; }
    steps++;
    const hN = height(y5);
    if (hN < 0) {
      // locate ground crossing by bisection on dt
      let lo = 0, hi = dt;
      for (let i = 0; i < 80; i++) { const mid = 0.5 * (lo + hi); const [ym] = step(s, mid); if (height(ym) < 0) hi = mid; else lo = mid; }
      const [yi] = step(s, hi);
      t += hi;
      let dA = angOf(yi) - angOf(s); if (dA > Math.PI) dA -= 2 * Math.PI; if (dA < -Math.PI) dA += 2 * Math.PI; ang += dA;
      const ir = o.flat ? null : Math.hypot(yi[0], yi[1]);
      const vImp = Math.hypot(yi[2], yi[3]);
      const vr = o.flat ? yi[3] : (yi[0] * yi[2] + yi[1] * yi[3]) / ir;
      return { range: o.flat ? yi[0] : R * Math.abs(ang), apex, time: t, vImpact: vImp, impactAngleDeg: Math.asin(Math.min(1, Math.abs(vr) / vImp)) * 180 / Math.PI, steps };
    }
    let dA = angOf(y5) - angOf(s); if (dA > Math.PI) dA -= 2 * Math.PI; if (dA < -Math.PI) dA += 2 * Math.PI; ang += dA;
    s = y5; t += dt;
    if (hN > apex) apex = hN;
    if (!o.flat) { const r = Math.hypot(s[0], s[1]); const v = Math.hypot(s[2], s[3]); if (r > 30 * R && 0.5 * v * v - K.GM / r > 0) return { escaped: true, apex, time: t, steps }; }
    dt *= Math.min(5, 0.9 * Math.pow(Math.max(err, 1e-10), -0.2));
  }
  return { timedOut: true, range: R * Math.abs(ang), apex, time: t, steps };
}
module.exports = { refFly };
