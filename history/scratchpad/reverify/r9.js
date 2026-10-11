global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
for (const sid of ['granite','concrete','sand']) {
const surf = D.surfaces.find(s=>s.id===sid);
for (const H of [500, 2, 3.048, 50]) {
  const b0 = P.makeBody({H, m: 1});
  const thr = P.W8.SIGMA_ROCK * b0.topArea / P.premG(P.K.R_E) + P.premRho(P.K.R_E - 1) * b0.volume;
  for (const f of [0.999, 0.9999, 1.00001, 1.0001, 1.0005, 1.001, 1.003, 1.01, 1.1]) {
    const b = P.makeBody({H, m: thr * f});
    const w = P.weight({F: 1e5*g, body: b, surface: surf, groundHolds: false});
    const st = w.fall && w.fall.stuck;
    console.log(sid, H, f, w.ground.regime, st ? ('stuck depth ' + (st.depth/1e3).toFixed(3) + ' km t ' + st.t.toFixed(0) + ' s ' + st.layer) : (w.fall ? ('firstPass ' + !!w.fall.firstPass) : '-'));
  }
}
}
