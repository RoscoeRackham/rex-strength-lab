const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./lib.js');
for (const [nm, b] of [['rex', rex], ['ollie', ollie]]) for (const sid of ['sand', 'gravel', 'softclay', 'stiffclay']) {
  const row = [];
  for (const e of [0, 0.5, 0.75, 1]) { const st = P.walkStep(b, surf(sid), { pace: 'walk', effort: e }); row.push('e' + e + ': ' + (st.footprint.depth * 1000).toFixed(1) + 'mm/' + st.footprint.kind + ' pk ' + (st.peakPressure / 1e3).toFixed(0) + 'kPa q ' + (st.q / 1e3).toFixed(0)); }
  console.log(nm, sid, row.join(' | '));
}
// Schanz rule at stamp peak for rex on sand
const st = P.walkStep(rex, surf('sand'), { pace: 'walk', effort: 1 });
const B = rex.footB, q = st.q, qSand = 37e3 * B / 0.316;
const d = (p) => 0.018 * Math.pow(p / 350e3, 1.27) * (B / 0.274) * Math.min(1, qSand / q);
console.log('rex footB', B, 'stance p', (st.pressure / 1e3).toFixed(0), 'kPa ->', (d(st.pressure) * 1e3).toFixed(1), 'mm; peak', (st.peakPressure / 1e3).toFixed(0), 'kPa ->', (d(st.peakPressure) * 1e3).toFixed(1), 'mm');
