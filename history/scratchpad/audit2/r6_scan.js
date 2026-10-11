global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P0 = require('/home/user/dino-strength-sim/src/engine.js');
const P1 = require(process.argv[2] || './engine_r6.js');
const g = 9.80665;
const obj = id => D.objects.find(x => x.id === id);
function scan(P, mode, surface, anchor, groundHolds, id, ang) {
  const body = P.makeBody({ H: 2, m: 180 });
  const surf = D.surfaces.find(s => s.id === surface);
  let best = 0, worst = 0, worstAt = null, n = 0;
  for (let L = 1; L <= 12; L += 0.02) {
    const r = P.throwObject({ F: 10 ** L * g, mode, body, surface: surf, groundHolds, anchor }, obj(id), ang);
    const v = r.canMove ? r.v : 0;
    if (best > 0 && v < best * (1 - 1e-3)) { n++; const drop = 1 - v / best; if (drop > worst) { worst = drop; worstAt = L.toFixed(2); } }
    best = Math.max(best, v);
  }
  return { n, worst: (100 * worst).toFixed(1) + '%', worstAt };
}
const objs = ['motorcycle', 'piano', 'car', 'bus', 'tank', 'loco'];
for (const mode of ['comic', 'real']) for (const surface of ['sand', 'concrete', 'granite']) for (const anchor of ['friction', 'braced']) for (const gh of [false]) for (const id of objs) for (const ang of [0, 45]) {
  const a = scan(P0, mode, surface, anchor, gh, id, ang), b = scan(P1, mode, surface, anchor, gh, id, ang);
  if (a.n || b.n) console.log(mode, surface, anchor, id, ang, 'orig drops', a.n, 'worst', a.worst, '@', a.worstAt, '| fixed drops', b.n, 'worst', b.worst, '@', b.worstAt);
}
