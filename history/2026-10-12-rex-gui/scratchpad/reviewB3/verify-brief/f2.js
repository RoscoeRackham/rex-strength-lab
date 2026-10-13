const { P, D, rex, surf, ctx } = require('./common.js');
const bus = D.objects.find(o => o.id === 'bus');
console.log('bus', bus && bus.m, bus && bus.crr);
const M = P.RESTRAINT && P.RESTRAINT.MOVES;
console.log('RESTRAINT keys', Object.keys(P.RESTRAINT));
for (const anchor of ['friction', 'bolted']) {
  const c = ctx({ F: 1e7 * P.K.g, anchor });
  const r = P.pull(c, bus);
  const J = P.vToMomentum(r.vEnd, bus.m) + r.resist * r.t10m;
  const src = P.impulseSource(c.surface, J, r.t10m);
  console.log(`${anchor}: t10m=${r.t10m.toFixed(3)}s vEnd=${r.vEnd.toFixed(1)} ropeT=${r.ropeT} J=${J.toExponential(2)} ppv@5m=${(P.ppvAt(src,5)*1e3).toFixed(2)}mm/s ppv@2m=${(P.ppvAt(src,2)*1e3).toFixed(3)} plasterReach=${P.plasterReach(src).toFixed(1)}m`);
  if (M && M.pull) {
    const o = Object.assign({}, c, { near: 5, obj: bus });
    console.log('  MOVES.pull.shake ->', JSON.stringify(M.pull.shake(r, o)));
  }
}
