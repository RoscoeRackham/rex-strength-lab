global.window = {};
const P = require(process.argv[2] === 'fix' ? './engine_fix.js' : '/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g; const body = P.makeBody({});
let n = 0;
for (const s of D.surfaces) for (const F of [1e34 * g, Infinity]) {
  const r = P.jump({ F, mode: 'real', body, surface: s, groundHolds: false, anchor: 'friction' });
  console.log(s.id, F, r.v.toFixed(3), r.heldBack);
}
