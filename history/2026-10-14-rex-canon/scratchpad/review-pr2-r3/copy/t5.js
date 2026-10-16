const { P, D, g, rex, ollie, surf, obj, ctx } = require('./eng.js');
const PR = P.RESTRAINT;
const out = [];
for (const ob of ['car', 'pickup', 'bus', 'semi', 'tank', 'loco']) for (const s of ['concrete', 'asphalt', 'sand', 'stiffclay', 'gravel', 'granite']) for (const a of [0, 30, 45, 60, 90]) {
  const sf = surf(s); if (!sf) continue;
  const c = ctx({ surface: sf });
  const o = { obj: obj(ob), angle: a, target: 30, near: 5, surface: c.surface, body: c.body };
  const p = PR.planNow('throw', c, o); const r = p.result('preset:ground');
  out.push([ob, s, a, r.never ? 'never' : Math.round(r.use / g)].join(' '));
}
console.log(out.join('\n'));
