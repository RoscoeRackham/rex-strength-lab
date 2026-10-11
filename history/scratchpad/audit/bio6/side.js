global.window = {};
const A = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = A.K.g;
const surf = D.surfaces.find(s => s.id === 'concrete');
for (const gh of [false, true]) for (const kg of [1e5, 1e6, 1e7, 1e8, 1e9]) {
  const c = { F: kg*g, mode: 'real', body: A.makeBody({}), surface: surf, groundHolds: gh, anchor: 'friction' };
  const p = A.punch(c);
  console.log(`gh ${gh} ${kg} kg real punch vFist ${p.vFist.toFixed(2)} recoil ${p.recoilV.toFixed(2)} sat ${p.push.saturated} stalled ${p.push.stalled} t ${p.push.t.toExponential(2)} RA ${p.anchor.R.toFixed(0)}`);
}
