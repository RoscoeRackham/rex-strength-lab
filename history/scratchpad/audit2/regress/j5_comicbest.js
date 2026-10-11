const { P, ctx } = require('./common.js');
function bestJump(c) {
  let best = { v: 0 };
  const top = Math.log10(c.F / P.K.g);
  for (let lg = 1; lg <= top + 1e-9; lg += 0.01) {
    const r = P.jump(Object.assign({}, c, { F: Math.pow(10, Math.min(lg, top)) * P.K.g }));
    if (r.v > best.v) best = { v: r.v, apex: r.flight.apex, kg: Math.pow(10, lg) };
  }
  return best;
}
for (const surface of ['sand', 'gravel', 'softclay', 'stiffclay', 'concrete', 'ice', 'granite']) {
  let worst = { ratio: 1 };
  for (let lg = 2; lg <= 9; lg += 0.25) {
    const c = ctx({ kg: Math.pow(10, lg), surface });
    const r = P.jump(c), b = bestJump(c);
    const ratio = b.v / r.v;
    if (ratio > worst.ratio) worst = { ratio, lg, v: r.v, bv: b.v, apex: r.flight.apex, bapex: b.apex, hb: r.heldBack };
  }
  console.log(surface, JSON.stringify(worst));
}
