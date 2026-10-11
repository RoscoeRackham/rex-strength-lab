const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const K = P.K, g = K.g;
const body = P.makeBody({ H: 2, m: 180 });
function vacRound(v, h0 = 0) {
  const r0 = K.R_E + h0;
  const den = 1 / r0 - v * v / (2 * K.GM);
  return den > 0 ? 1 / den - r0 : Infinity;
}
const vesc = Math.sqrt(2 * K.GM / K.R_E);
console.log('v_esc', vesc.toFixed(1));
for (const surfId of ['concrete', 'granite']) for (const gh of [false, true]) for (const lk of [6, 8, 9, 10, 10.5, 10.9, 10.97, 11.0, 11.06, 11.07, 11.1, 11.3, 12]) {
  const surface = D.surfaces.find(s => s.id === surfId);
  const c = { F: Math.pow(10, lk) * g, mode: 'comic', body, surface, groundHolds: gh, anchor: 'friction' };
  const r = P.jump(c);
  const f = r.flight;
  const vr = vacRound(r.v);
  console.log(surfId, 'holds', gh, 'logKg', lk, 'v', r.v.toFixed(1), 'groundFails', r.groundFails, 'stalled', r.push.stalled,
    '| flight apex km', (f.apex/1000).toFixed(1), 'escaped', f.escaped, 'rel', f.relativistic,
    '| engine vacApex km', (r.vacuumApex/1000).toFixed(1), 'round vac km', (vr/1000).toFixed(1), 'ratio', (vr / r.vacuumApex).toFixed(3),
    'shown?', (!f.relativistic && !f.escaped && f.apex > 50));
}
