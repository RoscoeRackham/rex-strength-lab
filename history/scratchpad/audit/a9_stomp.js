const { P, g, ctx, D } = require('./lib.js');
for (const surface of ['sand', 'concrete', 'granite']) for (const kg of [511, 9072, 90718, 1.36e14]) {
  const c = ctx({ kg, mode: 'comic', surface });
  const r = P.stomp(c);
  const b = c.body;
  const Q = c.surface.qult * b.footArea;            // most force the ground can put on the foot
  const tStop = r.push.pB / Q;                       // time for the ground to absorb the foot's momentum
  const sep = r.vBody * tStop;                       // how far the body would rise meanwhile
  console.log(surface.padEnd(8), 'lift', kg.toExponential(2), '| E', r.E.toExponential(2), 'J quake', r.quake.toFixed(2), '| hole', r.holeDepth.toExponential(2), 'm | vBody', r.vBody.toFixed(2), 'apex', r.bodyFlight.relativistic ? 'REL' : r.bodyFlight.apex.toFixed(1),
    '| pA/pB', (r.push.pA / r.push.pB).toFixed(3), '| ground stop time', tStop.toExponential(2), 's, body-foot separation needed', sep.toExponential(2), 'm vs leg stroke', b.strokes.stomp);
}
