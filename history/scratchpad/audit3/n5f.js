global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const E = (P && P.throwObject) ? P : Object.values(window).find(v => v && v.throwObject);
const g = E.K.g;
const surface = D.surfaces.find(s => s.id === 'concrete');
const body = E.makeBody({ H: 2, m: 180 });
const o = D.objects.find(x => x.id === 'shot');
for (const lk of [1.0, 1.05, 1.1, 1.2, 1.3, 1.33]) {
  const r = E.throwObject({ F: Math.pow(10, lk) * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction', record: true }, o, 45);
  console.log('comic', lk, 'canHold', r.canHold, 'canMove', r.canMove, 'Fdrive', r.Fdrive.toPrecision(3), 'needed', r.needed.toPrecision(3), 'objW', (o.m * g).toPrecision(3), 'basis', r.basis);
}
