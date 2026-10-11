global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({});
for (const sid of D.surfaces.map(s=>s.id)) {
  const surface = D.surfaces.find(s => s.id === sid);
  let hit = null;
  for (let lg = 20; lg <= 34; lg += 0.05) { const r = P.stomp({ F: Math.pow(10, lg) * P.K.g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' }); if (r.crater > 0.2 * P.K.R_E) { hit = lg.toFixed(2); break; } }
  console.log(sid, 'crater > 0.2 R_E from 10^' + hit);
}
