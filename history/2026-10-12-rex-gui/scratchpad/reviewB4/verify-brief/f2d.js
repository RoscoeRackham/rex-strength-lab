const {P,D,surf,rex,ollie,ctx}=require('./h.js');
const K=P.K;
const car=D.objects.find(o=>o.id==='car');
for (const kg of [1e5,3e5,1e6,1e7,1e8,1e9,1e10,1e11]) {
  const c=ctx(kg); const r=P.throwObject(c,car,90); const tg=r.toGround;
  const bear=P.qultFor(c.surface,c.body.footB)*2*c.body.footArea, W=c.body.m*K.g;
  const src=P.impulseSource(c.surface,tg.J,tg.T);
  const full=tg.J+(tg.supplied||0);
  const Jc=Math.min(full, Math.max(0,bear-W)*tg.T); const s2=P.impulseSource(c.surface,Jc,tg.T);
  console.log('dial kg',kg.toExponential(0),'v',r.v.toFixed(0),'push.t',r.push.t.toExponential(2),'over',(r.sinkRatioRaw||0).toFixed(2),'J hybrid',tg.J.toPrecision(3),'ppv5',(P.ppvAt(src,5)*1000).toPrecision(3),'plaster5',P.plasterOver(src,5),'| consistent J',Jc.toPrecision(3),'ppv5',(P.ppvAt(s2,5)*1000).toPrecision(3),'plaster5',P.plasterOver(s2,5));
}
