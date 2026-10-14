const { P, D, surf, obj, rex, ollie, tons, ctx } = require('./lib.js');
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
for (const own of [false, true]) for (const lk of [4, 5, 6]) {
  const kg = Math.pow(10, lk);
  const cR = ctx({ body: rex(), surface: 'concrete', kg, extra: { ownRecoil: own } }), cO = ctx({ body: ollie(), surface: 'concrete', kg, extra: { anchor: 'bolted', ownRecoil: own } });
  const r = P.shove(cR, cO);
  const src = r.toGround ? P.impulseSource(cR.surface, r.toGround.J, r.toGround.T) : null;
  const Fpush = r.push && (r.push.xA + r.push.xB) > 0 ? r.push.work / (r.push.xA + r.push.xB) : 0;
  const boltJ = Fpush * (r.push ? r.push.t : 0);
  const bsrc = boltJ > 0 && isFinite(boltJ) ? P.impulseSource(cR.surface, boltJ, Math.max(P.limbPulse(cO.body), r.push.t)) : null;
  console.log('own', own, '1e' + lk, 'stalled', r.stalled, 'vA', fmt(r.vA), 'vB', fmt(r.vB), 'slideA', fmt(r.slideA), 'toGround', r.toGround ? fmt(r.toGround.J) + ' over ' + fmt(r.toGround.T) : '-', 'ppv5', fmt(P.ppvAt(src, 5) * 1e3),
    '| Ollie bolts take F t =', fmt(boltJ), 'ppv5', fmt(P.ppvAt(bsrc, 5) * 1e3), 'plaster', fmt(P.plasterReach(bsrc)));
}
