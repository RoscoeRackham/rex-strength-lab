global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
for (const s of D.surfaces) {
  const rows = [];
  for (let lg = 2.7; lg <= 14; lg += 0.25) {
    const c = { F: Math.pow(10, lg) * g, mode: process.argv[2] || 'real', body, surface: s, groundHolds: false, anchor: 'friction' };
    const r = P.jump(c);
    if (!r.heldBack) continue;
    const rf = P.jump(Object.assign({}, c, { groundHolds: true }));
    const ratio = rf.flight.escaped ? Infinity : rf.flight.apex / r.flight.apex;
    rows.push(lg.toFixed(2) + ':' + ratio.toFixed(4));
  }
  console.log(s.id, rows.length ? rows.join(' ') : '(never heldBack)');
}
