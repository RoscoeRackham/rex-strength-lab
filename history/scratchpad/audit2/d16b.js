global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
for (const H of [0.1, 0.5, 2, 10, 50, 100, 200, 500]) for (const gh of [false, true]) {
  const body = P.makeBody({ H, m: 180*Math.pow(H/2,3) });
  const base = { mode:'real', body, surface: D.surfaces.find(s=>s.id==='concrete'), groundHolds: gh, anchor:'friction' };
  const kg = P.threshold((F) => { const j = P.jump(Object.assign({}, base, { F })); return j.v > 0 && (j.flight.apex >= 60 || j.flight.escaped || j.flight.relativistic); }, 10 * g, 1e45) / g;
  const j = P.jump(Object.assign({}, base, {F:1e45}));
  console.log('H',H, gh?'holds':'-', 'kg', kg, 'apex', j.flight.apex, 'v', j.v);
}
