const { P, D, g, surf, obj, ctx, rex } = require('./lib.js');
const c = ctx({ F: Infinity, mode: 'real' });
const p = P.RESTRAINT.planNow('jump', c, { near: 5, target: 3 });
const ce = p.ceiling();
console.log('ceiling by', ce.by, 'below kg', (ce.below / g).toExponential(3), 'ground hazard use', (p.result('hazard:ground').use / g).toExponential(3));
let prev = null;
for (let i = 0; i <= 600; i++) {
  const lg = 6 + 4 * i / 600, kg = Math.pow(10, lg);
  const r = p.run(kg * g);
  if (r.groundFails !== prev) { console.log('lg', lg.toFixed(3), 'groundFails', r.groundFails, 'v', r.v.toFixed(6), 'sink', r.sink.toFixed(4), 'heldBack', r.heldBack, 'basis', r.basis || '-'); prev = r.groundFails; }
}
