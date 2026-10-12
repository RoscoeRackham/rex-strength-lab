const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
for (const soft of [false, true]) {
  const c = ctxOf(90718.474 * g, { surface: surf('sand'), softLanding: soft });
  const p = P.RESTRAINT.planNow('jump', c, { target: 3, softLanding: soft });
  const gl = p.goal(); const r = p.run(gl.use);
  const L = r.landing;
  const RB = r.groundLimitForce;
  console.log('soft', soft, 'use kg', (gl.use/g).toFixed(0), 'apex', r.flight.apex.toFixed(2), 'vLand', L.v.toFixed(2), 'landF', L.F.toFixed(0), 'N for', L.t.toFixed(3), 's; ground bears', RB.toFixed(0), 'N; ratio', L.ratio.toFixed(2), 'sink', L.sink.toFixed(3), 'absorbed J', L.absorbed.toFixed(0), 'ceiling', JSON.stringify(p.ceiling()), 'groundFails(takeoff)', r.groundFails);
  console.log('  reach', JSON.stringify(P.RESTRAINT.reach('jump', r, p.opt)));
}
