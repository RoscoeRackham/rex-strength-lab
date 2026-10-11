global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('./engine_r5c.js');
const g = P.K.g;
for (const [H,id] of [[2,'gravel'],[2,'sand'],[0.4,'granite'],[50,'concrete']]) {
  const body = P.makeBody({H, m: 180*Math.pow(H/2,3)});
  const s = D.surfaces.find(x=>x.id===id);
  let t = Date.now();
  P.jump({F: 1e30*g, mode:'real', body, surface: s, groundHolds:false, anchor:'friction'});
  const cold = Date.now()-t; t = Date.now();
  P.jump({F: 3e29*g, mode:'real', body, surface: s, groundHolds:false, anchor:'friction'});
  console.log(H, id, 'cold ms', cold, 'warm ms', Date.now()-t);
}
