global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
const S = (id) => D.surfaces.find((s) => s.id === id);
for (const [kg, s] of [[90718.474,'concrete'],[90718.474,'sand'],[1e34,'granite'],[90718.474,'granite']]) {
  const r = P.jump({ F: kg*g, mode: 'real', body, surface: S(s), groundHolds: false, anchor: 'braced' });
  console.log(kg, s, 'groundFails', r.groundFails, 'sink', r.sink, 'heldBack', r.heldBack, 'F', actionF = kg*g*0.0 );
}
