global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const E = P.makeBody ? P : window.RexPhysics || window.PHYS || Object.values(window).find(v => v && v.makeBody);
const g = 9.80665;
const body = E.makeBody({ H: 2, m: 180 });
let rows = [];
for (const s of D.surfaces) {
  for (let lg = 2.7; lg <= 34; lg += 0.25) {
    const c = { F: Math.pow(10, lg) * g, mode: 'real', body, surface: s, groundHolds: false, anchor: 'friction' };
    const r = E.jump(c);
    if (!r.heldBack) continue;
    const rf = E.jump(Object.assign({}, c, { groundHolds: true }));
    const unc = null;
    rows.push([s.id, lg.toFixed(2), r.flight.apex.toFixed(4), rf.flight.apex.toFixed(4), (rf.flight.apex / r.flight.apex).toFixed(5), (r.groundLimitForce/1e3).toFixed(1)+'kN', 'Fdial(real jump)=' + (r.F/1e3).toFixed(0) + 'kN']);
  }
}
console.log(rows.length);
for (const r of rows) console.log(r.join(' '));
