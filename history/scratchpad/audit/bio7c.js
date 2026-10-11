global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g, body = P.makeBody({ H: 2, m: 180 });
for (const sid of ['concrete','granite']) for (const gh of [false, true]) {
  const surface = D.surfaces.find(s => s.id === sid);
  const at = (F) => ({ F, mode: 'real', body, surface, groundHolds: gh, anchor: 'friction' });
  const t = P.threshold((F) => { const j = P.jump(at(F)); return j.v > 0 && (j.flight.apex >= 93 || j.flight.escaped || j.flight.relativistic); });
  let maxApex = 0; for (let lk=2; lk<=45; lk+=0.05) { const j = P.jump(at(Math.pow(10,lk))); if (j.flight.apex>maxApex) maxApex=j.flight.apex; }
  console.log('real', sid, 'groundHolds', gh, 'liberty threshold F', t, 'max apex over sweep', maxApex.toFixed(2));
}
