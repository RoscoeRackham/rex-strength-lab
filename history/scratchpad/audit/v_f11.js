const { P, D, g, S } = require('./common');
// replicate app.html thresholds() predicate for jumpliberty, LMIN=1, LMAX=34
const pred = (c) => (kg) => { const j = P.jump(Object.assign({}, c, { F: kg * g })); return j.v > 0 && (j.flight.apex >= 93 || j.flight.escaped || j.flight.relativistic); };
const th = (c) => P.threshold((F) => pred(c)(F / g), 10, 1e34);
const sizes = [0.1, 0.4, 2, 5, 10, 20, 50, 100, 500];
for (const mode of ['real', 'comic']) for (const H of sizes) {
  const row = [];
  for (const sid of Object.keys(S)) {
    const body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
    const f = th({ mode, body, surface: S[sid], groundHolds: false, anchor: 'friction' });
    const t = th({ mode, body, surface: S[sid], groundHolds: true, anchor: 'friction' });
    // also max apex over slider
    let best = 0; for (let lg = 1; lg <= 34; lg += 0.1) { const j = P.jump({ F: 10 ** lg * g, mode, body, surface: S[sid], groundHolds: false, anchor: 'friction' }); if (j.flight.apex > best) best = j.flight.apex; }
    row.push(`${sid}: gh0=${isFinite(f) ? f.toExponential(2) : 'NEVER'} gh1=${isFinite(t) ? t.toExponential(2) : 'NEVER'} maxApex(gh0)=${best.toFixed(0)}`);
  }
  console.log(mode, 'H=' + H, '\n  ' + row.join('\n  '));
}
