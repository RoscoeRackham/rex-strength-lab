const { P, D, g, surf, rex, ollie, ON, ctxOf } = require('./setup.js');
const M = P.RESTRAINT.MOVES;
for (const lg of [5, 6, 7, 8]) {
  const c = ctxOf(Math.pow(10, lg), Object.assign({ surface: surf('granite') }, ON)), c0 = ctxOf(Math.pow(10, lg), { surface: surf('granite'), ownRecoil: true });
  const s = P.stomp(c), s0 = P.stomp(c0);
  const o = { surface: c.surface, body: c.body, unbreakable: true }, o0 = { surface: c.surface, body: c.body };
  console.log('1e' + lg, 'vFoot', s.vFoot.toFixed(0), 'realHole mm', (s.realHole * 1000).toFixed(2), 'crater', s.realCrater, 'realBreaks', s.realBreaks, 'groundHazardReal', M.stomp.ground(s0, o0), 'blast on', M.stomp.blast(s, o).toExponential(2), 'blast off', M.stomp.blast(s0, o0).toExponential(2));
}
