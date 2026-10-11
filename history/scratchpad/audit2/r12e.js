global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const F = 511 * 9.80665;
const body = P.makeBody({ H: 2, m: 180 });
for (const mode of ['real','comic']) for (const surface of D.surfaces) for (const anchor of ['friction','braced','bolted']) {
  const c = { F, mode, body, surface, groundHolds: false, anchor };
  const s = P.throwObject(c, D.objects.find(o=>o.id==='shot'), 37).flight.range;
  const b = P.throwObject(c, D.objects.find(o=>o.id==='baseball'), 2).v;
  if (Math.abs(s - 23.56) > 0.3 || Math.abs(b - 47.3) > 0.3) console.log(mode, surface.id, anchor, s.toFixed(2), b.toFixed(2));
}
console.log('done');
