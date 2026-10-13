const { P, D, g, ON, OFF, ctx } = require('./h.js');
const c = P.K.c;
for (const kg of [1e15, 1e18, 1e20, 1e22]) {
  const cR = ctx(kg, { pw: ON }), cO = ctx(1e4, { build: 'ollie', pw: ON });
  const r = P.armWrestle(cR, cO);
  if (!r.pin) { console.log(kg, r.outcome, r.tableBreaks); continue; }
  const v = r.pin.v, M = r.pin.M, gam = 1 / Math.sqrt(1 - (v / c) ** 2);
  const pRel = P.vToMomentum ? P.vToMomentum(v, M) : gam * M * v;
  // relativistic momentum from E: p = sqrt(E^2 + 2 E M c^2)/c
  const pE = Math.sqrt(r.pin.E * r.pin.E + 2 * r.pin.E * M * c * c) / c;
  console.log(kg.toExponential(0), r.outcome, 'tableBreaks', r.tableBreaks, 'v/c', (v / c).toFixed(4), 'J code', r.toGround && r.toGround.J.toPrecision(3), 'gamma M v', (gam * M * v).toPrecision(3), 'p from E', pE.toPrecision(3), 'ratio', (pE / (r.toGround ? r.toGround.J : NaN)).toPrecision(3));
}
