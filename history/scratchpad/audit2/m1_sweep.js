global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
for (const mode of ['comic', 'real']) {
  let lo = null, hi = null, full = [];
  for (let L = 1; L <= 8; L += 0.005) {
    const body = P.makeBody({ H: 2, m: 180 });
    const surface = D.surfaces.find((s) => s.id === 'concrete');
    const r = P.stomp({ F: Math.pow(10, L) * g, mode, body, surface, groundHolds: false, anchor: 'friction' });
    if (r.vBody > 0.5 && r.vBody <= 2) { if (lo === null) lo = L; hi = L; }
    if (r.footShare >= 0.995) full.push(L);
  }
  console.log(mode, 'contradiction band kg:', lo && Math.pow(10, lo).toFixed(0), '-', hi && Math.pow(10, hi).toFixed(0), ' share>=99.5% kg up to', full.length ? Math.pow(10, full[full.length - 1]).toFixed(0) : 'none');
}
