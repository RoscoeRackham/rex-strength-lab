const { P, D, L, body, ctx } = require('./setup-fix1.js');
for (const [ra, ob, ub] of [[1e9, 1e8, true], [1e9, 1e8, false], [1e8, 1e9, true], [1e6, 1e5, true]]) {
  const A = ctx(ra, body('rex'), { unbreakable: ub }), B = ctx(ob, body('ollie'), { unbreakable: ub });
  const r = P.armWrestle(A, B), tb = P.RESTRAINT.takenBack('arm', r, { A, B, whoA: 'rex' });
  console.log(ra, ob, 'unbreakable', ub, r.outcome, r.winner, 'v', r.pin && r.pin.v.toFixed(0), 'crater(off-run)', P.armWrestle(Object.assign({}, A, { unbreakable: false }), Object.assign({}, B, { unbreakable: false })).crater.toFixed(2), '| rex', tb.by.rex.parts.footing, 'ollie', tb.by.ollie.parts.footing, L.glow(tb.E, D.energyRefs).text);
}
