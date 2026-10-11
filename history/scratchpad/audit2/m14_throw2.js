global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({});
const surface = D.surfaces.find(s => s.id === 'concrete');
console.log(D.objects.map(o=>o.id+':'+o.m).join(' '));
for (const o of D.objects) for (const ang of [45]) for (const lg of [30, 32, 34]) {
  const r = P.throwObject({ F: Math.pow(10, lg) * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' }, o, ang);
  if (r.crater > 0.1 * P.K.R_E) console.log(o.id, ang, lg, 'landed', r.flight.landed, 'crater km', (r.crater/1000).toFixed(0), 'Eimp', r.Eimpact.toExponential(2), 'quake', r.quake && r.quake.toFixed(1));
}
