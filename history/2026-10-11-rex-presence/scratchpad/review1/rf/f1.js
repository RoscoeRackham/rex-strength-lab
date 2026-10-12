const { P, D, g, surf, obj, ctx } = require('./lib.js');
const c = ctx();
const o = { near: 5, target: 30, obj: obj('car'), angle: 45, gentleHold: false, silentStrike: false, softLanding: false, safePassenger: false };
const p = P.RESTRAINT.planNow('throw', c, o);
const gl = p.goal(), ce = p.ceiling();
console.log('body', c.body.m, c.body.H, 'F kg', c.F/g);
console.log('goal use kg', gl.use/g, 'reached', gl.reached);
console.log('ceiling by', ce.by, 'below kg', ce.below/g, 'use kg', ce.use/g, 'pct', 100*ce.below/c.F);
const M = P.RESTRAINT.MOVES.throw;
// dense scan
let prev = null;
const N = 400, lo = 1e4, hi = c.F/g;
for (let i = 0; i <= N; i++) {
  const kg = lo * Math.pow(hi/lo, i/N);
  const r = p.run(kg*g);
  const cr = M.crush(r, p.opt);
  const haz = P.RESTRAINT.HAZARDS.filter(h => h.test(M, r, p.opt)).map(h=>h.id).join(',');
  const key = haz + '|' + (r.basis||'comic');
  if (key !== prev) { console.log(kg.toFixed(0), 'kg', 'grip', r.gripRatio.toFixed(3), 'basis', r.basis||'comic', 'v', r.v.toFixed(2), 'range', r.flight && r.flight.range && r.flight.range.toFixed(1), 'hazards:', haz || '-'); prev = key; }
}
