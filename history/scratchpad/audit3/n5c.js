global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const E = (P && P.throwObject) ? P : Object.values(window).find(v => v && v.throwObject);
const g = 9.81;
const surface = D.surfaces.find(s => s.id === 'concrete');
const body = E.makeBody({ H: 2, m: 180 });
for (const o of D.objects.filter(o => !o.noThrow)) {
  for (const mode of ['real', 'comic']) {
    // find a can-hold-but-can't-throw strength
    let hit = null;
    for (let lk = 0; lk <= 8; lk += 0.01) {
      const r = E.throwObject({ F: Math.pow(10, lk) * g, mode, body, surface, groundHolds: false, anchor: 'friction', record: true }, o, 45);
      if (r.canHold && !r.canMove) { hit = { lk: lk.toFixed(2), objW: (o.m * g).toPrecision(3), needed: r.needed.toPrecision(3), Fdrive: r.Fdrive.toPrecision(3), ratio: (r.needed / r.Fdrive).toFixed(3) }; break; }
    }
    console.log(o.id, o.m, mode, JSON.stringify(hit));
  }
}
