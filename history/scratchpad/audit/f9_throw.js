const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const objs = D.objects.filter(o => !o.noThrow).filter(o => o.m > 1e5);
const t0 = Date.now();
let best = {};
for (const o of objs) for (const ang of [30, 45, 60, 75, 85, 89]) for (let lk = 8; lk <= 34; lk += 0.25) {
  if (Date.now() - t0 > 95000) break;
  const c = { F: Math.pow(10, lk) * g, mode: 'comic', body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === 'granite'), groundHolds: true, anchor: 'bolted' };
  const r = P.throwObject(c, o, ang); const f = r.flight;
  const shown = r.canMove && !f.relativistic && f.vImpact > 0 && r.Eimpact > 4.184e9 && r.crater > 0;
  if (shown && (!best[o.id] || r.crater > best[o.id].crater)) best[o.id] = { crater: Math.round(r.crater), dtc: Math.round(r.crater / 1.25), ang, lk, vImp: Math.round(f.vImpact) };
}
console.log(best, (Date.now() - t0) + 'ms');
