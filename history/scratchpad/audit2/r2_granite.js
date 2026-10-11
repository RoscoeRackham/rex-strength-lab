global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const body = P.makeBody({ H: 2, m: 180 });
for (const sid of ['granite','steel','concrete']) {
const surface = D.surfaces.find(s => s.id === sid);
const out=[];
for (const lg of [3,4,5,6,7,8,9,10,12,15,20,25,30,34]) {
  const r = P.jump({ F: Math.pow(10,lg)*P.K.g, mode: 'real', body, surface, groundHolds: false, anchor: 'friction' });
  out.push(lg+':'+r.v.toFixed(2)+(r.groundFails?'F':'')+(r.heldBack?'H':''));
}
console.log(sid, out.join(' '));
}
