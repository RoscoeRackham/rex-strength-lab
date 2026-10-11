global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
const s = D.surfaces.find(x => x.id === 'concrete');
for (const lg of [4.2, 4.45, 5.7, 5.95, 6.2, 7.2, 7.45, 7.7, 8.95]) {
  const c = { F: Math.pow(10, lg) * g, mode: 'real', body, surface: s, groundHolds: false, anchor: 'friction' };
  const r = P.jump(c);
  console.log(lg, 'held', r.heldBack, 'fails', r.groundFails, 'sink', r.sink.toExponential(2), 'F/RB', (r.F / r.groundLimitForce).toFixed(2), 'apex', r.flight.apex.toFixed(4));
}
