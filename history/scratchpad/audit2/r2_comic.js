global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
for (const path of ['/home/user/dino-strength-sim/src/engine.js','./engine_r2fix.js']) {
const P = require(path);
const body = P.makeBody({ H: 2, m: 180 });
const surface = D.surfaces.find(s => s.id === 'concrete');
for (const gh of [false,true]) { const r = P.jump({ F: Infinity, mode: 'comic', body, surface, groundHolds: gh, anchor: 'friction' }); console.log(path, 'comic inf gh='+gh, r.v, r.Eground); }
}
