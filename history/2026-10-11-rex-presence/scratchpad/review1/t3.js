const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
for (const lg of [7.85, 7.9, 8.15, 8.25, 8.3]) {
  const u = Math.pow(10, lg) * g;
  const r = P.jump(ctxOf(Infinity, { mode: 'real', use: u }));
  console.log(lg, 'v', r.v.toPrecision(12), 'groundFails', r.groundFails, 'sink', r.sink.toFixed(3), 'Eground', r.Eground.toExponential(3), 'heldBack', r.heldBack);
}
// all-out (use undefined), F = 1e8 kg
for (const lg of [7.9, 8.2, 8.5, 9]) { const r = P.jump(ctxOf(Math.pow(10, lg) * g, { mode: 'real' })); console.log('allout F', lg, r.v.toPrecision(12), r.groundFails, r.sink.toFixed(3)); }
