const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({});
const surf = (id) => D.surfaces.find(s => s.id === id);
const ctx = (kg, sid, mode='real') => ({ F: kg * g, mode, body, surface: surf(sid), groundHolds: false, anchor: 'friction' });
for (const sid of ['sand','concrete','granite']) {
  for (const kg of [1e3, 1e4, 1e5, 1e6, 3e6, 1e7, 1e8, 1e10, 150e9*907.18474, 200e18*907.18474, Infinity]) {
    const j = P.jump(ctx(kg, sid));
    console.log(sid.padEnd(9), kg.toExponential(2).padStart(10), 'sat', String(j.push.saturated).padEnd(5), 'v', j.v.toFixed(3).padStart(8), 'apex', j.flight.apex.toFixed(3).padStart(9), 'groundFails', j.groundFails, 'xB', j.push.xB.toFixed(3), 'RB', j.groundLimitForce.toExponential(2));
  }
}
