global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
const body = P.makeBody({ H: 2, m: 180 });
for (const mode of ['comic','real']) for (const s of D.surfaces) for (const gh of [false,true]) for (const anchor of ['friction','braced','bolted']) {
  const base = { mode, body, surface: s, groundHolds: gh, anchor };
  const kg = P.threshold((F) => { const j = P.jump(Object.assign({}, base, { F })); return j.v > 0 && (j.flight.apex >= 60 || j.flight.escaped || j.flight.relativistic); }, 10 * g, 1e45) / g;
  const jmax = P.jump(Object.assign({}, base, {F:1e45}));
  console.log(mode, s.id, gh?'holds':'-', anchor, 'kg=', kg, 'apex@1e45N=', jmax.flight && jmax.flight.apex, 'v=', jmax.v);
}
