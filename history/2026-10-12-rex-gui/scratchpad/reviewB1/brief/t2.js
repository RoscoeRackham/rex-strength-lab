const { P, D, g, surf, rex, ollie, ON, ctxOf } = require('./setup.js');
for (const sid of ['concrete', 'sand', 'granite', 'asphalt']) for (const kg of [500, 3000, 1e4, 1e5]) {
  const c = ctxOf(kg, Object.assign({ surface: surf(sid) }, ON)), c0 = ctxOf(kg, { surface: surf(sid) });
  const s = P.stomp(c), s0 = P.stomp(c0);
  console.log(sid, kg, 'E', s.E.toExponential(2), 'realHole', s.realHole.toExponential(2), 'holeOff', s0.holeDepth.toExponential(2), 'absorbed', s.absorbed.toExponential(2), 'realBreaks', s.realBreaks);
}
// least disruptive stomp at default
const c = ctxOf(100 * 907.18474, ON), p = P.RESTRAINT.planNow('stomp', c, {});
const L = p.result('least'); console.log('least', L && L.use / g, JSON.stringify(Object.keys(L||{})));
