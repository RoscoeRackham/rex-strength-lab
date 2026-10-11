global.window = {};
const A = require('/home/user/dino-strength-sim/src/engine.js');
const B = require('./engine_bio6.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = A.K.g;
const surf = D.surfaces.find(s => s.id === 'concrete');
function ctx(F, mode, H, gh) { const m = 180 * (H/2)**3; return { F, mode, body: A.makeBody({ H, m }), surface: surf, groundHolds: gh, anchor: 'friction' }; }
for (const mode of ['real','comic']) for (const kg of [511, 5e4, Infinity]) for (const H of [0.4, 2, 50]) {
  const c = ctx(isFinite(kg) ? kg*g : Infinity, mode, H, true);
  const a = A.sprint(c), b = B.sprint(c), j = A.jump(c);
  console.log(`${mode} ${kg} kg H ${H}: jump ${j.v.toFixed(1)} | sprint orig ${a.vTop.toFixed(1)} (${a.topLimit}) -> patched ${b.vTop.toFixed(1)} (${b.topLimit}), jump/sprint ${(j.v/a.vTop).toFixed(2)} -> ${(j.v/b.vTop).toFixed(2)}`);
}
