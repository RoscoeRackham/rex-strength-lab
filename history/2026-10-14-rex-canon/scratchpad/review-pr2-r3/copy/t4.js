const { P, D, g, rex, ollie, surf, obj, ctx } = require('./eng.js');
const PR = P.RESTRAINT;
for (const [ob, a] of [['loco', 0], ['car', 45]]) {
  const c = ctx({ F: 1e9 * g });
  const o = { obj: obj(ob), angle: a, target: 30, near: 5, surface: c.surface, body: c.body };
  const p = PR.planNow('throw', c, o); const r = p.result('preset:ground');
  console.log(process.env.WHICH || 'repo', ob, a, r.never ? 'never' : Math.round(r.use / g));
}
