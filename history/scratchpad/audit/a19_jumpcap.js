const { P, g, ctx, surf } = require('./lib.js');
for (const s of ['sand', 'clay', 'asphalt', 'concrete', 'granite']) {
  const c = ctx({ surface: s });
  const b = c.body, RB = c.surface.qult * 2 * b.footArea, mA = b.m - b.feetMass;
  const cap = P.pushApart({ F: RB * (1 - 1e-9), d: b.strokes.leg, mA, mB: b.feetMass, RA: mA * g, RB, mode: 'comic' });
  const v = P.momentumToV(cap.pA, b.m);
  const fl = P.fly({ v0: v, thetaDeg: 90, h0: 0, m: b.m, A: b.topArea, Cd: b.Cd });
  // engine at Hulk (Secret Wars) strength
  const hk = P.jump(ctx({ surface: s, kg: 150e9 * 907.18474 }));
  console.log(s.padEnd(9), 'ground limit', RB.toExponential(2), 'N | best momentum-consistent takeoff', v.toFixed(1), 'm/s, apex', fl.apex.toFixed(0), 'm | engine at Hulk tier: v', hk.v.toExponential(3), 'm/s', hk.flight.relativistic ? '(relativistic)' : (hk.flight.escaped ? '(escapes Earth)' : 'apex ' + hk.flight.apex.toFixed(0) + ' m'));
}
