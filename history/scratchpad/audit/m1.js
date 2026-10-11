const { P, D, g, surf, obj, V, C } = require('./h.js');
// throwObject range monotone in strength
let issues = 0;
for (const mode of ['comic', 'real']) for (const anchor of ['friction', 'bolted']) for (const gh of [false, true]) for (const o of D.objects.filter((x) => !x.noThrow)) for (const th of [0, 45]) {
  let prev = null, prevLg = null;
  for (let lg = 1; lg <= 34; lg += 0.1) {
    const c = C({ kg: Math.pow(10, lg), mode, anchor, gh });
    let r; try { r = P.throwObject(c, o, th); } catch (e) { console.log('THROW', mode, anchor, gh, o.id, th, lg, e.message); issues++; break; }
    const R = r.flight ? r.flight.range : 0;
    const v = r.v || 0;
    if (Number.isNaN(R) || Number.isNaN(v)) { console.log('NaN', mode, anchor, gh, o.id, th, lg.toFixed(1)); issues++; break; }
    if (prev && (v < prev.v * 0.98 - 1e-9)) { console.log('v drop', mode, anchor, 'gh' + gh, o.id, th, '10^' + prevLg.toFixed(1), prev.v.toPrecision(4), '-> 10^' + lg.toFixed(1), v.toPrecision(4), 'range', prev.R.toPrecision(4), R.toPrecision(4)); issues++; break; }
    if (prev && !r.flight?.escaped && !prev.esc && (R < prev.R * 0.98 - 1e-6) && v >= prev.v) { console.log('range drop', mode, anchor, 'gh' + gh, o.id, th, '10^' + prevLg.toFixed(1), prev.R.toPrecision(4), '-> 10^' + lg.toFixed(1), R.toPrecision(4), 'v', prev.v.toPrecision(4), v.toPrecision(4)); issues++; break; }
    prev = { v, R, esc: r.flight && r.flight.escaped }; prevLg = lg;
  }
}
console.log('issues', issues);
