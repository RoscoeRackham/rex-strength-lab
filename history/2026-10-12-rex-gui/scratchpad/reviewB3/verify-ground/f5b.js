const { P, surf, ctx } = require('./common.js');
const R = P.RESTRAINT;
for (const kg of [100 * 907.18474, 1e6, 1e7]) {
  const c = ctx(kg, {});
  const pl = R.planNow('stomp', c, { near: 5 });
  for (const p of pl.presets()) {
    if (!['rattle', 'plaster'].includes(p.id)) continue;
    if (!isFinite(p.use)) { console.log(kg.toExponential(1), p.id, 'never'); continue; }
    const r = pl.run(p.use), src = R.MOVES.stomp.shake(r, pl.opt);
    console.log(kg.toExponential(1), p.id, 'use', (p.use / P.K.g / 1e3).toFixed(2), 't push.t', (r.push.t * 1e3).toFixed(1), 'ms pulse', (src.T * 1e3).toFixed(1), 'ms pB', r.push.pB.toExponential(2), 'blowJ', (src.F * src.T / 2).toExponential(2));
  }
  const r = pl.run(pl.hi); console.log('   all-out push.t', (r.push.t*1e3).toFixed(1), 'ms');
}
