global.window = {};
require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
for (const r of D.sourceRows) console.log(JSON.stringify(r).slice(0,400));
