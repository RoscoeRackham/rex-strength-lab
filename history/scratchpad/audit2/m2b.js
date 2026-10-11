global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
const body = P.makeBody({ H: 2, m: 180 });
const surface = D.surfaces.find(s => s.id === 'concrete');
for (const anchor of ['friction','braced','bolted']) for (const id of ['tank','shuttle','titanic','esb','pyramid','ruyi']) {
  const o = D.objects.find(x => x.id === id);
  let first = null;
  for (let lk = 1; lk <= 34; lk += 0.25) {
    const r = P.throwObject({ F: Math.pow(10, lk) * g, mode: 'comic', body, surface, groundHolds: false, anchor }, o, 45);
    if (r.flight && r.flight.relativistic) { first = lk; break; }
  }
  console.log(anchor, id, 'relativistic from logKg', first);
}
