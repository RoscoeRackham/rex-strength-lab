global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({});
for (const sid of ['concrete','sand','granite']) {
const surface = D.surfaces.find(s => s.id === sid);
if(!surface) continue;
for (const mode of ['comic','real']) for (const gh of [false,true]) {
  console.log('---', sid, mode, 'groundHolds', gh);
  for (const lg of [20,22,24,26,27,28,29,30,31,32,33,34]) {
    const c = { F: Math.pow(10, lg) * g, mode, body, surface, groundHolds: gh, anchor: 'friction' };
    const r = P.stomp(c);
    console.log(lg, 'E', r.E.toExponential(3), 'vFoot', r.vFoot.toExponential(3), 'crater km', (r.crater/1000).toFixed(1), 'D/R_E', (r.crater/P.K.R_E).toFixed(3), 'quake', r.quake.toFixed(2), 'disrupts', r.disrupts, 'extrap', r.craterExtrapolated);
  }
}}
