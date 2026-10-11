const { P, ctx } = require('./common.js');
for (const surface of ['sand', 'softclay', 'concrete', 'granite']) {
  console.log('==', surface);
  for (const lg of [2.708, 3, 3.5, 4, 4.5, 5, 6, 8, 10, 15, 20]) {
    const c = ctx({ kg: Math.pow(10, lg), mode: 'real', surface });
    const r = P.jump(c);
    console.log('  1e' + lg, 'F', r.F.toExponential(2), 'RB', r.groundLimitForce.toExponential(2), 'v', r.v.toFixed(3), 'apex', r.flight.apex.toFixed(2), 'gf', r.groundFails, 'hb', r.heldBack, 'vB', r.push.vB.toFixed(3), 'xB', r.push.xB.toExponential(2), 'Eg', r.Eground.toExponential(2));
  }
}
