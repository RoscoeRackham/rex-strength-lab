const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
const c = ctxOf(Infinity, { mode: 'real' });
const p = P.RESTRAINT.planNow('jump', c, { target: 3 });
for (let lg = 7.5; lg <= 9.2; lg += 0.05) {
  const u = Math.pow(10, lg) * g; const r = p.run(u);
  console.log(lg.toFixed(2), r.groundFails, r.sink.toExponential(2), 'v', r.v.toFixed(1), 'apex', r.flight.apex.toFixed(0), 'heldBack', r.heldBack, 'overLimit', r.overLimit, 'land ratio', r.landing.ratio.toFixed(2));
}
console.log(p.result('hazard:ground'), p.ceiling());
