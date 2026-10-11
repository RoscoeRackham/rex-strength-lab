global.window = {};
const A = require('/home/user/dino-strength-sim/src/engine.js');
const B = require('./engine_fix.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = A.K.g;
const body = A.makeBody({});
const surface = D.surfaces.find((s) => s.id === 'concrete');
const out = [];
for (const oid of ['baseball', 'shot', 'piano', 'car']) for (const ang of [15, 30, 45, 60]) {
  const row = [];
  for (const lg of [4, 5, 5.2, 5.5, 6, 7, 9, 12, Infinity]) {
    const F = lg === Infinity ? Infinity : Math.pow(10, lg) * g;
    const c = { F, mode: 'real', body, surface, groundHolds: false, anchor: 'friction' };
    const a = A.throwObject(c, D.objects.find((x) => x.id === oid), ang);
    const b = B.throwObject(c, D.objects.find((x) => x.id === oid), ang);
    row.push(lg + ':' + (a.canMove ? (a.sinkRatio > 1 ? 'SINK' : '-') + '/' + (b.sinkRatio > 1 ? 'SINK' : '-') : 'x'));
  }
  console.log(oid, ang, row.join(' '));
}
