const { P, g, ctx } = require('./lib.js');
// mirror bayJump status ratio logic
for (const kg of [80e3, 110e3, 125e3]) {
  const c = ctx({ kg, mode: 'comic', surface: 'concrete' });
  const r = P.jump(c);
  const ratio = r.groundFails ? (c.F / r.groundLimitForce) : (c.F / Math.max(r.groundLimitForce, 1));
  const chip = ratio <= 1 ? 'Ground holds (' + (ratio * 100).toFixed(0) + '% of limit)' : 'Ground fails: ' + ratio.toFixed(2) + 'x its limit';
  console.log('lift', kg, 'kg | jump force', r.F.toExponential(3), 'N vs ground limit', r.groundLimitForce.toExponential(3), '| engine groundFails =', r.groundFails, '| chip shown:', chip, '| correct ratio F_jump/RB =', (r.F / r.groundLimitForce).toFixed(3), '| apex', r.flight.apex.toFixed(1), 'm');
}
