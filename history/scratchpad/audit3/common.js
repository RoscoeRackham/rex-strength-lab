global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const S = (id) => D.surfaces.find((s) => s.id === id);
const O = (id) => D.objects.find((o) => o.id === id);
const T = (id) => D.tiers.find((t) => t.id === id);
function ctx(o) {
  o = o || {};
  const body = P.makeBody({ H: o.H || 2, m: o.m });
  const F = o.inf ? Infinity : Math.pow(10, o.lg == null ? Math.log10(100 * 907.18474) : o.lg) * g;
  return { F, mode: o.mode || 'comic', body, surface: S(o.surface || 'concrete'), groundHolds: !!o.holds, anchor: o.anchor || 'friction' };
}
module.exports = { P, D, g, S, O, T, ctx };
