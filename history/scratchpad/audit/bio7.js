global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
for (const sid of ['concrete','asphalt','sand','clay','granite']) {
  const surface = D.surfaces.find(s => s.id === sid);
  console.log('=== surface', sid, 'RB', 2*body.footArea*surface.qult);
  for (const mode of ['real','comic']) {
    for (const kg of [1e3, 1e4, 9.2e4, 1e5, 2e5, 1e6, 1e7, 1e9, 1e12, 1e20]) {
      const c = { F: kg*g, mode, body, surface, groundHolds: false, anchor: 'friction' };
      const r = P.jump(c);
      const rh = P.jump(Object.assign({}, c, { groundHolds: true }));
      console.log(mode.padEnd(5), 'kg', kg.toExponential(1), 'groundFails', r.groundFails, 'v', r.v.toPrecision(6), 'vHold', rh.v.toPrecision(6), 'ratio', (r.v/rh.v).toPrecision(5), 'sink', r.sink.toPrecision(3), 'xB/d', (r.push.xB/body.strokes.leg).toPrecision(3), 'sat', r.push.saturated, 'apex', r.flight.apex.toPrecision(4), 'apexHold', rh.flight.apex.toPrecision(4));
    }
  }
}
