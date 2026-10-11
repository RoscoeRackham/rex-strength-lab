const { P, D, g, S, O, T, ctx } = require('./common');
for (const gh of [false, true]) for (const sid of ['concrete', 'granite']) {
  const c = ctx(511, { surface: sid, mode: 'real', groundHolds: gh });
  let best = 0, bestKg = 0;
  for (let lg = 1; lg <= 34; lg += 0.05) { const j = P.jump(Object.assign({}, c, { F: 10 ** lg * g })); if (j.flight.apex > best) { best = j.flight.apex; bestKg = 10 ** lg; } }
  console.log('real mode', sid, 'groundHolds', gh, 'max jump apex over whole slider', best.toFixed(1), 'm at lift', bestKg.toExponential(2), 'kg');
}
