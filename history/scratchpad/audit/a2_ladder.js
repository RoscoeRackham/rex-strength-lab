const { P, D, g, ctx, thresholds } = require('./lib.js');
const base = ctx({});
for (const t of thresholds(base)) {
  // kg-space threshold done properly (bounds in kg)
  const trueKg = P.threshold(t.pred, 10, 1e34);
  const atShown = t.pred(t.kg), justBelowTrue = t.pred(trueKg / 1.01);
  console.log(t.id.padEnd(12), 'ladder shows', t.kg.toExponential(4), 'kg | true threshold', trueKg.toExponential(4), 'kg | ratio', (t.kg / trueKg).toFixed(4), '| pred(true/1.01)=', justBelowTrue);
}
