const { P, ctx, obj, g } = require('./common.js');
function heldBack(c, o, ang) {
  // best over sub-maximal strengths (Rex may push less hard)
  let best = { v: 0 };
  const top = Math.log10(c.F / g);
  for (let lg = 1; lg <= top + 1e-9; lg += 0.01) {
    const r = P.throwObject(Object.assign({}, c, { F: Math.pow(10, Math.min(lg, top)) * g }), o, ang);
    if (r.canMove && r.v > best.v) best = { v: r.v, range: r.flight.range, kg: Math.pow(10, lg) };
  }
  return best;
}
for (const [oid, ang, surface, anchor, mode, lgs] of [
  ['car', 45, 'concrete', 'friction', 'comic', [4.0, 4.1, 4.15, 4.2, 4.5, 4.958, 5.5, 6, 7]],
  ['tank', 45, 'concrete', 'friction', 'comic', [5.3, 5.5, 5.8, 6.0, 7]],
  ['car', 45, 'concrete', 'friction', 'real', [3.8, 4.0, 4.958, 6, 10]],
]) {
  console.log('==', oid, ang, surface, anchor, mode);
  for (const lg of lgs) {
    const c = ctx({ kg: Math.pow(10, lg), surface, anchor, mode });
    const r = P.throwObject(c, obj(oid), ang);
    const hb = heldBack(c, obj(oid), ang);
    console.log(`  lift 1e${lg}: v=${r.v.toFixed(3)} range=${r.flight ? r.flight.range.toFixed(2) : '-'} recoilV=${r.recoilV.toFixed(2)} R=${r.anchor.R.toExponential(3)} F=${r.F.toExponential(3)} | best sub-max: v=${hb.v.toFixed(3)} range=${(hb.range || 0).toFixed(2)} at lift ${hb.kg ? hb.kg.toExponential(2) : '-'}`);
  }
}
