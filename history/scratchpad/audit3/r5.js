const { P, D, g, S, O, ctx } = require('./common.js');
const mode = process.argv[2] || 'real';
const H = Number(process.argv[3] || 2);
const step = Number(process.argv[4] || 0.05);
for (const sid of D.surfaces.map((s) => s.id)) {
  let prev = 0, prevLg = 0, maxDrop = 0, at = '';
  let best = { v: 0, lg: 0 };
  const lgs = []; for (let lg = 1.5; lg <= 34.001; lg += step) lgs.push(lg);
  lgs.push(Infinity);
  for (const lg of lgs) {
    const c = ctx({ mode, surface: sid, H, lg: isFinite(lg) ? lg : 1, inf: !isFinite(lg) });
    const j = P.jump(c);
    const h = j.relativistic ? Infinity : (j.flight.escaped ? Infinity : j.flight.apex);
    if (j.v > best.v) best = { v: j.v, lg };
    if (j.v < best.v * (1 - 1e-4)) { const d = 1 - j.v / best.v; if (d > maxDrop) { maxDrop = d; at = `lg ${lg.toFixed(2)} v ${j.v.toFixed(3)} (h ${isFinite(h)?h.toFixed(2):h}) vs best ${best.v.toFixed(3)} at lg ${best.lg.toFixed(2)} heldBack ${j.heldBack}`; } }
  }
  console.log(mode, 'H', H, sid.padEnd(10), maxDrop > 0 ? 'DROP ' + (100 * maxDrop).toFixed(2) + '% ' + at : 'monotone');
}
