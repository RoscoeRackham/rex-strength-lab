global.window = {}; require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('./engine_m2fix.js');
const g = 9.80665; const body = P.makeBody({ H: 2, m: 180 });
for (const mode of ['real', 'comic']) for (const sid of ['sand', 'stiffclay', 'concrete', 'ice', 'steel', 'granite']) for (const L of [511, 9071.8, 90718, 1e6, 1e8, 1e12, 1.36e14, 5.97e24]) {
  const surface = D.surfaces.find(s => s.id === sid);
  const r = P.jump({ F: L * g, mode, body, surface, groundHolds: false });
  console.log(mode, sid, L.toExponential(1), 'fails', r.groundFails, 'held', r.heldBack, 'sink', (r.sink*100).toFixed(2)+'cm', 'footSpeed', r.footSpeed.toPrecision(3), 'legPeak/RB', (r.legPeak / r.groundLimitForce).toPrecision(3), 'Eg', r.Eground.toPrecision(3), 'apex', r.flight.apex.toFixed(2));
}
