global.window = {};
const fs = require('fs');
let src = fs.readFileSync('/home/user/dino-strength-sim/src/engine.js', 'utf8');
// instrument: record max force actually applied per step in pushApartHill
src = src.replace("const F = force(lo);\n      const nvA", "const F = force(lo); if (!globalThis.__Fmax || F > globalThis.__Fmax) globalThis.__Fmax = F; if (steps===0) globalThis.__F1 = F;\n      const nvA");
fs.writeFileSync('./engine_instr.js', src);
const P = require('./engine_instr.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
const S = (id) => D.surfaces.find((s) => s.id === id), O = (id) => D.objects.find((o) => o.id === id);
for (const [lab, kg, surf, anc, obj] of [['granite 1e34 baseball', 1e34, 'granite', 'braced', 'baseball'], ['hulk concrete shot', 90718.474, 'concrete', 'friction', 'shot'], ['hulk sand baseball', 90718.474, 'sand', 'friction', 'baseball'], ['511 concrete shot', 511, 'concrete', 'friction','shot'], ['hulk sand shot', 90718.474, 'sand', 'friction','shot'], ['hulk sand car', 90718.474, 'sand', 'friction','car'], ['hulk concrete car', 90718.474, 'concrete', 'friction','car']]) {
  globalThis.__Fmax = 0; globalThis.__F1 = 0;
  const c = { F: kg * g, mode: 'real', body, surface: S(surf), groundHolds: false, anchor: anc, noBlend: true };
  const r = P.throwObject(c, O(obj), 45);
  const a = r.anchor;
  console.log(lab, 'sinkRatio', r.sinkRatio.toPrecision(3), 'Fnominal', r.F.toPrecision(3), 'Fmax applied', __Fmax.toPrecision(3), 'ratio@Fmaxapplied', (a.N(__Fmax)/a.Nmax).toPrecision(3), 'Favg', (r.push.work/(r.push.xA+r.push.xB)).toPrecision(3), 'ratio@avg', (a.N(r.push.work/(r.push.xA+r.push.xB))/a.Nmax).toPrecision(3), 'Nmax', a.Nmax.toPrecision(3), 'heldBack', r.heldBack, 'xA', r.push.xA.toPrecision(3));
}
