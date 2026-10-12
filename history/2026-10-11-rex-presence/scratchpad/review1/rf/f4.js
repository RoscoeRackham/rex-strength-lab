const { P, D, g, surf, obj, ctx, rex } = require('./lib.js');
for (const [label, cc] of [['rex comic sand', ctx({ surface: surf('sand') })], ['rex real sand', ctx({ surface: surf('sand'), mode: 'real' })], ['rex comic softclay', ctx({ surface: surf('softclay') })], ['rex comic concrete', ctx({})]]) {
  const p = P.RESTRAINT.planNow('jump', cc, { near: 5, target: 3 });
  const ce = p.ceiling(), gl = p.goal();
  let first = null;
  for (let i = 0; i <= 400; i++) { const kg = 30 * Math.pow(cc.F / g / 30, i / 400); const r = p.run(kg * g); if (r.landing && r.landing.ratio > 1) { first = { kg, ratio: r.landing.ratio, sink: r.landing.sink, apex: r.flight.apex }; break; } }
  console.log(label, '| goal kg', (gl.use / g).toFixed(0), gl.reached, '| ceiling by', ce.by, (ce.below / g).toFixed(0), 'kg', (100 * ce.below / cc.F).toFixed(1) + '%', '| take-off ground onset', (p.result('hazard:ground').use / g).toFixed(0), '| landing ratio>1 from', first && first.kg.toFixed(0), first && first.ratio.toFixed(3), 'sink', first && first.sink.toFixed(3), 'apex', first && first.apex.toFixed(2));
}
// custom 10 t on sand
const c = ctx({ surface: surf('sand'), use: 1e4 * g }); const r = P.jump(c); console.log('10 t sand landing ratio', r.landing.ratio.toFixed(3), 'sink', r.landing.sink.toFixed(3), 'groundFails', r.groundFails, 'ground hazard test', P.RESTRAINT.MOVES.jump.ground(r));
