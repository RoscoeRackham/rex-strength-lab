global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
let worst = 0;
for (const H of [0.1, 0.4, 2, 50, 500]) for (const s of D.surfaces) for (const gh of [false, true]) {
  const body = P.makeBody({ H, m: 180*Math.pow(H/2,3) });
  const base = { mode:'comic', body, surface: s, groundHolds: gh, anchor:'friction' };
  const kg = P.threshold((F) => { const j = P.jump(Object.assign({}, base, { F })); return j.v > 0 && (j.flight.apex >= 60 || j.flight.escaped || j.flight.relativistic); }, 10 * g, 1e45) / g;
  if (!isFinite(kg)) console.log('INF comic', H, s.id, gh);
  worst = Math.max(worst, kg);
}
console.log('comic max kg', worst.toExponential(3));
