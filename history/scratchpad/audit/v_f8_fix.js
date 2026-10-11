// Proposed closed forms vs engine's own fly(Cd=0)
const P = require('/home/user/dino-strength-sim/src/engine.js'); const K = P.K;
const vacApex = (v) => { const x = v * v * K.R_E / (2 * K.GM); return x >= 1 ? Infinity : K.R_E * x / (1 - x); };
const vacRange = (v, deg) => { const t = deg * Math.PI / 180, nu = v * v * K.R_E / K.GM; if (nu >= 2) return Infinity;
  const half = Math.atan2(nu * Math.sin(t) * Math.cos(t), 1 - nu * Math.cos(t) ** 2); return 2 * K.R_E * half; };
for (const v of [500, 3000, 6132, 9000, 10904, 11180, 11200]) { const f = P.fly({ v0: v, thetaDeg: 90, h0: 0, m: 1, A: 1, Cd: 0 }); console.log('apex v', v, (vacApex(v) / 1e3).toFixed(1), f.escaped ? 'ESC' : (f.apex / 1e3).toFixed(1)); }
for (const [v, d] of [[600, 30], [5423, 45], [6152, 30], [7000, 45], [8500, 20], [5746, 80], [10000, 45], [11500, 45]]) { const f = P.fly({ v0: v, thetaDeg: d, h0: 0, m: 1, A: 1, Cd: 0 }); console.log('range v', v, d, (vacRange(v, d) / 1e3).toFixed(1), f.escaped ? 'ESC' : (f.range / 1e3).toFixed(1), 'flat v^2/g', (v * v / K.g / 1e3).toFixed(0), 'flat v^2 sin2t/g', (v * v * Math.sin(2 * d * Math.PI / 180) / K.g / 1e3).toFixed(0)); }
