const { P, ctx } = require('./common.js');
for (const mode of ['real', 'comic']) for (const surface of ['sand', 'concrete', 'granite']) for (const gh of [false, true]) {
  for (const kg of [1e30, 1e34, Infinity]) {
    const c = ctx({ kg: isFinite(kg) ? kg : null, inf: !isFinite(kg), mode, surface, groundHolds: gh });
    const j = P.jump(c);
    console.log(mode, surface, 'holds', gh, 'kg', kg, 'v', j.v.toPrecision(6), 'rel', j.relativistic, 'apex', j.flight.apex.toPrecision(4), 'gf', j.groundFails, 'hb', j.heldBack, 'Eg', j.Eground.toPrecision(3), 'Ebody', j.Ebody.toPrecision(3));
  }
}
