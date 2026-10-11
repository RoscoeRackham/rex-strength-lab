global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
console.log('comicFrac jump', P.MUSCLE.jump.comicFrac);
for (const sid of ['concrete','asphalt','granite']) {
  const surface = D.surfaces.find(s => s.id === sid);
  for (const mode of ['real','comic']) {
    let first=null, lastMislead=null, n=0, nMis=0;
    for (let lk = 2; lk <= 12; lk += 0.01) {
      const kg = Math.pow(10, lk);
      const c = { F: kg*g, mode, body, surface, groundHolds: false, anchor: 'friction' };
      const r = P.jump(c);
      if (!r.groundFails) continue;
      const rh = P.jump(Object.assign({}, c, { groundHolds: true }));
      if (!(rh.v > 0)) continue;
      n++;
      const ratio = r.v / rh.v;
      if (ratio > 0.9) { nMis++; if (first===null) first=kg; lastMislead=kg; }
    }
    console.log(sid, mode, 'groundFails&vHold>0 samples', n, 'with v/vHold>0.9:', nMis, 'range kg', first && first.toExponential(3), '-', lastMislead && lastMislead.toExponential(3));
  }
}
// Show text-level check for concrete real 2e5
const surface = D.surfaces.find(s => s.id === 'concrete');
for (const kg of [2e5, 1e6]) {
  const c = { F: kg*g, mode: 'real', body, surface, groundHolds: false };
  const r = P.jump(c);
  console.log('real concrete', kg, 'F', r.F.toExponential(3), 'groundLimit', r.groundLimitForce, 'sink mm', (r.sink*1000).toFixed(2), 'v', r.v.toFixed(3), 'vmax*s', P.MUSCLE.jump.vmax*body.s);
}
