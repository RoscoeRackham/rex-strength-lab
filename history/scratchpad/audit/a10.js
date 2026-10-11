const { P, D, g, S, O, T, ctx } = require('./common');
const pred = (c) => (kg) => { const j = P.jump(Object.assign({}, c, { F: kg * g })); return j.v > 0 && (j.flight.apex >= 93 || j.flight.escaped || j.flight.relativistic); };
for (const sid of Object.keys(S)) for (const mode of ['comic', 'real']) {
  const c = ctx(511, { surface: sid, mode });
  const p = pred(c);
  const thr = P.threshold((F) => p(F / g), 10, 1e34);
  // scan for the true sets
  const segs = []; let prev = null, start = null;
  for (let lg = 1; lg <= 34.0001; lg += 0.02) { const v = p(10 ** lg); if (v !== prev) { if (prev === true) segs.push([start, lg]); if (v) start = lg; prev = v; } }
  if (prev === true) segs.push([start, 34]);
  console.log(sid.padEnd(8), mode.padEnd(5), 'threshold kg', thr === Infinity ? 'Infinity (never)' : thr.toPrecision(4), '| predicate true for log10(kg) in', JSON.stringify(segs.map(s => s.map(x => +x.toFixed(2)))));
}
// concrete comic apex vs strength around ground failure
for (const kg of [6e4, 1e5, 1.29e5, 1.3e5, 2e5, 5e5, 1e6, 1e7, 1e8]) { const j = P.jump(ctx(kg, { surface: 'concrete' })); console.log('concrete comic lift', kg.toExponential(2), 'apex', j.flight.apex.toFixed(1), 'groundFails', j.groundFails); }
