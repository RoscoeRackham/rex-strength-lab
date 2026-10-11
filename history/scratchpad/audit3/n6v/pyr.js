global.window = {}; const vm = require('vm'), fs = require('fs');
vm.runInThisContext(fs.readFileSync(__dirname + '/prev-engine.js', 'utf8')); const Pp = globalThis.DinoPhys;
vm.runInThisContext(fs.readFileSync(__dirname + '/prev-data.js', 'utf8')); const Dp = window.DINO_DATA;
const C = require('/home/user/dino-strength-sim/src/engine.js'); const Fq = require('./eng-fast2.js');
delete window.DINO_DATA; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
for (const [nm, P, DD] of [['prev', Pp, Dp], ['cur', C, D], ['fast', Fq, D]]) for (const lg of [10, 10.5, 14]) {
  const c = { F: Math.pow(10, lg) * 9.80665, mode: 'real', body: P.makeBody({ H: 2, m: 180 }), surface: DD.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction' };
  const t = process.hrtime.bigint(); const r = P.throwObject(c, DD.objects.find(x => x.id === 'pyramid'), 89); const ms = Number(process.hrtime.bigint() - t) / 1e6;
  console.log(nm, lg, ms.toFixed(0) + 'ms', 'v', r.v, 'canMove', r.canMove);
}
