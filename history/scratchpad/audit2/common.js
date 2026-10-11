global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const tier = (id) => D.tiers.find((t) => t.id === id);
function ctx(o) {
  o = o || {};
  const H = o.H || 2;
  const body = P.makeBody({ H, m: o.m || 180 * Math.pow(H / 2, 3) });
  return { F: o.inf ? Infinity : (o.kg != null ? o.kg * g : 511 * g), mode: o.mode || 'comic', body, surface: surf(o.surface || 'concrete'), groundHolds: !!o.groundHolds, anchor: o.anchor || 'friction', record: o.record };
}
module.exports = { P, D, g, surf, obj, tier, ctx };
