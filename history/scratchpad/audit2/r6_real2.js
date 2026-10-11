global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P0 = require('/home/user/dino-strength-sim/src/engine.js');
const P1 = require('./engine_r6.js');
const g = 9.80665;
const obj = id => D.objects.find(x => x.id === id);
const body = P0.makeBody({ H: 2, m: 180 });
const surf = D.surfaces.find(s => s.id === 'concrete');
for (let L = 3.6; L <= 4.6; L += 0.04) {
  const c = { F: 10 ** L * g, mode: 'real', body, surface: surf, groundHolds: false, anchor: 'friction' };
  const a = P0.throwObject(c, obj('car'), 45), b = P1.throwObject(c, obj('car'), 45);
  console.log(L.toFixed(2), 'Fdrive', a.Fdrive.toExponential(3), 'F', a.F.toExponential(3), 'R', a.anchor.R.toExponential(3), 'orig v', a.v.toFixed(3), 'rec', a.recoilV.toFixed(2), '| fix v', b.v.toFixed(3), 'held', b.heldBack, 'rec', b.recoilV.toFixed(2));
}
