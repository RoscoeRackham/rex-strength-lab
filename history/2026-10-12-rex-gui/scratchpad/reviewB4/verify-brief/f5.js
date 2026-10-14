const {P,D,surf,rex,ollie,ctx}=require('./h.js');
for (const id of ['car','baseball','piano','bowling','shotput']) {
  const o=D.objects.find(x=>x.id===id); if(!o){console.log('no',id);continue;}
  const r1=P.throwObject(ctx(1e5,{airAbsorb:1}),o,90), r0=P.throwObject(ctx(1e5,{airAbsorb:0}),o,90);
  const f=r1.flight, f0=r0.flight;
  console.log(id,'range100',f.range.toExponential(2),'range0',f0.range.toExponential(2),'chip?',!(f0.range>=0.95*f.range),'apex100',f.apex.toFixed(2),'apex0',f0.apex.toFixed(2),'apex drop %',(100*(1-f0.apex/f.apex)).toFixed(1));
}
// wrestle throw at 90 all-out
const cR=ctx(1e5), cO=Object.assign(ctx(1e5),{body:ollie()});
const tp=P.throwPartner(cR,cO,90), tp0=P.throwPartner(ctx(1e5,{airAbsorb:0}),Object.assign(ctx(1e5,{airAbsorb:0}),{body:ollie()}),90);
console.log('wrestle 90: range',tp.r.flight.range.toExponential(2),'range0',tp0.r.flight.range.toExponential(2),'changed?',Math.abs(tp0.r.flight.range-tp.r.flight.range)>0.02*tp.r.flight.range,'apex',tp.r.flight.apex.toFixed(2),'apex0',tp0.r.flight.apex.toFixed(2));
