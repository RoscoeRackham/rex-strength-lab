const P = require('./engine_patched.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
function ctx(kg, mode, extra) {
  const o = Object.assign({ H: 2, m: 180, surface: 'concrete', groundHolds: false, anchor: 'friction' }, extra || {});
  const body = P.makeBody({ H: o.H, m: o.m });
  const surface = D.surfaces.find((s) => s.id === o.surface);
  return { F: kg === Infinity ? Infinity : kg * g, mode, body, surface, groundHolds: o.groundHolds, anchor: o.anchor };
}
const obj = (id) => D.objects.find((o) => o.id === id);
module.exports = { P, D, g, ctx, obj };
