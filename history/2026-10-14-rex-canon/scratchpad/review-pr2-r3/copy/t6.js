const { P, D, g, rex, ollie, surf, obj, ctx } = require('./eng.js');
const PR = P.RESTRAINT;
const out = [];
for (const kg of [90718.474, 1e6, 1e9]) for (const ob of ['car', 'pickup', 'baseball', 'piano', 'motorcycle']) for (const s of ['sand', 'concrete', 'softclay']) for (const a of [0, 20, 45, 80]) {
  const c = ctx({ surface: surf(s), F: kg * g });
  const o = { obj: obj(ob), angle: a, target: 30, near: 5, surface: c.surface, body: c.body };
  const p = PR.planNow('throw', c, o);
  const f = (k) => { const r = p.result(k); return r.never ? 'never' : Math.round(r.use / g); };
  const ce = p.ceiling();
  out.push([kg, ob, s, a, 'ceil', ce.by + ':' + Math.round(ce.below / g), 'rattle', f('preset:rattle'), 'plaster', f('preset:plaster')].join(' '));
}
console.log(out.join('\n'));
