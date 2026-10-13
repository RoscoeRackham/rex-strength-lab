const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
for (const sid of ['sand','softclay','concrete','asphalt','granite']) {
 for (const kg of [1e6, 1e7, 1e8, 1e9]) {
  const c0 = ctx({ F: kg*K.g, surface: surf(sid) });
  const r1 = P.stomp(Object.assign({}, c0, ON));
  console.log('stomp ON', sid, kg.toExponential(0), 'hole', r1.holeDepth.toFixed(2), 'realHole', r1.realHole.toFixed(2), 'crater', r1.crater, 'realCrater', r1.realCrater.toFixed(1), 'realBreaks', r1.realBreaks, 'absorbed', r1.absorbed.toExponential(2), 'E', r1.E.toExponential(2), 'vFoot', r1.vFoot.toFixed(0));
 }
}
