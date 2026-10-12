const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./lib.js');
const R = P.RESTRAINT;
// replicate plan() jobs with a chosen same()
function jobs(move, ctx, o, variant) {
  const M = R.MOVES[move];
  const opt = Object.assign({ near: R.R.NEAR, groundHolds: ctx.groundHolds, m: ctx.body.m, body: ctx.body, surface: ctx.surface }, o || {});
  const memo = new Map();
  const at = (u) => { const k = u === Infinity ? 'inf' : u; let r = memo.get(k); if (!r) { r = M.run(Object.assign({}, ctx, { use: u }), opt); memo.set(k, r); } return r; };
  const [lo, hi] = R.bounds(ctx); const unl = !isFinite(ctx.F);
  const base = (u0, u1) => { const a = M.speed(at(u0)), b = M.speed(at(u1)); return a > 0 && isFinite(a) && Math.abs(b - a) <= 1e-6 * a; };
  const same = variant === 'orig' ? base : variant === 'held' ? (u0, u1) => base(u0, u1) && !at(u0).heldBack && !at(u1).heldBack : base;
  const run = (test) => { const s = R.search(variant === 'hi' ? test : test, lo, hi, unl, variant === 'hi' ? (u0, u1) => base(u0, u1) && !test(hi) : same); while (s.use === undefined) s.step(); return s; };
  const out = { goal: run((u) => M.goal(at(u), opt)) };
  for (const h of R.HAZARDS) out['haz:' + h.id] = run((u) => h.test(M, at(u), opt));
  for (const p of R.PRESETS) out['pre:' + p.id] = run((u) => p.test(M, at(u), opt));
  const ra = at(undefined);
  const viol = [];
  if (out.goal.never && M.goal(ra, opt)) viol.push('goal');
  for (const h of R.HAZARDS) if (out['haz:' + h.id].never && h.test(M, ra, opt)) viol.push('haz:' + h.id);
  for (const p of R.PRESETS) if (out['pre:' + p.id].never && p.test(M, ra, opt)) viol.push('pre:' + p.id);
  return { viol, runs: memo.size };
}
const cases = [
  ['comic', 1e12, 'ice', 'jump', { target: 3 }], ['comic', 1e7, 'gravel', 'jump', { target: 3 }], ['comic', 1e7, 'stiffclay', 'jump', { target: 3 }], ['comic', 1e7, 'asphalt', 'jump', { target: 3 }], ['comic', 1e7, 'concrete', 'jump', { target: 3 }],
  ['comic', 1e7, 'ice', 'throw', { obj: obj('loco'), angle: 45, target: 30 }], ['comic', 1e9, 'gravel', 'throw', { obj: obj('loco'), angle: 45, target: 30 }], ['comic', 1e12, 'concrete', 'throw', { obj: obj('loco'), angle: 45, target: 30 }],
];
for (const [mode, kg, sid, mv, o] of cases) {
  const c = ctxOf(kg, { surface: surf(sid), mode });
  const res = ['orig', 'held', 'hi'].map(v => { const t0 = Date.now(); const j = jobs(mv, c, Object.assign({ near: 5 }, o), v); return v + ':' + (j.viol.join(',') || 'ok') + ' (' + j.runs + ' runs, ' + (Date.now() - t0) + 'ms)'; });
  console.log(mode, kg, sid, mv, o.obj ? o.obj.id : '', '|', res.join(' | '));
}
