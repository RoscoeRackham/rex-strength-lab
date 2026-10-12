// For each solo plan: does stopping at saturation (same speed at two efforts) change any job's answer?
global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
function both(move, ctx, o) {
  const M = R.MOVES[move];
  const opt = Object.assign({ near: R.R.NEAR, groundHolds: ctx.groundHolds, m: ctx.body.m, body: ctx.body, surface: ctx.surface }, o || {});
  const memo = new Map();
  const at = (u) => { const k = u === Infinity ? 'inf' : u; let r = memo.get(k); if (!r) { r = M.run(Object.assign({}, ctx, { use: u }), opt); memo.set(k, r); } return r; };
  const [lo, hi] = R.bounds(ctx), unl = !isFinite(ctx.F);
  const same = (u0, u1) => { const a = M.speed(at(u0)), b = M.speed(at(u1)); return a > 0 && isFinite(a) && Math.abs(b - a) <= 1e-6 * a; };
  const tests = [['goal', (u) => M.goal(at(u), opt)]].concat(R.HAZARDS.map((h) => ['hazard:' + h.id, (u) => h.test(M, at(u), opt)]), R.PRESETS.map((p) => ['preset:' + p.id, (u) => p.test(M, at(u), opt)]));
  const diffs = [];
  for (const [name, t] of tests) {
    const a = R.search(t, lo, hi, unl, same), b = R.search(t, lo, hi, unl, null);
    while (a.use === undefined) a.step(); while (b.use === undefined) b.step();
    const fa = a.never ? 'never' : a.onlyUnlimited ? 'onlyUnl' : (a.use / g).toPrecision(2), fb = b.never ? 'never' : b.onlyUnlimited ? 'onlyUnl' : (b.use / g).toPrecision(2);
    if (fa !== fb) diffs.push(name + ': with stop ' + fa + ' / full grid ' + fb + (a.saturated ? ' (saturated)' : ''));
  }
  return diffs;
}
const F = [1e5 * g, 1e12 * g, 1e25 * g, Infinity];
const which = process.argv[2] || 'all';
let n = 0;
for (const f of F) for (const mode of ['real', 'comic']) for (const sid of ['concrete', 'sand', 'ice', 'granite', 'softclay']) {
  const c = { F: f, mode, body: rex, surface: surf(sid), groundHolds: false, anchor: 'friction' };
  const runs = [];
  if (which === 'all' || which === 'nothrow') runs.push(['jump', { target: 3 }], ['stomp', {}], ['punch', { target: 10.4 }], ['clap', { target: 6 }], ['sprint', { target: 12.42 }], ['pull', { obj: obj('bus'), target: 10 }], ['pull', { obj: obj('car'), target: 10 }]);
  if (which === 'all' || which === 'throw') for (const id of ['car', 'baseball', 'person', 'piano', 'bus', 'desoto']) runs.push(['throw', { obj: obj(id), angle: 45, target: 30 }]);
  for (const [mv, o] of runs) { n++; const d = both(mv, c, o); if (d.length) console.log(mv, o.obj ? o.obj.id : '', mode, sid, isFinite(f) ? (f / g).toExponential(0) : 'inf', '=>', d.join('; ')); }
}
console.log('plans checked', n);
