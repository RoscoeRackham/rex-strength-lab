global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
function ctx(o) {
  o = o || {};
  const H = o.H || 2;
  const body = P.makeBody({ H, m: o.m || 180 * Math.pow(H / 2, 3) });
  const surface = D.surfaces.find((s) => s.id === (o.surface || 'concrete'));
  return { F: o.inf ? Infinity : Math.pow(10, o.logKg == null ? Math.log10(100 * 907.18474) : o.logKg) * g, mode: o.mode || 'comic', body, surface, groundHolds: !!o.groundHolds, anchor: o.anchor || 'friction' };
}
const obj = (id) => D.objects.find((x) => x.id === id);
module.exports = { P, D, g, ctx, obj };
