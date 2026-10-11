global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
const body = P.makeBody({H:2, m:180});
const s = D.surfaces.find(x=>x.id==='gravel');
let t0 = Date.now(), n=0;
for (let l = 2; l <= 14; l += 0.1) { P.jump({F: Math.pow(10,l)*g, mode:'real', body, surface: s, groundHolds:false, anchor:'friction'}); n++; }
console.log('ms per jump()', (Date.now()-t0)/n);
