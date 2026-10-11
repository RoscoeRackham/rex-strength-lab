global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
const body = P.makeBody({H:50, m:180*Math.pow(25,3)});
const s = D.surfaces.find(x=>x.id==='concrete');
for (let l = 6.8; l <= 8.0; l += 0.1) {
  const r = P.jump({F: Math.pow(10,l)*g, mode:'real', body, surface: s, groundHolds:false, anchor:'friction'});
  console.log(l.toFixed(1), r.v.toFixed(2), r.flight.apex.toFixed(2), 'heldBack', r.heldBack, 'fails', r.groundFails, 'sink', r.push.xB.toFixed(3));
}
const ri = P.jump({F: Infinity, mode:'real', body: P.makeBody({}), surface: D.surfaces.find(x=>x.id==='gravel'), groundHolds:false, anchor:'friction'});
console.log('inf real gravel 2m', ri.v, ri.relativistic);
