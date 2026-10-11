global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
for (const surf of ['concrete','bedrock','sand','soil'].filter(s=>D.surfaces.some(x=>x.id===s))) {
for (const gh of [true,false]) {
  for (const lk of [6,7,8,9,10,12,15]) {
    const c = { F: Math.pow(10,lk)*g, mode:'comic', body: P.makeBody({H:2,m:180}), surface: D.surfaces.find(s=>s.id===surf), groundHolds: gh, anchor:'friction' };
    const r = P.stomp(c);
    console.log(surf, 'gh='+gh, 'logKg='+lk, 'vFoot='+r.vFoot.toFixed(0), 'crater='+r.crater.toFixed(2), 'hole='+r.holeDepth.toFixed(3));
  }
}}
console.log(D.surfaces.map(s=>s.id).join(','));
