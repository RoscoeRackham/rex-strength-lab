global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = 9.80665;
const body = P.makeBody({ H: 2, m: 180 }), surface = D.surfaces.find(s => s.id === 'concrete');
let prev = 0;
for (let lk = 18.0; lk <= 18.3; lk += 0.0005) {
  const r = P.stomp({ F: Math.pow(10, lk) * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' });
  if (r.crater > 3100 && r.crater < 3300) console.log(lk.toFixed(4), r.crater.toFixed(0)); if (r.crater < prev) console.log('DROP at 10^' + lk.toFixed(2), (prev/1000).toFixed(3), '->', (r.crater/1000).toFixed(3), 'km');
  prev = r.crater;
}
