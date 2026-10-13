const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
for (const kg of [1e14, 1e20]) {
  const ctx = { F: kg * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.jump(ctx);
  console.log(kg, 'v', r.v, 'v/c', r.v/P.K.c, 'Ebody', r.Ebody, 'airLoss', r.airLoss, 'flight', JSON.stringify({esc: r.flight.escaped, rel: r.flight.relativistic, landed: r.flight.landed, vEnd: r.flight.vEnd, vOut: r.flight.vOut}), Object.keys(r.flight).join(','));
  console.log('topArea', body.topArea, 'Cd', body.Cd);
}
