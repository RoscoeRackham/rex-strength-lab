const { P, g, ctx, obj } = require('./lib.js');
for (const [id, kg] of [['car', 511], ['bus', 511], ['tank', 9072], ['b747', 9072]]) for (const ang of [0, 5, 45]) {
  const c = ctx({ kg, mode: 'comic', surface: 'concrete' });
  const o = obj(id);
  const L = P.lift(c, o);
  const r = P.throwObject(c, o, ang);
  const mB = o.m + r.hands * c.body.handEff;
  // the arms must also hold up the weight component normal to the push: |F|^2 >= (mB g cos)^2 + (axial)^2
  const perp = mB * g * Math.cos(ang * Math.PI / 180);
  console.log(id.padEnd(5), 'lift', kg, 'kg, angle', ang, '| lift().canLift', L.canLift, '| throw F', r.F.toFixed(0), 'N, weight-normal component', perp.toFixed(0), 'N | engine canMove', r.canMove, 'v', r.v.toFixed(2), 'range', r.flight.range.toFixed(2), 'm');
}
