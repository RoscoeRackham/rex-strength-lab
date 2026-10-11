global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
console.log(Object.keys(P).join(' '));
const o = D.objects.find(x=>x.id==='b777'); console.log(o);
