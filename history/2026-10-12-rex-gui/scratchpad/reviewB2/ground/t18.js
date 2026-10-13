const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
const M = P.RESTRAINT.MOVES;
for (const sid of ['sand','concrete','granite']) {
  const run = (kg, pw) => { const c = Object.assign(ctx({ F: kg*K.g, surface: surf(sid) }), pw); const j = P.jump(c); const o = { surface: c.surface, body: c.body, m: c.body.m, unbreakable: !!pw.unbreakable, near: 5 }; const s = M.jump.shake(j, o); return { j, reach: P.plasterReach(s), ppv5: P.ppvAt(s, 5) }; };
  let lo = 1e3, hi = 1e9;
  for (let i = 0; i < 80; i++) { const mid = Math.sqrt(lo*hi); if (run(mid, ON).j.overLimitReal) hi = mid; else lo = mid; }
  const a = run(lo, ON), b = run(hi, ON), b0 = run(hi, {});
  console.log(sid, 'threshold', hi.toPrecision(6), 'kgf | just below ON: v', a.j.v.toFixed(2), 'ppv5', (a.ppv5*1000).toFixed(2), 'reach', a.reach.toFixed(2), '| just above ON: v', b.j.v.toFixed(2), 'ppv5', (b.ppv5*1000).toFixed(2), 'reach', b.reach.toFixed(2), '| OFF same effort: v', b0.j.v.toFixed(2), 'ppv5', (b0.ppv5*1000).toFixed(2), 'reach', b0.reach.toFixed(2));
}
