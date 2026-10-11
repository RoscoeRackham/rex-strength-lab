global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
const masses = new Map(D.objects.map(o => [o.m, o.id]));
for (const t of D.tiers) { if (!isFinite(t.liftKg)) continue; const back = 10 ** Math.log10(t.liftKg); console.log('tier', t.label || t.chip, t.liftKg, back < t.liftKg ? 'SHORT' : 'ok', masses.has(t.liftKg) ? 'matches obj ' + masses.get(t.liftKg) : ''); }
// all objects: if strength set exactly to obj mass via log10 (as a user might via feats/tiers) do they pass?
for (const o of D.objects) { const back = 10 ** Math.log10(o.m); if (back < o.m) console.log('obj would fail at exact log', o.id, o.m, back); }
// engine repro
const body = P.makeBody({ H: 2, m: 180 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const sky = D.objects.find(o => o.id === 'sky');
const c = { F: Math.pow(10, Math.log10(5.1e18)) * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' };
const r = P.lift(c, sky);
console.log('engine canLift', r.canLift, 'margin', r.strengthMargin, '1/m', 1 / r.strengthMargin);
// slider near-threshold: bar511 at 2.70
const bar = D.objects.find(o => o.id === 'bar511');
const r2 = P.lift(Object.assign({}, c, { F: 10 ** 2.70 * g }), bar);
console.log('bar511 @2.70', r2.canLift, 1 / r2.strengthMargin, r2.strengthMargin);
// tolerance fix check
const W = sky.m * g; console.log('with tol', c.F >= W * (1 - 1e-9));
