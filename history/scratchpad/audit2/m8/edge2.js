global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = 9.80665;
const body = P.makeBody({ H: 2, m: 180 }), surface = D.surfaces.find(s => s.id === 'concrete');
let prev = 0;
for (let lk = 16; lk <= 18.3; lk += 0.0005) {
  const r = P.stomp({ F: Math.pow(10, lk) * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' });
  if (r.crater < prev - 1) console.log('DROP at 10^' + lk.toFixed(4) + ' kg', (prev/1000).toFixed(3), '->', (r.crater/1000).toFixed(3), 'km');
  prev = r.crater;
}
for (const lk of [17.5, 17.8, 17.85, 17.9, 18]) { const r = P.stomp({ F: Math.pow(10, lk) * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' }); console.log('10^'+lk, (r.crater/1000).toFixed(3)+' km'); }
