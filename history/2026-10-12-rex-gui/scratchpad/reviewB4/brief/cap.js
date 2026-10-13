const {P,D,rex,surf,obj,ctx}=require('./h.js');
const g=P.K.g;
const qult=(s,B)=>{ /* not exported? */ };
for (const [sid, oid, ang, lg] of [['sand','car',45,6],['sand','car',90,6],['concrete','car',90,8],['concrete','bus',90,9],['concrete','car',45,10],['sand','baseball',90,8]]) {
  const c = ctx(Math.pow(10,lg), { surface: surf(sid) });
  const r = P.throwObject(c, obj(oid), ang);
  const tg = r.toGround;
  // the ground's bearing beyond his weight: from sinkRatioRaw: Nfeet/(qult*A); bearing = Nfeet/sinkRatioRaw
  const src = P.impulseSource(c.surface, tg.J, tg.T);
  console.log(sid, oid, ang+'deg', '1e'+lg, 'v', r.v.toPrecision(3), 'push.t', r.push.t.toExponential(2), 'T', tg.T.toExponential(2), 'J(ground)', tg.J.toExponential(3), 'supplied', (tg.supplied||0).toExponential(3), 'sinkRatioRaw', (r.sinkRatioRaw||0).toExponential(2), 'plaster reach', P.plasterReach(src).toPrecision(3));
}
