global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = global.window.DINO_DATA;
const K = P.K, g = K.g;
const objById = (id) => D.objects.find((o) => o.id === id);
const ctx = (L, mode) => ({ F: Math.pow(10, L) * g, mode, body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find((s) => s.id === 'concrete'), groundHolds: false, anchor: 'friction' });
// Kepler range for v, flight-path angle gam, from r0 back to R (approx r0=R+h0; use r0 for both ends for simplicity)
function kepler(v, gamDeg, r0) {
  const gam = gamDeg * Math.PI / 180, nu = v * v * r0 / K.GM;
  if (nu >= 2) return 'escape';
  const psi = 2 * Math.atan2(nu * Math.sin(gam) * Math.cos(gam), 1 - nu * Math.cos(gam) ** 2);
  return K.R_E * psi;
}
console.log('K.g', g, 'R_E', K.R_E, 'GM', K.GM, 'GM/R^2', K.GM / K.R_E ** 2, 'v_esc', Math.sqrt(2 * K.GM / K.R_E));
for (const v of [3000, 8000, 10000]) {
  const vac = P.fly({ v0: v, thetaDeg: 45, h0: 0, m: 1360, A: 4, Cd: 0 });
  console.log('v', v, 'fly Cd=0 range km', (vac.range / 1e3).toFixed(3), 'Kepler km', (kepler(v, 45, K.R_E) / 1e3).toFixed(3), 'v^2/g km', (v * v / g / 1e3).toFixed(1));
}
// sweep angle threshold where sentence appears, baseball 511 real
for (const mode of ['real', 'comic']) {
  const on = [];
  for (let a = 0; a <= 90; a++) { const r = P.throwObject(ctx(Math.log10(511), mode), objById('baseball'), a); const f = r.flight; if (r.canMove && !f.relativistic && f.range < 0.2 * r.v * r.v / g) on.push(a); }
  console.log(mode, 'baseball 511 angles where "Without air" sentence shows:', on.join(','));
}
// default state: car, 45, comic, 511
{ const r = P.throwObject(ctx(Math.log10(511), 'comic'), objById('car'), 45); console.log('DEFAULT car 45 comic 511: canMove', r.canMove, 'v', r.v, 'range', r.flight.range); }
// escaped drag flight: does the sentence appear alongside "leaves Earth for good"?
for (const obj of ['baseball', 'shot', 'car', 'moon']) for (const L of [8, 10, 12, 14, 16, 18, 20, 22, 26]) {
  const r = P.throwObject(ctx(L, 'comic'), objById(obj), 45); const f = r.flight;
  if (r.canMove && !f.relativistic && f.escaped) { console.log('ESCAPED drag flight', obj, 'logKg', L, 'v', r.v.toExponential(3), 'f.range km', (f.range / 1e3).toFixed(0), 'sentence shown', f.range < 0.2 * r.v * r.v / g, 'claim', Math.min(r.v * r.v / g, 2e7) / 1e3, 'km'); }
}
// shot put at 45: "Air is the real limit" shown with tiny air loss
{ const c = ctx(Math.log10(511), 'real'); const r = P.throwObject(c, objById('shot'), 37); const vac = P.fly({ v0: r.v, thetaDeg: 37, h0: c.body.releaseHeight, m: 7.26, A: 0.0113, Cd: 0 });
  console.log('shot 37 real 511: drag', r.flight.range.toFixed(2), 'vac', vac.range.toFixed(2), 'air loss %', ((1 - r.flight.range / vac.range) * 100).toFixed(2), '-> UI still says "Air is the real limit on range"'); }
