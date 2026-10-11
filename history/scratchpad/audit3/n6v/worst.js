global.window = {};
const which = process.argv[2];
const A = require(which === 'cur' ? '/home/user/dino-strength-sim/src/engine.js' : './eng-final.js');
require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA; const g = A.K.g;
const res = [];
const objs = D.objects.filter(o => !o.noThrow).map(o => o.id);
for (const mode of ['real', 'comic']) for (const id of objs) for (const ang of [10, 45, 89]) for (const surf of ['concrete', 'sand']) for (let lg = 1; lg <= 20; lg += 0.5) {
  const c = { F: Math.pow(10, lg) * g, mode, body: A.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === surf), groundHolds: false, anchor: 'friction' };
  const t = process.hrtime.bigint(); A.throwObject(c, D.objects.find(x => x.id === id), ang); const ms = Number(process.hrtime.bigint() - t) / 1e6;
  res.push([ms, mode, id, ang, surf, lg]);
}
res.sort((a, b) => b[0] - a[0]);
const over = (x) => res.filter(r => r[0] > x).length;
console.log(which, 'n', res.length, '>16ms', over(16), '>50ms', over(50), '>100ms', over(100), 'median', res[res.length >> 1][0].toFixed(1));
console.log(res.slice(0, 12).map(r => r[0].toFixed(0) + ' ' + r.slice(1).join(' ')).join('\n'));
