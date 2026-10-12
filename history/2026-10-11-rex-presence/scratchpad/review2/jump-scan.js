global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const sid = process.argv[2] || 'concrete', F = Number(process.argv[3] || 1e12) * g;
const c = { F, mode: 'comic', body: rex, surface: D.surfaces.find((s) => s.id === sid), groundHolds: false, anchor: 'friction' };
const [lo, hi] = R.bounds(c);
const opt = { near: 5, groundHolds: false, m: rex.m, body: rex, surface: c.surface, target: 3 };
for (let i = 0; i < 12; i++) {
  const u = lo * Math.pow(10, i / 2), r = P.jump(Object.assign({}, c, { use: u }));
  const hz = R.HAZARDS.filter((h) => h.test(R.MOVES.jump, r, opt)).map((h) => h.id);
  console.log('grid', i, (u / g).toPrecision(3), 'kg  v', r.v, ' apex', r.flight && r.flight.apex, ' groundFails', r.groundFails, ' hazards', hz.join(','));
}
const p = R.planNow('jump', c, { target: 3 });
console.log('page plan: goal', JSON.stringify(p.goal()), '\nceiling', JSON.stringify(p.ceiling()));
for (const h of R.HAZARDS) console.log('hazard', h.id, JSON.stringify(p.result('hazard:' + h.id)));
for (const h of R.PRESETS) console.log('preset', h.id, JSON.stringify(p.result('preset:' + h.id)));
const M = R.MOVES.jump;
for (const u of [2.5e5, 3.01e5, 5e5, 1e6, 1.3e6]) { const r = p.run(u * g); console.log((u).toPrecision(3), 'v', r.v, 'plaster', R.HAZARDS[2].test(M, r, p.opt), 'ppv@5', P.ppvAt(M.shake(r, p.opt), 5), 'landing', r.landing && r.landing.v, r.landing && r.landing.t); }
console.log('plan opt keys', Object.keys(p.opt));
