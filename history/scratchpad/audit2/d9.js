global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
console.log(Object.keys(D));
const feats = D.feats || D.FEATS;
for (const f of feats) console.log(f.status.padEnd(14), f.group.padEnd(6), f.title);
