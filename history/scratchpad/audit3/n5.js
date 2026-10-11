global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const Eng = window.DINO_ENGINE || window.P || P;
const E = (Eng && Eng.throwObject) ? Eng : Object.values(window).find(v => v && v.throwObject);
const g = 9.81;
const surface = D.surfaces.find(s => s.id === 'concrete');
const body = E.makeBody({ H: 2, m: 180 });
for (const id of ['shot', 'bowling']) {
  const o = D.objects.find(x => x.id === id);
  for (const lk of [1.30, 1.31, 1.32, 1.33, 1.34, 1.35, 1.36, 1.38, 1.40]) {
    for (const ang of [45]) {
      const c = { F: Math.pow(10, lk) * g, mode: 'real', body, surface, groundHolds: false, anchor: 'friction', record: true };
      const r = E.throwObject(c, o, ang);
      console.log(id, lk, 'kg', Math.pow(10, lk).toFixed(2), 'ang', ang, 'canHold', r.canHold, 'canMove', r.canMove, 'Fdrive', r.Fdrive.toFixed(2), 'F', r.F.toFixed(2), 'needed', r.needed.toFixed(2), 'mB', r.mB.toFixed(3), 'armMass', r.armMass.toFixed(3), 'objW', (o.m*g).toFixed(2), 'ratio', (r.needed/r.Fdrive).toFixed(4), 'hands', r.hands, 'basis', r.basis);
    }
  }
}
