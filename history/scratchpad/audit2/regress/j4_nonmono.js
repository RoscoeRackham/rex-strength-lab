const { P, ctx, tier } = require('./common.js');
// Engine jump vs "best sub-maximal push" (Rex may push with any force up to his max).
function bestJump(c) {
  const F = P.MUSCLE.jump.forceFrac * c.F; // real-mode jump force
  let best = { v: 0 };
  for (let lg = 2; lg <= Math.log10(F); lg += 0.02) {
    const kg = Math.pow(10, lg) / (P.MUSCLE.jump.forceFrac * P.K.g);
    const r = P.jump(Object.assign({}, c, { F: kg * P.K.g }));
    if (r.v > best.v) best = { v: r.v, apex: r.flight.apex, kg };
  }
  return best;
}
for (const [surface, H, lgs] of [['gravel', 2, [3.5, 3.8, 4, 4.958, 6, 10, 14.13]], ['stiffclay', 2, [5, 5.95, 6.5, 8, 14.13]], ['softclay', 2, [3, 3.55, 4, 4.958, 14.13]], ['sand', 2, [2.4, 2.708, 3, 4.958]], ['concrete', 50, [6.5, 7.1, 7.5, 9, 14.13]]]) {
  console.log('==', surface, 'H', H);
  for (const lg of lgs) {
    const c = ctx({ kg: Math.pow(10, lg), mode: 'real', surface, H });
    const r = P.jump(c);
    const b = bestJump(c);
    console.log(`  lift 1e${lg} kg: engine v=${r.v.toFixed(3)} apex=${r.flight.apex.toFixed(2)} m heldBack=${r.heldBack} gf=${r.groundFails} | best sub-max push v=${b.v.toFixed(3)} apex=${(b.apex||0).toFixed(2)} m (at lift-equiv ${b.kg ? b.kg.toExponential(2) : '-'} kg)`);
  }
}
