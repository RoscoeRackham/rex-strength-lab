const { P, D, g, rex, ollie, surf, obj, ctx } = require('./eng.js');
const PR = P.RESTRAINT;
for (const kg of [90718.474, 1e6]) for (const anchor of ['bolted', 'friction']) {
  const c = ctx({ F: kg * g, anchor });
  const o = { obj: obj('car'), target: 10, near: 5, surface: c.surface, body: c.body };
  try {
    const p = PR.planNow('pull', c, o);
    const ce = p.ceiling(), rat = p.result('preset:rattle'), pl = p.result('preset:plaster');
    console.log(process.env.WHICH || 'repo', kg, anchor, 'ceiling', ce && JSON.stringify({ by: ce.by, below: ce.below && ce.below / g }), 'rattle', rat.never ? 'never' : rat.use / g, 'plaster', pl.never ? 'never' : pl.use / g);
  } catch (e) { console.log('err', e.message); }
}
