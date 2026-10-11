const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
const body = P.makeBody({ H: 2, m: 180 });
const concrete = { qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 };
const anc = P.anchorCapacity({ body, surface: concrete, theta: 0, anchor: 'friction' });
const mB = body.handEff, mA = body.m - mB, d = body.strokes.punch, vmax = 17, ff = 0.3;
const dt = (d / vmax) / 4000;
// explicit-midpoint overshoot onset: 0.5*dt*(F0-RB)/mB + 0.5*dt*(F0-RA)/mA >= vmax  (u = (vA+vB)/vmax at first midpoint)
const F0crit = (vmax / (0.5 * dt) + anc.R / mA) / (1 / mB + 1 / mA);
console.log('RA (friction anchor) =', anc.R.toFixed(1), 'N; dt =', dt.toExponential(3));
console.log('predicted onset F0 =', F0crit.toExponential(4), 'N => lift kg =', (F0crit / ff / g).toExponential(4));
const inertial = Math.max(mA, mB) * vmax * vmax / d + anc.R;
console.log('saturated-branch threshold => lift kg =', (1e6 * inertial / ff / g).toExponential(4));
// scan edges numerically
const vf = (kg) => P.punch({ F: kg * g, mode: 'real', body, surface: concrete, groundHolds: false, anchor: 'friction' }).vFist;
let lo = 1e6, hi = 1e7; for (let i = 0; i < 80; i++) { const m = Math.sqrt(lo * hi); if (vf(m) > 0) lo = m; else hi = m; }
console.log('engine zero-window start (punch) =', hi.toExponential(4));
lo = 1e9; hi = 1e11; for (let i = 0; i < 80; i++) { const m = Math.sqrt(lo * hi); if (vf(m) > 0) hi = m; else lo = m; }
console.log('engine zero-window end (punch)   =', hi.toExponential(4));
// trace first steps at 1e8 kg
const F0 = 1e8 * g * ff;
const r = P.pushApart({ F: F0, d, mA, mB, RA: anc.R, RB: 0, mode: 'real', vmax });
console.log('1e8 kg pushApart:', JSON.stringify(r));
console.log('first midpoint u =', ((0.5 * dt * (F0 - anc.R) / mA + 0.5 * dt * F0 / mB) / vmax).toFixed(2));
// Also: just below onset, is the explicit scheme accurate?
for (const kg of [1e6, 3e6, 4.3e6]) console.log(kg.toExponential(2), 'kg -> vFist', vf(kg).toFixed(4));
