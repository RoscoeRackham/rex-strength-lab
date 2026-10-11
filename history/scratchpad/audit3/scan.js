global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
function ctx(logKg, anchor) {
  return { F: Math.pow(10, logKg) * g, mode: 'comic', body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor, record: true };
}
const seen = {};
for (const id of ['loco', 'shuttle', 'titanic', 'nimitz', 'car', 'bus', 'baseball', 'shot', 'piano', 'tank']) {
  const o = D.objects.find(x => x.id === id);
  for (const anchor of ['friction', 'bolted']) for (const ang of [5, 10, 20, 30, 45, 60, 80, 90]) for (let lk = 3; lk <= 26; lk += 0.05) {
    const r = P.throwObject(ctx(lk, anchor), o, ang);
    if (!r || !r.flight) continue;
    const f = r.flight;
    const k = f.relativistic ? 'rel' : f.leavesHill ? 'hill' : f.escaped ? 'esc' : f.orbit ? 'orbit' : f.timedOut ? 'timedOut' : 'landed';
    if (k === 'rel' || k === 'landed') continue;
    const key = id + anchor + k;
    if (seen[key]) continue; seen[key] = 1;
    let pmax = 0; if (f.path) for (const p of f.path) pmax = Math.max(pmax, p[1]);
    console.log(id, anchor, ang, lk, k, 'apex', (f.apex/1e3).toFixed(1)+'km', 'pathMax', (pmax/1e3).toFixed(1)+'km', 'pathLen', f.path ? f.path.length : 0);
  }
}
