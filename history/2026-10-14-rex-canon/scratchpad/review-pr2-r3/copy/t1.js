const { P, D, g, rex, ollie, surf, obj, ctx } = require('./eng.js');
// pull: car, default, all-out, friction and bolted
for (const anchor of ['friction', 'bolted']) for (const own of [true, false]) {
  const r = P.pull(ctx({ anchor, ownRecoil: own }), obj('car'));
  console.log(anchor, own, 't10m', r.t10m.toFixed(4), 'accel', r.accel.toFixed(2), 'vEnd', r.vEnd.toFixed(2), 'ra', r.recoilAbsorbed && JSON.stringify(r.recoilAbsorbed), 'walk', r.walkPush && JSON.stringify(r.walkPush), 'R', r.anchor.R, 'ropeT', r.ropeT, 'usable', r.usable, 'resist', r.resist);
}
