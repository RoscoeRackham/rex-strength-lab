const { P, D, g, mk } = require('./eng.js');
const ollie = (m) => P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie, m ? { m } : {}));
// Wrestle throw: Rex throws a 1e6 kg Ollie at 3e18 kg-force, 45 deg
for (const [oM, kg] of [[1e6, 3e18], [3000, 1e16], [3000, 3e16]]) {
  const A = mk({ F: kg * g }), B = mk({ F: kg * g, body: ollie(oM) });
  const t = P.throwPartner(A, B, 45);
  const tb = P.RESTRAINT.takenBack('wrestleThrow', t, { A, B, whoA: 'rex', angle: 45 });
  const fa = P.fastAir(t.obj, t.r.Eobj, 45, 1);
  console.log('wrestle oM', oM, 'dial', kg, 'v/c', (t.r.v / P.K.c).toFixed(4), 'rel', !!t.r.flight.relativistic, 'Eobj', t.r.Eobj.toExponential(3), 'tile drag', tb.parts.drag.toExponential(3), 'fastAir Eair', fa.Eair.toExponential(3), 'pct', (100 * fa.Eair / t.r.Eobj).toFixed(1));
}
