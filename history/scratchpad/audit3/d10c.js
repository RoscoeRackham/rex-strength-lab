global.window = {};
require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
for (const r of D.sourceRows) console.log(r.status.padEnd(14), '|', r.label, '|', r.value);
