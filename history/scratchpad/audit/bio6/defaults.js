global.window = {};
const A = require('/home/user/dino-strength-sim/src/engine.js');
const B = require('./engine_bio6.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = A.K.g;
const surf = D.surfaces.find(s => s.id === 'concrete');
// UI defaults: concrete, groundHolds false, anchor friction
function ctx(F, mode, H) { const m = 180 * (H/2)**3; return { F, mode, body: A.makeBody({ H, m }), surface: surf, groundHolds: false, anchor: 'friction' }; }
for (const mode of ['real','comic']) for (const kg of [511, 1e4, 1e6, Infinity]) for (const H of [0.4, 50]) {
  const c = ctx(isFinite(kg) ? kg*g : Infinity, mode, H);
  const a = A.sprint(c), b = B.sprint(c);
  if (Math.abs(a.vTop/b.vTop - 1) > 0.01) console.log(`DEFAULT ground ${mode} ${kg} kg H ${H}: sprint orig ${a.vTop.toFixed(1)} (${a.topLimit}, M${a.mach.toFixed(2)}) -> same-law ${b.vTop.toFixed(1)} (${b.topLimit}, M${b.mach.toFixed(2)})`);
}
