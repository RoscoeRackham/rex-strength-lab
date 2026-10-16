global.window = {};
const P = require('./engine-pr2.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, sf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3000 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3000 });
const POW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const lg of [18, 22, 26, 30, 34]) { const c = (F, b) => Object.assign({ F, mode: 'comic', body: b, surface: sf('concrete'), anchor: 'friction' }, POW);
  const r = P.armWrestle(c(Math.pow(10, lg) * g, rex), c(1e4 * g, ollie));
  const pE = r.pin && isFinite(r.pin.E) ? Math.sqrt(r.pin.E * r.pin.E + 2 * r.pin.E * r.pin.M * P.K.c * P.K.c) / P.K.c : null;
  console.log(lg, r.outcome, 'v/c', r.pin && (r.pin.v / P.K.c), 'J', r.toGround && r.toGround.J, 'p from E', pE, 'E', r.pin && r.pin.E); }
