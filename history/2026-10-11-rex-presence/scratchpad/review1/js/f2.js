const { P, g, ctxOf, surf, rex } = require('./env.js');
for (const kg of [90718, 1e6]) for (const sid of ['concrete', 'sand']) for (const soft of [false, true]) {
  const c = ctxOf(kg * g, { softLanding: soft, surface: surf(sid) });
  const j = P.jump(c);
  const L = j.landing;
  const src = P.RESTRAINT.MOVES.jump.shake(j, { surface: surf(sid), body: rex, m: rex.m });
  console.log(kg, sid, 'soft', soft, 'v', j.v.toFixed(2), 'landF kN', (L.F/1e3).toFixed(0), 'W x', (L.F/(rex.m*g)).toFixed(1), 'T ms', (L.t*1e3).toFixed(0), 'ratio', L.ratio.toFixed(2), 'sink', L.sink, 'PPV5', src ? (P.ppvAt(src, 5)*1e3).toFixed(2) + ' mm/s' : 'none', 'groundFails', j.groundFails);
}
