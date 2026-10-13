const { P, D, rex, ollie, surf, obj, ctx, ON } = require('./h.js');
for (const s of ['sand', 'gravel', 'softclay', 'stiffclay']) {
  const c = ctx(Object.assign({ kg: 1e9, s }, ON)), c0 = ctx({ kg: 1e9, s });
  for (const kg of [3e4, 1e6, 1e8]) {
    const r = P.stompOnce(Object.assign({}, c, { use: kg * 9.81 })), r0 = P.stompOnce(Object.assign({}, c0, { use: kg * 9.81 }));
    console.log(s, kg.toExponential(0), 'unb hole', r.holeDepth.toFixed(3), 'printCap', r.printCap, 'realHole', r.realHole.toFixed(3), 'realBreaks', r.realBreaks, 'absorbed', r.absorbed.toPrecision(3), 'E', r.E.toPrecision(3), '| off hole', r0.holeDepth.toFixed(3));
  }
  const fp = P.footprint(rex, surf(s), 1e7, false, null, true);
  console.log(s, 'walk footprint at huge p (unbreakable):', JSON.stringify(fp));
  const st = P.standDepth(surf(s), 0, rex.footB, rex.H);
  console.log(s, 'standDepth', JSON.stringify(st));
}
