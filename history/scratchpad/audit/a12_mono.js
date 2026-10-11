const { P, g, ctx, thresholds } = require('./lib.js');
for (const mode of ['comic', 'real']) for (const surface of ['sand', 'concrete', 'granite']) for (const groundHolds of [false, true]) {
  const base = ctx({ mode, surface, groundHolds });
  const ths = thresholds(base);
  for (const t of ths) {
    let flips = [], prev = null;
    for (let lg = 1; lg <= 34; lg += 0.02) { const v = t.pred(Math.pow(10, lg)); if (prev !== null && v !== prev) flips.push((v ? '+' : '-') + lg.toFixed(2)); prev = v; }
    if (flips.length > 1 || (flips.length === 1 && flips[0][0] === '-')) console.log(mode, surface, 'holds=' + groundHolds, t.id, 'NON-MONOTONE flips', flips.join(' '), '| ladder value (as shown)', t.kg.toExponential(3));
  }
}
