const P = require('/home/user/dino-strength-sim/src/engine.js');
if (!global.window) global.window = {}; require("/home/user/dino-strength-sim/src/data.js"); const D = window.DINO_DATA;
const g = P.K.g; const body = P.makeBody({});
const surface = D.surfaces.find(s => s.id === 'concrete');
for (let lg = 6; lg <= 12; lg += 0.25) {
  const kg = 10 ** lg;
  const j = P.jump({ F: kg * g, mode: 'real', body, surface, groundHolds: false, anchor: 'friction' });
  console.log(lg.toFixed(2), 'sat', j.push.saturated, 'stalled', j.push.stalled, 'v', j.v.toFixed(3), 't', j.push.t.toExponential(2));
}
