const { P, g, ctx, obj } = require('./lib.js');
for (const lg of [24, 26, 30, 34]) for (const ang of [0, 1]) {
  const c = ctx({ logKg: lg, mode: 'comic', surface: 'concrete' });
  const r = P.throwObject(c, obj('moon'), ang);
  console.log('lift 1e' + lg, 'angle', ang, '| F', r.F.toExponential(2), 'anchor', r.anchor.R.toExponential(2), r.anchor.limit, '| canMove', r.canMove, 'v', r.v.toExponential(3), 'recoilV', r.recoilV.toExponential(3), '| flight', r.flight.relativistic ? 'REL' : (r.flight.escaped ? 'escaped' : r.flight.range.toExponential(3)));
}
