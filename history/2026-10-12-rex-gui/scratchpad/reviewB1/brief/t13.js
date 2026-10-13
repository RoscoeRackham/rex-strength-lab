const { P, D, g, surf, rex, ollie, ON, ctxOf } = require('./setup.js');
const M = P.RESTRAINT.MOVES;
for (const lg of [7, 8]) {
  const c = ctxOf(Math.pow(10, lg), Object.assign({ surface: surf('sand') }, ON)), c0 = ctxOf(Math.pow(10, lg), { surface: surf('sand'), ownRecoil: true });
  const s = P.stomp(c), s0 = P.stomp(c0);
  const o = { surface: c.surface, body: c.body, unbreakable: true, near: 5 }, o0 = { surface: c.surface, body: c.body, near: 5 };
  console.log('sand 1e' + lg, 'vFoot', s.vFoot.toFixed(0), 'realHole m', s.realHole.toFixed(2), 'crater', s.realCrater, 'realBreaks', s.realBreaks, 'absorbed', s.absorbed.toExponential(2), 'groundHazardReal', M.stomp.ground(s0, o0), 'blast on', M.stomp.blast(s, o).toExponential(2), 'blast off', M.stomp.blast(s0, o0).toExponential(2));
  const p = P.RESTRAINT.planNow('stomp', ctxOf(Math.pow(10, lg), Object.assign({ surface: surf('sand') }, ON)), {});
  const p0 = P.RESTRAINT.planNow('stomp', ctxOf(Math.pow(10, lg), { surface: surf('sand'), ownRecoil: true, keepForm: true, airAbsorb: 1 }), {});
  console.log('   hazard air: on', JSON.stringify(p.result('hazard:air') && { never: p.result('hazard:air').never, use: p.result('hazard:air').use / g }), ' off', JSON.stringify(p0.result('hazard:air') && { never: p0.result('hazard:air').never, use: p0.result('hazard:air').use / g }));
}
