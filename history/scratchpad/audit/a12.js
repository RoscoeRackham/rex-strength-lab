const { P, D, g, S, O, T, ctx } = require('./common');
for (const sid of ['granite', 'concrete']) {
  const c = ctx(511, { surface: sid });
  const p = (kg) => { const j = P.jump(Object.assign({}, c, { F: kg * g })); return j.v > 0 && (j.flight.apex >= 93 || j.flight.escaped || j.flight.relativistic); };
  let lo = 10, hi = 1e34; const trace = [];
  for (let i = 0; i < 120; i++) { const mid = Math.sqrt(lo * hi); const r = p(mid); trace.push(mid.toExponential(1) + (r ? 'T' : 'F')); if (r) hi = mid; else lo = mid; if (hi / lo < 1 + 1e-6) break; }
  console.log(sid, 'bisection path:', trace.slice(0, 14).join(' '), '... ->', hi.toExponential(3));
  for (const kg of [5.5e4, 1e5, 5.27e5, 1e6, 5e6, 6e6, 1e7, 1e8]) { const j = P.jump(Object.assign({}, c, { F: kg * g })); console.log('  ', sid, kg.toExponential(2), 'apex', j.flight.apex.toFixed(1), 'fails', j.groundFails, 'pred', p(kg)); }
}
