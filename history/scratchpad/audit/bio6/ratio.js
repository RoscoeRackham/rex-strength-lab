global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
const surf = D.surfaces.find(s => s.id === 'concrete');
function ctx(F, mode, H) { const m = 180 * (H/2)**3; return { F, mode, body: P.makeBody({ H, m }), surface: surf, groundHolds: true, anchor: 'friction' }; }
// Same-leg consistency: jump takeoff cap (vmax_jump * s) vs sprint leg cap, real mode, infinite strength
console.log('H     s     jump vmax cap   sprint cap   ratio   | sprint cap if *s (consistent)');
for (const H of [0.4, 1, 2, 5, 20, 50, 200]) {
  const c = ctx(Infinity, 'real', H);
  const jc = P.MUSCLE.jump.vmax * c.body.s, sp = P.sprint(c);
  console.log(`${String(H).padEnd(5)} ${String(c.body.s).padEnd(5)} ${jc.toFixed(1).padStart(10)} ${sp.vTop.toFixed(1).padStart(12)} ${(jc/sp.vTop).toFixed(2).padStart(7)}   | ${(P.MUSCLE.run.cap*c.body.s).toFixed(1)} m/s, Mach ${(P.MUSCLE.run.cap*c.body.s/P.K.a0).toFixed(2)}`);
}
// comic mode, fixed strength: how do comic punch and comic sprint leg cap scale with size?
for (const kg of [5e4]) for (const H of [0.4, 2, 50]) {
  const c = ctx(kg*g, 'comic', H); const sp = P.sprint(c);
  console.log(`comic ${kg} kg H ${H}: punch ${P.punch(c).vFist.toFixed(1)}, sprint ${sp.vTop.toFixed(1)} (${sp.topLimit})`);
}
