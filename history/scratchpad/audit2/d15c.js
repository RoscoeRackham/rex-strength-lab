global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
const body = P.makeBody({ H: 2, m: 180 });
const surface = D.surfaces.find(s => s.id === 'concrete') || D.surfaces[0];
const shot = D.objects.find(o => o.id === 'shot');
for (const kg of [362.873896, 511]) {
  for (const mode of ['comic', 'real']) {
    const c = { F: kg * g, mode, body, surface, groundHolds: false, anchor: 'stand' };
    const r = P.throwObject(c, shot, 37);
    console.log(kg, mode, 'v', r.v.toFixed(2), 'range', (r.flight && (r.flight.range || r.flight.x || r.flight.dist)));
  }
}
console.log(Object.keys(P.throwObject({ F: 511*g, mode:'comic', body, surface, groundHolds:false, anchor:'stand'}, shot, 37).flight||{}));
