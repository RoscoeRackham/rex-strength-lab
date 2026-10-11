global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
let bad = 0;
for (const o of D.objects.filter(o=>!o.noThrow)) for (const s of D.surfaces) for (const anchor of ['friction','braced','bolted']) for (const gh of [false,true]) for (const mode of ['comic','real']) for (const th of [0,45,89]) {
  const fin = P.throwObject({ F: 1e40*g, mode, body, surface: s, groundHolds: gh, anchor }, o, th);
  const inf = P.throwObject({ F: Infinity, mode, body, surface: s, groundHolds: gh, anchor }, o, th);
  if ((fin.recoilV > 0.01) !== (inf.recoilV > 0.01) || Number.isNaN(inf.recoilV) || Number.isNaN(inf.recoilE)) { bad++; console.log('MISMATCH', o.id, s.id, anchor, gh, mode, th, fin.recoilV, inf.recoilV); }
}
console.log('mismatches with fix:', bad);
