const { P, D, g, surf, obj, rex, ollie, ctx } = require('./base.js');
const kg = Math.pow(10, Math.log10(1.81436948e23) + 1e-12);
for (const anchor of ['friction', 'bolted']) {
  const c = ctx(kg, { anchor });
  const t0 = Date.now();
  const p = P.RESTRAINT.planNow('throw', c, { obj: obj('baseball'), angle: 0, target: 30, near: 5 });
  const out = {};
  for (const id of ['rattle', 'plaster', 'windows', 'ground', 'houses', 'block']) { const r = p.result('preset:' + id); out[id] = r.never ? 'never' : (r.use / g).toPrecision(3); }
  const ce = p.ceiling();
  console.log(anchor, JSON.stringify(out), 'ceiling', ce.by, (ce.below / g).toPrecision(3), Date.now() - t0, 'ms');
}
