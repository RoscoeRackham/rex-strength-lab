global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const path = require('path');
const P = require(path.resolve(process.argv[2]));
const g = 9.80665;
const obj = id => D.objects.find(x => x.id === id);
const cases = process.argv.slice(3).map(s => s.split(','));
for (const [mode, surface, anchor, id, ang] of cases) {
  const body = P.makeBody({ H: 2, m: 180 });
  const surf = D.surfaces.find(s => s.id === surface);
  let best = 0, worst = 0, worstAt = null, n = 0; const t0 = Date.now();
  for (let L = 2.5; L <= 9; L += 0.05) {
    const r = P.throwObject({ F: 10 ** L * g, mode, body, surface: surf, groundHolds: false, anchor }, obj(id), +ang);
    const v = r.canMove ? r.v : 0;
    if (best > 0 && v < best * (1 - 2e-3)) { n++; const drop = 1 - v / best; if (drop > worst) { worst = drop; worstAt = L.toFixed(2); } }
    best = Math.max(best, v);
  }
  console.log(mode, surface, anchor, id, ang, 'drops', n, 'worst', (100 * worst).toFixed(1) + '%', '@', worstAt, 'ms', Date.now() - t0);
}
