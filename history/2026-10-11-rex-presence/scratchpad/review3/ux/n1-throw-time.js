global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const car = D.objects.find((o) => o.id === 'car');
const base = { F: Infinity, mode: 'real', body: rex, surface: D.surfaces.find((s) => s.id === 'concrete'), groundHolds: false, anchor: 'friction' };
for (const lg of [5.4, 5.55, 5.59, 6.0, 7.0, 7.32, 8.0, 10.15, 10.3, 12, 20, 32.2]) {
  const c = Object.assign({}, base, { use: Math.pow(10, lg) * g });
  let t0 = performance.now(); const r = P.throwObject(c, car, 45); const t1 = performance.now() - t0;
  t0 = performance.now(); const p = P.RESTRAINT.MOVES.throw; const rr = p.run(c, { obj: car, angle: 45, near: 5 }); const t2 = performance.now() - t0;
  console.log(lg, 'throwObject', t1.toFixed(1), 'ms; MOVES.throw.run', t2.toFixed(1), 'ms', r.v && r.v.toFixed(2), r.flight && r.flight.range && r.flight.range.toFixed(1));
}
