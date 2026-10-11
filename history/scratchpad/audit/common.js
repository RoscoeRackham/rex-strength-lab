global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s]));
const O = Object.fromEntries(D.objects.map(o => [o.id, o]));
const T = Object.fromEntries(D.tiers.map(t => [t.id, t]));
function ctx(liftKg, opts) { opts = opts || {}; const body = P.makeBody({ H: opts.H || 2, m: opts.m }); return { F: isFinite(liftKg) ? liftKg * g : Infinity, mode: opts.mode || 'comic', body, surface: S[opts.surface || 'concrete'], groundHolds: !!opts.groundHolds, anchor: opts.anchor || 'friction' }; }
module.exports = { P, D, g, S, O, T, ctx };
