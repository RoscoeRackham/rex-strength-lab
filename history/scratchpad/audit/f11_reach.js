const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g, body = P.makeBody({});
for (const mode of ['comic','real']) for (const o of D.objects.filter(o=>!o.noThrow)) {
  const r = P.throwObject({ F: 511*g, mode, body, surface: D.surfaces.find(s=>s.id==='concrete'), groundHolds:false, anchor:'friction' }, o, 45);
  console.log(mode, o.id, 'canMove', r.canMove);
}
