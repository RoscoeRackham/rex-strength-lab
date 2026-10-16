const { P, D, g, rex, ollie, surf, obj, ctx } = require('./eng.js');
const PR = P.RESTRAINT;
const cases = [['concrete','semi',[0,1,2,17,18]],['asphalt','semi',[1,2,17,18]],['stiffclay','semi',[7,8,17,18]],['gravel','bus',[0,29,30]]];
for (const [s, ob, angs] of cases) for (const a of angs) {
  const c = ctx({ surface: surf(s) });
  const o = { obj: obj(ob), angle: a, target: 30, near: 5, surface: c.surface, body: c.body };
  const p = PR.planNow('throw', c, o); const r = p.result('preset:rattle');
  console.log(process.env.WHICH || 'repo', s, ob, a, r.never ? 'never' : Math.round(r.use / g));
}
