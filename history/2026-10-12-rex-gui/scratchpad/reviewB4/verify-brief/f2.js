const {P,D,surf,rex,ollie,ctx}=require('./h.js');
const K=P.K;
const car=D.objects.find(o=>o.id==='car');
const show=(label,c,r)=>{
  const tg=r.toGround; if(!tg){console.log(label,'no toGround');return;}
  const src=P.impulseSource(c.surface,tg.J,tg.T);
  const body=c.body, RB=P.qultFor?null:null;
  console.log(label,'v',r.v.toPrecision(4),'pushT',r.push.t.toExponential(3),'T',tg.T.toFixed(4),'J',tg.J.toPrecision(4),'supplied',tg.supplied&&tg.supplied.toExponential(3),'sinkRatioRaw',r.sinkRatioRaw&&r.sinkRatioRaw.toExponential(3),'ppv5 mm/s',(P.ppvAt(src,5)*1000).toPrecision(3),'plaster@5',P.plasterOver(src,5));
  return src;
};
const c=ctx(1e11); const r=P.throwObject(c,car,90); const src=show('car 90 concrete 1e11',c,r);
// bearing: what the engine uses
const body=c.body;
// qult: compute via sinkRatioRaw: Nfeet/(bear) => bear = Nfeet/sinkRatioRaw. Fload= pB/t + RB.
const Fload=r.push.pB/r.push.t + 0; 
console.log('Eobj',r.Eobj.toExponential(3),'pObj approx', (r.toGround.J+r.toGround.supplied).toExponential(4));
// derive bearing from surface
const qs=c.surface; console.log('surface keys', Object.keys(qs).join(','));
