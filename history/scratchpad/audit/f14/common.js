global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s]));
const T = Object.fromEntries(D.tiers.map(t => [t.id, t]));
function ctx(liftKg, o) { o = o || {}; const body = P.makeBody({ H: o.H || 2 }); return { F: isFinite(liftKg) ? liftKg * g : Infinity, mode: o.mode || 'comic', body, surface: S[o.surface || 'concrete'], groundHolds: !!o.groundHolds, anchor: o.anchor || 'friction' }; }
module.exports = { P, D, g, S, T, ctx };
