const A = require('./env.js'), B = require('./envfix4.js');
const fmt = (x) => Number(x).toPrecision(5);
let maxRel = 0, at = null;
for (const sf of ['sand', 'gravel', 'softclay', 'concrete', 'granite']) for (let lg = 2; lg <= 34; lg += 0.05) {
  const run = (E) => { const c = E.ctxOf(Math.pow(10, lg) * E.g, Object.assign({}, E.ON, { surface: E.surf(sf) })), r = E.P.stomp(c); return E.M.stomp.blow(r, Object.assign({ surface: c.surface, body: E.rex }, E.ON)); };
  const a = run(A), b = run(B);
  if (a.J !== b.J) console.log('J differs', sf, lg, a.J, b.J);
  if (a.whole != null && lg < 25) { const rel = Math.abs(b.whole / a.whole - 1); if (rel > maxRel) { maxRel = rel; at = sf + ' ' + lg.toFixed(2); } }
  if (sf === 'concrete' && lg > 26 && lg < 27.1) console.log(lg.toFixed(2), 'whole now', fmt(a.whole), 'patched', fmt(b.whole));
}
console.log('max relative change of whole below 10^25:', maxRel, at);
