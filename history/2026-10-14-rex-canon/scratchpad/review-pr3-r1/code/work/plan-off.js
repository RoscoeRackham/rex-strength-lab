global.window = {};
const path = require('path');
const res = {};
for (const [eng, data] of [['engine-main.js', 'data-main.js'], ['engine-pr3.js', 'data.js'], ['engine-pr2.js', 'data-main.js']]) {
  delete require.cache[require.resolve('./' + eng)];
  const P = require('./' + eng); window.DINO_DATA = undefined; delete require.cache[require.resolve('./' + data)]; require('./' + data); const D = window.DINO_DATA;
  const { canon, hash } = require('./cases.js');
  const g = 9.80665, surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
  const out = {};
  for (const sid of ['concrete', 'sand']) for (const anchor of ['friction', 'bolted']) for (const gh of [false, true]) for (const lg of [4, 'inf', 9, 20]) for (const ang of [30, 45]) {
    const F = lg === 'inf' ? Infinity : Math.pow(10, lg) * g;
    // every switch except Safe passenger, which is explicitly off in ctx and plan options
    const sw = { gentleHold: true, silentStrike: true, softLanding: true, coolFlight: true, safePassenger: false };
    const C = Object.assign({ F, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf(sid), groundHolds: gh, anchor }, sw);
    const p = P.RESTRAINT.planNow('throw', C, Object.assign({}, sw, { obj: obj('person'), angle: ang, target: 30 }));
    const r = { goal: p.goal(), ceiling: p.ceiling(), hazards: p.hazards(), presets: p.presets() };
    const u = r.goal.reached ? r.goal.use : undefined;
    r.reachLeast = P.RESTRAINT.reach('throw', p.run(u), p.opt); r.reachAll = P.RESTRAINT.reach('throw', p.run(undefined), p.opt);
    out[[sid, anchor, gh, lg, ang].join('|')] = hash(canon(r));
  }
  res[eng] = out;
}
const k = Object.keys(res['engine-main.js']);
console.log(k.length, 'cases; pr3 differ from main:', k.filter((x) => res['engine-main.js'][x] !== res['engine-pr3.js'][x]).length, '; pr2 differ from main:', k.filter((x) => res['engine-main.js'][x] !== res['engine-pr2.js'][x]).length);
