global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({ H: 2, m: 180 });
const surface = D.surfaces.find(s => s.id === 'concrete');
for (const kg of [511, 1e4, 1e6, 1e9, 1e15, 1e30]) {
  const j = P.jump({ F: kg * 9.80665, mode: 'real', body, surface, groundHolds: false, anchor: 'friction' });
  console.log(kg, 'real apex', j.flight.apex.toFixed(2));
}
const j = P.jump({ F: Infinity, mode: 'real', body, surface, groundHolds: false, anchor: 'friction' });
console.log('inf', j.flight && j.flight.apex);
