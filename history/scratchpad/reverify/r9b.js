global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const surf = D.surfaces.find(s=>s.id==='concrete');
const H = 500;
const b0 = P.makeBody({H, m: 1, build: 'rex'});
const b1 = P.makeBody({H, m: 1});
console.log('build default', b1.build, b1.volume, b0.volume);
const thr = P.W8.SIGMA_ROCK * b0.topArea / P.premG(P.K.R_E) + P.premRho(P.K.R_E - 1) * b0.volume;
for (const f of [1.000001, 1.000005, 1.00001, 1.00002, 1.000037, 1.00005, 1.0001, 1.0002, 1.0003, 1.0005, 1.001]) {
  const b = P.makeBody({H, m: thr * f, build: 'rex'});
  const w = P.weight({F: 1e5*g, body: b, surface: surf, groundHolds: false});
  const st = w.fall && w.fall.stuck;
  console.log(f, (thr*f).toExponential(5), w.ground.regime, st ? ((st.depth/1e3).toFixed(2) + ' km deep, ' + st.layer + ', t ' + st.t.toFixed(0)) : (w.fall ? 'firstPass ' + !!w.fall.firstPass : '-'), w.stuckRange ? JSON.stringify([w.stuckRange.rMin/1e3, w.stuckRange.rMax/1e3].map(x=>+x.toFixed(1))) : '');
}
