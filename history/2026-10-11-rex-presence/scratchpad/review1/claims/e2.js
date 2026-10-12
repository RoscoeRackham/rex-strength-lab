const { P, D, g, surf, rex } = require('./e1.js');
for (const soft of [false, true]) {
  for (const kg of [90718.474, 1e6]) {
    const c = { F: kg * g, mode: 'comic', body: rex, surface: surf('concrete'), groundHolds: false, anchor: 'friction', softLanding: soft };
    const r = P.jump(c);
    const o = { near: 5, body: rex, surface: surf('concrete'), m: rex.m, softLanding: soft };
    const src = P.RESTRAINT.MOVES.jump.shake(r, o);
    console.log('soft', soft, 'kg', kg, 'apex', r.flight.apex.toFixed(1), 'landing F kN', (r.landing.F / 1e3).toFixed(0), 'T ms', (r.landing.t * 1e3).toFixed(0), 'L.soft', r.landing.soft, 'PPV@5m mm/s', src ? (P.ppvAt(src, 5) * 1e3).toFixed(2) : 'none (shake source removed)');
  }
}
