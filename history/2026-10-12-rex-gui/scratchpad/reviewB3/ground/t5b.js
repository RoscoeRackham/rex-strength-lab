const { P, D, g, surf, obj, rex, ollie, M, ctxOf, sig } = require('./common.js');
for (const oid of ['bus','car']) for (const kg of [1e5, 1e6, 1e7]) {
  const c = ctxOf(kg*g, { ownRecoil: true, unbreakable: true, anchor: 'bolted' });
  const r = P.pull(c, obj(oid));
  // the same formula MOVES.pull.shake uses, applied to the bolted run
  const s = P.impulseSource(c.surface, P.vToMomentum(r.vEnd, obj(oid).m) + r.resist * r.t10m, r.t10m);
  console.log(oid, sig(kg), 'bolted: ppv5', sig(P.ppvAt(s,5)), 'plaster reach', sig(P.plasterReach(s)), 'rattle reach', sig(P.ppvReach(s, P.VIB.TH.rattle)));
}
