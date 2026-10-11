global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const E = (P && P.throwObject) ? P : Object.values(window).find(v => v && v.throwObject);
const g = 9.81;
const surface = D.surfaces.find(s => s.id === 'concrete');
const body = E.makeBody({ H: 2, m: 180 });
for (const o of D.objects.filter(o => !o.noThrow)) {
  const st = (o.m <= 1) ? body.whipEff : body.handEff;
  const hands = o.m > 20 ? 2 : 1;
  const mB = o.m + hands * st;
  const F = mB * g * 1.001; // just holdable
  const r = E.throwObject({ F, mode: 'real', body, surface, groundHolds: false, anchor: 'friction', record: true }, o, 45);
  console.log(o.id.padEnd(14), 'm', o.m, 'kg@', (F/g).toPrecision(3), 'canHold', r.canHold, 'canMove', r.canMove, 'objW', (o.m*g).toPrecision(3), 'needed', r.needed.toPrecision(3), 'Fdrive', r.Fdrive.toPrecision(3), 'ratio', (r.needed/r.Fdrive).toFixed(3));
}
