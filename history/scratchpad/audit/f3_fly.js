const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K;
const vac = (v) => { const d = 1 / K.R_E - v * v / (2 * K.GM); return d > 0 ? 1 / d - K.R_E : Infinity; };
for (const v of [1000, 3000, 7000, 10087.8, 11000, 11300, 19390.9]) {
  const f = P.fly({ v0: v, thetaDeg: 90, h0: 0, m: 180, A: 1, Cd: 0 });
  const flat = v * v / (2 * K.g);
  console.log('v', v, 'fly(Cd=0) apex km', (f.apex / 1e3).toFixed(3), 'escaped', f.escaped, '| round formula km', (vac(v) / 1e3).toFixed(3), '| flat v2/2g km', (flat / 1e3).toFixed(3), 'ratio round/flat', (vac(v) / flat).toFixed(3));
}
console.log('g vs GM/R^2', K.g, K.GM / K.R_E ** 2, (K.g / (K.GM / K.R_E ** 2) - 1) * 100, '%');
