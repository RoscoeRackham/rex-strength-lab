global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('./engine_r5b.js');
const P0 = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
const [H, sid, l0, l1] = [+process.argv[2], process.argv[3], +process.argv[4], +process.argv[5]];
const body = P.makeBody({H, m: 180*Math.pow(H/2,3)});
const s = D.surfaces.find(x=>x.id===sid);
for (let l = l0; l <= l1 + 1e-9; l += (l1-l0)/20) {
  const c = {F: Math.pow(10,l)*g, mode:'real', body, surface: s, groundHolds:false, anchor:'friction'};
  const r = P.jump(c), r0 = P0.jump(c);
  console.log(l.toFixed(3), 'fixed v', r.v.toFixed(4), 'Fused/F', (r.Fused/r.F).toExponential(2), 'held', r.heldBack, 'fails', r.groundFails, '| orig v', r0.v.toFixed(4), 'RB', r.groundLimitForce.toExponential(3), 'F', r.F.toExponential(3));
}
