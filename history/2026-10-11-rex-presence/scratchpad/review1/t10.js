const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
const person = obj('person');
const c = ctxOf(90718.474 * g);
const p = P.RESTRAINT.planNow('throw', c, { obj: person, angle: 45, target: 30 });
const ce = p.ceiling();
for (const u of [p.goal().use, ce.below]) {
  const r = p.run(u);
  const n = P.PASSENGER.felt(r.launchG, 45);
  console.log('use kg', (u / g).toFixed(0), 'basis', r.basis || 'comic', 'felt mean g', n.toFixed(1), 'for', r.launchT.toFixed(3), 's; Eiband injury level', P.PASSENGER.injury(r.launchT).toFixed(1), 'landing v', r.flight.vImpact.toFixed(1), 'range', r.flight.range.toFixed(0));
}
