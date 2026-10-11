global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = 9.80665;
function ctx(o) {
  o = o || {};
  const body = P.makeBody({ H: o.H || 3.048, m: o.m || 0, build: o.build || 'rex' });
  const surface = D.surfaces.find((s) => s.id === (o.surface || 'concrete'));
  return { F: o.inf ? Infinity : Math.pow(10, o.logKg != null ? o.logKg : Math.log10(100 * 907.18474)) * g, mode: o.mode || 'comic', body, surface, groundHolds: !!o.groundHolds, anchor: o.anchor || 'friction' };
}
function ctxO(o) { o = o || {}; const c = ctx(o); c.body = P.makeBody({ H: o.oH || 3.048, m: o.oM || 0, build: 'ollie' }); c.anchor = o.oAnchor || 'friction'; if (o.oLogKg != null) c.F = Math.pow(10, o.oLogKg) * g; return c; }
const obj = (id) => D.objects.find((x) => x.id === id);
module.exports = { P, D, g, ctx, ctxO, obj };
