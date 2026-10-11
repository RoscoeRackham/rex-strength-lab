global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
for (const sid of D.surfaces.map(s=>s.id)) {
  const surface = D.surfaces.find(s => s.id === sid);
  for (const gh of [false, true]) {
    for (const F of [Math.pow(10, 34)*g, Infinity]) {
      const r = P.jump({ F, mode: 'real', body, surface, groundHolds: gh, anchor: 'friction' });
      console.log(sid, 'gh='+gh, 'F='+F, 'v='+r.v, 'apex='+(r.flight && (r.flight.apex||r.flight.maxH||r.flight.hMax)), 'Eground='+r.Eground, 'q='+r.groundQuake, 'groundFails='+r.groundFails, 'heldBack='+r.heldBack, 'Ebody='+r.Ebody, 'pushv', r.push.vA, r.push.vB);
    }
  }
}
