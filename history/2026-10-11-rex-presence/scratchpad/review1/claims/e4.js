const { P, D, g, surf, rex } = require('./e1.js');
for (const sf of ['concrete', 'stiffclay', 'gravel', 'asphalt']) for (const soft of [false, true]) {
  const c = { F: 90718.474 * g, mode: 'comic', body: rex, surface: surf(sf), groundHolds: false, anchor: 'friction', softLanding: soft };
  const r = P.jump(c);
  console.log(sf, 'soft', soft, 'apex', r.flight.apex.toFixed(1), 'landF kN', (r.landing.F / 1e3).toFixed(0), 'ratio', r.landing.ratio.toFixed(2), 'sink m', r.landing.sink.toFixed(3));
}
