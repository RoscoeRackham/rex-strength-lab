global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('./engine_r5c.js');
const g = P.K.g;
const hulk = Math.log10(90718.474);
for (const [H, id, l] of [[2,'gravel',3.8],[2,'gravel',hulk],[2,'gravel',14],[2,'softclay',Math.log10(3500)],[2,'softclay',hulk],[2,'sand',Math.log10(251)],[2,'sand',Math.log10(511)],[2,'stiffclay',12.72],[50,'concrete',7.1],[50,'concrete',7.5]]) {
  const body = P.makeBody({H, m: 180*Math.pow(H/2,3)});
  const s = D.surfaces.find(x=>x.id===id);
  const r = P.jump({F: Math.pow(10,l)*g, mode:'real', body, surface: s, groundHolds:false, anchor:'friction'});
  console.log(H, id, l.toFixed(3), 'v', r.v.toFixed(3), 'apex', r.flight.apex.toFixed(3), 'Fused/RB', (r.Fused/r.groundLimitForce).toFixed(2), 'held', r.heldBack, 'fails', r.groundFails, 'sink', r.sink.toFixed(3), 'vB at lock', r.push.vB.toFixed(3));
}
