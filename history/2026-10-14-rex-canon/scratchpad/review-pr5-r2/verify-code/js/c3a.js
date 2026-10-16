const { P, D, body, ctx } = require(process.argv[2] || './setup.js');
const obj = (id) => D.objects.find((x) => x.id === id);
const R3 = body('rex');
const PE = (m, h) => m * (P.K.GM / P.K.R_E - P.K.GM / (P.K.R_E + h));
const tank = obj('tank'); console.log('tank', tank && { m: tank.m, area: tank.area, Cd: tank.Cd });
for (const th of [45, 60, 90]) {
  const c = ctx(1, R3); c.F = Math.pow(10, 16.5) * P.K.g;
  const r = P.throwObject(c, tank, th);
  const tb = P.RESTRAINT.takenBack('throw', r, Object.assign({}, c, { obj: tank, angle: th }));
  const E1 = P.keFromV(r.vOut, tank.m) + PE(tank.m, R3.releaseHeight);
  const f0 = P.fly({ v0: r.vOut, thetaDeg: th, h0: R3.releaseHeight, m: tank.m, A: tank.area, Cd: tank.Cd, CdSup: tank.CdSup, tally: true });
  console.log(th, 'vOut', r.vOut.toExponential(4), 'rel', r.flight.relativistic, 'landed', f0.landed, 'escaped', f0.escaped, 'airE', f0.air && f0.air.E.toExponential(4), 'E1', E1.toExponential(4), 'airE/E1', f0.air && (f0.air.E / E1).toFixed(5), 'drag part', tb.parts.drag.toExponential(4), 'drag/E1', (tb.parts.drag / E1).toFixed(5));
}
