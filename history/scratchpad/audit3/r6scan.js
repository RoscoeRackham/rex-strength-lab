const { P, D, g, S, O, ctx } = require('./common.js');
const mode = process.argv[2], sid = process.argv[3], step = Number(process.argv[4] || 0.05);
for (const anchor of ['friction', 'braced']) for (const [obj, ang] of [['car', 45], ['tank', 30], ['tank', 45], ['shot', 37], ['bus', 20], ['piano', 60]]) {
  let best = { v: 0, lg: 0 }, maxDrop = 0, at = '';
  const lgs = []; for (let lg = 1.5; lg <= 20.001; lg += step) lgs.push(lg); lgs.push(34); lgs.push(Infinity);
  for (const lg of lgs) {
    const c = ctx({ mode, surface: sid, anchor, lg: isFinite(lg) ? lg : 1, inf: !isFinite(lg) });
    const r = P.throwObject(c, O(obj), ang);
    const v = r.canMove ? r.v : 0;
    if (v > best.v) best = { v, lg };
    if (v < best.v * (1 - 1e-3)) { const d = 1 - v / best.v; if (d > maxDrop) { maxDrop = d; at = `lg ${lg.toFixed(2)} v ${v.toFixed(3)} range ${r.flight ? r.flight.range.toFixed(2) : '-'} vs best ${best.v.toFixed(3)} at lg ${best.lg.toFixed(2)}`; } }
  }
  console.log(mode, sid, anchor, obj, ang, maxDrop > 0 ? 'DROP ' + (100 * maxDrop).toFixed(1) + '% ' + at : 'monotone');
}
