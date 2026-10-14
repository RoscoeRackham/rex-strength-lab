const { P, D, rex, ollie, surf, obj, ctx, ON } = require('./h.js');
for (const kg of [1e5, 1e7, 1e9, 1e11, 1e13]) {
  const cA = ctx(Object.assign({ kg, body: rex }, ON)), cB = ctx(Object.assign({ kg: kg * 0.5, body: ollie }, ON));
  const r = P.armWrestle(cA, cB);
  console.log(kg.toExponential(0), 'outcome', r.outcome, 'tableBreaks', r.tableBreaks, 'v', r.pin && r.pin.v.toPrecision(3), 't', r.pin && r.pin.t.toPrecision(3), 'E', r.pin && r.pin.E.toPrecision(3), 'quake', r.quake.toFixed(2), 'toGround', JSON.stringify(r.toGround), 'rel', r.relativistic);
}
