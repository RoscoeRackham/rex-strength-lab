global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
console.log(Object.keys(D));
for (const o of D.objects) console.log(JSON.stringify(o).slice(0, 500));
console.log(D.surfaces.map(s => JSON.stringify(s).slice(0, 300)).join('\n'));
console.log(JSON.stringify(D.densities || null).slice(0, 3000));
