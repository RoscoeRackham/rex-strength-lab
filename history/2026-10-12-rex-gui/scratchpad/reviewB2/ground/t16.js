const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
for (const [oid, kg] of [['bus', 1e6], ['bus', 9.07e4], ['loco', 9.07e4], ['car', 9.07e4]]) {
  const c = Object.assign(ctx({ F: kg*K.g }), ON);
  const r = P.pull(c, obj(oid));
  const tension = obj(oid).m * r.accel + r.resist;
  console.log(oid, kg.toExponential(2), 'usable', r.usable.toExponential(3), 'footLimited', r.footLimited, 'accel', r.accel.toFixed(3), 'rope tension needed', tension.toExponential(3), 'share of usable', (tension / r.usable * 100).toFixed(2) + '%');
}
