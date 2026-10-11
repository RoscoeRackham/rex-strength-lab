const { P, g, ctx, surf } = require('./lib.js');
for (const surface of ['concrete', 'sand']) for (const mode of ['comic', 'real']) {
  console.log('==', surface, mode);
  for (let lg = 3; lg <= 34; lg += lg < 8 ? 0.25 : 2) {
    const c = ctx({ logKg: lg, surface, mode });
    const j = P.jump(c);
    const b = c.body, mA = b.m - b.feetMass;
    // momentum-conserving takeoff: CM momentum = pA - pB (inelastic leg lock), clipped at 0
    const pcm = Math.max(0, j.push.pA - j.push.pB);
    const vcm = P.momentumToV(pcm, b.m);
    console.log('lg', lg.toFixed(2), 'Fjump', j.F.toExponential(2), 'RB', j.groundLimitForce.toExponential(2), 'fails', j.groundFails,
      '| engine v', j.v.toExponential(3), 'apex', j.flight.relativistic ? 'REL' : (j.flight.escaped ? 'ESC' : j.flight.apex.toFixed(1)),
      '| feet sink', j.push.xB.toFixed(3), 'body xA', j.push.xA.toExponential(2), '| pB/pA', (j.push.pB / j.push.pA).toFixed(4), '| v_cm(pA-pB)', vcm.toExponential(3));
  }
}
