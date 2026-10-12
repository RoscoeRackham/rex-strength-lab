const { P, D, g, surf, obj, ctxOf } = require('./eng.js');
const c = ctxOf(1e12);
for (const t of [1750e3, 26900e3, 3.1e8]) {
  const r = P.jump(Object.assign({}, c, { use: t * g }));
  const M = P.RESTRAINT.MOVES.jump, opt = { near: 5, surface: c.surface, body: c.body, m: c.body.m };
  const boom = P.RESTRAINT.HAZARDS[0].test(M, r, opt), air = P.RESTRAINT.HAZARDS[1].test(M, r, opt);
  console.log((t/1e3) + ' t:', 'body v', r.v.toFixed(1), 'footSpeed', r.footSpeed && r.footSpeed.toFixed(0), 'Eground', r.Eground.toExponential(2), 'apex', r.flight.apex.toFixed(0), 'boom hazard', boom, 'air hazard', air, 'air reach (m)', P.blastRadius(M.blast(r, opt), 100).toFixed(0));
}
