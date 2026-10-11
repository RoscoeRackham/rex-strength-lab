global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const surface = D.surfaces.find(s => s.id === 'concrete');
for (const H of [0.5, 1, 2, 5, 10, 30]) {
  const body = P.makeBody({ H, m: 180*Math.pow(H/2,3) });
  const j = P.jump({ F: 1e40, mode: 'real', body, surface, groundHolds: false, anchor: 'friction' });
  console.log('H', H, 'real cap apex', j.flight.apex.toFixed(2));
}
